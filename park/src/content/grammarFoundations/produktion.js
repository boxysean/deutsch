import { save, load } from "./storage.js";

const modalVerbs = ["kann","kannst","können","könnt","könnte","könntest","könnten","muss","musst","müssen","müsst","musste","musstest","mussten","will","willst","wollen","wollt","wollte","wollten","soll","sollst","sollen","sollt","sollte","sollten","darf","darfst","dürfen","dürft","durfte","durften","mag","magst","mögen","möchte","möchtest","möchten"];
const subjectStarters = ["ich","du","er","sie","es","wir","ihr","Sie"];
const separablePrefixes = ["an","auf","aus","ein","ab","mit","zu","fern","weg","her","hin","zurück","los","vor","nach","bei","um","zusammen"];
const sequenceWords = ["zuerst","dann","danach","schließlich"];

function analyzeProd(text) {
  const raw = text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const sentences = raw.length;
  let fronted = 0, separable = 0, modal = 0;
  raw.forEach((s) => {
    const clean = s.replace(/[.!?]+$/, "").trim();
    const words = clean.split(/\s+/);
    if (words.length === 0) return;
    const first = words[0].replace(/[,]/g, "");
    if (subjectStarters.indexOf(first) === -1 && subjectStarters.indexOf(first.toLowerCase()) === -1) {
      fronted++;
    }
    const last = words[words.length - 1].toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (separablePrefixes.indexOf(last) !== -1) separable++;
    const lower = clean.toLowerCase();
    if (modalVerbs.some((m) => new RegExp("\\b" + m + "\\b").test(lower))) modal++;
  });
  const seq = sequenceWords.some((w) => text.toLowerCase().indexOf(w) !== -1);
  return { sentences, fronted, separable, modal, seq };
}

export function mount(container) {
  container.innerHTML = `
    <p class="lede measure">Write 10 sentences describing a normal weekday, out loud as you write. Rough is fine — fluency now, accuracy later.</p>
    <div class="prod-grid">
      <textarea id="prod-text" placeholder="Um sieben Uhr wache ich auf. Danach…" spellcheck="true"></textarea>
      <div class="checklist" id="prod-checklist">
        <div class="check-row" data-key="sentences"><span class="dot"></span><span>Mindestens <b class="count">10</b> Sätze — aktuell <b class="count" id="cnt-sentences">0</b></span></div>
        <div class="check-row" data-key="fronted"><span class="dot"></span><span>≥4 beginnen <em>nicht</em> mit dem Subjekt — <b class="count" id="cnt-fronted">0</b></span></div>
        <div class="check-row" data-key="separable"><span class="dot"></span><span>≥4 mit trennbarem Verb (Präfix am Satzende) — <b class="count" id="cnt-separable">0</b></span></div>
        <div class="check-row" data-key="modal"><span class="dot"></span><span>≥2 mit Modalverb — <b class="count" id="cnt-modal">0</b></span></div>
        <div class="check-row" data-key="sequence"><span class="dot"></span><span>zuerst/dann/danach/schließlich verwendet</span></div>
      </div>
    </div>
    <p class="bonus"><strong style="color:var(--ink)">Bonus, falls Zeit bleibt:</strong> repeat the same 10 sentences about your wife's day (<em>sie</em> forms — forces the stem changes) or your kids' (<em>sie</em> plural).</p>
  `;

  const prodText = container.querySelector("#prod-text");
  prodText.value = load("produktion", "");

  function setMet(key, val) {
    container.querySelector(`.check-row[data-key="${key}"]`).dataset.met = val ? "true" : "false";
  }

  function updateProd() {
    const text = prodText.value;
    save("produktion", text);
    const r = analyzeProd(text);
    container.querySelector("#cnt-sentences").textContent = r.sentences;
    container.querySelector("#cnt-fronted").textContent = r.fronted;
    container.querySelector("#cnt-separable").textContent = r.separable;
    container.querySelector("#cnt-modal").textContent = r.modal;
    setMet("sentences", r.sentences >= 10);
    setMet("fronted", r.fronted >= 4);
    setMet("separable", r.separable >= 4);
    setMet("modal", r.modal >= 2);
    setMet("sequence", r.seq);
  }

  prodText.addEventListener("input", updateProd);
  updateProd();
}
