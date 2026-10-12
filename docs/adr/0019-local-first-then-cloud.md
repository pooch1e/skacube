# 0019. Local first, cloud later

- Status: Accepted
- Date: 2026-10-12

## Context

Deploying before the data pipeline and viewer work adds cost without benefit. The panel will eventually need a live link.

## Decision

Stage 1 runs locally only. A later stage deploys web and API to a platform that hosts both easily (Google Cloud, Vercel or similar; to be chosen in its own ADR).

## Consequences

- Stage 1's definition of done includes a one-command local start.
- The hosting choice is made once the deployable artefacts are known.
