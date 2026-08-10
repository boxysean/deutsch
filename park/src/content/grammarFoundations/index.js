import { mount as mountDiagnose } from "./diagnose.js";
import { mount as mountKonjugation } from "./konjugation.js";
import { mount as mountSatzUebungen } from "./satzUebungen.js";
import { mount as mountVocab } from "./vocab.js";
import { mount as mountProduktion } from "./produktion.js";
import { mount as mountJournal } from "./journal.js";
import { mount as mountSelbstcheck } from "./selbstcheck.js";

const TABS = [
  { id: "diagnose", label: "Diagnose", parts: [{ mount: mountDiagnose }] },
  { id: "grammatik", label: "Grammatik", parts: [{ mount: mountKonjugation }, { mount: mountSatzUebungen }] },
  { id: "wortschatz", label: "Wortschatz", parts: [{ mount: mountVocab }] },
  { id: "produktion", label: "Produktion", parts: [{ mount: mountProduktion }] },
  { id: "abschluss", label: "Abschluss", parts: [{ mount: mountJournal }, { mount: mountSelbstcheck }] },
];

export function mount(container) {
  container.innerHTML = `
    <p class="lede measure">Tag 1 von 10 · Fortschritt wird lokal in diesem Browser gespeichert.</p>
    <div class="tabs" id="gf-tabs"></div>
    <div id="gf-panels"></div>
  `;

  const tabsEl = container.querySelector("#gf-tabs");
  const panelsEl = container.querySelector("#gf-panels");

  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "small";
    btn.textContent = tab.label;
    btn.dataset.active = "false";
    btn.addEventListener("click", () => activateTab(tab.id));
    tabsEl.appendChild(btn);
    tab.button = btn;

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.dataset.active = "false";
    panelsEl.appendChild(panel);
    tab.panel = panel;

    tab.parts.forEach((part) => {
      const sub = document.createElement("div");
      panel.appendChild(sub);
      part.mount(sub);
    });
  });

  function activateTab(id) {
    TABS.forEach((tab) => {
      const active = tab.id === id;
      tab.button.dataset.active = active ? "true" : "false";
      tab.panel.dataset.active = active ? "true" : "false";
    });
  }

  activateTab(TABS[0].id);
}
