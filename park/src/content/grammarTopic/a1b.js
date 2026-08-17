// A1 grammar, part 2: the things that move a verb around the sentence —
// modals, separable prefixes, the imperative — plus the prepositions and the
// perfect tense that A1 finishes on.

export const TOPICS_A1B = {
  "a1-modalverben": {
    intro:
      "Modalverben sagen nicht, was passiert, sondern wie du dazu stehst: ob du es kannst, musst, willst oder darfst. Sie bringen einen Bauplan mit, der auf A1 zum ersten Mal auftaucht und danach nie wieder verschwindet — das Modalverb wird konjugiert, das zweite Verb steht als Infinitiv am Satzende.",
    rules: [
      {
        title: "Regel 1 — Modalverb an Position 2, Infinitiv ans Ende",
        body: `
          <p>Das ist die <b>Satzklammer</b>: die beiden Verbteile umschließen alles andere.</p>
          <p><span class="mono">Ich <b style="color:var(--accent)">muss</b> morgen früh <b style="color:var(--accent)">aufstehen</b>.<br>
          Wir <b style="color:var(--accent)">können</b> am Wochenende ins Kino <b style="color:var(--accent)">gehen</b>.</span></p>
          <p>Der Infinitiv steht ganz am Ende, ohne <em>zu</em> — anders als im Englischen.</p>
        `,
        note:
          "Typischer Fehler: <em>Ich muss aufstehen früh.</em> ✗ Alles, was zum Satz gehört, steht <b>zwischen</b> den beiden Verbteilen.",
      },
      {
        title: "Regel 2 — ich und er/sie/es sind gleich",
        body: `
          <p>Modalverben haben eine Eigenheit, die das Lernen erleichtert: in der 1. und 3. Person Singular sind sie identisch und <b>ohne Endung</b>.</p>
          <p><span class="mono">ich kann — er kann · ich muss — sie muss · ich will — es will</span></p>
          <p>Außerdem ändert sich im Singular meist der Vokal: <em>können → ich kann</em>, <em>müssen → ich muss</em>, <em>dürfen → ich darf</em>.</p>
        `,
        note:
          "<em>ich kanne</em> oder <em>er kannt</em> gibt es nicht. Keine Endung heißt wirklich keine Endung.",
      },
      {
        title: "Regel 3 — möchten ist höflich, wollen ist direkt",
        body: `
          <p>Auf A1 ist das der wichtigste Bedeutungsunterschied, weil er im Café und im Geschäft ständig gebraucht wird.</p>
          <p><span class="mono">Ich <b style="color:var(--accent)">möchte</b> einen Kaffee, bitte.</span> — höflich, das Normale im Lokal.<br>
          <span class="mono">Ich <b>will</b> einen Kaffee.</span> — sehr direkt, klingt fordernd.</p>
          <p>Und <b>müssen</b> verneint heißt <em>nicht müssen</em> = „brauchst du nicht“. Ein Verbot ist <b>nicht dürfen</b>.</p>
          <p><span class="mono">Du <b>musst nicht</b> kommen.</span> (= es ist nicht nötig)<br>
          <span class="mono">Du <b>darfst nicht</b> rauchen.</span> (= es ist verboten)</p>
        `,
        note:
          "Diese Verneinung ist eine echte Falle: <em>You mustn't</em> heißt <b>nicht dürfen</b>, nicht <em>nicht müssen</em>.",
      },
    ],
    tables: [
      {
        caption: "Die Modalverben im Präsens",
        lede: "ich und er/sie/es sind immer gleich und immer ohne Endung.",
        head: ["", "können", "müssen", "wollen", "möchten", "dürfen"],
        rows: [
          ["ich", "kann", "muss", "will", "möchte", "darf"],
          ["du", "kannst", "musst", "willst", "möchtest", "darfst"],
          ["er/sie/es", "kann", "muss", "will", "möchte", "darf"],
          ["wir", "können", "müssen", "wollen", "möchten", "dürfen"],
          ["ihr", "könnt", "müsst", "wollt", "möchtet", "dürft"],
          ["sie/Sie", "können", "müssen", "wollen", "möchten", "dürfen"],
        ],
      },
      {
        caption: "Was welches Modalverb bedeutet",
        lede: "Mit der Verneinung, weil die auf A1 am meisten Ärger macht.",
        head: ["Verb", "Bedeutung", "verneint heißt"],
        rows: [
          ["können", "Fähigkeit / Möglichkeit", "nicht können = geht nicht"],
          ["müssen", "Notwendigkeit", "nicht müssen = ist nicht nötig"],
          ["dürfen", "Erlaubnis", "nicht dürfen = ist verboten"],
          ["wollen", "starker Wille", "nicht wollen = will nicht"],
          ["möchten", "höflicher Wunsch", "nicht möchten = möchte lieber nicht"],
        ],
      },
    ],
    exercises: [
      {
        id: "modal-form",
        kind: "gap",
        title: "Übung A — Die richtige Form",
        lede: "Setze das Modalverb ein.",
        items: [
          { n: 1, prompt: "Ich ________ gut schwimmen. <em>(können)</em>", answers: ["kann"] },
          { n: 2, prompt: "Du ________ heute arbeiten. <em>(müssen)</em>", answers: ["musst"] },
          { n: 3, prompt: "Er ________ nach Wien fahren. <em>(wollen)</em>", answers: ["will"] },
          { n: 4, prompt: "Wir ________ hier nicht parken. <em>(dürfen)</em>", answers: ["dürfen"] },
          { n: 5, prompt: "Ihr ________ lauter sprechen. <em>(müssen)</em>", answers: ["müsst"] },
          { n: 6, prompt: "________ ich Ihnen helfen? <em>(können)</em>", answers: ["Kann", "kann"] },
          { n: 7, prompt: "Sie ________ einen Kaffee. <em>(möchten, sie = sg.)</em>", answers: ["möchte"] },
          { n: 8, prompt: "________ du mitkommen? <em>(wollen)</em>", answers: ["Willst", "willst"] },
        ],
      },
      {
        id: "modal-klammer",
        kind: "gap",
        title: "Übung B — Wo steht der Infinitiv?",
        lede: "Schreibe das fehlende Verb ans Satzende.",
        items: [
          { n: 1, prompt: "Ich muss morgen früh ________. <em>(aufstehen)</em>", answers: ["aufstehen"] },
          { n: 2, prompt: "Kannst du mir bitte ________? <em>(helfen)</em>", answers: ["helfen"] },
          { n: 3, prompt: "Wir wollen am Samstag ins Kino ________. <em>(gehen)</em>", answers: ["gehen"] },
          { n: 4, prompt: "Hier darf man nicht ________. <em>(rauchen)</em>", answers: ["rauchen"] },
          { n: 5, prompt: "Möchten Sie etwas ________? <em>(trinken)</em>", answers: ["trinken"] },
          { n: 6, prompt: "Ich kann heute leider nicht ________. <em>(kommen)</em>", answers: ["kommen"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wo steht das zweite Verb, wenn ein Modalverb im Satz ist?",
        reveal:
          "Als <b>Infinitiv ganz am Satzende</b>, ohne <em>zu</em>. Das Modalverb steht konjugiert auf Position 2, und alles andere steht dazwischen: <em>Ich <b>muss</b> morgen früh <b>aufstehen</b>.</em>",
      },
      {
        q: "Was ist der Unterschied zwischen <em>Du musst nicht kommen</em> und <em>Du darfst nicht kommen</em>?",
        reveal:
          "<b>musst nicht</b> = es ist nicht nötig, du kannst es dir aussuchen. <b>darfst nicht</b> = es ist verboten. Englischsprachige sagen hier oft das Gegenteil von dem, was sie meinen, weil <em>mustn't</em> ein Verbot ist.",
      },
      {
        q: "Welche zwei Personen sind bei Modalverben immer gleich?",
        reveal:
          "<b>ich</b> und <b>er/sie/es</b> — beide ohne Endung: <em>ich kann / er kann</em>, <em>ich muss / sie muss</em>, <em>ich darf / es darf</em>. Das gilt für alle Modalverben.",
      },
    ],
  },

  "a1-trennbare-verben": {
    intro:
      "Ein trennbares Verb ist ein Verb mit einem Vorsilbe-Anhängsel, das im einfachen Satz abfällt und ans Ende wandert: <em>aufstehen</em> → <em>Ich stehe um sieben Uhr <b>auf</b>.</em> Es fühlt sich zunächst absurd an, ist aber vollkommen regelmäßig — und die Vorsilbe trägt die Bedeutung, also lohnt es sich, sie ernst zu nehmen.",
    rules: [
      {
        title: "Regel 1 — Die Vorsilbe geht ans Satzende",
        body: `
          <p>Im Hauptsatz mit einfachem Präsens wird das Verb geteilt: der Stamm wird konjugiert und steht auf Position 2, die Vorsilbe steht ganz am Ende.</p>
          <p><span class="mono">aufstehen → Ich <b style="color:var(--accent)">stehe</b> jeden Tag um sieben <b style="color:var(--accent)">auf</b>.<br>
          einkaufen → Wir <b style="color:var(--accent)">kaufen</b> am Samstag <b style="color:var(--accent)">ein</b>.<br>
          anrufen → <b style="color:var(--accent)">Rufst</b> du mich heute Abend <b style="color:var(--accent)">an</b>?</span></p>
        `,
        note:
          "Es ist dieselbe Satzklammer wie beim Modalverb — nur ist der zweite Teil hier eine Vorsilbe statt eines Infinitivs.",
      },
      {
        title: "Regel 2 — Mit Modalverb bleibt das Verb zusammen",
        body: `
          <p>Sobald ein Modalverb im Satz steht, wird nicht mehr getrennt: das trennbare Verb steht als ganzer Infinitiv am Ende.</p>
          <p><span class="mono">Ich muss morgen früh <b style="color:var(--accent)">aufstehen</b>.</span> — nicht <em>stehen … auf</em><br>
          <span class="mono">Kannst du mich später <b style="color:var(--accent)">anrufen</b>?</span></p>
        `,
        note:
          "Merke: Es wird immer nur <b>ein</b> Verbteil konjugiert. Ist das Modalverb da, macht es die Arbeit, und das trennbare Verb bleibt heil.",
      },
      {
        title: "Regel 3 — Die Vorsilbe macht die Bedeutung",
        body: `
          <p>Dasselbe Grundverb bedeutet mit anderer Vorsilbe etwas ganz anderes — deshalb lernt man sie als eigene Vokabeln.</p>
          <p><span class="mono">kommen (to come) → <b>an</b>kommen (to arrive) · <b>mit</b>kommen (to come along) · <b>zurück</b>kommen (to come back)</span></p>
          <p>Betont wird immer die Vorsilbe: <span class="mono"><b>AUF</b>stehen, <b>EIN</b>kaufen, <b>AN</b>rufen</span>. Daran hörst du, dass ein Verb trennbar ist.</p>
        `,
        note:
          "Nicht trennbar sind Verben mit <b>be-, ver-, er-, ent-, emp-, ge-, miss-, zer-</b>: <em>be<u>su</u>chen, ver<u>ste</u>hen, er<u>zäh</u>len</em> — dort liegt die Betonung auf dem Stamm.",
      },
    ],
    tables: [
      {
        caption: "Die häufigsten trennbaren Verben auf A1",
        lede: "Immer mit einem Beispielsatz lernen, dann sitzt die Stellung mit.",
        head: ["Verb", "Bedeutung", "im Satz"],
        rows: [
          ["aufstehen", "to get up", "Ich stehe um 7 Uhr auf."],
          ["einkaufen", "to shop", "Wir kaufen am Samstag ein."],
          ["anrufen", "to phone", "Ich rufe dich später an."],
          ["ankommen", "to arrive", "Der Zug kommt um 9 an."],
          ["mitkommen", "to come along", "Kommst du mit?"],
          ["einladen", "to invite", "Ich lade dich ein."],
          ["fernsehen", "to watch TV", "Am Abend sehe ich fern."],
          ["anfangen", "to begin", "Der Kurs fängt um 8 an."],
          ["aufhören", "to stop", "Der Regen hört bald auf."],
          ["zumachen", "to close", "Mach bitte die Tür zu."],
        ],
      },
      {
        caption: "Trennbar oder nicht?",
        lede: "Die Betonung verrät es: liegt sie auf der Vorsilbe, wird getrennt.",
        head: ["Vorsilbe", "trennbar?", "Beispiel"],
        rows: [
          ["auf-, ein-, an-, mit-, aus-, zu-", "ja", "Ich stehe auf."],
          ["vor-, nach-, zurück-, weg-", "ja", "Ich komme zurück."],
          ["be-, ver-, er-", "nein", "Ich besuche dich."],
          ["ent-, emp-, ge-", "nein", "Ich verstehe das."],
          ["miss-, zer-", "nein", "Das missfällt mir."],
        ],
      },
    ],
    exercises: [
      {
        id: "trenn-satz",
        kind: "gap",
        title: "Übung A — Vorsilbe ans Ende",
        lede: "Schreibe nur die Vorsilbe in die Lücke.",
        items: [
          { n: 1, prompt: "Ich stehe jeden Tag um sechs ________. <em>(aufstehen)</em>", answers: ["auf"] },
          { n: 2, prompt: "Wir kaufen am Freitag ________. <em>(einkaufen)</em>", answers: ["ein"] },
          { n: 3, prompt: "Der Zug kommt um zehn Uhr ________. <em>(ankommen)</em>", answers: ["an"] },
          { n: 4, prompt: "Rufst du mich heute Abend ________? <em>(anrufen)</em>", answers: ["an"] },
          { n: 5, prompt: "Der Film fängt gleich ________. <em>(anfangen)</em>", answers: ["an"] },
          { n: 6, prompt: "Kommst du am Samstag ________? <em>(mitkommen)</em>", answers: ["mit"] },
        ],
      },
      {
        id: "trenn-modal",
        kind: "gap",
        title: "Übung B — Mit Modalverb",
        lede: "Hier bleibt das Verb zusammen. Schreibe den ganzen Infinitiv.",
        items: [
          { n: 1, prompt: "Ich muss morgen früh ________. <em>(aufstehen)</em>", answers: ["aufstehen"] },
          { n: 2, prompt: "Kannst du mich später ________? <em>(anrufen)</em>", answers: ["anrufen"] },
          { n: 3, prompt: "Wir wollen dich zum Essen ________. <em>(einladen)</em>", answers: ["einladen"] },
          { n: 4, prompt: "Möchtest du am Abend ________? <em>(fernsehen)</em>", answers: ["fernsehen"] },
          { n: 5, prompt: "Ich will heute nicht ________. <em>(einkaufen)</em>", answers: ["einkaufen"] },
          { n: 6, prompt: "Der Bus soll um acht ________. <em>(ankommen)</em>", answers: ["ankommen"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wann bleibt ein trennbares Verb zusammen?",
        reveal:
          "Sobald es <b>nicht das konjugierte Verb</b> ist — also nach einem Modalverb (<em>Ich muss <b>aufstehen</b></em>) und im Infinitiv. Getrennt wird nur, wenn es selbst die Person trägt: <em>Ich <b>stehe</b> … <b>auf</b>.</em>",
      },
      {
        q: "Woran hörst du, ob ein Verb trennbar ist?",
        reveal:
          "An der <b>Betonung</b>. Trennbar: die Vorsilbe ist betont — <span class='mono'><b>AUF</b>stehen, <b>AN</b>rufen, <b>EIN</b>kaufen</span>. Nicht trennbar: der Stamm ist betont — <span class='mono'>be<b>SU</b>chen, ver<b>STE</b>hen, er<b>ZÄH</b>len</span>.",
      },
      {
        q: "Nenne drei Vorsilben, die nie getrennt werden.",
        reveal:
          "<b>be-</b>, <b>ver-</b>, <b>er-</b> — dazu <b>ent-</b>, <b>emp-</b>, <b>ge-</b>, <b>miss-</b> und <b>zer-</b>. Diese acht bleiben immer am Verb kleben und bekommen im Perfekt auch kein <em>ge-</em>.",
      },
    ],
  },

  "a1-imperativ": {
    intro:
      "Der Imperativ ist die Form für Bitten, Anweisungen und Ratschläge. Auf A1 brauchst du vor allem die <b>Sie-Form</b> — im Geschäft, beim Arzt, in der Prüfung —, dazu die <em>du</em>-Form für Freunde. Beide sind schnell gelernt, und ein <em>bitte</em> macht aus jedem Befehl eine Bitte.",
    rules: [
      {
        title: "Regel 1 — Die Sie-Form ist die einfachste",
        body: `
          <p>Du nimmst schlicht die normale Sie-Form und drehst Verb und Pronomen um. Das <em>Sie</em> bleibt stehen.</p>
          <p><span class="mono">Sie kommen → <b style="color:var(--accent)">Kommen Sie</b> bitte herein!<br>
          Sie warten → <b style="color:var(--accent)">Warten Sie</b> einen Moment!<br>
          Sie sind → <b style="color:var(--accent)">Seien Sie</b> vorsichtig!</span></p>
        `,
        note:
          "Nur <b>sein</b> ist unregelmäßig: <em>Seien Sie …</em>, nicht <em>Sind Sie …</em> — das wäre eine Frage.",
      },
      {
        title: "Regel 2 — Die du-Form: Verbstamm, sonst nichts",
        body: `
          <p>Nimm die <em>du</em>-Form, streiche <span class="mono">-st</span> und das Pronomen weg. Was übrig bleibt, ist der Imperativ.</p>
          <p><span class="mono">du kommst → <b style="color:var(--accent)">Komm!</b> · du wartest → <b style="color:var(--accent)">Warte!</b> · du gibst → <b style="color:var(--accent)">Gib!</b></span></p>
          <p>Verben mit <b>e → i</b> behalten den Wechsel: <em>du sprichst → <b>Sprich!</b></em> Verben mit <b>a → ä</b> verlieren ihn: <em>du fährst → <b>Fahr!</b></em></p>
        `,
        note:
          "Ein <span class='mono'>-e</span> am Ende (<em>Komme!</em>) ist heute veraltet — außer wenn der Stamm auf -t oder -d endet: <em>Warte! Rede!</em>",
      },
      {
        title: "Regel 3 — Höflich wird es durch bitte",
        body: `
          <p>Der Imperativ allein klingt auf Deutsch schärfer, als Lernende erwarten. Mit <b>bitte</b> — oder mit <em>Könnten Sie …?</em> — wird daraus eine normale Bitte.</p>
          <p><span class="mono">Machen Sie die Tür zu.</span> — knapp, fast ein Befehl<br>
          <span class="mono">Machen Sie <b style="color:var(--accent)">bitte</b> die Tür zu.</span> — normal und höflich</p>
          <p>Bei trennbaren Verben geht die Vorsilbe auch hier ans Ende: <span class="mono"><b>Rufen Sie</b> mich morgen <b>an</b>!</span></p>
        `,
        note:
          "Die <b>ihr</b>-Form ist identisch mit der normalen ihr-Form ohne Pronomen: <em>ihr kommt → <b>Kommt!</b></em>",
      },
    ],
    tables: [
      {
        caption: "Die drei Imperativformen",
        lede: "Sie-Form zuerst — die brauchst du auf A1 am häufigsten.",
        head: ["Infinitiv", "Sie", "du", "ihr"],
        rows: [
          ["kommen", "Kommen Sie!", "Komm!", "Kommt!"],
          ["warten", "Warten Sie!", "Warte!", "Wartet!"],
          ["geben", "Geben Sie!", "Gib!", "Gebt!"],
          ["sprechen", "Sprechen Sie!", "Sprich!", "Sprecht!"],
          ["fahren", "Fahren Sie!", "Fahr!", "Fahrt!"],
          ["nehmen", "Nehmen Sie!", "Nimm!", "Nehmt!"],
          ["sein", "Seien Sie!", "Sei!", "Seid!"],
          ["haben", "Haben Sie!", "Hab!", "Habt!"],
        ],
      },
      {
        caption: "Sätze, die du wirklich brauchst",
        lede: "Fertige Wendungen für Prüfung und Alltag.",
        head: ["Situation", "Satz"],
        rows: [
          ["jemanden hereinbitten", "Kommen Sie bitte herein!"],
          ["um einen Moment bitten", "Warten Sie bitte einen Moment!"],
          ["um Wiederholung bitten", "Sagen Sie das bitte noch einmal!"],
          ["um langsameres Sprechen bitten", "Sprechen Sie bitte langsamer!"],
          ["um Hilfe bitten", "Helfen Sie mir bitte!"],
          ["etwas anbieten", "Nehmen Sie doch Platz!"],
          ["einen Rat geben", "Fahren Sie mit der U-Bahn, das ist schneller."],
        ],
      },
    ],
    exercises: [
      {
        id: "imp-sie",
        kind: "gap",
        title: "Übung A — Die Sie-Form",
        lede: "Schreibe nur das Verb.",
        items: [
          { n: 1, prompt: "________ Sie bitte herein! <em>(kommen)</em>", answers: ["Kommen", "kommen"] },
          { n: 2, prompt: "________ Sie bitte langsamer! <em>(sprechen)</em>", answers: ["Sprechen", "sprechen"] },
          { n: 3, prompt: "________ Sie bitte einen Moment! <em>(warten)</em>", answers: ["Warten", "warten"] },
          { n: 4, prompt: "________ Sie vorsichtig! <em>(sein)</em>", answers: ["Seien", "seien"] },
          { n: 5, prompt: "________ Sie mir bitte! <em>(helfen)</em>", answers: ["Helfen", "helfen"] },
          { n: 6, prompt: "________ Sie mich morgen an! <em>(anrufen)</em>", answers: ["Rufen", "rufen"] },
        ],
      },
      {
        id: "imp-du",
        kind: "gap",
        title: "Übung B — Die du-Form",
        lede: "Achte auf den Stammwechsel.",
        items: [
          { n: 1, prompt: "________ mir bitte das Salz! <em>(geben)</em>", answers: ["Gib", "gib"] },
          { n: 2, prompt: "________ nicht so schnell! <em>(fahren)</em>", answers: ["Fahr", "fahr", "Fahre", "fahre"] },
          { n: 3, prompt: "________ bitte lauter! <em>(sprechen)</em>", answers: ["Sprich", "sprich"] },
          { n: 4, prompt: "________ einen Moment! <em>(warten)</em>", answers: ["Warte", "warte"] },
          { n: 5, prompt: "________ bitte pünktlich! <em>(sein)</em>", answers: ["Sei", "sei"] },
          { n: 6, prompt: "________ den Bus, nicht das Taxi! <em>(nehmen)</em>", answers: ["Nimm", "nimm"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wie bildest du den Imperativ in der Sie-Form?",
        reveal:
          "Normale Sie-Form, Verb und Pronomen getauscht — <em>Sie kommen</em> → <b>Kommen Sie!</b> Das <em>Sie</em> bleibt stehen. Einzige Ausnahme ist <b>sein</b>: <em>Seien Sie …</em>",
      },
      {
        q: "Warum heißt es <em>Sprich!</em>, aber <em>Fahr!</em>?",
        reveal:
          "Der Wechsel <b>e → i</b> bleibt im Imperativ erhalten (<em>du sprichst → Sprich!</em>), der Umlaut <b>a → ä</b> fällt weg (<em>du fährst → Fahr!</em>). Das ist der einzige Unterschied, den man sich merken muss.",
      },
      {
        q: "Wo steht die Vorsilbe eines trennbaren Verbs im Imperativ?",
        reveal:
          "Am Ende, wie immer: <em><b>Rufen Sie</b> mich morgen <b>an</b>!</em> · <em><b>Steh</b> bitte <b>auf</b>!</em> Die Satzklammer gilt im Imperativ genauso wie im Aussagesatz.",
      },
    ],
  },

  "a1-praepositionen": {
    intro:
      "Präpositionen sind auf A1 die Wörter, die am wenigsten wie im Englischen funktionieren. Statt Regeln lernst du am besten feste Wendungen — <em>in die Schule, zum Arzt, nach Hause, bei der Arbeit</em> — und dazu die eine Unterscheidung, die wirklich trägt: <b>wo?</b> gegen <b>wohin?</b>",
    rules: [
      {
        title: "Regel 1 — wo? und wohin? sind verschiedene Fragen",
        body: `
          <p>Deutsch trennt streng zwischen dem Ort, an dem etwas ist, und dem Ziel, zu dem etwas geht. Englisch macht das oft nicht.</p>
          <p><span class="mono"><b>Wo</b> bist du? — Ich bin <b style="color:var(--accent)">in der</b> Schule. <span style="color:var(--ink-soft)">(Ort)</span><br>
          <b>Wohin</b> gehst du? — Ich gehe <b style="color:var(--accent)">in die</b> Schule. <span style="color:var(--ink-soft)">(Ziel)</span></span></p>
          <p>Auf A1 reicht es, die häufigen Paare als Wendung zu lernen; die volle Regel kommt auf A2 mit den Wechselpräpositionen.</p>
        `,
        note:
          "Kleine Faustregel für den Anfang: <em>in <b>der</b></em> = ich bin dort · <em>in <b>die</b></em> = ich gehe dorthin.",
      },
      {
        title: "Regel 2 — nach, zu und in für Ziele",
        body: `
          <p>Drei Wörter für „to“, und sie sind nicht austauschbar:</p>
          <p><b>nach</b> + Städte und die meisten Länder ohne Artikel: <span class="mono">nach Wien, nach Österreich, nach Hause</span></p>
          <p><b>zu</b> + Personen und Einrichtungen: <span class="mono">zum Arzt, zur Bank, zu meiner Schwester</span></p>
          <p><b>in</b> + wenn du <em>hineingehst</em> oder das Land einen Artikel hat: <span class="mono">in die Schule, in die Schweiz, in die Türkei</span></p>
        `,
        note:
          "<em>nach Hause</em> (Ziel) und <em>zu Hause</em> (Ort) sind ein Paar, das man einfach auswendig lernt.",
      },
      {
        title: "Regel 3 — Verschmelzungen sind der Normalfall",
        body: `
          <p>Präposition und Artikel wachsen im Alltag zusammen. Die getrennte Form klingt fast immer falsch.</p>
          <p><span class="mono">zu dem → <b style="color:var(--accent)">zum</b> · zu der → <b style="color:var(--accent)">zur</b> · in dem → <b style="color:var(--accent)">im</b> · in das → <b style="color:var(--accent)">ins</b> · bei dem → <b style="color:var(--accent)">beim</b> · an dem → <b style="color:var(--accent)">am</b></span></p>
          <p><span class="mono">Ich gehe <b>zum</b> Arzt. Ich bin <b>im</b> Büro. Wir gehen <b>ins</b> Kino. Er ist <b>beim</b> Essen.</span></p>
        `,
        note:
          "Zeitangaben nutzen dieselben Formen: <em><b>am</b> Montag, <b>im</b> Januar, <b>um</b> acht Uhr</em> — drei Präpositionen, drei Zeiteinheiten.",
      },
    ],
    tables: [
      {
        caption: "Die wichtigsten Verschmelzungen",
        lede: "Im gesprochenen Deutsch praktisch immer verschmolzen.",
        head: ["getrennt", "verschmolzen", "Beispiel"],
        rows: [
          ["zu dem", "zum", "Ich gehe zum Arzt."],
          ["zu der", "zur", "Sie geht zur Bank."],
          ["in dem", "im", "Ich bin im Büro."],
          ["in das", "ins", "Wir gehen ins Kino."],
          ["an dem", "am", "Am Montag habe ich frei."],
          ["an das", "ans", "Wir fahren ans Meer."],
          ["bei dem", "beim", "Er ist beim Essen."],
          ["von dem", "vom", "Ich komme vom Arzt."],
        ],
      },
      {
        caption: "Zeit: an, in, um",
        lede: "Drei Präpositionen, klar aufgeteilt.",
        head: ["Präposition", "wofür", "Beispiel"],
        rows: [
          ["um", "Uhrzeit", "um acht Uhr"],
          ["am", "Tag, Tageszeit", "am Montag, am Abend"],
          ["im", "Monat, Jahreszeit", "im Januar, im Sommer"],
          ["von … bis", "Zeitraum", "von acht bis fünf"],
          ["seit", "Beginn in der Vergangenheit", "seit zwei Jahren"],
          ["(kein Wort)", "Jahreszahl", "2026 fahre ich nach Wien."],
        ],
      },
      {
        caption: "Ziel: nach, zu, in",
        lede: "Der häufigste A1-Fehler: nach statt zu.",
        head: ["Präposition", "wofür", "Beispiel"],
        rows: [
          ["nach", "Städte, Länder ohne Artikel", "nach Wien, nach Italien"],
          ["nach", "feste Wendung", "nach Hause"],
          ["zu", "Personen", "zu meiner Schwester"],
          ["zu", "Einrichtungen", "zum Arzt, zur Post"],
          ["in", "Länder mit Artikel", "in die Schweiz, in die Türkei"],
          ["in", "hineingehen", "ins Kino, in die Schule"],
        ],
      },
    ],
    exercises: [
      {
        id: "praep-ziel",
        kind: "gap",
        title: "Übung A — nach, zu oder in?",
        lede: "Setze die richtige Präposition ein (verschmolzen, wenn möglich).",
        items: [
          { n: 1, prompt: "Ich fahre morgen ________ Wien.", answers: ["nach"] },
          { n: 2, prompt: "Er geht ________ Arzt.", answers: ["zum"] },
          { n: 3, prompt: "Wir gehen heute Abend ________ Kino.", answers: ["ins"] },
          { n: 4, prompt: "Sie fährt ________ Schweiz.", answers: ["in die"] },
          { n: 5, prompt: "Ich gehe jetzt ________ Hause.", answers: ["nach"] },
          { n: 6, prompt: "Kommst du mit ________ Post?", answers: ["zur"] },
        ],
      },
      {
        id: "praep-zeit",
        kind: "gap",
        title: "Übung B — Zeitangaben",
        lede: "um, am oder im?",
        items: [
          { n: 1, prompt: "Der Kurs beginnt ________ neun Uhr.", answers: ["um"] },
          { n: 2, prompt: "________ Montag habe ich frei.", answers: ["Am", "am"] },
          { n: 3, prompt: "________ Sommer fahren wir ans Meer.", answers: ["Im", "im"] },
          { n: 4, prompt: "Ich arbeite ________ acht ________ fünf. <em>(zwei Wörter, mit Leerzeichen)</em>", answers: ["von bis", "von … bis"] },
          { n: 5, prompt: "________ Abend sehe ich fern.", answers: ["Am", "am"] },
          { n: 6, prompt: "Ich wohne ________ zwei Jahren in Graz.", answers: ["seit"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Wann sagst du <em>nach</em> und wann <em>zu</em>?",
        reveal:
          "<b>nach</b> bei Städten und Ländern ohne Artikel (<em>nach Wien, nach Italien</em>) und in <em>nach Hause</em>. <b>zu</b> bei Personen und Einrichtungen (<em>zum Arzt, zur Bank, zu meiner Schwester</em>). <em>Ich gehe nach dem Arzt</em> ist der klassische Fehler.",
      },
      {
        q: "Was ist der Unterschied zwischen <em>in der Schule</em> und <em>in die Schule</em>?",
        reveal:
          "<b>in der Schule</b> antwortet auf <em>wo?</em> — du bist dort. <b>in die Schule</b> antwortet auf <em>wohin?</em> — du gehst dorthin. Auf A2 lernst du das als Regel (Dativ vs. Akkusativ); auf A1 reicht das Gefühl für das Paar.",
      },
      {
        q: "Welche Präposition nimmst du für Uhrzeit, Tag und Monat?",
        reveal:
          "<b>um</b> für die Uhrzeit (<em>um acht Uhr</em>), <b>am</b> für Tag und Tageszeit (<em>am Montag, am Abend</em>), <b>im</b> für Monat und Jahreszeit (<em>im Januar, im Sommer</em>). Bei einer Jahreszahl steht gar keine Präposition.",
      },
    ],
  },

  "a1-perfekt": {
    intro:
      "Das Perfekt ist die Vergangenheit, die man auf Deutsch spricht. Wenn du erzählst, was du gestern gemacht hast, nimmst du fast immer das Perfekt — das Präteritum bleibt Büchern vorbehalten, mit Ausnahme von <em>war</em> und <em>hatte</em>. Zwei Teile: ein Hilfsverb an Position 2 und ein Partizip am Satzende.",
    rules: [
      {
        title: "Regel 1 — haben oder sein + Partizip II",
        body: `
          <p>Wieder die Satzklammer: das Hilfsverb wird konjugiert und steht auf Position 2, das Partizip steht ganz am Ende.</p>
          <p><span class="mono">Ich <b style="color:var(--accent)">habe</b> gestern Fußball <b style="color:var(--accent)">gespielt</b>.<br>
          Wir <b style="color:var(--accent)">sind</b> am Samstag nach Wien <b style="color:var(--accent)">gefahren</b>.</span></p>
          <p>Die meisten Verben nehmen <b>haben</b>. <b>sein</b> nehmen nur Verben der <em>Bewegung von A nach B</em> (<em>gehen, fahren, kommen, fliegen</em>) und der <em>Zustandsänderung</em> (<em>aufstehen, einschlafen, werden</em>) — dazu <em>sein</em> und <em>bleiben</em> selbst.</p>
        `,
        note:
          "Im Zweifel <b>haben</b>: es ist die große Mehrheit. Die sein-Verben sind eine überschaubare Liste, die man auswendig lernt.",
      },
      {
        title: "Regel 2 — Das Partizip: ge- … -t oder ge- … -en",
        body: `
          <p><b>Regelmäßig</b> (schwach): <span class="mono">ge- + Stamm + -t</span> — <em>spielen → <b>ge</b>spiel<b>t</b></em>, <em>machen → <b>ge</b>mach<b>t</b></em>, <em>kaufen → <b>ge</b>kauf<b>t</b></em></p>
          <p><b>Unregelmäßig</b> (stark): <span class="mono">ge- + oft anderer Vokal + -en</span> — <em>fahren → <b>ge</b>fahr<b>en</b></em>, <em>trinken → <b>ge</b>tr<b>u</b>nk<b>en</b></em>, <em>sprechen → <b>ge</b>spr<b>o</b>ch<b>en</b></em></p>
          <p>Bei trennbaren Verben rutscht das <b>ge-</b> zwischen Vorsilbe und Stamm: <em>aufstehen → auf<b>ge</b>standen</em>, <em>einkaufen → ein<b>ge</b>kauft</em>.</p>
        `,
        note:
          "Kein <b>ge-</b> bekommen Verben auf <span class='mono'>-ieren</span> (<em>studieren → studiert</em>) und die nicht trennbaren Vorsilben (<em>besuchen → besucht, verstehen → verstanden</em>).",
      },
      {
        title: "Regel 3 — war und hatte statt Perfekt",
        body: `
          <p>Bei <b>sein</b> und <b>haben</b> — und bei den Modalverben — sagt man im gesprochenen Deutsch das Präteritum, nicht das Perfekt.</p>
          <p><span class="mono">Ich <b style="color:var(--accent)">war</b> gestern zu Hause.</span> — nicht <em>Ich bin gewesen</em><br>
          <span class="mono">Ich <b style="color:var(--accent)">hatte</b> keine Zeit.</span> — nicht <em>Ich habe gehabt</em></p>
        `,
        note:
          "Das sind die einzigen Präteritumformen, die du auf A1 wirklich brauchst — und du brauchst sie ständig.",
      },
    ],
    tables: [
      {
        caption: "war und hatte",
        lede: "Die zwei Präteritumformen, die auf A1 Pflicht sind.",
        head: ["", "sein → war", "haben → hatte"],
        rows: [
          ["ich", "war", "hatte"],
          ["du", "warst", "hattest"],
          ["er/sie/es", "war", "hatte"],
          ["wir", "waren", "hatten"],
          ["ihr", "wart", "hattet"],
          ["sie/Sie", "waren", "hatten"],
        ],
      },
      {
        caption: "Die häufigsten Partizipien auf A1",
        lede: "Mit dem Hilfsverb lernen — es gehört zur Vokabel.",
        head: ["Infinitiv", "Hilfsverb", "Partizip II", "Beispiel"],
        rows: [
          ["machen", "haben", "gemacht", "Was hast du gemacht?"],
          ["kaufen", "haben", "gekauft", "Ich habe Brot gekauft."],
          ["arbeiten", "haben", "gearbeitet", "Er hat viel gearbeitet."],
          ["essen", "haben", "gegessen", "Wir haben Pizza gegessen."],
          ["trinken", "haben", "getrunken", "Ich habe Kaffee getrunken."],
          ["sprechen", "haben", "gesprochen", "Wir haben lange gesprochen."],
          ["lesen", "haben", "gelesen", "Ich habe ein Buch gelesen."],
          ["sehen", "haben", "gesehen", "Hast du den Film gesehen?"],
          ["gehen", "sein", "gegangen", "Ich bin nach Hause gegangen."],
          ["fahren", "sein", "gefahren", "Wir sind nach Wien gefahren."],
          ["kommen", "sein", "gekommen", "Er ist spät gekommen."],
          ["fliegen", "sein", "geflogen", "Sie ist nach Rom geflogen."],
          ["bleiben", "sein", "geblieben", "Ich bin zu Hause geblieben."],
          ["aufstehen", "sein", "aufgestanden", "Ich bin um 7 aufgestanden."],
          ["studieren", "haben", "studiert", "Sie hat in Graz studiert."],
          ["besuchen", "haben", "besucht", "Wir haben Oma besucht."],
        ],
      },
      {
        caption: "Wann kein ge-?",
        lede: "Zwei Gruppen, beide ausnahmslos.",
        head: ["Gruppe", "Beispiel", "Partizip"],
        rows: [
          ["Verben auf -ieren", "studieren, telefonieren", "studiert, telefoniert"],
          ["untrennbar: be-, ver-, er-", "besuchen, verstehen, erzählen", "besucht, verstanden, erzählt"],
          ["untrennbar: ent-, emp-, ge-", "entschuldigen, empfehlen", "entschuldigt, empfohlen"],
        ],
      },
    ],
    exercises: [
      {
        id: "perf-hilfs",
        kind: "gap",
        title: "Übung A — haben oder sein?",
        lede: "Setze das Hilfsverb in der richtigen Form ein.",
        items: [
          { n: 1, prompt: "Ich ________ gestern Fußball gespielt.", answers: ["habe"] },
          { n: 2, prompt: "Wir ________ nach Wien gefahren.", answers: ["sind"] },
          { n: 3, prompt: "Er ________ einen Kaffee getrunken.", answers: ["hat"] },
          { n: 4, prompt: "________ du gut geschlafen?", answers: ["Hast", "hast"] },
          { n: 5, prompt: "Sie ________ um sechs aufgestanden.", answers: ["ist"] },
          { n: 6, prompt: "Ihr ________ zu Hause geblieben.", answers: ["seid"] },
          { n: 7, prompt: "Ich ________ meine Oma besucht.", answers: ["habe"] },
          { n: 8, prompt: "Der Zug ________ pünktlich angekommen.", answers: ["ist"] },
        ],
      },
      {
        id: "perf-partizip",
        kind: "gap",
        title: "Übung B — Das Partizip",
        lede: "Schreibe nur das Partizip II.",
        items: [
          { n: 1, prompt: "Ich habe ein Buch ________. <em>(lesen)</em>", answers: ["gelesen"] },
          { n: 2, prompt: "Wir haben Pizza ________. <em>(essen)</em>", answers: ["gegessen"] },
          { n: 3, prompt: "Sie ist nach Rom ________. <em>(fliegen)</em>", answers: ["geflogen"] },
          { n: 4, prompt: "Er hat in Graz ________. <em>(studieren)</em>", answers: ["studiert"] },
          { n: 5, prompt: "Ich bin um sieben ________. <em>(aufstehen)</em>", answers: ["aufgestanden"] },
          { n: 6, prompt: "Hast du das ________? <em>(verstehen)</em>", answers: ["verstanden"] },
          { n: 7, prompt: "Wir haben am Samstag ________. <em>(einkaufen)</em>", answers: ["eingekauft"] },
          { n: 8, prompt: "Was hast du gestern ________? <em>(machen)</em>", answers: ["gemacht"] },
        ],
      },
      {
        id: "perf-warhatte",
        kind: "gap",
        title: "Übung C — war und hatte",
        lede: "Hier kein Perfekt, sondern Präteritum.",
        items: [
          { n: 1, prompt: "Ich ________ gestern zu Hause. <em>(sein)</em>", answers: ["war"] },
          { n: 2, prompt: "Wir ________ keine Zeit. <em>(haben)</em>", answers: ["hatten"] },
          { n: 3, prompt: "________ du gestern krank? <em>(sein)</em>", answers: ["Warst", "warst"] },
          { n: 4, prompt: "Er ________ einen Termin beim Arzt. <em>(haben)</em>", answers: ["hatte"] },
          { n: 5, prompt: "Das ________ ein schöner Tag. <em>(sein)</em>", answers: ["war"] },
          { n: 6, prompt: "Ihr ________ letzte Woche in Wien. <em>(sein)</em>", answers: ["wart"] },
        ],
      },
    ],
    selfcheck: [
      {
        q: "Welche Verben bilden das Perfekt mit <em>sein</em>?",
        reveal:
          "Verben der <b>Bewegung von A nach B</b> (<em>gehen, fahren, kommen, fliegen, laufen</em>), der <b>Zustandsänderung</b> (<em>aufstehen, einschlafen, aufwachen, werden</em>) sowie <b>sein</b> und <b>bleiben</b> selbst. Alles andere nimmt <em>haben</em>.",
      },
      {
        q: "Welche zwei Gruppen von Verben bekommen kein <em>ge-</em> im Partizip?",
        reveal:
          "Verben auf <b>-ieren</b> (<em>studieren → studiert, telefonieren → telefoniert</em>) und Verben mit <b>untrennbarer Vorsilbe</b> — be-, ver-, er-, ent-, emp-, ge-, miss-, zer- (<em>besuchen → besucht, verstehen → verstanden</em>).",
      },
      {
        q: "Wie sagst du auf Deutsch „I was at home yesterday“?",
        reveal:
          "<b>Ich war gestern zu Hause.</b> Bei <em>sein</em> und <em>haben</em> nimmt man im Gespräch das Präteritum (<em>war, hatte</em>), nicht das Perfekt. <em>Ich bin zu Hause gewesen</em> ist zwar grammatisch möglich, klingt aber ungewöhnlich.",
      },
    ],
  },
};
