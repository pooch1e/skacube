/**
 * ViewerDataset — the subset of the GraphQL dataset the viewer needs, checked
 * and reshaped once: axes looked up by name, nullable numbers made definite,
 * and the box proportions computed. Throws on metadata the viewer cannot draw.
 */
import type { DatasetQuery } from "@/lib/gql/graphql";
import { lightconeBox, normalisedBox } from "./cosmology";
import type { SpectralAxis } from "./spectral";
import type { Stretch } from "./stretch";
import type { VolumeShape } from "./volume";

export type DatasetMetadata = NonNullable<DatasetQuery["dataset"]>;

export type ViewerDataset = {
  id: string;
  title: string;
  sourceUrl: string;
  citation: string;
  shape: VolumeShape;
  spectral: SpectralAxis;
  stretch: Stretch;
  /** Box side lengths (RA, Dec, frequency), longest = 1. */
  box: [number, number, number];
};

export class DatasetMetadataError extends Error {
  constructor(message: string) {
    super(`Dataset metadata unusable: ${message}`);
    this.name = "DatasetMetadataError";
  }
}

function required(value: number | null | undefined, what: string): number {
  if (value == null || !Number.isFinite(value)) throw new DatasetMetadataError(`missing ${what}`);
  return value;
}

export function toViewerDataset(meta: DatasetMetadata): ViewerDataset {
  const axis = (name: string) => {
    const found = meta.axes.find((a) => a.name === name);
    if (!found) throw new DatasetMetadataError(`no ${name} axis`);
    return found;
  };
  const ra = axis("ra");
  const dec = axis("dec");
  const frequency = axis("frequency");

  const spectral: SpectralAxis = {
    startMHz: required(frequency.start, "frequency start"),
    stepMHz: required(frequency.step, "frequency step"),
    length: frequency.length,
  };
  const stretch: Stretch = {
    limitK: required(meta.stretch.limitK, "stretch limit"),
    softeningK: required(meta.stretch.softeningK, "stretch softening"),
    zeroByte: meta.stretch.zeroByte,
  };
  const box = lightconeBox({
    raDeg: required(ra.step, "RA step") * ra.length,
    decDeg: required(dec.step, "Dec step") * dec.length,
    zNear: required(frequency.redshift?.end, "redshift end"),
    zFar: required(frequency.redshift?.start, "redshift start"),
  });

  return {
    id: meta.id,
    title: meta.title,
    sourceUrl: meta.sourceUrl,
    citation: meta.citation,
    shape: meta.shape,
    spectral,
    stretch,
    box: normalisedBox(box),
  };
}
