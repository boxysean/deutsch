import {
  computeProgress,
  computeConfidence,
  setConfidenceFor,
  CONFIDENCE_LEVELS,
  MAX_CONFIDENCE,
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
// Two figures, each validated on its own adjacent pairs:
//   the chart — purple (Fortschritt) + orange (Selbsteinschätzung), which clear
//   every check in both modes; the strokes come from CSS custom properties so
//   the dark steps swap with the theme.
//   the meters — the district trio ordered red → blue → green, adjacent-safe
//   under deuteranopia (the map's own red/green/blue order is not).
const TOTAL_COLOR = "var(--series-progress)";
const CONF_COLOR = "var(--series-confidence)";

// Both measures share one y-axis by being indexed to their own maximum — a
// second y-scale would invent a relationship between points and self-rating.

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
    <p class="lede measure">Der Fernsehturm sieht über die ganze Stadt — und über deinen Lernplan. Zwei Kurven laufen hier nebeneinander: was du <b>gearbeitet</b> hast (jedes gelöste Item, jede sichere Vokabel, jeder Haken zählt als ein Punkt) und wie sicher du dich <b>fühlst</b> (deine eigene Bewertung pro Thema). Einmal pro Tag wird beides gespeichert, daraus wachsen die Kurven.</p>
    <div id="pt-body"></div>
  `;
  const body = container.querySelector("#pt-body");

  function render() {
    const progress = computeProgress();
    const confidence = computeConfidence();
    const range = getRange();
    const status = planStatus(range, progress);
    const history = getHistory();

    body.innerHTML = `
      ${heroHtml(progress, confidence, status, range)}
      ${rangeHtml(range, status)}

      <div class="subhead">Fortschritt über die Zeit</div>
      <p class="measure" style="color:var(--ink-soft);margin-bottom:0.9rem;">
        Vom ${fmtDate(range.start)} bis zum ${fmtDate(range.end)}. Beide Kurven zeigen den Anteil am jeweils eigenen Maximum — ${fmtNum(
        progress.total
      )} Punkte beim Fortschritt, ${fmtNum(
        confidence.total
      )} bei der Selbsteinschätzung — damit sie sich eine Achse teilen können. Die gestrichelte Linie ist dein Soll.
      </p>
      ${chartHtml(progress, confidence, status, range, history)}

      <div class="subhead">Wo du stehst</div>
      ${metersHtml(progress)}

      <div class="subhead">Selbsteinschätzung</div>
      <p class="measure" style="color:var(--ink-soft);margin-bottom:0.9rem;">
        Wie sicher fühlst du dich bei jedem Thema? Das trägst du selbst ein — keine (0), gering (1), mittel (2), hoch (3). Nochmal auf dieselbe Zahl klicken macht die Bewertung rückgängig. ${fmtNum(
          confidence.rated
        )} von ${fmtNum(confidence.zoneCount)} Themen bewertet, ${fmtNum(confidence.done)} von ${fmtNum(
      confidence.total
    )} Punkten. Du kannst auch direkt in jedem Haus bewerten.
      </p>
      ${ratingsHtml(confidence)}

      <details class="data-table">
        <summary>Messpunkte als Tabelle (${Object.keys(history).length})</summary>
        ${tableHtml(history, progress, confidence)}
      </details>

      <div class="actions" style="margin-top:1.4rem">
        <button class="ghost small" id="pt-refresh">Jetzt neu messen</button>
        <button class="ghost small" id="pt-clear">Verlauf löschen</button>
      </div>
    `;

    wireChart(body, progress, confidence, status, range, history);
    wireRatings(body, render);

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

function heroHtml(progress, confidence, status, range) {
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
      <div class="kpi">
        <span class="kpi-label">Selbsteinschätzung</span>
        <b class="kpi-value">${confidence.total ? Math.round((confidence.done / confidence.total) * 100) : 0} %</b>
        <span class="kpi-sub">${fmtNum(confidence.done)} / ${fmtNum(confidence.total)} · ${fmtNum(
      confidence.rated
    )} von ${fmtNum(confidence.zoneCount)} Themen</span>
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

function chartGeometry(progress, confidence, status, range, history) {
  const span = Math.max(1, daysBetween(range.start, range.end));
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const x = (dayIndex) => M.left + (Math.min(Math.max(dayIndex, 0), span) / span) * plotW;
  // y takes a fraction of that series' own maximum, so both curves share one
  // axis without either being rescaled against the other.
  const y = (fraction) => M.top + plotH - Math.min(Math.max(fraction, 0), 1) * plotH;

  const dates = Object.keys(history)
    .sort()
    .filter((d) => d >= range.start && d <= range.end);

  const pointsMax = Math.max(progress.total, 1);
  const confMax = Math.max(confidence.total, 1);

  const points = dates.map((d) => ({
    date: d,
    day: daysBetween(range.start, d),
    value: history[d].p,
    frac: history[d].p / pointsMax,
  }));
  const conf = dates
    .filter((d) => history[d].c !== null)
    .map((d) => ({
      date: d,
      day: daysBetween(range.start, d),
      value: history[d].c,
      frac: history[d].c / confMax,
    }));

  return { span, plotW, plotH, x, y, points, conf, pointsMax, confMax };
}

function chartHtml(progress, confidence, status, range, history) {
  const g = chartGeometry(progress, confidence, status, range, history);
  const { x, y, points, conf, span, plotH } = g;

  // Gridlines: hairline, solid, recessive — never dashed.
  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((f) => {
      const yy = y(f);
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
  const baseFrac = progress.total ? status.baseline / progress.total : 0;
  const sollY1 = y(baseFrac);
  const sollY2 = y(1);

  const todayDay = daysBetween(range.start, status.today);
  const todayInside = todayDay >= 0 && todayDay <= span;

  // End labels are placed to avoid collision: if the two curves finish within
  // a line-height of each other, the lower one drops below its dot.
  const lastP = points[points.length - 1] || null;
  const lastC = conf[conf.length - 1] || null;
  let pOffset = 4;
  let cOffset = 4;
  if (lastP && lastC && Math.abs(y(lastP.frac) - y(lastC.frac)) < 14) {
    if (y(lastP.frac) <= y(lastC.frac)) { pOffset = -6; cOffset = 14; }
    else { pOffset = 14; cOffset = -6; }
  }

  const seriesSvg = (list, cls, offset, withArea) => {
    if (!list.length) return "";
    const line = list.map((p) => `${x(p.day)},${y(p.frac)}`).join(" ");
    const last = list[list.length - 1];
    const area = withArea
      ? `<polygon class="area ${cls}" points="${x(list[0].day)},${y(0)} ${line} ${x(last.day)},${y(0)}"></polygon>`
      : "";
    return `${area}
      <polyline class="series ${cls}" points="${line}"></polyline>
      <circle class="end-dot ${cls}" cx="${x(last.day)}" cy="${y(last.frac)}" r="5"></circle>
      <text class="end-label" x="${x(last.day) + 10}" y="${y(last.frac) + offset}">${Math.round(last.frac * 100)} %</text>`;
  };

  const emptyMsg = status.started
    ? "Noch kein Messpunkt im Planfenster — dein Stand wird ab jetzt täglich gespeichert."
    : `Der Plan startet am ${fmtDate(range.start)}. Ab dann wächst hier deine Kurve.`;
  const empty = points.length
    ? ""
    : `<text class="empty" x="${M.left + 6}" y="${M.top + 20}">${emptyMsg}</text>`;

  const confNote = conf.length
    ? ""
    : `<text class="empty" x="${M.left + 6}" y="${M.top + 38}">Die Selbsteinschätzung erscheint, sobald du unten Themen bewertest.</text>`;

  return `
    <figure class="chart">
      <svg viewBox="0 0 ${W} ${H}" role="img"
           aria-label="Vom ${fmtDate(range.start)} bis ${fmtDate(range.end)}: Fortschritt bei ${Math.round(
    status.percent * 100
  )} Prozent, Selbsteinschätzung bei ${Math.round(
    (confidence.total ? confidence.done / confidence.total : 0) * 100
  )} Prozent.">
        ${grid}
        ${tickMarks}
        <line class="soll" x1="${x(0)}" y1="${sollY1}" x2="${x(span)}" y2="${sollY2}"></line>
        <text class="soll-label" x="${x(span) + 6}" y="${sollY2 + 4}">Soll</text>
        ${
          todayInside
            ? `<line class="today" x1="${x(todayDay)}" y1="${M.top}" x2="${x(todayDay)}" y2="${M.top + plotH}"></line>
               <text class="today-label" x="${x(todayDay)}" y="${M.top - 6}" text-anchor="middle">heute</text>`
            : ""
        }
        ${seriesSvg(conf, "s-conf", cOffset, false)}
        ${seriesSvg(points, "s-progress", pOffset, true)}
        ${empty}
        ${points.length ? confNote : ""}
        <line class="crosshair" x1="0" y1="${M.top}" x2="0" y2="${M.top + plotH}" style="display:none"></line>
        <rect class="hit" x="${M.left}" y="${M.top}" width="${g.plotW}" height="${plotH}" fill="transparent" tabindex="0"></rect>
      </svg>
      <div class="chart-tip" hidden></div>
      <figcaption>
        <span class="key"><span class="key-line" style="background:${TOTAL_COLOR}"></span>Fortschritt — Punkte, in % vom Ziel</span>
        <span class="key"><span class="key-line" style="background:${CONF_COLOR}"></span>Selbsteinschätzung — in % vom Maximum</span>
        <span class="key"><span class="key-line dashed"></span>Soll — gleichmäßiger Plan</span>
      </figcaption>
    </figure>
  `;
}

// Crosshair snaps to the nearest day, so the reader aims at a date rather than
// at a 2px line. Keyboard gets the same readout via arrow keys.
function wireChart(root, progress, confidence, status, range, history) {
  const fig = root.querySelector(".chart");
  if (!fig) return;
  const svg = fig.querySelector("svg");
  const hit = fig.querySelector(".hit");
  const cross = fig.querySelector(".crosshair");
  const tip = fig.querySelector(".chart-tip");
  const g = chartGeometry(progress, confidence, status, range, history);
  let cursor = g.points.length ? g.points.length - 1 : 0;

  function sollAt(day) {
    const climb = Math.max(0, progress.total - status.baseline);
    const f = Math.min(Math.max(day, 0), g.span) / g.span;
    const value = Math.round(status.baseline + climb * f);
    return { value, pct: Math.round((value / g.pointsMax) * 100) };
  }

  // The reading in force on a day: the last measurement at or before it, so the
  // tooltip carries every series rather than dropping one between measurements.
  function held(list, day) {
    let out = null;
    list.forEach((p) => {
      if (p.day <= day && (!out || p.day > out.day)) out = p;
    });
    return out;
  }

  function show(day) {
    const px = g.x(day);
    cross.setAttribute("x1", px);
    cross.setAttribute("x2", px);
    cross.style.display = "";

    const iso = isoForDay(range.start, day);
    const hp = held(g.points, day);
    const hc = held(g.conf, day);
    const soll = sollAt(day);

    const rows = [];
    if (hp) {
      rows.push({
        label: hp.day === day ? "Fortschritt" : `Fortschritt (${fmtDate(hp.date)})`,
        value: `${Math.round(hp.frac * 100)} %`,
        sub: `${fmtNum(hp.value)} Pkt.`,
        color: TOTAL_COLOR,
      });
    }
    if (hc) {
      rows.push({
        label: hc.day === day ? "Selbsteinschätzung" : `Selbsteinschätzung (${fmtDate(hc.date)})`,
        value: `${Math.round(hc.frac * 100)} %`,
        sub: `${fmtNum(hc.value)} / ${fmtNum(g.confMax)}`,
        color: CONF_COLOR,
      });
    }
    rows.push({ label: "Soll", value: `${soll.pct} %`, sub: `${fmtNum(soll.value)} Pkt.`, dashed: true });

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
      const sub = document.createElement("span");
      sub.className = "tip-sub";
      sub.textContent = r.sub;
      row.append(key, val, lab, sub);
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

function tableHtml(history, progress, confidence) {
  const dates = Object.keys(history).sort().reverse();
  if (!dates.length) return `<p style="color:var(--ink-soft)">Noch keine Messpunkte.</p>`;
  const rows = dates
    .map((d, i) => {
      const prev = dates[i + 1];
      const delta = prev == null ? null : history[d].p - history[prev].p;
      const pct = progress.total ? Math.round((history[d].p / progress.total) * 100) : 0;
      const c = history[d].c;
      const cPct = c === null || !confidence.total ? null : Math.round((c / confidence.total) * 100);
      return `<tr>
        <td>${fmtDate(d)}</td>
        <td class="num">${fmtNum(history[d].p)}</td>
        <td class="num">${pct} %</td>
        <td class="num">${delta == null ? "—" : (delta >= 0 ? "+" : "−") + fmtNum(Math.abs(delta))}</td>
        <td class="num">${c === null ? "—" : fmtNum(c)}</td>
        <td class="num">${cPct === null ? "—" : cPct + " %"}</td>
      </tr>`;
    })
    .join("");
  return `
    <div class="tablewrap">
      <table>
        <thead><tr>
          <th>Datum</th><th>Punkte</th><th>Anteil</th><th>Δ zum Vortag</th>
          <th>Selbsteinsch.</th><th>Anteil</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ------------------------------------------------------------- self-rating

const DISTRICT_LABEL = {
  grammar: "Grammatik",
  examskill: "Prüfungsteile",
  vocab: "Wortschatz",
};

function ratingsHtml(confidence) {
  const byCategory = new Map();
  confidence.zones.forEach((z) => {
    if (!byCategory.has(z.category)) byCategory.set(z.category, []);
    byCategory.get(z.category).push(z);
  });

  const groups = ["grammar", "examskill", "vocab"]
    .filter((c) => byCategory.has(c))
    .map((c) => {
      const list = byCategory.get(c);
      const rated = list.filter((z) => z.value !== null);
      const sum = rated.reduce((n, z) => n + z.value, 0);
      const rows = list
        .map(
          (z) => `
        <div class="rate-row" data-zone="${z.id}">
          <span class="rate-name">${z.name}</span>
          <span class="rate-buttons" role="radiogroup" aria-label="Selbsteinschätzung ${z.name}">
            ${CONFIDENCE_LEVELS.map(
              (lvl) => `<button type="button" class="rate-btn" role="radio"
                 aria-checked="${z.value === lvl.value}"
                 data-value="${lvl.value}" data-picked="${z.value === lvl.value}"
                 title="${lvl.value} — ${lvl.label}: ${lvl.hint}">${lvl.value}</button>`
            ).join("")}
          </span>
          <span class="rate-word">${z.value === null ? "—" : CONFIDENCE_LEVELS[z.value].label}</span>
        </div>`
        )
        .join("");
      return `
        <div class="rate-group">
          <div class="rate-head">
            <b>${DISTRICT_LABEL[c] || c}</b>
            <span>${fmtNum(sum)} / ${fmtNum(list.length * MAX_CONFIDENCE)} · ${rated.length} von ${
        list.length
      } bewertet</span>
          </div>
          ${rows}
        </div>`;
    })
    .join("");

  return `<div class="ratings">
    <p class="rate-legend">${CONFIDENCE_LEVELS.map((l) => `<span><b>${l.value}</b> ${l.label}</span>`).join("")}</p>
    ${groups}
  </div>`;
}

function wireRatings(root, rerender) {
  root.querySelectorAll(".rate-row").forEach((row) => {
    const zoneId = row.dataset.zone;
    row.querySelectorAll(".rate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = Number(btn.dataset.value);
        // Clicking the picked level again clears it back to "not yet rated".
        const already = btn.dataset.picked === "true";
        setConfidenceFor(zoneId, already ? null : value);
        recordToday();
        rerender();
      });
    });
  });
}
