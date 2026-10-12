# 0024. CI pipeline and commit convention

- Status: Accepted
- Date: 2026-10-12

## Decision

GitHub Actions:

| Job | Runs when | Steps |
|---|---|---|
| `api` | `api/` changes | ruff, mypy, pytest |
| `web` | `web/` changes | ESLint, typecheck, Vitest, build |
| `contract` | either changes | export schema, codegen, fail on diff |
| `e2e` | PRs to `main` | Docker Compose up, Playwright |

- Branch protection on `main` requires all checks.
- Conventional Commits (`feat:`, `fix:`, `docs:`).
- Each stage ends with a tag (`v0.1.0` = stage 1) and generated release notes.

## Consequences

- CI runs the same commands as local development ([ADR 0012](0012-tooling.md)).
- Release notes come from commit history.
