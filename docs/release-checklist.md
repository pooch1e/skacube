# Release checklist

Run before tagging a stage (`v0.1.0` = stage 1, [ADR 0024](adr/0024-ci-pipeline.md)). Record the results in the release notes.

## Automated (must be green on `main`)

- [ ] `api`, `web`, `contract` and `e2e` workflows pass
- [ ] Render baseline unchanged, or refreshed on purpose in a reviewed PR

## Manual keyboard-only pass ([ADR 0027](adr/0027-accessibility-checks.md))

With the mouse unplugged or untouched, in Night and Day:

- [ ] Tab reaches every control in a sensible order, and the focus ring is always visible
- [ ] Channel slider: arrow keys step one channel, Page Up/Down step ten, Home/End reach the ends
- [ ] Opacity and threshold sliders work with the same keys
- [ ] Auto-rotate toggles with Space or Enter; Reset view works with Enter
- [ ] The theme toggle switches with the arrow keys
- [ ] A screen reader announces the channel slider's value as channel, MHz and redshift

## Visual

- [ ] The 3D view shows structure (not a solid wall or an empty box) on the real dataset
- [ ] The 2D slice and the 3D slice plane agree as the slider moves
- [ ] Frame rate above 30 fps while auto-rotating on a mid-range laptop (DevTools → Rendering → frame rendering stats)
