import { topicsFor } from "../registry.js";
import { getZones } from "../../data/zones/index.js";
import {
  coverableTableHtml,
  wireCoverableTables,
  setCovered,
  learnedTables,
} from "../lib/tableView.js";

// The Kölner Dom: every grammar table in one nave.
//
// Some of A2 is understanding and some of it is simply knowing — the article
// grid, the Wechselpräpositionen, the strong participles. Those live scattered
// across eleven topics, which is the right place to meet them and the wrong
// place to memorise them. Here they stand together, in route order, each one
// coverable so the page can ask instead of tell.
import { EXTRA_TABLES } from "./extraTables.js";

export function mount(container) {
  const zones = getZones();
  const TOPICS = topicsFor();
  const order = new Map(zones.map((z) => [z.id, z.order || 999]));
  const names = new Map(zones.map((z) => [z.id, z.name]));

  const tablesOf = (id) => (TOPICS[id]?.tables || []).concat(EXTRA_TABLES[id] || []);

  // Every table, grouped by its topic, topics in route order.
  //
  // EXTRA_TABLES is keyed by zone id across all levels, so it has to be filtered
  // to this level as well — otherwise A1's hall picks up A2's hand-written
  // Schritt-1 tables, which topicsFor() would never have handed over.
  const here = new Set(zones.map((z) => z.id));
  const groups = [...new Set(Object.keys(TOPICS).concat(Object.keys(EXTRA_TABLES)))]
    .filter((id) => here.has(id) && tablesOf(id).length)
    .sort((a, b) => (order.get(a) || 999) - (order.get(b) || 999))
    .map((id) => ({
      id,
      step: order.get(id),
      name: names.get(id) || id,
      tables: tablesOf(id).map((t, i) => ({ ...t, key: `${id}:${i}` })),
    }));

  const allTables = groups.reduce((n, g) => n + g.tables.length, 0);

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
        ${g.tables.map((t) => coverableTableHtml(t, { key: t.key })).join("")}
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
    container.querySelector("#th-count").textContent = Object.values(learnedTables()).filter(Boolean).length;
  }

  wireCoverableTables(container, paintCount);

  container.querySelector("#th-cover").addEventListener("click", () => {
    container.querySelectorAll(".hall-table").forEach((w) => setCovered(w, true));
  });
  container.querySelector("#th-show").addEventListener("click", () => {
    container.querySelectorAll(".hall-table").forEach((w) => setCovered(w, false));
  });

  paintCount();
}

// The table itself is rendered by lib/tableView.js, which the lesson pages
// use as well, so the two can never drift apart.
