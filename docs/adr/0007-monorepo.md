# 0007. Monorepo

- Status: Accepted
- Date: 2026-10-12

## Context

There are two runtimes (Next.js and Flask), shared docs, and one dataset.

## Options

1. **Monorepo**: `web/`, `api/`, `docs/`, `data/` in one repo.
2. **Separate repos** for frontend and backend.

## Decision

One repository.

## Consequences

- One link for the panel; ADRs live beside the code they describe.
- A single PR can change the API schema and its client together.
- CI must run only the jobs whose folders changed.
