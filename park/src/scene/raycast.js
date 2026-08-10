import * as THREE from "three";

function findZoneGroup(object) {
  let o = object;
  while (o) {
    if (o.userData && o.userData.zoneId) return o;
    o = o.parent;
  }
  return null;
}

export function setupRaycast({ renderer, camera, pickableObjects, onHover, onSelect }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  let dragStart = null;

  function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickableObjects, true);
    if (hits.length === 0) return null;
    return findZoneGroup(hits[0].object);
  }

  renderer.domElement.addEventListener("pointerdown", (event) => {
    dragStart = { x: event.clientX, y: event.clientY };
  });

  renderer.domElement.addEventListener("pointermove", (event) => {
    updatePointer(event);
    const group = pick();
    const id = group ? group.userData.zoneId : null;
    if (id !== hovered) {
      hovered = id;
      onHover(id);
    }
    renderer.domElement.style.cursor = id ? "pointer" : "grab";
  });

  renderer.domElement.addEventListener("pointerleave", () => {
    hovered = null;
    onHover(null);
  });

  renderer.domElement.addEventListener("pointerup", (event) => {
    if (!dragStart) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    dragStart = null;
    if (Math.sqrt(dx * dx + dy * dy) > 6) return; // that was a pan, not a click
    updatePointer(event);
    const group = pick();
    if (group) onSelect(group.userData.zoneId);
  });
}
