import * as THREE from "three";
import { PLAZA } from "../data/categories.js";
import { TOWN_PLAN } from "./townPlan.js";
import { DISTRICT_PALETTE } from "./palette.js";
import { applyOutlines } from "./outline.js";

const ROAD = 0xe4cf9a;
const ROAD_EDGE = 0xb99a63;

function mat(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

function disc(radius, color, y, segments = 22) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(radius, segments), mat(color));
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  return m;
}

// A road segment from a -> b, drawn as a flat strip.
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

  const base = new THREE.Mesh(new THREE.PlaneGeometry(460, 420), mat(0x6fbf73));
  base.rotation.x = -Math.PI / 2;
  base.position.set(-10, -0.05, -20);
  scene.add(base);

  Object.entries(TOWN_PLAN.districts).forEach(([category, d]) => {
    const pal = DISTRICT_PALETTE[category];
    const spineEnd = { x: d.dir.x * d.spineLength, z: d.dir.z * d.spineLength };
    const spineStart = { x: d.dir.x * PLAZA.radius, z: d.dir.z * PLAZA.radius };

    // --- neighbourhood ground tint: a blob per cul-de-sac plus a strip along
    // the spine, which together read as an organic suburb outline ---
    const tintEdge = strip(spineStart, spineEnd, 15, pal.padEdge, 0.008);
    if (tintEdge) scene.add(tintEdge);
    const tint = strip(spineStart, spineEnd, 13, pal.pad, 0.012);
    if (tint) scene.add(tint);

    d.bulbs.forEach((b) => {
      const blobEdge = disc(b.ring + 5.2, pal.padEdge, 0.009);
      blobEdge.position.set(b.center.x, 0.009, b.center.z);
      scene.add(blobEdge);

      const blob = disc(b.ring + 4.4, pal.pad, 0.013);
      blob.position.set(b.center.x, 0.013, b.center.z);
      scene.add(blob);

      const branchTintEdge = strip(b.spinePt, b.center, 13, pal.padEdge, 0.009);
      if (branchTintEdge) scene.add(branchTintEdge);
      const branchTint = strip(b.spinePt, b.center, 11.5, pal.pad, 0.013);
      if (branchTint) scene.add(branchTint);
    });

    // --- the lanes themselves, drawn on top of the tint ---
    const spineEdge = strip(spineStart, spineEnd, 5.4, ROAD_EDGE, 0.02);
    if (spineEdge) scene.add(spineEdge);
    const spine = strip(spineStart, spineEnd, 4.2, ROAD, 0.03);
    if (spine) scene.add(spine);

    d.bulbs.forEach((b) => {
      const branchEdge = strip(b.spinePt, b.center, 4.4, ROAD_EDGE, 0.02);
      if (branchEdge) scene.add(branchEdge);
      const branch = strip(b.spinePt, b.center, 3.3, ROAD, 0.03);
      if (branch) scene.add(branch);

      const bulbEdge = disc(b.roadRadius + 0.6, ROAD_EDGE, 0.021, 20);
      bulbEdge.position.set(b.center.x, 0.021, b.center.z);
      scene.add(bulbEdge);

      const bulb = disc(b.roadRadius, ROAD, 0.031, 20);
      bulb.position.set(b.center.x, 0.031, b.center.z);
      scene.add(bulb);

      // a little green island in the middle of the cul-de-sac
      if (b.roadRadius > 3.4) {
        const island = disc(b.roadRadius * 0.42, 0x5faa63, 0.04, 14);
        island.position.set(b.center.x, 0.04, b.center.z);
        scene.add(island);
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.8, 6), mat(0x7a5230));
        trunk.position.y = 0.4;
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.8, 7, 5), mat(0x3f9e57));
        crown.position.y = 1.4;
        tree.add(trunk, crown);
        tree.position.set(b.center.x, 0.04, b.center.z);
        applyOutlines(tree, 0.05);
        scene.add(tree);
      }
    });
  });

  // --- central plaza + fountain ---
  const plazaEdge = new THREE.Mesh(
    new THREE.CylinderGeometry(PLAZA.radius + 0.9, PLAZA.radius + 0.9, 0.12, 28),
    mat(ROAD_EDGE)
  );
  plazaEdge.position.set(PLAZA.x, 0.04, PLAZA.z);
  scene.add(plazaEdge);

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(PLAZA.radius, PLAZA.radius, 0.16, 28), mat(0xf0dfae));
  plaza.position.set(PLAZA.x, 0.06, PLAZA.z);
  scene.add(plaza);

  const fountain = new THREE.Group();
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.1, 0.5, 12), mat(0xd8cbb0));
  basin.position.y = 0.25;
  fountain.add(basin);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 12), mat(0x4fb3d9));
  water.position.y = 0.5;
  water.userData.noOutline = true;
  fountain.add(water);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.1, 8), mat(0xd8cbb0));
  stem.position.y = 1.0;
  fountain.add(stem);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), mat(0x4fb3d9));
  top.position.y = 1.75;
  top.userData.spin = 0.6;
  fountain.add(top);
  fountain.position.set(PLAZA.x, 0.14, PLAZA.z);
  applyOutlines(fountain, 0.06);
  scene.add(fountain);
  animated.push(top);

  return { animated };
}
