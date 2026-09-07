import { getZone, levelOfZone } from "../data/zones/index.js";
import { getLevel, setLevel, isLevel } from "../data/levels.js";
import { CATEGORIES } from "../data/categories.js";
import { DISTRICT } from "../iso/palette.js";
import { getPreview } from "../content/previews.js";
import { routeLength, isSettled } from "../content/lib/route.js";
import {
  CONFIDENCE_LEVELS,
  getConfidenceFor,
  setConfidenceFor,
  onConfidenceChange,
  getTopicNote,
  setTopicNote,
  onTopicNoteChange,
  recordToday,
} from "../content/lib/progress.js";
import { setReviewing, isReviewModule } from "../content/lib/practice.js";

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
  tableHall: () => import("../content/tableHall/index.js"),
  konjugationDrill: () => import("../content/konjugationDrill/index.js"),
  nicosWeg: () => import("../content/nicosWeg/index.js"),
};

let els = null;
let onChangeCallback = null;
let currentZoneId = null;
// The rating controls currently on screen. Each holds a subscription, so they
// are disposed when their view closes rather than piling up.
let detailRating = null;
let mountedModule = null;

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
    if (currentZoneId) location.hash = zoneHash(currentZoneId, true);
  });
  // Closing the expanded page drops back to the sheet rather than all the way out.
  els.close.addEventListener("click", () => {
    location.hash = currentZoneId ? zoneHash(currentZoneId) : "";
  });
  els.backdrop.addEventListener("click", () => {
    if (currentZoneId) location.hash = zoneHash(currentZoneId);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    // The vocabulary drill opens a full-screen layer above this panel and
    // handles its own Escape. Without this guard one press closed both, and
    // the reader landed back on the map instead of the deck they came from.
    if (document.body.dataset.deckFocus === "true") return;
    if (!els.panel.hidden && currentZoneId) location.hash = zoneHash(currentZoneId);
    else if (!els.sheet.hidden) location.hash = "";
  });

  window.addEventListener("hashchange", handleHash);
  handleHash();
}

export function onZoneChange(cb) {
  onChangeCallback = cb;
}

// #a2/zone/akkusativ/detail — the level comes first, so a shared link opens
// the right town as well as the right house. Links written before levels
// existed have no level segment; those are resolved from the zone id, which is
// unique across levels.
const HASH = /^#(?:([a-z][a-z0-9]*)\/)?zone\/([^/]+)(\/detail)?$/;

function handleHash() {
  const match = location.hash.match(HASH);
  if (!match) {
    closeAll();
    return;
  }
  const [, hashLevel, id, detail] = match;
  const wanted = isLevel(hashLevel) ? hashLevel : levelOfZone(id);
  // Following a link into the other town switches to it. main.js listens for
  // that and rebuilds the map, then re-runs this handler against the new level.
  if (wanted && wanted !== getLevel()) {
    setLevel(wanted);
    return;
  }
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
      ? `<span class="sheet-tag mono">Schritt ${zone.order} von ${routeLength()}${
          isSettled(zone.id) ? " · erledigt" : ""
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

  // No rating here. The drawer is what you get from a single click on the map,
  // so it was asking "how sure are you about this?" before you had opened
  // anything — and it asked again on the page behind it. Rating belongs where
  // you have just done the work; the Fernsehturm holds the full list.

  els.sheet.hidden = false;
}

// ---------------------------------------------------------------- detail page

async function openDetail(zone) {
  // A stub has no page. Returning here without closing left whatever was open
  // before still on the screen — deep-link from a built topic straight to a
  // stub's /detail URL and you got the previous topic's rules under the new
  // title. Nothing on the map does that, but a shared link does.
  if (zone.status !== "built" || !MODULE_LOADERS[zone.module]) {
    closeDetail();
    return;
  }

  // The practice clock runs only while a page you can actually review on is
  // open. The Fernsehturm and the Riesenrad are not review — reading your own
  // statistics must never be the thing that earns the streak.
  setReviewing(isReviewModule(zone.module));

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
    // A module may return { destroy } for anything it puts outside els.content
    // — the vocabulary drill's focus layer lives on <body> and would otherwise
    // survive the page being closed.
    mountedModule = mod.mount(els.content, zone) || null;
    // Rating a topic makes most sense right after working on it, so every
    // learning zone carries the strip. A module may return a ratingSlot to say
    // WHERE — the grammar topics keep it on their overview rather than under
    // every rule and every exercise. Anything that returns none gets it at the
    // foot of the page, as before.
    if (zone.category !== "info") {
      const rating = buildRatingControl(zone);
      detailRating = rating;
      const slot = mountedModule && mountedModule.ratingSlot;
      (slot || els.content).appendChild(rating.el);
    }
  } catch (err) {
    console.error("Failed to load zone module", zone.module, err);
    els.content.innerHTML = `<p>Inhalt konnte nicht geladen werden.</p>`;
  }
}

// One rating control, used in two places: the drawer that opens when you click
// a house, and the foot of that house's full page. Both write through
// setConfidenceFor, which announces the change so every other view follows.
function buildRatingControl(zone) {
  const wrap = document.createElement("div");
  wrap.className = "conf-strip";
  wrap.innerHTML = `
    <div class="conf-row">
      <span class="conf-q">Wie sicher fühlst du dich bei diesem Thema?</span>
      <span class="rate-buttons" role="radiogroup"></span>
      <span class="rate-word"></span>
    </div>
    <div class="topic-note">
      <label for="tn-${zone.id}">Notiz zu diesem Thema — woran du zuletzt gehangen bist</label>
      <textarea id="tn-${zone.id}" rows="3" spellcheck="false"
        placeholder="z. B. „Wechselpräpositionen: wohin = Akkusativ. Verwechsle ich ständig mit dem Dativ.“"></textarea>
      <span class="note-state"></span>
    </div>
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
  // The topic note: saved as you type, and flushed on blur so nothing is lost
  // by closing the page mid-sentence.
  const noteEl = wrap.querySelector("textarea");
  const noteState = wrap.querySelector(".note-state");
  let timer = null;
  noteEl.value = getTopicNote(zone.id);
  function commit() {
    clearTimeout(timer);
    setTopicNote(zone.id, noteEl.value);
    noteState.textContent = noteEl.value.trim() ? "gespeichert" : "";
  }
  noteEl.addEventListener("input", () => {
    clearTimeout(timer);
    noteState.textContent = "…";
    timer = setTimeout(commit, 400);
  });
  noteEl.addEventListener("blur", commit);

  // Follow a change made in the other copy of this control, unless the reader
  // is mid-sentence in this one.
  const offNote = onTopicNoteChange((id, text) => {
    if (id !== zone.id || document.activeElement === noteEl) return;
    clearTimeout(timer);
    noteEl.value = text;
    noteState.textContent = text ? "gespeichert" : "";
  });

  paint();
  return {
    el: wrap,
    dispose() {
      commit();
      off();
      offNote();
    },
  };
}

function closeDetail() {
  setReviewing(false);
  if (mountedModule && typeof mountedModule.destroy === "function") {
    mountedModule.destroy();
  }
  mountedModule = null;
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
  if (els.sheet) els.sheet.hidden = true;
  if (onChangeCallback) onChangeCallback(null);
}

export function zoneHash(id, detail = false) {
  return `${getLevel()}/zone/${id}${detail ? "/detail" : ""}`;
}

export function openZonePanel(id, detail = false) {
  location.hash = zoneHash(id, detail);
}

// Called by main.js after it has rebuilt the map for a new level, so the
// overlay re-reads the hash against the zones that now exist.
export function refreshOverlay() {
  closeAll();
  handleHash();
}

export function closeZonePanel() {
  // No-op when nothing is open: clicking bare ground is the common case, and it
  // should not push a history entry every time.
  if (!currentZoneId && !location.hash) return;
  location.hash = "";
}
