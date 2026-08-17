// The A2 town: 35 learning zones plus five clickable landmarks.
//
// category: "grammar" | "vocab" | "examskill" | "info"
// status:   "built" (has a content module) | "stub" (shows a teaser only)
// order:    position on the one fixed route through this level
//
// These ids carry no level prefix, unlike A1's. They are written into saves
// that already exist on real machines, and renaming them would throw that work
// away for nothing. See LEVELS[].idPrefix in data/levels.js.
export const ZONES_A2 = [
  // ---------------- Grammar district (11) ----------------
  {
    id: "grammar-foundations", order: 1, category: "grammar", name: "Grammatik-Fundament",
    subtitle: "Präsens · V2 · Satzklammer",
    col: 0, row: 0, archetype: "townhall", status: "built", module: "grammarFoundations",
  },
  {
    id: "akkusativ", order: 6, category: "grammar", name: "Akkusativ",
    col: 1, row: 0, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "dativ", order: 9, category: "grammar", name: "Dativ",
    col: 2, row: 0, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "praepositionen", order: 11, category: "grammar", name: "Präpositionen",
    col: 3, row: 0, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "wechselpraepositionen", order: 14, category: "grammar", name: "Wechselpräpositionen",
    col: 0, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "perfekt", order: 16, category: "grammar", name: "Perfekt",
    col: 1, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "praeteritum-modalverben", order: 4, category: "grammar", name: "Präteritum & Modalverben",
    col: 2, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "adjektivendungen", order: 20, category: "grammar", name: "Adjektivendungen",
    col: 3, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "nebensaetze", order: 22, category: "grammar", name: "Nebensätze",
    col: 0, row: 2, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "reflexiv-konjunktiv", order: 25, category: "grammar", name: "Reflexiv & Konjunktiv II",
    col: 1, row: 2, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "verben-mit-praeposition", order: 28, category: "grammar", name: "Verben mit Präposition",
    col: 2, row: 2, archetype: "kiosk", status: "built", module: "grammarTopic",
  },

  // ---------------- Vocabulary district (20 standard A2 Themen) ----------------
  { id: "persoenliche-informationen", order: 2, icon: "🙋", category: "vocab", name: "Persönliche Informationen",
    col: 0, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "familie", order: 5, icon: "👪", category: "vocab", name: "Familie & Beziehungen",
    col: 1, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "wohnen", order: 7, icon: "🏠", category: "vocab", name: "Wohnen",
    col: 2, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "alltag-tagesablauf", order: 10, icon: "⏰", category: "vocab", name: "Alltag & Tagesablauf",
    col: 3, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "einkaufen", order: 21, icon: "🛒", category: "vocab", name: "Einkaufen",
    col: 4, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "essen-trinken", order: 19, icon: "🍎", category: "vocab", name: "Essen & Trinken",
    col: 0, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "koerper-gesundheit", order: 26, icon: "💊", category: "vocab", name: "Körper & Gesundheit",
    col: 1, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "kleidung", order: 29, icon: "👕", category: "vocab", name: "Kleidung",
    col: 2, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "arbeit-beruf", order: 12, icon: "💼", category: "vocab", name: "Arbeit & Beruf",
    col: 3, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "ausbildung-sprachen", order: 17, icon: "🎓", category: "vocab", name: "Ausbildung & Sprachen lernen",
    col: 4, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "freizeit-hobbys", order: 15, icon: "⚽", category: "vocab", name: "Freizeit & Hobbys",
    col: 0, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "reisen-verkehr", order: 24, icon: "🚆", category: "vocab", name: "Reisen & Verkehr",
    col: 1, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "orientierung-stadt", order: 27, icon: "🧭", category: "vocab", name: "Orientierung in der Stadt",
    col: 2, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "wetter-klima", order: 30, icon: "⛅", category: "vocab", name: "Wetter & Klima",
    col: 3, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "technik-medien", order: 32, icon: "💻", category: "vocab", name: "Technik, Medien, Kommunikation",
    col: 4, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "termine-uhrzeit", order: 23, icon: "📅", category: "vocab", name: "Termine & Uhrzeit",
    col: 0, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "feste-feiertage", order: 33, icon: "🎉", category: "vocab", name: "Feste & Feiertage",
    col: 1, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "umwelt", order: 34, icon: "🌱", category: "vocab", name: "Umwelt",
    col: 2, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "geld-preise", order: 31, icon: "💶", category: "vocab", name: "Geld & Preise",
    col: 3, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "heimat-herkunft", order: 35, icon: "🌍", category: "vocab", name: "Heimat & Herkunft",
    col: 4, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },

  // ---------------- Exam-skill district (4) ----------------
  {
    id: "lesen", order: 3, icon: "📖", category: "examskill", name: "Lesen",
    subtitle: "30 Min · 25 Punkte", col: 0, row: 0, archetype: "pavilion",
    status: "built", module: "lesenExam",
  },
  {
    id: "hoeren", order: 18, icon: "🎧", category: "examskill", name: "Hören",
    subtitle: "ca. 15 Min · 30 Punkte", col: 1, row: 0, archetype: "pavilion",
    status: "built", module: "examSkill",
  },
  {
    id: "schreiben", order: 8, icon: "📝", category: "examskill", name: "Schreiben",
    subtitle: "30 Min · 15 Punkte", col: 0, row: 1, archetype: "pavilion",
    status: "built", module: "examSkill",
  },
  {
    id: "sprechen", order: 13, icon: "💬", category: "examskill", name: "Sprechen",
    subtitle: "ca. 10 Min · 20 Punkte", col: 1, row: 1, archetype: "pavilion",
    status: "built", module: "examSkill",
  },

  // ---------------- Kölner Dom (1) ----------------
  {
    id: "koelner-dom", icon: "📋", category: "info", name: "Kölner Dom",
    labelName: "Alle Tabellen", subtitle: "Grammatik zum Auswendiglernen", archetype: "cathedral",
    status: "built", module: "tableHall",
  },

  // ---------------- Brandenburger Tor (1) ----------------
  {
    id: "brandenburger-tor", icon: "🎴", category: "info", name: "Brandenburger Tor",
    labelName: "Gemischtes Training", subtitle: "Alle Themen gemischt", archetype: "gate",
    status: "built", module: "mixedDeck",
  },

  // ---------------- Riesenrad (1) ----------------
  {
    id: "riesenrad", icon: "🎡", category: "info", name: "Riesenrad",
    labelName: "Daten mitnehmen", subtitle: "Export & Import", archetype: "wheel",
    status: "built", module: "dataTransfer",
  },

  // ---------------- Fernsehturm (1) ----------------
  {
    id: "fernsehturm", icon: "📈", category: "info", name: "Fernsehturm",
    labelName: "Mein Fortschritt", subtitle: "Lernplan & Verlauf", archetype: "tower",
    status: "built", module: "progressTower",
  },

  // ---------------- Town square (1) ----------------
  {
    id: "dom", icon: "⛪", category: "info", name: "Dom",
    // The map label reads as a button rather than a place name — it is the
    // only zone that explains the app itself.
    labelName: "Über das Spiel", subtitle: "Spiel & Prüfung", archetype: "dom",
    // Never crowded out: it is how you find out what this thing is.
    pinned: true,
    status: "built", module: "infoHub",
  },
];
