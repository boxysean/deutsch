import { TILE_W, TILE_H, LEVEL_H, isoToScreen } from "./projection.js";

// Hit testing without a 3D raycaster: walk the objects front-to-back and test
// the pointer against each building's screen-space footprint box. Front-most
// wins, which matches what the painter's algorithm drew on top.
function hitBuilding(obj, renderer, wx, wy) {
  const p = { tx: obj.tx, ty: obj.ty };
  const fp = obj.spec.footprint;
  const half = (fp - 1) / 2;
  const base = isoToScreen(p.tx - half, p.ty - half);

  const totalH = (obj.spec.height + (obj.spec.roofKind === "flat" ? 0.3 : obj.spec.roofH)) * LEVEL_H;
  const left = base.x - (fp * TILE_W) / 2;
  const right = base.x + (fp * TILE_W) / 2;
  const bottom = base.y + fp * TILE_H;
  const top = base.y - totalH;

  return wx >= left && wx <= right && wy >= top && wy <= bottom;
}

// A pinch has to cross this much of a zoom step before the level changes. The
// scene is upscaled at an INTEGER zoom with nearest-neighbour — that is what
// keeps the pixels crisp — so a pinch cannot scale continuously; it snaps. The
// dead band is wider than the 0.5 a plain round() would use, so a hand shaking
// on the boundary does not flip the map back and forth.
const PINCH_STEP = 0.62;

export function setupInteraction(canvas, renderer, { onHover, onSelect, onDismiss, gestureSurface }) {
  // All listeners share one signal, so tearing the level down is a single
  // abort() rather than four removeEventListener calls that have to keep
  // referencing the same closures.
  const ac = new AbortController();
  const on = { signal: ac.signal };
  let dragging = false;
  let dragMoved = 0;
  let last = null;
  let downId = null;

  // Every pointer currently down, by id. One is a drag; two are a pinch.
  const pointers = new Map();
  let pinch = null;
  // Set when a pinch ends, so lifting the second finger cannot register as a
  // tap on whatever house happens to be under it.
  let suppressTap = false;

  function localPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function pointerWorld(e) {
    const p = localPoint(e);
    return renderer.cssToWorld(p.x, p.y);
  }

  function pick(e) {
    const w = pointerWorld(e);
    for (let i = renderer.objects.length - 1; i >= 0; i--) {
      const obj = renderer.objects[i];
      if (obj.kind !== "building") continue;
      if (hitBuilding(obj, renderer, w.x, w.y)) return obj.zone.id;
    }
    return null;
  }

  // Centroid and spread of the two live pointers, in canvas CSS pixels.
  function gesture() {
    const pts = [...pointers.values()];
    const rect = canvas.getBoundingClientRect();
    const a = { x: pts[0].x - rect.left, y: pts[0].y - rect.top };
    const b = { x: pts[1].x - rect.left, y: pts[1].y - rect.top };
    return {
      cx: (a.x + b.x) / 2,
      cy: (a.y + b.y) / 2,
      dist: Math.hypot(b.x - a.x, b.y - a.y),
    };
  }

  // Zoom while holding one world point still under the fingers. Zooming about
  // the viewport centre instead would slide the map out from under the pinch,
  // which on a phone feels like the map fighting you.
  function zoomAbout(next, cssX, cssY) {
    const s = renderer.state;
    const z = Math.max(1, Math.min(5, next));
    if (z === s.zoom) return;
    const before = renderer.cssToWorld(cssX, cssY);
    renderer.setZoom(z);
    const after = renderer.cssToWorld(cssX, cssY);
    s.camX += before.x - after.x;
    s.camY += before.y - after.y;
  }

  function applyPinch() {
    if (!pinch || pointers.size < 2) return;
    const g = gesture();
    // Two fingers pan as well as zoom: the map follows the centroid.
    renderer.state.camX -= (g.cx - pinch.cx) / renderer.state.zoom;
    renderer.state.camY -= (g.cy - pinch.cy) / renderer.state.zoom;
    pinch.cx = g.cx;
    pinch.cy = g.cy;

    const wanted = pinch.zoom * (g.dist / pinch.dist);
    const z = renderer.state.zoom;
    if (wanted >= z + PINCH_STEP) zoomAbout(z + 1, g.cx, g.cy);
    else if (wanted <= z - PINCH_STEP) zoomAbout(z - 1, g.cx, g.cy);
  }

  function startPinch() {
    const g = gesture();
    pinch = { dist: g.dist || 1, zoom: renderer.state.zoom, cx: g.cx, cy: g.cy };
    // A pinch is not a drag; drop the one-finger state so releasing does not
    // pan or tap.
    dragging = false;
    last = null;
    downId = null;
    onHover(null);
  }

  // The map labels sit in their own layer above the canvas, so a pinch with one
  // finger on a label would otherwise never reach the canvas — the browser
  // would page-zoom instead. That layer therefore joins the pointer bookkeeping,
  // but ONLY for multi-touch: a single finger on a label is a tap on that label,
  // which is the labels' own business.
  if (gestureSurface) {
    gestureSurface.addEventListener("pointerdown", (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2) startPinch();
    }, on);
    gestureSurface.addEventListener("pointermove", (e) => {
      if (!pinch || !pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      applyPinch();
    }, on);
    gestureSurface.addEventListener("pointerup", release, on);
    gestureSurface.addEventListener("pointercancel", release, on);
  }

  canvas.addEventListener("pointerdown", (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);

    if (pointers.size >= 2) {
      startPinch();
      return;
    }
    dragging = true;
    downId = e.pointerId;
    dragMoved = 0;
    suppressTap = false;
    last = { x: e.clientX, y: e.clientY };
  }, on);

  canvas.addEventListener("pointermove", (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch && pointers.size >= 2) {
      applyPinch();
      return;
    }

    if (dragging && last) {
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      dragMoved += Math.abs(dx) + Math.abs(dy);
      renderer.state.camX -= dx / renderer.state.zoom;
      renderer.state.camY -= dy / renderer.state.zoom;
      last = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
      return;
    }
    const id = pick(e);
    canvas.style.cursor = id ? "pointer" : "grab";
    onHover(id);
  }, on);

  function release(e) {
    pointers.delete(e.pointerId);
    if (pinch && pointers.size < 2) {
      pinch = null;
      // The finger still down would otherwise start panning from a stale
      // origin, and lifting it would read as a tap.
      dragging = false;
      last = null;
      downId = null;
      suppressTap = true;
    }
  }

  canvas.addEventListener("pointerup", (e) => {
    const wasPinching = !!pinch;
    // A press that began on a label and finished over the map is not a click on
    // the map: without this the stale dragMoved from the last pan would let it
    // open whatever house happened to be under the release point.
    const startedHere = downId === e.pointerId;
    release(e);
    if (wasPinching || suppressTap) {
      if (pointers.size === 0) suppressTap = false;
      return;
    }
    downId = null;
    dragging = false;
    canvas.style.cursor = "grab";
    if (!startedHere || dragMoved > 6) return; // released elsewhere, or a pan
    const id = pick(e);
    // Clicking a house opens it; clicking the ground between them dismisses
    // whatever is open, the way tapping outside a sheet does everywhere else.
    if (id) onSelect(id);
    else if (onDismiss) onDismiss();
  }, on);

  // A cancelled pointer never produces pointerup — a system gesture taking over
  // mid-pinch would otherwise leave the map stuck in pinch mode for good.
  canvas.addEventListener("pointercancel", (e) => {
    release(e);
    if (pointers.size === 0) {
      dragging = false;
      downId = null;
      suppressTap = false;
    }
  }, on);

  canvas.addEventListener("pointerleave", (e) => {
    // Only a mouse leaves the canvas meaningfully; a captured touch reports
    // pointerleave on lift, and clearing the pinch here would be redundant.
    if (e.pointerType === "mouse") {
      dragging = false;
      downId = null;
      onHover(null);
    }
  }, on);

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -1 : 1;
      const next = renderer.state.zoom + dir;
      if (next < 1 || next > 5) return;
      renderer.setZoom(next);
    },
    { passive: false, signal: ac.signal }
  );

  return {
    destroy() {
      ac.abort();
      pointers.clear();
      pinch = null;
    },
  };
}
