import { DISTRICT } from "../iso/palette.js";

// Always-on map labels as DOM, anchored to each building's roof. Kept out of
// the canvas so the type stays crisp against the pixelated scene.
//
// 35 labels would overlap, so a greedy de-clutter collapses the losers to just
// their icon. The ordering of that pass has to be STABLE: if it depends on the
// camera or the pointer, labels swap places as you move and the whole map
// flickers. So precedence is fixed at construction, and hover is applied
// afterwards as an overlay rather than being part of the sort.

// Hysteresis, in CSS px. An expanded label has to be overlapped by more than
// COLLAPSE_BIAS before it gives up its slot; a collapsed one needs
// EXPAND_BIAS of clear air before it takes one. The gap between the two is a
// dead band, so a single pixel of pan can no longer toggle a label.
const COLLAPSE_BIAS = -3;
const EXPAND_BIAS = 6;

export function createLabels(zones, renderer, onSelect) {
  const container = document.getElementById("labels");
  let hoveredId = null;
  let activeId = null;
  let lastKey = null;

  const items = zones.map((zone, index) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "map-label";
    el.dataset.status = zone.status;
    if (zone.category === "info") el.dataset.info = "true";
    el.dataset.collapsed = "false";
    el.style.setProperty("--label-color", DISTRICT[zone.category].label);
    const marker = zone.icon
      ? `<span class="ml-icon">${zone.icon}</span>`
      : `<span class="ml-dot"></span>`;
    el.innerHTML = `${marker}<span class="ml-name">${zone.labelName || zone.name}</span>`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect(zone.id);
    });
    el.addEventListener("pointerenter", () => setHovered(zone.id));
    el.addEventListener("pointerleave", () => setHovered(null));
    container.appendChild(el);

    return {
      zone,
      el,
      // Fixed precedence: the Dom first (it is the app's own "about" button),
      // then built zones, then stubs, tie-broken by original zone order. Never
      // derived from screen position or hover, so collision winners are stable.
      tier: zone.category === "info" ? -1 : zone.status === "built" ? 0 : 1,
      rank: index,
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      collapsed: false,
    };
  });

  // Widths are cached, so a measurement taken before the fonts settle would
  // skew the de-clutter for the life of the page. Measure now, then again once
  // fonts are ready.
  function measure() {
    items.forEach((it) => {
      const wasHidden = it.el.style.display === "none";
      const wasCollapsed = it.el.dataset.collapsed;
      if (wasHidden) it.el.style.display = "";
      it.el.dataset.collapsed = "false";
      it.w = it.el.offsetWidth;
      it.h = it.el.offsetHeight;
      it.el.dataset.collapsed = wasCollapsed;
      if (wasHidden) it.el.style.display = "none";
    });
    lastKey = null; // force the next update to re-lay-out
  }
  measure();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure).catch(() => {});
  }

  function update() {
    const s = renderer.state;
    // Nothing can have moved unless the camera or the highlight changed.
    const key = `${s.camX}|${s.camY}|${s.zoom}|${s.cssW}|${s.cssH}|${hoveredId}|${activeId}`;
    if (key === lastKey) return;
    lastKey = key;

    const cw = s.cssW;
    const ch = s.cssH;

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

    // Stable greedy de-clutter. Order depends only on data fixed at
    // construction, so panning can never swap which label wins a collision.
    onScreen.sort((a, b) => (a.tier !== b.tier ? a.tier - b.tier : a.rank - b.rank));

    const placed = [];
    onScreen.forEach((it) => {
      // Bias the box by whether this label currently holds a slot, so the
      // expand and collapse thresholds differ.
      const pad = it.collapsed ? EXPAND_BIAS : COLLAPSE_BIAS;
      const rect = {
        l: it.x - it.w / 2 - pad,
        r: it.x + it.w / 2 + pad,
        t: it.y - it.h - pad,
        b: it.y + pad,
      };
      const clash = placed.some((p) => !(rect.r < p.l || rect.l > p.r || rect.b < p.t || rect.t > p.b));
      it.collapsed = clash;
      if (!clash) {
        // Reserve the true expanded box, not the biased one.
        placed.push({
          l: it.x - it.w / 2,
          r: it.x + it.w / 2,
          t: it.y - it.h,
          b: it.y,
        });
      }
    });

    // Hover and selection are an overlay on top of the stable result: the
    // highlighted label is always readable and rises above its neighbours, but
    // it does not take part in the placement, so pointing at one label can
    // never shuffle the others.
    onScreen.forEach((it) => {
      const highlighted = it.zone.id === hoveredId || it.zone.id === activeId;
      it.el.dataset.collapsed = highlighted ? "false" : it.collapsed ? "true" : "false";
    });
  }

  function setHovered(id) {
    if (hoveredId === id) return;
    hoveredId = id;
    renderer.state.hoveredId = id;
    items.forEach(({ zone, el }) => {
      el.dataset.hovered = zone.id === id ? "true" : "false";
    });
  }

  function setActive(id) {
    if (activeId === id) return;
    activeId = id;
    renderer.state.activeId = id;
    items.forEach(({ zone, el }) => {
      el.dataset.active = zone.id === id ? "true" : "false";
    });
  }

  return { update, setHovered, setActive };
}
