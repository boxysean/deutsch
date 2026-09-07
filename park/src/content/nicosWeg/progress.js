import { readLevel } from "../lib/storage.js";
import { CHAPTERS } from "./data.js";

// Read-only, and in its own file so the Fernsehturm can show a line for the
// course without importing the whole page.
//
// Deliberately NOT part of computeProgress(): the app's percentage is about
// exam readiness, and a video course is beside that rather than inside it.
// Folding it in would move the number that answers "am I ready?".
export function nicosWegProgress() {
  const done = readLevel("nico:done", {}) || {};
  return {
    done: CHAPTERS.filter((c) => done[c.key]).length,
    total: CHAPTERS.length,
  };
}
