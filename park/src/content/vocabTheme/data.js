// Vocabulary Themen. Each entry is one zone's word set, so adding a new theme
// is just a data change plus flipping that zone to status "built".
// note = Austrian variant or usage hint (relevant for the ÖSD exam).
import { THEMES2 } from "./themes2.js";
import { THEMES3 } from "./themes3.js";
import { THEMES4 } from "./themes4.js";
import { THEMES5 } from "./themes5.js";
import { THEMES_A1 } from "./a1.js";
import { THEMES_A1B } from "./a1b.js";
import { THEMES_A1C } from "./a1c.js";

// One map across every level; registry.js slices it per level. Zone ids are
// unique across levels, so A1's "Wohnen" and A2's are simply two entries.
export const THEMES = {
  ...THEMES_A1,
  ...THEMES_A1B,
  ...THEMES_A1C,
  ...THEMES2,
  ...THEMES3,
  ...THEMES4,
  ...THEMES5,
  "essen-trinken": {
    phrasesTitle: "Redemittel — im Restaurant",
    intro:
      "Alltagswortschatz rund ums Essen, Einkaufen und Bestellen — einer der häufigsten Themenbereiche in Hören und Sprechen. Österreichische Varianten sind markiert, weil das ÖSD auch österreichisches Standarddeutsch prüft.",
    words: [
      ["das Brot", "bread"],
      ["das Brötchen", "bread roll", "AT: die Semmel"],
      ["die Butter", "butter"],
      ["der Käse", "cheese"],
      ["das Ei, die Eier", "egg, eggs"],
      ["die Milch", "milk"],
      ["die Sahne", "cream", "AT: das Obers"],
      ["der Kaffee", "coffee"],
      ["der Tee", "tea"],
      ["das Wasser", "water"],
      ["der Saft", "juice"],
      ["das Bier", "beer"],
      ["der Wein", "wine"],
      ["das Obst", "fruit"],
      ["der Apfel", "apple"],
      ["die Banane", "banana"],
      ["das Gemüse", "vegetables"],
      ["die Kartoffel", "potato", "AT: der Erdapfel"],
      ["die Tomate", "tomato", "AT: der Paradeiser"],
      ["der Salat", "salad, lettuce"],
      ["das Fleisch", "meat"],
      ["das Hähnchen", "chicken", "AT: das Hendl"],
      ["der Fisch", "fish"],
      ["die Suppe", "soup"],
      ["der Reis", "rice"],
      ["die Nudeln (Pl.)", "pasta, noodles"],
      ["der Zucker", "sugar"],
      ["das Salz", "salt"],
      ["das Frühstück", "breakfast"],
      ["das Mittagessen", "lunch"],
      ["das Abendessen", "dinner"],
      ["die Speisekarte", "the menu"],
      ["die Rechnung", "the bill"],
      ["bestellen", "to order"],
      ["bezahlen", "to pay"],
      ["schmecken", "to taste (good)"],
      ["Hunger haben", "to be hungry"],
      ["Durst haben", "to be thirsty"],
    ],
    phrases: [
      ["Ich hätte gern einen Kaffee.", "I'd like a coffee. — the polite standard order (Konjunktiv II)"],
      ["Ich nehme die Suppe.", "I'll take the soup."],
      ["Was können Sie empfehlen?", "What can you recommend?"],
      ["Zahlen, bitte!", "The bill, please!"],
      ["Getrennt oder zusammen?", "Separately or together? — what the waiter asks"],
      ["Hat es geschmeckt?", "Did you enjoy it?"],
      ["Guten Appetit!", "Enjoy your meal!"],
      ["Ich esse kein Fleisch.", "I don't eat meat."],
    ],
  },
};
