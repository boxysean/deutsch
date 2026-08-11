// Grammar topics, part two.

const WECHSEL = {
  intro:
    "Neun Präpositionen können sowohl Akkusativ als auch Dativ nehmen — deshalb Wechselpräpositionen. Die Wahl hängt nicht vom Verb ab, sondern von der Frage: Bewegung an einen neuen Ort (wohin?) oder Position an einem Ort (wo?).",
  rules: [
    {
      title: "Regel 1 — wohin? = Akkusativ · wo? = Dativ",
      body: `
        <p><b style="color:var(--accent)">Wohin?</b> — Bewegung zu einem Ziel → <b>Akkusativ</b><br>
           <span class="mono">Ich stelle die Flasche auf <b>den</b> Tisch.</span></p>
        <p><b style="color:var(--accent)">Wo?</b> — Position, keine Ortsveränderung → <b>Dativ</b><br>
           <span class="mono">Die Flasche steht auf <b>dem</b> Tisch.</span></p>
        <p>Merke: Akkusativ ist der „Bewegungs-Kasus“, Dativ der „Ruhe-Kasus“.</p>
      `,
      note:
        "Achtung: Bewegung <em>innerhalb</em> eines Ortes ist trotzdem Dativ. <em>Ich laufe <b>im</b> Park</em> (ich bin schon dort) vs. <em>Ich laufe <b>in den</b> Park</em> (ich gehe hinein).",
    },
    {
      title: "Regel 2 — Die Verbpaare",
      body: `
        <p>Deutsch unterscheidet, ob man etwas hinstellt oder ob es schon steht. Die Bewegungsverben sind regelmäßig, die Positionsverben unregelmäßig:</p>
        <p><b>stellen</b> (Akk.) → <b>stehen</b> (Dat.) · <b>legen</b> (Akk.) → <b>liegen</b> (Dat.) · <b>setzen</b> (Akk.) → <b>sitzen</b> (Dat.) · <b>hängen</b> (Akk.) → <b>hängen</b> (Dat.)</p>
        <p><span class="mono">Ich lege das Buch auf <b>den</b> Tisch.</span> → <span class="mono">Das Buch liegt auf <b>dem</b> Tisch.</span></p>
      `,
    },
    {
      title: "Regel 3 — Verschmelzungen",
      body: `
        <p>Sehr häufig und im Alltag fast Pflicht:</p>
        <p>in + das → <b>ins</b> · in + dem → <b>im</b> · an + das → <b>ans</b> · an + dem → <b>am</b> · auf + das → <b>aufs</b></p>
        <p><span class="mono">Ich gehe <b>ins</b> Kino.</span> <span style="color:var(--ink-soft)">(wohin?)</span> · <span class="mono">Ich bin <b>im</b> Kino.</span> <span style="color:var(--ink-soft)">(wo?)</span></p>
      `,
    },
  ],
  tables: [
    {
      caption: "Die neun Wechselpräpositionen",
      head: ["Präposition", "wohin? (Akkusativ)", "wo? (Dativ)"],
      rows: [
        ["in", "Ich gehe in <b>die</b> Schule.", "Ich bin in <b>der</b> Schule."],
        ["an", "Ich hänge das Bild an <b>die</b> Wand.", "Das Bild hängt an <b>der</b> Wand."],
        ["auf", "Ich lege es auf <b>den</b> Tisch.", "Es liegt auf <b>dem</b> Tisch."],
        ["über", "Ich hänge die Lampe über <b>den</b> Tisch.", "Die Lampe hängt über <b>dem</b> Tisch."],
        ["unter", "Die Katze läuft unter <b>das</b> Bett.", "Die Katze schläft unter <b>dem</b> Bett."],
        ["vor", "Ich stelle das Auto vor <b>das</b> Haus.", "Das Auto steht vor <b>dem</b> Haus."],
        ["hinter", "Ich gehe hinter <b>das</b> Haus.", "Der Garten ist hinter <b>dem</b> Haus."],
        ["neben", "Setz dich neben <b>mich</b>!", "Er sitzt neben <b>mir</b>."],
        ["zwischen", "Ich stelle es zwischen <b>die</b> Bücher.", "Es steht zwischen <b>den</b> Büchern."],
      ],
    },
  ],
  exercises: [
    {
      id: "kasus",
      kind: "gap",
      title: "Übung A — Akkusativ oder Dativ?",
      lede: "Frage dich zuerst: wohin oder wo?",
      items: [
        { n: 1, prompt: "Die Lampe hängt über ________ Tisch. <em>(der Tisch)</em>", answers: ["dem"] },
        { n: 2, prompt: "Ich stelle die Flasche auf ________ Tisch. <em>(der Tisch)</em>", answers: ["den"] },
        { n: 3, prompt: "Wir gehen in ________ Kino. <em>(das Kino)</em>", answers: ["das"], why: "wohin? → Akkusativ (umgangssprachlich: ins Kino)" },
        { n: 4, prompt: "Wir sind in ________ Kino. <em>(das Kino)</em>", answers: ["dem"], why: "wo? → Dativ (im Kino)" },
        { n: 5, prompt: "Das Auto steht vor ________ Haus. <em>(das Haus)</em>", answers: ["dem"] },
        { n: 6, prompt: "Die Katze läuft unter ________ Bett. <em>(das Bett)</em>", answers: ["das"] },
        { n: 7, prompt: "Ich hänge das Bild an ________ Wand. <em>(die Wand)</em>", answers: ["die"] },
        { n: 8, prompt: "Das Bild hängt an ________ Wand. <em>(die Wand)</em>", answers: ["der"] },
        { n: 9, prompt: "Er sitzt neben ________ Freundin. <em>(seine Freundin)</em>", answers: ["seiner"] },
        { n: 10, prompt: "Ich setze mich zwischen ________ Kinder. <em>(die Kinder)</em>", answers: ["die"] },
      ],
    },
    {
      id: "verben",
      kind: "gap",
      title: "Übung B — stellen/stehen, legen/liegen, setzen/sitzen",
      lede: "Nur das Verb in der richtigen Form.",
      items: [
        { n: 1, prompt: "Ich ________ das Buch auf den Tisch. <em>(legen/liegen)</em>", answers: ["lege"] },
        { n: 2, prompt: "Das Buch ________ auf dem Tisch. <em>(legen/liegen)</em>", answers: ["liegt"] },
        { n: 3, prompt: "Ich ________ die Vase auf das Fenster. <em>(stellen/stehen)</em>", answers: ["stelle"] },
        { n: 4, prompt: "Die Vase ________ auf dem Fenster. <em>(stellen/stehen)</em>", answers: ["steht"] },
        { n: 5, prompt: "Bitte ________ Sie sich auf den Stuhl! <em>(setzen/sitzen)</em>", answers: ["setzen"] },
        { n: 6, prompt: "Er ________ auf dem Stuhl. <em>(setzen/sitzen)</em>", answers: ["sitzt"] },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Welche Frage entscheidet über den Kasus — und wie lautet die Antwort?",
      reveal:
        "<b>Wohin?</b> (Bewegung zu einem Ziel) → <b>Akkusativ</b>. <b>Wo?</b> (Position) → <b>Dativ</b>. Nicht das Verb allein entscheidet, sondern ob eine Ortsveränderung stattfindet.",
    },
    {
      q: "Warum heißt es <em>Ich laufe im Park</em> und nicht <em>in den Park</em>?",
      reveal:
        "Weil die Bewegung <b>innerhalb</b> des Parks stattfindet — ich bin schon dort, der Ort ändert sich nicht. Deshalb Dativ. <em>Ich laufe <b>in den</b> Park</em> hieße: ich betrete ihn von außen.",
    },
    {
      q: "Nenne die drei Verbpaare Bewegung/Position.",
      reveal:
        "<b>stellen</b> (Akk.) / <b>stehen</b> (Dat.) · <b>legen</b> / <b>liegen</b> · <b>setzen</b> / <b>sitzen</b>. Die Akkusativ-Verben sind regelmäßig, die Dativ-Verben unregelmäßig.",
    },
  ],
};

const NEBEN = {
  intro:
    "Im Nebensatz rutscht das konjugierte Verb ans Ende. Das ist die auffälligste Struktur des Deutschen und im Schreiben-Teil der Prüfung ein sicherer Punktebringer — mit „weil“ begründest du, mit „dass“ berichtest du.",
  rules: [
    {
      title: "Regel 1 — Verb ans Ende",
      body: `
        <p>Der Nebensatz beginnt mit einer Konjunktion, und das konjugierte Verb steht <b>ganz am Schluss</b>:</p>
        <p><span class="mono">Ich komme nicht, <b style="color:var(--accent)">weil</b> ich krank <b style="color:var(--accent)">bin</b>.</span><br>
           <span class="mono">Er sagt, <b style="color:var(--accent)">dass</b> er müde <b style="color:var(--accent)">ist</b>.</span></p>
        <p>Vor dem Nebensatz steht immer ein <b>Komma</b>.</p>
      `,
      note:
        "Bei zwei Verben steht das konjugierte ganz hinten, hinter dem Infinitiv oder Partizip: <em>…, weil ich arbeiten <b>muss</b>.</em> · <em>…, weil ich gearbeitet <b>habe</b>.</em>",
    },
    {
      title: "Regel 2 — Trennbare Verben bleiben zusammen",
      body: `
        <p>Im Hauptsatz trennt sich das Präfix, im Nebensatz nicht:</p>
        <p><span class="mono">Ich <b>stehe</b> um sechs <b>auf</b>.</span> → <span class="mono">…, weil ich um sechs <b>aufstehe</b>.</span></p>
      `,
    },
    {
      title: "Regel 3 — Nebensatz zuerst",
      body: `
        <p>Der Nebensatz kann auch vorn stehen. Dann besetzt er <b>Position 1</b> des Hauptsatzes — und das Hauptsatzverb folgt sofort:</p>
        <p><span class="mono"><b>Weil ich krank bin</b>, <b style="color:var(--accent)">komme</b> ich nicht.</span></p>
        <p>Zwei Verben treffen sich also in der Mitte, nur durch das Komma getrennt. Das ist richtig so.</p>
      `,
    },
    {
      title: "Regel 4 — weil oder denn?",
      body: `
        <p>Beide heißen „because“, aber nur <b>weil</b> ist eine Nebensatz-Konjunktion:</p>
        <p><span class="mono">Ich komme nicht, <b>weil</b> ich krank <b>bin</b>.</span> <span style="color:var(--ink-soft)">(Verb am Ende)</span><br>
           <span class="mono">Ich komme nicht, <b>denn</b> ich <b>bin</b> krank.</span> <span style="color:var(--ink-soft)">(normale Wortstellung)</span></p>
      `,
    },
  ],
  tables: [
    {
      caption: "Die A2-Konjunktionen",
      head: ["Konjunktion", "Bedeutung", "Beispiel"],
      rows: [
        ["weil", "because", "Ich lerne Deutsch, weil ich in Wien wohne."],
        ["dass", "that", "Ich glaube, dass er recht hat."],
        ["wenn", "if / whenever", "Wenn ich Zeit habe, gehe ich schwimmen."],
        ["ob", "whether", "Ich weiß nicht, ob er kommt."],
        ["obwohl", "although", "Ich gehe spazieren, obwohl es regnet."],
        ["damit", "so that", "Ich lerne viel, damit ich die Prüfung bestehe."],
        ["bevor", "before", "Bevor ich gehe, trinke ich einen Kaffee."],
        ["nachdem", "after", "Nachdem ich gegessen habe, gehe ich."],
      ],
    },
  ],
  exercises: [
    {
      id: "verbende",
      kind: "gap",
      title: "Übung A — Wo steht das Verb?",
      lede: "Trage nur das fehlende Verb ein.",
      items: [
        { n: 1, prompt: "Ich komme nicht, weil ich krank ________. <em>(sein)</em>", answers: ["bin"] },
        { n: 2, prompt: "Er sagt, dass er morgen ________. <em>(kommen)</em>", answers: ["kommt"] },
        { n: 3, prompt: "Ich weiß nicht, ob sie Zeit ________. <em>(haben)</em>", answers: ["hat"] },
        { n: 4, prompt: "Wenn ich Zeit ________, gehe ich schwimmen. <em>(haben)</em>", answers: ["habe"] },
        { n: 5, prompt: "Ich bleibe zu Hause, weil ich arbeiten ________. <em>(müssen)</em>", answers: ["muss"] },
        { n: 6, prompt: "Sie sagt, dass sie gestern gearbeitet ________. <em>(haben)</em>", answers: ["hat"] },
        { n: 7, prompt: "Ich freue mich, weil ich um sechs ________. <em>(aufstehen — nicht trennen!)</em>", answers: ["aufstehe"] },
        { n: 8, prompt: "Obwohl es ________, gehe ich spazieren. <em>(regnen)</em>", answers: ["regnet"] },
      ],
    },
    {
      id: "bilden",
      kind: "reveal",
      title: "Übung B — Nebensätze bilden",
      lede: "Verbinde die beiden Sätze mit der Konjunktion in Klammern.",
      items: [
        { n: 1, frag: "Ich komme nicht. Ich bin krank. <em>(weil)</em>", answer: "Ich komme nicht, weil ich krank bin." },
        { n: 2, frag: "Er ist müde. Er sagt es. <em>(dass)</em>", answer: "Er sagt, dass er müde ist." },
        { n: 3, frag: "Ich habe Zeit. Ich gehe schwimmen. <em>(wenn, Nebensatz zuerst)</em>", answer: "Wenn ich Zeit habe, gehe ich schwimmen.", hint: "Nebensatz auf Position 1 → Hauptsatzverb folgt sofort." },
        { n: 4, frag: "Kommt er? Ich weiß es nicht. <em>(ob)</em>", answer: "Ich weiß nicht, ob er kommt." },
        { n: 5, frag: "Es regnet. Ich gehe spazieren. <em>(obwohl)</em>", answer: "Ich gehe spazieren, obwohl es regnet." },
        { n: 6, frag: "Ich muss arbeiten. Ich bleibe zu Hause. <em>(weil)</em>", answer: "Ich bleibe zu Hause, weil ich arbeiten muss.", hint: "Zwei Verben: das konjugierte ganz ans Ende." },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Wo steht das konjugierte Verb im Nebensatz — auch wenn es zwei Verben gibt?",
      reveal:
        "Immer <b>ganz am Ende</b>. Bei zwei Verben steht das konjugierte hinter dem Infinitiv oder Partizip: <em>…, weil ich arbeiten <b>muss</b></em> · <em>…, weil ich gearbeitet <b>habe</b></em>.",
    },
    {
      q: "Was passiert, wenn der Nebensatz vorn steht?",
      reveal:
        "Er besetzt <b>Position 1</b> des Hauptsatzes, das Hauptsatzverb kommt also direkt nach dem Komma: <b>Weil ich krank bin, komme ich</b> nicht. Die beiden Verben stehen dann nebeneinander — das ist korrekt.",
    },
    {
      q: "Was ist der Unterschied zwischen weil und denn?",
      reveal:
        "<b>weil</b> leitet einen Nebensatz ein → Verb ans Ende. <b>denn</b> verbindet zwei Hauptsätze → normale Wortstellung. <em>…, weil ich krank <b>bin</b></em> vs. <em>…, denn ich <b>bin</b> krank</em>.",
    },
    {
      q: "Warum ist <em>…, weil ich stehe um sechs auf</em> falsch?",
      reveal:
        "Trennbare Verben werden im Nebensatz <b>nicht getrennt</b>. Richtig: <em>…, weil ich um sechs <b>aufstehe</b>.</em>",
    },
  ],
};

const ADJEKTIV = {
  intro:
    "Adjektivendungen gelten als der schwierigste Teil von A2 — aber es sind nur drei Muster, und welches gilt, hängt allein davon ab, was vor dem Adjektiv steht. Wenn der Artikel das Genus schon deutlich zeigt, macht es sich das Adjektiv leicht.",
  rules: [
    {
      title: "Regel 1 — Das Grundprinzip",
      body: `
        <p>Frage dich: <b>Zeigt der Artikel schon, welches Genus und welcher Kasus vorliegt?</b></p>
        <p><b>Ja</b> (der, die, das, den, dem …) → das Adjektiv nimmt die <b>schwache</b> Endung: nur <b>-e</b> oder <b>-en</b>.<br>
           <b>Halb</b> (ein, eine — mehrdeutig) → das Adjektiv <b>springt ein</b> und zeigt das Genus selbst.<br>
           <b>Kein Artikel</b> → das Adjektiv übernimmt ganz die Artikelendung.</p>
      `,
    },
    {
      title: "Regel 2 — Nach der/die/das (schwach)",
      body: `
        <p>Nur zwei Endungen im Umlauf: <b>-e</b> und <b>-en</b>.</p>
        <p><b>-e</b> steht in genau fünf Feldern: Nominativ m/f/n und Akkusativ f/n.<br>
           <b>Überall sonst -en.</b></p>
        <p><span class="mono">der <b>alte</b> Mann · die <b>alte</b> Frau · das <b>alte</b> Haus<br>
           ich sehe den <b>alten</b> Mann · mit dem <b>alten</b> Mann · die <b>alten</b> Männer</span></p>
      `,
      note: "Faustregel: <strong>Nominativ und der Akkusativ von f/n bekommen -e, der ganze Rest -en.</strong>",
    },
    {
      title: "Regel 3 — Nach ein/kein/mein (gemischt)",
      body: `
        <p><em>ein</em> ist mehrdeutig: es kann maskulin oder neutral sein. In genau den drei Feldern, wo der Artikel nichts verrät, zeigt das <b>Adjektiv</b> das Genus:</p>
        <p><span class="mono">ein alt<b style="color:var(--accent)">er</b> Mann</span> <span style="color:var(--ink-soft)">(m, Nom.)</span><br>
           <span class="mono">ein alt<b style="color:var(--accent)">es</b> Haus</span> <span style="color:var(--ink-soft)">(n, Nom./Akk.)</span><br>
           <span class="mono">eine alt<b>e</b> Frau</span> <span style="color:var(--ink-soft)">(f — eine ist eindeutig)</span></p>
        <p>Sonst wie bei der/die/das: <span class="mono">einen alt<b>en</b> Mann · einem alt<b>en</b> Mann</span></p>
      `,
    },
  ],
  tables: [
    {
      caption: "Nach bestimmtem Artikel (schwach)",
      head: ["", "maskulin", "feminin", "neutral", "Plural"],
      rows: [
        ["Nominativ", "der alt<b>e</b>", "die alt<b>e</b>", "das alt<b>e</b>", "die alt<b>en</b>"],
        ["Akkusativ", "den alt<b>en</b>", "die alt<b>e</b>", "das alt<b>e</b>", "die alt<b>en</b>"],
        ["Dativ", "dem alt<b>en</b>", "der alt<b>en</b>", "dem alt<b>en</b>", "den alt<b>en</b>"],
      ],
    },
    {
      caption: "Nach ein/kein/mein (gemischt)",
      head: ["", "maskulin", "feminin", "neutral", "Plural"],
      rows: [
        ["Nominativ", "ein alt<b>er</b>", "eine alt<b>e</b>", "ein alt<b>es</b>", "keine alt<b>en</b>"],
        ["Akkusativ", "einen alt<b>en</b>", "eine alt<b>e</b>", "ein alt<b>es</b>", "keine alt<b>en</b>"],
        ["Dativ", "einem alt<b>en</b>", "einer alt<b>en</b>", "einem alt<b>en</b>", "keinen alt<b>en</b>"],
      ],
    },
  ],
  exercises: [
    {
      id: "bestimmt",
      kind: "gap",
      title: "Übung A — Nach der/die/das",
      lede: "Nur die Endung eintragen, z. B. „e“ oder „en“.",
      items: [
        { n: 1, prompt: "Der ________ Mann ist mein Onkel. <em>(alt)</em>", answers: ["alte"], display: "alte" },
        { n: 2, prompt: "Ich sehe den ________ Mann. <em>(alt)</em>", answers: ["alten"], display: "alten" },
        { n: 3, prompt: "Die ________ Frau wohnt hier. <em>(nett)</em>", answers: ["nette"], display: "nette" },
        { n: 4, prompt: "Ich wohne in dem ________ Haus. <em>(groß)</em>", answers: ["großen"], display: "großen" },
        { n: 5, prompt: "Das ________ Auto gehört mir. <em>(neu)</em>", answers: ["neue"], display: "neue" },
        { n: 6, prompt: "Ich spreche mit der ________ Lehrerin. <em>(jung)</em>", answers: ["jungen"], display: "jungen" },
        { n: 7, prompt: "Die ________ Kinder spielen. <em>(klein)</em>", answers: ["kleinen"], display: "kleinen" },
      ],
    },
    {
      id: "unbestimmt",
      kind: "gap",
      title: "Übung B — Nach ein/kein/mein",
      items: [
        { n: 1, prompt: "Das ist ein ________ Wagen. <em>(neu)</em>", answers: ["neuer"], display: "neuer" },
        { n: 2, prompt: "Ich habe einen ________ Wagen gekauft. <em>(neu)</em>", answers: ["neuen"], display: "neuen" },
        { n: 3, prompt: "Das ist ein ________ Haus. <em>(schön)</em>", answers: ["schönes"], display: "schönes" },
        { n: 4, prompt: "Ich habe eine ________ Wohnung. <em>(klein)</em>", answers: ["kleine"], display: "kleine" },
        { n: 5, prompt: "Ich wohne in einer ________ Wohnung. <em>(klein)</em>", answers: ["kleinen"], display: "kleinen" },
        { n: 6, prompt: "Er ist mein ________ Freund. <em>(best)</em>", answers: ["bester"], display: "bester" },
        { n: 7, prompt: "Wir haben keine ________ Probleme. <em>(groß)</em>", answers: ["großen"], display: "großen" },
      ],
    },
  ],
  selfcheck: [
    {
      q: "Wann bekommt ein Adjektiv nach der/die/das die Endung -e, wann -en?",
      reveal:
        "<b>-e</b> in fünf Feldern: Nominativ maskulin, feminin und neutral, dazu Akkusativ feminin und neutral. <b>-en</b> überall sonst — also Akkusativ maskulin, der ganze Dativ und der ganze Plural.",
    },
    {
      q: "Warum heißt es <em>ein neuer Wagen</em>, aber <em>der neue Wagen</em>?",
      reveal:
        "Weil <em>ein</em> nicht verrät, ob maskulin oder neutral gemeint ist. Dann <b>springt das Adjektiv ein</b> und trägt die Genusendung: ein neu<b>er</b> Wagen (m), ein neu<b>es</b> Haus (n). Nach <em>der</em> ist das Genus schon klar, also reicht dem Adjektiv ein schlichtes <b>-e</b>.",
    },
    {
      q: "Welche Endung steht im Dativ — egal welches Genus?",
      reveal:
        "Fast immer <b>-en</b>: dem alt<b>en</b> Mann, der alt<b>en</b> Frau, dem alt<b>en</b> Haus, den alt<b>en</b> Männern. Der Dativ ist die einfachste Spalte der ganzen Tabelle.",
    },
  ],
};

export const MORE2 = {
  wechselpraepositionen: WECHSEL,
  nebensaetze: NEBEN,
  adjektivendungen: ADJEKTIV,
};
