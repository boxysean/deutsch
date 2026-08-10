import { OUTLINE, faces } from "./palette.js";
import { drawBox } from "./sprites.js";

// Purely decorative national motifs. They aren't zones and can't be clicked —
// they're skyline flavour, the way a theme park drops a landmark in for fun.

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function outlineRect(ctx, x, y, w, h) {
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, w - 1, h - 1);
}

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

// ------------------------------------------------- Wiener Riesenrad (Vienna)

export function drawFerrisWheel(ctx, x, y, t) {
  const R = 40;
  const cy = y - R - 16;

  // A-frame supports
  ctx.strokeStyle = "#6b5240";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x - 2, cy);
  ctx.moveTo(x + 16, y);
  ctx.lineTo(x + 2, cy);
  ctx.stroke();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();
  px(ctx, x - 20, y - 2, 40, 4, "#8a7460");
  outlineRect(ctx, x - 20, y - 2, 40, 4);

  const spin = t * 0.28;

  // rim
  ctx.strokeStyle = "#d8d2c4";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  // spokes
  ctx.strokeStyle = "#bdb6a6";
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const a = spin + (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.lineTo(x + Math.cos(a) * R, cy + Math.sin(a) * R * 0.98);
    ctx.stroke();
  }

  // hub
  px(ctx, x - 3, cy - 3, 6, 6, "#8a7460");
  outlineRect(ctx, x - 3, cy - 3, 6, 6);

  // the red gondolas, hanging level as the wheel turns
  for (let i = 0; i < 12; i++) {
    const a = spin + (i / 12) * Math.PI * 2;
    const gx = x + Math.cos(a) * R;
    const gy = cy + Math.sin(a) * R * 0.98;
    px(ctx, gx - 3.5, gy, 7, 6, "#c8102e");
    outlineRect(ctx, gx - 3.5, gy, 7, 6);
    px(ctx, gx - 2.5, gy + 1.5, 5, 2, "#f7e6c8");
  }
}

// ------------------------------------------------ Berliner Fernsehturm

export function drawTvTower(ctx, x, y, t) {
  const shaftH = 104;
  const topY = y - shaftH;

  // base pavilion
  px(ctx, x - 13, y - 9, 26, 9, "#cfd4dc");
  outlineRect(ctx, x - 13, y - 9, 26, 9);

  // tapered shaft
  poly(
    ctx,
    [
      [x - 6, y - 8],
      [x + 6, y - 8],
      [x + 2.6, topY],
      [x - 2.6, topY],
    ],
    "#e3e7ee",
    OUTLINE
  );
  poly(
    ctx,
    [
      [x, y - 8],
      [x + 6, y - 8],
      [x + 2.6, topY],
      [x, topY],
    ],
    "#c3c9d4",
    null
  );

  // the sphere
  const sy = topY - 4;
  ctx.fillStyle = "#dfe4ec";
  ctx.beginPath();
  ctx.arc(x, sy, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();
  // shaded half + window band
  ctx.fillStyle = "#bfc6d2";
  ctx.beginPath();
  ctx.arc(x, sy, 13, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  px(ctx, x - 13, sy - 2, 26, 4, "#5a6478");
  ctx.strokeStyle = OUTLINE;
  ctx.beginPath();
  ctx.arc(x, sy, 13, 0, Math.PI * 2);
  ctx.stroke();

  // antenna, red and white banded
  const aTop = sy - 46;
  px(ctx, x - 1.5, aTop, 3, 46, "#e8e8e8");
  for (let i = 0; i < 46; i += 10) px(ctx, x - 1.5, aTop + i, 3, 5, "#d02b2b");
  outlineRect(ctx, x - 2, aTop, 4, 46);
  // beacon
  const blink = Math.sin(t * 3) > 0;
  px(ctx, x - 1.5, aTop - 3, 3, 3, blink ? "#ff5a4a" : "#8a3a34");
}

// ------------------------------------------------- Kölner Dom (Cologne)

function gothicSpire(ctx, x, baseY, h, w) {
  const stone = "#c9c2b2";
  const stoneDark = "#a9a292";

  // tower body
  poly(ctx, [[x - w, baseY], [x + w, baseY], [x + w * 0.72, baseY - h * 0.58], [x - w * 0.72, baseY - h * 0.58]], stone, OUTLINE);
  poly(ctx, [[x, baseY], [x + w, baseY], [x + w * 0.72, baseY - h * 0.58], [x, baseY - h * 0.58]], stoneDark, null);

  // openwork spire
  poly(ctx, [[x - w * 0.72, baseY - h * 0.58], [x + w * 0.72, baseY - h * 0.58], [x, baseY - h]], stone, OUTLINE);
  poly(ctx, [[x, baseY - h * 0.58], [x + w * 0.72, baseY - h * 0.58], [x, baseY - h]], stoneDark, null);

  // lattice courses that give the Dom its filigree silhouette
  ctx.strokeStyle = "#8c8474";
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const v = i / 5;
    const yy = baseY - h * 0.58 - (h * 0.42 * v);
    const half = w * 0.72 * (1 - v);
    ctx.beginPath();
    ctx.moveTo(x - half, yy);
    ctx.lineTo(x + half, yy);
    ctx.stroke();
  }
  // lancet windows on the tower body
  for (let i = 0; i < 3; i++) {
    const wy = baseY - h * 0.14 - i * h * 0.15;
    px(ctx, x - 2, wy - 6, 4, 6, "#6a6558");
  }

  // cross finial
  ctx.strokeStyle = "#8c8474";
  ctx.beginPath();
  ctx.moveTo(Math.round(x) + 0.5, baseY - h);
  ctx.lineTo(Math.round(x) + 0.5, baseY - h - 7);
  ctx.moveTo(Math.round(x) - 2.5, baseY - h - 4.5);
  ctx.lineTo(Math.round(x) + 3.5, baseY - h - 4.5);
  ctx.stroke();
}

export function drawCathedral(ctx, x, y) {
  const nave = faces(0.1, 0.08, 0.72);

  // nave with a steep roof
  drawBox(ctx, x - 14, y - 10, 1.6, 1.6, 3.2, nave);
  poly(
    ctx,
    [
      [x - 16, y - 42],
      [x + 6, y - 30],
      [x + 6, y - 24],
      [x - 16, y - 36],
    ],
    "#6b7264",
    OUTLINE
  );

  // rose window
  ctx.fillStyle = "#7f88a8";
  ctx.beginPath();
  ctx.arc(x - 5, y - 30, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();

  // the twin west spires
  gothicSpire(ctx, x - 22, y - 4, 96, 9);
  gothicSpire(ctx, x - 6, y + 4, 88, 8.5);
}
