// 35-zone registry driving both the 3D scene and the overlay content router.
// category: "grammar" | "vocab" | "examskill"
// status:   "built" (has a content module) | "stub" (shows a teaser only)
export const ZONES = [
  // ---------------- Grammar district (11) ----------------
  {
    id: "grammar-foundations", category: "grammar", name: "Grammatik-Fundament",
    subtitle: "Präsens · V2 · Satzklammer", tag: "1",
    col: 0, row: 0, archetype: "townhall", status: "built", module: "grammarFoundations",
  },
  {
    id: "akkusativ", category: "grammar", name: "Akkusativ", tag: "2",
    col: 1, row: 0, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "dativ", category: "grammar", name: "Dativ", tag: "3",
    col: 2, row: 0, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "praepositionen", category: "grammar", name: "Präpositionen", tag: "4",
    col: 3, row: 0, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "wechselpraepositionen", category: "grammar", name: "Wechselpräpositionen", tag: "5",
    col: 0, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "perfekt", category: "grammar", name: "Perfekt", tag: "6",
    col: 1, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "praeteritum-modalverben", category: "grammar", name: "Präteritum & Modalverben", tag: "7",
    col: 2, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "adjektivendungen", category: "grammar", name: "Adjektivendungen", tag: "8",
    col: 3, row: 1, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "nebensaetze", category: "grammar", name: "Nebensätze", tag: "9",
    col: 0, row: 2, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "reflexiv-konjunktiv", category: "grammar", name: "Reflexiv & Konjunktiv II", tag: "10",
    col: 1, row: 2, archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "verben-mit-praeposition", category: "grammar", name: "Verben mit Präposition", tag: "11",
    col: 2, row: 2, archetype: "kiosk", status: "built", module: "grammarTopic",
  },

  // ---------------- Vocabulary district (20 standard A2 Themen) ----------------
  { id: "persoenliche-informationen", icon: "🙋", category: "vocab", name: "Persönliche Informationen",
    col: 0, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "familie", icon: "👪", category: "vocab", name: "Familie & Beziehungen",
    col: 1, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "wohnen", icon: "🏠", category: "vocab", name: "Wohnen",
    col: 2, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "alltag-tagesablauf", icon: "⏰", category: "vocab", name: "Alltag & Tagesablauf",
    col: 3, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "einkaufen", icon: "🛒", category: "vocab", name: "Einkaufen",
    col: 4, row: 0, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "essen-trinken", icon: "🍎", category: "vocab", name: "Essen & Trinken",
    col: 0, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "koerper-gesundheit", icon: "💊", category: "vocab", name: "Körper & Gesundheit",
    col: 1, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "kleidung", icon: "👕", category: "vocab", name: "Kleidung",
    col: 2, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "arbeit-beruf", icon: "💼", category: "vocab", name: "Arbeit & Beruf",
    col: 3, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "ausbildung-sprachen", icon: "🎓", category: "vocab", name: "Ausbildung & Sprachen lernen",
    col: 4, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "freizeit-hobbys", icon: "⚽", category: "vocab", name: "Freizeit & Hobbys",
    col: 0, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "reisen-verkehr", icon: "🚆", category: "vocab", name: "Reisen & Verkehr",
    col: 1, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "orientierung-stadt", icon: "🧭", category: "vocab", name: "Orientierung in der Stadt",
    col: 2, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "wetter-klima", icon: "⛅", category: "vocab", name: "Wetter & Klima",
    col: 3, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "technik-medien", icon: "💻", category: "vocab", name: "Technik, Medien, Kommunikation",
    col: 4, row: 2, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "termine-uhrzeit", icon: "📅", category: "vocab", name: "Termine & Uhrzeit",
    col: 0, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "feste-feiertage", icon: "🎉", category: "vocab", name: "Feste & Feiertage",
    col: 1, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "umwelt", icon: "🌱", category: "vocab", name: "Umwelt",
    col: 2, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "geld-preise", icon: "💶", category: "vocab", name: "Geld & Preise",
    col: 3, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "heimat-herkunft", icon: "🌍", category: "vocab", name: "Heimat & Herkunft",
    col: 4, row: 3, archetype: "stall", status: "built", module: "vocabTheme" },

  // ---------------- Exam-skill district (4) ----------------
  {
    id: "lesen", icon: "📖", category: "examskill", name: "Lesen",
    subtitle: "30 Min · 25 Punkte", col: 0, row: 0, archetype: "pavilion",
    status: "built", module: "lesenExam",
  },
  {
    id: "hoeren", icon: "🎧", category: "examskill", name: "Hören",
    subtitle: "ca. 15 Min · 30 Punkte", col: 1, row: 0, archetype: "pavilion",
    status: "built", module: "examSkill",
  },
  {
    id: "schreiben", icon: "📝", category: "examskill", name: "Schreiben",
    subtitle: "30 Min · 15 Punkte", col: 0, row: 1, archetype: "pavilion",
    status: "built", module: "examSkill",
  },
  {
    id: "sprechen", icon: "💬", category: "examskill", name: "Sprechen",
    subtitle: "ca. 10 Min · 20 Punkte", col: 1, row: 1, archetype: "pavilion",
    status: "built", module: "examSkill",
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

export function getZone(id) {
  return ZONES.find((z) => z.id === id);
}
