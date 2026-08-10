import "./styles/base.css";
import "./styles/app.css";

import { setupScene } from "./scene/setupScene.js";
import { buildWorld } from "./scene/buildWorld.js";
import { setupControls } from "./scene/controls.js";
import { setupRaycast } from "./scene/raycast.js";
import { initHud } from "./ui/hud.js";
import { initOverlay, openZonePanel } from "./ui/overlay.js";

const canvas = document.getElementById("scene");
const { scene, camera, renderer } = setupScene(canvas);
const { pickableObjects, bobbing } = buildWorld(scene);
const controls = setupControls(camera, renderer.domElement);

initHud();
initOverlay();

setupRaycast({
  renderer,
  camera,
  pickableObjects,
  tooltipEl: document.getElementById("tooltip"),
  onSelect: (zoneId) => openZonePanel(zoneId),
});

const clock = { t: 0 };
function animate() {
  requestAnimationFrame(animate);
  clock.t += 0.02;
  bobbing.forEach((mesh, i) => {
    mesh.position.y = 5.2 + Math.sin(clock.t + i) * 0.12;
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();
