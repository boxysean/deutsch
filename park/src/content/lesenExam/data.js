// Quelle: ÖSD Zertifikat A2, Modellsatz, © ÖSD — verbatim aus dem offiziellen Modellsatz-PDF
// (persönliches Lernmaterial; bei Veröffentlichung des Repos Urheberrecht beachten).

export const aufgabe1 = {
  title: "Aufgabe 1 — Überschriften zuordnen",
  points: 15,
  instructions:
    "Lesen Sie die 5 Texte und ordnen Sie jedem Text (1–5) die passende Überschrift (A–K) zu. Pro Text gibt es nur eine richtige Lösung.",
  headlines: [
    { id: "A", text: "Jetzt das Fahrrad reparieren lassen" },
    { id: "B", text: "Im Rathaus: Informationen über Tiere" },
    { id: "C", text: "Tipp: Ausflug in den Tierpark" },
    { id: "D", text: "Frühlingspflanzen im Sonderangebot" },
    { id: "E", text: "Tipps fürs Radfahren in der Stadt" },
    { id: "F", text: "Radfahren ist gesund!" },
    { id: "G", text: "Mit neuen Pflanzen in den Frühling" },
    { id: "H", text: "Haustiere machen krank" },
    { id: "I", text: "Ausstellung: Blumen im Frühling" },
    { id: "K", text: "Wiener wurden zum Radfahren befragt" },
  ],
  texts: [
    {
      n: 1,
      body: "Seit Jahrzehnten ist der Oberberger Tierpark ein beliebtes Ausflugsziel. Die Vielfalt der Tiere und Pflanzen und die wunderbare Naturlandschaft sind die Gründe dafür. Das Angebot ist vielfältig: Führungen, Tierfütterungen, Naturlehrpfad, Waldspielplätze und vieles mehr. Info-Telefon 804 31 69",
      source: "aus einer deutschen Zeitung",
      answer: "C",
    },
    {
      n: 2,
      body: "Fahrrad fahren in Hamburg liegt voll im Trend. Das Fahrrad hat sich im Stadtgebiet heute einen wichtigen Platz erobert. Mehr als 1 000 Kilometer an Radwegen sollen Sie animieren, umzusteigen und das Fahrrad (neu) zu entdecken. Was Sie dabei beachten müssen, aber auch Tipps zu interessanten Routen – das finden Sie unter www.hamburg.de/verkehr/radfahren.",
      source: "aus einer deutschen Tageszeitung",
      answer: "E",
    },
    {
      n: 3,
      body: "An Werktagen nützen 37 Prozent der Wiener ihr Rad in der Freizeit, aber auch für Wege in die Arbeit oder zur Schule/Uni ist das Rad ein beliebtes Verkehrsmittel. Das ging aus den Antworten auf eine Interview-Reihe zum Thema „Mit dem Fahrrad in Wien“ hervor.",
      source: "aus einer österreichischen Zeitung",
      answer: "K",
    },
    {
      n: 4,
      body: "Die aktuelle Ausstellung im Rathaus bietet Wissenswertes über Tierschutz und Tierhaltung. Für Kinder gibt es die Möglichkeit, verschiedene Haustiere kennenzulernen und sich über das Zusammenleben mit ihnen zu informieren. Der Eintritt ist frei! Informationen: www.tierschutzinbern.ch",
      source: "aus einer Schweizer Zeitung",
      answer: "B",
    },
    {
      n: 5,
      body: "„Unsere Stadt blüht auf!“ – Das ist unser Motto für den Frühling und alle sind eingeladen, mitzumachen: Egal ob Sie neue Sträucher, Bäume oder Blumen am Fenster pflanzen – mehr Natur tut allen gut! Schicken Sie ein Foto von Ihren Frühlingspflanzen an das Gemeindeamt und gewinnen Sie einen Einkaufsgutschein im Wert von 50 Euro.",
      source: "aus einer österreichischen Tageszeitung",
      answer: "G",
    },
  ],
  scoreTable: { 5: 15, 4: 12, 3: 9, 2: 6, 1: 3, 0: 0 },
};

export const aufgabe2 = {
  title: "Aufgabe 2 — Textverständnis",
  points: 10,
  passageTitle: "65 Jahre ohne ernsten Streit",
  passage: [
    "Dass sich zwei Menschen, die schon 65 Jahre verheiratet sind und einander stets treu waren, nach so langer Zeit immer noch lieben und achten wie am ersten Tag, ist doch etwas sehr Außergewöhnliches.",
    "Franz und Hanna Böhm aus Linz sind ein solches Paar. „Liebe auf den ersten Blick war es nicht“, meint der 88-jährige Franz Böhm und lacht, „denn ich habe ihr anfangs gar nicht gefallen.“ Damals war seine Hanna 19 Jahre alt und „hatte es schon recht eilig“, endlich zu heiraten. Heute ist Hanna Böhm 84 und glücklich, dass ihr Franz sie doch noch erobert hat.",
    "Er hat als Matrose auf einem Donauschiff gearbeitet, sie war die Tochter seines Chefs, des Steuermannes. Und als er erzählt, wie er einmal eine Frau aus dem Wasser geholt und so vor dem Ertrinken gerettet hat, da merkt man, wie stolz seine Ehefrau auf ihn ist.",
    "Eigene Kinder haben die beiden leider nie bekommen, dafür haben sie ihren Neffen, den Sohn von Hannas Schwester, zu sich genommen und liebevoll erzogen.",
    "Gemeinsame Spaziergänge am Pöstlingberg in der Nähe von Linz halten das rüstige Paar jung und fit – und natürlich auch ihre Liebe zueinander, die all die Jahre in guten wie in schlechten Zeiten bis heute andauert.",
  ],
  source: "aus einer österreichischen Zeitung",
  questions: [
    { n: 1, prompt: "Herr Böhm ist", options: ["65 Jahre alt.", "84 Jahre alt.", "88 Jahre alt."], answer: 2 },
    {
      n: 2,
      prompt: "Franz Böhm",
      options: ["hat auf einem Schiff gearbeitet.", "hat ein Schiff gekauft.", "wollte auf einem Schiff arbeiten."],
      answer: 0,
    },
    {
      n: 3,
      prompt: "Franz Böhm hat",
      options: [
        "einer Frau in Not geholfen.",
        "seine Frau oft auf dem Schiff mitfahren lassen.",
        "seinem Chef geholfen.",
      ],
      answer: 0,
    },
    {
      n: 4,
      prompt: "Das Paar hat",
      options: ["einen Neffen bei sich aufgenommen.", "einen Sohn bekommen.", "viele Kinder bekommen."],
      answer: 0,
    },
    {
      n: 5,
      prompt: "Das Ehepaar",
      options: [
        "bleibt durch Spazierengehen jung.",
        "geht oft im Stadtzentrum von Linz spazieren.",
        "ist früher gern spazieren gegangen.",
      ],
      answer: 0,
    },
  ],
  scoreTable: { 5: 10, 4: 8, 3: 6, 2: 4, 1: 2, 0: 0 },
};

export const examInfo = {
  totalPoints: 25,
  minutes: 30,
};
