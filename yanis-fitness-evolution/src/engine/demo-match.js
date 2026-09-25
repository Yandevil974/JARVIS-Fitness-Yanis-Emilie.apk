// Résolution « exercice → démonstration humaine » (portée de la 1.5.0 d'origine).
// Trois niveaux, jamais de placeholder implicite :
//  exact    : le GIF de la variante elle-même ;
//  variante : association explicite vers le GIF du même geste (table ci-dessous) ;
//  famille  : score muscle + pattern + mots-clés + matériel, seuil haut (>=5).
// Audit 1.5.1 : les associations hors sujet retirées de la table d'origine
// (respiration-diaphragmatique→Dead bug, mobilité-épaules→Bird dog,
// wood-chop→crunch poulie, ab wheel→jackknife) sont désormais animées par le
// moteur de mouvement humain (human-motion.js) avec le bon geste.
import { EXERCISES } from "../data/library.js";
import { norm } from "./utils.js";
import { EXERCISE_MOTIONS } from "./human-motion.js";
export const EXPLICIT_MATCHES = {
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
  "elevations-laterales-coude-a-90": "Élévations latérales",
  "elevations-laterales-incline": "Élévations latérales",
  "elevations-laterales-incline-30": "Élévations latérales",
  "elevations-laterales-incline-45": "Élévations latérales",
  "elevations-laterales-incline-30-face-au-banc": "Élévations latérales",
  "elevations-laterales-lean-away": "Élévations latérales",
  "developpe-derriere-la-nuque": "Développé militaire debout",
  "developpe-haltere-un-bras-debout": "Développé militaire haltères assis",
  "developpe-militaire-inertie-depuis-les-pins": "Développé militaire debout",
  "developpe-halteres-incline-45": "Développé haltères incliné",
  "developpe-halteres-incline-45-prise-neutre":
    "Développé haltères plat, prise neutre",
  "developpe-couche-plat-inertie-depuis-les-pins":
    "Développé couché barre plat",
  "ecartes-halteres": "Écartés haltères décliné",
  "ecartes-cables-incline": "Câbles croisés",
  "cables-croises-rotation-externe": "Câbles croisés",
  pompes: "Pompes inclinées (mains surélevées)",
  "squat-cycliste": "Front squat",
  "squat-cycliste-squat-complet": "Front squat",
  "back-squat-inertie-pause-complete": "Back squat",
  "safety-bar-squat-ou-barre-classique": "Back squat",
  "squat-au-poids-du-corps": "Goblet squat",
  "leg-press-unilateral": "Leg press",
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
  "glute-ham-raise": "Back extension horizontal",
  "souleve-de-terre-partiel": "Soulevé de terre",
  "souleve-de-terre-partiel-prise-snatch": "Soulevé de terre",
  "back-extension-45-prise-snatch": "Back extension horizontal",
  "releves-de-jambes-allonge": "Relevés de jambes",
  "releves-de-jambes-incline": "Relevés de jambes suspendu",
  "crunch-sur-swiss-ball": "Jackknife sur swiss ball",
};
// Mots-outils ignorés par le score de famille (bruit de nommage).
const STOP_WORDS =
  /\b(tempo|plat|moderee?s?|alternee?s?|variante|lourd|leger|controle|complet|final|test|myo|reps?|drop|set|inertie|pause|charge|max|prise|snatch|unilateral|bilateral|assis|assise|debout|incline|decline|neutre|pronation|supination|marteau|large|serree|etroite|banc|machine|barre|ez|halteres?|cable|poulie|elastique|sol|sureleve|haut|bas|gauche|droite|jambe|bras|par|au|a|la|le|les|du|de|des|sur|en|avec|ou|et|1|2|3|4|5)\b/g;
function tokens(name) {
  return norm(name)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(STOP_WORDS, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}
// Un GIF est « de la même famille » que si muscle + pattern + vocabulaire
// convergent. Score exigeant : 4 (muscle) + 3 (pattern) + 2 par mot partagé,
// seuil 5 minimum, jamais un simple partage de muscle.
function familyMatch(exercise) {
  const words = tokens(exercise.name);
  let best = null,
    bestScore = 0;
  for (const other of EXERCISES) {
    if (other.id === exercise.id || !other.gif) continue;
    let score = 0;
    if (other.muscle === exercise.muscle) score += 4;
    else if ((exercise.secondary || []).includes(other.muscle)) score += 1;
    else continue;
    if (other.pattern === exercise.pattern) score += 3;
    score +=
      words.filter((w) => tokens(other.name).includes(w)).length * 2 +
      (exercise.equipment || []).filter((e) =>
        (other.equipment || []).includes(e),
      ).length;
    if (score > bestScore) ((bestScore = score), (best = other));
  }
  return bestScore >= 5 ? best : null;
}
const byName = new Map(EXERCISES.map((e) => [e.name, e]));
const demoCache = new Map();
for (const exercise of EXERCISES) {
  if (exercise.gif) {
    demoCache.set(exercise.id, {
      path: exercise.gif,
      name: exercise.name,
      level: "exact",
    });
    continue;
  }
  const targetName = EXPLICIT_MATCHES[exercise.id];
  const target = targetName ? byName.get(targetName) : null;
  if (target?.gif) {
    demoCache.set(exercise.id, {
      path: target.gif,
      name: target.name,
      level: "variante",
    });
    continue;
  }
  // Priorité à l'animation créée (audit visuels 2026-09-25) : quand le moteur
  // human-motion définit le geste exact de l'exercice (respiration, wood chop,
  // ab wheel...), on ne cherche PAS de GIF « famille » — le score automatique
  // recréait les associations hors sujet retirées à l'audit (respiration →
  // mountain climbers, ab wheel → reverse crunch, wood chop → crunch poulie).
  // Ordre : exact > variante explicite > animation créée > famille.
  if (EXERCISE_MOTIONS[exercise.id]) continue;
  const family = familyMatch(exercise);
  if (family?.gif)
    demoCache.set(exercise.id, {
      path: family.gif,
      name: family.name,
      level: "famille",
    });
}
export function demonstrationFor(exercise) {
  return (exercise?.id && demoCache.get(exercise.id)) || null;
}
export const DEMO_LABELS = {
  exact: "Illustration humaine · source",
  variante: "Variante très proche · suivez les consignes ci-dessous",
  famille: "Mouvement de la même famille · suivez les consignes ci-dessous",
  creee: "Animation humaine créée · adaptée au mouvement",
};
export function demoInventory() {
  return EXERCISES.map((e) => ({
    id: e.id,
    name: e.name,
    muscle: e.muscle,
    pattern: e.pattern,
    gif: e.gif || null,
    demo: demoCache.get(e.id) || null,
  }));
}
