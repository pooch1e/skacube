# Data

The viewer renders a simulated 21 cm Epoch of Reionisation cube from SKAO's Science Data Challenge 3a. See [dataset background](../docs/background/dataset.md) for what it shows.

- **Source:** https://www.skao.int/en/science-users/170/simulated-data-products/ska-low-eor (`EoR_H21cm_truth.fits`, 981 MB, direct download)
- **Citation:** Bonaldi et al. (2025), [arXiv:2503.11740](https://arxiv.org/abs/2503.11740). No licence is stated ([ADR 0017](../docs/adr/0017-dataset-provenance.md))
- **Raw SHA-256:** `8d41d89f934b5be9d190b0bd651daecb239b4f4b8e0815ae1a40c5f6d18d5b60`

## Layout

| Path | What |
|---|---|
| `ingest.py` | One-off script: FITS cube to `processed/` |
| `processed/<id>/` | `volume.u8.gz` and `metadata.json` from the real cube, committed once ([ADR 0021](../docs/adr/0021-data-storage.md)) |
| `fixtures/synthetic/` | Tiny output from a synthetic cube, for API tests and e2e |
| `test_ingest.py` | Tests for the ingest maths; also builds the synthetic cube |

The raw FITS file is not committed. Keep it in `data/raw/` (git-ignored) or anywhere else.

## Re-running

```bash
uv run data/ingest.py path/to/EoR_H21cm_truth.fits   # writes data/processed/eor-h21cm/
uv run data/test_ingest.py                            # tests
uv run data/test_ingest.py --fixture                  # regenerate data/fixtures/synthetic/
```

Dependencies (`astropy`, `numpy`) are declared inline in the script ([ADR 0028](../docs/adr/0028-standalone-ingest-script.md)). The script prints the raw file's SHA-256; compare it with the value above. Re-ingesting the real cube adds another ~10 MB to git history, so only do it when the processing changes.

## What the script does

1. Memory-maps the cube and checks it has three axes with `FREQ` third.
2. Averages 512 × 512 × 936 down to 256³ with fractional-overlap weights (936 channels do not divide evenly into 256), on raw kelvin.
3. Clips at the 99.9th percentile of |T|, applies a symmetric asinh stretch so 0 K is exactly byte 128, and quantises to uint8 ([ADR 0015](../docs/adr/0015-diverging-colormap.md), [ADR 0016](../docs/adr/0016-texture-resolution.md)).
4. Writes `volume.u8.gz` (x, i.e. RA, fastest; Dec flipped because FITS row 1 is the bottom) and `metadata.json`.

## Demo shortcut

Ingesting once on a laptop and committing the result is a demo shortcut. A production system would keep the raw cube in object storage, run ingest as a batch job and serve the volume in chunks. See [production ingest](../docs/architecture/production-ingest.md).
