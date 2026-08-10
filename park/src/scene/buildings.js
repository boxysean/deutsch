import * as THREE from "three";
import { makeRng, pick, range } from "./rng.js";
import { zoneColor, muted, shade, ROOF_COLORS, TRIM_COLORS } from "./palette.js";
import { applyOutlines } from "./outline.js";

function mat(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

function box(w, h, d, color) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
}

// Triangular prism — a proper gable roof rather than a squashed cone.
function gable(w, h, d, color) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, h);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  return new THREE.Mesh(geo, mat(color));
}

function makeRoof(kind, w, d, color, rng) {
  const g = new THREE.Group();
  if (kind === "gable") {
    const r = gable(w * 1.16, range(rng, 0.9, 1.5), d * 1.16, color);
    g.add(r);
  } else if (kind === "hip") {
    const r = new THREE.Mesh(new THREE.ConeGeometry((Math.max(w, d) / 2) * 1.24, range(rng, 1.0, 1.6), 4), mat(color));
    r.rotation.y = Math.PI / 4;
    r.position.y = range(rng, 0.5, 0.8);
    g.add(r);
  } else if (kind === "dome") {
    const r = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(w, d) * 0.6, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(color)
    );
    g.add(r);
  } else if (kind === "spire") {
    const base = new THREE.Mesh(new THREE.ConeGeometry((Math.max(w, d) / 2) * 1.2, 0.7, 6), mat(color));
    base.position.y = 0.35;
    g.add(base);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.42, range(rng, 1.6, 2.6), 6), mat(shade(color, 0.08)));
    spike.position.y = 1.6;
    g.add(spike);
  } else {
    // flat roof with a parapet lip
    const r = box(w * 1.14, 0.34, d * 1.14, color);
    r.position.y = 0.17;
    g.add(r);
  }
  return g;
}

function addWindows(group, rng, w, h, d, count, trim) {
  for (let i = 0; i < count; i++) {
    const win = box(0.42, 0.5, 0.12, trim);
    const side = Math.floor(rng() * 2);
    const off = range(rng, -w * 0.28, w * 0.28);
    const y = range(rng, h * 0.35, h * 0.72);
    if (side === 0) {
      win.position.set(off, y, d / 2 + 0.02);
    } else {
      win.rotation.y = Math.PI / 2;
      win.position.set(w / 2 + 0.02, y, off);
    }
    win.userData.noOutline = true;
    group.add(win);
  }
}

function addFlag(group, rng, y, color) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 5), mat(0xf3efe4));
  pole.position.y = y + 0.75;
  pole.userData.noOutline = true;
  group.add(pole);

  const flag = box(0.75, 0.42, 0.06, color);
  flag.position.set(0.42, y + 1.25, 0);
  flag.userData.wave = true;
  flag.userData.noOutline = true;
  group.add(flag);
  return flag;
}

function addAwning(group, rng, w, d, y, colorA, colorB) {
  const stripes = 5;
  const sw = (w * 1.2) / stripes;
  for (let i = 0; i < stripes; i++) {
    const s = box(sw, 0.14, 1.5, i % 2 === 0 ? colorA : colorB);
    s.position.set(-w * 0.6 + sw * (i + 0.5), y, d / 2 + 0.65);
    s.rotation.x = -0.32;
    s.userData.noOutline = true;
    group.add(s);
  }
}

function addSign(group, rng, y, w, trim) {
  const post = box(0.1, 0.5, 0.1, 0xf3efe4);
  post.position.set(0, y + 0.25, 0);
  post.userData.noOutline = true;
  const plate = box(w * 0.9, 0.42, 0.14, trim);
  plate.position.set(0, y + 0.7, 0);
  group.add(post, plate);
}

function addChimney(group, rng, w, d, y, color) {
  const c = box(0.34, range(rng, 0.7, 1.2), 0.34, color);
  c.position.set(range(rng, -w * 0.3, w * 0.3), y, range(rng, -d * 0.25, d * 0.25));
  group.add(c);
}

function addPlanters(group, rng, w, d) {
  const n = 1 + Math.floor(rng() * 2);
  for (let i = 0; i < n; i++) {
    const pot = box(0.36, 0.28, 0.36, 0xb5714a);
    const x = (i === 0 ? -1 : 1) * (w / 2 + 0.35);
    pot.position.set(x, 0.14, d / 2 - 0.2);
    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.26, 6, 4), mat(0x3f9e57));
    bush.position.set(x, 0.42, d / 2 - 0.2);
    group.add(pot, bush);
  }
}

// ---------------------------------------------------------------- archetypes

function buildTownhall(rng, color, roofColor, trim, built) {
  const g = new THREE.Group();
  const w = range(rng, 4.0, 4.6);
  const h = range(rng, 3.0, 3.8);
  const d = range(rng, 3.6, 4.2);

  const plinth = box(w * 1.12, 0.36, d * 1.12, shade(color, -0.22));
  plinth.position.y = 0.18;
  g.add(plinth);

  const body = box(w, h, d, color);
  body.position.y = 0.36 + h / 2;
  g.add(body);

  // corner pilasters give the civic, chunky look
  [-1, 1].forEach((sx) =>
    [-1, 1].forEach((sz) => {
      const p = box(0.34, h, 0.34, trim);
      p.position.set((sx * w) / 2, 0.36 + h / 2, (sz * d) / 2);
      g.add(p);
    })
  );

  const roof = makeRoof(pick(rng, ["gable", "hip", "spire"]), w, d, roofColor, rng);
  roof.position.y = 0.36 + h;
  g.add(roof);

  const door = box(0.8, 1.2, 0.16, trim);
  door.position.set(0, 0.36 + 0.6, d / 2 + 0.02);
  door.userData.noOutline = true;
  g.add(door);

  const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 10), mat(trim));
  clock.rotation.x = Math.PI / 2;
  clock.position.set(0, 0.36 + h * 0.78, d / 2 + 0.04);
  g.add(clock);

  addWindows(g, rng, w, h, d, 4, trim);
  addPlanters(g, rng, w, d);
  const flag = addFlag(g, rng, 0.36 + h + 1.8, built ? 0xffd23f : 0xd8d3c6);

  return { group: g, top: 0.36 + h + 2.7, flag };
}

function buildKiosk(rng, color, roofColor, trim, built) {
  const g = new THREE.Group();
  const hex = rng() > 0.5;
  const w = range(rng, 2.2, 2.9);
  const h = range(rng, 1.7, 2.6);
  const d = range(rng, 2.2, 2.9);

  const plinth = box(w * 1.2, 0.28, d * 1.2, shade(color, -0.24));
  plinth.position.y = 0.14;
  g.add(plinth);

  let body;
  if (hex) {
    body = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.55, w * 0.58, h, 6), mat(color));
  } else {
    body = box(w, h, d, color);
  }
  body.position.y = 0.28 + h / 2;
  g.add(body);

  const roof = makeRoof(pick(rng, ["hip", "gable", "dome", "flat"]), w, d, roofColor, rng);
  roof.position.y = 0.28 + h;
  g.add(roof);

  addWindows(g, rng, w, h, d, 1 + Math.floor(rng() * 2), trim);
  const extra = rng();
  if (extra < 0.35) addChimney(g, rng, w, d, 0.28 + h + 0.5, shade(color, -0.15));
  else if (extra < 0.6) addSign(g, rng, 0.28 + h + 0.8, w, trim);
  if (rng() > 0.55) addPlanters(g, rng, w, d);

  return { group: g, top: 0.28 + h + 1.6, flag: null };
}

function buildStall(rng, color, roofColor, trim, built) {
  const g = new THREE.Group();
  const w = range(rng, 2.3, 3.0);
  const h = range(rng, 1.3, 2.0);
  const d = range(rng, 1.8, 2.3);
  const variant = pick(rng, ["awning", "roofed", "tented"]);

  const counter = box(w, h, d, color);
  counter.position.y = h / 2;
  g.add(counter);

  let top = h;

  if (variant === "awning") {
    const backPanel = box(w, h * 0.9, 0.22, shade(color, -0.12));
    backPanel.position.set(0, h + h * 0.45, -d / 2 + 0.1);
    g.add(backPanel);
    addAwning(g, rng, w, d, h + 0.5, trim, shade(color, -0.2));
    top = h + h * 0.9 + 0.4;
  } else if (variant === "roofed") {
    // a proper little shop: upper storey plus a pitched roof
    const upper = box(w * 0.86, h * 0.75, d * 0.86, shade(color, 0.08));
    upper.position.y = h + (h * 0.75) / 2;
    g.add(upper);
    const roof = makeRoof(pick(rng, ["gable", "hip"]), w * 0.86, d * 0.86, roofColor, rng);
    roof.position.y = h + h * 0.75;
    g.add(roof);
    addWindows(g, rng, w, h, d, 2, trim);
    top = h + h * 0.75 + 1.6;
  } else {
    // conical market tent
    const tent = new THREE.Mesh(new THREE.ConeGeometry(w * 0.72, range(rng, 1.5, 2.2), 8), mat(roofColor));
    tent.position.y = h + 0.75;
    g.add(tent);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 4), mat(trim));
    finial.position.y = h + 1.9;
    g.add(finial);
    top = h + 2.2;
  }

  // stacked crates for market clutter
  const crates = Math.floor(rng() * 3);
  for (let i = 0; i < crates; i++) {
    const c = box(0.44, 0.44, 0.44, 0xc98a4b);
    c.position.set(range(rng, -w * 0.4, w * 0.4), 0.22 + i * 0.45, d / 2 + 0.5);
    g.add(c);
  }

  if (rng() > 0.6) addPlanters(g, rng, w, d);

  return { group: g, top: top + 0.5, flag: null };
}

function buildPavilion(rng, color, roofColor, trim, built) {
  const g = new THREE.Group();
  const r = range(rng, 1.7, 2.1);
  const h = range(rng, 2.0, 2.7);

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.3, r * 1.38, 0.34, 6), mat(shade(color, -0.24)));
  plinth.position.y = 0.17;
  g.add(plinth);

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.06, h, 6), mat(color));
  drum.position.y = 0.34 + h / 2;
  g.add(drum);

  // columns around the drum
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, h, 5), mat(trim));
    col.position.set(Math.cos(a) * r * 1.05, 0.34 + h / 2, Math.sin(a) * r * 1.05);
    g.add(col);
  }

  const roof = makeRoof(pick(rng, ["dome", "spire", "hip"]), r * 2.3, r * 2.3, roofColor, rng);
  roof.position.y = 0.34 + h;
  g.add(roof);

  const flag = addFlag(g, rng, 0.34 + h + 1.2, built ? 0xffd23f : 0xd8d3c6);

  return { group: g, top: 0.34 + h + 2.8, flag };
}

const FACTORIES = {
  townhall: buildTownhall,
  kiosk: buildKiosk,
  stall: buildStall,
  pavilion: buildPavilion,
};

export function buildBuilding(zone, facing = 0) {
  const rng = makeRng(zone.id);
  const built = zone.status === "built";
  const base = zoneColor(zone, rng);
  const color = built ? base : muted(base);
  const roofColor = built ? new THREE.Color(pick(rng, ROOF_COLORS)) : muted(new THREE.Color(pick(rng, ROOF_COLORS)));
  const trim = built ? new THREE.Color(pick(rng, TRIM_COLORS)) : new THREE.Color(0xeeeae0);

  const factory = FACTORIES[zone.archetype] || buildKiosk;
  const { group, top, flag } = factory(rng, color, roofColor, trim, built);

  // Face the cul-de-sac it sits on, with a touch of jitter so the row of
  // houses isn't unnaturally perfect.
  group.rotation.y = facing + range(rng, -0.08, 0.08);
  group.userData.zoneId = zone.id;
  group.userData.built = built;

  let ring = null;
  if (built) {
    ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.16, 6, 16), mat(0xffd23f));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = top + 0.4;
    ring.userData.spin = 1;
    group.add(ring);
  }

  applyOutlines(group, built ? 0.075 : 0.055);

  // Buildings sit a little larger than their grid cell suggests so the
  // districts feel busy rather than sparse.
  const baseScale = zone.archetype === "townhall" ? 1.05 : 1.18;
  group.scale.setScalar(baseScale);

  return { group, top: top * baseScale, ring, flag, baseScale };
}
