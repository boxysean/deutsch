import * as THREE from "three";

const cache = new Map();

// Emoji drawn into a canvas badge, shown as a sprite so it always faces the
// camera. Sprites, not textured planes, so the icon stays readable at any pan.
function makeIconTexture(emoji) {
  if (cache.has(emoji)) return cache.get(emoji);

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 54, 0, Math.PI * 2);
  ctx.fillStyle = "#fffdf7";
  ctx.fill();
  ctx.lineWidth = 9;
  ctx.strokeStyle = "#21202b";
  ctx.stroke();

  ctx.font = '62px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  cache.set(emoji, texture);
  return texture;
}

export function makeIconSprite(emoji) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeIconTexture(emoji), transparent: true, depthWrite: false })
  );
  sprite.scale.set(2.1, 2.1, 1);
  return sprite;
}
