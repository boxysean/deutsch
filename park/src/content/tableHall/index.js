import { TOPICS } from "../grammarTopic/data.js";
import { ZONES } from "../../data/zones.js";
import { makeStore } from "../lib/storage.js";

// The Kölner Dom: every grammar table in one nave.
//
// Some of A2 is understanding and some of it is simply knowing — the article
// grid, the Wechselpräpositionen, the strong participles. Those live scattered
// across eleven topics, which is the right place to meet them and the wrong
// place to memorise them. Here they stand together, in route order, each one
// coverable so the page can ask instead of tell.
const store = makeStore("deutsch-info:");

const STATE_KEY = "tables";

// Schritt 1 is the one topic whose tables are written straight into its page
// rather than declared as data, so they have to be restated here. Only the two
// that are genuinely learned by heart come along: the stem-changing verbs and
// sein/haben/werden. The Position-1 table on that page shows one verb in four
// sentences — a demonstration, not a paradigm, so it stays there.
//
// The Typ column is second, not first: given an infinitive you should be able
// to produce the pattern and both forms, which only works if the infinitive is
// the key you are handed.
const EXTRA_TABLES = {
  "grammar-foundations": [
    {
      caption: "Stammveränderung (2./3. Person Singular)",
      lede: "Nur du und er/sie/es ändern den Stamm — ich, wir, ihr, sie bleiben regelmäßig.",
      head: ["Infinitiv", "Typ", "du", "er/sie/es"],
      rows: [
        ["fahren", "a → ä", "fährst", "fährt"],
        ["schlafen", "a → ä", "schläfst", "schläft"],
        ["sprechen", "e → i", "sprichst", "spricht"],
        ["essen", "e → i", "isst", "isst"],
        ["geben", "e → i", "gibst", "gibt"],
        ["sehen", "e → ie", "siehst", "sieht"],
        ["lesen", "e → ie", "liest", "liest"],
        ["nehmen", "irregulär", "nimmst", "nimmt"],
        ["wissen", "irregulär", "weißt", "weiß"],
      ],
    },
    {
      caption: "sein, haben, werden",
      lede: "Die drei Hilfsverben. Ohne sie geht kein Perfekt, kein Passiv und kaum ein Satz.",
      head: ["", "sein", "haben", "werden"],
      rows: [
        ["ich", "bin", "habe", "werde"],
        ["du", "bist", "hast", "wirst"],
        ["er/sie/es", "ist", "hat", "wird"],
        ["wir", "sind", "haben", "werden"],
        ["ihr", "seid", "habt", "werdet"],
        ["sie/Sie", "sind", "haben", "werden"],
      ],
    },
  ],
};

export function mount(container) {
  const order = new Map(ZONES.map((z) => [z.id, z.order || 999]));
  const names = new Map(ZONES.map((z) => [z.id, z.name]));

  const tablesOf = (id) => (TOPICS[id]?.tables || []).concat(EXTRA_TABLES[id] || []);

  // Every table, grouped by its topic, topics in route order.
  const groups = [...new Set(Object.keys(TOPICS).concat(Object.keys(EXTRA_TABLES)))]
    .filter((id) => tablesOf(id).length)
    .sort((a, b) => (order.get(a) || 999) - (order.get(b) || 999))
    .map((id) => ({
      id,
      step: order.get(id),
      name: names.get(id) || id,
      tables: tablesOf(id).map((t, i) => ({ ...t, key: `${id}:${i}` })),
    }));

  const allTables = groups.reduce((n, g) => n + g.tables.length, 0);
  let learned = store.load(STATE_KEY, {}) || {};

  container.innerHTML = `
    <p class="lede measure">Ein Teil von A2 ist Verstehen, ein Teil ist schlicht Wissen: das Artikelraster, die neun Wechselpräpositionen, die starken Partizipien. Hier stehen <b>alle ${allTables} Tabellen</b> aus ${groups.length} Grammatik-Themen zusammen — verdecke eine Spalte und lass dich abfragen, statt sie nur zu lesen.</p>
    <div class="hall-bar">
      <span class="hall-count">Sitzt: <b id="th-count">0</b> / ${allTables}</span>
      <span class="deck-spacer"></span>
      <button class="ghost small" id="th-cover">Alles verdecken</button>
      <button class="ghost small" id="th-show">Alles zeigen</button>
    </div>
    <nav class="hall-toc" id="th-toc"></nav>
    <div id="th-body"></div>
  `;

  container.querySelector("#th-toc").innerHTML = groups
    .map(
      (g) =>
        `<a href="#th-${g.id}" data-jump="${g.id}"><span class="mono">${g.step}</span> ${g.name} <span class="toc-n">${g.tables.length}</span></a>`
    )
    .join("");

  container.querySelector("#th-body").innerHTML = groups
    .map(
      (g) => `
      <section class="hall-group" id="th-${g.id}">
        <div class="subhead">
          <span class="mono" style="color:var(--ink-soft)">Schritt ${g.step}</span> · ${g.name}
        </div>
        ${g.tables.map((t) => tableHtml(t)).join("")}
      </section>`
    )
    .join("");

  // Jump links scroll inside the panel, which is the scrolling element here.
  container.querySelectorAll("#th-toc a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = container.querySelector(`#th-${a.dataset.jump}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function paintCount() {
    container.querySelector("#th-count").textContent = Object.values(learned).filter(Boolean).length;
  }

  container.querySelectorAll(".th-learned").forEach((box) => {
    box.checked = !!learned[box.dataset.key];
    box.addEventListener("change", () => {
      if (box.checked) learned[box.dataset.key] = true;
      else delete learned[box.dataset.key];
      store.save(STATE_KEY, learned);
      box.closest(".hall-table").dataset.learned = box.checked ? "true" : "false";
      paintCount();
    });
    box.closest(".hall-table").dataset.learned = box.checked ? "true" : "false";
  });

  // Covering blanks every column but the first — the first is the key you are
  // given, the rest is what you have to produce. A covered cell reveals itself
  // on click, so a single lapse does not mean starting the table again.
  function setCovered(el, on) {
    el.dataset.covered = on ? "true" : "false";
    el.querySelectorAll("td.coverable").forEach((td) => {
      td.dataset.revealed = "false";
    });
  }

  container.querySelectorAll(".th-cover-one").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".hall-table");
      const on = wrap.dataset.covered !== "true";
      setCovered(wrap, on);
      btn.textContent = on ? "Aufdecken" : "Verdecken";
    });
  });

  container.querySelectorAll(".hall-table td.coverable").forEach((td) => {
    td.addEventListener("click", () => {
      if (td.closest(".hall-table").dataset.covered !== "true") return;
      td.dataset.revealed = td.dataset.revealed === "true" ? "false" : "true";
    });
  });

  container.querySelector("#th-cover").addEventListener("click", () => {
    container.querySelectorAll(".hall-table").forEach((w) => {
      setCovered(w, true);
      w.querySelector(".th-cover-one").textContent = "Aufdecken";
    });
  });
  container.querySelector("#th-show").addEventListener("click", () => {
    container.querySelectorAll(".hall-table").forEach((w) => {
      setCovered(w, false);
      w.querySelector(".th-cover-one").textContent = "Verdecken";
    });
  });

  paintCount();
}

function tableHtml(t) {
  return `
    <div class="hall-table" data-covered="false">
      <div class="hall-table-head">
        <b>${t.caption}</b>
        <span class="deck-spacer"></span>
        <button class="ghost small th-cover-one">Verdecken</button>
        <label class="hall-learned">
          <input type="checkbox" class="th-learned" data-key="${t.key}"> sitzt
        </label>
      </div>
      ${t.lede ? `<p class="hall-lede">${t.lede}</p>` : ""}
      <div class="tablewrap">
        <table>
          <thead><tr>${t.head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>
            ${t.rows
              .map(
                (row) =>
                  `<tr>${row
                    .map((c, i) =>
                      i === 0
                        ? `<td class="key-col">${c}</td>`
                        : `<td class="coverable" data-revealed="false"><span>${c}</span></td>`
                    )
                    .join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}
