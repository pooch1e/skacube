"""Health blueprint — liveness check used by Compose, CI and the web placeholder."""

from flask import Blueprint

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
