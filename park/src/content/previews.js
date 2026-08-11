import { THEMES } from "./vocabTheme/data.js";
import { TOPICS } from "./grammarTopic/data.js";
import { SKILLS } from "./examSkill/data.js";
import { computeProgress, planStatus, getHistory } from "./lib/progress.js";
import { localKeys, summarize, buildExport } from "./lib/transfer.js";

// Lightweight progress summaries for the bottom sheet. These read localStorage
// directly rather than loading the (much larger) content modules, so opening a
// house stays instant.
function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}

function grammarFoundations() {
  const diagnose = read("deutsch-tag01:diagnose", {});
  const answered = Object.values(diagnose).filter((d) => d && String(d.v || "").trim()).length;
  const vocab = read("deutsch-tag01:vocab", {});
  const mastered = Object.values(vocab).filter((v) => v && v.mastered).length;
  const journal = read("deutsch-tag01:journal", []);

  return {
    summary:
      "Tag 1 des 10-Tage-Plans: eine 20-Satz-Diagnose, die Präsens- und Satzklammer-Regeln, 28 Vokabeln zum Tagesablauf, eine Schreibübung und das Fehlerjournal.",
    stats: [
      { label: "Diagnose beantwortet", value: `${answered} / 20` },
      { label: "Vokabeln sicher", value: `${mastered} / 28` },
      { label: "Fehlerjournal", value: `${Array.isArray(journal) ? journal.length : 0} Einträge` },
    ],
  };
}

function lesenExam() {
  const a1 = read("deutsch-lesen:aufgabe1", {});
  const a2 = read("deutsch-lesen:aufgabe2", {});
  const a1done = Object.values(a1).filter((v) => v).length;
  const a2done = Object.keys(a2).length;

  return {
    summary:
      "Echte Aufgaben aus dem offiziellen ÖSD-Modellsatz: fünf Kurztexte den Überschriften zuordnen, dann ein längerer Text mit fünf Multiple-Choice-Fragen. Auswertung nach der offiziellen Punktetabelle.",
    stats: [
      { label: "Aufgabe 1 zugeordnet", value: `${a1done} / 5` },
      { label: "Aufgabe 2 beantwortet", value: `${a2done} / 5` },
      { label: "Prüfungsteil", value: "30 Min · 25 Punkte" },
    ],
  };
}

function vocabTheme(zone) {
  const theme = THEMES[zone.id];
  const total = theme ? theme.words.length : 0;
  const state = read(`deutsch-vokabel:${zone.id}:state`, {});
  const mastered = Object.values(state).filter((v) => v && v.mastered).length;

  return {
    summary: theme ? theme.intro : "Vokabelliste zu diesem Thema.",
    stats: [
      { label: "Vokabeln sicher", value: `${mastered} / ${total}` },
      { label: "Karteikarten", value: `${total}` },
      { label: "Redemittel", value: `${theme ? theme.phrases.length : 0} Sätze` },
    ],
  };
}

function grammarTopic(zone) {
  const topic = TOPICS[zone.id];
  if (!topic) return { summary: "Grammatikthema.", stats: [] };

  const gaps = topic.exercises.filter((e) => e.kind !== "reveal");
  const gapTotal = gaps.reduce((n, e) => n + e.items.length, 0);
  const gapDone = gaps.reduce((n, e) => {
    const saved = read(`deutsch-grammatik:${zone.id}:${e.id}`, {});
    return n + Object.values(saved).filter((v) => String(v || "").trim()).length;
  }, 0);

  const reveals = topic.exercises.filter((e) => e.kind === "reveal");
  const revTotal = reveals.reduce((n, e) => n + e.items.length, 0);
  const revDone = reveals.reduce((n, e) => {
    const saved = read(`deutsch-grammatik:${zone.id}:${e.id}`, {});
    return n + Object.values(saved).filter((v) => v && v.mark).length;
  }, 0);

  return {
    summary: topic.intro,
    stats: [
      { label: "Lückenübungen", value: `${gapDone} / ${gapTotal}` },
      { label: "Selbst bewertet", value: `${revDone} / ${revTotal}` },
      { label: "Regeln & Tabellen", value: `${topic.rules.length} · ${topic.tables.length}` },
    ],
  };
}

function infoHub() {
  const state = read("deutsch-info:mastery", {});
  const done = Object.values(state).filter(Boolean).length;
  return {
    summary:
      "Der Dom am Hauptplatz: was dieses Spiel ist, wie die ÖSD-A2-Prüfung aufgebaut ist und eine Checkliste über alles, was du zum Bestehen können musst.",
    stats: [
      { label: "Abgehakt", value: `${done} / 39` },
      { label: "Prüfung", value: "90 Punkte" },
      { label: "Bestehen ab", value: "45 Punkte" },
    ],
  };
}

const EXAM_META = {
  hoeren: ["3 Aufgaben · 14 Items", "ca. 15 Min · 30 Punkte", "min. 6 zum Bestehen"],
  schreiben: ["1 Aufgabe", "30 Min · 15 Punkte", "ca. 50 Wörter"],
  sprechen: ["2 Aufgaben", "ca. 10 Min · 20 Punkte", "min. 10 zum Bestehen"],
};

function examSkill(zone) {
  const skill = SKILLS[zone.id];
  if (!skill) return { summary: zone.teaser || "Prüfungsteil.", stats: [] };

  const blocks = skill.training;
  const gaps = blocks.filter((b) => b.kind === "gap");
  const gapTotal = gaps.reduce((n, b) => n + b.items.length, 0);
  const gapDone = gaps.reduce((n, b) => {
    const saved = read(`deutsch-pruefung:${zone.id}:${b.id}`, {});
    return n + Object.values(saved).filter((v) => String(v || "").trim()).length;
  }, 0);

  const reveals = blocks.filter((b) => b.kind === "reveal");
  const revTotal = reveals.reduce((n, b) => n + b.items.length, 0);
  const revDone = reveals.reduce((n, b) => {
    const saved = read(`deutsch-pruefung:${zone.id}:${b.id}`, {});
    return n + Object.values(saved).filter((v) => v && v.mark).length;
  }, 0);

  const writings = blocks.filter((b) => b.kind === "writing");
  const written = writings.filter((b) => String(read(`deutsch-pruefung:${zone.id}:${b.id}`, "")).trim()).length;

  const meta = EXAM_META[zone.id] || [];
  const stats = [{ label: "Prüfungsteil", value: meta[1] || "" }];
  if (gapTotal) stats.push({ label: "Übungen gelöst", value: `${gapDone} / ${gapTotal}` });
  if (revTotal) stats.push({ label: "Selbst bewertet", value: `${revDone} / ${revTotal}` });
  if (writings.length) stats.push({ label: "Texte geschrieben", value: `${written} / ${writings.length}` });

  return { summary: skill.intro.replace(/<[^>]+>/g, ""), stats: stats.slice(0, 3) };
}

function progressTower() {
  const progress = computeProgress();
  const status = planStatus();
  const points = Object.keys(getHistory()).length;
  return {
    summary:
      "Der Fernsehturm hält den Überblick: dein Fortschritt als Kurve zwischen Kursbeginn und Prüfungstag, das Soll daneben, und wie viele Punkte pro Tag noch offen sind.",
    stats: [
      { label: "Erledigt", value: `${Math.round(status.percent * 100)} %` },
      { label: "Tage bis zur Prüfung", value: String(status.daysLeft) },
      { label: "Messpunkte", value: String(points) },
    ],
  };
}

function dataTransfer() {
  const s = summarize(buildExport());
  return {
    summary:
      "Alles liegt nur in diesem Browser. Hier packst du deinen Stand in eine Datei — Vokabeln, Übungen, Checkliste, Lernplan und Selbsteinschätzung — und lädst ihn auf einem anderen Gerät wieder ein.",
    stats: [
      { label: "Einträge gespeichert", value: String(localKeys().length) },
      { label: "Messpunkte", value: String(s.measurements) },
      { label: "Bewertete Themen", value: String(s.ratedTopics) },
    ],
  };
}

const BUILDERS = {
  grammarFoundations,
  lesenExam,
  vocabTheme,
  grammarTopic,
  infoHub,
  examSkill,
  progressTower,
  dataTransfer,
};

export function getPreview(zone) {
  const builder = BUILDERS[zone.module];
  if (!builder) {
    return { summary: zone.teaser || "Inhalt für dieses Gebiet folgt.", stats: [] };
  }
  return builder(zone);
}
