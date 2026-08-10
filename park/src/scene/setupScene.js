import * as THREE from "three";

const FRUSTUM_HALF_HEIGHT = 95;

export function setupScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcfe8d8);
  scene.fog = new THREE.Fog(0xcfe8d8, 220, 420);

  const aspect = window.innerWidth / window.innerHeight;
  const d = FRUSTUM_HALF_HEIGHT;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  // Equal x/y/z offset = true isometric projection (35.264° from horizontal, 45° yaw)
  camera.position.set(140, 140, 140);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff4e0, 1.1);
  sun.position.set(-120, 180, 90);
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.35);
  fill.position.set(80, 60, -100);
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
