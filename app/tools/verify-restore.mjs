/* ============================================================
   VÉRIFICATION D'UNE SAUVEGARDE AVANT IMPORT
   ------------------------------------------------------------
   Contrôle qu'un fichier de sauvegarde se restaure correctement,
   et affiche ce qu'il contient réellement : nombre de séances,
   de séries, de références de force.

   Aucun chemin personnel n'est codé en dur : le fichier est passé
   en argument, et rien n'est écrit.

   Usage :
     node tools/verify-restore.mjs ../MES-DONNEES-Yanis.json
   ============================================================ */
import fs from "node:fs";
import { initialState } from "../src/store/model.js";
import {
  restoreProfile,
  restorationSummary,
} from "../src/store/restoration.js";
import { forceOverview, suggestedLoad } from "../src/engine/strength.js";
import { exerciseById } from "../src/data/library.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage : node tools/verify-restore.mjs <sauvegarde.json>");
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`Fichier introuvable : ${file}`);
  process.exit(1);
}

const backup = JSON.parse(fs.readFileSync(file, "utf8"));
const result = restoreProfile(initialState(), backup);
const p = result.state.profiles[backup.profileId || "elite"];

console.log(`Restauration : OK${result.alreadyApplied ? " (déjà appliquée)" : ""}`);
console.log(
  `Profil       : ${p.user.name}, ${p.user.age ?? "?"} ans, ${p.user.height ?? "?"} cm, ${p.user.weight ?? "?"} kg`,
);
console.log("Contenu      :", JSON.stringify(restorationSummary(backup)));

console.log("\nRéférentiel de force reconstruit :");
for (const r of forceOverview(p)) {
  if (r.effective == null) continue;
  console.log(
    `  ${r.name.padEnd(34)} 1RM ${String(r.effective).padStart(5)} kg` +
      `  ·  charge de travail ${String(r.working ?? "—").padStart(5)} kg`,
  );
}

console.log("\nCharges calculées automatiquement (8 répétitions) :");
for (const r of forceOverview(p)) {
  const ex = r.exerciseId ? exerciseById(r.exerciseId) : null;
  if (!ex) continue;
  const s = suggestedLoad(p, ex, 8, {});
  if (s?.load != null)
    console.log(`  ${ex.name.padEnd(34)} ${String(s.load).padStart(5)} kg`);
}
