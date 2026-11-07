// Audit : chaque exercice / étape de chrono a-t-il un humain animé (GIF) ?
// Usage : node scripts/audit-gifs.mjs
import { existsSync } from "node:fs";
import { EXERCISES, RECOVERY_EXERCISES, POOL_PROTOCOLS, POOL_GUIDES, stretchImage } from "../src/data/library.js";
import { demonstrationFor } from "../src/engine/demo-match.js";
import { stepGuide } from "../src/data/visuals.js";
import { stepGif, stepGifFromName, stepGifByPattern, STRETCH_KEY_BY_NAME, movementGif, MOVEMENT_GIF_BY_NAME, GIF_STEPS } from "../src/data/visuals-gifs.js";
import { GIF_OVERRIDES } from "../src/data/gif-overrides.js";
import { intervalSteps } from "../src/engine/timer.js";

const publicDir = new URL("../public", import.meta.url).pathname;
const fileOk = (src) => !!src && existsSync(publicDir + src);
const manquants = new Set();
const check = (src, contexte) => {
  if (!fileOk(src)) manquants.add(`${src}  ← ${contexte}`);
};

let total = 0, exacts = 0, variantes = 0, familles = 0, creee = 0;
const sansDemo = [];
for (const ex of EXERCISES) {
  total++;
  const d = demonstrationFor(ex);
  if (!d) { creee++; sansDemo.push(ex.name); continue; }
  if (d.level === "exact") exacts++;
  else if (d.level === "variante") variantes++;
  else familles++;
  check(d.path, ex.name);
}
console.log(`EXERCICES MUSCU : ${total} — exact ${exacts}, variante ${variantes}, famille ${familles}, SANS GIF humain ${creee}`);
if (sansDemo.length) {
  console.log("Sans démo GIF :");
  for (const n of sansDemo) console.log("  -", n);
}

// Étirements
let stOk = 0, stKo = [];
for (const profil of ["elite", "emilie"])
  for (const ex of RECOVERY_EXERCISES) {
    const img = stretchImage(ex, profil);
    if (img) { stOk++; check(img, `étirement ${ex.name} (${profil})`); }
    else stKo.push(`${ex.name} (${profil})`);
  }
console.log(`ÉTIREMENTS : ${RECOVERY_EXERCISES.length} positions × 2 profils → ${stOk} visuels, ${stKo.length} manquants`);
for (const k of stKo) console.log("  -", k);

// Résolution chrono (TimerModal) pour chaque profil
function resolutionChrono(step, profil) {
  const guide = stepGuide(step.name, step.segment, POOL_GUIDES);
  return (
    step.img ||
    guide?.img ||
    stepGif(STRETCH_KEY_BY_NAME[step.name], profil) ||
    stepGifFromName(step.name, profil) ||
    EXERCISES.find((e) => e.name === step.name)?.gif ||
    stepGifByPattern(step.pattern, profil)
  );
}

let chronoOk = 0, chronoTotal = 0;
const chronoKo = [];
for (const pr of POOL_PROTOCOLS)
  for (const niveau of pr.niveaux)
    for (const [name, seconds] of niveau.steps) {
      const step = {
        name, seconds,
        pattern: /repos|respiration|recup/i.test(name) ? "breathe" : "swim",
        segment: "pool",
      };
      for (const profil of ["elite", "emilie"]) {
        chronoTotal++;
        const img = resolutionChrono(step, profil);
        if (img) { chronoOk++; check(img, `chrono ${pr.id} ${name} (${profil})`); }
        else chronoKo.push(`${pr.id} · ${name} (${profil})`);
      }
    }
console.log(`CHRONOS PISCINE/AQUA (toutes étapes × 2 profils) : ${chronoOk}/${chronoTotal} résolus`);
for (const k of chronoKo) console.log("  -", k);

// HIIT / Tabata : mouvements par défaut de l'app + noms des cartes Cardio.jsx
const HIIT = ["Burpees", "Burpees simplifiés", "Squats", "Squats doux", "Squats sautés", "Squats sumo", "Jumping jacks", "High knees", "Montées de genoux", "Montées sur mollets", "Chaise au mur", "Chaise douce", "Corde invisible", "Dips au bord", "Fentes alternées", "Mountain climbers lents", "Oiseau-chien", "Patineurs", "Planche latérale G", "Planche latérale D", "Pompes au mur", "Ponts fessiers", "Repos actif", "Russian twist", "Superman"];
const hiitKo = [];
for (const m of HIIT)
  for (const profil of ["elite", "emilie"]) {
    const g = movementGif(m, profil);
    if (!g) hiitKo.push(`${m} (${profil})`);
    else check(g, `mouvement ${m} (${profil})`);
  }
console.log(`MOUVEMENTS HIIT/TABATA : ${HIIT.length * 2 - hiitKo.length}/${HIIT.length * 2} résolus`);
for (const k of hiitKo) console.log("  -", k);

// Étapes générées par intervalSteps (timer.js)
const genKo = [];
for (const cfg of [{ aqua: true, movements: ["Squats"] }, { aqua: false, movements: ["Marche rapide"] }])
  for (const step of intervalSteps(cfg))
    for (const profil of ["elite", "emilie"]) {
      const img = resolutionChrono(step, profil);
      if (img) check(img, `interval ${step.name} (${profil})`);
      else genKo.push(`${step.name} (${profil})`);
    }
console.log(`intervalSteps : ${genKo.length} étapes sans GIF`);
for (const k of genKo) console.log("  -", k);

// Étapes cardio elliptique (METCON) + combos METCON elliptique→piscine
import { sourceCardioSteps, sourceExtraSteps, sourcePool } from "../src/engine/source-schedule.js";
const metconKo = [];
let metconTotal = 0;
for (const id of ["endu", "inter", "sprint", "recup"])
  for (const minutes of [15, 20, 25, 30])
    for (const step of sourceCardioSteps(id, minutes))
      for (const profil of ["elite", "emilie"]) {
        metconTotal++;
        const img = resolutionChrono(step, profil);
        if (img) check(img, `metcon cardio ${step.name} (${profil})`);
        else metconKo.push(`${id} ${minutes}min · ${step.name} (${profil})`);
      }
// Combo METCON complet (elliptique + transition + piscine) pour chaque protocole piscine
for (const pr of POOL_PROTOCOLS) {
  const pool = sourcePool({ id: "elite" }, pr.id, 0);
  const event = {
    components: [
      { key: "cardio", protocolId: "inter", minutes: 15 },
      { key: "pool", protocolId: pr.id, level: 0 },
    ],
    transitionSeconds: 300,
  };
  for (const step of sourceExtraSteps({ id: "elite" }, event))
    for (const profil of ["elite", "emilie"]) {
      metconTotal++;
      const img = resolutionChrono(step, profil);
      if (img) check(img, `combo ${pr.id} ${step.name} (${profil})`);
      else metconKo.push(`combo ${pr.id} · ${step.name} (${profil})`);
    }
}
console.log(`CHRONOS METCON (cardio elliptique + combos piscine) : ${metconTotal - metconKo.length}/${metconTotal} résolus`);
for (const k of metconKo) console.log("  -", k);

// Fichiers référencés introuvables
console.log(`FICHIERS MÉDIA RÉFÉRENCÉS INTROUVABLES : ${manquants.size}`);
for (const m of manquants) console.log("  -", m);
