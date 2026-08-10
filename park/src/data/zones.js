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
    col: 1, row: 0, archetype: "kiosk", status: "stub",
    teaser: "Der Akkusativ markiert das direkte Objekt: Ich sehe den Mann. Maskulinum ändert sich: der → den, ein → einen.",
  },
  {
    id: "dativ", category: "grammar", name: "Dativ", tag: "3",
    col: 2, row: 0, archetype: "kiosk", status: "stub",
    teaser: "Der Dativ markiert das indirekte Objekt: Ich gebe der Lehrerin das Buch. Alle vier Artikel ändern sich (der→dem, die→der, das→dem, die→den).",
  },
  {
    id: "praepositionen", category: "grammar", name: "Präpositionen", tag: "4",
    col: 3, row: 0, archetype: "kiosk", status: "stub",
    teaser: "Präpositionen mit festem Kasus: für/ohne/gegen/um (+Akkusativ), mit/nach/bei/seit/von/zu/aus (+Dativ). Verschmelzungen wie zum, zur, im, am.",
  },
  {
    id: "wechselpraepositionen", category: "grammar", name: "Wechselpräpositionen", tag: "5",
    col: 0, row: 1, archetype: "kiosk", status: "stub",
    teaser: "Wechselpräpositionen (an, auf, hinter, in, neben, über, unter, vor, zwischen) nehmen Akkusativ bei Bewegung (wohin?) und Dativ bei Ort (wo?).",
  },
  {
    id: "perfekt", category: "grammar", name: "Perfekt", tag: "6",
    col: 1, row: 1, archetype: "kiosk", status: "stub",
    teaser: "Perfekt = haben/sein + Partizip II am Satzende. Bewegungsverben und Zustandswechsel nehmen sein; die meisten anderen haben.",
  },
  {
    id: "praeteritum-modalverben", category: "grammar", name: "Präteritum & Modalverben", tag: "7",
    col: 2, row: 1, archetype: "kiosk", status: "stub",
    teaser: "Präteritum wird in der gesprochenen Sprache vor allem bei sein, haben und den Modalverben verwendet: war, hatte, konnte, musste, wollte, durfte, sollte.",
  },
  {
    id: "adjektivendungen", category: "grammar", name: "Adjektivendungen", tag: "8",
    col: 3, row: 1, archetype: "kiosk", status: "stub",
    teaser: "Adjektivendungen hängen von Genus, Kasus und Artikeltyp ab (stark/schwach/gemischt) — z. B. der neue Wagen vs. ein neuer Wagen.",
  },
  {
    id: "nebensaetze", category: "grammar", name: "Nebensätze", tag: "9",
    col: 0, row: 2, archetype: "kiosk", status: "stub",
    teaser: "In Nebensätzen (weil, dass, wenn, ob) rückt das konjugierte Verb ans Satzende: Ich komme nicht, weil ich krank bin.",
  },
  {
    id: "reflexiv-konjunktiv", category: "grammar", name: "Reflexiv & Konjunktiv II", tag: "10",
    col: 1, row: 2, archetype: "kiosk", status: "stub",
    teaser: "Reflexivverben (sich interessieren für) + höfliches Konjunktiv II für Bitten und Wünsche: könnten, hätte gern, würde.",
  },
  {
    id: "verben-mit-praeposition", category: "grammar", name: "Verben mit Präposition", tag: "10",
    col: 2, row: 2, archetype: "kiosk", status: "stub",
    teaser: "Feste Verb-Präposition-Kombinationen mit eigenem Kasus: warten auf (+Akk.), sich freuen auf (+Akk.), Angst haben vor (+Dat.).",
  },

  // ---------------- Vocabulary district (20 standard A2 Themen) ----------------
  { id: "persoenliche-informationen", icon: "🙋", category: "vocab", name: "Persönliche Informationen",
    col: 0, row: 0, archetype: "stall", status: "stub",
    teaser: "Name, Alter, Herkunft, Familienstand, Adresse — die Basis-Vorstellung." },
  { id: "familie", icon: "👪", category: "vocab", name: "Familie & Beziehungen",
    col: 1, row: 0, archetype: "stall", status: "stub",
    teaser: "Eltern, Geschwister, Partner, Verwandtschaft." },
  { id: "wohnen", icon: "🏠", category: "vocab", name: "Wohnen",
    col: 2, row: 0, archetype: "stall", status: "stub",
    teaser: "Wohnung, Haus, Zimmer, Miete, Möbel." },
  { id: "alltag-tagesablauf", icon: "⏰", category: "vocab", name: "Alltag & Tagesablauf",
    col: 3, row: 0, archetype: "stall", status: "stub",
    teaser: "28 Vokabeln zu diesem Thema sind bereits fertig — im Grammatik-Fundament-Gebäude (Tag 1)." },
  { id: "einkaufen", icon: "🛒", category: "vocab", name: "Einkaufen",
    col: 4, row: 0, archetype: "stall", status: "stub",
    teaser: "Geschäfte, Preise, bezahlen, Größen." },
  { id: "essen-trinken", icon: "🍎", category: "vocab", name: "Essen & Trinken",
    col: 0, row: 1, archetype: "stall", status: "built", module: "vocabTheme" },
  { id: "koerper-gesundheit", icon: "💊", category: "vocab", name: "Körper & Gesundheit",
    col: 1, row: 1, archetype: "stall", status: "stub",
    teaser: "Körperteile, beim Arzt, Symptome." },
  { id: "kleidung", icon: "👕", category: "vocab", name: "Kleidung",
    col: 2, row: 1, archetype: "stall", status: "stub",
    teaser: "Kleidungsstücke, Farben, Größen." },
  { id: "arbeit-beruf", icon: "💼", category: "vocab", name: "Arbeit & Beruf",
    col: 3, row: 1, archetype: "stall", status: "stub",
    teaser: "Berufe, Arbeitsplatz, Bewerbung." },
  { id: "ausbildung-sprachen", icon: "🎓", category: "vocab", name: "Ausbildung & Sprachen lernen",
    col: 4, row: 1, archetype: "stall", status: "stub",
    teaser: "Schule, Kurs, Sprachniveau." },
  { id: "freizeit-hobbys", icon: "⚽", category: "vocab", name: "Freizeit & Hobbys",
    col: 0, row: 2, archetype: "stall", status: "stub",
    teaser: "Sport, Musik, Interessen." },
  { id: "reisen-verkehr", icon: "🚆", category: "vocab", name: "Reisen & Verkehr",
    col: 1, row: 2, archetype: "stall", status: "stub",
    teaser: "Bahn, Bus, Ticket, Gepäck." },
  { id: "orientierung-stadt", icon: "🧭", category: "vocab", name: "Orientierung in der Stadt",
    col: 2, row: 2, archetype: "stall", status: "stub",
    teaser: "Wegbeschreibung, Sehenswürdigkeiten." },
  { id: "wetter-klima", icon: "⛅", category: "vocab", name: "Wetter & Klima",
    col: 3, row: 2, archetype: "stall", status: "stub",
    teaser: "Temperatur, Jahreszeiten, Vorhersage." },
  { id: "technik-medien", icon: "💻", category: "vocab", name: "Technik, Medien, Kommunikation",
    col: 4, row: 2, archetype: "stall", status: "stub",
    teaser: "Handy, Internet, E-Mail." },
  { id: "termine-uhrzeit", icon: "📅", category: "vocab", name: "Termine & Uhrzeit",
    col: 0, row: 3, archetype: "stall", status: "stub",
    teaser: "Verabredungen, Kalender, Pünktlichkeit." },
  { id: "feste-feiertage", icon: "🎉", category: "vocab", name: "Feste & Feiertage",
    col: 1, row: 3, archetype: "stall", status: "stub",
    teaser: "Geburtstag, Weihnachten, Einladungen." },
  { id: "umwelt", icon: "🌱", category: "vocab", name: "Umwelt",
    col: 2, row: 3, archetype: "stall", status: "stub",
    teaser: "Mülltrennung, Natur, einfache Umweltthemen." },
  { id: "geld-preise", icon: "💶", category: "vocab", name: "Geld & Preise",
    col: 3, row: 3, archetype: "stall", status: "stub",
    teaser: "Bank, bezahlen, Rechnung." },
  { id: "heimat-herkunft", icon: "🌍", category: "vocab", name: "Heimat & Herkunft",
    col: 4, row: 3, archetype: "stall", status: "stub",
    teaser: "Herkunftsland, Sprachen, Kultur." },

  // ---------------- Exam-skill district (4) ----------------
  {
    id: "lesen", icon: "📖", category: "examskill", name: "Lesen",
    subtitle: "30 Min · 25 Punkte", col: 0, row: 0, archetype: "pavilion",
    status: "built", module: "lesenExam",
  },
  {
    id: "hoeren", icon: "🎧", category: "examskill", name: "Hören",
    col: 1, row: 0, archetype: "pavilion", status: "stub",
    teaser: "3 Aufgaben, ca. 15 Min, 30 Punkte (min. 6 zum Bestehen): Notizen zu einer Durchsage, 5-Personen-Interview, Doppel-Hörtext.",
  },
  {
    id: "schreiben", icon: "📝", category: "examskill", name: "Schreiben",
    col: 0, row: 1, archetype: "pavilion", status: "stub",
    teaser: "1 Aufgabe, 30 Min, 15 Punkte: Antwort-E-Mail (~50 Wörter), 4 eingebettete Fragen beantworten.",
  },
  {
    id: "sprechen", icon: "💬", category: "examskill", name: "Sprechen",
    col: 1, row: 1, archetype: "pavilion", status: "stub",
    teaser: "2 Aufgaben, ca. 10 Min + 10 Min Vorbereitung, max. 20 Punkte: Sich vorstellen (5 von 6 Themen) + gemeinsame Planaufgabe.",
  },
];

export function getZone(id) {
  return ZONES.find((z) => z.id === id);
}
