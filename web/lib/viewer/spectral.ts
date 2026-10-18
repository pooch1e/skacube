/**
 * Spectral axis — channel ↔ frequency ↔ redshift for the 21 cm line. Each
 * output channel's frequency is the centre of its averaged bin, as written by
 * ingest (`start` is the first bin centre, `step` the bin width).
 */

export const HI_REST_MHZ = 1420.405751768;

export type SpectralAxis = { startMHz: number; stepMHz: number; length: number };

export function frequencyToRedshift(frequencyMHz: number): number {
  return HI_REST_MHZ / frequencyMHz - 1;
}

export function redshiftToFrequency(redshift: number): number {
  return HI_REST_MHZ / (1 + redshift);
}

export function channelFrequency(axis: SpectralAxis, channel: number): number {
  return axis.startMHz + channel * axis.stepMHz;
}

export function channelRedshift(axis: SpectralAxis, channel: number): number {
  return frequencyToRedshift(channelFrequency(axis, channel));
}
