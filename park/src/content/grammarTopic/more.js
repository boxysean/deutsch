// Further grammar topics, kept out of data.js so the file stays manageable.

const AKK = {
  intro:
    "Der Akkusativ markiert das direkte Objekt — das, was von der Handlung betroffen ist. Die gute Nachricht: nur das Maskulinum ändert sich sichtbar. Feminin, Neutrum und Plural sehen aus wie im Nominativ.",
  rules: [
    {
      title: "Regel 1 — Nur der Maskulinum ändert sich",
      body: `
        <p>Vergleiche Nominativ (wer/was macht?) und Akkusativ (wen/was?):</p>
        <p>der Mann → Ich sehe <b style="color:var(--accent)">den</b> Mann.<br>
           die Frau → Ich sehe <b>die</b> Frau. <span style="color:var(--ink-soft)">(gleich)</span><br>
           das Kind → Ich sehe <b>das</b> Kind. <span style="color:var(--ink-soft)">(gleich)</span><br>
           die Leute → Ich sehe <b>die</b> Leute. <span style="color:var(--ink-soft)">(gleich)</span></p>
        <p>Dasselbe beim unbestimmten Artikel: ein Mann → ein<b style="color:var(--accent)">en</b> Mann. Und bei kein-, mein-, dein-, sein-, ihr- genauso: kein<b>en</b>, mein<b>en</b> …</p>
      `,
      note:
        "Merksatz: <strong>Wenn es maskulin ist, hängst du -en an.</strong> Alles andere bleibt, wie es ist.",
    },
    {
      title: "Regel 2 — Wann steht der Akkusativ?",
      body: `
        <p><b>1. Direktes Objekt</b> der allermeisten Verben: haben, sehen, kaufen, brauchen, suchen, nehmen, essen, trinken, lesen, machen.<br>
           <span class="mono">Ich brauche einen Kugelschreiber.</span></p>
        <p><b>2. Nach festen Präpositionen:</b> für, ohne, gegen, um, durch.<br>
           <span class="mono">Ich kaufe ein Geschenk für meinen Bruder.</span></p>
        <p><b>3. Bei Zeitangaben ohne Präposition:</b> <span class="mono">Ich bleibe einen Monat.</span> · <span class="mono">Jeden Tag stehe ich früh auf.</span></p>
      `,
    },
    {
      title: "Regel 3 — Personalpronomen im Akkusativ",
      body: `
        <p>ich → <b>mich</b> · du → <b>dich</b> · er → <b>ihn</b> · sie → <b>sie</b> · es → <b>es</b> · wir → <b>uns</b> · ihr → <b>euch</b> · sie/Sie → <b>sie/Sie</b></p>
        <p>Kennst du den Film? – Ja, ich kenne <b>ihn</b>. <span style="color:var(--ink-soft)">(der Film → ihn)</span></p>
      `,
      note: "Häufiger Fehler: <em>Ich kenne er</em> ✗ → <strong>Ich kenne ihn.</strong> ✓",
    },
  ],
  tables: [
    {
      caption: "Artikel im Akkusativ",
      head: ["", "maskulin", "feminin", "neutral", "Plural"],
      rows: [
        ["Nominativ", "der / ein", "die / eine", "das / ein", "die / —"],
        ["<b>Akkusativ</b>", "<b>den / einen</b>", "die / eine", "das / ein", "die / —"],
        ["negativ", "<b>keinen</b>", "keine", "kein", "keine"],
        ["mein-", "<b>meinen</b>", "meine", "mein", "meine"],
      ],
    },
    {
      caption: "Präpositionen mit Akkusativ",
      head: ["Präposition", "Bedeutung", "Beispiel"],
      rows: [
        ["für", "for", "Das Geschenk ist für meinen Vater."],
        ["ohne", "without", "Ich trinke den Kaffee ohne Milch."],
        ["gegen", "against, around (time)", "Ich bin gegen den Vorschlag."],
        ["um", "around, at (clock time)", "Wir gehen um den See."],
        ["durch", "through", "Wir fahren durch den Tunnel."],
      ],
    },
  ],
  exercises: [
    {
      id: "artikel",
      kind: "gap",
      title: "Übung A — Artikel im Akkusativ",
      lede: "Trage den richtigen Artikel ein. Das Wort in Klammern steht im Nominativ.",
      items: [
        { n: 1, prompt: "Ich habe ________ Hund. <em>(ein Hund)</em>", answers: ["einen"] },
        { n: 2, prompt: "Ich sehe ________ Frau. <em>(die Frau)</em>", answers: ["die"] },
        { n: 3, prompt: "Wir kaufen ________ Auto. <em>(ein Auto)</em>", answers: ["ein"] },
        { n: 4, prompt: "Ich kenne ________ Mann dort. <em>(der Mann)</em>", answers: ["den"] },
        { n: 5, prompt: "Sie hat ________ Zeit. <em>(keine Zeit)</em>", answers: ["keine"] },
        { n: 6, prompt: "Ich brauche ________ Stift. <em>(kein Stift)</em>", answers: ["keinen"] },
        { n: 7, prompt: "Er sucht ________ Schlüssel. <em>(seine Schlüssel, Pl.)</em>", answers: ["seine"] },
        { n: 8, prompt: "Ich lese ________ Buch. <em>(mein Buch)</em>", answers: ["mein"] },
      ],
    },
    {
      id: "praep",
      kind: "gap",
      title: "Übung B — Nach Präpositionen",
      items: [
        { n: 1, prompt: "Das ist ein Geschenk für ________ Bruder. <em>(mein Bruder)</em>", answers: ["meinen"] },
        { n: 2, prompt: "Ich trinke Tee ohne ________ Zucker. <em>(der Zucker)</em>", answers: ["den"] },
        { n: 3, prompt: "Wir fahren durch ________ Stadt. <em>(die Stadt)</em>", answers: ["die"] },
        { n: 4, prompt: "Ich bin gegen ________ Plan. <em>(dieser Plan → den)</em>", answers: ["den"] },
        { n: 5, prompt: "Sie geht ohne ________ Mantel. <em>(ihr Mantel)</em>", answers: ["ihren"] },
        { n: 6, prompt: "Der Kurs dauert ________ Monat. <em>(ein Monat)</em>", answers: ["einen"] },
      ],
    },
    {
      id: "pron",
      kind: "gap",
      title: "Übung C — Pronomen im Akkusativ",
      lede: "Ersetze das Objekt durch ein Pronomen.",
      items: [
        { n: 1, prompt: "Kennst du den Film? – Ja, ich kenne ________.", answers: ["ihn"] },
        { n: 2, prompt: "Siehst du die Kinder? – Ja, ich sehe ________.", answers: ["sie"] },
        { n: 3, prompt: "Liest du das Buch? – Ja, ich lese ________.", answers: ["es"] },
        { n: 4, prompt: "Rufst du mich an? – Ja, ich rufe ________ an. <em>(→ du)</em>", answers: ["dich"] },
        { n: 5, prompt: "Besucht ihr uns? – Ja, wir besuchen ________. <em>(→ ihr)</em>", answers: ["euch"] },
        { n: 6, prompt: "Verstehst du deinen Chef? – Ja, ich verstehe ________.", answers: ["ihn"] },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Welches Genus verändert sich im Akkusativ — und wie?",
      reveal:
        "Nur das <b>Maskulinum</b>: der → <b>den</b>, ein → <b>einen</b>, kein → <b>keinen</b>, mein → <b>meinen</b>. Feminin, Neutrum und Plural sehen im Akkusativ genauso aus wie im Nominativ.",
    },
    {
      q: "Nenne die fünf Präpositionen, nach denen immer der Akkusativ steht.",
      reveal: "<b>für, ohne, gegen, um, durch</b> — ohne Ausnahme, unabhängig von Bewegung oder Ort.",
    },
    {
      q: "Warum ist <em>Ich kenne er</em> falsch?",
      reveal:
        "<em>er</em> ist Nominativ. Als direktes Objekt braucht man den Akkusativ: <b>Ich kenne ihn.</b> Merke: mich, dich, <b>ihn</b>, sie, es, uns, euch, sie.",
    },
  ],
};

const DATIV = {
  intro:
    "Der Dativ markiert das indirekte Objekt — meist die Person, für die etwas geschieht. Anders als beim Akkusativ ändern sich hier alle vier Formen, und der Plural bekommt zusätzlich ein -n am Substantiv.",
  rules: [
    {
      title: "Regel 1 — Alle Formen ändern sich",
      body: `
        <p>der → <b style="color:var(--accent)">dem</b> · die → <b style="color:var(--accent)">der</b> · das → <b style="color:var(--accent)">dem</b> · die (Pl.) → <b style="color:var(--accent)">den</b></p>
        <p>Ich gebe <b>dem</b> Mann das Buch. · Ich helfe <b>der</b> Frau. · Ich danke <b>dem</b> Kind. · Ich spiele mit <b>den</b> Kindern.</p>
      `,
      note:
        "Im <strong>Plural</strong> bekommt auch das Substantiv ein <strong>-n</strong>, wenn es nicht schon eins hat: die Kinder → den Kinder<b>n</b>, die Freunde → den Freunde<b>n</b>. Ausnahme: Plurale auf -s (den Autos).",
    },
    {
      title: "Regel 2 — Wann steht der Dativ?",
      body: `
        <p><b>1. Indirektes Objekt</b> — die Person, der man etwas gibt, zeigt, schickt:<br>
           <span class="mono">Ich gebe <b>meinem Bruder</b> das Buch.</span></p>
        <p><b>2. Nach Dativ-Präpositionen:</b> mit, nach, bei, seit, von, zu, aus (+ gegenüber).<br>
           <span class="mono">Ich fahre mit <b>dem</b> Bus.</span></p>
        <p><b>3. Nach Dativ-Verben</b> — Verben, die gar kein Akkusativobjekt haben: helfen, danken, gefallen, gehören, passen, schmecken, antworten, folgen.<br>
           <span class="mono">Das Buch gehört <b>der</b> Lehrerin.</span></p>
      `,
    },
    {
      title: "Regel 3 — Zwei Objekte: Reihenfolge",
      body: `
        <p>Viele Verben haben beides: Dativ (Person) und Akkusativ (Sache). Die Standardreihenfolge ist <b>Dativ vor Akkusativ</b>:</p>
        <p><span class="mono">Ich gebe <b>dem Kind</b> <b>ein Geschenk</b>.</span></p>
        <p>Aber: sobald das Akkusativobjekt ein <b>Pronomen</b> ist, steht es zuerst:</p>
        <p><span class="mono">Ich gebe <b>es</b> dem Kind.</span> <span style="color:var(--ink-soft)">(nicht: Ich gebe dem Kind es)</span></p>
      `,
      note: "Kurzregel: <strong>Pronomen zuerst.</strong> Sonst Dativ vor Akkusativ.",
    },
  ],
  tables: [
    {
      caption: "Artikel im Dativ",
      head: ["", "maskulin", "feminin", "neutral", "Plural"],
      rows: [
        ["Nominativ", "der / ein", "die / eine", "das / ein", "die"],
        ["Akkusativ", "den / einen", "die / eine", "das / ein", "die"],
        ["<b>Dativ</b>", "<b>dem / einem</b>", "<b>der / einer</b>", "<b>dem / einem</b>", "<b>den … -n</b>"],
        ["mein-", "meinem", "meiner", "meinem", "meinen … -n"],
      ],
    },
    {
      caption: "Präpositionen mit Dativ",
      head: ["Präposition", "Bedeutung", "Beispiel"],
      rows: [
        ["mit", "with, by (transport)", "Ich fahre mit dem Zug."],
        ["nach", "after, to (cities/countries)", "Nach dem Essen gehe ich."],
        ["bei", "at, near, at sb's place", "Ich wohne bei meinen Eltern."],
        ["seit", "since, for (time)", "Seit einem Jahr lerne ich Deutsch."],
        ["von", "from, of", "Das ist ein Brief von meiner Tante."],
        ["zu", "to (people, places)", "Ich gehe zum Arzt."],
        ["aus", "out of, from (origin)", "Ich komme aus der Schweiz."],
      ],
    },
    {
      caption: "Verschmelzungen, die man immer benutzt",
      head: ["Präposition + Artikel", "wird zu", "Beispiel"],
      rows: [
        ["zu dem", "<b>zum</b>", "Ich gehe zum Bahnhof."],
        ["zu der", "<b>zur</b>", "Ich gehe zur Schule."],
        ["bei dem", "<b>beim</b>", "beim Arzt"],
        ["von dem", "<b>vom</b>", "vom Chef"],
      ],
    },
  ],
  exercises: [
    {
      id: "artikel",
      kind: "gap",
      title: "Übung A — Artikel im Dativ",
      items: [
        { n: 1, prompt: "Das Buch gehört ________ Lehrerin. <em>(die Lehrerin)</em>", answers: ["der"] },
        { n: 2, prompt: "Ich helfe ________ Mann. <em>(der Mann)</em>", answers: ["dem"] },
        { n: 3, prompt: "Ich spiele mit ________ Kindern. <em>(die Kinder)</em>", answers: ["den"] },
        { n: 4, prompt: "Ich danke ________ Kind. <em>(das Kind)</em>", answers: ["dem"] },
        { n: 5, prompt: "Ich fahre mit ________ Freund. <em>(mein Freund)</em>", answers: ["meinem"] },
        { n: 6, prompt: "Seit ________ Jahr wohne ich hier. <em>(ein Jahr)</em>", answers: ["einem"] },
        { n: 7, prompt: "Ich wohne bei ________ Eltern. <em>(meine Eltern, Pl.)</em>", answers: ["meinen"] },
        { n: 8, prompt: "Das Auto gehört ________ Schwester. <em>(eine Schwester)</em>", answers: ["einer"] },
      ],
    },
    {
      id: "pluraln",
      kind: "gap",
      title: "Übung B — Das Plural-n",
      lede: "Trage Artikel und Substantiv gemeinsam ein, z. B. „den Kindern“.",
      items: [
        { n: 1, prompt: "Ich helfe ________. <em>(die Kinder)</em>", answers: ["den", "kindern"], display: "den Kindern" },
        { n: 2, prompt: "Ich spreche mit ________. <em>(die Freunde)</em>", answers: ["den", "freunden"], display: "den Freunden" },
        { n: 3, prompt: "Das gehört ________. <em>(die Studenten)</em>", answers: ["den", "studenten"], display: "den Studenten" },
        { n: 4, prompt: "Ich fahre mit ________. <em>(die Autos)</em>", answers: ["den", "autos"], display: "den Autos — Plural auf -s bekommt kein zusätzliches -n" },
      ],
    },
    {
      id: "verben",
      kind: "gap",
      title: "Übung C — Dativ oder Akkusativ?",
      lede: "Achte auf das Verb: helfen, danken, gefallen, gehören verlangen Dativ.",
      items: [
        { n: 1, prompt: "Ich sehe ________ Mann. <em>(der Mann)</em>", answers: ["den"] },
        { n: 2, prompt: "Ich helfe ________ Mann. <em>(der Mann)</em>", answers: ["dem"] },
        { n: 3, prompt: "Der Film gefällt ________ Kindern. <em>(die Kinder)</em>", answers: ["den"] },
        { n: 4, prompt: "Ich kaufe ________ Wagen. <em>(ein Wagen)</em>", answers: ["einen"] },
        { n: 5, prompt: "Das Essen schmeckt ________ Gast. <em>(der Gast)</em>", answers: ["dem"] },
        { n: 6, prompt: "Ich frage ________ Lehrer. <em>(der Lehrer)</em>", answers: ["den"] },
      ],
    },
    {
      id: "reihenfolge",
      kind: "reveal",
      title: "Übung D — Dativ und Akkusativ zusammen",
      lede: "Bilde den Satz. Denk an: Pronomen zuerst, sonst Dativ vor Akkusativ.",
      items: [
        { n: 1, frag: "ich / geben / das Buch / dem Kind", answer: "Ich gebe dem Kind das Buch." },
        { n: 2, frag: "ich / geben / es / dem Kind", answer: "Ich gebe es dem Kind.", hint: "Akkusativpronomen steht vor dem Dativ." },
        { n: 3, frag: "er / schenken / seiner Frau / Blumen", answer: "Er schenkt seiner Frau Blumen." },
        { n: 4, frag: "ich / zeigen / ihn / meinem Bruder", answer: "Ich zeige ihn meinem Bruder." },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Wie lauten die vier Dativ-Artikel — und was passiert im Plural zusätzlich?",
      reveal:
        "<b>dem</b> (m), <b>der</b> (f), <b>dem</b> (n), <b>den</b> (Pl.). Im Plural bekommt außerdem das <b>Substantiv ein -n</b>: den Kinder<b>n</b>, den Freunde<b>n</b> — außer bei Pluralen auf -s (den Autos).",
    },
    {
      q: "Nenne die sieben Präpositionen, die immer den Dativ verlangen.",
      reveal: "<b>mit, nach, bei, seit, von, zu, aus</b>. Ein gängiger Merkspruch: „mit-nach-bei-seit-von-zu-aus, damit kennst du dich jetzt aus.“",
    },
    {
      q: "In welcher Reihenfolge stehen Dativ- und Akkusativobjekt?",
      reveal:
        "Normalerweise <b>Dativ vor Akkusativ</b>: Ich gebe dem Kind ein Geschenk. Sobald aber das Akkusativobjekt ein <b>Pronomen</b> ist, steht es zuerst: Ich gebe <b>es</b> dem Kind.",
    },
  ],
};

const PERFEKT = {
  intro:
    "Das Perfekt ist die normale Vergangenheitsform im Gespräch — im Sprechen-Teil der Prüfung brauchst du sie ständig. Es besteht aus zwei Teilen: haben oder sein an Position 2, und das Partizip II ganz am Satzende.",
  rules: [
    {
      title: "Regel 1 — Die Satzklammer",
      body: `
        <p>Das Hilfsverb wird konjugiert und steht an Position 2. Das Partizip II wandert ans <b>Satzende</b>:</p>
        <p><span class="mono">Ich <b style="color:var(--accent)">habe</b> gestern einen Film <b style="color:var(--accent)">gesehen</b>.</span><br>
           <span class="mono">Wir <b style="color:var(--accent)">sind</b> nach Wien <b style="color:var(--accent)">gefahren</b>.</span></p>
      `,
    },
    {
      title: "Regel 2 — haben oder sein?",
      body: `
        <p><b>sein</b> nehmen nur zwei Gruppen:</p>
        <p>1. <b>Bewegung von A nach B</b>: gehen, fahren, kommen, fliegen, laufen, reisen<br>
           2. <b>Zustandswechsel</b>: aufstehen, einschlafen, aufwachen, werden, sterben<br>
           dazu die Ausnahmen <b>sein</b> und <b>bleiben</b>.</p>
        <p><b>haben</b> nehmen alle anderen — und das ist die große Mehrheit.</p>
      `,
      note:
        "Ein Verb kann beides: <em>Ich <b>bin</b> nach Graz gefahren</em> (Bewegung) vs. <em>Ich <b>habe</b> das Auto gefahren</em> (mit Akkusativobjekt).",
    },
    {
      title: "Regel 3 — Das Partizip II bilden",
      body: `
        <p><b>Regelmäßig:</b> ge + Stamm + t → machen → <b>gemacht</b>, lernen → <b>gelernt</b></p>
        <p><b>Unregelmäßig:</b> ge + (oft geänderter) Stamm + en → sehen → <b>gesehen</b>, trinken → <b>getrunken</b></p>
        <p><b>Trennbar:</b> ge kommt in die Mitte → aufstehen → auf<b>ge</b>standen, einkaufen → ein<b>ge</b>kauft</p>
        <p><b>Kein ge-</b> bei Verben auf <b>-ieren</b> und bei untrennbaren Präfixen (be-, er-, ver-, ent-, ge-):<br>
           studieren → <b>studiert</b>, besuchen → <b>besucht</b>, verstehen → <b>verstanden</b></p>
      `,
    },
  ],
  tables: [
    {
      caption: "Die wichtigsten unregelmäßigen Partizipien",
      head: ["Infinitiv", "Hilfsverb", "Partizip II", "Beispiel"],
      rows: [
        ["gehen", "sein", "gegangen", "Ich bin nach Hause gegangen."],
        ["fahren", "sein", "gefahren", "Wir sind nach Wien gefahren."],
        ["kommen", "sein", "gekommen", "Er ist zu spät gekommen."],
        ["sein", "sein", "gewesen", "Ich bin in Wien gewesen."],
        ["bleiben", "sein", "geblieben", "Wir sind zu Hause geblieben."],
        ["aufstehen", "sein", "aufgestanden", "Ich bin um sechs aufgestanden."],
        ["essen", "haben", "gegessen", "Ich habe schon gegessen."],
        ["trinken", "haben", "getrunken", "Er hat einen Kaffee getrunken."],
        ["sehen", "haben", "gesehen", "Wir haben den Film gesehen."],
        ["lesen", "haben", "gelesen", "Ich habe das Buch gelesen."],
        ["sprechen", "haben", "gesprochen", "Ich habe mit ihr gesprochen."],
        ["schreiben", "haben", "geschrieben", "Ich habe eine E-Mail geschrieben."],
        ["nehmen", "haben", "genommen", "Ich habe den Bus genommen."],
        ["finden", "haben", "gefunden", "Ich habe den Schlüssel gefunden."],
        ["helfen", "haben", "geholfen", "Er hat mir geholfen."],
        ["verstehen", "haben", "verstanden", "Ich habe alles verstanden."],
      ],
    },
  ],
  exercises: [
    {
      id: "hilfsverb",
      kind: "gap",
      title: "Übung A — haben oder sein?",
      lede: "Nur das Hilfsverb in der richtigen Form eintragen.",
      items: [
        { n: 1, prompt: "Ich ________ gestern nach Graz gefahren.", answers: ["bin"] },
        { n: 2, prompt: "Wir ________ den Film schon gesehen.", answers: ["haben"] },
        { n: 3, prompt: "Er ________ um sechs Uhr aufgestanden.", answers: ["ist"] },
        { n: 4, prompt: "________ du gestern gearbeitet?", answers: ["hast"] },
        { n: 5, prompt: "Sie ________ zu Hause geblieben.", answers: ["ist"] },
        { n: 6, prompt: "Wir ________ eine Pizza gegessen.", answers: ["haben"] },
        { n: 7, prompt: "Ich ________ noch nie in Wien gewesen.", answers: ["bin"] },
        { n: 8, prompt: "Die Kinder ________ früh eingeschlafen.", answers: ["sind"] },
      ],
    },
    {
      id: "partizip",
      kind: "gap",
      title: "Übung B — Partizip II",
      items: [
        { n: 1, prompt: "machen → ich habe ________", answers: ["gemacht"] },
        { n: 2, prompt: "trinken → ich habe ________", answers: ["getrunken"] },
        { n: 3, prompt: "aufstehen → ich bin ________", answers: ["aufgestanden"] },
        { n: 4, prompt: "studieren → ich habe ________", answers: ["studiert"], why: "Verben auf -ieren bekommen kein ge-." },
        { n: 5, prompt: "besuchen → ich habe ________", answers: ["besucht"], why: "Untrennbares Präfix be- → kein ge-." },
        { n: 6, prompt: "einkaufen → ich habe ________", answers: ["eingekauft"] },
        { n: 7, prompt: "sprechen → ich habe ________", answers: ["gesprochen"] },
        { n: 8, prompt: "fahren → ich bin ________", answers: ["gefahren"] },
        { n: 9, prompt: "verstehen → ich habe ________", answers: ["verstanden"] },
        { n: 10, prompt: "arbeiten → ich habe ________", answers: ["gearbeitet"] },
      ],
    },
    {
      id: "saetze",
      kind: "reveal",
      title: "Übung C — Sätze im Perfekt",
      lede: "Schreibe den Satz im Perfekt. Achte auf die Satzklammer.",
      items: [
        { n: 1, frag: "Ich stehe um sieben Uhr auf.", answer: "Ich bin um sieben Uhr aufgestanden." },
        { n: 2, frag: "Wir fahren mit dem Zug nach Salzburg.", answer: "Wir sind mit dem Zug nach Salzburg gefahren." },
        { n: 3, frag: "Sie kauft am Samstag ein.", answer: "Sie hat am Samstag eingekauft." },
        { n: 4, frag: "Ich arbeite bis 18 Uhr.", answer: "Ich habe bis 18 Uhr gearbeitet." },
        { n: 5, frag: "Gestern rufe ich meine Mutter an.", answer: "Gestern habe ich meine Mutter angerufen.", hint: "Position 1 ist besetzt → Hilfsverb an Position 2." },
        { n: 6, frag: "Er versteht die Frage nicht.", answer: "Er hat die Frage nicht verstanden." },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Welche Verben bilden das Perfekt mit <em>sein</em>?",
      reveal:
        "Verben der <b>Bewegung von A nach B</b> (gehen, fahren, kommen, fliegen) und des <b>Zustandswechsels</b> (aufstehen, einschlafen, aufwachen, werden), dazu <b>sein</b> und <b>bleiben</b>. Alle anderen nehmen <b>haben</b>.",
    },
    {
      q: "Wann bekommt das Partizip II <em>kein</em> ge-?",
      reveal:
        "Bei Verben auf <b>-ieren</b> (studieren → studiert, telefonieren → telefoniert) und bei <b>untrennbaren Präfixen</b> be-, er-, ver-, ent-, ge-, zer- (besucht, erklärt, verstanden). Bei trennbaren Verben rutscht das ge- dagegen in die Mitte: auf<b>ge</b>standen.",
    },
    {
      q: "Wo steht das Partizip II im Satz?",
      reveal:
        "Immer <b>ganz am Ende</b>. Das konjugierte Hilfsverb steht an Position 2, alles andere dazwischen: <b>Ich habe</b> gestern mit meiner Schwester <b>telefoniert.</b>",
    },
  ],
};

export const MORE = {
  akkusativ: AKK,
  dativ: DATIV,
  perfekt: PERFEKT,
};
