/**
 * Tests for volume validation and channel slicing against the documented
 * byte layout (frequency-major, RA fastest).
 */
import { describe, expect, it } from "vitest";
import { VolumeShapeError, clampChannel, makeVolume, sliceChannel } from "./volume";

const shape = { ra: 3, dec: 2, frequency: 4 };

function indexedVolume() {
  return makeVolume(
    Uint8Array.from({ length: 24 }, (_, i) => i),
    shape,
  );
}

describe("makeVolume", () => {
  it("rejects byte counts that do not match the shape", () => {
    expect(() => makeVolume(new Uint8Array(23), shape)).toThrow(VolumeShapeError);
  });

  it("accepts the real dataset's 256³ bytes", () => {
    const real = { ra: 256, dec: 256, frequency: 256 };
    expect(makeVolume(new Uint8Array(16_777_216), real).shape).toEqual(real);
  });
});

describe("sliceChannel", () => {
  it("returns one channel's ra × dec plane in stored order", () => {
    expect(Array.from(sliceChannel(indexedVolume(), 2))).toEqual([12, 13, 14, 15, 16, 17]);
  });

  it("clamps channels outside the cube", () => {
    const volume = indexedVolume();
    expect(Array.from(sliceChannel(volume, -5))).toEqual([0, 1, 2, 3, 4, 5]);
    expect(Array.from(sliceChannel(volume, 99))).toEqual([18, 19, 20, 21, 22, 23]);
    expect(clampChannel(volume, 1.6)).toBe(2);
  });
});
