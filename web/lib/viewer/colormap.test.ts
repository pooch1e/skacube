/**
 * Tests for the colormap LUT, and a check that the diverging tokens in
 * tokens.css are perceptually balanced: OKLab lightness rises monotonically
 * from the dark 0 K midpoint, by matching amounts on both sides.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DIVERGING_STOP_COUNT, buildLut, lutToCss, parseHex, type Rgb } from "./colormap";

function tokenStops(): Rgb[] {
  const css = readFileSync(join(__dirname, "../../app/tokens.css"), "utf8");
  return Array.from({ length: DIVERGING_STOP_COUNT }, (_, i) => {
    const match = new RegExp(`--sk-cmap-div-${i}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
    if (!match) throw new Error(`--sk-cmap-div-${i} missing from tokens.css`);
    return parseHex(match[1]);
  });
}

function oklabLightness([r, g, b]: Rgb): number {
  const linear = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

describe("parseHex", () => {
  it("parses #rrggbb with surrounding whitespace", () => {
    expect(parseHex(" #0e0D1c ")).toEqual([14, 13, 28]);
  });

  it("rejects other formats", () => {
    expect(() => parseHex("rgb(1 2 3)")).toThrow();
  });
});

describe("buildLut", () => {
  const stops: Rgb[] = [
    [0, 0, 255],
    [0, 0, 0],
    [255, 0, 0],
  ];
  const lut = buildLut(stops, 128);
  const at = (byte: number) => Array.from(lut.subarray(byte * 4, byte * 4 + 4));

  it("maps zeroByte exactly to the middle stop", () => {
    expect(at(128)).toEqual([0, 0, 0, 255]);
  });

  it("reaches the end stops 127 bytes either side of zero", () => {
    expect(at(1)).toEqual([0, 0, 255, 255]);
    expect(at(255)).toEqual([255, 0, 0, 255]);
    expect(at(0)).toEqual([0, 0, 255, 255]);
  });

  it("builds a legend gradient spanning the signed range", () => {
    const css = lutToCss(lut, 128, 3);
    expect(css).toBe(
      "linear-gradient(to right, rgb(0 0 255) 0.0%, rgb(0 0 0) 50.0%, rgb(255 0 0) 100.0%)",
    );
  });
});

describe("diverging tokens", () => {
  const lightness = tokenStops().map(oklabLightness);
  const middle = (DIVERGING_STOP_COUNT - 1) / 2;

  it("has its darkest stop at the 0 K midpoint", () => {
    expect(Math.min(...lightness)).toBe(lightness[middle]);
  });

  it("gets lighter monotonically towards both ends", () => {
    for (let i = 1; i <= middle; i++) {
      expect(lightness[middle - i]).toBeGreaterThan(lightness[middle - i + 1]);
      expect(lightness[middle + i]).toBeGreaterThan(lightness[middle + i - 1]);
    }
  });

  it("matches lightness on both sides to within 0.01", () => {
    for (let i = 1; i <= middle; i++) {
      expect(Math.abs(lightness[middle - i] - lightness[middle + i])).toBeLessThan(0.01);
    }
  });
});
