import { ZONES } from "../data/zones.js";
import { zonePlacement } from "./townPlan.js";
import { buildGround } from "./ground.js";
import { buildBuilding } from "./buildings.js";
import { buildProps } from "./props.js";

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

    zoneObjects.push({
      id: zone.id,
      zone,
      group,
      top,
      ring,
      flag,
      baseScale,
      labelOffset: 1.0,
      lift: 0,
      phase: i * 0.7,
      worldPos: { x: place.x, z: place.z },
    });
  });

  return { pickableObjects, zoneObjects, animated };
}
