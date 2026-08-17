import { themesFor } from "../registry.js";
import { getZones } from "../../data/zones/index.js";
import { makeLevelStore } from "../lib/storage.js";
import { createDeck, boxOf, withBox, wordIsSicher, BOXES, SICHER_AT } from "../vocabTheme/deck.js";

// The Brandenburger Tor: one gate, every road through it. A practice session
// drawn from all twenty themes at once, so you are answering words rather than
// answering a topic.
//
// It writes straight back into each theme's own storage — the same boxes, the
// same notes — so a word drilled here is a word drilled in its own house, and
// the progress total sees it immediately.
const store = makeLevelStore("vokabel:");

const SESSION_SIZES = [20, 50, 0]; // 0 = every card

export function mount(container) {
  const THEMES = themesFor();
  const ZONE_NAMES = new Map(getZones().map((z) => [z.id, z.name]));
  const zoneName = (id) => ZONE_NAMES.get(id) || id;
  const themeIds = Object.keys(THEMES);

  // One card per word across every theme, carrying where it came from.
  const state = {};
  themeIds.forEach((id) => {
    state[id] = store.load(`${id}:state`, {}) || {};
  });

  // Every word in every theme, in both directions.
  const words = [];
  themeIds.forEach((themeId) => {
    THEMES[themeId].words.forEach((w, i) => {
      words.push({ themeId, wordId: i, de: w[0], en: w[1], hint: w[2] || "", source: zoneName(themeId) });
    });
  });

  const cardsOf = (w, facing) =>
    Object.assign({}, w, { key: `${w.themeId}:${w.wordId}:${facing}`, facing });

  const getBox = (c) => boxOf(state[c.themeId][c.wordId], c.facing);

  let size = store.load("mixed:size", 20);
  if (SESSION_SIZES.indexOf(size) === -1) size = 20;
  let dir = store.load("mixed:dir", "mixed");

  container.innerHTML = `
    <p class="lede measure">Das Tor führt in alle Richtungen. Hier kommen die Karten aus <b>allen ${
      themeIds.length
    } Wortschatz-Themen</b> gemischt — ohne zu wissen, aus welchem Haus eine Karte stammt, kannst du dich nicht am Thema entlanghangeln. Genau so fragt die Prüfung auch.</p>
    <div class="mixed-head" id="md-head"></div>
    <div id="md-deck" data-active="true"></div>
  `;

  const head = container.querySelector("#md-head");
  const deckHost = container.querySelector("#md-deck");
  let deck = null;

  // Weakest boxes first, then shuffled within the session, so a short session is
  // the words that need it rather than the first twenty alphabetically.
  function pickSession() {
    const facings = dir === "mixed" ? ["de-en", "en-de"] : [dir];
    const pool = [];
    words.forEach((w) => facings.forEach((f) => pool.push(cardsOf(w, f))));
    pool.sort((a, b) => {
      const d = getBox(a) - getBox(b);
      return d !== 0 ? d : Math.random() - 0.5;
    });
    const picked = size === 0 ? pool : pool.slice(0, Math.min(size, pool.length));
    for (let i = picked.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [picked[i], picked[j]] = [picked[j], picked[i]];
    }
    return picked;
  }

  function overallCounts() {
    // Counted per word, not per card: a word is sicher only both ways round.
    const sicher = words.filter((w) => wordIsSicher(state[w.themeId][w.wordId])).length;
    return { sicher, total: words.length };
  }

  function renderHead() {
    const { sicher } = overallCounts();
    head.innerHTML = `
      <div class="mixed-bar">
        <span class="mixed-total">Insgesamt sicher: <b>${sicher}</b> / ${words.length} Wörter aus ${themeIds.length} Themen <span style="color:var(--ink-soft)">(beide Richtungen)</span></span>
        <span class="deck-spacer"></span>
        <span class="seg" role="radiogroup" aria-label="Länge der Session">
          ${SESSION_SIZES.map(
            (n) =>
              `<button class="seg-btn" data-size="${n}" data-picked="${
                n === size
              }">${n === 0 ? "Alle" : n + " Karten"}</button>`
          ).join("")}
        </span>
        <button class="ghost small" id="md-new">Neue Session</button>
      </div>
    `;
    head.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        size = Number(btn.dataset.size);
        store.save("mixed:size", size);
        startSession();
      });
    });
    head.querySelector("#md-new").addEventListener("click", startSession);
  }

  function startSession() {
    if (deck) {
      deck.flushNote();
      deck.destroy();
    }
    const session = pickSession();
    deck = createDeck(deckHost, {
      // The session is fixed when it starts; changing direction inside the deck
      // re-draws from the same pool.
      cardsFor(which) {
        if (which === dir) return session;
        dir = which;
        return pickSession();
      },
      dir,
      setDir(next) {
        dir = next;
        store.save("mixed:dir", next);
      },
      wordCount() {
        const c = overallCounts();
        return { done: c.sicher, total: c.total };
      },
      getBox,
      setBox(c, box) {
        state[c.themeId][c.wordId] = withBox(state[c.themeId][c.wordId], c.facing, box);
        store.save(`${c.themeId}:state`, state[c.themeId]);
      },
      // The theme is hidden on the front and revealed with the answer — knowing
      // the topic in advance is exactly the crutch this session removes.
      showSource: true,
      onChange: renderHead,
    });
    renderHead();
    deck.render();
  }

  startSession();
}

