import { townBounds, zonePlacement, framingPoints } from "./townPlan.js";

export { zonePlacement, townBounds, isTownArea } from "./townPlan.js";

export function worldBounds() {
  return townBounds();
}

// Isometric projection constants for a camera at 45° yaw / 35.26° pitch.
const SX = Math.SQRT1_2; // horizontal screen units per (x - z)
const SY = 0.4082; // vertical screen units per (x + z)

// Fit the whole town in view regardless of window shape, and aim the camera at
// the town's true visual centre rather than the world origin.
export function computeFraming(aspect, margin = 14) {
  // Frame the actual built points, not the bounding box: the box's corners fall
  // in empty grass and would push the town off-centre.
  const points = framingPoints();

  let minSx = Infinity, maxSx = -Infinity, minSy = Infinity, maxSy = -Infinity;
  points.forEach((c) => {
    const sx = (c.x - c.z) * SX;
    const sy = (c.x + c.z) * SY;
    minSx = Math.min(minSx, sx);
    maxSx = Math.max(maxSx, sx);
    minSy = Math.min(minSy, sy);
    maxSy = Math.max(maxSy, sy);
  });

  // Buildings and their labels rise above their ground point, i.e. toward the
  // top of the screen, which is the low-sy end.
  minSy -= 11;

  const midSx = (minSx + maxSx) / 2;
  const midSy = (minSy + maxSy) / 2;
  const xMinusZ = midSx / SX;
  const xPlusZ = midSy / SY;

  const target = {
    x: (xPlusZ + xMinusZ) / 2,
    z: (xPlusZ - xMinusZ) / 2,
  };

  const halfWidth = (maxSx - minSx) / 2 + margin;
  const halfHeight = (maxSy - minSy) / 2 + margin;
  const d = Math.max(halfHeight, halfWidth / Math.max(aspect, 0.35));

  return { target, d };
}

export function zoneWorldPosition(zone) {
  return zonePlacement(zone.id);
}
