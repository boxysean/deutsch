import * as THREE from "three";
import { isTownArea } from "./townPlan.js";
import { makeRng, pick, range } from "./rng.js";
import { applyOutlines } from "./outline.js";

function mat(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

const TRUNK = 0x7a5230;
const GREENS = [0x2f8a4a, 0x3f9e57, 0x57ab5f, 0x27754a];
const BLOSSOM = [0xff8fab, 0xffd23f, 0xff6b6b, 0xc77dff];

function pineTree(rng) {
  const g = new THREE.Group();
  const green = pick(rng, GREENS);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.9, 6), mat(TRUNK));
  trunk.position.y = 0.45;
  g.add(trunk);
  const tiers = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < tiers; i++) {
    const r = 1.15 - i * 0.28;
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, 1.3, 7), mat(green));
    c.position.y = 1.1 + i * 0.72;
    g.add(c);
  }
  return g;
}

function roundTree(rng) {
  const g = new THREE.Group();
  const green = pick(rng, GREENS);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.1, 6), mat(TRUNK));
  trunk.position.y = 0.55;
  g.add(trunk);
  const crown = new THREE.Mesh(new THREE.SphereGeometry(range(rng, 0.85, 1.15), 7, 5), mat(green));
  crown.position.y = range(rng, 1.7, 2.0);
  g.add(crown);
  if (rng() > 0.6) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.55, 6, 4), mat(green));
    puff.position.set(range(rng, -0.6, 0.6), 1.35, range(rng, -0.6, 0.6));
    g.add(puff);
  }
  return g;
}

function blossomTree(rng) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.0, 6), mat(TRUNK));
  trunk.position.y = 0.5;
  g.add(trunk);
  const color = pick(rng, BLOSSOM);
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(range(rng, 0.5, 0.75), 6, 4), mat(color));
    p.position.set(range(rng, -0.45, 0.45), range(rng, 1.4, 1.9), range(rng, -0.45, 0.45));
    g.add(p);
  }
  return g;
}

function bench(rng) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 0.5), mat(0xc98a4b));
  seat.position.y = 0.45;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.12), mat(0xc98a4b));
  back.position.set(0, 0.72, -0.2);
  g.add(back);
  [-0.6, 0.6].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.42), mat(0x6b5238));
    leg.position.set(x, 0.22, 0);
    g.add(leg);
  });
  return g;
}

function lamp(rng) {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 2.4, 6), mat(0x3b3a45));
  post.position.y = 1.2;
  g.add(post);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 7, 5), mat(0xfff0b8));
  head.position.y = 2.55;
  g.add(head);
  return g;
}

function flowerbed(rng) {
  const g = new THREE.Group();
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.26, 8), mat(0x8a6242));
  soil.position.y = 0.13;
  g.add(soil);
  const n = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 4), mat(pick(rng, BLOSSOM)));
    f.position.set(Math.cos(a) * 0.4, 0.36, Math.sin(a) * 0.4);
    g.add(f);
  }
  return g;
}

const KINDS = [pineTree, roundTree, roundTree, blossomTree, bench, lamp, flowerbed, pineTree];

export function buildProps(scene) {
  const rng = makeRng("park-scenery-v3");
  const placed = [];
  let attempts = 0;

  while (placed.length < 110 && attempts < 9000) {
    attempts++;
    const x = range(rng, -92, 92);
    const z = range(rng, -86, 64);
    if (isTownArea(x, z, 2.2)) continue;
    if (placed.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < 25)) continue;
    placed.push({ x, z });

    const kind = pick(rng, KINDS);
    const g = kind(rng);
    g.position.set(x, 0, z);
    g.rotation.y = range(rng, 0, Math.PI * 2);
    const s = range(rng, 0.9, 1.35);
    g.scale.setScalar(s);
    applyOutlines(g, 0.05);
    scene.add(g);
  }
}
