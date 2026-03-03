export const SIGN_NAMES = {
  Ari: "Áries",
  Tau: "Touro",
  Gem: "Gêmeos",
  Can: "Câncer",
  Leo: "Leão",
  Vir: "Virgem",
  Lib: "Libra",
  Sco: "Escorpião",
  Sag: "Sagitário",
  Cap: "Capricórnio",
  Aqu: "Aquário",
  Pis: "Peixes",
} as const;

export type SignKey = keyof typeof SIGN_NAMES;

export const SIGN_EMOJIS: Record<SignKey, string> = {
  Ari: "♈",
  Tau: "♉",
  Gem: "♊",
  Can: "♋",
  Leo: "♌",
  Vir: "♍",
  Lib: "♎",
  Sco: "♏",
  Sag: "♐",
  Cap: "♑",
  Aqu: "♒",
  Pis: "♓",
};

export const PLANET_NAMES: Record<string, string> = {
  sun: "Sol",
  moon: "Lua",
  mercury: "Mercúrio",
  venus: "Vênus",
  mars: "Marte",
  jupiter: "Júpiter",
  saturn: "Saturno",
  uranus: "Urano",
  neptune: "Netuno",
  pluto: "Plutão",
  chiron: "Quíron",
  mean_lilith: "Lilith",
  true_north_lunar_node: "Nodo Norte",
  true_south_lunar_node: "Nodo Sul",
};

export const PLANET_SYMBOLS: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  chiron: "⚷",
  mean_lilith: "⚸",
  true_north_lunar_node: "☊",
  true_south_lunar_node: "☋",
};

export const HOUSE_NAMES: Record<string, string> = {
  First_House: "Casa 1",
  Second_House: "Casa 2",
  Third_House: "Casa 3",
  Fourth_House: "Casa 4",
  Fifth_House: "Casa 5",
  Sixth_House: "Casa 6",
  Seventh_House: "Casa 7",
  Eighth_House: "Casa 8",
  Ninth_House: "Casa 9",
  Tenth_House: "Casa 10",
  Eleventh_House: "Casa 11",
  Twelfth_House: "Casa 12",
};

/** Planetas exibidos no resultado (ordem de exibição) */
export const DISPLAY_PLANETS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "chiron",
  "true_north_lunar_node",
] as const;
