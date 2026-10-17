/**
 * Tests for toViewerDataset — axes by name regardless of order, and clear
 * errors for metadata the viewer cannot draw.
 */
import { describe, expect, it } from "vitest";
import { DatasetMetadataError, toViewerDataset, type DatasetMetadata } from "./dataset";

function metadata(overrides: Partial<DatasetMetadata> = {}): DatasetMetadata {
  return {
    id: "eor-h21cm",
    title: "Real cube",
    unit: "K",
    sourceUrl: "https://example.invalid",
    citation: "Bonaldi et al. (2025)",
    volumeSha256: "abc",
    shape: { ra: 256, dec: 256, frequency: 256 },
    axes: [
      {
        name: "frequency",
        unit: "MHz",
        start: 106.1328125,
        step: 0.365625,
        length: 256,
        redshift: { start: 12.383285699396689, end: 6.124571347870371 },
      },
      { name: "ra", unit: "deg", start: 3.9765625, step: -0.03125, length: 256, redshift: null },
      { name: "dec", unit: "deg", start: -33.9765625, step: 0.03125, length: 256, redshift: null },
    ],
    stretch: { limitK: 0.1447591781616211, softeningK: 0.007237958908081055, zeroByte: 128 },
    header: [],
    ...overrides,
  };
}

describe("toViewerDataset", () => {
  it("finds axes by name and sizes the box with frequency deepest", () => {
    const dataset = toViewerDataset(metadata());
    expect(dataset.spectral).toEqual({ startMHz: 106.1328125, stepMHz: 0.365625, length: 256 });
    expect(dataset.box[2]).toBe(1);
    expect(dataset.box[0]).toBeCloseTo(0.806, 3);
  });

  it("rejects a missing axis", () => {
    const meta = metadata();
    expect(() =>
      toViewerDataset({ ...meta, axes: meta.axes.filter((a) => a.name !== "dec") }),
    ).toThrow(DatasetMetadataError);
  });

  it("rejects a null stretch limit", () => {
    const meta = metadata();
    expect(() => toViewerDataset({ ...meta, stretch: { ...meta.stretch, limitK: null } })).toThrow(
      /stretch limit/,
    );
  });
});
