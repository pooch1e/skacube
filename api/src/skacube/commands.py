"""Flask CLI commands — `flask export-schema` writes the committed GraphQL schema."""

from pathlib import Path

import click
from flask import Flask
from strawberry.printer import print_schema

from skacube.schema import schema

DEFAULT_SCHEMA_PATH = Path(__file__).resolve().parents[2] / "schema.graphql"


def register_commands(app: Flask) -> None:
    @app.cli.command("export-schema")
    @click.option("--out", type=click.Path(path_type=Path), default=DEFAULT_SCHEMA_PATH)
    def export_schema(out: Path) -> None:
        """Write the GraphQL schema as SDL (default: api/schema.graphql)."""
        out.write_text(print_schema(schema) + "\n")
        click.echo(f"Wrote {out}")
