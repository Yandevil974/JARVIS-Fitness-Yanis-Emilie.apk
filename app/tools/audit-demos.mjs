/* ============================================================
   AUDIT DES DÉMONSTRATIONS HUMAINES
   ------------------------------------------------------------
   Répond à une question simple : chaque exercice affichable a-t-il
   une représentation humaine, et de quelle qualité ?

   Le script appelle les fonctions réelles de l'application
   (demonstrationFor, demonstrationCoverage) plutôt que de refaire
   la correspondance de son côté : un audit qui réimplémente la
   logique qu'il vérifie finit toujours par mentir.

   Il distingue aussi les exercices d'échauffement, d'étirement et de
   mobilité, qui n'ont pas de GIF dans le fichier source d'origine et
   méritent donc d'être comptés à part.

     node tools/audit-demos.mjs
   ============================================================ */
import { EXERCISES, RECOVERY_EXERCISES } from "../src/data/library.js";
import {
  demonstrationFor,
  demonstrationCoverage,
  missingDemonstrations,
} from "../src/data/demonstrations.js";

const cov = demonstrationCoverage();

console.log("=== COUVERTURE GLOBALE ===");
console.log(`  exercices au catalogue : ${cov.total}`);
console.log(`  avec démonstration     : ${cov.covered}`);
console.log(`  sans démonstration     : ${cov.missing}`);
console.log("\n  Par niveau de fidélité :");
console.log(`    exact    (le mouvement lui-même) : ${cov.exact}`);
console.log(`    variante (mouvement très proche) : ${cov.variante}`);
console.log(`    famille  (même famille musculaire) : ${cov.famille}`);

const manquants = missingDemonstrations();
if (manquants.length) {
  console.log("\n  Exercices sans aucune représentation :");
  for (const e of manquants) console.log(`    - ${e.name}  [${e.id}]`);
}

/* --- Échauffement, étirement, mobilité ------------------------------- */
const MOTS = {
  échauffement: /échauff|warm|activation|réveil|montée en charge/i,
  étirement: /étirement|stretch|assouplis/i,
  mobilité: /mobilit|mobili|rotation|circumduction/i,
  gainage: /gainage|planche|plank|hollow|pallof/i,
};

console.log("\n=== CATÉGORIES PARTICULIÈRES ===");
for (const [nom, re] of Object.entries(MOTS)) {
  const lot = EXERCISES.filter(
    (e) => re.test(e.name || "") || re.test(e.category || "") || re.test(e.type || ""),
  );
  if (!lot.length) {
    console.log(`\n  ${nom} : aucun exercice de ce type au catalogue`);
    continue;
  }
  const avec = lot.filter((e) => demonstrationFor(e));
  const niveaux = {};
  for (const e of avec) {
    const d = demonstrationFor(e);
    niveaux[d.level] = (niveaux[d.level] || 0) + 1;
  }
  const detail = Object.entries(niveaux)
    .map(([k, v]) => `${v} ${k}`)
    .join(", ");
  console.log(`\n  ${nom} : ${avec.length}/${lot.length} avec démonstration  (${detail})`);
  for (const e of lot.filter((x) => !demonstrationFor(x)))
    console.log(`      SANS : ${e.name}`);
}

/* --- Étirements : un catalogue séparé ------------------------------- */
/* Piège à éviter : RECOVERY_EXERCISES ne fait PAS partie d'EXERCISES.
   Un audit qui ne regarde que ce dernier annonce 100 % de couverture
   tout en ignorant les 29 étirements. */
const avecDemo = RECOVERY_EXERCISES.filter((e) => demonstrationFor(e));
console.log("\n=== ÉTIREMENTS (catalogue de récupération, séparé) ===");
console.log(`  étirements : ${RECOVERY_EXERCISES.length}`);
console.log(`  avec démonstration humaine : ${avecDemo.length}`);
if (!avecDemo.length)
  console.log(
    "  Aucun : la page Récupération montre une icône générique et le\n" +
      "  texte de consigne, pas une représentation du mouvement.",
  );

/* --- Où viennent les démonstrations non exactes ? -------------------- */
const approx = EXERCISES.map((e) => [e, demonstrationFor(e)])
  .filter(([, d]) => d && d.level !== "exact");
console.log(`\n=== ${approx.length} DÉMONSTRATIONS APPROCHÉES ===`);
console.log("  (l'interface les annonce comme telles, jamais comme exactes)");
for (const [e, d] of approx.slice(0, 40))
  console.log(`  ${d.level.padEnd(8)} ${e.name}\n           montre : ${d.name}`);
if (approx.length > 40) console.log(`  … et ${approx.length - 40} autres`);
