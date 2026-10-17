/**
 * Volume — the processed cube as bytes plus its shape, and channel slicing.
 *
 * Byte layout (data/README.md): frequency-major, then Dec, then RA fastest, so
 * index = f·dec·ra + d·ra + r. Row d = 0 is the top (north) of the sky because
 * ingest flips FITS rows, which start at the bottom.
 */

export type VolumeShape = { ra: number; dec: number; frequency: number };

export type Volume = { bytes: Uint8Array; shape: VolumeShape };

export class VolumeShapeError extends Error {
  constructor(expected: number, actual: number) {
    super(
      `Volume has ${actual} bytes but its shape needs ${expected}. ` +
        "If it is much smaller, the gzip body was probably not decoded.",
    );
    this.name = "VolumeShapeError";
  }
}

export function makeVolume(bytes: Uint8Array, shape: VolumeShape): Volume {
  const expected = shape.ra * shape.dec * shape.frequency;
  if (bytes.length !== expected) throw new VolumeShapeError(expected, bytes.length);
  return { bytes, shape };
}

export function clampChannel(volume: Volume, channel: number): number {
  return Math.min(volume.shape.frequency - 1, Math.max(0, Math.round(channel)));
}

/** One frequency channel as ra × dec bytes, row 0 = north. Shares memory with the volume. */
export function sliceChannel(volume: Volume, channel: number): Uint8Array {
  const plane = volume.shape.ra * volume.shape.dec;
  const start = clampChannel(volume, channel) * plane;
  return volume.bytes.subarray(start, start + plane);
}
