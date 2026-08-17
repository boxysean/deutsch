// The flashcard deck, shared by a single theme's zone and by the mixed session
// at the Brandenburger Tor.
//
// The deck owns no storage of its own: the caller supplies the cards and the
// four accessors for a card's box and note. That is what lets the mixed
// session write straight back into each theme's own state, so a word drilled
// there is a word drilled everywhere.

export const BOXES = 5; // 0..4
export const SICHER_AT = 3; // box 3 and up counts as "sicher"
export const TOP_BOX = BOXES - 1; // "auswendig"

export const GRADES = [
  { id: "again", label: "Nochmal", hint: "Zurück in Box 1", key: "1", delta: null },
  { id: "good", label: "Gut", hint: "Eine Box weiter", key: "2", delta: 1 },
  { id: "easy", label: "Leicht", hint: "Zwei Boxen weiter", key: "3", delta: 2 },
];

// A card missed in this session comes back before the end of it.
const REINSERT_AFTER = 5;

// Entries written before the boxes existed carry only { mastered }. They are
// read at the "sicher" line rather than being sent back to the start — and both
// the per-theme deck and the mixed session must agree on that.
export function boxOf(entry) {
  if (!entry) return 0;
  if (Number.isInteger(entry.box)) return Math.min(BOXES - 1, Math.max(0, entry.box));
  return entry.mastered ? SICHER_AT : 0;
}

export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/**
 * @param host    element to render into
 * @param cfg.cards      [{ key, de, en, note, source? }]
 * @param cfg.getBox/setBox   read and write a card's box
 * @param cfg.getNote/setNote read and write a card's note
 * @param cfg.dir/setDir      current direction and how to persist it
 * @param cfg.onChange        called after any write, for outside counters
 * @param cfg.toolbarExtra    optional HTML appended to the toolbar
 * @param cfg.showSource      reveal which theme a card came from, on the back
 */
export function createDeck(host, cfg) {
  let queue = [];
  let pos = 0;
  let flipped = false;
  let dir = cfg.dir || "de-en";

  const cards = cfg.cards;
  const byKey = new Map(cards.map((c) => [c.key, c]));

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

  // Weakest boxes first, so the words you keep missing lead the deck.
  function buildQueue() {
    queue = cards
      .slice()
      .sort((a, b) => {
        const ba = cfg.getBox(a) || 0;
        const bb = cfg.getBox(b) || 0;
        if (ba !== bb) return ba - bb;
        return 0;
      })
      .map((c) => c.key);
    pos = 0;
    flipped = false;
  }

  function shuffleQueue() {
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    pos = 0;
    flipped = false;
  }

  // In "gemischt" the direction is fixed per position, so paging back and forth
  // never changes a card under you.
  function directionFor(index) {
    if (dir === "de-en" || dir === "en-de") return dir;
    return index % 2 === 0 ? "de-en" : "en-de";
  }

  function current() {
    return byKey.get(queue[Math.min(pos, queue.length - 1)]);
  }

  function render() {
    if (!queue.length) buildQueue();
    if (!cards.length) {
      host.innerHTML = `<p style="color:var(--ink-soft)">Keine Karten in dieser Auswahl.</p>`;
      return;
    }
    const { sicher, byBox } = counts();
    const card = current();
    const facing = directionFor(pos);
    const front = facing === "de-en" ? card.de : card.en;
    const back = facing === "de-en" ? card.en : card.de;
    const box = cfg.getBox(card) || 0;

    host.innerHTML = `
      <div class="deck-bar">
        <span class="deck-count mono">Karte ${pos + 1} / ${queue.length}</span>
        <span class="deck-sicher">Sicher: <b>${sicher}</b> / ${cards.length}</span>
        <span class="deck-spacer"></span>
        <span class="seg" id="dk-dir" role="radiogroup" aria-label="Richtung">
          <button class="seg-btn" data-dir="de-en" data-picked="${dir === "de-en"}">DE → EN</button>
          <button class="seg-btn" data-dir="en-de" data-picked="${dir === "en-de"}">EN → DE</button>
          <button class="seg-btn" data-dir="mixed" data-picked="${dir === "mixed"}">Gemischt</button>
        </span>
        <button class="ghost small" id="dk-shuffle">Mischen</button>
        ${cfg.toolbarExtra || ""}
      </div>

      <div class="deck-boxes" title="Verteilung über die Boxen">
        ${byBox
          .map((n, i) => `<span class="box-chip" data-box="${i}"><b>${n}</b><span>Box ${i + 1}</span></span>`)
          .join("")}
      </div>

      <div class="flashcard" id="dk-card" data-flipped="${flipped}" tabindex="0"
           role="button" aria-label="Karte umdrehen">
        <span class="fc-side mono">${facing === "de-en" ? "Deutsch" : "Englisch"}</span>
        <span class="fc-box mono">Box ${box + 1}</span>
        <div class="fc-front">${escapeHtml(front)}</div>
        <div class="fc-back">
          <div class="fc-answer">${escapeHtml(back)}</div>
          ${card.note ? `<div class="fc-note">${escapeHtml(card.note)}</div>` : ""}
          ${
            cfg.showSource && card.source
              ? `<div class="fc-source">aus <b>${escapeHtml(card.source)}</b></div>`
              : ""
          }
        </div>
        <div class="fc-hint">${flipped ? "" : "Klicken oder Leertaste zum Aufdecken"}</div>
      </div>

      <div class="deck-actions" data-flipped="${flipped}">
        <div class="grade-row">
          ${GRADES.map(
            (g) => `<button class="grade-btn" data-grade="${g.id}"><b>${g.label}</b><span>${g.hint} · ${g.key}</span></button>`
          ).join("")}
        </div>
        <button class="primary reveal-btn" id="dk-flip">Aufdecken <kbd>Leertaste</kbd></button>
      </div>

      <div class="deck-note">
        <label for="dk-note">Deine Notiz zu dieser Karte</label>
        <textarea id="dk-note" rows="2" spellcheck="false"
          placeholder="Eselsbrücke, Beispielsatz, womit du letztes Mal gehadert hast…">${escapeHtml(
            cfg.getNote(card) || ""
          )}</textarea>
        <span class="note-state" id="dk-note-state"></span>
      </div>

      <div class="deck-nav">
        <button class="ghost small" id="dk-prev" ${pos === 0 ? "disabled" : ""}>← Zurück</button>
        <span class="deck-hint">Leertaste umdrehen · 1 / 2 / 3 bewerten · ← → blättern</span>
        <button class="ghost small" id="dk-next" ${pos >= queue.length - 1 ? "disabled" : ""}>Weiter →</button>
      </div>
    `;

    const noteEl = host.querySelector("#dk-note");
    const noteState = host.querySelector("#dk-note-state");
    let noteTimer = null;
    noteEl.addEventListener("input", () => {
      clearTimeout(noteTimer);
      noteState.textContent = "…";
      noteTimer = setTimeout(() => {
        saveNote(card, noteEl.value);
        noteState.textContent = noteEl.value.trim() ? "gespeichert" : "";
      }, 400);
    });
    noteEl.addEventListener("blur", () => {
      clearTimeout(noteTimer);
      saveNote(card, noteEl.value);
    });

    host.querySelector("#dk-card").addEventListener("click", flip);
    host.querySelector("#dk-flip").addEventListener("click", flip);
    host.querySelectorAll(".grade-btn").forEach((btn) => {
      btn.addEventListener("click", () => grade(btn.dataset.grade));
    });
    host.querySelector("#dk-prev").addEventListener("click", () => step(-1));
    host.querySelector("#dk-next").addEventListener("click", () => step(1));
    host.querySelectorAll("#dk-dir .seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        dir = btn.dataset.dir;
        if (cfg.setDir) cfg.setDir(dir);
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

  function saveNote(card, text) {
    cfg.setNote(card, text.trim());
    if (cfg.onChange) cfg.onChange();
  }

  // Anything typed but not yet written is committed before the card changes.
  function flushNote() {
    const el = host.querySelector("#dk-note");
    if (!el) return;
    saveNote(current(), el.value);
  }

  function flip() {
    flushNote();
    flipped = !flipped;
    render();
  }

  function step(by) {
    flushNote();
    pos = Math.min(queue.length - 1, Math.max(0, pos + by));
    flipped = false;
    render();
  }

  function grade(id) {
    const g = GRADES.find((x) => x.id === id);
    if (!g) return;
    flushNote();
    const card = current();
    const box = g.delta === null ? 0 : Math.min(BOXES - 1, (cfg.getBox(card) || 0) + g.delta);
    cfg.setBox(card, box);
    if (cfg.onChange) cfg.onChange();

    if (g.delta === null && queue.length > REINSERT_AFTER) {
      const key = queue[pos];
      queue.splice(pos, 1);
      queue.splice(Math.min(queue.length, pos + REINSERT_AFTER), 0, key);
      flipped = false;
      render();
      return;
    }
    if (pos < queue.length - 1) pos += 1;
    flipped = false;
    render();
  }

  // Self-cleaning: the panel's content is discarded when the page closes, so
  // the listener drops itself once its card is gone from the document.
  function onKey(e) {
    if (!document.body.contains(host)) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (!host.offsetParent && host.dataset.active !== "true") return;
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;

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
      queue = [];
      render();
    },
    flushNote,
    // Callers that build a second deck into the same host must destroy the
    // first, or every keystroke is handled once per deck ever created.
    destroy() {
      document.removeEventListener("keydown", onKey);
    },
  };
}
