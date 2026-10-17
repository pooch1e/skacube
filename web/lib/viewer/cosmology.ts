/**
 * Lightcone proportions — sizes the 3D box from comoving distances so the
 * frequency depth and the sky width keep their real ratio.
 *
 * Flat ΛCDM with Planck 2018 H0 and Ωm, matter and Λ only: radiation shifts
 * distances by under 0.25% at z ≈ 12, far below what a box shape can show.
 * A lightcone is really a frustum (the field widens with distance); the box
 * takes its transverse size at the mean comoving distance.
 */

const SPEED_OF_LIGHT_KM_S = 299792.458;
export const H0_KM_S_MPC = 67.66;
export const OMEGA_M = 0.30966;
const OMEGA_LAMBDA = 1 - OMEGA_M;
const INTEGRATION_STEPS = 2000;

function inverseE(z: number): number {
  return 1 / Math.sqrt(OMEGA_M * (1 + z) ** 3 + OMEGA_LAMBDA);
}

/** Line-of-sight comoving distance in Mpc, by Simpson's rule. */
export function comovingDistanceMpc(z: number): number {
  const h = z / INTEGRATION_STEPS;
  let sum = inverseE(0) + inverseE(z);
  for (let i = 1; i < INTEGRATION_STEPS; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * inverseE(i * h);
  }
  return (SPEED_OF_LIGHT_KM_S / H0_KM_S_MPC) * (h / 3) * sum;
}

export type LightconeBox = { widthMpc: number; heightMpc: number; depthMpc: number };

export function lightconeBox(field: {
  raDeg: number;
  decDeg: number;
  zNear: number;
  zFar: number;
}): LightconeBox {
  const near = comovingDistanceMpc(Math.min(field.zNear, field.zFar));
  const far = comovingDistanceMpc(Math.max(field.zNear, field.zFar));
  const mean = (near + far) / 2;
  const toRad = Math.PI / 180;
  return {
    widthMpc: Math.abs(field.raDeg) * toRad * mean,
    heightMpc: Math.abs(field.decDeg) * toRad * mean,
    depthMpc: far - near,
  };
}

/** The box scaled so its longest side is 1. */
export function normalisedBox(box: LightconeBox): [number, number, number] {
  const longest = Math.max(box.widthMpc, box.heightMpc, box.depthMpc);
  return [box.widthMpc / longest, box.heightMpc / longest, box.depthMpc / longest];
}
