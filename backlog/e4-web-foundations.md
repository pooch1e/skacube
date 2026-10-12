# E4. Web foundations

Design tokens, primitives and typed data fetching, before any viewer work. ADRs: [0009](../docs/adr/0009-tanstack-query.md), [0011](../docs/adr/0011-app-router-client-viewer.md), [0018](../docs/adr/0018-graphql-codegen.md), [0023](../docs/adr/0023-shadcn-tailwind.md).

## S4.1 Design tokens in code

As a developer, I style everything from Skacube tokens, in Night and Day.

Acceptance:
- Tokens from the [design system](../docs/design/README.md) as CSS variables; Night default, Day via `prefers-color-scheme` and a toggle
- Tailwind theme reads the variables; shadcn theme variables map to them
- Diverging colormap tokens `cmap-div-*` added here and to the design system artifact

Tasks:
- [ ] T4.1.1 `tokens.css` and Tailwind theme mapping — M
- [ ] T4.1.2 Fonts via `next/font` (Big Shoulders Display, Hanken Grotesk, Martian Mono) — S
- [ ] T4.1.3 Design the diverging colormap (perceptually even, dark midpoint) and add tokens — M
- [ ] T4.1.4 Theme toggle, remembered per visitor — S

## S4.2 Primitives

As a developer, I build UI from accessible, restyled primitives.

Tasks:
- [ ] T4.2.1 `shadcn init`; add Button, Slider, Toggle Group, Tooltip — S
- [ ] T4.2.2 Restyle to the design system (square panels, 2px controls, focus ring) — M
- [ ] T4.2.3 Skacube components: Panel, Readout, ColormapLegend, FitsHeader — M

## S4.3 Typed data fetching

As a developer, I call the API with types generated from its schema.

Acceptance:
- `graphqlRequest` wrapper + TanStack Query provider
- Codegen (`typed-document-node`) from `api/schema.graphql`
- `useDataset(id)` and `useVolume(id)` hooks; volume returns a `Uint8Array`

Tasks:
- [ ] T4.3.1 Codegen config and script — S
- [ ] T4.3.2 Query client, wrapper, hooks, with loading and error states — M
- [ ] T4.3.3 Vitest tests for hooks against mocked responses — S
