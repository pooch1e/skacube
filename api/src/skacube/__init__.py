"""Skacube API package — exposes the Flask app factory.

`flask --app skacube` discovers `create_app` here.
"""

from skacube.app import create_app

__all__ = ["create_app"]
