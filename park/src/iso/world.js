import { ZONES } from "../data/zones.js";
import { makeRng, pick, range } from "./rng.js";
import { DISTRICT, ROOF_HUES } from "./palette.js";

// The town is laid out on an integer tile grid. Streets run along the grid
// axes, which is what gives the classic isometric town look (and matches how
// RollerCoaster Tycoon lays out its paths).

export const PLAZA = { tx: 0, ty: 0, radius: 2 };

const STREETS = {
  grammar: {
    segments: [{ dir: [0, -1], len: 24 }],
    firstStation: 6,
    spacing: 3,
    offset: 2,
  },
  vocab: {
    segments: [
      { dir: [1, 0], len: 18 },
      { dir: [0, 1], len: 20 },
    ],
    firstStation: 6,
    spacing: 3,
    offset: 2,
  },
  examskill: {
    segments: [{ dir: [-1, 0], len: 12 }],
    firstStation: 6,
    spacing: 3,
    offset: 2,
  },
};

function walk(segments) {
  const pts = [{ tx: PLAZA.tx, ty: PLAZA.ty, dir: segments[0].dir }];
  let tx = PLAZA.tx;
  let ty = PLAZA.ty;
  segments.forEach((seg) => {
    for (let i = 0; i < seg.len; i++) {
      tx += seg.dir[0];
      ty += seg.dir[1];
      pts.push({ tx, ty, dir: seg.dir });
    }
  });
  return pts;
}

function buildingFor(zone) {
  const rng = makeRng(zone.id + "|iso");
  const pal = DISTRICT[zone.category];
  const built = zone.status === "built";

  const hue = range(rng, pal.hue[0], pal.hue[1]);
  const sat = built ? range(rng, pal.sat[0], pal.sat[1]) : range(rng, pal.sat[0], pal.sat[1]) * 0.45;
  const light = built ? range(rng, pal.light[0], pal.light[1]) : range(rng, pal.light[0], pal.light[1]) + 0.12;

  const isLandmark = zone.archetype === "townhall";
  const isPavilion = zone.archetype === "pavilion";

  return {
    hue,
    sat,
    light,
    roofHue: pick(rng, ROOF_HUES),
    roofSat: built ? 0.55 : 0.24,
    roofLight: built ? 0.36 : 0.5,
    height: isLandmark ? 4 : isPavilion ? 3 : Math.round(range(rng, 2, 3.4)),
    roofKind: isLandmark
      ? "pyramid"
      : pick(rng, ["gable", "pyramid", "gable", "flat", "pyramid"]),
    roofH: isLandmark ? 2.2 : range(rng, 1.0, 1.7),
    footprint: isLandmark ? 3 : 2,
    chimney: rng() > 0.55,
    awning: !isLandmark && zone.category === "vocab" && rng() > 0.5,
    flag: isLandmark || isPavilion,
    windows: Math.round(range(rng, 1, 3)),
    built,
  };
}

function treeAt(tx, ty, rng) {
  const kind = pick(rng, ["pine", "round", "round", "blossom", "bush"]);
  return {
    kind: "tree",
    tx,
    ty,
    variant: kind,
    hue: range(rng, 0.28, 0.42),
    sat: range(rng, 0.42, 0.66),
    light: range(rng, 0.26, 0.4),
    blossom: pick(rng, [0.95, 0.12, 0.78, 0.5]),
    scale: range(rng, 0.85, 1.25),
  };
}

export function buildWorld() {
  const tiles = new Map();
  const objects = [];
  const zonePlacement = new Map();

  const key = (tx, ty) => `${tx},${ty}`;
  const setTile = (tx, ty, type, district) => {
    tiles.set(key(tx, ty), { tx, ty, type, district });
  };

  // --- plaza ---
  for (let dx = -PLAZA.radius; dx <= PLAZA.radius; dx++) {
    for (let dy = -PLAZA.radius; dy <= PLAZA.radius; dy++) {
      setTile(PLAZA.tx + dx, PLAZA.ty + dy, "plaza");
    }
  }

  // --- streets, plots and houses ---
  Object.entries(STREETS).forEach(([category, street]) => {
    const list = ZONES.filter((z) => z.category === category);
    if (!list.length) return;

    const path = walk(street.segments);
    path.forEach((p, i) => {
      if (i === 0) return;
      setTile(p.tx, p.ty, "path", category);
    });

    const landmark = list.find((z) => z.archetype === "townhall") || null;
    const lining = list.filter((z) => z !== landmark);
    const stationCount = Math.ceil(lining.length / 2);

    lining.forEach((zone, i) => {
      const stationIndex = street.firstStation + Math.floor(i / 2) * street.spacing;
      const station = path[Math.min(stationIndex, path.length - 1)];
      const side = i % 2 === 0 ? 1 : -1;
      // perpendicular to the street direction
      const perp = [-station.dir[1] * side, station.dir[0] * side];

      const tx = station.tx + perp[0] * street.offset;
      const ty = station.ty + perp[1] * street.offset;

      // driveway tile between street and plot
      setTile(station.tx + perp[0], station.ty + perp[1], "path", category);

      // garden plot around the house
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          setTile(tx + dx, ty + dy, "plot", category);
        }
      }

      zonePlacement.set(zone.id, { tx, ty });
      objects.push({ kind: "building", tx, ty, zone, spec: buildingFor(zone) });
    });

    if (landmark) {
      const idx = Math.min(street.firstStation + stationCount * street.spacing, path.length - 1);
      const end = path[idx];
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          setTile(end.tx + dx, end.ty + dy, "plot", category);
        }
      }
      zonePlacement.set(landmark.id, { tx: end.tx, ty: end.ty });
      objects.push({ kind: "building", tx: end.tx, ty: end.ty, zone: landmark, spec: buildingFor(landmark) });
    }
  });

  // --- grass everywhere else, plus deterministic scenery ---
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  tiles.forEach((t) => {
    minX = Math.min(minX, t.tx);
    maxX = Math.max(maxX, t.tx);
    minY = Math.min(minY, t.ty);
    maxY = Math.max(maxY, t.ty);
  });
  const pad = 7;
  minX -= pad; maxX += pad; minY -= pad; maxY += pad;

  const rng = makeRng("iso-scenery");
  for (let tx = minX; tx <= maxX; tx++) {
    for (let ty = minY; ty <= maxY; ty++) {
      if (!tiles.has(key(tx, ty))) {
        setTile(tx, ty, "grass");
        // scatter trees on open grass, keeping a gap around the built area
        if (rng() < 0.13) objects.push(treeAt(tx, ty, rng));
      }
    }
  }

  const bounds = { minX, maxX, minY, maxY };
  return { tiles, objects, zonePlacement, bounds };
}
