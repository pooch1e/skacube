# 0006. Scope: the viewer only

- Status: Accepted
- Date: 2026-10-12

## Context

The SKA-Low role builds monitoring and control UIs. A mocked station-status panel with live states was considered alongside the FITS viewer.

## Options

1. **Viewer only**: one thing, polished.
2. **Viewer + mocked station status** via GraphQL subscriptions.
3. **Option 2 + mocked control actions** via mutations.

## Decision

Viewer only.

## Consequences

- All effort goes into the viewer, the splash page and engineering quality.
- The device-state tokens and StateChip component in the design system stay unused for now.
- Monitoring and control can be added later under a new ADR.
