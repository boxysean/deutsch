// 2D palette. Each solid gets three flat face tones (top / left / right) — the
// classic isometric shading that reads as form without any lighting maths.

export const OUTLINE = "#221f2e";

function hslToHex(h, s, l) {
  h = ((h % 1) + 1) % 1;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hsl(h, s, l) {
  return hslToHex(h, s, l);
}

// One base hue -> the three faces of a solid.
export function faces(h, s, l) {
  return {
    top: hslToHex(h, s, Math.min(l + 0.16, 0.93)),
    left: hslToHex(h, s, Math.max(l - 0.14, 0.06)),
    right: hslToHex(h, s * 0.95, l),
  };
}

export const DISTRICT = {
  grammar: {
    label: "#d92b3a",
    hue: [0.96, 0.06],
    sat: [0.62, 0.82],
    light: [0.46, 0.58],
    plot: hslToHex(0.02, 0.38, 0.68),
    plotAlt: hslToHex(0.02, 0.36, 0.64),
  },
  vocab: {
    label: "#1f9e52",
    hue: [0.27, 0.44],
    sat: [0.5, 0.72],
    light: [0.4, 0.52],
    plot: hslToHex(0.22, 0.42, 0.66),
    plotAlt: hslToHex(0.22, 0.40, 0.62),
  },
  examskill: {
    label: "#2f6fd0",
    hue: [0.55, 0.71],
    sat: [0.52, 0.78],
    light: [0.44, 0.58],
    plot: hslToHex(0.58, 0.38, 0.70),
    plotAlt: hslToHex(0.58, 0.36, 0.66),
  },
};

export const GROUND = {
  grass: "#5fae5a",
  grassAlt: "#6ab863",
  path: "#d9c08a",
  pathAlt: "#d2b881",
  plaza: "#e8d7a8",
  water: "#3d84ad",
};

export const ROOF_HUES = [0.02, 0.08, 0.55, 0.62, 0.92, 0.34];
export const TRIM = "#fbf3e0";
