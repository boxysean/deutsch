// What the Dom hands you: the can-do checklist for a level, and the shape of
// its exam. Split out of index.js so progress.js can total the checklist
// without importing the page that draws it.
//
// Every figure on both levels is read off the official ÖSD documents:
// A2 — Durchführungsbestimmungen (Okt. 2023) + Modellsatz
// A1 — ZA1 Durchführungsbestimmungen (Okt. 2023) + ZA1 Modellsatz (2024-04-10)
// Nothing here is inferred. If a number is not in those documents, it does not
// go in this file.

// Everything the exam expects, grouped the way the exam itself is structured.
// Sources: ÖSD Zertifikat A2 Durchführungsbestimmungen (Okt. 2023) and the
// official Modellsatz.
const MASTERY_A2 = [
  {
    group: "Grammatik — Kasus und Artikel",
    items: [
      ["nom-akk", "Nominativ und Akkusativ sicher unterscheiden (der → den, ein → einen)"],
      ["dativ", "Dativ bilden — auch im Plural (den Kindern)"],
      ["artikel", "Bestimmte, unbestimmte und Negativartikel deklinieren (kein-)"],
      ["possessiv", "Possessivartikel: mein, dein, sein, ihr … in allen drei Kasus"],
      ["personalpron", "Personalpronomen im Akkusativ und Dativ (mich/mir, ihn/ihm)"],
    ],
  },
  {
    group: "Grammatik — Präpositionen",
    items: [
      ["praep-akk", "Präpositionen mit Akkusativ: für, ohne, gegen, um, durch"],
      ["praep-dat", "Präpositionen mit Dativ: mit, nach, bei, seit, von, zu, aus"],
      ["wechsel", "Wechselpräpositionen: Akkusativ bei wohin?, Dativ bei wo?"],
      ["verb-praep", "Verben mit fester Präposition (warten auf, Angst haben vor)"],
      ["da-wo", "da(r)- und wo(r)- für Sachen, Präposition + Pronomen für Personen"],
    ],
  },
  {
    group: "Grammatik — Verben und Zeiten",
    items: [
      ["praesens", "Präsens inkl. Stammwechsel (fahren → du fährst, geben → du gibst)"],
      ["modal", "Alle sechs Modalverben im Präsens und Präteritum"],
      ["trennbar", "Trennbare und untrennbare Verben, Präfix am Satzende"],
      ["perfekt", "Perfekt mit haben und sein, Partizip II regelmäßig und unregelmäßig"],
      ["praeteritum", "Präteritum von sein, haben und den Modalverben"],
      ["reflexiv", "Reflexive Verben (sich freuen, sich interessieren)"],
      ["imperativ", "Imperativ: du-, ihr- und Sie-Form"],
      ["konjunktiv", "Höflichkeitsformen: möchte, könnte, hätte gern, würde"],
    ],
  },
  {
    group: "Grammatik — Satzbau",
    items: [
      ["v2", "Verb an Position 2, Subjekt rückt hinter das Verb"],
      ["klammer", "Satzklammer: zweiter Verbteil ans Satzende"],
      ["neben", "Nebensätze mit weil, dass, wenn, ob — Verb ganz am Ende"],
      ["fragen", "W-Fragen und Ja/Nein-Fragen"],
      ["tmp", "Reihenfolge im Mittelfeld: temporal – modal – lokal"],
      ["adjektiv", "Adjektivendungen nach der-, ein- und Nullartikel"],
      ["vergleich", "Komparativ und Superlativ, auch unregelmäßig (gut/besser/am besten)"],
    ],
  },
  {
    group: "Wortschatz — die Themenfelder",
    items: [
      ["w-person", "Person, Familie, Wohnen, Alltag"],
      ["w-versorgung", "Einkaufen, Essen und Trinken, Geld und Preise"],
      ["w-koerper", "Körper, Gesundheit, beim Arzt"],
      ["w-arbeit", "Arbeit, Beruf, Ausbildung, Sprachen lernen"],
      ["w-freizeit", "Freizeit, Reisen, Verkehr, Orientierung in der Stadt"],
      ["w-umfeld", "Wetter, Termine, Feste, Medien, Umwelt, Heimat"],
      ["w-at", "Österreichische Varianten: Semmel, Erdapfel, Paradeiser, Obers, Jänner"],
    ],
  },
  {
    group: "Prüfungsfertigkeiten",
    items: [
      ["f-lesen", "Lesen: Kurztexte Überschriften zuordnen, Detailfragen zu einem längeren Text"],
      ["f-hoeren", "Hören: Notizen zu einer Durchsage, Mehrfachauswahl, Interview mit fünf Personen"],
      ["f-schreiben", "Schreiben: Antwort-E-Mail von ca. 50 Wörtern, alle vier Leitpunkte abdecken"],
      ["f-anrede", "Anrede und Gruß richtig wählen (Liebe/Lieber …, Liebe Grüße)"],
      ["f-vorstellen", "Sprechen 1: sich zu fünf von sechs Themen frei vorstellen"],
      ["f-planen", "Sprechen 2: gemeinsam etwas planen, Vorschläge machen und reagieren"],
      ["f-redemittel", "Redemittel: Vorschlag, Zustimmung, Ablehnung, Nachfragen"],
    ],
  },
];

const EXAM_A2 = [
  ["Lesen", "2 Aufgaben · 10 Items", "30 Min", "25 Punkte", "min. 5"],
  ["Hören", "3 Aufgaben · 14 Items", "ca. 15 Min", "30 Punkte", "min. 6"],
  ["Schreiben", "1 Aufgabe", "30 Min", "15 Punkte", "—"],
  ["Sprechen", "2 Aufgaben", "ca. 10 Min", "20 Punkte", "min. 10"],
];

// A1 is a much smaller promise than A2: introduce yourself, handle a shop, a
// timetable and a form, and understand slow, clear speech about the immediate
// everyday. The checklist follows the same grouping so the two levels read the
// same way.
const MASTERY_A1 = [
  {
    group: "Grammatik — Artikel und Kasus",
    items: [
      ["a1-artikel", "der/die/das zu jedem neuen Nomen mitlernen"],
      ["a1-plural", "Die häufigsten Pluralformen (-e, -en, -er, -s, Umlaut)"],
      ["a1-nom-akk", "Nominativ und Akkusativ unterscheiden (der → den, ein → einen)"],
      ["a1-kein", "Verneinen mit kein- und mit nicht"],
      ["a1-possessiv", "mein, dein, sein, ihr, unser im Nominativ und Akkusativ"],
    ],
  },
  {
    group: "Grammatik — Verben",
    items: [
      ["a1-praesens", "Präsens der regelmäßigen Verben, alle sechs Personen"],
      ["a1-sein-haben", "sein und haben auswendig"],
      ["a1-stamm", "Die häufigsten Stammwechsel (fahren → du fährst, sprechen → du sprichst)"],
      ["a1-modal", "können, müssen, wollen, möchten, dürfen im Präsens"],
      ["a1-trennbar", "Trennbare Verben: Präfix ans Satzende (Ich stehe um 7 Uhr auf.)"],
      ["a1-imperativ", "Imperativ in der Sie-Form und der du-Form"],
      ["a1-perfekt", "Perfekt mit haben und sein bei den häufigsten Verben"],
    ],
  },
  {
    group: "Grammatik — Satzbau",
    items: [
      ["a1-v2", "Verb an Position 2, auch wenn der Satz nicht mit dem Subjekt beginnt"],
      ["a1-wfragen", "W-Fragen: wer, was, wo, wann, wie, warum, woher, wohin"],
      ["a1-janein", "Ja/Nein-Fragen mit dem Verb an Position 1"],
      ["a1-praep", "in, auf, bei, mit, zu, nach, aus in den häufigsten Wendungen"],
    ],
  },
  {
    group: "Wortschatz — die Themenfelder",
    items: [
      ["a1-w-person", "Sich vorstellen: Name, Alter, Land, Sprache, Beruf, Familie"],
      ["a1-w-zahlen", "Zahlen, Uhrzeit, Wochentage, Monate, Datum"],
      ["a1-w-wohnen", "Wohnung, Zimmer, Möbel"],
      ["a1-w-essen", "Essen, Trinken, Einkaufen, Preise"],
      ["a1-w-alltag", "Tagesablauf, Freizeit, Wetter"],
      ["a1-w-weg", "Verkehrsmittel, nach dem Weg fragen"],
      ["a1-w-koerper", "Körper, sich krank melden, beim Arzt"],
    ],
  },
  {
    group: "Prüfungsfertigkeiten",
    items: [
      ["a1-f-lesen1", "Lesen 1: fünf Situationen der passenden Anzeige zuordnen (eine Anzeige ist zu viel)"],
      ["a1-f-lesen2", "Lesen 2: drei Anzeigen, je zwei Fragen mit JA / NEIN"],
      ["a1-f-lesen3", "Lesen 3: fünf kurze Texte dem passenden Bild zuordnen"],
      ["a1-f-hoeren1", "Hören 1: fünf Texte den Fotos zuordnen — jeder Text nur ein Mal"],
      ["a1-f-hoeren2", "Hören 2: eine Nachricht hören und die wichtigsten Informationen notieren"],
      ["a1-f-hoeren3", "Hören 3: fünf befragte Personen, je eine Antwort ankreuzen"],
      ["a1-f-formular", "Schreiben 1: ein Formular für eine andere Person ausfüllen"],
      ["a1-f-mail", "Schreiben 2: eine Antwort-E-Mail schreiben — ohne Text gibt es null Punkte"],
      ["a1-f-vorstellen", "Sprechen 1: vier Themen wählen und sich dazu vorstellen"],
      ["a1-f-bild", "Sprechen 2: ein Bild beschreiben — wer, wo, was machen die Personen"],
      ["a1-f-rollenspiel", "Sprechen 3: die Situation des Bildes mitspielen"],
      ["a1-f-grenzen", "Wissen, dass unter 6 Punkten in Lesen oder Hören die ganze schriftliche Prüfung fällt"],
    ],
  },
];

// ZA1 Durchführungsbestimmungen 1.4, 4.1–4.3, 5, 6.1, 6.3 and the Modellsatz's
// Bestehensgrenzen page. Note that Lesen and Hören each carry a hard floor of
// 6 points: miss it and the WHOLE written module fails, however good the rest.
const EXAM_A1 = [
  ["Lesen", "3 Aufgaben · 16 Items", "25 Min", "30 Punkte", "min. 6"],
  ["Hören", "3 Aufgaben · 15 Items", "ca. 10 Min", "30 Punkte", "min. 6"],
  ["Schreiben", "2 Aufgaben", "20 Min", "15 Punkte", "—"],
  ["Sprechen", "3 Aufgaben", "ca. 10 Min", "25 Punkte", "—"],
];

// ZDÖ B1 is structurally unlike A1 and A2: Lesen and Sprachbausteine are ONE
// subtest sharing a clock and a score, and there is NO per-subtest minimum —
// only 60% of each module. Figures from the ZDÖ B1 Durchführungsbestimmungen
// (März 2019) §1.4, §4.1–4.3, §5, §6.1–6.3, task types from the Modellsatz.
const EXAM_B1 = [
  ["Lesen & Sprachbausteine", "5 Aufgaben · 40 Items", "90 Min", "105 Punkte", "—"],
  ["Hören", "3 Aufgaben · 20 Items", "ca. 30 Min", "75 Punkte", "—"],
  ["Schreiben", "1 Aufgabe · 2 Varianten", "40 Min", "45 Punkte", "—"],
  ["Sprechen", "3 Aufgaben", "ca. 15 Min", "75 Punkte", "—"],
];

// Written from the CEFR B1 descriptors and the Modellsatz's task types. The
// ZDÖ B1 documents specify no grammar syllabus and no word list, so the
// grammar and vocabulary rows are a selection, not a citation.
const MASTERY_B1 = [
  {
    group: "Grammatik — Satzbau",
    items: [
      ["b1-neben", "Nebensätze mit weil, dass, obwohl, damit, während, bevor, nachdem"],
      ["b1-relativ", "Relativsätze in allen Kasus, auch mit Präposition (der Mann, mit dem …)"],
      ["b1-infinitiv", "Infinitiv mit zu, und um…zu / ohne…zu / statt…zu"],
      ["b1-indirekt", "Indirekte Fragen: Ich weiß nicht, ob / wann / warum …"],
      ["b1-konnektoren", "Zweiteilige Konnektoren: entweder…oder, nicht nur…sondern auch, je…desto"],
      ["b1-tmp", "Mittelfeld: temporal – kausal – modal – lokal"],
    ],
  },
  {
    group: "Grammatik — Verben und Zeiten",
    items: [
      ["b1-praet", "Präteritum der häufigen Verben — die Vergangenheit, die man schreibt"],
      ["b1-plusq", "Plusquamperfekt und die Zeitenfolge mit nachdem"],
      ["b1-passiv", "Passiv im Präsens und Präteritum, auch mit Modalverb"],
      ["b1-konj2", "Konjunktiv II: Wünsche, höfliche Bitten, irreale Bedingungen"],
      ["b1-vermutung", "Vermutungen: Futur I und Modalverben subjektiv (Er dürfte krank sein.)"],
      ["b1-verbpraep", "Verben mit fester Präposition samt da(r)- und wo(r)-Verbindungen"],
    ],
  },
  {
    group: "Grammatik — Nomen und Adjektive",
    items: [
      ["b1-adj", "Adjektivendungen in allen Kasus, nach der-, ein- und Nullartikel"],
      ["b1-vergleich", "Komparativ und Superlativ, attributiv (der bessere Weg)"],
      ["b1-genitiv", "Genitiv: des Vaters — und wegen, während, trotz"],
      ["b1-partizip", "Partizip I und II als Adjektiv (der lachende Mann, das geöffnete Fenster)"],
      ["b1-wortbildung", "Wortbildung: Vorsilben und Nachsilben erkennen und nutzen"],
    ],
  },
  {
    group: "Wortschatz — die Themenfelder",
    items: [
      ["b1-w-meinung", "Meinung äußern, zustimmen, widersprechen, abwägen"],
      ["b1-w-arbeit", "Arbeit, Bewerbung, Ausbildung, Weiterbildung"],
      ["b1-w-amt", "Behörden, Ämter, Anträge, Fristen"],
      ["b1-w-gesund", "Gesundheit, Vorsorge, Versicherung"],
      ["b1-w-geld", "Konsum, Geld, Verträge, Kündigung"],
      ["b1-w-umwelt", "Umwelt, Klima, Nachhaltigkeit"],
      ["b1-w-medien", "Medien, Internet, Datenschutz"],
      ["b1-w-at", "Österreichisches Standarddeutsch und Landeskunde"],
    ],
  },
  {
    group: "Prüfungsfertigkeiten",
    items: [
      ["b1-f-lesen1", "Lesen 1: fünf Texten aus zehn Überschriften die passende zuordnen"],
      ["b1-f-lesen2", "Lesen 2: Zeitungsartikel, fünf Fragen mit je drei Antworten"],
      ["b1-f-lesen3", "Lesen 3: zehn Situationen und zwölf Anzeigen — 0 eintragen, wenn keine passt"],
      ["b1-f-sb1", "Sprachbausteine 1: Lückentext, pro Lücke A, B oder C"],
      ["b1-f-sb2", "Sprachbausteine 2: Brief aus einer Wortliste ergänzen, jedes Wort nur ein Mal"],
      ["b1-f-hoeren1", "Hören 1: fünf Stellungnahmen zu einem Thema zuordnen"],
      ["b1-f-hoeren2", "Hören 2: Radiogespräch, richtig/falsch"],
      ["b1-f-hoeren3", "Hören 3: fünf kurze Alltagstexte, richtig/falsch plus Auswahl"],
      ["b1-f-schreiben", "Schreiben: eine der zwei Varianten wählen und alle Leitpunkte abdecken"],
      ["b1-f-sprechen1", "Sprechen 1: Kontaktaufnahme — die Partnerin/den Partner kennenlernen"],
      ["b1-f-sprechen2", "Sprechen 2: Gespräch über ein Thema, eigene Meinung begründen"],
      ["b1-f-sprechen3", "Sprechen 3: gemeinsam eine Aufgabe lösen und sich einigen"],
      ["b1-f-60", "Wissen, dass jedes Modul 60 % braucht — aber es keine Einzel-Mindestpunktzahl gibt"],
    ],
  },
];

// Keyed by level id, so the Dom and the progress count both read the level on
// screen rather than a fixed table.
export const MASTERY_BY_LEVEL = { a1: MASTERY_A1, a2: MASTERY_A2, b1: MASTERY_B1 };
export const EXAM_BY_LEVEL = { a1: EXAM_A1, a2: EXAM_A2, b1: EXAM_B1 };

export function masteryFor(level) {
  return MASTERY_BY_LEVEL[level] || [];
}

export function masteryCount(level) {
  return masteryFor(level).reduce((n, g) => n + g.items.length, 0);
}

export function examFor(level) {
  return EXAM_BY_LEVEL[level] || [];
}
