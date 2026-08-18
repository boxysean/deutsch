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

// The district colours are an ENCODING, not decoration: red/green/blue is what
// tells grammar from vocabulary from exam practice, on the map, in the legend
// and in the drawer. The order was picked to survive deuteranopia. So these are
// identical on every level — a learner who has read the legend once should not
// have to read it again after switching towns.
export const DISTRICT = {
  grammar: {
    label: "#d92b3a",
    hue: [0.96, 0.06],
    sat: [0.62, 0.82],
    light: [0.46, 0.58],
  },
  vocab: {
    label: "#1f9e52",
    hue: [0.27, 0.44],
    sat: [0.5, 0.72],
    light: [0.4, 0.52],
  },
  examskill: {
    label: "#2f6fd0",
    hue: [0.55, 0.71],
    sat: [0.52, 0.78],
    light: [0.44, 0.58],
  },
  info: {
    label: "#8a5cc4",
    hue: [0.72, 0.78],
    sat: [0.4, 0.5],
    light: [0.5, 0.6],
  },
};

// What DOES change per level is the land the districts sit on. A2 is high
// summer: warm sandy paths, deep green grass. A1 is an earlier, cooler season —
// greyer stone, younger grass, colder water — so a glance at the ground tells
// you which town you are in, without touching what the colours MEAN.
const TERRAIN = {
  a2: {
    ground: {
      grass: "#5fae5a",
      grassAlt: "#6ab863",
      path: "#d9c08a",
      pathAlt: "#d2b881",
      plaza: "#e8d7a8",
      water: "#3d84ad",
    },
    plots: {
      grammar: [hslToHex(0.02, 0.38, 0.68), hslToHex(0.02, 0.36, 0.64)],
      vocab: [hslToHex(0.22, 0.42, 0.66), hslToHex(0.22, 0.4, 0.62)],
      examskill: [hslToHex(0.58, 0.38, 0.7), hslToHex(0.58, 0.36, 0.66)],
      info: [hslToHex(0.72, 0.3, 0.7), hslToHex(0.72, 0.28, 0.66)],
    },
    roofHues: [0.02, 0.08, 0.55, 0.62, 0.92, 0.34],
  },
  a1: {
    ground: {
      grass: "#67b477",
      grassAlt: "#72bd81",
      path: "#cdc3a6",
      pathAlt: "#c5bb9d",
      plaza: "#ded5bb",
      water: "#3f8fb4",
    },
    // The same four hues, lifted and softened: still recognisably the red,
    // green, blue and purple districts, just a paler ground under them.
    plots: {
      grammar: [hslToHex(0.02, 0.3, 0.74), hslToHex(0.02, 0.28, 0.7)],
      vocab: [hslToHex(0.24, 0.34, 0.72), hslToHex(0.24, 0.32, 0.68)],
      examskill: [hslToHex(0.56, 0.32, 0.76), hslToHex(0.56, 0.3, 0.72)],
      info: [hslToHex(0.74, 0.26, 0.76), hslToHex(0.74, 0.24, 0.72)],
    },
    // Cooler roofs: slate, teal and blue-grey rather than A2's warm tiles. One
    // warm red stays in the set so the street still has some variety — an
    // all-blue town reads as a bug rather than a season.
    roofHues: [0.54, 0.58, 0.62, 0.47, 0.02, 0.56],
  },
  b1: {
    // Later in the year than A2: grass gone gold at the edges, darker stone
    // underfoot, colder water. Third season, same encoding — the districts are
    // still red / green / blue, only the land they stand on has moved on.
    ground: {
      grass: "#7ba650",
      grassAlt: "#86af5b",
      path: "#c9b48c",
      pathAlt: "#c1ac83",
      plaza: "#ded0ab",
      water: "#35789f",
    },
    plots: {
      grammar: [hslToHex(0.02, 0.34, 0.66), hslToHex(0.02, 0.32, 0.62)],
      vocab: [hslToHex(0.18, 0.4, 0.64), hslToHex(0.18, 0.38, 0.6)],
      examskill: [hslToHex(0.6, 0.34, 0.68), hslToHex(0.6, 0.32, 0.64)],
      info: [hslToHex(0.78, 0.28, 0.68), hslToHex(0.78, 0.26, 0.64)],
    },
    // Autumn tiles: deep reds and browns, one slate so the street has contrast.
    roofHues: [0.03, 0.06, 0.09, 0.98, 0.58, 0.11],
  },
};

export function terrainFor(level) {
  return TERRAIN[level] || TERRAIN.a2;
}

// The A2 terrain under its old name, for anything that has no level to hand.
export const GROUND = TERRAIN.a2.ground;
export const ROOF_HUES = TERRAIN.a2.roofHues;
export const TRIM = "#fbf3e0";
