import { getZone } from "../data/zones.js";
import { CATEGORIES } from "../data/categories.js";

const MODULE_LOADERS = {
  grammarFoundations: () => import("../content/grammarFoundations/index.js"),
  lesenExam: () => import("../content/lesenExam/index.js"),
  vocabTheme: () => import("../content/vocabTheme/index.js"),
};

let els = null;
let onChangeCallback = null;

export function initOverlay() {
  els = {
    panel: document.getElementById("panel"),
    badge: document.getElementById("panel-badge"),
    title: document.getElementById("panel-title"),
    close: document.getElementById("panel-close"),
    content: document.getElementById("panel-content"),
  };
  els.close.addEventListener("click", () => {
    location.hash = "";
  });
  window.addEventListener("hashchange", handleHash);
  handleHash();
}

export function onZoneChange(cb) {
  onChangeCallback = cb;
}

function handleHash() {
  const match = location.hash.match(/^#zone\/(.+)$/);
  if (match) {
    openZonePanel(match[1], { skipHash: true });
  } else {
    closeZonePanel({ skipHash: true });
  }
}

export async function openZonePanel(id, opts = {}) {
  const zone = getZone(id);
  if (!zone) return;
  if (!opts.skipHash) location.hash = "zone/" + id;

  const cat = CATEGORIES[zone.category];
  els.badge.style.background = "#" + cat.color.toString(16).padStart(6, "0");
  els.title.textContent = zone.name;
  els.content.innerHTML = "";
  els.panel.hidden = false;

  if (zone.status === "built" && MODULE_LOADERS[zone.module]) {
    try {
      const mod = await MODULE_LOADERS[zone.module]();
      mod.mount(els.content, zone);
    } catch (err) {
      console.error("Failed to load zone module", zone.module, err);
      els.content.innerHTML = `<p>Inhalt konnte nicht geladen werden.</p>`;
    }
  } else {
    const stub = await import("../content/stub/index.js");
    stub.mount(els.content, zone);
  }

  if (onChangeCallback) onChangeCallback(id);
}

export function closeZonePanel(opts = {}) {
  if (!els) return;
  els.panel.hidden = true;
  els.content.innerHTML = "";
  if (!opts.skipHash && location.hash) location.hash = "";
  if (onChangeCallback) onChangeCallback(null);
}
