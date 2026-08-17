import { THEMES } from "./data.js";
import { makeStore } from "../lib/storage.js";

// A vocabulary zone is a deck, not a wall of tiles. Three views:
//   Karteikarten — one card at a time, flipped and graded, Anki-style
//   Wortliste    — every word in a table, searchable
//   Redemittel   — the ready-made sentences for this theme
//
// Grading uses a small Leitner ladder rather than a binary "known". A card
// climbs a box when you get it right and falls to the bottom when you don't,
// and the deck is ordered by box, so the words you keep missing come round
// again first.
const store = makeStore("deutsch-vokabel:");

const BOXES = 5; // 0..4
const SICHER_AT = 3; // box 3 and up counts as "sicher" for the progress total

const GRADES = [
  { id: "again", label: "Nochmal", hint: "Zurück in Box 1", key: "1", delta: null },
  { id: "good", label: "Gut", hint: "Eine Box weiter", key: "2", delta: 1 },
  { id: "easy", label: "Leicht", hint: "Zwei Boxen weiter", key: "3", delta: 2 },
];

// A card missed in this session comes back before the end of it.
const REINSERT_AFTER = 5;

export function mount(container, zone) {
  const theme = THEMES[zone.id];
  if (!theme) {
    container.innerHTML = `<p>Für dieses Thema gibt es noch keine Vokabelliste.</p>`;
    return;
  }

  const words = theme.words.map((w, i) => ({ id: i, de: w[0], en: w[1], note: w[2] || "" }));
  const total = words.length;
  const stateKey = `${zone.id}:state`;

  // { box, mastered } per word id. Entries written before the boxes existed
  // carry only `mastered`, so they are read as already at the "sicher" line
  // rather than being sent back to the start.
  let state = normalizeState(store.load(stateKey, {}), total);
  let dir = store.load(`${zone.id}:dir`, "de-en");

  container.innerHTML = `
    <p class="lede measure">${theme.intro}</p>
    <div class="tabs" id="vt-tabs"></div>
    <div id="vt-panels"></div>
  `;

  const tabs = [
    { id: "deck", label: "Karteikarten" },
    { id: "liste", label: "Wortliste" },
    { id: "redemittel", label: "Redemittel" },
  ];

  const tabsEl = container.querySelector("#vt-tabs");
  const panelsEl = container.querySelector("#vt-panels");

  tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "small";
    btn.textContent = tab.label;
    btn.dataset.active = "false";
    btn.addEventListener("click", () => activate(tab.id));
    tabsEl.appendChild(btn);
    tab.button = btn;

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.dataset.active = "false";
    panelsEl.appendChild(panel);
    tab.panel = panel;
  });

  function activate(id) {
    tabs.forEach((t) => {
      const on = t.id === id;
      t.button.dataset.active = on ? "true" : "false";
      t.panel.dataset.active = on ? "true" : "false";
    });
    if (id === "liste") renderTable();
    if (id === "deck") renderDeck();
  }

  const deckPanel = tabs[0].panel;
  const listPanel = tabs[1].panel;
  tabs[2].panel.innerHTML = phrasesHtml(theme);

  function save() {
    store.save(stateKey, state);
  }

  function counts() {
    const sicher = words.filter((w) => (state[w.id] || {}).box >= SICHER_AT).length;
    const byBox = new Array(BOXES).fill(0);
    words.forEach((w) => {
      byBox[Math.min(BOXES - 1, (state[w.id] || {}).box || 0)]++;
    });
    return { sicher, byBox };
  }

  // ------------------------------------------------------------------ deck

  let queue = [];
  let pos = 0;
  let flipped = false;

  // Weakest boxes first, so the words you keep missing lead the deck.
  function buildQueue() {
    queue = words
      .map((w) => w.id)
      .sort((a, b) => {
        const ba = (state[a] || {}).box || 0;
        const bb = (state[b] || {}).box || 0;
        if (ba !== bb) return ba - bb;
        return a - b;
      });
    pos = 0;
    flipped = false;
  }

  function shuffleQueue() {
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    pos = 0;
    flipped = false;
  }

  // In "gemischt" the direction is fixed per position, so flipping back and
  // forth through the deck never changes a card under you.
  function directionFor(index) {
    if (dir === "de-en" || dir === "en-de") return dir;
    return index % 2 === 0 ? "de-en" : "en-de";
  }

  function renderDeck() {
    if (!queue.length) buildQueue();
    const { sicher, byBox } = counts();
    const wordId = queue[Math.min(pos, queue.length - 1)];
    const w = words[wordId];
    const facing = directionFor(pos);
    const front = facing === "de-en" ? w.de : w.en;
    const back = facing === "de-en" ? w.en : w.de;
    const box = (state[w.id] || {}).box || 0;

    deckPanel.innerHTML = `
      <div class="deck-bar">
        <span class="deck-count mono">Karte ${pos + 1} / ${queue.length}</span>
        <span class="deck-sicher">Sicher: <b>${sicher}</b> / ${total}</span>
        <span class="deck-spacer"></span>
        <span class="seg" id="vt-dir" role="radiogroup" aria-label="Richtung">
          <button class="seg-btn" data-dir="de-en" data-picked="${dir === "de-en"}">DE → EN</button>
          <button class="seg-btn" data-dir="en-de" data-picked="${dir === "en-de"}">EN → DE</button>
          <button class="seg-btn" data-dir="mixed" data-picked="${dir === "mixed"}">Gemischt</button>
        </span>
        <button class="ghost small" id="vt-shuffle">Mischen</button>
        <button class="ghost small" id="vt-reset">Zurücksetzen</button>
      </div>

      <div class="deck-boxes" title="Verteilung über die Boxen">
        ${byBox
          .map(
            (n, i) =>
              `<span class="box-chip" data-box="${i}"><b>${n}</b><span>Box ${i + 1}</span></span>`
          )
          .join("")}
      </div>

      <div class="flashcard" id="vt-card" data-flipped="${flipped}" tabindex="0"
           role="button" aria-label="Karte umdrehen">
        <span class="fc-side mono">${facing === "de-en" ? "Deutsch" : "Englisch"}</span>
        <span class="fc-box mono">Box ${box + 1}</span>
        <div class="fc-front">${front}</div>
        <div class="fc-back">
          <div class="fc-answer">${back}</div>
          ${w.note ? `<div class="fc-note">${w.note}</div>` : ""}
        </div>
        <div class="fc-hint">${flipped ? "" : "Klicken oder Leertaste zum Aufdecken"}</div>
      </div>

      <div class="deck-actions" data-flipped="${flipped}">
        <div class="grade-row">
          ${GRADES.map(
            (g) =>
              `<button class="grade-btn" data-grade="${g.id}"><b>${g.label}</b><span>${g.hint} · ${g.key}</span></button>`
          ).join("")}
        </div>
        <button class="primary reveal-btn" id="vt-flip">Aufdecken <kbd>Leertaste</kbd></button>
      </div>

      <div class="deck-nav">
        <button class="ghost small" id="vt-prev" ${pos === 0 ? "disabled" : ""}>← Zurück</button>
        <span class="deck-hint">Leertaste umdrehen · 1 / 2 / 3 bewerten · ← → blättern</span>
        <button class="ghost small" id="vt-next" ${pos >= queue.length - 1 ? "disabled" : ""}>Weiter →</button>
      </div>
    `;

    const card = deckPanel.querySelector("#vt-card");
    card.addEventListener("click", flip);
    deckPanel.querySelector("#vt-flip").addEventListener("click", flip);
    deckPanel.querySelectorAll(".grade-btn").forEach((btn) => {
      btn.addEventListener("click", () => grade(btn.dataset.grade));
    });
    deckPanel.querySelector("#vt-prev").addEventListener("click", () => step(-1));
    deckPanel.querySelector("#vt-next").addEventListener("click", () => step(1));
    deckPanel.querySelectorAll("#vt-dir .seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        dir = btn.dataset.dir;
        store.save(`${zone.id}:dir`, dir);
        flipped = false;
        renderDeck();
      });
    });
    deckPanel.querySelector("#vt-shuffle").addEventListener("click", () => {
      shuffleQueue();
      renderDeck();
    });
    deckPanel.querySelector("#vt-reset").addEventListener("click", () => {
      state = normalizeState({}, total);
      save();
      buildQueue();
      renderDeck();
    });
  }

  function flip() {
    flipped = !flipped;
    renderDeck();
  }

  function step(by) {
    pos = Math.min(queue.length - 1, Math.max(0, pos + by));
    flipped = false;
    renderDeck();
  }

  function grade(id) {
    const g = GRADES.find((x) => x.id === id);
    if (!g) return;
    const wordId = queue[pos];
    const cur = state[wordId] || { box: 0 };
    const box = g.delta === null ? 0 : Math.min(BOXES - 1, (cur.box || 0) + g.delta);
    state[wordId] = { box, mastered: box >= SICHER_AT };
    save();

    // A missed card comes back later in this session rather than being lost
    // until the next visit.
    if (g.delta === null && queue.length > REINSERT_AFTER) {
      queue.splice(pos, 1);
      queue.splice(Math.min(queue.length, pos + REINSERT_AFTER), 0, wordId);
      flipped = false;
      renderDeck();
      return;
    }
    if (pos < queue.length - 1) pos += 1;
    flipped = false;
    renderDeck();
  }

  // Self-cleaning: the panel's content is discarded when the page closes, so
  // the listener drops itself once its card is gone from the document.
  function onKey(e) {
    if (!document.body.contains(container)) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (tabs[0].panel.dataset.active !== "true") return;
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flip();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (flipped && ["1", "2", "3"].indexOf(e.key) !== -1) {
      e.preventDefault();
      grade(GRADES[Number(e.key) - 1].id);
    }
  }
  document.addEventListener("keydown", onKey);

  // ----------------------------------------------------------------- table

  let filter = "";
  let openOnly = false;

  function renderTable() {
    const q = filter.trim().toLowerCase();
    const rows = words.filter((w) => {
      const box = (state[w.id] || {}).box || 0;
      if (openOnly && box >= SICHER_AT) return false;
      if (!q) return true;
      return (w.de + " " + w.en + " " + w.note).toLowerCase().indexOf(q) !== -1;
    });

    listPanel.innerHTML = `
      <div class="list-bar">
        <input type="search" id="vt-search" placeholder="Suchen…" value="${filter}" autocomplete="off">
        <label class="list-toggle"><input type="checkbox" id="vt-open" ${
          openOnly ? "checked" : ""
        }> nur noch nicht sichere</label>
        <span class="list-count mono">${rows.length} / ${total}</span>
      </div>
      <div class="tablewrap">
        <table class="word-table">
          <thead><tr><th>Deutsch</th><th>Englisch</th><th>Hinweis</th><th class="num">Box</th></tr></thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((w) => {
                      const box = (state[w.id] || {}).box || 0;
                      return `<tr data-sicher="${box >= SICHER_AT}">
                        <td><b>${w.de}</b></td>
                        <td>${w.en}</td>
                        <td class="note-cell">${w.note ? `<span class="badge">AT</span> ${w.note}` : ""}</td>
                        <td class="num"><span class="box-pill" data-box="${box}">${box + 1}</span></td>
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="4" style="color:var(--ink-soft)">Nichts gefunden.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `;

    const search = listPanel.querySelector("#vt-search");
    search.addEventListener("input", () => {
      filter = search.value;
      const at = search.selectionStart;
      renderTable();
      const next = listPanel.querySelector("#vt-search");
      next.focus();
      next.setSelectionRange(at, at);
    });
    listPanel.querySelector("#vt-open").addEventListener("change", (e) => {
      openOnly = e.target.checked;
      renderTable();
    });
  }

  activate("deck");
}

// Older saves stored only { mastered: true }. Those words are placed at the
// "sicher" line rather than at the bottom of the ladder, so nobody loses work.
function normalizeState(raw, total) {
  const out = {};
  for (let i = 0; i < total; i++) {
    const v = raw && raw[i];
    if (!v) continue;
    const box = Number.isInteger(v.box) ? Math.min(BOXES - 1, Math.max(0, v.box)) : v.mastered ? SICHER_AT : 0;
    out[i] = { box, mastered: box >= SICHER_AT };
  }
  return out;
}

function phrasesHtml(theme) {
  return `
    <div class="subhead" style="margin-top:0">${theme.phrasesTitle || "Redemittel"}</div>
    <p class="measure" style="color:var(--ink-soft);margin-bottom:1rem;">
      Ganze Sätze, die du so übernehmen kannst — im Sprechen wie im Schreiben.
    </p>
    <div class="rule-box measure">
      ${theme.phrases
        .map(
          (p) =>
            `<p style="margin-bottom:0.55rem;"><b>${p[0]}</b><br><span style="color:var(--ink-soft);font-size:0.88rem;">${p[1]}</span></p>`
        )
        .join("")}
    </div>
  `;
}
