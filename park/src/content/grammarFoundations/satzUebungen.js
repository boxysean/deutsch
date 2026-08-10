import { satzstellungData, satzklammerData } from "./data.js";
import { save, load } from "./storage.js";

function buildRevealList(container, containerId, data, storeKey) {
  const listEl = container.querySelector(`#${containerId}`);
  data.forEach((item) => {
    const el = document.createElement("div");
    el.className = "reveal-item";
    el.dataset.n = item.n;
    el.innerHTML = `
      <div class="frag">${item.n}. ${item.frag}</div>
      <textarea id="${storeKey}-in-${item.n}" placeholder="Deine Lösung…" rows="1"></textarea>
      <div class="actions"><button class="ghost small reveal-btn">Antwort zeigen</button></div>
      <div class="reveal-panel">Lösung: <b>${item.answer}</b>${item.hint ? `<br><span style="color:var(--ink-soft);font-size:0.85rem">${item.hint}</span>` : ""}
        <div class="self-mark"><span class="tag">Selbsteinschätzung:</span><button class="small self-ok">richtig</button><button class="small self-no">falsch</button></div>
      </div>
    `;
    listEl.appendChild(el);

    const ta = el.querySelector("textarea");
    const saved = load(storeKey, {});
    if (saved[item.n]) ta.value = saved[item.n].v || "";
    if (saved[item.n] && saved[item.n].mark) {
      el.dataset.open = "true";
      const btn = saved[item.n].mark === "ok" ? el.querySelector(".self-ok") : el.querySelector(".self-no");
      btn.dataset.picked = "true";
    }
    ta.addEventListener("input", () => {
      const all = load(storeKey, {});
      all[item.n] = all[item.n] || {};
      all[item.n].v = ta.value;
      save(storeKey, all);
    });
    el.querySelector(".reveal-btn").addEventListener("click", () => {
      el.dataset.open = "true";
    });
    el.querySelector(".self-ok").addEventListener("click", () => {
      el.querySelector(".self-ok").dataset.picked = "true";
      el.querySelector(".self-no").dataset.picked = "false";
      const all = load(storeKey, {});
      all[item.n] = all[item.n] || {};
      all[item.n].mark = "ok";
      save(storeKey, all);
    });
    el.querySelector(".self-no").addEventListener("click", () => {
      el.querySelector(".self-no").dataset.picked = "true";
      el.querySelector(".self-ok").dataset.picked = "false";
      const all = load(storeKey, {});
      all[item.n] = all[item.n] || {};
      all[item.n].mark = "no";
      save(storeKey, all);
    });
  });
}

export function mount(container) {
  container.innerHTML = `
    <div class="subhead" style="margin-top:0">Übung C — Satzstellung</div>
    <p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">Rewrite each sentence starting with the <strong style="color:var(--ink)">bold</strong> element. Word order has one right shape here, so self-check against the key.</p>
    <div id="satzstellung-items" class="measure reveal-list"></div>

    <div class="subhead">Übung D — Satzklammer</div>
    <p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">Build sentences from the fragments. Watch where the second verb part lands.</p>
    <div id="satzklammer-items" class="measure reveal-list"></div>
  `;

  buildRevealList(container, "satzstellung-items", satzstellungData, "satzstellung");
  buildRevealList(container, "satzklammer-items", satzklammerData, "satzklammer");
}
