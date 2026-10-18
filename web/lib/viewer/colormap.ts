/**
 * Colormap — turns evenly spaced colour stops (the `--sk-cmap-div-*` tokens)
 * into a 256-entry RGBA lookup table indexed by stored byte, shared by the 3D
 * shader and the 2D slice so both always agree.
 *
 * Interpolation is linear in sRGB between stops; the stops are close enough
 * in OKLab that the difference from OKLab interpolation is not visible.
 */
import { HALF_RANGE } from "./stretch";

export type Rgb = [number, number, number];

export const LUT_SIZE = 256;
export const DIVERGING_STOP_COUNT = 7;

export function parseHex(hex: string): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) throw new Error(`Expected a #rrggbb colour, got "${hex}"`);
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/**
 * LUT indexed by stored byte. Positions follow the stretch's signed scale, so
 * zeroByte (0 K) lands exactly on the middle stop and ±127 bytes reach the ends.
 */
export function buildLut(stops: readonly Rgb[], zeroByte: number): Uint8Array {
  if (stops.length < 2) throw new Error("A colormap needs at least two stops");
  const lut = new Uint8Array(LUT_SIZE * 4);
  const segments = stops.length - 1;
  for (let byte = 0; byte < LUT_SIZE; byte++) {
    const scaled = Math.max(-1, Math.min(1, (byte - zeroByte) / HALF_RANGE));
    const position = ((scaled + 1) / 2) * segments;
    const lower = Math.min(Math.floor(position), segments - 1);
    const t = position - lower;
    for (let c = 0; c < 3; c++) {
      lut[byte * 4 + c] = Math.round(stops[lower][c] + (stops[lower + 1][c] - stops[lower][c]) * t);
    }
    lut[byte * 4 + 3] = 255;
  }
  return lut;
}

export function readDivergingStops(element: Element = document.documentElement): Rgb[] {
  const style = getComputedStyle(element);
  return Array.from({ length: DIVERGING_STOP_COUNT }, (_, i) =>
    parseHex(style.getPropertyValue(`--sk-cmap-div-${i}`)),
  );
}

/** CSS gradient across the full signed range (zeroByte ± 127), for the legend. */
export function lutToCss(lut: Uint8Array, zeroByte: number, samples = 17): string {
  const stops = Array.from({ length: samples }, (_, i) => {
    const fraction = i / (samples - 1);
    const index = Math.round(zeroByte - HALF_RANGE + fraction * 2 * HALF_RANGE) * 4;
    return `rgb(${lut[index]} ${lut[index + 1]} ${lut[index + 2]}) ${(fraction * 100).toFixed(1)}%`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
}
