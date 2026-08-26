// Verb forms, generated from a paradigm rather than typed out.
//
// A conjugation trainer is only as good as its answers, and 40 verbs × 6
// persons is 240 hand-typed strings — which is 240 chances to teach somebody
// "du nehmst". So the regular endings are applied by rule here, and the data
// carries ONLY the forms a rule would get wrong. That way the mechanical cases
// are right by construction and the irregular ones are short enough to check
// line by line.
//
// The rules, and deliberately only these two:
//   ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en
//   stem in -d/-t: an -e- goes in            → arbeitest, arbeitet, wartet
//   stem in -s/-ß/-z/-x: du loses its -s-    → du heißt, du tanzt, du liest
//
// The third textbook rule — an -e- after -m/-n behind another consonant — is
// NOT applied, on purpose. It reads as if it were mechanical and isn't: the
// consonant it excludes is a silent h (wohnst, not wohnest) but not the ch of
// rechnest, which no plain character test separates. It covers a handful of
// verbs, so those declare stemE instead of being guessed at.

export const PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

const ENDINGS = { ich: "e", du: "st", "er/sie/es": "t", wir: "en", ihr: "t", "sie/Sie": "en" };

const sibilant = (stem) => /[sßzx]$/.test(stem);

/**
 * @param verb.inf       infinitive
 * @param verb.stem      present stem, if it isn't the infinitive minus -(e)n
 * @param verb.stemE     force the -e- (atmen, öffnen, rechnen)
 * @param verb.praesens  per-person overrides — the stem changes and the
 *                       wholly irregular verbs
 */
/** The forms the rules alone would produce, ignoring the verb's overrides. */
export function conjugateRegular(verb) {
  return conjugate(Object.assign({}, verb, { praesens: null }));
}

export function conjugate(verb) {
  const stem = verb.stem || verb.inf.replace(/e?n$/, "");
  const wantsE = verb.stemE || /[dt]$/.test(stem);
  const out = {};
  PERSONS.forEach((p) => {
    let ending = ENDINGS[p];
    if (wantsE && (p === "du" || p === "er/sie/es" || p === "ihr")) ending = "e" + ending;
    else if (sibilant(stem) && p === "du") ending = "t";
    out[p] = stem + ending;
  });
  return Object.assign(out, verb.praesens || {});
}
