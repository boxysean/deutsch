import * as THREE from "three";
import { CATEGORIES } from "../data/categories.js";
import { getZone } from "../data/zones.js";

function findZoneGroup(object) {
  let o = object;
  while (o) {
    if (o.userData && o.userData.zoneId) return o;
    o = o.parent;
  }
  return null;
}

export function setupRaycast({ renderer, camera, pickableObjects, tooltipEl, onSelect }) {
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

  function showTooltip(group, clientX, clientY) {
    const zone = getZone(group.userData.zoneId);
    const cat = CATEGORIES[zone.category];
    const statusLabel = zone.status === "built" ? "erkunden" : "bald verfügbar";
    tooltipEl.innerHTML =
      `<span class="badge" style="background:#${cat.color.toString(16).padStart(6, "0")}"></span>` +
      `${zone.name}<span class="status">${statusLabel}</span>`;
    tooltipEl.style.left = clientX + "px";
    tooltipEl.style.top = clientY + "px";
    tooltipEl.hidden = false;
  }

  function hideTooltip() {
    tooltipEl.hidden = true;
  }

  renderer.domElement.addEventListener("pointerdown", (event) => {
    dragStart = { x: event.clientX, y: event.clientY };
  });

  renderer.domElement.addEventListener("pointermove", (event) => {
    updatePointer(event);
    const group = pick();
    if (group !== hovered) {
      hovered = group;
    }
    if (group) {
      renderer.domElement.style.cursor = "pointer";
      showTooltip(group, event.clientX, event.clientY);
    } else {
      renderer.domElement.style.cursor = "grab";
      hideTooltip();
    }
  });

  renderer.domElement.addEventListener("pointerleave", () => {
    hovered = null;
    hideTooltip();
  });

  renderer.domElement.addEventListener("pointerup", (event) => {
    if (!dragStart) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    dragStart = null;
    if (Math.sqrt(dx * dx + dy * dy) > 6) return; // was a pan, not a click
    updatePointer(event);
    const group = pick();
    if (group) onSelect(group.userData.zoneId);
  });
}
