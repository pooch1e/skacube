# 0009. TanStack Query for data fetching

- Status: Accepted
- Date: 2026-10-12

## Context

The frontend calls a GraphQL API and binary REST routes.

## Options

1. **Apollo Client**: widely used, normalised cache, heavier.
2. **urql**: lighter GraphQL client.
3. **TanStack Query + a small fetch wrapper**: one caching layer for both GraphQL and binary requests.

## Decision

TanStack Query, with a thin `graphqlRequest` wrapper for GraphQL and plain `fetch` for binary routes. The developer already knows it.

## Consequences

- One loading, error and cache model for every request.
- No normalised GraphQL cache; not needed for a read-only app with a few queries.
