"""Volume blueprint — serves the processed volume as gzip-encoded bytes (ADR 0026)."""

from typing import cast

from flask import Blueprint, abort, current_app, request, send_file
from werkzeug.wrappers import Response

from skacube.datasets import Dataset

volume_bp = Blueprint("volume", __name__)

IMMUTABLE_CACHE = "public, max-age=31536000, immutable"


@volume_bp.get("/data/volume/<dataset_id>")
def get_volume(dataset_id: str) -> Response:
    dataset = cast(dict[str, Dataset], current_app.config["DATASETS"]).get(dataset_id)
    if dataset is None:
        abort(404)
    response = send_file(
        dataset.volume_path, mimetype="application/octet-stream", etag=False, conditional=False
    )
    response.headers["Content-Encoding"] = "gzip"
    response.headers["Cache-Control"] = IMMUTABLE_CACHE
    response.set_etag(dataset.volume_sha256)
    return response.make_conditional(request)
