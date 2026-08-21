import { getZones } from "../data/zones/index.js";
import { CATEGORIES } from "../data/categories.js";
import { LEVELS, getLevel, setLevel, levelInfo } from "../data/levels.js";

export function initHud() {
  const hud = document.getElementById("hud");
  const level = levelInfo();
  const learning = getZones().filter((z) => z.category !== "info");
  const built = learning.filter((z) => z.status === "built").length;

  const legend = Object.keys(CATEGORIES).filter((k) => k !== "info")
    .map((key) => {
      const cat = CATEGORIES[key];
      const hex = "#" + cat.color.toString(16).padStart(6, "0");
      return `<span class="swatch"><span class="dot" style="background:${hex}"></span>${cat.label}</span>`;
    })
    .join("");

  // The level switch sits on the brand, where the level badge already was:
  // the badge WAS the answer to "which exam is this?", so it becomes the
  // control that changes it rather than a second widget saying the same thing.
  const switcher = LEVELS.map(
    (l) =>
      `<button type="button" class="lvl-btn" data-level="${l.id}" data-picked="${
        l.id === level.id
      }" title="${l.exam} — ${l.tagline}">${l.label}</button>`
  ).join("");

  hud.innerHTML = `
    <div class="hud-brand">
      <span class="lvl-switch" role="radiogroup" aria-label="Niveau">${switcher}</span>
      <h1 class="display">Deutsche Welt</h1>
      <span class="hud-levelname">${level.name}</span>
    </div>
    <div class="hud-legend">
      ${legend}
      <span class="hud-hint">Ziehen zum Verschieben · Scrollen zum Zoomen · Klick zum Öffnen</span>
    </div>
    <div class="hud-right">
      <div class="hud-progress"><b>${built}</b> / ${learning.length} Gebiete ausgebaut</div>
    </div>
  `;

  hud.querySelectorAll(".lvl-btn").forEach((btn) => {
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", btn.dataset.picked);
    btn.addEventListener("click", () => setLevel(btn.dataset.level));
  });

  // Nothing here reacts to a rating any more. The bar says what the town HAS
  // — how many areas are built — and deliberately not what to do next: a
  // single highlighted house turned the map into a to-do list. How far along
  // the route you are lives in the Dom's Lernpfad tab and on the Fernsehturm,
  // where you go to look at progress on purpose.
  return {
    // Kept so the caller can tear the HUD down the same way for every level,
    // even though there is no subscription left to drop.
    destroy() {},
  };
}
