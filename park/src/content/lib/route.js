// The suggested route through the town.
//
// One fixed sequence, held on the zones themselves as `order`. Grammar carries
// the real dependencies — the Satzklammer before Nebensätze, both cases before
// Wechselpräpositionen, every case before Adjektivendungen — while vocabulary
// has none, so its themes are weighted by how certain the exam is to ask for
// them. The four exam parts are dropped in early rather than saved for the end,
// because format practice is what stops the last month being a panic.
//
// The route never reorders itself. "Next" is simply the first step you have not
// yet called your own, so you always know where you are.

import { ZONES } from "../../data/zones.js";
import { getConfidenceFor, MAX_CONFIDENCE } from "./progress.js";

// Rating a topic 2 (mittel) or 3 (hoch) counts as taking it off the route.
// Anything lower — including an explicit 0 — leaves it standing.
export const SETTLED_AT = 2;

export function route() {
  return ZONES.filter((z) => typeof z.order === "number").sort((a, b) => a.order - b.order);
}

export function routeLength() {
  return route().length;
}

export function isSettled(zoneId) {
  const v = getConfidenceFor(zoneId);
  return v !== null && v >= SETTLED_AT;
}

// The first step still outstanding, or null once every topic is settled.
export function nextZone() {
  return route().find((z) => !isSettled(z.id)) || null;
}

export function routeProgress() {
  const all = route();
  const settled = all.filter((z) => isSettled(z.id));
  return {
    total: all.length,
    settled: settled.length,
    next: nextZone(),
    maxConfidence: MAX_CONFIDENCE,
  };
}

// Rough pacing for the plan window, used by the Dom's route tab. Steps are
// spread evenly rather than pretending some are heavier than others.
export function routeWeeks(range, weekCount) {
  const all = route();
  const perWeek = Math.ceil(all.length / weekCount);
  const weeks = [];
  for (let i = 0; i < all.length; i += perWeek) {
    weeks.push(all.slice(i, i + perWeek));
  }
  return weeks;
}
