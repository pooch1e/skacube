# 0012. Tooling

- Status: Accepted
- Date: 2026-10-12

## Decision

| Concern | Python (`api/`) | Web (`web/`) |
|---|---|---|
| Packages | uv | pnpm |
| Lint, format | ruff | ESLint, Prettier |
| Types | mypy | TypeScript (strict) |
| Unit tests | pytest | Vitest, React Testing Library |
| End-to-end | — | Playwright |

## Alternatives considered

pip or Poetry; npm; Biome in place of ESLint and Prettier.

## Consequences

- Current, widely used tools on both sides; `uv` and `pnpm` behave alike.
- CI runs the same commands developers run locally.
