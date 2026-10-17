/**
 * Stretch — converts between stored bytes and brightness temperature. Mirrors
 * `to_bytes` in data/ingest.py: clip to ±limit, asinh with a softening knee,
 * then byte = zeroByte + 127·scaled, so 0 K is exactly zeroByte (ADR 0015).
 */

export type Stretch = { limitK: number; softeningK: number; zeroByte: number };

export const HALF_RANGE = 127;

function asinhScale(stretch: Stretch): number {
  return Math.asinh(stretch.limitK / stretch.softeningK);
}

/** Signed position in [-1, 1] for a byte; 0 at zeroByte. */
export function byteToScaled(byte: number, stretch: Stretch): number {
  return Math.max(-1, Math.min(1, (byte - stretch.zeroByte) / HALF_RANGE));
}

export function scaledToKelvin(scaled: number, stretch: Stretch): number {
  return stretch.softeningK * Math.sinh(scaled * asinhScale(stretch));
}

export function kelvinToScaled(kelvin: number, stretch: Stretch): number {
  const clipped = Math.max(-stretch.limitK, Math.min(stretch.limitK, kelvin));
  return Math.asinh(clipped / stretch.softeningK) / asinhScale(stretch);
}

export function byteToKelvin(byte: number, stretch: Stretch): number {
  return scaledToKelvin(byteToScaled(byte, stretch), stretch);
}

export function kelvinToByte(kelvin: number, stretch: Stretch): number {
  return Math.round(stretch.zeroByte + HALF_RANGE * kelvinToScaled(kelvin, stretch));
}
