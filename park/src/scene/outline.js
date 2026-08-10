import * as THREE from "three";
import { OUTLINE_COLOR } from "./palette.js";

const outlineMaterial = new THREE.MeshBasicMaterial({
  color: OUTLINE_COLOR,
  side: THREE.BackSide,
});

// Inverted-hull outlines: clone each mesh slightly larger and render its back
// faces. Gives the chunky, illustrated silhouette without a post-processing pass.
export function applyOutlines(group, thickness = 0.09) {
  const meshes = [];
  group.traverse((obj) => {
    if (obj.isMesh && !obj.userData.noOutline && !obj.userData.isOutline) meshes.push(obj);
  });

  meshes.forEach((mesh) => {
    const shell = new THREE.Mesh(mesh.geometry, outlineMaterial);
    shell.userData.isOutline = true;
    shell.position.copy(mesh.position);
    shell.rotation.copy(mesh.rotation);
    shell.scale.copy(mesh.scale);

    // Grow by a constant world-space amount rather than a percentage, so small
    // props get the same visual line weight as large buildings.
    mesh.geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    mesh.geometry.boundingBox.getSize(size);
    shell.scale.set(
      mesh.scale.x * (1 + (thickness * 2) / Math.max(size.x, 0.2)),
      mesh.scale.y * (1 + (thickness * 2) / Math.max(size.y, 0.2)),
      mesh.scale.z * (1 + (thickness * 2) / Math.max(size.z, 0.2))
    );
    shell.renderOrder = -1;
    mesh.parent.add(shell);
  });
}
