# /// script
# requires-python = ">=3.12"
# dependencies = ["astropy", "numpy"]
# ///
"""Turn the EoR 21 cm FITS cube into a small uint8 volume plus metadata (ADR 0028).

Run once with `uv run data/ingest.py <fits> [--out data/processed/eor-h21cm] [--size 256]`.

Pipeline: memory-map the cube, check it has three axes with FREQ third, block-average
down to size^3 using fractional-overlap weights (936 channels do not divide into 256),
then apply a symmetric asinh stretch around 0 K so that 0 K is exactly byte 128.
Averaging is done on raw kelvin before the stretch. Output is `volume.u8.gz` (x = RA
fastest, Dec flipped because FITS row 1 is the bottom) and `metadata.json`.
"""

import argparse
import gzip
import hashlib
import json
import sys
import time
from pathlib import Path

import numpy as np
from astropy.io import fits

HI_REST_MHZ = 1420.405751768
DATASET_INFO = {
    "id": "eor-h21cm",
    "title": "Epoch of Reionisation 21 cm brightness temperature (SKA SDC3a, truth)",
    "source_url": "https://www.skao.int/en/science-users/170/simulated-data-products/ska-low-eor",
    "citation": "Bonaldi et al. (2025), arXiv:2503.11740",
}
ZERO_BYTE = 128
CLIP_PERCENTILE = 99.9
SOFTENING_FRACTION = 0.05


def overlap_weights(n_in: int, n_out: int) -> np.ndarray:
    """Return an (n_out, n_in) matrix whose rows sum to 1 and weight each input cell by its fractional overlap with the output bin."""
    edges_out = np.linspace(0, n_in, n_out + 1)
    edges_in = np.arange(n_in + 1)
    overlap = np.minimum(edges_out[1:, None], edges_in[None, 1:]) - np.maximum(
        edges_out[:-1, None], edges_in[None, :-1]
    )
    return np.clip(overlap, 0, None) / (n_in / n_out)


def validate(header: fits.Header) -> tuple[int, int, int]:
    """Return (nfreq, ndec, nra), exiting with a clear message if the layout is not RA, Dec, FREQ."""
    if header.get("NAXIS") != 3:
        sys.exit(f"Expected a 3-axis cube, found NAXIS={header.get('NAXIS')}")
    if not str(header.get("CTYPE3", "")).upper().startswith("FREQ"):
        sys.exit(f"Expected FREQ as the third axis, found CTYPE3={header.get('CTYPE3')!r}")
    return header["NAXIS3"], header["NAXIS2"], header["NAXIS1"]


def block_average(data, target: tuple[int, int, int]) -> np.ndarray:
    """Average a (nfreq, ndec, nra) array to the target shape one output channel at a time, so only a few input planes are read at once."""
    nfreq, ndec, nra = data.shape
    w_freq = overlap_weights(nfreq, target[0])
    w_dec = overlap_weights(ndec, target[1])
    w_ra = overlap_weights(nra, target[2])
    out = np.empty(target, dtype=np.float32)
    for i, row in enumerate(w_freq):
        nz = np.flatnonzero(row)
        lo, hi = nz[0], nz[-1] + 1
        stack = np.asarray(data[lo:hi], dtype=np.float64)
        plane = np.tensordot(row[lo:hi], stack, axes=1)
        out[i] = w_dec @ plane @ w_ra.T
    return out


def stretch_limits(averaged: np.ndarray) -> tuple[float, float]:
    """Return (limit, softening) in kelvin: the symmetric clip and the asinh knee."""
    limit = float(np.percentile(np.abs(averaged), CLIP_PERCENTILE))
    if limit == 0.0:
        sys.exit("Cube is all zero after averaging; nothing to stretch")
    return limit, limit * SOFTENING_FRACTION


def to_bytes(averaged: np.ndarray, limit: float, softening: float) -> np.ndarray:
    """Clip to +-limit, asinh-stretch to [-1, 1] and quantise so 0 K is byte 128."""
    clipped = np.clip(averaged.astype(np.float64), -limit, limit)
    scaled = np.arcsinh(clipped / softening) / np.arcsinh(limit / softening)
    return np.rint(ZERO_BYTE + 127 * scaled).astype(np.uint8)


def orient(volume: np.ndarray) -> np.ndarray:
    """Flip Dec so the first row is the top of the sky; RA stays the fastest axis."""
    return np.ascontiguousarray(volume[:, ::-1, :])


def redshift(freq_mhz: float) -> float:
    return HI_REST_MHZ / freq_mhz - 1


def first_bin_centre(header: fits.Header, axis: int, factor: float) -> float:
    """World coordinate of the first output bin centre: FITS pixel 1 plus half a bin."""
    delta = header[f"CDELT{axis}"]
    return header[f"CRVAL{axis}"] + (1 - header[f"CRPIX{axis}"]) * delta + (factor - 1) / 2 * delta


def build_metadata(
    header: fits.Header,
    source_shape: tuple[int, int, int],
    target: tuple[int, int, int],
    limit: float,
    softening: float,
    raw_sha256: str,
    volume_sha256: str,
    info: dict[str, str],
) -> dict:
    nfreq, ndec, nra = source_shape
    factors = (nfreq / target[0], ndec / target[1], nra / target[2])
    freq_step_mhz = header["CDELT3"] / 1e6 * factors[0]
    first_hz = header["CRVAL3"] + (1 - header["CRPIX3"]) * header["CDELT3"]
    freq_start_mhz = first_hz / 1e6 + (factors[0] - 1) / 2 * header["CDELT3"] / 1e6
    freq_end_mhz = freq_start_mhz + freq_step_mhz * (target[0] - 1)
    ra_start_deg = first_bin_centre(header, 1, factors[2])
    dec_start_deg = first_bin_centre(header, 2, factors[1])
    return {
        **info,
        "header": {
            k: header[k]
            for k in header
            if k not in ("COMMENT", "HISTORY", "") and isinstance(header[k], (str, int, float, bool))
        },
        "axes": {
            "ra": {
                "centre_deg": header["CRVAL1"],
                "start_deg": ra_start_deg,
                "step_deg": header["CDELT1"] * factors[2],
            },
            "dec": {
                "centre_deg": header["CRVAL2"],
                "start_deg": dec_start_deg,
                "step_deg": header["CDELT2"] * factors[1],
            },
            "frequency": {"start_mhz": freq_start_mhz, "step_mhz": freq_step_mhz},
        },
        "redshift": {"start": redshift(freq_start_mhz), "end": redshift(freq_end_mhz)},
        "source_shape": {"freq": nfreq, "dec": ndec, "ra": nra},
        "output_shape": {"freq": target[0], "dec": target[1], "ra": target[2]},
        "stretch": {"limit_k": limit, "softening_k": softening, "zero_byte": ZERO_BYTE},
        "raw_sha256": raw_sha256,
        "volume_sha256": volume_sha256,
    }


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(1 << 24):
            digest.update(chunk)
    return digest.hexdigest()


def ingest(
    fits_path: Path,
    out_dir: Path,
    size: int = 256,
    target: tuple[int, int, int] | None = None,
    info: dict[str, str] = DATASET_INFO,
) -> dict:
    started = time.perf_counter()
    target = target or (size, size, size)
    raw_sha256 = sha256_file(fits_path)
    with fits.open(fits_path, memmap=True) as hdul:
        header = hdul[0].header
        source_shape = validate(header)
        averaged = block_average(hdul[0].data, target)
    if np.isnan(averaged).any():
        sys.exit("NaNs present after averaging; decide how to mask them before ingesting")
    limit, softening = stretch_limits(averaged)
    volume = orient(to_bytes(averaged, limit, softening))

    out_dir.mkdir(parents=True, exist_ok=True)
    volume_path = out_dir / "volume.u8.gz"
    raw_bytes = volume.tobytes()
    with volume_path.open("wb") as f, gzip.GzipFile(fileobj=f, mode="wb", mtime=0) as gz:
        gz.write(raw_bytes)
    metadata = build_metadata(
        header,
        source_shape,
        target,
        limit,
        softening,
        raw_sha256,
        hashlib.sha256(raw_bytes).hexdigest(),
        info,
    )
    metadata_path = out_dir / "metadata.json"
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n")

    print(f"raw sha256:     {raw_sha256}")
    print(f"volume sha256:  {metadata['volume_sha256']}")
    print(f"volume.u8:      {len(raw_bytes):,} bytes")
    print(f"volume.u8.gz:   {volume_path.stat().st_size:,} bytes")
    print(f"metadata.json:  {metadata_path.stat().st_size:,} bytes")
    print(f"elapsed:        {time.perf_counter() - started:.1f} s")
    return metadata


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("fits", type=Path)
    parser.add_argument("--out", type=Path, default=Path(__file__).parent / "processed" / DATASET_INFO["id"])
    parser.add_argument("--size", type=int, default=256)
    args = parser.parse_args()
    ingest(args.fits, args.out, args.size)


if __name__ == "__main__":
    main()
