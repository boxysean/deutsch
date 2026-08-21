import { THEMES } from "./data.js";
import { makeLevelStore } from "../lib/storage.js";
import {
  createDeck,
  boxOf,
  withBox,
  wordIsSicher,
  BOXES,
  SICHER_AT,
  TOP_BOX,
  escapeHtml,
} from "./deck.js";

// A vocabulary zone is a deck, not a wall of tiles. Three views:
//   Karteikarten — one card at a time, flipped and graded, Anki-style
//   Wortliste    — every word in a table, searchable
//   Redemittel   — the ready-made sentences for this theme
//
// Grading uses a small Leitner ladder rather than a binary "known". A card
// climbs a box when you get it right and falls to the bottom when you don't,
// and the deck is ordered by box, so the words you keep missing come round
// again first. Each direction has its own ladder.
const store = makeLevelStore("vokabel:");


export function mount(container, zone) {
  const theme = THEMES[zone.id];
  if (!theme) {
    container.innerHTML = `<p>Für dieses Thema gibt es noch keine Vokabelliste.</p>`;
    return;
  }

  const words = theme.words.map((w, i) => ({ id: i, de: w[0], en: w[1], note: w[2] || "" }));
  const total = words.length;
  const stateKey = `${zone.id}:state`;

  // { fwd, rev, mastered } per word id, read through boxOf so the two older
  // shapes still count. Written only through withBox, so one direction is never
  // clobbered by the other.
  let state = store.load(stateKey, {}) || {};
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

  function sicherCount() {
    return words.filter((w) => wordIsSicher(state[w.id])).length;
  }

  // ------------------------------------------------------------------ deck

  // Storage stays here; the deck is a view over it. One card per word per
  // direction, so both ways are tracked apart.
  function cardsFor(which) {
    const wanted = which === "mixed" ? ["de-en", "en-de"] : [which];
    const out = [];
    words.forEach((w) => {
      wanted.forEach((facing) => {
        out.push({
          key: `${w.id}:${facing}`,
          id: w.id,
          facing,
          de: w.de,
          en: w.en,
          hint: w.note,
        });
      });
    });
    return out;
  }

  const deck = createDeck(deckPanel, {
    cardsFor,
    dir,
    setDir(next) {
      dir = next;
      store.save(`${zone.id}:dir`, next);
    },
    wordCount: () => ({ done: sicherCount(), total }),
    getBox: (c) => boxOf(state[c.id], c.facing),
    setBox(c, box) {
      state[c.id] = withBox(state[c.id], c.facing, box);
      save();
    },
    toolbarExtra: `<button class="ghost small" id="vt-reset">Zurücksetzen</button>`,
    wireToolbar(host) {
      host.querySelector("#vt-reset").addEventListener("click", () => {
        state = {};
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
      if (openOnly && wordIsSicher(state[w.id])) return false;
      if (!q) return true;
      return (w.de + " " + w.en + " " + w.note).toLowerCase().indexOf(q) !== -1;
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
      <p class="list-help">Jedes Wort wird in <b>beide Richtungen</b> geführt: <b>DE→EN</b> fragt die Bedeutung, <b>EN→DE</b> verlangt das Wort <em>mit Artikel</em> — nur die zweite prüft das Genus. Ein Wort gilt erst als sicher, wenn beide Richtungen sitzen. Das Häkchen setzt beide auf <b>Box ${
        TOP_BOX + 1
      }</b>; es wegzunehmen schickt beide zurück auf Box 1.</p>
      <div class="tablewrap">
        <table class="word-table">
          <thead><tr>
            <th class="tick-col" title="Kann ich auswendig — in beide Richtungen">Ausw.</th>
            <th>Deutsch</th><th>Englisch</th><th>Hinweis</th>
            <th class="num" title="Deutsch → Englisch: die Bedeutung">DE→EN</th>
            <th class="num" title="Englisch → Deutsch: Wort und Artikel">EN→DE</th>
          </tr></thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((w) => {
                      const fwd = boxOf(state[w.id], "de-en");
                      const rev = boxOf(state[w.id], "en-de");
                      const both = fwd >= TOP_BOX && rev >= TOP_BOX;
                      return `<tr data-id="${w.id}" data-sicher="${wordIsSicher(state[w.id])}">
                        <td class="tick-col"><input type="checkbox" class="know-tick" data-id="${w.id}" ${
                          both ? "checked" : ""
                        } aria-label="${w.de} auswendig"></td>
                        <td><b>${w.de}</b></td>
                        <td>${w.en}</td>
                        <td class="note-cell">${w.note ? `<span class="badge">AT</span> ${w.note}` : ""}</td>
                        <td class="num"><span class="box-pill" data-fwd data-box="${fwd}">${fwd + 1}</span></td>
                        <td class="num"><span class="box-pill" data-rev data-box="${rev}">${rev + 1}</span></td>
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
        // "By heart" is a claim about the word, not one direction, so it sets
        // both; clearing it drops both, where a "Nochmal" would put them.
        const box = tick.checked ? TOP_BOX : 0;
        state[id] = withBox(withBox(state[id], "de-en", box), "en-de", box);
        save();
        // The deck's queue is ordered by box, so it has to be rebuilt.
        deck.rebuild();

        const row = listPanel.querySelector(`tr[data-id="${id}"]`);
        if (!row) return;
        if (openOnly && wordIsSicher(state[id])) {
          // It no longer belongs in this filtered view.
          row.remove();
          updateListCount();
          return;
        }
        row.dataset.sicher = String(wordIsSicher(state[id]));
        row.querySelectorAll(".box-pill").forEach((pill) => {
          pill.textContent = box + 1;
          pill.dataset.box = box;
        });
      });
    });
  }

  activate("deck");

  return { destroy: () => deck.destroy() };
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
