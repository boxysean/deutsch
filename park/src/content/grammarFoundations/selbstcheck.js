import { save, load } from "./storage.js";

const ITEMS = [
  {
    q: "1",
    question: "Why is <em>Gestern ich habe gearbeitet</em> wrong?",
    reveal:
      "Position 1 is filled by <b>Gestern</b>, so the verb must sit in position 2 and the subject moves behind it: <b>Gestern habe ich gearbeitet.</b> Fronting an adverb without inverting is the classic English-speaker's V2 error.",
  },
  {
    q: "2",
    question: "Where does the prefix of a separable verb go in a main clause? In a question?",
    reveal:
      "To the very end of the clause, closing the Satzklammer — in a statement (<b>Ich rufe dich morgen an.</b>), in a Ja/Nein-question (<b>Kannst du mir helfen?</b> — well, that one's modal+infinitive, but the shape holds), and in a W-question (<b>Wann fängt der Kurs an?</b>). Only the finite verb moves to position 1/2; the prefix always stays last.",
  },
  {
    q: "3",
    question: "Which three verbs must you know perfectly before anything else works?",
    reveal:
      "<b>sein, haben, werden</b> — they carry the Perfekt, the passive, the future, and half the idioms in the language. Automatic recall, no hesitation.",
  },
];

export function mount(container) {
  container.innerHTML =
    `<p class="measure" style="color:var(--ink-soft);margin-bottom:1rem;">Answer without looking back, then reveal.</p>` +
    ITEMS.map(
      (item) => `
      <div class="sc-item" data-q="${item.q}">
        <p class="q">${item.question}</p>
        <textarea placeholder="Deine Antwort…"></textarea>
        <div class="actions"><button class="ghost small sc-reveal">Antwort zeigen</button></div>
        <div class="reveal-panel">${item.reveal}</div>
      </div>
    `
    ).join("") +
    `<p class="measure" style="margin-top:1.6rem;color:var(--ink-soft);font-size:0.9rem;">Then skim tomorrow's topic for two minutes: <strong style="color:var(--ink)">Nominativ & Akkusativ.</strong></p>`;

  container.querySelectorAll(".sc-item").forEach((el) => {
    const q = el.dataset.q;
    const ta = el.querySelector("textarea");
    ta.value = load("sc-" + q, "");
    ta.addEventListener("input", () => save("sc-" + q, ta.value));
    el.querySelector(".sc-reveal").addEventListener("click", () => {
      el.querySelector(".reveal-panel").style.display = "block";
    });
  });
}
