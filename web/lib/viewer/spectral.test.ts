/**
 * Tests for channel ↔ frequency ↔ redshift, checked against the real
 * dataset's metadata (its redshift range was computed by ingest).
 */
import { describe, expect, it } from "vitest";
import {
  channelFrequency,
  channelRedshift,
  frequencyToRedshift,
  redshiftToFrequency,
  type SpectralAxis,
} from "./spectral";

const real: SpectralAxis = { startMHz: 106.1328125, stepMHz: 0.365625, length: 256 };

describe("spectral axis", () => {
  it("puts the first and last channels at the metadata's redshift range", () => {
    expect(channelRedshift(real, 0)).toBeCloseTo(12.383285699396689, 9);
    expect(channelRedshift(real, real.length - 1)).toBeCloseTo(6.124571347870371, 9);
  });

  it("steps frequency by the bin width", () => {
    expect(channelFrequency(real, 1) - channelFrequency(real, 0)).toBeCloseTo(0.365625, 12);
  });

  it("puts the 21 cm rest frequency at z = 0", () => {
    expect(frequencyToRedshift(1420.405751768)).toBe(0);
  });

  it("inverts redshift and frequency", () => {
    for (const z of [6, 8.3, 12.4]) {
      expect(frequencyToRedshift(redshiftToFrequency(z))).toBeCloseTo(z, 12);
    }
  });
});
