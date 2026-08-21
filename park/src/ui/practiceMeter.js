import {
  getGoalMinutes,
  liveTodaySeconds,
  computeStreak,
  onPracticeChange,
} from "../content/lib/practice.js";

// The daily meter in the HUD bar.
//
// This reports what you DID; it does not tell you what to do. That distinction
// is why the old "Als Nächstes" button is gone — a single highlighted house
// turned the map into a to-do list — and it is the line this widget stays on
// the right side of. No modal, no toast, no red when you are behind: a ring
// that fills as you work and a count of consecutive days. If it is at zero,
// that is the nudge, and it is the honest one.

const R = 9;
const C = 2 * Math.PI * R;

function fmt(sec) {
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}`;
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}

export function initPracticeMeter(onOpen) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "practice-meter";
  el.addEventListener("click", () => onOpen && onOpen());

  function paint() {
    const goal = getGoalMinutes();
    const sec = liveTodaySeconds();
    const min = Math.floor(sec / 60);
    const done = sec >= goal * 60;
    const frac = Math.max(0, Math.min(1, sec / (goal * 60)));
    const { current } = computeStreak();

    el.dataset.done = String(done);
    el.title = done
      ? `Heute ${min} Minuten geübt — Tagesziel ${goal} Minuten erreicht. Zum Fernsehturm.`
      : `Heute ${min} von ${goal} Minuten geübt. Zählt nur, während eine Übungsseite offen ist. Zum Fernsehturm.`;

    el.innerHTML = `
      <svg class="pm-ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="pm-track" cx="12" cy="12" r="${R}"></circle>
        <circle class="pm-fill" cx="12" cy="12" r="${R}"
          stroke-dasharray="${C.toFixed(2)}"
          stroke-dashoffset="${(C * (1 - frac)).toFixed(2)}"></circle>
      </svg>
      <span class="pm-text">
        <b class="mono">${fmt(sec)}</b><span class="pm-goal mono">/ ${goal}<span class="pm-long"> Min</span></span>
      </span>
      ${
        current > 0
          ? `<span class="pm-streak mono" title="${current} Tage in Folge das Tagesziel erreicht">${current}<span class="pm-long">Tage</span><span class="pm-short" aria-hidden="true">T</span></span>`
          : ""
      }
    `;
    el.setAttribute(
      "aria-label",
      `Heute ${min} von ${goal} Minuten geübt${current ? `, ${current} Tage in Folge` : ""}`
    );
  }

  paint();
  const off = onPracticeChange(paint);
  return {
    el,
    destroy() {
      off();
      el.remove();
    },
  };
}
