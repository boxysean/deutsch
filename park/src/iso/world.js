import { ZONES } from "../data/zones.js";
import { makeRng, pick, range } from "./rng.js";
import { DISTRICT, ROOF_HUES } from "./palette.js";

// The town is laid out on an integer tile grid. Streets run along the grid
// axes, which is what gives the classic isometric town look (and matches how
// RollerCoaster Tycoon lays out its paths).

export const PLAZA = { tx: 0, ty: 0, radius: 2 };

const STREETS = {
  grammar: {
    segments: [{ dir: [0, -1], len: 40 }],
    firstStation: 7,
    spacing: 5,
    offset: 3,
  },
  vocab: {
    segments: [
      { dir: [1, 0], len: 30 },
      { dir: [0, 1], len: 32 },
    ],
    firstStation: 7,
    spacing: 5,
    offset: 3,
  },
  examskill: {
    segments: [{ dir: [-1, 0], len: 20 }],
    firstStation: 7,
    spacing: 5,
    offset: 3,
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
    height: isLandmark ? 3.4 : isPavilion ? 2.6 : range(rng, 1.7, 2.6),
    roofKind: isLandmark
      ? "pyramid"
      : pick(rng, ["gable", "pyramid", "gable", "chalet", "chalet"]),
    roofH: isLandmark ? 1.9 : range(rng, 0.9, 1.4),
    // Smaller than their tile so the plots keep visible space around them.
    footprint: isLandmark ? 2.2 : isPavilion ? 1.7 : range(rng, 1.35, 1.6),
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

      // driveway tiles between street and plot
      for (let d = 1; d < street.offset; d++) {
        setTile(station.tx + perp[0] * d, station.ty + perp[1] * d, "path", category);
      }

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
  const pad = 4;
  minX -= pad; maxX += pad; minY -= pad; maxY += pad;

  const rng = makeRng("iso-scenery");
  const grassTiles = [];
  for (let tx = minX; tx <= maxX; tx++) {
    for (let ty = minY; ty <= maxY; ty++) {
      if (!tiles.has(key(tx, ty))) {
        setTile(tx, ty, "grass");
        grassTiles.push({ tx, ty });
        if (rng() < 0.09) objects.push(treeAt(tx, ty, rng));
      }
    }
  }

  const occupied = new Set(objects.map((o) => key(o.tx, o.ty)));
  const claim = (tx, ty) => {
    if (occupied.has(key(tx, ty))) return false;
    occupied.add(key(tx, ty));
    return true;
  };

  // --- Alpine set dressing --------------------------------------------------

  // A mountain range rising behind the town's two far edges. Anchored to the
  // built area rather than the island edge so it always frames the view.
  let zMinX = Infinity, zMaxX = -Infinity, zMinY = Infinity, zMaxY = -Infinity;
  zonePlacement.forEach((p) => {
    zMinX = Math.min(zMinX, p.tx);
    zMaxX = Math.max(zMaxX, p.tx);
    zMinY = Math.min(zMinY, p.ty);
    zMaxY = Math.max(zMaxY, p.ty);
  });

  const back = 6;
  const ranges = [];
  for (let tx = zMinX - back; tx <= zMaxX + back; tx += 2) {
    ranges.push({ tx, ty: zMinY - back });
  }
  for (let ty = zMinY - back + 2; ty <= zMaxY + back; ty += 2) {
    ranges.push({ tx: zMinX - back, ty });
  }
  ranges.forEach((p, i) => {
    objects.push({
      kind: "mountain",
      tx: p.tx,
      ty: p.ty,
      w: 90 + (i % 3) * 34,
      h: 70 + ((i * 37) % 55),
      seed: i,
    });
  });

  // Village square: Maibaum, the three national flags, a church and a beer garden.
  objects.push({ kind: "maypole", tx: PLAZA.tx, ty: PLAZA.ty });
  objects.push({ kind: "flag", tx: PLAZA.tx - 2, ty: PLAZA.ty - 2, country: "at" });
  objects.push({ kind: "flag", tx: PLAZA.tx + 2, ty: PLAZA.ty - 2, country: "de" });
  objects.push({ kind: "flag", tx: PLAZA.tx - 2, ty: PLAZA.ty + 2, country: "ch" });

  const churchAt = { tx: PLAZA.tx + 3, ty: PLAZA.ty + 3 };
  for (let dx = 0; dx <= 2; dx++) {
    for (let dy = 0; dy <= 2; dy++) setTile(churchAt.tx + dx, churchAt.ty + dy, "plaza");
  }
  objects.push({ kind: "church", ...churchAt });

  objects.push({ kind: "beertable", tx: PLAZA.tx + 2, ty: PLAZA.ty + 1 });
  objects.push({ kind: "beertable", tx: PLAZA.tx + 1, ty: PLAZA.ty + 3 });
  objects.push({ kind: "pretzel", tx: PLAZA.tx - 1, ty: PLAZA.ty + 2 });

  // Villagers strolling the streets.
  const pathTiles = [...tiles.values()].filter((t) => t.type === "path");
  const variants = ["lederhosen", "dirndl", "lederhosen", "hiker", "visitor", "dirndl"];
  for (let i = 0; i < 26 && pathTiles.length; i++) {
    const t = pathTiles[Math.floor(rng() * pathTiles.length)];
    if (!claim(t.tx, t.ty)) continue;
    objects.push({
      kind: "person",
      tx: t.tx,
      ty: t.ty,
      variant: variants[i % variants.length],
      phase: rng() * 6.283,
      drift: rng() > 0.5 ? 1 : -1,
    });
  }

  // Cows out in the meadows, well away from the houses.
  for (let i = 0; i < 14 && grassTiles.length; i++) {
    const t = grassTiles[Math.floor(rng() * grassTiles.length)];
    if (!claim(t.tx, t.ty)) continue;
    objects.push({ kind: "cow", tx: t.tx, ty: t.ty, phase: rng() * 6.283 });
  }

  const bounds = { minX, maxX, minY, maxY };
  return { tiles, objects, zonePlacement, bounds };
}
