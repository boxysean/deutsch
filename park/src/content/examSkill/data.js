// The three remaining Prüfungsteile. Format facts follow the ÖSD Zertifikat A2
// Durchführungsbestimmungen (Okt. 2023) and the offiziellen Modellsatz; the
// Trainingstexte here are eigens geschrieben (kein Originalmaterial des ÖSD),
// weil die Hörtexte des Modellsatzes als Audio vorliegen.

const HOEREN = {
  intro:
    "Hören ist der Prüfungsteil, an dem die meisten scheitern — nicht wegen des Wortschatzes, sondern weil man einmal hängen bleibt und dann drei Items verliert. 3 Aufgaben, 14 Items, ca. 15 Minuten, 30 Punkte. Achtung: Du brauchst hier mindestens 6 Punkte, sonst ist das ganze Modul durchgefallen — egal wie gut der Rest war.",
  format: {
    rules: [
      {
        title: "Was dich erwartet",
        body: `
          <p>Drei Aufgaben, insgesamt <b>14 Items</b> und <b>30 Punkte</b> in etwa 15 Minuten:</p>
          <p><b style="color:var(--accent)">Aufgabe 1</b> — eine <b>Durchsage oder Ansage</b> (Bahnhof, Anrufbeantworter, Veranstaltung). Du füllst <b>Notizen</b> aus: Uhrzeit, Ort, Preis, Telefonnummer.</p>
          <p><b style="color:var(--accent)">Aufgabe 2</b> — ein längerer Text oder ein Gespräch mit <b>Mehrfachauswahl</b> (ankreuzen).</p>
          <p><b style="color:var(--accent)">Aufgabe 3</b> — <b>fünf Personen</b> sagen je einen kurzen Satz; du ordnest jeder Person eine Aussage zu.</p>
        `,
        note:
          "Die Sprecherinnen und Sprecher kommen aus <b>Österreich, Deutschland und der Schweiz</b>. Rechne mit österreichischem Standarddeutsch — <em>Jänner</em> statt Januar, <em>Semmel</em> statt Brötchen.",
      },
      {
        title: "Die Mindestpunktzahl",
        body: `
          <p>Für die schriftliche Prüfung brauchst du insgesamt <b>35 von 70 Punkten</b>. Zusätzlich gilt eine Untergrenze pro Teil: im Hören <b>mindestens 6 Punkte</b>, im Lesen mindestens 5.</p>
          <p>Wer die Untergrenze reißt, hat das <b>ganze Modul</b> nicht bestanden. Deshalb: nie ein Feld leer lassen — ein Rateversuch kostet nichts.</p>
        `,
      },
    ],
    tables: [
      {
        caption: "Hören im Überblick",
        head: ["Aufgabe", "Textsorte", "Was du tust", "Items"],
        rows: [
          ["1", "Durchsage / Ansage am Telefon", "Notizzettel ausfüllen (Zahlen, Namen, Zeiten)", "ca. 4"],
          ["2", "Gespräch oder längerer Text", "Mehrfachauswahl ankreuzen", "ca. 5"],
          ["3", "Fünf kurze Statements", "Personen den Aussagen zuordnen", "5"],
        ],
      },
    ],
  },
  strategy: {
    rules: [
      {
        title: "Strategie 1 — Erst lesen, dann hören",
        body: `
          <p>Vor jedem Hörtext bekommst du Zeit, die Aufgabe zu lesen. Nutze sie <b>vollständig</b>. Unterstreiche in jeder Frage das <b>Schlüsselwort</b> — dann weißt du, worauf du wartest, statt alles verstehen zu wollen.</p>
          <p>Bei den Notizen überlegst du vorher: Ist hier eine <b>Uhrzeit</b>, eine <b>Zahl</b>, ein <b>Ort</b> oder ein <b>Name</b> gefragt? Diese Erwartung ist die halbe Miete.</p>
        `,
      },
      {
        title: "Strategie 2 — Nicht hängen bleiben",
        body: `
          <p>Der häufigste Fehler: Du verstehst ein Wort nicht, denkst darüber nach — und verpasst die nächsten zwei Antworten.</p>
          <p>Regel: <b>Ein verpasstes Item ist ein Item. Zwei verpasste Items sind ein Problem.</b> Setz ein Kreuz, rate, und hör weiter.</p>
        `,
        note:
          "Die Antworten kommen in der <b>Reihenfolge des Textes</b>. Wenn du schon bei Frage 4 bist und plötzlich Frage 2 hörst, hast du dich verzählt — spring nach vorn.",
      },
      {
        title: "Strategie 3 — Zahlen trainieren, nicht Vokabeln",
        body: `
          <p>Die Notizaufgabe lebt von Zahlen, und dort passieren die Fehler: <b>13 vs. 30</b>, <b>halb neun = 8:30</b>, Telefonnummern in Zweierpaaren (<em>zwo-und-vierzig</em>).</p>
          <p>Bei der Uhrzeit: die offizielle Form (<em>vierzehn Uhr dreißig</em>) und die gesprochene (<em>halb drei</em>) meinen dasselbe. Übe beide.</p>
        `,
      },
      {
        title: "Strategie 4 — Die Zuordnungsaufgabe rückwärts denken",
        body: `
          <p>Bei den fünf Personen wird nie das Wort aus der Antwortoption gesagt — es wird <b>umschrieben</b>. Wer sagt „Ich stehe jeden Tag um fünf auf“, gehört zur Option „steht sehr früh auf“.</p>
          <p>Hake jede Option ab, sobald du sie vergeben hast. Am Ende bleibt oft eine Person übrig, die du durch Ausschluss richtig löst.</p>
        `,
      },
    ],
    tables: [
      {
        caption: "Die klassischen Hörfallen",
        head: ["Du hörst", "Es bedeutet", "Falle"],
        rows: [
          ["halb neun", "8:30", "nicht 9:30!"],
          ["Viertel vor sieben", "6:45", "vor = davor"],
          ["dreizehn / dreißig", "13 / 30", "Endung -zehn vs. -ßig"],
          ["Gleis 5, heute Gleis 8", "Gleis 8", "die Korrektur zählt"],
          ["Der Kurs kostet 60, für Mitglieder 45", "je nach Frage", "genau lesen, wer gemeint ist"],
          ["Jänner", "Januar", "österreichische Variante"],
        ],
      },
    ],
  },
  training: [
    {
      id: "notizen",
      kind: "gap",
      title: "Training A — Notizen zu einer Durchsage",
      lede: "Lies zuerst den Notizzettel, dann den Text. In der echten Prüfung hörst du ihn — hier liest du ihn einmal und deckst ihn danach ab.",
      source: `<p><b>Ansage auf dem Anrufbeantworter der Volkshochschule Linz</b></p>
        <p style="color:var(--ink-soft)">„Guten Tag und willkommen bei der Volkshochschule Linz. Unser Büro ist heute geschlossen. Der Deutschkurs A2 beginnt am <b>Montag, dem 14. Jänner</b>, und findet immer dienstags und donnerstags von <b>18 Uhr 30</b> bis 20 Uhr statt. Der Kurs kostet <b>190 Euro</b>, für Studierende 140 Euro. Der Unterricht ist in <b>Raum 204</b> im zweiten Stock. Bei Fragen rufen Sie uns bitte unter <b>0732 / 55 41 20</b> an. Auf Wiederhören.“</p>`,
      items: [
        { n: 1, prompt: "Kursbeginn: Montag, der ________ Jänner", answers: ["14."], display: "14.", why: "Datum immer mit Punkt: der 14. Jänner" },
        { n: 2, prompt: "Kurstage: dienstags und ________", answers: ["donnerstags"] },
        { n: 3, prompt: "Beginn des Unterrichts: ________ Uhr", answers: ["18.30", "18:30", "halb sieben"], display: "18.30", why: "18 Uhr 30 — als Notiz reicht die Zahl" },
        { n: 4, prompt: "Preis für Studierende: ________ Euro", answers: ["140"], why: "Nicht 190 — die Frage fragt nach Studierenden." },
        { n: 5, prompt: "Raumnummer: ________", answers: ["204"] },
        { n: 6, prompt: "Telefonnummer (Vorwahl): ________", answers: ["0732"] },
      ],
    },
    {
      id: "zuordnen",
      kind: "gap",
      title: "Training B — Fünf Personen zuordnen",
      lede: "Ordne jeder Person den passenden Buchstaben zu. Achtung: Eine Aussage bleibt übrig.",
      source: `<p><b>Was suchen diese fünf Personen?</b></p>
        <p style="color:var(--ink-soft)">
          <b>1 Frau Berger:</b> „Ich arbeite bis 17 Uhr, deshalb kann ich nur am Abend oder am Wochenende lernen.“<br>
          <b>2 Herr Öztürk:</b> „Sprechen geht schon ganz gut, aber wenn ich einen Brief schreiben soll, sitze ich eine Stunde davor.“<br>
          <b>3 Frau Novak:</b> „Ich brauche das Zertifikat für meinen Antrag. Ohne Prüfung bringt mir der Kurs nichts.“<br>
          <b>4 Herr Weiß:</b> „Ich verstehe alles, wenn mein Lehrer spricht. Aber im Radio? Kein Wort.“<br>
          <b>5 Frau Kaya:</b> „Am liebsten in einer kleinen Gruppe. In einem Kurs mit zwanzig Leuten sage ich nie etwas.“
        </p>
        <p><b>Aussagen:</b><br>
          <b>A</b> — braucht einen Kurs mit Prüfung am Ende<br>
          <b>B</b> — möchte das Hörverstehen verbessern<br>
          <b>C</b> — kann nur abends oder am Wochenende<br>
          <b>D</b> — möchte in einer kleinen Gruppe lernen<br>
          <b>E</b> — braucht einen Kurs direkt am Arbeitsplatz<br>
          <b>F</b> — hat Probleme mit dem Schreiben
        </p>`,
      items: [
        { n: 1, prompt: "Frau Berger → Buchstabe ________", answers: ["C"], display: "C", why: "„nur am Abend oder am Wochenende“" },
        { n: 2, prompt: "Herr Öztürk → Buchstabe ________", answers: ["F"], display: "F", why: "einen Brief schreiben fällt schwer" },
        { n: 3, prompt: "Frau Novak → Buchstabe ________", answers: ["A"], display: "A", why: "braucht das Zertifikat" },
        { n: 4, prompt: "Herr Weiß → Buchstabe ________", answers: ["B"], display: "B", why: "im Radio versteht er nichts → Hörverstehen" },
        { n: 5, prompt: "Frau Kaya → Buchstabe ________", answers: ["D"], display: "D", why: "kleine Gruppe" },
        { n: 6, prompt: "Welcher Buchstabe bleibt übrig? ________", answers: ["E"], display: "E", why: "Vom Arbeitsplatz spricht niemand — eine Option bleibt immer übrig." },
      ],
    },
    {
      id: "zahlen",
      kind: "gap",
      title: "Training C — Zahlen und Zeiten",
      lede: "Schreib die Zahl als Ziffer. Genau hier verliert man Punkte.",
      items: [
        { n: 1, prompt: "„Der Zug fährt um <em>halb acht</em>.“ → ________ Uhr", answers: ["7.30", "7:30"], display: "7.30" },
        { n: 2, prompt: "„Es ist <em>Viertel vor sechs</em>.“ → ________ Uhr", answers: ["5.45", "5:45"], display: "5.45" },
        { n: 3, prompt: "„Die Wohnung hat <em>dreiundsechzig</em> Quadratmeter.“ → ________", answers: ["63"] },
        { n: 4, prompt: "„Der Kurs kostet <em>hundertneunzig</em> Euro.“ → ________", answers: ["190"] },
        { n: 5, prompt: "„Wir treffen uns am <em>siebzehnten</em> Mai.“ → ________. Mai", answers: ["17"], display: "17." },
        { n: 6, prompt: "„Es sind <em>minus vier Grad</em>.“ → ________ Grad", answers: ["-4", "−4", "minus 4"], display: "-4" },
        { n: 7, prompt: "„Der Termin ist um <em>vierzehn Uhr fünfzehn</em>.“ → ________ Uhr", answers: ["14.15", "14:15"], display: "14.15" },
        { n: 8, prompt: "„Mein Zug fährt von <em>Gleis dreizehn</em>.“ → Gleis ________", answers: ["13"], why: "13, nicht 30 — die Endung -zehn entscheidet." },
      ],
    },
  ],
};

const SCHREIBEN = {
  intro:
    "Der freundlichste Teil der Prüfung: eine einzige Aufgabe, 30 Minuten, 15 Punkte. Du beantwortest eine E-Mail mit etwa 50 Wörtern. Es zählt nicht, wie elegant du schreibst — es zählt, dass du <em>alle vier Leitpunkte</em> beantwortest und Anrede und Gruß nicht vergisst.",
  format: {
    rules: [
      {
        title: "Was dich erwartet",
        body: `
          <p>Du bekommst eine kurze E-Mail — von einer Freundin, einem Kollegen, einem Kurs. Darin stecken <b>vier Punkte</b>, auf die du antworten musst.</p>
          <p>Deine Antwort: eine E-Mail von <b>etwa 50 Wörtern</b>, in <b>30 Minuten</b>, <b>15 Punkte</b>. Es gibt hier <b>keine Mindestpunktzahl</b> pro Teil — aber die 15 Punkte fehlen dir für die 35, die du insgesamt brauchst.</p>
        `,
        note:
          "50 Wörter sind wenig — etwa fünf bis sechs Sätze. Wer 120 Wörter schreibt, macht mehr Fehler und gewinnt keinen einzigen Punkt dazu.",
      },
      {
        title: "Wie bewertet wird",
        body: `
          <p>Bewertet werden vier Dinge, und der erste Punkt wiegt am schwersten:</p>
          <p><b>1. Inhalt</b> — sind alle vier Leitpunkte beantwortet?<br>
             <b>2. Textaufbau</b> — Anrede, Text, Gruß; Sätze mit <em>und, aber, weil, dann</em> verbunden.<br>
             <b>3. Wortschatz</b> — passend zum Thema.<br>
             <b>4. Struktur</b> — Verbstellung, Kasus, Rechtschreibung.</p>
          <p>Ein einziger vergessener Leitpunkt kostet mehr als fünf Grammatikfehler.</p>
        `,
      },
    ],
    tables: [
      {
        caption: "Anrede und Gruß — nach Situation",
        head: ["Situation", "Anrede", "Gruß"],
        rows: [
          ["Freund, Freundin", "Liebe Anna, / Lieber Tom,", "Liebe Grüße / Bis bald"],
          ["Bekannte, per du", "Hallo Maria,", "Viele Grüße"],
          ["Firma, Amt, unbekannt", "Sehr geehrte Frau Berger,", "Mit freundlichen Grüßen"],
          ["Unbekannt, ohne Namen", "Sehr geehrte Damen und Herren,", "Mit freundlichen Grüßen"],
        ],
      },
    ],
  },
  strategy: {
    rules: [
      {
        title: "Strategie 1 — Die vier Punkte zuerst markieren",
        body: `
          <p>Bevor du ein Wort schreibst: lies die Aufgabe und <b>nummeriere die vier Leitpunkte</b> am Rand. Schreib dann pro Punkt <b>einen Satz</b>. Fertig sind deine 50 Wörter.</p>
          <p>Danach zählst du nach: Punkt 1 ✓, Punkt 2 ✓, Punkt 3 ✓, Punkt 4 ✓. Erst dann liest du auf Fehler.</p>
        `,
        note:
          "Das ist buchstäblich der ganze Trick dieses Prüfungsteils. Wer so vorgeht, besteht ihn fast immer.",
      },
      {
        title: "Strategie 2 — Ein Bauplan, den du auswendig kannst",
        body: `
          <p><b>Anrede</b> — Liebe Anna,<br>
             <b>Einstieg</b> — vielen Dank für deine E-Mail. / es war schön, von dir zu hören.<br>
             <b>Vier Sätze</b> — je einer pro Leitpunkt.<br>
             <b>Schluss</b> — Ich freue mich auf deine Antwort.<br>
             <b>Gruß</b> — Liebe Grüße<br>
             <b>Name</b></p>
          <p>Anrede, Einstieg, Schluss und Gruß kannst du auswendig — dann bleiben in der Prüfung nur vier Sätze zu erfinden.</p>
        `,
      },
      {
        title: "Strategie 3 — Zeig, was du kannst (aber sicher)",
        body: `
          <p>Ein <b>weil</b>-Satz und ein Satz in der <b>Vergangenheit</b> heben die Bewertung sofort. Beides beherrschst du:</p>
          <p><span class="mono">Leider kann ich nicht kommen, <b>weil</b> ich arbeiten <b>muss</b>.</span><br>
             <span class="mono">Letztes Wochenende <b>bin</b> ich nach Salzburg <b>gefahren</b>.</span></p>
          <p>Und höflich mit Konjunktiv II: <span class="mono">Wir <b>könnten</b> uns am Samstag treffen.</span></p>
        `,
        note:
          "Riskier keine Konstruktion, die du nicht sicher beherrschst. Ein einfacher richtiger Satz ist mehr wert als ein komplizierter falscher.",
      },
      {
        title: "Strategie 4 — Die letzten fünf Minuten",
        body: `
          <p>Lies deinen Text dreimal, jedes Mal auf <b>eine</b> Sache:</p>
          <p>1. Steht das <b>Verb an Position 2</b>? (<em>Am Samstag <b>habe</b> ich Zeit</em> — nicht <em>Am Samstag ich habe</em>.)<br>
             2. Sind alle <b>Nomen großgeschrieben</b>?<br>
             3. Steht das Verb im Nebensatz <b>am Ende</b>?</p>
        `,
      },
    ],
    tables: [
      {
        caption: "Redemittel, die immer passen",
        head: ["Funktion", "Satz"],
        rows: [
          ["Danken", "Vielen Dank für deine E-Mail / Einladung."],
          ["Sich freuen", "Ich freue mich sehr über deine Nachricht."],
          ["Zusagen", "Ich komme gern! / Das ist eine tolle Idee."],
          ["Absagen", "Leider kann ich nicht kommen, weil ich arbeiten muss."],
          ["Vorschlagen", "Wir könnten uns um sieben treffen."],
          ["Nachfragen", "Kannst du mir sagen, wann es losgeht?"],
          ["Anbieten", "Soll ich etwas mitbringen?"],
          ["Entschuldigen", "Es tut mir leid, dass ich mich erst jetzt melde."],
          ["Schließen", "Ich freue mich auf deine Antwort."],
        ],
      },
    ],
  },
  training: [
    {
      id: "mail1",
      kind: "writing",
      title: "Training A — Antwort auf eine Einladung",
      minWords: 50,
      task: `
        <p><b>Aufgabe.</b> Du bekommst diese E-Mail von deiner Freundin Sofia:</p>
        <p style="color:var(--ink-soft)">„Hallo! Am Samstag feiere ich meinen Geburtstag bei mir zu Hause, ab 19 Uhr. Kommst du? Schreib mir bitte, ob du Zeit hast. Ich koche etwas — magst du lieber Fleisch oder Gemüse? Und kannst du vielleicht Musik mitbringen? Liebe Grüße, Sofia“</p>
        <p>Schreib eine Antwort (ca. 50 Wörter). Gehe auf <b>alle vier Punkte</b> ein:</p>
        <p>1. Bedanke dich für die Einladung.<br>
           2. Sag, ob du kommst.<br>
           3. Antworte auf die Frage nach dem Essen.<br>
           4. Schreib, was du mitbringst.</p>
      `,
      points: [
        { label: "1. Für die Einladung gedankt", triggers: ["danke", "vielen dank", "bedanke"] },
        { label: "2. Zu- oder abgesagt", triggers: ["ich komme", "ich kann kommen", "leider kann ich", "ich komme gern", "kann ich nicht"] },
        { label: "3. Auf die Essensfrage geantwortet", triggers: ["fleisch", "gemüse", "vegetarisch", "esse"] },
        { label: "4. Gesagt, was du mitbringst", triggers: ["bringe", "mitbringen", "musik", "bringe ich mit"] },
      ],
      tips:
        "Vergiss Anrede (<em>Liebe Sofia,</em>) und Gruß (<em>Liebe Grüße</em>) nicht — beide zählen zum Textaufbau. Die Häkchen hier prüfen nur, ob ein Stichwort vorkommt; die Bewertung in der Prüfung liest natürlich ganze Sätze.",
      model: `<b>Musterlösung (54 Wörter):</b>
        <p style="margin-top:0.5rem">Liebe Sofia,<br>
        vielen Dank für die Einladung! Ich komme sehr gern zu deinem Geburtstag.<br>
        Am Samstag habe ich Zeit, ich bin um sieben bei dir.<br>
        Ich esse kein Fleisch, deshalb wäre Gemüse toll für mich.<br>
        Musik bringe ich mit — ich habe eine Box und viele Lieder.<br>
        Ich freue mich schon sehr!<br>
        Liebe Grüße<br>
        Amir</p>`,
    },
    {
      id: "mail2",
      kind: "writing",
      title: "Training B — Absage an den Kurs",
      minWords: 50,
      task: `
        <p><b>Aufgabe.</b> Du bekommst diese E-Mail von deiner Kursleiterin:</p>
        <p style="color:var(--ink-soft)">„Sehr geehrte Damen und Herren des Kurses A2, am Freitag machen wir einen Ausflug nach Melk. Abfahrt ist um 8 Uhr am Bahnhof. Bitte melden Sie sich bis Mittwoch an. Mit freundlichen Grüßen, Ch. Berger“</p>
        <p>Du kannst nicht mitfahren. Schreib eine Antwort (ca. 50 Wörter) und gehe auf <b>alle vier Punkte</b> ein:</p>
        <p>1. Nimm Bezug auf die E-Mail.<br>
           2. Sag ab und begründe warum (<em>weil</em>!).<br>
           3. Frag nach, ob der Ausflug wiederholt wird.<br>
           4. Bitte um die Unterlagen aus der Stunde.</p>
      `,
      points: [
        { label: "1. Bezug auf die E-Mail genommen", triggers: ["ihre e-mail", "ihre nachricht", "vielen dank für", "danke für die information"] },
        { label: "2. Abgesagt und begründet (weil)", triggers: ["weil", "denn", "leider kann ich"] },
        { label: "3. Nach einem neuen Termin gefragt", triggers: ["noch einmal", "wieder", "nächste", "neuer termin", "wiederholen"] },
        { label: "4. Um die Unterlagen gebeten", triggers: ["unterlagen", "material", "hausaufgabe", "schicken"] },
      ],
      tips:
        "Hier ist die Anrede <b>formell</b>: <em>Sehr geehrte Frau Berger,</em> … <em>Mit freundlichen Grüßen</em>. Und Sie, nicht du — durchgehend groß geschrieben.",
      model: `<b>Musterlösung (57 Wörter):</b>
        <p style="margin-top:0.5rem">Sehr geehrte Frau Berger,<br>
        vielen Dank für Ihre E-Mail über den Ausflug nach Melk.<br>
        Leider kann ich nicht mitkommen, weil ich am Freitag arbeiten muss.<br>
        Machen Sie den Ausflug vielleicht noch einmal? Dann wäre ich gern dabei.<br>
        Könnten Sie mir bitte die Unterlagen aus der Stunde schicken?<br>
        Mit freundlichen Grüßen<br>
        Amir Haddad</p>`,
    },
    {
      id: "bausteine",
      kind: "reveal",
      title: "Training C — Sätze bauen",
      lede: "Formuliere aus den Stichwörtern einen ganzen Satz, dann aufdecken. Achte auf Verbstellung und Kasus.",
      items: [
        { n: 1, frag: "danken / für / die Einladung", answer: "Vielen Dank <b>für die Einladung</b>.", hint: "für + Akkusativ" },
        { n: 2, frag: "leider / nicht kommen können / weil / arbeiten müssen", answer: "Leider kann ich nicht kommen, <b>weil ich arbeiten muss</b>.", hint: "weil → konjugiertes Verb ans Ende" },
        { n: 3, frag: "am Samstag / Zeit haben / ich", answer: "Am Samstag <b>habe ich</b> Zeit.", hint: "Position 1 belegt → Subjekt hinter das Verb" },
        { n: 4, frag: "wir / sich treffen können / um sieben", answer: "Wir <b>könnten uns</b> um sieben <b>treffen</b>.", hint: "Konjunktiv II + Reflexivpronomen nach dem Verb" },
        { n: 5, frag: "letztes Wochenende / nach Wien / fahren (Perfekt)", answer: "Letztes Wochenende <b>bin ich</b> nach Wien <b>gefahren</b>.", hint: "fahren → Perfekt mit sein" },
        { n: 6, frag: "können / Sie / mir / die Unterlagen / schicken (höflich)", answer: "<b>Könnten Sie mir</b> bitte die Unterlagen <b>schicken</b>?", hint: "Dativ (mir) vor Akkusativ (die Unterlagen)" },
        { n: 7, frag: "sich freuen auf / deine Antwort", answer: "Ich <b>freue mich auf</b> deine Antwort.", hint: "auf + Akkusativ" },
      ],
    },
  ],
};

const SPRECHEN = {
  intro:
    "Zwei Aufgaben, etwa 10 Minuten, 20 Punkte — und mindestens 10 davon musst du erreichen. Die gute Nachricht: Aufgabe 1 kannst du fast vollständig vorbereiten, und Aufgabe 2 folgt einem Muster, das sich mit zehn Sätzen abdecken lässt. Vorher bekommst du etwa 10 Minuten Vorbereitungszeit.",
  format: {
    rules: [
      {
        title: "Aufgabe 1 — sich vorstellen",
        body: `
          <p>Du bekommst ein Blatt mit <b>sechs Themen</b> und sprichst zu <b>fünf</b> davon frei über dich. Typische Themen: <em>Name · Familie · Wohnort · Beruf/Ausbildung · Hobbys · Sprachen · Tagesablauf</em>.</p>
          <p>Du redest allein, etwa <b>zwei bis drei Sätze pro Thema</b>. Danach stellt die Prüferin meist eine Nachfrage.</p>
        `,
        note:
          "Weil du fünf von sechs Themen wählst, kannst du dein schwächstes einfach weglassen. Bereite trotzdem alle sechs vor — dann ist die Wahl entspannt.",
      },
      {
        title: "Aufgabe 2 — gemeinsam etwas planen",
        body: `
          <p>Zu zweit (oder mit der Prüferin) plant ihr etwas: einen <b>Ausflug</b>, ein <b>Geburtstagsfest</b>, einen <b>gemeinsamen Abend</b>. Auf dem Blatt stehen Punkte wie <em>Wann? Wo? Wie kommen wir hin? Was bringen wir mit?</em></p>
          <p>Bewertet wird nicht die beste Idee, sondern ob du <b>Vorschläge machst</b>, <b>auf deinen Partner reagierst</b> und <b>nachfragst</b>. Wer nur zustimmt, bekommt wenige Punkte.</p>
        `,
        note:
          "Ganz wichtig: nicht monologisieren. Nach jedem eigenen Vorschlag eine Frage zurück — <em>Was meinst du?</em> Das ist die halbe Bewertung.",
      },
      {
        title: "Die Mindestpunktzahl",
        body: `
          <p>Sprechen ist ein eigenes Modul: <b>20 Punkte</b>, davon brauchst du <b>mindestens 10</b>. Die mündliche Prüfung wird getrennt von der schriftlichen bewertet.</p>
        `,
      },
    ],
    tables: [
      {
        caption: "Sprechen im Überblick",
        head: ["Aufgabe", "Was du tust", "Dauer", "Vorbereitung"],
        rows: [
          ["1", "Zu fünf von sechs Themen über dich sprechen", "ca. 3–4 Min", "ja, ca. 10 Min vorher"],
          ["2", "Gemeinsam etwas planen, Vorschläge machen", "ca. 5–6 Min", "ja, Stichpunkte erlaubt"],
        ],
      },
    ],
  },
  strategy: {
    rules: [
      {
        title: "Strategie 1 — Drei Sätze pro Thema, auswendig",
        body: `
          <p>Für jedes der sechs Themen legst du dir <b>drei Sätze</b> zurecht: eine Grundaussage, ein Detail, eine Begründung oder ein Beispiel.</p>
          <p><span class="mono">Ich wohne in Wien, im 15. Bezirk.</span> <span style="color:var(--ink-soft)">(Grundaussage)</span><br>
             <span class="mono">Ich habe eine kleine Wohnung mit zwei Zimmern.</span> <span style="color:var(--ink-soft)">(Detail)</span><br>
             <span class="mono">Mir gefällt es dort, weil viele Geschäfte in der Nähe sind.</span> <span style="color:var(--ink-soft)">(Begründung mit weil)</span></p>
          <p>Sechs Themen × drei Sätze = achtzehn Sätze. Mehr brauchst du für Aufgabe 1 nicht.</p>
        `,
      },
      {
        title: "Strategie 2 — Der Vorschlag-Reaktion-Frage-Zyklus",
        body: `
          <p>Aufgabe 2 ist ein Muster, das du dreimal durchläufst:</p>
          <p><b>1. Vorschlag</b> — <em>Wir könnten am Samstag ins Museum gehen.</em><br>
             <b>2. Reaktion</b> — <em>Das ist eine gute Idee!</em> / <em>Hmm, ich weiß nicht …</em><br>
             <b>3. Frage zurück</b> — <em>Was meinst du?</em> / <em>Und wann passt es dir?</em></p>
          <p>Damit produzierst du automatisch Gesprächsverhalten — genau das wird bewertet.</p>
        `,
        note:
          "Sag niemals nur „ja“. Ein „Ja, gern — aber vielleicht lieber am Sonntag?“ ist doppelt so viel wert.",
      },
      {
        title: "Strategie 3 — Wenn du ein Wort nicht weißt",
        body: `
          <p>Schweigen kostet Punkte, Umschreiben nicht. Lern diese Notfallsätze:</p>
          <p><span class="mono">Wie sagt man das auf Deutsch?</span><br>
             <span class="mono">Ich weiß das Wort nicht — es ist etwas zum Schreiben.</span><br>
             <span class="mono">Entschuldigung, können Sie die Frage wiederholen?</span><br>
             <span class="mono">Moment, ich überlege kurz.</span></p>
          <p>Wer umschreibt, zeigt Sprachkompetenz. Wer verstummt, zeigt nichts.</p>
        `,
      },
      {
        title: "Strategie 4 — Langsam, laut, ganze Sätze",
        body: `
          <p>Drei Dinge, die die Bewertung sofort verbessern und nichts mit Grammatik zu tun haben:</p>
          <p><b>Langsam</b> — wer schnell spricht, macht mehr Fehler und wird schlechter verstanden.<br>
             <b>Laut genug</b> — die Prüferin muss dich mühelos hören.<br>
             <b>Ganze Sätze</b> — auf <em>Woher kommen Sie?</em> antworte <em>Ich komme aus Syrien</em>, nicht nur <em>Syrien</em>.</p>
        `,
      },
    ],
    tables: [
      {
        caption: "Redemittel für Aufgabe 2",
        head: ["Funktion", "Sätze"],
        rows: [
          ["Vorschlagen", "Wir könnten … · Wie wäre es mit …? · Ich schlage vor, wir …"],
          ["Zustimmen", "Das ist eine gute Idee. · Ja, gern! · Einverstanden."],
          ["Ablehnen (höflich)", "Hmm, lieber nicht. · Das gefällt mir nicht so gut. · Ich hätte lieber …"],
          ["Alternative", "Oder wir gehen …? · Vielleicht besser am Sonntag?"],
          ["Nachfragen", "Was meinst du? · Passt dir das? · Und wann treffen wir uns?"],
          ["Sich einigen", "Gut, dann machen wir das so. · Abgemacht!"],
          ["Aufgaben verteilen", "Ich bringe … mit. Kannst du … mitbringen?"],
        ],
      },
    ],
  },
  training: [
    {
      id: "vorstellen",
      kind: "reveal",
      title: "Training A — Deine sechs Themen",
      lede: "Schreib zu jedem Thema deine drei Sätze auf und sprich sie laut. Die Musterantwort ist ein Beispiel — deine eigenen Sätze sind besser, weil du sie dir merkst.",
      items: [
        {
          n: 1,
          frag: "Name und Herkunft",
          label: "Beispiel",
          answer: "Ich heiße Amir Haddad. Ich komme aus Syrien, aus Aleppo. Seit vier Jahren lebe ich in Österreich.",
          hint: "seit + Dativ, aber Präsens: „seit vier Jahren lebe ich“",
        },
        {
          n: 2,
          frag: "Familie",
          label: "Beispiel",
          answer: "Ich bin verheiratet und habe zwei Kinder, einen Sohn und eine Tochter. Meine Eltern wohnen noch in Syrien. Wir telefonieren jede Woche.",
        },
        {
          n: 3,
          frag: "Wohnort und Wohnung",
          label: "Beispiel",
          answer: "Ich wohne in Wien im 15. Bezirk. Wir haben eine Dreizimmerwohnung im zweiten Stock. Mir gefällt es dort, weil die U-Bahn ganz in der Nähe ist.",
        },
        {
          n: 4,
          frag: "Beruf oder Ausbildung",
          label: "Beispiel",
          answer: "Ich arbeite als Koch in einem Restaurant. Ich arbeite meistens abends, von vier bis elf. Die Arbeit ist anstrengend, aber sie macht mir Spaß.",
          hint: "als + Beruf, ohne Artikel",
        },
        {
          n: 5,
          frag: "Freizeit und Hobbys",
          label: "Beispiel",
          answer: "In meiner Freizeit spiele ich gern Fußball. Am Wochenende gehe ich oft mit Freunden in den Park. Im Winter fahre ich manchmal Ski — das habe ich hier gelernt.",
        },
        {
          n: 6,
          frag: "Sprachen und Deutschlernen",
          label: "Beispiel",
          answer: "Meine Muttersprache ist Arabisch. Ich spreche auch ein bisschen Englisch. Ich lerne seit zwei Jahren Deutsch, weil ich hier arbeiten und studieren möchte.",
          hint: "weil → Verb ans Ende: „… arbeiten möchte“",
        },
      ],
    },
    {
      id: "nachfragen",
      kind: "reveal",
      title: "Training B — Typische Nachfragen der Prüferin",
      lede: "Antworte laut in ganzen Sätzen, dann aufdecken und vergleichen.",
      items: [
        { n: 1, frag: "„Was machen Sie am Wochenende?“", label: "Beispiel", answer: "Am Wochenende schlafe ich zuerst länger. Dann treffe ich Freunde oder gehe mit meiner Familie spazieren.", hint: "Position 1 belegt → Verb bleibt an Position 2" },
        { n: 2, frag: "„Warum lernen Sie Deutsch?“", label: "Beispiel", answer: "Ich lerne Deutsch, weil ich in Österreich arbeiten möchte. Ohne Deutsch finde ich keine gute Stelle." },
        { n: 3, frag: "„Was haben Sie letzten Sommer gemacht?“", label: "Beispiel", answer: "Letzten Sommer bin ich mit meiner Familie nach Salzburg gefahren. Wir sind viel gewandert und haben die Stadt angeschaut.", hint: "Perfekt: sein bei Bewegung, haben beim Rest" },
        { n: 4, frag: "„Wie sieht ein normaler Tag bei Ihnen aus?“", label: "Beispiel", answer: "Ich stehe um sechs auf und bringe die Kinder in die Schule. Danach fahre ich zur Arbeit. Am Abend koche ich und sehe ein bisschen fern." },
        { n: 5, frag: "„Was gefällt Ihnen in Österreich?“", label: "Beispiel", answer: "Mir gefallen die Berge sehr gut. Und die öffentlichen Verkehrsmittel sind super — man braucht kein Auto.", hint: "gefallen + Dativ: mir gefällt / mir gefallen" },
      ],
    },
    {
      id: "planen",
      kind: "reveal",
      title: "Training C — Gemeinsam planen",
      lede: "Situation: Ihr plant zu zweit einen Ausflug am Samstag. Formuliere zu jedem Punkt eine Äußerung — Vorschlag, Reaktion, Rückfrage.",
      items: [
        { n: 1, frag: "Wohin fahren wir? — Mach einen Vorschlag.", label: "Beispiel", answer: "Wir könnten nach Salzburg fahren. Dort gibt es viel zu sehen. Was meinst du?", hint: "Vorschlag + Begründung + Frage zurück" },
        { n: 2, frag: "Dein Partner schlägt 6 Uhr morgens vor. Reagiere höflich ablehnend.", label: "Beispiel", answer: "Sechs Uhr ist mir ehrlich gesagt zu früh. Könnten wir vielleicht um neun losfahren?", hint: "höflich ablehnen + Alternative anbieten" },
        { n: 3, frag: "Wie kommen wir hin?", label: "Beispiel", answer: "Ich schlage vor, wir fahren mit dem Zug. Das ist bequemer als mit dem Auto, und wir brauchen keinen Parkplatz." },
        { n: 4, frag: "Was bringen wir mit? Verteilt die Aufgaben.", label: "Beispiel", answer: "Ich bringe Getränke und Obst mit. Kannst du vielleicht die Brote machen?" },
        { n: 5, frag: "Wo und wann treffen wir uns?", label: "Beispiel", answer: "Treffen wir uns um Viertel vor neun am Hauptbahnhof, beim Eingang? Passt dir das?" },
        { n: 6, frag: "Einigt euch am Ende.", label: "Beispiel", answer: "Gut, dann machen wir das so: Samstag um neun mit dem Zug nach Salzburg. Ich freue mich!" },
      ],
    },
  ],
};

export const SKILLS = {
  hoeren: HOEREN,
  schreiben: SCHREIBEN,
  sprechen: SPRECHEN,
};
