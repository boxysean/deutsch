// The flashcard deck, shared by a single theme's zone and by the mixed session
// at the Brandenburger Tor.
//
// A card is a word IN ONE DIRECTION, and each direction carries its own box.
// DE→EN asks what a German word means; EN→DE asks you to produce the German,
// article and all, which is the only one of the two that tests gender. Knowing
// one direction is not knowing the other, so they are tracked apart.
//
// The deck owns no storage: the caller supplies the cards for a direction and
// the accessors for a card's box. That is what lets the mixed session write
// straight back into each theme's own state.

import { noteReviewed } from "../lib/practice.js";

export const BOXES = 5; // 0..4
export const SICHER_AT = 3; // box 3 and up counts as "sicher"
export const TOP_BOX = BOXES - 1; // "auswendig"

// What the direction switch offers. A vocabulary deck asks a word one way or
// the other; a conjugation deck asks you to PRODUCE a form or to RECOGNISE one.
// Same ladder, same focus mode, different question — so the two directions are
// configuration rather than something the deck hardcodes.
export const DEFAULT_DIRECTIONS = [
  { id: "de-en", label: "DE → EN" },
  { id: "en-de", label: "EN → DE" },
  { id: "mixed", label: "Beide" },
];

export const GRADES = [
  { id: "again", label: "Nochmal", hint: "Zurück in Box 1", key: "1", delta: null },
  { id: "good", label: "Gut", hint: "Eine Box weiter", key: "2", delta: 1 },
  { id: "easy", label: "Leicht", hint: "Zwei Boxen weiter", key: "3", delta: 2 },
];

// A card missed in this session comes back before the end of it.
const REINSERT_AFTER = 5;

// Reads a stored word entry for one direction. Two older shapes exist:
// { mastered } from the first grid, and { box } from the single-direction
// ladder. Neither distinguished the directions, and both meant "I know this
// word", so an old value is honoured for BOTH — otherwise everyone's numbers
// would halve overnight for work they actually did.
export function boxOf(entry, facing) {
  if (!entry) return 0;
  const key = facing === "en-de" ? "rev" : "fwd";
  if (Number.isInteger(entry[key])) return clampBox(entry[key]);
  if (Number.isInteger(entry.box)) return clampBox(entry.box);
  return entry.mastered ? SICHER_AT : 0;
}

export function clampBox(n) {
  return Math.min(BOXES - 1, Math.max(0, n));
}

// A word counts once, and only when it is secure in both directions.
export function wordIsSicher(entry) {
  return boxOf(entry, "de-en") >= SICHER_AT && boxOf(entry, "en-de") >= SICHER_AT;
}

// Writes one direction without disturbing the other.
export function withBox(entry, facing, box) {
  const next = {
    fwd: boxOf(entry, "de-en"),
    rev: boxOf(entry, "en-de"),
  };
  next[facing === "en-de" ? "rev" : "fwd"] = clampBox(box);
  next.mastered = next.fwd >= SICHER_AT && next.rev >= SICHER_AT;
  return next;
}

export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

// The two sides of a card. A caller that knows its own question supplies front,
// back and side directly; the vocabulary decks predate that and are still asked
// in terms of de / en, so their mapping stays here as the fallback.
function facesOf(card) {
  if (card.front != null) {
    // backHtml is markup the CALLER built and escaped — the conjugation drill
    // answers with a six-cell table, which does not survive being a string.
    // Nothing user-typed ever reaches it.
    return {
      front: card.front,
      back: card.back,
      backHtml: card.backHtml || null,
      side: card.side || "",
    };
  }
  const fwd = card.facing === "de-en";
  return {
    front: fwd ? card.de : card.en,
    back: fwd ? card.en : card.de,
    side: fwd ? "Deutsch → Englisch" : "Englisch → Deutsch · mit Artikel",
  };
}

/**
 * @param host    element to render into
 * @param cfg.cardsFor(dir)   the cards for a direction: [{ key, facing, de, en, hint?, source? }]
 * @param cfg.getBox/setBox   read and write a card's box
 * @param cfg.dir/setDir      current direction and how to persist it
 * @param cfg.onChange        called after any write, for outside counters
 * @param cfg.toolbarExtra    optional HTML appended to the toolbar
 * @param cfg.showSource      reveal which theme a card came from, on the back
 * @param cfg.directions      the direction switch's options, default DE→EN / EN→DE / both
 * @param cfg.countLabel      what wordCount() is counting — "Wörter komplett" by default
 * @param cfg.countTitle      the tooltip for it
 */
export function createDeck(host, cfg) {
  let queue = [];
  let pos = 0;
  let flipped = false;
  const directions = cfg.directions || DEFAULT_DIRECTIONS;
  let dir = cfg.dir || directions[0].id;

  let cards = [];
  let byKey = new Map();

  function loadCards() {
    cards = cfg.cardsFor(dir);
    byKey = new Map(cards.map((c) => [c.key, c]));
  }

  function counts() {
    let sicher = 0;
    const byBox = new Array(BOXES).fill(0);
    cards.forEach((c) => {
      const box = Math.min(BOXES - 1, cfg.getBox(c) || 0);
      byBox[box]++;
      if (box >= SICHER_AT) sicher++;
    });
    return { sicher, byBox };
  }

  // Cards from the same word must not follow each other. In "Beide" a word
  // makes two cards, and the answer to one IS the question of the other — meet
  // them back to back and the second is free. The gap is in cards, so a word's
  // two directions are always at least this far apart.
  const SIBLING_GAP = 4;

  // What counts as "the same word". Supplied by the caller, because only the
  // caller knows: a vocabulary card is grouped by its word, a conjugation card
  // by its verb and tense. Without one, a card is its own group and nothing is
  // spread.
  const groupOf = (card) => (card.group != null ? String(card.group) : card.key);

  function shuffleInPlace(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  // Greedy: take the first card whose group has not been seen recently, so the
  // running order is disturbed as little as the gap allows.
  //
  // Near the end of a deck nothing qualifies — the last few cards are all
  // partners of ones just seen, and no order can hold the gap open. Rather
  // than take the next card and land a pair two apart, take the one whose
  // group was seen LONGEST ago, which is the widest gap still available.
  function spreadSiblings(list) {
    const out = [];
    const pending = list.slice();
    const lastAt = new Map();
    const seenAt = (c) => {
      const at = lastAt.get(groupOf(c));
      return at === undefined ? -Infinity : at;
    };
    while (pending.length) {
      let pick = pending.findIndex((c) => out.length - seenAt(c) > SIBLING_GAP);
      if (pick === -1) {
        pick = 0;
        for (let i = 1; i < pending.length; i++) {
          if (seenAt(pending[i]) < seenAt(pending[pick])) pick = i;
        }
      }
      const [card] = pending.splice(pick, 1);
      lastAt.set(groupOf(card), out.length);
      out.push(card);
    }
    return out;
  }

  // Weakest boxes first, so the words you keep missing lead the deck — but
  // shuffled WITHIN a box. Sorting alone was stable, and every card starts in
  // box 1, so the deck came out in the order the caller happened to build it:
  // both directions of word one, then both of word two.
  function orderCards(list) {
    const byBox = new Map();
    list.forEach((c) => {
      const b = cfg.getBox(c) || 0;
      if (!byBox.has(b)) byBox.set(b, []);
      byBox.get(b).push(c);
    });
    const ordered = [];
    [...byBox.keys()]
      .sort((a, b) => a - b)
      .forEach((b) => ordered.push(...shuffleInPlace(byBox.get(b))));
    return spreadSiblings(ordered).map((c) => c.key);
  }

  function buildQueue() {
    queue = orderCards(cards.slice());
    pos = 0;
    flipped = false;
  }

  function shuffleQueue() {
    const list = shuffleInPlace(queue.map((k) => byKey.get(k)).filter(Boolean));
    queue = spreadSiblings(list).map((c) => c.key);
    pos = 0;
    flipped = false;
  }

  function current() {
    return byKey.get(queue[Math.min(pos, queue.length - 1)]);
  }

  // Two views, deliberately separate.
  //
  // SETUP lives in the panel: the counters, the direction switch, the box
  // distribution, and one button that starts a session. It is where you decide
  // what to practise.
  //
  // FOCUS is a fixed layer over everything: one word, one action, nothing else.
  // It exists because practising on a phone through the setup screen meant the
  // card sat below four rows of chrome with the reveal button under the fold.
  // A drill you do for ten minutes at a time should not make you read the
  // instructions again on every card.
  let focusEl = null;

  // --------------------------------------------------------------- setup

  function render() {
    if (!cards.length) loadCards();
    if (!queue.length) buildQueue();
    if (!cards.length) {
      host.innerHTML = `<p style="color:var(--ink-soft)">Keine Karten in dieser Auswahl.</p>`;
      return;
    }
    const { sicher, byBox } = counts();
    const left = queue.length - pos;

    host.innerHTML = `
      <div class="deck-bar">
        <span class="deck-sicher">Diese Auswahl: <b>${sicher}</b> / ${cards.length} sicher</span>
        ${
          cfg.wordCount
            ? (() => {
                const w = cfg.wordCount();
                return `<span class="deck-words" title="${escapeHtml(
                  cfg.countTitle || "Ein Wort zählt erst, wenn beide Richtungen sitzen"
                )}">${escapeHtml(cfg.countLabel || "Wörter komplett")}: <b>${w.done}</b> / ${w.total}</span>`;
              })()
            : ""
        }
        <span class="deck-spacer"></span>
        <span class="seg" id="dk-dir" role="radiogroup" aria-label="Richtung">
          ${directions
            .map(
              (d) =>
                `<button class="seg-btn" data-dir="${d.id}" data-picked="${dir === d.id}"${
                  d.title ? ` title="${escapeHtml(d.title)}"` : ""
                }>${escapeHtml(d.label)}</button>`
            )
            .join("")}
        </span>
        <button class="ghost small" id="dk-shuffle">Mischen</button>
        ${cfg.toolbarExtra || ""}
      </div>

      <div class="deck-boxes" title="Verteilung über die Boxen">
        ${byBox
          .map((n, i) => `<span class="box-chip" data-box="${i}"><b>${n}</b><span>Box ${i + 1}</span></span>`)
          .join("")}
      </div>

      <div class="deck-start">
        <button class="primary big" id="dk-start">Üben starten</button>
        <span class="deck-start-note">${
          left === queue.length
            ? `${queue.length} Karten in dieser Runde`
            : `weiter bei Karte ${pos + 1} von ${queue.length}`
        }</span>
      </div>
    `;

    host.querySelector("#dk-start").addEventListener("click", enterFocus);
    host.querySelectorAll("#dk-dir .seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        flushNote();
        dir = btn.dataset.dir;
        if (cfg.setDir) cfg.setDir(dir);
        // A direction is a different set of cards, not a different view of the
        // same ones, so the deck is rebuilt rather than re-rendered.
        loadCards();
        queue = [];
        flipped = false;
        render();
      });
    });
    host.querySelector("#dk-shuffle").addEventListener("click", () => {
      flushNote();
      shuffleQueue();
      render();
    });
    if (cfg.wireToolbar) cfg.wireToolbar(host);
  }

  // --------------------------------------------------------------- focus

  // Counted per session so the summary can say something true about the run
  // you just did, rather than repeating the lifetime totals.
  let run = { seen: 0, again: 0 };

  function enterFocus() {
    if (focusEl) return;
    run = { seen: 0, again: 0 };
    flipped = false;
    focusEl = document.createElement("div");
    focusEl.className = "deck-focus";
    focusEl.setAttribute("role", "dialog");
    focusEl.setAttribute("aria-label", "Vokabeltraining");
    document.body.appendChild(focusEl);
    document.body.dataset.deckFocus = "true";
    renderFocus();
  }

  function exitFocus() {
    if (!focusEl) return;
    flushNote();
    focusEl.remove();
    focusEl = null;
    delete document.body.dataset.deckFocus;
    // Closing the page while a session runs destroys the deck, which detaches
    // the host; rendering the setup view into it then would be writing to a
    // node nobody can see.
    if (host.isConnected) render();
    if (cfg.onChange) cfg.onChange();
  }

  function renderFocus() {
    if (!focusEl) return;
    if (pos >= queue.length) return renderSummary();

    const card = current();
    const { front, back, backHtml, side } = facesOf(card);
    const box = cfg.getBox(card) || 0;
    const done = pos;

    focusEl.innerHTML = `
      <header class="fx-top">
        <span class="fx-progress mono">${pos + 1} / ${queue.length}</span>
        <span class="fx-rail"><span class="fx-rail-fill" style="width:${(done / queue.length) * 100}%"></span></span>
        <span class="fx-box mono">Box ${box + 1}</span>
        <button class="fx-close" id="fx-close" aria-label="Training beenden">&times;</button>
      </header>

      <main class="fx-card" id="fx-card" data-flipped="${flipped}" role="button" tabindex="0"
            aria-label="${flipped ? "Karte" : "Antippen zum Aufdecken"}">
        <div class="fx-prompt">
          <span class="fx-side mono">${escapeHtml(side)}</span>
          <div class="fx-word">${escapeHtml(front)}</div>
        </div>
        <div class="fx-answer" ${flipped ? "" : "hidden"}>
          <div class="fx-back">${backHtml || escapeHtml(back)}</div>
          ${card.hint ? `<div class="fx-hint-note">${escapeHtml(card.hint)}</div>` : ""}
          ${
            cfg.showSource && card.source
              ? `<div class="fx-source">aus <b>${escapeHtml(card.source)}</b></div>`
              : ""
          }
        </div>
        ${flipped ? "" : `<div class="fx-tap">Antippen zum Aufdecken</div>`}
      </main>

      <footer class="fx-actions" data-flipped="${flipped}">
        ${
          flipped
            ? GRADES.map(
                (g) =>
                  `<button class="fx-grade" data-grade="${g.id}"><b>${g.label}</b><span>${g.hint}</span></button>`
              ).join("")
            : `<button class="primary fx-reveal" id="fx-flip">Aufdecken</button>`
        }
      </footer>
    `;

    focusEl.querySelector("#fx-close").addEventListener("click", exitFocus);
    focusEl.querySelector("#fx-card").addEventListener("click", flip);
    const flipBtn = focusEl.querySelector("#fx-flip");
    if (flipBtn) flipBtn.addEventListener("click", (e) => { e.stopPropagation(); flip(); });
    focusEl.querySelectorAll(".fx-grade").forEach((btn) => {
      btn.addEventListener("click", () => grade(btn.dataset.grade));
    });
  }

  function renderSummary() {
    const { sicher } = counts();
    focusEl.innerHTML = `
      <header class="fx-top">
        <span class="fx-progress mono">fertig</span>
        <span class="fx-rail"><span class="fx-rail-fill" style="width:100%"></span></span>
        <button class="fx-close" id="fx-close" aria-label="Schließen">&times;</button>
      </header>
      <main class="fx-done">
        <div class="fx-done-big">${run.seen}</div>
        <p class="fx-done-lead">Karten in dieser Runde</p>
        <p class="fx-done-sub">${
          run.again
            ? `<b>${run.again}</b> davon noch einmal — die kommen als Erstes zurück.`
            : "Alles auf Anhieb gewusst."
        }</p>
        <p class="fx-done-sub">Diese Auswahl: <b>${sicher}</b> / ${cards.length} sicher</p>
      </main>
      <footer class="fx-actions">
        <button class="primary fx-reveal" id="fx-again">Noch eine Runde</button>
        <button class="ghost fx-reveal" id="fx-stop">Fertig</button>
      </footer>
    `;
    focusEl.querySelector("#fx-close").addEventListener("click", exitFocus);
    focusEl.querySelector("#fx-stop").addEventListener("click", exitFocus);
    focusEl.querySelector("#fx-again").addEventListener("click", () => {
      run = { seen: 0, again: 0 };
      shuffleQueue();
      renderFocus();
    });
  }

  // One repaint entry point: whichever view is up gets redrawn.
  function paint() {
    if (focusEl) renderFocus();
    else render();
  }

  // Kept as a no-op hook so callers can flush their own pending edits.
  function flushNote() {
    if (cfg.onLeaveCard) cfg.onLeaveCard();
  }

  function flip() {
    flushNote();
    flipped = !flipped;
    paint();
  }

  function step(by) {
    flushNote();
    pos = Math.min(queue.length - 1, Math.max(0, pos + by));
    flipped = false;
    paint();
  }

  function grade(id) {
    const g = GRADES.find((x) => x.id === id);
    if (!g) return;
    flushNote();
    const card = current();
    const box = g.delta === null ? 0 : Math.min(BOXES - 1, (cfg.getBox(card) || 0) + g.delta);
    cfg.setBox(card, box);
    if (cfg.onChange) cfg.onChange();

    run.seen += 1;
    if (g.delta === null) run.again += 1;
    // Minutes alone say nothing about whether anything was answered, so the
    // practice log counts graded cards beside the clock.
    noteReviewed(1);

    if (g.delta === null && queue.length > REINSERT_AFTER) {
      const key = queue[pos];
      queue.splice(pos, 1);
      queue.splice(Math.min(queue.length, pos + REINSERT_AFTER), 0, key);
      flipped = false;
      paint();
      return;
    }
    // Past the last card, pos lands on queue.length — in focus mode that is
    // what shows the summary instead of clamping onto the final card forever.
    pos += 1;
    flipped = false;
    if (!focusEl) pos = Math.min(pos, queue.length - 1);
    paint();
  }

  // Self-cleaning: the panel's content is discarded when the page closes, so
  // the listener drops itself once its card is gone from the document.
  function onKey(e) {
    if (!document.body.contains(host) && !focusEl) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;

    if (focusEl) {
      if (e.key === "Escape") {
        e.preventDefault();
        exitFocus();
        return;
      }
    } else if (!host.offsetParent && host.dataset.active !== "true") {
      return;
    }

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flip();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (flipped && ["1", "2", "3"].indexOf(e.key) !== -1) {
      e.preventDefault();
      grade(GRADES[Number(e.key) - 1].id);
    }
  }
  document.addEventListener("keydown", onKey);

  return {
    render,
    rebuild() {
      loadCards();
      queue = [];
      paint();
    },
    flushNote,
    // Callers that build a second deck into the same host must destroy the
    // first, or every keystroke is handled once per deck ever created.
    destroy() {
      document.removeEventListener("keydown", onKey);
      // The focus layer lives on <body>, not in the panel, so closing the page
      // would otherwise leave a full-screen drill floating over the map.
      if (focusEl) {
        focusEl.remove();
        focusEl = null;
        delete document.body.dataset.deckFocus;
      }
    },
  };
}
