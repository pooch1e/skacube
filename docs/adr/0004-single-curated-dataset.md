# 0004. Start from one curated SKA-Low FITS file

- Status: Accepted
- Date: 2026-10-12

## Context

The data source shapes the whole data flow. Options were curated files, user upload, or querying an archive. SKA-Low has published one FITS file publicly. SKA-Low's exposed API controls the telescope's radios; it does not produce images, so there is no service to query for more data.

## Options

1. **Curated set**: prepared ahead of time; reliable first impression.
2. **User upload**: robust, but must handle any file.
3. **Archive query**: real integration, but no suitable SKA-Low API exists.

## Decision

Ship with the one published SKA-Low file, prepared ahead of time. Document how further datasets would be added, without building it yet.

## Consequences

- The viewer is designed around this file's real shape (2D image or 3D cube). See [data flow](../architecture/data-flow.md).
- Adding datasets is a documented process, open for a later stage.
