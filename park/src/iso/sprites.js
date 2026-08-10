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

  // Faces are returned so wall decoration can be laid onto them:
  // each is a base edge plus the vertical lift.
  return {
    nt, et, st, wt, lift,
    n, e, s, w: wst,
    leftFace: { a: wst, b: s, lift },
    rightFace: { a: s, b: e, lift },
  };
}

// Map (u, v) on a wall face to screen space. u runs along the base edge,
// v runs up the wall (0 = ground, 1 = eaves).
export function facePoint(face, u, v) {
  return [
    face.a[0] + u * (face.b[0] - face.a[0]),
    face.a[1] + u * (face.b[1] - face.a[1]) - v * face.lift,
  ];
}

function faceLine(ctx, face, u0, v0, u1, v1, color, width = 1) {
  const p0 = facePoint(face, u0, v0);
  const p1 = facePoint(face, u1, v1);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  ctx.lineTo(p1[0], p1[1]);
  ctx.stroke();
}

// Fachwerk: the dark exposed timber framing of a half-timbered house.
export function drawFachwerk(ctx, face, beam = "#5a3a24") {
  const vTop = 0.92;
  const vMid = 0.5;
  faceLine(ctx, face, 0.04, vMid, 0.96, vMid, beam, 1.5);
  faceLine(ctx, face, 0.04, vTop, 0.96, vTop, beam, 1.5);
  [0.04, 0.35, 0.65, 0.96].forEach((u) => faceLine(ctx, face, u, vMid, u, vTop, beam, 1.2));
  // St Andrew's crosses in the two outer bays
  faceLine(ctx, face, 0.04, vMid, 0.35, vTop, beam, 1);
  faceLine(ctx, face, 0.35, vMid, 0.04, vTop, beam, 1);
  faceLine(ctx, face, 0.65, vMid, 0.96, vTop, beam, 1);
  faceLine(ctx, face, 0.96, vMid, 0.65, vTop, beam, 1);
}

// Lüftlmalerei: the painted fresco panel with an ornate border found on
// Bavarian and Tyrolean facades.
export function drawPaintedPanel(ctx, face, tint = "#c9d8ef") {
  const pts = [
    facePoint(face, 0.18, 0.44),
    facePoint(face, 0.82, 0.44),
    facePoint(face, 0.82, 0.86),
    facePoint(face, 0.18, 0.86),
  ];
  poly(ctx, pts, tint, "#9a7b4a");
  const inner = [
    facePoint(face, 0.28, 0.53),
    facePoint(face, 0.72, 0.53),
    facePoint(face, 0.72, 0.77),
    facePoint(face, 0.28, 0.77),
  ];
  poly(ctx, inner, null, "#9a7b4a");
}

// A window with green shutters and a geranium box beneath it.
export function drawAlpineWindow(ctx, face, u, v, opts = {}) {
  const w = 0.075;
  const h = 0.2;
  const pane = [
    facePoint(face, u - w, v),
    facePoint(face, u + w, v),
    facePoint(face, u + w, v + h),
    facePoint(face, u - w, v + h),
  ];
  poly(ctx, pane, "#f7f3e6", OUTLINE);
  // glazing bar
  const g0 = facePoint(face, u, v);
  const g1 = facePoint(face, u, v + h);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(g0[0], g0[1]);
  ctx.lineTo(g1[0], g1[1]);
  ctx.stroke();

  if (opts.shutters !== false) {
    const sh = 0.055;
    poly(
      ctx,
      [
        facePoint(face, u - w - sh, v),
        facePoint(face, u - w, v),
        facePoint(face, u - w, v + h),
        facePoint(face, u - w - sh, v + h),
      ],
      "#2f5d3a",
      OUTLINE
    );
    poly(
      ctx,
      [
        facePoint(face, u + w, v),
        facePoint(face, u + w + sh, v),
        facePoint(face, u + w + sh, v + h),
        facePoint(face, u + w, v + h),
      ],
      "#2f5d3a",
      OUTLINE
    );
  }

  if (opts.flowers) {
    poly(
      ctx,
      [
        facePoint(face, u - w - 0.02, v - 0.055),
        facePoint(face, u + w + 0.02, v - 0.055),
        facePoint(face, u + w + 0.02, v),
        facePoint(face, u - w - 0.02, v),
      ],
      "#8a5a2b",
      OUTLINE
    );
    const f0 = facePoint(face, u - w * 0.6, v - 0.005);
    const f1 = facePoint(face, u + w * 0.6, v - 0.005);
    ctx.fillStyle = "#d63a3a";
    ctx.fillRect(Math.round(f0[0]), Math.round(f0[1]) - 2, Math.max(2, Math.round(f1[0] - f0[0])), 2);
  }
}

export function drawDoor(ctx, face, u = 0.5) {
  const w = 0.1;
  poly(
    ctx,
    [
      facePoint(face, u - w, 0.02),
      facePoint(face, u + w, 0.02),
      facePoint(face, u + w, 0.42),
      facePoint(face, u - w, 0.42),
    ],
    "#7a4a24",
    OUTLINE
  );
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
