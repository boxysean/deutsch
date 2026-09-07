import { CHAPTERS, COURSE_URL } from "./data.js";
import { makeLevelStore } from "../lib/storage.js";
import { recordToday } from "../lib/progress.js";

// Flughafen Tempelhof: where you keep your place in Nico's Weg.
//
// Deliberately the simplest page in the app. It holds no lessons and grades
// nothing — the course lives at DW and this is only the note of how far you
// got, plus a way back to it. Everything else here teaches; this remembers.
const store = makeLevelStore("nico:");
const KEY = "done";

export function mount(container) {
  let done = store.load(KEY, {}) || {};

  container.innerHTML = `
    <p class="lede measure">Nico's Weg ist der Videokurs der Deutschen Welle — eine Geschichte in Folgen, kein Übungsheft. Er läuft dort, nicht hier; das hier ist nur der Zettel, auf dem steht, wie weit du gekommen bist.</p>
    <div class="nw-bar">
      <span class="nw-count"><b id="nw-done">0</b> / ${CHAPTERS.length} Kapitel</span>
      <span class="deck-spacer"></span>
      <a class="nw-link" id="nw-link" href="${COURSE_URL}" target="_blank" rel="noopener noreferrer">Kurs bei der DW öffnen ↗</a>
    </div>
    <div class="nw-track"><div class="nw-fill" id="nw-fill"></div></div>
    <ul class="nw-list" id="nw-list"></ul>
    <div class="actions">
      <button type="button" class="ghost small" id="nw-reset">Alles zurücksetzen</button>
    </div>
  `;

  const list = container.querySelector("#nw-list");
  list.innerHTML = CHAPTERS.map(
    (c) => `
    <li class="nw-item" data-key="${c.key}">
      <label>
        <input type="checkbox" class="nw-tick" data-key="${c.key}">
        <span class="nw-n mono">${c.label}</span>
        <span class="nw-title">${c.title}</span>
      </label>
    </li>`
  ).join("");

  function paint() {
    const n = CHAPTERS.filter((c) => done[c.key]).length;
    container.querySelector("#nw-done").textContent = n;
    container.querySelector("#nw-fill").style.width = `${(n / CHAPTERS.length) * 100}%`;
    list.querySelectorAll(".nw-item").forEach((li) => {
      const on = !!done[li.dataset.key];
      li.dataset.done = on ? "true" : "false";
      li.querySelector(".nw-tick").checked = on;
    });
  }

  list.querySelectorAll(".nw-tick").forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) done[box.dataset.key] = true;
      else delete done[box.dataset.key];
      store.save(KEY, done);
      paint();
      // The Fernsehturm plots a point a day; ticking a chapter is progress
      // worth landing on today's.
      recordToday();
    });
  });

  container.querySelector("#nw-reset").addEventListener("click", () => {
    done = {};
    store.save(KEY, done);
    paint();
    recordToday();
  });

  paint();
}
