import { conjugate } from "./forms.js";
import {
  STEM_CHANGE, AUXILIARIES, MODALS, SEPARABLE,
  PERFEKT, PRAETERITUM, IMPERATIV, KONJUNKTIV,
} from "./verbs.js";

// Cards, built from the paradigms.
//
// A card's key is derived from what it ASKS — "praes:fahren:du" — never from
// its position in an array. The vocabulary decks key their boxes by array
// index, which means inserting a word silently hands every later word somebody
// else's progress. Adding a verb here can't do that.
//
// The drill asks only forms that are not predictable. "wir fahren" is the
// infinitive; drilling it would pad the deck with cards nobody can get wrong
// and bury the ones they can.

const card = (key, q, cue, a, note) => ({ key, q, cue, a, note: note || "" });

// --- Präsens ---------------------------------------------------------------

// Only du and er/sie/es: those are the two persons a stem change touches.
const stemCards = (verbs) => {
  const out = [];
  verbs.forEach((v) => {
    const f = conjugate(v);
    ["du", "er/sie/es"].forEach((p) => {
      out.push(card(`praes:${v.inf}:${p}`, v.inf, `${p} · Präsens`, `${p === "du" ? "du" : "er"} ${f[p]}`, v.type));
    });
  });
  return out;
};

const fullCards = (verbs, persons) => {
  const out = [];
  verbs.forEach((v) => {
    const f = conjugate(v);
    persons.forEach((p) => {
      const subj = p === "er/sie/es" ? "er" : p === "sie/Sie" ? "sie" : p;
      out.push(card(`praes:${v.inf}:${p}`, v.inf, `${p} · Präsens`, `${subj} ${f[p]}`));
    });
  });
  return out;
};

const ALL_PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

const separableCards = () =>
  SEPARABLE.map((v) => card(`trenn:${v.inf}`, v.q, `${v.inf} · Präsens`, v.a, v.note));

// --- Perfekt, Präteritum, Imperativ, Konjunktiv ------------------------------

const perfektCards = (rows) =>
  rows.map(([inf, aux, part]) =>
    card(`perf:${inf}`, inf, "Perfekt · er/sie/es", `${aux === "sein" ? "ist" : "hat"} ${part}`,
      aux === "sein" ? "Bewegung oder Zustandswechsel — deshalb sein." : "")
  );

const praeteritumCards = (rows) =>
  rows.map(([inf, praet]) => card(`praet:${inf}`, inf, "Präteritum · ich / er", praet));

const imperativCards = () =>
  IMPERATIV.map(([inf, du, ihr, sie]) =>
    card(`imp:${inf}`, inf, "Imperativ · du / ihr / Sie", `${du} — ${ihr} — ${sie}`)
  );

const konjunktivCards = () =>
  KONJUNKTIV.map(([inf, form, note]) => card(`konj:${inf}`, inf, "Konjunktiv II · ich", form, note));

// --- Pattern drills ----------------------------------------------------------
// Passive and Plusquamperfekt are not paradigms — there is nothing to decline,
// only a transformation to perform — so they are written as sentence pairs.

const PASSIV = [
  ["Man baut das Haus.", "Das Haus wird gebaut.", "Passiv Präsens: werden + Partizip II."],
  ["Man baute das Haus.", "Das Haus wurde gebaut.", "Passiv Präteritum: wurde + Partizip II."],
  ["Man hat das Haus gebaut.", "Das Haus ist gebaut worden.", "Im Perfekt heißt das Partizip von werden „worden“, nicht „geworden“."],
  ["Man muss das Haus bauen.", "Das Haus muss gebaut werden.", "Mit Modalverb: Partizip + werden im Infinitiv, ganz am Ende."],
  ["Man repariert das Auto.", "Das Auto wird repariert.", ""],
  ["Man lud uns ein.", "Wir wurden eingeladen.", ""],
  ["Man hat mich angerufen.", "Ich bin angerufen worden.", ""],
  ["Man kann das Problem lösen.", "Das Problem kann gelöst werden.", ""],
  ["Der Arzt untersucht den Patienten.", "Der Patient wird vom Arzt untersucht.", "Wer es tut, kommt mit „von“ zurück — wenn er überhaupt genannt wird."],
];

const PLUSQUAM = [
  ["Ich ___ schon ___ (essen), als er kam.", "Ich hatte schon gegessen, als er kam.", "Plusquamperfekt: hatte / war + Partizip II."],
  ["Wir ___ schon ___ (gehen), als sie ankam.", "Wir waren schon gegangen, als sie ankam.", "gehen nimmt sein — also war, nicht hatte."],
  ["Nachdem er ___ ___ (aufstehen), duschte er.", "Nachdem er aufgestanden war, duschte er.", "Nach „nachdem“ steht fast immer das Plusquamperfekt."],
  ["Das ___ ich nicht ___ (wissen).", "Das hätte ich nicht gewusst.", "Konjunktiv II der Vergangenheit: hätte / wäre + Partizip II."],
  ["Ich ___ gern ___ (kommen).", "Ich wäre gern gekommen.", "kommen nimmt sein — also wäre."],
  ["Wenn ich Zeit ___, ___ ich ___ (haben / helfen).", "Wenn ich Zeit gehabt hätte, hätte ich geholfen.", "Zweimal hätte: einmal im Wenn-Satz, einmal im Hauptsatz."],
];

const patternCards = (prefix, rows) =>
  rows.map(([q, a, note], i) => card(`${prefix}:${i}`, q, prefix === "passiv" ? "ins Passiv" : "Vergangenheit", a, note));

// --- The sets, per level -----------------------------------------------------

const SETS = {
  "praesens-stamm": {
    name: "Präsens — Stammwechsel",
    lede: "Nur du und er/sie/es ändern den Stamm — die anderen vier Personen sind regelmäßig und stehen gar nicht erst im Stapel.",
  },
  "praesens-hilfsverben": {
    name: "Präsens — sein, haben, werden",
    lede: "Alle sechs Formen, alle drei Verben. Ohne sie geht kein Perfekt, kein Passiv und kaum ein Satz.",
  },
  "praesens-modalverben": {
    name: "Präsens — Modalverben",
    lede: "Der Singular wechselt den Vokal und die ich-Form hat gar keine Endung: ich kann, nicht ich kanne.",
  },
  trennbar: {
    name: "Trennbare Verben",
    lede: "Ganze Sätze, weil es bei trennbaren Verben nicht um die Endung geht, sondern darum, wohin die Vorsilbe fällt: ans Ende, hinter alles andere.",
  },
  "praeteritum-a1": {
    name: "Präteritum — war & hatte",
    lede: "Die zwei Vergangenheitsformen, die man auch im Gespräch benutzt. Alles andere erzählt man auf A1 im Perfekt.",
  },
  perfekt: {
    name: "Perfekt — Partizip II",
    lede: "Das Hilfsverb gehört zur Vokabel: „gefahren“ zu wissen, ohne zu wissen, dass es sein nimmt, ist die Hälfte.",
  },
  "praeteritum-modal": {
    name: "Präteritum — sein, haben, werden & Modalverben",
    lede: "Die Verben, bei denen man auch beim Sprechen das Präteritum nimmt.",
  },
  imperativ: {
    name: "Imperativ",
    lede: "Zwei Fallen: e → i bleibt (sprich!), a → ä fällt weg (fahr!, nie fähr!).",
  },
  praeteritum: {
    name: "Präteritum — starke Verben",
    lede: "Die ich/er-Form ohne Endung — die Form, die dir ein Lesetext hinlegt.",
  },
  konjunktiv: {
    name: "Konjunktiv II",
    lede: "Die Verben mit einer eigenen lebendigen Konjunktivform. Für alle anderen: würde + Infinitiv.",
  },
  passiv: {
    name: "Passiv",
    lede: "Umformen statt konjugieren: wer es tut, verschwindet, und werden trägt die Zeit.",
  },
  plusquamperfekt: {
    name: "Plusquamperfekt & Konjunktiv II der Vergangenheit",
    lede: "Zwei Zeiten mit derselben Mechanik: hatte/war beziehungsweise hätte/wäre, plus Partizip II.",
  },
};

function make(id, cards) {
  return Object.assign({ id, cards }, SETS[id]);
}

// A2's Präteritum is sein/haben/werden plus the modals — the verbs its own
// Schritt "Präteritum & Modalverben" covers. The strong verbs are B1's.
const PRAET_MODAL = PRAETERITUM.slice(0, 9);

// A1 meets a smaller stem-change list: the nine in its own Schritt-1 table plus
// the ones its themes actually use. empfehlen and laden wait for A2.
const A1_STEM = STEM_CHANGE.filter((v) => !["empfehlen", "laden", "halten", "fallen"].includes(v.inf));

// The Präsens sets every level shares. Only the stem-change list differs, so it
// is a parameter rather than three near-copies — the first draft of this had A2
// inheriting A1's shortened list AND adding the full one, and shipped a town
// with two identically named stacks in it.
const praesensSets = (stemList) => [
  make("praesens-stamm", stemCards(stemList)),
  make("praesens-hilfsverben", fullCards(AUXILIARIES, ALL_PERSONS)),
  make("praesens-modalverben", fullCards(MODALS, ["ich", "du", "er/sie/es", "ihr"])),
  make("trennbar", separableCards()),
];

export const SETS_BY_LEVEL = {
  a1: [
    ...praesensSets(A1_STEM),
    make("praeteritum-a1", fullCards(
      [{ inf: "sein", praesens: { ich: "war", du: "warst", "er/sie/es": "war", wir: "waren", ihr: "wart", "sie/Sie": "waren" } },
       { inf: "haben", praesens: { ich: "hatte", du: "hattest", "er/sie/es": "hatte", wir: "hatten", ihr: "hattet", "sie/Sie": "hatten" } }],
      ALL_PERSONS
    ).map((c) => Object.assign({}, c, {
      key: c.key.replace("praes:", "praetA1:"),
      cue: c.cue.replace("Präsens", "Präteritum"),
    }))),
  ],
  a2: [
    ...praesensSets(STEM_CHANGE),
    make("perfekt", perfektCards(PERFEKT)),
    make("praeteritum-modal", praeteritumCards(PRAET_MODAL)),
    make("imperativ", imperativCards()),
  ],
  b1: [
    ...praesensSets(STEM_CHANGE),
    make("perfekt", perfektCards(PERFEKT)),
    make("praeteritum", praeteritumCards(PRAETERITUM)),
    make("imperativ", imperativCards()),
    make("konjunktiv", konjunktivCards()),
    make("passiv", patternCards("passiv", PASSIV)),
    make("plusquamperfekt", patternCards("plusquam", PLUSQUAM)),
  ],
};

export function setsFor(level) {
  return SETS_BY_LEVEL[level] || SETS_BY_LEVEL.a2;
}
