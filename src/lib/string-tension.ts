// Standard music-wire (steel) density, in lb/in³ — a physical constant, not
// manufacturer-specific data. Used to derive unit weight for plain
// (unwound) strings directly from their diameter.
const STEEL_DENSITY_LB_PER_IN3 = 0.283;

/**
 * Unit weight (lb/inch) of a solid steel wire of the given diameter.
 * Exact for plain/unwound strings. For wound strings this overstates
 * unit weight (and therefore tension) because the wrap-over-core
 * construction is less dense than solid steel — callers should treat it
 * as a rough upper-bound estimate unless the manufacturer's actual unit
 * weight is supplied.
 */
export function estimateUnitWeight(gaugeInches: number): number {
  const radius = gaugeInches / 2;
  return STEEL_DENSITY_LB_PER_IN3 * Math.PI * radius * radius;
}

/**
 * String tension in pounds, via the standard formula:
 * T = UW × (2 × L × f)² / 386.4
 * where UW is unit weight (lb/in), L is scale length (in), f is
 * frequency (Hz), and 386.4 is gravitational acceleration in in/s².
 */
export function calcTensionLbs(params: {
  unitWeight: number;
  scaleLengthInches: number;
  frequencyHz: number;
}): number {
  const { unitWeight, scaleLengthInches, frequencyHz } = params;
  const term = 2 * scaleLengthInches * frequencyHz;
  return (unitWeight * term * term) / 386.4;
}

export const LBS_TO_KG = 0.453592;
