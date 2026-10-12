# 0025. Native dev, Docker Compose for the full stack

- Status: Accepted
- Date: 2026-10-12

## Options

1. **Native for daily work, Compose as the one-command run** (also used by CI e2e).
2. **Docker for everything**: consistent, slower feedback.
3. **No containers until deploy.**

## Decision

Option 1. `pnpm dev` and `uv run flask` for development with hot reload; `docker compose up` runs the whole app.

## Consequences

- One Dockerfile per service, exercised in CI before any deploy.
- The same images can go to a container host later ([ADR 0019](0019-local-first-then-cloud.md)).
