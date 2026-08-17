// B1 grammar, part 2 — relative clauses, Konjunktiv II, Passiv.
//
// All three are chosen from what the ZDÖ B1 Modellsatz asks for: Lesen 2 is a
// Zeitungsartikel dense with relative clauses, the Schreiben task is a reply to
// a person or an authority where Konjunktiv II is the difference between polite
// and blunt, and the Passiv is how any official text describes a process.

export const TOPICS_B1B = {
  "b1-relativsaetze": {
    intro:
      "Relativsätze sind der Grund, warum ein B1-Text nicht mehr wie eine Liste klingt: statt <em>Das ist mein Kollege. Er wohnt in Graz.</em> schreibst du <em>Das ist mein Kollege, <b>der</b> in Graz wohnt.</em> Im Zeitungsartikel von Lesen 2 steckt in fast jedem Absatz einer. Die gute Nachricht: das Relativpronomen sieht fast genauso aus wie der bestimmte Artikel — nur vier Formen weichen ab.",
    rules: [
      {
        title: "Regel 1 — Genus vom Bezugswort, Kasus vom Nebensatz",
        body: `
          <p>Das ist die ganze Schwierigkeit, und sie steckt in zwei getrennten Fragen:</p>
          <p><b>Welches Geschlecht und welche Zahl?</b> → schau auf das Wort <em>davor</em>.<br>
             <b>Welcher Kasus?</b> → schau, welche Rolle das Pronomen <em>im Relativsatz</em> spielt.</p>
          <p><span class="mono">Der Mann, <b>der</b> dort steht …</span> <span style="color:var(--ink-soft)">(maskulin, und er ist Subjekt → Nominativ)</span><br>
             <span class="mono">Der Mann, <b>den</b> ich kenne …</span> <span style="color:var(--ink-soft)">(maskulin, aber Objekt von kennen → Akkusativ)</span><br>
             <span class="mono">Der Mann, <b>dem</b> ich helfe …</span> <span style="color:var(--ink-soft)">(helfen + Dativ)</span></p>
          <p>Und immer: <strong>Verb ans Ende</strong>, Komma davor.</p>
        `,
        note:
          "Typischer Fehler: den Kasus vom Hauptsatz übernehmen. <em>Ich sehe den Mann, den dort steht</em> ✗ — im Relativsatz ist er Subjekt → <strong>der dort steht</strong> ✓",
      },
      {
        title: "Regel 2 — Nur vier Formen sind neu",
        body: `
          <p>Vergleich mit dem bestimmten Artikel: identisch, außer im <b>Dativ Plural</b> und im gesamten <b>Genitiv</b>.</p>
          <p><span class="mono">Dativ Plural: <b>denen</b></span> — <em>die Kollegen, <b>denen</b> ich geschrieben habe</em><br>
             <span class="mono">Genitiv: <b>dessen</b> (m/n), <b>deren</b> (f/Pl.)</span> — <em>die Frau, <b>deren</b> Auto kaputt ist</em></p>
          <p>Beim Genitiv folgt das Nomen <strong>ohne Artikel</strong>: <em>deren Auto</em>, nicht <em>deren das Auto</em>.</p>
        `,
        note: "Merke: alles wie <em>der/die/das</em> — und dann die vier Ausnahmen <b>denen, dessen, deren</b> extra lernen.",
      },
      {
        title: "Regel 3 — Mit Präposition",
        body: `
          <p>Verlangt das Verb im Relativsatz eine Präposition, steht sie <strong>vor</strong> dem Relativpronomen, und sie bestimmt den Kasus:</p>
          <p><span class="mono">Das ist die Kollegin, <b>mit der</b> ich arbeite.</span> <span style="color:var(--ink-soft)">(arbeiten mit + Dativ)</span><br>
             <span class="mono">Das ist das Thema, <b>über das</b> wir gesprochen haben.</span> <span style="color:var(--ink-soft)">(sprechen über + Akkusativ)</span><br>
             <span class="mono">Die Firma, <b>bei der</b> ich mich beworben habe, …</span></p>
          <p>Für Orte geht auch <b>wo</b>: <em>die Stadt, <b>wo</b> ich geboren bin</em> = <em>in der ich geboren bin</em>.</p>
        `,
        note: "Anders als im Englischen darf die Präposition <strong>nie</strong> ans Ende: <em>die Kollegin, der ich mit arbeite</em> ✗",
      },
    ],
    tables: [
      {
        caption: "Relativpronomen — alle Formen",
        lede: "Fett ist alles, was vom bestimmten Artikel abweicht. Das sind genau vier Felder.",
        head: ["Kasus", "maskulin", "feminin", "neutrum", "Plural"],
        rows: [
          ["Nominativ", "der", "die", "das", "die"],
          ["Akkusativ", "den", "die", "das", "die"],
          ["Dativ", "dem", "der", "dem", "denen"],
          ["Genitiv", "dessen", "deren", "dessen", "deren"],
        ],
      },
      {
        caption: "Welcher Kasus? Die Frage im Relativsatz",
        head: ["Rolle im Relativsatz", "Frage", "Beispiel"],
        rows: [
          ["Subjekt", "wer/was tut es?", "der Mann, der arbeitet"],
          ["direktes Objekt", "wen/was?", "der Mann, den ich sehe"],
          ["Dativ-Objekt / Dativverb", "wem?", "der Mann, dem ich helfe"],
          ["Besitz", "wessen?", "der Mann, dessen Auto kaputt ist"],
          ["nach Präposition", "die Präposition entscheidet", "der Mann, mit dem ich spreche"],
        ],
      },
    ],
    exercises: [
      {
        id: "b1rel1",
        kind: "gap",
        title: "Übung A — das richtige Relativpronomen",
        lede: "Frag dich zuerst: welches Geschlecht hat das Bezugswort, und welche Rolle spielt das Pronomen im Nebensatz?",
        items: [
          { n: 1, prompt: "Das ist der Kollege, ________ in Wien wohnt.", answers: ["der"] },
          { n: 2, prompt: "Das ist der Kollege, ________ ich gestern getroffen habe.", answers: ["den"] },
          { n: 3, prompt: "Das ist die Frau, ________ ich das Buch gegeben habe.", answers: ["der"] },
          { n: 4, prompt: "Das sind die Nachbarn, ________ ich oft helfe.", answers: ["denen"] },
          { n: 5, prompt: "Das ist das Haus, ________ meinen Eltern gehört.", answers: ["das"] },
          { n: 6, prompt: "Die Firma, ________ Chef ich kenne, sucht Personal.", answers: ["deren"] },
          { n: 7, prompt: "Der Student, ________ Mutter Ärztin ist, kommt aus Linz.", answers: ["dessen"] },
          { n: 8, prompt: "Das ist die Kollegin, mit ________ ich das Projekt mache.", answers: ["der"] },
          { n: 9, prompt: "Das ist das Thema, über ________ wir gestritten haben.", answers: ["das"] },
          { n: 10, prompt: "Die Stadt, in ________ ich geboren bin, liegt in der Steiermark.", answers: ["der"] },
        ],
      },
      {
        id: "b1rel2",
        kind: "gap",
        title: "Übung B — zwei Sätze zu einem",
        lede: "Verbinde die Sätze mit einem Relativsatz. Schreib nur den Relativsatz.",
        items: [
          { n: 1, prompt: "Das ist mein Bruder. Er arbeitet bei der Bahn. → Das ist mein Bruder, ________", answers: ["der bei der Bahn arbeitet", "der bei der Bahn arbeitet."] },
          { n: 2, prompt: "Ich habe ein Buch gelesen. Es war sehr spannend. → Ich habe ein Buch gelesen, ________", answers: ["das sehr spannend war", "das sehr spannend war."] },
          { n: 3, prompt: "Da ist die Ärztin. Ich habe ihr geschrieben. → Da ist die Ärztin, ________", answers: ["der ich geschrieben habe", "der ich geschrieben habe."] },
          { n: 4, prompt: "Das ist der Verein. Ich bin dort Mitglied. → Das ist der Verein, ________", answers: ["in dem ich Mitglied bin", "bei dem ich Mitglied bin", "in dem ich Mitglied bin.", "wo ich Mitglied bin"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Woher kommt das Geschlecht, woher der Kasus?",
        reveal:
          "<b>Geschlecht und Zahl</b> vom Bezugswort im Hauptsatz. <b>Kasus</b> von der Rolle, die das Pronomen im <em>Relativsatz</em> spielt. Das sind zwei unabhängige Fragen — sie zu vermischen ist der häufigste Fehler.",
      },
      {
        q: "Welche vier Formen weichen vom bestimmten Artikel ab?",
        reveal: "<b>denen</b> (Dativ Plural) und der ganze Genitiv: <b>dessen</b> (m/n), <b>deren</b> (f und Plural).",
      },
      {
        q: "Wo steht die Präposition?",
        reveal: "Immer <b>vor</b> dem Relativpronomen, nie am Ende: <em>die Kollegin, <b>mit der</b> ich arbeite</em>. Und sie bestimmt den Kasus.",
      },
    ],
  },

  "b1-konjunktiv2": {
    intro:
      "Der Konjunktiv II ist auf B1 vor allem eine <b>Höflichkeitsform</b> — und damit direkt prüfungsrelevant. Wer an eine Behörde schreibt (die zweite Schreiben-Variante im Modellsatz ist genau das) und dort <em>Ich will einen Termin</em> hinschreibt, klingt fordernd; <em>Ich hätte gern einen Termin</em> oder <em>Könnten Sie mir mitteilen …</em> klingt richtig. Dieselbe Form macht Wünsche und irreale Bedingungen.",
    rules: [
      {
        title: "Regel 1 — würde + Infinitiv deckt fast alles ab",
        body: `
          <p>Bei den allermeisten Verben bildet man den Konjunktiv II mit <b>würde</b> + Infinitiv am Ende:</p>
          <p><span class="mono">Ich <b>würde</b> gern nach Wien <b>fahren</b>.</span><br>
             <span class="mono"><b>Würden</b> Sie mir bitte <b>helfen</b>?</span></p>
          <p>Das ist keine Notlösung, sondern die normale Form — auch Muttersprachler sagen <em>würde kommen</em>, nicht <em>käme</em>.</p>
        `,
        note: "würde: ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.",
      },
      {
        title: "Regel 2 — Sechs Verben haben eigene Formen, die man wirklich benutzt",
        body: `
          <p>Bei diesen klingt <em>würde</em> falsch. Sie musst du auswendig können:</p>
          <p><b>sein → wäre</b> · <b>haben → hätte</b> · <b>werden → würde</b> · <b>können → könnte</b> · <b>müssen → müsste</b> · <b>dürfen → dürfte</b> · dazu <b>mögen → möchte</b> und <b>sollen → sollte</b>.</p>
          <p><span class="mono">Das <b>wäre</b> schön.</span> · <span class="mono">Ich <b>hätte</b> eine Frage.</span> · <span class="mono"><b>Könnten</b> Sie das wiederholen?</span></p>
          <p>Erkennbar am <strong>Umlaut</strong> plus <em>-e</em>: war → wäre, hatte → hätte, konnte → könnte.</p>
        `,
        note: "<em>Ich würde eine Frage haben</em> ✗ klingt schwerfällig → <strong>Ich hätte eine Frage.</strong> ✓",
      },
      {
        title: "Regel 3 — Drei Verwendungen",
        body: `
          <p><b>Höflichkeit</b> — im Amt, im Geschäft, in jeder E-Mail:<br>
             <span class="mono">Ich <b>hätte</b> gern … · <b>Könnten</b> Sie …? · <b>Würden</b> Sie bitte …? · Ich <b>möchte</b> …</span></p>
          <p><b>Wunsch</b> — oft mit <em>gern</em> oder mit <em>wenn … nur</em>:<br>
             <span class="mono">Ich <b>würde</b> gern länger bleiben. · <b>Wenn</b> ich nur mehr Zeit <b>hätte</b>!</span></p>
          <p><b>Irreale Bedingung</b> — beide Satzteile im Konjunktiv II:<br>
             <span class="mono"><b>Wenn</b> ich Zeit <b>hätte</b>, <b>würde</b> ich mitkommen.</span></p>
        `,
        note: "Für Vergangenes: <em>hätte</em>/<em>wäre</em> + Partizip II. <em>Wenn ich das gewusst <b>hätte</b>, <b>wäre</b> ich gekommen.</em>",
      },
    ],
    tables: [
      {
        caption: "Die Formen, die du auswendig brauchst",
        lede: "Alle anderen Verben nimmst du einfach mit würde + Infinitiv.",
        head: ["Infinitiv", "Präteritum", "Konjunktiv II"],
        rows: [
          ["sein", "war", "wäre"],
          ["haben", "hatte", "hätte"],
          ["werden", "wurde", "würde"],
          ["können", "konnte", "könnte"],
          ["müssen", "musste", "müsste"],
          ["dürfen", "durfte", "dürfte"],
          ["sollen", "sollte", "sollte"],
          ["mögen", "mochte", "möchte"],
          ["wissen", "wusste", "wüsste"],
          ["kommen", "kam", "käme (selten — meist: würde kommen)"],
        ],
      },
      {
        caption: "Höflich statt direkt",
        lede: "Die linke Spalte ist grammatisch korrekt und trotzdem der falsche Ton für eine Behörde.",
        head: ["direkt", "höflich (Konjunktiv II)"],
        rows: [
          ["Ich will einen Termin.", "Ich hätte gern einen Termin."],
          ["Geben Sie mir das Formular.", "Könnten Sie mir das Formular geben?"],
          ["Helfen Sie mir!", "Würden Sie mir bitte helfen?"],
          ["Ich kann nicht kommen.", "Leider könnte ich erst später kommen."],
          ["Schicken Sie die Bestätigung.", "Ich wäre Ihnen dankbar, wenn Sie die Bestätigung schicken würden."],
          ["Das ist falsch.", "Das dürfte ein Missverständnis sein."],
        ],
      },
    ],
    exercises: [
      {
        id: "b1k2a",
        kind: "gap",
        title: "Übung A — die Form",
        lede: "Setze den Konjunktiv II ein. Bei den sechs Verben aus der Tabelle die eigene Form, sonst würde + Infinitiv.",
        items: [
          { n: 1, prompt: "Das ________ sehr nett von Ihnen. <em>(sein)</em>", answers: ["wäre"] },
          { n: 2, prompt: "Ich ________ gern einen Termin. <em>(haben)</em>", answers: ["hätte"] },
          { n: 3, prompt: "________ Sie mir bitte helfen? <em>(können)</em>", answers: ["Könnten", "könnten"] },
          { n: 4, prompt: "Ich ________ gern früher nach Hause gehen. <em>(würde-Form)</em>", answers: ["würde"] },
          { n: 5, prompt: "Wir ________ eigentlich mehr sparen. <em>(müssen)</em>", answers: ["müssten"] },
          { n: 6, prompt: "Wenn ich mehr Zeit ________, käme ich mit. <em>(haben)</em>", answers: ["hätte"] },
          { n: 7, prompt: "________ ich Sie kurz etwas fragen? <em>(dürfen)</em>", answers: ["Dürfte", "dürfte"] },
          { n: 8, prompt: "Ich ________ nicht, was ich sagen soll. <em>(wissen)</em>", answers: ["wüsste"] },
        ],
      },
      {
        id: "b1k2b",
        kind: "gap",
        title: "Übung B — höflich formulieren",
        lede: "Schreib den Satz für eine E-Mail an ein Amt um.",
        items: [
          { n: 1, prompt: "Ich will eine Bestätigung. → Ich ________ gern eine Bestätigung.", answers: ["hätte"] },
          { n: 2, prompt: "Schicken Sie mir das Formular! → ________ Sie mir bitte das Formular schicken?", answers: ["Würden", "würden", "Könnten", "könnten"] },
          { n: 3, prompt: "Ich kann erst am Montag kommen. → Leider ________ ich erst am Montag kommen.", answers: ["könnte"] },
          { n: 4, prompt: "Sagen Sie mir den Termin. → ________ Sie mir bitte den Termin mitteilen?", answers: ["Könnten", "könnten", "Würden", "würden"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wann <em>würde</em> und wann die eigene Form?",
        reveal:
          "Eigene Formen bei <b>sein, haben, werden</b> und den <b>Modalverben</b> (wäre, hätte, könnte, müsste, dürfte, sollte, möchte) sowie <em>wüsste</em>. Bei allen anderen Verben ist <b>würde + Infinitiv</b> die normale Wahl.",
      },
      {
        q: "Woran erkennt man die Konjunktiv-II-Form?",
        reveal: "Am <b>Umlaut plus -e</b>, gebildet aus dem Präteritum: war → w<b>ä</b>re, hatte → h<b>ä</b>tte, konnte → k<b>ö</b>nnte, musste → m<b>ü</b>sste.",
      },
      {
        q: "Wie sagst du eine irreale Bedingung in der Vergangenheit?",
        reveal: "<b>hätte</b> oder <b>wäre</b> + Partizip II in beiden Teilen: <em>Wenn ich das gewusst <b>hätte</b>, <b>wäre</b> ich früher gekommen.</em>",
      },
    ],
  },

  "b1-passiv": {
    intro:
      "Das Passiv rückt die <b>Handlung</b> in den Vordergrund und lässt offen, wer sie tut — genau deshalb steht jeder Amtstext, jede Hausordnung und jede Betriebsanleitung darin. Für Lesen und Hören musst du es sicher <em>verstehen</em>; für Schreiben reicht es, ein paar Sätze korrekt zu bilden. Die Konstruktion ist mechanisch: <b>werden</b> + Partizip II.",
    rules: [
      {
        title: "Regel 1 — werden + Partizip II",
        body: `
          <p>Das konjugierte <b>werden</b> steht auf Position 2, das <b>Partizip II</b> ganz am Ende — dieselbe Satzklammer wie beim Perfekt.</p>
          <p><span class="mono">Aktiv: Der Techniker <b>repariert</b> den Drucker.</span><br>
             <span class="mono">Passiv: Der Drucker <b>wird</b> <b>repariert</b>.</span></p>
          <p>Das Akkusativ-Objekt des Aktivsatzes wird zum <strong>Subjekt</strong> des Passivsatzes — und steht dann im Nominativ.</p>
        `,
        note: "Nicht mit dem Perfekt verwechseln: <em>wird repariert</em> = Passiv Präsens. <em>hat repariert</em> = Perfekt Aktiv.",
      },
      {
        title: "Regel 2 — Vergangenheit: wurde",
        body: `
          <p>Für die Vergangenheit nimmt man fast immer das <b>Präteritum</b> von werden:</p>
          <p><span class="mono">Das Haus <b>wurde</b> 1990 <b>gebaut</b>.</span></p>
          <p>Das Perfekt-Passiv (<em>ist gebaut worden</em>) gibt es, kommt auf B1 aber selten vor. Wichtig ist nur: dort heißt das Partizip von werden <b>worden</b>, nicht <em>geworden</em>.</p>
        `,
        note: "Merke die Reihe: <em>wird gebaut</em> (jetzt) → <em>wurde gebaut</em> (damals) → <em>ist gebaut worden</em> (Perfekt).",
      },
      {
        title: "Regel 3 — Wer es tut: von oder durch",
        body: `
          <p>Meistens lässt man den Handelnden weg — das ist ja der Zweck. Wenn er genannt wird:</p>
          <p><b>von</b> + Dativ für Personen und Institutionen: <span class="mono">Der Antrag wurde <b>vom Amt</b> geprüft.</span><br>
             <b>durch</b> + Akkusativ für Mittel und Ursachen: <span class="mono">Die Straße wurde <b>durch das Hochwasser</b> zerstört.</span></p>
        `,
        note: "Faustregel: <em>von</em> = wer, <em>durch</em> = wodurch.",
      },
      {
        title: "Regel 4 — Mit Modalverb",
        body: `
          <p>Das Modalverb wird konjugiert, am Ende steht <b>Partizip II + werden</b> — in dieser Reihenfolge:</p>
          <p><span class="mono">Das Formular <b>muss</b> bis Freitag <b>abgegeben werden</b>.</span><br>
             <span class="mono">Hier <b>darf</b> nicht <b>geparkt werden</b>.</span></p>
          <p>Genau diese Form steht auf Schildern und in Hausordnungen — sie zu erkennen ist halbe Prüfungsarbeit.</p>
        `,
        note: "Alternative im Alltag: <em>man</em> + Aktiv. <em>Hier darf man nicht parken.</em> Bedeutet dasselbe und ist leichter zu bauen.",
      },
    ],
    tables: [
      {
        caption: "Passiv in den Zeiten",
        lede: "Nur die Form von werden ändert sich; das Partizip II bleibt stehen.",
        head: ["Zeit", "Beispiel", "Bau"],
        rows: [
          ["Präsens", "Der Drucker wird repariert.", "wird + Partizip II"],
          ["Präteritum", "Der Drucker wurde repariert.", "wurde + Partizip II"],
          ["Perfekt", "Der Drucker ist repariert worden.", "ist + Partizip II + worden"],
          ["mit Modalverb", "Der Drucker muss repariert werden.", "Modalverb + Partizip II + werden"],
        ],
      },
      {
        caption: "werden — alle drei Bedeutungen auseinanderhalten",
        lede: "Dasselbe Verb macht drei verschiedene Sachen. Woran du sie erkennst, steht rechts.",
        head: ["Bedeutung", "Beispiel", "Erkennungszeichen"],
        rows: [
          ["Passiv", "Das Auto wird verkauft.", "+ Partizip II"],
          ["Futur", "Ich werde morgen anrufen.", "+ Infinitiv"],
          ["Vollverb „werden“", "Er wird Arzt. / Es wird kalt.", "+ Nomen oder Adjektiv"],
        ],
      },
    ],
    exercises: [
      {
        id: "b1pas1",
        kind: "gap",
        title: "Übung A — ins Passiv",
        lede: "Schreib den fehlenden Teil. Achte auf die Zeit.",
        items: [
          { n: 1, prompt: "Man repariert die Heizung. → Die Heizung ________ repariert.", answers: ["wird"] },
          { n: 2, prompt: "Man baute das Haus 1990. → Das Haus ________ 1990 gebaut.", answers: ["wurde"] },
          { n: 3, prompt: "Man muss das Formular unterschreiben. → Das Formular muss ________ ________.", answers: ["unterschrieben werden"] },
          { n: 4, prompt: "Hier darf man nicht rauchen. → Hier darf nicht ________ ________.", answers: ["geraucht werden"] },
          { n: 5, prompt: "Das Amt prüft den Antrag. → Der Antrag wird ________ Amt geprüft.", answers: ["vom"] },
          { n: 6, prompt: "Das Hochwasser zerstörte die Brücke. → Die Brücke wurde ________ das Hochwasser zerstört.", answers: ["durch"] },
          { n: 7, prompt: "Die Post hat das Paket geliefert. → Das Paket ist von der Post geliefert ________.", answers: ["worden"] },
          { n: 8, prompt: "Man serviert das Frühstück ab 7 Uhr. → Das Frühstück ________ ab 7 Uhr serviert.", answers: ["wird"] },
        ],
      },
      {
        id: "b1pas2",
        kind: "gap",
        title: "Übung B — welches „werden“?",
        lede: "Schreib: Passiv, Futur oder Vollverb.",
        items: [
          { n: 1, prompt: "Der Brief wird morgen geschrieben. →", answers: ["Passiv", "passiv"] },
          { n: 2, prompt: "Ich werde dich morgen anrufen. →", answers: ["Futur", "futur"] },
          { n: 3, prompt: "Meine Tochter wird Lehrerin. →", answers: ["Vollverb", "vollverb"] },
          { n: 4, prompt: "Im Herbst wird es früh dunkel. →", answers: ["Vollverb", "vollverb"] },
          { n: 5, prompt: "Die Rechnung wurde schon bezahlt. →", answers: ["Passiv", "passiv"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wie unterscheidest du <em>wird repariert</em> von <em>hat repariert</em>?",
        reveal:
          "<b>werden</b> + Partizip II = <b>Passiv</b> (jemand repariert es, wir sagen nicht wer). <b>haben</b> + Partizip II = <b>Perfekt Aktiv</b> (er hat es repariert).",
      },
      {
        q: "Wie sieht Passiv mit Modalverb aus?",
        reveal: "Modalverb konjugiert auf Position 2, am Satzende <b>Partizip II + werden</b>: <em>Das Formular <b>muss</b> abgegeben <b>werden</b>.</em>",
      },
      {
        q: "<em>von</em> oder <em>durch</em>?",
        reveal: "<b>von</b> + Dativ für die handelnde Person oder Stelle (vom Amt, von der Post). <b>durch</b> + Akkusativ für Mittel oder Ursache (durch das Hochwasser).",
      },
      {
        q: "Wie heißt das Partizip von <em>werden</em> im Passiv-Perfekt?",
        reveal: "<b>worden</b>, nicht <em>geworden</em>: <em>Das Paket ist geliefert <b>worden</b>.</em> <em>geworden</em> gehört zum Vollverb: <em>Er ist Arzt geworden.</em>",
      },
    ],
  },
};
