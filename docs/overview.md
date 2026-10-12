# Overview

## Purpose

A portfolio piece for the CSIRO SKA-Low Web/UI Developer role. It shows a polished, data-first web UI built on the same stack the role uses: React/Next.js, Flask and GraphQL.

## Audience

- **Hiring panel**: engineers and managers from the SKA-Low software team. They will skim the live site, then the repo and these docs.
- **Astronomers**: will notice whether the science is handled correctly (units, axes, what a data cube really shows).

## Goals

- A splash page with a FITS viewer as the hero (3D, with 2D where it helps). Viewer only: [ADR 0006](adr/0006-viewer-only-scope.md).
- A clear demonstration of each item in the job description. See the [JD mapping](#jd-mapping).
- Documented reasoning: every significant choice has an [ADR](adr/README.md).

## Non-goals

- A general-purpose FITS tool. Scope is one curated file: [ADR 0004](adr/0004-single-curated-dataset.md).
- Scientific analysis features beyond what the demo needs.
- Branding as, or impersonating, SKAO or CSIRO.

## JD mapping

| JD item | Where it shows |
|---|---|
| React / Next.js | [Frontend](architecture/README.md) |
| Flask | [ADR 0005](adr/0005-flask-backend.md) |
| GraphQL integration | [ADR 0005](adr/0005-flask-backend.md) |
| Version control, CI/CD, testing, docs | [SDLC](sdlc.md) |
| UX, usable UI components | [Design system](design/README.md) |
| Linux, containers (desirable) | [ADR 0025](adr/0025-local-dev-compose.md) |
