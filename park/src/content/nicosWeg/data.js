// Nico's Weg A2, as the course itself lists it.
//
// Taken from the chapter list on the DW course page rather than from memory:
// a web search claimed "16 chapters", and it is 18 numbered ones plus the
// intro and the closing test. Getting that wrong would mean ticking boxes
// against chapters that do not exist.
//
// Keys are derived from the chapter, never from position in this array, so
// inserting one cannot hand your progress to its neighbour.
export const COURSE_URL = "https://learngerman.dw.com/de/nicos-weg/c-36519709";

export const CHAPTERS = [
  { key: "intro", label: "Intro", title: "Intro zu A2" },
  { key: "k1", label: "1", title: "Geld" },
  { key: "k2", label: "2", title: "Familie" },
  { key: "k3", label: "3", title: "Zusammen leben" },
  { key: "k4", label: "4", title: "Mobil" },
  { key: "k5", label: "5", title: "So ein Stress!" },
  { key: "k6", label: "6", title: "Bist du im Verein?" },
  { key: "k7", label: "7", title: "Digitales Leben" },
  { key: "k8", label: "8", title: "Im Restaurant" },
  { key: "k9", label: "9", title: "Leute treffen" },
  { key: "k10", label: "10", title: "Wo lebst du?" },
  { key: "k11", label: "11", title: "Früher und heute" },
  { key: "k12", label: "12", title: "Arbeitswelten" },
  { key: "k13", label: "13", title: "Kultur erleben" },
  { key: "k14", label: "14", title: "Feste und Feiern" },
  { key: "k15", label: "15", title: "Einladungen" },
  { key: "k16", label: "16", title: "Film und Fernsehen" },
  { key: "k17", label: "17", title: "Mit Gefühl" },
  { key: "k18", label: "18", title: "Tolle Idee" },
  { key: "abschluss", label: "Test", title: "Abschlusstest" },
];
