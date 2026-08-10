import { THEMES } from "./data.js";

const LS_PREFIX = "deutsch-vokabel:";

function save(key, val) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
  } catch (e) {}
}
function load(key, fallback) {
  try {
    const v = localStorage.getItem(LS_PREFIX + key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}

export function mount(container, zone) {
  const theme = THEMES[zone.id];
  if (!theme) {
    container.innerHTML = `<p>Für dieses Thema gibt es noch keine Vokabelliste.</p>`;
    return;
  }

  const words = theme.words.map((w, i) => ({ id: i, de: w[0], en: w[1], note: w[2] || "" }));
  const total = words.length;

  container.innerHTML = `
    <p class="lede measure">${theme.intro}</p>

    <div class="vocab-toolbar">
      <div class="vocab-stats">Sicher: <b id="vt-mastered">0</b> / ${total} · Richtung:
        <button class="small ghost" id="vt-dir">DE → EN</button>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button class="small ghost" id="vt-shuffle">Mischen</button>
        <button class="small ghost" id="vt-reset">Zurücksetzen</button>
      </div>
    </div>
    <div class="vocab-grid" id="vt-grid"></div>

    <div class="subhead">${theme.phrasesTitle || "Redemittel"}</div>
    <div class="rule-box measure" id="vt-phrases"></div>
  `;

  let state = load(`${zone.id}:state`, {});
  let dir = load(`${zone.id}:dir`, "de-en");
  let order = load(`${zone.id}:order`, words.map((w) => w.id));

  // Guard against a stale saved order if the word list ever changes length.
  if (!Array.isArray(order) || order.length !== total) order = words.map((w) => w.id);

  const grid = container.querySelector("#vt-grid");

  function render() {
    grid.innerHTML = "";
    order.forEach((id) => {
      const w = words[id];
      if (!w) return;
      const st = state[id] || {};
      const card = document.createElement("div");
      card.className = "flash";
      card.dataset.flipped = st.flipped ? "true" : "false";
      card.dataset.mastered = st.mastered ? "true" : "false";
      const front = dir === "de-en" ? w.de : w.en;
      const back = dir === "de-en" ? w.en : w.de;
      card.innerHTML =
        (w.note ? '<span class="badge">AT</span>' : "") +
        `<div class="face">${st.flipped ? back : front}</div>` +
        (st.flipped && w.note ? `<div class="hint" style="color:var(--accent)">${w.note}</div>` : "") +
        `<div class="hint">${st.flipped ? "Klicken zum Umdrehen" : "Klicken zum Aufdecken"}</div>` +
        `<div class="rate"><button class="mastered-btn">Ich kann's</button><button class="missed-btn">Nochmal</button></div>`;

      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("mastered-btn") || e.target.classList.contains("missed-btn")) return;
        st.flipped = !st.flipped;
        state[id] = st;
        save(`${zone.id}:state`, state);
        render();
      });
      card.querySelector(".mastered-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        st.mastered = true;
        state[id] = st;
        save(`${zone.id}:state`, state);
        render();
        updateStats();
      });
      card.querySelector(".missed-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        st.mastered = false;
        state[id] = st;
        save(`${zone.id}:state`, state);
        render();
        updateStats();
      });
      grid.appendChild(card);
    });
  }

  function updateStats() {
    const n = Object.keys(state).filter((k) => state[k].mastered).length;
    container.querySelector("#vt-mastered").textContent = n;
  }

  const dirBtn = container.querySelector("#vt-dir");
  dirBtn.textContent = dir === "de-en" ? "DE → EN" : "EN → DE";
  dirBtn.addEventListener("click", () => {
    dir = dir === "de-en" ? "en-de" : "de-en";
    save(`${zone.id}:dir`, dir);
    dirBtn.textContent = dir === "de-en" ? "DE → EN" : "EN → DE";
    render();
  });

  container.querySelector("#vt-shuffle").addEventListener("click", () => {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    save(`${zone.id}:order`, order);
    render();
  });

  container.querySelector("#vt-reset").addEventListener("click", () => {
    state = {};
    save(`${zone.id}:state`, state);
    render();
    updateStats();
  });

  container.querySelector("#vt-phrases").innerHTML = theme.phrases
    .map((p) => `<p style="margin-bottom:0.55rem;"><b>${p[0]}</b><br><span style="color:var(--ink-soft);font-size:0.88rem;">${p[1]}</span></p>`)
    .join("");

  render();
  updateStats();
}
