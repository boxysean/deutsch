// Grammar topics, part three.

const PRAEP = {
  intro:
    "Manche Präpositionen haben einen fest gebauten Kasus — sie fragen nie nach wo oder wohin, sie nehmen immer denselben Fall. Das ist die gute Nachricht: hier musst du nicht denken, sondern nur auswendig können. Zwei kurze Listen und die Verschmelzungen, mehr ist es nicht.",
  rules: [
    {
      title: "Regel 1 — Die Akkusativ-Liste: für, ohne, gegen, um, durch",
      body: `
        <p>Fünf Präpositionen nehmen <b>immer</b> den Akkusativ, ganz gleich was danach kommt:</p>
        <p><span class="mono"><b style="color:var(--accent)">für</b> · <b style="color:var(--accent)">ohne</b> · <b style="color:var(--accent)">gegen</b> · <b style="color:var(--accent)">um</b> · <b style="color:var(--accent)">durch</b></span></p>
        <p><span class="mono">Das Geschenk ist für <b>den</b> Vater.</span> · <span class="mono">Ich komme ohne <b>meinen</b> Bruder.</span> · <span class="mono">Wir gehen durch <b>den</b> Park.</span></p>
        <p>Eselsbrücke: <b>FODGU</b> — für, ohne, durch, gegen, um.</p>
      `,
      note:
        "<em>ohne</em> steht fast immer ohne Artikel: <em>ohne Auto</em>, <em>ohne Geld</em>, <em>ohne Zucker</em>. Wenn doch ein Artikel kommt, ist er Akkusativ.",
    },
    {
      title: "Regel 2 — Die Dativ-Liste: mit, nach, bei, seit, von, zu, aus",
      body: `
        <p>Diese sieben nehmen <b>immer</b> den Dativ. Man singt sie traditionell auf die Melodie von „Bruder Jakob“:</p>
        <p><span class="mono"><b style="color:var(--accent)">mit · nach · bei · seit · von · zu · aus</b></span> <span style="color:var(--ink-soft)">(dazu noch: gegenüber)</span></p>
        <p><span class="mono">Ich fahre mit <b>dem</b> Bus.</span> · <span class="mono">Nach <b>der</b> Arbeit gehe ich nach Hause.</span> · <span class="mono">Ich wohne bei <b>meinen</b> Eltern.</span> · <span class="mono">Seit <b>einem</b> Jahr lerne ich Deutsch.</span></p>
      `,
      note:
        "Im Plural bekommt der Dativ ein zusätzliches <b>-n</b> am Nomen: <em>mit den Kinder<b>n</b></em>, <em>bei den Freund<b>en</b></em> — außer das Wort endet schon auf -n oder -s.",
    },
    {
      title: "Regel 3 — Verschmelzungen sind Pflicht, nicht Kür",
      body: `
        <p>In der gesprochenen Sprache verschmelzen Präposition und Artikel fast immer. Wer sie ausschreibt, klingt unnatürlich:</p>
        <p>zu + dem → <b>zum</b> · zu + der → <b>zur</b> · von + dem → <b>vom</b> · bei + dem → <b>beim</b> · in + dem → <b>im</b> · an + dem → <b>am</b> · in + das → <b>ins</b> · an + das → <b>ans</b></p>
        <p><span class="mono">Ich gehe <b>zum</b> Arzt.</span> <span style="color:var(--ink-soft)">(nicht: zu dem Arzt)</span> · <span class="mono">Ich komme <b>vom</b> Bahnhof.</span></p>
      `,
    },
    {
      title: "Regel 4 — nach, zu oder in? Der Klassiker",
      body: `
        <p>Alle drei heißen „to“, aber sie teilen sich die Arbeit:</p>
        <p><b>nach</b> + Städte, Länder ohne Artikel, Himmelsrichtungen, <em>nach Hause</em>:<br>
           <span class="mono">Ich fliege nach Wien. · Wir fahren nach Österreich. · Ich gehe nach Hause.</span></p>
        <p><b>zu</b> + Personen und Institutionen:<br>
           <span class="mono">Ich gehe zum Arzt. · Ich fahre zu meiner Schwester. · zur Arbeit, zur Schule</span></p>
        <p><b>in</b> + Gebäude, die man betritt, und Länder <em>mit</em> Artikel:<br>
           <span class="mono">Ich gehe ins Kino. · Wir fahren in die Schweiz. · in die Türkei</span></p>
      `,
      note:
        "Merke die drei festen Paare: <em>zu Hause</em> = wo? (Dativ, ich bin dort) · <em>nach Hause</em> = wohin? (ich gehe dorthin) · <em>bei mir</em> = at my place.",
    },
  ],
  tables: [
    {
      caption: "Feste Präpositionen auf einen Blick",
      lede: "Diese Präpositionen wechseln nie den Kasus — im Gegensatz zu den neun Wechselpräpositionen.",
      head: ["Immer Akkusativ", "Beispiel", "Immer Dativ", "Beispiel"],
      rows: [
        ["für", "Ein Brief für <b>dich</b>.", "mit", "Ich fahre mit <b>dem</b> Zug."],
        ["ohne", "Kaffee ohne <b>den</b> Zucker.", "nach", "Nach <b>dem</b> Essen."],
        ["gegen", "Ich bin gegen <b>den</b> Plan.", "bei", "Bei <b>meiner</b> Oma."],
        ["um", "Um <b>den</b> Tisch herum.", "seit", "Seit <b>zwei</b> Jahren."],
        ["durch", "Durch <b>die</b> Stadt.", "von", "Ein Foto von <b>dem</b> Haus."],
        ["—", "", "zu", "Zu <b>der</b> Party."],
        ["—", "", "aus", "Ich komme aus <b>der</b> Türkei."],
      ],
    },
    {
      caption: "Verschmelzungen",
      head: ["Lang", "Kurz", "Beispiel"],
      rows: [
        ["zu dem", "<b>zum</b>", "Ich gehe zum Bäcker."],
        ["zu der", "<b>zur</b>", "Sie fährt zur Arbeit."],
        ["von dem", "<b>vom</b>", "Das ist vom Chef."],
        ["bei dem", "<b>beim</b>", "Ich war beim Arzt."],
        ["in dem", "<b>im</b>", "Wir sind im Garten."],
        ["in das", "<b>ins</b>", "Wir gehen ins Bett."],
        ["an dem", "<b>am</b>", "Am Montag habe ich frei."],
        ["an das", "<b>ans</b>", "Wir fahren ans Meer."],
      ],
    },
  ],
  exercises: [
    {
      id: "kasus",
      kind: "gap",
      title: "Übung A — Akkusativ oder Dativ?",
      lede: "Setze den richtigen Artikel ein. Die Präposition entscheidet, nicht der Satz.",
      items: [
        { n: 1, prompt: "Ich fahre mit ________ Fahrrad. <em>(das Fahrrad)</em>", answers: ["dem"], why: "mit → immer Dativ" },
        { n: 2, prompt: "Das Geschenk ist für ________ Mutter. <em>(die Mutter)</em>", answers: ["die"], why: "für → immer Akkusativ" },
        { n: 3, prompt: "Wir gehen durch ________ Park. <em>(der Park)</em>", answers: ["den"] },
        { n: 4, prompt: "Nach ________ Kurs trinken wir Kaffee. <em>(der Kurs)</em>", answers: ["dem"] },
        { n: 5, prompt: "Ich wohne bei ________ Eltern. <em>(meine Eltern)</em>", answers: ["meinen"], why: "Dativ Plural bekommt -n" },
        { n: 6, prompt: "Sie kommt ohne ________ Mann. <em>(ihr Mann)</em>", answers: ["ihren"] },
        { n: 7, prompt: "Seit ________ Woche bin ich krank. <em>(eine Woche)</em>", answers: ["einer"] },
        { n: 8, prompt: "Das ist ein Foto von ________ Hochzeit. <em>(die Hochzeit)</em>", answers: ["der"] },
        { n: 9, prompt: "Wir sitzen um ________ Tisch. <em>(der Tisch)</em>", answers: ["den"] },
        { n: 10, prompt: "Ich komme aus ________ Schweiz. <em>(die Schweiz)</em>", answers: ["der"] },
      ],
    },
    {
      id: "verschmelzung",
      kind: "gap",
      title: "Übung B — Verschmelzungen",
      lede: "Schreibe die kurze Form.",
      items: [
        { n: 1, prompt: "Ich gehe ________ Arzt. <em>(zu + dem)</em>", answers: ["zum"] },
        { n: 2, prompt: "Sie fährt ________ Schule. <em>(zu + der)</em>", answers: ["zur"] },
        { n: 3, prompt: "Wir kommen gerade ________ Supermarkt. <em>(von + dem)</em>", answers: ["vom"] },
        { n: 4, prompt: "________ Sonntag schlafe ich lange. <em>(an + dem)</em>", answers: ["am"] },
        { n: 5, prompt: "Im Sommer fahren wir ________ Meer. <em>(an + das)</em>", answers: ["ans"] },
        { n: 6, prompt: "Ich war gestern ________ Zahnarzt. <em>(bei + dem)</em>", answers: ["beim"] },
      ],
    },
    {
      id: "nach-zu-in",
      kind: "gap",
      title: "Übung C — nach, zu oder in?",
      lede: "Nur die Präposition (bei Verschmelzung die kurze Form).",
      items: [
        { n: 1, prompt: "Ich fliege im Juli ________ Italien.", answers: ["nach"], why: "Land ohne Artikel → nach" },
        { n: 2, prompt: "Ich gehe ________ Arzt.", answers: ["zum"], why: "Person/Institution → zu" },
        { n: 3, prompt: "Wir gehen heute Abend ________ Kino.", answers: ["ins"], why: "Gebäude, das man betritt → in" },
        { n: 4, prompt: "Nach der Arbeit fahre ich ________ Hause.", answers: ["nach"] },
        { n: 5, prompt: "Sie fährt ________ Türkei.", answers: ["in die"], display: "in die", why: "Land mit Artikel → in" },
        { n: 6, prompt: "Kommst du morgen ________ mir?", answers: ["zu"] },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Nenne die fünf Akkusativ-Präpositionen und die sieben Dativ-Präpositionen.",
      reveal:
        "<b>Akkusativ:</b> für, ohne, gegen, um, durch. <b>Dativ:</b> mit, nach, bei, seit, von, zu, aus (dazu gegenüber). Diese wechseln nie — anders als in, an, auf, über, unter, vor, hinter, neben, zwischen.",
    },
    {
      q: "Wann sagt man <em>nach</em>, wann <em>zu</em>, wann <em>in</em>?",
      reveal:
        "<b>nach</b> → Städte, Länder ohne Artikel, Himmelsrichtungen, <em>nach Hause</em>. <b>zu</b> → Personen und Institutionen (zum Arzt, zur Arbeit). <b>in</b> → Gebäude, die man betritt (ins Kino), und Länder mit Artikel (in die Schweiz).",
    },
    {
      q: "Was passiert mit dem Nomen im Dativ Plural?",
      reveal:
        "Es bekommt ein zusätzliches <b>-n</b>: <em>mit den Kinder<b>n</b></em>, <em>bei den Freund<b>en</b></em>, <em>von den Häuser<b>n</b></em>. Ausnahme: Wörter, die schon auf -n oder -s enden (<em>mit den Autos</em>).",
    },
    {
      q: "Was ist der Unterschied zwischen <em>zu Hause</em> und <em>nach Hause</em>?",
      reveal:
        "<b>zu Hause</b> = wo? Ich <em>bin</em> dort. <b>nach Hause</b> = wohin? Ich <em>gehe</em> dorthin. <em>Ich bin zu Hause</em> ✓ · <em>Ich gehe nach Hause</em> ✓",
    },
  ],
};

const PRAET = {
  intro:
    "Im Alltag erzählst du mit dem Perfekt — aber bei sein, haben und den Modalverben klingt das Perfekt schwerfällig. Da nimmt man das Präteritum: war, hatte, konnte, musste, wollte. Genau diese Formen brauchst du auf A2 ständig, und mehr als diese Handvoll musst du gar nicht können.",
  rules: [
    {
      title: "Regel 1 — Wann Präteritum, wann Perfekt?",
      body: `
        <p><b style="color:var(--accent)">Präteritum</b> im Sprechen nur bei: <b>sein, haben</b> und den <b>Modalverben</b> (können, müssen, wollen, dürfen, sollen, mögen). Dazu <em>es gab</em>.</p>
        <p><span class="mono">Gestern <b>war</b> ich krank.</span> <span style="color:var(--ink-soft)">(nicht: bin ich krank gewesen)</span><br>
           <span class="mono">Ich <b>hatte</b> keine Zeit.</span> · <span class="mono">Ich <b>musste</b> arbeiten.</span></p>
        <p><b style="color:var(--accent)">Perfekt</b> bei allen anderen Verben:<br>
           <span class="mono">Ich <b>habe</b> Pizza <b>gegessen</b>.</span> · <span class="mono">Wir <b>sind</b> nach Wien <b>gefahren</b>.</span></p>
      `,
      note:
        "In Zeitungen, Büchern und Märchen steht das Präteritum bei allen Verben (<em>er ging, sie sagte</em>). Auf A2 musst du das nur <b>erkennen</b>, nicht selbst produzieren.",
    },
    {
      title: "Regel 2 — Die Endungen des Präteritums",
      body: `
        <p>Das Präteritum hat eine eigene, sehr einfache Endungsreihe. Auffällig: <b>ich</b> und <b>er/sie/es</b> sind identisch und haben <b>keine Endung</b>.</p>
        <p><span class="mono">ich war<b>—</b> · du war<b>st</b> · er war<b>—</b> · wir war<b>en</b> · ihr war<b>t</b> · sie war<b>en</b></span></p>
        <p>Bei den Modalverben und regelmäßigen Verben kommt ein <b>-t-</b> dazwischen:<br>
           <span class="mono">ich muss<b>te</b> · du muss<b>test</b> · er muss<b>te</b> · wir muss<b>ten</b> · ihr muss<b>tet</b> · sie muss<b>ten</b></span></p>
      `,
    },
    {
      title: "Regel 3 — Modalverben verlieren den Umlaut",
      body: `
        <p>Im Präteritum fällt der Umlaut weg — das ist die ganze Schwierigkeit:</p>
        <p>k<b>ö</b>nnen → k<b>o</b>nnte · m<b>ü</b>ssen → m<b>u</b>sste · d<b>ü</b>rfen → d<b>u</b>rfte · m<b>ö</b>gen → m<b>o</b>chte</p>
        <p>Ohne Umlaut bleibt alles gleich: wollen → <b>wollte</b> · sollen → <b>sollte</b></p>
      `,
      note:
        "<em>möchte</em> ist kein eigenes Verb, sondern eine Höflichkeitsform von <em>mögen</em>. Ihre Vergangenheit ist <b>wollte</b>: <em>Ich möchte einen Kaffee</em> → <em>Ich <b>wollte</b> einen Kaffee.</em>",
    },
    {
      title: "Regel 4 — Satzklammer bleibt bestehen",
      body: `
        <p>Auch im Präteritum steht der Infinitiv am Satzende:</p>
        <p><span class="mono">Ich <b style="color:var(--accent)">musste</b> gestern lange <b style="color:var(--accent)">arbeiten</b>.</span><br>
           <span class="mono">Wir <b style="color:var(--accent)">konnten</b> leider nicht <b style="color:var(--accent)">kommen</b>.</span></p>
        <p>Im Nebensatz rutscht das konjugierte Verb ganz nach hinten:<br>
           <span class="mono">…, weil ich lange arbeiten <b>musste</b>.</span></p>
      `,
    },
  ],
  tables: [
    {
      caption: "sein, haben und es gibt",
      head: ["", "sein", "haben", "es gibt"],
      rows: [
        ["ich", "<b>war</b>", "<b>hatte</b>", "—"],
        ["du", "warst", "hattest", "—"],
        ["er/sie/es", "<b>war</b>", "<b>hatte</b>", "es <b>gab</b>"],
        ["wir", "waren", "hatten", "—"],
        ["ihr", "wart", "hattet", "—"],
        ["sie/Sie", "waren", "hatten", "—"],
      ],
    },
    {
      caption: "Modalverben im Präteritum",
      lede: "Nur die ich-Form lernen — der Rest folgt der Reihe -te, -test, -te, -ten, -tet, -ten.",
      head: ["Infinitiv", "Präteritum (ich)", "Beispiel"],
      rows: [
        ["können", "<b>konnte</b>", "Ich konnte nicht schlafen."],
        ["müssen", "<b>musste</b>", "Ich musste früh aufstehen."],
        ["wollen", "<b>wollte</b>", "Wir wollten ins Kino gehen."],
        ["dürfen", "<b>durfte</b>", "Als Kind durfte ich das nicht."],
        ["sollen", "<b>sollte</b>", "Du solltest mehr schlafen."],
        ["mögen", "<b>mochte</b>", "Ich mochte das Essen nicht."],
      ],
    },
  ],
  exercises: [
    {
      id: "sein-haben",
      kind: "gap",
      title: "Übung A — sein und haben",
      lede: "Setze das Präteritum ein.",
      items: [
        { n: 1, prompt: "Gestern ________ ich krank. <em>(sein)</em>", answers: ["war"] },
        { n: 2, prompt: "Wo ________ ihr am Wochenende? <em>(sein)</em>", answers: ["wart"] },
        { n: 3, prompt: "Wir ________ leider keine Zeit. <em>(haben)</em>", answers: ["hatten"] },
        { n: 4, prompt: "________ du gestern zu Hause? <em>(sein)</em>", answers: ["Warst", "warst"], display: "warst" },
        { n: 5, prompt: "Meine Eltern ________ ein kleines Haus. <em>(haben)</em>", answers: ["hatten"] },
        { n: 6, prompt: "Es ________ viele Leute auf dem Fest. <em>(geben)</em>", answers: ["gab"] },
        { n: 7, prompt: "Der Film ________ sehr langweilig. <em>(sein)</em>", answers: ["war"] },
        { n: 8, prompt: "Ich ________ gestern Kopfschmerzen. <em>(haben)</em>", answers: ["hatte"] },
      ],
    },
    {
      id: "modal",
      kind: "gap",
      title: "Übung B — Modalverben",
      lede: "Achte auf den fehlenden Umlaut.",
      items: [
        { n: 1, prompt: "Ich ________ gestern nicht kommen. <em>(können)</em>", answers: ["konnte"] },
        { n: 2, prompt: "Wir ________ früh aufstehen. <em>(müssen)</em>", answers: ["mussten"] },
        { n: 3, prompt: "Als Kind ________ ich nicht allein rausgehen. <em>(dürfen)</em>", answers: ["durfte"] },
        { n: 4, prompt: "Was ________ ihr am Samstag machen? <em>(wollen)</em>", answers: ["wolltet"] },
        { n: 5, prompt: "Sie ________ das Essen nicht. <em>(mögen)</em>", answers: ["mochte"] },
        { n: 6, prompt: "Du ________ mich anrufen! <em>(sollen)</em>", answers: ["solltest"] },
        { n: 7, prompt: "Meine Freunde ________ leider nicht mitfahren. <em>(können)</em>", answers: ["konnten"] },
        { n: 8, prompt: "Ich ________ einen Kaffee, aber die Bar war zu. <em>(möchte → Vergangenheit)</em>", answers: ["wollte"], why: "möchte hat kein eigenes Präteritum — man nimmt wollte." },
      ],
    },
    {
      id: "umbau",
      kind: "reveal",
      title: "Übung C — Vom Präsens in die Vergangenheit",
      lede: "Sag den Satz laut in der Vergangenheit, dann aufdecken.",
      items: [
        { n: 1, frag: "Ich bin müde und habe Hunger.", answer: "Ich <b>war</b> müde und <b>hatte</b> Hunger." },
        { n: 2, frag: "Wir müssen leider gehen.", answer: "Wir <b>mussten</b> leider gehen." },
        { n: 3, frag: "Kannst du mir helfen?", answer: "<b>Konntest</b> du mir helfen?" },
        { n: 4, frag: "Es gibt keinen Platz mehr.", answer: "Es <b>gab</b> keinen Platz mehr." },
        { n: 5, frag: "Ich darf nicht rauchen.", answer: "Ich <b>durfte</b> nicht rauchen." },
        { n: 6, frag: "Sie will nach Wien fahren.", answer: "Sie <b>wollte</b> nach Wien fahren." },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Bei welchen Verben nimmt man im Gespräch das Präteritum statt des Perfekts?",
      reveal:
        "Bei <b>sein</b> (war), <b>haben</b> (hatte), den <b>Modalverben</b> (konnte, musste, wollte, durfte, sollte, mochte) und <b>es gab</b>. Alle anderen Verben stehen im Perfekt.",
    },
    {
      q: "Welche zwei Personen haben im Präteritum dieselbe Form?",
      reveal:
        "<b>ich</b> und <b>er/sie/es</b> — beide ohne Endung: <em>ich war / er war</em>, <em>ich musste / sie musste</em>. Das ist der wichtigste Unterschied zum Präsens.",
    },
    {
      q: "Was passiert mit dem Umlaut der Modalverben?",
      reveal:
        "Er <b>verschwindet</b>: können → k<b>o</b>nnte, müssen → m<b>u</b>sste, dürfen → d<b>u</b>rfte, mögen → m<b>o</b>chte. Nur wollen und sollen hatten nie einen: wollte, sollte.",
    },
    {
      q: "Wie sagt man <em>Ich möchte einen Kaffee</em> in der Vergangenheit?",
      reveal:
        "<b>Ich wollte einen Kaffee.</b> <em>möchte</em> ist selbst schon eine Konjunktiv-Form von <em>mögen</em> und hat keine eigene Vergangenheit.",
    },
  ],
};

const REFLEX = {
  intro:
    "Zwei kleine Themen, die im Sprechen-Teil auffallen. Reflexive Verben brauchst du für den Tagesablauf und für Gefühle — sich waschen, sich freuen, sich treffen. Und mit dem Konjunktiv II (würde, könnte, hätte) wirst du höflich, statt zu befehlen. Genau das erwartet die Prüfung bei Bitten und Vorschlägen.",
  rules: [
    {
      title: "Regel 1 — Reflexivpronomen im Akkusativ",
      body: `
        <p>Bei reflexiven Verben zeigt die Handlung auf die handelnde Person zurück. Das Pronomen richtet sich nach dem Subjekt:</p>
        <p><span class="mono">ich wasche <b style="color:var(--accent)">mich</b> · du wäschst <b style="color:var(--accent)">dich</b> · er/sie/es wäscht <b style="color:var(--accent)">sich</b><br>
           wir waschen <b style="color:var(--accent)">uns</b> · ihr wascht <b style="color:var(--accent)">euch</b> · sie/Sie waschen <b style="color:var(--accent)">sich</b></span></p>
        <p>Nur die 3. Person und die Höflichkeitsform haben ein eigenes Wort: <b>sich</b>. Der Rest sind ganz normale Akkusativpronomen.</p>
      `,
      note:
        "Im Wörterbuch steht das Verb immer mit <em>sich</em>: <b>sich freuen</b>, <b>sich treffen</b>, <b>sich interessieren für</b>. Lerne das <em>sich</em> als Teil des Wortes mit.",
    },
    {
      title: "Regel 2 — Position des Pronomens",
      body: `
        <p>Das Reflexivpronomen steht <b>direkt nach dem konjugierten Verb</b>:</p>
        <p><span class="mono">Ich <b>freue mich</b> auf das Wochenende.</span></p>
        <p>Steht etwas anderes auf Position 1, rutscht das Subjekt hinter das Verb — das Pronomen folgt gleich danach:<br>
           <span class="mono">Morgen <b>freue ich mich</b> auf das Wochenende.</span></p>
        <p>Im Nebensatz und in der Frage direkt hinter dem Subjekt:<br>
           <span class="mono">…, weil <b>ich mich</b> freue.</span> · <span class="mono"><b>Freust du dich</b>?</span></p>
      `,
    },
    {
      title: "Regel 3 — Wenn ein Körperteil dazukommt: Dativ",
      body: `
        <p>Wäschst du <em>dich</em>, ist das Pronomen Akkusativ. Wäschst du dir <em>die Hände</em>, ist die Hand das Akkusativobjekt — und das Pronomen wird <b>Dativ</b>:</p>
        <p><span class="mono">Ich wasche <b>mich</b>.</span> → <span class="mono">Ich wasche <b style="color:var(--accent)">mir</b> die Hände.</span><br>
           <span class="mono">Ich putze <b style="color:var(--accent)">mir</b> die Zähne.</span> · <span class="mono">Ich ziehe <b style="color:var(--accent)">mir</b> die Jacke an.</span></p>
        <p>Nur zwei Formen ändern sich: <b>mich → mir</b> und <b>dich → dir</b>. Alle anderen bleiben gleich.</p>
      `,
    },
    {
      title: "Regel 4 — Konjunktiv II: höflich statt direkt",
      body: `
        <p>Auf A2 brauchst du nur eine Handvoll Formen — sie machen aus einem Befehl eine Bitte:</p>
        <p><b>würde</b> + Infinitiv für fast alles:<br>
           <span class="mono">Ich <b style="color:var(--accent)">würde</b> gern einen Kaffee <b>trinken</b>.</span> · <span class="mono"><b>Würden</b> Sie mir bitte helfen?</span></p>
        <p><b>könnte, hätte, wäre, möchte</b> nimmt man direkt, ohne würde:<br>
           <span class="mono"><b style="color:var(--accent)">Könnten</b> Sie das wiederholen?</span> · <span class="mono">Ich <b>hätte</b> gern die Rechnung.</span> · <span class="mono">Das <b>wäre</b> super!</span></p>
      `,
      note:
        "Prüfungstipp: <em>Könnten Sie …?</em> und <em>Ich hätte gern …</em> sind die zwei nützlichsten Sätze im Sprechen-Teil. Wer sie benutzt, klingt sofort eine Stufe höher.",
    },
    {
      title: "Regel 5 — Vorschläge und Wünsche",
      body: `
        <p>Mit dem Konjunktiv II machst du Vorschläge, ohne aufdringlich zu wirken — genau das verlangt die mündliche Aufgabe „gemeinsam etwas planen“:</p>
        <p><span class="mono">Wir <b>könnten</b> ins Kino gehen.</span> <span style="color:var(--ink-soft)">(Vorschlag)</span><br>
           <span class="mono"><b>Sollten</b> wir nicht früher losfahren?</span> <span style="color:var(--ink-soft)">(vorsichtiger Rat)</span><br>
           <span class="mono">Ich <b>hätte</b> gern mehr Zeit.</span> <span style="color:var(--ink-soft)">(Wunsch)</span></p>
      `,
    },
  ],
  tables: [
    {
      caption: "Reflexivpronomen",
      head: ["Person", "Akkusativ", "Dativ", "Beispiel"],
      rows: [
        ["ich", "<b>mich</b>", "<b>mir</b>", "Ich wasche mich / mir die Hände."],
        ["du", "<b>dich</b>", "<b>dir</b>", "Du wäschst dich / dir die Hände."],
        ["er/sie/es", "sich", "sich", "Er wäscht sich / sich die Hände."],
        ["wir", "uns", "uns", "Wir waschen uns."],
        ["ihr", "euch", "euch", "Ihr wascht euch."],
        ["sie/Sie", "sich", "sich", "Sie waschen sich."],
      ],
    },
    {
      caption: "Häufige reflexive Verben auf A2",
      head: ["Verb", "Bedeutung", "Beispiel"],
      rows: [
        ["sich freuen <b>auf</b> (+Akk.)", "look forward to", "Ich freue mich auf den Urlaub."],
        ["sich freuen <b>über</b> (+Akk.)", "be glad about", "Ich freue mich über dein Geschenk."],
        ["sich interessieren <b>für</b>", "be interested in", "Er interessiert sich für Musik."],
        ["sich treffen <b>mit</b>", "meet up with", "Ich treffe mich mit Anna."],
        ["sich ärgern <b>über</b>", "be annoyed about", "Sie ärgert sich über den Lärm."],
        ["sich erinnern <b>an</b>", "remember", "Erinnerst du dich an ihn?"],
        ["sich vorstellen", "introduce oneself", "Darf ich mich vorstellen?"],
        ["sich anziehen", "get dressed", "Ich ziehe mich schnell an."],
        ["sich beeilen", "hurry up", "Beeil dich!"],
        ["sich entschuldigen", "apologise", "Ich entschuldige mich."],
      ],
    },
    {
      caption: "Konjunktiv II — die Formen, die du brauchst",
      head: ["Verb", "Konjunktiv II", "Höfliche Verwendung"],
      rows: [
        ["werden", "<b>würde</b>", "Ich würde gern bezahlen."],
        ["können", "<b>könnte</b>", "Könnten Sie mir helfen?"],
        ["haben", "<b>hätte</b>", "Ich hätte gern ein Zimmer."],
        ["sein", "<b>wäre</b>", "Das wäre sehr nett."],
        ["mögen", "<b>möchte</b>", "Ich möchte einen Tee."],
        ["sollen", "<b>sollte</b>", "Du solltest zum Arzt gehen."],
      ],
    },
  ],
  exercises: [
    {
      id: "reflexiv",
      kind: "gap",
      title: "Übung A — Reflexivpronomen",
      lede: "Akkusativ oder Dativ? Frag dich, ob noch ein Objekt im Satz steht.",
      items: [
        { n: 1, prompt: "Ich freue ________ auf das Wochenende.", answers: ["mich"] },
        { n: 2, prompt: "Wäschst du ________ die Hände?", answers: ["dir"], why: "die Hände ist schon Akkusativ → Pronomen im Dativ" },
        { n: 3, prompt: "Wir treffen ________ um acht.", answers: ["uns"] },
        { n: 4, prompt: "Er interessiert ________ für Fußball.", answers: ["sich"] },
        { n: 5, prompt: "Beeilt ________ bitte!", answers: ["euch"] },
        { n: 6, prompt: "Ich putze ________ dreimal am Tag die Zähne.", answers: ["mir"] },
        { n: 7, prompt: "Darf ich ________ vorstellen? Ich heiße Ali.", answers: ["mich"] },
        { n: 8, prompt: "Meine Eltern ärgern ________ über die Nachbarn.", answers: ["sich"] },
        { n: 9, prompt: "Zieh ________ warm an, es ist kalt!", answers: ["dich"] },
        { n: 10, prompt: "Erinnerst du ________ an unseren Lehrer?", answers: ["dich"] },
      ],
    },
    {
      id: "konjunktiv",
      kind: "gap",
      title: "Übung B — Höflich mit Konjunktiv II",
      lede: "Setze die passende Form ein: würde, könnte, hätte, wäre.",
      items: [
        { n: 1, prompt: "________ Sie mir bitte helfen? <em>(können)</em>", answers: ["Könnten", "könnten"], display: "Könnten" },
        { n: 2, prompt: "Ich ________ gern die Rechnung. <em>(haben)</em>", answers: ["hätte"] },
        { n: 3, prompt: "Das ________ sehr nett von dir. <em>(sein)</em>", answers: ["wäre"] },
        { n: 4, prompt: "Ich ________ gern nach Wien fahren. <em>(werden)</em>", answers: ["würde"] },
        { n: 5, prompt: "Wir ________ auch ins Museum gehen. <em>(können)</em>", answers: ["könnten"] },
        { n: 6, prompt: "Du ________ mehr schlafen. <em>(sollen)</em>", answers: ["solltest"] },
        { n: 7, prompt: "________ ihr Zeit am Samstag? <em>(haben)</em>", answers: ["Hättet", "hättet"], display: "Hättet" },
      ],
    },
    {
      id: "hoeflich",
      kind: "reveal",
      title: "Übung C — Sag es höflicher",
      lede: "Formuliere den direkten Satz höflich um, dann aufdecken.",
      items: [
        { n: 1, frag: "Helfen Sie mir!", answer: "<b>Könnten Sie mir bitte helfen?</b>", hint: "können im Konjunktiv II" },
        { n: 2, frag: "Ich will ein Bier.", answer: "<b>Ich hätte gern ein Bier.</b>", hint: "haben im Konjunktiv II" },
        { n: 3, frag: "Wiederholen Sie das!", answer: "<b>Würden Sie das bitte wiederholen?</b>" },
        { n: 4, frag: "Wir gehen ins Kino.", answer: "<b>Wir könnten ins Kino gehen.</b> <span style=\"color:var(--ink-soft)\">(ein Vorschlag statt einer Ansage)</span>" },
        { n: 5, frag: "Geh zum Arzt!", answer: "<b>Du solltest zum Arzt gehen.</b>" },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Wann steht das Reflexivpronomen im Dativ statt im Akkusativ?",
      reveal:
        "Wenn im Satz schon ein <b>Akkusativobjekt</b> steht — meistens ein Körperteil oder ein Kleidungsstück. <em>Ich wasche <b>mich</b></em> (Akk.) vs. <em>Ich wasche <b>mir</b> die Hände</em> (Dat.). Nur mich→mir und dich→dir ändern sich.",
    },
    {
      q: "Wo steht das Reflexivpronomen im Satz?",
      reveal:
        "Direkt hinter dem <b>konjugierten Verb</b>: <em>Ich freue <b>mich</b>…</em> Steht ein anderes Wort auf Position 1, folgt es dem nachgestellten Subjekt: <em>Morgen freue ich <b>mich</b>…</em>",
    },
    {
      q: "Welche vier Konjunktiv-II-Formen brauchst du in der Prüfung am meisten?",
      reveal:
        "<b>würde</b> (+ Infinitiv), <b>könnte</b>, <b>hätte</b> und <b>wäre</b>. Damit machst du Bitten (<em>Könnten Sie …?</em>), Bestellungen (<em>Ich hätte gern …</em>), Vorschläge (<em>Wir könnten …</em>) und Bewertungen (<em>Das wäre super</em>).",
    },
    {
      q: "Wann nimmt man <em>würde</em> und wann die eigene Form?",
      reveal:
        "<b>würde + Infinitiv</b> bei fast allen Verben. Bei <b>sein, haben, können, sollen, mögen</b> nimmt man die eigene Form direkt: <em>wäre, hätte, könnte, sollte, möchte</em> — nie <em>würde sein</em> oder <em>würde haben</em>.",
    },
  ],
};

export const MORE3 = {
  praepositionen: PRAEP,
  "praeteritum-modalverben": PRAET,
  "reflexiv-konjunktiv": REFLEX,
};
