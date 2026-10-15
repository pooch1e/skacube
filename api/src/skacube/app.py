"""Flask app factory — builds the app, loads datasets and registers its blueprints."""

from typing import Any

from flask import Flask, Response
from strawberry.flask.views import GraphQLView

from skacube.commands import register_commands
from skacube.config import load_settings
from skacube.datasets import load_datasets
from skacube.health import health_bp
from skacube.schema import schema
from skacube.volume import volume_bp


def create_app(config: dict[str, Any] | None = None) -> Flask:
    app = Flask(__name__)
    app.config.update(load_settings())
    if config:
        app.config.update(config)
    app.config["DATASETS"] = load_datasets(app.config["DATA_DIR"])
    app.register_blueprint(health_bp)
    app.register_blueprint(volume_bp)
    app.add_url_rule("/graphql", view_func=GraphQLView.as_view("graphql", schema=schema))
    register_commands(app)

    @app.after_request
    def add_cors_header(response: Response) -> Response:
        origin = app.config["ALLOWED_ORIGIN"]
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
        return response

    return app
