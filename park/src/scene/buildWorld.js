import * as THREE from "three";
import { ZONES } from "../data/zones.js";
import { zonePlacement } from "./townPlan.js";
import { buildGround } from "./ground.js";
import { buildBuilding } from "./buildings.js";
import { buildProps } from "./props.js";
import { makeIconSprite } from "./icons.js";

export function buildWorld(scene) {
  const { animated } = buildGround(scene);
  buildProps(scene);

  const pickableObjects = [];
  const zoneObjects = [];

  ZONES.forEach((zone, i) => {
    const place = zonePlacement(zone.id);
    const { group, top, ring, flag, baseScale } = buildBuilding(zone, place.facing);
    group.position.set(place.x, 0, place.z);
    scene.add(group);
    pickableObjects.push(group);

    // Icon badge floats above the roof. It hangs off a counter-rotated pin so
    // it ignores whichever way the house happens to face.
    if (zone.icon) {
      const pin = new THREE.Group();
      pin.rotation.y = -group.rotation.y;
      const sprite = makeIconSprite(zone.icon);
      sprite.position.set(0, top / baseScale + 0.5, 0);
      pin.add(sprite);
      group.add(pin);
    }

    zoneObjects.push({
      id: zone.id,
      zone,
      group,
      top,
      ring,
      flag,
      baseScale,
      labelOffset: zone.icon ? 2.6 : 1.0,
      lift: 0,
      phase: i * 0.7,
      worldPos: { x: place.x, z: place.z },
    });
  });

  return { pickableObjects, zoneObjects, animated };
}
