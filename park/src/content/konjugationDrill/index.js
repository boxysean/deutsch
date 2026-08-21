import { setsFor } from "./data.js";
import { makeLevelStore } from "../lib/storage.js";
import { getLevel } from "../../data/levels.js";
import { createDeck, boxOf, withBox, BOXES, SICHER_AT } from "../vocabTheme/deck.js";

// Schloss Neuschwanstein: the verb drill.
//
// The grammar houses explain WHY a form is what it is, which is what you need
// the first time. This is the other half, and no amount of explanation
// substitutes for it: German verb forms have to be simply known, fast, without
// deriving them mid-sentence. So they go on the same Leitner ladder as the
// vocabulary, in the same focus mode.
//
// What it asks is curated rather than exhaustive. "wir fahren" is the
// infinitive; a stack padded with cards nobody can get wrong buries the ones
// they can. Only forms a rule would not give you are in here.
const store = makeLevelStore("konjugation:");

// Producing a form is the skill; recognising one is the reading half of it, and
// much the easier of the two — which is why they are laddered separately.
const DIRECTIONS = [
  { id: "produce", label: "Form bilden", title: "Verb und Person → die Form" },
  { id: "recognise", label: "Form erkennen", title: "Die Form → Verb und Person" },
  { id: "mixed", label: "Beide" },
];

export function mount(container) {
  const sets = setsFor(getLevel());
  const byId = new Map(sets.map((s) => [s.id, s]));

  // Boxes are keyed by the card's own key, so adding a verb to a stack never
  // shifts anybody else's progress.
  const state = store.load("state", {}) || {};

  let setId = store.load("set", sets[0].id);
  if (!byId.has(setId)) setId = sets[0].id;
  let dir = store.load("dir", "produce");
  if (!DIRECTIONS.some((d) => d.id === dir)) dir = "produce";

  const cardsOf = (set, facing) =>
    set.cards.map((c) => ({
      key: `${c.key}:${facing}`,
      cardKey: c.key,
      facing,
      front: facing === "produce" ? c.q : c.a,
      back: facing === "produce" ? c.a : `${c.q} — ${c.cue}`,
      side: facing === "produce" ? c.cue : "Welches Verb? Welche Form?",
      hint: c.note,
    }));

  const getBox = (c) => boxOf(state[c.cardKey], c.facing === "produce" ? "de-en" : "en-de");

  container.innerHTML = `
    <p class="lede measure">Auf dem Felsen über der Stadt: die Verbformen, die man nicht herleitet, sondern kann. Dieselben Boxen wie beim Wortschatz — nur stehen hier Konjugationen drin, und zwar nur die Formen, die eine Regel <em>nicht</em> hergibt.</p>
    <div class="kd-sets" id="kd-sets" role="radiogroup" aria-label="Stapel"></div>
    <div class="kd-lede" id="kd-lede"></div>
    <div id="kd-deck" data-active="true"></div>
  `;

  const setsEl = container.querySelector("#kd-sets");
  const ledeEl = container.querySelector("#kd-lede");
  const deckHost = container.querySelector("#kd-deck");
  let deck = null;

  // One point per card whose PRODUCE direction is secure. Recognising "fuhr" as
  // a past tense is worth having and much easier; counting it too would inflate
  // the number by rewarding the easy half twice.
  function setProgress(set) {
    const done = set.cards.filter((c) => boxOf(state[c.key], "de-en") >= SICHER_AT).length;
    return { done, total: set.cards.length };
  }

  function renderSets() {
    setsEl.innerHTML = sets
      .map((s) => {
        const p = setProgress(s);
        return `<button type="button" class="kd-set" role="radio" data-set="${s.id}"
          aria-checked="${s.id === setId}" data-picked="${s.id === setId}">
          <b>${s.name}</b>
          <span class="kd-count mono">${p.done} / ${p.total}</span>
        </button>`;
      })
      .join("");
    setsEl.querySelectorAll(".kd-set").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.set === setId) return;
        setId = btn.dataset.set;
        store.save("set", setId);
        start();
      });
    });
  }

  function start() {
    if (deck) deck.destroy();
    const set = byId.get(setId);
    ledeEl.textContent = set.lede;
    deck = createDeck(deckHost, {
      cardsFor(which) {
        dir = which;
        const facings = which === "mixed" ? ["produce", "recognise"] : [which];
        const pool = [];
        facings.forEach((f) => pool.push(...cardsOf(set, f)));
        return pool;
      },
      dir,
      directions: DIRECTIONS,
      setDir(next) {
        dir = next;
        store.save("dir", next);
      },
      getBox,
      setBox(c, box) {
        state[c.cardKey] = withBox(state[c.cardKey], c.facing === "produce" ? "de-en" : "en-de", box);
        store.save("state", state);
      },
      countLabel: "Formen sicher",
      countTitle: "Über alle Stapel hinweg, in der Richtung „Form bilden“",
      wordCount() {
        const all = sets.reduce(
          (acc, s) => {
            const p = setProgress(s);
            return { done: acc.done + p.done, total: acc.total + p.total };
          },
          { done: 0, total: 0 }
        );
        return all;
      },
      onChange: renderSets,
    });
    renderSets();
    deck.render();
  }

  start();

  return { destroy: () => deck && deck.destroy() };
}

// Read by the progress accounting, which must not import the whole module just
// to count cards.
export function conjugationCounts(read) {
  const state = read("konjugation:state", {}) || {};
  let done = 0;
  let total = 0;
  setsFor(getLevel()).forEach((s) => {
    total += s.cards.length;
    done += s.cards.filter((c) => boxOf(state[c.key], "de-en") >= SICHER_AT).length;
  });
  return { done: Math.min(done, total), total };
}

export { BOXES };
