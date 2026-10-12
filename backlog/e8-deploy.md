# E8. Deployment

A live link. Blocked on the hosting decision ([ADR 0019](../docs/adr/0019-local-first-then-cloud.md), [open questions](../docs/open-questions.md)).

## S8.1 Hosting decision

- [ ] T8.1.1 Compare Cloud Run (both services) vs Vercel (web) + Cloud Run (API): cost, cold starts, same-origin routing; write the ADR — M

## S8.2 Deploy

As a visitor, I can open Skycube at a public URL.

Acceptance:
- Web and API deployed from `main` by CI after checks pass
- Volume served with long-lived caching
- Deploy secrets via OIDC / workload identity, none stored in GitHub

Tasks:
- [ ] T8.2.1 Infrastructure (registry, services, domain) — M
- [ ] T8.2.2 Deploy workflow — M
- [ ] T8.2.3 Smoke test against the live URL after deploy — S
- [ ] T8.2.4 Update root README with the live link — S
