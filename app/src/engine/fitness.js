import {
  avg,
  round,
  clamp,
  num,
  sum,
  today,
  addDays,
  inRange,
  rangeStart,
  pctChange,
  monday,
  dayDiff,
} from "./utils.js";
import { exerciseById, MUSCLES } from "../data/library.js";
import { plannedSessions } from "./plan-memory.js";
import { validDate } from "./validation.js";
// Référentiel de force : 1RM effectif et charges dérivées.
// Import circulaire assumé (strength.js utilise estimate1RM/allSessions) :
// les deux modules n'exposent que des déclarations de fonctions, résolues
// à l'appel et non à l'évaluation du module.
import { suggestedLoad, loadReason, topOfRange } from "./strength.js";
export function estimate1RM(weight, reps) {
  const w = num(weight),
    r = num(reps);
  if (
    w == null ||
    r == null ||
    w <= 0 ||
    w > 1000 ||
    r < 1 ||
    r > 30 ||
    !Number.isInteger(r)
  )
    return null;
  return round(r === 1 ? w : w * (1 + r / 30));
}
export function repRange(value) {
  const a = String(value).match(/\d+/g)?.map(Number) || [];
  return a.length
    ? { low: Math.min(...a), high: Math.max(...a) }
    : { low: 8, high: 12 };
}
export function roundLoad(value, increment = 2.5, direction = "nearest") {
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    !Number.isFinite(increment) ||
    increment <= 0
  )
    return null;
  return round(
    (direction === "down"
      ? Math.floor(value / increment)
      : Math.round(value / increment)) * increment,
    2,
  );
}
export function allSessions(p) {
  return [
    ...p.sessions,
    ...(p.workout && !p.sessions.some((s) => s.id === p.workout.id)
      ? [p.workout]
      : []),
  ];
}
export function allSets(
  p,
  { exerciseId, unit, start = "1900-01-01", end = today() } = {},
) {
  return allSessions(p)
    .filter((s) => inRange(s.date, start, end) && s.status !== "missed")
    .flatMap((s) =>
      (s.exercises || [])
        .filter((e) => !exerciseId || e.exerciseId === exerciseId)
        .flatMap((e) =>
          (e.sets || [])
            .filter((x) => x.completed && (!unit || x.unit === unit))
            .map((x, i) => ({
              ...x,
              exerciseId: e.exerciseId,
              date: s.date,
              sessionId: s.id,
              index: i,
            })),
        ),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || (a.createdAt || 0) - (b.createdAt || 0),
    );
}
export function recoveryScore(p, date = today()) {
  const entry = p.checkIns[date];
  if (!entry)
    return {
      score: null,
      coverage: 0,
      reasons: ["Renseignez votre bilan du jour."],
      load: null,
    };
  const map = [
    ["sleep", 0.25, (v) => clamp(v / 8, 0, 1) * 100],
    ["quality", 0.15, (v) => (v - 1) * 25],
    ["energy", 0.2, (v) => (v - 1) * 25],
    ["fatigue", 0.15, (v) => (5 - v) * 25],
    ["stress", 0.1, (v) => (5 - v) * 25],
    ["soreness", 0.1, (v) => (5 - v) * 25],
    ["motivation", 0.05, (v) => (v - 1) * 25],
  ];
  let weighted = 0,
    weight = 0;
  for (const [k, w, f] of map) {
    const v = num(entry[k]);
    if (v != null) {
      weighted += f(v) * w;
      weight += w;
    }
  }
  if (!weight)
    return {
      score: null,
      coverage: 0,
      reasons: ["Donnée insuffisante"],
      load: null,
    };
  const activityLoad = sum(
    p.activities
      .filter((a) => inRange(a.date, addDays(date, -1), date))
      .map((a) => (a.rpe != null ? (a.durationSec / 60) * a.rpe : null)),
  );
  const recent = allSessions(p).filter((s) =>
    inRange(s.date, addDays(date, -1), date),
  );
  const muscleLoad = sum(
    recent.map((s) =>
      s.durationSec > 0 && num(s.rpe) != null
        ? (s.durationSec / 60) * s.rpe
        : 0,
    ),
  );
  const measuredLoad = activityLoad + muscleLoad;
  const penalty = measuredLoad > 600 ? 15 : measuredLoad > 350 ? 8 : 0;
  const reasons = [];
  if (num(entry.sleep) != null && entry.sleep < 6)
    reasons.push("Sommeil court renseigné.");
  if (entry.fatigue >= 4) reasons.push("Fatigue élevée signalée.");
  if (penalty)
    reasons.push(
      `Charge récente : ${Math.round(measuredLoad)} unités sRPE sur 48 h (heuristique).`,
    );
  if (!reasons.length)
    reasons.push(
      "Estimation à partir de votre ressenti, pas une mesure médicale.",
    );
  return {
    score: clamp(Math.round(weighted / weight - penalty), 0, 100),
    coverage: Math.round(weight * 100),
    reasons,
    load: measuredLoad || null,
  };
}
export function historyFor(p, exerciseId, unit) {
  const result = [];
  for (const session of allSessions(p).filter(
    (s) => validDate(s.date) && s.date <= today() && s.status !== "missed",
  )) {
    const targets = session.exercises.filter(
      (e) => e.exerciseId === exerciseId,
    );
    const sets = targets.flatMap((e) =>
      (e.sets || []).filter((s) => s.completed && (!unit || s.unit === unit)),
    );
    if (!sets.length) continue;
    const intended = targets.reduce((n, e) => n + (e.targetSets || 0), 0);
    const count = sum(sets.map((s) => s.count || 1));
    result.push({
      date: session.date,
      sessionId: session.id,
      at: session.finishedAt || session.startedAt || sets.at(-1).createdAt || 0,
      sets,
      intended,
      count,
      complete:
        intended > 0 &&
        count >= intended &&
        ["completed", "partial"].includes(session.status) &&
        session.source !== "manual-set" &&
        !sets.some((s) => s.legacyAggregate),
    });
  }
  return result.sort((a, b) => a.date.localeCompare(b.date) || a.at - b.at);
}
export function recommendLoad(p, target, date = today()) {
  const ex = exerciseById(target.exerciseId),
    unit = target.unit || ex.unit;
  const hist = historyFor(p, ex.id, unit),
    last = hist.at(-1),
    sets = last?.sets.filter((s) => num(s.reps) != null) || [];
  const low = target.repsLow || 8,
    high = target.repsHigh || 12,
    increment = p.user.increment || 2.5;
  const rec = recoveryScore(p, date);
  const fatigue = p.checkIns[date]?.fatigue;
  const base = {
    decision: "unknown",
    label: "À calibrer",
    color: "muted",
    weight: null,
    reps: low,
    reason:
      "Donnée insuffisante : choisissez une charge confortable, puis renseignez vos séries.",
    unit,
    reference: null,
  };
  if (ex.timed)
    return {
      ...base,
      decision: "keep",
      label: "Contrôle & respiration",
      reps: target.seconds || 30,
      reason: "Exercice chronométré : pas de charge ni de 1RM estimé.",
    };
  if (ex.bodyweight) {
    const effort = sets.map(
      (s) => num(s.rpe) ?? (num(s.rir) != null ? 10 - s.rir : null),
    );
    const canProgress =
      last?.complete &&
      effort.every((v) => v != null && v <= 8) &&
      (rec.score == null || rec.score >= 60);
    return {
      ...base,
      decision:
        rec.score != null && rec.score < 45
          ? "deload"
          : canProgress
            ? "reps"
            : "keep",
      color: "blue",
      label: canProgress
        ? "Progression en répétitions"
        : "Conserver le contrôle",
      reps: canProgress
        ? Math.min(high, Math.min(...sets.map((s) => s.reps)) + 1)
        : low,
      reason:
        "Pas de charge corporelle ni de 1RM déduit. Progression en répétitions après toutes les séries cibles et un effort maîtrisé.",
    };
  }
  if (!sets.length) {
    // Aucune série sur CET exercice : on interroge le référentiel de force.
    // Il combine le bilan 1RM déclaré, les séances réalisées sur le même
    // mouvement de base et le ratio propre à l'exercice. C'est ce qui permet
    // de proposer une charge dès la première fois, sans la saisir à la main.
    const derived = suggestedLoad(p, ex, target.repScheme || `${low}-${high}`, {
      deload: !!target.deload || (rec.score != null && rec.score < 45),
      unit,
    });
    if (derived?.load != null) {
      const softened =
        rec.score != null && rec.score < 50
          ? roundLoad(derived.load * 0.9, increment, "down")
          : derived.load;
      return {
        ...base,
        weight: softened,
        reps: Math.max(low, Math.min(high, topOfRange(target.repScheme) || low)),
        decision: "keep",
        color: derived.fromJournal ? "blue" : "amber",
        label: derived.fromJournal
          ? "Charge calculée · vos séances"
          : "Charge calculée · bilan 1RM",
        reason:
          loadReason(derived) +
          (softened !== derived.load
            ? " Récupération faible aujourd’hui : −10 % appliqués."
            : ""),
        reference: derived.lastDate || derived.declaredDate || null,
        strength: derived,
      };
    }
    return base;
  }
  const lastSet = sets.at(-1);
  const weight = num(lastSet.weight);
  if (weight == null) return base;
  const rpes = sets
    .map((s) => num(s.rpe) ?? (num(s.rir) != null ? 10 - s.rir : null))
    .filter((v) => v != null);
  const worst = rpes.length ? Math.max(...rpes) : null;
  const minReps = Math.min(...sets.map((s) => s.reps));
  const out = {
    ...base,
    weight,
    reps: Math.max(low, Math.min(high, minReps)),
    reference: last.date,
  };
  if ((rec.score != null && rec.score < 45) || fatigue === 5 || target.deload)
    return {
      ...out,
      decision: "deload",
      color: "red",
      label: "Récupération / deload",
      weight: roundLoad(weight * 0.9, increment, "down"),
      reason:
        "Récupération faible ou semaine allégée : −10 % de charge, volume réduit. Reportez en cas de malaise.",
    };
  if ((rec.score != null && rec.score < 60) || worst >= 9.5 || minReps < low)
    return {
      ...out,
      decision: "reduce",
      color: "orange",
      label: "Réduire légèrement",
      weight: roundLoad(weight * 0.95, increment, "down"),
      reps: low,
      reason:
        worst >= 9.5
          ? "Effort très élevé déclaré (RPE ≥ 9,5) : −5 % pour retrouver de la marge. Le RPE ne mesure pas la technique."
          : "Fatigue ou répétitions sous la cible : −5 % proposés, à ajuster.",
    };
  if (!last.complete)
    return {
      ...out,
      decision: "keep",
      color: "amber",
      label: "Référence à consolider",
      reason:
        "Série libre, séance en cours ou séries cibles incomplètes : cette charge est une référence, pas une preuve suffisante pour augmenter.",
    };
  if (new Set(sets.map((s) => num(s.weight))).size > 1)
    return {
      ...out,
      decision: "keep",
      color: "amber",
      label: "Consolider le schéma",
      reason:
        "Charges différentes sur les séries : conservez le schéma et ajustez chaque charge manuellement. Pas de hausse globale automatique.",
    };
  if (rpes.length !== sets.length)
    return {
      ...out,
      decision: "keep",
      color: "amber",
      label: "Conserver",
      reason:
        "RPE/RIR non renseigné : aucune augmentation automatique. Conservez la charge et évaluez votre effort.",
    };
  const prev = hist.at(-2);
  const currentVolume = sum(
    sets.map((s) => (s.weight || 0) * (s.reps || 0) * (s.count || 1)),
  );
  const prevVolume = prev
    ? sum(
        prev.sets.map((s) => (s.weight || 0) * (s.reps || 0) * (s.count || 1)),
      )
    : null;
  if (prevVolume > 0 && currentVolume > prevVolume * 1.25)
    return {
      ...out,
      decision: "keep",
      color: "amber",
      label: "Consolider le volume",
      reason:
        "Le tonnage de cet exercice a déjà augmenté de plus de 25 % sur la dernière séance : stabilisation prudente.",
    };
  if (worst <= 8 && minReps >= high) {
    const raised = Math.max(
      weight + increment,
      roundLoad(weight * 1.025, increment),
    );
    if (raised > weight * 1.1)
      return {
        ...out,
        decision: "reps",
        color: "blue",
        label: "Gagner des répétitions",
        reps: high + 1,
        reason:
          "Le plus petit incrément dépasse 10 % de la charge. Progressez en répétitions ou utilisez des microcharges.",
      };
    return {
      ...out,
      decision: "increase",
      color: "green",
      label: "Augmenter la charge",
      weight: raised,
      reps: low,
      reason: `Haut de fourchette atteint à RPE ≤ 8. Incrément de ${round(raised - weight)} kg, retour à ${low} répétitions. À confirmer sur toutes vos séries.`,
    };
  }
  if (worst <= 8.5 && minReps < high)
    return {
      ...out,
      decision: "reps",
      color: "blue",
      label: "Augmenter les répétitions",
      reps: Math.min(high, minReps + 1),
      reason:
        "La charge est maîtrisée : ajoutez une répétition avant de charger davantage.",
    };
  return {
    ...out,
    decision: "keep",
    color: "amber",
    label: "Conserver la charge",
    reason:
      "Consolidez la qualité et les répétitions avant la prochaine augmentation.",
  };
}
/* Planches d'échauffement. Le fichier source décrivait ces étapes en
   texte seul : la modale n'affichait aucune illustration. Une image
   par famille d'étape — mise en route, mobilité, séries d'approche —
   plutôt qu'une par variante, le geste étant le même. */
const WARMUP_IMAGES = {
  route: "/media/warmup-cardio.jpg",
  mobilite: "/media/warmup-mobilite.jpg",
  approche: "/media/warmup-series-approche.jpg",
};

export function warmup(p, session) {
  const first = session?.exercises?.[0];
  const ex = first ? exerciseById(first.exerciseId) : null;
  const rec = first ? recommendLoad(p, first) : null;
  const w = first?.targetLoad ?? rec?.weight;
  const lower = ex && ["qua", "isc", "fes", "moy"].includes(ex.muscle);
  return [
    {
      name: "Mise en route",
      seconds: 180,
      pattern: "walk",
      img: WARMUP_IMAGES.route,
      instruction:
        "Marche ou vélo très facile. Vous devez pouvoir parler confortablement.",
    },
    {
      name: lower ? "Mobilité hanches & chevilles" : "Mobilité des épaules",
      seconds: 60,
      pattern: lower ? "lunge" : "lat",
      img: WARMUP_IMAGES.mobilite,
      instruction: lower
        ? "Mobilisez doucement les chevilles et les hanches, sans forcer."
        : "Cercles d’épaules lents, puis mouvements scapulaires contrôlés.",
    },
    {
      name: lower ? "Activation fessiers" : "Activation scapulaire",
      seconds: 60,
      pattern: lower ? "bridge" : "row",
      img: WARMUP_IMAGES.mobilite,
      instruction: lower
        ? "Ponts fessiers au sol, 10 répétitions contrôlées."
        : "Rétractions des omoplates et rotations externes sans fatigue.",
    },
    ...[0.5, 0.7, 0.85].map((pct, i) => ({
      name: `Approche ${i + 1}${w > 0 ? " · " + roundLoad(w * pct, p.user.increment || 2.5, "down") + " kg" : " · charge légère à choisir"}`,
      seconds: 60,
      pattern: ex?.pattern || "squat",
      img: WARMUP_IMAGES.approche,
      instruction: `${[10, 6, 3][i]} répétitions faciles${w > 0 ? " à environ " + Math.round(pct * 100) + " % de la charge de travail connue" : ". Donnée insuffisante pour une charge chiffrée"}. Repos selon le besoin.`,
    })),
  ];
}
export function forceSummary(p, exerciseId, unit) {
  const ex = exerciseById(exerciseId);
  const samples = allSets(p, { exerciseId, unit })
    .map((s) => ({
      ...s,
      estimate:
        ex.bodyweight || ex.timed ? null : estimate1RM(s.weight, s.reps),
    }))
    .filter((s) => s.estimate != null);
  const tests = p.forceTests.filter(
    (t) =>
      t.exerciseId === exerciseId &&
      (!unit || t.unit === unit) &&
      validDate(t.date) &&
      t.date <= today() &&
      num(t.estimate) > 0,
  );
  const values = [...samples, ...tests].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  if (!values.length)
    return {
      current: null,
      best: null,
      first: null,
      previous: null,
      change: null,
      points: [],
      lastDate: null,
    };
  const byDate = {};
  for (const s of values)
    byDate[s.date] = Math.max(byDate[s.date] || 0, s.estimate);
  const points = Object.entries(byDate).map(([date, value]) => ({
    date,
    value,
  }));
  return {
    current: points.at(-1).value,
    best: Math.max(...points.map((p) => p.value)),
    first: points[0].value,
    previous: points.at(-2)?.value ?? null,
    change:
      points.length > 1
        ? pctChange(points[0].value, points.at(-1).value)
        : null,
    points,
    lastDate: points.at(-1).date,
  };
}
export function muscleBalance(p, start = monday(), end = today()) {
  const actual = Object.fromEntries(Object.keys(MUSCLES).map((k) => [k, 0]));
  for (const s of allSets(p, { start, end })) {
    const m = exerciseById(s.exerciseId).muscle;
    if (actual[m] != null) actual[m] += s.count || 1;
  }
  const weeks = Math.max(1, dayDiff(end, start) + 1) / 7;
  return Object.entries(actual).map(([muscle, sets]) => {
    const weeklyTarget =
      p.preferences.muscleTargets?.[muscle] ||
      (["dos", "pec", "qua", "fes", "isc"].includes(muscle) ? 10 : 6);
    const target = round(weeklyTarget * weeks, 1);
    return {
      muscle,
      sets,
      weeklyTarget,
      target,
      percent: Math.round((sets / target) * 100),
    };
  });
}
export function stats(p, range = "semaine", end = today()) {
  const start = rangeStart(range, end);
  const sets = allSets(p, { start, end });
  const sessions = p.sessions.filter(
    (s) => inRange(s.date, start, end) && s.status === "completed",
  );
  const measuredSessions = p.sessions.filter(
    (s) =>
      inRange(s.date, start, end) &&
      ["completed", "partial"].includes(s.status),
  );
  const activities = p.activities.filter((a) => inRange(a.date, start, end));
  const plan = plannedSessions(p).filter(
    (s) => inRange(s.date, start, end) && s.type === "strength",
  );
  const completedPlan = plan.filter((s) => s.status === "completed").length;
  return {
    start,
    end,
    sets: sum(sets.map((s) => s.count || 1)),
    incompleteSets: sum(
      sets.filter((s) => s.reps == null).map((s) => s.count || 1),
    ),
    reps: sum(
      sets
        .filter((s) => s.unit !== "secondes")
        .map((s) => s.reps * (s.count || 1)),
    ),
    tonnage: round(
      sum(
        sets.map((s) =>
          s.unit !== "secondes" && num(s.weight) != null
            ? s.weight * (s.reps || 0) * (s.count || 1)
            : 0,
        ),
      ),
    ),
    sessions: sessions.length,
    minutes: Math.round(
      sum([...measuredSessions, ...activities].map((s) => s.durationSec || 0)) /
        60,
    ),
    cardioMinutes: Math.round(
      sum(
        activities
          .filter((s) => s.type !== "recovery")
          .map((s) => s.durationSec),
      ) / 60,
    ),
    swimDistance: sum(
      activities
        .filter((s) => s.type === "swim" || s.type === "aqua")
        .map((s) => s.distance || 0),
    ),
    recovery: round(
      avg(
        Object.entries(p.checkIns)
          .filter(([d]) => inRange(d, start, end))
          .map(([d]) => recoveryScore(p, d).score)
          .filter((v) => v != null),
      ),
    ),
    adherence: plan.length
      ? Math.round((completedPlan / plan.length) * 100)
      : null,
    planned: plan.length,
    load: round(
      sum(
        activities.map((a) =>
          a.rpe != null ? (a.rpe * a.durationSec) / 60 : 0,
        ),
      ) +
        sum(
          measuredSessions.map((a) =>
            a.rpe != null ? (a.rpe * a.durationSec) / 60 : 0,
          ),
        ),
    ),
  };
}
export function chartSeries(p, metric, range = "mois", exerciseId, unit) {
  const start = rangeStart(range);
  if (metric === "weight")
    return p.measurements
      .filter((m) => inRange(m.date, start) && m.weight != null)
      .map((m) => ({ date: m.date, value: m.weight }))
      .sort((a, b) => a.date.localeCompare(b.date));
  if (metric === "1rm")
    return forceSummary(p, exerciseId, unit).points.filter(
      (p) => p.date >= start,
    );
  const grouped = {};
  if (["tonnage", "reps", "sets", "load"].includes(metric)) {
    for (const s of allSets(p, { start })) {
      if (
        ["load"].includes(metric) &&
        ((exerciseId && s.exerciseId !== exerciseId) ||
          (unit && s.unit !== unit))
      )
        continue;
      const known =
        metric === "tonnage"
          ? s.weight != null && s.reps != null && s.unit !== "secondes"
          : metric === "reps"
            ? s.reps != null && s.unit !== "secondes"
            : metric === "load"
              ? s.weight != null
              : true;
      if (!known) {
        if (!(s.date in grouped)) grouped[s.date] = null;
        continue;
      }
      const val =
        metric === "tonnage"
          ? s.weight * s.reps * (s.count || 1)
          : metric === "reps"
            ? s.reps * (s.count || 1)
            : metric === "load"
              ? s.weight
              : s.count || 1;
      grouped[s.date] =
        metric === "load"
          ? Math.max(grouped[s.date] ?? 0, val)
          : (grouped[s.date] ?? 0) + val;
    }
  } else if (metric === "frequency") {
    for (const s of p.sessions.filter(
      (s) => s.status === "completed" && inRange(s.date, start),
    ))
      grouped[s.date] = (grouped[s.date] || 0) + 1;
  } else {
    for (const a of p.activities.filter(
      (a) => inRange(a.date, start) && !["recovery", "rest"].includes(a.type),
    )) {
      if (metric === "swim" && !["swim", "aqua"].includes(a.type)) continue;
      const v = metric === "swim" ? a.distance || 0 : a.durationSec / 60;
      grouped[a.date] = (grouped[a.date] || 0) + v;
    }
  }
  return Object.entries(grouped)
    .sort()
    .map(([date, value]) => ({ date, value: round(value) }));
}
export function personalRecords(p) {
  const setList = allSets(p),
    byEx = {};
  for (const s of setList) {
    const key = s.exerciseId + "|" + s.unit;
    if (!byEx[key]) byEx[key] = [];
    byEx[key].push(s);
  }
  const records = Object.values(byEx).map((sets) => {
    const ex = exerciseById(sets[0].exerciseId);
    const positive = sets.filter((s) => s.weight > 0);
    const repValues = sets.filter((s) => s.reps != null).map((s) => s.reps);
    const singleSets = positive.filter(
      (s) =>
        s.reps != null &&
        (s.count || 1) === 1 &&
        !s.legacyAggregate &&
        s.unit !== "secondes",
    );
    const estimates =
      ex.bodyweight || ex.timed
        ? []
        : positive
            .map((s) => estimate1RM(s.weight, s.reps))
            .filter((v) => v != null);
    return {
      exerciseId: ex.id,
      name: ex.name,
      unit: sets[0].unit,
      weight: positive.length
        ? Math.max(...positive.map((s) => s.weight))
        : null,
      reps: repValues.length ? Math.max(...repValues) : null,
      best1RM: estimates.length ? Math.max(...estimates) : null,
      volume: singleSets.length
        ? Math.max(...singleSets.map((s) => s.weight * s.reps))
        : null,
      date: sets.at(-1).date,
    };
  });
  return records;
}
export function periodReport(p, period = "semaine", end = today()) {
  const current = stats(p, period, end),
    priorEnd = addDays(current.start, -1),
    last = stats(p, period, priorEnd);
  const balance = muscleBalance(p, current.start, end),
    trained = balance.filter((m) => m.sets > 0);
  const push = sum(
      balance
        .filter((m) => ["pec", "tri", "epA"].includes(m.muscle))
        .map((m) => m.sets),
    ),
    pull = sum(
      balance
        .filter((m) => ["dos", "bic", "epP"].includes(m.muscle))
        .map((m) => m.sets),
    );
  const keys = [
      ...new Set(
        allSets(p, { start: current.start, end }).map(
          (s) => s.exerciseId + "|" + s.unit,
        ),
      ),
    ],
    improving = [],
    stagnant = [],
    forceChanges = [];
  for (const key of keys) {
    const [id, unit] = key.split("|"),
      ex = exerciseById(id);
    if (ex.bodyweight || ex.timed) continue;
    const h = historyFor(p, id, unit).filter((h) => h.date <= end);
    const currentH = h.filter((h) => h.date >= current.start),
      previous = h.filter((h) => h.date < current.start).at(-1);
    if (!currentH.length || !previous) continue;
    const best = (entry) =>
      Math.max(0, ...entry.sets.map((s) => estimate1RM(s.weight, s.reps) || 0));
    const before = best(previous),
      now = best(currentH.at(-1));
    if (before <= 0 || now <= 0) continue;
    const delta = pctChange(before, now);
    forceChanges.push(delta);
    if (delta > 0 && !improving.includes(ex.name)) improving.push(ex.name);
    const comparable = h.slice(-3).map(best);
    if (
      comparable.length === 3 &&
      comparable.every((v) => v > 0 && v === comparable[0])
    )
      stagnant.push(ex.name);
  }
  const recommendations = [];
  if (current.recovery != null && current.recovery < 55)
    recommendations.push(
      "Alléger le prochain entraînement et privilégier une récupération facile.",
    );
  if (push > pull * 1.4 && push > 5)
    recommendations.push(
      "Volume de poussée supérieur au tirage sur la période : rééquilibrer avec du dos au prochain bloc.",
    );
  if (pull > push * 1.4 && pull > 5)
    recommendations.push(
      "Volume de tirage supérieur à la poussée sur la période : vérifier l’équilibre du haut du corps.",
    );
  if (current.adherence != null && current.adherence < 65)
    recommendations.push(
      "Réduire la durée des séances ou ajuster les jours disponibles plutôt que rattraper tout le volume.",
    );
  if (!trained.length)
    recommendations.push(
      "Enregistrer une première séance pour obtenir une analyse personnelle.",
    );
  if (current.recovery == null)
    recommendations.push(
      "Ajouter un bilan de récupération daté pour contextualiser les charges.",
    );
  if (stagnant.length)
    recommendations.push(
      "Trois références stables repérées : vérifier récupération, amplitude et régularité avant de changer le programme.",
    );
  if (!recommendations.length)
    recommendations.push(
      "Consolider la régularité et appliquer les recommandations par exercice, sans augmenter tous les paramètres en même temps.",
    );
  return {
    period,
    current,
    last,
    forceChange: round(avg(forceChanges)),
    volumeChange: pctChange(last.tonnage, current.tonnage),
    balance,
    improving,
    stagnant,
    undertrained: trained.length
      ? balance
          .filter(
            (m) =>
              ["pec", "dos", "qua", "fes", "isc"].includes(m.muscle) &&
              m.sets < m.target / 2,
          )
          .map((m) => MUSCLES[m.muscle])
      : [],
    recommendations,
  };
}
export const weeklyReport = (p, end = today()) =>
  periodReport(p, "semaine", end);
export function level(p) {
  const n = p.sessions.filter((s) => s.status === "completed").length;
  const thresholds = [0, 10, 40, 100, 200],
    names = ["Débutant", "Intermédiaire", "Avancé", "Expert", "Élite"];
  let i = 0;
  thresholds.forEach((t, j) => {
    if (n >= t) i = j;
  });
  return {
    name: names[i],
    index: i,
    count: n,
    next: thresholds[i + 1] || null,
    progress:
      i === 4
        ? 100
        : Math.round(
            ((n - thresholds[i]) / (thresholds[i + 1] - thresholds[i])) * 100,
          ),
  };
}
