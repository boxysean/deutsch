import { ZONES } from "../data/zones.js";
import { CATEGORIES } from "../data/categories.js";
import { zoneWorldPosition } from "./layout.js";
import { buildGround } from "./ground.js";
import { buildBuilding } from "./buildings.js";
import { buildProps } from "./props.js";

export function buildWorld(scene) {
  buildGround(scene);
  buildProps(scene);

  const pickableObjects = [];
  const bobbing = [];

  ZONES.forEach((zone) => {
    const cat = CATEGORIES[zone.category];
    const group = buildBuilding(zone, cat.color);
    const pos = zoneWorldPosition(zone);
    group.position.set(pos.x, 0, pos.z);
    scene.add(group);
    pickableObjects.push(group);

    group.traverse((obj) => {
      if (obj.userData.bob) bobbing.push(obj);
    });
  });

  return { pickableObjects, bobbing };
}
