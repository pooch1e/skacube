# 0013. Ingest once, serve the processed files

- Status: Superseded by [0028](0028-standalone-ingest-script.md)
- Date: 2026-10-12

## Context

The raw cube is 981 MB. Processing it at every API start means reading 1 GB and slow boots, and a deploy that must carry the raw file.

## Options

1. **Offline, once**: an ingest command writes reduced files; the API only reads those.
2. **At every startup**: simple, slow, needs the raw file wherever the API runs.
3. **At startup, cached by checksum**: flexible, more code.

## Decision

Run ingest once (`flask ingest`). The API serves only the processed files and never opens the raw FITS.

## Consequences

- Fast, predictable API startup; the deployed API never needs the 1 GB file.
- New or updated datasets need a manual re-ingest. The root README states this: a real system would run ingest as a pipeline step triggered by new data.
- The ingest code is tested on its own against a small synthetic cube.
