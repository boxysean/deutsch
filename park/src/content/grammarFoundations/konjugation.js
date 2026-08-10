import { konjData } from "./data.js";
import { save, load, normalize } from "./storage.js";

export function mount(container) {
  container.innerHTML = `
    <div class="subhead" style="margin-top:0">Regel 1 — Verb an Position 2</div>
    <div class="measure rule-box">
      <p>The conjugated verb is the <strong>second element</strong>, always. Not the second word — the second <em>element</em>. Anything can occupy position 1, and the subject then slides behind the verb.</p>
    </div>
    <div class="tablewrap">
      <table>
        <thead><tr><th>Position 1</th><th>Verb</th><th>Rest</th></tr></thead>
        <tbody>
          <tr><td>Ich</td><td style="color:var(--accent);font-weight:700">fahre</td><td>morgen nach Wien.</td></tr>
          <tr><td>Morgen</td><td style="color:var(--accent);font-weight:700">fahre</td><td>ich nach Wien.</td></tr>
          <tr><td>Nach Wien</td><td style="color:var(--accent);font-weight:700">fahre</td><td>ich morgen.</td></tr>
          <tr><td>Mit meiner Frau</td><td style="color:var(--accent);font-weight:700">fahre</td><td>ich morgen nach Wien.</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note measure">Common Anglophone error: <em>Morgen ich fahre…</em> — English lets you front an adverb without inverting. German doesn't.</p>

    <div class="subhead">Regel 2 — Die Satzklammer</div>
    <p class="measure" style="margin-bottom:1rem;">The second verb part goes to the very end, bracketing the sentence. Everything else piles up inside the bracket.</p>
    <div class="klammer-ex">
      <div class="sent"><span>Ich</span><span class="v">rufe</span><span>dich morgen</span><span class="v">an</span><span class="bracket" style="--bl:1.6rem;--br:0"></span></div>
      <div class="cap">Trennbares Verb — <span class="mono">anrufen</span></div>
    </div>
    <div class="klammer-ex">
      <div class="sent"><span>Ich</span><span class="v">muss</span><span>morgen früh</span><span class="v">aufstehen</span><span class="bracket" style="--bl:1.6rem;--br:0"></span></div>
      <div class="cap">Modalverb — Infinitiv am Ende</div>
    </div>
    <div class="klammer-ex">
      <div class="sent"><span>Ich</span><span class="v">habe</span><span>dich gestern</span><span class="v">angerufen</span><span class="bracket" style="--bl:1.6rem;--br:0"></span></div>
      <div class="cap">Perfekt — Partizip am Ende</div>
    </div>

    <div class="subhead">Regel 3 — Stammveränderung (2./3. Person Singular)</div>
    <div class="tablewrap">
      <table>
        <thead><tr><th>Typ</th><th>Infinitiv</th><th>du</th><th>er/sie/es</th></tr></thead>
        <tbody>
          <tr><td>a → ä</td><td>fahren</td><td>fährst</td><td>fährt</td></tr>
          <tr><td>a → ä</td><td>schlafen</td><td>schläfst</td><td>schläft</td></tr>
          <tr><td>e → i</td><td>sprechen</td><td>sprichst</td><td>spricht</td></tr>
          <tr><td>e → i</td><td>essen</td><td>isst</td><td>isst</td></tr>
          <tr><td>e → i</td><td>geben</td><td>gibst</td><td>gibt</td></tr>
          <tr><td>e → ie</td><td>sehen</td><td>siehst</td><td>sieht</td></tr>
          <tr><td>e → ie</td><td>lesen</td><td>liest</td><td>liest</td></tr>
          <tr><td>irregulär</td><td>nehmen</td><td>nimmst</td><td>nimmt</td></tr>
          <tr><td>irregulär</td><td>wissen</td><td>weißt</td><td>weiß</td></tr>
        </tbody>
      </table>
    </div>
    <p class="measure" style="margin:0.9rem 0 0.5rem;font-size:0.86rem;color:var(--ink-soft)"><strong style="color:var(--ink)">sein / haben / werden</strong> — know these cold:</p>
    <div class="tablewrap">
      <table>
        <thead><tr><th></th><th>sein</th><th>haben</th><th>werden</th></tr></thead>
        <tbody>
          <tr><td>ich</td><td>bin</td><td>habe</td><td>werde</td></tr>
          <tr><td>du</td><td>bist</td><td>hast</td><td>wirst</td></tr>
          <tr><td>er/sie/es</td><td>ist</td><td>hat</td><td>wird</td></tr>
          <tr><td>wir</td><td>sind</td><td>haben</td><td>werden</td></tr>
          <tr><td>ihr</td><td>seid</td><td>habt</td><td>werdet</td></tr>
          <tr><td>sie/Sie</td><td>sind</td><td>haben</td><td>werden</td></tr>
        </tbody>
      </table>
    </div>

    <div class="subhead">Übung B — Konjugiere</div>
    <div id="konj-items" class="measure"></div>
    <div class="actions">
      <button class="primary" id="konj-check">Auswertung anzeigen</button>
      <button class="ghost" id="konj-reset">Zurücksetzen</button>
    </div>
    <div class="scorebox" id="konj-score">
      <div class="scoreline"><span class="big mono" id="konj-score-n">0</span><span class="of">/ 10</span></div>
    </div>
  `;

  const konjContainer = container.querySelector("#konj-items");
  konjData.forEach((item) => {
    const row = document.createElement("div");
    row.className = "item";
    row.dataset.n = item.n;
    row.innerHTML = `
      <div class="n mono">${item.n}</div>
      <div class="body">
        <div class="prompt">${item.prompt}</div>
        <div class="row2"><input type="text" id="konj-in-${item.n}" placeholder="Antwort" autocomplete="off"><span class="verdict" id="konj-v-${item.n}"></span></div>
        <div class="answer-key">Lösung: <b>${item.answer}</b></div>
      </div>
    `;
    konjContainer.appendChild(row);
  });

  const saved = load("konjugation", {});
  konjData.forEach((item) => {
    const inp = container.querySelector(`#konj-in-${item.n}`);
    if (saved[item.n]) inp.value = saved[item.n];
    inp.addEventListener("input", () => {
      const all = load("konjugation", {});
      all[item.n] = inp.value;
      save("konjugation", all);
    });
  });

  container.querySelector("#konj-check").addEventListener("click", () => {
    let correct = 0;
    konjData.forEach((item) => {
      const inp = container.querySelector(`#konj-in-${item.n}`);
      const v = container.querySelector(`#konj-v-${item.n}`);
      const row = container.querySelector(`#konj-items .item[data-n="${item.n}"]`);
      row.dataset.checked = "true";
      const ok = normalize(inp.value) === normalize(item.answer);
      if (ok) correct++;
      v.textContent = ok ? "✓" : "✗";
      v.className = "verdict " + (ok ? "ok" : "no");
    });
    container.querySelector("#konj-score-n").textContent = correct;
    container.querySelector("#konj-score").dataset.show = "true";
  });

  container.querySelector("#konj-reset").addEventListener("click", () => {
    save("konjugation", {});
    konjData.forEach((item) => {
      container.querySelector(`#konj-in-${item.n}`).value = "";
      container.querySelector(`#konj-v-${item.n}`).textContent = "";
      container.querySelector(`#konj-items .item[data-n="${item.n}"]`).dataset.checked = "false";
    });
    container.querySelector("#konj-score").dataset.show = "false";
  });
}
