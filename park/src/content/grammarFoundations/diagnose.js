import { diagnoseData } from "./data.js";
import { save, load, wordsPresent } from "./storage.js";

function scoreAdvice(n) {
  if (n >= 18) return "Your A1/A2 base is solid. Compress days 2–4, and reallocate that time to days 8 and 9 — adjective endings and subordinate clauses are where B1 actually lives.";
  if (n >= 13) return "The plan is correctly calibrated. Run it as written.";
  if (n >= 8) return "Give days 2–5 the full hour and don't rush them. Consider stretching to 12 days by splitting Day 8 across two sessions.";
  return "You're at a genuine A1 review rather than A2. Slow down; the case system needs to be automatic before adjective endings will stick.";
}

export function mount(container) {
  container.innerHTML = `
    <p class="lede measure">Twenty gaps, each mapped to a later day. Write your answers down before checking. <strong>Don't guess silently</strong> — if you're unsure, tick <em>unsicher</em> even if you get it right. A lucky guess is still a gap.</p>
    <div id="diagnose-items"></div>
    <div class="actions">
      <button class="primary" id="diag-check">Auswertung anzeigen</button>
      <button class="ghost" id="diag-reset">Zurücksetzen</button>
    </div>
    <div class="scorebox" id="diag-score">
      <div class="scoreline"><span class="big mono" id="diag-score-n">0</span><span class="of">/ 20</span></div>
      <p class="advice" id="diag-advice"></p>
      <div class="stardays" id="diag-stars"></div>
    </div>
  `;

  const diagContainer = container.querySelector("#diagnose-items");
  diagnoseData.forEach((block) => {
    const wrap = document.createElement("div");
    wrap.className = "cat-block";
    wrap.dataset.cat = block.cat;
    const title = document.createElement("div");
    title.className = "cat-title";
    title.innerHTML = `<h3>${block.cat}</h3><span class="tagref mono">→ Tag ${block.tag}</span><span class="star">★ diesen Tag vertiefen</span>`;
    wrap.appendChild(title);
    block.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "item";
      row.dataset.n = item.n;
      row.innerHTML = `
        <div class="n mono">${item.n}</div>
        <div class="body">
          <div class="prompt">${item.prompt}</div>
          <div class="row2">
            <input type="text" id="diag-in-${item.n}" placeholder="Antwort" autocomplete="off">
            <span class="verdict" id="diag-v-${item.n}"></span>
            <label class="unsure"><input type="checkbox" id="diag-u-${item.n}"> unsicher</label>
          </div>
          <div class="answer-key">Lösung: <b>${item.display || item.answers.join(" ")}</b></div>
        </div>
      `;
      wrap.appendChild(row);
    });
    diagContainer.appendChild(wrap);
  });

  const saved = load("diagnose", {});
  diagnoseData.forEach((block) => {
    block.items.forEach((item) => {
      const inp = container.querySelector(`#diag-in-${item.n}`);
      const un = container.querySelector(`#diag-u-${item.n}`);
      if (saved[item.n]) {
        inp.value = saved[item.n].v || "";
        un.checked = !!saved[item.n].u;
      }
      function persist() {
        const all = load("diagnose", {});
        all[item.n] = { v: inp.value, u: un.checked };
        save("diagnose", all);
      }
      inp.addEventListener("input", persist);
      un.addEventListener("change", persist);
    });
  });

  container.querySelector("#diag-check").addEventListener("click", () => {
    let total = 0, correct = 0;
    const starDays = {};
    diagnoseData.forEach((block) => {
      const wrap = container.querySelector(`.cat-block[data-cat="${CSS.escape(block.cat)}"]`);
      let blockCorrect = 0, blockUnsure = false;
      block.items.forEach((item) => {
        const inp = container.querySelector(`#diag-in-${item.n}`);
        const un = container.querySelector(`#diag-u-${item.n}`);
        const row = container.querySelector(`.item[data-n="${item.n}"]`);
        row.dataset.checked = "true";
        const ok = wordsPresent(inp.value, item.answers);
        total++;
        if (ok) { correct++; blockCorrect++; }
        if (un.checked) blockUnsure = true;
        const v = container.querySelector(`#diag-v-${item.n}`);
        v.textContent = ok ? "✓" : "✗";
        v.className = "verdict " + (ok ? "ok" : "no");
      });
      const needsStar = blockCorrect < block.items.length || blockUnsure;
      wrap.dataset.star = needsStar ? "true" : "false";
      if (needsStar) block.tag.split("/").forEach((t) => { starDays[t.trim()] = true; });
    });
    container.querySelector("#diag-score-n").textContent = correct;
    container.querySelector("#diag-advice").textContent = scoreAdvice(correct);
    container.querySelector("#diag-stars").innerHTML = Object.keys(starDays)
      .sort((a, b) => a - b)
      .map((d) => `<span>Tag ${d}</span>`)
      .join("");
    container.querySelector("#diag-score").dataset.show = "true";
  });

  container.querySelector("#diag-reset").addEventListener("click", () => {
    save("diagnose", {});
    diagnoseData.forEach((block) => {
      block.items.forEach((item) => {
        container.querySelector(`#diag-in-${item.n}`).value = "";
        container.querySelector(`#diag-u-${item.n}`).checked = false;
        container.querySelector(`#diag-v-${item.n}`).textContent = "";
        container.querySelector(`.item[data-n="${item.n}"]`).dataset.checked = "false";
      });
    });
    container.querySelector("#diag-score").dataset.show = "false";
  });
}
