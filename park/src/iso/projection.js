// Classic 2:1 isometric tile projection — the RollerCoaster Tycoon geometry.
// Everything is drawn in 2D at these logical pixel sizes and then upscaled by an
// integer zoom factor, so the result is genuinely pixelated rather than a
// smooth 3D render pretending to be isometric.
export const TILE_W = 32;
export const TILE_H = 16;
export const LEVEL_H = 10; // vertical pixels per height level

export function isoToScreen(tx, ty, levels = 0) {
  return {
    x: (tx - ty) * (TILE_W / 2),
    y: (tx + ty) * (TILE_H / 2) - levels * LEVEL_H,
  };
}

// Inverse projection onto the ground plane (levels = 0).
export function screenToIso(sx, sy) {
  const a = sx / (TILE_W / 2);
  const b = sy / (TILE_H / 2);
  return { tx: (a + b) / 2, ty: (b - a) / 2 };
}

// Painter's algorithm: things further from the camera (smaller tx+ty) are drawn
// first, so nearer things overlap them.
export function depthOf(tx, ty) {
  return tx + ty;
}
