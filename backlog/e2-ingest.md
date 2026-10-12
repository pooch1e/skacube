# E2. Data ingest

Turn the 981 MB cube into a small, committed volume plus metadata. ADRs: [0013](../docs/adr/0013-one-time-ingest.md), [0015](../docs/adr/0015-diverging-colormap.md), [0016](../docs/adr/0016-texture-resolution.md), [0021](../docs/adr/0021-data-storage.md).

## S2.1 Synthetic test cube

As a developer, I can test ingest and the whole app without the real file.

Acceptance:
- A generator makes a small cube (e.g. 16 × 16 × 32) with the real file's header shape and known signed values
- Used by API tests, CI and e2e

Tasks:
- [ ] T2.1.1 `make_synthetic_cube()`: FREQ axis, `K` unit, values crossing 0 — S
- [ ] T2.1.2 Pytest fixture and a committed tiny processed output for e2e — S

## S2.2 Ingest module

As a developer, I can turn any compatible FITS cube into processed files with a tested, pure function.

Acceptance:
- Reads the FITS cube with astropy using memory mapping; validates 3 axes, `FREQ` third axis
- Block-averages to 256³ (not strided)
- Symmetric asinh stretch around 0 K; 0 K maps to byte 128
- Writes `volume.u8` (x fastest), gzip-compressed, plus `metadata.json` (header cards, axes, frequency range, stretch limits, checksum)
- Tests on the synthetic cube prove each step

Tasks:
- [ ] T2.2.1 Read and validate; clear errors for unsupported files — M
- [ ] T2.2.2 Block-average resampler, memory-bounded (channel blocks) — M
- [ ] T2.2.3 Symmetric clip and asinh stretch, quantise to uint8 — S
- [ ] T2.2.4 Writers: volume bytes + metadata JSON; schema documented in `docs/` — S

## S2.3 Ingest command

As a developer, I run `flask ingest data/raw/EoR_H21cm_truth.fits` once and get committed output.

Acceptance:
- Checks the SHA-256 against the [recorded value](../docs/background/dataset.md#source)
- Writes to `data/processed/`; prints sizes and time taken

Tasks:
- [ ] T2.3.1 Flask CLI command wrapping the module — S
- [ ] T2.3.2 Run on the real file, commit output, record size in docs — S

## S2.4 Data README

As a reviewer, I know where the data came from and why it's processed locally.

Tasks:
- [ ] T2.4.1 `data/README.md`: source link, citation, checksum, how to re-ingest, the demo-shortcut note — S
