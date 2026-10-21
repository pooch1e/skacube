/**
 * Tests for fitDistance — the bounding sphere must fit the narrower field of
 * view, so tall panels push the camera further back than wide ones.
 */
import { describe, expect, it } from "vitest";
import { fitDistance } from "./camera";

const cube: [number, number, number] = [1, 1, 1];
const radius = Math.sqrt(3) / 2;

describe("fitDistance", () => {
  it("fits the vertical field of view on a wide panel", () => {
    expect(fitDistance(cube, 60, 2, 1)).toBeCloseTo(radius / Math.sin(Math.PI / 6), 12);
  });

  it("is limited by the horizontal field of view on a tall panel", () => {
    expect(fitDistance(cube, 35, 0.75)).toBeGreaterThan(fitDistance(cube, 35, 1.5));
  });

  it("is the same for every aspect at or above 1", () => {
    expect(fitDistance(cube, 35, 1)).toBeCloseTo(fitDistance(cube, 35, 3), 12);
  });

  it("applies the margin", () => {
    expect(fitDistance(cube, 35, 1, 1.2) / fitDistance(cube, 35, 1, 1)).toBeCloseTo(1.2, 12);
  });
});
