import { ZONES } from "../data/zones.js";
import { CATEGORIES } from "../data/categories.js";
import { routeProgress } from "../content/lib/route.js";
import { onConfidenceChange } from "../content/lib/progress.js";

export function initHud(onPick) {
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
    <div class="hud-right">
      <button type="button" id="hud-next" class="hud-next"></button>
      <div class="hud-progress"><b>${built}</b> / ${learning.length} Gebiete ausgebaut</div>
    </div>
  `;

  const nextBtn = hud.querySelector("#hud-next");

  function paintNext() {
    const { next, settled, total } = routeProgress();
    if (!next) {
      nextBtn.innerHTML = `<span class="hud-next-label">Route</span><b>Alles durch — ${settled}/${total}</b>`;
      nextBtn.disabled = true;
      nextBtn.dataset.done = "true";
      return;
    }
    nextBtn.disabled = false;
    nextBtn.dataset.done = "false";
    nextBtn.innerHTML =
      `<span class="hud-next-label">Als Nächstes</span>` +
      `<b>${next.name}</b>` +
      `<span class="hud-next-step mono">${next.order}/${total}</span>`;
    nextBtn.title = `Schritt ${next.order} von ${total} — öffnen`;
    nextBtn.onclick = () => onPick && onPick(next.id);
  }

  paintNext();
  onConfidenceChange(paintNext);
}
