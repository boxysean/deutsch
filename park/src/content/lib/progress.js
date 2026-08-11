// Progress accounting for the Fernsehturm screen.
//
// Every module already stores its own answers in localStorage; this file is the
// only place that knows how to read all of them and turn them into one number.
// It also keeps a dated history, so the tower can plot a curve rather than a
// single figure.

import { ZONES } from "../../data/zones.js";
import { THEMES } from "../vocabTheme/data.js";
import { TOPICS } from "../grammarTopic/data.js";
import { SKILLS } from "../examSkill/data.js";
import { makeStore } from "./storage.js";

const plan = makeStore("deutsch-plan:");

// The user's own plan: start of September to the end of December.
export const DEFAULT_RANGE = { start: "2026-09-01", end: "2026-12-31" };

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}

const filled = (v) => String(v == null ? "" : v).trim().length > 0;

// ------------------------------------------------------------------ counting

// Grammatik: gap answers that have been typed, plus reveal exercises the
// learner marked as correct. Day 1 lives here too — it is a grammar zone.
function grammarCounts() {
  let done = 0;
  let total = 0;

  Object.entries(TOPICS).forEach(([zoneId, topic]) => {
    topic.exercises.forEach((ex) => {
      total += ex.items.length;
      const saved = read(`deutsch-grammatik:${zoneId}:${ex.id}`, {});
      if (ex.kind === "reveal") {
        done += Object.values(saved).filter((v) => v && v.mark === "ok").length;
      } else {
        done += Object.values(saved).filter(filled).length;
      }
    });
  });

  const diagnose = read("deutsch-tag01:diagnose", {});
  total += 20;
  done += Object.values(diagnose).filter((d) => d && filled(d.v)).length;

  const tagVocab = read("deutsch-tag01:vocab", {});
  total += 28;
  done += Object.values(tagVocab).filter((v) => v && v.mastered).length;

  return { done: Math.min(done, total), total };
}

// Wortschatz: one point per flashcard marked "Ich kann's".
function vocabCounts() {
  let done = 0;
  let total = 0;
  Object.entries(THEMES).forEach(([zoneId, theme]) => {
    total += theme.words.length;
    const state = read(`deutsch-vokabel:${zoneId}:state`, {});
    done += Object.values(state).filter((v) => v && v.mastered).length;
  });
  return { done: Math.min(done, total), total };
}

// Prüfungsteile: the Lesen model paper, the three skill trainers, and the
// mastery checklist in the Dom — everything that is about the exam itself.
function examCounts() {
  let done = 0;
  let total = 0;

  total += 10; // Lesen: two tasks of five items
  const a1 = read("deutsch-lesen:aufgabe1", {});
  const a2 = read("deutsch-lesen:aufgabe2", {});
  done += Object.values(a1).filter(Boolean).length + Object.keys(a2).length;

  Object.entries(SKILLS).forEach(([zoneId, skill]) => {
    skill.training.forEach((block) => {
      const saved = read(`deutsch-pruefung:${zoneId}:${block.id}`, block.kind === "writing" ? "" : {});
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

  const domZone = ZONES.find((z) => z.id === "dom");
  if (domZone) {
    const mastery = read("deutsch-info:mastery", {});
    total += 39;
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

// ------------------------------------------------------------------- history

export function todayISO(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getHistory() {
  const raw = plan.load("history", {});
  return raw && typeof raw === "object" ? raw : {};
}

// One entry per day, overwritten as the day goes on, so the series is a daily
// close rather than a log of every keystroke.
export function recordToday() {
  const { done } = computeProgress();
  const history = getHistory();
  const key = todayISO();
  if (history[key] === done) return history;
  history[key] = done;
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
    ? history[beforeStart[beforeStart.length - 1]]
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
