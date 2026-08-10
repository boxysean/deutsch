import { CATEGORIES, TILE, PLAZA } from "../data/categories.js";
import { ZONES } from "../data/zones.js";

export function zoneWorldPosition(zone) {
  const cat = CATEGORIES[zone.category];
  return {
    x: cat.anchor.x + zone.col * TILE,
    z: cat.anchor.z + zone.row * TILE,
  };
}

export function districtBounds(categoryKey) {
  const cat = CATEGORIES[categoryKey];
  const pad = TILE * 0.5;
  return {
    minX: cat.anchor.x - pad,
    maxX: cat.anchor.x + (cat.cols - 1) * TILE + pad,
    minZ: cat.anchor.z - pad,
    maxZ: cat.anchor.z + (cat.rows - 1) * TILE + pad,
  };
}

export function districtCenter(categoryKey) {
  const b = districtBounds(categoryKey);
  return { x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 };
}

export function worldBounds() {
  let minX = -PLAZA.radius, maxX = PLAZA.radius, minZ = -PLAZA.radius, maxZ = PLAZA.radius;
  Object.keys(CATEGORIES).forEach((key) => {
    const b = districtBounds(key);
    minX = Math.min(minX, b.minX);
    maxX = Math.max(maxX, b.maxX);
    minZ = Math.min(minZ, b.minZ);
    maxZ = Math.max(maxZ, b.maxZ);
  });
  return { minX, maxX, minZ, maxZ };
}

export function allZonePositions() {
  return ZONES.map((zone) => ({ zone, pos: zoneWorldPosition(zone) }));
}
