# Skacube API

Flask app: GraphQL metadata at `/graphql` and the processed volume at `/data/volume/<id>` ([ADR 0008](../docs/adr/0008-graphql-metadata-rest-binary.md)).

```bash
uv sync
uv run flask run --debug   # http://127.0.0.1:3001/health (defaults from .flaskenv)
uv run ruff check && uv run ruff format --check
uv run mypy
uv run pytest
```

## Configuration

| Variable | Default | What |
|---|---|---|
| `SKACUBE_DATA_DIR` | `<repo>/data/processed` | Folder of `<id>/metadata.json` + `<id>/volume.u8.gz`, loaded once at startup. The app refuses to start if it is missing. |
| `SKACUBE_ALLOWED_ORIGIN` | unset | Sent as `Access-Control-Allow-Origin` when set. |

Tests run against the synthetic dataset in `data/fixtures/`.

## Schema

`schema.graphql` is exported from Strawberry and committed so schema changes show up in PR diffs. After changing `src/skacube/schema.py`:

```bash
uv run flask export-schema
```

A test fails if the committed file is stale.
