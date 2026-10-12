# 0018. Generate TypeScript types from the GraphQL schema

- Status: Accepted
- Date: 2026-10-12

## Context

The API is Python (Strawberry); the client is TypeScript with TanStack Query ([ADR 0009](0009-tanstack-query.md)).

## Options

1. **GraphQL Codegen** (`typed-document-node` preset): types generated from the exported schema.
2. **Hand-written types**: drift silently.

## Decision

Export the Strawberry schema to `schema.graphql` and generate client types with GraphQL Codegen.

## Consequences

- CI fails if the schema and client queries disagree.
- The exported schema file is committed, so schema changes show in PR diffs.
