import { THEMES } from "./data.js";
import { makeStore } from "../lib/storage.js";
import { createDeck, boxOf, BOXES, SICHER_AT, TOP_BOX, escapeHtml } from "./deck.js";

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

  // Free-text notes per card, kept apart from the box state so a Zurücksetzen
  // of the ladder never throws away what you wrote.
  const notesKey = `${zone.id}:notes`;
  let notes = store.load(notesKey, {});
  if (!notes || typeof notes !== "object") notes = {};

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

  // Storage stays here; the deck is a view over it.
  const cards = words.map((w) => ({
    key: String(w.id),
    id: w.id,
    de: w.de,
    en: w.en,
    note: w.note,
  }));

  const deck = createDeck(deckPanel, {
    cards,
    dir,
    setDir(next) {
      dir = next;
      store.save(`${zone.id}:dir`, next);
    },
    getBox: (c) => (state[c.id] || {}).box || 0,
    setBox(c, box) {
      state[c.id] = { box, mastered: box >= SICHER_AT };
      save();
    },
    getNote: (c) => notes[c.id] || "",
    setNote(c, text) {
      if (text) notes[c.id] = text;
      else delete notes[c.id];
      store.save(notesKey, notes);
    },
    toolbarExtra: `<button class="ghost small" id="vt-reset">Zurücksetzen</button>`,
    wireToolbar(host) {
      host.querySelector("#vt-reset").addEventListener("click", () => {
        state = normalizeState({}, total); // notes are deliberately untouched
        save();
        deck.rebuild();
      });
    },
  });

  function renderDeck() {
    deck.render();
  }

  // ----------------------------------------------------------------- table

  let filter = "";
  let openOnly = false;

  function updateListCount() {
    const el = listPanel.querySelector(".list-count");
    if (el) el.textContent = `${listPanel.querySelectorAll("tbody tr[data-id]").length} / ${total}`;
  }

  function renderTable() {
    const q = filter.trim().toLowerCase();
    const rows = words.filter((w) => {
      const box = (state[w.id] || {}).box || 0;
      if (openOnly && box >= SICHER_AT) return false;
      if (!q) return true;
      return (w.de + " " + w.en + " " + w.note + " " + (notes[w.id] || "")).toLowerCase().indexOf(q) !== -1;
    });

    listPanel.innerHTML = `
      <div class="list-bar">
        <input type="search" id="vt-search" placeholder="Suchen…" value="${filter}" autocomplete="off">
        <span class="list-toggle">
          <input type="checkbox" id="vt-open" ${openOnly ? "checked" : ""}>
          <label for="vt-open">nur noch nicht sichere</label>
        </span>
        <span class="list-count mono">${rows.length} / ${total}</span>
      </div>
      <p class="list-help">Häkchen = auswendig. Das setzt die Karte auf <b>Box ${
        TOP_BOX + 1
      }</b> und zählt als sicher; das Häkchen wegzunehmen schickt sie zurück auf Box 1.</p>
      <div class="tablewrap">
        <table class="word-table">
          <thead><tr><th class="tick-col" title="Kann ich auswendig">Ausw.</th><th>Deutsch</th><th>Englisch</th><th>Hinweis</th><th>Notiz</th><th class="num">Box</th></tr></thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((w) => {
                      const box = (state[w.id] || {}).box || 0;
                      return `<tr data-id="${w.id}" data-sicher="${box >= SICHER_AT}">
                        <td class="tick-col"><input type="checkbox" class="know-tick" data-id="${w.id}" ${
                          box >= TOP_BOX ? "checked" : ""
                        } aria-label="${w.de} auswendig"></td>
                        <td><b>${w.de}</b></td>
                        <td>${w.en}</td>
                        <td class="note-cell">${w.note ? `<span class="badge">AT</span> ${w.note}` : ""}</td>
                        <td class="own-note">${escapeHtml(notes[w.id] || "")}</td>
                        <td class="num"><span class="box-pill" data-box="${box}">${box + 1}</span></td>
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="6" style="color:var(--ink-soft)">Nichts gefunden.</td></tr>`
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

    listPanel.querySelectorAll(".know-tick").forEach((tick) => {
      tick.addEventListener("change", () => {
        const id = Number(tick.dataset.id);
        // Checked jumps to the top box; unchecked drops to the bottom, the same
        // place a "Nochmal" in the deck would put it.
        const box = tick.checked ? TOP_BOX : 0;
        state[id] = { box, mastered: box >= SICHER_AT };
        save();
        // The deck's queue is ordered by box, so it has to be rebuilt.
        deck.rebuild();

        const row = listPanel.querySelector(`tr[data-id="${id}"]`);
        if (!row) return;
        if (openOnly && box >= SICHER_AT) {
          // It no longer belongs in this filtered view.
          row.remove();
          updateListCount();
          return;
        }
        row.dataset.sicher = String(box >= SICHER_AT);
        const pill = row.querySelector(".box-pill");
        pill.textContent = box + 1;
        pill.dataset.box = box;
      });
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
    const box = boxOf(v);
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
