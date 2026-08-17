// The town exists once per CEFR level. Each level is its own map, its own
// route, its own progress and its own localStorage namespace — switching level
// swaps all of them together, and nothing crosses over.
//
// Why fully separate rather than one big world: an A2 percentage that quietly
// includes A1 topics is a lie, and a single route through 70 steps is not a
// route. Keeping them apart means each map answers "where am I?" honestly, and
// B1 is a data folder rather than a refactor.

export const LEVELS = [
  {
    id: "a1",
    label: "A1",
    name: "Fundament",
    exam: "ÖSD Zertifikat A1",
    tagline: "Die Grundlagen, auf denen A2 steht",
    // Zone ids in this level are written with an "a1-" prefix. A2's are not:
    // its ids are baked into saves that already exist and cannot be renamed
    // without throwing away real work. See migrate() in storage.js.
    idPrefix: "a1-",
  },
  {
    id: "a2",
    label: "A2",
    name: "Prüfungsstadt",
    exam: "ÖSD Zertifikat A2",
    tagline: "Der Weg zur Prüfung",
    idPrefix: "",
  },
];

export const DEFAULT_LEVEL = "a2";

// Kept out of the "deutsch-" namespace on purpose: that whole namespace is now
// level-scoped, and the setting saying WHICH level is in play cannot itself
// live inside one. The colon keeps it clear of the migration's prefix match.
const LEVEL_KEY = "deutsch:level";

export function isLevel(id) {
  return LEVELS.some((l) => l.id === id);
}

export function levelInfo(id = getLevel()) {
  return LEVELS.find((l) => l.id === id) || LEVELS.find((l) => l.id === DEFAULT_LEVEL);
}

let current = null;

export function getLevel() {
  if (current) return current;
  let saved = null;
  try {
    saved = localStorage.getItem(LEVEL_KEY);
  } catch (e) {}
  current = isLevel(saved) ? saved : DEFAULT_LEVEL;
  return current;
}

// Setting the level does not itself rebuild anything — main.js listens and
// remounts the world. Returns true when the level actually changed.
export function setLevel(id) {
  if (!isLevel(id) || id === getLevel()) return false;
  current = id;
  try {
    localStorage.setItem(LEVEL_KEY, id);
  } catch (e) {}
  listeners.forEach((fn) => {
    try {
      fn(id);
    } catch (e) {
      console.error("level listener failed", e);
    }
  });
  return true;
}

const listeners = new Set();

export function onLevelChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
