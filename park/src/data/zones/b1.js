// The B1 town: ÖSD Zertifikat Deutsch Österreich B1.
//
// This is the Austria-specific B1, not the international ÖSD Zertifikat B1
// that is jointly issued with the Goethe-Institut. They are different papers.
// The clearest tell is the exam district below: ZDÖ B1 has a single combined
// LESEN & SPRACHBAUSTEINE subtest, which neither A1 nor A2 has, so the town
// gets four exam houses rather than the usual four-of-a-different-shape.
//
// Every id carries a "b1-" prefix, as A1's do; only A2's are bare, because its
// ids were written into saves before levels existed.
//
// Exam facts on the houses come from the ZDÖ B1 Durchführungsbestimmungen
// (Stand: März 2019) and the ZDÖ B1 Modellsatz Vers. 2.1 / 2.0. The grammar
// and vocabulary selection is mine, from the CEFR B1 descriptors — neither
// document specifies a syllabus or a word list.
export const ZONES_B1 = [
  // ---------------- Grammar district (14) ----------------
  {
    id: "b1-nebensaetze", order: 2, category: "grammar", name: "Nebensätze & Konnektoren",
    subtitle: "weil · dass · obwohl · damit · während",
    archetype: "townhall", status: "built", module: "grammarTopic",
  },
  {
    id: "b1-praeteritum", order: 5, category: "grammar", name: "Präteritum",
    subtitle: "Die Vergangenheit, die man schreibt",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "b1-relativsaetze", order: 8, category: "grammar", name: "Relativsätze",
    subtitle: "der, den, dem · mit Präposition",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "b1-adjektivdeklination", order: 11, category: "grammar", name: "Adjektivdeklination",
    subtitle: "Alle Kasus · Komparativ & Superlativ",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-genitiv", order: 14, category: "grammar", name: "Genitiv",
    subtitle: "des Vaters · wegen, während, trotz",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-infinitivsaetze", order: 17, category: "grammar", name: "Infinitiv mit zu",
    subtitle: "um…zu · ohne…zu · statt…zu",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-verben-praeposition", order: 20, category: "grammar", name: "Verben mit Präposition",
    subtitle: "da(r)- und wo(r)-Verbindungen",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-konjunktiv2", order: 23, category: "grammar", name: "Konjunktiv II",
    subtitle: "Wünsche · Höflichkeit · Irreales",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "b1-passiv", order: 26, category: "grammar", name: "Passiv",
    subtitle: "Präsens · Präteritum · mit Modalverb",
    archetype: "kiosk", status: "built", module: "grammarTopic",
  },
  {
    id: "b1-plusquamperfekt", order: 29, category: "grammar", name: "Plusquamperfekt",
    subtitle: "nachdem · Zeitenfolge",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-indirekte-fragen", order: 31, category: "grammar", name: "Indirekte Fragen",
    subtitle: "Ich weiß nicht, ob / wann …",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-partizipien", order: 33, category: "grammar", name: "Partizipien als Adjektiv",
    subtitle: "der lachende Mann · das geöffnete Fenster",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-vermutung", order: 34, category: "grammar", name: "Vermutung & Zukunft",
    subtitle: "Futur I · Modalverben subjektiv",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },
  {
    id: "b1-wortbildung", order: 30, category: "grammar", name: "Wortbildung",
    subtitle: "Vorsilben, Nachsilben, Nomen-Verb-Verbindungen",
    archetype: "kiosk", status: "stub", module: "grammarTopic",
  },

  // ---------------- Vocabulary district (16) ----------------
  {
    id: "b1-meinung", order: 1, icon: "💭", category: "vocab", name: "Meinung & Diskussion",
    subtitle: "Für Sprechen 2 und 3 die wichtigste Liste",
    archetype: "stall", status: "built", module: "vocabTheme",
  },
  {
    id: "b1-arbeit-beruf", order: 3, icon: "💼", category: "vocab", name: "Arbeit & Bewerbung",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-ausbildung", order: 6, icon: "🎓", category: "vocab", name: "Ausbildung & Weiterbildung",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-wohnen", order: 9, icon: "🏠", category: "vocab", name: "Wohnen & Nachbarschaft",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-behoerden", order: 12, icon: "🏛", category: "vocab", name: "Behörden & Ämter",
    subtitle: "Formulare, Anträge, Fristen",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-gesundheit", order: 15, icon: "💊", category: "vocab", name: "Gesundheit & Vorsorge",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-konsum-geld", order: 18, icon: "💶", category: "vocab", name: "Konsum, Geld & Verträge",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-umwelt", order: 21, icon: "🌱", category: "vocab", name: "Umwelt & Klima",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-medien", order: 24, icon: "📱", category: "vocab", name: "Medien & Internet",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-reisen", order: 27, icon: "✈", category: "vocab", name: "Reisen & Tourismus",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-mobilitaet", order: 32, icon: "🚊", category: "vocab", name: "Verkehr & Mobilität",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-beziehungen", order: 4, icon: "👥", category: "vocab", name: "Beziehungen & Zusammenleben",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-gefuehle", order: 7, icon: "🙂", category: "vocab", name: "Gefühle & Charakter",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-essen-ernaehrung", order: 13, icon: "🥗", category: "vocab", name: "Essen & Ernährung",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-feste-kultur", order: 19, icon: "🎭", category: "vocab", name: "Kultur & Freizeit",
    archetype: "stall", status: "stub", module: "vocabTheme",
  },
  {
    id: "b1-oesterreich", order: 25, icon: "🇦🇹", category: "vocab", name: "Österreich",
    subtitle: "Varianten, Land und Leute — für die ZDÖ-Prüfung",
    archetype: "stall", status: "built", module: "vocabTheme",
  },

  // ---------------- Exam district (4) ----------------
  // Note the first one: on ZDÖ B1, Lesen and Sprachbausteine are a SINGLE
  // subtest with one clock and one score. Splitting them into two houses would
  // misrepresent how the 90 minutes are actually budgeted.
  {
    id: "b1-lesen-sprachbausteine", order: 10, icon: "📖", category: "examskill",
    name: "Lesen & Sprachbausteine",
    subtitle: "5 Aufgaben · 40 Items · 90 Min", archetype: "pavilion", status: "stub",
  },
  {
    id: "b1-hoeren", order: 16, icon: "🎧", category: "examskill", name: "Hören",
    subtitle: "3 Aufgaben · 20 Items · ca. 30 Min", archetype: "pavilion", status: "stub",
  },
  {
    id: "b1-schreiben", order: 22, icon: "📝", category: "examskill", name: "Schreiben",
    subtitle: "1 Aufgabe, 2 Varianten zur Wahl · 40 Min", archetype: "pavilion", status: "stub",
  },
  {
    id: "b1-sprechen", order: 28, icon: "💬", category: "examskill", name: "Sprechen",
    subtitle: "Kontakt · Thema · gemeinsam lösen", archetype: "pavilion", status: "stub",
  },

  // ---------------- Landmarks (5) ----------------
  {
    id: "b1-koelner-dom", icon: "📋", category: "info", name: "Kölner Dom",
    labelName: "Alle Tabellen", subtitle: "Grammatik zum Auswendiglernen", archetype: "cathedral",
    status: "built", module: "tableHall",
  },
  {
    id: "b1-brandenburger-tor", icon: "🎴", category: "info", name: "Brandenburger Tor",
    labelName: "Gemischtes Training", subtitle: "Alle Themen gemischt", archetype: "gate",
    status: "built", module: "mixedDeck",
  },
  {
    id: "b1-riesenrad", icon: "🎡", category: "info", name: "Riesenrad",
    labelName: "Daten mitnehmen", subtitle: "Export & Import", archetype: "wheel",
    status: "built", module: "dataTransfer",
  },
  {
    id: "b1-fernsehturm", icon: "📈", category: "info", name: "Mein Fortschritt",
    labelName: "Mein Fortschritt", subtitle: "Lernplan & Verlauf", archetype: "tower",
    status: "built", module: "progressTower",
  },
  {
    id: "b1-dom", icon: "⛪", category: "info", name: "Dom",
    labelName: "Über das Spiel", subtitle: "Spiel & Prüfung", archetype: "dom",
    pinned: true, status: "built", module: "infoHub",
  },
  // ---------------- Schloss Neuschwanstein (1) ----------------
  // Purple like the other landmarks, not grammar red. The district colours
  // encode where a topic lives on the route; the castle belongs to no Schritt —
  // it draws verb forms from all of them, the way the Tor draws vocabulary.
  {
    id: "b1-schloss", icon: "\u2694\ufe0f", category: "info", name: "Schloss Neuschwanstein",
    labelName: "Verben trainieren", subtitle: "Konjugation als Karteikarten", archetype: "castle",
    status: "built", module: "konjugationDrill",
  },
];
