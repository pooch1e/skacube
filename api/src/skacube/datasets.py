"""Dataset loader — reads each `<data_dir>/<id>/metadata.json` once, at startup."""

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

METADATA_FILE = "metadata.json"
VOLUME_FILE = "volume.u8.gz"


@dataclass(frozen=True)
class Dataset:
    id: str
    metadata: dict[str, Any]
    volume_path: Path

    @property
    def volume_sha256(self) -> str:
        return str(self.metadata["volume_sha256"])


def load_datasets(data_dir: Path) -> dict[str, Dataset]:
    """Load each dataset folder under data_dir by name; fail loudly on a bad layout."""
    if not data_dir.is_dir():
        raise FileNotFoundError(f"Data directory not found: {data_dir} (set SKACUBE_DATA_DIR)")
    datasets: dict[str, Dataset] = {}
    for folder in sorted(p for p in data_dir.iterdir() if p.is_dir()):
        metadata_path = folder / METADATA_FILE
        volume_path = folder / VOLUME_FILE
        if not metadata_path.is_file() or not volume_path.is_file():
            raise FileNotFoundError(f"{folder} needs both {METADATA_FILE} and {VOLUME_FILE}")
        metadata = json.loads(metadata_path.read_text())
        datasets[folder.name] = Dataset(id=folder.name, metadata=metadata, volume_path=volume_path)
    return datasets
