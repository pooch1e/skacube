# SDLC

How Skacube is built, tested and shipped.

## Workflow

- Public GitHub repo; issue → branch → PR → CI → merge ([0003](adr/0003-public-repo-github-flow.md))
- Conventional Commits; a tag and release notes per stage ([0024](adr/0024-ci-pipeline.md))
- Staged delivery, each stage deployable ([0001](adr/0001-staged-delivery.md)). Work is planned as GitHub issues: epics → stories → tasks, drafted in [backlog/](../backlog/README.md).

## Repo

```
skacube/
├── web/    Next.js app
├── e2e/    Playwright and axe, run in Docker against the stack
├── api/    Flask API and ingest
├── data/   raw/ (git-ignored), processed/ (committed)
├── docs/   this wiki
└── backlog/ epics, stories and tasks
```

See [0007](adr/0007-monorepo.md) and [0021](adr/0021-data-storage.md).

## Local development

Native with hot reload; `docker compose up` for the full stack ([0025](adr/0025-local-dev-compose.md)).

## Testing

Synthetic cube at every layer; RTL only for components with logic; one Playwright screenshot for the shader ([0022](adr/0022-testing-strategy.md)); axe accessibility checks in e2e ([0027](adr/0027-accessibility-checks.md)). End-to-end tests run in the pinned Playwright image via `compose.e2e.yaml`, so local runs and CI render identically ([e2e/README.md](../e2e/README.md)). Before a release, work through the [release checklist](release-checklist.md).

## CI

Path-filtered `api`, `web` and `contract` jobs; `e2e` on PRs to `main` ([0024](adr/0024-ci-pipeline.md)).

## Deployment

Local first; cloud in a later stage ([0019](adr/0019-local-first-then-cloud.md)).

## Open

See [open questions](open-questions.md).
