import "./styles/base.css";
import "./styles/app.css";

import * as THREE from "three";
import { setupScene } from "./scene/setupScene.js";
import { buildWorld } from "./scene/buildWorld.js";
import { setupControls } from "./scene/controls.js";
import { setupRaycast } from "./scene/raycast.js";
import { createLabels } from "./ui/labels.js";
import { initHud } from "./ui/hud.js";
import { initOverlay, onZoneChange, openZonePanel } from "./ui/overlay.js";

const canvas = document.getElementById("scene");
const { scene, camera, renderer } = setupScene(canvas);
const { pickableObjects, zoneObjects, animated } = buildWorld(scene);
const controls = setupControls(camera, renderer.domElement);

initHud();

let hoveredId = null;
const labels = createLabels(zoneObjects, camera, renderer, (id) => openZonePanel(id));

initOverlay();
onZoneChange((id) => labels.setActive(id));

setupRaycast({
  renderer,
  camera,
  pickableObjects,
  onHover: (id) => {
    hoveredId = id;
    labels.setHovered(id);
  },
  onSelect: (id) => openZonePanel(id),
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  zoneObjects.forEach((z) => {
    // hover lift, eased
    const target = z.id === hoveredId ? 1 : 0;
    z.lift += (target - z.lift) * 0.16;

    // Only the ring and flag animate — bobbing the whole house would drag its
    // label around with it, which reads as jitter.
    z.group.position.y = z.lift * 1.1;
    z.group.scale.setScalar(z.baseScale * (1 + z.lift * 0.05));

    if (z.ring) {
      z.ring.rotation.z = t * 1.2;
      z.ring.position.y = z.top / z.baseScale + 0.4 + Math.sin(t * 2 + z.phase) * 0.12;
    }
    if (z.flag) {
      z.flag.rotation.y = Math.sin(t * 2.5 + z.phase) * 0.35;
    }
  });

  animated.forEach((obj, i) => {
    obj.rotation.y = t * (obj.userData.spin || 0.5);
    obj.position.y += Math.sin(t * 2 + i) * 0.002;
  });

  controls.update();
  labels.update();
  renderer.render(scene, camera);
}
animate();
