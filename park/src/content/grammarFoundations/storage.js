export const LS_PREFIX = "deutsch-tag01:";

export function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordsPresent(input, required) {
  const norm = normalize(input);
  const tokens = norm.split(" ");
  return required.every((r) => {
    const rn = normalize(r);
    return tokens.indexOf(rn) !== -1 || norm.indexOf(rn) !== -1;
  });
}

export function save(key, val) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
  } catch (e) {}
}

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(LS_PREFIX + key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}
