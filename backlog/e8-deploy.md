# E8. Deployment

A live link: web on Vercel, API on Cloud Run ([ADR 0030](../docs/adr/0030-hosting.md)). Runbook: [deployment](../docs/deployment.md).

## S8.1 Hosting decision

- [x] T8.1.1 Compare Cloud Run (both services) vs Vercel (web) + Cloud Run (API): cost, cold starts, same-origin routing; write the ADR — M ([ADR 0030](../docs/adr/0030-hosting.md): us-central1, scale to zero, `*.vercel.app`)

## S8.2 Deploy

As a visitor, I can open Skacube at a public URL.

Acceptance:
- Web and API deployed from `main` by CI after checks pass
- Volume served with long-lived caching
- Deploy secrets via OIDC / workload identity, none stored in GitHub

Tasks:
- [ ] T8.2.0 Protect `main` with required checks (Vercel deploys whatever lands on it) — S
- [x] T8.2.1a Bake `data/processed` into the API image via a build context; set `SKACUBE_DATA_DIR` in the image — S
- [x] T8.2.1b gunicorn workers and threads to match Cloud Run concurrency — S
- [ ] T8.2.1 Infrastructure (registry, services, domain) — M ([one-time setup](../docs/deployment.md#3-google-cloud-once))
- [ ] T8.2.2 Deploy workflow — M (API workflow written: candidate revision, smoke test, promote; runs once the GCP setup exists. Web deploys through Vercel's Git integration)
- [ ] T8.2.3 Smoke test against the live URL after deploy — S
- [ ] T8.2.4 Update root README with the live link — S
