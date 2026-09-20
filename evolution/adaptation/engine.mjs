import { today, validDate, addDays } from "../reminders/engine.mjs";
const obj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const rows = (v) => (Array.isArray(v) ? v.filter(obj) : []);
const number = (v, min, max) =>
  (typeof v === "number" || (typeof v === "string" && v.trim() !== "")) &&
  Number.isFinite(Number(v)) &&
  Number(v) >= min &&
  Number(v) <= max
    ? Number(v)
    : null;
const integer = (v, min, max) => {
  const n = number(v, min, max);
  return Number.isInteger(n) ? n : null;
};
const text = (v) => (typeof v === "string" ? v : "");
export const RULE_VERSION = 1;
export const LABELS = {
  increase: "Hausse prudente à envisager",
  maintain: "Maintien proposé",
  deload: "Allègement à envisager",
  insufficient: "Données insuffisantes",
  safety: "Prudence — pas de progression proposée",
};
const units = new Set(["kg total", "kg/main"]);
function appointments(p) {
  return obj(p.appointments?.records)
    ? Object.values(p.appointments.records).filter(obj)
    : [];
}
function check(p, date) {
  return obj(p.checkIns?.[date]) ? p.checkIns[date] : {};
}
function feedback(p, s) {
  return appointments(p).filter(
    (r) =>
      r.kind === "post" &&
      r.ref === "session:" + s.id &&
      r.date === s.date &&
      obj(r.answers),
  );
}
function pain(p, s) {
  return (
    check(p, s.date).painReported === true ||
    feedback(p, s).some((r) => r.answers.pain === "yes")
  );
}
function clearPain(p, s) {
  return (
    check(p, s.date).painReported === false ||
    feedback(p, s).some((r) => r.answers.pain === "no")
  );
}
export function readiness(p, day = today()) {
  const c = check(p, day),
    a = appointments(p).filter(
      (r) => r.kind === "pre" && r.date === day && obj(r.answers),
    );
  const weekly = rows(p.teamReviews)
    .filter(
      (r) => validDate(r.date) && r.date >= addDays(day, -6) && r.date <= day,
    )
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const painFlag =
    c.painReported === true ||
    a.some((r) => r.answers.pain === "yes") ||
    number(weekly?.pain, 1, 5) >= 4;
  const reasons = [];
  if (painFlag)
    reasons.push(
      "Une douleur importante est signalée aujourd’hui ou une douleur élevée figure dans le dernier bilan des 7 jours. Ne poursuis pas l’effort douloureux ; demande un avis professionnel si elle est vive ou persistante.",
    );
  if (number(c.fatigue, 1, 5) >= 4 || number(weekly?.fatigue, 1, 5) >= 4)
    reasons.push(
      "Fatigue élevée renseignée : pas de hausse chiffrée aujourd’hui.",
    );
  if (
    (number(c.energy, 1, 5) != null && number(c.energy, 1, 5) <= 2) ||
    a.some(
      (r) =>
        number(r.answers.energy, 1, 5) != null &&
        number(r.answers.energy, 1, 5) <= 2,
    )
  )
    reasons.push("Énergie basse renseignée aujourd’hui.");
  if (number(c.sleep, 0, 24) != null && number(c.sleep, 0, 24) < 6)
    reasons.push(
      "Moins de 6 heures de sommeil renseignées : règle de prudence, pas un diagnostic.",
    );
  const knownPain =
    c.painReported === false || a.some((r) => r.answers.pain === "no");
  return { pain: painFlag, caution: reasons.length > 0, knownPain, reasons };
}
// Textual prescriptions must not hide pyramids, AMRAP or drop sets behind a numeric range.
function simpleScheme(e) {
  const reps = text(e.repScheme).trim();
  if (reps) {
    const m = reps.match(/^(\d+)\s*(?:[-–à]\s*(\d+))?$/);
    if (
      !m ||
      Number(m[1]) !== Number(e.repsLow) ||
      Number(m[2] || m[1]) !== Number(e.repsHigh)
    )
      return false;
  }
  const sets = text(e.setScheme).trim();
  return !sets || (/^\d+$/.test(sets) && Number(sets) === Number(e.targetSets));
}
// Prescription and exercise order, not session name or invented semantic matches.
function prescription(s) {
  const ex = rows(s.exercises);
  if (!ex.length || new Set(ex.map((e) => e.exerciseId)).size !== ex.length)
    return null;
  const fields = [];
  for (const e of ex) {
    if (
      !simpleScheme(e) ||
      !text(e.exerciseId) ||
      !text(e.unit) ||
      integer(e.targetSets, 1, 12) == null ||
      integer(e.repsLow, 1, 100) == null ||
      integer(e.repsHigh, 1, 100) == null ||
      Number(e.repsLow) > Number(e.repsHigh) ||
      number(e.rest, 0, 3600) == null ||
      !text(e.tempo).trim() ||
      (Array.isArray(e.repTargets) && e.repTargets.length)
    )
      return null;
    fields.push([
      e.exerciseId,
      e.unit,
      Number(e.targetSets),
      Number(e.repsLow),
      Number(e.repsHigh),
      Number(e.rest),
      e.tempo,
      e.blockIndex ?? null,
      e.repScheme ?? null,
      e.setScheme ?? null,
      !!e.deload,
    ]);
  }
  return JSON.stringify([
    s.source ?? null,
    s.sourcePhaseKey ?? null,
    s.phase ?? null,
    s.method ?? null,
    !!s.deload,
    fields,
  ]);
}
function sample(s, exerciseId) {
  if (s.status !== "completed")
    return {
      error:
        "Séance partielle ou non terminée : elle ne prouve pas un plateau.",
    };
  if (s.needsDate || !validDate(s.date))
    return { error: "Date réelle manquante." };
  const ex = rows(s.exercises).filter((e) => e.exerciseId === exerciseId);
  if (ex.length !== 1)
    return {
      error: "Exercice absent ou présent plusieurs fois : comparaison ambiguë.",
    };
  const e = ex[0],
    signature = prescription(s);
  if (!signature)
    return {
      error:
        "Prescription incomplète ou schéma variable : séries, plage de répétitions, tempo, repos et ordre doivent être comparables.",
    };
  if (s.deload || e.deload || s.sourceDeloadSuggested)
    return {
      error:
        "Séance allégée prévue : ne pas en déduire une baisse de performance.",
    };
  if (!units.has(e.unit))
    return {
      error:
        "Comparaison chiffrée limitée aux kg total et kg/main, séparément. Poids du corps, charge ajoutée, secondes et conventions à vérifier ne sont pas assimilés.",
    };
  const sets = rows(e.sets).filter((x) => x.completed === true);
  if (sets.length !== Number(e.targetSets))
    return {
      error:
        "Nombre de séries réalisées différent du nombre prévu : comparaison insuffisante.",
    };
  const seen = new Set();
  for (const x of sets) {
    if (
      !text(x.id) ||
      seen.has(x.id) ||
      x.unit !== e.unit ||
      x.legacyAggregate ||
      x.needsReps ||
      x.needsLoad ||
      (x.count != null && Number(x.count) !== 1) ||
      number(x.weight, 0.1, 1000) == null ||
      integer(x.reps, 1, 100) == null
    )
      return {
        error:
          "Séries agrégées, dupliquées, incomplètes ou unités incohérentes : aucune performance reconstituée.",
      };
    seen.add(x.id);
  }
  const weights = sets.map((x) => Number(x.weight));
  if (weights.some((w) => w !== weights[0]))
    return {
      error:
        "Charges variables entre séries : pas de comparaison simplifiée de répétitions.",
    };
  const effort = sets.map((x) => ({
    rpe: number(x.rpe, 1, 10),
    rir: number(x.rir, 0, 10),
  }));
  const invalidEffort = sets.some((x, i) =>
    ["rpe", "rir"].some(
      (k) => x[k] != null && x[k] !== "" && effort[i][k] == null,
    ),
  );
  if (invalidEffort)
    return {
      error: "RPE ou RIR invalide : corriger les séries avant comparaison.",
    };
  const contradictory = effort.some(
    (x) =>
      x.rpe != null &&
      x.rir != null &&
      ((x.rpe >= 9 && x.rir >= 2) || (x.rpe <= 8 && x.rir <= 1)),
  );
  const effortKnown = effort.every((x) => x.rpe != null || x.rir != null);
  const reserve = effort.every(
    (x) =>
      (x.rpe != null || x.rir != null) &&
      (x.rpe == null || x.rpe <= 8) &&
      (x.rir == null || x.rir >= 2),
  );
  const hard = effort.some((x) => x.rpe >= 9 || (x.rir != null && x.rir <= 1));
  return {
    signature,
    id: s.id,
    date: s.date,
    unit: e.unit,
    weight: weights[0],
    sets: sets.length,
    reps: sets.map((x) => Number(x.reps)),
    totalReps: sets.reduce((n, x) => n + Number(x.reps), 0),
    low: Number(e.repsLow),
    high: Number(e.repsHigh),
    effortKnown,
    contradictory,
    reserve,
    hard,
    struggling: sets.some(
      (x, i) =>
        Number(x.reps) < Number(e.repsLow) &&
        (effort[i].rpe >= 9 || (effort[i].rir != null && effort[i].rir <= 1)),
    ),
    effort,
    top: sets.every((x) => Number(x.reps) >= Number(e.repsHigh)),
    miss: sets.some((x) => Number(x.reps) < Number(e.repsLow)),
  };
}
function commentNeedsReview(value) {
  const t = text(value).trim().toLowerCase();
  return (
    t !== "" &&
    !["ras", "r.a.s.", "rien à signaler", "aucun problème", "aucun"].includes(t)
  );
}
function shifted(weight, increment, direction) {
  const to = Number((weight + direction * increment).toFixed(6));
  return Math.abs(to - weight - direction * increment) <= 1e-9 ? to : null;
}
function result(base, status, reasons, extra = {}) {
  return {
    ...base,
    status,
    title: LABELS[status],
    reasons: [...reasons],
    ...extra,
  };
}
export function analyzeExercise(p, exerciseId, { day = today() } = {}) {
  if (!validDate(day)) throw Error("Date d’analyse invalide.");
  const base = {
    ruleVersion: RULE_VERSION,
    profileId: p.id,
    exerciseId,
    day,
    evidence: [],
    proposal: null,
  };
  const ready = readiness(p, day);
  if (ready.pain) return result(base, "safety", ready.reasons);
  const all = rows(p.sessions).filter(
    (s) =>
      rows(s.exercises).some((e) => e.exerciseId === exerciseId) &&
      ["completed", "partial"].includes(s.status),
  );
  // A missing date or ambiguous duplicate must not disappear behind older successes.
  if (
    all.some((s) => s.needsDate || !validDate(s.date) || !text(s.id)) ||
    new Set(all.map((s) => s.id)).size !== all.length
  )
    return result(base, "insufficient", [
      "Une réalisation de cet exercice est non datée ou possède un identifiant ambigu. Corrige son historique avant de conclure.",
    ]);
  const exposures = all
    .filter((s) => s.date <= day)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        Number(b.finishedAt || 0) - Number(a.finishedAt || 0),
    );
  if (exposures.length < 2)
    return result(base, "insufficient", [
      "Deux réalisations à des dates distinctes sont nécessaires. Ni le programme prévu, ni une séance en cours, ni le cardio ne remplacent ces données.",
    ]);
  const pair = exposures.slice(0, 2);
  base.sourceIds = pair.map((s) => s.id);
  if (pair.some((s) => pain(p, s)))
    return result(base, "safety", [
      "Une douleur importante est signalée pour une des deux dernières séances. Pas de progression proposée à partir de ces efforts.",
    ]);
  if (pair[0].date === pair[1].date)
    return result(base, "insufficient", [
      "Deux enregistrements du même jour ne comptent pas comme deux confirmations indépendantes.",
    ]);
  if (pair.some((s) => s.date < addDays(day, -42)))
    return result(base, "insufficient", [
      "Les deux dernières réalisations ne sont pas toutes dans les 42 derniers jours. Refaire le point sur des séances habituelles récentes, pas un test maximal.",
    ]);
  const measured = pair.map((s) => sample(s, exerciseId));
  base.evidence = measured.filter((s) => !s.error);
  const errors = measured.filter((s) => s.error).map((s) => s.error);
  if (errors.length) return result(base, "insufficient", [...new Set(errors)]);
  const [last, previous] = measured;
  if (last.signature !== previous.signature)
    return result(base, "insufficient", [
      "Les deux dernières séances diffèrent : prescription, phase, unité, ordre, tempo ou repos. Les anciennes réussites ne sont pas sélectionnées à leur place.",
    ]);
  if (last.weight !== previous.weight)
    return result(base, "insufficient", [
      "La charge réelle a changé : une différence de répétitions seule ne prouve ni progrès ni recul.",
    ]);
  base.comparison = {
    deltaReps: last.totalReps - previous.totalReps,
    percent:
      Math.round(
        ((last.totalReps - previous.totalReps) / previous.totalReps) * 1000,
      ) / 10,
  };
  const uncertain = [];
  if (measured.some((s) => s.contradictory))
    uncertain.push(
      "RPE et RIR indiquent des marges contradictoires : vérifier la saisie, sans choisir seulement l’indicateur favorable.",
    );
  if (!measured.every((s) => s.effortKnown))
    uncertain.push(
      "RIR ou RPE manque sur au moins une série ; aucune marge d’effort n’est inventée.",
    );
  if (!ready.knownPain)
    uncertain.push(
      "La douleur du jour n’est pas explicitement renseignée. Faire le rendez-vous avant séance.",
    );
  if (!pair.every((s) => clearPain(p, s)))
    uncertain.push(
      "Absence de douleur non confirmée pour les deux séances : compléter les retours après séance.",
    );
  if (uncertain.length) return result(base, "insufficient", uncertain);
  if (ready.caution) return result(base, "maintain", ready.reasons);
  if (
    pair.some((s) =>
      feedback(p, s).some(
        (r) =>
          number(r.answers.effort, 1, 10) >= 9 ||
          commentNeedsReview(r.answers.problems) ||
          text(r.answers.location).trim(),
      ),
    )
  )
    return result(base, "maintain", [
      "Un retour après séance indique un effort très élevé ou contient un commentaire à relire. Relire ce retour avant toute hausse ; le texte n’est pas interprété automatiquement.",
    ]);
  const increment = number(p.user?.increment, 0.1, 20);
  if (measured.every((s) => s.struggling)) {
    const target =
      increment != null &&
      increment / last.weight <= 0.1 &&
      last.weight > increment
        ? shifted(last.weight, increment, -1)
        : null;
    return result(
      base,
      "deload",
      [
        "Sur deux séances comparables, au moins une série reste sous le bas de la plage avec un effort élevé (RPE ≥ 9 ou RIR ≤ 1).",
        "Cela ne diagnostique pas un surentraînement. Envisager une séance moins exigeante puis réévaluer.",
      ],
      {
        proposal:
          target == null
            ? null
            : {
                field: "targetLoad",
                from: last.weight,
                to: target,
                unit: last.unit,
                scope: "Prochaine séance de même prescription",
                increment,
              },
        ...(!target
          ? {
              limitation:
                "Aucun petit palier de baisse chiffrable avec l’incrément renseigné.",
            }
          : {}),
      },
    );
  }
  if (measured.every((s) => s.top && s.reserve)) {
    if (
      increment == null ||
      increment / last.weight > 0.05 ||
      last.weight + increment > 1000 ||
      shifted(last.weight, increment, 1) == null
    )
      return result(base, "maintain", [
        "Objectif haut atteint deux fois avec marge, mais le palier renseigné est absent, inexploitable ou dépasse la limite prudente de 5 %. Vérifier le matériel ; aucun palier fictif n’est créé.",
      ]);
    return result(
      base,
      "increase",
      [
        "Toutes les séries atteignent le haut de la plage sur les deux dernières séances comparables.",
        "Chaque série a une marge renseignée : RIR ≥ 2 ou RPE ≤ 8, sans indicateur contradictoire.",
        "Un seul palier configuré, limité à 5 % de la charge réelle ; ne pas chercher un maximum.",
      ],
      {
        proposal: {
          field: "targetLoad",
          from: last.weight,
          to: shifted(last.weight, increment, 1),
          unit: last.unit,
          scope: "Prochaine séance de même prescription",
          increment,
        },
      },
    );
  }
  return result(base, "maintain", [
    "Les critères de hausse ou d’allègement répété ne sont pas réunis. Conserver le repère actuel sur une séance identique et enregistrer les séries réelles.",
    "Ce maintien n’est ni un diagnostic de stagnation ni une preuve d’absence de progrès.",
  ]);
}
export function exerciseOptions(p, day = today()) {
  const ids = new Set();
  for (const s of rows(p.sessions)
    .filter(
      (s) =>
        ["completed", "partial"].includes(s.status) &&
        (!validDate(s.date) || s.date <= day),
    )
    .sort((a, b) => text(b.date).localeCompare(text(a.date))))
    for (const e of rows(s.exercises))
      if (text(e.exerciseId)) ids.add(e.exerciseId);
  return [...ids];
}
