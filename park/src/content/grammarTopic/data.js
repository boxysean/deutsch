// Grammar topics. Each key is a zone id; adding a topic is a data entry plus
// flipping that zone to status "built" with module "grammarTopic".
import { MORE } from "./more.js";
import { MORE2 } from "./more2.js";
import { MORE3 } from "./more3.js";
import { TOPICS_B1 } from "./b1.js";
import { TOPICS_B1B } from "./b1b.js";
import { TOPICS_A1 } from "./a1.js";
import { TOPICS_A1B } from "./a1b.js";

// One map across every level. Zone ids are unique across levels, so there is
// nothing to disambiguate here; registry.js slices this by level wherever a
// total has to belong to one town.
export const TOPICS = {
  ...TOPICS_A1,
  ...TOPICS_A1B,
  ...MORE,
  ...MORE2,
  ...MORE3,
  ...TOPICS_B1,
  ...TOPICS_B1B,
  "verben-mit-praeposition": {
    intro:
      "Viele deutsche Verben haben eine feste Präposition, die man nicht logisch herleiten kann — man lernt sie zusammen mit dem Verb. Die Präposition bestimmt außerdem den Kasus. Das ist einer der häufigsten Fehlerbereiche auf A2 und kommt in Sprechen und Schreiben ständig vor.",

    rules: [
      {
        title: "Regel 1 — Verb + Präposition ist eine Einheit",
        body: `
          <p>Die Präposition gehört fest zum Verb. Sie hat hier <strong>keine eigene Bedeutung</strong> und lässt sich nicht aus dem Englischen ableiten:</p>
          <p><span class="mono">warten <b style="color:var(--accent)">auf</b></span> — to wait <em>for</em> · <span class="mono">sich freuen <b style="color:var(--accent)">auf</b></span> — to look forward <em>to</em> · <span class="mono">denken <b style="color:var(--accent)">an</b></span> — to think <em>about</em></p>
          <p>Lerne deshalb immer das ganze Paket: <strong>Verb + Präposition + Kasus</strong>, am besten in einem Beispielsatz.</p>
        `,
        note:
          "Typischer Fehler: die englische Präposition übersetzen. <em>Ich warte für den Bus</em> ✗ → <strong>Ich warte auf den Bus.</strong> ✓",
      },
      {
        title: "Regel 2 — Die Präposition bestimmt den Kasus",
        body: `
          <p>Jede feste Präposition zieht einen festen Kasus nach sich. Bei <em>auf, über, um, für, an</em> in dieser Funktion steht fast immer der <strong>Akkusativ</strong>, bei <em>mit, von, zu, nach, bei, vor, aus</em> immer der <strong>Dativ</strong>.</p>
          <p>Ich warte auf <b style="color:var(--accent)">den</b> Bus. <span style="color:var(--ink-soft)">(Akkusativ)</span><br>
             Ich spreche mit <b style="color:var(--accent)">dem</b> Chef. <span style="color:var(--ink-soft)">(Dativ)</span></p>
          <p>Achtung: Das sind <strong>keine</strong> Wechselpräpositionen. Hier gibt es keine Wahl zwischen wo/wohin — der Kasus ist fest.</p>
        `,
      },
      {
        title: "Regel 3 — Sache oder Person? da(r)- vs. Präposition + Pronomen",
        body: `
          <p>Das ist der wichtigste Teil dieses Themas. Wie du das Objekt ersetzt, hängt davon ab, ob es eine <strong>Sache</strong> oder eine <strong>Person</strong> ist.</p>
          <p><strong>Sache</strong> → <span class="mono">da(r)-</span> + Präposition, ein Wort:<br>
             Ich warte auf den Bus. → Ich warte <b style="color:var(--accent)">darauf</b>.</p>
          <p><strong>Person</strong> → Präposition + Pronomen, zwei Wörter:<br>
             Ich warte auf meinen Bruder. → Ich warte <b style="color:var(--accent)">auf ihn</b>.</p>
          <p>Genauso bei Fragen: <b>Worauf</b> wartest du? <span style="color:var(--ink-soft)">(Sache)</span> — <b>Auf wen</b> wartest du? <span style="color:var(--ink-soft)">(Person)</span></p>
        `,
        note:
          "Das <strong>-r-</strong> kommt nur dazu, wenn die Präposition mit einem Vokal beginnt: an → dar<b>an</b>, auf → dar<b>auf</b>, über → dar<b>über</b>, um → dar<b>um</b>. Bei mit, von, für, nach, vor bleibt es einfach: damit, davon, dafür, danach, davor.",
      },
    ],

    tables: [
      {
        caption: "Die wichtigsten Verben mit Akkusativ",
        lede: "Diese Gruppe deckt den Großteil dessen ab, was auf A2 verlangt wird.",
        head: ["Verb + Präposition", "Bedeutung", "Beispiel"],
        rows: [
          ["warten auf", "to wait for", "Ich warte auf den Bus."],
          ["sich freuen auf", "to look forward to <em>(Zukunft)</em>", "Ich freue mich auf das Wochenende."],
          ["sich freuen über", "to be glad about <em>(schon passiert)</em>", "Ich freue mich über dein Geschenk."],
          ["sich interessieren für", "to be interested in", "Ich interessiere mich für Musik."],
          ["sich vorbereiten auf", "to prepare for", "Ich bereite mich auf die Prüfung vor."],
          ["denken an", "to think of / about", "Ich denke oft an meine Familie."],
          ["sich erinnern an", "to remember", "Ich erinnere mich an den Urlaub."],
          ["sich gewöhnen an", "to get used to", "Ich gewöhne mich an das Wetter."],
          ["sprechen über", "to talk about", "Wir sprechen über die Arbeit."],
          ["sich ärgern über", "to be annoyed about", "Ich ärgere mich über den Lärm."],
          ["sich kümmern um", "to take care of", "Ich kümmere mich um die Kinder."],
          ["bitten um", "to ask for", "Ich bitte dich um Hilfe."],
          ["sorgen für", "to provide / see to", "Ich sorge für das Essen."],
          ["sich bedanken für", "to say thanks for", "Ich bedanke mich für das Geschenk."],
        ],
      },
      {
        caption: "Die wichtigsten Verben mit Dativ",
        head: ["Verb + Präposition", "Bedeutung", "Beispiel"],
        rows: [
          ["sprechen mit", "to speak with", "Ich spreche mit dem Chef."],
          ["telefonieren mit", "to talk on the phone with", "Ich telefoniere mit meiner Mutter."],
          ["sich treffen mit", "to meet up with", "Ich treffe mich mit Freunden."],
          ["anfangen mit", "to start with", "Ich fange mit der Arbeit an."],
          ["aufhören mit", "to stop doing", "Ich höre mit dem Rauchen auf."],
          ["zufrieden sein mit", "to be happy with", "Ich bin mit der Wohnung zufrieden."],
          ["Angst haben vor", "to be afraid of", "Ich habe Angst vor Hunden."],
          ["fragen nach", "to ask about / for", "Ich frage nach dem Weg."],
          ["suchen nach", "to look for", "Ich suche nach meinem Schlüssel."],
          ["träumen von", "to dream of", "Ich träume von einem Haus."],
          ["erzählen von", "to tell about", "Ich erzähle von meiner Reise."],
          ["einladen zu", "to invite to", "Ich lade dich zu meiner Party ein."],
          ["gratulieren zu", "to congratulate on", "Ich gratuliere dir zum Geburtstag."],
          ["teilnehmen an", "to take part in", "Ich nehme an dem Kurs teil."],
          ["helfen bei", "to help with", "Ich helfe dir bei den Hausaufgaben."],
        ],
      },
      {
        caption: "Fragen und Ersetzen im Überblick",
        head: ["", "Sache", "Person"],
        rows: [
          ["Frage", "Wor<b>auf</b> wartest du?", "<b>Auf wen</b> wartest du?"],
          ["Antwort", "Ich warte <b>darauf</b>.", "Ich warte <b>auf ihn</b>."],
          ["mit + …", "Wo<b>mit</b> fährst du? — <b>damit</b>", "<b>Mit wem</b> fährst du? — <b>mit ihm</b>"],
          ["von + …", "Wo<b>von</b> träumst du? — <b>davon</b>", "<b>Von wem</b> sprichst du? — <b>von ihr</b>"],
        ],
      },
    ],

    exercises: [
      {
        id: "praep",
        kind: "gap",
        title: "Übung A — Welche Präposition?",
        lede: "Nur die Präposition eintragen.",
        items: [
          { n: 1, prompt: "Ich warte ________ den Bus.", answers: ["auf"] },
          { n: 2, prompt: "Ich interessiere mich ________ Musik.", answers: ["für"] },
          { n: 3, prompt: "Ich spreche ________ dem Chef.", answers: ["mit"] },
          { n: 4, prompt: "Ich habe Angst ________ Hunden.", answers: ["vor"] },
          { n: 5, prompt: "Ich träume ________ einem großen Haus.", answers: ["von"] },
          { n: 6, prompt: "Ich freue mich ________ das Wochenende. <span style='color:var(--ink-soft)'>(es kommt noch)</span>", answers: ["auf"] },
          { n: 7, prompt: "Ich frage ________ dem Weg.", answers: ["nach"] },
          { n: 8, prompt: "Ich kümmere mich ________ die Kinder.", answers: ["um"] },
          { n: 9, prompt: "Ich denke oft ________ meine Familie.", answers: ["an"] },
          { n: 10, prompt: "Wir sprechen ________ die Arbeit.", answers: ["über"] },
          { n: 11, prompt: "Ich bereite mich ________ die Prüfung vor.", answers: ["auf"] },
          { n: 12, prompt: "Ich helfe dir ________ den Hausaufgaben.", answers: ["bei"] },
        ],
      },
      {
        id: "kasus",
        kind: "gap",
        title: "Übung B — Präposition und Kasus",
        lede: "Trage den richtigen Artikel ein. Das Wort in Klammern steht im Nominativ.",
        items: [
          { n: 1, prompt: "Ich warte auf ________ Zug. <em>(der Zug)</em>", answers: ["den"], why: "warten auf + Akkusativ" },
          { n: 2, prompt: "Ich spreche mit ________ Lehrerin. <em>(die Lehrerin)</em>", answers: ["der"], why: "mit + Dativ" },
          { n: 3, prompt: "Ich habe Angst vor ________ Hund. <em>(der Hund)</em>", answers: ["dem"], why: "vor + Dativ" },
          { n: 4, prompt: "Ich freue mich über ________ Geschenk. <em>(das Geschenk)</em>", answers: ["das"], why: "über + Akkusativ" },
          { n: 5, prompt: "Ich erzähle von ________ Reise. <em>(die Reise)</em>", answers: ["der"], why: "von + Dativ" },
          { n: 6, prompt: "Ich kümmere mich um ________ Kinder. <em>(die Kinder, Pl.)</em>", answers: ["die"], why: "um + Akkusativ" },
          { n: 7, prompt: "Ich nehme an ________ Kurs teil. <em>(der Kurs)</em>", answers: ["dem"], why: "teilnehmen an + Dativ" },
          { n: 8, prompt: "Ich erinnere mich an ________ Urlaub. <em>(der Urlaub)</em>", answers: ["den"], why: "sich erinnern an + Akkusativ" },
        ],
      },
      {
        id: "ersetzen",
        kind: "gap",
        title: "Übung C — Sache oder Person?",
        lede:
          "Ersetze das Objekt. Sache → ein Wort mit da(r)-. Person → Präposition + Pronomen (zwei Wörter).",
        items: [
          { n: 1, prompt: "Ich warte auf den Bus. → Ich warte ________.", answers: ["darauf"] },
          { n: 2, prompt: "Ich warte auf meinen Freund. → Ich warte ________.", answers: ["auf", "ihn"], display: "auf ihn" },
          { n: 3, prompt: "Ich interessiere mich für Musik. → Ich interessiere mich ________.", answers: ["dafür"] },
          { n: 4, prompt: "Ich spreche mit meiner Chefin. → Ich spreche ________.", answers: ["mit", "ihr"], display: "mit ihr" },
          { n: 5, prompt: "Ich habe Angst vor Spinnen. → Ich habe Angst ________.", answers: ["davor"] },
          { n: 6, prompt: "Ich erinnere mich an den Film. → Ich erinnere mich ________.", answers: ["daran"] },
          { n: 7, prompt: "Ich telefoniere mit meinem Vater. → Ich telefoniere ________.", answers: ["mit", "ihm"], display: "mit ihm" },
          { n: 8, prompt: "Ich freue mich auf die Party. → Ich freue mich ________.", answers: ["darauf"] },
        ],
      },
      {
        id: "fragen",
        kind: "reveal",
        title: "Übung D — Frage bilden",
        lede:
          "Frage nach dem markierten Teil. Denk daran: Sache → wo(r)-, Person → Präposition + wen/wem. Danach selbst vergleichen.",
        items: [
          { n: 1, frag: "Ich warte auf <b>den Bus</b>.", answer: "Worauf wartest du?" },
          { n: 2, frag: "Ich warte auf <b>meinen Bruder</b>.", answer: "Auf wen wartest du?", hint: "Person → auf + wen (Akkusativ)" },
          { n: 3, frag: "Ich spreche mit <b>dem Lehrer</b>.", answer: "Mit wem sprichst du?", hint: "Person → mit + wem (Dativ)" },
          { n: 4, frag: "Ich denke an <b>die Prüfung</b>.", answer: "Woran denkst du?", hint: "an beginnt mit Vokal → wor + an" },
          { n: 5, frag: "Ich freue mich über <b>das Geschenk</b>.", answer: "Worüber freust du dich?" },
          { n: 6, frag: "Ich habe Angst vor <b>dem Gewitter</b>.", answer: "Wovor hast du Angst?" },
          { n: 7, frag: "Ich träume von <b>einem Haus</b>.", answer: "Wovon träumst du?" },
          { n: 8, frag: "Ich gratuliere <b>meiner Schwester</b> zum Geburtstag.", answer: "Wem gratulierst du zum Geburtstag?", hint: "Hier ist die Person direktes Dativ-Objekt, ohne Präposition." },
        ],
      },
    ],

    selfcheck: [
      {
        q: "Wann benutzt man <em>darauf</em> und wann <em>auf ihn</em>?",
        reveal:
          "<b>darauf</b> für <b>Sachen</b>, <b>auf ihn/sie/es</b> für <b>Personen</b>. Ich warte auf den Zug → Ich warte <b>darauf</b>. Ich warte auf meinen Bruder → Ich warte <b>auf ihn</b>. Dieselbe Regel gilt bei Fragen: <b>Worauf</b> wartest du? vs. <b>Auf wen</b> wartest du?",
      },
      {
        q: "Wann kommt bei da-/wo- ein <em>-r-</em> dazu?",
        reveal:
          "Wenn die Präposition mit einem <b>Vokal</b> beginnt: an → da<b>r</b>an / wo<b>r</b>an, auf → da<b>r</b>auf / wo<b>r</b>auf, über → da<b>r</b>über / wo<b>r</b>über, um → da<b>r</b>um / wo<b>r</b>um. Sonst nicht: damit, davon, dafür, danach, davor.",
      },
      {
        q: "Was ist der Unterschied zwischen <em>sich freuen auf</em> und <em>sich freuen über</em>?",
        reveal:
          "<b>auf</b> + Akkusativ blickt nach <b>vorn</b>: Ich freue mich auf den Urlaub. <span style='color:var(--ink-soft)'>(er kommt noch)</span><br><b>über</b> + Akkusativ blickt auf etwas <b>Geschehenes</b>: Ich freue mich über dein Geschenk. <span style='color:var(--ink-soft)'>(ich habe es schon)</span>",
      },
      {
        q: "Warum ist <em>Ich warte für den Bus</em> falsch?",
        reveal:
          "Weil die Präposition fest zum Verb gehört und nicht aus dem Englischen übersetzt wird. <em>to wait <b>for</b></em> heißt auf Deutsch <b>warten auf</b> (+ Akkusativ): <b>Ich warte auf den Bus.</b> Genauso: <em>to think about</em> → <b>denken an</b>, <em>to be interested in</em> → <b>sich interessieren für</b>.",
      },
    ],
  },
};
