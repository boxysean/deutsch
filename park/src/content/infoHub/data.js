// What the Dom hands you: the can-do checklist for a level, and the shape of
// its exam. Split out of index.js so progress.js can total the checklist
// without importing the page that draws it.
//
// A2's figures come off the ÖSD Durchführungsbestimmungen (Okt. 2023) and the
// official Modellsatz. A1 has NO checked source in this project: its checklist
// is written from the CEFR A1 descriptors, and its exam table carries no
// figures at all. Do not add any without a primary source in hand.

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
      ["a1-f-lesen", "Lesen: kurze Notizen, Anzeigen und Schilder verstehen"],
      ["a1-f-hoeren", "Hören: Durchsagen und kurze Gespräche in langsamem, klarem Deutsch"],
      ["a1-f-formular", "Schreiben: ein einfaches Formular ausfüllen"],
      ["a1-f-mitteilung", "Schreiben: eine kurze Mitteilung, die alle vorgegebenen Punkte abdeckt"],
      ["a1-f-vorstellen", "Sprechen: sich anhand von Stichwörtern vorstellen"],
      ["a1-f-fragen", "Sprechen: zu einem Stichwort fragen und antworten"],
      ["a1-f-bitten", "Sprechen: eine Bitte formulieren und darauf reagieren"],
    ],
  },
];

// Deliberately without figures. The number of parts, the durations, the points
// and the minimum scores are all unchecked for A1 in this project — unlike A2,
// where every figure comes off the Durchführungsbestimmungen and the Modellsatz.
// An earlier version of this table carried invented durations while the note
// beneath it claimed the numbers were blank; the note was the honest half.
const EXAM_A1 = [
  ["Lesen", "Kurze Alltagstexte", "—", "—", "—"],
  ["Hören", "Langsam und deutlich Gesprochenes", "—", "—", "—"],
  ["Schreiben", "Einfache Angaben und Mitteilungen", "—", "—", "—"],
  ["Sprechen", "Sich vorstellen, fragen, bitten", "—", "—", "—"],
];

// Keyed by level id, so the Dom and the progress count both read the level on
// screen rather than a fixed table.
export const MASTERY_BY_LEVEL = { a1: MASTERY_A1, a2: MASTERY_A2 };
export const EXAM_BY_LEVEL = { a1: EXAM_A1, a2: EXAM_A2 };

export function masteryFor(level) {
  return MASTERY_BY_LEVEL[level] || [];
}

export function masteryCount(level) {
  return masteryFor(level).reduce((n, g) => n + g.items.length, 0);
}

export function examFor(level) {
  return EXAM_BY_LEVEL[level] || [];
}
