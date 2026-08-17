import { makeLevelStore } from "../lib/storage.js";

// Unchanged since the original standalone Day 1 page — do not alter the prefix
// or any sub-key, or existing saved progress becomes unreachable.
export const LS_AREA = "tag01:";

export { normalize, wordsPresent } from "../lib/storage.js";

const store = makeLevelStore(LS_AREA);
export const save = store.save;
export const load = store.load;
