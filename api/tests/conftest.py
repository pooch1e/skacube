"""Shared pytest fixtures — a test-configured app and its client on the synthetic dataset."""

from collections.abc import Iterator
from pathlib import Path

import pytest
from flask import Flask
from flask.testing import FlaskClient

from skacube import create_app

FIXTURE_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "fixtures"


@pytest.fixture
def app() -> Iterator[Flask]:
    yield create_app({"TESTING": True, "DATA_DIR": FIXTURE_DATA_DIR})


@pytest.fixture
def client(app: Flask) -> FlaskClient:
    return app.test_client()
