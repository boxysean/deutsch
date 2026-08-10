import * as THREE from "three";
import { DISTRICT_PALETTE } from "../scene/palette.js";

// Always-on map labels: an HTML layer projected from each building's roof point.
// Kept as DOM (not sprites) so type stays crisp and the labels are clickable.
export function createLabels(zoneObjects, camera, renderer, onSelect) {
  const container = document.getElementById("labels");
  const v = new THREE.Vector3();
  let hoveredId = null;
  let activeId = null;

  const items = zoneObjects.map((z) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "map-label";
    el.dataset.status = z.zone.status;
    el.style.setProperty("--label-color", DISTRICT_PALETTE[z.zone.category].label);
    el.innerHTML = `<span class="ml-dot"></span><span class="ml-name">${z.zone.name}</span>`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect(z.id);
    });
    el.addEventListener("pointerenter", () => setHovered(z.id));
    el.addEventListener("pointerleave", () => setHovered(null));
    container.appendChild(el);
    return { z, el, w: 0, h: 0, x: 0, y: 0 };
  });

  function update() {
    const cw = renderer.domElement.clientWidth;
    const ch = renderer.domElement.clientHeight;

    const onScreen = [];
    items.forEach((it) => {
      v.set(it.z.worldPos.x, it.z.top + 0.9 + it.z.group.position.y, it.z.worldPos.z);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * cw;
      const y = (-v.y * 0.5 + 0.5) * ch;
      if (v.z > 1 || x < -180 || x > cw + 180 || y < -80 || y > ch + 80) {
        it.el.style.display = "none";
        return;
      }
      it.x = x;
      it.y = y;
      it.el.style.display = "";
      it.el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
      onScreen.push(it);
    });

    // Label text never changes, so measure once and cache.
    onScreen.forEach((it) => {
      if (!it.w) {
        it.w = it.el.offsetWidth;
        it.h = it.el.offsetHeight;
      }
    });

    // Greedy de-clutter: place high-priority labels first, hide any that would
    // collide with one already placed. Built zones and the hovered/active zone
    // always win, so the important labels never disappear.
    const sorted = onScreen.slice().sort((a, b) => {
      const pa = priority(a);
      const pb = priority(b);
      if (pa !== pb) return pa - pb;
      return b.y - a.y; // nearer the camera (lower on screen) wins ties
    });

    // Crowded-out labels collapse to a small clickable dot instead of
    // disappearing, so every zone stays discoverable at any zoom level.
    const placed = [];
    sorted.forEach((it) => {
      const rect = {
        l: it.x - it.w / 2 - 2,
        r: it.x + it.w / 2 + 2,
        t: it.y - it.h - 2,
        b: it.y + 2,
      };
      const clash = placed.some((p) => !(rect.r < p.l || rect.l > p.r || rect.b < p.t || rect.t > p.b));
      it.el.dataset.collapsed = clash ? "true" : "false";
      if (!clash) placed.push(rect);
    });
  }

  function priority(it) {
    if (it.z.id === activeId || it.z.id === hoveredId) return 0;
    return it.z.zone.status === "built" ? 1 : 2;
  }

  function setHovered(id) {
    hoveredId = id;
    items.forEach(({ z, el }) => {
      el.dataset.hovered = z.id === id ? "true" : "false";
    });
  }

  function setActive(id) {
    activeId = id;
    items.forEach(({ z, el }) => {
      el.dataset.active = z.id === id ? "true" : "false";
    });
  }

  return { update, setHovered, setActive };
}
