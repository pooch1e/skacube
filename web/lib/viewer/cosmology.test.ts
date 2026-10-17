/**
 * Tests for comoving distances and box proportions. Reference distances come
 * from astropy: FlatLambdaCDM(H0=67.66, Om0=0.30966, Tcmb0=0).comoving_distance.
 */
import { describe, expect, it } from "vitest";
import { comovingDistanceMpc, lightconeBox, normalisedBox } from "./cosmology";

const astropyReference: [number, number][] = [
  [6.124571347870371, 8493.44],
  [9.0, 9421.92],
  [12.383285699396689, 10104.23],
];

describe("comovingDistanceMpc", () => {
  it.each(astropyReference)("matches astropy at z = %f to 0.01%%", (z, mpc) => {
    expect(Math.abs(comovingDistanceMpc(z) / mpc - 1)).toBeLessThan(1e-4);
  });

  it("is zero at z = 0", () => {
    expect(comovingDistanceMpc(0)).toBe(0);
  });
});

describe("lightconeBox", () => {
  const box = lightconeBox({
    raDeg: -8,
    decDeg: 8,
    zNear: 6.124571347870371,
    zFar: 12.383285699396689,
  });

  it("sizes the real cube at about 1298 × 1298 × 1611 Mpc", () => {
    expect(box.widthMpc).toBeCloseTo(1298.4, 0);
    expect(box.heightMpc).toBeCloseTo(1298.4, 0);
    expect(box.depthMpc).toBeCloseTo(1610.8, 0);
  });

  it("accepts the redshift range in either order", () => {
    expect(
      lightconeBox({ raDeg: 8, decDeg: 8, zNear: 12.383285699396689, zFar: 6.124571347870371 }),
    ).toEqual(box);
  });

  it("normalises so the longest side is 1", () => {
    const [x, y, z] = normalisedBox(box);
    expect(z).toBe(1);
    expect(x).toBeCloseTo(y, 12);
    expect(x).toBeCloseTo(0.806, 3);
  });
});
