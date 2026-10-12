# 0002. TypeScript, strict mode

- Status: Accepted
- Date: 2026-10-12

## Context

The JD asks for JavaScript. TypeScript is a superset and is standard in Next.js projects.

## Options

1. **JavaScript**: matches the JD wording literally.
2. **TypeScript (strict)**: types across components, API responses and shaders' inputs.

## Decision

TypeScript with `strict: true` for all frontend code.

## Consequences

- API responses can be typed from the API schema (generated, not hand-written).
- Slightly more setup; no runtime cost.
