# 0029. Without WebGL2, keep the 2D slice

- Status: Proposed
- Date: 2026-10-17

## Context

The volume shader samples a `Data3DTexture`, which needs WebGL2 ([ADR 0010](0010-react-three-fiber.md)). Nearly every current browser has it, but it can be missing or disabled: old hardware, blocklisted GPU drivers, some locked-down corporate machines, or hardware acceleration turned off.

The 2D channel slice is cut from the same bytes in JavaScript and drawn on a plain 2D canvas ([ADR 0020](0020-browser-channel-slice.md)), so it needs no WebGL at all.

## Options

1. **Message only**: replace the viewer with "WebGL2 required". Simple, but the visitor sees no data.
2. **Keep the 2D slice and readouts**: drop the 3D panel and its render controls, keep the channel slider, slice, readouts and legend, and say in words why the 3D view is missing.
3. **A WebGL1 fallback**: stack 2D textures into an atlas and raymarch that. Real work for a rare case.
4. **A pre-rendered image or video of the volume**: shows the 3D look, but adds an asset to produce and keep in sync.

## Decision

Option 2. The viewer checks for WebGL2 once on load. Without it, the 3D panel shows a short explanation and everything that works in 2D stays.

## Consequences

- No extra assets or code paths beyond one check and one message.
- The page still shows real data and real units without WebGL2.
- e2e can exercise this path by disabling WebGL2 in a test.
