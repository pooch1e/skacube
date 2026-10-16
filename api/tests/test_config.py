"""Tests for environment settings."""

from pathlib import Path

from skacube.config import DEFAULT_DATA_DIR, load_settings


def test_defaults_when_env_is_empty() -> None:
    settings = load_settings({})

    assert settings == {"DATA_DIR": DEFAULT_DATA_DIR, "ALLOWED_ORIGIN": None}


def test_reads_data_dir_and_origin_from_env() -> None:
    settings = load_settings(
        {"SKACUBE_DATA_DIR": "/srv/data", "SKACUBE_ALLOWED_ORIGIN": "http://localhost:3000"}
    )

    assert settings["DATA_DIR"] == Path("/srv/data")
    assert settings["ALLOWED_ORIGIN"] == "http://localhost:3000"


def test_default_data_dir_is_the_committed_processed_folder() -> None:
    assert DEFAULT_DATA_DIR.is_dir()
