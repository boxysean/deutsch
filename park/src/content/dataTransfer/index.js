import {
  buildExport,
  serialize,
  suggestedFilename,
  parseImport,
  summarize,
  applyImport,
  localKeys,
} from "../lib/transfer.js";
import { recordToday, notifyConfidenceChanged } from "../lib/progress.js";

// The Riesenrad: it goes round and comes back to where it started, which is
// roughly what a save file does. This is the only screen that touches every
// module's storage at once, so it never guesses — it shows what a file holds
// before anything is written, and a replace always offers a backup first.

const fmtNum = (n) => n.toLocaleString("de-DE");

function fmtWhen(iso) {
  if (!iso) return "unbekannt";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unbekannt";
  return d.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
}

export function mount(container) {
  recordToday();

  container.innerHTML = `
    <p class="lede measure">Alles, was du in dieser Stadt einträgst, liegt <b>nur in diesem Browser</b>. Hier packst du es in eine Datei ein — und auf dem anderen Gerät wieder aus. Es geht nichts an einen Server, der Transport bist du.</p>
    <div id="dt-body"></div>
  `;
  const body = container.querySelector("#dt-body");

  // The file chosen for import, kept until it is applied or discarded.
  let staged = null;

  function render() {
    const envelope = buildExport();
    const mine = summarize(envelope);

    body.innerHTML = `
      <div class="subhead" style="margin-top:1.8rem">Exportieren</div>
      <p class="measure" style="color:var(--ink-soft);margin-bottom:0.9rem;">
        Dieser Stand umfasst <b>${fmtNum(mine.keyCount)}</b> gespeicherte ${mine.keyCount === 1 ? "Eintrag" : "Einträge"}${
      mine.measurements
        ? `, darunter ${fmtNum(mine.measurements)} ${mine.measurements === 1 ? "Messpunkt" : "Messpunkte"} im Lernplan`
        : ""
    }. Lade ihn als Datei herunter oder kopiere ihn in die Zwischenablage.
      </p>
      ${areasHtml(mine)}
      <div class="actions" style="margin-top:1rem">
        <button class="primary" id="dt-download">Sicherung herunterladen</button>
        <button class="ghost" id="dt-copy">In die Zwischenablage</button>
      </div>
      <p class="note measure" id="dt-export-note" hidden></p>

      <div class="subhead">Importieren</div>
      <p class="measure" style="color:var(--ink-soft);margin-bottom:0.9rem;">
        Wähle eine Sicherungsdatei oder füge ihren Inhalt unten ein. Du siehst zuerst, was drinsteckt — geschrieben wird erst danach.
      </p>
      <div class="io-row">
        <label class="file-drop">
          <input type="file" id="dt-file" accept="application/json,.json">
          <span>Datei wählen…</span>
        </label>
        <span style="color:var(--ink-soft);font-size:0.8rem">oder einfügen:</span>
      </div>
      <textarea id="dt-paste" class="io-paste" rows="4" placeholder="{ &quot;app&quot;: &quot;deutsche-welt&quot;, … }" spellcheck="false"></textarea>
      <div class="actions" style="margin-top:0.6rem">
        <button class="ghost small" id="dt-read">Eingefügten Text prüfen</button>
      </div>
      <div id="dt-staged"></div>

      <div class="subhead">Gut zu wissen</div>
      <div class="measure rule-box">
        <p><b>Was mitkommt:</b> Vokabelkarten, Grammatikübungen, Tag 1, Lesen, die Prüfungs-Trainer, die Checkliste im Dom sowie Lernplan, Verlauf und Selbsteinschätzung — alles unter dem Namensraum <span class="mono">deutsch-</span>.</p>
        <p><b>Was nicht mitkommt:</b> nichts anderes. Die Datei enthält keine Namen, keine Geräte-Infos und keine Inhalte der App selbst — nur deine Eingaben.</p>
        <p><b>Zwei Wege beim Import:</b> <b>Zusammenführen</b> ergänzt nur Lücken — Messpunkte werden vereinigt, bei Selbsteinschätzungen gewinnt der höhere Wert, und vorhandene Antworten bleiben stehen. <b>Alles ersetzen</b> wirft den Stand in diesem Browser weg und schreibt die Datei — vorher bekommst du eine Sicherung angeboten.</p>
      </div>
    `;

    body.querySelector("#dt-download").addEventListener("click", () => {
      download(envelope);
      note(body, `Datei „${suggestedFilename(envelope)}“ mit ${fmtNum(mine.keyCount)} Einträgen erzeugt.`, "good");
    });

    body.querySelector("#dt-copy").addEventListener("click", async () => {
      const text = serialize(envelope);
      const ok = await copyText(text);
      note(
        body,
        ok
          ? `${fmtNum(mine.keyCount)} Einträge kopiert — auf dem anderen Gerät unten einfügen.`
          : "Kopieren hat nicht geklappt. Lade stattdessen die Datei herunter.",
        ok ? "good" : "warn"
      );
    });

    body.querySelector("#dt-file").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      stage(await file.text(), file.name);
    });

    body.querySelector("#dt-read").addEventListener("click", () => {
      const text = body.querySelector("#dt-paste").value;
      if (!text.trim()) {
        stageError("Das Feld ist leer.");
        return;
      }
      stage(text, "eingefügter Text");
    });

    renderStaged();
  }

  function stage(text, source) {
    const result = parseImport(text);
    if (!result.ok) {
      staged = { error: result.error, source };
    } else {
      staged = { envelope: result.envelope, summary: summarize(result.envelope), source };
    }
    renderStaged();
  }

  function stageError(message) {
    staged = { error: message, source: null };
    renderStaged();
  }

  function renderStaged() {
    const host = body.querySelector("#dt-staged");
    if (!host) return;
    if (!staged) {
      host.innerHTML = "";
      return;
    }
    if (staged.error) {
      host.innerHTML = `<p class="io-status" data-tone="warn">✗ ${staged.error}</p>`;
      return;
    }

    const s = staged.summary;
    host.innerHTML = `
      <div class="io-card">
        <div class="io-card-head">
          <b>Gefundene Sicherung</b>
          <span>${staged.source ? `Quelle: ${staged.source} · ` : ""}exportiert ${fmtWhen(s.exportedAt)}</span>
        </div>
        <div class="io-facts">
          <div><b>${fmtNum(s.keyCount)}</b><span>${s.keyCount === 1 ? "Eintrag" : "Einträge"}</span></div>
          <div><b>${fmtNum(s.measurements)}</b><span>${s.measurements === 1 ? "Messpunkt" : "Messpunkte"}</span></div>
          <div><b>${s.lastPoints === null ? "—" : fmtNum(s.lastPoints)}</b><span>Punkte zuletzt</span></div>
          <div><b>${s.lastConf === null ? "—" : fmtNum(s.lastConf)}</b><span>Selbsteinschätzung</span></div>
          <div><b>${fmtNum(s.ratedTopics)}</b><span>${s.ratedTopics === 1 ? "bewertetes Thema" : "bewertete Themen"}</span></div>
        </div>
        ${areasHtml(s)}
        ${
          s.range
            ? `<p style="font-size:0.8rem;color:var(--ink-soft);margin-top:0.6rem">Lernplan in der Datei: ${s.range.start} bis ${s.range.end}</p>`
            : ""
        }
        <div class="actions" style="margin-top:1rem">
          <button class="primary" id="dt-merge">Zusammenführen</button>
          <button class="ghost" id="dt-replace">Alles ersetzen…</button>
          <button class="ghost" id="dt-discard">Verwerfen</button>
        </div>
        <div id="dt-confirm"></div>
      </div>
    `;

    host.querySelector("#dt-merge").addEventListener("click", () => {
      const res = applyImport(staged.envelope, "merge");
      finish(`Zusammengeführt: ${fmtNum(res.written)} neu übernommen, ${fmtNum(res.merged)} ergänzt.`);
    });

    host.querySelector("#dt-discard").addEventListener("click", () => {
      staged = null;
      renderStaged();
    });

    // Replace is the one destructive action here, so it takes a second click
    // and offers to save the current browser's state first.
    host.querySelector("#dt-replace").addEventListener("click", () => {
      const confirmHost = host.querySelector("#dt-confirm");
      confirmHost.innerHTML = `
        <div class="io-confirm">
          <p><b>Sicher?</b> Der Stand in diesem Browser (${fmtNum(localKeys().length)} Einträge) wird gelöscht und durch die Datei ersetzt.</p>
          <div class="actions">
            <button class="ghost small" id="dt-backup">Erst Sicherung herunterladen</button>
            <button class="small" id="dt-replace-go" data-danger="true">Ja, ersetzen</button>
            <button class="ghost small" id="dt-replace-cancel">Abbrechen</button>
          </div>
        </div>
      `;
      confirmHost.querySelector("#dt-backup").addEventListener("click", () => {
        download(buildExport());
      });
      confirmHost.querySelector("#dt-replace-cancel").addEventListener("click", () => {
        confirmHost.innerHTML = "";
      });
      confirmHost.querySelector("#dt-replace-go").addEventListener("click", () => {
        const res = applyImport(staged.envelope, "replace");
        finish(`Ersetzt: ${fmtNum(res.removed)} Einträge entfernt, ${fmtNum(res.written)} geschrieben.`);
      });
    });
  }

  function finish(message) {
    staged = null;
    // An import can change every rating at once; tell the map so its route
    // marker and score badges follow without a reload.
    notifyConfidenceChanged();
    recordToday();
    render();
    note(body, `✓ ${message} Öffne die Häuser neu, um den übernommenen Stand zu sehen.`, "good");
  }

  render();
}

// ---------------------------------------------------------------- fragments

function areasHtml(summary) {
  if (!summary.areas.length) return `<p style="color:var(--ink-soft)">Noch nichts gespeichert.</p>`;
  return `<div class="io-areas">${summary.areas
    .map((a) => `<span class="io-chip">${a.label}<b>${a.count}</b></span>`)
    .join("")}</div>`;
}

function note(root, message, tone) {
  const el = root.querySelector("#dt-export-note");
  if (!el) return;
  el.textContent = message;
  el.dataset.tone = tone;
  el.hidden = false;
}

// ------------------------------------------------------------------ plumbing

function download(envelope) {
  const blob = new Blob([serialize(envelope)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedFilename(envelope);
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the download has certainly started.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* fall through to the manual path */
  }
  // Fallback for insecure origins and older browsers.
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}
