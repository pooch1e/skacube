"""Flask app factory — builds the app and registers its blueprints."""

from typing import Any

from flask import Flask

from skacube.health import health_bp


def create_app(config: dict[str, Any] | None = None) -> Flask:
    app = Flask(__name__)
    if config:
        app.config.update(config)
    app.register_blueprint(health_bp)
    return app
