# 0005. Flask backend with Strawberry GraphQL and astropy

- Status: Accepted
- Date: 2026-10-12

## Context

The JD names Flask and GraphQL. The developer knows Node but has not used Flask. With one curated file ([ADR 0004](0004-single-curated-dataset.md)), preprocessing can run once; the runtime backend serves metadata, pixel values and coordinate readouts.

## Options

1. **Flask + Strawberry + astropy**: matches the JD and SKA's Python ecosystem (Tango, PyTango, TangoGQL). Correct FITS reading and WCS (pixel → RA/Dec, channel → frequency). Cost: learning a new framework.
2. **Node GraphQL server (TypeScript)**: familiar, one language, shared types. No Flask; WCS hand-rolled or dropped.
3. **Python preprocessing + Node server**: pays for both runtimes and fits the JD on neither.

## Decision

Flask with Strawberry for GraphQL, astropy and numpy for FITS and WCS.

## Consequences

- Two runtimes to build, test and deploy. Covered in [SDLC](../sdlc.md).
- Frontend types come from the GraphQL schema via codegen, which bridges Python and TypeScript.
- Learning Flask is part of the work, and is documented as it happens.
