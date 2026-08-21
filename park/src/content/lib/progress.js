// Progress accounting for the Fernsehturm screen.
//
// Every module already stores its own answers in localStorage; this file is the
// only place that knows how to read all of them and turn them into one number.
// It also keeps a dated history, so the tower can plot a curve rather than a
// single figure.

import { getZones } from "../../data/zones/index.js";
import { themesFor, topicsFor, skillsFor } from "../registry.js";
import { makeLevelStore, readLevel } from "./storage.js";
import { masteryCount } from "../infoHub/data.js";
import { getLevel } from "../../data/levels.js";
import { wordIsSicher, boxOf, SICHER_AT } from "../vocabTheme/deck.js";
import { setsFor } from "../konjugationDrill/data.js";

// Every number on this page belongs to ONE level. The stores and the content
// slices below resolve against whichever level is on screen, so an A2 total
// never quietly includes A1 words — a percentage that mixes them would be
// worse than no percentage at all.
const plan = makeLevelStore("plan:");

// The user's own plan: start of September to the end of December.
export const DEFAULT_RANGE = { start: "2026-09-01", end: "2026-12-31" };

// Level-scoped: "grammatik:akkusativ:l1" resolves to
// "deutsch-a2-grammatik:akkusativ:l1" for as long as A2 is the level on screen.
const read = readLevel;

const filled = (v) => String(v == null ? "" : v).trim().length > 0;

// ------------------------------------------------------------------ counting

// Grammatik: gap answers that have been typed, plus reveal exercises the
// learner marked as correct. Day 1 lives here too — it is a grammar zone.
function grammarCounts() {
  let done = 0;
  let total = 0;

  Object.entries(topicsFor()).forEach(([zoneId, topic]) => {
    topic.exercises.forEach((ex) => {
      total += ex.items.length;
      const saved = read(`grammatik:${zoneId}:${ex.id}`, {});
      if (ex.kind === "reveal") {
        done += Object.values(saved).filter((v) => v && v.mark === "ok").length;
      } else {
        done += Object.values(saved).filter(filled).length;
      }
    });
  });

  // Tag 1 is a single bespoke zone that only A2 has. Counted only where it
  // exists — otherwise every other level carries 48 points of denominator for
  // work it cannot offer, which is exactly how B1 opened at "0 von 86" with no
  // content in it at all.
  if (getZones().some((z) => z.module === "grammarFoundations")) {
    const diagnose = read("tag01:diagnose", {});
    total += 20;
    done += Object.values(diagnose).filter((d) => d && filled(d.v)).length;

    const tagVocab = read("tag01:vocab", {});
    total += 28;
    done += Object.values(tagVocab).filter((v) => v && v.mastered).length;
  }

  // The verb drill at the castle. Counted here rather than as a fourth group:
  // conjugation IS grammar, and the Fernsehturm's three bars are the three
  // things the exam tests. Gated on the zone, like Tag 1 above.
  if (getZones().some((z) => z.module === "konjugationDrill")) {
    const state = read("konjugation:state", {});
    setsFor(getLevel()).forEach((set) => {
      total += set.cards.length;
      // The produce direction only. Recognising "fuhr" as a past tense is worth
      // having and much easier; counting both would pay twice for the easy half.
      done += set.cards.filter((c) => boxOf(state[c.key], "de-en") >= SICHER_AT).length;
    });
  }

  return { done: Math.min(done, total), total };
}

// Wortschatz: one point per word, earned only when both directions are secure —
// knowing what a word means is not the same as being able to produce it with
// its article.
function vocabCounts() {
  let done = 0;
  let total = 0;
  Object.entries(themesFor()).forEach(([zoneId, theme]) => {
    total += theme.words.length;
    const state = read(`vokabel:${zoneId}:state`, {});
    done += Object.values(state).filter(wordIsSicher).length;
  });
  return { done: Math.min(done, total), total };
}

// Prüfungsteile: the Lesen model paper, the three skill trainers, and the
// mastery checklist in the Dom — everything that is about the exam itself.
function examCounts() {
  let done = 0;
  let total = 0;

  // Only counted where the level actually has the Lesen model paper. A level
  // whose exam trainers are still stubs must not be given a denominator for
  // work it cannot offer.
  if (getZones().some((z) => z.module === "lesenExam")) {
    total += 10; // Lesen: two tasks of five items
    const a1 = read("lesen:aufgabe1", {});
    const a2 = read("lesen:aufgabe2", {});
    done += Object.values(a1).filter(Boolean).length + Object.keys(a2).length;
  }

  Object.entries(skillsFor()).forEach(([zoneId, skill]) => {
    skill.training.forEach((block) => {
      const saved = read(`pruefung:${zoneId}:${block.id}`, block.kind === "writing" ? "" : {});
      if (block.kind === "writing") {
        total += 1;
        if (filled(saved)) done += 1;
      } else if (block.kind === "reveal") {
        total += block.items.length;
        done += Object.values(saved).filter((v) => v && v.mark === "ok").length;
      } else {
        total += block.items.length;
        done += Object.values(saved).filter(filled).length;
      }
    });
  });

  const domZone = getZones().find((z) => z.archetype === "dom");
  if (domZone) {
    const mastery = read("info:mastery", {});
    total += masteryCount(getLevel());
    done += Object.values(mastery).filter(Boolean).length;
  }

  return { done: Math.min(done, total), total };
}

// Ordered red → blue → green: validated as an adjacent-safe categorical trio
// (the map's own red/green/blue order collapses under deuteranopia).
export function computeProgress() {
  const groups = [
    Object.assign({ id: "grammar", label: "Grammatik", color: "#d92b3a" }, grammarCounts()),
    Object.assign({ id: "examskill", label: "Prüfungsteile", color: "#2f6fd0" }, examCounts()),
    Object.assign({ id: "vocab", label: "Wortschatz", color: "#1f9e52" }, vocabCounts()),
  ];
  const done = groups.reduce((n, g) => n + g.done, 0);
  const total = groups.reduce((n, g) => n + g.total, 0);
  return { groups, done, total };
}

// -------------------------------------------------------------- self-rating

// A manual gut-check per topic, alongside the mechanical point count. Points
// say what you have worked through; this says whether you would back yourself
// on it in the exam.
export const CONFIDENCE_LEVELS = [
  { value: 0, label: "keine", hint: "Noch gar nicht sicher" },
  { value: 1, label: "gering", hint: "Erkenne ich, kann es aber nicht anwenden" },
  { value: 2, label: "mittel", hint: "Meistens richtig, mit Nachdenken" },
  { value: 3, label: "hoch", hint: "Sitzt — auch unter Prüfungsdruck" },
];
export const MAX_CONFIDENCE = 3;

// Only the learning zones get rated; the Dom and the Fernsehturm are not topics.
export function ratableZones() {
  return getZones().filter((z) => z.category !== "info");
}

export function getConfidence() {
  const raw = plan.load("confidence", {});
  return raw && typeof raw === "object" ? raw : {};
}

export function getConfidenceFor(zoneId) {
  const v = getConfidence()[zoneId];
  return Number.isInteger(v) && v >= 0 && v <= MAX_CONFIDENCE ? v : null;
}

// The same rating can be set from the map label's drawer, from a topic page or
// from the Fernsehturm's list, and all three views show it. Rather than thread
// callbacks between them, a rating change is announced once here.
const confidenceListeners = new Set();

export function onConfidenceChange(fn) {
  confidenceListeners.add(fn);
  return () => confidenceListeners.delete(fn);
}

// For changes that bypass setConfidenceFor entirely — importing a save rewrites
// localStorage wholesale, and the map would otherwise keep showing the old
// route until a reload.
export function notifyConfidenceChanged() {
  confidenceListeners.forEach((fn) => {
    try {
      fn(null, null);
    } catch (e) {
      console.error("confidence listener failed", e);
    }
  });
}

export function setConfidenceFor(zoneId, value) {
  const all = getConfidence();
  if (value === null) delete all[zoneId];
  else all[zoneId] = Math.min(MAX_CONFIDENCE, Math.max(0, Math.round(value)));
  plan.save("confidence", all);
  confidenceListeners.forEach((fn) => {
    try {
      fn(zoneId, value);
    } catch (e) {
      console.error("confidence listener failed", e);
    }
  });
  return all;
}

// A note per topic — what you were thinking last time you worked on it.
export function getTopicNotes() {
  const raw = plan.load("topicNotes", {});
  return raw && typeof raw === "object" ? raw : {};
}

export function getTopicNote(zoneId) {
  return getTopicNotes()[zoneId] || "";
}

// The drawer and the topic page can both be holding a note field for the same
// zone, so a change in one has to reach the other — otherwise the stale one
// commits on blur and overwrites the newer text.
const noteListeners = new Set();

export function onTopicNoteChange(fn) {
  noteListeners.add(fn);
  return () => noteListeners.delete(fn);
}

export function setTopicNote(zoneId, text) {
  const all = getTopicNotes();
  const trimmed = String(text || "").trim();
  if (all[zoneId] === trimmed || (!trimmed && !(zoneId in all))) return all;
  if (trimmed) all[zoneId] = trimmed;
  else delete all[zoneId];
  plan.save("topicNotes", all);
  noteListeners.forEach((fn) => {
    try {
      fn(zoneId, trimmed);
    } catch (e) {
      console.error("topic-note listener failed", e);
    }
  });
  return all;
}

export function computeConfidence() {
  const saved = getConfidence();
  const zones = ratableZones().map((z) => ({
    id: z.id,
    name: z.name,
    category: z.category,
    value: Number.isInteger(saved[z.id]) ? saved[z.id] : null,
  }));
  const rated = zones.filter((z) => z.value !== null);

  // Grammar and vocabulary are different kinds of confidence — one is a rule
  // you either hold or don't, the other is a pile that grows — so they are
  // reported apart as well as together.
  const byCategory = {};
  ["grammar", "vocab", "examskill"].forEach((cat) => {
    const list = zones.filter((z) => z.category === cat);
    const done = list.reduce((n, z) => n + (z.value || 0), 0);
    byCategory[cat] = {
      done,
      total: list.length * MAX_CONFIDENCE,
      rated: list.filter((z) => z.value !== null).length,
      zoneCount: list.length,
    };
  });

  return {
    zones,
    byCategory,
    rated: rated.length,
    zoneCount: zones.length,
    done: rated.reduce((n, z) => n + z.value, 0),
    total: zones.length * MAX_CONFIDENCE,
  };
}

// ------------------------------------------------------------------- history

export function todayISO(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Each entry is { p: points, c: confidence }. Entries written before the
// self-rating existed are plain numbers, so they are read as points-only and
// their confidence stays absent rather than being invented as zero.
function normalizeEntry(v) {
  const num = (x) => (typeof x === "number" ? x : null);
  if (typeof v === "number") return { p: v, c: null, cg: null, cv: null, ce: null };
  if (v && typeof v === "object") {
    return {
      p: typeof v.p === "number" ? v.p : 0,
      c: num(v.c),
      // Split by district. Absent on entries written before the split, which is
      // why those series simply start later rather than being back-filled.
      cg: num(v.cg),
      cv: num(v.cv),
      ce: num(v.ce),
    };
  }
  return { p: 0, c: null, cg: null, cv: null, ce: null };
}

export function getHistory() {
  const raw = plan.load("history", {});
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  Object.keys(raw).forEach((k) => {
    out[k] = normalizeEntry(raw[k]);
  });
  return out;
}

// One entry per day, overwritten as the day goes on, so the series is a daily
// close rather than a log of every keystroke.
export function recordToday() {
  const points = computeProgress().done;
  const confidence = computeConfidence();
  const history = getHistory();
  const key = todayISO();
  const cat = confidence.byCategory;
  const next = {
    p: points,
    c: confidence.rated ? confidence.done : null,
    cg: cat.grammar.rated ? cat.grammar.done : null,
    cv: cat.vocab.rated ? cat.vocab.done : null,
    ce: cat.examskill.rated ? cat.examskill.done : null,
  };
  const cur = history[key];
  if (cur && ["p", "c", "cg", "cv", "ce"].every((k) => cur[k] === next[k])) return history;
  history[key] = next;
  plan.save("history", history);
  return history;
}

export function clearHistory() {
  plan.save("history", {});
}

// ---------------------------------------------------------------- plan range

export function getRange() {
  const r = plan.load("range", null);
  if (r && r.start && r.end && r.start < r.end) return r;
  return Object.assign({}, DEFAULT_RANGE);
}

export function setRange(start, end) {
  if (!start || !end || start >= end) return getRange();
  const r = { start, end };
  plan.save("range", r);
  return r;
}

// ------------------------------------------------------------------ plan maths

const DAY = 86400000;

export function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a, b) {
  return Math.round((parseISO(b) - parseISO(a)) / DAY);
}

// Everything the tower needs to draw itself: where the plan sits today, what
// the target says you should have, and what the daily quota is from here.
export function planStatus(range = getRange(), progress = computeProgress()) {
  const today = todayISO();
  const span = Math.max(1, daysBetween(range.start, range.end));
  const elapsed = daysBetween(range.start, today);

  const history = getHistory();
  const beforeStart = Object.keys(history).filter((d) => d < range.start).sort();
  // Whatever was already done when the plan starts is not part of the climb.
  const baseline = beforeStart.length
    ? history[beforeStart[beforeStart.length - 1]].p
    : today < range.start
      ? progress.done
      : 0;

  const climb = Math.max(0, progress.total - baseline);
  const ratio = Math.min(1, Math.max(0, elapsed / span));
  const target = Math.round(baseline + climb * ratio);

  const daysLeft = Math.max(0, daysBetween(today, range.end));
  const remaining = Math.max(0, progress.total - progress.done);

  return {
    today,
    span,
    elapsed,
    daysLeft,
    baseline,
    target,
    remaining,
    started: today >= range.start,
    finished: today > range.end,
    delta: progress.done - target,
    perDay: daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining,
    percent: progress.total ? progress.done / progress.total : 0,
  };
}
