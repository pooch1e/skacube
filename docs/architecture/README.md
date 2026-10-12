# Architecture overview

## Fixed requirements

- Next.js frontend, TypeScript ([ADR 0002](../adr/0002-typescript.md))
- Visualise a FITS file in 3D, and in 2D where that helps
- Cover the JD: React/Next.js, Flask, GraphQL integration, CI/CD, testing, docs, UX

## Components

- **web**: Next.js app. Splash page and viewer, styled with the [design system](../design/README.md).
- **data**: one curated SKA-Low FITS file ([ADR 0004](../adr/0004-single-curated-dataset.md)).
- **api**: Flask, Strawberry GraphQL; ingest uses astropy ([ADR 0005](../adr/0005-flask-backend.md)).
- Layout: monorepo with `web/`, `api/`, `docs/`, `data/` ([ADR 0007](../adr/0007-monorepo.md)).

## Details

- [Data flow](data-flow.md)
- [Dependencies](dependencies.md)
- [Production ingest](production-ingest.md)
- [Open questions](../open-questions.md)
