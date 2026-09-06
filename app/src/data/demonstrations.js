/* ============================================================
   DÉMONSTRATIONS HUMAINES
   ------------------------------------------------------------
   Objectif : chaque exercice du programme dispose d'une
   représentation humaine explicative.

   Trois niveaux, du plus fiable au plus général :
   1. exact     — le GIF du fichier source correspond à cet exercice.
   2. variante  — le GIF d'une variante très proche (même mouvement de
                  base, même schéma moteur) est réutilisé, et l'interface
                  l'annonce explicitement comme une variante.
   3. famille   — aucune variante proche : on montre le mouvement de la
                  même famille et du même muscle le plus représentatif.

   Rien n'est inventé : on ne fabrique pas d'animation géométrique et on
   ne présente jamais une variante comme la démonstration exacte.
   ============================================================ */
import { norm } from "../engine/utils.js";
import { EXERCISES } from "./library.js";

/* Correspondances explicites, quand le nom seul ne suffit pas à
   retrouver le bon mouvement source. Clé = identifiant de l'exercice,
   valeur = nom exact d'un exercice possédant un GIF. */
const ALIASES = {
  // --- Émilie : élastiques et activations ---
  "pont-fessier-au-sol-activation": "Glute bridge pieds sur banc",
  "kickback-a-l-elastique": "Kickback à la poulie",
  "kickback-a-la-poulie-drop-set-final": "Kickback à la poulie",
  "clamshell-a-l-elastique": "Abduction assise (machine ou élastique)",
  "abduction-hanche-a-l-elastique": "Abduction assise (machine ou élastique)",
  "fire-hydrant-a-l-elastique": "Abduction hanche debout à la poulie",
  "abduction-hanche-a-la-poulie-myo-reps": "Abduction hanche à la poulie",
  "pallof-press-a-l-elastique": "Pallof press à la poulie",
  "face-pull-a-l-elastique": "Face pull à la poulie",
  "rowing-a-l-elastique": "Tirage horizontal à la poulie",
  "step-up-sur-banc-hauteur-du-genou": "Fentes avant alternées",
  "step-up-haut": "Fentes avant alternées",
  "leg-curl-machine-ou-swiss-ball-leg-curl": "Leg curl machine",
  "elevations-laterales-halteres-myo-reps": "Élévations latérales haltères",

  // --- Tests de charge : même mouvement, protocole différent ---
  "hip-thrust-barre-test-de-charge-max-3-5-reps": "Hip thrust barre",
  "souleve-de-terre-roumain-barre-test-3-5-reps":
    "Soulevé de terre roumain barre",
  "rowing-barre-buste-penche-test-3-5-reps": "Rowing barre buste penché",
  "developpe-militaire-halteres-assis-test-3-5-reps":
    "Développé militaire haltères assis",
  "developpe-couche-test-1rm": "Développé couché barre plat",
  "back-squat-test-1rm": "Back squat",
  "souleve-de-terre-test-1rm": "Soulevé de terre",
  "developpe-militaire-test-1rm": "Développé militaire debout",

  // --- Yanis : tractions et dos ---
  "tractions-pull-up": "Tirage vertical prise large",
  "tractions-prise-neutre-chin-up": "Tirage vertical prise neutre",
  "tractions-supination-chin-up": "Tirage vertical prise neutre",
  "tractions-prise-large": "Tirage vertical prise large",
  "lean-away-pull-ups": "Tirage vertical prise large",
  "tirage-vertical-lean-away": "Tirage vertical prise pronation",
  "pullover-cable-bras-tendus": "Tirage vertical prise pronation",
  "pullover-haltere-plat": "Tirage vertical prise pronation",
  "rowing-assis-etirement": "Rowing assis, prise neutre",
  "rowing-assis-au-cou": "Rowing assis, prise neutre",
  "rowing-assis-cable-unilateral": "Rowing assis, prise neutre",
  "rowing-haltere-buste-penche": "Rowing haltère un bras",

  // --- Biceps ---
  "curl-barre": "Curl barre debout",
  "curl-marteau": "Curl marteau assis",
  "curl-scott-barre-ez-pronation": "Curl barre debout",
  "curl-scott-barre-ez-supination": "Curl barre debout",
  "curl-scott-haltere-prise-neutre": "Curl haltères",
  "curl-scott-haltere-neutre": "Curl haltères",
  "curl-scott-90-haltere-supination": "Curl haltères",
  "curl-haltere-supination-banc-scott-90": "Curl haltères incliné",
  "curl-zottman": "Curl haltères",
  "curl-zottman-assis": "Curl haltères",
  "curl-zottman-un-bras-banc-scott": "Curl haltères",
  "curl-concentration": "Curl haltères",
  "curl-poulie-basse": "Curl barre debout",
  "curl-poulie-basse-supination": "Curl barre debout",

  // --- Triceps ---
  "extensions-triceps-poulie": "Extension triceps à la poulie",
  "pushdown-triceps-cable": "Extension triceps à la poulie",
  "barre-au-front-pushdown-triceps": "Extensions triceps barre EZ",
  "extensions-triceps-barre-ez-pullover": "Extensions triceps barre EZ",
  "extensions-triceps-pullover-barre-ez": "Extensions triceps barre EZ",
  "french-press-haltere-un-bras": "French press barre EZ",
  "triceps-extensions-halteres-banc-plat": "French press barre EZ",
  "extensions-triceps-halteres-plat": "French press barre EZ",
  "extensions-triceps-halteres-incline": "French press barre EZ",
  "developpe-couche-prise-serree": "Développé couché barre plat",
  "developpe-couche-decline-prise-serree": "Développé couché barre plat",
  "california-press-barre-au-cou": "Extensions triceps barre EZ",

  // --- Épaules ---
  "elevations-laterales-coude-a-90": "Élévations latérales",
  "elevations-laterales-incline": "Élévations latérales",
  "elevations-laterales-incline-30": "Élévations latérales",
  "elevations-laterales-incline-45": "Élévations latérales",
  "elevations-laterales-incline-30-face-au-banc": "Élévations latérales",
  "elevations-laterales-lean-away": "Élévations latérales",
  "developpe-derriere-la-nuque": "Développé militaire debout",
  "developpe-haltere-un-bras-debout": "Développé militaire haltères assis",
  "developpe-militaire-inertie-depuis-les-pins": "Développé militaire debout",

  // --- Pectoraux ---
  "developpe-halteres-incline-45": "Développé haltères incliné",
  "developpe-halteres-incline-45-prise-neutre":
    "Développé haltères plat, prise neutre",
  "developpe-couche-plat-inertie-depuis-les-pins": "Développé couché barre plat",
  "ecartes-halteres": "Écartés haltères décliné",
  "ecartes-cables-incline": "Câbles croisés",
  "cables-croises-rotation-externe": "Câbles croisés",
  pompes: "Pompes inclinées (mains surélevées)",

  // --- Jambes et fessiers ---
  "squat-cycliste": "Front squat",
  "squat-cycliste-squat-complet": "Front squat",
  "back-squat-inertie-pause-complete": "Back squat",
  "safety-bar-squat-ou-barre-classique": "Back squat",
  "squat-au-poids-du-corps": "Goblet squat",
  "leg-press-unilateral": "Leg press",
  "leg-extension": "Leg press",
  "mollets-a-la-presse": "Mollets debout",
  "fentes-barre": "Fentes avant alternées",
  "fentes-marchees": "Fentes avant alternées",
  "fentes-arriere-au-poids-du-corps": "Fentes arrière alternées",
  "drop-lunges-fentes-controlees": "Fentes arrière alternées",
  "drop-lunges-fentes-sautees-controlees": "Fentes arrière alternées",
  "fentes-bulgares-halteres-pied-avant-sureleve": "Bulgarian split squat",
  "split-squat-poulie-basse": "Bulgarian split squat",
  "split-squat-barbell-pied-avant-sureleve": "Bulgarian split squat",
  "good-morning-debout": "Soulevé de terre roumain barre",
  "glute-ham-raise": "Leg curl allongé",
  "souleve-de-terre-partiel": "Soulevé de terre",
  "souleve-de-terre-partiel-prise-snatch": "Soulevé de terre",
  "back-extension-45-prise-snatch": "Back extension horizontal",

  // --- Abdominaux et gainage ---
  "releves-de-jambes-allonge": "Relevés de jambes",
  "releves-de-jambes-incline": "Relevés de jambes suspendu",
  "crunch-sur-swiss-ball": "Jackknife sur swiss ball",
  "ab-wheel-roulette": "Jackknife sur swiss ball",
  "wood-chop-poulie-haute": "Crunch à la poulie",
  "respiration-diaphragmatique": "Dead bug",
  "mobilite-des-epaules": "Bird dog",
};

/* Mots à ignorer pour comparer deux noms de mouvement : ils décrivent
   une variation d'exécution, pas un mouvement différent. */
const NOISE =
  /\b(tempo|plat|moderee?s?|alternee?s?|variante|lourd|leger|controle|complet|final|test|myo|reps?|drop|set|inertie|pause|charge|max|prise|snatch|unilateral|bilateral|assis|assise|debout|incline|decline|neutre|pronation|supination|marteau|large|serree|etroite|banc|machine|barre|ez|halteres?|cable|poulie|elastique|sol|sureleve|haut|bas|gauche|droite|jambe|bras|par|au|a|la|le|les|du|de|des|sur|en|avec|ou|et|1|2|3|4|5)\b/g;

const keywords = (name) =>
  norm(name)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(NOISE, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

/* Index des exercices possédant réellement un GIF ou une photo source. */
const WITH_MEDIA = EXERCISES.filter((e) => e.gif).map((e) => ({
  exercise: e,
  words: keywords(e.name),
}));

const byName = new Map(EXERCISES.map((e) => [e.name, e]));

function scored(exercise) {
  const words = keywords(exercise.name);
  let best = null,
    bestScore = 0;
  for (const candidate of WITH_MEDIA) {
    if (candidate.exercise.id === exercise.id) continue;
    let score = 0;
    // Même muscle principal : critère le plus fort.
    if (candidate.exercise.muscle === exercise.muscle) score += 4;
    else if ((exercise.secondary || []).includes(candidate.exercise.muscle))
      score += 1;
    else continue; // muscle sans rapport : on n'illustre pas au hasard
    // Même schéma moteur.
    if (candidate.exercise.pattern === exercise.pattern) score += 3;
    // Mots-clés partagés.
    const shared = words.filter((w) => candidate.words.includes(w)).length;
    score += shared * 2;
    // Même matériel : rend la démonstration plus lisible.
    const equipment = (exercise.equipment || []).filter((eq) =>
      (candidate.exercise.equipment || []).includes(eq),
    ).length;
    score += equipment;
    if (score > bestScore) {
      bestScore = score;
      best = candidate.exercise;
    }
  }
  return bestScore >= 5 ? best : null;
}

/* Résolution calculée une seule fois au chargement du module. */
const RESOLVED = new Map();
for (const exercise of EXERCISES) {
  if (exercise.gif) {
    RESOLVED.set(exercise.id, {
      path: exercise.gif,
      name: exercise.name,
      level: "exact",
    });
    continue;
  }
  const alias = ALIASES[exercise.id];
  const target = alias ? byName.get(alias) : null;
  if (target?.gif) {
    RESOLVED.set(exercise.id, {
      path: target.gif,
      name: target.name,
      level: "variante",
    });
    continue;
  }
  const guess = scored(exercise);
  if (guess?.gif)
    RESOLVED.set(exercise.id, {
      path: guess.gif,
      name: guess.name,
      level: "famille",
    });
}

/** Démonstration humaine d'un exercice, ou null si aucune n'est
 *  raisonnablement rattachable. */
export function demonstrationFor(exercise) {
  if (!exercise?.id) return null;
  return RESOLVED.get(exercise.id) || null;
}

/** Exercices sans aucune représentation humaine (doit rester vide). */
export function missingDemonstrations() {
  return EXERCISES.filter((e) => !RESOLVED.has(e.id));
}

/** Statistiques de couverture, utilisées par les tests et le diagnostic. */
export function demonstrationCoverage() {
  const levels = { exact: 0, variante: 0, famille: 0 };
  for (const value of RESOLVED.values()) levels[value.level]++;
  return {
    total: EXERCISES.length,
    covered: RESOLVED.size,
    missing: EXERCISES.length - RESOLVED.size,
    ...levels,
  };
}
