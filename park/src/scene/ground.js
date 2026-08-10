import * as THREE from "three";
import { CATEGORIES, TILE, PLAZA } from "../data/categories.js";
import { districtBounds, districtCenter } from "./layout.js";
import { DISTRICT_PALETTE } from "./palette.js";
import { applyOutlines } from "./outline.js";

function mat(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

function plane(w, d, color, y) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  return m;
}

export function buildGround(scene) {
  const animated = [];

  const base = plane(400, 360, 0x6fbf73, -0.05);
  base.position.x = -15;
  base.position.z = -10;
  scene.add(base);

  Object.keys(CATEGORIES).forEach((key) => {
    const pal = DISTRICT_PALETTE[key];
    const b = districtBounds(key);
    const w = b.maxX - b.minX + TILE * 0.6;
    const d = b.maxZ - b.minZ + TILE * 0.6;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;

    // darker plate underneath = crisp border around each district
    const edge = plane(w + 1.6, d + 1.6, pal.padEdge, 0.01);
    edge.position.set(cx, 0.01, cz);
    scene.add(edge);

    const pad = plane(w, d, pal.pad, 0.02);
    pad.position.set(cx, 0.02, cz);
    scene.add(pad);

    // path from district centre back to the plaza
    const center = districtCenter(key);
    const dx = center.x - PLAZA.x;
    const dz = center.z - PLAZA.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const len = dist - PLAZA.radius;
    if (len > 1) {
      const angle = -Math.atan2(dz, dx);
      const midX = PLAZA.x + (dx / dist) * (PLAZA.radius + len / 2);
      const midZ = PLAZA.z + (dz / dist) * (PLAZA.radius + len / 2);

      const pathEdge = plane(len, 4.4, 0xb99a63, 0.012);
      pathEdge.rotation.z = angle;
      pathEdge.position.set(midX, 0.012, midZ);
      scene.add(pathEdge);

      const path = plane(len, 3.4, 0xe4cf9a, 0.022);
      path.rotation.z = angle;
      path.position.set(midX, 0.022, midZ);
      scene.add(path);
    }
  });

  // plaza with a little fountain — the visual anchor of the park
  const plazaEdge = new THREE.Mesh(
    new THREE.CylinderGeometry(PLAZA.radius + 0.8, PLAZA.radius + 0.8, 0.12, 28),
    mat(0xb99a63)
  );
  plazaEdge.position.set(PLAZA.x, 0.04, PLAZA.z);
  scene.add(plazaEdge);

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(PLAZA.radius, PLAZA.radius, 0.16, 28), mat(0xf0dfae));
  plaza.position.set(PLAZA.x, 0.06, PLAZA.z);
  scene.add(plaza);

  const fountain = new THREE.Group();
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 0.5, 12), mat(0xd8cbb0));
  basin.position.y = 0.25;
  fountain.add(basin);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.12, 12), mat(0x4fb3d9));
  water.position.y = 0.5;
  water.userData.noOutline = true;
  fountain.add(water);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.1, 8), mat(0xd8cbb0));
  stem.position.y = 1.0;
  fountain.add(stem);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), mat(0x4fb3d9));
  top.position.y = 1.75;
  top.userData.spin = 0.6;
  fountain.add(top);
  fountain.position.set(PLAZA.x, 0.14, PLAZA.z);
  applyOutlines(fountain, 0.06);
  scene.add(fountain);
  animated.push(top);

  return { animated };
}
