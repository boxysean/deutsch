export const diagnoseData = [
  { cat: "Akkusativ", tag: "2", items: [
    { n: 1, prompt: "Ich habe ________ (ein Hund).", answers: ["einen Hund"] },
    { n: 2, prompt: "Ohne ________ (mein Bruder) gehe ich nicht.", answers: ["meinen Bruder"] },
  ]},
  { cat: "Dativ", tag: "3", items: [
    { n: 3, prompt: "Das Buch gehört ________ (die Lehrerin).", answers: ["der Lehrerin"] },
    { n: 4, prompt: "Ich spiele mit ________ (die Kinder).", answers: ["den Kindern"] },
  ]},
  { cat: "Präpositionen", tag: "4", items: [
    { n: 5, prompt: "Seit ________ (ein Jahr) wohne ich in Wien.", answers: ["einem Jahr"] },
    { n: 6, prompt: "Ich gehe ________ Arzt. (zu + dem)", answers: ["zum"] },
  ]},
  { cat: "Wechselpräpositionen", tag: "5", items: [
    { n: 7, prompt: "Die Lampe hängt über ________ Tisch.", answers: ["dem"] },
    { n: 8, prompt: "Ich stelle die Flasche auf ________ Tisch.", answers: ["den"] },
  ]},
  { cat: "Perfekt", tag: "6", items: [
    { n: 9, prompt: "Gestern ________ ich nach Graz ________ (fahren).", answers: ["bin", "gefahren"], display: "bin … gefahren" },
    { n: 10, prompt: "Wir ________ den Film schon ________ (sehen).", answers: ["haben", "gesehen"], display: "haben … gesehen" },
  ]},
  { cat: "Präteritum & Modalverben", tag: "7", items: [
    { n: 11, prompt: "Als Kind ________ ich nicht schwimmen. (können, Präteritum)", answers: ["konnte"] },
    { n: 12, prompt: "Ich ________ gestern bis 20 Uhr arbeiten. (müssen, Präteritum)", answers: ["musste"] },
  ]},
  { cat: "Adjektivendungen", tag: "8", items: [
    { n: 13, prompt: "Ich habe einen ________ Wagen gekauft. (neu)", answers: ["neuen"] },
    { n: 14, prompt: "Der ________ Mann dort ist mein Onkel. (alt)", answers: ["alte"] },
  ]},
  { cat: "Nebensätze", tag: "9", items: [
    { n: 15, prompt: "Ich komme nicht. Ich bin krank. → (weil)", answers: ["weil", "krank", "bin"], display: "Ich komme nicht, weil ich krank bin.", freeform: true },
    { n: 16, prompt: "Er ist müde. Er sagt es. → Er sagt, ________", answers: ["dass", "müde", "ist"], display: "dass er müde ist", freeform: true },
  ]},
  { cat: "Reflexiv & Konjunktiv II", tag: "10", items: [
    { n: 17, prompt: "Ich interessiere ________ für Musik.", answers: ["mich"] },
    { n: 18, prompt: "________ Sie mir bitte helfen? (können, höflich)", answers: ["könnten"] },
  ]},
  { cat: "Verben mit Präposition", tag: "10", items: [
    { n: 19, prompt: "Ich warte ________ den Bus.", answers: ["auf"] },
    { n: 20, prompt: "Ich freue ________ ________ das Wochenende.", answers: ["mich", "auf"], display: "mich … auf" },
  ]},
];

export const konjData = [
  { n: 1, prompt: "du (sprechen)", answer: "sprichst" },
  { n: 2, prompt: "er (nehmen)", answer: "nimmt" },
  { n: 3, prompt: "sie (sg.) (lesen)", answer: "liest" },
  { n: 4, prompt: "du (fahren)", answer: "fährst" },
  { n: 5, prompt: "es (geben)", answer: "gibt" },
  { n: 6, prompt: "du (essen)", answer: "isst" },
  { n: 7, prompt: "er (schlafen)", answer: "schläft" },
  { n: 8, prompt: "du (wissen)", answer: "weißt" },
  { n: 9, prompt: "ihr (sein)", answer: "seid" },
  { n: 10, prompt: "du (werden)", answer: "wirst" },
];

export const satzstellungData = [
  { n: 1, frag: "Ich stehe um sechs Uhr auf.", answer: "Um sechs Uhr stehe ich auf." },
  { n: 2, frag: "Wir gehen am Wochenende ins Kino.", answer: "Am Wochenende gehen wir ins Kino." },
  { n: 3, frag: "Sie arbeitet seit drei Jahren in Wien.", answer: "Seit drei Jahren arbeitet sie in Wien." },
  { n: 4, frag: "Ich fahre mit dem Rad zur Arbeit.", answer: "Mit dem Rad fahre ich zur Arbeit." },
  { n: 5, frag: "Er kommt heute Abend nicht mit.", answer: "Heute Abend kommt er nicht mit." },
];

export const satzklammerData = [
  { n: 1, frag: "ich / anrufen / dich / morgen", answer: "Ich rufe dich morgen an." },
  { n: 2, frag: "wir / müssen / früh / aufstehen", answer: "Wir müssen früh aufstehen." },
  { n: 3, frag: "sie (sg.) / einkaufen / am Samstag / immer", answer: "Sie kauft am Samstag immer ein.", hint: "oder: Am Samstag kauft sie immer ein." },
  { n: 4, frag: "kannst / du / mir / helfen (Frage)", answer: "Kannst du mir helfen?", hint: "Ja/Nein-Frage: Verb an Position 1, Infinitiv am Ende" },
  { n: 5, frag: "der Zug / abfahren / um 8:15", answer: "Der Zug fährt um 8:15 ab." },
  { n: 6, frag: "ich / wollen / nächstes Jahr / nach Italien / fahren", answer: "Ich will nächstes Jahr nach Italien fahren." },
  { n: 7, frag: "wann / anfangen / der Kurs (Frage)", answer: "Wann fängt der Kurs an?", hint: "W-Frage: W-Wort P1, Verb P2, Präfix ans Ende" },
  { n: 8, frag: "ihr / dürfen / hier / nicht / parken", answer: "Ihr dürft hier nicht parken." },
];

export const vocab = [
  ["aufwachen", "to wake up", true],
  ["aufstehen", "to get up", true],
  ["sich duschen", "to shower", false],
  ["sich anziehen", "to get dressed", true],
  ["frühstücken", "to have breakfast", false],
  ["das Frühstück", "breakfast", false],
  ["zur Arbeit fahren", "to travel to work", false],
  ["anfangen / beginnen", "to begin", true],
  ["eine Besprechung haben", "to have a meeting", false],
  ["Mittagspause machen", "to take a lunch break", false],
  ["aufhören", "to stop, finish", true],
  ["einkaufen", "to shop", true],
  ["kochen", "to cook", false],
  ["das Abendessen", "dinner", false],
  ["abwaschen / spülen", "to wash up", true],
  ["aufräumen", "to tidy up", true],
  ["die Kinder ins Bett bringen", "to put the kids to bed", false],
  ["fernsehen", "to watch TV", true],
  ["sich ausruhen", "to rest", true],
  ["müde sein", "to be tired", false],
  ["einschlafen", "to fall asleep", true],
  ["oft / manchmal / selten / nie", "often / sometimes / rarely / never", false],
  ["normalerweise", "usually", false],
  ["zuerst / dann / danach / schließlich", "first / then / after that / finally", false],
  ["gegen acht Uhr", "around eight", false],
  ["jeden Tag / jeden Morgen", "every day / every morning", false],
  ["unter der Woche", "during the week", false],
  ["am Wochenende", "at the weekend", false],
].map((v, i) => ({ id: i, de: v[0], en: v[1], sep: v[2] }));
