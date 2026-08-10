import { TILE_W, TILE_H, LEVEL_H } from "./projection.js";
import { faces, OUTLINE } from "./palette.js";
import { drawBox, drawBlob } from "./sprites.js";

// Alpine set dressing. Everything is drawn with small filled rects and polygons
// so it stays crisp at 1x and reads as pixel art once upscaled.

const SKIN = "#f0c08a";
const SKIN_DARK = "#d9a670";

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

// ---------------------------------------------------------------- mountains

export function drawMountain(ctx, cx, baseY, w, h, seed) {
  const rockL = "#7d7f96";
  const rockR = "#5f6178";
  const snow = "#f4f7fb";
  const snowShade = "#d6dee8";

  const peakX = cx + (seed % 2 === 0 ? -w * 0.06 : w * 0.06);
  const peakY = baseY - h;

  poly(ctx, [[cx - w / 2, baseY], [peakX, peakY], [cx, baseY]], rockL, OUTLINE);
  poly(ctx, [[cx, baseY], [peakX, peakY], [cx + w / 2, baseY]], rockR, OUTLINE);

  // jagged snow cap
  const capH = h * 0.34;
  const capW = w * 0.34;
  const capY = peakY + capH;
  poly(
    ctx,
    [
      [peakX - capW / 2, capY],
      [peakX - capW * 0.22, capY - capH * 0.34],
      [peakX - capW * 0.05, capY - capH * 0.05],
      [peakX, peakY],
      [peakX + capW * 0.1, capY - capH * 0.42],
      [peakX + capW * 0.28, capY - capH * 0.1],
      [peakX + capW / 2, capY],
    ],
    snow,
    null
  );
  poly(ctx, [[peakX, peakY], [peakX + capW * 0.1, capY - capH * 0.42], [peakX + capW * 0.28, capY - capH * 0.1], [peakX + capW / 2, capY], [peakX, capY]], snowShade, null);
}

// ---------------------------------------------------------------- villagers

// A tiny Alpine local. Roughly 12px tall at 1x.
export function drawPerson(ctx, x, y, variant, t) {
  const bob = Math.round(Math.sin(t * 2.5) * 0.5);
  const yy = y + bob;

  if (variant === "dirndl") {
    // skirt
    poly(ctx, [[x - 4, yy], [x + 4, yy], [x + 2.5, yy - 5], [x - 2.5, yy - 5]], "#2f6fd0", OUTLINE);
    px(ctx, x - 2, yy - 8, 4, 3, "#fdf6e8"); // blouse
    outlineRect(ctx, x - 2.5, yy - 8.5, 6, 4);
    px(ctx, x - 2, yy - 6, 4, 1, "#c8102e"); // bodice trim
    px(ctx, x - 1.5, yy - 12, 3, 4, SKIN); // head
    outlineRect(ctx, x - 2, yy - 12.5, 4, 5);
    px(ctx, x - 2, yy - 13, 4, 1.5, "#e8c46a"); // blonde hair
    return;
  }

  if (variant === "lederhosen") {
    px(ctx, x - 2.5, yy - 5, 5, 5, "#8a5a2b"); // leather shorts
    outlineRect(ctx, x - 3, yy - 5.5, 6, 6);
    px(ctx, x - 2, yy - 9, 4, 4, "#fdf6e8"); // shirt
    outlineRect(ctx, x - 2.5, yy - 9.5, 5, 5);
    px(ctx, x - 2, yy - 8, 1, 3, "#5a3a1b"); // braces
    px(ctx, x + 1, yy - 8, 1, 3, "#5a3a1b");
    px(ctx, x - 1.5, yy - 13, 3, 4, SKIN); // head
    outlineRect(ctx, x - 2, yy - 13.5, 4, 5);
    px(ctx, x - 3, yy - 14, 6, 1.5, "#2f5d3a"); // green felt hat
    px(ctx, x - 1.5, yy - 15.5, 3, 2, "#2f5d3a");
    px(ctx, x + 1.5, yy - 16, 1, 2, "#e8c46a"); // feather
    px(ctx, x - 4, yy - 1, 2, 1.5, SKIN_DARK); // socks
    px(ctx, x + 2, yy - 1, 2, 1.5, SKIN_DARK);
    return;
  }

  // generic visitor
  px(ctx, x - 2, yy - 5, 4, 5, variant === "hiker" ? "#c2562f" : "#3b6ea5");
  outlineRect(ctx, x - 2.5, yy - 5.5, 5, 6);
  px(ctx, x - 1.5, yy - 9, 3, 4, SKIN);
  outlineRect(ctx, x - 2, yy - 9.5, 4, 5);
  px(ctx, x - 2, yy - 10, 4, 1.5, "#4a3a2a");
  if (variant === "hiker") px(ctx, x + 2.5, yy - 8, 1, 8, "#8a5a2b"); // walking pole
}

// ---------------------------------------------------------------- flags

const FLAGS = {
  at: ["#ed2939", "#ffffff", "#ed2939"],
  de: ["#000000", "#dd0000", "#ffce00"],
  ch: null, // drawn specially
};

export function drawFlagpole(ctx, x, y, country, t) {
  const h = 22;
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(Math.round(x) + 0.5, Math.round(y));
  ctx.lineTo(Math.round(x) + 0.5, Math.round(y) - h);
  ctx.stroke();
  px(ctx, x - 2, y - 1, 5, 2, "#7d7f96");

  const wave = Math.sin(t * 2.2) > 0 ? 0 : 1;
  const fw = 11;
  const fh = 8;
  const fx = x + 1;
  const fy = y - h + wave;

  if (country === "ch") {
    px(ctx, fx, fy, fw, fh, "#d52b1e");
    px(ctx, fx + fw / 2 - 1, fy + 1.5, 2, 5, "#ffffff");
    px(ctx, fx + 2, fy + fh / 2 - 1, 7, 2, "#ffffff");
  } else {
    const bands = FLAGS[country];
    bands.forEach((c, i) => px(ctx, fx, fy + (i * fh) / 3, fw, fh / 3 + 0.5, c));
  }
  outlineRect(ctx, fx, fy, fw, fh);
}

// ---------------------------------------------------------------- maypole

// Maibaum: the blue-and-white spiral pole you find on every Bavarian and
// Austrian village square.
export function drawMaypole(ctx, x, y, t) {
  const h = 46;
  px(ctx, x - 1.5, y - h, 3, h, "#fdfdfd");
  for (let i = 0; i < h; i += 6) {
    px(ctx, x - 1.5, y - h + i, 3, 3, "#2f6fd0");
  }
  outlineRect(ctx, x - 2, y - h, 4, h);

  // wreath
  ctx.strokeStyle = "#2f7a3a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y - h + 12, 8, 3.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();

  // crossbars with little guild signs
  px(ctx, x - 9, y - h + 6, 18, 1.5, "#e8c46a");
  outlineRect(ctx, x - 9, y - h + 6, 18, 2);
  const sway = Math.sin(t * 1.6) > 0 ? 0 : 1;
  px(ctx, x - 7, y - h + 8 + sway, 4, 4, "#c8102e");
  px(ctx, x + 3, y - h + 8 - sway, 4, 4, "#2f6fd0");

  // topper
  px(ctx, x - 1, y - h - 4, 2, 4, "#e8c46a");
}

// ---------------------------------------------------------------- animals

export function drawCow(ctx, x, y, t) {
  const chew = Math.sin(t * 1.4) > 0 ? 0 : 1;
  // body
  px(ctx, x - 7, y - 8, 14, 7, "#fdf6e8");
  outlineRect(ctx, x - 7, y - 8, 14, 7);
  px(ctx, x - 5, y - 7, 4, 3, "#3a3128");
  px(ctx, x + 1, y - 5, 4, 3, "#3a3128");
  // legs
  px(ctx, x - 5, y - 1, 2, 2, "#3a3128");
  px(ctx, x + 3, y - 1, 2, 2, "#3a3128");
  // head
  px(ctx, x + 6, y - 11 + chew, 5, 5, "#fdf6e8");
  outlineRect(ctx, x + 6, y - 11 + chew, 5, 5);
  px(ctx, x + 10, y - 10 + chew, 2, 2, "#f0a0a8");
  // bell
  px(ctx, x + 7, y - 6 + chew, 2, 2, "#e8c46a");
}

// ---------------------------------------------------------------- beer garden

export function drawBeerTable(ctx, x, y) {
  // trestle table
  px(ctx, x - 9, y - 7, 18, 3, "#c98a4b");
  outlineRect(ctx, x - 9, y - 7, 18, 3);
  px(ctx, x - 7, y - 4, 2, 4, "#8a5a2b");
  px(ctx, x + 5, y - 4, 2, 4, "#8a5a2b");
  // benches
  px(ctx, x - 11, y - 3, 6, 2, "#c98a4b");
  px(ctx, x + 5, y - 3, 6, 2, "#c98a4b");
  // Maßkrug
  px(ctx, x - 2, y - 11, 4, 4, "#e8b23f");
  px(ctx, x - 2, y - 12, 4, 1.5, "#fdf6e8"); // foam
  outlineRect(ctx, x - 2, y - 12, 4, 5);
}

export function drawPretzelSign(ctx, x, y) {
  px(ctx, x - 0.5, y - 12, 1.5, 12, "#8a5a2b");
  px(ctx, x - 7, y - 20, 14, 9, "#fdf6e8");
  outlineRect(ctx, x - 7, y - 20, 14, 9);
  // pretzel
  ctx.strokeStyle = "#a9691f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 2, y - 15, 2.4, 0, Math.PI * 2);
  ctx.arc(x + 2, y - 15, 2.4, 0, Math.PI * 2);
  ctx.stroke();
}

// ---------------------------------------------------------------- church

// Onion-dome church — the Zwiebelturm silhouette you see all over Bavaria,
// Austria and the Alpine valleys.
export function drawChurch(ctx, ox, oy, t) {
  const body = faces(0.11, 0.16, 0.86);
  const roofF = faces(0.02, 0.4, 0.34);
  const domeF = faces(0.35, 0.3, 0.42);

  // nave, then its roof — both before the tower so the tower stays in front
  drawBox(ctx, ox, oy, 2, 2, 2.4, body);
  drawBox(ctx, ox, oy - 2.4 * LEVEL_H, 2, 2, 0.5, roofF);

  // bell tower on the near corner
  const tx = ox + TILE_W * 0.5;
  const ty = oy + TILE_H * 0.5;
  drawBox(ctx, tx, ty, 1.0, 1.0, 5.4, body);
  const towerTop = ty + 1.0 * TILE_H * 0.5 - 5.4 * LEVEL_H;

  // clock face on the tower
  px(ctx, tx - 2, towerTop + 6, 5, 5, "#fdf6e8");
  outlineRect(ctx, tx - 2, towerTop + 6, 5, 5);
  ctx.strokeStyle = OUTLINE;
  ctx.beginPath();
  ctx.moveTo(Math.round(tx) + 0.5, Math.round(towerTop) + 8.5);
  ctx.lineTo(Math.round(tx) + 0.5, Math.round(towerTop) + 10.5);
  ctx.stroke();

  // Zwiebelturm: two stacked onion bulbs and a cross
  drawBlob(ctx, tx, towerTop - 1, 8, 7, domeF);
  drawBlob(ctx, tx, towerTop - 10, 4, 4, domeF);
  ctx.strokeStyle = "#e8c46a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(Math.round(tx) + 0.5, towerTop - 13);
  ctx.lineTo(Math.round(tx) + 0.5, towerTop - 19);
  ctx.moveTo(Math.round(tx) - 2.5, towerTop - 17);
  ctx.lineTo(Math.round(tx) + 3.5, towerTop - 17);
  ctx.stroke();
}
