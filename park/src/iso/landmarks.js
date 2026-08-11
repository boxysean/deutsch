import { OUTLINE, faces } from "./palette.js";
import { drawBox, drawBlob } from "./sprites.js";

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

// ------------------------------------------------- Stephansdom (Vienna)

// The Steffl: a very tall slender south tower, and the steep roof with its
// glazed chevron tiles — the two things that make it unmistakable.
export function drawStephansdom(ctx, x, y) {
  const stone = "#ddd5c2";
  const stoneDark = "#bbb2a0";
  const stoneShade = "#a49b8a";
  const roofDark = "#3f4a52";

  // ---- nave -------------------------------------------------------------
  const naveW = 34;
  const naveH = 30;
  const naveY = y - 8;
  poly(ctx, [[x - naveW / 2, naveY], [x + naveW / 2, naveY], [x + naveW / 2, naveY - naveH], [x - naveW / 2, naveY - naveH]], stone, OUTLINE);
  poly(ctx, [[x + 6, naveY], [x + naveW / 2, naveY], [x + naveW / 2, naveY - naveH], [x + 6, naveY - naveH]], stoneDark, null);

  // buttresses
  for (const bx of [-14, -5, 4, 13]) {
    px(ctx, x + bx, naveY - naveH + 4, 3, naveH - 4, stoneShade);
  }
  // lancet windows
  for (const wx of [-10, -1, 8]) {
    px(ctx, x + wx, naveY - naveH + 10, 4, 12, "#5d6b84");
    outlineRect(ctx, x + wx, naveY - naveH + 10, 4, 12);
  }

  // ---- the famous chevron-tiled roof ------------------------------------
  const roofTop = naveY - naveH - 26;
  poly(ctx, [[x - naveW / 2 - 2, naveY - naveH], [x + naveW / 2 + 2, naveY - naveH], [x + 4, roofTop], [x - 4, roofTop]], roofDark, OUTLINE);

  // glazed zigzag tiles in the Habsburg colours
  const bands = ["#c9a227", "#2f6d4f", "#f2ece0", "#8d2b2b"];
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const t0 = r / rows;
    const t1 = (r + 1) / rows;
    const yTop = naveY - naveH + (roofTop - (naveY - naveH)) * t0;
    const yBot = naveY - naveH + (roofTop - (naveY - naveH)) * t1;
    const halfTop = (naveW / 2 + 2) * (1 - t0) + 4 * t0;
    const halfBot = (naveW / 2 + 2) * (1 - t1) + 4 * t1;
    const cols = 6;
    for (let c = 0; c < cols; c++) {
      const color = bands[(r + c) % bands.length];
      const u0 = c / cols;
      const u1 = (c + 1) / cols;
      poly(
        ctx,
        [
          [x - halfTop + halfTop * 2 * u0, yTop],
          [x - halfTop + halfTop * 2 * u1, yTop],
          [x - halfBot + halfBot * 2 * u1, yBot],
          [x - halfBot + halfBot * 2 * u0, yBot],
        ],
        color,
        null
      );
    }
  }
  poly(ctx, [[x - naveW / 2 - 2, naveY - naveH], [x + naveW / 2 + 2, naveY - naveH], [x + 4, roofTop], [x - 4, roofTop]], null, OUTLINE);

  // ---- Südturm: the Steffl ----------------------------------------------
  const tx = x - 24;
  const tBase = y - 2;
  const tiers = [
    { h: 30, w: 15 },
    { h: 26, w: 12 },
    { h: 22, w: 9 },
  ];
  let ty = tBase;
  tiers.forEach((tier, i) => {
    poly(ctx, [[tx - tier.w / 2, ty], [tx + tier.w / 2, ty], [tx + tier.w / 2, ty - tier.h], [tx - tier.w / 2, ty - tier.h]], stone, OUTLINE);
    poly(ctx, [[tx + 1, ty], [tx + tier.w / 2, ty], [tx + tier.w / 2, ty - tier.h], [tx + 1, ty - tier.h]], stoneDark, null);
    // tall gothic openings
    px(ctx, tx - 2, ty - tier.h + 6, 3, tier.h - 12, "#5d6b84");
    if (i === 1) {
      // clock face
      px(ctx, tx - 3, ty - tier.h + 5, 6, 6, "#f4efe2");
      outlineRect(ctx, tx - 3, ty - tier.h + 5, 6, 6);
    }
    ty -= tier.h;
  });

  // the long tapering spire
  poly(ctx, [[tx - 5, ty], [tx + 5, ty], [tx, ty - 40]], stone, OUTLINE);
  poly(ctx, [[tx, ty], [tx + 5, ty], [tx, ty - 40]], stoneDark, null);
  // crockets up the spire
  ctx.strokeStyle = stoneShade;
  ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    const v = i / 6;
    const half = 5 * (1 - v);
    const sy = ty - 40 * v;
    ctx.beginPath();
    ctx.moveTo(tx - half, sy);
    ctx.lineTo(tx + half, sy);
    ctx.stroke();
  }
  // gilt double-eagle finial
  ctx.strokeStyle = "#e0b83a";
  ctx.beginPath();
  ctx.moveTo(Math.round(tx) + 0.5, ty - 40);
  ctx.lineTo(Math.round(tx) + 0.5, ty - 48);
  ctx.moveTo(Math.round(tx) - 2.5, ty - 45);
  ctx.lineTo(Math.round(tx) + 3.5, ty - 45);
  ctx.stroke();

  // ---- Nordturm: never finished, capped with its Renaissance dome -------
  const nx = x + 22;
  const nBase = y - 4;
  const nH = 40;
  poly(ctx, [[nx - 8, nBase], [nx + 8, nBase], [nx + 8, nBase - nH], [nx - 8, nBase - nH]], stone, OUTLINE);
  poly(ctx, [[nx + 1, nBase], [nx + 8, nBase], [nx + 8, nBase - nH], [nx + 1, nBase - nH]], stoneDark, null);
  px(ctx, nx - 2, nBase - nH + 8, 4, 14, "#5d6b84");
  drawBlob(ctx, nx, nBase - nH - 5, 9, 7, faces(0.3, 0.22, 0.42));
  ctx.strokeStyle = "#e0b83a";
  ctx.beginPath();
  ctx.moveTo(Math.round(nx) + 0.5, nBase - nH - 11);
  ctx.lineTo(Math.round(nx) + 0.5, nBase - nH - 17);
  ctx.stroke();
}

// ------------------------------------------------- Brandenburger Tor (Berlin)

export function drawBrandenburgGate(ctx, x, y) {
  const stone = "#ded8c8";
  const stoneDark = "#bcb5a3";
  const shadow = "#9d9684";

  const baseY = y - 2;
  const h = 46;
  const colW = 5;
  const cols = 6;
  const span = 58;

  // stylobate
  px(ctx, x - span / 2 - 4, baseY, span + 8, 5, stoneDark);
  outlineRect(ctx, x - span / 2 - 4, baseY, span + 8, 5);

  // doric columns
  for (let i = 0; i < cols; i++) {
    const cx = x - span / 2 + (i * span) / (cols - 1) - colW / 2;
    px(ctx, cx, baseY - h, colW, h, stone);
    px(ctx, cx + colW - 2, baseY - h, 2, h, shadow); // shaded flute
    outlineRect(ctx, cx, baseY - h, colW, h);
  }

  // entablature
  px(ctx, x - span / 2 - 5, baseY - h - 9, span + 10, 9, stone);
  outlineRect(ctx, x - span / 2 - 5, baseY - h - 9, span + 10, 9);
  px(ctx, x - span / 2 - 5, baseY - h - 4, span + 10, 2, stoneDark);
  // attic block
  px(ctx, x - span / 2 + 4, baseY - h - 16, span - 8, 7, stone);
  outlineRect(ctx, x - span / 2 + 4, baseY - h - 16, span - 8, 7);

  // the Quadriga: chariot and four horses
  const qy = baseY - h - 16;
  const qx = x - 12;
  px(ctx, qx, qy - 7, 7, 7, "#4a4a52"); // chariot
  outlineRect(ctx, qx, qy - 7, 7, 7);
  for (let i = 0; i < 4; i++) {
    const hx = qx + 8 + i * 4;
    px(ctx, hx, qy - 6, 3, 6, "#5a5a62"); // body
    px(ctx, hx + 2, qy - 9, 2, 3, "#5a5a62"); // neck and head
    px(ctx, hx, qy - 1, 1, 2, "#4a4a52"); // legs
  }
}

// ------------------------------------------------- Schloss Neuschwanstein

function castleTower(ctx, x, baseY, h, w, roofColor) {
  const wall = "#f2efe6";
  px(ctx, x - w / 2, baseY - h, w, h, wall);
  px(ctx, x + w / 2 - 2, baseY - h, 2, h, "#d6d0c2");
  outlineRect(ctx, x - w / 2, baseY - h, w, h);
  // conical roof
  poly(ctx, [[x - w / 2 - 1.5, baseY - h], [x + w / 2 + 1.5, baseY - h], [x, baseY - h - w * 1.5]], roofColor, OUTLINE);
  // windows
  for (let i = 0; i < Math.floor(h / 9); i++) {
    px(ctx, x - 1, baseY - h + 5 + i * 9, 2, 4, "#4d5a74");
  }
}

export function drawCastle(ctx, x, y) {
  const rock = "#8b8578";
  const rockDark = "#6f6a5f";
  const wall = "#f2efe6";
  const roofBlue = "#3f5f96";

  // crag
  poly(ctx, [[x - 34, y], [x + 34, y], [x + 24, y - 16], [x - 24, y - 16]], rock, OUTLINE);
  poly(ctx, [[x, y], [x + 34, y], [x + 24, y - 16], [x, y - 16]], rockDark, null);

  const baseY = y - 15;

  // lower gatehouse range
  px(ctx, x - 26, baseY - 20, 22, 20, wall);
  outlineRect(ctx, x - 26, baseY - 20, 22, 20);
  px(ctx, x - 26, baseY - 20, 22, 3, "#c8a24a");
  poly(ctx, [[x - 27, baseY - 20], [x - 3, baseY - 20], [x - 15, baseY - 30]], "#7a3b34", OUTLINE);

  // main palas
  px(ctx, x - 8, baseY - 40, 26, 40, wall);
  px(ctx, x + 12, baseY - 40, 6, 40, "#ddd8cb");
  outlineRect(ctx, x - 8, baseY - 40, 26, 40);
  poly(ctx, [[x - 9, baseY - 40], [x + 19, baseY - 40], [x + 5, baseY - 54]], "#7a3b34", OUTLINE);
  // rows of arched windows
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      px(ctx, x - 4 + c * 6, baseY - 34 + r * 11, 3, 6, "#4d5a74");
    }
  }

  // the fairy-tale towers
  castleTower(ctx, x - 20, baseY, 56, 11, roofBlue);
  castleTower(ctx, x + 22, baseY, 40, 9, roofBlue);
  castleTower(ctx, x + 4, baseY - 40, 20, 7, roofBlue);
}

// ------------------------------------------------- Matterhorn (Switzerland)

export function drawMatterhorn(ctx, x, baseY, scale = 1) {
  const w = 150 * scale;
  const h = 150 * scale;
  const rockL = "#6e7288";
  const rockR = "#4e5266";
  const snow = "#f6f9fd";
  const snowShade = "#d3dbe6";

  // The Matterhorn's signature: a hooked summit leaning to one side.
  const peakX = x + w * 0.12;
  const peakY = baseY - h;
  const shoulderX = x - w * 0.06;
  const shoulderY = baseY - h * 0.62;

  poly(ctx, [[x - w / 2, baseY], [shoulderX, shoulderY], [peakX, peakY], [x + w * 0.06, baseY]], rockL, OUTLINE);
  poly(ctx, [[x + w * 0.06, baseY], [peakX, peakY], [x + w / 2, baseY]], rockR, OUTLINE);

  // snow clinging to the north face and the summit hook
  poly(
    ctx,
    [
      [peakX, peakY],
      [shoulderX, shoulderY],
      [shoulderX + w * 0.07, shoulderY + h * 0.06],
      [peakX - w * 0.03, peakY + h * 0.16],
    ],
    snow,
    null
  );
  poly(ctx, [[peakX, peakY], [peakX - w * 0.03, peakY + h * 0.16], [peakX + w * 0.06, peakY + h * 0.2]], snowShade, null);
  // snow streaks in the gullies
  poly(
    ctx,
    [
      [x - w * 0.22, baseY],
      [x - w * 0.14, baseY - h * 0.3],
      [x - w * 0.09, baseY - h * 0.28],
      [x - w * 0.13, baseY],
    ],
    snowShade,
    null
  );
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
