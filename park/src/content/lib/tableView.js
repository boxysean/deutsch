// A grammar table you can cover and be asked from.
//
// This started in the Kölner Dom, which collects every table in the level and
// lets you blank the answer columns. That is the useful half of a reference
// table — reading one teaches you very little; being asked from it teaches you
// a lot — and there was no reason it should only exist two clicks away in a
// different building. The same table on its own lesson page now covers too.
//
// Both callers share this file so they cannot drift, and they share the "sitzt"
// state: tick a table in its lesson and the Dom's counter moves, because it is
// the same fact about the same table.

import { makeLevelStore } from "./storage.js";

const store = makeLevelStore("info:");
const STATE_KEY = "tables";

export function learnedTables() {
  const raw = store.load(STATE_KEY, {});
  return raw && typeof raw === "object" ? raw : {};
}

/**
 * @param t.caption/lede/head/rows  the table
 * @param opts.key      stable id for the "sitzt" tick — "<zoneId>:<index>",
 *                      the same key the Dom uses, so the two agree
 * @param opts.learnable  render the tick (the Dom and the lessons both do)
 */
export function coverableTableHtml(t, opts = {}) {
  const key = opts.key || "";
  const learnable = opts.learnable !== false;
  return `
    <div class="hall-table" data-covered="false" data-key="${key}">
      <div class="hall-table-head">
        <b>${t.caption}</b>
        <span class="deck-spacer"></span>
        <button type="button" class="ghost small th-cover-one">Verdecken</button>
        ${
          learnable
            ? `<label class="hall-learned">
                 <input type="checkbox" class="th-learned" data-key="${key}"> sitzt
               </label>`
            : ""
        }
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
                      // The first column is the key you are handed; everything
                      // after it is what you have to produce.
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

export function setCovered(el, on) {
  el.dataset.covered = on ? "true" : "false";
  el.querySelectorAll("td.coverable").forEach((td) => {
    td.dataset.revealed = "false";
  });
  const btn = el.querySelector(".th-cover-one");
  if (btn) btn.textContent = on ? "Aufdecken" : "Verdecken";
}

/** Wires every coverable table under `root`. @param onChange after a tick */
export function wireCoverableTables(root, onChange) {
  root.querySelectorAll(".th-cover-one").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".hall-table");
      setCovered(wrap, wrap.dataset.covered !== "true");
    });
  });

  // A covered cell reveals itself on click, so one lapse does not mean
  // starting the table again.
  root.querySelectorAll(".hall-table td.coverable").forEach((td) => {
    td.addEventListener("click", () => {
      if (td.closest(".hall-table").dataset.covered !== "true") return;
      td.dataset.revealed = td.dataset.revealed === "true" ? "false" : "true";
    });
  });

  const learned = learnedTables();
  root.querySelectorAll(".th-learned").forEach((box) => {
    const wrap = box.closest(".hall-table");
    box.checked = !!learned[box.dataset.key];
    wrap.dataset.learned = box.checked ? "true" : "false";
    box.addEventListener("change", () => {
      const all = learnedTables();
      if (box.checked) all[box.dataset.key] = true;
      else delete all[box.dataset.key];
      store.save(STATE_KEY, all);
      wrap.dataset.learned = box.checked ? "true" : "false";
      if (onChange) onChange(all);
    });
  });
}
