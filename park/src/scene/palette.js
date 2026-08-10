import * as THREE from "three";
import { range } from "./rng.js";

export const OUTLINE_COLOR = 0x21202b;

// Saturated, toy-like district palettes. Each zone samples a hue inside its
// district band so neighbouring buildings read as distinct but related.
export const DISTRICT_PALETTE = {
  grammar: {
    hue: [0.965, 0.055], // crimson -> orange
    sat: [0.72, 0.9],
    light: [0.5, 0.62],
    pad: 0xe8b4a0,
    padEdge: 0xc4705a,
    label: "#d92b3a",
  },
  vocab: {
    hue: [0.28, 0.44], // grass -> teal
    sat: [0.6, 0.85],
    light: [0.42, 0.55],
    pad: 0xa8d99b,
    padEdge: 0x5f9e57,
    label: "#1f9e52",
  },
  examskill: {
    hue: [0.55, 0.72], // azure -> violet
    sat: [0.62, 0.88],
    light: [0.48, 0.62],
    pad: 0xa8c4e8,
    padEdge: 0x5578b0,
    label: "#2f6fd0",
  },
};

export const ROOF_COLORS = [
  0x2f4858, // deep teal
  0x7b2d4e, // plum
  0xb5502f, // rust
  0x2d3f7b, // navy
  0x2f6b3f, // forest
  0x8a4b1f, // terracotta
];
export const TRIM_COLORS = [0xfff3d6, 0xffe9b0, 0xf7f2e8];

export function zoneColor(zone, rng) {
  const p = DISTRICT_PALETTE[zone.category];
  const c = new THREE.Color();
  c.setHSL(range(rng, p.hue[0], p.hue[1]) % 1, range(rng, p.sat[0], p.sat[1]), range(rng, p.light[0], p.light[1]));
  return c;
}

// Stubs read as "not built yet" through a softer, chalkier tint — but they keep
// most of their hue, so the districts still look like a colourful park.
export function muted(color) {
  const c = color.clone();
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s * 0.72, Math.min(hsl.l * 1.02 + 0.06, 0.66));
  return c;
}

export function shade(color, amount) {
  const c = color.clone();
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l + amount, 0.05, 0.95));
  return c;
}
