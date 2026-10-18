# Open questions

Decisions still to make. Each becomes an ADR once settled.

## Deferred

- Hosting platform for web and API, chosen when deployment starts ([ADR 0019](adr/0019-local-first-then-cloud.md)). Candidates: Google Cloud Run for both, or Vercel (web) with Cloud Run (API).
- Same-origin routing vs CORS between web and API, decided with hosting.

## Proposed, awaiting acceptance

- Behaviour without WebGL2: [ADR 0029](adr/0029-webgl2-fallback.md)

## Not yet explored

- Viewer UX and splash page content
