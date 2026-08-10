import * as THREE from "three";

function desaturate(hex, amount = 0.55) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s * (1 - amount), Math.min(hsl.l * 1.25, 0.82));
  return c;
}

function lambert(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

function makeTownhall(color, built) {
  const group = new THREE.Group();
  const bodyColor = built ? color : desaturate(color);
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3, 4.2), lambert(bodyColor));
  body.position.y = 1.5;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.9, 4), lambert(0x6b4a3a));
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 3 + 0.95;
  group.add(roof);

  const porch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.8), lambert(0xf4ead9));
  porch.position.set(0, 0.6, 2.5);
  group.add(porch);

  return group;
}

function makeKiosk(color, built) {
  const group = new THREE.Group();
  const bodyColor = built ? color : desaturate(color);
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.9, 2.6), lambert(bodyColor));
  body.position.y = 0.95;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.3, 4), lambert(0x6b4a3a));
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 1.9 + 0.65;
  group.add(roof);

  return group;
}

function makeStall(color, built) {
  const group = new THREE.Group();
  const bodyColor = built ? color : desaturate(color);
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 2.0), lambert(bodyColor));
  body.position.y = 0.75;
  group.add(body);

  const awning = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 1.4), lambert(built ? color : desaturate(color, 0.35)));
  awning.position.set(0, 1.65, 1.4);
  awning.rotation.x = -0.28;
  group.add(awning);

  return group;
}

function makePavilion(color, built) {
  const group = new THREE.Group();
  const bodyColor = built ? color : desaturate(color);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 2.1, 6), lambert(bodyColor));
  drum.position.y = 1.05;
  group.add(drum);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 1.6, 6), lambert(0x6b4a3a));
  roof.position.y = 2.1 + 0.8;
  group.add(roof);

  return group;
}

const FACTORIES = {
  townhall: makeTownhall,
  kiosk: makeKiosk,
  stall: makeStall,
  pavilion: makePavilion,
};

export function buildBuilding(zone, categoryColor) {
  const factory = FACTORIES[zone.archetype] || makeKiosk;
  const built = zone.status === "built";
  const group = factory(categoryColor, built);
  group.userData.zoneId = zone.id;
  group.userData.built = built;

  if (built) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.14, 8, 20),
      new THREE.MeshLambertMaterial({ color: 0xffe08a })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 5.2;
    ring.userData.bob = true;
    group.add(ring);
  }

  return group;
}
