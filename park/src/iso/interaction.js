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

export function setupInteraction(canvas, renderer, { onHover, onSelect }) {
  let dragging = false;
  let dragMoved = 0;
  let last = null;
  let downId = null;

  function pointerWorld(e) {
    const rect = canvas.getBoundingClientRect();
    return renderer.cssToWorld(e.clientX - rect.left, e.clientY - rect.top);
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

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    downId = e.pointerId;
    dragMoved = 0;
    last = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
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
  });

  canvas.addEventListener("pointerup", (e) => {
    // A press that began on a label and finished over the map is not a click on
    // the map: without this the stale dragMoved from the last pan would let it
    // open whatever house happened to be under the release point.
    const startedHere = downId === e.pointerId;
    downId = null;
    dragging = false;
    canvas.style.cursor = "grab";
    if (!startedHere || dragMoved > 6) return; // released elsewhere, or a pan
    const id = pick(e);
    if (id) onSelect(id);
  });

  canvas.addEventListener("pointerleave", () => {
    dragging = false;
    downId = null;
    onHover(null);
  });

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -1 : 1;
      const next = renderer.state.zoom + dir;
      if (next < 1 || next > 5) return;
      renderer.setZoom(next);
    },
    { passive: false }
  );
}
