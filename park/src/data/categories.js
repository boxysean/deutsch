export const TILE = 7;

// Three districts clustered tightly around a central plaza. Anchors are the
// top-left cell of each grid; keep them close so the park reads as one place
// rather than three distant islands.
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
};

export const PLAZA = { x: 0, z: 0, radius: 6 };
