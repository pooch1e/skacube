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

| Token | Night | Day | Use |
|---|---|---|---|
| `ground` | `#08071c` | `#fbf8f1` | Page background |
| `surface` | `#100e2b` | `#ffffff` | Panels, viewer frame |
| `line` | `#2e2a5e` | `#e6e0d2` | Dividers, panel borders |
| `ink` | `#eeedf8` | `#14122b` | Text, links, focus ring |
| `ink-muted` | `#a6a3cc` | `#5d5a72` | Secondary text, control borders |
| `accent` | `#a8d8ff` | `#bfe3ff` | Primary fill, selection, crosshair |
| `on-accent` | `#08071c` | `#14122b` | Text on accent |

Plus device states (`state-on`, `state-standby`, `state-moving`, `state-alarm`, `state-fault`, `state-neutral`), a six-stop sequential data colormap (`cmap-0` to `cmap-5`), a diverging colormap for signed data (`cmap-div-*`, to be added: [ADR 0015](../adr/0015-diverging-colormap.md)), and two shadows (`shadow-elevation`, `shadow-md`; `none` in Night).

## Type

- **Display**: Big Shoulders Display, for headlines and big figures
- **Text**: Hanken Grotesk, for running copy
- **Data**: Martian Mono, for header cards, coordinates and readouts

## Shape and space

- 4px spacing scale, `space-1` to `space-20`
- Square panels (`radius-0`), 2px controls (`radius-sm`), pill chips (`radius-pill`)

## Components

Button, StateChip, Readout, FitsHeader, Colormap, Panel.
