# 0001. No fixed deadline; deliver in stages

- Status: Accepted
- Date: 2026-10-12

## Context

Scope depends on time. Options were a one-week build, a two-to-three-week build, or no fixed date.

## Options

1. **One week**: one viewer, lean stack. Fast, but little room to show process.
2. **Two to three weeks**: viewer, one supporting feature, full CI.
3. **No fixed date, staged**: build properly, releasing in increments.

## Decision

No fixed date. Work is delivered in stages, each one deployable and documented.

## Consequences

- Each stage needs a clear definition of done, so the project is presentable at any point.
- Risk of scope creep. Stages are planned in [SDLC](../sdlc.md) and cut deliberately.
