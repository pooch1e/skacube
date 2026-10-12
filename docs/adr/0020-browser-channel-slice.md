# 0020. Channel slice cut from the 3D texture first

- Status: Accepted
- Date: 2026-10-12

## Context

The 2D channel view could be cut from the 256³ texture already in the browser, or fetched at full 512 × 512 resolution from the API (about 245 MB of extra processed files).

## Options

1. **Browser slice of the texture**: 256 × 256, no extra data or endpoint, always matches the volume.
2. **Full-resolution slices from the API**: sharper, more storage and an endpoint.
3. **Option 1 now, option 2 if the slice looks too soft.**

## Decision

Option 3. Stage 1 cuts the slice from the texture in the browser.

## Consequences

- Stage 1 needs only one ~17 MB processed volume.
- Full-resolution slices are revisited by looking at the result, not by guessing.
