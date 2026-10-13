# 0023. shadcn/ui primitives, styled with Skacube tokens

- Status: Accepted
- Date: 2026-10-12

## Context

The viewer needs accessible primitives: sliders, toggles, tabs, tooltips, dialogs. Building them by hand is slow and easy to get wrong.

## Options

1. **shadcn/ui**: Radix-based, copied into the repo, fully restylable. Requires Tailwind.
2. **Hand-built components**: full control, more work, more accessibility risk.
3. **A full component library (MUI, Mantine)**: fast, harder to make look distinctive.

## Decision

shadcn/ui on Tailwind CSS. Its theme variables map to the [Skacube tokens](../design/README.md), so both themes come from one source.

## Consequences

- Accessibility (keyboard, ARIA) comes from Radix rather than custom code; fewer component tests needed ([ADR 0022](0022-testing-strategy.md)).
- Tailwind becomes a dependency. Tokens stay as CSS variables; Tailwind reads them.
