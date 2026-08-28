// Schritt 1's tables, as data.
//
// That page writes its own HTML, so these were originally restated inside the
// Kölner Dom just so the hall could show them. They live here now because BOTH
// need them: the hall lists them with every other table, and Schritt 1 renders
// them from the same source, which is what lets its own page cover them.
//
// Only the two that are genuinely learned by heart come along: the
// stem-changing verbs and sein/haben/werden. The Position-1 table on that page
// shows one verb in four sentences — a demonstration, not a paradigm.
//
// The Typ column is second, not first: given an infinitive you should be able
// to produce the pattern and both forms, which only works if the infinitive is
// the key you are handed when the rest is covered.
export const EXTRA_TABLES = {
  "grammar-foundations": [
    {
      caption: "Stammveränderung (2./3. Person Singular)",
      lede: "Nur du und er/sie/es ändern den Stamm — ich, wir, ihr, sie bleiben regelmäßig.",
      head: ["Infinitiv", "Typ", "du", "er/sie/es"],
      rows: [
        ["fahren", "a → ä", "fährst", "fährt"],
        ["schlafen", "a → ä", "schläfst", "schläft"],
        ["sprechen", "e → i", "sprichst", "spricht"],
        ["essen", "e → i", "isst", "isst"],
        ["geben", "e → i", "gibst", "gibt"],
        ["sehen", "e → ie", "siehst", "sieht"],
        ["lesen", "e → ie", "liest", "liest"],
        ["nehmen", "irregulär", "nimmst", "nimmt"],
        ["wissen", "irregulär", "weißt", "weiß"],
      ],
    },
    {
      caption: "sein, haben, werden",
      lede: "Die drei Hilfsverben. Ohne sie geht kein Perfekt, kein Passiv und kaum ein Satz.",
      head: ["", "sein", "haben", "werden"],
      rows: [
        ["ich", "bin", "habe", "werde"],
        ["du", "bist", "hast", "wirst"],
        ["er/sie/es", "ist", "hat", "wird"],
        ["wir", "sind", "haben", "werden"],
        ["ihr", "seid", "habt", "werdet"],
        ["sie/Sie", "sind", "haben", "werden"],
      ],
    },
  ],
};
