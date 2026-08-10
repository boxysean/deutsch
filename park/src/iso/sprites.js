import { TILE_W, TILE_H, LEVEL_H } from "./projection.js";
import { OUTLINE } from "./palette.js";

// All shapes are flat 2D polygons laid out on the isometric grid. `ox, oy` is
// the screen position of the tile origin (tx, ty) that the shape sits on.

function poly(ctx, pts, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// A ground tile: one diamond.
export function drawTile(ctx, ox, oy, color, stroke) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  poly(
    ctx,
    [
      [ox, oy],
      [ox + hw, oy + hh],
      [ox, oy + TILE_H],
      [ox - hw, oy + hh],
    ],
    color,
    stroke
  );
}

// A box of w x d tiles and h levels, sitting on the tile at (ox, oy).
export function drawBox(ctx, ox, oy, w, d, h, f, outline = true) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const lift = h * LEVEL_H;

  // Base corners: N (back), E (right), S (front), W (left)
  const n = [ox, oy];
  const e = [ox + w * hw, oy + w * hh];
  const s = [ox + w * hw - d * hw, oy + w * hh + d * hh];
  const wst = [ox - d * hw, oy + d * hh];

  const nt = [n[0], n[1] - lift];
  const et = [e[0], e[1] - lift];
  const st = [s[0], s[1] - lift];
  const wt = [wst[0], wst[1] - lift];

  const line = outline ? OUTLINE : null;
  // left (SW-facing) then right (SE-facing), then the top cap
  poly(ctx, [wt, st, s, wst], f.left, line);
  poly(ctx, [st, et, e, s], f.right, line);
  poly(ctx, [nt, et, st, wt], f.top, line);

  return { nt, et, st, wt, lift };
}

// Four-sided pyramid / hip roof sitting on top of a box.
export function drawPyramid(ctx, ox, oy, w, d, baseH, roofH, f, outline = true) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const lift = baseH * LEVEL_H;

  const n = [ox, oy - lift];
  const e = [ox + w * hw, oy + w * hh - lift];
  const s = [ox + w * hw - d * hw, oy + w * hh + d * hh - lift];
  const wst = [ox - d * hw, oy + d * hh - lift];
  const apex = [(n[0] + s[0]) / 2, (n[1] + s[1]) / 2 - roofH * LEVEL_H];

  const line = outline ? OUTLINE : null;
  poly(ctx, [wst, s, apex], f.left, line);
  poly(ctx, [s, e, apex], f.right, line);
  return apex;
}

// Gable roof: a ridge running along the x axis of the footprint.
export function drawGable(ctx, ox, oy, w, d, baseH, roofH, f, outline = true) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const lift = baseH * LEVEL_H;
  const rise = roofH * LEVEL_H;

  const n = [ox, oy - lift];
  const e = [ox + w * hw, oy + w * hh - lift];
  const s = [ox + w * hw - d * hw, oy + w * hh + d * hh - lift];
  const wst = [ox - d * hw, oy + d * hh - lift];

  // ridge above the midpoints of the two d-facing edges
  const r1 = [(n[0] + wst[0]) / 2, (n[1] + wst[1]) / 2 - rise];
  const r2 = [(e[0] + s[0]) / 2, (e[1] + s[1]) / 2 - rise];

  const line = outline ? OUTLINE : null;
  poly(ctx, [wst, s, r2, r1], f.left, line); // long slope facing us
  poly(ctx, [s, e, r2], f.right, line); // gable end
  poly(ctx, [r1, r2, e, n], f.top, line); // far slope
}

// A little faceted blob, used for tree canopies and bushes.
export function drawBlob(ctx, cx, cy, rx, ry, f, outline = true) {
  const line = outline ? OUTLINE : null;
  poly(
    ctx,
    [
      [cx, cy - ry],
      [cx + rx, cy - ry * 0.3],
      [cx + rx * 0.7, cy + ry * 0.6],
      [cx, cy + ry],
      [cx - rx * 0.7, cy + ry * 0.6],
      [cx - rx, cy - ry * 0.3],
    ],
    f.right,
    line
  );
  // highlight cap
  poly(
    ctx,
    [
      [cx, cy - ry],
      [cx + rx, cy - ry * 0.3],
      [cx, cy + ry * 0.05],
      [cx - rx, cy - ry * 0.3],
    ],
    f.top,
    null
  );
}

export function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
