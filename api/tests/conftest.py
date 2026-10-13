"""Shared pytest fixtures — a test-configured app and its client."""

from collections.abc import Iterator

import pytest
from flask import Flask
from flask.testing import FlaskClient

from skacube import create_app


@pytest.fixture
def app() -> Iterator[Flask]:
    yield create_app({"TESTING": True})


@pytest.fixture
def client(app: Flask) -> FlaskClient:
    return app.test_client()
