/**
 * Camera framing — how far back a perspective camera must sit so the whole
 * box fits the view, whichever of the vertical or horizontal field of view is
 * narrower (a tall panel is limited horizontally).
 */

export function fitDistance(
  box: readonly [number, number, number],
  verticalFovDeg: number,
  aspect: number,
  margin = 1.08,
): number {
  const radius = Math.hypot(box[0], box[1], box[2]) / 2;
  const halfVertical = ((verticalFovDeg / 2) * Math.PI) / 180;
  const halfHorizontal = Math.atan(Math.tan(halfVertical) * aspect);
  return (margin * radius) / Math.sin(Math.min(halfVertical, halfHorizontal));
}
