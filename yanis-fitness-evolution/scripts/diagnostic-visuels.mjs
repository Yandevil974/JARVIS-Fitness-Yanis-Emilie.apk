// Diagnostic visuel (lecture seule) : trace la résolution des visuels des
// chronos piscine/aqua et compte l'origine des GIF de la bibliothèque
// (corpus humain GIF_OVERRIDES vs illustrations legacy).
// Usage : node scripts/diagnostic-visuels.mjs
import { EXERCISES, POOL_PROTOCOLS, POOL_GUIDES } from "../src/data/library.js";
import { GIF_OVERRIDES } from "../src/data/gif-overrides.js";
import { stepGuide } from "../src/data/visuals.js";
import {
  stepGif,
  stepGifFromName,
  stepGifByPattern,
  STRETCH_KEY_BY_NAME,
} from "../src/data/visuals-gifs.js";

const humains = new Set(Object.values(GIF_OVERRIDES));
const viaOverrides = EXERCISES.filter((e) => humains.has(e.gif));
const viaLegacy = EXERCISES.filter((e) => e.gif && !humains.has(e.gif));
console.log(
  `Bibliothèque : ${EXERCISES.length} exos | ${viaOverrides.length} via GIF_OVERRIDES (humains) | ${viaLegacy.length} via guides legacy`,
);
for (const e of viaLegacy) console.log("  legacy:", e.name, "->", e.gif);

console.log("\nRésolution piscine/aqua (profil emilie) :");
for (const pr of POOL_PROTOCOLS) {
  console.log(`\n## ${pr.id} (${pr.nom})`);
  for (const [name] of pr.niveaux[0].steps) {
    const step = {
      name,
      pattern: /repos|respiration|recup/i.test(name) ? "breathe" : "swim",
      segment: "pool",
    };
    const guide = stepGuide(step.name, step.segment, POOL_GUIDES);
    const img =
      step.img ||
      guide?.img ||
      stepGif(STRETCH_KEY_BY_NAME[step.name], "emilie") ||
      stepGifFromName(step.name, "emilie") ||
      stepGifByPattern(step.pattern, "emilie", true);
    const via = step.img
      ? "step.img"
      : guide?.img
        ? `guide:${guide.t}`
        : STRETCH_KEY_BY_NAME[step.name]
          ? "stretch"
          : stepGifFromName(step.name, "emilie")
            ? "nom"
            : `pattern:${step.pattern}`;
    console.log(`  ${name} -> ${img} [${via}]`);
  }
}
