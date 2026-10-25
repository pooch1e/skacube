# Design system

The full, browsable system is the Skacube design system artifact: https://claude.ai/artifact/QtVJAN6HPdFzh26941Mwi4 (private until shared). This page summarises it.

## Principles

- **Data first.** The viewer is the hero. Interface colour recedes; the data colormap carries the strong colour.
- **Real units.** MHz, km/s, Jy/beam, RA/Dec. No unlabelled numbers.
- **State is words plus colour.** Device states always show their name.
- **One accent.** Light sky blue marks the primary action, selection and the viewer cursor.

## Themes

**Night** (default, deep indigo) and **Day** (cream and white). They swap token values only.

## Tokens

| Token       | Night     | Day       | Use                                |
| ----------- | --------- | --------- | ---------------------------------- |
| `ground`    | `#08071c` | `#fbf8f1` | Page background                    |
| `surface`   | `#100e2b` | `#ffffff` | Panels, viewer frame               |
| `line`      | `#2e2a5e` | `#e6e0d2` | Dividers, panel borders            |
| `ink`       | `#eeedf8` | `#14122b` | Text, links, focus ring            |
| `ink-muted` | `#a6a3cc` | `#5d5a72` | Secondary text, control borders    |
| `accent`    | `#a8d8ff` | `#bfe3ff` | Primary fill, selection, crosshair |
| `on-accent` | `#08071c` | `#14122b` | Text on accent                     |

Plus a six-stop sequential data colormap (`cmap-0` to `cmap-5`), a seven-stop diverging colormap for signed data (`cmap-div-0` to `cmap-div-6`: pale blue through a dark indigo 0 K midpoint to pale peach, with equal OKLab lightness either side; [ADR 0015](../adr/0015-diverging-colormap.md)), and two shadows (`shadow-elevation`, `shadow-md`; `none` in Night).

## Type

One typeface throughout: **Departure Mono**, a pixel monospace with a single Regular weight, for a retro text-editor look. Headlines, running copy and data readouts all use it. Because there is no bold, every type token uses weight 400 and hierarchy comes from size, case and letter-spacing.

## Shape and space

- 4px spacing scale, `space-1` to `space-20`
- Square panels (`radius-0`), 2px controls (`radius-sm`), pill chips (`radius-pill`)

## Components

Button, Readout, FitsHeader, Colormap, Panel.

## In code

Tokens live in [`web/app/tokens.css`](../../web/app/tokens.css) as `--sk-*` variables, with Night on `:root` and Day on `[data-theme="day"]`. [`globals.css`](../../web/app/globals.css) maps them into the Tailwind theme (`bg-ground`, `text-ink-muted`, `font-display`, `text-readout`, …) and onto shadcn's variables. Skacube `accent` is shadcn `primary`, and shadcn's own `accent` is a hover fill.
