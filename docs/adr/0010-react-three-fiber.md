# 0010. react-three-fiber for rendering

- Status: Accepted
- Date: 2026-10-12

## Context

The viewer needs GPU volume rendering inside a React app.

## Options

1. **react-three-fiber + drei**: three.js as React components.
2. **Plain three.js** behind a React wrapper.
3. **vtk.js**: built-in scientific volume rendering, harder to style.

## Decision

react-three-fiber and drei, with a custom raymarching shader over a `Data3DTexture`.

## Consequences

- Scene state lives in React alongside the rest of the UI.
- The shader is custom code to write and test; requires WebGL2.
