// B1 grammar, part 1 — the first topics on the route.
//
// Neither the ZDÖ B1 Durchführungsbestimmungen nor the Modellsatz specifies a
// grammar syllabus, so the selection here is from the CEFR B1 descriptors. What
// IS sourced is the emphasis: the Modellsatz's Sprachbausteine tasks are a
// gap-fill and a word-bank cloze over a letter, and its Schreiben task is a
// reply to a person or an authority — so connectors, tense choice and relative
// clauses are the machinery those tasks actually run on.

export const TOPICS_B1 = {
  "b1-nebensaetze": {
    intro:
      "Auf A2 hast du <em>weil</em>, <em>dass</em> und <em>wenn</em> gelernt. Auf B1 kommt der Rest dazu — und wichtiger: du sollst sie <b>mischen</b>, weil ein B1-Text aus verbundenen Sätzen besteht, nicht aus Aneinanderreihung. Die Sprachbausteine im Modellsatz prüfen genau das: eine Lücke, drei Konnektoren, nur einer passt. Entscheidend ist jedes Mal dieselbe Frage: <em>Welche Beziehung besteht zwischen den beiden Sätzen — Grund, Gegensatz, Zweck, Zeit?</em>",
    rules: [
      {
        title: "Regel 1 — Drei Bauarten, drei Wortstellungen",
        body: `
          <p>Deutsche Verbindungswörter sehen ähnlich aus, verhalten sich aber völlig verschieden. Es gibt genau drei Gruppen:</p>
          <p><b>Nebensatz-Konnektoren</b> (<span class="mono">weil, dass, obwohl, damit, wenn, als, während, bevor, nachdem, seit, falls, ob</span>) — <strong>Verb ganz ans Ende</strong>.<br>
             <span class="mono">Ich bleibe zu Hause, <b>weil</b> ich krank <b>bin</b>.</span></p>
          <p><b>Hauptsatz-Konnektoren auf Position 0</b> (<span class="mono">und, aber, oder, denn, sondern</span>) — sie zählen <strong>nicht mit</strong>, das Verb bleibt an Position 2.<br>
             <span class="mono">Ich bleibe zu Hause, <b>denn</b> ich <b>bin</b> krank.</span></p>
          <p><b>Adverbien</b> (<span class="mono">deshalb, trotzdem, dennoch, außerdem, sonst</span>) — sie stehen <strong>auf Position 1</strong>, also kommt das Subjekt hinter das Verb.<br>
             <span class="mono">Ich bin krank, <b>deshalb bleibe ich</b> zu Hause.</span></p>
        `,
        note:
          "Der häufigste B1-Fehler: <em>deshalb</em> wie <em>weil</em> behandeln. <em>… deshalb ich zu Hause bleibe</em> ✗ → <strong>… deshalb bleibe ich zu Hause.</strong> ✓",
      },
      {
        title: "Regel 2 — Grund und Gegensatz",
        body: `
          <p><b>weil</b> und <b>denn</b> sagen dasselbe, bauen aber anders: <em>weil</em> schickt das Verb ans Ende, <em>denn</em> nicht.</p>
          <p><b>obwohl</b> ist der Gegensatz im Nebensatz, <b>trotzdem</b> derselbe Gedanke als Adverb:</p>
          <p><span class="mono">Ich gehe spazieren, <b>obwohl</b> es <b>regnet</b>.</span><br>
             <span class="mono">Es regnet. <b>Trotzdem gehe ich</b> spazieren.</span></p>
          <p>Beides kommt in der Prüfung vor, weil beides eine Meinung begründet — und genau das verlangt Sprechen 2.</p>
        `,
        note: "In gesprochenem Deutsch hört man oft <em>weil</em> + Hauptsatzstellung. Schreib es trotzdem korrekt: bewertet wird die Schriftform.",
      },
      {
        title: "Regel 3 — Zweck: damit oder um … zu",
        body: `
          <p>Beide drücken eine Absicht aus. Der Unterschied ist nur, <em>wer</em> handelt:</p>
          <p><b>Gleiches Subjekt</b> → <span class="mono">um … zu</span>:<br>
             <span class="mono">Ich lerne Deutsch, <b>um</b> in Wien zu <b>arbeiten</b>.</span> <span style="color:var(--ink-soft)">(ich lerne, ich arbeite)</span></p>
          <p><b>Verschiedene Subjekte</b> → <span class="mono">damit</span>:<br>
             <span class="mono">Ich erkläre es langsam, <b>damit</b> du mich <b>verstehst</b>.</span> <span style="color:var(--ink-soft)">(ich erkläre, du verstehst)</span></p>
        `,
        note: "<em>damit</em> geht immer, auch bei gleichem Subjekt — <em>um … zu</em> nur bei gleichem. Im Zweifel also <em>damit</em>.",
      },
      {
        title: "Regel 4 — Zeit: als, wenn, während, bevor, nachdem, seit",
        body: `
          <p><b>als</b> = einmal in der Vergangenheit. <b>wenn</b> = jedes Mal, oder in der Zukunft.</p>
          <p><span class="mono"><b>Als</b> ich ein Kind war, …</span> <span style="color:var(--ink-soft)">(einmal, vorbei)</span><br>
             <span class="mono"><b>Wenn</b> ich Zeit habe, …</span> <span style="color:var(--ink-soft)">(immer / künftig)</span></p>
          <p><b>während</b> = gleichzeitig · <b>bevor</b> = davor · <b>nachdem</b> = danach · <b>seit</b> = seit einem Zeitpunkt bis jetzt.</p>
          <p>Bei <b>nachdem</b> stehen die zwei Sätze in <em>verschiedenen</em> Zeiten — siehe Schritt 29, Plusquamperfekt.</p>
        `,
        note: "Merksatz: <strong>als</strong> = <strong>einmal</strong>, beide mit „a“. Alles Wiederholte nimmt <em>wenn</em>.",
      },
    ],
    tables: [
      {
        caption: "Die drei Gruppen auf einen Blick",
        lede: "Was das Wort mit dem Verb macht, ist das Einzige, was du wirklich auswendig brauchst.",
        head: ["Gruppe", "Beispiele", "Wo steht das Verb?"],
        rows: [
          ["Nebensatz-Konnektor", "weil, dass, obwohl, damit, wenn, als, während, bevor, nachdem, seit, falls, ob", "ganz am Ende"],
          ["Position-0-Konnektor", "und, aber, oder, denn, sondern", "Position 2 (unverändert)"],
          ["Adverb", "deshalb, darum, deswegen, trotzdem, dennoch, außerdem, sonst", "direkt danach — Subjekt rückt hinter das Verb"],
        ],
      },
      {
        caption: "Welche Bedeutung, welches Wort",
        head: ["Bedeutung", "Nebensatz", "Hauptsatz / Adverb"],
        rows: [
          ["Grund", "weil, da", "denn · deshalb, darum, deswegen"],
          ["Gegensatz", "obwohl", "aber · trotzdem, dennoch"],
          ["Zweck", "damit · um … zu", "dafür"],
          ["Bedingung", "wenn, falls", "sonst"],
          ["Zeit gleichzeitig", "während, wenn, als", "dabei, gleichzeitig"],
          ["Zeit davor", "bevor, ehe", "vorher, davor"],
          ["Zeit danach", "nachdem", "danach, anschließend"],
        ],
      },
    ],
    exercises: [
      {
        id: "b1neb1",
        kind: "gap",
        title: "Übung A — welcher Konnektor?",
        lede: "Setze das passende Wort ein. Achte darauf, wo das Verb steht — das verrät die Gruppe.",
        items: [
          { n: 1, prompt: "Ich konnte nicht kommen, ________ ich krank war. <em>(Grund, Nebensatz)</em>", answers: ["weil", "da"] },
          { n: 2, prompt: "Es hat geregnet. ________ sind wir spazieren gegangen. <em>(Gegensatz, Adverb)</em>", answers: ["Trotzdem", "trotzdem", "Dennoch", "dennoch"] },
          { n: 3, prompt: "Ich spare Geld, ________ ich mir ein Auto kaufen kann. <em>(Zweck, zwei Subjekte? nein — aber Nebensatz)</em>", answers: ["damit"] },
          { n: 4, prompt: "________ ich klein war, haben wir in Graz gewohnt. <em>(einmal, Vergangenheit)</em>", answers: ["Als", "als"] },
          { n: 5, prompt: "________ ich Zeit habe, gehe ich schwimmen. <em>(jedes Mal)</em>", answers: ["Wenn", "wenn"] },
          { n: 6, prompt: "Ich bin müde, ________ ich habe schlecht geschlafen. <em>(Grund, Position 0)</em>", answers: ["denn"] },
          { n: 7, prompt: "________ es sehr teuer war, habe ich es gekauft. <em>(Gegensatz, Nebensatz)</em>", answers: ["Obwohl", "obwohl"] },
          { n: 8, prompt: "Ruf mich an, ________ du am Bahnhof ankommst. <em>(Zeit, künftig)</em>", answers: ["wenn", "sobald"] },
          { n: 9, prompt: "Ich lerne jeden Tag, ________ die Prüfung zu bestehen. <em>(Zweck, gleiches Subjekt)</em>", answers: ["um"] },
          { n: 10, prompt: "Wir wohnen hier, ________ wir nach Wien gezogen sind. <em>(Zeitpunkt bis jetzt)</em>", answers: ["seit", "seitdem"] },
        ],
      },
      {
        id: "b1neb2",
        kind: "gap",
        title: "Übung B — Wortstellung",
        lede: "Schreib den ganzen Satz. Das Verb an die richtige Stelle ist hier die halbe Miete.",
        items: [
          { n: 1, prompt: "Ich bleibe zu Hause. Grund: Ich bin müde. → <em>weil</em>: Ich bleibe zu Hause, ________", answers: ["weil ich müde bin", "weil ich müde bin."] },
          { n: 2, prompt: "Dasselbe mit <em>deshalb</em>: Ich bin müde, ________", answers: ["deshalb bleibe ich zu Hause", "deshalb bleibe ich zu Hause."] },
          { n: 3, prompt: "Dasselbe mit <em>denn</em>: Ich bleibe zu Hause, ________", answers: ["denn ich bin müde", "denn ich bin müde."] },
          { n: 4, prompt: "Zweck, gleiches Subjekt: Ich fahre nach Wien. Ich will dort studieren. → Ich fahre nach Wien, ________", answers: ["um dort zu studieren", "um dort zu studieren."] },
          { n: 5, prompt: "Gegensatz: Es war kalt. Wir sind geschwommen. → <em>obwohl</em>: Wir sind geschwommen, ________", answers: ["obwohl es kalt war", "obwohl es kalt war."] },
          { n: 6, prompt: "Zeit: Ich habe gegessen. Danach bin ich gegangen. → <em>bevor</em>: ________ ich gegangen bin, habe ich gegessen.", answers: ["Bevor", "bevor"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wo steht das Verb nach <em>deshalb</em> — und warum ist das anders als nach <em>weil</em>?",
        reveal:
          "<em>deshalb</em> ist ein <b>Adverb</b> und besetzt Position 1, also folgt sofort das Verb und dann das Subjekt: <b>deshalb bleibe ich</b>. <em>weil</em> ist ein <b>Nebensatz-Konnektor</b> und schickt das Verb ans Ende: <b>weil ich bleibe</b>.",
      },
      {
        q: "Wann <em>um … zu</em>, wann <em>damit</em>?",
        reveal:
          "<em>um … zu</em> nur bei <b>gleichem Subjekt</b> in beiden Teilen. Bei verschiedenen Subjekten geht nur <em>damit</em>. Und <em>damit</em> ist immer erlaubt — im Zweifel also damit.",
      },
      {
        q: "<em>als</em> oder <em>wenn</em>?",
        reveal:
          "<b>als</b> für ein <b>einmaliges</b> Ereignis in der Vergangenheit (Als ich 18 wurde …). <b>wenn</b> für Wiederholtes (Immer wenn …) oder Künftiges (Wenn ich Zeit habe …).",
      },
      {
        q: "Welche Konnektoren stehen auf „Position 0“ und ändern gar nichts?",
        reveal: "<b>und, aber, oder, denn, sondern</b> — sie zählen bei der Positionszählung nicht mit, das Verb bleibt an Position 2.",
      },
    ],
  },

  "b1-praeteritum": {
    intro:
      "Das Perfekt ist die Vergangenheit, die man <em>spricht</em>; das Präteritum ist die, die man <em>schreibt und liest</em>. Auf B1 brauchst du es in beide Richtungen: der Zeitungsartikel in Lesen 2 steht im Präteritum, und wer beim Schreiben eine Geschichte erzählt, wirkt damit erwachsener. Die gute Nachricht: du kennst die wichtigsten Formen längst — <em>war</em>, <em>hatte</em>, <em>konnte</em> benutzt du seit A2.",
    rules: [
      {
        title: "Regel 1 — Regelmäßig: -te- einschieben",
        body: `
          <p>Stamm + <b>-te-</b> + Endung. Die 1. und 3. Person Singular sind <strong>gleich</strong> und haben <strong>keine</strong> Endung:</p>
          <p><span class="mono">machen → ich <b>machte</b>, du <b>machtest</b>, er <b>machte</b>, wir <b>machten</b>, ihr <b>machtet</b>, sie <b>machten</b></span></p>
          <p>Endet der Stamm auf <em>-t</em>, <em>-d</em> oder schwer sprechbar, kommt ein <b>-e-</b> dazu: <span class="mono">arbeiten → arbeit<b>e</b>te</span>, <span class="mono">warten → wart<b>e</b>te</span>.</p>
        `,
        note: "Anders als im Englischen gibt es keine Hilfsverb-Form: <em>Ich machte</em> heißt sowohl „I made“ als auch „I was making“.",
      },
      {
        title: "Regel 2 — Unregelmäßig: der Vokal ändert sich",
        body: `
          <p>Kein <em>-te-</em>, sondern ein anderer Stammvokal, und wieder <strong>keine Endung</strong> in der 1./3. Person Singular:</p>
          <p><span class="mono">gehen → ich <b>ging</b>, du <b>gingst</b>, er <b>ging</b>, wir <b>gingen</b></span><br>
             <span class="mono">fahren → ich <b>fuhr</b> · kommen → ich <b>kam</b> · schreiben → ich <b>schrieb</b></span></p>
          <p>Diese Formen lernt man wie Vokabeln — am besten gleich im Dreierpack <em>Infinitiv – Präteritum – Partizip II</em>.</p>
        `,
        note: "Die Mischgruppe hat beides: Vokalwechsel <em>und</em> -te-. <em>bringen → brachte</em>, <em>denken → dachte</em>, <em>wissen → wusste</em>.",
      },
      {
        title: "Regel 3 — Was man IMMER im Präteritum sagt",
        body: `
          <p>Auch beim Sprechen nimmt niemand das Perfekt bei diesen Verben:</p>
          <p><b>sein</b> → war · <b>haben</b> → hatte · <b>werden</b> → wurde · und alle <b>Modalverben</b>: konnte, musste, wollte, durfte, sollte, mochte.</p>
          <p><span class="mono">Ich <b>war</b> gestern im Kino.</span> ✓ &nbsp; <span class="mono">Ich bin gestern im Kino gewesen.</span> <span style="color:var(--ink-soft)">— möglich, klingt aber umständlich.</span></p>
        `,
        note: "Umgekehrt gilt: bei allen anderen Verben klingt Präteritum im Gespräch schriftlich. Erzähl mündlich lieber im Perfekt.",
      },
    ],
    tables: [
      {
        caption: "Endungen: regelmäßig und unregelmäßig",
        lede: "Beachte, dass ich und er/sie/es identisch sind — das ist der auffälligste Unterschied zum Präsens.",
        head: ["", "machen (regelmäßig)", "gehen (unregelmäßig)", "sein"],
        rows: [
          ["ich", "machte", "ging", "war"],
          ["du", "machtest", "gingst", "warst"],
          ["er/sie/es", "machte", "ging", "war"],
          ["wir", "machten", "gingen", "waren"],
          ["ihr", "machtet", "gingt", "wart"],
          ["sie/Sie", "machten", "gingen", "waren"],
        ],
      },
      {
        caption: "Die Formen, die du auswendig brauchst",
        lede: "Infinitiv – Präteritum – Partizip II. Diese Dreierpacks kommen in jedem Lesetext vor.",
        head: ["Infinitiv", "Präteritum", "Partizip II"],
        rows: [
          ["sein", "war", "ist gewesen"],
          ["haben", "hatte", "hat gehabt"],
          ["werden", "wurde", "ist geworden"],
          ["gehen", "ging", "ist gegangen"],
          ["kommen", "kam", "ist gekommen"],
          ["fahren", "fuhr", "ist gefahren"],
          ["geben", "gab", "hat gegeben"],
          ["nehmen", "nahm", "hat genommen"],
          ["sehen", "sah", "hat gesehen"],
          ["sprechen", "sprach", "hat gesprochen"],
          ["schreiben", "schrieb", "hat geschrieben"],
          ["finden", "fand", "hat gefunden"],
          ["bleiben", "blieb", "ist geblieben"],
          ["bringen", "brachte", "hat gebracht"],
          ["denken", "dachte", "hat gedacht"],
          ["wissen", "wusste", "hat gewusst"],
          ["können", "konnte", "hat gekonnt"],
          ["müssen", "musste", "hat gemusst"],
        ],
      },
    ],
    exercises: [
      {
        id: "b1prae1",
        kind: "gap",
        title: "Übung A — ins Präteritum",
        lede: "Setze das Verb in der Klammer ins Präteritum.",
        items: [
          { n: 1, prompt: "Gestern ________ ich sehr müde. <em>(sein)</em>", answers: ["war"] },
          { n: 2, prompt: "Wir ________ letztes Jahr nach Kärnten. <em>(fahren)</em>", answers: ["fuhren"] },
          { n: 3, prompt: "Sie ________ den Brief am Montag. <em>(schreiben)</em>", answers: ["schrieb"] },
          { n: 4, prompt: "Als Kind ________ ich jeden Tag Fußball. <em>(spielen)</em>", answers: ["spielte"] },
          { n: 5, prompt: "Er ________ lange auf den Bus. <em>(warten)</em>", answers: ["wartete"] },
          { n: 6, prompt: "Ich ________ nicht, dass du hier wohnst. <em>(wissen)</em>", answers: ["wusste"] },
          { n: 7, prompt: "Wir ________ leider nicht kommen. <em>(können)</em>", answers: ["konnten"] },
          { n: 8, prompt: "Das Kind ________ den ganzen Nachmittag. <em>(schlafen)</em>", answers: ["schlief"] },
          { n: 9, prompt: "Sie ________ mir ein Buch mit. <em>(mitbringen — trennbar!)</em>", answers: ["brachte"] },
          { n: 10, prompt: "Es ________ plötzlich sehr kalt. <em>(werden)</em>", answers: ["wurde"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Welche zwei Personen haben im Präteritum immer dieselbe Form?",
        reveal: "<b>ich</b> und <b>er/sie/es</b> — beide ohne Endung: <em>ich war / er war</em>, <em>ich machte / er machte</em>. Im Präsens sind sie verschieden, im Präteritum nie.",
      },
      {
        q: "Wann nimmt man auch beim Sprechen das Präteritum?",
        reveal: "Bei <b>sein, haben, werden</b> und allen <b>Modalverben</b>. <em>Ich war da, ich hatte keine Zeit, ich musste arbeiten.</em> Bei allen anderen Verben klingt Präteritum gesprochen wie vorgelesen.",
      },
      {
        q: "Was ist die Mischgruppe?",
        reveal: "Verben mit Vokalwechsel <em>und</em> -te-Endung: <b>bringen → brachte</b>, <b>denken → dachte</b>, <b>wissen → wusste</b>, <b>kennen → kannte</b>.",
      },
    ],
  },
};
