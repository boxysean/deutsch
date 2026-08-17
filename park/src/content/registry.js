import { getZones, zonesFor } from "../data/zones/index.js";
import { THEMES } from "./vocabTheme/data.js";
import { TOPICS } from "./grammarTopic/data.js";
import { SKILLS } from "./examSkill/data.js";

// Content is stored in one map per kind, keyed by zone id, across all levels.
// That works because zone ids are unique across levels — A1's carry an "a1-"
// prefix — so there is nothing to disambiguate and no per-level copy of the
// lookup to keep in step.
//
// What IS per level is which entries count. A2's progress must not include A1's
// words, so everything that totals things up asks here for the slice belonging
// to the level on screen.

function sliceFor(map, zones) {
  const ids = new Set(zones.map((z) => z.id));
  const out = {};
  Object.keys(map).forEach((id) => {
    if (ids.has(id)) out[id] = map[id];
  });
  return out;
}

export function themesFor(level) {
  return sliceFor(THEMES, level ? zonesFor(level) : getZones());
}

export function topicsFor(level) {
  return sliceFor(TOPICS, level ? zonesFor(level) : getZones());
}

export function skillsFor(level) {
  return sliceFor(SKILLS, level ? zonesFor(level) : getZones());
}
