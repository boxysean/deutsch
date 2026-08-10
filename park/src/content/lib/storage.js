// Shared answer-checking and persistence helpers for the exercise modules.

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
