"""Tests for the dataset loader."""

from pathlib import Path

import pytest

from skacube.datasets import load_datasets

from .conftest import FIXTURE_DATA_DIR


def test_loads_the_synthetic_dataset() -> None:
    datasets = load_datasets(FIXTURE_DATA_DIR)

    dataset = datasets["synthetic"]
    assert dataset.id == "synthetic"
    assert dataset.metadata["title"] == "Synthetic test cube"
    assert dataset.volume_path.name == "volume.u8.gz"
    assert len(dataset.volume_sha256) == 64


def test_missing_data_dir_fails_loudly(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError, match="SKACUBE_DATA_DIR"):
        load_datasets(tmp_path / "nope")


def test_folder_without_volume_fails_loudly(tmp_path: Path) -> None:
    (tmp_path / "broken").mkdir()
    (tmp_path / "broken" / "metadata.json").write_text("{}")

    with pytest.raises(FileNotFoundError, match=r"volume\.u8\.gz"):
        load_datasets(tmp_path)


def test_empty_data_dir_loads_nothing(tmp_path: Path) -> None:
    assert load_datasets(tmp_path) == {}
