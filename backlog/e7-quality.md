# E7. End-to-end quality

Whole-app tests that run in CI against the synthetic cube. ADRs: [0022](../docs/adr/0022-testing-strategy.md), [0027](../docs/adr/0027-accessibility-checks.md).

## S7.1 End-to-end tests

As a developer, I know the app works end to end before merging.

Acceptance:
- `e2e` job on PRs to `main`: Compose up with synthetic data, Playwright runs
- Covers: page loads, canvas renders, slider changes the slice and readouts, theme toggle

Tasks:
- [ ] T7.1.1 Playwright setup against Compose — M
- [ ] T7.1.2 Core journey tests — M
- [ ] T7.1.3 `e2e` workflow with artifacts (traces, screenshots) on failure — S

## S7.2 Render regression

As a developer, I find out when a shader change alters the render.

- [ ] T7.2.1 One screenshot comparison with software WebGL (SwiftShader), fixed camera — M

## S7.3 Accessibility

As a keyboard or screen-reader user, I can use every control.

Acceptance:
- axe runs on every page in e2e; serious or critical violations fail CI
- Manual keyboard-only pass recorded in each release's notes

Tasks:
- [ ] T7.3.1 `@axe-core/playwright` checks — S
- [ ] T7.3.2 Release checklist item for the manual pass — S
