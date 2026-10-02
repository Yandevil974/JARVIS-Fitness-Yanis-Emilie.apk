// Cherche les étapes de chrono dont le visuel résolu n'est PAS un GIF animé.
import { EXERCISES, RECOVERY_EXERCISES, POOL_PROTOCOLS, POOL_GUIDES, stretchImage } from "../src/data/library.js";
import { stepGuide } from "../src/data/visuals.js";
import { stepGif, stepGifFromName, stepGifByPattern, STRETCH_KEY_BY_NAME, movementGif } from "../src/data/visuals-gifs.js";
import { sourceCardioSteps, sourceExtraSteps } from "../src/engine/source-schedule.js";
import { intervalSteps } from "../src/engine/timer.js";

function resolutionChrono(step, profil) {
  const guide = stepGuide(step.name, step.segment, POOL_GUIDES);
  const img =
    step.img ||
    guide?.img ||
    stepGif(STRETCH_KEY_BY_NAME[step.name], profil) ||
    stepGifFromName(step.name, profil) ||
    EXERCISES.find((e) => e.name === step.name)?.gif ||
    stepGifByPattern(step.pattern, profil);
  return { img, via: step.img ? "step.img" : guide?.img ? `guide:${guide.t}` : "resolver" };
}

const statiques = [];
const voir = (step, ctx) => {
  for (const profil of ["elite", "emilie"]) {
    const { img, via } = resolutionChrono(step, profil);
    if (img && !img.endsWith(".gif")) statiques.push(`${ctx} · ${step.name} (${profil}) → ${img} [${via}]`);
  }
};
for (const pr of POOL_PROTOCOLS)
  for (const niveau of pr.niveaux)
    for (const [name, seconds] of niveau.steps)
      voir({ name, seconds, pattern: /repos|respiration|recup/i.test(name) ? "breathe" : "swim", segment: "pool" }, pr.id);
for (const id of ["endu", "inter", "sprint", "recup"])
  for (const step of sourceCardioSteps(id, 20)) voir(step, `metcon-${id}`);
for (const pr of POOL_PROTOCOLS) {
  const event = { components: [{ key: "cardio", protocolId: "inter", minutes: 15 }, { key: "pool", protocolId: pr.id, level: 0 }], transitionSeconds: 300 };
  for (const step of sourceExtraSteps({ id: "elite" }, event)) voir(step, `combo-${pr.id}`);
}
for (const cfg of [{ aqua: true, movements: ["Squats", "Montées de genoux", "Pompes au bord"] }, { aqua: false, movements: ["Marche rapide"] }])
  for (const step of intervalSteps(cfg)) voir(step, "tabata-libre");

console.log("ÉTAPES DE CHRONO AVEC VISUEL STATIQUE (non GIF) :", statiques.length);
[...new Set(statiques)].forEach((s) => console.log(" -", s));

// Guides piscine dont l'image finale n'est pas un GIF
for (const g of POOL_GUIDES)
  if (g.img && !g.img.endsWith(".gif")) console.log("GUIDE PISCINE STATIQUE :", g.t, "→", g.img);
console.log("fin.");
