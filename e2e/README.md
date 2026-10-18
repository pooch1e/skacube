# Skacube end-to-end tests

Playwright and axe against the full stack on the synthetic 16³ cube ([E7](../backlog/e7-quality.md), [ADR 0022](../docs/adr/0022-testing-strategy.md), [ADR 0027](../docs/adr/0027-accessibility-checks.md)).

Tests run inside Microsoft's pinned Playwright image (`linux/amd64`), started by Compose next to the `api` and `web` services. Local runs and CI therefore use the same Chromium and the same software WebGL (SwiftShader), which keeps the render screenshot comparable.

```bash
# from the repo root; Docker must be running
docker compose -f compose.yaml -f compose.e2e.yaml run --rm --build e2e

# one file, or a grep
docker compose -f compose.yaml -f compose.e2e.yaml run --rm e2e tests/journey.spec.ts
docker compose -f compose.yaml -f compose.e2e.yaml run --rm e2e -g "theme"

# after an intended change to the 3D render, refresh the baseline and commit it
docker compose -f compose.yaml -f compose.e2e.yaml run --rm e2e --update-snapshots

docker compose -f compose.yaml -f compose.e2e.yaml down
```

On Apple Silicon the runner is emulated, so it is slower than on CI.

| File | Covers |
|---|---|
| `tests/journey.spec.ts` | Page and API up, both views render, slider moves slice and readouts, theme persists, reduced motion, no-WebGL2 fallback |
| `tests/render.spec.ts` | One screenshot of the 3D view at the default camera |
| `tests/a11y.spec.ts` | axe in Night and Day; serious or critical violations fail |
| `tests/fixtures.ts` | Fails any test that logs a console error, which is how a shader compile failure shows up |

Failures leave a trace and screenshots in `test-results/`; open a trace with `pnpm exec playwright show-trace <file>`.
