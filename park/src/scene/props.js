import * as THREE from "three";
import { CATEGORIES } from "../data/categories.js";
import { districtBounds } from "./layout.js";
import { PLAZA } from "../data/categories.js";

function insideAnyDistrict(x, z, margin) {
  return Object.keys(CATEGORIES).some((key) => {
    const b = districtBounds(key);
    return x > b.minX - margin && x < b.maxX + margin && z > b.minZ - margin && z < b.maxZ + margin;
  });
}

function insidePlaza(x, z, margin) {
  const dx = x - PLAZA.x;
  const dz = z - PLAZA.z;
  return Math.sqrt(dx * dx + dz * dz) < PLAZA.radius + margin;
}

// Deterministic placement (no Math.random) so the park looks identical every visit.
function treePositions() {
  const positions = [];
  const spacing = 7;
  for (let x = -110; x <= 90; x += spacing) {
    for (let z = -95; z <= 70; z += spacing) {
      const jitterX = ((x * 13 + z * 7) % 5) - 2.5;
      const jitterZ = ((x * 7 - z * 11) % 5) - 2.5;
      const px = x + jitterX;
      const pz = z + jitterZ;
      if (insideAnyDistrict(px, pz, 3.5)) continue;
      if (insidePlaza(px, pz, 4)) continue;
      // Keep a sparse, deterministic subset.
      if ((Math.abs(x) + Math.abs(z)) % 14 !== 0) continue;
      positions.push({ x: px, z: pz, scale: 0.8 + (Math.abs(jitterX * jitterZ) % 1) * 0.5 });
    }
  }
  return positions;
}

export function buildProps(scene) {
  const positions = treePositions();
  const count = positions.length;
  if (count === 0) return;

  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.9, 6);
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x7a5230, flatShading: true });
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, count);

  const canopyGeo = new THREE.ConeGeometry(0.85, 1.6, 7);
  const canopyMat = new THREE.MeshLambertMaterial({ color: 0x3f7a4a, flatShading: true });
  const canopy = new THREE.InstancedMesh(canopyGeo, canopyMat, count);

  const canopyTopGeo = new THREE.ConeGeometry(0.6, 1.2, 7);
  const canopyTopMat = new THREE.MeshLambertMaterial({ color: 0x4f8f5a, flatShading: true });
  const canopyTop = new THREE.InstancedMesh(canopyTopGeo, canopyTopMat, count);

  const dummy = new THREE.Object3D();
  positions.forEach((p, i) => {
    dummy.position.set(p.x, 0.45 * p.scale, p.z);
    dummy.scale.setScalar(p.scale);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);

    dummy.position.set(p.x, 1.1 * p.scale, p.z);
    dummy.updateMatrix();
    canopy.setMatrixAt(i, dummy.matrix);

    dummy.position.set(p.x, 1.85 * p.scale, p.z);
    dummy.updateMatrix();
    canopyTop.setMatrixAt(i, dummy.matrix);
  });

  scene.add(trunks, canopy, canopyTop);
}
