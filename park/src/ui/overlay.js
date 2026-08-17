import { getZone } from "../data/zones.js";
import { CATEGORIES } from "../data/categories.js";
import { DISTRICT } from "../iso/palette.js";
import { getPreview } from "../content/previews.js";
import { routeLength, isSettled, nextZone } from "../content/lib/route.js";
import {
  CONFIDENCE_LEVELS,
  getConfidenceFor,
  setConfidenceFor,
  onConfidenceChange,
  recordToday,
} from "../content/lib/progress.js";

const MODULE_LOADERS = {
  grammarFoundations: () => import("../content/grammarFoundations/index.js"),
  lesenExam: () => import("../content/lesenExam/index.js"),
  vocabTheme: () => import("../content/vocabTheme/index.js"),
  grammarTopic: () => import("../content/grammarTopic/index.js"),
  infoHub: () => import("../content/infoHub/index.js"),
  examSkill: () => import("../content/examSkill/index.js"),
  progressTower: () => import("../content/progressTower/index.js"),
  dataTransfer: () => import("../content/dataTransfer/index.js"),
  mixedDeck: () => import("../content/mixedDeck/index.js"),
};

let els = null;
let onChangeCallback = null;
let currentZoneId = null;
// The rating controls currently on screen. Each holds a subscription, so they
// are disposed when their view closes rather than piling up.
let sheetRating = null;
let detailRating = null;

export function initOverlay() {
  els = {
    sheet: document.getElementById("sheet"),
    sheetIcon: document.getElementById("sheet-icon"),
    sheetMeta: document.getElementById("sheet-meta"),
    sheetTitle: document.getElementById("sheet-title"),
    sheetDesc: document.getElementById("sheet-desc"),
    sheetStats: document.getElementById("sheet-stats"),
    sheetRating: document.getElementById("sheet-rating"),
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
    (typeof zone.order === "number"
      ? `<span class="sheet-tag mono" data-next="${
          (nextZone() || {}).id === zone.id
        }">Schritt ${zone.order} von ${routeLength()}${
          isSettled(zone.id) ? " · erledigt" : (nextZone() || {}).id === zone.id ? " · als Nächstes" : ""
        }</span>`
      : "");
  els.sheetTitle.textContent =
    typeof zone.order === "number" ? `${zone.order} · ${zone.name}` : zone.name;
  els.sheetDesc.textContent = preview.summary;

  els.sheetStats.innerHTML = preview.stats
    .map((s) => `<div class="sheet-stat"><b>${s.value}</b><span>${s.label}</span></div>`)
    .join("");
  els.sheetStats.hidden = preview.stats.length === 0;

  els.sheetOpen.disabled = !built;
  els.sheetOpen.textContent = built ? "Ausführlich öffnen" : "Noch kein Inhalt";

  // Score the topic straight from the drawer — no need to open the full page.
  // The Dom, the Fernsehturm and the Riesenrad are not topics, so they get none.
  if (sheetRating) sheetRating.dispose();
  sheetRating = null;
  els.sheetRating.innerHTML = "";
  if (zone.category !== "info") {
    sheetRating = buildRatingControl(zone, { compact: true });
    els.sheetRating.appendChild(sheetRating.el);
  }
  els.sheetRating.hidden = zone.category === "info";

  els.sheet.hidden = false;
}

// ---------------------------------------------------------------- detail page

async function openDetail(zone) {
  if (zone.status !== "built" || !MODULE_LOADERS[zone.module]) return;

  const color = DISTRICT[zone.category].label;
  els.badge.style.background = color;
  els.title.textContent =
    typeof zone.order === "number" ? `${zone.order} · ${zone.name}` : zone.name;
  els.content.innerHTML = "";
  els.backdrop.hidden = false;
  els.panel.hidden = false;
  els.sheet.hidden = true;

  try {
    const mod = await MODULE_LOADERS[zone.module]();
    mod.mount(els.content, zone);
    // Rating a topic makes most sense right after working on it, so every
    // learning zone carries the same strip; the Fernsehturm holds the full list.
    if (zone.category !== "info") {
      const rating = buildRatingControl(zone, { compact: false });
      detailRating = rating;
      els.content.appendChild(rating.el);
    }
  } catch (err) {
    console.error("Failed to load zone module", zone.module, err);
    els.content.innerHTML = `<p>Inhalt konnte nicht geladen werden.</p>`;
  }
}

// One rating control, used in two places: the drawer that opens when you click
// a house, and the foot of that house's full page. Both write through
// setConfidenceFor, which announces the change so every other view follows.
function buildRatingControl(zone, { compact }) {
  const wrap = document.createElement("div");
  wrap.className = compact ? "conf-strip conf-compact" : "conf-strip";
  wrap.innerHTML = `
    <span class="conf-q">${compact ? "Wie sicher?" : "Wie sicher fühlst du dich bei diesem Thema?"}</span>
    <span class="rate-buttons" role="radiogroup"></span>
    <span class="rate-word"></span>
  `;
  wrap.querySelector(".rate-buttons").setAttribute("aria-label", `Selbsteinschätzung ${zone.name}`);

  const buttons = wrap.querySelector(".rate-buttons");
  const word = wrap.querySelector(".rate-word");

  function paint() {
    const current = getConfidenceFor(zone.id);
    buttons.querySelectorAll(".rate-btn").forEach((b) => {
      const on = Number(b.dataset.value) === current;
      b.dataset.picked = on ? "true" : "false";
      b.setAttribute("aria-checked", on ? "true" : "false");
    });
    word.textContent = current === null ? "noch nicht bewertet" : CONFIDENCE_LEVELS[current].label;
  }

  CONFIDENCE_LEVELS.forEach((lvl) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rate-btn";
    btn.setAttribute("role", "radio");
    btn.dataset.value = String(lvl.value);
    btn.textContent = String(lvl.value);
    btn.title = `${lvl.value} — ${lvl.label}: ${lvl.hint}`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const already = getConfidenceFor(zone.id) === lvl.value;
      setConfidenceFor(zone.id, already ? null : lvl.value);
      recordToday();
    });
    buttons.appendChild(btn);
  });

  // Repaint on any change, so the drawer and the page agree even when the
  // rating was set from the other one.
  // id is null when a whole save was imported, which repaints everything.
  const off = onConfidenceChange((id) => {
    if (id === null || id === zone.id) paint();
  });
  paint();
  return { el: wrap, dispose: off };
}

function closeDetail() {
  if (detailRating) {
    detailRating.dispose();
    detailRating = null;
  }
  if (!els.panel.hidden) {
    els.panel.hidden = true;
    els.backdrop.hidden = true;
    els.content.innerHTML = "";
  }
}

function closeAll() {
  currentZoneId = null;
  closeDetail();
  if (sheetRating) {
    sheetRating.dispose();
    sheetRating = null;
  }
  if (els.sheet) els.sheet.hidden = true;
  if (onChangeCallback) onChangeCallback(null);
}

export function openZonePanel(id) {
  location.hash = `zone/${id}`;
}

export function closeZonePanel() {
  // No-op when nothing is open: clicking bare ground is the common case, and it
  // should not push a history entry every time.
  if (!currentZoneId && !location.hash) return;
  location.hash = "";
}
