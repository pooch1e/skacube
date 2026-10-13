# E1. Foundations: repo, tooling, CI

A public monorepo where every change is linted, type-checked and tested in CI. ADRs: [0003](../docs/adr/0003-public-repo-github-flow.md), [0007](../docs/adr/0007-monorepo.md), [0012](../docs/adr/0012-tooling.md), [0024](../docs/adr/0024-ci-pipeline.md), [0025](../docs/adr/0025-local-dev-compose.md).

## S1.1 Repo skeleton

As a reviewer, I can clone one repo and understand its layout from the README.

Acceptance:
- Public GitHub repo with `web/`, `api/`, `data/`, `docs/`
- Root README links the docs wiki and states the data shortcut ([ADR 0021](../docs/adr/0021-data-storage.md))
- `main` is protected

Tasks:
- [ ] T1.1.1 Create repo, push `docs/`, add licence and `.gitignore` (`data/raw/`) — S
- [ ] T1.1.2 Root README: what it is, how to run, links to docs and [production ingest](../docs/architecture/production-ingest.md) — S
- [ ] T1.1.3 Branch protection, issue templates (story, task, bug), PR template with checklist — S
- [ ] T1.1.4 Labels and a GitHub Project board for this backlog — S

## S1.2 API project setup

As a developer, I can run, lint, type-check and test the API with one command each.

Acceptance:
- `uv run flask --app skacube run` starts an app returning `200` on `/health`
- `ruff check`, `ruff format --check`, `mypy`, `pytest` all pass

Tasks:
- [ ] T1.2.1 `uv init`, Flask app factory, `/health` route — S
- [ ] T1.2.2 ruff, mypy (strict) and pytest config with one passing test — S

## S1.3 Web project setup

As a developer, I can run, lint, type-check, test and build the web app.

Acceptance:
- `pnpm dev` serves a placeholder page
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass

Tasks:
- [ ] T1.3.1 `create-next-app` (App Router, TypeScript strict, Tailwind, ESLint), pnpm — S
- [ ] T1.3.2 Prettier and Vitest config with one passing test — S

## S1.4 CI pipeline

As a developer, my PR can't merge unless the parts it touches pass.

Acceptance:
- Path-filtered `api` and `web` jobs run on PRs
- Required checks enforced on `main`

Tasks:
- [ ] T1.4.1 `api` workflow: ruff, mypy, pytest, with uv cache — S
- [ ] T1.4.2 `web` workflow: lint, typecheck, Vitest, build, with pnpm cache — S
- [ ] T1.4.3 Conventional Commit check on PR titles; release-notes config — S

## S1.5 Containers

As a reviewer, I can run the whole app with `docker compose up`.

Acceptance:
- Compose starts `api` and `web`; the web placeholder can call `/health` through the same origin

Tasks:
- [ ] T1.5.1 API Dockerfile (multi-stage, uv, non-root) — M
- [ ] T1.5.2 Web Dockerfile (Next standalone output) — M
- [ ] T1.5.3 `compose.yaml`; Next rewrites `/graphql` and `/data/*` to the API — S
