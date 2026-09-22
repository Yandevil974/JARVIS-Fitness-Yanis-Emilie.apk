// Moteur « bilan de force » porté de la 1.5.0 : tests de référence, 1RM
// déclarés ou recalculés depuis le journal, correspondances famille d'exercice,
// charge conseillée par schéma de répétitions et fenêtre de réévaluation.
import { round, num, norm, today, addDays, dayDiff } from "./utils.js";
import { EXERCISES } from "../data/library.js";
const r1 = (v) => round(v, 1),
  r2 = (v) => round(v, 2);
export const DEFAULT_FORCE_REVAL_WEEKS = 8;
export const FORCE_TESTS = [
  { key: "hipthrust", name: "Hip thrust barre", icon: "🍑", exerciseName: "Hip thrust barre", essential: { emilie: true, elite: false } },
  { key: "rdl", name: "Soulevé de terre roumain", icon: "🍑", exerciseName: "Soulevé de terre roumain barre", essential: { emilie: true, elite: true } },
  { key: "squat", name: "Squat (barre ou goblet)", icon: "🦵", exerciseName: "Back squat", essential: { emilie: true, elite: true } },
  { key: "bulgarian", name: "Bulgarian split squat (par jambe)", icon: "🦵", exerciseName: "Bulgarian split squat", essential: { emilie: true, elite: false } },
  { key: "row", name: "Rowing barre buste penché", icon: "🦍", exerciseName: "Rowing barre buste penché", essential: { emilie: true, elite: true } },
  { key: "bench", name: "Développé couché barre", icon: "🏋️", exerciseName: "Développé couché barre plat", essential: { emilie: false, elite: true } },
  { key: "ohp", name: "Développé militaire", icon: "💪", exerciseName: "Développé militaire debout", essential: { emilie: false, elite: true } },
  { key: "tirage", name: "Tirage vertical", icon: "🦍", exerciseName: "Tirage vertical prise pronation", essential: { emilie: false, elite: false } },
  { key: "pullup", name: "Tractions (charge additionnelle)", icon: "🦍", exerciseName: "Tractions (pull-up)", essential: { emilie: false, elite: false }, additional: true },
  { key: "dips", name: "Dips (charge additionnelle)", icon: "💪", exerciseName: "Triceps dips", essential: { emilie: false, elite: false }, additional: true },
  { key: "curl", name: "Curl barre", icon: "💪", exerciseName: "Curl barre debout", essential: { emilie: false, elite: false } },
  { key: "triext", name: "Extension triceps à la poulie", icon: "💪", exerciseName: "Extension triceps à la poulie", essential: { emilie: false, elite: false } },
  { key: "latraise", name: "Élévations latérales (par bras)", icon: "🔷", exerciseName: "Élévations latérales", essential: { emilie: false, elite: false }, perHand: true },
];
export const FORCE_BASES = Object.fromEntries(FORCE_TESTS.map((t) => [t.key, t]));
export const forceTestsFor = (profileId) => {
  const who = profileId === "emilie" ? "emilie" : "elite";
  return [...FORCE_TESTS].sort(
    (a, b) => +!!b.essential[who] - +!!a.essential[who],
  );
};
export const isEssentialTest = (test, profileId) =>
  !!test.essential[profileId === "emilie" ? "emilie" : "elite"];
// Exercices sans charge mesurable : jamais de test ni de charge déduite.
export const FORCE_EXCLUDED = [
  "pompes", "gainage", "planche", "dead bug", "bird dog", "mountain climbers",
  "circuit", "clamshell", "fire hydrant", "elastique", "superman",
  "respiration", "mobilite", "etirement", "marche",
];
// Correspondance nom d'exercice → base de force (ratio de 1RM, prise par main).
export const PATTERN_OVERRIDES = [
  ["rdl", "roumain unilateral", 0.35, true], ["rdl", "roumain unilat", 0.35, true], ["rdl", "unilateral haltere", 0.35, true],
  ["row", "rowing haltere", 0.5, true], ["row", "rowing un bras", 0.5, true],
  ["bench", "developpe couche halteres", 0.45, true], ["bench", "developpe couche halt", 0.45, true], ["bench", "developpe incline halteres", 0.45, true], ["bench", "developpe incline halt", 0.45, true],
  ["tirage", "pallof", 0.3], ["tirage", "face pull", 0.3], ["tirage", "crunch a la poulie", 0.2],
  ["squat", "goblet", 0.35, true], ["squat", "mollets debout unilat", 0.2, true], ["squat", "mollet unilat", 0.2, true],
  ["bulgarian", "bulgare", 1], ["bulgarian", "bulgarian", 1], ["bulgarian", "split squat", 1], ["bulgarian", "fente", 1.25], ["bulgarian", "lunge", 1.25], ["bulgarian", "step up", 1.35], ["bulgarian", "step-up", 1.35],
  ["hipthrust", "kickback", 0.1], ["hipthrust", "abduction", 0.1], ["hipthrust", "hip abduction", 0.1], ["hipthrust", "glute bridge", 0.7], ["hipthrust", "pont fessier", 0.1], ["hipthrust", "bridge", 0.7], ["hipthrust", "unilateral", 0.3, true], ["hipthrust", "1 jambe", 0.3, true], ["hipthrust", "hip thrust", 1], ["hipthrust", "thrust", 1],
  ["rdl", "leg curl", 0.3], ["rdl", "swiss-ball leg curl", 0.25], ["rdl", "ischio", 0.3], ["rdl", "roumain", 1], ["rdl", "romanian", 1], ["rdl", "jambes tendues", 0.9], ["rdl", "good morning", 0.6], ["rdl", "glute ham", 0.35], ["rdl", "back extension", 0.3], ["rdl", "hyperextension", 0.3], ["rdl", "souleve de terre", 0.9], ["rdl", "deadlift", 0.9],
  ["tirage", "tirage vertical", 1], ["tirage", "lat pulldown", 1], ["tirage", "tirage horizontal", 0.9], ["tirage", "tirage", 0.95], ["tirage", "rowing assis", 0.9], ["tirage", "pullover", 0.45],
  ["curl", "curl halteres", 0.5, true], ["curl", "halteres curl", 0.5, true], ["curl", "curl marteau", 0.8], ["curl", "marteau", 0.8], ["curl", "hammer", 0.8], ["curl", "zottman", 0.5, true], ["curl", "concentration", 0.45, true], ["curl", "scott", 0.85], ["curl", "poulie basse", 0.75], ["curl", "curl", 1],
  ["triext", "french", 1], ["triext", "pushdown", 1], ["triext", "extension triceps", 1], ["triext", "extensions triceps", 1], ["triext", "barre au front", 0.95], ["triext", "california", 0.8],
  ["squat", "leg extension", 0.35], ["squat", "mollet", 0.45], ["squat", "calf", 0.45], ["squat", "presse a cuisses", 1.35], ["squat", "leg press", 1.2], ["squat", "presse", 1.2], ["squat", "front squat", 0.85], ["squat", "hack", 0.9], ["squat", "squat cycliste", 0.8], ["squat", "cycliste", 0.8], ["squat", "safety bar", 1], ["squat", "back squat", 1], ["squat", "squat", 1],
  ["latraise", "elevations lat", 1, true], ["latraise", "elevation lat", 1, true], ["latraise", "lateral raise", 1, true],
  ["ohp", "lean away", 0.25, true], ["ohp", "rear delt", 0.2, true], ["ohp", "wood chop", 0.25], ["ohp", "derriere la nuque", 1], ["ohp", "militaire", 0.8, true], ["ohp", "halteres assis", 0.45, true], ["ohp", "haltere un bras", 0.45, true], ["ohp", "overhead", 0.8, true], ["ohp", "press", 0.9, true],
  ["bench", "developpe couche", 1], ["bench", "developpe halt", 0.45, true], ["bench", "prise serree", 0.85], ["bench", "close grip", 0.85], ["bench", "developpe inclin", 0.85], ["bench", "incline", 0.85], ["bench", "developpe declin", 0.9], ["bench", "decline", 0.9], ["bench", "ecart", 0.3, true], ["bench", "cable croise", 0.3, true], ["bench", "cables croises", 0.3, true], ["bench", "croise", 0.3, true], ["bench", "bench", 1],
  ["pullup", "traction", 1], ["pullup", "pull up", 1], ["pullup", "pull-up", 1], ["pullup", "chin up", 1], ["pullup", "chin-up", 1],
  ["dips", "dips", 1], ["dips", "dip", 1],
  ["row", "rowing barre", 1], ["row", "rowing", 1], ["row", "row", 1],
];
export const MUSCLE_BASE_FALLBACK = {
  fes: ["hipthrust", 0.6], moy: ["hipthrust", 0.1], isc: ["rdl", 0.45], qua: ["squat", 0.7],
  add: ["squat", 0.4], mol: ["squat", 0.4], lom: ["rdl", 0.35], dos: ["row", 1],
  epA: ["ohp", 0.8], epL: ["latraise", 0.9], epP: ["ohp", 0.35], bic: ["curl", 0.9],
  tri: ["triext", 0.9], avb: ["curl", 0.4], pec: ["bench", 0.8], abs: null, tra: null,
};
export function isForceTestExercise(ex) {
  if (!ex || ex.timed) return true;
  const n = norm(ex.name);
  return FORCE_EXCLUDED.some((k) => n.includes(norm(k)));
}
export function exerciseBase(name, muscle) {
  const n = norm(name || "");
  for (const [base, needle, ratio, perHand] of PATTERN_OVERRIDES)
    if (n.includes(norm(needle))) return { base, ratio, perHand: !!perHand };
  const fb = MUSCLE_BASE_FALLBACK[muscle];
  return fb ? { base: fb[0], ratio: fb[1], perHand: false } : null;
}
export function estimate1RMFrom(weight, reps) {
  const w = num(weight),
    r = num(reps);
  return w == null || r == null || w <= 0 || w > 1000 || r < 1 || r > 30 || !Number.isInteger(r)
    ? null
    : r1(r === 1 ? w : w * (1 + r / 30));
}
export function parseTargetReps(scheme) {
  const s = String(scheme ?? ""),
    range = s.match(/(\d+)\s*-\s*(\d+)/);
  if (range) return Number(range[2]);
  const all = (s.match(/\d+/g) || []).map(Number);
  return all.length ? all[0] : null;
}
// Intensité dérivée du schéma : 30/(30+reps) (Epley inversé), médiane des
// fourchettes ; repli 75 %.
export function intensityForScheme(scheme) {
  const parts = String(scheme ?? "").match(/\d+/g);
  if (!parts) return 0.75;
  let reps = Number(parts[0]);
  if (String(scheme).includes("-"))
    reps = (Number(parts[0]) + Number(parts[1] ?? parts[0])) / 2;
  reps = Math.min(20, Math.max(1, reps));
  return 30 / (30 + reps);
}
export function roundIncrement(value, step) {
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(step) || step <= 0)
    return null;
  const s = step || (value >= 20 ? 2.5 : value >= 10 ? 1.25 : 0.5);
  return r2(Math.max(s, Math.round(value / s) * s));
}
export function repRange(scheme) {
  const parts = (String(scheme).match(/\d+/g) || []).map(Number);
  return parts.length
    ? { low: Math.min(...parts), high: Math.max(...parts) }
    : { low: 8, high: 12 };
}
// Mêmes périmètres que fitness.allSessions, redéfini localement pour éviter
// l’import circulaire (fitness → force → fitness).
function allSessionsOf(p) {
  return [
    ...p.sessions,
    ...(p.workout && !p.sessions.some((s) => s.id === p.workout.id)
      ? [p.workout]
      : []),
  ];
}
import { validDate } from "./validation.js";
export function recentWorkingSets(p) {
  const out = [];
  for (const s of allSessionsOf(p)) {
    if (!validDate(s.date) || s.date > today() || s.status === "missed")
      continue;
    for (const row of s.exercises || [])
      for (const set of row.sets || []) {
        if (!set.completed) continue;
        const w = num(set.weight),
          r = num(set.reps);
        if (w == null || w <= 0 || r == null || r < 1) continue;
        out.push({
          date: s.date,
          at: s.finishedAt || s.startedAt || set.createdAt || 0,
          exerciseId: row.exerciseId,
          unit: set.unit,
          weight: w,
          reps: r,
          rpe: num(set.rpe),
          rir: num(set.rir),
        });
      }
  }
  return out.sort(
    (a, b) => a.date.localeCompare(b.date) || (a.at || 0) - (b.at || 0),
  );
}
export function maxJournalOneRM(p, exerciseId, unit) {
  let best = null;
  for (const s of recentWorkingSets(p)) {
    if (s.exerciseId !== exerciseId || (unit && s.unit && s.unit !== unit))
      continue;
    const e = estimate1RMFrom(s.weight, s.reps);
    if (e != null && (best == null || e > best)) best = e;
  }
  return best;
}
export function maxDerivedBaseOneRM(p, baseKey, unit) {
  let best = null;
  for (const s of recentWorkingSets(p)) {
    if (unit && s.unit && s.unit !== unit) continue;
    const ex = EXERCISES.find((x) => x.id === s.exerciseId);
    if (!ex) continue;
    const meta = exerciseBase(ex.name, ex.muscle);
    if (!meta || meta.base !== baseKey || Math.abs(meta.ratio - 1) > 0.01)
      continue;
    const e = estimate1RMFrom(s.weight, s.reps);
    if (e != null && (best == null || e > best)) best = e;
  }
  return best;
}
export function lastTopSet(p, exerciseId, unit) {
  const rows = recentWorkingSets(p).filter(
    (s) => s.exerciseId === exerciseId && (!unit || !s.unit || s.unit === unit),
  );
  return rows.length ? rows.at(-1) : null;
}
export function isForceEntryValid(t) {
  return !!(t.baseKey || t.exerciseId || t.originalLabel) && num(t.estimate) > 0;
}
export function hasForceTests(p) {
  return (p.forceTests || []).some(isForceEntryValid);
}
// Meilleur test d'une base : entrées indexées par base, sinon entrées
// legacy (exercice ou libellé source rattachés à la base).
export function bestBaseTest(p, baseKey) {
  if (!FORCE_BASES[baseKey]) return null;
  const direct = (p.forceTests || [])
    .filter((t) => t.baseKey === baseKey && num(t.estimate) > 0)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (direct.length) return direct.at(-1);
  const legacy = (p.forceTests || [])
    .filter((t) => {
      if (t.baseKey || !(num(t.estimate) > 0)) return false;
      const exId = String(t.exerciseId || "");
      const label = exId.startsWith("source:")
        ? exId.slice(7)
        : t.originalLabel || "";
      if (label) {
        const meta = exerciseBase(label, null);
        return meta?.base === baseKey;
      }
      const ex = EXERCISES.find((x) => x.id === exId);
      if (!ex) return false;
      return exerciseBase(ex.name, ex.muscle)?.base === baseKey;
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return legacy.length ? legacy.at(-1) : null;
}
// 1RM effectif : max(journal, max(déclaré × ratio, journal-base × ratio)).
export function effectiveOneRM(p, exercise, unit) {
  const meta = exerciseBase(exercise.name, exercise.muscle),
    baseKey = meta?.base ?? null,
    ratio = meta?.ratio ?? 1,
    perHand = !!(meta && meta.perHand),
    fromJournal = maxJournalOneRM(p, exercise.id, unit),
    declaredTest = baseKey ? bestBaseTest(p, baseKey) : null,
    sameExercise =
      declaredTest &&
      (declaredTest.exerciseId === exercise.id ||
        norm(declaredTest.originalLabel || "") === norm(exercise.name) ||
        norm(String(declaredTest.exerciseId || "").replace(/^source:/, "")) ===
          norm(exercise.name)),
    declared = declaredTest ? num(declaredTest.estimate) * (sameExercise ? 1 : ratio) : null,
    fromBaseRaw = baseKey ? maxDerivedBaseOneRM(p, baseKey, unit) : null,
    fromBase = fromBaseRaw != null ? fromBaseRaw * ratio : null;
  let best = null;
  for (const v of [fromJournal, fromBase])
    if (v != null && (best == null || v > best)) best = v;
  let value;
  if (fromJournal != null) value = fromJournal;
  else if (declared != null && fromBase != null) value = Math.max(declared, fromBase);
  else value = fromBase ?? declared;
  return {
    value: value != null ? r1(value) : null,
    base: baseKey,
    baseName: baseKey ? FORCE_BASES[baseKey]?.name : null,
    ratio,
    perHand,
    fromExercise: fromJournal != null ? r1(fromJournal) : null,
    fromBase: fromBase != null ? r1(fromBase) : null,
    declared: declared != null ? r1(declared) : null,
    declaredDate: declaredTest?.date || null,
    usedJournal: value != null && value === best,
  };
}
export function loadForExercise(p, exercise, scheme, { deload = false, unit } = {}) {
  if (isForceTestExercise(exercise)) return null;
  const ref = effectiveOneRM(p, exercise, unit);
  if (ref.value == null) return null;
  const step = num(p.user?.increment) || 2.5;
  let percent = intensityForScheme(scheme);
  if (deload) percent = Math.min(percent, 0.68);
  const computed = roundIncrement(ref.value * percent, step),
    last = lastTopSet(p, exercise.id, unit);
  let load = computed,
    rule = "1rm";
  if (last && last.weight > 0) {
    const target = parseTargetReps(scheme);
    if (target && last.reps > 0)
      if (last.reps >= target) {
        load = roundIncrement(last.weight * 1.025, step);
        rule = "progression";
      } else if (last.reps >= target * 0.75) {
        load = roundIncrement(last.weight, step);
        rule = "maintien";
      } else {
        load = roundIncrement(last.weight * 0.95, step);
        rule = "allegement";
      }
    else {
      load = roundIncrement(last.weight, step);
      rule = "maintien";
    }
    if (computed != null) {
      const cap = Math.max(computed, roundIncrement(last.weight, step));
      if (load > cap) load = cap;
    }
  }
  return {
    load,
    rule,
    percent: Math.round(percent * 100),
    effective: ref.value,
    base: ref.base,
    baseName: ref.baseName,
    ratio: ref.ratio,
    perHand: ref.perHand,
    fromJournal: ref.usedJournal,
    declared: ref.declared,
    lastWeight: last ? last.weight : null,
    lastReps: last ? last.reps : null,
    lastDate: last ? last.date : null,
    deload,
  };
}
export function forceSourceLabel(s) {
  if (!s || s.load == null) return null;
  const origin = s.fromJournal
    ? `1RM recalculé depuis vos séances (${s.effective} kg`
    : `1RM déclaré au bilan (${s.effective} kg`;
  const derived =
    s.ratio && Math.abs(s.ratio - 1) > 0.01 && s.baseName
      ? `, dérivé de ${s.baseName} × ${s.ratio}`
      : "";
  const rule = {
    progression: "Haut de fourchette atteint la dernière fois : +2,5 % de charge.",
    maintien: "Fourchette presque atteinte : même charge, gagnez des répétitions.",
    allegement: "Répétitions loin de la cible : −5 % pour retrouver la qualité.",
    "1rm": "Première charge sur cet exercice, calculée depuis votre référence.",
  }[s.rule];
  const dl = s.deload ? " Semaine allégée : intensité plafonnée à 68 %." : "";
  return `${origin}${derived}) × ${s.percent} %. ${rule}${dl} Ajustez toujours à votre ressenti (RIR 1-2).`;
}
export function lastForceTestDate(p) {
  const dates = (p.forceTests || [])
    .filter((t) => isForceEntryValid(t) && validDate(t.date))
    .map((t) => t.date)
    .sort();
  return dates.length ? dates.at(-1) : null;
}
export function nextForceRevalDate(p) {
  const last = lastForceTestDate(p);
  if (!last) return null;
  const weeks =
    num(p.preferences?.forceRevalWeeks) || DEFAULT_FORCE_REVAL_WEEKS;
  return addDays(last, weeks * 7);
}
export function forceRevalState(p) {
  const done = hasForceTests(p),
    last = lastForceTestDate(p),
    next = nextForceRevalDate(p);
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
  const left = next ? dayDiff(next, today()) : null;
  const overdue = left != null && left <= 0;
  return {
    done: true,
    due: overdue,
    last,
    next,
    days: left,
    label: overdue ? "Réévaluation 1RM recommandée" : "Bilan 1RM à jour",
    detail: overdue
      ? `Votre dernier bilan date du ${last}. Le coach programme une réévaluation toutes les ${num(p.preferences?.forceRevalWeeks) || DEFAULT_FORCE_REVAL_WEEKS} semaines : refaites le test pour recalculer vos charges.`
      : `Prochaine réévaluation prévue le ${next}${left != null ? ` (dans ${left} jour${left > 1 ? "s" : ""})` : ""}.`,
  };
}
// Tableau du bilan : par test, déclaré vs automatique, valeur effective et
// charge de travail indicative à 75 %.
export function forceTestRows(p) {
  return forceTestsFor(p.id).map((test) => {
    const declaredTest = bestBaseTest(p, test.key),
      declared = declaredTest ? num(declaredTest.estimate) : null,
      fromBase = maxDerivedBaseOneRM(p, test.key),
      ex = EXERCISES.find((x) => x.name === test.exerciseName),
      fromExercise = ex ? maxJournalOneRM(p, ex.id) : null;
    let auto = null;
    for (const v of [fromBase, fromExercise])
      if (v != null && (auto == null || v > auto)) auto = v;
    const effective = auto != null && (declared == null || auto > declared) ? auto : declared;
    return {
      ...test,
      essentialHere: isEssentialTest(test, p.id),
      exerciseId: ex?.id || null,
      declared: declared != null ? r1(declared) : null,
      declaredDate: declaredTest?.date || null,
      automatic: auto != null ? r1(auto) : null,
      improved: auto != null && (declared == null || auto > declared),
      effective: effective != null ? r1(effective) : null,
      working:
        effective != null
          ? roundIncrement(
              effective * 0.75,
              num(p.user?.increment) || 2.5,
            )
          : null,
    };
  });
}
// Courbe d'évolution par base : points 1RM (déclarés + journal) par date.
export function forceEvolution(p, baseKey) {
  const points = [];
  for (const t of p.forceTests || [])
    if (
      (t.baseKey === baseKey || bestBaseTest(p, baseKey)?.id === t.id) &&
      num(t.estimate) > 0 &&
      validDate(t.date)
    )
      points.push({ date: t.date, value: r1(num(t.estimate)), source: "déclaré" });
  const ex = FORCE_BASES[baseKey]
    ? EXERCISES.find((x) => x.name === FORCE_BASES[baseKey].exerciseName)
    : null;
  if (ex)
    for (const s of recentWorkingSets(p))
      if (s.exerciseId === ex.id) {
        const e = estimate1RMFrom(s.weight, s.reps);
        if (e != null)
          points.push({
            date: s.date,
            value: e,
            source: "journal",
            key: `${s.date}:${s.weight}:${s.reps}`,
          });
      }
  const byDate = new Map();
  for (const pt of points.sort((a, b) => a.date.localeCompare(b.date))) {
    const prev = byDate.get(pt.date);
    if (!prev || pt.value > prev.value) byDate.set(pt.date, pt);
  }
  return [...byDate.entries()].map(([date, pt]) => ({ date, ...pt }));
}
