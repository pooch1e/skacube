# E5. Viewer

The 3D lightcone and its linked channel slice. ADRs: [0010](../docs/adr/0010-react-three-fiber.md), [0014](../docs/adr/0014-viewer-modes.md), [0015](../docs/adr/0015-diverging-colormap.md), [0020](../docs/adr/0020-browser-channel-slice.md).

## S5.1 Volume render

As a visitor, I can rotate and zoom a 3D render of the lightcone.

Acceptance:
- `Data3DTexture` from the volume bytes; raymarching shader in react-three-fiber
- Diverging colormap; opacity follows |value| so ionised regions are transparent
- Box scaled to the cube's real proportions; orbit and zoom controls
- Stays above 30 fps on a mid-range laptop

Tasks:
- [ ] T5.1.1 Canvas, camera, OrbitControls, loading state — S (code complete, needs browser check)
- [ ] T5.1.2 Raymarch shader (front-to-back, early exit) — L (code complete, needs browser check)
- [ ] T5.1.3 Colormap as a 1D texture from tokens — S (code complete, needs browser check)
- [ ] T5.1.4 Opacity and threshold uniforms — S (code complete, needs browser check)

## S5.2 Linked channel slice

As a visitor, I can step through frequency and see one slice in 2D, with its position shown in the 3D view.

Acceptance:
- Slider over the volume's 256 channels (each averages about 3.7 of the 936 source channels), showing frequency (MHz) and redshift
- 2D slice cut from the texture in the browser
- A plane in the volume tracks the slider

Tasks:
- [x] T5.2.1 Slice extraction from the volume bytes (pure function + tests) — S
- [ ] T5.2.2 2D slice canvas with the colormap — M (code complete, needs browser check)
- [ ] T5.2.3 Slice plane in the 3D scene — S (code complete, needs browser check)
- [x] T5.2.4 Frequency ↔ redshift utility + tests — S

## S5.3 Controls and readouts

As a visitor, I can adjust the render and read real values.

Acceptance:
- Controls: opacity, threshold, auto-rotate, reset view
- Readouts: frequency, redshift, channel; colormap legend in kelvin centred on 0
- All controls keyboard-operable

Tasks:
- [ ] T5.3.1 Control panel from primitives — M (code complete, needs browser check)
- [x] T5.3.2 Readouts and legend — S

## S5.4 Unsupported browsers

As a visitor without WebGL2, I still get something useful.

- [ ] T5.4.1 Decide fallback behaviour ([ADR 0029](../docs/adr/0029-webgl2-fallback.md), proposed, awaiting acceptance) — S
- [ ] T5.4.2 Implement it — S (code complete, needs browser check)

## S5.5 Reduced motion

As a visitor who prefers reduced motion, the volume doesn't auto-rotate.

- [ ] T5.5.1 Respect `prefers-reduced-motion` — S (code complete, needs browser check)
