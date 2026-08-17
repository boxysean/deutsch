// The A1 town: the ground A2 is built on.
//
// Every id carries an "a1-" prefix. A2's ids do not, because they were already
// written into saves before levels existed and renaming them would discard real
// work. The storage namespace alone would keep the two apart, but distinct ids
// mean a cross-level mix-up is impossible rather than merely unlikely — worth
// the small asymmetry.
//
// The route is one sequence of 26 steps, interleaved the same way A2's is:
// grammar carries the real dependencies (articles before the accusative, the
// accusative before possessives, sentence order before separable verbs), while
// vocabulary is placed where its words are first needed, and the exam parts sit
// early enough to stop the format being a surprise.
export const ZONES_A1 = [
  // ---------------- Grammar district (10) ----------------
  {
    id: "a1-praesens", order: 2, category: "grammar", name: "Präsens & Pronomen",
    subtitle: "Regelmäßige Verben · sein & haben",
    archetype: "townhall", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-artikel-nomen", order: 3, category: "grammar", name: "Artikel & Nomen",
    subtitle: "der/die/das · Plural",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-fragen", order: 6, category: "grammar", name: "Fragen & Satzstellung",
    subtitle: "W-Fragen · Ja/Nein · Verb an Position 2",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-akkusativ", order: 7, category: "grammar", name: "Akkusativ",
    subtitle: "den/einen/keinen",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-possessiv", order: 9, category: "grammar", name: "Possessivartikel",
    subtitle: "mein, dein, sein, ihr",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-modalverben", order: 12, category: "grammar", name: "Modalverben",
    subtitle: "können · müssen · wollen · möchten · dürfen",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-trennbare-verben", order: 14, category: "grammar", name: "Trennbare Verben",
    subtitle: "aufstehen, einkaufen, anrufen",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-imperativ", order: 17, category: "grammar", name: "Imperativ",
    subtitle: "Sie-Form · du-Form · ihr-Form",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-praepositionen", order: 19, category: "grammar", name: "Präpositionen & Orte",
    subtitle: "in, auf, bei, mit, zu, nach",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-perfekt", order: 21, category: "grammar", name: "Perfekt",
    subtitle: "haben/sein + Partizip II",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },

  // ---------------- Vocabulary district (12 A1 Themen) ----------------
  {
    id: "a1-begruessung", order: 1, icon: "👋", category: "vocab", name: "Begrüßung & Vorstellung",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-zahlen-uhrzeit", order: 4, icon: "🔢", category: "vocab", name: "Zahlen & Uhrzeit",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-familie", order: 5, icon: "👪", category: "vocab", name: "Familie & Personen",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-wohnen", order: 8, icon: "🏠", category: "vocab", name: "Wohnen & Möbel",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-essen-trinken", order: 11, icon: "🍎", category: "vocab", name: "Essen & Trinken",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-tagesablauf", order: 13, icon: "⏰", category: "vocab", name: "Tagesablauf",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-einkaufen", order: 15, icon: "🛒", category: "vocab", name: "Einkaufen & Preise",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-kleidung-farben", order: 18, icon: "👕", category: "vocab", name: "Kleidung & Farben",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-verkehr", order: 20, icon: "🚌", category: "vocab", name: "Verkehr & Wege",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-freizeit", order: 22, icon: "⚽", category: "vocab", name: "Freizeit & Hobbys",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-koerper", order: 24, icon: "💊", category: "vocab", name: "Körper & Gesundheit",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-wetter", order: 25, icon: "🌦", category: "vocab", name: "Wetter & Jahreszeiten",
    archetype: "stall", status: "built", module: "vocabTheme",
  },

  // ---------------- Exam district (4) ----------------
  // The trainers are not written yet; the houses stand so the route is complete.
  // These subtitles describe what A1 ABILITY looks like, not what the ÖSD A1
  // paper contains. The paper's structure has not been checked against a
  // primary source in this project, and naming parts you cannot verify is how
  // a study plan ends up drilling the wrong thing.
  {
    id: "a1-lesen", order: 10, icon: "📖", category: "examskill", name: "Lesen",
    subtitle: "Kurze Alltagstexte verstehen", archetype: "pavilion", status: "stub",
  },
  {
    id: "a1-hoeren", order: 16, icon: "🎧", category: "examskill", name: "Hören",
    subtitle: "Langsam und deutlich Gesprochenes", archetype: "pavilion", status: "stub",
  },
  {
    id: "a1-schreiben", order: 23, icon: "📝", category: "examskill", name: "Schreiben",
    subtitle: "Einfache Angaben und Mitteilungen", archetype: "pavilion", status: "stub",
  },
  {
    id: "a1-sprechen", order: 26, icon: "💬", category: "examskill", name: "Sprechen",
    subtitle: "Sich vorstellen, fragen, bitten", archetype: "pavilion", status: "stub",
  },

  // ---------------- Landmarks (5) ----------------
  // The same five buildings as A2, each reading this level's own content and
  // this level's own saves.
  {
    id: "a1-koelner-dom", icon: "📋", category: "info", name: "Kölner Dom",
    labelName: "Alle Tabellen", subtitle: "Grammatik zum Auswendiglernen", archetype: "cathedral",
    status: "built", module: "tableHall",
  },
  {
    id: "a1-brandenburger-tor", icon: "🎴", category: "info", name: "Brandenburger Tor",
    labelName: "Gemischtes Training", subtitle: "Alle Themen gemischt", archetype: "gate",
    status: "built", module: "mixedDeck",
  },
  {
    id: "a1-riesenrad", icon: "🎡", category: "info", name: "Riesenrad",
    labelName: "Daten mitnehmen", subtitle: "Export & Import", archetype: "wheel",
    status: "built", module: "dataTransfer",
  },
  {
    id: "a1-fernsehturm", icon: "📈", category: "info", name: "Fernsehturm",
    labelName: "Mein Fortschritt", subtitle: "Lernplan & Verlauf", archetype: "tower",
    status: "built", module: "progressTower",
  },
  {
    id: "a1-dom", icon: "⛪", category: "info", name: "Dom",
    labelName: "Über das Spiel", subtitle: "Spiel & Prüfung", archetype: "dom",
    pinned: true, status: "built", module: "infoHub",
  },
];
