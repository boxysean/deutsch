import * as THREE from "three";
import { CATEGORIES, TILE, PLAZA } from "../data/categories.js";
import { districtBounds, districtCenter } from "./layout.js";

export function buildGround(scene) {
  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(360, 320),
    new THREE.MeshLambertMaterial({ color: 0x8fc79a })
  );
  base.rotation.x = -Math.PI / 2;
  base.position.set(-15, -0.05, -10);
  scene.add(base);

  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(PLAZA.radius, PLAZA.radius, 0.1, 24),
    new THREE.MeshLambertMaterial({ color: 0xe8e2c8 })
  );
  plaza.position.set(PLAZA.x, 0.03, PLAZA.z);
  scene.add(plaza);

  Object.keys(CATEGORIES).forEach((key) => {
    const cat = CATEGORIES[key];
    const b = districtBounds(key);
    const w = b.maxX - b.minX;
    const d = b.maxZ - b.minZ;
    const pad = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshLambertMaterial({ color: cat.color, transparent: true, opacity: 0.16 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.set((b.minX + b.maxX) / 2, 0.02, (b.minZ + b.maxZ) / 2);
    scene.add(pad);

    // Path strip connecting the district center back to the plaza.
    const center = districtCenter(key);
    const dx = center.x - PLAZA.x;
    const dz = center.z - PLAZA.z;
    const len = Math.sqrt(dx * dx + dz * dz) - PLAZA.radius - TILE * 0.3;
    if (len > 1) {
      const path = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.max(len, 1), 2.2),
        new THREE.MeshLambertMaterial({ color: 0xd9cfa8 })
      );
      path.rotation.x = -Math.PI / 2;
      path.rotation.z = -Math.atan2(dz, dx);
      const midX = PLAZA.x + (dx / (len + PLAZA.radius)) * (len / 2 + PLAZA.radius);
      const midZ = PLAZA.z + (dz / (len + PLAZA.radius)) * (len / 2 + PLAZA.radius);
      path.position.set(midX, 0.025, midZ);
      scene.add(path);
    }
  });

  return base;
}
