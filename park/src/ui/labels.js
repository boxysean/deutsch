import { DISTRICT } from "../iso/palette.js";

// Always-on map labels as DOM, anchored to each building's roof. Kept out of
// the canvas so the type stays crisp against the pixelated scene.
export function createLabels(zones, renderer, onSelect) {
  const container = document.getElementById("labels");
  let hoveredId = null;
  let activeId = null;

  const items = zones.map((zone) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "map-label";
    el.dataset.status = zone.status;
    el.style.setProperty("--label-color", DISTRICT[zone.category].label);
    const marker = zone.icon
      ? `<span class="ml-icon">${zone.icon}</span>`
      : `<span class="ml-dot"></span>`;
    el.innerHTML = `${marker}<span class="ml-name">${zone.name}</span>`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect(zone.id);
    });
    el.addEventListener("pointerenter", () => setHovered(zone.id));
    el.addEventListener("pointerleave", () => setHovered(null));
    container.appendChild(el);
    return { zone, el, w: 0, h: 0, x: 0, y: 0 };
  });

  function update() {
    const cw = renderer.state.cssW;
    const ch = renderer.state.cssH;

    const onScreen = [];
    items.forEach((it) => {
      const anchor = renderer.zoneAnchor(it.zone.id);
      if (!anchor || anchor.x < -180 || anchor.x > cw + 180 || anchor.y < -80 || anchor.y > ch + 80) {
        it.el.style.display = "none";
        return;
      }
      it.x = anchor.x;
      it.y = anchor.y;
      it.el.style.display = "";
      it.el.style.transform = `translate(-50%, -100%) translate(${Math.round(anchor.x)}px, ${Math.round(anchor.y)}px)`;
      onScreen.push(it);
    });

    onScreen.forEach((it) => {
      if (!it.w) {
        it.w = it.el.offsetWidth;
        it.h = it.el.offsetHeight;
      }
    });

    // Greedy de-clutter: important labels are placed first; anything that would
    // collide collapses to its icon so every zone stays discoverable.
    const sorted = onScreen.slice().sort((a, b) => {
      const pa = priority(a);
      const pb = priority(b);
      if (pa !== pb) return pa - pb;
      return b.y - a.y;
    });

    const placed = [];
    sorted.forEach((it) => {
      const rect = { l: it.x - it.w / 2 - 2, r: it.x + it.w / 2 + 2, t: it.y - it.h - 2, b: it.y + 2 };
      const clash = placed.some((p) => !(rect.r < p.l || rect.l > p.r || rect.b < p.t || rect.t > p.b));
      it.el.dataset.collapsed = clash ? "true" : "false";
      if (!clash) placed.push(rect);
    });
  }

  function priority(it) {
    if (it.zone.id === activeId || it.zone.id === hoveredId) return 0;
    return it.zone.status === "built" ? 1 : 2;
  }

  function setHovered(id) {
    hoveredId = id;
    renderer.state.hoveredId = id;
    items.forEach(({ zone, el }) => {
      el.dataset.hovered = zone.id === id ? "true" : "false";
    });
  }

  function setActive(id) {
    activeId = id;
    renderer.state.activeId = id;
    items.forEach(({ zone, el }) => {
      el.dataset.active = zone.id === id ? "true" : "false";
    });
  }

  return { update, setHovered, setActive };
}
