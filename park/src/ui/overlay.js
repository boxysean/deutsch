import { getZone } from "../data/zones.js";
import { CATEGORIES } from "../data/categories.js";
import { DISTRICT } from "../iso/palette.js";
import { getPreview } from "../content/previews.js";

const MODULE_LOADERS = {
  grammarFoundations: () => import("../content/grammarFoundations/index.js"),
  lesenExam: () => import("../content/lesenExam/index.js"),
  vocabTheme: () => import("../content/vocabTheme/index.js"),
  grammarTopic: () => import("../content/grammarTopic/index.js"),
  infoHub: () => import("../content/infoHub/index.js"),
  examSkill: () => import("../content/examSkill/index.js"),
  progressTower: () => import("../content/progressTower/index.js"),
};

let els = null;
let onChangeCallback = null;
let currentZoneId = null;

export function initOverlay() {
  els = {
    sheet: document.getElementById("sheet"),
    sheetIcon: document.getElementById("sheet-icon"),
    sheetMeta: document.getElementById("sheet-meta"),
    sheetTitle: document.getElementById("sheet-title"),
    sheetDesc: document.getElementById("sheet-desc"),
    sheetStats: document.getElementById("sheet-stats"),
    sheetOpen: document.getElementById("sheet-open"),
    sheetClose: document.getElementById("sheet-close"),
    backdrop: document.getElementById("panel-backdrop"),
    panel: document.getElementById("panel"),
    badge: document.getElementById("panel-badge"),
    title: document.getElementById("panel-title"),
    close: document.getElementById("panel-close"),
    content: document.getElementById("panel-content"),
  };

  els.sheetClose.addEventListener("click", () => {
    location.hash = "";
  });
  els.sheetOpen.addEventListener("click", () => {
    if (currentZoneId) location.hash = `zone/${currentZoneId}/detail`;
  });
  // Closing the expanded page drops back to the sheet rather than all the way out.
  els.close.addEventListener("click", () => {
    if (currentZoneId) location.hash = `zone/${currentZoneId}`;
    else location.hash = "";
  });
  els.backdrop.addEventListener("click", () => {
    if (currentZoneId) location.hash = `zone/${currentZoneId}`;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!els.panel.hidden && currentZoneId) location.hash = `zone/${currentZoneId}`;
    else if (!els.sheet.hidden) location.hash = "";
  });

  window.addEventListener("hashchange", handleHash);
  handleHash();
}

export function onZoneChange(cb) {
  onChangeCallback = cb;
}

function handleHash() {
  const match = location.hash.match(/^#zone\/([^/]+)(\/detail)?$/);
  if (!match) {
    closeAll();
    return;
  }
  const [, id, detail] = match;
  const zone = getZone(id);
  if (!zone) {
    closeAll();
    return;
  }

  currentZoneId = id;
  showSheet(zone);
  if (detail) openDetail(zone);
  else closeDetail();

  if (onChangeCallback) onChangeCallback(id);
}

// ---------------------------------------------------------------- sheet

function showSheet(zone) {
  const cat = CATEGORIES[zone.category];
  const color = DISTRICT[zone.category].label;
  const preview = getPreview(zone);
  const built = zone.status === "built";

  els.sheet.style.setProperty("--zone-color", color);
  els.sheetIcon.textContent = zone.icon || "";
  els.sheetIcon.hidden = !zone.icon;
  els.sheetMeta.innerHTML =
    `<span class="sheet-cat">${cat.label}</span>` +
    `<span class="sheet-pill" data-built="${built}">${built ? "ausgebaut" : "bald verfügbar"}</span>` +
    (zone.tag ? `<span class="sheet-tag mono">Tag ${zone.tag}</span>` : "");
  els.sheetTitle.textContent = zone.name;
  els.sheetDesc.textContent = preview.summary;

  els.sheetStats.innerHTML = preview.stats
    .map((s) => `<div class="sheet-stat"><b>${s.value}</b><span>${s.label}</span></div>`)
    .join("");
  els.sheetStats.hidden = preview.stats.length === 0;

  els.sheetOpen.disabled = !built;
  els.sheetOpen.textContent = built ? "Ausführlich öffnen" : "Noch kein Inhalt";
  els.sheet.hidden = false;
}

// ---------------------------------------------------------------- detail page

async function openDetail(zone) {
  if (zone.status !== "built" || !MODULE_LOADERS[zone.module]) return;

  const color = DISTRICT[zone.category].label;
  els.badge.style.background = color;
  els.title.textContent = zone.name;
  els.content.innerHTML = "";
  els.backdrop.hidden = false;
  els.panel.hidden = false;
  els.sheet.hidden = true;

  try {
    const mod = await MODULE_LOADERS[zone.module]();
    mod.mount(els.content, zone);
  } catch (err) {
    console.error("Failed to load zone module", zone.module, err);
    els.content.innerHTML = `<p>Inhalt konnte nicht geladen werden.</p>`;
  }
}

function closeDetail() {
  if (!els.panel.hidden) {
    els.panel.hidden = true;
    els.backdrop.hidden = true;
    els.content.innerHTML = "";
  }
}

function closeAll() {
  currentZoneId = null;
  closeDetail();
  if (els.sheet) els.sheet.hidden = true;
  if (onChangeCallback) onChangeCallback(null);
}

export function openZonePanel(id) {
  location.hash = `zone/${id}`;
}

export function closeZonePanel() {
  location.hash = "";
}
