import { TOPICS } from "./data.js";
import { noteReviewed } from "../lib/practice.js";
import { makeLevelStore, normalize, wordsPresent } from "../lib/storage.js";

// Generic renderer for a single grammar zone. Everything comes from data, so a
// new grammar topic is a data entry plus flipping that zone to status "built".
const store = makeLevelStore("grammatik:");

export function mount(container, zone) {
  const topic = TOPICS[zone.id];
  if (!topic) {
    container.innerHTML = `<p>Für dieses Thema gibt es noch keinen Inhalt.</p>`;
    return;
  }

  container.innerHTML = `
    <p class="lede measure">${topic.intro}</p>
    <div class="tabs" id="gt-tabs"></div>
    <div id="gt-panels"></div>
  `;

  const tabs = [
    { id: "regeln", label: "Regeln", render: () => renderRules(topic) },
    { id: "uebungen", label: "Übungen", render: (el) => renderExercises(el, zone, topic) },
    { id: "selbstcheck", label: "Selbstcheck", render: (el) => renderSelfcheck(el, zone, topic) },
  ];

  const tabsEl = container.querySelector("#gt-tabs");
  const panelsEl = container.querySelector("#gt-panels");

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

// ---------------------------------------------------------------- Regeln

function renderRules(topic) {
  const rules = topic.rules
    .map(
      (r) => `
      <div class="subhead">${r.title}</div>
      <div class="measure rule-box">${r.body}</div>
      ${r.note ? `<p class="note measure">${r.note}</p>` : ""}
    `
    )
    .join("");

  const tables = (topic.tables || [])
    .map(
      (t) => `
      <div class="subhead">${t.caption}</div>
      ${t.lede ? `<p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">${t.lede}</p>` : ""}
      <div class="tablewrap">
        <table>
          <thead><tr>${t.head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>
            ${t.rows
              .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
              .join("")}
          </tbody>
        </table>
      </div>
    `
    )
    .join("");

  return rules + tables;
}

// ---------------------------------------------------------------- Übungen

function renderExercises(panel, zone, topic) {
  topic.exercises.forEach((ex) => {
    const section = document.createElement("div");
    section.innerHTML = `
      <div class="subhead">${ex.title}</div>
      ${ex.lede ? `<p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">${ex.lede}</p>` : ""}
      <div class="measure" id="ex-${ex.id}"></div>
    `;
    panel.appendChild(section);
    const host = section.querySelector(`#ex-${ex.id}`);
    if (ex.kind === "reveal") buildReveal(host, zone, ex);
    else buildGaps(host, section, zone, ex);
  });
}

// Auto-checked gap fills, same shape as the Day 1 diagnostic.
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
      const row = section.querySelector(`#ex-${ex.id} .item[data-n="${item.n}"]`);
      row.dataset.checked = "true";
      // A single-token answer must match exactly; multi-token answers only need
      // their parts present, so a fuller sentence still counts.
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
    // Checked answers count as reviewed items, the same as a graded card.
    noteReviewed(ex.items.length);
  });

  section.querySelector(`#${ex.id}-reset`).addEventListener("click", () => {
    store.save(key, {});
    ex.items.forEach((item) => {
      section.querySelector(`#${ex.id}-in-${item.n}`).value = "";
      section.querySelector(`#${ex.id}-v-${item.n}`).textContent = "";
      section.querySelector(`#ex-${ex.id} .item[data-n="${item.n}"]`).dataset.checked = "false";
    });
    section.querySelector(`#${ex.id}-score`).dataset.show = "false";
  });
}

// Free-form answers the learner marks themselves — used where word order
// matters and several phrasings are right.
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
      <div class="reveal-panel">Lösung: <b>${item.answer}</b>${
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

// ---------------------------------------------------------------- Selbstcheck

function renderSelfcheck(panel, zone, topic) {
  panel.innerHTML =
    `<p class="measure" style="color:var(--ink-soft);margin-bottom:1rem;">Antworte ohne nachzuschauen, dann aufdecken.</p>` +
    topic.selfcheck
      .map(
        (item, i) => `
      <div class="sc-item" data-q="${i + 1}">
        <p class="q">${item.q}</p>
        <textarea placeholder="Deine Antwort…"></textarea>
        <div class="actions"><button class="ghost small sc-reveal">Antwort zeigen</button></div>
        <div class="reveal-panel">${item.reveal}</div>
      </div>
    `
      )
      .join("");

  panel.querySelectorAll(".sc-item").forEach((el) => {
    const key = `${zone.id}:sc-${el.dataset.q}`;
    const ta = el.querySelector("textarea");
    ta.value = store.load(key, "");
    ta.addEventListener("input", () => store.save(key, ta.value));
    el.querySelector(".sc-reveal").addEventListener("click", () => {
      el.querySelector(".reveal-panel").style.display = "block";
    });
  });
}
