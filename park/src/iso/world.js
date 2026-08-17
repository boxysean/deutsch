import { getZones } from "../data/zones/index.js";
import { makeRng, pick, range } from "./rng.js";
import { DISTRICT, terrainFor } from "./palette.js";
import { getLevel } from "../data/levels.js";

// The town is laid out on an integer tile grid. Streets run along the grid
// axes, which is what gives the classic isometric town look (and matches how
// RollerCoaster Tycoon lays out its paths).

export const PLAZA = { tx: 0, ty: 0, radius: 3 };

// firstStation is how far down a street the first house sits. It doubles as the
// breathing room around the Hauptplatz: the Dom needs open square around it, so
// the streets run clear of the plaza before any house appears.
const STREETS = {
  grammar: {
    segments: [{ dir: [0, -1], len: 40 }],
    firstStation: 10,
    spacing: 6,
    offset: 4,
  },
  vocab: {
    segments: [
      { dir: [1, 0], len: 30 },
      { dir: [0, 1], len: 32 },
    ],
    firstStation: 10,
    spacing: 6,
    offset: 4,
  },
  examskill: {
    segments: [{ dir: [-1, 0], len: 20 }],
    firstStation: 10,
    spacing: 6,
    offset: 4,
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
  const ROOF_HUES = terrainFor(getLevel()).roofHues;
  const built = zone.status === "built";

  const isLandmark = zone.archetype === "townhall";
  const isPavilion = zone.archetype === "pavilion";

  // Roughly half the village is a whitewashed Bavarian farmhouse; the rest are
  // colour-washed town houses, so the districts still read by colour.
  const style = isLandmark || isPavilion ? "civic" : pick(rng, ["bavarian", "bavarian", "townhouse", "townhouse", "bavarian"]);

  const hue = range(rng, pal.hue[0], pal.hue[1]);
  let sat = built ? range(rng, pal.sat[0], pal.sat[1]) : range(rng, pal.sat[0], pal.sat[1]) * 0.45;
  let light = built ? range(rng, pal.light[0], pal.light[1]) : range(rng, pal.light[0], pal.light[1]) + 0.12;

  if (style === "bavarian") {
    // limewashed cream walls — the district hue survives only as a faint tint
    sat *= 0.22;
    light = built ? 0.84 : 0.88;
  }

  return {
    hue,
    sat,
    light,
    style,
    // Bavarian farmhouses wear the classic weathered red-brown shingle.
    roofHue: style === "bavarian" ? range(rng, 0.03, 0.07) : pick(rng, ROOF_HUES),
    roofSat: style === "bavarian" ? 0.42 : built ? 0.55 : 0.24,
    roofLight: style === "bavarian" ? 0.34 : built ? 0.36 : 0.5,
    // Low and broad for a farmhouse, taller and narrower for a town house.
    height: isLandmark ? 3.4 : isPavilion ? 2.6 : style === "bavarian" ? range(rng, 1.5, 1.9) : range(rng, 2.1, 2.8),
    // Alpine vernacular: overwhelmingly chalets and steep gables, never flat.
    roofKind: isLandmark ? "pyramid" : style === "bavarian" ? "chalet" : pick(rng, ["chalet", "gable", "gable"]),
    // Whitewashed with painted panels, or half-timbered.
    wallStyle: style === "bavarian" ? pick(rng, ["luftl", "luftl", "fachwerk"]) : pick(rng, ["plain", "fachwerk", "luftl"]),
    flowerBoxes: style === "bavarian" ? true : rng() > 0.4,
    roofStones: style === "bavarian" ? rng() > 0.35 : false,
    woodpile: style === "bavarian" ? rng() > 0.35 : rng() > 0.75,
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
  const ZONES = getZones();
  // Landmarks are looked up by archetype rather than by id: each level has its
  // own Dom, Fernsehturm and Riesenrad, whose ids differ by level prefix but
  // whose place on the map is the same.
  const byArchetype = (a) => ZONES.find((z) => z.archetype === a);
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
    // Houses are laid out in route order, so walking a street walks the plan.
    const list = ZONES.filter((z) => z.category === category).sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    if (!list.length) return;

    const path = walk(street.segments);
    path.forEach((p, i) => {
      if (i === 0) return;
      setTile(p.tx, p.ty, "path", category);
    });

    // Every zone lines the street in route order, so step 1 is the house
    // nearest the plaza and the walk up the street is the plan. The
    // Grammatik-Fundament used to be pulled out and parked at the far end,
    // which put step 1 furthest from the start.
    list.forEach((zone, i) => {
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

      // a civic landmark stands on a bigger plot, wherever the route puts it
      const pad = zone.archetype === "townhall" ? 2 : 1;
      for (let dx = -pad; dx <= pad; dx++) {
        for (let dy = -pad; dy <= pad; dy++) {
          setTile(tx + dx, ty + dy, "plot", category);
        }
      }

      zonePlacement.set(zone.id, { tx, ty });
      objects.push({ kind: "building", tx, ty, zone, spec: buildingFor(zone) });
    });
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

  // The Dom on the town square: a Stephansdom-style cathedral, and the one
  // clickable thing that isn't a learning zone — it explains the app and the
  // exam. Placed by hand rather than by the street layout.
  const domZone = byArchetype("dom");
  if (domZone) {
    const at = { tx: PLAZA.tx + 3, ty: PLAZA.ty + 3 };
    for (let dx = -1; dx <= 2; dx++) {
      for (let dy = -1; dy <= 2; dy++) setTile(at.tx + dx, at.ty + dy, "plaza");
    }
    zonePlacement.set(domZone.id, at);
    objects.push({
      kind: "building",
      tx: at.tx,
      ty: at.ty,
      zone: domZone,
      // labelLevels lifts the map label clear of the spire, which is drawn far
      // taller than height + roofH would suggest.
      spec: { render: "stephansdom", footprint: 2.6, height: 5.5, roofH: 5, labelLevels: 12, built: true },
    });
  }

  objects.push({ kind: "beertable", tx: PLAZA.tx + 2, ty: PLAZA.ty + 1 });
  objects.push({ kind: "beertable", tx: PLAZA.tx + 1, ty: PLAZA.ty + 3 });
  objects.push({ kind: "pretzel", tx: PLAZA.tx - 1, ty: PLAZA.ty + 2 });

  // Two landmarks are clickable rather than decorative: the Fernsehturm holds
  // the progress dashboard, the Riesenrad the import/export. Both keep the
  // paved apron the decorative monuments get.
  const clickableLandmarks = [
    { archetype: "tower", tx: 21, ty: -16, render: "fernsehturm", height: 10, roofH: 6, labelLevels: 18 },
    { archetype: "wheel", tx: -20, ty: 17, render: "riesenrad", height: 6, roofH: 4, labelLevels: 12 },
    { archetype: "gate", tx: 6, ty: 15, render: "brandenburg", height: 5, roofH: 3, labelLevels: 8 },
    // Out on the open west side rather than up among the grammar houses: the
    // Dom is tall, and at the top of the map its label rides above the spire
    // and straight under the HUD bar when you zoom all the way out.
    { archetype: "cathedral", tx: -23, ty: 5, render: "dom", height: 9, roofH: 6, labelLevels: 16 },
  ];
  clickableLandmarks.forEach((lm) => {
    const zone = byArchetype(lm.archetype);
    if (!zone) return;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) setTile(lm.tx + dx, lm.ty + dy, "plaza");
    }
    claim(lm.tx, lm.ty);
    zonePlacement.set(zone.id, { tx: lm.tx, ty: lm.ty });
    objects.push({
      kind: "building",
      tx: lm.tx,
      ty: lm.ty,
      zone,
      // These are drawn far taller than height + roofH, so the label lift is
      // given explicitly rather than derived.
      spec: {
        render: lm.render,
        footprint: 2,
        height: lm.height,
        roofH: lm.roofH,
        labelLevels: lm.labelLevels,
        built: true,
      },
    });
  });

  // Decorative national landmarks — pure skyline flavour, not clickable.
  // Each gets a small paved apron and sits clear of the streets.
  const monuments = [
    { kind: "castle", tx: -23, ty: -8 }, // Schloss Neuschwanstein
  ];
  monuments.forEach((m) => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) setTile(m.tx + dx, m.ty + dy, "plaza");
    }
    claim(m.tx, m.ty);
    objects.push(m);
  });

  // The Matterhorn towers over the range behind the town — no apron, it's part
  // of the skyline rather than the village.
  objects.push({ kind: "matterhorn", tx: zMinX - back, ty: zMinY - back + 13, scale: 1.15 });

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

  // Trees that ended up on ground later paved over (church apron, monument
  // aprons) are dropped so nothing grows through the masonry.
  const planted = objects.filter((o) => {
    if (o.kind !== "tree") return true;
    const tile = tiles.get(key(o.tx, o.ty));
    return tile && tile.type === "grass";
  });

  const bounds = { minX, maxX, minY, maxY };
  return { tiles, objects: planted, zonePlacement, bounds };
}
