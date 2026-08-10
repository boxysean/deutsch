import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { worldBounds } from "./layout.js";

export function setupControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableRotate = false;
  controls.screenSpacePanning = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.minZoom = 0.55;
  controls.maxZoom = 2.4;
  controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };

  const bounds = worldBounds();
  const pad = 15;

  controls.addEventListener("change", () => {
    controls.target.x = Math.min(Math.max(controls.target.x, bounds.minX - pad), bounds.maxX + pad);
    controls.target.z = Math.min(Math.max(controls.target.z, bounds.minZ - pad), bounds.maxZ + pad);
    controls.target.y = 0;
  });

  controls.update();
  return controls;
}
