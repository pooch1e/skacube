"""Settings read from the environment — nothing here is secret and nothing is read from the repo."""

import os
from collections.abc import Mapping
from pathlib import Path
from typing import Any

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "processed"


def load_settings(env: Mapping[str, str] | None = None) -> dict[str, Any]:
    """Return Flask config values from SKACUBE_DATA_DIR and SKACUBE_ALLOWED_ORIGIN."""
    env = os.environ if env is None else env
    return {
        "DATA_DIR": Path(env.get("SKACUBE_DATA_DIR") or DEFAULT_DATA_DIR),
        "ALLOWED_ORIGIN": env.get("SKACUBE_ALLOWED_ORIGIN") or None,
    }
