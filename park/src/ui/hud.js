import { getZones } from "../data/zones/index.js";
import { CATEGORIES } from "../data/categories.js";
import { routeProgress } from "../content/lib/route.js";
import { onConfidenceChange } from "../content/lib/progress.js";
import { LEVELS, getLevel, setLevel, levelInfo } from "../data/levels.js";

export function initHud(onPick) {
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
      <button type="button" id="hud-next" class="hud-next"></button>
      <div class="hud-progress"><b>${built}</b> / ${learning.length} Gebiete ausgebaut</div>
    </div>
  `;

  hud.querySelectorAll(".lvl-btn").forEach((btn) => {
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", btn.dataset.picked);
    btn.addEventListener("click", () => setLevel(btn.dataset.level));
  });

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
  // Returned so the caller can drop the subscription when it rebuilds the HUD
  // for another level — otherwise every switch leaves a listener repainting a
  // button that is no longer in the document.
  const off = onConfidenceChange(paintNext);
  return {
    destroy() {
      off();
    },
  };
}
