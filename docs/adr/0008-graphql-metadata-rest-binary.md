# 0008. GraphQL for metadata, REST for binary data

- Status: Accepted
- Date: 2026-10-12

## Context

The browser needs small, shaped data (header cards, WCS, pixel values, spectra) and large binary arrays (the 3D texture, image slices).

## Options

1. **Split**: GraphQL for shaped queries; plain HTTP routes for binary.
2. **All GraphQL**: binary as base64. About 33% larger and a slow JSON parse.
3. **REST only**: drops GraphQL, which the JD names.

## Decision

GraphQL (Strawberry, `/graphql`) for metadata and small queries. REST routes returning `application/octet-stream` for arrays.

## Consequences

- Binary responses are cacheable by URL and stream straight into typed arrays.
- Two kinds of endpoint to document and test.
- GraphQL `Float` cannot encode NaN; NaN is sent as `null`.
