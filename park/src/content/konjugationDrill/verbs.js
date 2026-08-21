// The verb inventory. Everything a rule cannot derive is written out here.
//
// Where the app already carries a form in a reviewed table — the stem-change
// table and sein/haben/werden in Schritt 1, the participle table in Perfekt,
// the Dreierpack list in Präteritum — this file agrees with it deliberately.
// Two places in one app quietly disagreeing about "du nimmst" would be worse
// than either of them being wrong on its own.

// --- Präsens: the verbs whose du / er form changes the stem ------------------
// ich, wir, ihr and sie are regular for every one of these, which is exactly
// why the drill asks only the two forms that move.
export const STEM_CHANGE = [
  { inf: "fahren", type: "a → ä", praesens: { du: "fährst", "er/sie/es": "fährt" } },
  { inf: "schlafen", type: "a → ä", praesens: { du: "schläfst", "er/sie/es": "schläft" } },
  { inf: "tragen", type: "a → ä", praesens: { du: "trägst", "er/sie/es": "trägt" } },
  { inf: "fallen", type: "a → ä", praesens: { du: "fällst", "er/sie/es": "fällt" } },
  { inf: "halten", type: "a → ä", praesens: { du: "hältst", "er/sie/es": "hält" } },
  { inf: "laden", type: "a → ä", praesens: { du: "lädst", "er/sie/es": "lädt" } },
  { inf: "laufen", type: "au → äu", praesens: { du: "läufst", "er/sie/es": "läuft" } },
  { inf: "sprechen", type: "e → i", praesens: { du: "sprichst", "er/sie/es": "spricht" } },
  { inf: "essen", type: "e → i", praesens: { du: "isst", "er/sie/es": "isst" } },
  { inf: "geben", type: "e → i", praesens: { du: "gibst", "er/sie/es": "gibt" } },
  { inf: "helfen", type: "e → i", praesens: { du: "hilfst", "er/sie/es": "hilft" } },
  { inf: "treffen", type: "e → i", praesens: { du: "triffst", "er/sie/es": "trifft" } },
  { inf: "vergessen", type: "e → i", praesens: { du: "vergisst", "er/sie/es": "vergisst" } },
  { inf: "nehmen", type: "e → i (+ mm)", praesens: { du: "nimmst", "er/sie/es": "nimmt" } },
  { inf: "sehen", type: "e → ie", praesens: { du: "siehst", "er/sie/es": "sieht" } },
  { inf: "lesen", type: "e → ie", praesens: { du: "liest", "er/sie/es": "liest" } },
  { inf: "empfehlen", type: "e → ie", praesens: { du: "empfiehlst", "er/sie/es": "empfiehlt" } },
  { inf: "wissen", type: "irregulär", praesens: { ich: "weiß", du: "weißt", "er/sie/es": "weiß", ihr: "wisst" } },
];

// --- Präsens: the three that carry the language ------------------------------
export const AUXILIARIES = [
  { inf: "sein", praesens: { ich: "bin", du: "bist", "er/sie/es": "ist", wir: "sind", ihr: "seid", "sie/Sie": "sind" } },
  { inf: "haben", praesens: { du: "hast", "er/sie/es": "hat" } },
  { inf: "werden", praesens: { du: "wirst", "er/sie/es": "wird" } },
];

// --- Präsens: modal verbs ----------------------------------------------------
// The singular changes its vowel and the ich form takes no ending at all — the
// two things learners get wrong — so all three singular persons are drilled,
// plus ihr, which is the only plural form that isn't just the infinitive.
export const MODALS = [
  { inf: "können", praesens: { ich: "kann", du: "kannst", "er/sie/es": "kann", ihr: "könnt" } },
  { inf: "müssen", praesens: { ich: "muss", du: "musst", "er/sie/es": "muss", ihr: "müsst" } },
  { inf: "wollen", praesens: { ich: "will", du: "willst", "er/sie/es": "will", ihr: "wollt" } },
  { inf: "dürfen", praesens: { ich: "darf", du: "darfst", "er/sie/es": "darf", ihr: "dürft" } },
  { inf: "sollen", praesens: { ich: "soll", du: "sollst", "er/sie/es": "soll", ihr: "sollt" } },
  { inf: "mögen", praesens: { ich: "mag", du: "magst", "er/sie/es": "mag", ihr: "mögt" } },
];

// --- Trennbare Verben --------------------------------------------------------
// Asked as a whole sentence, because the point of a separable verb is not the
// ending but where the prefix lands: at the very end, past everything else.
export const SEPARABLE = [
  { inf: "aufstehen", q: "Ich ___ um sieben Uhr ___.", a: "Ich stehe um sieben Uhr auf." },
  { inf: "anrufen", q: "Ich ___ dich morgen ___.", a: "Ich rufe dich morgen an." },
  { inf: "einkaufen", q: "Wir ___ am Samstag ___.", a: "Wir kaufen am Samstag ein." },
  { inf: "fernsehen", q: "Er ___ jeden Abend ___.", a: "Er sieht jeden Abend fern.", note: "sehen → sieht: der Stamm wechselt auch im trennbaren Verb." },
  { inf: "mitkommen", q: "___ du heute ___?", a: "Kommst du heute mit?" },
  { inf: "ankommen", q: "Der Zug ___ um acht Uhr ___.", a: "Der Zug kommt um acht Uhr an." },
  { inf: "aufräumen", q: "Ich ___ mein Zimmer ___.", a: "Ich räume mein Zimmer auf." },
  { inf: "einladen", q: "Sie ___ uns zum Essen ___.", a: "Sie lädt uns zum Essen ein.", note: "laden → lädt: a → ä." },
  { inf: "abholen", q: "Ich ___ dich vom Bahnhof ___.", a: "Ich hole dich vom Bahnhof ab." },
  { inf: "anfangen", q: "Der Kurs ___ um neun ___.", a: "Der Kurs fängt um neun an.", note: "fangen → fängt: a → ä." },
  { inf: "zurückkommen", q: "Wann ___ ihr ___?", a: "Wann kommt ihr zurück?" },
  { inf: "einsteigen", q: "Wir ___ in Salzburg ___.", a: "Wir steigen in Salzburg ein." },
];

// --- Perfekt -----------------------------------------------------------------
// [Infinitiv, Hilfsverb, Partizip II]. The auxiliary is part of the answer
// because it is part of the vocabulary item: knowing "gefahren" without knowing
// it takes sein is knowing half of it.
export const PERFEKT = [
  ["machen", "haben", "gemacht"],
  ["kaufen", "haben", "gekauft"],
  ["arbeiten", "haben", "gearbeitet"],
  ["spielen", "haben", "gespielt"],
  ["essen", "haben", "gegessen"],
  ["trinken", "haben", "getrunken"],
  ["sprechen", "haben", "gesprochen"],
  ["lesen", "haben", "gelesen"],
  ["sehen", "haben", "gesehen"],
  ["schreiben", "haben", "geschrieben"],
  ["nehmen", "haben", "genommen"],
  ["geben", "haben", "gegeben"],
  ["finden", "haben", "gefunden"],
  ["helfen", "haben", "geholfen"],
  ["treffen", "haben", "getroffen"],
  ["schlafen", "haben", "geschlafen"],
  ["tragen", "haben", "getragen"],
  ["waschen", "haben", "gewaschen"],
  ["bringen", "haben", "gebracht"],
  ["denken", "haben", "gedacht"],
  ["wissen", "haben", "gewusst"],
  ["haben", "haben", "gehabt"],
  ["gehen", "sein", "gegangen"],
  ["fahren", "sein", "gefahren"],
  ["kommen", "sein", "gekommen"],
  ["fliegen", "sein", "geflogen"],
  ["laufen", "sein", "gelaufen"],
  ["schwimmen", "sein", "geschwommen"],
  ["bleiben", "sein", "geblieben"],
  ["werden", "sein", "geworden"],
  ["sein", "sein", "gewesen"],
  ["passieren", "sein", "passiert"],
  ["aufstehen", "sein", "aufgestanden"],
  ["ankommen", "sein", "angekommen"],
  ["anrufen", "haben", "angerufen"],
  ["einkaufen", "haben", "eingekauft"],
  ["studieren", "haben", "studiert"],
  ["telefonieren", "haben", "telefoniert"],
  ["besuchen", "haben", "besucht"],
  ["verstehen", "haben", "verstanden"],
  ["vergessen", "haben", "vergessen"],
  ["erzählen", "haben", "erzählt"],
  ["bezahlen", "haben", "bezahlt"],
];

// --- Präteritum --------------------------------------------------------------
// The ich/er form, which is the one with no ending and the one a reading text
// hands you. [Infinitiv, Präteritum].
export const PRAETERITUM = [
  ["sein", "war"],
  ["haben", "hatte"],
  ["werden", "wurde"],
  ["können", "konnte"],
  ["müssen", "musste"],
  ["wollen", "wollte"],
  ["dürfen", "durfte"],
  ["sollen", "sollte"],
  ["mögen", "mochte"],
  ["gehen", "ging"],
  ["kommen", "kam"],
  ["fahren", "fuhr"],
  ["geben", "gab"],
  ["nehmen", "nahm"],
  ["sehen", "sah"],
  ["sprechen", "sprach"],
  ["schreiben", "schrieb"],
  ["finden", "fand"],
  ["bleiben", "blieb"],
  ["bringen", "brachte"],
  ["denken", "dachte"],
  ["wissen", "wusste"],
  ["essen", "aß"],
  ["trinken", "trank"],
  ["lesen", "las"],
  ["laufen", "lief"],
  ["fliegen", "flog"],
  ["helfen", "half"],
  ["treffen", "traf"],
  ["stehen", "stand"],
  ["verstehen", "verstand"],
  ["sitzen", "saß"],
  ["liegen", "lag"],
  ["rufen", "rief"],
  ["schlafen", "schlief"],
  ["tragen", "trug"],
  ["ziehen", "zog"],
  ["verlieren", "verlor"],
  ["beginnen", "begann"],
  ["gewinnen", "gewann"],
  ["bitten", "bat"],
  ["heißen", "hieß"],
  ["tun", "tat"],
  ["lassen", "ließ"],
  ["halten", "hielt"],
  ["fallen", "fiel"],
  ["gefallen", "gefiel"],
  ["vergessen", "vergaß"],
  ["entscheiden", "entschied"],
  ["nennen", "nannte"],
];

// --- Imperativ ---------------------------------------------------------------
// [Infinitiv, du, ihr, Sie]. Two traps: an e → i verb keeps its changed stem
// (sprich!) while an a → ä verb does not (fahr!, never fähr!), and sein has an
// imperative of its own.
export const IMPERATIV = [
  ["machen", "Mach!", "Macht!", "Machen Sie!"],
  ["kommen", "Komm!", "Kommt!", "Kommen Sie!"],
  ["gehen", "Geh!", "Geht!", "Gehen Sie!"],
  ["warten", "Warte!", "Wartet!", "Warten Sie!"],
  ["fahren", "Fahr!", "Fahrt!", "Fahren Sie!"],
  ["schlafen", "Schlaf!", "Schlaft!", "Schlafen Sie!"],
  ["sprechen", "Sprich!", "Sprecht!", "Sprechen Sie!"],
  ["nehmen", "Nimm!", "Nehmt!", "Nehmen Sie!"],
  ["lesen", "Lies!", "Lest!", "Lesen Sie!"],
  ["essen", "Iss!", "Esst!", "Essen Sie!"],
  ["geben", "Gib!", "Gebt!", "Geben Sie!"],
  ["helfen", "Hilf!", "Helft!", "Helfen Sie!"],
  ["sein", "Sei!", "Seid!", "Seien Sie!"],
  ["haben", "Hab!", "Habt!", "Haben Sie!"],
  ["anrufen", "Ruf an!", "Ruft an!", "Rufen Sie an!"],
  ["aufstehen", "Steh auf!", "Steht auf!", "Stehen Sie auf!"],
  ["zuhören", "Hör zu!", "Hört zu!", "Hören Sie zu!"],
  ["sich setzen", "Setz dich!", "Setzt euch!", "Setzen Sie sich!"],
];

// --- Konjunktiv II -----------------------------------------------------------
// [Infinitiv, ich-Form, Anmerkung]. Only the verbs that have a living
// subjunctive of their own; for everything else the answer is würde + Infinitiv,
// which the drill asks as its own card rather than pretending "ich ginge" is
// what anybody says about going.
export const KONJUNKTIV = [
  ["sein", "wäre", ""],
  ["haben", "hätte", ""],
  ["werden", "würde", "Das Hilfsverb für alle anderen Verben: ich würde gehen."],
  ["können", "könnte", ""],
  ["müssen", "müsste", ""],
  ["dürfen", "dürfte", ""],
  ["sollen", "sollte", "Gleich wie das Präteritum — der Kontext entscheidet."],
  ["mögen", "möchte", "Als Wunsch längst ein eigenes Wort: ich möchte einen Kaffee."],
  ["wissen", "wüsste", ""],
  ["gehen", "ginge", "Noch gebräuchlich, aber würde gehen ist häufiger."],
  ["kommen", "käme", ""],
  ["geben", "gäbe", "Vor allem in es gäbe."],
  ["tun", "täte", ""],
  ["finden", "fände", ""],
  ["bleiben", "bliebe", ""],
];
