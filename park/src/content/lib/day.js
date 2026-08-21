// The local calendar day as an ISO string.
//
// Its own file because both the history in progress.js and the practice log
// need it, and progress.js already imports the flashcard deck — which imports
// the practice log. Keeping the date helper here means practice.js does not
// have to import progress.js back, and the module graph stays acyclic.
//
// Local time, deliberately: a learner practising at 23:30 in Vienna has
// practised today, not tomorrow, and toISOString() would file it under the
// wrong day for anyone east of Greenwich.
export function todayISO(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** The same day shifted by whole days, staying on the local calendar. */
export function shiftDay(iso, delta) {
  const [y, m, d] = iso.split("-").map(Number);
  return todayISO(new Date(y, m - 1, d + delta));
}
