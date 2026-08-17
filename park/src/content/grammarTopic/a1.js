// A1 grammar, part 1: the machinery of a simple sentence — verbs in the
// present, nouns with their articles, questions, and the accusative.
//
// The register is deliberately plainer than A2's. At A1 the useful thing is a
// small number of patterns you can actually produce, not a survey of
// exceptions, so each topic states the rule, shows the paradigm, and drills it.

export const TOPICS_A1 = {
  "a1-praesens": {
    intro:
      "Fast jeder deutsche Satz braucht ein konjugiertes Verb, und auf A1 steht es fast immer im Präsens. Die Endungen sind regelmäßig genug, dass man sie an einem Nachmittag lernen kann — und danach hängt jeder weitere Satz davon ab. sein und haben sind unregelmäßig und müssen einfach sitzen.",
    rules: [
      {
        title: "Regel 1 — Die sechs Endungen",
        body: `
          <p>Vom Infinitiv nimmst du das <span class="mono">-en</span> weg und hängst die Endung an den Stamm: <span class="mono">wohnen</span> → <span class="mono">wohn-</span> + Endung.</p>
          <p><span class="mono">ich wohn<b style="color:var(--accent)">e</b> · du wohn<b style="color:var(--accent)">st</b> · er/sie/es wohn<b style="color:var(--accent)">t</b> · wir wohn<b style="color:var(--accent)">en</b> · ihr wohn<b style="color:var(--accent)">t</b> · sie/Sie wohn<b style="color:var(--accent)">en</b></span></p>
          <p>Die Höflichkeitsform <b>Sie</b> ist immer identisch mit <em>sie</em> (Plural) — und wird großgeschrieben.</p>
        `,
        note:
          "Endet der Stamm auf -t oder -d (<em>arbeiten, finden</em>), schiebt man ein <b>e</b> ein, damit man es aussprechen kann: <span class='mono'>du arbeit<b>e</b>st, er arbeit<b>e</b>t</span>.",
      },
      {
        title: "Regel 2 — sein und haben lernst du auswendig",
        body: `
          <p>Diese beiden folgen keinem Muster, und du brauchst sie in praktisch jedem Gespräch — zum Vorstellen, zum Beschreiben und später für das Perfekt.</p>
          <p><span class="mono">Ich <b style="color:var(--accent)">bin</b> Sean. Ich <b style="color:var(--accent)">habe</b> zwei Kinder. Wir <b style="color:var(--accent)">sind</b> aus Kanada.</span></p>
        `,
        note: "Keine Eselsbrücke rettet dich hier. Sprich die Tabelle laut, bis sie ohne Nachdenken kommt.",
      },
      {
        title: "Regel 3 — Ein paar Verben ändern den Stamm",
        body: `
          <p>Nur bei <b>du</b> und <b>er/sie/es</b>, und nur bei einer überschaubaren Gruppe. Der Rest bleibt regelmäßig.</p>
          <p><span class="mono">fahren → du f<b style="color:var(--accent)">ä</b>hrst · sprechen → du spr<b style="color:var(--accent)">i</b>chst · lesen → du l<b style="color:var(--accent)">ie</b>st</span></p>
        `,
        note:
          "Lerne diese Verben nicht als Regel, sondern als Vokabel: notiere sie immer in der du-Form mit.",
      },
    ],
    tables: [
      {
        caption: "Die Präsens-Endungen",
        lede: "Gilt für alle regelmäßigen Verben.",
        head: ["Person", "Endung", "wohnen", "arbeiten"],
        rows: [
          ["ich", "-e", "wohne", "arbeite"],
          ["du", "-st", "wohnst", "arbeitest"],
          ["er/sie/es", "-t", "wohnt", "arbeitet"],
          ["wir", "-en", "wohnen", "arbeiten"],
          ["ihr", "-t", "wohnt", "arbeitet"],
          ["sie/Sie", "-en", "wohnen", "arbeiten"],
        ],
      },
      {
        caption: "sein und haben",
        lede: "Die zwei wichtigsten Verben der Sprache. Ohne sie kein Perfekt und kaum ein Satz.",
        head: ["", "sein", "haben"],
        rows: [
          ["ich", "bin", "habe"],
          ["du", "bist", "hast"],
          ["er/sie/es", "ist", "hat"],
          ["wir", "sind", "haben"],
          ["ihr", "seid", "habt"],
          ["sie/Sie", "sind", "haben"],
        ],
      },
      {
        caption: "Die häufigsten Stammwechsel auf A1",
        lede: "Nur du und er/sie/es ändern sich.",
        head: ["Infinitiv", "Wechsel", "du", "er/sie/es"],
        rows: [
          ["fahren", "a → ä", "fährst", "fährt"],
          ["schlafen", "a → ä", "schläfst", "schläft"],
          ["sprechen", "e → i", "sprichst", "spricht"],
          ["essen", "e → i", "isst", "isst"],
          ["nehmen", "e → i", "nimmst", "nimmt"],
          ["lesen", "e → ie", "liest", "liest"],
          ["sehen", "e → ie", "siehst", "sieht"],
        ],
      },
    ],
    exercises: [
      {
        id: "endungen",
        kind: "gap",
        title: "Übung A — Regelmäßige Verben",
        lede: "Setze das Verb in der richtigen Form ein.",
        items: [
          { n: 1, prompt: "Ich ________ in Wien. <em>(wohnen)</em>", answers: ["wohne"] },
          { n: 2, prompt: "Du ________ sehr gut Deutsch. <em>(sprechen)</em>", answers: ["sprichst"] },
          { n: 3, prompt: "Er ________ bei einer Bank. <em>(arbeiten)</em>", answers: ["arbeitet"] },
          { n: 4, prompt: "Wir ________ jeden Tag Kaffee. <em>(trinken)</em>", answers: ["trinken"] },
          { n: 5, prompt: "Ihr ________ zu schnell. <em>(fahren)</em>", answers: ["fahrt"] },
          { n: 6, prompt: "Sie (Plural) ________ gern Bücher. <em>(lesen)</em>", answers: ["lesen"] },
          { n: 7, prompt: "Meine Schwester ________ in Graz. <em>(studieren)</em>", answers: ["studiert"] },
          { n: 8, prompt: "________ du Tennis? <em>(spielen)</em>", answers: ["Spielst", "spielst"] },
        ],
      },
      {
        id: "seinhaben",
        kind: "gap",
        title: "Übung B — sein und haben",
        lede: "Nur diese beiden Verben.",
        items: [
          { n: 1, prompt: "Ich ________ Student. <em>(sein)</em>", answers: ["bin"] },
          { n: 2, prompt: "________ du müde? <em>(sein)</em>", answers: ["Bist", "bist"] },
          { n: 3, prompt: "Wir ________ aus Kanada. <em>(sein)</em>", answers: ["sind"] },
          { n: 4, prompt: "Sie ________ zwei Kinder. <em>(haben, sie = Plural)</em>", answers: ["haben"] },
          { n: 5, prompt: "Er ________ keine Zeit. <em>(haben)</em>", answers: ["hat"] },
          { n: 6, prompt: "Ihr ________ zu spät. <em>(sein)</em>", answers: ["seid"] },
          { n: 7, prompt: "________ ihr Hunger? <em>(haben)</em>", answers: ["Habt", "habt"] },
          { n: 8, prompt: "Das ________ meine Wohnung. <em>(sein)</em>", answers: ["ist"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Welche zwei Personen haben im Präsens dieselbe Endung wie der Infinitiv?",
        reveal: "<b>wir</b> und <b>sie/Sie</b> — beide enden auf <span class='mono'>-en</span>, genau wie der Infinitiv. Das heißt auch: <em>wir wohnen</em> und <em>sie wohnen</em> sehen gleich aus, und nur das Subjekt sagt dir, welches gemeint ist.",
      },
      {
        q: "Warum heißt es <em>du arbeitest</em> und nicht <em>du arbeitst</em>?",
        reveal:
          "Weil der Stamm auf <b>-t</b> endet. Nach <span class='mono'>-t</span> und <span class='mono'>-d</span> kommt ein <b>-e-</b> dazwischen, sonst kann man die Endung nicht aussprechen: <span class='mono'>arbeit<b>e</b>st, find<b>e</b>t, red<b>e</b>t</span>.",
      },
      {
        q: "Bei welchen Personen ändert sich der Stamm von <em>fahren</em>?",
        reveal:
          "Nur bei <b>du</b> (<span class='mono'>fährst</span>) und <b>er/sie/es</b> (<span class='mono'>fährt</span>). <em>ich fahre, wir fahren, ihr fahrt, sie fahren</em> bleiben regelmäßig — ein Fehler, den man leicht macht, ist <em>wir fähren</em>.",
      },
    ],
  },

  "a1-artikel-nomen": {
    intro:
      "Jedes deutsche Nomen hat ein Genus, und man kann es dem Wort meistens nicht ansehen. Deshalb lernt man ein Nomen nie allein, sondern immer mit seinem Artikel und seinem Plural: <em>der Tisch, die Tische</em>. Das ist die einzige Stelle auf A1, an der es sich wirklich lohnt, stur zu sein.",
    rules: [
      {
        title: "Regel 1 — Artikel und Plural gehören zur Vokabel",
        body: `
          <p>Schreib jedes neue Nomen in drei Teilen auf: <b>Artikel + Wort + Plural</b>.</p>
          <p><span class="mono">der Tisch, die Tische · die Lampe, die Lampen · das Bett, die Betten</span></p>
          <p>Ein Nomen ohne Artikel gelernt ist ein Nomen, das du später zweimal lernen musst — beim Akkusativ, beim Dativ und bei den Adjektivendungen brauchst du das Genus jedes Mal wieder.</p>
        `,
        note:
          "Im Plural ist der Artikel <b>immer die</b>, egal welches Genus das Wort im Singular hatte.",
      },
      {
        title: "Regel 2 — Es gibt Hinweise, keine Garantien",
        body: `
          <p>Ein paar Endungen sind zuverlässig genug, dass sie sich lohnen:</p>
          <p><b>Immer feminin:</b> <span class="mono">-ung, -heit, -keit, -schaft, -ion, -ei</span> — <em>die Wohnung, die Freiheit, die Möglichkeit, die Information</em></p>
          <p><b>Meistens maskulin:</b> <span class="mono">-er, -ling, -ismus</span> und die meisten Tageszeiten, Tage, Monate, Jahreszeiten — <em>der Lehrer, der Montag, der Sommer</em></p>
          <p><b>Immer neutrum:</b> <span class="mono">-chen, -lein</span> und Verben als Nomen — <em>das Mädchen, das Brötchen, das Essen</em></p>
        `,
        note:
          "<em>das Mädchen</em> ist neutrum, obwohl es ein Mädchen ist: <span class='mono'>-chen</span> gewinnt immer gegen die Bedeutung.",
      },
      {
        title: "Regel 3 — Der unbestimmte Artikel und die Verneinung",
        body: `
          <p><b>ein/eine</b> heißt „irgendein“ — wenn du etwas zum ersten Mal erwähnst. <b>der/die/das</b> heißt „genau dieses“ — wenn beide wissen, welches gemeint ist.</p>
          <p><span class="mono">Ich habe <b>eine</b> Wohnung. <b>Die</b> Wohnung ist klein.</span></p>
          <p>Verneint wird mit <b>kein-</b>, das genau wie <em>ein-</em> geht — nur gibt es <em>kein-</em> auch im Plural, <em>ein-</em> nicht.</p>
          <p><span class="mono">Ich habe <b>keinen</b> Hund. Wir haben <b>keine</b> Kinder.</span></p>
        `,
        note:
          "Faustregel: Nomen mit Artikel verneinst du mit <b>kein-</b>, alles andere (Verben, Adjektive, Namen) mit <b>nicht</b>. <em>Ich habe kein Auto.</em> vs. <em>Ich fahre nicht.</em>",
      },
    ],
    tables: [
      {
        caption: "Artikel im Nominativ",
        lede: "Die Grundform, in der ein Nomen im Wörterbuch steht.",
        head: ["Genus", "bestimmt", "unbestimmt", "verneint"],
        rows: [
          ["maskulin", "der Tisch", "ein Tisch", "kein Tisch"],
          ["feminin", "die Lampe", "eine Lampe", "keine Lampe"],
          ["neutrum", "das Bett", "ein Bett", "kein Bett"],
          ["Plural", "die Betten", "— Betten", "keine Betten"],
        ],
      },
      {
        caption: "Die fünf Pluralendungen",
        lede: "Keine Regel, aber ein Gefühl: das sind die Muster, die immer wiederkommen.",
        head: ["Endung", "Beispiel", "Plural"],
        rows: [
          ["-e (oft + Umlaut)", "der Tisch / die Stadt", "die Tische / die Städte"],
          ["-en / -n", "die Lampe / die Frau", "die Lampen / die Frauen"],
          ["-er (oft + Umlaut)", "das Kind / das Haus", "die Kinder / die Häuser"],
          ["-s", "das Auto / das Hotel", "die Autos / die Hotels"],
          ["— (nur Umlaut oder nichts)", "der Lehrer / der Bruder", "die Lehrer / die Brüder"],
        ],
      },
      {
        caption: "Endungen, die das Genus verraten",
        lede: "Diese lohnen sich, weil sie fast ausnahmslos gelten.",
        head: ["Endung", "Genus", "Beispiel"],
        rows: [
          ["-ung", "die", "die Wohnung, die Zeitung"],
          ["-heit / -keit", "die", "die Freiheit, die Möglichkeit"],
          ["-schaft", "die", "die Freundschaft"],
          ["-ion", "die", "die Information, die Station"],
          ["-chen / -lein", "das", "das Mädchen, das Brötchen"],
          ["-er (Person)", "der", "der Lehrer, der Kellner"],
          ["Verb als Nomen", "das", "das Essen, das Lernen"],
        ],
      },
    ],
    exercises: [
      {
        id: "genus",
        kind: "gap",
        title: "Übung A — der, die oder das?",
        lede: "Schreibe nur den bestimmten Artikel.",
        items: [
          { n: 1, prompt: "________ Wohnung", answers: ["die"] },
          { n: 2, prompt: "________ Mädchen", answers: ["das"] },
          { n: 3, prompt: "________ Lehrer", answers: ["der"] },
          { n: 4, prompt: "________ Zeitung", answers: ["die"] },
          { n: 5, prompt: "________ Brötchen", answers: ["das"] },
          { n: 6, prompt: "________ Montag", answers: ["der"] },
          { n: 7, prompt: "________ Information", answers: ["die"] },
          { n: 8, prompt: "________ Essen", answers: ["das"] },
        ],
      },
      {
        id: "keinnicht",
        kind: "gap",
        title: "Übung B — kein- oder nicht?",
        lede: "Setze die passende Verneinung ein.",
        items: [
          { n: 1, prompt: "Ich habe ________ Auto.", answers: ["kein"] },
          { n: 2, prompt: "Das ist ________ meine Tasche.", answers: ["nicht"] },
          { n: 3, prompt: "Wir haben ________ Zeit.", answers: ["keine"] },
          { n: 4, prompt: "Er kommt heute ________.", answers: ["nicht"] },
          { n: 5, prompt: "Sie hat ________ Kinder.", answers: ["keine"] },
          { n: 6, prompt: "Die Suppe ist ________ heiß.", answers: ["nicht"] },
          { n: 7, prompt: "Ich trinke ________ Kaffee.", answers: ["keinen"] },
          { n: 8, prompt: "Wien ist ________ klein.", answers: ["nicht"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Welcher Artikel steht im Plural?",
        reveal:
          "Immer <b>die</b> — <em>die Tische, die Lampen, die Betten</em>. Das Genus des Singulars spielt keine Rolle mehr. Unbestimmt gibt es im Plural gar keinen Artikel (<em>Ich habe Kinder</em>), verneint aber schon: <em>keine Kinder</em>.",
      },
      {
        q: "Wann nimmst du <em>nicht</em> und wann <em>kein-</em>?",
        reveal:
          "<b>kein-</b> verneint ein Nomen, das sonst <em>ein-</em> oder gar keinen Artikel hätte: <em>Ich habe <b>kein</b> Auto.</em> <b>nicht</b> verneint alles andere — Verben, Adjektive, Namen und Nomen mit bestimmtem Artikel: <em>Ich fahre <b>nicht</b>. Das ist <b>nicht</b> die Wohnung.</em>",
      },
      {
        q: "Nenne drei Endungen, bei denen das Nomen sicher feminin ist.",
        reveal:
          "<span class='mono'>-ung</span> (die Wohnung), <span class='mono'>-heit</span> (die Freiheit), <span class='mono'>-keit</span> (die Möglichkeit) — dazu <span class='mono'>-schaft</span>, <span class='mono'>-ion</span> und <span class='mono'>-ei</span>. Diese sechs decken sehr viele A1-Wörter ab.",
      },
    ],
  },

  "a1-fragen": {
    intro:
      "Deutsch stellt Fragen auf zwei Arten, und beide hängen an derselben Sache: wo das Verb steht. Im Aussagesatz an Position 2, in der Ja/Nein-Frage an Position 1, in der W-Frage wieder an Position 2 — hinter dem Fragewort. Wer das einmal begriffen hat, macht in dieser Ecke kaum noch Fehler.",
    rules: [
      {
        title: "Regel 1 — Das Verb steht an Position 2",
        body: `
          <p>Nicht das zweite <em>Wort</em> — das zweite <em>Element</em>. Was auf Position 1 steht, darf beliebig lang sein; das Subjekt rutscht dann hinter das Verb.</p>
          <p><span class="mono">Ich <b style="color:var(--accent)">fahre</b> morgen nach Wien.<br>
          Morgen <b style="color:var(--accent)">fahre</b> ich nach Wien.<br>
          Nach Wien <b style="color:var(--accent)">fahre</b> ich morgen.</span></p>
        `,
        note:
          "Der klassische Anfängerfehler: <em>Morgen ich fahre nach Wien.</em> ✗ Im Englischen darf man ein Adverb voranstellen, ohne umzustellen — im Deutschen nicht.",
      },
      {
        title: "Regel 2 — Ja/Nein-Fragen: Verb an Position 1",
        body: `
          <p>Kein Fragewort, kein Hilfsverb wie im Englischen — das Verb rückt einfach nach vorn.</p>
          <p><span class="mono"><b style="color:var(--accent)">Wohnst</b> du in Wien? — <b style="color:var(--accent)">Hast</b> du Zeit? — <b style="color:var(--accent)">Ist</b> das dein Auto?</span></p>
          <p>Antworten kannst du mit <b>ja</b>, <b>nein</b> — oder mit <b>doch</b>, wenn du einer verneinten Frage widersprichst.</p>
          <p><span class="mono">— Hast du keine Zeit? — <b>Doch</b>, ich habe Zeit.</span></p>
        `,
        note:
          "<b>doch</b> hat im Englischen keine Entsprechung. Es heißt: „Deine Annahme stimmt nicht, das Gegenteil ist der Fall.“",
      },
      {
        title: "Regel 3 — W-Fragen: Fragewort, dann Verb",
        body: `
          <p>Das Fragewort besetzt Position 1, das Verb bleibt auf Position 2.</p>
          <p><span class="mono"><b>Wo</b> <b style="color:var(--accent)">wohnst</b> du? — <b>Wann</b> <b style="color:var(--accent)">kommt</b> der Bus? — <b>Warum</b> <b style="color:var(--accent)">lernst</b> du Deutsch?</span></p>
          <p>Aufpassen bei den dreien, die man leicht verwechselt: <b>wo</b> (Ort), <b>woher</b> (Herkunft), <b>wohin</b> (Ziel).</p>
        `,
        note:
          "<em>Wie</em> fragt nach der Art — <em>Wie geht es dir?</em> — aber auch nach Alter und Preis: <em>Wie alt bist du? Wie viel kostet das?</em>",
      },
    ],
    tables: [
      {
        caption: "Die W-Fragewörter",
        lede: "Die zehn, die auf A1 laufend vorkommen.",
        head: ["Fragewort", "fragt nach", "Beispiel"],
        rows: [
          ["wer", "Person (Subjekt)", "Wer ist das?"],
          ["was", "Sache", "Was machst du?"],
          ["wo", "Ort", "Wo wohnst du?"],
          ["woher", "Herkunft", "Woher kommst du?"],
          ["wohin", "Ziel", "Wohin fährst du?"],
          ["wann", "Zeit", "Wann kommst du?"],
          ["wie", "Art, Alter, Preis", "Wie alt bist du?"],
          ["warum", "Grund", "Warum lernst du Deutsch?"],
          ["wie viel / wie viele", "Menge", "Wie viel kostet das?"],
          ["welcher / welche / welches", "Auswahl", "Welches Buch nimmst du?"],
        ],
      },
      {
        caption: "Wo steht das Verb?",
        lede: "Drei Satztypen, eine Frage: welche Position hat das konjugierte Verb?",
        head: ["Satztyp", "Position 1", "Position 2", "Beispiel"],
        rows: [
          ["Aussage", "Subjekt oder Angabe", "Verb", "Heute komme ich später."],
          ["Ja/Nein-Frage", "Verb", "Subjekt", "Kommst du heute?"],
          ["W-Frage", "Fragewort", "Verb", "Wann kommst du?"],
        ],
      },
    ],
    exercises: [
      {
        id: "wfrage",
        kind: "gap",
        title: "Übung A — Welches Fragewort?",
        lede: "Setze das passende W-Wort ein.",
        items: [
          { n: 1, prompt: "________ kommst du? — Aus Italien.", answers: ["Woher", "woher"] },
          { n: 2, prompt: "________ wohnst du? — In Graz.", answers: ["Wo", "wo"] },
          { n: 3, prompt: "________ fährst du? — Nach Salzburg.", answers: ["Wohin", "wohin"] },
          { n: 4, prompt: "________ alt bist du? — 34.", answers: ["Wie", "wie"] },
          { n: 5, prompt: "________ ist das? — Meine Schwester.", answers: ["Wer", "wer"] },
          { n: 6, prompt: "________ beginnt der Kurs? — Um neun.", answers: ["Wann", "wann"] },
          { n: 7, prompt: "________ lernst du Deutsch? — Für die Arbeit.", answers: ["Warum", "warum"] },
          { n: 8, prompt: "________ kostet der Kaffee? — Drei Euro.", answers: ["Wie viel", "wie viel", "Was", "was"] },
        ],
      },
      {
        id: "stellung",
        kind: "gap",
        title: "Übung B — Verb an die richtige Stelle",
        lede: "Schreibe nur das Verb in die Lücke.",
        items: [
          { n: 1, prompt: "Morgen ________ ich nach Wien. <em>(fahren)</em>", answers: ["fahre"] },
          { n: 2, prompt: "________ du morgen Zeit? <em>(haben)</em>", answers: ["Hast", "hast"] },
          { n: 3, prompt: "Um acht ________ der Kurs. <em>(beginnen)</em>", answers: ["beginnt"] },
          { n: 4, prompt: "Wo ________ deine Eltern? <em>(wohnen)</em>", answers: ["wohnen"] },
          { n: 5, prompt: "Heute ________ wir zu Hause. <em>(bleiben)</em>", answers: ["bleiben"] },
          { n: 6, prompt: "________ das dein Fahrrad? <em>(sein)</em>", answers: ["Ist", "ist"] },
          { n: 7, prompt: "In Österreich ________ man Deutsch. <em>(sprechen)</em>", answers: ["spricht"] },
          { n: 8, prompt: "Warum ________ ihr so früh? <em>(gehen)</em>", answers: ["geht"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Was ist an <em>Morgen ich fahre nach Wien</em> falsch?",
        reveal:
          "Das Verb muss an <b>Position 2</b>: <em>Morgen <b>fahre</b> ich nach Wien.</em> Weil <em>Morgen</em> schon Position 1 besetzt, rutscht das Subjekt <em>ich</em> hinter das Verb. Position 1 darf nur <em>ein</em> Element enthalten.",
      },
      {
        q: "Wann antwortest du mit <em>doch</em> statt mit <em>ja</em>?",
        reveal:
          "Wenn die Frage verneint war und du widersprichst. <em>— Hast du keine Zeit? — <b>Doch</b>, ich habe Zeit.</em> Ein <em>ja</em> wäre hier missverständlich: es klänge, als bestätigtest du die Verneinung.",
      },
      {
        q: "Was ist der Unterschied zwischen <em>wo</em>, <em>woher</em> und <em>wohin</em>?",
        reveal:
          "<b>wo</b> = an welchem Ort (<em>Wo wohnst du?</em>) · <b>woher</b> = von welchem Ort weg (<em>Woher kommst du?</em>) · <b>wohin</b> = zu welchem Ort hin (<em>Wohin fährst du?</em>). Englisch hat für alle drei oft nur <em>where</em>, deshalb ist das eine typische Fehlerquelle.",
      },
    ],
  },

  "a1-akkusativ": {
    intro:
      "Der Akkusativ ist der Fall des direkten Objekts — dessen, was von der Handlung betroffen ist. Die gute Nachricht für A1: von den vier Genera ändert sich <em>nur das Maskulinum</em>. Feminin, Neutrum und Plural sehen im Akkusativ genau aus wie im Nominativ.",
    rules: [
      {
        title: "Regel 1 — Nur der wird zu den",
        body: `
          <p>Das ist die ganze Formveränderung, um die es geht:</p>
          <p><span class="mono">der → <b style="color:var(--accent)">den</b> · ein → <b style="color:var(--accent)">einen</b> · kein → <b style="color:var(--accent)">keinen</b> · mein → <b style="color:var(--accent)">meinen</b></span></p>
          <p><span class="mono">Der Hund ist groß. → Ich sehe <b style="color:var(--accent)">den</b> Hund.<br>
          Das ist ein Tisch. → Ich kaufe <b style="color:var(--accent)">einen</b> Tisch.</span></p>
          <p>Bei <em>die</em>, <em>das</em> und dem Plural passiert nichts.</p>
        `,
        note:
          "Merksatz: „Im Akkusativ verliert nur der Mann seine Form.“ Alles andere bleibt, wie es war.",
      },
      {
        title: "Regel 2 — Wen oder was?",
        body: `
          <p>So findest du das Akkusativobjekt: frage <b>wen?</b> (Person) oder <b>was?</b> (Sache) nach dem Verb.</p>
          <p><span class="mono">Ich sehe <b>den Mann</b>. → Wen sehe ich? — den Mann.<br>
          Ich kaufe <b>ein Buch</b>. → Was kaufe ich? — ein Buch.</span></p>
          <p>Die allermeisten Verben nehmen ein Akkusativobjekt: <em>haben, kaufen, sehen, essen, trinken, lesen, brauchen, suchen, nehmen, machen</em>.</p>
        `,
        note:
          "Nach <b>sein</b> und <b>werden</b> steht <em>kein</em> Akkusativ, sondern der Nominativ: <em>Er ist <b>ein</b> guter Lehrer.</em> — nicht <em>einen</em>.",
      },
      {
        title: "Regel 3 — Fünf Präpositionen ziehen immer den Akkusativ",
        body: `
          <p><b>für, ohne, gegen, um, durch</b> — nach diesen fünf steht ausnahmslos der Akkusativ, egal was das Verb macht.</p>
          <p><span class="mono">Das Geschenk ist für <b style="color:var(--accent)">meinen</b> Bruder.<br>
          Ich trinke den Kaffee ohne <b style="color:var(--accent)">den</b> Zucker.<br>
          Wir gehen durch <b style="color:var(--accent)">den</b> Park.</span></p>
        `,
        note:
          "Eselsbrücke für die fünf: <b>FOGUD</b> — für, ohne, gegen, um, durch.",
      },
    ],
    tables: [
      {
        caption: "Nominativ und Akkusativ nebeneinander",
        lede: "Nur die erste Zeile ändert sich.",
        head: ["Genus", "Nominativ", "Akkusativ"],
        rows: [
          ["maskulin", "der / ein / kein / mein Mann", "den / einen / keinen / meinen Mann"],
          ["feminin", "die / eine / keine / meine Frau", "die / eine / keine / meine Frau"],
          ["neutrum", "das / ein / kein / mein Kind", "das / ein / kein / mein Kind"],
          ["Plural", "die / — / keine / meine Kinder", "die / — / keine / meine Kinder"],
        ],
      },
      {
        caption: "Präpositionen mit Akkusativ",
        lede: "Fünf Stück, ausnahmslos.",
        head: ["Präposition", "Bedeutung", "Beispiel"],
        rows: [
          ["für", "for", "Das ist für meinen Vater."],
          ["ohne", "without", "Ich trinke Tee ohne Milch."],
          ["gegen", "against, around (time)", "Wir spielen gegen den FC."],
          ["um", "around, at (time)", "Wir gehen um den See."],
          ["durch", "through", "Der Weg führt durch den Wald."],
        ],
      },
    ],
    exercises: [
      {
        id: "akk-artikel",
        kind: "gap",
        title: "Übung A — Der richtige Artikel",
        lede: "Setze den bestimmten oder unbestimmten Artikel im Akkusativ ein.",
        items: [
          { n: 1, prompt: "Ich habe ________ Hund. <em>(ein)</em>", answers: ["einen"] },
          { n: 2, prompt: "Wir kaufen ________ Wohnung. <em>(eine)</em>", answers: ["eine"] },
          { n: 3, prompt: "Er sucht ________ Schlüssel. <em>(der)</em>", answers: ["den"] },
          { n: 4, prompt: "Siehst du ________ Kind? <em>(das)</em>", answers: ["das"] },
          { n: 5, prompt: "Ich brauche ________ Tisch. <em>(ein)</em>", answers: ["einen"] },
          { n: 6, prompt: "Sie liest ________ Zeitung. <em>(die)</em>", answers: ["die"] },
          { n: 7, prompt: "Wir haben ________ Zeit. <em>(kein)</em>", answers: ["keine"] },
          { n: 8, prompt: "Ich trinke ________ Kaffee. <em>(kein)</em>", answers: ["keinen"] },
        ],
      },
      {
        id: "akk-praep",
        kind: "gap",
        title: "Übung B — Nach der Präposition",
        lede: "Alle fünf Präpositionen verlangen den Akkusativ.",
        items: [
          { n: 1, prompt: "Das Geschenk ist für ________ Bruder. <em>(mein)</em>", answers: ["meinen"] },
          { n: 2, prompt: "Wir gehen durch ________ Park. <em>(der)</em>", answers: ["den"] },
          { n: 3, prompt: "Ich komme ohne ________ Auto. <em>(mein)</em>", answers: ["mein"] },
          { n: 4, prompt: "Sie läuft um ________ See. <em>(der)</em>", answers: ["den"] },
          { n: 5, prompt: "Der Kaffee ist für ________ Frau. <em>(die)</em>", answers: ["die"] },
          { n: 6, prompt: "Wir spielen gegen ________ Mannschaft. <em>(die)</em>", answers: ["die"] },
          { n: 7, prompt: "Ohne ________ Ticket kommst du nicht rein. <em>(ein)</em>", answers: ["ein"] },
          { n: 8, prompt: "Das ist ein Geschenk für ________ Kinder. <em>(die)</em>", answers: ["die"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Welches Genus ändert sich im Akkusativ — und wie?",
        reveal:
          "Nur das <b>Maskulinum</b>: <span class='mono'>der → den, ein → einen, kein → keinen, mein → meinen</span>. Feminin, Neutrum und Plural sind im Akkusativ mit dem Nominativ identisch.",
      },
      {
        q: "Nenne die fünf Präpositionen, nach denen immer der Akkusativ steht.",
        reveal: "<b>für, ohne, gegen, um, durch</b> — FOGUD. Nach diesen fünf steht der Akkusativ ausnahmslos, unabhängig vom Verb.",
      },
      {
        q: "Warum heißt es <em>Er ist ein guter Lehrer</em> und nicht <em>einen</em>?",
        reveal:
          "Weil <b>sein</b> kein Akkusativobjekt nimmt. Nach <em>sein</em>, <em>werden</em> und <em>bleiben</em> steht der <b>Nominativ</b> — das, was folgt, ist kein Objekt, sondern eine zweite Beschreibung des Subjekts.",
      },
    ],
  },

  "a1-possessiv": {
    intro:
      "Possessivartikel sagen, wem etwas gehört: <em>mein Bruder, deine Schwester, unser Haus</em>. Sie sind auf A1 leicht zu lernen, weil sie sich genau wie <em>ein-</em> und <em>kein-</em> verhalten — der Stamm wechselt mit dem Besitzer, die Endung mit dem besessenen Nomen.",
    rules: [
      {
        title: "Regel 1 — Stamm nach dem Besitzer, Endung nach dem Ding",
        body: `
          <p>Zwei getrennte Entscheidungen, die man leicht vermischt:</p>
          <p><b>Der Stamm</b> sagt, <em>wem</em> es gehört: <span class="mono">mein-, dein-, sein-, ihr-, unser-, euer-, Ihr-</span></p>
          <p><b>Die Endung</b> richtet sich nach dem Nomen, das folgt — nach Genus und Kasus, genau wie bei <em>ein-</em>.</p>
          <p><span class="mono"><b>mein</b> Bruder · <b>meine</b> Schwester · <b>mein</b> Kind · <b>meine</b> Eltern</span></p>
        `,
        note:
          "Typischer Fehler: <em>meine Bruder</em>. Die Endung gehört zum <b>Bruder</b> (maskulin, Nominativ → keine Endung), nicht zu dir.",
      },
      {
        title: "Regel 2 — sein oder ihr?",
        body: `
          <p>Hier verwechseln fast alle etwas. Der Stamm richtet sich nach dem <b>Besitzer</b>, nicht nach dem Ding:</p>
          <p><span class="mono">Das ist Peter. Das ist <b style="color:var(--accent)">seine</b> Schwester.</span> — Peter ist männlich → <em>sein-</em>, auch wenn die Schwester weiblich ist.</p>
          <p><span class="mono">Das ist Anna. Das ist <b style="color:var(--accent)">ihr</b> Bruder.</span> — Anna ist weiblich → <em>ihr-</em>, auch wenn der Bruder männlich ist.</p>
        `,
        note:
          "<b>ihr</b> hat zwei Bedeutungen: „her“ und „their“. <em>Ihr</em> mit großem I heißt „your“ (höflich). Aus dem Zusammenhang ist es fast immer klar.",
      },
      {
        title: "Regel 3 — Im Akkusativ wieder nur das Maskulinum",
        body: `
          <p>Genau dieselbe Regel wie beim Akkusativ: nur maskuline Nomen bekommen <span class="mono">-en</span>.</p>
          <p><span class="mono">Ich sehe <b style="color:var(--accent)">meinen</b> Bruder. — Ich sehe <b>meine</b> Schwester. — Ich sehe <b>mein</b> Kind.</span></p>
        `,
        note:
          "Wenn du <em>ein-</em> und <em>kein-</em> im Akkusativ kannst, kannst du die Possessivartikel schon. Es ist dieselbe Endung an einem anderen Stamm.",
      },
    ],
    tables: [
      {
        caption: "Die Possessivartikel",
        lede: "Der Stamm nach dem Besitzer.",
        head: ["Person", "Possessiv", "Beispiel"],
        rows: [
          ["ich", "mein-", "mein Bruder"],
          ["du", "dein-", "dein Auto"],
          ["er / es", "sein-", "seine Schwester"],
          ["sie (sg.)", "ihr-", "ihr Bruder"],
          ["wir", "unser-", "unsere Wohnung"],
          ["ihr", "euer- / eure-", "eure Kinder"],
          ["sie (pl.)", "ihr-", "ihre Eltern"],
          ["Sie (höflich)", "Ihr-", "Ihre Adresse"],
        ],
      },
      {
        caption: "Endungen im Nominativ und Akkusativ",
        lede: "Am Beispiel mein-. Alle anderen Stämme bekommen dieselben Endungen.",
        head: ["Genus", "Nominativ", "Akkusativ"],
        rows: [
          ["maskulin", "mein Bruder", "meinen Bruder"],
          ["feminin", "meine Schwester", "meine Schwester"],
          ["neutrum", "mein Kind", "mein Kind"],
          ["Plural", "meine Eltern", "meine Eltern"],
        ],
      },
    ],
    exercises: [
      {
        id: "poss-stamm",
        kind: "gap",
        title: "Übung A — sein oder ihr?",
        lede: "Achte darauf, wer der Besitzer ist.",
        items: [
          { n: 1, prompt: "Das ist Peter und das ist ________ Schwester.", answers: ["seine"] },
          { n: 2, prompt: "Das ist Anna und das ist ________ Bruder.", answers: ["ihr"] },
          { n: 3, prompt: "Maria wohnt hier. ________ Wohnung ist klein.", answers: ["Ihre", "ihre"] },
          { n: 4, prompt: "Thomas hat ein Auto. ________ Auto ist neu.", answers: ["Sein", "sein"] },
          { n: 5, prompt: "Meine Eltern kommen morgen. ________ Zug fährt um acht.", answers: ["Ihr", "ihr"] },
          { n: 6, prompt: "Herr Weber, wie ist ________ Adresse? <em>(höflich)</em>", answers: ["Ihre", "ihre"] },
        ],
      },
      {
        id: "poss-endung",
        kind: "gap",
        title: "Übung B — Die richtige Endung",
        lede: "Nominativ und Akkusativ gemischt.",
        items: [
          { n: 1, prompt: "Das ist ________ Bruder. <em>(mein)</em>", answers: ["mein"] },
          { n: 2, prompt: "Ich sehe ________ Bruder. <em>(mein)</em>", answers: ["meinen"] },
          { n: 3, prompt: "________ Schwester wohnt in Linz. <em>(mein)</em>", answers: ["Meine", "meine"] },
          { n: 4, prompt: "Wir suchen ________ Schlüssel. <em>(unser)</em>", answers: ["unseren"] },
          { n: 5, prompt: "Wo sind ________ Kinder? <em>(dein)</em>", answers: ["deine"] },
          { n: 6, prompt: "Er liebt ________ Arbeit. <em>(sein)</em>", answers: ["seine"] },
          { n: 7, prompt: "Kennst du ________ Vater? <em>(ihr, = von Anna)</em>", answers: ["ihren"] },
          { n: 8, prompt: "Das ist ________ Haus. <em>(unser)</em>", answers: ["unser"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Peter hat eine Schwester. Heißt es <em>sein Schwester</em>, <em>seine Schwester</em> oder <em>ihre Schwester</em>?",
        reveal:
          "<b>seine Schwester</b>. Der Stamm richtet sich nach dem Besitzer — Peter ist männlich, also <em>sein-</em>. Die Endung richtet sich nach dem Ding — <em>Schwester</em> ist feminin, also <span class='mono'>-e</span>.",
      },
      {
        q: "Welche Possessivartikel bekommen im Akkusativ die Endung <span class='mono'>-en</span>?",
        reveal:
          "Nur die vor <b>maskulinen</b> Nomen: <em>Ich sehe <b>meinen</b> Bruder / <b>deinen</b> Vater / <b>unseren</b> Lehrer.</em> Feminin, Neutrum und Plural bleiben wie im Nominativ.",
      },
      {
        q: "Was können <em>ihr</em> und <em>Ihr</em> alles heißen?",
        reveal:
          "<b>ihr</b> = „her“ (Anna und <em>ihr</em> Bruder) oder „their“ (meine Eltern und <em>ihr</em> Zug). <b>Ihr</b> mit großem I = „your“ in der Höflichkeitsform (Herr Weber, <em>Ihre</em> Adresse). Dazu gibt es noch das Personalpronomen <em>ihr</em> = „you (plural)“.",
      },
    ],
  },
};
