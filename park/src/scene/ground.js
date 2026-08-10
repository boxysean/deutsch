import * as THREE from "three";
import { PLAZA } from "../data/categories.js";
import { TOWN_PLAN, pointAlong, zonePlacement } from "./townPlan.js";
import { DISTRICT_PALETTE } from "./palette.js";
import { applyOutlines } from "./outline.js";
import { ZONES } from "../data/zones.js";

const ROAD = 0xe4cf9a;
const ROAD_EDGE = 0xb99a63;

function mat(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

// A flat strip from a -> b. All road directions are 45° multiples, so these
// always land square on the town grid.
function strip(a, b, width, color, y) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz);
  if (len < 0.01) return null;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, width), mat(color));
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = -Math.atan2(dz, dx);
  m.position.set(a.x + dx / 2, y, a.z + dz / 2);
  return m;
}

export function buildGround(scene) {
  const animated = [];

  const base = new THREE.Mesh(new THREE.PlaneGeometry(520, 460), mat(0x6fbf73));
  base.rotation.x = -Math.PI / 2;
  base.position.set(0, -0.05, -20);
  scene.add(base);

  Object.entries(TOWN_PLAN.districts).forEach(([category, d]) => {
    const pal = DISTRICT_PALETTE[category];

    // Draw the street one segment at a time so every piece stays on a 45° axis.
    const nodes = [];
    let acc = d.startT;
    nodes.push(pointAlong(d, acc));
    d.segments.forEach((seg, i) => {
      const segEnd = d.segments.slice(0, i + 1).reduce((s, x) => s + x.length, 0);
      const cut = Math.min(segEnd, d.endT);
      if (cut > acc) {
        nodes.push(pointAlong(d, cut));
        acc = cut;
      }
    });
    if (acc < d.endT) nodes.push(pointAlong(d, d.endT));

    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i];
      const b = nodes[i + 1];
      const roadEdge = strip(a, b, 6.2, ROAD_EDGE, 0.02);
      if (roadEdge) scene.add(roadEdge);
      const road = strip(a, b, 5.0, ROAD, 0.03);
      if (road) scene.add(road);
    }

    // Patch the joint where two segments meet so the bend doesn't show a notch.
    nodes.slice(1, -1).forEach((n) => {
      const cap = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 6.2), mat(ROAD));
      cap.rotation.x = -Math.PI / 2;
      cap.rotation.z = Math.PI / 4;
      cap.position.set(n.x, 0.032, n.z);
      scene.add(cap);
    });

    // Each house gets its own garden plot and a driveway onto the street —
    // reads far more like a town than one big tinted slab.
    ZONES.filter((z) => z.category === category).forEach((zone) => {
      const place = zonePlacement(zone.id);

      const plotEdge = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 8.8), mat(pal.padEdge));
      plotEdge.rotation.x = -Math.PI / 2;
      plotEdge.rotation.z = -place.facing;
      plotEdge.position.set(place.x, 0.01, place.z);
      scene.add(plotEdge);

      const plot = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 8.0), mat(pal.pad));
      plot.rotation.x = -Math.PI / 2;
      plot.rotation.z = -place.facing;
      plot.position.set(place.x, 0.014, place.z);
      scene.add(plot);

      if (place.driveway) {
        const drive = strip(place.driveway.from, place.driveway.to, 2.4, ROAD, 0.028);
        if (drive) scene.add(drive);
      }
    });
  });

  // --- central plaza + fountain ---
  const plazaEdge = new THREE.Mesh(
    new THREE.CylinderGeometry(PLAZA.radius + 0.9, PLAZA.radius + 0.9, 0.12, 4),
    mat(ROAD_EDGE)
  );
  plazaEdge.rotation.y = Math.PI / 4;
  plazaEdge.position.set(PLAZA.x, 0.04, PLAZA.z);
  scene.add(plazaEdge);

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(PLAZA.radius, PLAZA.radius, 0.16, 4), mat(0xf0dfae));
  plaza.rotation.y = Math.PI / 4;
  plaza.position.set(PLAZA.x, 0.06, PLAZA.z);
  scene.add(plaza);

  const fountain = new THREE.Group();
  const basin = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 3.4), mat(0xd8cbb0));
  basin.position.y = 0.25;
  fountain.add(basin);
  const water = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 2.6), mat(0x4fb3d9));
  water.position.y = 0.5;
  water.userData.noOutline = true;
  fountain.add(water);
  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.6), mat(0xd8cbb0));
  stem.position.y = 1.0;
  fountain.add(stem);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), mat(0x4fb3d9));
  top.position.y = 1.85;
  top.userData.spin = 0.6;
  fountain.add(top);
  fountain.position.set(PLAZA.x, 0.14, PLAZA.z);
  applyOutlines(fountain, 0.06);
  scene.add(fountain);
  animated.push(top);

  return { animated };
}
