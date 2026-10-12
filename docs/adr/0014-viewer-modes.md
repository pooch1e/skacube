# 0014. Viewer modes

- Status: Accepted
- Date: 2026-10-12

## Context

The dataset is a 3D lightcone: the frequency axis is line-of-sight distance and cosmic time ([dataset](../background/dataset.md)).

## Decision

- **Stage 1**: 3D lightcone volume (the hero) and a 2D channel slice with a frequency/redshift slider. The views are linked: the slider moves a plane through the volume.
- **Stage 2**: spectrum at a clicked pixel (GraphQL query) and the reionisation history curve (ionised fraction against redshift).

## Consequences

- Stage 1 needs only the 3D texture and channel slices; stage 2 adds small GraphQL queries.
