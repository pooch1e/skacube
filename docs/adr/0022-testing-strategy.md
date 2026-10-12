# 0022. Testing strategy

- Status: Accepted
- Date: 2026-10-12

## Decision

| Layer | Tests |
|---|---|
| Ingest (api) | pytest on a tiny synthetic cube with known values: block averaging, symmetric stretch around 0 K, 0 K → midpoint |
| GraphQL (api) | Strawberry test client against resolvers |
| Binary routes (api) | Flask test client |
| Pure functions (web) | Vitest: stretch, frequency ↔ redshift, colormap lookup |
| Components (web) | React Testing Library **only where a component has real logic**; not for styling or library primitives |
| End-to-end | Playwright on the synthetic cube: page loads, canvas renders, slider moves the slice; one screenshot comparison with software WebGL |
| Contract | Codegen diff fails CI on schema drift ([ADR 0018](0018-graphql-codegen.md)) |

Coverage is reported, not enforced.

## Consequences

- CI never needs the real 981 MB file.
- The screenshot test is the one guard on the shader; it may need its baseline refreshed when the look changes.
