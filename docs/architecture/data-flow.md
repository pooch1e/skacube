# Data flow

How the [dataset](../background/dataset.md) becomes pixels on screen.

```
SKAO download (981 MB FITS)
        │  data/ingest.py (once)           ADR 0028
        ▼
processed files ── volume 256³ uint8       ADR 0016
        │          metadata JSON
        │          (more: open)
        ▼
Flask API ── /graphql   metadata, queries  ADR 0008
        │    /data/volume/<id> binary (ADR 0026)
        ▼
Browser ── TanStack Query                  ADR 0009
        └─ Data3DTexture → raymarch shader ADR 0010
```

## Steps

1. **Ingest** runs once as a standalone script ([ADR 0028](../adr/0028-standalone-ingest-script.md)): read the cube with astropy, block-average to 256³, apply a symmetric asinh stretch around 0 K ([ADR 0015](../adr/0015-diverging-colormap.md)), quantise to 8-bit, write the header and axis metadata as JSON.
2. **API** serves only processed files. It never opens the raw FITS.
3. **Browser** fetches metadata over GraphQL and the volume as raw bytes, then renders the [viewer modes](../adr/0014-viewer-modes.md).

## Limitation

Ingest is manual. A real system would run it as a pipeline step whenever new data arrives: see [production ingest](production-ingest.md).

## Open

See [open questions](../open-questions.md).
