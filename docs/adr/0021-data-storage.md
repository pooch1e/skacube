# 0021. Raw file stays local; processed files are committed

- Status: Accepted
- Date: 2026-10-12

## Context

The raw cube is 981 MB: over GitHub's 100 MB file limit. After ingest ([ADR 0013](0013-one-time-ingest.md)) and [ADR 0020](0020-browser-channel-slice.md), the processed output is one ~17 MB volume (smaller compressed) plus small JSON.

## Options

1. **Download script for the raw file** (SKAO link + checksum), ingest anywhere.
2. **Raw file kept locally, processed files committed to git.**
3. **Processed files in Git LFS or a bucket.**

## Decision

The raw file lives in `data/raw/`, which is git-ignored. Ingest runs locally once; its compressed output is committed under `data/processed/`. The README links the [SKAO source](../background/dataset.md#source) and checksum so anyone can re-run ingest.

## Consequences

- Clone and run: no download, no credentials, no LFS.
- Every re-ingest adds its output to git history permanently. Acceptable while re-ingests are rare; revisit with LFS or a bucket if they aren't.
- The README states this is a demo shortcut; a real system keeps data out of the code repo.
