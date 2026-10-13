# 0028. Ingest is a standalone script, not part of the API

- Status: Accepted
- Date: 2026-10-13
- Supersedes [0013](0013-one-time-ingest.md); amends the ingest row of [0022](0022-testing-strategy.md)

## Context

[ADR 0013](0013-one-time-ingest.md) made ingest a Flask CLI command (`flask ingest`) in a tested module. It runs once, on one machine, on one file. That would put `astropy` and `numpy` in the API's dependencies, bloat the Docker image with packages the running API never imports, and add a module, CLI wiring and strict typing for a job done a single time.

## Options

1. **Flask CLI command in the API package**: one codebase, but extra dependencies and structure for a one-off.
2. **Standalone script in `data/`**, with its own inline dependencies: nothing added to the API.
3. **Notebook**: easy to explore, poor to review and re-run.

## Decision

Option 2. `data/ingest.py` declares its dependencies (`astropy`, `numpy`) in a [PEP 723](https://peps.python.org/pep-0723/) header and is run with `uv run data/ingest.py <fits>`. It writes `data/processed/`, which is committed ([ADR 0021](0021-data-storage.md)). The API still serves only processed files and never opens the raw FITS (unchanged from 0013).

## Consequences

- `api/pyproject.toml` and the API image gain no ingest dependencies.
- Testing is a small pytest file beside the script, checking the maths on a synthetic cube built with numpy: averaging, 0 K to byte 128, byte order. It is not wired into the API's mypy-strict or CI jobs unless that proves worth it.
- The synthetic cube is still used by API tests and e2e through a tiny committed processed output.
- [Production ingest](../architecture/production-ingest.md) now describes a rewrite of the script into a containerised job, not reuse of an API module.
