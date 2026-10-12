# 0011. App Router; static splash, client-side viewer

- Status: Accepted
- Date: 2026-10-12

## Context

The viewer uses WebGL, which only runs in the browser. The splash page is mostly static.

## Options

1. **App Router, static splash, client viewer**: data fetched in the browser.
2. **Server components fetching from Flask per request**: needs a Node server in production.
3. **Static export**: host anywhere, lose server features.

## Decision

App Router. The splash page is statically generated; the viewer is a client component that fetches from the API in the browser.

## Consequences

- Fast first paint; hosting options stay open.
- The API must allow the web origin (CORS) or sit behind the same domain.
