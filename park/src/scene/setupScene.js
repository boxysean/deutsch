import * as THREE from "three";
import { computeFraming } from "./layout.js";

export const CAMERA_TARGET = new THREE.Vector3();

export function setupScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fd8ef);

  let aspect = window.innerWidth / window.innerHeight;
  // Frame the whole town, aimed at its true visual centre rather than the origin.
  const framing = computeFraming(aspect);
  CAMERA_TARGET.set(framing.target.x, 0, framing.target.z);

  const camera = new THREE.OrthographicCamera(
    -framing.d * aspect,
    framing.d * aspect,
    framing.d,
    -framing.d,
    1,
    1200
  );
  // Equal x/y/z offset = true isometric projection (35.264° from horizontal, 45° yaw)
  camera.position.set(CAMERA_TARGET.x + 200, 200, CAMERA_TARGET.z + 200);
  camera.lookAt(CAMERA_TARGET);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Bright, low-contrast key light keeps the saturated palette reading as
  // colour rather than shading; the hemisphere light stops shadowed faces
  // going muddy.
  const hemi = new THREE.HemisphereLight(0xdff2ff, 0x6a9c5a, 0.85);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff6e2, 1.15);
  sun.position.set(-110, 170, 95);
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xbfd8ff, 0.3);
  fill.position.set(90, 70, -110);
  scene.add(fill);

  function onResize() {
    aspect = window.innerWidth / window.innerHeight;
    // Recompute the frustum so the town stays framed on any window shape.
    // camera.zoom is untouched, so the user's own zooming survives a resize.
    const f = computeFraming(aspect);
    camera.left = -f.d * aspect;
    camera.right = f.d * aspect;
    camera.top = f.d;
    camera.bottom = -f.d;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  return { scene, camera, renderer };
}
