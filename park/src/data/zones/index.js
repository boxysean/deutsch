import { getLevel } from "../levels.js";
import { ZONES_A1 } from "./a1.js";
import { ZONES_A2 } from "./a2.js";

// One registry per level. Everything downstream — the world builder, the map
// labels, the route, the progress totals — asks for the CURRENT level's zones
// rather than importing a fixed array, because switching level has to swap all
// of them at once.
export const ZONES_BY_LEVEL = {
  a1: ZONES_A1,
  a2: ZONES_A2,
};

export function zonesFor(level) {
  return ZONES_BY_LEVEL[level] || [];
}

export function getZones() {
  return zonesFor(getLevel());
}

// Within the current level. Ids are unique across levels too, so a stray lookup
// cannot silently land in the wrong town.
export function getZone(id) {
  return getZones().find((z) => z.id === id);
}

// Which level a zone id belongs to, for routing a URL that names a zone without
// naming its level.
export function levelOfZone(id) {
  return Object.keys(ZONES_BY_LEVEL).find((lvl) =>
    ZONES_BY_LEVEL[lvl].some((z) => z.id === id)
  );
}
