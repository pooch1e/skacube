# E9. Viewer enhancements

Later work from [ADR 0014](../docs/adr/0014-viewer-modes.md), [ADR 0016](../docs/adr/0016-texture-resolution.md) and [ADR 0020](../docs/adr/0020-browser-channel-slice.md). Each story is refined before it starts.

## S9.1 Spectrum at a pixel

As a visitor, I click a point and see brightness temperature against frequency.

- [ ] T9.1.1 Ingest: float16 reduced cube for real-kelvin values — M
- [ ] T9.1.2 GraphQL `spectrum(datasetId, x, y)` — S
- [ ] T9.1.3 Chart panel with picking in 2D and 3D — M

## S9.2 Reionisation history

As a visitor, I see how the ionised fraction changes with redshift.

- [ ] T9.2.1 Ingest: ionised fraction per channel — S
- [ ] T9.2.2 GraphQL field and chart linked to the slider — M

## S9.3 Progressive loading

As a visitor on a slow connection, I see a coarse volume quickly.

- [ ] T9.3.1 Ingest a 128³ preview; load it first, swap to 256³ — M

## S9.4 Full-resolution slices (if needed)

- [ ] T9.4.1 Assess the browser slice's sharpness; decide via ADR — S
- [ ] T9.4.2 If yes: ingest 512² slices and a slice route — M
