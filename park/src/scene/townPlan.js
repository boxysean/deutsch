import { ZONES } from "../data/zones.js";
import { PLAZA } from "../data/categories.js";

// Every road runs along one of the eight 45° compass directions. In this
// isometric view world diagonals (NE/NW/SE/SW) read as straight horizontal or
// vertical streets on screen, and the world axes (N/S/E/W) read as the classic
// isometric diagonals — so the town stays on a tidy 45° grid either way.
const S2 = Math.SQRT1_2;
const DIRS = {
  N: { x: 0, z: -1 },
  S: { x: 0, z: 1 },
  E: { x: 1, z: 0 },
  W: { x: -1, z: 0 },
  NE: { x: S2, z: -S2 },
  NW: { x: -S2, z: -S2 },
  SE: { x: S2, z: S2 },
  SW: { x: -S2, z: S2 },
};

// Each district is one street running through it, with houses lining both
// sides. A district whose list contains the townhall puts it at the far end of
// the street as the terminus landmark.
const STREETS = {
  grammar: {
    segments: [{ dir: "NW", length: 78 }],
    firstStation: 13,
    spacing: 12,
    setback: 7.5,
  },
  vocab: {
    segments: [
      { dir: "NE", length: 62 },
      { dir: "E", length: 60 },
    ],
    firstStation: 13,
    spacing: 11.5,
    setback: 7.5,
  },
  examskill: {
    segments: [{ dir: "S", length: 34 }],
    firstStation: 13,
    spacing: 12,
    setback: 7.5,
  },
};

function pathTotal(segments) {
  return segments.reduce((sum, s) => sum + s.length, 0);
}

// Walk the polyline to the point `t` units along it.
function pointAt(segments, t) {
  let remaining = t;
  let x = 0;
  let z = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const dir = DIRS[seg.dir];
    if (remaining <= seg.length || i === segments.length - 1) {
      return { x: x + dir.x * remaining, z: z + dir.z * remaining, dir };
    }
    x += dir.x * seg.length;
    z += dir.z * seg.length;
    remaining -= seg.length;
  }
  return { x, z, dir: DIRS[segments[0].dir] };
}

function buildPlan() {
  const districts = {};
  const zones = new Map();

  Object.entries(STREETS).forEach(([category, street]) => {
    const list = ZONES.filter((z) => z.category === category);
    if (list.length === 0) return;

    // Pull the landmark out so it can anchor the end of the street.
    const terminusZone = list.find((z) => z.archetype === "townhall") || null;
    const lining = list.filter((z) => z !== terminusZone);
    const stationCount = Math.ceil(lining.length / 2);

    const stations = [];
    for (let i = 0; i < stationCount; i++) {
      const t = street.firstStation + i * street.spacing;
      const p = pointAt(street.segments, t);
      stations.push({ t, ...p });
    }

    lining.forEach((zone, i) => {
      const station = stations[Math.floor(i / 2)];
      const side = i % 2 === 0 ? 1 : -1; // alternate sides of the street
      // perpendicular to the street direction
      const perp = { x: -station.dir.z * side, z: station.dir.x * side };
      const x = station.x + perp.x * street.setback;
      const z = station.z + perp.z * street.setback;
      zones.set(zone.id, {
        x,
        z,
        // face the street (buildings are modelled front-on +Z)
        facing: Math.atan2(station.x - x, station.z - z),
        driveway: { from: { x: station.x, z: station.z }, to: { x, z } },
      });
    });

    let terminus = null;
    if (terminusZone) {
      const t = street.firstStation + stationCount * street.spacing;
      const p = pointAt(street.segments, t);
      zones.set(terminusZone.id, {
        x: p.x,
        z: p.z,
        // face back down the street toward the plaza
        facing: Math.atan2(-p.dir.x, -p.dir.z),
        driveway: null,
      });
      terminus = { x: p.x, z: p.z, t };
    }

    const endT = terminus ? terminus.t + 4 : street.firstStation + (stationCount - 1) * street.spacing + 8;
    districts[category] = {
      segments: street.segments,
      setback: street.setback,
      stations,
      terminus,
      endT: Math.min(endT, pathTotal(street.segments)),
      startT: PLAZA.radius,
    };
  });

  return { districts, zones };
}

export const TOWN_PLAN = buildPlan();

export function zonePlacement(zoneId) {
  return TOWN_PLAN.zones.get(zoneId) || { x: 0, z: 0, facing: 0 };
}

// Sample points along a district's street, for drawing and for hit-testing.
export function streetPoints(district, step = 2) {
  const pts = [];
  for (let t = district.startT; t <= district.endT; t += step) {
    pts.push(pointAt(district.segments, t));
  }
  pts.push(pointAt(district.segments, district.endT));
  return pts;
}

export function pointAlong(district, t) {
  return pointAt(district.segments, t);
}

export function townBounds() {
  let minX = -PLAZA.radius;
  let maxX = PLAZA.radius;
  let minZ = -PLAZA.radius;
  let maxZ = PLAZA.radius;
  TOWN_PLAN.zones.forEach((p) => {
    minX = Math.min(minX, p.x - 5);
    maxX = Math.max(maxX, p.x + 5);
    minZ = Math.min(minZ, p.z - 5);
    maxZ = Math.max(maxZ, p.z + 5);
  });
  return { minX, maxX, minZ, maxZ };
}

export function framingPoints() {
  const points = [
    { x: PLAZA.x - PLAZA.radius, z: PLAZA.z - PLAZA.radius },
    { x: PLAZA.x + PLAZA.radius, z: PLAZA.z + PLAZA.radius },
  ];
  TOWN_PLAN.zones.forEach((p) => {
    points.push({ x: p.x - 4, z: p.z - 4 });
    points.push({ x: p.x + 4, z: p.z + 4 });
  });
  return points;
}

// Keep scenery off the streets, verges and house plots.
export function isTownArea(x, z, margin = 0) {
  if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.radius + 2 + margin) return true;

  for (const p of TOWN_PLAN.zones.values()) {
    if (Math.hypot(x - p.x, z - p.z) < 5.5 + margin) return true;
  }

  for (const d of Object.values(TOWN_PLAN.districts)) {
    const pts = streetPoints(d, 3);
    for (const pt of pts) {
      if (Math.hypot(x - pt.x, z - pt.z) < d.setback + 2 + margin) return true;
    }
  }
  return false;
}
