import React, { useState, useEffect, useRef, useCallback } from "react";

/* ---------------------------------------------------------------------- */
/*  DATA                                                                   */
/* ---------------------------------------------------------------------- */

const MEGA_SLUGS = [
  "venusaur-mega","charizard-mega-x","charizard-mega-y","blastoise-mega","beedrill-mega",
  "pidgeot-mega","alakazam-mega","slowbro-mega","gengar-mega","kangaskhan-mega","pinsir-mega",
  "gyarados-mega","aerodactyl-mega","mewtwo-mega-x","mewtwo-mega-y","ampharos-mega","steelix-mega",
  "scizor-mega","heracross-mega","houndoom-mega","tyranitar-mega","blaziken-mega","gardevoir-mega",
  "mawile-mega","aggron-mega","medicham-mega","manectric-mega","sharpedo-mega","camerupt-mega",
  "altaria-mega","banette-mega","absol-mega","glalie-mega","salamence-mega","metagross-mega",
  "latias-mega","latios-mega","rayquaza-mega","lopunny-mega","garchomp-mega","lucario-mega",
  "abomasnow-mega","gallade-mega","audino-mega","diancie-mega","sceptile-mega","swampert-mega",
  "sableye-mega",
];

const GMAX_SLUGS = [
  "venusaur-gmax","charizard-gmax","butterfree-gmax","pikachu-gmax","meowth-gmax","machamp-gmax",
  "gengar-gmax","kingler-gmax","lapras-gmax","eevee-gmax","snorlax-gmax","garbodor-gmax",
  "melmetal-gmax","corviknight-gmax","orbeetle-gmax","drednaw-gmax","coalossal-gmax","flapple-gmax",
  "appletun-gmax","sandaconda-gmax","toxtricity-gmax","centiskorch-gmax","hatterene-gmax",
  "grimmsnarl-gmax","alcremie-gmax","copperajah-gmax","duraludon-gmax","urshifu-gmax",
  "rillaboom-gmax","cinderace-gmax","inteleon-gmax",
];

// A curated spread of real, recognizable Pokémon across every generation (1-9).
// Each slug is a verified lowercase-hyphenated name used consistently across
// sprite archives, so images resolve without needing any live API call.
const POKEMON_POOL = [
  // Gen 1
  { name: "Bulbasaur", slug: "bulbasaur" }, { name: "Ivysaur", slug: "ivysaur" },
  { name: "Venusaur", slug: "venusaur" }, { name: "Charmander", slug: "charmander" },
  { name: "Charmeleon", slug: "charmeleon" }, { name: "Charizard", slug: "charizard" },
  { name: "Squirtle", slug: "squirtle" }, { name: "Wartortle", slug: "wartortle" },
  { name: "Blastoise", slug: "blastoise" }, { name: "Butterfree", slug: "butterfree" },
  { name: "Pikachu", slug: "pikachu" }, { name: "Raichu", slug: "raichu" },
  { name: "Sandslash", slug: "sandslash" }, { name: "Clefable", slug: "clefable" },
  { name: "Ninetales", slug: "ninetales" }, { name: "Wigglytuff", slug: "wigglytuff" },
  { name: "Golbat", slug: "golbat" }, { name: "Vileplume", slug: "vileplume" },
  { name: "Alakazam", slug: "alakazam" }, { name: "Machamp", slug: "machamp" },
  { name: "Victreebel", slug: "victreebel" }, { name: "Golem", slug: "golem" },
  { name: "Slowbro", slug: "slowbro" }, { name: "Magneton", slug: "magneton" },
  { name: "Gengar", slug: "gengar" }, { name: "Onix", slug: "onix" },
  { name: "Hypno", slug: "hypno" }, { name: "Kingler", slug: "kingler" },
  { name: "Electrode", slug: "electrode" }, { name: "Exeggutor", slug: "exeggutor" },
  { name: "Marowak", slug: "marowak" }, { name: "Hitmonlee", slug: "hitmonlee" },
  { name: "Hitmonchan", slug: "hitmonchan" }, { name: "Weezing", slug: "weezing" },
  { name: "Rhydon", slug: "rhydon" }, { name: "Chansey", slug: "chansey" },
  { name: "Tangela", slug: "tangela" }, { name: "Kangaskhan", slug: "kangaskhan" },
  { name: "Seadra", slug: "seadra" }, { name: "Seaking", slug: "seaking" },
  { name: "Starmie", slug: "starmie" }, { name: "Scyther", slug: "scyther" },
  { name: "Jynx", slug: "jynx" }, { name: "Electabuzz", slug: "electabuzz" },
  { name: "Magmar", slug: "magmar" }, { name: "Pinsir", slug: "pinsir" },
  { name: "Tauros", slug: "tauros" }, { name: "Gyarados", slug: "gyarados" },
  { name: "Lapras", slug: "lapras" }, { name: "Eevee", slug: "eevee" },
  { name: "Vaporeon", slug: "vaporeon" }, { name: "Jolteon", slug: "jolteon" },
  { name: "Flareon", slug: "flareon" }, { name: "Omastar", slug: "omastar" },
  { name: "Kabutops", slug: "kabutops" }, { name: "Aerodactyl", slug: "aerodactyl" },
  { name: "Snorlax", slug: "snorlax" }, { name: "Articuno", slug: "articuno" },
  { name: "Zapdos", slug: "zapdos" }, { name: "Moltres", slug: "moltres" },
  { name: "Dragonite", slug: "dragonite" }, { name: "Mewtwo", slug: "mewtwo" }, { name: "Mew", slug: "mew" },
  // Gen 2
  { name: "Meganium", slug: "meganium" }, { name: "Typhlosion", slug: "typhlosion" },
  { name: "Feraligatr", slug: "feraligatr" }, { name: "Togepi", slug: "togepi" },
  { name: "Ampharos", slug: "ampharos" }, { name: "Marill", slug: "marill" },
  { name: "Sudowoodo", slug: "sudowoodo" }, { name: "Politoed", slug: "politoed" },
  { name: "Espeon", slug: "espeon" }, { name: "Umbreon", slug: "umbreon" },
  { name: "Slowking", slug: "slowking" }, { name: "Scizor", slug: "scizor" },
  { name: "Heracross", slug: "heracross" }, { name: "Houndoom", slug: "houndoom" },
  { name: "Kingdra", slug: "kingdra" }, { name: "Donphan", slug: "donphan" },
  { name: "Tyranitar", slug: "tyranitar" }, { name: "Lugia", slug: "lugia" },
  { name: "Ho-Oh", slug: "ho-oh" }, { name: "Celebi", slug: "celebi" },
  // Gen 3
  { name: "Sceptile", slug: "sceptile" }, { name: "Blaziken", slug: "blaziken" },
  { name: "Swampert", slug: "swampert" }, { name: "Gardevoir", slug: "gardevoir" },
  { name: "Slaking", slug: "slaking" }, { name: "Breloom", slug: "breloom" },
  { name: "Ninjask", slug: "ninjask" }, { name: "Shedinja", slug: "shedinja" },
  { name: "Flygon", slug: "flygon" }, { name: "Cradily", slug: "cradily" },
  { name: "Armaldo", slug: "armaldo" }, { name: "Milotic", slug: "milotic" },
  { name: "Absol", slug: "absol" }, { name: "Glalie", slug: "glalie" },
  { name: "Walrein", slug: "walrein" }, { name: "Salamence", slug: "salamence" },
  { name: "Metagross", slug: "metagross" }, { name: "Rayquaza", slug: "rayquaza" },
  { name: "Kyogre", slug: "kyogre" }, { name: "Groudon", slug: "groudon" },
  // Gen 4
  { name: "Torterra", slug: "torterra" }, { name: "Infernape", slug: "infernape" },
  { name: "Empoleon", slug: "empoleon" }, { name: "Luxray", slug: "luxray" },
  { name: "Roserade", slug: "roserade" }, { name: "Garchomp", slug: "garchomp" },
  { name: "Lucario", slug: "lucario" }, { name: "Rhyperior", slug: "rhyperior" },
  { name: "Tangrowth", slug: "tangrowth" }, { name: "Electivire", slug: "electivire" },
  { name: "Magmortar", slug: "magmortar" }, { name: "Togekiss", slug: "togekiss" },
  { name: "Gliscor", slug: "gliscor" }, { name: "Mamoswine", slug: "mamoswine" },
  { name: "Gallade", slug: "gallade" }, { name: "Froslass", slug: "froslass" },
  { name: "Dialga", slug: "dialga" }, { name: "Palkia", slug: "palkia" },
  { name: "Giratina", slug: "giratina" }, { name: "Arceus", slug: "arceus" },
  // Gen 5
  { name: "Serperior", slug: "serperior" }, { name: "Emboar", slug: "emboar" },
  { name: "Samurott", slug: "samurott" }, { name: "Zebstrika", slug: "zebstrika" },
  { name: "Excadrill", slug: "excadrill" }, { name: "Zoroark", slug: "zoroark" },
  { name: "Sigilyph", slug: "sigilyph" }, { name: "Braviary", slug: "braviary" },
  { name: "Mandibuzz", slug: "mandibuzz" }, { name: "Volcarona", slug: "volcarona" },
  { name: "Reuniclus", slug: "reuniclus" }, { name: "Haxorus", slug: "haxorus" },
  { name: "Eelektross", slug: "eelektross" }, { name: "Chandelure", slug: "chandelure" },
  { name: "Hydreigon", slug: "hydreigon" }, { name: "Reshiram", slug: "reshiram" },
  { name: "Zekrom", slug: "zekrom" }, { name: "Kyurem", slug: "kyurem" },
  // Gen 6
  { name: "Greninja", slug: "greninja" }, { name: "Talonflame", slug: "talonflame" },
  { name: "Sylveon", slug: "sylveon" }, { name: "Goodra", slug: "goodra" },
  { name: "Aegislash", slug: "aegislash" }, { name: "Malamar", slug: "malamar" },
  { name: "Dragalge", slug: "dragalge" }, { name: "Noivern", slug: "noivern" },
  { name: "Xerneas", slug: "xerneas" }, { name: "Yveltal", slug: "yveltal" },
  { name: "Zygarde", slug: "zygarde" }, { name: "Diancie", slug: "diancie" }, { name: "Hoopa", slug: "hoopa" },
  // Gen 7
  { name: "Decidueye", slug: "decidueye" }, { name: "Incineroar", slug: "incineroar" },
  { name: "Primarina", slug: "primarina" }, { name: "Toucannon", slug: "toucannon" },
  { name: "Lycanroc", slug: "lycanroc" }, { name: "Mimikyu", slug: "mimikyu" },
  { name: "Kommo-o", slug: "kommo-o" }, { name: "Tsareena", slug: "tsareena" },
  { name: "Toxapex", slug: "toxapex" }, { name: "Golisopod", slug: "golisopod" },
  { name: "Silvally", slug: "silvally" }, { name: "Tapu Koko", slug: "tapu-koko" },
  { name: "Solgaleo", slug: "solgaleo" }, { name: "Lunala", slug: "lunala" },
  { name: "Necrozma", slug: "necrozma" }, { name: "Marshadow", slug: "marshadow" }, { name: "Zeraora", slug: "zeraora" },
  // Gen 8
  { name: "Rillaboom", slug: "rillaboom" }, { name: "Cinderace", slug: "cinderace" },
  { name: "Inteleon", slug: "inteleon" }, { name: "Corviknight", slug: "corviknight" },
  { name: "Orbeetle", slug: "orbeetle" }, { name: "Dragapult", slug: "dragapult" },
  { name: "Eiscue", slug: "eiscue" }, { name: "Duraludon", slug: "duraludon" },
  { name: "Grimmsnarl", slug: "grimmsnarl" }, { name: "Hatterene", slug: "hatterene" },
  { name: "Zacian", slug: "zacian" }, { name: "Zamazenta", slug: "zamazenta" },
  { name: "Eternatus", slug: "eternatus" }, { name: "Urshifu", slug: "urshifu" },
  { name: "Regieleki", slug: "regieleki" }, { name: "Calyrex", slug: "calyrex" },
  // Gen 9
  { name: "Meowscarada", slug: "meowscarada" }, { name: "Skeledirge", slug: "skeledirge" },
  { name: "Quaquaval", slug: "quaquaval" }, { name: "Lechonk", slug: "lechonk" },
  { name: "Gholdengo", slug: "gholdengo" }, { name: "Ceruledge", slug: "ceruledge" },
  { name: "Armarouge", slug: "armarouge" }, { name: "Tinkaton", slug: "tinkaton" },
  { name: "Baxcalibur", slug: "baxcalibur" }, { name: "Glimmora", slug: "glimmora" },
  { name: "Dondozo", slug: "dondozo" }, { name: "Palafin", slug: "palafin" },
  { name: "Koraidon", slug: "koraidon" }, { name: "Miraidon", slug: "miraidon" },
];

// Primary/characteristic color for each species (and relevant mega/gmax base
// forms), so the Pokémon's name can be rendered in a color that matches the
// actual Pokémon instead of using artwork.
const COLOR_MAP = {
  bulbasaur: "#5FBD58", ivysaur: "#6FC85A", venusaur: "#4A9F4E",
  charmander: "#F08030", charmeleon: "#EF6A3C", charizard: "#F5793C",
  squirtle: "#4F91D9", wartortle: "#4784C4", blastoise: "#3E6FB0",
  butterfree: "#D9A6E8", pikachu: "#F8D030", raichu: "#F6C542",
  sandslash: "#D9B36C", clefable: "#F4B6C2", ninetales: "#E8A33D",
  wigglytuff: "#F5B8C4", golbat: "#8B5FA8", vileplume: "#C64FA0",
  alakazam: "#C77DBA", machamp: "#B6704B", victreebel: "#4F9A4F",
  golem: "#8C6A4F", slowbro: "#F2A6B0", magneton: "#B0B8C0",
  gengar: "#6F4E91", onix: "#8C8C9C", hypno: "#D9A85C",
  kingler: "#E0553B", electrode: "#E03B3B", exeggutor: "#D9C24E",
  marowak: "#C89A5B", hitmonlee: "#B8623F", hitmonchan: "#8F4A3C",
  weezing: "#7A5C99", rhydon: "#9C7A5C", chansey: "#F7B8C2",
  tangela: "#3E9E5C", kangaskhan: "#C08A5C", seadra: "#5C8FD9",
  seaking: "#E86F4E", starmie: "#C7433C", scyther: "#5FA85C",
  jynx: "#C74F9C", electabuzz: "#F0C030", magmar: "#E8622F",
  pinsir: "#8C5A3C", tauros: "#B8763F", gyarados: "#3E6FB0",
  lapras: "#5C9CC7", eevee: "#B8895C", vaporeon: "#4FB6C7",
  jolteon: "#F0D94F", flareon: "#E8622F", omastar: "#5C7FC7",
  kabutops: "#8C6A4F", aerodactyl: "#9C7AC7", snorlax: "#4F6F8C",
  articuno: "#5CAFDB", zapdos: "#E8C830", moltres: "#E8622F",
  dragonite: "#E8A33D", mewtwo: "#B08CC7", mew: "#EFA6C4",
  meganium: "#4F9A6F", typhlosion: "#E86F30", feraligatr: "#3E6FA0",
  togepi: "#F0D9A0", ampharos: "#F0C030", marill: "#5C9CD9",
  sudowoodo: "#8C6A4F", politoed: "#3E9E6F", espeon: "#C77DDB",
  umbreon: "#8C6ADB", slowking: "#F2A6B0", scizor: "#C43C3C",
  heracross: "#4F6F8C", houndoom: "#5C4A8C", kingdra: "#3E6FA0",
  donphan: "#B0A08C", tyranitar: "#4F6F5C", lugia: "#9CB6C7",
  "ho-oh": "#E8622F", celebi: "#5FBD7C",
  sceptile: "#3E9E5C", blaziken: "#E8622F", swampert: "#3E6FA0",
  gardevoir: "#7DBDD9", slaking: "#8C6A4F", breloom: "#4F9A5C",
  ninjask: "#F0D94F", shedinja: "#8C7A5C", flygon: "#3E9E7C",
  cradily: "#8C5AA0", armaldo: "#B8763F", milotic: "#5CAFC7",
  absol: "#8C8C9C", glalie: "#7DBDD9", walrein: "#5CAFC7",
  salamence: "#3E6FA0", metagross: "#5C6F8C", rayquaza: "#4F9A5C",
  kyogre: "#3E6FB0", groudon: "#C85030",
  torterra: "#4F9A5C", infernape: "#E8622F", empoleon: "#3E6FA0",
  luxray: "#4F5F9C", roserade: "#4F9A5C", garchomp: "#4F6FA0",
  lucario: "#3E6F8C", rhyperior: "#C86A3F", tangrowth: "#3E9E5C",
  electivire: "#F0C030", magmortar: "#E8622F", togekiss: "#F0D9A0",
  gliscor: "#8C5AA0", mamoswine: "#8C6A4F", gallade: "#4F9AB0",
  froslass: "#7DBDD9", dialga: "#5C6F8C", palkia: "#B08CC7",
  giratina: "#8C6A4F", arceus: "#D9C29C",
  serperior: "#3E9E5C", emboar: "#E8622F", samurott: "#3E6FA0",
  zebstrika: "#4F4F6F", excadrill: "#B0A08C", zoroark: "#8C5A3C",
  sigilyph: "#5CAFC7", braviary: "#B8763F", mandibuzz: "#7A5C99",
  volcarona: "#E8622F", reuniclus: "#B08CC7", haxorus: "#4F6F8C",
  eelektross: "#4F4F6F", chandelure: "#7A5C99", hydreigon: "#4F4F6F",
  reshiram: "#E8E8E8", zekrom: "#4F4F6F", kyurem: "#7DBDD9",
  greninja: "#3E6FA0", talonflame: "#E8622F", sylveon: "#F0A6C4",
  goodra: "#8C5AA0", aegislash: "#8C8C9C", malamar: "#7A5C99",
  dragalge: "#8C5AA0", noivern: "#7A5C99", xerneas: "#5CAFC7",
  yveltal: "#8C3C3C", zygarde: "#4F9A4F", diancie: "#E8A6C4", hoopa: "#7A5C99",
  decidueye: "#4F9A5C", incineroar: "#E8622F", primarina: "#5CAFC7",
  toucannon: "#E8622F", lycanroc: "#B8763F", mimikyu: "#5C4A6F",
  "kommo-o": "#4F6F8C", tsareena: "#E8622F", toxapex: "#8C5AA0",
  golisopod: "#3E6FA0", silvally: "#B0A08C", "tapu-koko": "#F0C030",
  solgaleo: "#D9C29C", lunala: "#7A5C99", necrozma: "#5C4A6F",
  marshadow: "#8C3C3C", zeraora: "#F0C030",
  rillaboom: "#4F9A4F", cinderace: "#E8622F", inteleon: "#3E6FA0",
  corviknight: "#4F5F7C", orbeetle: "#7A5C99", dragapult: "#7A5C99",
  eiscue: "#7DBDD9", duraludon: "#8C8C9C", grimmsnarl: "#5C4A6F",
  hatterene: "#E8A6C4", zacian: "#5CAFC7", zamazenta: "#8C3C3C",
  eternatus: "#7A5C99", urshifu: "#8C3C3C", regieleki: "#F0D94F",
  calyrex: "#E8A6C4",
  meowscarada: "#8C5AA0", skeledirge: "#E8622F", quaquaval: "#3E6FA0",
  lechonk: "#E8A6C4", gholdengo: "#E8C830", ceruledge: "#8C3C3C",
  armarouge: "#E8622F", tinkaton: "#E8A6C4", baxcalibur: "#5CAFC7",
  glimmora: "#8C5AA0", dondozo: "#3E6FA0", palafin: "#5CAFC7",
  koraidon: "#C85030", miraidon: "#5CAFC7",
  // extra base species needed only for mega/gmax lookups
  beedrill: "#E8C830", pidgeot: "#B8763F",
  latias: "#E8A6C4", latios: "#5C6F8C", lopunny: "#E8D9C2", sableye: "#5C4A6F",
  meowth: "#E8C830", garbodor: "#7A5C99", melmetal: "#B0A08C",
  drednaw: "#3E6FA0", coalossal: "#B8763F", flapple: "#8C3C3C",
  appletun: "#4F9A4F", sandaconda: "#E8A33D", toxtricity: "#F0D94F",
  centiskorch: "#E8622F", alcremie: "#F0A6C4", copperajah: "#B8763F",
  slowpoke: "#F2A6B0", mawile: "#E8A6C4", aggron: "#8C8C9C",
  medicham: "#E8A6C4", manectric: "#F0C030", sharpedo: "#4F5F9C",
  camerupt: "#C85030", altaria: "#7DBDD9", banette: "#5C4A6F",
  audino: "#F0A6C4", abomasnow: "#E8E8E8", steelix: "#8C8C9C",
  // mega X/Y variants shift color noticeably from their base form
  "charizard-mega-x": "#37474F", "charizard-mega-y": "#F5793C",
  "mewtwo-mega-x": "#5C6FB0", "mewtwo-mega-y": "#B08CC7",
};

const COLOR_FALLBACK_PALETTE = [
  "#5FBD58", "#F08030", "#4F91D9", "#F8D030", "#8C5AA0",
  "#F4B6C2", "#8C6A4F", "#8C8C9C", "#7A5C99", "#E8E8E8",
];

function getColor(key) {
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return COLOR_FALLBACK_PALETTE[hash % COLOR_FALLBACK_PALETTE.length];
}

const ROOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/* ---------------------------------------------------------------------- */
/*  HELPERS                                                                */
/* ---------------------------------------------------------------------- */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const key of Object.keys(weights)) {
    if (r < weights[key]) return key;
    r -= weights[key];
  }
  return Object.keys(weights)[0];
}

function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function makeRoomCode() {
  let out = "";
  for (let i = 0; i < 5; i++) out += ROOM_CHARS[randInt(0, ROOM_CHARS.length - 1)];
  return out;
}

function generateSlot(usedKeys) {
  const variant = pickWeighted({ normal: 45, shiny: 20, mega: 15, gmax: 10, dynamax: 10 });

  if (variant === "mega") {
    let slug, tries = 0;
    do { slug = MEGA_SLUGS[randInt(0, MEGA_SLUGS.length - 1)]; tries++; } while (usedKeys.has(slug) && tries < 12);
    usedKeys.add(slug);
    const base = slug.replace(/-mega(-[xy])?$/, "");
    const tag = slug.includes("mega-x") ? "Mega X" : slug.includes("mega-y") ? "Mega Y" : "Mega";
    return { name: titleCase(base), tag, variantType: "mega", color: getColor(slug) || getColor(base) };
  }

  if (variant === "gmax") {
    let slug, tries = 0;
    do { slug = GMAX_SLUGS[randInt(0, GMAX_SLUGS.length - 1)]; tries++; } while (usedKeys.has(slug) && tries < 12);
    usedKeys.add(slug);
    const base = slug.replace(/-gmax$/, "");
    return { name: titleCase(base), tag: "Gigantamax", variantType: "gmax", color: getColor(base) };
  }

  // normal / shiny / dynamax all draw from the curated cross-generation roster
  let entry, tries = 0;
  do { entry = POKEMON_POOL[randInt(0, POKEMON_POOL.length - 1)]; tries++; } while (usedKeys.has(entry.slug) && tries < 12);
  usedKeys.add(entry.slug);
  const isShiny = variant === "shiny";
  return {
    name: entry.name,
    tag: isShiny ? "Shiny" : variant === "dynamax" ? "Dynamax" : "",
    variantType: variant,
    color: getColor(entry.slug),
  };
}

function generateTwelve() {
  const used = new Set();
  const list = [];
  for (let i = 0; i < 12; i++) {
    const slot = generateSlot(used);
    list.push({ ...slot, slotId: i });
  }
  return list;
}

/* ---------------------------------------------------------------------- */
/*  STORAGE                                                                 */
/* ---------------------------------------------------------------------- */

async function readRoom(code) {
  try {
    const res = await window.storage.get(`pkdraft_room_${code}`, true);
    return res ? JSON.parse(res.value) : null;
  } catch (e) {
    return null;
  }
}

async function writeRoomState(code, state) {
  try {
    await window.storage.set(`pkdraft_room_${code}`, JSON.stringify(state), true);
  } catch (e) {
    console.error("storage write failed", e);
  }
  return state;
}

async function saveIdentity(identity) {
  try {
    await window.storage.set("pkdraft_identity", JSON.stringify(identity), false);
  } catch (e) {}
}

async function loadIdentity() {
  try {
    const res = await window.storage.get("pkdraft_identity", false);
    return res ? JSON.parse(res.value) : null;
  } catch (e) {
    return null;
  }
}

/* ---------------------------------------------------------------------- */
/*  GAME LOGIC (pure, works on a room-state object)                        */
/* ---------------------------------------------------------------------- */

function freshRoom(code, hostName) {
  return {
    code,
    createdAt: Date.now(),
    players: [
      { name: hostName, joined: true },
      { name: null, joined: false },
    ],
    status: "lobby", // lobby | playing | finished
    pokemons: null,
    currentIndex: 0,
    moneys: [20, 20],
    boxes: [[], []],
    stage: "idle", // idle | bidding | resolution | complete
    bid: null, // { amount, leader, turn, starter }
    resolution: null, // { actor }
    log: [],
    rev: 0,
  };
}

function isMaxedOut(room, p) {
  return room.moneys[p] <= 0 || room.boxes[p].length >= 6;
}

function pushLog(room, text) {
  room.log = [...room.log, text].slice(-40);
}

function startPokemonStage(room) {
  // called after currentIndex has been advanced (or at game start)
  if (room.currentIndex >= 12) {
    room.stage = "complete";
    room.status = "finished";
    return;
  }
  const p0maxed = isMaxedOut(room, 0);
  const p1maxed = isMaxedOut(room, 1);
  if (p0maxed && p1maxed) {
    room.stage = "complete";
    room.status = "finished";
    pushLog(room, "Both players are done — remaining Pokémon go unclaimed.");
    return;
  }
  if (p0maxed || p1maxed) {
    room.stage = "resolution";
    room.resolution = { actor: p0maxed ? 1 : 0 };
    room.bid = null;
    return;
  }
  const starter = room.currentIndex % 2;
  room.stage = "bidding";
  room.bid = { amount: 1, leader: starter, turn: 1 - starter, starter };
  room.resolution = null;
}

function awardCurrentPokemon(room, winner, amount) {
  const mon = room.pokemons[room.currentIndex];
  room.moneys[winner] -= amount;
  room.boxes[winner] = [...room.boxes[winner], mon];
  pushLog(
    room,
    `${room.players[winner].name} won ${mon.name}${mon.tag ? " (" + mon.tag + ")" : ""} for $${amount}.`
  );
  room.currentIndex += 1;
  startPokemonStage(room);
}

function resolveGiveOrTake(room, choice) {
  const mon = room.pokemons[room.currentIndex];
  const actor = room.resolution.actor;
  const other = 1 - actor;
  const target = choice === "give" ? other : actor;
  room.boxes[target] = [...room.boxes[target], mon];
  pushLog(
    room,
    choice === "give"
      ? `${room.players[actor].name} gave ${mon.name}${mon.tag ? " (" + mon.tag + ")" : ""} to ${room.players[other].name}.`
      : `${room.players[actor].name} kept ${mon.name}${mon.tag ? " (" + mon.tag + ")" : ""}.`
  );
  room.currentIndex += 1;
  if (room.currentIndex >= 12) {
    room.stage = "complete";
    room.status = "finished";
    return;
  }
  // stay in resolution mode (actor may now also be full/broke -> handled by UI disabling buttons)
  if (room.boxes[actor].length >= 6 && room.boxes[other].length >= 6) {
    room.stage = "complete";
    room.status = "finished";
    return;
  }
}

/* ---------------------------------------------------------------------- */
/*  BOT AI                                                                  */
/* ---------------------------------------------------------------------- */

function botValue(mon) {
  const base = { normal: 4, shiny: 9, mega: 13, gmax: 13, dynamax: 7 }[mon.variantType] ?? 4;
  const jitter = (mon.slotId * 37) % 5; // deterministic 0-4 spread so the bot isn't purely tier-based
  return base + jitter;
}

// Bot is always seat index 1.
function botDecideBid(room) {
  const mon = room.pokemons[room.currentIndex];
  const value = botValue(mon);
  const money = room.moneys[1];
  const nextBid = room.bid.amount + 1;
  const slotsLeft = 6 - room.boxes[1].length;
  if (slotsLeft <= 0 || nextBid > money) return { action: "pass" };
  const urgency = slotsLeft <= 2 ? 4 : 0; // spend a bit more freely when short on roster space
  const maxSpend = Math.max(2, Math.floor(money * 0.5) + urgency);
  const willing = Math.min(money, value + urgency);
  if (nextBid <= willing && nextBid <= maxSpend) {
    if (nextBid > 3 && Math.random() < 0.1) return { action: "pass" }; // occasional early bailout for unpredictability
    return { action: "raise", amount: nextBid };
  }
  return { action: "pass" };
}

function botDecideResolution(room) {
  const mon = room.pokemons[room.currentIndex];
  const value = botValue(mon);
  const botSlotsLeft = 6 - room.boxes[1].length;
  const otherSlotsLeft = 6 - room.boxes[0].length;
  if (botSlotsLeft <= 0) return "give";
  if (otherSlotsLeft <= 0) return "take";
  return value >= 9 ? "take" : "give";
}

/* ---------------------------------------------------------------------- */
/*  UI SUBCOMPONENTS                                                       */
/* ---------------------------------------------------------------------- */

function MoneyTag({ amount }) {
  return <span className="money">${amount}</span>;
}

function PlayerBox({ name, money, box, active, side }) {
  return (
    <div className={`playerbox side-${side} ${active ? "active" : ""}`}>
      <div className="playerbox-head">
        <span className="pname">{name || "Waiting…"}</span>
        <MoneyTag amount={money} />
      </div>
      <div className="slots">
        {Array.from({ length: 6 }).map((_, i) => {
          const mon = box[i];
          return (
            <div className={`slot ${mon ? "filled" : ""}`} key={i}>
              {mon ? (
                <>
                  <span className="slot-name" style={{ color: mon.color }}>
                    {mon.name}
                  </span>
                  {mon.tag ? (
                    <span className={`slot-tag vb-${mon.variantType}`}>{mon.tag}</span>
                  ) : null}
                </>
              ) : (
                <div className="slot-empty">{i + 1}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN APP                                                                */
/* ---------------------------------------------------------------------- */

export default function PokemonDraftApp() {
  const [screen, setScreen] = useState("landing"); // landing | lobby | game
  const [mode, setMode] = useState("create"); // create | join (landing sub-tab)
  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState(null);
  const [playerIndex, setPlayerIndex] = useState(null);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bidDraft, setBidDraft] = useState(1);
  const [copyOk, setCopyOk] = useState(false);
  const [isBotMode, setIsBotMode] = useState(false);
  const pollRef = useRef(null);
  const botActedRef = useRef(null);

  // try to restore identity on mount
  useEffect(() => {
    (async () => {
      const id = await loadIdentity();
      if (id?.code) {
        const r = await readRoom(id.code);
        if (r) {
          setCode(id.code);
          setPlayerIndex(id.playerIndex);
          setRoom(r);
          setScreen(r.status === "lobby" ? "lobby" : "game");
        }
      }
    })();
  }, []);

  // polling (multiplayer only — bot games run purely on local state)
  useEffect(() => {
    if (!code || isBotMode) return;
    pollRef.current = setInterval(async () => {
      const r = await readRoom(code);
      if (r) {
        setRoom(r);
        if (r.status !== "lobby" && screen === "lobby") setScreen("game");
      }
    }, 1200);
    return () => clearInterval(pollRef.current);
  }, [code, screen]);

  useEffect(() => {
    if (room?.stage === "bidding" && room.bid) {
      setBidDraft(room.bid.amount + 1);
    }
  }, [room?.stage, room?.bid?.amount, room?.currentIndex]);

  const mutateRoom = useCallback(
    async (mutator) => {
      if (isBotMode) {
        setRoom((prev) => {
          if (!prev) return prev;
          const draft = JSON.parse(JSON.stringify(prev));
          draft.rev = (draft.rev || 0) + 1;
          mutator(draft);
          return draft;
        });
        return;
      }
      if (!code) return;
      setBusy(true);
      const latest = (await readRoom(code)) || room;
      const draft = JSON.parse(JSON.stringify(latest));
      draft.rev = (draft.rev || 0) + 1;
      mutator(draft);
      await writeRoomState(code, draft);
      setRoom(draft);
      setBusy(false);
    },
    [code, room, isBotMode]
  );

  // bot's turn to act — bidding or give/take decisions
  useEffect(() => {
    if (!isBotMode || !room) return;
    if (room.stage === "bidding" && room.bid && room.bid.turn === 1) {
      const key = `bid-${room.currentIndex}-${room.bid.amount}`;
      if (botActedRef.current === key) return;
      botActedRef.current = key;
      const t = setTimeout(() => {
        mutateRoom((draft) => {
          if (draft.stage !== "bidding" || !draft.bid || draft.bid.turn !== 1) return;
          const decision = botDecideBid(draft);
          if (decision.action === "raise") {
            draft.bid.amount = decision.amount;
            draft.bid.leader = 1;
            draft.bid.turn = 0;
          } else {
            awardCurrentPokemon(draft, draft.bid.leader, draft.bid.amount);
          }
        });
      }, 700 + Math.random() * 900);
      return () => clearTimeout(t);
    }
    if (room.stage === "resolution" && room.resolution && room.resolution.actor === 1) {
      const key = `res-${room.currentIndex}`;
      if (botActedRef.current === key) return;
      botActedRef.current = key;
      const t = setTimeout(() => {
        mutateRoom((draft) => {
          if (draft.stage !== "resolution" || !draft.resolution || draft.resolution.actor !== 1) return;
          const choice = botDecideResolution(draft);
          resolveGiveOrTake(draft, choice);
        });
      }, 700 + Math.random() * 900);
      return () => clearTimeout(t);
    }
  }, [isBotMode, room, mutateRoom]);

  async function handleCreate() {
    setError("");
    const name = nameInput.trim() || "Player 1";
    const newCode = makeRoomCode();
    const initial = freshRoom(newCode, name);
    await writeRoomState(newCode, initial);
    await saveIdentity({ code: newCode, playerIndex: 0 });
    setCode(newCode);
    setPlayerIndex(0);
    setRoom(initial);
    setScreen("lobby");
  }

  async function handleJoin() {
    setError("");
    const cd = codeInput.trim().toUpperCase();
    const name = nameInput.trim() || "Player 2";
    if (!cd) {
      setError("Enter a room code.");
      return;
    }
    const existing = await readRoom(cd);
    if (!existing) {
      setError("Room not found. Double-check the code.");
      return;
    }
    if (existing.players[1].joined) {
      setError("That room already has two players.");
      return;
    }
    existing.players[1] = { name, joined: true };
    existing.rev = (existing.rev || 0) + 1;
    await writeRoomState(cd, existing);
    await saveIdentity({ code: cd, playerIndex: 1 });
    setCode(cd);
    setPlayerIndex(1);
    setRoom(existing);
    setScreen("lobby");
  }

  async function handleStartBotGame() {
    setError("");
    const name = nameInput.trim() || "You";
    setBusy(true);
    const pokemons = await generateTwelve();
    const initial = freshRoom("SOLO", name);
    initial.players[1] = { name: "Rival Bot", joined: true };
    initial.status = "playing";
    initial.pokemons = pokemons;
    initial.log = [`The auction has begun! ${name} vs. the Rival Bot.`];
    startPokemonStage(initial);
    botActedRef.current = null;
    setIsBotMode(true);
    setCode(null);
    setPlayerIndex(0);
    setRoom(initial);
    setScreen("game");
    setBusy(false);
  }

  async function handleStartGame() {
    setBusy(true);
    const pokemons = await generateTwelve();
    await mutateRoom((draft) => {
      draft.status = "playing";
      draft.pokemons = pokemons;
      draft.currentIndex = 0;
      draft.moneys = [20, 20];
      draft.boxes = [[], []];
      draft.log = ["The auction has begun!"];
      startPokemonStage(draft);
    });
    setScreen("game");
    setBusy(false);
  }

  async function handlePlayAgain() {
    setBusy(true);
    botActedRef.current = null;
    const pokemons = await generateTwelve();
    await mutateRoom((draft) => {
      draft.status = "playing";
      draft.pokemons = pokemons;
      draft.currentIndex = 0;
      draft.moneys = [20, 20];
      draft.boxes = [[], []];
      draft.log = ["A new auction has begun!"];
      startPokemonStage(draft);
    });
    setBusy(false);
  }

  function handleRaise() {
    const amt = Math.floor(Number(bidDraft));
    if (!room || room.stage !== "bidding") return;
    const me = playerIndex;
    if (room.bid.turn !== me) return;
    if (!Number.isFinite(amt) || amt <= room.bid.amount) {
      setError(`Bid must be at least $${room.bid.amount + 1}.`);
      return;
    }
    if (amt > room.moneys[me]) {
      setError("You don't have that much left.");
      return;
    }
    setError("");
    mutateRoom((draft) => {
      draft.bid.amount = amt;
      draft.bid.leader = me;
      draft.bid.turn = 1 - me;
    });
  }

  function handlePass() {
    if (!room || room.stage !== "bidding") return;
    const me = playerIndex;
    if (room.bid.turn !== me) return;
    mutateRoom((draft) => {
      const winner = draft.bid.leader;
      const amount = draft.bid.amount;
      awardCurrentPokemon(draft, winner, amount);
    });
  }

  function handleResolutionChoice(choice) {
    if (!room || room.stage !== "resolution") return;
    if (room.resolution.actor !== playerIndex) return;
    mutateRoom((draft) => {
      resolveGiveOrTake(draft, choice);
    });
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    } catch (e) {}
  }

  function leaveRoom() {
    clearInterval(pollRef.current);
    setScreen("landing");
    setCode(null);
    setRoom(null);
    setPlayerIndex(null);
    setIsBotMode(false);
    botActedRef.current = null;
    if (!isBotMode) saveIdentity({});
  }

  /* ---------------------------- render ---------------------------- */

  return (
    <div className="app">
      <style>{CSS}</style>

      {screen === "landing" && (
        <div className="landing">
          <div className="landing-hero">
            <div className="eyebrow">◆ LIVE AUCTION FLOOR ◆</div>
            <h1>
              POKÉ<span className="accent">DRAFT</span>
            </h1>
            <p className="tagline">
              Twelve Pokémon. Two bidders. Twenty dollars apiece. Whoever reads the room best
              walks away with the best team.
            </p>
          </div>

          <div className="landing-card">
            <div className="tabs">
              <button className={mode === "create" ? "tab active" : "tab"} onClick={() => setMode("create")}>
                Host a room
              </button>
              <button className={mode === "join" ? "tab active" : "tab"} onClick={() => setMode("join")}>
                Join a room
              </button>
              <button className={mode === "bot" ? "tab active" : "tab"} onClick={() => setMode("bot")}>
                Play vs Bot
              </button>
            </div>

            <label className="field">
              <span>Your name</span>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ash, Misty, Gary…"
                maxLength={20}
              />
            </label>

            {mode === "join" && (
              <label className="field">
                <span>Room code</span>
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. K7QRX"
                  maxLength={5}
                  className="mono"
                />
              </label>
            )}

            {mode === "bot" && (
              <p className="hint left">
                No friend online? Face the Rival Bot instead — same $20 budget, same twelve
                Pokémon, and it bids and trades on its own.
              </p>
            )}

            {error && <div className="error">{error}</div>}

            {mode === "create" && (
              <button className="primary" onClick={handleCreate} disabled={busy}>
                Create Room
              </button>
            )}
            {mode === "join" && (
              <button className="primary" onClick={handleJoin} disabled={busy}>
                Join Room
              </button>
            )}
            {mode === "bot" && (
              <button className="primary" onClick={handleStartBotGame} disabled={busy}>
                {busy ? "Loading Pokémon…" : "Start Solo Auction"}
              </button>
            )}
          </div>
        </div>
      )}

      {screen === "lobby" && room && (
        <div className="lobby">
          <div className="eyebrow">◆ ROOM LOBBY ◆</div>
          <h2>Waiting Room</h2>
          <div className="code-plate" onClick={copyCode} title="Click to copy">
            <span className="mono big">{code}</span>
            <span className="copy-hint">{copyOk ? "Copied!" : "tap to copy"}</span>
          </div>
          <div className="lobby-players">
            <div className={`lobby-slot ${room.players[0].joined ? "in" : ""}`}>
              <span className="dot" /> {room.players[0].name || "Waiting…"}
            </div>
            <div className={`lobby-slot ${room.players[1].joined ? "in" : ""}`}>
              <span className="dot" /> {room.players[1].name || "Waiting for player 2…"}
            </div>
          </div>

          {playerIndex === 0 ? (
            <button
              className="primary"
              disabled={!room.players[1].joined || busy}
              onClick={handleStartGame}
            >
              {room.players[1].joined ? "Start Auction" : "Waiting for player 2…"}
            </button>
          ) : (
            <p className="hint">Waiting for the host to start the auction…</p>
          )}
          <button className="ghost" onClick={leaveRoom}>
            Leave room
          </button>
        </div>
      )}

      {screen === "game" && room && room.pokemons && (
        <GameScreen
          room={room}
          me={playerIndex}
          isBotMode={isBotMode}
          bidDraft={bidDraft}
          setBidDraft={setBidDraft}
          onRaise={handleRaise}
          onPass={handlePass}
          onResolve={handleResolutionChoice}
          onPlayAgain={handlePlayAgain}
          onLeave={leaveRoom}
          error={error}
          busy={busy}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  GAME SCREEN                                                            */
/* ---------------------------------------------------------------------- */

function GameScreen({ room, me, isBotMode, bidDraft, setBidDraft, onRaise, onPass, onResolve, onPlayAgain, onLeave, error, busy }) {
  const mon = room.pokemons[room.currentIndex] || null;
  const round = Math.min(room.currentIndex + 1, 12);
  const myTurn = room.stage === "bidding" && room.bid && room.bid.turn === me;
  const myResolveTurn = room.stage === "resolution" && room.resolution.actor === me;
  const other = 1 - me;

  return (
    <div className="game">
      <div className="game-top">
        <div className="room-pill mono">{isBotMode ? "SOLO MODE" : room.code}</div>
        <div className="round-pill">
          ROUND {round} <span className="of">/ 12</span>
        </div>
        <button className="ghost small" onClick={onLeave}>
          Exit
        </button>
      </div>

      <div className="stage">
        {room.stage !== "complete" && mon ? (
          <div className="reveal-card" key={room.currentIndex}>
            <div className={`variant-badge vb-${mon.variantType}`}>{mon.tag || "Standard"}</div>
            <div className="reveal-name" style={{ color: mon.color }}>
              {mon.name}
            </div>

            {room.stage === "bidding" && room.bid && (
              <div className="bid-panel">
                <div className="bid-current">
                  Current bid <MoneyTag amount={room.bid.amount} /> — leader{" "}
                  <strong>{room.players[room.bid.leader].name}</strong>
                </div>
                {myTurn ? (
                  <div className="bid-controls">
                    <div className="stepper">
                      <button
                        onClick={() => setBidDraft((v) => Math.max(room.bid.amount + 1, v - 1))}
                      >
                        −
                      </button>
                      <span className="mono">${bidDraft}</span>
                      <button
                        onClick={() =>
                          setBidDraft((v) => Math.min(room.moneys[me], v + 1))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button className="primary small" disabled={busy} onClick={onRaise}>
                      Raise to ${bidDraft}
                    </button>
                    <button className="ghost small" disabled={busy} onClick={onPass}>
                      Pass (give it to {room.players[room.bid.leader].name})
                    </button>
                  </div>
                ) : (
                  <div className="waiting-line">
                    Waiting on <strong>{room.players[room.bid.turn].name}</strong> to bid or pass…
                  </div>
                )}
              </div>
            )}

            {room.stage === "resolution" && (
              <div className="bid-panel">
                <div className="bid-current">
                  {room.players[1 - room.resolution.actor].name} is out — {room.players[room.resolution.actor].name} decides this one.
                </div>
                {myResolveTurn ? (
                  <div className="bid-controls">
                    <button
                      className="primary small"
                      disabled={busy || room.boxes[other].length >= 6}
                      onClick={() => onResolve("give")}
                    >
                      Give to {room.players[other].name}
                    </button>
                    <button
                      className="ghost small"
                      disabled={busy || room.boxes[me].length >= 6}
                      onClick={() => onResolve("take")}
                    >
                      Keep it myself
                    </button>
                  </div>
                ) : (
                  <div className="waiting-line">
                    Waiting on <strong>{room.players[room.resolution.actor].name}</strong> to decide…
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="reveal-card complete">
            <div className="stamp">SOLD OUT</div>
            <div className="reveal-name">Auction complete!</div>
            {me === 0 && (
              <button className="primary" onClick={onPlayAgain} disabled={busy}>
                Play again
              </button>
            )}
          </div>
        )}
        {error && <div className="error center">{error}</div>}
      </div>

      <div className="boxes">
        <PlayerBox
          name={room.players[0].name}
          money={room.moneys[0]}
          box={room.boxes[0]}
          side="left"
          active={me === 0}
        />
        <PlayerBox
          name={room.players[1].name}
          money={room.moneys[1]}
          box={room.boxes[1]}
          side="right"
          active={me === 1}
        />
      </div>

      <div className="ledger">
        <div className="ledger-title">Auction Ledger</div>
        <div className="ledger-body">
          {room.log.slice().reverse().map((l, i) => (
            <div className="ledger-line" key={i}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  STYLES                                                                  */
/* ---------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

* { box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 0%, #1c2350 0%, #12172b 55%, #0d1120 100%);
  color: #F3EFE3;
  font-family: 'Inter', sans-serif;
  padding: 24px 16px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mono { font-family: 'JetBrains Mono', monospace; }

.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #F4B740;
  margin-bottom: 8px;
  text-align: center;
}

/* ---------------- landing ---------------- */
.landing { width: 100%; max-width: 460px; display: flex; flex-direction: column; align-items: center; }
.landing-hero { text-align: center; margin-bottom: 28px; }
.landing-hero h1 {
  font-family: 'Teko', sans-serif;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0;
  line-height: 1;
  color: #F3EFE3;
}
.landing-hero .accent { color: #E8483A; }
.tagline { color: #8791B5; font-size: 14px; margin-top: 10px; line-height: 1.5; }

.landing-card {
  width: 100%;
  background: #1B2140;
  border: 1px solid #2b3260;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tabs { display: flex; gap: 6px; margin-bottom: 4px; }
.tab {
  flex: 1;
  padding: 10px 6px;
  background: #12172b;
  border: 1px solid #2b3260;
  color: #8791B5;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}
.tab.active { background: #E8483A; color: white; border-color: #E8483A; }

.field { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #8791B5; }
.field input {
  background: #12172b;
  border: 1px solid #2b3260;
  border-radius: 10px;
  padding: 12px;
  color: #F3EFE3;
  font-size: 15px;
  outline: none;
}
.field input:focus { border-color: #F4B740; }

button.primary {
  background: #E8483A;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
}
button.primary:disabled { opacity: 0.4; cursor: not-allowed; }
button.primary.small { padding: 10px 14px; font-size: 13px; border-radius: 10px; }

button.ghost {
  background: transparent;
  border: 1px solid #2b3260;
  color: #8791B5;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}
button.ghost.small { padding: 8px 12px; font-size: 13px; margin-top: 0; }

.error { color: #ff8b7c; font-size: 13px; background: rgba(232,72,58,0.1); padding: 8px 10px; border-radius: 8px; }
.error.center { margin-top: 12px; text-align: center; }

/* ---------------- lobby ---------------- */
.lobby { width: 100%; max-width: 420px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.lobby h2 { font-family: 'Teko', sans-serif; font-size: 40px; margin: 0 0 18px; }
.code-plate {
  background: #1B2140; border: 1px dashed #F4B740; border-radius: 14px;
  padding: 18px 28px; margin-bottom: 22px; cursor: pointer;
}
.code-plate .big { font-size: 32px; letter-spacing: 0.2em; color: #F4B740; display: block; }
.copy-hint { font-size: 11px; color: #8791B5; }
.lobby-players { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.lobby-slot {
  display: flex; align-items: center; gap: 10px; background: #1B2140; border: 1px solid #2b3260;
  border-radius: 10px; padding: 12px 14px; color: #8791B5; font-weight: 600;
}
.lobby-slot.in { color: #F3EFE3; border-color: #2FBFA6; }
.lobby-slot .dot { width: 8px; height: 8px; border-radius: 50%; background: #2b3260; }
.lobby-slot.in .dot { background: #2FBFA6; }
.hint { color: #8791B5; font-size: 13px; }
.hint.left { text-align: left; line-height: 1.5; margin: -2px 0 0; }

/* ---------------- game ---------------- */
.game { width: 100%; max-width: 720px; display: flex; flex-direction: column; gap: 18px; }
.game-top { display: flex; align-items: center; justify-content: space-between; }
.room-pill, .round-pill {
  background: #1B2140; border: 1px solid #2b3260; border-radius: 999px; padding: 6px 14px; font-size: 12px;
}
.round-pill { font-family: 'Teko', sans-serif; font-size: 18px; letter-spacing: 0.05em; }
.round-pill .of { color: #8791B5; }

.stage { display: flex; flex-direction: column; align-items: center; }
.reveal-card {
  width: 100%; max-width: 380px; background: #1B2140; border: 1px solid #2b3260; border-radius: 20px;
  padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center;
  animation: flipin 0.5s ease;
  position: relative;
}
@keyframes flipin { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }

.variant-badge {
  font-family: 'Teko', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 0.08em;
  padding: 8px 22px; border-radius: 999px; margin-bottom: 18px; text-transform: uppercase;
  background: #2b3260; color: #F3EFE3; box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
}
.vb-shiny { background: #F4B740; color: #12172b; box-shadow: 0 0 22px rgba(244,183,64,0.55); }
.vb-mega { background: #E8483A; color: white; box-shadow: 0 0 22px rgba(232,72,58,0.55); }
.vb-gmax { background: #6c4bd6; color: white; box-shadow: 0 0 22px rgba(108,75,214,0.55); }
.vb-dynamax { background: #2FBFA6; color: #12172b; box-shadow: 0 0 22px rgba(47,191,166,0.5); }

.reveal-name { font-family: 'Teko', sans-serif; font-size: 56px; font-weight: 700; line-height: 1; margin: 4px 0 6px; letter-spacing: 0.01em; }

.bid-panel { width: 100%; margin-top: 16px; border-top: 1px solid #2b3260; padding-top: 16px; }
.bid-current { font-size: 14px; margin-bottom: 12px; color: #8791B5; }
.bid-current strong { color: #F3EFE3; }
.bid-controls { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.stepper { display: flex; align-items: center; gap: 14px; background: #12172b; border-radius: 12px; padding: 6px 14px; }
.stepper button { background: none; border: none; color: #F4B740; font-size: 20px; cursor: pointer; }
.stepper span { font-size: 18px; min-width: 44px; }
.waiting-line { font-size: 13px; color: #8791B5; }

.reveal-card.complete { gap: 10px; }
.stamp {
  font-family: 'Teko', sans-serif; font-size: 30px; color: #E8483A; border: 3px solid #E8483A;
  padding: 4px 16px; border-radius: 8px; transform: rotate(-6deg); letter-spacing: 0.1em;
}

.money { font-family: 'JetBrains Mono', monospace; color: #F4B740; font-weight: 700; }

.boxes { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.playerbox {
  flex: 1; min-width: 260px; background: #1B2140; border: 1px solid #2b3260; border-radius: 16px; padding: 14px;
}
.playerbox.active { border-color: #F4B740; }
.playerbox.side-left { border-left: 3px solid #E8483A; }
.playerbox.side-right { border-left: 3px solid #2FBFA6; }
.playerbox-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pname { font-weight: 700; }
.slots { display: flex; flex-direction: column; gap: 6px; }
.slot { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #12172b; border-radius: 10px; padding: 10px 12px; min-height: 40px; }
.slot-name { font-family: 'Teko', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: 0.01em; }
.slot-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; padding: 3px 8px; border-radius: 999px; background: #2b3260; color: #F3EFE3; flex-shrink: 0;
}
.slot-empty { color: #3a4172; font-size: 12px; width: 100%; text-align: center; }
.slot.filled { background: #202857; }

.ledger { background: #1B2140; border: 1px solid #2b3260; border-radius: 14px; padding: 14px; }
.ledger-title { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.1em; color: #F4B740; margin-bottom: 8px; }
.ledger-body { display: flex; flex-direction: column; gap: 4px; max-height: 140px; overflow-y: auto; }
.ledger-line { font-size: 12px; color: #8791B5; }

@media (max-width: 480px) {
  .landing-hero h1 { font-size: 48px; }
  .reveal-name { font-size: 42px; }
}
`;
