import { ZONES } from "../../data/zones.js";
import { makeStore } from "../lib/storage.js";
import { DISTRICT } from "../../iso/palette.js";
import { route, isSettled, nextZone, routeProgress } from "../lib/route.js";
import { getRange, daysBetween } from "../lib/progress.js";

// The Dom on the town square. Not a learning zone — it explains what this is,
// what the ÖSD Zertifikat A2 actually asks of you, and what you still have to
// master. The checklist is the only part that stores anything.
const store = makeStore("deutsch-info:");

// Everything the exam expects, grouped the way the exam itself is structured.
// Sources: ÖSD Zertifikat A2 Durchführungsbestimmungen (Okt. 2023) and the
// official Modellsatz.
const MASTERY = [
  {
    group: "Grammatik — Kasus und Artikel",
    items: [
      ["nom-akk", "Nominativ und Akkusativ sicher unterscheiden (der → den, ein → einen)"],
      ["dativ", "Dativ bilden — auch im Plural (den Kindern)"],
      ["artikel", "Bestimmte, unbestimmte und Negativartikel deklinieren (kein-)"],
      ["possessiv", "Possessivartikel: mein, dein, sein, ihr … in allen drei Kasus"],
      ["personalpron", "Personalpronomen im Akkusativ und Dativ (mich/mir, ihn/ihm)"],
    ],
  },
  {
    group: "Grammatik — Präpositionen",
    items: [
      ["praep-akk", "Präpositionen mit Akkusativ: für, ohne, gegen, um, durch"],
      ["praep-dat", "Präpositionen mit Dativ: mit, nach, bei, seit, von, zu, aus"],
      ["wechsel", "Wechselpräpositionen: Akkusativ bei wohin?, Dativ bei wo?"],
      ["verb-praep", "Verben mit fester Präposition (warten auf, Angst haben vor)"],
      ["da-wo", "da(r)- und wo(r)- für Sachen, Präposition + Pronomen für Personen"],
    ],
  },
  {
    group: "Grammatik — Verben und Zeiten",
    items: [
      ["praesens", "Präsens inkl. Stammwechsel (fahren → du fährst, geben → du gibst)"],
      ["modal", "Alle sechs Modalverben im Präsens und Präteritum"],
      ["trennbar", "Trennbare und untrennbare Verben, Präfix am Satzende"],
      ["perfekt", "Perfekt mit haben und sein, Partizip II regelmäßig und unregelmäßig"],
      ["praeteritum", "Präteritum von sein, haben und den Modalverben"],
      ["reflexiv", "Reflexive Verben (sich freuen, sich interessieren)"],
      ["imperativ", "Imperativ: du-, ihr- und Sie-Form"],
      ["konjunktiv", "Höflichkeitsformen: möchte, könnte, hätte gern, würde"],
    ],
  },
  {
    group: "Grammatik — Satzbau",
    items: [
      ["v2", "Verb an Position 2, Subjekt rückt hinter das Verb"],
      ["klammer", "Satzklammer: zweiter Verbteil ans Satzende"],
      ["neben", "Nebensätze mit weil, dass, wenn, ob — Verb ganz am Ende"],
      ["fragen", "W-Fragen und Ja/Nein-Fragen"],
      ["tmp", "Reihenfolge im Mittelfeld: temporal – modal – lokal"],
      ["adjektiv", "Adjektivendungen nach der-, ein- und Nullartikel"],
      ["vergleich", "Komparativ und Superlativ, auch unregelmäßig (gut/besser/am besten)"],
    ],
  },
  {
    group: "Wortschatz — die Themenfelder",
    items: [
      ["w-person", "Person, Familie, Wohnen, Alltag"],
      ["w-versorgung", "Einkaufen, Essen und Trinken, Geld und Preise"],
      ["w-koerper", "Körper, Gesundheit, beim Arzt"],
      ["w-arbeit", "Arbeit, Beruf, Ausbildung, Sprachen lernen"],
      ["w-freizeit", "Freizeit, Reisen, Verkehr, Orientierung in der Stadt"],
      ["w-umfeld", "Wetter, Termine, Feste, Medien, Umwelt, Heimat"],
      ["w-at", "Österreichische Varianten: Semmel, Erdapfel, Paradeiser, Obers, Jänner"],
    ],
  },
  {
    group: "Prüfungsfertigkeiten",
    items: [
      ["f-lesen", "Lesen: Kurztexte Überschriften zuordnen, Detailfragen zu einem längeren Text"],
      ["f-hoeren", "Hören: Notizen zu einer Durchsage, Mehrfachauswahl, Interview mit fünf Personen"],
      ["f-schreiben", "Schreiben: Antwort-E-Mail von ca. 50 Wörtern, alle vier Leitpunkte abdecken"],
      ["f-anrede", "Anrede und Gruß richtig wählen (Liebe/Lieber …, Liebe Grüße)"],
      ["f-vorstellen", "Sprechen 1: sich zu fünf von sechs Themen frei vorstellen"],
      ["f-planen", "Sprechen 2: gemeinsam etwas planen, Vorschläge machen und reagieren"],
      ["f-redemittel", "Redemittel: Vorschlag, Zustimmung, Ablehnung, Nachfragen"],
    ],
  },
];

const EXAM = [
  ["Lesen", "2 Aufgaben · 10 Items", "30 Min", "25 Punkte", "min. 5"],
  ["Hören", "3 Aufgaben · 14 Items", "ca. 15 Min", "30 Punkte", "min. 6"],
  ["Schreiben", "1 Aufgabe", "30 Min", "15 Punkte", "—"],
  ["Sprechen", "2 Aufgaben", "ca. 10 Min", "20 Punkte", "min. 10"],
];

export function mount(container, zone) {
  const total = MASTERY.reduce((n, g) => n + g.items.length, 0);

  container.innerHTML = `
    <p class="lede measure">Willkommen in <strong>Deutsche Welt</strong> — einer kleinen Alpenstadt, in der jedes Haus ein Thema der ÖSD-A2-Prüfung ist. Dieser Dom am Hauptplatz erklärt das Spiel, die Prüfung und alles, was du zum Bestehen können musst.</p>
    <div class="tabs" id="ih-tabs"></div>
    <div id="ih-panels"></div>
  `;

  const tabs = [
    { id: "spiel", label: "Das Spiel", html: gameHtml() },
    { id: "pruefung", label: "Die Prüfung", html: examHtml() },
    { id: "koennen", label: "Was du können musst", html: masteryHtml(total) },
    { id: "route", label: "Lernpfad", html: routeHtml() },
  ];

  const tabsEl = container.querySelector("#ih-tabs");
  const panelsEl = container.querySelector("#ih-panels");

  tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "small";
    btn.textContent = tab.label;
    btn.dataset.active = "false";
    btn.addEventListener("click", () => activate(tab.id));
    tabsEl.appendChild(btn);
    tab.button = btn;

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.dataset.active = "false";
    panel.innerHTML = tab.html;
    panelsEl.appendChild(panel);
    tab.panel = panel;
  });

  function activate(id) {
    tabs.forEach((t) => {
      const on = t.id === id;
      t.button.dataset.active = on ? "true" : "false";
      t.panel.dataset.active = on ? "true" : "false";
    });
  }
  activate(tabs[0].id);

  wireChecklist(container, total);
}

function gameHtml() {
  const built = ZONES.filter((z) => z.category !== "info" && z.status === "built");
  const learning = ZONES.filter((z) => z.category !== "info");

  return `
    <div class="subhead" style="margin-top:0">So funktioniert es</div>
    <div class="measure rule-box">
      <p>Die Stadt hat drei Viertel, und jedes Haus darin ist ein Lernthema:</p>
      <p><b style="color:#d92b3a">Grammatik</b> — die Straße hinauf zum Grammatik-Fundament.<br>
         <b style="color:#1f9e52">Wortschatz</b> — die lange Straße mit den Themenfeldern.<br>
         <b style="color:#2f6fd0">Prüfungsteile</b> — Lesen, Hören, Schreiben, Sprechen.</p>
      <p>Klicke ein Haus an: unten öffnet sich eine kurze Vorschau mit deinem Fortschritt. Über <em>Ausführlich öffnen</em> kommst du zu Regeln und Übungen.</p>
    </div>

    <div class="subhead">Bedienung</div>
    <div class="measure rule-box">
      <p><b>Ziehen</b> — Karte verschieben · <b>Scrollen</b> — zoomen · <b>Klick</b> — Haus öffnen</p>
      <p>Häuser mit einem goldenen Ring sind fertig ausgebaut — inzwischen sind das alle. Blasse Häuser gäbe es nur, wenn ein Thema noch auf Inhalt wartet.</p>
      <p>Zwei Denkmäler kannst du anklicken: der <b>Fernsehturm</b> zeigt deinen Fortschritt, das <b>Riesenrad</b> nimmt deine Daten mit auf ein anderes Gerät. Kölner Dom, Brandenburger Tor, Neuschwanstein und Matterhorn sind reine Dekoration.</p>
      <p>Das Haus mit der <b>goldenen Fahne</b> ist dein nächster Schritt auf dem Lernpfad — oben in der Leiste steht es auch. Den ganzen Pfad siehst du im Tab <em>Lernpfad</em>.</p>
    </div>

    <div class="subhead">Dein Fortschritt</div>
    <div class="measure rule-box">
      <p><b>${built.length} von ${learning.length}</b> Gebieten sind ausgebaut.</p>
      <p>Alles, was du einträgst, wird <b>nur lokal in diesem Browser</b> gespeichert (localStorage). Es gibt kein Konto, nichts wird hochgeladen. Auf einem anderen Gerät oder in einem anderen Browser fängst du deshalb bei null an, und wenn du die Websitedaten löschst, ist der Fortschritt weg.</p>
    </div>
  `;
}

// The whole route in one place, spread across the weeks of the plan window.
// The map only ever shows the next step; this is where you see the shape.
function routeHtml() {
  const steps = route();
  const prog = routeProgress();
  const next = nextZone();
  const range = getRange();

  const days = Math.max(7, daysBetween(range.start, range.end));
  const weeks = Math.max(1, Math.round(days / 7));
  const perWeek = Math.ceil(steps.length / weeks);

  const CAT = { grammar: "Grammatik", vocab: "Wortschatz", examskill: "Prüfungsteil" };

  let html = `
    <div class="measure rule-box">
      <p>Eine feste Reihenfolge — sie ändert sich nicht, damit du immer weißt, wo du stehst. <b>Grammatik</b> trägt die Abhängigkeiten: erst die Satzklammer, dann die Fälle, dann alles, was auf ihnen aufbaut. <b>Wortschatz</b> hat keine Reihenfolge, deshalb stehen die Themen vorne, nach denen die Prüfung sicher fragt. Die <b>Prüfungsteile</b> kommen früh statt erst im Dezember.</p>
      <p>Ein Thema gilt als erledigt, sobald du es mit <b>2 (mittel)</b> oder <b>3 (hoch)</b> bewertest — dann rückt der Pfad weiter. Du musst dich nicht daran halten: die Reihenfolge ist ein Vorschlag, keine Sperre.</p>
      <p><b>${prog.settled} von ${prog.total}</b> Schritten erledigt${
        next ? ` · als Nächstes: <b>${next.name}</b> (Schritt ${next.order})` : " — alles durch."
      }</p>
    </div>
  `;

  for (let w = 0; w < weeks; w++) {
    const slice = steps.slice(w * perWeek, (w + 1) * perWeek);
    if (!slice.length) break;
    html += `<div class="route-week"><h4>Woche ${w + 1}</h4>` +
      slice
        .map((z) => {
          const state = isSettled(z.id) ? "settled" : next && next.id === z.id ? "next" : "open";
          return `<div class="route-step" data-state="${state}">
            <span class="n mono">${z.order}</span>
            <span class="dot" style="background:${DISTRICT[z.category].label}"></span>
            <span class="name">${z.name}</span>
            <span class="cat">${state === "next" ? "als Nächstes" : CAT[z.category] || ""}</span>
          </div>`;
        })
        .join("") +
      `</div>`;
  }

  return html;
}

function examHtml() {
  const rows = EXAM.map(
    (r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="num">${r[2]}</td><td class="num">${r[3]}</td><td class="num">${r[4]}</td></tr>`
  ).join("");

  return `
    <div class="subhead" style="margin-top:0">ÖSD Zertifikat A2 — Aufbau</div>
    <div class="measure rule-box">
      <p>Die Prüfung besteht aus <b>zwei Modulen</b>, die man einzeln oder zusammen ablegen kann:</p>
      <p><b>Schriftliche Prüfung</b> (Gruppenprüfung) mit Lesen, Hören und Schreiben — zusammen ca. <b>75 Minuten</b>.<br>
         <b>Mündliche Prüfung</b> (Einzel- oder Paarprüfung) — ca. <b>10 Minuten</b>, dazu 10 Minuten Vorbereitung.</p>
      <p>Wörterbücher sind nicht erlaubt. Jedes Modul kann beliebig oft wiederholt werden.</p>
    </div>

    <div class="tablewrap">
      <table>
        <thead><tr><th>Teil</th><th>Umfang</th><th>Dauer</th><th>Punkte</th><th>Mindestens</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="subhead">Bestehen</div>
    <div class="measure rule-box">
      <p>Schriftliche Prüfung: <b>35 von 70 Punkten</b> (50 %) — <em>und</em> die Mindestpunktzahl in Lesen und Hören. Wer dort darunter bleibt, hat das ganze Modul nicht bestanden, egal wie gut der Rest war.</p>
      <p>Mündliche Prüfung: <b>10 von 20 Punkten</b> (50 %).</p>
      <p>Insgesamt sind 90 Punkte möglich. Prädikate: <b>sehr gut</b> ab 80, <b>gut</b> ab 64, <b>bestanden</b> ab 45.</p>
    </div>

    <div class="subhead">Was in den einzelnen Teilen verlangt wird</div>
    <div class="measure rule-box">
      <p><b>Lesen</b> — Aufgabe 1: fünf kurze Zeitungstexte den passenden Überschriften zuordnen (aus zehn). Aufgabe 2: ein längerer Text mit fünf Fragen zu je drei Antworten.</p>
      <p><b>Hören</b> — Durchsagen, Gespräche und Nachrichten aus Österreich, Deutschland und der Schweiz. Einmal Notizen ausfüllen, einmal ankreuzen, einmal fünf Personen zuordnen.</p>
      <p><b>Schreiben</b> — eine Antwort-E-Mail von etwa 50 Wörtern. Es zählt, dass du <em>alle</em> Leitpunkte beantwortest und Anrede und Gruß nicht vergisst.</p>
      <p><b>Sprechen</b> — Aufgabe 1: du bekommst ein Blatt mit sechs Themen, wählst fünf und stellst dich vor. Aufgabe 2: ihr plant gemeinsam etwas, z. B. einen Ausflug.</p>
    </div>

    <p class="note measure">Angaben nach den offiziellen Durchführungsbestimmungen (Stand Oktober 2023) und dem ÖSD-Modellsatz. Vor der Anmeldung lohnt ein Blick auf osd.at — Details können sich ändern.</p>
  `;
}

function masteryHtml(total) {
  const groups = MASTERY.map(
    (g) => `
    <div class="subhead">${g.group}</div>
    <div class="measure" style="margin-bottom:0.4rem;">
      ${g.items
        .map(
          ([id, text]) => `
        <label class="mastery-row" data-id="${id}">
          <input type="checkbox" data-id="${id}">
          <span>${text}</span>
        </label>`
        )
        .join("")}
    </div>`
  ).join("");

  return `
    <p class="lede measure">Eine Checkliste über alles, was auf A2 geprüft wird. Hak ab, was schon sitzt — der Rest ist dein Lernplan.</p>
    <div class="scorebox" data-show="true" style="margin-top:0">
      <div class="scoreline"><span class="big mono" id="ih-done">0</span><span class="of">/ ${total} beherrscht</span></div>
      <p class="advice" id="ih-advice"></p>
    </div>
    ${groups}
  `;
}

function wireChecklist(container, total) {
  const state = store.load("mastery", {});
  const doneEl = container.querySelector("#ih-done");
  const adviceEl = container.querySelector("#ih-advice");

  function refresh() {
    const n = Object.values(state).filter(Boolean).length;
    doneEl.textContent = n;
    const pct = total ? n / total : 0;
    adviceEl.textContent =
      pct === 0
        ? "Noch nichts abgehakt — geh die Liste einmal ehrlich durch, dann weißt du, wo du stehst."
        : pct < 0.4
        ? "Am Anfang. Nimm dir die Grammatik-Kasus zuerst vor, darauf baut fast alles andere auf."
        : pct < 0.75
        ? "Gute Basis. Jetzt lohnen sich Adjektivendungen, Nebensätze und die Prüfungsfertigkeiten."
        : pct < 1
        ? "Fast durch. Übe gezielt die letzten offenen Punkte und mach einen kompletten Modellsatz unter Zeitdruck."
        : "Alles abgehakt. Jetzt nur noch Modellsätze unter echten Prüfungsbedingungen üben.";
  }

  container.querySelectorAll('.mastery-row input[type="checkbox"]').forEach((box) => {
    const id = box.dataset.id;
    box.checked = !!state[id];
    box.closest(".mastery-row").dataset.done = state[id] ? "true" : "false";
    box.addEventListener("change", () => {
      state[id] = box.checked;
      store.save("mastery", state);
      box.closest(".mastery-row").dataset.done = box.checked ? "true" : "false";
      refresh();
    });
  });

  refresh();
}
