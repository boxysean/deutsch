// Moving a save between browsers.
//
// Everything this app stores lives in localStorage under the "deutsch-" prefix,
// so a backup is simply every key with that prefix. Keeping the rule to a
// namespace rather than a hand-maintained list means a new module's data is
// included the day it ships.

import { LEVELS, DEFAULT_LEVEL } from "../../data/levels.js";

export const NAMESPACE = "deutsch-";
export const FORMAT = 1;
export const APP = "deutsche-welt";

// Which area belongs to which part of a town, for the human-readable summary.
// A backup carries EVERY level — one file is your whole account, not one map —
// so the labels name the level too. Anything unrecognised still travels; it
// just lands in "Sonstiges".
const AREA_NAMES = [
  ["vokabel:", "Wortschatz"],
  ["konjugation:", "Verbformen"],
  ["grammatik:", "Grammatik"],
  ["tag01:", "Tag 1"],
  ["lesen:", "Lesen"],
  ["pruefung:", "Prüfungsteile"],
  ["info:", "Checkliste"],
  ["plan:", "Lernplan"],
];

const AREAS = LEVELS.flatMap((lvl) =>
  AREA_NAMES.map(([area, label]) => [`${NAMESPACE}${lvl.id}-${area}`, `${lvl.label} · ${label}`])
);

// The plan keys are per level, so the summary's headline figures are read from
// whichever level has a history at all — usually the one being backed up.
function planKey(data, suffix) {
  const hit = LEVELS.map((l) => `${NAMESPACE}${l.id}-plan:${suffix}`).find((k) =>
    isPlainObject(data[k])
  );
  return hit ? data[hit] : null;
}

const LEVELLED = new RegExp(`^${NAMESPACE}(${LEVELS.map((l) => l.id).join("|")})-`);

// A file exported before levels existed holds keys like "deutsch-vokabel:…".
// Those are A2 work, because A2 was all there was, and they have to be lifted
// into the A2 namespace ON THE WAY IN — the browser's own one-time migration
// has already run and will not run again for them.
//
// Without this the import is silently useless: the keys pass validation (they
// do start with "deutsch-"), the app says "zusammengeführt", and the data lands
// where nothing reads it. Applied at parse time so the preview counts the same
// entries the apply will write.
export function upgradeLegacyKeys(data, rawKeys, target = DEFAULT_LEVEL) {
  const raw = new Set(Array.isArray(rawKeys) ? rawKeys : []);
  const out = {};
  const nextRaw = [];
  let upgraded = 0;

  const put = (key, from) => {
    if (key in out) return; // a levelled key already claimed this slot
    out[key] = data[from];
    if (raw.has(from)) nextRaw.push(key);
  };

  // Levelled keys first, so a stray legacy duplicate can never overwrite one.
  const all = Object.keys(data);
  all.filter((k) => LEVELLED.test(k)).forEach((k) => put(k, k));
  all
    .filter((k) => !LEVELLED.test(k) && k.startsWith(NAMESPACE))
    .forEach((k) => {
      const next = NAMESPACE + target + "-" + k.slice(NAMESPACE.length);
      const before = next in out;
      put(next, k);
      if (!before) upgraded++;
    });

  return { data: out, rawKeys: nextRaw, upgraded };
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// Values are written by JSON.stringify, so they parse back. Anything that does
// not parse is carried through as a raw string rather than dropped.
function decode(raw) {
  try {
    return { value: JSON.parse(raw), raw: false };
  } catch (e) {
    return { value: raw, raw: true };
  }
}

function encode(value, wasRaw) {
  return wasRaw && typeof value === "string" ? value : JSON.stringify(value);
}

export function localKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(NAMESPACE)) keys.push(k);
  }
  return keys.sort();
}

// ------------------------------------------------------------------- export

export function buildExport() {
  const data = {};
  const rawKeys = [];
  localKeys().forEach((k) => {
    const dec = decode(localStorage.getItem(k));
    data[k] = dec.value;
    if (dec.raw) rawKeys.push(k);
  });

  return {
    app: APP,
    format: FORMAT,
    exportedAt: new Date().toISOString(),
    keyCount: Object.keys(data).length,
    // Only present when something could not be parsed, so the importer knows to
    // write those back verbatim instead of re-stringifying them.
    rawKeys: rawKeys.length ? rawKeys : undefined,
    data,
  };
}

export function serialize(envelope) {
  return JSON.stringify(envelope, null, 2);
}

export function suggestedFilename(envelope) {
  const day = (envelope.exportedAt || new Date().toISOString()).slice(0, 10);
  return `deutsche-welt-${day}.json`;
}

// ------------------------------------------------------------------- import

export function parseImport(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: "Das ist keine gültige JSON-Datei." };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, error: "Die Datei enthält kein Sicherungsobjekt." };
  }
  if (parsed.app && parsed.app !== APP) {
    return { ok: false, error: `Diese Sicherung stammt aus einer anderen App (${String(parsed.app)}).` };
  }
  if (!isPlainObject(parsed.data)) {
    return { ok: false, error: "In der Datei fehlt das Feld „data“." };
  }
  const foreign = Object.keys(parsed.data).filter((k) => !k.startsWith(NAMESPACE));
  if (foreign.length) {
    return {
      ok: false,
      error: `Die Datei enthält ${foreign.length} fremde Schlüssel und wird nicht importiert.`,
    };
  }
  if (typeof parsed.format === "number" && parsed.format > FORMAT) {
    return {
      ok: false,
      error: `Die Datei nutzt Format ${parsed.format}; diese Version kennt nur ${FORMAT}. Aktualisiere zuerst die App.`,
    };
  }
  const lifted = upgradeLegacyKeys(parsed.data, parsed.rawKeys);
  const envelope = Object.assign({}, parsed, {
    data: lifted.data,
    rawKeys: lifted.rawKeys.length ? lifted.rawKeys : undefined,
  });
  // Reported so the preview can say what happened rather than quietly
  // rewriting the file the reader thinks they are importing.
  return { ok: true, envelope, upgraded: lifted.upgraded };
}

// A short, honest description of what a file holds, so nothing is applied blind.
export function summarize(envelope) {
  const data = envelope.data || {};
  const keys = Object.keys(data);

  const areas = AREAS.map(([prefix, label]) => ({
    label,
    count: keys.filter((k) => k.startsWith(prefix)).length,
  })).filter((a) => a.count);
  const known = AREAS.map(([p]) => p);
  const other = keys.filter((k) => !known.some((p) => k.startsWith(p))).length;
  if (other) areas.push({ label: "Sonstiges", count: other });

  const history = planKey(data, "history") || {};
  const dates = Object.keys(history).sort();
  const lastDate = dates[dates.length - 1] || null;
  const lastEntry = lastDate ? history[lastDate] : null;
  const lastPoints = typeof lastEntry === "number" ? lastEntry : lastEntry && typeof lastEntry.p === "number" ? lastEntry.p : null;
  const lastConf = lastEntry && typeof lastEntry.c === "number" ? lastEntry.c : null;

  const confidence = planKey(data, "confidence") || {};
  const range = planKey(data, "range");

  return {
    keyCount: keys.length,
    exportedAt: envelope.exportedAt || null,
    areas,
    measurements: dates.length,
    lastDate,
    lastPoints,
    lastConf,
    ratedTopics: Object.keys(confidence).length,
    range,
  };
}

// -------------------------------------------------------------------- apply

function clearNamespace() {
  const keys = localKeys();
  keys.forEach((k) => localStorage.removeItem(k));
  return keys.length;
}

// Merge takes the union of measurements and the higher of each pair.
function mergeHistory(local, incoming) {
  const out = Object.assign({}, local);
  Object.keys(incoming).forEach((date) => {
    const a = normalizeHistoryEntry(out[date]);
    const b = normalizeHistoryEntry(incoming[date]);
    out[date] = {
      p: Math.max(a.p, b.p),
      c: a.c === null ? b.c : b.c === null ? a.c : Math.max(a.c, b.c),
    };
  });
  return out;
}

function normalizeHistoryEntry(v) {
  if (typeof v === "number") return { p: v, c: null };
  if (isPlainObject(v)) {
    return {
      p: typeof v.p === "number" ? v.p : 0,
      c: typeof v.c === "number" ? v.c : null,
    };
  }
  return { p: 0, c: null };
}

function mergeHigher(local, incoming) {
  const out = Object.assign({}, local);
  Object.keys(incoming).forEach((k) => {
    const a = typeof out[k] === "number" ? out[k] : null;
    const b = typeof incoming[k] === "number" ? incoming[k] : null;
    if (b === null) return;
    out[k] = a === null ? b : Math.max(a, b);
  });
  return out;
}

function isEmptyValue(v) {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (isPlainObject(v)) return Object.keys(v).length === 0;
  return false;
}

// Everything else is filled gap by gap: an imported entry lands only where this
// browser has nothing there. Merging never overwrites work you can see.
function mergeGeneric(local, incoming) {
  if (isEmptyValue(local)) return incoming;
  if (isPlainObject(local) && isPlainObject(incoming)) {
    const out = Object.assign({}, local);
    Object.keys(incoming).forEach((k) => {
      if (isEmptyValue(out[k])) out[k] = incoming[k];
    });
    return out;
  }
  return local;
}

/**
 * @param mode "replace" — drop every local key first, then write the file.
 *             "merge"   — union of measurements, higher of each rating, and
 *                         gap-filling everywhere else.
 */
export function applyImport(envelope, mode) {
  const data = envelope.data || {};
  const rawKeys = Array.isArray(envelope.rawKeys) ? envelope.rawKeys : [];
  const removed = mode === "replace" ? clearNamespace() : 0;

  let written = 0;
  let merged = 0;

  Object.keys(data).forEach((key) => {
    if (!key.startsWith(NAMESPACE)) return; // parseImport already rejects these
    const wasRaw = rawKeys.indexOf(key) !== -1;
    const incoming = data[key];

    if (mode === "replace") {
      localStorage.setItem(key, encode(incoming, wasRaw));
      written++;
      return;
    }

    const localRaw = localStorage.getItem(key);
    if (localRaw === null) {
      localStorage.setItem(key, encode(incoming, wasRaw));
      written++;
      return;
    }

    const local = decode(localRaw).value;
    let next;
    if (/-plan:history$/.test(key) && isPlainObject(local) && isPlainObject(incoming)) {
      next = mergeHistory(local, incoming);
    } else if (/-plan:confidence$/.test(key) && isPlainObject(local) && isPlainObject(incoming)) {
      next = mergeHigher(local, incoming);
    } else {
      next = mergeGeneric(local, incoming);
    }
    localStorage.setItem(key, encode(next, wasRaw));
    merged++;
  });

  return { removed, written, merged };
}
