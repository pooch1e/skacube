"""Tests for the GraphQL schema, run through Strawberry's own executor inside an app context."""

import math
from pathlib import Path
from typing import Any

import pytest
from flask import Flask
from flask.testing import FlaskClient
from strawberry.printer import print_schema

from skacube.commands import DEFAULT_SCHEMA_PATH
from skacube.schema import finite, schema

DATASET_QUERY = """
query ($id: String!) {
  dataset(id: $id) {
    id title unit sourceUrl citation volumeSha256
    shape { ra dec frequency }
    axes { name unit start step length redshift { start end } }
    stretch { limitK softeningK zeroByte }
    header { key value }
  }
}
"""


def run(app: Flask, query: str, variables: dict[str, Any] | None = None) -> dict[str, Any]:
    with app.app_context():
        result = schema.execute_sync(query, variable_values=variables)
    assert result.errors is None
    assert result.data is not None
    return result.data


def test_datasets_lists_the_synthetic_dataset(app: Flask) -> None:
    data = run(app, "{ datasets { id title } }")

    assert data["datasets"] == [{"id": "synthetic", "title": "Synthetic test cube"}]


def test_dataset_by_id_returns_metadata(app: Flask) -> None:
    dataset = run(app, DATASET_QUERY, {"id": "synthetic"})["dataset"]

    assert dataset["unit"] == "K"
    assert dataset["shape"] == {"ra": 16, "dec": 16, "frequency": 16}
    assert dataset["sourceUrl"].startswith("https://")
    assert dataset["stretch"]["zeroByte"] == 128
    assert {"key": "CTYPE3", "value": "FREQ"} in dataset["header"]


def test_axes_have_unit_start_step_and_length(app: Flask) -> None:
    axes = {a["name"]: a for a in run(app, DATASET_QUERY, {"id": "synthetic"})["dataset"]["axes"]}

    assert list(axes) == ["ra", "dec", "frequency"]
    assert axes["dec"]["unit"] == "deg"
    assert axes["dec"]["length"] == 16
    assert axes["dec"]["start"] == pytest.approx(-30.0 - 0.015625 * 7.5)
    assert axes["frequency"]["unit"] == "MHz"
    assert axes["frequency"]["start"] == pytest.approx(106.05)
    assert axes["frequency"]["step"] == pytest.approx(0.2)


def test_only_the_frequency_axis_has_a_redshift_range(app: Flask) -> None:
    axes = {a["name"]: a for a in run(app, DATASET_QUERY, {"id": "synthetic"})["dataset"]["axes"]}

    assert axes["ra"]["redshift"] is None
    assert axes["frequency"]["redshift"]["start"] > axes["frequency"]["redshift"]["end"]


def test_unknown_dataset_is_null(app: Flask) -> None:
    assert run(app, DATASET_QUERY, {"id": "nope"})["dataset"] is None


def test_non_finite_numbers_serialise_as_null() -> None:
    assert finite(math.nan) is None
    assert finite(math.inf) is None
    assert finite(None) is None
    assert finite(1.5) == 1.5


def test_graphql_route_answers_over_http(client: FlaskClient) -> None:
    response = client.post("/graphql", json={"query": "{ datasets { id } }"})

    assert response.status_code == 200
    assert response.get_json() == {"data": {"datasets": [{"id": "synthetic"}]}}


def test_committed_schema_is_current() -> None:
    assert Path(DEFAULT_SCHEMA_PATH).read_text() == print_schema(schema) + "\n"


def test_export_schema_command_writes_sdl(app: Flask, tmp_path: Path) -> None:
    out = tmp_path / "schema.graphql"

    result = app.test_cli_runner().invoke(args=["export-schema", "--out", str(out)])

    assert result.exit_code == 0
    assert out.read_text() == print_schema(schema) + "\n"
