# 0016. 3D texture at 256³, block-averaged

- Status: Accepted
- Date: 2026-10-12

## Context

The full cube is 245 million values; too many for a browser download or a WebGL texture.

## Options

1. **256³ block-averaged, 8-bit**: about 17 MB, smaller compressed.
2. **128³ first, then 256³**: faster first view, more code.
3. **512 × 512 × 234**: sharper, about 61 MB.

## Decision

256 × 256 × 256, made by averaging blocks (not skipping values, which aliases), quantised to 8-bit with the stretch from [ADR 0015](0015-diverging-colormap.md), served compressed.

## Consequences

- One download of roughly 17 MB before the volume appears. Acceptable for a portfolio demo; progressive loading (option 2) is a later polish item.
