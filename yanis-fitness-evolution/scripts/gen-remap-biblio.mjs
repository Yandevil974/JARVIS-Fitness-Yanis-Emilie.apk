// Rattrapage 03/10/2026 (BUG 1) : les 74 exercices dont le visuel provenait
// des illustrations anatomiques legacy reçoivent un GIF humain du corpus
// livré — même muscle + même pattern, en préférant même matériel et mots du
// nom partagés. Aucun fichier média n'est créé ni modifié.
// Usage : node scripts/gen-remap-biblio.mjs [--apply]
import { writeFileSync, readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { GIF_OVERRIDES } from "../src/data/gif-overrides.js";
import { norm } from "../src/engine/utils.js";

const humains = new Set(Object.values(GIF_OVERRIDES));
const STOP = new Set([
  "barre", "halteres", "haltère", "haltères", "banc", "poulie", "machine",
  "elastique", "assis", "debout", "incline", "plat", "un", "bras", "avec",
  "sans", "pour", "test", "prise",
]);
const mots = (n) =>
  norm(n)
    .split(" ")
    .filter((w) => w.length > 3 && !STOP.has(w));

// Termes caractéristiques d'un pattern : bonus fort si le GIF candidat les
// porte (évite « mountain climbers → respiration », « dips → développé »…).
const PAT_TERMS = {
  crunch: ["crunch", "abdo", "releve", "gainage", "circuit"],
  static: ["gainage", "planche", "pallof", "bird", "dead", "circuit"],
  triceps: ["triceps", "pushdown", "french", "extension"],
  curl: ["curl", "marteau", "scott", "biceps"],
  press: ["developpe", "pompes", "presse"],
  pull: ["tirage", "traction", "pullover", "pull"],
  row: ["rowing", "tirage"],
  hinge: ["souleve", "terre", "good", "back extension"],
  squat: ["squat", "presse", "leg press"],
  lunge: ["fente", "split", "step"],
  bridge: ["thrust", "pont", "glute", "bridge"],
  abduction: ["abduction", "kickback", "clamshell"],
  legcurl: ["leg curl", "ischio"],
  legext: ["leg extension", "extension"],
  calf: ["mollet"],
  lat: ["elevation", "ecarte", "lateral"],
  raise: ["militaire", "elevation"],
};

const legacy = EXERCISES.filter((e) => e.gif && !humains.has(e.gif));
const pool = EXERCISES.filter((e) => humains.has(e.gif));

// Choix manuels vérifiés à l'œil (famille core / poids du corps) quand
// l'auto-appariement muscle+pattern n'offre qu'un candidat lointain :
// le circuit gainage montre planche + planche latérale + bird dog au sol,
// les pompes sont le plus proche visuel humain des dips.
const CURATED = Object.fromEntries(
  Object.entries({
    "mountain climbers": "Circuit gainage (planche + latéral + bird dog)",
    "dead bug": "Circuit gainage (planche + latéral + bird dog)",
    "dead bug avec rotation": "Circuit gainage (planche + latéral + bird dog)",
    "bird dog": "Circuit gainage (planche + latéral + bird dog)",
    "gainage latéral": "Circuit gainage (planche + latéral + bird dog)",
    "gainage latéral dynamique": "Circuit gainage (planche + latéral + bird dog)",
    "dips": "Pompes",
  }).map(([k, v]) => [norm(k), v]),
);

const remap = {};
const lignes = [];
for (const e of legacy) {
  const me = mots(e.name);
  let best = null,
    bestScore = -1;
  const cur = CURATED[norm(e.name)];
  if (cur) best = pool.find((c) => c.name === cur) || null;
  if (!best)
    for (const c of pool) {
      if (c.muscle !== e.muscle || c.pattern !== e.pattern) continue;
      let s = 0;
      const eqE = e.equipment.join(","),
        eqC = c.equipment.join(",");
      if (eqE === eqC) s += 2;
      else if (e.equipment.some((x) => c.equipment.includes(x))) s += 1;
      const mc = mots(c.name);
      s += me.filter((w) => mc.includes(w)).length * 3;
      const nc = norm(c.name);
      if ((PAT_TERMS[e.pattern] || []).some((t) => nc.includes(t))) s += 4;
      if (s > bestScore) ((bestScore = s), (best = c));
    }
  if (!best) throw new Error(`aucun candidat humain pour ${e.name}`);
  remap[norm(e.name)] = best.gif;
  lignes.push([e.name, best.name, best.gif]);
}

writeFileSync(
  "/tmp/remap74.json",
  JSON.stringify(remap, null, 1),
);
console.log("legacy:", legacy.length, "| mappés:", Object.keys(remap).length);
for (const [a, b, g] of lignes)
  console.log(`${a}  =>  ${b}  (${g.split("/")[2]})`);

if (process.argv.includes("--apply")) {
  const p = new URL("../src/data/gif-overrides.js", import.meta.url);
  let src = readFileSync(p, "utf8");
  const ancre = '"wood chop poulie haute": "/media/9b353c570b841963.gif"\n};';
  if (!src.includes(ancre)) throw new Error("ancre GIF_OVERRIDES introuvable");
  const bloc =
    '\n // ── Rattrapage 03/10/2026 (BUG 1) : 74 visuels humains (même muscle +\n' +
    ' // même pattern) en remplacement des illustrations anatomiques legacy.\n' +
    lignes
      .map(
        ([a, b, g], i) =>
          ` ${JSON.stringify(norm(a))}: ${JSON.stringify(g)}, // ≈ ${b}`,
      )
      .join("\n") +
    "\n};";
  // Conserve la ligne d'ancre (dernière entrée d'origine) en tête du bloc.
  src = src.replace(
    ancre,
    '"wood chop poulie haute": "/media/9b353c570b841963.gif",\n' + bloc.slice(1),
  );
  writeFileSync(p, src);
  console.log("APPLIQUÉ dans src/data/gif-overrides.js");
}
