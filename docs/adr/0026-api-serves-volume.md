# 0026. The API serves the processed volume

- Status: Accepted
- Date: 2026-10-12

## Context

The processed volume ([ADR 0021](0021-data-storage.md)) could be served by Flask or as a static file from the Next.js app.

## Options

1. **Flask, `GET /data/volume/<id>`**, with long cache headers: one owner for all data.
2. **Next.js `public/`**: CDN-served, faster, but data split between two services.

## Decision

Flask serves the volume at `GET /data/volume/<id>` with `Cache-Control: public, max-age=31536000, immutable` and a content hash in the URL or ETag.

## Consequences

- Adding datasets is an API change only.
- Option 2 remains the fallback if a hosting platform makes this awkward.
