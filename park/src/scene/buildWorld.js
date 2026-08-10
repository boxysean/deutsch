import { ZONES } from "../data/zones.js";
import { zoneWorldPosition } from "./layout.js";
import { buildGround } from "./ground.js";
import { buildBuilding } from "./buildings.js";
import { buildProps } from "./props.js";

export function buildWorld(scene) {
  const { animated } = buildGround(scene);
  buildProps(scene);

  const pickableObjects = [];
  const zoneObjects = [];

  ZONES.forEach((zone, i) => {
    const { group, top, ring, flag, baseScale } = buildBuilding(zone);
    const pos = zoneWorldPosition(zone);
    group.position.set(pos.x, 0, pos.z);
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
      lift: 0,
      phase: i * 0.7,
      worldPos: pos,
    });
  });

  return { pickableObjects, zoneObjects, animated };
}
