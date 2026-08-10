import { ZONES } from "../data/zones.js";
import { PLAZA } from "../data/categories.js";

// Each district is laid out as a proper little neighbourhood: a spine lane
// leaving the plaza, with short branches ending in cul-de-sac bulbs. Houses ring
// each bulb and face the street, so the districts read as towns rather than
// as a grid of detached boxes.

const DISTRICT_DIR = {
  grammar: { x: -0.79, z: -0.61 },
  vocab: { x: 0.82, z: -0.57 },
  examskill: { x: -0.1, z: 0.99 },
};

const CLUSTER_SIZE = { grammar: 3, vocab: 4, examskill: 4 };

const SPINE_START = 15;
const BULB_SPACING = 17;
const BULB_OFFSET = 14;
const ROAD_INSET = 2.4; // paved bulb radius vs. the ring the houses sit on

function normalize(v) {
  const len = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / len, z: v.z / len };
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildPlan() {
  const districts = {};
  const zones = new Map();

  Object.keys(DISTRICT_DIR).forEach((category) => {
    const list = ZONES.filter((z) => z.category === category);
    if (list.length === 0) return;

    const dir = normalize(DISTRICT_DIR[category]);
    const perp = { x: -dir.z, z: dir.x };
    const clusters = chunk(list, CLUSTER_SIZE[category]);
    const bulbs = [];

    clusters.forEach((cluster, i) => {
      const along = SPINE_START + i * BULB_SPACING;
      const spinePt = { x: dir.x * along, z: dir.z * along };
      // A lone cluster sits on the spine itself (a roundabout at the end of the
      // lane); otherwise bulbs alternate either side like a real subdivision.
      const side = clusters.length === 1 ? 0 : i % 2 === 0 ? 1 : -1;
      const center = {
        x: spinePt.x + perp.x * BULB_OFFSET * side,
        z: spinePt.z + perp.z * BULB_OFFSET * side,
      };

      const ring = 4.2 + cluster.length * 0.82;
      const entryAngle =
        side === 0
          ? Math.atan2(-center.z, -center.x)
          : Math.atan2(spinePt.z - center.z, spinePt.x - center.x);

      cluster.forEach((zone, k) => {
        const spread = Math.PI * 1.45;
        const t = cluster.length === 1 ? 0.5 : k / (cluster.length - 1);
        const a = entryAngle + Math.PI + (t - 0.5) * spread;
        const x = center.x + Math.cos(a) * ring;
        const z = center.z + Math.sin(a) * ring;
        zones.set(zone.id, {
          x,
          z,
          // face the middle of the cul-de-sac (buildings are modelled front-on +Z)
          facing: Math.atan2(center.x - x, center.z - z),
        });
      });

      bulbs.push({ center, spinePt, side, ring, roadRadius: Math.max(ring - ROAD_INSET, 2.4) });
    });

    districts[category] = {
      dir,
      perp,
      bulbs,
      spineLength: SPINE_START + (clusters.length - 1) * BULB_SPACING,
    };
  });

  return { districts, zones };
}

export const TOWN_PLAN = buildPlan();

export function zonePlacement(zoneId) {
  return TOWN_PLAN.zones.get(zoneId) || { x: 0, z: 0, facing: 0 };
}

export function townBounds() {
  let minX = -PLAZA.radius;
  let maxX = PLAZA.radius;
  let minZ = -PLAZA.radius;
  let maxZ = PLAZA.radius;
  TOWN_PLAN.zones.forEach((p) => {
    minX = Math.min(minX, p.x - 4);
    maxX = Math.max(maxX, p.x + 4);
    minZ = Math.min(minZ, p.z - 4);
    maxZ = Math.max(maxZ, p.z + 4);
  });
  return { minX, maxX, minZ, maxZ };
}

// Every point the camera needs to keep in shot: houses, cul-de-sac edges and
// the plaza. Used for auto-framing.
export function framingPoints() {
  const points = [
    { x: PLAZA.x - PLAZA.radius, z: PLAZA.z - PLAZA.radius },
    { x: PLAZA.x + PLAZA.radius, z: PLAZA.z + PLAZA.radius },
  ];
  TOWN_PLAN.zones.forEach((p) => {
    points.push({ x: p.x - 3.5, z: p.z - 3.5 });
    points.push({ x: p.x + 3.5, z: p.z + 3.5 });
  });
  Object.values(TOWN_PLAN.districts).forEach((d) => {
    d.bulbs.forEach((b) => {
      points.push({ x: b.center.x - b.ring, z: b.center.z - b.ring });
      points.push({ x: b.center.x + b.ring, z: b.center.z + b.ring });
    });
  });
  return points;
}

// Used by scenery placement so props don't land on roads, bulbs or houses.
export function isTownArea(x, z, margin = 0) {
  const dx = x - PLAZA.x;
  const dz = z - PLAZA.z;
  if (Math.hypot(dx, dz) < PLAZA.radius + margin) return true;

  return Object.values(TOWN_PLAN.districts).some((d) => {
    // near the spine lane?
    const alongSpine = x * d.dir.x + z * d.dir.z;
    if (alongSpine > 0 && alongSpine < d.spineLength) {
      const lateral = Math.abs(x * d.perp.x + z * d.perp.z);
      if (lateral < 3 + margin) return true;
    }
    return d.bulbs.some((b) => {
      if (Math.hypot(x - b.center.x, z - b.center.z) < b.ring + 3.5 + margin) return true;
      // near the branch lane between spine and bulb
      const bx = b.center.x - b.spinePt.x;
      const bz = b.center.z - b.spinePt.z;
      const lenSq = bx * bx + bz * bz;
      if (lenSq < 0.01) return false;
      const t = Math.max(0, Math.min(1, ((x - b.spinePt.x) * bx + (z - b.spinePt.z) * bz) / lenSq));
      const px = b.spinePt.x + bx * t;
      const pz = b.spinePt.z + bz * t;
      return Math.hypot(x - px, z - pz) < 3 + margin;
    });
  });
}
