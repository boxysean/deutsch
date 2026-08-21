import { TILE_W, TILE_H, LEVEL_H, isoToScreen, depthOf } from "./projection.js";
import {
  drawTile,
  drawBox,
  drawPyramid,
  drawGable,
  drawBlob,
  drawFachwerk,
  drawPaintedPanel,
  drawAlpineWindow,
  drawDoor,
} from "./sprites.js";
import {
  drawStephansdom,
  drawFerrisWheel,
  drawTvTower,
  drawCathedral,
  drawBrandenburgGate,
  drawCastle,
  drawMatterhorn,
} from "./landmarks.js";
import { faces, hsl, DISTRICT, terrainFor, TRIM, OUTLINE } from "./palette.js";
import { PLAZA } from "./world.js";
import { getLevel } from "../data/levels.js";
import {
  drawMountain,
  drawPerson,
  drawFlagpole,
  drawMaypole,
  drawCow,
  drawBeerTable,
  drawPretzelSign,
} from "./decor.js";

export function createRenderer(canvas, world) {
  const ctx = canvas.getContext("2d");
  // The renderer is rebuilt per level, so the terrain is resolved once here
  // rather than looked up per tile.
  const { ground: GROUND, plots: PLOTS } = terrainFor(getLevel());

  // The scene is drawn at 1x into an offscreen buffer, then blitted to the
  // visible canvas at an integer zoom with smoothing off — real chunky pixels.
  const scene = document.createElement("canvas");
  const sctx = scene.getContext("2d");

  // The ground never changes, so it only gets redrawn when the view moves.
  const ground = document.createElement("canvas");
  const gctx = ground.getContext("2d");
  let groundKey = "";

  const state = {
    zoom: 3,
    // camera offset in logical (1x) pixels
    camX: 0,
    camY: 0,
    hoveredId: null,
    activeId: null,
    time: 0,
    cssW: 0,
    cssH: 0,
  };

  const sortedTiles = [...world.tiles.values()].sort((a, b) => depthOf(a.tx, a.ty) - depthOf(b.tx, b.ty));
  const all = [...world.objects].sort((a, b) => depthOf(a.tx, a.ty) - depthOf(b.tx, b.ty));
  // The mountain backdrop never animates, so it is baked into the cached
  // ground layer instead of being redrawn every frame.
  const isBackdrop = (o) => o.kind === "mountain" || o.kind === "matterhorn";
  const backdrop = all.filter(isBackdrop);
  const sortedObjects = all.filter((o) => !isBackdrop(o));

  // ---------------------------------------------------------------- sizing

  function resize() {
    const cssW = canvas.clientWidth || window.innerWidth;
    const cssH = canvas.clientHeight || window.innerHeight;
    state.cssW = cssW;
    state.cssH = cssH;

    canvas.width = cssW;
    canvas.height = cssH;
    scene.width = Math.max(1, Math.ceil(cssW / state.zoom));
    scene.height = Math.max(1, Math.ceil(cssH / state.zoom));
    ctx.imageSmoothingEnabled = false;
  }

  // Fit the whole town on screen and centre it.
  //
  // Spreading the houses further apart does not, on its own, uncrowd the
  // labels: fit() simply zooms out to keep the bigger town in frame, and the
  // labels are a fixed CSS size, so they end up as tangled as before. Measured
  // at 1500×950 with every label counted: at zoom-to-fit, widening the street
  // spacing from 5 to 7 tiles moved the worst label gap from 3px to 4px.
  //
  // What works is a floor on the fit zoom. The opening view is then framed on
  // the plaza and the far ends of the streets are a pan (or one scroll out)
  // away. With the floor in place, 6 tiles of spacing is the point where no label collapses
  // and none overlaps, while still opening on about half the town; 7 gains
  // nothing but costs another house off-screen.
  const MIN_FIT_ZOOM = 2;

  function fit() {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    world.zonePlacement.forEach((p) => {
      const s = isoToScreen(p.tx, p.ty);
      minX = Math.min(minX, s.x - TILE_W);
      maxX = Math.max(maxX, s.x + TILE_W);
      // extra headroom so the mountain range behind the town stays in shot
      minY = Math.min(minY, s.y - 6 * LEVEL_H - 95);
      maxY = Math.max(maxY, s.y + TILE_H * 2);
    });

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const margin = 40;

    let zoom = 4;
    while (zoom > MIN_FIT_ZOOM) {
      if (
        contentW + margin <= state.cssW / zoom &&
        contentH + margin <= state.cssH / zoom
      ) break;
      zoom--;
    }
    setZoom(zoom, false);

    // Centre on the plaza rather than the bounding box: at a zoom that does not
    // show everything, the middle of the town is the useful place to start.
    const centre = isoToScreen(PLAZA.tx, PLAZA.ty);
    const fits = contentW + margin <= state.cssW / zoom && contentH + margin <= state.cssH / zoom;
    state.camX = fits ? (minX + maxX) / 2 : centre.x;
    state.camY = fits ? (minY + maxY) / 2 : centre.y;
  }

  function setZoom(z, keepCentre = true) {
    state.zoom = Math.max(1, Math.min(5, z));
    scene.width = Math.max(1, Math.ceil(state.cssW / state.zoom));
    scene.height = Math.max(1, Math.ceil(state.cssH / state.zoom));
    sctx.imageSmoothingEnabled = false;
  }

  // world (logical px) -> canvas CSS px
  function worldToCss(x, y) {
    return {
      x: (x - state.camX) * state.zoom + state.cssW / 2,
      y: (y - state.camY) * state.zoom + state.cssH / 2,
    };
  }

  // canvas CSS px -> world logical px
  function cssToWorld(x, y) {
    return {
      x: (x - state.cssW / 2) / state.zoom + state.camX,
      y: (y - state.cssH / 2) / state.zoom + state.camY,
    };
  }

  function originFor(tx, ty) {
    const s = isoToScreen(tx, ty);
    return {
      x: s.x - state.camX + scene.width / 2,
      y: s.y - state.camY + scene.height / 2,
    };
  }

  // ---------------------------------------------------------------- drawing

  function tileColor(t) {
    const checker = (t.tx + t.ty) % 2 === 0;
    if (t.type === "grass") return checker ? GROUND.grass : GROUND.grassAlt;
    if (t.type === "path") return checker ? GROUND.path : GROUND.pathAlt;
    if (t.type === "plaza") return GROUND.plaza;
    if (t.type === "plot") {
      const pair = PLOTS[t.district] || PLOTS.info;
      return checker ? pair[0] : pair[1];
    }
    return GROUND.grass;
  }

  function drawGround() {
    const key = `${Math.round(state.camX)},${Math.round(state.camY)},${state.zoom},${scene.width},${scene.height}`;
    if (key !== groundKey) {
      groundKey = key;
      ground.width = scene.width;
      ground.height = scene.height;
      gctx.imageSmoothingEnabled = false;
      gctx.fillStyle = GROUND.water;
      gctx.fillRect(0, 0, ground.width, ground.height);

      const w = ground.width;
      const h = ground.height;
      for (const t of sortedTiles) {
        const o = originFor(t.tx, t.ty);
        if (o.x < -TILE_W || o.x > w + TILE_W || o.y < -TILE_H * 2 || o.y > h + TILE_H * 3) continue;
        // paths get a faint edge so the streets read clearly from a distance
        drawTile(gctx, o.x, o.y, tileColor(t), t.type === "path" ? "#c2a870" : null);
      }

      for (const m of backdrop) {
        const o = originFor(m.tx, m.ty);
        const cy = o.y + TILE_H / 2;
        if (o.x < -300 || o.x > w + 300 || cy < -320 || cy > h + 120) continue;
        if (m.kind === "matterhorn") drawMatterhorn(gctx, o.x, cy, m.scale || 1);
        else drawMountain(gctx, o.x, cy, m.w, m.h, m.seed);
      }
    }
    sctx.drawImage(ground, 0, 0);
  }

  function drawTree(obj) {
    const o = originFor(obj.tx, obj.ty);
    if (o.x < -40 || o.x > scene.width + 40 || o.y < -60 || o.y > scene.height + 40) return;
    const cx = o.x;
    const cy = o.y + TILE_H / 2;
    const s = obj.scale;
    const leaf = faces(obj.hue, obj.sat, obj.light);
    const trunk = faces(0.08, 0.45, 0.28);

    if (obj.variant === "bush") {
      drawBlob(sctx, cx, cy - 3 * s, 7 * s, 5 * s, leaf);
      return;
    }

    // trunk
    sctx.fillStyle = trunk.right;
    sctx.fillRect(Math.round(cx - 1.5), Math.round(cy - 8 * s), 3, Math.round(8 * s));
    sctx.strokeStyle = OUTLINE;
    sctx.lineWidth = 1;
    sctx.strokeRect(Math.round(cx - 1.5) + 0.5, Math.round(cy - 8 * s) + 0.5, 3, Math.round(8 * s));

    if (obj.variant === "pine") {
      for (let i = 0; i < 3; i++) {
        const ry = 7 * s - i * 1.2;
        const rx = 9 * s - i * 2.2;
        drawBlob(sctx, cx, cy - 10 * s - i * 6 * s, rx, ry, leaf);
      }
    } else if (obj.variant === "blossom") {
      const bloom = faces(obj.blossom, 0.6, 0.68);
      drawBlob(sctx, cx, cy - 13 * s, 9 * s, 7 * s, bloom);
    } else {
      drawBlob(sctx, cx, cy - 13 * s, 10 * s, 8 * s, leaf);
    }
  }

  function drawBuilding(obj) {
    const o = originFor(obj.tx, obj.ty);
    if (o.x < -120 || o.x > scene.width + 120 || o.y < -140 || o.y > scene.height + 100) return;

    const spec = obj.spec;
    const hovered = obj.zone.id === state.hoveredId;
    // Landmarks draw themselves; they have no box body to shade.
    const LANDMARK = {
      stephansdom: (c) => drawStephansdom(sctx, c.x, c.y),
      fernsehturm: (c) => drawTvTower(sctx, c.x, c.y, state.time),
      riesenrad: (c) => drawFerrisWheel(sctx, c.x, c.y, state.time),
      brandenburg: (c) => drawBrandenburgGate(sctx, c.x, c.y),
      dom: (c) => drawCathedral(sctx, c.x, c.y),
    };
    if (LANDMARK[spec.render]) {
      LANDMARK[spec.render]({ x: o.x, y: o.y + TILE_H / 2 - (hovered ? 4 : 0) });
      return;
    }
    const active = obj.zone.id === state.activeId;
    const lift = hovered ? 4 : 0;

    const fp = spec.footprint;
    // centre the footprint on its tile
    const half = (fp - 1) / 2;
    const base = originFor(obj.tx - half, obj.ty - half);
    const ox = base.x;
    const oy = base.y - lift;

    const boost = hovered ? 0.06 : 0;
    const body = faces(spec.hue, spec.sat, spec.light + boost);
    const roof = faces(spec.roofHue, spec.roofSat, spec.roofLight + boost);

    // plinth
    drawBox(sctx, ox, oy + 2, fp, fp, 0.35, faces(spec.hue, spec.sat * 0.6, spec.light - 0.16));
    // main body
    const box = drawBox(sctx, ox, oy, fp, fp, spec.height, body);

    const topY = oy - spec.height * LEVEL_H;
    const hw = TILE_W / 2;
    const hh = TILE_H / 2;

    // --- Bavarian facade treatment on the two visible walls ---
    if (spec.wallStyle === "fachwerk") {
      drawFachwerk(sctx, box.leftFace);
      drawFachwerk(sctx, box.rightFace);
    } else if (spec.wallStyle === "luftl") {
      drawPaintedPanel(sctx, box.rightFace, spec.built ? "#cfdcef" : "#dcdcd6");
    }

    // windows with green shutters, geraniums on the sunny side
    for (let i = 0; i < spec.windows; i++) {
      const u = (i + 1) / (spec.windows + 1);
      drawAlpineWindow(sctx, box.rightFace, u, 0.52, { flowers: spec.flowerBoxes });
      if (spec.windows > 1) drawAlpineWindow(sctx, box.leftFace, u, 0.52, { flowers: false });
    }
    drawDoor(sctx, box.leftFace, 0.5);

    // roof
    if (spec.roofKind === "pyramid") {
      const apex = drawPyramid(sctx, ox, oy, fp, fp, spec.height, spec.roofH, roof);
      if (spec.flag) drawFlag(apex[0], apex[1], spec.built);
    } else if (spec.roofKind === "chalet") {
      // Alpine chalet: a shallow gable with deep overhanging eaves, a carved
      // balcony running the width of the house, and stones weighting the roof.
      // The overhang grows the footprint by `over` tiles, so the roof's origin
      // corner moves back half that on BOTH tile axes — which is straight up
      // the screen, not diagonally.
      const over = spec.style === "bavarian" ? 0.5 : 0.3;
      drawGable(
        sctx,
        ox,
        oy - TILE_H * over * 0.5,
        fp + over,
        fp + over,
        spec.height,
        spec.roofH * 0.68,
        roof
      );

      const balY = oy + fp * hh * 0.62 - spec.height * LEVEL_H * 0.46;
      const balW = Math.round(fp * TILE_W * 0.46);
      sctx.fillStyle = "#8a5a2b";
      sctx.fillRect(Math.round(ox), Math.round(balY), balW, 3);
      sctx.strokeStyle = OUTLINE;
      sctx.strokeRect(Math.round(ox) + 0.5, Math.round(balY) + 0.5, balW, 3);
      // carved balustrade posts
      sctx.fillStyle = "#6b4420";
      for (let i = 2; i < balW - 1; i += 3) {
        sctx.fillRect(Math.round(ox) + i, Math.round(balY) - 2, 1, 2);
      }
      // geraniums along the balcony
      sctx.fillStyle = "#d63a3a";
      for (let i = 1; i < balW - 2; i += 5) {
        sctx.fillRect(Math.round(ox) + i, Math.round(balY) - 4, 3, 2);
      }

      if (spec.roofStones) {
        sctx.fillStyle = "#8d8a80";
        for (let i = 0; i < 5; i++) {
          const u = 0.2 + i * 0.15;
          sctx.fillRect(
            Math.round(ox + fp * hw * u - 1),
            Math.round(oy + fp * hh * u - spec.height * LEVEL_H - spec.roofH * 0.68 * LEVEL_H * 0.5),
            2,
            2
          );
        }
      }
    } else if (spec.roofKind === "gable") {
      drawGable(sctx, ox, oy, fp, fp, spec.height, spec.roofH, roof);
    } else {
      drawBox(sctx, ox, oy - spec.height * LEVEL_H, fp, fp, 0.3, roof);
    }

    if (spec.chimney && spec.roofKind !== "flat") {
      const cx = ox + fp * hw * 0.65;
      const cy = topY + fp * hh * 0.65 - 4;
      drawBox(sctx, cx, cy, 0.4, 0.4, 1.1, faces(0.03, 0.3, 0.34));
    }

    // stacked firewood against the gable end
    if (spec.woodpile) {
      const wx = ox - fp * hw * 0.75;
      const wy = oy + fp * hh * 0.75;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          sctx.fillStyle = col % 2 ? "#a9752f" : "#8a5a2b";
          sctx.fillRect(Math.round(wx + col * 3), Math.round(wy - 4 - row * 3), 3, 3);
        }
      }
      sctx.strokeStyle = OUTLINE;
      sctx.strokeRect(Math.round(wx) + 0.5, Math.round(wy - 13) + 0.5, 12, 9);
    }

    if (spec.awning) {
      const ax = ox + fp * hw * 0.5;
      const ay = oy + fp * hh * 0.5 - spec.height * LEVEL_H * 0.25;
      sctx.fillStyle = TRIM;
      sctx.fillRect(Math.round(ax - 7), Math.round(ay), 14, 3);
      sctx.strokeStyle = OUTLINE;
      sctx.strokeRect(Math.round(ax - 7) + 0.5, Math.round(ay) + 0.5, 14, 3);
    }

    // "built" marker: a spinning-ish gold ring above the roof
    if (spec.built) {
      const ringY = topY - spec.roofH * LEVEL_H - 8 + Math.round(Math.sin(state.time * 2) * 1.5);
      sctx.strokeStyle = "#ffd23f";
      sctx.lineWidth = 2;
      sctx.beginPath();
      sctx.ellipse(ox + fp * hw * 0.5 - fp * hw * 0.5, ringY, 7, 3, 0, 0, Math.PI * 2);
      sctx.stroke();
      sctx.strokeStyle = OUTLINE;
      sctx.lineWidth = 1;
      sctx.stroke();
    }

    if (active) {
      sctx.strokeStyle = "#ffd23f";
      sctx.lineWidth = 1;
      const s0 = originFor(obj.tx - half, obj.ty - half);
      drawTile(sctx, s0.x, s0.y + fp * TILE_H * 0.5 - TILE_H * 0.5, null, "#ffd23f");
    }
  }

  function drawFlag(x, y, built) {
    sctx.strokeStyle = OUTLINE;
    sctx.lineWidth = 1;
    sctx.beginPath();
    sctx.moveTo(Math.round(x) + 0.5, Math.round(y));
    sctx.lineTo(Math.round(x) + 0.5, Math.round(y) - 9);
    sctx.stroke();
    const wave = Math.sin(state.time * 3) > 0 ? 1 : 0;
    sctx.fillStyle = built ? "#ffd23f" : "#cfc9bb";
    sctx.fillRect(Math.round(x) + 1, Math.round(y) - 9, 6, 4 + wave);
    sctx.strokeRect(Math.round(x) + 1.5, Math.round(y) - 8.5, 6, 4 + wave);
  }

  // Decoration is drawn at the tile's centre point.
  function centreOf(obj) {
    const o = originFor(obj.tx, obj.ty);
    return { x: o.x, y: o.y + TILE_H / 2 };
  }

  function drawDecor(obj) {
    const c = centreOf(obj);
    const pad = obj.kind === "mountain" ? 260 : 60;
    if (c.x < -pad || c.x > scene.width + pad || c.y < -pad * 1.5 || c.y > scene.height + pad) return;
    const t = state.time;

    switch (obj.kind) {
      case "mountain":
        drawMountain(sctx, c.x, c.y, obj.w, obj.h, obj.seed);
        break;
      case "person": {
        // amble a little way along the street and back
        const sway = Math.sin(t * 0.55 + obj.phase) * obj.drift * 5;
        drawPerson(sctx, c.x + sway, c.y, obj.variant, t + obj.phase);
        break;
      }
      case "cow":
        drawCow(sctx, c.x, c.y, t + obj.phase);
        break;
      case "flag":
        drawFlagpole(sctx, c.x, c.y, obj.country, t);
        break;
      case "maypole":
        drawMaypole(sctx, c.x, c.y, t);
        break;
      case "beertable":
        drawBeerTable(sctx, c.x, c.y);
        break;
      case "pretzel":
        drawPretzelSign(sctx, c.x, c.y);
        break;
      case "castle":
        drawCastle(sctx, c.x, c.y);
        break;
      case "matterhorn":
        drawMatterhorn(sctx, c.x, c.y, obj.scale || 1);
        break;
      default:
        break;
    }
  }

  function render(dt) {
    state.time += dt;

    drawGround();

    for (const obj of sortedObjects) {
      if (obj.kind === "tree") drawTree(obj);
      else if (obj.kind === "building") drawBuilding(obj);
      else drawDecor(obj);
    }


    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(scene, 0, 0, scene.width, scene.height, 0, 0, scene.width * state.zoom, scene.height * state.zoom);
  }

  // Screen anchor for a zone's label: just above its roof.
  //
  // The scene is drawn into a low-res buffer and upscaled with nearest, so it
  // effectively moves in whole buffer pixels (= `zoom` CSS px). Rounding the
  // anchor in BUFFER space and only then scaling keeps labels locked to the
  // same grid; rounding in CSS space instead makes them creep against the
  // artwork while panning.
  function zoneAnchor(zoneId) {
    const p = world.zonePlacement.get(zoneId);
    if (!p) return null;
    const obj = sortedObjects.find((o) => o.kind === "building" && o.zone && o.zone.id === zoneId);
    const levels = obj ? obj.spec.labelLevels || obj.spec.height + obj.spec.roofH : 3;
    const s = isoToScreen(p.tx, p.ty, levels);
    const bx = Math.round(s.x - state.camX + scene.width / 2);
    const by = Math.round(s.y - 10 - state.camY + scene.height / 2);
    return { x: bx * state.zoom, y: by * state.zoom };
  }

  return {
    state,
    ctx,
    scene,
    resize,
    fit,
    setZoom,
    render,
    worldToCss,
    cssToWorld,
    zoneAnchor,
    objects: sortedObjects,
  };
}
