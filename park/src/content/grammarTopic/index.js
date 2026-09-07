import { TOPICS } from "./data.js";
import { noteReviewed } from "../lib/practice.js";
import { makeLevelStore, normalize, wordsPresent } from "../lib/storage.js";
import { coverableTableHtml, wireCoverableTables } from "../lib/tableView.js";

// Generic renderer for a single grammar zone. Everything comes from data, so a
// new grammar topic is a data entry plus flipping that zone to status "built".
const store = makeLevelStore("grammatik:");

export function mount(container, zone) {
  const topic = TOPICS[zone.id];
  if (!topic) {
    container.innerHTML = `<p>Für dieses Thema gibt es noch keinen Inhalt.</p>`;
    return;
  }

  container.innerHTML = `
    <p class="lede measure" id="gt-intro">${topic.intro}</p>
    <div class="tabs" id="gt-tabs"></div>
    <div id="gt-panels"></div>
    <div id="gt-rating"></div>
  `;

  // Three ways in, and inside each one a short stack of pages rather than a
  // single long scroll. A rule you have to hunt for in a column of six is a
  // rule you skim; one rule on the screen with a Weiter button under it is one
  // you read. Same reason the flashcards got a focus mode.
  const tabs = [
    { id: "regeln", label: "Regeln", pages: () => rulePages(zone, topic) },
    { id: "uebungen", label: "Üben", pages: () => exercisePages(zone, topic) },
    { id: "selbstcheck", label: "Selbstcheck", pages: () => selfcheckPages(zone, topic) },
  ];

  const tabsEl = container.querySelector("#gt-tabs");
  const panelsEl = container.querySelector("#gt-panels");
  const pagers = [];

  tabs.forEach((tab) => {
    const pages = tab.pages();
    const btn = document.createElement("button");
    btn.className = "small";
    btn.type = "button";
    // The page count belongs on the choosing screen: "a few pages" is the
    // promise, and knowing whether it is four or eleven is how you decide
    // which one you have time for. It is drawn from a data attribute rather
    // than put in the button, so the button's text stays exactly its label —
    // otherwise every selector and screen reader gets "Regeln6".
    btn.textContent = tab.label;
    btn.dataset.count = String(pages.length);
    btn.dataset.active = "false";
    btn.title = `${tab.label} — ${pages.length} ${pages.length === 1 ? "Seite" : "Seiten"}`;
    btn.addEventListener("click", () => {
      // Tapping the tab you are already on goes back to the overview, which is
      // the only way back to the intro without closing the topic.
      activate(activeTab && activeTab.id === tab.id ? null : tab.id);
    });
    tabsEl.appendChild(btn);
    tab.button = btn;

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.dataset.active = "false";
    panelsEl.appendChild(panel);
    tab.panel = panel;

    tab.pager = createPager(panel, pages, `${zone.id}:page:${tab.id}`);
    if (tab.id === "regeln") wireCoverableTables(panel);
    pagers.push(tab.pager);
  });

  let activeTab = null;

  // The intro is the START of the topic, not a header on top of it. You read it
  // once, choose one of the three, and it goes — otherwise it sits above every
  // rule and every exercise costing most of a phone screen, having already
  // said what it had to say.
  const introEl = container.querySelector("#gt-intro");
  const ratingEl = container.querySelector("#gt-rating");

  function activate(id) {
    activeTab = null;
    tabs.forEach((t) => {
      const on = t.id === id;
      t.button.dataset.active = on ? "true" : "false";
      t.button.setAttribute("aria-expanded", on ? "true" : "false");
      t.panel.dataset.active = on ? "true" : "false";
      if (on) activeTab = t;
    });
    introEl.hidden = !!id;
    // The rating keeps the intro company on the overview. Under a rule or an
    // exercise it is a second thing asking for your attention on a screen that
    // should hold one — and it was asking on all six pages of a tab.
    ratingEl.hidden = !!id;
    // Choosing is a new screenful, and so is going back to the overview.
    const scroller = container.closest(".panel-content") || container.parentElement;
    if (scroller) scroller.scrollTop = 0;
  }

  // Deliberately no tab is open to begin with: the topic opens on what it is
  // about plus the three ways in, and NOT on whichever one happened to be
  // first. Which page you were on inside a tab is still remembered.
  activate(null);

  // Left and right page the visible tab. Ignored while typing, so an answer
  // field still takes its own cursor keys.
  function onKey(e) {
    if (!container.isConnected) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!activeTab) return; // the overview has nothing to page
    if (e.key === "ArrowRight") {
      e.preventDefault();
      activeTab.pager.step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      activeTab.pager.step(-1);
    }
  }
  document.addEventListener("keydown", onKey);

  return {
    // Where the page's rating strip goes. Without this the overlay puts it at
    // the foot of the content, which here means below every page of every tab.
    ratingSlot: ratingEl,
    destroy() {
      document.removeEventListener("keydown", onKey);
    },
  };
}

// ----------------------------------------------------------------- der Pager

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

/**
 * Pages are built once and hidden, never rebuilt: an exercise page holds typed
 * answers and revealed solutions, and re-rendering it on every Weiter would
 * throw that away mid-session.
 *
 * @param pages  [{ title, node }]
 * @param key    where to remember the reader's place
 */
function createPager(host, pages, key) {
  host.innerHTML = "";
  if (!pages.length) {
    host.appendChild(el("p", null, "Für diesen Teil gibt es noch keinen Inhalt."));
    return { step() {}, show() {} };
  }

  const stage = el("div", "pg-stage");
  pages.forEach((p) => {
    const page = el("div", "pg-page");
    page.dataset.active = "false";
    if (p.title) page.appendChild(el("div", "pg-title", p.title));
    page.appendChild(p.node);
    stage.appendChild(page);
    p.el = page;
  });

  const nav = el("div", "pg-nav");
  const prev = el("button", "pg-btn", "<span aria-hidden=\"true\">←</span> Zurück");
  const next = el("button", "pg-btn pg-next", "Weiter <span aria-hidden=\"true\">→</span>");
  prev.type = "button";
  next.type = "button";
  const dots = el("span", "pg-dots");
  pages.forEach((p, i) => {
    const d = el("button", "pg-dot");
    d.type = "button";
    d.title = p.title || `Seite ${i + 1}`;
    d.setAttribute("aria-label", p.title || `Seite ${i + 1}`);
    d.addEventListener("click", () => show(i));
    dots.appendChild(d);
  });
  nav.append(prev, dots, next);
  host.append(stage, nav);

  let at = 0;
  const saved = store.load(key, 0);
  if (Number.isInteger(saved) && saved >= 0 && saved < pages.length) at = saved;

  function show(n) {
    at = Math.max(0, Math.min(pages.length - 1, n));
    pages.forEach((p, i) => {
      p.el.dataset.active = i === at ? "true" : "false";
      dots.children[i].dataset.active = i === at ? "true" : "false";
    });
    prev.disabled = at === 0;
    next.disabled = at === pages.length - 1;
    nav.dataset.single = pages.length === 1 ? "true" : "false";
    store.save(key, at);
    // Paging is a new screenful; keep the reader at the top of it rather than
    // wherever the last page happened to be scrolled to.
    const scroller = host.closest(".panel-content") || host.parentElement;
    if (scroller && scroller.scrollTop > 0) scroller.scrollTop = 0;
  }

  prev.addEventListener("click", () => show(at - 1));
  next.addEventListener("click", () => show(at + 1));
  show(at);

  return {
    step: (by) => show(at + by),
    show,
  };
}

// ---------------------------------------------------------------- Regeln

// One rule per page, then one table per page. A topic's rules are numbered and
// build on each other, which is exactly the shape a stack of pages has and a
// scroll does not.
function rulePages(zone, topic) {
  const pages = topic.rules.map((r) => ({
    title: r.title,
    node: el(
      "div",
      null,
      `<div class="measure rule-box">${r.body}</div>` +
        (r.note ? `<p class="note measure">${r.note}</p>` : "")
    ),
  }));

  // Tables render exactly as they do in the Kölner Dom: a Verdecken button
  // blanks every column but the first, a covered cell reveals itself on click,
  // and "sitzt" writes the same state the Dom counts. Reading a reference table
  // teaches you very little; being asked from it teaches you a lot, and there
  // was no reason that only worked two clicks away in another building.
  //
  // The key matches the Dom's — "<zoneId>:<index>" over topic.tables, which is
  // what tablesOf() there enumerates first — so a tick in either place is the
  // same tick.
  (topic.tables || []).forEach((t, i) => {
    pages.push({
      title: t.caption,
      // The caption is the page title already, so the table's own head would
      // say it twice.
      node: el("div", null, coverableTableHtml({ ...t, caption: "" }, { key: `${zone.id}:${i}` })),
    });
  });

  return pages;
}

// ---------------------------------------------------------------- Übungen

// One exercise per page, with its own check button and score at the foot.
function exercisePages(zone, topic) {
  return topic.exercises.map((ex) => {
    const section = el(
      "div",
      null,
      (ex.lede
        ? `<p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">${ex.lede}</p>`
        : "") + `<div class="measure" id="ex-${ex.id}"></div>`
    );
    const host = section.querySelector(`#ex-${ex.id}`);
    if (ex.kind === "reveal") buildReveal(host, zone, ex);
    else buildGaps(host, section, zone, ex);
    return { title: ex.title, node: section };
  });
}

// Does an answer count?
//
// `answers` is an AND-list: every entry has to appear. That is right for an
// answer made of several words — Dativ's Plural-n asks for "den Kindern" and
// wants both halves.
//
// It is exactly wrong for a list of SYNONYMS, and it was being used for those
// too: ["weil", "da"] silently demanded you type both, so the answer the page
// printed as the solution was marked ✗. Alternatives go in `alt` now, and each
// one is judged by the same rule as `answers`.
//
// A single-entry list must match exactly; a multi-entry one only needs its
// parts present, so a fuller sentence still counts.
function matchesList(value, list) {
  return list.length === 1
    ? normalize(value) === normalize(list[0])
    : wordsPresent(value, list);
}

function accepts(value, item) {
  if (matchesList(value, item.answers)) return true;
  return (item.alt || []).some((a) => matchesList(value, Array.isArray(a) ? a : [a]));
}

// Auto-checked gap fills, same shape as the Day 1 diagnostic.
function buildGaps(host, section, zone, ex) {
  const key = `${zone.id}:${ex.id}`;

  ex.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "item";
    row.dataset.n = item.n;
    row.innerHTML = `
      <div class="n mono">${item.n}</div>
      <div class="body">
        <div class="prompt">${item.prompt}</div>
        <div class="row2">
          <input type="text" id="${ex.id}-in-${item.n}" placeholder="Antwort" autocomplete="off">
          <span class="verdict" id="${ex.id}-v-${item.n}"></span>
        </div>
        <div class="answer-key">Lösung: <b>${item.display || item.answers.join(" ")}</b>${
          item.why ? `<br><span style="font-size:0.85rem">${item.why}</span>` : ""
        }</div>
      </div>
    `;
    host.appendChild(row);
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.innerHTML = `
    <button class="primary" id="${ex.id}-check">Auswertung anzeigen</button>
    <button class="ghost" id="${ex.id}-reset">Zurücksetzen</button>
  `;
  section.appendChild(actions);

  const score = document.createElement("div");
  score.className = "scorebox";
  score.id = `${ex.id}-score`;
  score.innerHTML = `<div class="scoreline"><span class="big mono" id="${ex.id}-score-n">0</span><span class="of">/ ${ex.items.length}</span></div>`;
  section.appendChild(score);

  const saved = store.load(key, {});
  ex.items.forEach((item) => {
    const inp = section.querySelector(`#${ex.id}-in-${item.n}`);
    if (saved[item.n]) inp.value = saved[item.n];
    inp.addEventListener("input", () => {
      const all = store.load(key, {});
      all[item.n] = inp.value;
      store.save(key, all);
    });
  });

  section.querySelector(`#${ex.id}-check`).addEventListener("click", () => {
    let correct = 0;
    ex.items.forEach((item) => {
      const inp = section.querySelector(`#${ex.id}-in-${item.n}`);
      const v = section.querySelector(`#${ex.id}-v-${item.n}`);
      const row = section.querySelector(`#ex-${ex.id} .item[data-n="${item.n}"]`);
      row.dataset.checked = "true";
      const ok = accepts(inp.value, item);
      if (ok) correct++;
      v.textContent = ok ? "✓" : "✗";
      v.className = "verdict " + (ok ? "ok" : "no");
    });
    section.querySelector(`#${ex.id}-score-n`).textContent = correct;
    section.querySelector(`#${ex.id}-score`).dataset.show = "true";
    // Checked answers count as reviewed items, the same as a graded card.
    noteReviewed(ex.items.length);
  });

  section.querySelector(`#${ex.id}-reset`).addEventListener("click", () => {
    store.save(key, {});
    ex.items.forEach((item) => {
      section.querySelector(`#${ex.id}-in-${item.n}`).value = "";
      section.querySelector(`#${ex.id}-v-${item.n}`).textContent = "";
      section.querySelector(`#ex-${ex.id} .item[data-n="${item.n}"]`).dataset.checked = "false";
    });
    section.querySelector(`#${ex.id}-score`).dataset.show = "false";
  });
}

// Free-form answers the learner marks themselves — used where word order
// matters and several phrasings are right.
function buildReveal(host, zone, ex) {
  const key = `${zone.id}:${ex.id}`;
  host.classList.add("reveal-list");

  ex.items.forEach((item) => {
    const el = document.createElement("div");
    el.className = "reveal-item";
    el.dataset.n = item.n;
    el.innerHTML = `
      <div class="frag">${item.n}. ${item.frag}</div>
      <textarea placeholder="Deine Lösung…" rows="1"></textarea>
      <div class="actions"><button class="ghost small reveal-btn">Antwort zeigen</button></div>
      <div class="reveal-panel">Lösung: <b>${item.answer}</b>${
        item.hint ? `<br><span style="color:var(--ink-soft);font-size:0.85rem">${item.hint}</span>` : ""
      }
        <div class="self-mark"><span class="tag">Selbsteinschätzung:</span><button class="small self-ok">richtig</button><button class="small self-no">falsch</button></div>
      </div>
    `;
    host.appendChild(el);

    const ta = el.querySelector("textarea");
    const saved = store.load(key, {});
    if (saved[item.n]) ta.value = saved[item.n].v || "";
    if (saved[item.n] && saved[item.n].mark) {
      el.dataset.open = "true";
      const btn = saved[item.n].mark === "ok" ? el.querySelector(".self-ok") : el.querySelector(".self-no");
      btn.dataset.picked = "true";
    }

    const put = (patch) => {
      const all = store.load(key, {});
      all[item.n] = Object.assign({}, all[item.n], patch);
      store.save(key, all);
    };

    ta.addEventListener("input", () => put({ v: ta.value }));
    el.querySelector(".reveal-btn").addEventListener("click", () => {
      el.dataset.open = "true";
    });
    el.querySelector(".self-ok").addEventListener("click", () => {
      el.querySelector(".self-ok").dataset.picked = "true";
      el.querySelector(".self-no").dataset.picked = "false";
      put({ mark: "ok" });
    });
    el.querySelector(".self-no").addEventListener("click", () => {
      el.querySelector(".self-no").dataset.picked = "true";
      el.querySelector(".self-ok").dataset.picked = "false";
      put({ mark: "no" });
    });
  });
}

// ---------------------------------------------------------------- Selbstcheck

// One question per page — which is what a self-check IS: answer from memory,
// then turn it over. Reading the next question while still writing the last
// answer is the one thing this tab should not let you do.
function selfcheckPages(zone, topic) {
  return topic.selfcheck.map((item, i) => {
    const n = i + 1;
    const node = el(
      "div",
      "sc-item",
      `<p class="q">${item.q}</p>
       <textarea placeholder="Deine Antwort…" rows="3"></textarea>
       <div class="actions"><button type="button" class="ghost small sc-reveal">Antwort zeigen</button></div>
       <div class="reveal-panel">${item.reveal}</div>`
    );
    node.dataset.q = String(n);

    const key = `${zone.id}:sc-${n}`;
    const ta = node.querySelector("textarea");
    ta.value = store.load(key, "");
    ta.addEventListener("input", () => store.save(key, ta.value));
    node.querySelector(".sc-reveal").addEventListener("click", () => {
      node.querySelector(".reveal-panel").style.display = "block";
    });

    return { title: `Frage ${n} von ${topic.selfcheck.length}`, node };
  });
}
