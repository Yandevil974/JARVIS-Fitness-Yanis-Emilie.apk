import {
  moveScheduledFamily,
  rescheduleScheduledFamily,
} from "./schedule-group.js";
import {
  sourceDay,
  sourcePosition,
  sourceExtra,
  sourceTrainingDays,
  SOURCE_SCHEDULE_REVISION,
} from "./source-schedule.js";
import { sourceBlocks } from "./workout-flow.js";
import {
  findExercise,
  exerciseById,
  alternatives,
  legacy,
} from "../data/library.js";
import {
  today,
  uid,
  addDays,
  parseDate,
  monday,
  clamp,
  dayDiff,
} from "./utils.js";
import { recommendLoad, recoveryScore, repRange } from "./fitness.js";
import { validDate, numeric } from "./validation.js";
export const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const SMART_TEMPLATES = [
  {
    name: "Dos & biceps",
    focus: ["dos", "bic"],
    names: [
      "Tractions (pull-up)",
      "Rowing haltère un bras",
      "Tirage horizontal à la poulie",
      "Curl barre",
      "Face pull à la poulie",
    ],
  },
  {
    name: "Jambes & puissance",
    focus: ["qua", "isc", "fes"],
    names: [
      "Back squat",
      "Soulevé de terre roumain barre",
      "Leg curl machine",
      "Mollets debout",
      "Gainage planche",
    ],
  },
  {
    name: "Pectoraux & épaules",
    focus: ["pec", "epL", "tri"],
    names: [
      "Développé couché barre",
      "Développé haltères incliné 30°",
      "Élévations latérales haltères",
      "Extensions triceps poulie",
      "Dead bug",
    ],
  },
  {
    name: "Full body & stabilité",
    focus: ["fes", "dos", "pec", "qua"],
    names: [
      "Hip thrust barre",
      "Goblet squat",
      "Rowing haltère un bras",
      "Pompes",
      "Pallof press à l’élastique",
    ],
  },
  {
    name: "Haut du corps",
    focus: ["pec", "dos", "epL"],
    names: [
      "Développé couché barre",
      "Tirage vertical prise large",
      "Rowing haltère un bras",
      "Élévations latérales haltères",
      "Curl barre",
    ],
  },
  {
    name: "Chaîne postérieure",
    focus: ["fes", "isc", "abs"],
    names: [
      "Hip thrust barre",
      "Soulevé de terre roumain haltères",
      "Bulgarian split squat",
      "Abduction hanche à l’élastique",
      "Gainage planche",
    ],
  },
  {
    name: "Full body · tirage & jambes",
    focus: ["dos", "qua", "pec", "isc"],
    names: [
      "Soulevé de terre roumain haltères",
      "Fentes arrière au poids du corps",
      "Rowing à l’élastique",
      "Développé couché barre",
      "Gainage planche",
    ],
  },
];
export function makeTarget(
  ex,
  p,
  { week = 0, deload = false, goal = p.user.goal, sourceRow = null } = {},
) {
  let sets = sourceRow
    ? parseInt(sourceRow[2]) || 3
    : ex.level === "Avancé"
      ? 2
      : 3;
  const range = sourceRow ? repRange(sourceRow[3]) : null;
  let low = range ? range.low : goal === "strength" && !ex.bodyweight ? 5 : 8,
    high = range ? range.high : goal === "strength" && !ex.bodyweight ? 6 : 12;
  const sequence =
    sourceRow && /\d\s*[,/]\s*\d/.test(String(sourceRow[3]))
      ? String(sourceRow[3]).match(/\d+/g).map(Number)
      : null;
  if (goal === "hypertrophy" && week % 4 >= 2 && !sourceRow) sets = 4;
  if (p.user.level === "beginner" && !sourceRow) sets = 2;
  if (deload) sets = Math.max(1, Math.ceil(sets * 0.6));
  return {
    exerciseId: ex.id,
    unit: ex.bodyweight && !ex.timed ? "kg ajouté" : ex.unit,
    targetSets: clamp(sets, 1, 12),
    setScheme: sourceRow ? String(sourceRow[2]) : String(sets),
    repTargets: sequence,
    sourceNote: sourceRow?.[6] || "",
    sourceName: sourceRow?.[0] || ex.name,
    repsLow: clamp(low, 1, ex.timed ? 3600 : 100),
    repsHigh: clamp(high, 1, ex.timed ? 3600 : 100),
    repScheme: sourceRow ? String(sourceRow[3]) : `${low}–${high}`,
    seconds: ex.timed ? (sourceRow ? low : 30) : null,
    rest: sourceRow
      ? Math.max(0, Number(sourceRow[5]) || 0)
      : Math.max(goal === "strength" ? 120 : 60, ex.rest || 90),
    tempo: sourceRow?.[4] || ex.tempo || "3010",
    targetLoad: null,
    deload,
    priority: p.preferences.priorities.includes(ex.muscle)
      ? 4
      : ["dos", "pec", "qua", "isc", "fes"].includes(ex.muscle)
        ? 3
        : 1,
    sets: [],
  };
}
function available(ex, p) {
  if (
    ex.equipment.every((e) => p.equipment.includes(e)) &&
    !p.preferences.refused.includes(ex.id)
  )
    return ex;
  return alternatives(ex, p)[0] || null;
}
export function estimateMinutes(session) {
  return Math.ceil(
    8 +
      (session.exercises || []).reduce(
        (v, e) =>
          v +
          (e.targetSets *
            ((e.seconds || Math.min(e.repsHigh || 10, 15) * 4) +
              (e.rest ?? 90))) /
            60,
        0,
      ),
  );
}
export function suggestSession(p, index = 0, date = today(), opts = {}) {
  const t = SMART_TEMPLATES[index % SMART_TEMPLATES.length];
  const names =
    p.id === "emilie" && index === 0
      ? [
          "Hip thrust barre",
          "Soulevé de terre roumain haltères",
          "Bulgarian split squat",
          "Abduction hanche à l’élastique",
          "Dead bug",
        ]
      : t.names;
  const exercises = names
    .map(findExercise)
    .filter(Boolean)
    .map((e) => available(e, p))
    .filter(Boolean)
    .filter((e, i, a) => a.findIndex((v) => v.id === e.id) === i)
    .map((ex) => makeTarget(ex, p, opts));
  const session = {
    id: uid(),
    date,
    time: "18:00",
    type: "strength",
    name:
      p.id === "emilie" && index === 0
        ? "Fessiers & chaîne postérieure"
        : t.name,
    focus: p.id === "emilie" && index === 0 ? ["fes", "isc"] : t.focus,
    exercises,
    status: "planned",
    week: opts.week || 0,
    deload: !!opts.deload,
    source: "smart",
  };
  session.estimatedMinutes = estimateMinutes(session);
  return session;
}
/** Exact, immutable-source prescription. Logging and optional adaptations use a separate copy. */
export function sourceSession(
  p,
  phaseKey = "1",
  sessionKey = "J1",
  { date = today(), week = 0 } = {},
) {
  const key = String(phaseKey);
  const phase = legacy[p.id]?.PROGRAM[key];
  const original = phase?.sessions?.[sessionKey];
  if (!original)
    throw new Error("Séance absente du programme d’origine de ce profil.");
  const exercises = original.exos.map((row) => {
    const ex = findExercise(row[0]);
    if (!ex) throw new Error(`Exercice source introuvable : ${row[0]}`);
    return makeTarget(ex, p, { sourceRow: row, week, deload: false });
  });
  const session = {
    id: uid(),
    date,
    time: "18:00",
    type: "strength",
    name: original.nom,
    focus: [...original.muscles],
    exercises: sourceBlocks(exercises),
    status: "planned",
    week,
    deload: false,
    source: "legacy",
    sourceProfile: p.id,
    sourcePhaseKey: key,
    sourceSessionKey: sessionKey,
    sourceDeloadSuggested: !!phase.deload,
    method: phase.methode,
    objective: phase.objectif,
    phase: phase.titre,
    preservePrescription: true,
    sourceCardio: original.cardio ? structuredClone(original.cardio) : null,
    sourceMetcon: phase.metcon,
    standalone: true,
  };
  session.estimatedMinutes = estimateMinutes(session);
  return session;
}
export function generatePlan(
  p,
  {
    weeks = 12,
    frequency = p.user.frequency || 4,
    startDate = today(),
    days,
    goal = p.user.goal,
    source = "smart",
  } = {},
) {
  weeks = numeric(weeks, 1, 52, "Semaines", { optional: false, integer: true });
  frequency = numeric(frequency, 1, 6, "Fréquence", {
    optional: false,
    integer: true,
  });
  if (!validDate(startDate)) throw new Error("Date de départ invalide.");
  if (
    days &&
    (!Array.isArray(days) ||
      days.length !== frequency ||
      new Set(days).size !== frequency ||
      days.some((d) => !Number.isInteger(d) || d < 0 || d > 6))
  )
    throw new Error("Choisissez des jours distincts et valides.");
  if (source === "legacy")
    return generateSourcePlan(p, { weeks, frequency, startDate, days, goal });
  days =
    Array.isArray(days) && days.length === frequency
      ? [...new Set(days)].sort()
      : {
          1: [0],
          2: [0, 3],
          3: [0, 2, 4],
          4: [0, 1, 3, 5],
          5: [0, 1, 3, 4, 5],
          6: [0, 1, 2, 3, 4, 5],
        }[frequency];
  const sessions = [];
  let sequence = 0;
  let weekStart = monday(startDate);
  if (
    dayDiff(startDate, weekStart) > 0 &&
    days.every((d) => addDays(weekStart, d) < startDate)
  )
    weekStart = addDays(weekStart, 7);
  for (let week = 0; week < weeks; week++) {
    let ds = days
      .map((d) => addDays(weekStart, week * 7 + d))
      .filter((d) => d >= startDate);
    // A full first training week is used when a partial week cannot meet the requested frequency.
    if (week === 0 && ds.length < frequency) {
      weekStart = addDays(weekStart, 7);
      ds = days.map((d) => addDays(weekStart, d));
    }
    const deload = (week + 1) % 4 === 0;
    for (const date of ds) {
      let session;
      if (source === "legacy") {
        const phaseKey =
          week >= 48 ? "finale" : String(Math.floor(week / 4) + 1);
        const keys = Object.keys(legacy[p.id].PROGRAM[phaseKey].sessions);
        session = sourceSession(p, phaseKey, keys[sequence % keys.length], {
          date,
          week,
        });
        session.standalone = false;
        session.sourceDeloadSuggested =
          !!legacy[p.id].PROGRAM[phaseKey].deload && deload;
      } else {
        let idx =
          frequency <= 2 ? (sequence % 2 === 0 ? 3 : 6) : sequence % frequency;
        session = suggestSession(
          { ...p, user: { ...p.user, goal } },
          idx,
          date,
          { week, deload, goal },
        );
      }
      sessions.push(session);
      sequence++;
    }
  }
  return {
    id: uid(),
    name:
      source === "legacy"
        ? "Cycle source · 52 semaines"
        : "Programme adaptatif JARVIS",
    source,
    startDate: sessions[0]?.date || startDate,
    weeks,
    frequency,
    days,
    goal,
    createdAt: Date.now(),
    sessions,
  };
}
export function generateSourcePlan(
  p,
  {
    weeks = 52,
    frequency = p.user.frequency || 4,
    startDate = p.user.startDate || today(),
    days,
    goal = p.user.goal,
  } = {},
) {
  const context = { ...p, user: { ...p.user, startDate, frequency } },
    sessions = [];
  const planId = uid();
  let sequence = 0;
  const trainingDays = days || sourceTrainingDays(p.id, frequency);
  for (let i = 0; i < weeks * 7; i++) {
    const date = addDays(startDate, i),
      day = sourceDay(context, date, { frequency, days: trainingDays });
    if (day.type === "strength") {
      const s = sourceSession(context, day.phaseKey, day.sessionKey, {
        date,
        week: day.weekGlobal,
      });
      s.id = `${planId}:${date}:strength`;
      s.standalone = false;
      s.deload = day.deload;
      s.sourceDeloadSuggested = day.deload;
      s.sourceScheduleRevision = SOURCE_SCHEDULE_REVISION;
      if (day.deload) {
        s.sourcePeriodNote =
          "Semaine allégée prévue dans le HTML : environ 50 % du volume, pas de méthode intensive.";
        s.exercises = s.exercises.map((e) => ({
          ...e,
          sourceTargetSets: e.targetSets,
          targetSets:
            e.targetSets === 1
              ? 1
              : Math.max(1, Math.round(e.targetSets * 0.5)),
          sourcePeriodDeload: true,
        }));
      }
      s.estimatedMinutes = estimateMinutes(s);
      sessions.push(s);
      if (s.sourceCardio && !day.deload) {
        const c = s.sourceCardio,
          pool = c.apres === "piscine";
        sessions.push({
          id: `${planId}:${date}:post`,
          date,
          time: "19:15",
          type: pool ? "swim" : "cardio",
          name: pool
            ? "Piscine après musculation"
            : "Elliptique après musculation",
          status: "planned",
          source: "legacy",
          sourceKind: "post-cardio",
          parentId: s.id,
          phase: s.phase,
          sourcePhaseKey: day.phaseKey,
          week: day.weekGlobal,
          exercises: [],
          focus: [],
          components: [
            {
              key: "post",
              type: pool ? "swim" : "cardio",
              format: pool ? "pool" : "elliptical",
              name: c.apres,
              minutes: c.duree,
              seconds: c.duree * 60,
              customSteps: [
                {
                  name: c.detail,
                  seconds: c.duree * 60,
                  kind: "work",
                  pattern: pool ? "swim" : "walk",
                },
              ],
            },
          ],
          instructions: c.detail,
          estimatedMinutes: c.duree,
          sourceScheduleRevision: SOURCE_SCHEDULE_REVISION,
        });
      }
    } else if (day.type !== "rest") {
      if (["metcon", "swim"].includes(day.type)) sequence++;
      const extra = sourceExtra(context, day, { planning: true, sequence });
      sessions.push({
        id: `${planId}:${date}:extra`,
        date,
        time: "18:00",
        type: day.type,
        sourceKind: day.type,
        name: extra.name,
        status: "planned",
        source: "legacy",
        sourcePhaseKey: day.phaseKey,
        phase: day.phase.titre,
        week: day.weekGlobal,
        deload: day.deload,
        exercises: [],
        focus: [],
        components: extra.components,
        sourcePrescription: day.phase.metcon,
        transitionSeconds: extra.transitionSeconds,
        reason: extra.reason,
        estimatedMinutes: Math.ceil(
          (extra.components.reduce((n, c) => n + c.seconds, 0) +
            (extra.transitionSeconds || 0)) /
            60,
        ),
        sourceScheduleRevision: SOURCE_SCHEDULE_REVISION,
      });
    }
  }
  return {
    id: planId,
    name: `Programme HTML · ${p.user.name}`,
    source: "legacy",
    sourceScheduleRevision: SOURCE_SCHEDULE_REVISION,
    weeks,
    frequency,
    startDate,
    days: trainingDays,
    goal,
    sessions,
    createdAt: Date.now(),
  };
}
export function nextSession(p) {
  return (
    p.plan?.sessions
      .filter(
        (s) =>
          s.status === "planned" && s.date >= today() && s.type === "strength",
      )
      .sort((a, b) => a.date.localeCompare(b.date))[0] || null
  );
}
export function prepareWorkout(p, planned) {
  const s = structuredClone(planned || suggestSession(p));
  s.planId = planned?.standalone ? null : planned?.id || null;
  s.preservePrescription = s.source === "legacy" || !!s.preservePrescription;
  s.id = uid();
  s.date = today();
  s.status = "inProgress";
  s.startedAt = Date.now();
  s.durationSec = 0;
  s.currentIndex = 0;
  s.warmupDone = false;
  s.cooldownDone = false;
  const recovery = recoveryScore(p).score;
  s.equipmentChanges = [];
  s.exercises = sourceBlocks(s.exercises)
    .flatMap((e) => {
      const ex = exerciseById(e.exerciseId);
      if (
        ex.equipment.every((eq) => p.equipment.includes(eq)) &&
        !p.preferences.refused.includes(ex.id)
      )
        return [e];
      if (s.preservePrescription) {
        const refused = p.preferences.refused.includes(ex.id);
        s.equipmentChanges.push(
          refused
            ? `${e.sourceName || ex.name} : vous avez refusé cet exercice. Choisissez vous-même une alternative ou réautorisez-le dans sa fiche.`
            : `${e.sourceName || ex.name} : vérifiez le matériel déclaré. Votre exercice d’origine est conservé, sans remplacement automatique.`,
        );
        return [{ ...e, equipmentMismatch: true, unavailable: refused }];
      }
      const replacement = alternatives(ex, p)[0];
      if (!replacement) {
        s.equipmentChanges.push(
          `${ex.name} : matériel indisponible, exercice non commencé.`,
        );
        return [{ ...e, unavailable: true }];
      }
      s.equipmentChanges.push(`${ex.name} → ${replacement.name}`);
      return [
        {
          ...makeTarget(replacement, p),
          targetSets: e.targetSets,
          rest: e.rest,
          tempo: e.tempo,
          priority: e.priority,
          blockIndex: e.blockIndex,
          sourceNote: `Alternative à ${ex.name}. ${e.sourceNote || ""}`,
          repsLow:
            ex.timed === replacement.timed ? e.repsLow : replacement.repsLow,
          repsHigh:
            ex.timed === replacement.timed ? e.repsHigh : replacement.repsHigh,
          repScheme:
            ex.timed === replacement.timed
              ? e.repScheme
              : replacement.repScheme,
          targetLoad: null,
        },
      ];
    })
    .map((e) => {
      const rec = recommendLoad(p, e);
      return {
        ...e,
        sets: [],
        targetLoad: e.targetLoad ?? rec.weight,
        recommendation: rec,
        targetSets:
          !s.preservePrescription &&
          recovery != null &&
          recovery < 45 &&
          !s.recoveryAdapted &&
          !e.deload
            ? Math.max(1, Math.ceil(e.targetSets * 0.6))
            : e.targetSets,
      };
    });
  if (!s.preservePrescription && recovery != null && recovery < 45)
    s.recoveryAdapted = today();
  if (s.preservePrescription && recovery != null && recovery < 60)
    s.recoveryAdvice =
      "Récupération basse : demandez une adaptation à JARVIS si nécessaire. Aucune série de votre programme n’a été changée automatiquement.";
  return s;
}
export function shortenSession(session, minutes) {
  const s = structuredClone(session);
  s.exercises = sourceBlocks(s.exercises);
  const rests = Object.fromEntries(
    s.exercises.map((e) => [e.blockIndex, e.rest]),
  );
  if (s.exercises.length && !s.exercises.some((e) => (e.priority || 1) >= 3))
    s.exercises[0].priority = 3;
  minutes = numeric(minutes, 10, 180, "Durée cible", {
    optional: false,
    integer: true,
  });
  const changed = [];
  // Preserve all completed sets; prune low-priority work before the compound movements.
  let budget = s.exercises.reduce(
    (v, e) =>
      v +
      (Math.max(0, e.targetSets - e.sets.filter((x) => x.completed).length) *
        ((e.seconds || e.repsHigh * 4) + e.rest)) /
        60,
    0,
  );
  const indices = s.exercises
    .map((e, i) => i)
    .sort(
      (a, b) =>
        (s.exercises[a].priority || 1) - (s.exercises[b].priority || 1) ||
        b - a,
    );
  while (budget > Math.max(2, minutes - 4)) {
    let candidate = indices.find((i) => {
      const e = s.exercises[i];
      return (
        e.targetSets >
        Math.max(
          e.sets.filter((x) => x.completed).length,
          (e.priority || 1) >= 3 ? 2 : 0,
        )
      );
    });
    if (candidate == null)
      candidate = indices.find((i) => {
        const e = s.exercises[i];
        return (
          e.targetSets > Math.max(e.sets.filter((x) => x.completed).length, 1)
        );
      });
    if (candidate == null) break;
    const e = s.exercises[candidate];
    e.targetSets--;
    budget -= ((e.seconds || e.repsHigh * 4) + e.rest) / 60;
    changed.push(e.exerciseId);
  }
  s.exercises = s.exercises.filter((e) => e.targetSets > 0 || e.sets.length);
  for (const [block, rest] of Object.entries(rests)) {
    const last = s.exercises
      .filter((e) => String(e.blockIndex) === block)
      .at(-1);
    if (last) last.rest = Math.max(last.rest || 0, rest);
  }
  s.estimatedMinutes = estimateMinutes(s);
  s.timeBudget = minutes;
  s.userAdapted = true;
  s.currentIndex = Math.min(s.currentIndex || 0, s.exercises.length - 1);
  return {
    session: s,
    removedSets: changed.length,
    estimatedRemaining: Math.ceil(budget + 4),
    reason:
      "Mouvements essentiels et séries déjà réalisées conservés ; volume accessoire réduit en premier.",
  };
}
export function moveSession(p, id, date, options) {
  return moveScheduledFamily(p, id, date, options);
}
export function rescheduleMissed(p, id) {
  return rescheduleScheduledFamily(p, id);
}
export function adaptRecovery(p) {
  const score = recoveryScore(p).score;
  if (score == null || score >= 60) return { changed: false, profile: p };
  const q = structuredClone(p);
  const s = q.workout || nextSession(q);
  if (!s) return { changed: false, profile: q };
  if (s.recoveryAdapted === today()) return { changed: false, profile: q };
  for (const e of s.exercises) {
    const done = e.sets?.filter((x) => x.completed).length || 0;
    e.targetSets = Math.max(
      done,
      Math.max(1, Math.ceil(e.targetSets * (score < 45 ? 0.6 : 0.8))),
    );
    const rec = recommendLoad(q, e);
    if (rec.weight != null) e.targetLoad = rec.weight;
  }
  s.recoveryAdapted = today();
  s.userAdapted = true;
  s.estimatedMinutes = estimateMinutes(s);
  q.adaptations.unshift({
    id: uid(),
    date: today(),
    at: Date.now(),
    label: "Récupération prise en compte",
    detail: `Score déclaré ${score}/100 : volume ${score < 45 ? "−40 %" : "−20 %"} environ, séries réalisées conservées.`,
  });
  return { changed: true, profile: q };
}
