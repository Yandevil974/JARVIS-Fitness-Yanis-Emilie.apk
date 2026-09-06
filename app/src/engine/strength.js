/* ============================================================
   RÉFÉRENTIEL DE FORCE — 1RM et charges suggérées
   ------------------------------------------------------------
   Portage du moteur des fichiers HTML source
   (Transformation_Elite_V2.html et Emilie_transformation_V7.html) :

   1. Un petit nombre de MOUVEMENTS DE BASE portent la force réelle
      (hip thrust, soulevé de terre roumain, squat, rowing, développé…).
   2. Chaque exercice du programme est rattaché à un mouvement de base
      par un ratio (CHARGE_RULES), ou à défaut par son groupe musculaire
      (CHARGE_FALLBACK).
   3. Le 1RM effectif d'un exercice = le maximum entre le 1RM estimé
      depuis VOS séries réelles et le 1RM du mouvement de base déclaré
      au bilan. Les séances réelles priment sur le test déclaré.
   4. La charge suggérée applique le pourcentage correspondant à la
      fourchette de répétitions, borné par la double progression.

   Aucune charge n'est inventée : sans référence et sans historique,
   la fonction retourne null et l'interface demande une calibration.
   ============================================================ */
import { norm, num, round, today, addDays, dayDiff } from "./utils.js";
import { exerciseById, EXERCISES } from "../data/library.js";
import { estimate1RM, allSessions } from "./fitness.js";
import { validDate } from "./validation.js";

/** Fréquence de réévaluation fixée par le coach, en semaines. */
export const FORCE_REVAL_WEEKS = 8;

/** Mouvements de base du bilan 1RM, communs aux deux profils.
 *  `emilie` / `elite` indiquent lesquels sont mis en avant par profil. */
export const BASE_MOVEMENTS = [
  {
    key: "hipthrust",
    name: "Hip thrust barre",
    icon: "🍑",
    exerciseName: "Hip thrust barre",
    essential: { emilie: true, elite: false },
  },
  {
    key: "rdl",
    name: "Soulevé de terre roumain",
    icon: "🍑",
    exerciseName: "Soulevé de terre roumain barre",
    essential: { emilie: true, elite: true },
  },
  {
    key: "squat",
    name: "Squat (barre ou goblet)",
    icon: "🦵",
    exerciseName: "Back squat",
    essential: { emilie: true, elite: true },
  },
  {
    key: "bulgarian",
    name: "Bulgarian split squat (par jambe)",
    icon: "🦵",
    exerciseName: "Bulgarian split squat",
    essential: { emilie: true, elite: false },
  },
  {
    key: "row",
    name: "Rowing barre buste penché",
    icon: "🦍",
    exerciseName: "Rowing barre buste penché",
    essential: { emilie: true, elite: true },
  },
  {
    key: "bench",
    name: "Développé couché barre",
    icon: "🏋️",
    exerciseName: "Développé couché barre plat",
    essential: { emilie: false, elite: true },
  },
  {
    key: "ohp",
    name: "Développé militaire",
    icon: "💪",
    exerciseName: "Développé militaire debout",
    essential: { emilie: false, elite: true },
  },
  {
    key: "tirage",
    name: "Tirage vertical",
    icon: "🦍",
    exerciseName: "Tirage vertical prise pronation",
    essential: { emilie: false, elite: false },
  },
  {
    key: "pullup",
    name: "Tractions (charge additionnelle)",
    icon: "🦍",
    exerciseName: "Tractions (pull-up)",
    essential: { emilie: false, elite: false },
    additional: true,
  },
  {
    key: "dips",
    name: "Dips (charge additionnelle)",
    icon: "💪",
    exerciseName: "Triceps dips",
    essential: { emilie: false, elite: false },
    additional: true,
  },
  {
    key: "curl",
    name: "Curl barre",
    icon: "💪",
    exerciseName: "Curl barre debout",
    essential: { emilie: false, elite: false },
  },
  {
    key: "triext",
    name: "Extension triceps à la poulie",
    icon: "💪",
    exerciseName: "Extension triceps à la poulie",
    essential: { emilie: false, elite: false },
  },
  {
    key: "latraise",
    name: "Élévations latérales (par bras)",
    icon: "🔷",
    exerciseName: "Élévations latérales",
    essential: { emilie: false, elite: false },
    perHand: true,
  },
];

export const BASE_MAP = Object.fromEntries(BASE_MOVEMENTS.map((b) => [b.key, b]));

/** Mouvements du bilan proposés pour un profil, essentiels en tête. */
export function baseMovementsFor(profileId) {
  const id = profileId === "emilie" ? "emilie" : "elite";
  return [...BASE_MOVEMENTS].sort(
    (a, b) => Number(!!b.essential[id]) - Number(!!a.essential[id]),
  );
}
export const isEssential = (movement, profileId) =>
  !!movement.essential[profileId === "emilie" ? "emilie" : "elite"];

/* Exercices sans charge mesurable : poids du corps, chronométrés, élastique.
   La tension d'un élastique n'est pas une charge en kilogrammes. */
const NO_LOAD = [
  "pompes",
  "gainage",
  "planche",
  "dead bug",
  "bird dog",
  "mountain climbers",
  "circuit",
  "clamshell",
  "fire hydrant",
  "elastique",
  "superman",
  "respiration",
  "mobilite",
  "etirement",
  "marche",
];

/* [base, motif normalisé, ratio, parMain?]
   Le premier motif qui correspond gagne : les motifs spécifiques
   précèdent donc volontairement les motifs génériques. */
const CHARGE_RULES = [
  // --- Unilatéral et haltères : avant tout motif générique ---
  ["rdl", "roumain unilateral", 0.35, true],
  ["rdl", "roumain unilat", 0.35, true],
  ["rdl", "unilateral haltere", 0.35, true],
  ["row", "rowing haltere", 0.5, true],
  ["row", "rowing un bras", 0.5, true],
  ["bench", "developpe couche halteres", 0.45, true],
  ["bench", "developpe couche halt", 0.45, true],
  ["bench", "developpe incline halteres", 0.45, true],
  ["bench", "developpe incline halt", 0.45, true],
  ["tirage", "pallof", 0.3],
  ["tirage", "face pull", 0.3],
  ["tirage", "crunch a la poulie", 0.2],
  ["squat", "goblet", 0.35, true],
  ["squat", "mollets debout unilat", 0.2, true],
  ["squat", "mollet unilat", 0.2, true],
  // --- Unilatéral fessiers / jambes ---
  ["bulgarian", "bulgare", 1.0],
  ["bulgarian", "bulgarian", 1.0],
  ["bulgarian", "split squat", 1.0],
  ["bulgarian", "fente", 1.25],
  ["bulgarian", "lunge", 1.25],
  ["bulgarian", "step up", 1.35],
  ["bulgarian", "step-up", 1.35],
  // --- Hip thrust et famille fessiers ---
  ["hipthrust", "kickback", 0.1],
  ["hipthrust", "abduction", 0.1],
  ["hipthrust", "hip abduction", 0.1],
  ["hipthrust", "glute bridge", 0.7],
  ["hipthrust", "pont fessier", 0.1],
  ["hipthrust", "bridge", 0.7],
  ["hipthrust", "unilateral", 0.3, true],
  ["hipthrust", "1 jambe", 0.3, true],
  ["hipthrust", "hip thrust", 1.0],
  ["hipthrust", "thrust", 1.0],
  // --- Soulevé de terre roumain et ischios ---
  ["rdl", "leg curl", 0.3],
  ["rdl", "swiss-ball leg curl", 0.25],
  ["rdl", "ischio", 0.3],
  ["rdl", "roumain", 1.0],
  ["rdl", "romanian", 1.0],
  ["rdl", "jambes tendues", 0.9],
  ["rdl", "good morning", 0.6],
  ["rdl", "glute ham", 0.35],
  ["rdl", "back extension", 0.3],
  ["rdl", "hyperextension", 0.3],
  ["rdl", "souleve de terre", 0.9],
  ["rdl", "deadlift", 0.9],
  // --- Tirages ---
  ["tirage", "tirage vertical", 1.0],
  ["tirage", "lat pulldown", 1.0],
  ["tirage", "tirage horizontal", 0.9],
  ["tirage", "tirage", 0.95],
  ["tirage", "rowing assis", 0.9],
  ["tirage", "pullover", 0.45],
  // --- Curls ---
  ["curl", "curl halteres", 0.5, true],
  ["curl", "halteres curl", 0.5, true],
  ["curl", "curl marteau", 0.8],
  ["curl", "marteau", 0.8],
  ["curl", "hammer", 0.8],
  ["curl", "zottman", 0.5, true],
  ["curl", "concentration", 0.45, true],
  ["curl", "scott", 0.85],
  ["curl", "poulie basse", 0.75],
  ["curl", "curl", 1.0],
  // --- Triceps ---
  ["triext", "french", 1.0],
  ["triext", "pushdown", 1.0],
  ["triext", "extension triceps", 1.0],
  ["triext", "extensions triceps", 1.0],
  ["triext", "barre au front", 0.95],
  ["triext", "california", 0.8],
  // --- Squat et dérivés ---
  ["squat", "leg extension", 0.35],
  ["squat", "mollet", 0.45],
  ["squat", "calf", 0.45],
  ["squat", "presse a cuisses", 1.35],
  ["squat", "leg press", 1.2],
  ["squat", "presse", 1.2],
  ["squat", "front squat", 0.85],
  ["squat", "hack", 0.9],
  ["squat", "squat cycliste", 0.8],
  ["squat", "cycliste", 0.8],
  ["squat", "safety bar", 1.0],
  ["squat", "back squat", 1.0],
  ["squat", "squat", 1.0],
  // --- Épaules ---
  ["latraise", "elevations lat", 1.0, true],
  ["latraise", "elevation lat", 1.0, true],
  ["latraise", "lateral raise", 1.0, true],
  ["ohp", "lean away", 0.25, true],
  ["ohp", "rear delt", 0.2, true],
  ["ohp", "wood chop", 0.25],
  ["ohp", "derriere la nuque", 1.0],
  ["ohp", "militaire", 0.8, true],
  ["ohp", "halteres assis", 0.45, true],
  ["ohp", "haltere un bras", 0.45, true],
  ["ohp", "overhead", 0.8, true],
  ["ohp", "press", 0.9, true],
  // --- Pectoraux ---
  ["bench", "developpe couche", 1.0],
  ["bench", "developpe halt", 0.45, true],
  ["bench", "prise serree", 0.85],
  ["bench", "close grip", 0.85],
  ["bench", "developpe inclin", 0.85],
  ["bench", "incline", 0.85],
  ["bench", "developpe declin", 0.9],
  ["bench", "decline", 0.9],
  ["bench", "ecart", 0.3, true],
  ["bench", "cable croise", 0.3, true],
  ["bench", "cables croises", 0.3, true],
  ["bench", "croise", 0.3, true],
  ["bench", "bench", 1.0],
  // --- Poids du corps lestés ---
  ["pullup", "traction", 1.0],
  ["pullup", "pull up", 1.0],
  ["pullup", "pull-up", 1.0],
  ["pullup", "chin up", 1.0],
  ["pullup", "chin-up", 1.0],
  ["dips", "dips", 1.0],
  ["dips", "dip", 1.0],
  // --- Rowing (après « rowing assis » et « rowing haltere ») ---
  ["row", "rowing barre", 1.0],
  ["row", "rowing", 1.0],
  ["row", "row", 1.0],
];

/* Repli par groupe musculaire si aucun motif ne correspond. */
const CHARGE_FALLBACK = {
  fes: ["hipthrust", 0.6],
  moy: ["hipthrust", 0.1],
  isc: ["rdl", 0.45],
  qua: ["squat", 0.7],
  add: ["squat", 0.4],
  mol: ["squat", 0.4],
  lom: ["rdl", 0.35],
  dos: ["row", 1.0],
  epA: ["ohp", 0.8],
  epL: ["latraise", 0.9],
  epP: ["ohp", 0.35],
  bic: ["curl", 0.9],
  tri: ["triext", 0.9],
  avb: ["curl", 0.4],
  pec: ["bench", 0.8],
  abs: null,
  tra: null,
};

/** Vrai si l'exercice ne peut pas recevoir de charge chiffrée. */
export function withoutLoad(exercise) {
  if (!exercise) return true;
  if (exercise.timed) return true;
  const n = norm(exercise.name);
  return NO_LOAD.some((pattern) => n.includes(pattern));
}

/** Rattache un exercice à un mouvement de base et à son ratio. */
export function matchBase(name, muscle) {
  const n = norm(name || "");
  for (const [base, pattern, ratio, perHand] of CHARGE_RULES)
    if (n.includes(pattern)) return { base, ratio, perHand: !!perHand };
  const fallback = CHARGE_FALLBACK[muscle];
  if (fallback) return { base: fallback[0], ratio: fallback[1], perHand: false };
  return null;
}

/** Pourcentage du 1RM correspondant à une fourchette de répétitions
 *  (formule d'Epley inversée : 30 / (30 + reps)). */
export function percentForReps(reps) {
  const found = String(reps ?? "").match(/\d+/g);
  if (!found) return 0.75;
  let r = Number(found[0]);
  if (String(reps).includes("-"))
    r = (Number(found[0]) + Number(found[1] ?? found[0])) / 2;
  r = Math.min(20, Math.max(1, r));
  return 30 / (30 + r);
}

/** Arrondi de charge par paliers réalistes en salle. */
export function roundCharge(value, increment) {
  if (!Number.isFinite(value) || value <= 0) return null;
  const step = increment || (value >= 20 ? 2.5 : value >= 10 ? 1.25 : 0.5);
  return round(Math.max(step, Math.round(value / step) * step), 2);
}

/** Haut de la fourchette de répétitions cible. */
export function topOfRange(reps) {
  const str = String(reps ?? "");
  const range = str.match(/(\d+)\s*-\s*(\d+)/);
  if (range) return Number(range[2]);
  const sequence = (str.match(/\d+/g) || []).map(Number);
  return sequence.length ? sequence[0] : null;
}

/* ---------- Lecture de l'historique réel ---------- */

function completedEntries(p) {
  const out = [];
  for (const session of allSessions(p)) {
    if (!validDate(session.date) || session.date > today()) continue;
    if (session.status === "missed") continue;
    for (const target of session.exercises || [])
      for (const set of target.sets || []) {
        if (!set.completed) continue;
        const weight = num(set.weight),
          reps = num(set.reps);
        if (weight == null || weight <= 0 || reps == null || reps < 1) continue;
        out.push({
          date: session.date,
          at: session.finishedAt || session.startedAt || set.createdAt || 0,
          exerciseId: target.exerciseId,
          unit: set.unit,
          weight,
          reps,
          rpe: num(set.rpe),
          rir: num(set.rir),
        });
      }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.at - b.at);
}

/** Meilleur 1RM estimé depuis les séries réelles d'un exercice précis. */
export function journal1RM(p, exerciseId, unit) {
  let best = null;
  for (const e of completedEntries(p)) {
    if (e.exerciseId !== exerciseId) continue;
    if (unit && e.unit && e.unit !== unit) continue;
    const value = estimate1RM(e.weight, e.reps);
    if (value != null && (best == null || value > best)) best = value;
  }
  return best;
}

/** 1RM d'un mouvement de base déduit des séances (exercices à ratio ≈ 1).
 *  La convention de charge est respectée strictement : des kilos par
 *  haltère ne deviennent jamais des kilos totaux, et inversement. */
export function base1RMFromJournal(p, baseKey, unit) {
  let best = null;
  for (const e of completedEntries(p)) {
    if (unit && e.unit && e.unit !== unit) continue;
    const ex = exerciseById(e.exerciseId);
    const m = matchBase(ex.name, ex.muscle);
    if (!m || m.base !== baseKey || Math.abs(m.ratio - 1) > 0.01) continue;
    const value = estimate1RM(e.weight, e.reps);
    if (value != null && (best == null || value > best)) best = value;
  }
  return best;
}

/** Dernière charge réellement enregistrée sur cet exercice exact. */
export function lastEntry(p, exerciseId, unit) {
  const list = completedEntries(p).filter(
    (e) => e.exerciseId === exerciseId && (!unit || !e.unit || e.unit === unit),
  );
  return list.length ? list.at(-1) : null;
}

/** Référence 1RM déclarée la plus récente pour un mouvement de base. */
export function declaredBase(p, baseKey) {
  const movement = BASE_MAP[baseKey];
  if (!movement) return null;
  const declared = (p.forceTests || [])
    .filter((t) => t.baseKey === baseKey && num(t.estimate) > 0)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (declared.length) return declared.at(-1);

  // Compatibilité ascendante. Les bilans importés depuis les anciens
  // fichiers HTML ne portent pas de `baseKey` : ils identifient
  // l'exercice par `exerciseId`, voire par un libellé brut préfixé
  // « source: » lorsque l'exercice n'existait pas dans la
  // bibliothèque. On les rattache ici au mouvement de base, sans quoi
  // des 1RM pourtant déclarés resteraient ignorés et les charges
  // seraient calculées comme si l'utilisateur n'avait jamais testé.
  const legacy = (p.forceTests || [])
    .filter((t) => {
      if (t.baseKey || !(num(t.estimate) > 0)) return false;
      const raw = String(t.exerciseId || "");
      // Libellé conservé tel quel par l'import (« source:… ») ou
      // étiquette d'origine : on se rabat sur le texte.
      const label = raw.startsWith("source:")
        ? raw.slice(7)
        : t.originalLabel || "";
      if (label) return matchBase(label, null)?.base === baseKey;
      const target = EXERCISES.find((e) => e.id === raw);
      if (!target) return false;
      return matchBase(target.name, target.muscle)?.base === baseKey;
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return legacy.length ? legacy.at(-1) : null;
}

/** 1RM effectif d'un exercice : vos séances priment sur le test déclaré. */
export function effective1RM(p, exercise, unit) {
  const m = matchBase(exercise.name, exercise.muscle);
  const base = m?.base ?? null;
  const ratio = m?.ratio ?? 1;
  const perHand = !!m?.perHand;
  const fromExercise = journal1RM(p, exercise.id, unit);
  const declaredTest = base ? declaredBase(p, base) : null;
  // Un 1RM déclaré peut l'avoir été sur le mouvement de base
  // (« Soulevé de terre roumain ») ou directement sur l'exercice
  // consulté (« Soulevé de terre »). Dans le second cas la valeur est
  // déjà celle de cet exercice : lui appliquer le ratio de conversion
  // la fausserait — un soulevé de terre à 90 kg deviendrait 81, puis
  // une charge de travail absurdement basse.
  const declaredOnThisExercise =
    declaredTest &&
    (declaredTest.exerciseId === exercise.id ||
      norm(declaredTest.originalLabel || "") === norm(exercise.name) ||
      norm(String(declaredTest.exerciseId || "").replace(/^source:/, "")) ===
        norm(exercise.name));
  const declared = declaredTest
    ? num(declaredTest.estimate) * (declaredOnThisExercise ? 1 : ratio)
    : null;
  const fromBase = base ? base1RMFromJournal(p, base, unit) : null;
  const baseDerived = fromBase != null ? fromBase * ratio : null;
  let journal = null;
  for (const v of [fromExercise, baseDerived])
    if (v != null && (journal == null || v > journal)) journal = v;

  // Arbitrage entre le journal et le bilan déclaré.
  // Une estimation tirée des séries prime lorsqu'elle porte sur
  // l'exercice lui-même : c'est une mesure directe et récente.
  // En revanche, une valeur reconstruite depuis un mouvement voisin
  // (`baseDerived`) ne doit pas faire baisser un maximum réellement
  // testé : travailler ses ischios en accessoire léger ne signifie pas
  // que le soulevé de terre a régressé. Dans ce cas on garde la plus
  // élevée des deux.
  let value;
  if (fromExercise != null) value = fromExercise;
  else if (declared != null && baseDerived != null)
    value = Math.max(declared, baseDerived);
  else value = baseDerived != null ? baseDerived : declared;
  return {
    value: value != null ? round(value, 1) : null,
    base,
    baseName: base ? BASE_MAP[base]?.name : null,
    ratio,
    perHand,
    fromExercise: fromExercise != null ? round(fromExercise, 1) : null,
    fromBase: baseDerived != null ? round(baseDerived, 1) : null,
    declared: declared != null ? round(declared, 1) : null,
    declaredDate: declaredTest?.date || null,
    usedJournal: value != null && value === journal,
  };
}

/** Charge suggérée pour un exercice, à partir du 1RM effectif et de la
 *  double progression. Retourne null si aucune charge n'est calculable. */
export function suggestedLoad(p, exercise, reps, { deload = false, unit } = {}) {
  if (withoutLoad(exercise)) return null;
  const effective = effective1RM(p, exercise, unit);
  if (effective.value == null) return null;
  const increment = num(p.user?.increment) || 2.5;
  let percent = percentForReps(reps);
  if (deload) percent = Math.min(percent, 0.68);
  const cap = roundCharge(effective.value * percent, increment);
  const last = lastEntry(p, exercise.id, unit);
  let load = cap;
  let rule = "1rm";
  if (last && last.weight > 0) {
    const top = topOfRange(reps);
    if (top && last.reps > 0) {
      if (last.reps >= top) {
        load = roundCharge(last.weight * 1.025, increment);
        rule = "progression";
      } else if (last.reps >= top * 0.75) {
        load = roundCharge(last.weight, increment);
        rule = "maintien";
      } else {
        load = roundCharge(last.weight * 0.95, increment);
        rule = "allegement";
      }
    } else {
      load = roundCharge(last.weight, increment);
      rule = "maintien";
    }
    // Plafond au 1RM effectif, sans jamais descendre sous la dernière
    // charge réussie : on ne fait pas reculer l'utilisateur.
    if (cap != null) {
      const ceiling = Math.max(cap, roundCharge(last.weight, increment));
      if (load > ceiling) load = ceiling;
    }
  }
  return {
    load,
    rule,
    percent: Math.round(percent * 100),
    effective: effective.value,
    base: effective.base,
    baseName: effective.baseName,
    ratio: effective.ratio,
    perHand: effective.perHand,
    fromJournal: effective.usedJournal,
    declared: effective.declared,
    lastWeight: last ? last.weight : null,
    lastReps: last ? last.reps : null,
    lastDate: last ? last.date : null,
    deload,
  };
}

/** Phrase d'explication de la charge suggérée, pour l'interface. */
export function loadReason(s) {
  if (!s || s.load == null) return null;
  const source = s.fromJournal
    ? `1RM recalculé depuis vos séances (${s.effective} kg`
    : `1RM déclaré au bilan (${s.effective} kg`;
  const via =
    s.ratio && Math.abs(s.ratio - 1) > 0.01 && s.baseName
      ? `, dérivé de ${s.baseName} × ${s.ratio}`
      : "";
  const rule = {
    progression:
      "Haut de fourchette atteint la dernière fois : +2,5 % de charge.",
    maintien: "Fourchette presque atteinte : même charge, gagnez des répétitions.",
    allegement: "Répétitions loin de la cible : −5 % pour retrouver la qualité.",
    "1rm": "Première charge sur cet exercice, calculée depuis votre référence.",
  }[s.rule];
  const deload = s.deload ? " Semaine allégée : intensité plafonnée à 68 %." : "";
  return `${source}${via}) × ${s.percent} %. ${rule}${deload} Ajustez toujours à votre ressenti (RIR 1-2).`;
}

/* ---------- Bilan et réévaluation ---------- */

/** Un bilan compte-t-il comme réalisé ?
 *
 *  Ne pas exiger `baseKey` : les bilans importés depuis les anciens
 *  fichiers HTML identifient l'exercice par `exerciseId` ou par un
 *  libellé, et n'ont jamais cette clé. L'exiger revenait à ignorer un
 *  bilan pourtant complet et à en redemander un nouveau — exactement
 *  ce que `declaredBase` sait déjà rattraper plus bas. */
function usableTest(t) {
  return !!(t.baseKey || t.exerciseId || t.originalLabel) && num(t.estimate) > 0;
}

/** Le bilan 1RM a-t-il été réalisé ? */
export function forceTestDone(p) {
  return (p.forceTests || []).some(usableTest);
}

/** Date du bilan le plus récent. */
export function lastForceTestDate(p) {
  const dates = (p.forceTests || [])
    .filter((t) => usableTest(t) && validDate(t.date))
    .map((t) => t.date)
    .sort();
  return dates.length ? dates.at(-1) : null;
}

/** Date de la prochaine réévaluation programmée par le coach. */
export function nextReevaluation(p) {
  const last = lastForceTestDate(p);
  if (!last) return null;
  const weeks = num(p.preferences?.forceRevalWeeks) || FORCE_REVAL_WEEKS;
  return addDays(last, weeks * 7);
}

/** État de la réévaluation 1RM, pour le rappel du coach. */
export function reevaluationStatus(p) {
  const done = forceTestDone(p);
  const last = lastForceTestDate(p);
  const next = nextReevaluation(p);
  if (!done)
    return {
      done: false,
      due: true,
      last: null,
      next: null,
      days: null,
      label: "Bilan 1RM à réaliser",
      detail:
        "Vos charges ne sont pas encore personnalisées. Cinq à huit minutes suffisent pour calibrer tout le programme.",
    };
  const days = next ? dayDiff(next, today()) : null;
  const due = days != null && days <= 0;
  return {
    done: true,
    due,
    last,
    next,
    days,
    label: due ? "Réévaluation 1RM recommandée" : "Bilan 1RM à jour",
    detail: due
      ? `Votre dernier bilan date du ${last}. Le coach programme une réévaluation toutes les ${num(p.preferences?.forceRevalWeeks) || FORCE_REVAL_WEEKS} semaines : refaites le test pour recalculer vos charges.`
      : `Prochaine réévaluation prévue le ${next}${days != null ? ` (dans ${days} jour${days > 1 ? "s" : ""})` : ""}.`,
  };
}

/** Tableau de synthèse du bilan : déclaré, auto, écart, séance type. */
export function forceOverview(p) {
  return baseMovementsFor(p.id).map((movement) => {
    const declaredTest = declaredBase(p, movement.key);
    const declared = declaredTest ? num(declaredTest.estimate) : null;
    const auto = base1RMFromJournal(p, movement.key);
    const target = EXERCISES.find((e) => e.name === movement.exerciseName);
    const exact = target ? journal1RM(p, target.id) : null;
    let automatic = null;
    for (const v of [auto, exact])
      if (v != null && (automatic == null || v > automatic)) automatic = v;
    const effective =
      automatic != null && (declared == null || automatic > declared)
        ? automatic
        : declared;
    return {
      ...movement,
      essentialHere: isEssential(movement, p.id),
      exerciseId: target?.id || null,
      declared: declared != null ? round(declared, 1) : null,
      declaredDate: declaredTest?.date || null,
      automatic: automatic != null ? round(automatic, 1) : null,
      improved: automatic != null && (declared == null || automatic > declared),
      effective: effective != null ? round(effective, 1) : null,
      working:
        effective != null ? roundCharge(effective * 0.75, num(p.user?.increment) || 2.5) : null,
    };
  });
}
