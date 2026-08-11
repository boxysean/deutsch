import {
  computeProgress,
  planStatus,
  getHistory,
  getRange,
  setRange,
  recordToday,
  clearHistory,
  parseISO,
  daysBetween,
} from "../lib/progress.js";

// The Fernsehturm: one screen that answers "am I going to be ready in time?".
//
// Colours are the validated categorical slots — purple for the total, then the
// district trio red → blue → green (that order is adjacent-safe under
// deuteranopia; the map's red/green/blue order is not).
const TOTAL_COLOR = "#8a5cc4";

// Full names read better in prose; the axis needs the short forms.
const MONTHS = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONTHS_SHORT = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

const fmtDate = (iso) => {
  const d = parseISO(iso);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]}`;
};
const fmtNum = (n) => n.toLocaleString("de-DE");

export function mount(container, zone) {
  recordToday();

  container.innerHTML = `
    <p class="lede measure">Der Fernsehturm sieht über die ganze Stadt — und über deinen Lernplan. Jedes gelöste Item, jede sichere Vokabel und jeder Haken in der Checkliste zählt als ein Punkt. Einmal pro Tag wird dein Stand gespeichert, daraus wächst die Kurve.</p>
    <div id="pt-body"></div>
  `;
  const body = container.querySelector("#pt-body");

  function render() {
    const progress = computeProgress();
    const range = getRange();
    const status = planStatus(range, progress);
    const history = getHistory();

    body.innerHTML = `
      ${heroHtml(progress, status, range)}
      ${rangeHtml(range, status)}

      <div class="subhead">Fortschritt über die Zeit</div>
      <p class="measure" style="color:var(--ink-soft);margin-bottom:0.9rem;">
        Punkte insgesamt, vom ${fmtDate(range.start)} bis zum ${fmtDate(range.end)}. Die gestrichelte Linie ist dein Soll — sie läuft gleichmäßig von Kursbeginn bis zum Ziel.
      </p>
      ${chartHtml(progress, status, range, history)}

      <div class="subhead">Wo du stehst</div>
      ${metersHtml(progress)}

      <details class="data-table">
        <summary>Messpunkte als Tabelle (${Object.keys(history).length})</summary>
        ${tableHtml(history, progress)}
      </details>

      <div class="actions" style="margin-top:1.4rem">
        <button class="ghost small" id="pt-refresh">Jetzt neu messen</button>
        <button class="ghost small" id="pt-clear">Verlauf löschen</button>
      </div>
    `;

    wireChart(body, progress, status, range, history);

    body.querySelector("#pt-start").addEventListener("change", (e) => {
      setRange(e.target.value, getRange().end);
      render();
    });
    body.querySelector("#pt-end").addEventListener("change", (e) => {
      setRange(getRange().start, e.target.value);
      render();
    });
    body.querySelector("#pt-refresh").addEventListener("click", () => {
      recordToday();
      render();
    });
    body.querySelector("#pt-clear").addEventListener("click", () => {
      clearHistory();
      recordToday();
      render();
    });
  }

  render();
}

// ------------------------------------------------------------------ headline

function heroHtml(progress, status, range) {
  const pct = Math.round(status.percent * 100);

  // Status is reserved and always ships with an icon and a word, never colour
  // alone.
  let state = { tone: "good", icon: "✓", label: "im Plan" };
  if (!status.started) state = { tone: "neutral", icon: "◷", label: "startet noch" };
  else if (status.delta < -0.02 * progress.total) state = { tone: "warn", icon: "↓", label: "im Rückstand" };
  else if (status.delta > 0.02 * progress.total) state = { tone: "good", icon: "↑", label: "im Vorsprung" };

  const deltaText = !status.started
    ? `Plan beginnt am ${fmtDate(range.start)}`
    : `${status.delta >= 0 ? "+" : "−"}${fmtNum(Math.abs(status.delta))} gegenüber Soll (${fmtNum(status.target)})`;

  return `
    <div class="hero-figure">
      <span class="hero-num">${pct}<span class="hero-unit">%</span></span>
      <span class="hero-cap">${fmtNum(progress.done)} von ${fmtNum(progress.total)} Punkten</span>
    </div>
    <div class="kpi-row">
      <div class="kpi">
        <span class="kpi-label">Status</span>
        <b class="kpi-value" data-tone="${state.tone}">${state.icon} ${state.label}</b>
        <span class="kpi-sub">${deltaText}</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Tage bis zur Prüfung</span>
        <b class="kpi-value">${fmtNum(status.daysLeft)}</b>
        <span class="kpi-sub">von ${fmtNum(status.span)} Tagen Plan</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Pensum ab heute</span>
        <b class="kpi-value">${fmtNum(status.perDay)}</b>
        <span class="kpi-sub">Punkte pro Tag</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Offen</span>
        <b class="kpi-value">${fmtNum(status.remaining)}</b>
        <span class="kpi-sub">Punkte bis 100 %</span>
      </div>
    </div>
  `;
}

function rangeHtml(range) {
  return `
    <div class="range-row">
      <label>Start <input type="date" id="pt-start" value="${range.start}"></label>
      <label>Prüfung <input type="date" id="pt-end" value="${range.end}"></label>
    </div>
  `;
}

// --------------------------------------------------------------------- chart

const W = 720;
const H = 260;
const M = { top: 18, right: 58, bottom: 30, left: 46 };

function chartGeometry(progress, status, range, history) {
  const span = Math.max(1, daysBetween(range.start, range.end));
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const max = Math.max(progress.total, 1);

  const x = (dayIndex) => M.left + (Math.min(Math.max(dayIndex, 0), span) / span) * plotW;
  const y = (value) => M.top + plotH - (Math.min(value, max) / max) * plotH;

  const points = Object.keys(history)
    .sort()
    .filter((d) => d >= range.start && d <= range.end)
    .map((d) => ({ date: d, value: history[d], day: daysBetween(range.start, d) }));

  return { span, plotW, plotH, max, x, y, points };
}

function chartHtml(progress, status, range, history) {
  const g = chartGeometry(progress, status, range, history);
  const { x, y, points, span, plotH, max } = g;

  // Gridlines: hairline, solid, recessive — never dashed.
  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((f) => {
      const yy = y(max * f);
      return `<line class="grid" x1="${M.left}" y1="${yy}" x2="${W - M.right}" y2="${yy}"></line>
              <text class="tick" x="${M.left - 8}" y="${yy + 4}" text-anchor="end">${Math.round(f * 100)}%</text>`;
    })
    .join("");

  // One tick per month boundary inside the window.
  const ticks = [];
  const start = parseISO(range.start);
  const end = parseISO(range.end);
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= end) {
    if (cur >= start) {
      const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-01`;
      ticks.push({ day: daysBetween(range.start, iso), label: MONTHS_SHORT[cur.getMonth()] });
    }
    cur.setMonth(cur.getMonth() + 1);
  }
  const tickMarks = ticks
    .map((t) => `<text class="tick" x="${x(t.day)}" y="${H - M.bottom + 16}" text-anchor="middle">${t.label}</text>`)
    .join("");

  // Soll: a reference line, not a data series — neutral ink, dashed, labelled.
  const sollX1 = x(0);
  const sollY1 = y(status.baseline);
  const sollX2 = x(span);
  const sollY2 = y(max);

  // Heute
  const todayDay = daysBetween(range.start, status.today);
  const todayInside = todayDay >= 0 && todayDay <= span;

  let series = "";
  if (points.length) {
    const line = points.map((p) => `${x(p.day)},${y(p.value)}`).join(" ");
    const last = points[points.length - 1];
    const area = `${x(points[0].day)},${y(0)} ${line} ${x(last.day)},${y(0)}`;
    series = `
      <polygon class="area" points="${area}" fill="${TOTAL_COLOR}"></polygon>
      <polyline class="series" points="${line}" stroke="${TOTAL_COLOR}"></polyline>
      <circle class="end-dot" cx="${x(last.day)}" cy="${y(last.value)}" r="5" fill="${TOTAL_COLOR}"></circle>
      <text class="end-label" x="${x(last.day) + 10}" y="${y(last.value) + 4}">${fmtNum(last.value)}</text>
    `;
  }

  const emptyMsg = status.started
    ? "Noch kein Messpunkt im Planfenster — dein Stand wird ab jetzt täglich gespeichert."
    : `Der Plan startet am ${fmtDate(range.start)}. Ab dann wächst hier deine Kurve.`;
  const empty = points.length
    ? ""
    : `<text class="empty" x="${M.left + 6}" y="${M.top + 20}">${emptyMsg}</text>`;

  return `
    <figure class="chart">
      <svg viewBox="0 0 ${W} ${H}" role="img"
           aria-label="Fortschritt in Punkten vom ${fmtDate(range.start)} bis ${fmtDate(range.end)}: ${fmtNum(
    Math.round(status.percent * (progress.total || 0))
  )} von ${fmtNum(progress.total)} Punkten erreicht.">
        ${grid}
        ${tickMarks}
        <line class="soll" x1="${sollX1}" y1="${sollY1}" x2="${sollX2}" y2="${sollY2}"></line>
        <text class="soll-label" x="${sollX2 + 6}" y="${sollY2 + 4}">Soll</text>
        ${
          todayInside
            ? `<line class="today" x1="${x(todayDay)}" y1="${M.top}" x2="${x(todayDay)}" y2="${M.top + plotH}"></line>
               <text class="today-label" x="${x(todayDay)}" y="${M.top - 6}" text-anchor="middle">heute</text>`
            : ""
        }
        ${series}
        ${empty}
        <line class="crosshair" x1="0" y1="${M.top}" x2="0" y2="${M.top + plotH}" style="display:none"></line>
        <rect class="hit" x="${M.left}" y="${M.top}" width="${g.plotW}" height="${plotH}" fill="transparent" tabindex="0"></rect>
      </svg>
      <div class="chart-tip" hidden></div>
      <figcaption>
        <span class="key"><span class="key-line" style="background:${TOTAL_COLOR}"></span>Ist — gespeicherte Messpunkte</span>
        <span class="key"><span class="key-line dashed"></span>Soll — gleichmäßiger Plan</span>
      </figcaption>
    </figure>
  `;
}

// Crosshair snaps to the nearest day, so the reader aims at a date rather than
// at a 2px line. Keyboard gets the same readout via arrow keys.
function wireChart(root, progress, status, range, history) {
  const fig = root.querySelector(".chart");
  if (!fig) return;
  const svg = fig.querySelector("svg");
  const hit = fig.querySelector(".hit");
  const cross = fig.querySelector(".crosshair");
  const tip = fig.querySelector(".chart-tip");
  const g = chartGeometry(progress, status, range, history);
  let cursor = g.points.length ? g.points.length - 1 : 0;

  function sollAt(day) {
    const climb = Math.max(0, progress.total - status.baseline);
    return Math.round(status.baseline + climb * (Math.min(Math.max(day, 0), g.span) / g.span));
  }

  function show(day) {
    const px = g.x(day);
    cross.setAttribute("x1", px);
    cross.setAttribute("x2", px);
    cross.style.display = "";

    // The reading in force on that day: the last measurement at or before it,
    // so the tooltip always carries both series rather than dropping "Ist"
    // between measurements.
    let held = null;
    g.points.forEach((p) => {
      if (p.day <= day && (!held || p.day > held.day)) held = p;
    });

    const iso = isoForDay(range.start, day);
    const rows = [{ label: "Soll", value: fmtNum(sollAt(day)), dashed: true }];
    if (held) {
      rows.unshift({
        label: held.day === day ? "Ist" : `Ist (Stand ${fmtDate(held.date)})`,
        value: fmtNum(held.value),
        color: TOTAL_COLOR,
      });
    }

    tip.textContent = "";
    const head = document.createElement("div");
    head.className = "tip-head";
    head.textContent = fmtDate(iso);
    tip.appendChild(head);
    rows.forEach((r) => {
      const row = document.createElement("div");
      row.className = "tip-row";
      const key = document.createElement("span");
      key.className = "key-line" + (r.dashed ? " dashed" : "");
      if (r.color) key.style.background = r.color;
      const val = document.createElement("b");
      val.textContent = r.value;
      const lab = document.createElement("span");
      lab.className = "tip-label";
      lab.textContent = r.label;
      row.append(key, val, lab);
      tip.appendChild(row);
    });

    const box = svg.getBoundingClientRect();
    const scale = box.width / W;
    tip.hidden = false;
    const tipW = tip.offsetWidth;
    let left = px * scale + 12;
    if (left + tipW > box.width) left = px * scale - tipW - 12;
    tip.style.left = `${Math.max(0, left)}px`;
    tip.style.top = `${M.top * scale + 8}px`;
  }

  function hide() {
    cross.style.display = "none";
    tip.hidden = true;
  }

  function dayFromEvent(e) {
    const box = svg.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    const f = (vx - M.left) / g.plotW;
    return Math.round(Math.min(Math.max(f, 0), 1) * g.span);
  }

  hit.addEventListener("pointermove", (e) => show(dayFromEvent(e)));
  hit.addEventListener("pointerleave", hide);
  hit.addEventListener("focus", () => show(g.points.length ? g.points[cursor].day : 0));
  hit.addEventListener("blur", hide);
  hit.addEventListener("keydown", (e) => {
    if (!g.points.length) return;
    if (e.key === "ArrowRight") cursor = Math.min(g.points.length - 1, cursor + 1);
    else if (e.key === "ArrowLeft") cursor = Math.max(0, cursor - 1);
    else return;
    e.preventDefault();
    show(g.points[cursor].day);
  });
}

function isoForDay(startIso, day) {
  const d = parseISO(startIso);
  d.setDate(d.getDate() + day);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// -------------------------------------------------------------------- meters

function metersHtml(progress) {
  return `<div class="meters">${progress.groups
    .map((grp) => {
      const pct = grp.total ? Math.round((grp.done / grp.total) * 100) : 0;
      return `
        <div class="meter">
          <div class="meter-head">
            <span class="key-line" style="background:${grp.color}"></span>
            <span class="meter-name">${grp.label}</span>
            <span class="meter-val">${fmtNum(grp.done)} / ${fmtNum(grp.total)}</span>
          </div>
          <div class="meter-track" style="--meter:${grp.color}">
            <div class="meter-fill" style="width:${pct}%; background:${grp.color}"></div>
          </div>
          <div class="meter-pct">${pct} %</div>
        </div>`;
    })
    .join("")}</div>`;
}

// ---------------------------------------------------------------- table view

function tableHtml(history, progress) {
  const dates = Object.keys(history).sort().reverse();
  if (!dates.length) return `<p style="color:var(--ink-soft)">Noch keine Messpunkte.</p>`;
  const rows = dates
    .map((d, i) => {
      const prev = dates[i + 1];
      const delta = prev == null ? null : history[d] - history[prev];
      const pct = progress.total ? Math.round((history[d] / progress.total) * 100) : 0;
      return `<tr><td>${fmtDate(d)}</td><td class="num">${fmtNum(history[d])}</td><td class="num">${pct} %</td><td class="num">${
        delta == null ? "—" : (delta >= 0 ? "+" : "−") + fmtNum(Math.abs(delta))
      }</td></tr>`;
    })
    .join("");
  return `
    <div class="tablewrap">
      <table>
        <thead><tr><th>Datum</th><th>Punkte</th><th>Anteil</th><th>Δ zum Vortag</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
