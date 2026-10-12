# 0027. Automated accessibility checks

- Status: Accepted
- Date: 2026-10-12

## Decision

- `@axe-core/playwright` runs in the end-to-end tests on every page and fails on serious or critical violations.
- Every release includes a manual keyboard-only pass.

## Consequences

- Accessibility regressions block merges.
- The WebGL canvas can't be checked by axe; its controls and readouts must carry the information in accessible form.
