import "./styles/base.css";
import "./styles/app.css";

import { getZones } from "./data/zones/index.js";
import { getLevel, onLevelChange } from "./data/levels.js";
import { buildWorld } from "./iso/world.js";
import { createRenderer } from "./iso/renderer.js";
import { setupInteraction } from "./iso/interaction.js";
import { createLabels } from "./ui/labels.js";
import { initHud } from "./ui/hud.js";
import {
  initOverlay,
  onZoneChange,
  openZonePanel,
  closeZonePanel,
  refreshOverlay,
} from "./ui/overlay.js";
import { recordToday, onConfidenceChange } from "./content/lib/progress.js";
import { nextZone } from "./content/lib/route.js";
import { migrateToLevels } from "./content/lib/storage.js";

const canvas = document.getElementById("scene");

// Everything saved before levels existed is A2 work. Moved under the A2
// namespace once, before anything reads it.
migrateToLevels();

// ------------------------------------------------------------------- a level
//
// A level is a whole town: its own world, renderer, labels, HUD and route.
// Switching one out means tearing all of that down together — a listener or a
// label left behind from the old town would keep answering for zones that are
// no longer on any map.

let session = null;

function mountLevel() {
  if (session) session.destroy();

  const world = buildWorld();
  const renderer = createRenderer(canvas, world);
  renderer.resize();
  renderer.fit();

  const hud = initHud((id) => openZonePanel(id));
  const labels = createLabels(getZones(), renderer, (id) => openZonePanel(id));

  // Rating a topic anywhere — the drawer, its page, the Fernsehturm — updates
  // the number on its map label and, when it settles a step, moves the route on.
  function syncRoute() {
    const next = nextZone();
    renderer.state.nextId = next ? next.id : null;
    labels.refreshScores();
  }
  const offConfidence = onConfidenceChange(syncRoute);
  syncRoute();

  const interaction = setupInteraction(canvas, renderer, {
    onHover: (id) => labels.setHovered(id),
    onSelect: (id) => openZonePanel(id),
    onDismiss: () => closeZonePanel(),
  });

  const onResize = () => renderer.resize();
  window.addEventListener("resize", onResize);

  session = {
    renderer,
    labels,
    destroy() {
      offConfidence();
      hud.destroy();
      labels.destroy();
      interaction.destroy();
      window.removeEventListener("resize", onResize);
    },
  };
  return session;
}

mountLevel();
initOverlay();
onZoneChange((id) => session.labels.setActive(id));

// The switch comes from the HUD buttons or from following a link into the other
// town. Either way the map is rebuilt and the overlay re-reads the hash against
// the zones that now exist.
onLevelChange(() => {
  mountLevel();
  refreshOverlay();
  recordToday();
});

// The progress curve needs a datapoint per day, so take one on load and again
// when the tab is hidden — not only when the Fernsehturm is opened. Each level
// keeps its own history, so this records against whichever is on screen.
recordToday();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") recordToday();
});

let lastTime = performance.now();
function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  session.renderer.render(dt);
  session.labels.update();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
