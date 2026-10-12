# Skacube API

Flask app: GraphQL metadata at `/graphql` and the processed volume at `/data/volume/<id>` ([ADR 0008](../docs/adr/0008-graphql-metadata-rest-binary.md)). Both arrive in E3; for now it serves `/health`.

```bash
uv sync
uv run flask --app skacube run --debug   # http://127.0.0.1:5000/health
uv run ruff check && uv run ruff format --check
uv run mypy
uv run pytest
```
