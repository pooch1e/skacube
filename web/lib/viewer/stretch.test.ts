/**
 * Tests for the stretch — bytes must match data/ingest.py's `to_bytes` for the
 * real dataset's limits (reference values computed with numpy from that
 * formula), and decoding must invert encoding.
 */
import { describe, expect, it } from "vitest";
import { byteToKelvin, byteToScaled, kelvinToByte, type Stretch } from "./stretch";

const real: Stretch = {
  limitK: 0.1447591781616211,
  softeningK: 0.007237958908081055,
  zeroByte: 128,
};

const ingestReference: [number, number][] = [
  [-0.2, 1],
  [-0.1447591781616211, 1],
  [-0.05, 37],
  [-0.01, 89],
  [-0.001, 123],
  [0, 128],
  [0.001, 133],
  [0.01, 167],
  [0.05, 219],
  [0.1447591781616211, 255],
  [0.2, 255],
];

describe("kelvinToByte", () => {
  it.each(ingestReference)("encodes %f K as byte %i, as ingest does", (kelvin, byte) => {
    expect(kelvinToByte(kelvin, real)).toBe(byte);
  });
});

describe("byteToKelvin", () => {
  it("decodes zeroByte as exactly 0 K", () => {
    expect(byteToKelvin(128, real)).toBe(0);
  });

  it("decodes the end bytes as ±limit", () => {
    expect(byteToKelvin(255, real)).toBeCloseTo(real.limitK, 10);
    expect(byteToKelvin(1, real)).toBeCloseTo(-real.limitK, 10);
  });

  it("round-trips every byte from 1 to 255", () => {
    for (let byte = 1; byte <= 255; byte++) {
      expect(kelvinToByte(byteToKelvin(byte, real), real)).toBe(byte);
    }
  });

  it("is antisymmetric about zeroByte", () => {
    for (let offset = 1; offset <= 127; offset++) {
      expect(byteToKelvin(128 + offset, real)).toBeCloseTo(-byteToKelvin(128 - offset, real), 12);
    }
  });
});

describe("byteToScaled", () => {
  it("clamps byte 0, which ingest never writes, to -1", () => {
    expect(byteToScaled(0, real)).toBe(-1);
  });
});
