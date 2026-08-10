import * as THREE from "three";

const FRUSTUM_HALF_HEIGHT = 42;

// The three districts aren't centred on the origin, so aim the camera at the
// park's actual visual centroid instead.
export const CAMERA_TARGET = new THREE.Vector3(-5, 0, -13);

export function setupScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fd8ef);

  const aspect = window.innerWidth / window.innerHeight;
  const d = FRUSTUM_HALF_HEIGHT;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  // Equal x/y/z offset = true isometric projection (35.264° from horizontal, 45° yaw)
  camera.position.set(CAMERA_TARGET.x + 140, 140, CAMERA_TARGET.z + 140);
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
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  return { scene, camera, renderer };
}
