# Backlog

Work is split into **epics** (a capability), **stories** (a user-visible or developer-visible outcome with acceptance criteria) and **tasks** (one PR-sized piece of work). Each task becomes a GitHub issue linked to its story; each story links to its epic.

Sizes: **S** (under half a day), **M** (about a day), **L** (two to three days).

## Epics

| # | Epic | Depends on | Status |
|---|---|---|---|
| [E1](e1-foundations.md) | Foundations: repo, tooling, CI | — | Ready |
| [E2](e2-ingest.md) | Data ingest | E1 | Ready |
| [E3](e3-api.md) | API | E1, E2 | Ready |
| [E4](e4-web-foundations.md) | Web foundations | E1, E3 (schema) | Ready |
| [E5](e5-viewer.md) | Viewer | E3, E4 | Code complete on `e5/viewer`, not yet checked in a browser |
| [E6](e6-splash.md) | Splash page | E4, E5 | Needs UX decisions |
| [E7](e7-quality.md) | End-to-end quality | E1, E5 | Ready |
| [E8](e8-deploy.md) | Deployment | E7 | Blocked on hosting ADR |
| [E9](e9-enhancements.md) | Viewer enhancements | E5 | Later |

## Suggested order

E1 → E2 → E3 → E4 → E5 → E7 → E6 → E8 → E9. E6 can start in parallel with E5 once the viewer component's interface exists.

## Conventions

- Issue titles: `[E2] Block-average cube to 256³`.
- Labels: `epic:E2`, `type:story` or `type:task`, `size:S|M|L`, `area:api|web|data|ci|docs`.
- A story is done when its acceptance criteria pass in CI and any affected docs or ADRs are updated.
