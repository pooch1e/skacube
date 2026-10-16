# E3. API

Flask serves dataset metadata over GraphQL and the volume over REST. ADRs: [0005](../docs/adr/0005-flask-backend.md), [0008](../docs/adr/0008-graphql-metadata-rest-binary.md), [0018](../docs/adr/0018-graphql-codegen.md), [0026](../docs/adr/0026-api-serves-volume.md).

## S3.1 Dataset metadata over GraphQL

As the web app, I can query a dataset's shape, axes, units, header and provenance.

Acceptance:
- `datasets` and `dataset(id)` queries
- Fields: id, title, shape, axes (name, unit, start, step, length), unit, stretch limits, header cards, source URL, citation
- Frequency axis also exposes redshift range
- NaN values serialise as `null`

Tasks:
- [x] T3.1.1 Strawberry schema and `/graphql` route — M
- [x] T3.1.2 Loader reading `data/processed/*/metadata.json` at startup — S
- [x] T3.1.3 Resolver tests with Strawberry's test client — S

## S3.2 Volume route

As the web app, I can download the processed volume as raw bytes.

Acceptance:
- `GET /data/volume/<id>` returns `application/octet-stream`, gzip-encoded
- `ETag` from the checksum; `Cache-Control: public, max-age=31536000, immutable`
- `404` for unknown ids

Tasks:
- [x] T3.2.1 Route with headers and conditional GET — S
- [x] T3.2.2 Flask test-client tests — S

## S3.3 Schema contract

As a developer, CI fails if the API schema and the web queries drift apart.

Acceptance:
- `schema.graphql` exported from Strawberry and committed
- `contract` CI job regenerates schema and client types and fails on diff

Tasks:
- [x] T3.3.1 Schema export command — S
- [ ] T3.3.2 `contract` workflow (needs E4 codegen) — S

## S3.4 Configuration

As an operator, I configure the API from the environment.

Tasks:
- [x] T3.4.1 Settings from env (data dir, allowed origin); no secrets in repo — S
