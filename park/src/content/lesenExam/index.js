import { aufgabe1, aufgabe2 } from "./data.js";
import { makeLevelStore } from "../lib/storage.js";

const store = makeLevelStore("lesen:");
function save(key, val) {
  store.save(key, val);
}
function load(key, fallback) {
  return store.load(key, fallback);
}

export function mount(container) {
  container.innerHTML = `
    <p class="lede measure">Echte Aufgaben aus dem offiziellen ÖSD-Modellsatz (Zertifikat A2). 30 Minuten, 25 Punkte, Mindestpunktzahl zum Bestehen: 5.</p>

    <div class="subhead">${aufgabe1.title} — ${aufgabe1.points} Punkte</div>
    <p class="measure" style="color:var(--ink-soft);margin-bottom:0.9rem;">${aufgabe1.instructions}</p>
    <div id="a1-headlines" class="rule-box measure" style="margin-bottom:1.1rem;"></div>
    <div id="a1-texts"></div>
    <div class="actions">
      <button class="primary" id="a1-check">Auswertung anzeigen</button>
      <button class="ghost" id="a1-reset">Zurücksetzen</button>
    </div>
    <div class="scorebox" id="a1-score">
      <div class="scoreline"><span class="big mono" id="a1-score-n">0</span><span class="of">/ ${aufgabe1.points} Punkte</span></div>
    </div>

    <div class="subhead">${aufgabe2.title} — ${aufgabe2.points} Punkte</div>
    <div class="rule-box measure" style="margin-bottom:1.1rem;">
      <p style="font-weight:700;margin-bottom:0.6rem;">${aufgabe2.passageTitle}</p>
      ${aufgabe2.passage.map((p) => `<p style="margin-bottom:0.6rem;">${p}</p>`).join("")}
      <p style="font-size:0.8rem;color:var(--ink-soft);">${aufgabe2.source}</p>
    </div>
    <div id="a2-questions"></div>
    <div class="actions">
      <button class="primary" id="a2-check">Auswertung anzeigen</button>
      <button class="ghost" id="a2-reset">Zurücksetzen</button>
    </div>
    <div class="scorebox" id="a2-score">
      <div class="scoreline"><span class="big mono" id="a2-score-n">0</span><span class="of">/ ${aufgabe2.points} Punkte</span></div>
    </div>
  `;

  buildAufgabe1(container);
  buildAufgabe2(container);
}

function buildAufgabe1(container) {
  const headlinesEl = container.querySelector("#a1-headlines");
  headlinesEl.innerHTML = aufgabe1.headlines
    .map((h) => `<p style="margin-bottom:0.3rem;"><b class="mono">${h.id}</b> — ${h.text}</p>`)
    .join("");

  const textsEl = container.querySelector("#a1-texts");
  const saved = load("aufgabe1", {});
  aufgabe1.texts.forEach((t) => {
    const row = document.createElement("div");
    row.className = "item";
    row.dataset.n = t.n;
    const options = aufgabe1.headlines
      .map((h) => `<option value="${h.id}"${saved[t.n] === h.id ? " selected" : ""}>${h.id}</option>`)
      .join("");
    row.innerHTML = `
      <div class="n mono">${t.n}</div>
      <div class="body">
        <div class="prompt">${t.body}</div>
        <div class="row2">
          <span style="color:var(--ink-soft);font-size:0.82rem;">${t.source}</span>
          <select id="a1-sel-${t.n}" style="margin-left:auto;padding:0.3rem 0.5rem;border-radius:4px;">
            <option value="">Überschrift…</option>
            ${options}
          </select>
          <span class="verdict" id="a1-v-${t.n}"></span>
        </div>
        <div class="answer-key">Lösung: <b>${t.answer}</b></div>
      </div>
    `;
    textsEl.appendChild(row);
    const sel = row.querySelector(`#a1-sel-${t.n}`);
    sel.addEventListener("change", () => {
      const all = load("aufgabe1", {});
      all[t.n] = sel.value;
      save("aufgabe1", all);
    });
  });

  container.querySelector("#a1-check").addEventListener("click", () => {
    let correct = 0;
    aufgabe1.texts.forEach((t) => {
      const sel = container.querySelector(`#a1-sel-${t.n}`);
      const row = container.querySelector(`.item[data-n="${t.n}"]`);
      row.dataset.checked = "true";
      const ok = sel.value === t.answer;
      if (ok) correct++;
      const v = container.querySelector(`#a1-v-${t.n}`);
      v.textContent = ok ? "✓" : "✗";
      v.className = "verdict " + (ok ? "ok" : "no");
    });
    const points = aufgabe1.scoreTable[correct] ?? 0;
    container.querySelector("#a1-score-n").textContent = points;
    container.querySelector("#a1-score").dataset.show = "true";
  });

  container.querySelector("#a1-reset").addEventListener("click", () => {
    save("aufgabe1", {});
    aufgabe1.texts.forEach((t) => {
      container.querySelector(`#a1-sel-${t.n}`).value = "";
      container.querySelector(`#a1-v-${t.n}`).textContent = "";
      container.querySelector(`.item[data-n="${t.n}"]`).dataset.checked = "false";
    });
    container.querySelector("#a1-score").dataset.show = "false";
  });
}

function buildAufgabe2(container) {
  const qEl = container.querySelector("#a2-questions");
  const saved = load("aufgabe2", {});
  aufgabe2.questions.forEach((q) => {
    const row = document.createElement("div");
    row.className = "item";
    row.dataset.n = q.n;
    const options = q.options
      .map(
        (opt, i) => `
      <label style="display:block;margin-bottom:0.3rem;cursor:pointer;">
        <input type="radio" name="a2-q${q.n}" value="${i}" ${saved[q.n] === i ? "checked" : ""}> ${opt}
      </label>`
      )
      .join("");
    row.innerHTML = `
      <div class="n mono">${q.n}</div>
      <div class="body">
        <div class="prompt">${q.prompt}</div>
        <div style="margin-top:0.5rem;">${options}</div>
        <span class="verdict" id="a2-v-${q.n}"></span>
        <div class="answer-key">Lösung: <b>${q.options[q.answer]}</b></div>
      </div>
    `;
    qEl.appendChild(row);
    row.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener("change", () => {
        const all = load("aufgabe2", {});
        all[q.n] = Number(input.value);
        save("aufgabe2", all);
      });
    });
  });

  container.querySelector("#a2-check").addEventListener("click", () => {
    let correct = 0;
    aufgabe2.questions.forEach((q) => {
      const picked = container.querySelector(`input[name="a2-q${q.n}"]:checked`);
      const row = container.querySelector(`#a2-questions .item[data-n="${q.n}"]`);
      row.dataset.checked = "true";
      const ok = picked && Number(picked.value) === q.answer;
      if (ok) correct++;
      const v = container.querySelector(`#a2-v-${q.n}`);
      v.textContent = ok ? "✓" : "✗";
      v.className = "verdict " + (ok ? "ok" : "no");
    });
    const points = aufgabe2.scoreTable[correct] ?? 0;
    container.querySelector("#a2-score-n").textContent = points;
    container.querySelector("#a2-score").dataset.show = "true";
  });

  container.querySelector("#a2-reset").addEventListener("click", () => {
    save("aufgabe2", {});
    aufgabe2.questions.forEach((q) => {
      container.querySelectorAll(`input[name="a2-q${q.n}"]`).forEach((i) => (i.checked = false));
      container.querySelector(`#a2-v-${q.n}`).textContent = "";
      container.querySelector(`#a2-questions .item[data-n="${q.n}"]`).dataset.checked = "false";
    });
    container.querySelector("#a2-score").dataset.show = "false";
  });
}
