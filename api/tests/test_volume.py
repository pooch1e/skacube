"""Tests for GET /data/volume/<id>."""

import gzip

from flask import Flask
from flask.testing import FlaskClient

from skacube import create_app

from .conftest import FIXTURE_DATA_DIR


def test_returns_gzip_encoded_octet_stream(client: FlaskClient) -> None:
    response = client.get("/data/volume/synthetic", headers={"Accept-Encoding": "identity"})

    assert response.status_code == 200
    assert response.mimetype == "application/octet-stream"
    assert response.headers["Content-Encoding"] == "gzip"
    assert len(gzip.decompress(response.data)) == 16**3


def test_cache_headers_are_immutable(client: FlaskClient) -> None:
    response = client.get("/data/volume/synthetic")

    assert response.headers["Cache-Control"] == "public, max-age=31536000, immutable"


def test_etag_is_the_volume_checksum(app: Flask, client: FlaskClient) -> None:
    sha = app.config["DATASETS"]["synthetic"].volume_sha256

    response = client.get("/data/volume/synthetic")

    assert response.headers["ETag"] == f'"{sha}"'


def test_conditional_get_returns_304(app: Flask, client: FlaskClient) -> None:
    sha = app.config["DATASETS"]["synthetic"].volume_sha256

    response = client.get("/data/volume/synthetic", headers={"If-None-Match": f'"{sha}"'})

    assert response.status_code == 304
    assert response.data == b""


def test_stale_etag_returns_the_body(client: FlaskClient) -> None:
    response = client.get("/data/volume/synthetic", headers={"If-None-Match": '"stale"'})

    assert response.status_code == 200
    assert response.data


def test_unknown_id_is_404(client: FlaskClient) -> None:
    assert client.get("/data/volume/nope").status_code == 404


def test_path_traversal_is_404(client: FlaskClient) -> None:
    assert client.get("/data/volume/..%2Fprocessed").status_code == 404


def test_allowed_origin_header_only_when_configured(app: Flask) -> None:
    assert "Access-Control-Allow-Origin" not in app.test_client().get("/health").headers

    configured = create_app(
        {"TESTING": True, "DATA_DIR": FIXTURE_DATA_DIR, "ALLOWED_ORIGIN": "http://localhost:3000"}
    )
    response = configured.test_client().get("/health")

    assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:3000"
