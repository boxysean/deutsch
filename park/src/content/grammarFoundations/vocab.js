import { vocab } from "./data.js";
import { save, load } from "./storage.js";

export function mount(container) {
  container.innerHTML = `
    <p class="lede measure">Read the German, say the English aloud before flipping. Then reverse the direction. Anything you flip <em>Nochmal</em> on twice belongs in the Fehlerjournal. Cards marked <span class="mono" style="color:var(--accent)">trennbar</span> are separable verbs — eleven built-in Satzklammer drills.</p>
    <div class="vocab-toolbar">
      <div class="vocab-stats">Sicher: <b id="vocab-mastered">0</b> / 28 · Richtung:
        <button class="small ghost" id="vocab-dir">DE → EN</button>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button class="small ghost" id="vocab-shuffle">Mischen</button>
        <button class="small ghost" id="vocab-reset">Zurücksetzen</button>
      </div>
    </div>
    <div class="vocab-grid" id="vocab-grid"></div>
  `;

  let vocabState = load("vocab", {});
  let vocabDir = load("vocabDir", "de-en");
  let vocabOrder = load("vocabOrder", vocab.map((v) => v.id));

  const grid = container.querySelector("#vocab-grid");

  function renderVocab() {
    grid.innerHTML = "";
    vocabOrder.forEach((id) => {
      const v = vocab[id];
      const st = vocabState[id] || {};
      const card = document.createElement("div");
      card.className = "flash";
      card.dataset.flipped = st.flipped ? "true" : "false";
      card.dataset.mastered = st.mastered ? "true" : "false";
      const front = vocabDir === "de-en" ? v.de : v.en;
      const back = vocabDir === "de-en" ? v.en : v.de;
      card.innerHTML =
        (v.sep ? '<span class="badge">trennbar</span>' : "") +
        `<div class="face">${st.flipped ? back : front}</div>` +
        `<div class="hint">${st.flipped ? "Klicken zum Umdrehen" : "Klicken zum Aufdecken"}</div>` +
        '<div class="rate"><button class="mastered-btn">Ich kann\'s</button><button class="missed-btn">Nochmal</button></div>';
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("mastered-btn") || e.target.classList.contains("missed-btn")) return;
        st.flipped = !st.flipped;
        vocabState[id] = st;
        save("vocab", vocabState);
        renderVocab();
      });
      card.querySelector(".mastered-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        st.mastered = true;
        vocabState[id] = st;
        save("vocab", vocabState);
        renderVocab();
        updateVocabStats();
      });
      card.querySelector(".missed-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        st.mastered = false;
        vocabState[id] = st;
        save("vocab", vocabState);
        renderVocab();
        updateVocabStats();
      });
      grid.appendChild(card);
    });
  }

  function updateVocabStats() {
    const mastered = Object.keys(vocabState).filter((k) => vocabState[k].mastered).length;
    container.querySelector("#vocab-mastered").textContent = mastered;
  }

  container.querySelector("#vocab-dir").addEventListener("click", function () {
    vocabDir = vocabDir === "de-en" ? "en-de" : "de-en";
    save("vocabDir", vocabDir);
    this.textContent = vocabDir === "de-en" ? "DE → EN" : "EN → DE";
    renderVocab();
  });
  container.querySelector("#vocab-dir").textContent = vocabDir === "de-en" ? "DE → EN" : "EN → DE";

  container.querySelector("#vocab-shuffle").addEventListener("click", () => {
    for (let i = vocabOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vocabOrder[i], vocabOrder[j]] = [vocabOrder[j], vocabOrder[i]];
    }
    save("vocabOrder", vocabOrder);
    renderVocab();
  });

  container.querySelector("#vocab-reset").addEventListener("click", () => {
    vocabState = {};
    save("vocab", vocabState);
    renderVocab();
    updateVocabStats();
  });

  renderVocab();
  updateVocabStats();
}
