# 0015. Diverging colormap for signed data

- Status: Accepted
- Date: 2026-10-12

## Context

Brightness temperature is negative (absorption) at high redshift, positive (emission) later, and exactly 0 K once hydrogen is ionised. A one-direction colormap hides the sign change.

## Options

1. **Diverging, centred on 0 K**: cool for absorption, dark midpoint, warm for emission.
2. **Existing sequential colormap**: simpler, hides the physics.

## Decision

A diverging colormap centred on 0 K, with symmetric clip limits and an asinh stretch (which handles negative values). In 3D, opacity follows the absolute value, so ionised regions render as transparent holes.

## Consequences

- The design system gains a `cmap-div-*` scale alongside the sequential `cmap-*`.
- The colormap legend shows 0 K in the middle and units of kelvin.
