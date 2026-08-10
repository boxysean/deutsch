import { save, load } from "./storage.js";

function escapeAttr(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function mount(container) {
  container.innerHTML = `
    <p class="measure" style="color:var(--ink-soft);margin-bottom:0.8rem;">By Day 10 this doc <em>is</em> your syllabus for the intensive. Bring it to the course.</p>
    <div class="tablewrap">
      <table class="journal-table">
        <thead><tr><th>Falsch</th><th>Richtig</th><th>Warum</th><th>Tag</th><th></th></tr></thead>
        <tbody id="journal-body"></tbody>
      </table>
    </div>
    <div class="actions add-row">
      <button class="ghost small" id="journal-add">+ Zeile hinzufügen</button>
    </div>
  `;

  const journalBody = container.querySelector("#journal-body");
  let journal = load("journal", [
    { falsch: "Morgen ich fahre…", richtig: "Morgen fahre ich…", warum: "V2 — Inversion nach Adverb", tag: "1" },
  ]);

  function renderJournal() {
    journalBody.innerHTML = "";
    journal.forEach((row, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" value="${escapeAttr(row.falsch)}" data-field="falsch"></td>
        <td><input type="text" value="${escapeAttr(row.richtig)}" data-field="richtig"></td>
        <td><input type="text" value="${escapeAttr(row.warum)}" data-field="warum"></td>
        <td><input type="text" value="${escapeAttr(row.tag)}" data-field="tag"></td>
        <td><button class="del" title="Löschen">✕</button></td>
      `;
      tr.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", () => {
          journal[idx][inp.dataset.field] = inp.value;
          save("journal", journal);
        });
      });
      tr.querySelector(".del").addEventListener("click", () => {
        journal.splice(idx, 1);
        save("journal", journal);
        renderJournal();
      });
      journalBody.appendChild(tr);
    });
  }

  container.querySelector("#journal-add").addEventListener("click", () => {
    journal.push({ falsch: "", richtig: "", warum: "", tag: "" });
    save("journal", journal);
    renderJournal();
  });

  renderJournal();
}
