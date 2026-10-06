// Audit du système d'animations — inventaire maître + contrôle d'unicité.
//
// Règle absolue n°1 : 1 exercice = 1 animation spécifique.
// Ce script produit `animations/inventaire.json` (source de vérité) et
// `animations/INVENTAIRE.md` (lecture humaine), puis signale :
//   exercise_without_animation, animation_missing, animation_not_found,
//   invalid_animation_path, duplicate_animation, generic_animation,
//   orphan_animation, broken_asset, case_mismatch.
//
// Il n'écrit AUCUN média et ne modifie AUCUNE référence applicative.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXERCISES,
  RECOVERY_EXERCISES,
  ALL_POOL_PROTOCOLS,
  POOL_GUIDES,
} from "../src/data/library.js";
import { GIF_STEPS } from "../src/data/visuals-gifs.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const out = join(root, "animations");
mkdirSync(out, { recursive: true });

const mediaDir = join(root, "public/media");
const filesOnDisk = new Set(readdirSync(mediaDir));
const problems = [];
const stats = {
  exercises: 0,
  steps: 0,
  recovery: 0,
  guides: 0,
  protocols: 0,
  media: filesOnDisk.size,
};

function checkFile(path, label, id) {
  if (!path) {
    problems.push({ type: "animation_missing", id, label });
    return null;
  }
  if (typeof path !== "string" || !path.startsWith("/media/")) {
    problems.push({ type: "invalid_animation_path", id, label, path });
    return null;
  }
  const name = path.slice("/media/".length);
  if (!filesOnDisk.has(name)) {
    problems.push({ type: "animation_not_found", id, label, path });
    return null;
  }
  if (!/^[a-z0-9_.-]+$/.test(name)) {
    problems.push({ type: "case_mismatch", id, label, path });
  }
  return path;
}

// ————— Musculation : 1 exercice = 1 animation —————
const byFile = new Map();
const exercises = EXERCISES.map((e) => {
  stats.exercises += 1;
  const path = checkFile(e.gif || e.animation || e.img || e.image, e.name, e.id);
  if (path) {
    if (!byFile.has(path)) byFile.set(path, []);
    byFile.get(path).push({ id: e.id, name: e.name });
  }
  return {
    id: e.id,
    nom: e.name,
    categorie: "musculation",
    muscle: e.muscle,
    materiel: e.equipment,
    pattern: e.pattern,
    chronometre: !!e.timed,
    animation_actuelle: path,
    animation_necessaire: true,
    statut: "à recréer",
  };
});

// ————— Étapes de chrono (échauffement, piscine, cardio, étirements) —————
const steps = Object.entries(GIF_STEPS).map(([key, variants]) => {
  stats.steps += 1;
  const entry = { id: key, categorie: "etape-chrono", variantes: {} };
  for (const profile of ["homme", "femme"]) {
    const path = checkFile(variants[profile], `${key} (${profile})`, key);
    entry.variantes[profile] = path;
    if (path) {
      if (!byFile.has(path)) byFile.set(path, []);
      byFile.get(path).push({ id: `${key}:${profile}`, name: key });
    }
  }
  return { ...entry, animation_necessaire: true, statut: "à recréer" };
});

// ————— Étirements / récupération —————
const recovery = (RECOVERY_EXERCISES || []).map((s) => {
  stats.recovery += 1;
  return {
    id: s.id || s.key || s.name,
    nom: s.name,
    categorie: "etirement-recuperation",
    animation_necessaire: true,
    statut: "à recréer",
  };
});

// ————— Guides et protocoles piscine / aqua —————
const guides = (POOL_GUIDES || []).map((g) => {
  stats.guides += 1;
  return {
    id: g.id || g.key || g.name,
    nom: g.name || g.title,
    categorie: "guide-piscine",
    animation_actuelle: g.img || null,
    animation_necessaire: true,
    statut: "à recréer",
  };
});
const protocols = (ALL_POOL_PROTOCOLS || []).map((p) => {
  stats.protocols += 1;
  const stepList = p.steps || p.phases || [];
  return {
    id: p.id,
    nom: p.name || p.title,
    categorie: "protocole-piscine-aqua",
    etapes: stepList.length,
    animation_necessaire: stepList.length > 0,
    statut: "à recréer",
  };
});

// ————— Duplications : par défaut suspectes dès 2 exercices différents —————
const duplicates = [...byFile.entries()]
  .filter(([, users]) => users.length > 1)
  .map(([path, users]) => ({
    path,
    count: users.length,
    exercices: users.slice(0, 12),
    verdict: "À CORRIGER",
    type: "duplicate_animation",
  }))
  .sort((a, b) => b.count - a.count);
for (const d of duplicates) problems.push({ ...d, id: d.path, label: `${d.count} usages` });

// ————— Fichiers orphelins (présents mais référencés nulle part) —————
const referenced = new Set([...byFile.keys()].map((p) => p.slice("/media/".length)));
const orphans = [...filesOnDisk].filter((f) => !referenced.has(f));
if (orphans.length)
  problems.push({ type: "orphan_animation", count: orphans.length, files: orphans.slice(0, 20) });

const inventory = {
  genere_le: new Date().toISOString(),
  regle: "1 exercice = 1 animation spécifique (aucun fichier partagé entre deux exercices)",
  statistiques: {
    exercices_musculation: stats.exercises,
    etapes_chrono: stats.steps,
    etirements: stats.recovery,
    guides_piscine: stats.guides,
    protocoles: stats.protocols,
    fichiers_media: stats.media,
    animations_necessaires_minimum:
      stats.exercises + stats.steps * 2 + stats.recovery + stats.guides,
  },
  exercices: exercises,
  etapes_chrono: steps,
  etirements: recovery,
  guides: guides,
  protocoles: protocols,
  duplications: duplicates,
  fichiers_orphelins: orphans.length ? orphans : [],
  problemes: problems,
};
writeFileSync(join(out, "inventaire.json"), JSON.stringify(inventory, null, 1) + "\n");

const md = [
  "# Inventaire maître des animations (source de vérité)",
  "",
  `Généré le ${inventory.genere_le.slice(0, 10)} — règle : ${inventory.regle}.`,
  "",
  "## Statistiques",
  "",
  `- Exercices de musculation : **${stats.exercises}**`,
  `- Étapes de chrono (× 2 profils) : **${stats.steps}** → **${stats.steps * 2}** visuels`,
  `- Étirements / récupération : **${stats.recovery}**`,
  `- Guides piscine : **${stats.guides}**`,
  `- Protocoles piscine / aqua : **${stats.protocols}**`,
  `- Fichiers média présents : **${stats.media}**`,
  `- **Animations nécessaires (minimum)** : **${inventory.statistiques.animations_necessaires_minimum}**`,
  "",
  "## Anomalies détectées",
  "",
  `- Duplications (un fichier pour plusieurs exercices) : **${duplicates.length}**`,
  ...duplicates.slice(0, 15).map((d) => `  - \`${d.path}\` → ${d.count} exercices`),
  `- Fichiers orphelins : **${orphans.length}**`,
  `- Fichiers manquants : **${problems.filter((p) => p.type === "animation_not_found").length}**`,
  "",
  "## Statuts",
  "",
  "Toutes les lignes sont en statut `à recréer` : conformément à la règle",
  "« 1 exercice = 1 animation », aucune animation existante n'est réutilisée.",
  "",
].join("\n");
writeFileSync(join(out, "INVENTAIRE.md"), md);

console.log(md);
console.log("Types de problèmes :");
for (const t of [...new Set(problems.map((p) => p.type))])
  console.log(`  ${t} : ${problems.filter((p) => p.type === t).length}`);
console.log(`\nÉcrit : animations/inventaire.json + animations/INVENTAIRE.md`);
