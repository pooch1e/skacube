"""GraphQL schema — dataset metadata for the web app (ADR 0008).

GraphQL `Float` cannot encode NaN or infinity, so any non-finite number is served as null.
"""

import math
from typing import Any, cast

import strawberry
from flask import current_app

from skacube.datasets import Dataset

AXIS_ORDER = ("ra", "dec", "frequency")
AXIS_UNITS = {"ra": "deg", "dec": "deg", "frequency": "MHz"}


def finite(value: Any) -> float | None:
    """Return value as a float, or None when it is missing, NaN or infinite."""
    if value is None:
        return None
    number = float(value)
    return number if math.isfinite(number) else None


@strawberry.type
class Shape:
    ra: int
    dec: int
    frequency: int


@strawberry.type
class RedshiftRange:
    start: float | None
    end: float | None


@strawberry.type
class Axis:
    name: str
    unit: str
    start: float | None
    step: float | None
    length: int
    redshift: RedshiftRange | None


@strawberry.type
class Stretch:
    limit_k: float | None
    softening_k: float | None
    zero_byte: int


@strawberry.type
class HeaderCard:
    key: str
    value: str


@strawberry.type(name="Dataset")
class DatasetType:
    id: str
    title: str
    unit: str
    shape: Shape
    axes: list[Axis]
    stretch: Stretch
    header: list[HeaderCard]
    source_url: str
    citation: str
    volume_sha256: str


def to_graphql(dataset: Dataset) -> DatasetType:
    meta = dataset.metadata
    shape = meta["output_shape"]
    axes = []
    for name in AXIS_ORDER:
        length = shape[name if name != "frequency" else "freq"]
        axis_meta = meta["axes"][name]
        if name == "frequency":
            start, step = axis_meta["start_mhz"], axis_meta["step_mhz"]
            redshift = RedshiftRange(
                start=finite(meta["redshift"]["start"]), end=finite(meta["redshift"]["end"])
            )
        else:
            step = axis_meta["step_deg"]
            start = axis_meta["centre_deg"] - step * (length - 1) / 2
            redshift = None
        axes.append(
            Axis(
                name=name,
                unit=AXIS_UNITS[name],
                start=finite(start),
                step=finite(step),
                length=length,
                redshift=redshift,
            )
        )
    stretch = meta["stretch"]
    return DatasetType(
        id=dataset.id,
        title=meta["title"],
        unit=str(meta["header"].get("BUNIT", "")),
        shape=Shape(ra=shape["ra"], dec=shape["dec"], frequency=shape["freq"]),
        axes=axes,
        stretch=Stretch(
            limit_k=finite(stretch["limit_k"]),
            softening_k=finite(stretch["softening_k"]),
            zero_byte=stretch["zero_byte"],
        ),
        header=[HeaderCard(key=k, value=str(v)) for k, v in meta["header"].items()],
        source_url=meta["source_url"],
        citation=meta["citation"],
        volume_sha256=dataset.volume_sha256,
    )


def datasets() -> dict[str, Dataset]:
    return cast(dict[str, Dataset], current_app.config["DATASETS"])


@strawberry.type
class Query:
    @strawberry.field
    def datasets(self) -> list[DatasetType]:
        return [to_graphql(d) for d in datasets().values()]

    @strawberry.field
    def dataset(self, id: str) -> DatasetType | None:
        found = datasets().get(id)
        return to_graphql(found) if found else None


schema = strawberry.Schema(query=Query)
