// Shared answer-checking and persistence helpers for the exercise modules.

import { LEVELS, getLevel, DEFAULT_LEVEL } from "../../data/levels.js";

// Lenient comparison: learners shouldn't be marked wrong for punctuation,
// casing or writing "ss" for "ß".
export function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
    .trim();
}

// True when every required token appears in the answer, so a learner can write
// a whole sentence around the bit being tested.
export function wordsPresent(input, required) {
  const norm = normalize(input);
  const tokens = norm.split(" ");
  return required.every((r) => {
    const rn = normalize(r);
    return tokens.indexOf(rn) !== -1 || norm.indexOf(rn) !== -1;
  });
}

// A namespaced localStorage pair. Everything is per-browser and offline; there
// is no account and nothing leaves the machine.
export function makeStore(prefix) {
  return {
    save(key, val) {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(val));
      } catch (e) {}
    },
    load(key, fallback) {
      try {
        const v = localStorage.getItem(prefix + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
  };
}

// ------------------------------------------------------------------- levels

export const NS = "deutsch-";

// The prefix for one area of one level, e.g. "deutsch-a2-vokabel:".
export function levelPrefix(area, level = getLevel()) {
  return `${NS}${level}-${area}`;
}

// The same pair, but resolving the level at every call rather than at import.
// Modules hold their store in a module-level const, so a store that baked the
// level in at import time would keep writing to whichever level happened to be
// active when the module was first loaded.
export function makeLevelStore(area) {
  return {
    save(key, val) {
      try {
        localStorage.setItem(levelPrefix(area) + key, JSON.stringify(val));
      } catch (e) {}
    },
    load(key, fallback) {
      try {
        const v = localStorage.getItem(levelPrefix(area) + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
  };
}

// Read one level-scoped key directly. progress.js counts across many modules'
// keys and never writes them, so it reads rather than holding a store each.
export function readLevel(key, fallback, level = getLevel()) {
  try {
    const v = localStorage.getItem(NS + level + "-" + key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}

// Every save written before levels existed is A2 work, because A2 is all there
// was. Left alone it would simply vanish from the app — the keys would still be
// in localStorage, but nothing would look at them again. So on first run each
// un-levelled "deutsch-" key is moved under "deutsch-a2-".
//
// Idempotent, and safe to run against a half-migrated store: a key that already
// carries a known level prefix is skipped, and an existing destination is never
// overwritten.
const MIGRATED_KEY = "deutsch:migrated-to-levels";

export function migrateToLevels(target = DEFAULT_LEVEL) {
  let done = null;
  try {
    done = localStorage.getItem(MIGRATED_KEY);
  } catch (e) {
    return { moved: 0, skipped: 0 }; // no localStorage at all; nothing to move
  }
  if (done) return { moved: 0, skipped: 0, alreadyDone: true };

  const levelled = new RegExp(`^${NS}(${LEVELS.map((l) => l.id).join("|")})-`);
  const stale = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || key.indexOf(NS) !== 0 || levelled.test(key)) continue;
    stale.push(key);
  }

  let moved = 0;
  let skipped = 0;
  stale.forEach((key) => {
    const next = NS + target + "-" + key.slice(NS.length);
    try {
      if (localStorage.getItem(next) !== null) {
        skipped++;
        return;
      }
      localStorage.setItem(next, localStorage.getItem(key));
      localStorage.removeItem(key);
      moved++;
    } catch (e) {
      skipped++;
    }
  });

  try {
    localStorage.setItem(MIGRATED_KEY, new Date().toISOString());
  } catch (e) {}
  return { moved, skipped };
}
