# 0003. Public GitHub repo, GitHub flow

- Status: Accepted
- Date: 2026-10-12

## Context

The JD encourages publicly available code and describes an agile, CI-driven team process. The repo is where the panel will look for evidence of that.

## Options

1. **Public repo, GitHub flow**: issues per piece of work, short-lived branches, PRs gated by CI.
2. **Trunk-based**: commit to `main` with CI. Faster, less visible process.
3. **Private until finished**: hides work in progress, and the history with it.

## Decision

Public from the first commit. Every change goes through an issue, a branch and a PR that CI must pass.

## Consequences

- The history shows planning (issues), reasoning (ADRs) and review (PRs).
- No secrets in the repo, ever. Configuration comes from the environment.
