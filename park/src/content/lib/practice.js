// The practice log: how long you actually reviewed, on which days.
//
// GLOBAL, not per level, and deliberately so. Fifteen minutes a day is one
// habit; splitting it into fifteen minutes of A2 and fifteen of A1 would mean
// switching towns cost you your streak, which is the opposite of what a streak
// is for. Everything else in the app is level-scoped; this is the exception.
//
// What counts is narrow on purpose. A number you can run up by leaving the tab
// open overnight is worse than no number, because you would still believe it.
// A second only counts when ALL of these hold:
//   · the tab is visible
//   · a review page is open — see REVIEW_MODULES; the Fernsehturm and the
//     Riesenrad are not review, and reading your own statistics must never be
//     the thing that earns the streak
//   · you have touched the keyboard, mouse or screen in the last 90 seconds
//
// Items reviewed are logged alongside the time, because time on its own says
// nothing about whether anything was answered.

import { makeStore } from "./storage.js";
import { todayISO, shiftDay } from "./day.js";

const store = makeStore("deutsch-uebung:");

const LOG_KEY = "log";
const GOAL_KEY = "goal";

export const DEFAULT_GOAL_MIN = 15;
export const GOAL_CHOICES = [5, 10, 15, 20, 30];

// How long the log is kept. Long enough for a year's streak to be real history
// rather than a number the app is asking you to take on faith.
const KEEP_DAYS = 400;

const TICK_MS = 5000;
const IDLE_MS = 90000;
// localStorage is synchronous; writing every tick would mean a disk write every
// five seconds for as long as the drill is open.
const SAVE_EVERY_MS = 20000;

// The modules that ARE review. Listed rather than derived from the category,
// because "info" holds both the verb drill and the export screen.
export const REVIEW_MODULES = new Set([
  "grammarFoundations",
  "grammarTopic",
  "vocabTheme",
  "mixedDeck",
  "tableHall",
  "konjugationDrill",
  "examSkill",
  "lesenExam",
]);

export function isReviewModule(module) {
  return REVIEW_MODULES.has(module);
}

// ------------------------------------------------------------------ the log

function normalizeDay(v) {
  if (!v || typeof v !== "object") return { s: 0, r: 0 };
  return {
    s: Number.isFinite(v.s) && v.s > 0 ? Math.round(v.s) : 0,
    r: Number.isFinite(v.r) && v.r > 0 ? Math.round(v.r) : 0,
  };
}

export function getLog() {
  const raw = store.load(LOG_KEY, {});
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  Object.keys(raw).forEach((k) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(k)) out[k] = normalizeDay(raw[k]);
  });
  return out;
}

function saveLog(log) {
  const keys = Object.keys(log).sort();
  const trimmed = {};
  keys.slice(Math.max(0, keys.length - KEEP_DAYS)).forEach((k) => {
    trimmed[k] = log[k];
  });
  store.save(LOG_KEY, trimmed);
}

export function getGoalMinutes() {
  const v = store.load(GOAL_KEY, DEFAULT_GOAL_MIN);
  return GOAL_CHOICES.indexOf(v) === -1 ? DEFAULT_GOAL_MIN : v;
}

export function setGoalMinutes(min) {
  if (GOAL_CHOICES.indexOf(min) === -1) return getGoalMinutes();
  store.save(GOAL_KEY, min);
  announce();
  return min;
}

export function todayPractice() {
  return getLog()[todayISO()] || { s: 0, r: 0 };
}

// ------------------------------------------------------------------ streaks

/**
 * A day counts when it reached the goal. The current streak is allowed to end
 * either today or yesterday: at nine in the morning you have not practised yet,
 * and a counter that reads 0 until you do would punish you for the time of day
 * rather than for missing a day.
 */
export function computeStreak(log = getLog(), goalMin = getGoalMinutes()) {
  const goalSec = goalMin * 60;
  const met = (iso) => (log[iso] ? log[iso].s : 0) >= goalSec;
  const today = todayISO();

  let cursor = met(today) ? today : shiftDay(today, -1);
  let current = 0;
  while (met(cursor)) {
    current++;
    cursor = shiftDay(cursor, -1);
  }

  // Best streak, over whatever the log still holds.
  const days = Object.keys(log).filter(met).sort();
  let best = 0;
  let run = 0;
  let prev = null;
  days.forEach((d) => {
    run = prev && shiftDay(prev, 1) === d ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  });

  const totals = Object.values(log).reduce(
    (a, v) => ({ s: a.s + v.s, r: a.r + v.r }),
    { s: 0, r: 0 }
  );

  return {
    current,
    best: Math.max(best, current),
    daysMet: days.length,
    daysAny: Object.values(log).filter((v) => v.s > 0).length,
    totalSeconds: totals.s,
    totalReviewed: totals.r,
  };
}

/** The last n days, oldest first, for the heatmap and the bars. */
export function recentDays(n, log = getLog()) {
  const out = [];
  let iso = todayISO();
  for (let i = 0; i < n; i++) {
    out.unshift({ date: iso, ...(log[iso] || { s: 0, r: 0 }) });
    iso = shiftDay(iso, -1);
  }
  return out;
}

// --------------------------------------------------------------- listeners

const listeners = new Set();

export function onPracticeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function announce() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error("practice listener failed", e);
    }
  });
}

// ---------------------------------------------------------------- tracking

let reviewing = false;
let lastInput = 0;
let pending = 0; // seconds counted but not yet written
let pendingDay = null;
let lastSave = 0;
let timer = null;
let started = false;

/** Called by the overlay when a page opens or closes. */
export function setReviewing(on) {
  const next = !!on;
  if (next === reviewing) return;
  // Leaving a page banks whatever it earned, so closing the tab straight after
  // does not lose the last twenty seconds of it.
  if (!next) flush();
  reviewing = next;
  if (next) lastInput = Date.now();
}

/** Called when something is actually answered — a card graded, a gap filled. */
export function noteReviewed(n = 1) {
  const log = getLog();
  const key = todayISO();
  const day = log[key] || { s: 0, r: 0 };
  day.r += n;
  log[key] = day;
  saveLog(log);
  announce();
}

function commit(seconds, dayKey) {
  if (seconds <= 0) return;
  const log = getLog();
  const day = log[dayKey] || { s: 0, r: 0 };
  day.s += seconds;
  log[dayKey] = day;
  saveLog(log);
}

function flush() {
  if (pending > 0 && pendingDay) {
    commit(pending, pendingDay);
    pending = 0;
    pendingDay = null;
    lastSave = Date.now();
    announce();
  }
}

function active() {
  if (!reviewing) return false;
  if (typeof document !== "undefined" && document.visibilityState === "hidden") return false;
  return Date.now() - lastInput < IDLE_MS;
}

function tick() {
  const now = Date.now();
  const key = todayISO();
  // A session running across midnight banks the old day before starting the
  // new one, rather than filing the whole evening under tomorrow.
  if (pendingDay && pendingDay !== key) flush();
  if (!active()) {
    // Bank what is owed rather than holding it while the reader is away.
    if (pending > 0) flush();
    return;
  }
  pendingDay = key;
  pending += TICK_MS / 1000;
  if (now - lastSave >= SAVE_EVERY_MS) flush();
  else announce(); // the meter still ticks between writes
}

/** Starts the clock. Safe to call more than once. */
export function startPracticeTracking() {
  if (started || typeof document === "undefined") return () => {};
  started = true;
  lastInput = Date.now();

  const bump = () => {
    lastInput = Date.now();
  };
  const opts = { passive: true, capture: true };
  const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"];
  events.forEach((e) => document.addEventListener(e, bump, opts));

  const onVisibility = () => {
    if (document.visibilityState === "hidden") flush();
    else lastInput = Date.now();
  };
  document.addEventListener("visibilitychange", onVisibility);
  // pagehide fires where unload is unreliable (mobile Safari especially).
  window.addEventListener("pagehide", flush);

  timer = setInterval(tick, TICK_MS);

  return function stop() {
    clearInterval(timer);
    events.forEach((e) => document.removeEventListener(e, bump, opts));
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", flush);
    flush();
    started = false;
  };
}

/** Today's seconds including the not-yet-written part, for a live meter. */
export function liveTodaySeconds() {
  const banked = todayPractice().s;
  return pendingDay === todayISO() ? banked + pending : banked;
}
