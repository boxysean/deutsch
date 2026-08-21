// The A1 town: the ground A2 is built on.
//
// Every id carries an "a1-" prefix. A2's ids do not, because they were already
// written into saves before levels existed and renaming them would discard real
// work. The storage namespace alone would keep the two apart, but distinct ids
// mean a cross-level mix-up is impossible rather than merely unlikely — worth
// the small asymmetry.
//
// The route is one sequence of 28 steps, interleaved the same way A2's is:
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
    id: "a1-fragen", order: 7, category: "grammar", name: "Fragen & Satzstellung",
    subtitle: "W-Fragen · Ja/Nein · Verb an Position 2",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-akkusativ", order: 8, category: "grammar", name: "Akkusativ",
    subtitle: "den/einen/keinen",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-possessiv", order: 10, category: "grammar", name: "Possessivartikel",
    subtitle: "mein, dein, sein, ihr",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-modalverben", order: 13, category: "grammar", name: "Modalverben",
    subtitle: "können · müssen · wollen · möchten · dürfen",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-trennbare-verben", order: 15, category: "grammar", name: "Trennbare Verben",
    subtitle: "aufstehen, einkaufen, anrufen",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-imperativ", order: 18, category: "grammar", name: "Imperativ",
    subtitle: "Sie-Form · du-Form · ihr-Form",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-praepositionen", order: 20, category: "grammar", name: "Präpositionen & Orte",
    subtitle: "in, auf, bei, mit, zu, nach",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "a1-perfekt", order: 23, category: "grammar", name: "Perfekt",
    subtitle: "haben/sein + Partizip II",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },

  // ---------------- Vocabulary district (12 A1 Themen) ----------------
  {
    id: "a1-begruessung", order: 1, icon: "👋", category: "vocab", name: "Begrüßung & Vorstellung",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-zahlen-uhrzeit", order: 5, icon: "🔢", category: "vocab", name: "Zahlen & Uhrzeit",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-familie", order: 6, icon: "👪", category: "vocab", name: "Familie & Personen",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-wohnen", order: 9, icon: "🏠", category: "vocab", name: "Wohnen & Möbel",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-essen-trinken", order: 12, icon: "🍎", category: "vocab", name: "Essen & Trinken",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-tagesablauf", order: 14, icon: "⏰", category: "vocab", name: "Tagesablauf",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-einkaufen", order: 16, icon: "🛒", category: "vocab", name: "Einkaufen & Preise",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-kleidung-farben", order: 19, icon: "👕", category: "vocab", name: "Kleidung & Farben",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-verkehr", order: 22, icon: "🚌", category: "vocab", name: "Verkehr & Wege",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-freizeit", order: 24, icon: "⚽", category: "vocab", name: "Freizeit & Hobbys",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-koerper", order: 26, icon: "💊", category: "vocab", name: "Körper & Gesundheit",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-wetter", order: 27, icon: "🌦", category: "vocab", name: "Wetter & Jahreszeiten",
    archetype: "stall", status: "built", module: "vocabTheme",
  },

  // Two decks that are not about a topic. The twelve above are topical, which
  // is why they leak: a verb like `bringen` or an adverb like `leider` belongs
  // to no theme, so nothing owned it. Checking the town against the Goethe A1
  // Wortliste made the hole measurable — see vocabTheme/a1c.js.
  {
    id: "a1-verben", order: 4, icon: "🔤", category: "vocab", name: "Verben",
    subtitle: "Die Verben, die überall vorkommen",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "a1-kleine-woerter", order: 21, icon: "✨", category: "vocab", name: "Kleine Wörter",
    subtitle: "Eigenschaften, Zeit, Ort, Menge",
    archetype: "stall", status: "built", module: "vocabTheme",
  },

  // ---------------- Exam district (4) ----------------
  // The trainers are not written yet; the houses stand so the route is complete.
  // The subtitles name the real task types, read off the ZA1 Modellsatz
  // (10.04.2024) — see infoHub/data.js for the full figures and their source.
  {
    id: "a1-lesen", order: 11, icon: "📖", category: "examskill", name: "Lesen",
    subtitle: "3 Aufgaben · Anzeigen, Ja/Nein, Bilder", archetype: "pavilion", status: "stub",
  },
  {
    id: "a1-hoeren", order: 17, icon: "🎧", category: "examskill", name: "Hören",
    subtitle: "3 Aufgaben · alles nur ein Mal", archetype: "pavilion", status: "stub",
  },
  {
    id: "a1-schreiben", order: 25, icon: "📝", category: "examskill", name: "Schreiben",
    subtitle: "Formular + Antwort-E-Mail", archetype: "pavilion", status: "stub",
  },
  {
    id: "a1-sprechen", order: 28, icon: "💬", category: "examskill", name: "Sprechen",
    subtitle: "Vorstellen · Bild · Rollenspiel", archetype: "pavilion", status: "stub",
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
  // ---------------- Schloss Neuschwanstein (1) ----------------
  // Purple like the other landmarks, not grammar red. The district colours
  // encode where a topic lives on the route; the castle belongs to no Schritt —
  // it draws verb forms from all of them, the way the Tor draws vocabulary.
  {
    id: "a1-schloss", icon: "\u2694\ufe0f", category: "info", name: "Schloss Neuschwanstein",
    labelName: "Verben trainieren", subtitle: "Konjugation als Karteikarten", archetype: "castle",
    status: "built", module: "konjugationDrill",
  },
];
