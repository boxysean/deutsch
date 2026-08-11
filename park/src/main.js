import "./styles/base.css";
import "./styles/app.css";

import { ZONES } from "./data/zones.js";
import { buildWorld } from "./iso/world.js";
import { createRenderer } from "./iso/renderer.js";
import { setupInteraction } from "./iso/interaction.js";
import { createLabels } from "./ui/labels.js";
import { initHud } from "./ui/hud.js";
import { initOverlay, onZoneChange, openZonePanel, closeZonePanel } from "./ui/overlay.js";
import { recordToday, onConfidenceChange } from "./content/lib/progress.js";
import { nextZone } from "./content/lib/route.js";

const canvas = document.getElementById("scene");
const world = buildWorld();
const renderer = createRenderer(canvas, world);

renderer.resize();
renderer.fit();

initHud((id) => openZonePanel(id));

// The progress curve needs a datapoint per day, so take one on load and again
// when the tab is hidden — not only when the Fernsehturm is opened.
recordToday();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") recordToday();
});

const labels = createLabels(ZONES, renderer, (id) => openZonePanel(id));

initOverlay();
onZoneChange((id) => labels.setActive(id));

// Rating a topic anywhere — the drawer, its page, the Fernsehturm — updates the
// number on its map label and, when it settles a step, moves the route on.
function syncRoute() {
  const next = nextZone();
  renderer.state.nextId = next ? next.id : null;
  labels.refreshScores();
}
onConfidenceChange(syncRoute);
syncRoute();

setupInteraction(canvas, renderer, {
  onHover: (id) => labels.setHovered(id),
  onSelect: (id) => openZonePanel(id),
  onDismiss: () => closeZonePanel(),
});

window.addEventListener("resize", () => {
  renderer.resize();
});

let lastTime = performance.now();
function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  renderer.render(dt);
  labels.update();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
