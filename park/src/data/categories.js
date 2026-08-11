export const TILE = 7;

// The three districts of Deutsche Welt. Only `label` and `color` are read now
// (by the HUD legend and the zone sheet) — the anchor/grid fields predate the
// 2D isometric rewrite, which lays the town out in src/iso/world.js.
export const CATEGORIES = {
  grammar: {
    label: "Grammatik",
    color: 0xd92b3a,
    anchor: { x: -46, z: -34 },
    cols: 4,
    rows: 3,
  },
  vocab: {
    label: "Wortschatz",
    color: 0x1f9e52,
    anchor: { x: 15, z: -32 },
    cols: 5,
    rows: 4,
  },
  examskill: {
    label: "Prüfungsteile",
    color: 0x2f6fd0,
    anchor: { x: -6.5, z: 20 },
    cols: 2,
    rows: 2,
  },
  info: {
    label: "Dom",
    color: 0x8a5cc4,
    anchor: { x: 0, z: 0 },
    cols: 1,
    rows: 1,
  },
};

export const PLAZA = { x: 0, z: 0, radius: 6 };
