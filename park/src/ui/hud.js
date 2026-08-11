import { ZONES } from "../data/zones.js";
import { CATEGORIES } from "../data/categories.js";

export function initHud() {
  const hud = document.getElementById("hud");
  const learning = ZONES.filter((z) => z.category !== "info");
  const built = learning.filter((z) => z.status === "built").length;

  const legend = Object.keys(CATEGORIES).filter((k) => k !== "info")
    .map((key) => {
      const cat = CATEGORIES[key];
      const hex = "#" + cat.color.toString(16).padStart(6, "0");
      return `<span class="swatch"><span class="dot" style="background:${hex}"></span>${cat.label}</span>`;
    })
    .join("");

  hud.innerHTML = `
    <div class="hud-brand">
      <span class="code mono">ÖSD A2</span>
      <h1 class="display">Deutsche Welt</h1>
    </div>
    <div class="hud-legend">
      ${legend}
      <span class="hud-hint">Ziehen zum Verschieben · Scrollen zum Zoomen · Klick zum Öffnen</span>
    </div>
    <div class="hud-progress"><b>${built}</b> / ${learning.length} Gebiete ausgebaut</div>
  `;
}
