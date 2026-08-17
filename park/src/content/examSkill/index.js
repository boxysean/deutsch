import { SKILLS } from "./data.js";
import { makeLevelStore, normalize, wordsPresent } from "../lib/storage.js";

// Generic renderer for the three remaining Prüfungsteile (Hören, Schreiben,
// Sprechen). Everything comes from data: Format, Strategie, Training.
const store = makeLevelStore("pruefung:");

export function mount(container, zone) {
  const skill = SKILLS[zone.id];
  if (!skill) {
    container.innerHTML = `<p>Für diesen Prüfungsteil gibt es noch keinen Inhalt.</p>`;
    return;
  }

  container.innerHTML = `
    <p class="lede measure">${skill.intro}</p>
    <div class="tabs" id="es-tabs"></div>
    <div id="es-panels"></div>
  `;

  const tabs = [
    { id: "format", label: "Format", render: () => sectionHtml(skill.format) },
    { id: "strategie", label: "Strategie", render: () => sectionHtml(skill.strategy) },
    { id: "training", label: "Training", render: (el) => renderTraining(el, zone, skill) },
  ];

  const tabsEl = container.querySelector("#es-tabs");
  const panelsEl = container.querySelector("#es-panels");

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

    const html = tab.render(panel);
    if (typeof html === "string") panel.innerHTML = html;
  });

  function activate(id) {
    tabs.forEach((t) => {
      const on = t.id === id;
      t.button.dataset.active = on ? "true" : "false";
      t.panel.dataset.active = on ? "true" : "false";
    });
  }
  activate(tabs[0].id);
}

// ------------------------------------------------ Format / Strategie (static)

function sectionHtml(section) {
  const rules = (section.rules || [])
    .map(
      (r) => `
      <div class="subhead">${r.title}</div>
      <div class="measure rule-box">${r.body}</div>
      ${r.note ? `<p class="note measure">${r.note}</p>` : ""}
    `
    )
    .join("");

  const tables = (section.tables || [])
    .map(
      (t) => `
      <div class="subhead">${t.caption}</div>
      ${t.lede ? `<p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">${t.lede}</p>` : ""}
      <div class="tablewrap">
        <table>
          <thead><tr>${t.head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${t.rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    `
    )
    .join("");

  return rules + tables;
}

// ---------------------------------------------------------------- Training

function renderTraining(panel, zone, skill) {
  skill.training.forEach((block) => {
    const section = document.createElement("div");
    section.innerHTML = `
      <div class="subhead">${block.title}</div>
      ${block.lede ? `<p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">${block.lede}</p>` : ""}
      ${block.source ? `<div class="rule-box measure" style="margin-bottom:1rem;">${block.source}</div>` : ""}
      <div class="measure" id="tr-${block.id}"></div>
    `;
    panel.appendChild(section);
    const host = section.querySelector(`#tr-${block.id}`);
    if (block.kind === "gap") buildGaps(host, section, zone, block);
    else if (block.kind === "reveal") buildReveal(host, zone, block);
    else if (block.kind === "writing") buildWriting(host, zone, block);
  });
}

function buildGaps(host, section, zone, ex) {
  const key = `${zone.id}:${ex.id}`;

  ex.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "item";
    row.dataset.n = item.n;
    row.innerHTML = `
      <div class="n mono">${item.n}</div>
      <div class="body">
        <div class="prompt">${item.prompt}</div>
        <div class="row2">
          <input type="text" id="${ex.id}-in-${item.n}" placeholder="Antwort" autocomplete="off">
          <span class="verdict" id="${ex.id}-v-${item.n}"></span>
        </div>
        <div class="answer-key">Lösung: <b>${item.display || item.answers.join(" ")}</b>${
          item.why ? `<br><span style="font-size:0.85rem">${item.why}</span>` : ""
        }</div>
      </div>
    `;
    host.appendChild(row);
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.innerHTML = `
    <button class="primary" id="${ex.id}-check">Auswertung anzeigen</button>
    <button class="ghost" id="${ex.id}-reset">Zurücksetzen</button>
  `;
  section.appendChild(actions);

  const score = document.createElement("div");
  score.className = "scorebox";
  score.id = `${ex.id}-score`;
  score.innerHTML = `<div class="scoreline"><span class="big mono" id="${ex.id}-score-n">0</span><span class="of">/ ${ex.items.length}</span></div>`;
  section.appendChild(score);

  const saved = store.load(key, {});
  ex.items.forEach((item) => {
    const inp = section.querySelector(`#${ex.id}-in-${item.n}`);
    if (saved[item.n]) inp.value = saved[item.n];
    inp.addEventListener("input", () => {
      const all = store.load(key, {});
      all[item.n] = inp.value;
      store.save(key, all);
    });
  });

  section.querySelector(`#${ex.id}-check`).addEventListener("click", () => {
    let correct = 0;
    ex.items.forEach((item) => {
      const inp = section.querySelector(`#${ex.id}-in-${item.n}`);
      const v = section.querySelector(`#${ex.id}-v-${item.n}`);
      const row = section.querySelector(`#tr-${ex.id} .item[data-n="${item.n}"]`);
      row.dataset.checked = "true";
      const ok =
        item.answers.length === 1
          ? normalize(inp.value) === normalize(item.answers[0])
          : wordsPresent(inp.value, item.answers);
      if (ok) correct++;
      v.textContent = ok ? "✓" : "✗";
      v.className = "verdict " + (ok ? "ok" : "no");
    });
    section.querySelector(`#${ex.id}-score-n`).textContent = correct;
    section.querySelector(`#${ex.id}-score`).dataset.show = "true";
  });

  section.querySelector(`#${ex.id}-reset`).addEventListener("click", () => {
    store.save(key, {});
    ex.items.forEach((item) => {
      section.querySelector(`#${ex.id}-in-${item.n}`).value = "";
      section.querySelector(`#${ex.id}-v-${item.n}`).textContent = "";
      section.querySelector(`#tr-${ex.id} .item[data-n="${item.n}"]`).dataset.checked = "false";
    });
    section.querySelector(`#${ex.id}-score`).dataset.show = "false";
  });
}

function buildReveal(host, zone, ex) {
  const key = `${zone.id}:${ex.id}`;
  host.classList.add("reveal-list");

  ex.items.forEach((item) => {
    const el = document.createElement("div");
    el.className = "reveal-item";
    el.dataset.n = item.n;
    el.innerHTML = `
      <div class="frag">${item.n}. ${item.frag}</div>
      <textarea placeholder="Deine Lösung…" rows="1"></textarea>
      <div class="actions"><button class="ghost small reveal-btn">Antwort zeigen</button></div>
      <div class="reveal-panel">${item.label || "Lösung"}: <b>${item.answer}</b>${
        item.hint ? `<br><span style="color:var(--ink-soft);font-size:0.85rem">${item.hint}</span>` : ""
      }
        <div class="self-mark"><span class="tag">Selbsteinschätzung:</span><button class="small self-ok">richtig</button><button class="small self-no">falsch</button></div>
      </div>
    `;
    host.appendChild(el);

    const ta = el.querySelector("textarea");
    const saved = store.load(key, {});
    if (saved[item.n]) ta.value = saved[item.n].v || "";
    if (saved[item.n] && saved[item.n].mark) {
      el.dataset.open = "true";
      const btn = saved[item.n].mark === "ok" ? el.querySelector(".self-ok") : el.querySelector(".self-no");
      btn.dataset.picked = "true";
    }

    const put = (patch) => {
      const all = store.load(key, {});
      all[item.n] = Object.assign({}, all[item.n], patch);
      store.save(key, all);
    };

    ta.addEventListener("input", () => put({ v: ta.value }));
    el.querySelector(".reveal-btn").addEventListener("click", () => {
      el.dataset.open = "true";
    });
    el.querySelector(".self-ok").addEventListener("click", () => {
      el.querySelector(".self-ok").dataset.picked = "true";
      el.querySelector(".self-no").dataset.picked = "false";
      put({ mark: "ok" });
    });
    el.querySelector(".self-no").addEventListener("click", () => {
      el.querySelector(".self-no").dataset.picked = "true";
      el.querySelector(".self-ok").dataset.picked = "false";
      put({ mark: "no" });
    });
  });
}

// A real writing pad: word counter plus a live checklist of the four Leitpunkte,
// each ticked as soon as one of its trigger words shows up in the text.
function buildWriting(host, zone, block) {
  const key = `${zone.id}:${block.id}`;

  host.innerHTML = `
    <div class="rule-box measure" style="margin-bottom:1rem;">${block.task}</div>
    <div class="prod-grid">
      <div>
        <textarea id="${block.id}-text" placeholder="Schreib deine Antwort hier…"></textarea>
        <div class="actions" style="margin-top:0.7rem">
          <button class="ghost small" id="${block.id}-model">Musterlösung zeigen</button>
          <button class="ghost small" id="${block.id}-clear">Löschen</button>
        </div>
        <div class="reveal-panel" id="${block.id}-modelbox">${block.model}</div>
      </div>
      <div>
        <div class="check-row" data-met="false" id="${block.id}-wc-row">
          <span class="dot"></span>
          <span>Mindestens ${block.minWords} Wörter — aktuell <b class="count" id="${block.id}-wc">0</b></span>
        </div>
        <div class="checklist" style="margin-top:0.8rem" id="${block.id}-checks"></div>
        ${block.tips ? `<p class="bonus">${block.tips}</p>` : ""}
      </div>
    </div>
  `;

  const ta = host.querySelector(`#${block.id}-text`);
  const checksEl = host.querySelector(`#${block.id}-checks`);
  block.points.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "check-row";
    row.dataset.met = "false";
    row.dataset.i = i;
    row.innerHTML = `<span class="dot"></span><span>${p.label}</span>`;
    checksEl.appendChild(row);
  });

  const modelBox = host.querySelector(`#${block.id}-modelbox`);
  host.querySelector(`#${block.id}-model`).addEventListener("click", () => {
    modelBox.style.display = "block";
  });

  function refresh() {
    const text = ta.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    host.querySelector(`#${block.id}-wc`).textContent = words;
    host.querySelector(`#${block.id}-wc-row`).dataset.met = words >= block.minWords ? "true" : "false";
    const norm = normalize(text);
    block.points.forEach((p, i) => {
      const met = p.triggers.some((t) => norm.indexOf(normalize(t)) !== -1);
      checksEl.querySelector(`.check-row[data-i="${i}"]`).dataset.met = met ? "true" : "false";
    });
  }

  ta.value = store.load(key, "");
  ta.addEventListener("input", () => {
    store.save(key, ta.value);
    refresh();
  });
  host.querySelector(`#${block.id}-clear`).addEventListener("click", () => {
    ta.value = "";
    store.save(key, "");
    refresh();
  });
  refresh();
}
