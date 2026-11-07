// État du coach de la semaine — chantier 1 (propositions A–E validées le
// 02/10/2026). UNE SEULE décision, calculée uniquement à partir de données
// réelles (RPE/RIR saisis, séances prévues/manquées, bilans, récupération,
// douleurs), affichée de façon identique par l'équipe, la carte « Le coach a
// noté » et l'en-tête de la prochaine séance. Jamais de chiffre inventé :
// quand une donnée manque, elle n'entre pas dans la décision.

import { recoveryScore, allSets } from "./fitness.js";
import { plannedSessions } from "./plan-memory.js";
import { nextSession, estimateMinutes } from "./planner.js";
import { today, addDays, monday, num, round, numberLabel } from "./utils.js";

export const RPE_HIGH = 8.5; // au-dessus : proposer d'alléger (C)
export const RPE_LOW = 6.5; // en dessous, tout terminé : prêt à progresser (C)
export const RECOVERY_DELOAD = 45; // en dessous : décharge forte
export const RECOVERY_WATCH = 55; // en dessous : alléger
export const GAP_REPRISE = 8; // jours sans séance : reprise progressive

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

function weekStats(p, date) {
  const start = monday(date),
    end = addDays(start, 6);
  const planned = plannedSessions(p).filter(
    (s) => s.type === "strength" && s.date >= start && s.date <= end,
  );
  const sets = allSets(p, { start, end });
  const effort = sets.filter((s) => num(s.rpe) != null),
    reserve = sets.filter((s) => num(s.rir) != null);
  return {
    start,
    end,
    planned: planned.length,
    completed: planned.filter((s) => ["completed", "partial"].includes(s.status))
      .length,
    missed: planned.filter((s) => s.status === "missed").length,
    sessions: planned,
    sets: sets.length,
    incomplete: sets.filter((s) => s.reps == null).length,
    rpe: effort.length
      ? round(effort.reduce((n, s) => n + s.rpe, 0) / effort.length, 1)
      : null,
    rir: reserve.length
      ? round(reserve.reduce((n, s) => n + s.rir, 0) / reserve.length, 1)
      : null,
  };
}

function recentCheckIns(p, date, days) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(date, -i);
    if (p.checkIns?.[d]) out.push({ date: d, ...p.checkIns[d] });
  }
  return out;
}

// Un bilan ne compte que s'il est récent (8 jours) : une douleur déclarée il
// y a un mois ne doit pas bloquer la progression d'aujourd'hui.
const REVIEW_FRESH_DAYS = 8;
function lastReview(p, date) {
  const r = [...(p.teamReviews || [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];
  if (!r) return null;
  if (!r.date || daysBetween(r.date, date) > REVIEW_FRESH_DAYS) return null;
  return r;
}

// Facteurs mesurés, chacun avec sa valeur réelle (ou null si absente).
export function coachFactors(p, date = today()) {
  const week = weekStats(p, date);
  const checks = recentCheckIns(p, date, 3);
  const scores = checks
    .map((c) => recoveryScore(p, c.date).score)
    .filter((s) => s != null);
  const recToday = recoveryScore(p, date).score;
  const painDates = checks.filter((c) => c.painReported).map((c) => c.date);
  const review = lastReview(p, date);
  const past = (p.plan?.sessions || [])
    .filter((s) => s.date < date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  let missedStreak = 0;
  for (const s of past)
    if (s.status === "missed" || s.status === "planned") missedStreak++;
    else break;
  const lastDone = [...(p.sessions || [])]
    .filter((s) => s.status === "completed" && s.date <= date)
    .map((s) => s.date)
    .sort()
    .pop();
  return {
    week,
    rpe: week.rpe,
    rir: week.rir,
    setsCount: week.sets,
    missedStreak,
    missedWeek: week.missed,
    plannedWeek: week.planned,
    completedWeek: week.completed,
    incompleteSets: week.incomplete,
    recoveryToday: recToday,
    recovery3: scores.length
      ? Math.round(scores.reduce((n, s) => n + s, 0) / scores.length)
      : null,
    painDates,
    review,
    reviewFatigue: num(review?.fatigue) ?? null,
    reviewPain: num(review?.pain) ?? null,
    gapDays: lastDone ? daysBetween(lastDone, date) : null,
    hasAnyData:
      !!p.sessions?.length ||
        !!Object.keys(p.checkIns || {}).length ||
        !!(p.teamReviews || []).length,
  };
}

export const COACH_DECISIONS = {
  protect: {
    label: "Douleur signalée — protéger avant tout",
    severity: "high",
    volumeFactor: 0.8,
  },
  deload: {
    label: "Décharge forte — volume réduit d'environ 40 %",
    severity: "high",
    volumeFactor: 0.6,
  },
  lighten: {
    label: "Alléger la prochaine séance — volume réduit d'environ 20 %",
    severity: "medium",
    volumeFactor: 0.8,
  },
  reprise: {
    label: "Reprise progressive après la coupure",
    severity: "medium",
    volumeFactor: 0.8,
  },
  progress: {
    label: "Prêt à progresser — charge à augmenter",
    severity: "low",
    volumeFactor: 1,
  },
  maintain: {
    label: "Cap maintenu",
    severity: "low",
    volumeFactor: 1,
  },
  nodata: {
    label: "En attente de vos retours",
    severity: "low",
    volumeFactor: 1,
  },
};

// La décision unique de la semaine. `reviewOverride` permet au bilan qui
// vient d'être saisi d'entrer immédiatement dans la décision (il n'est pas
// encore enregistré quand les réponses sont calculées).
export function weeklyCoachState(p, date = today(), reviewOverride = null) {
  const f = coachFactors(p, date);
  const review = reviewOverride || f.review;
  const reviewFatigue = num(review?.fatigue) ?? f.reviewFatigue;
  const reviewPain = num(review?.pain) ?? f.reviewPain;
  const reasons = [];
  let decision = "maintain";

  if (f.painDates.length || reviewPain >= 3) {
    decision = "protect";
    if (f.painDates.length)
      reasons.push(`douleur signalée le ${f.painDates.join(", ")}`);
    if (reviewPain >= 3) reasons.push(`douleur déclarée ${reviewPain}/5 au bilan`);
  } else if (
    (f.recovery3 != null && f.recovery3 < RECOVERY_DELOAD) ||
    reviewFatigue >= 4
  ) {
    decision = "deload";
    if (f.recovery3 != null && f.recovery3 < RECOVERY_DELOAD)
      reasons.push(`récupération moyenne ${f.recovery3}/100 sur 3 jours`);
    if (reviewFatigue >= 4)
      reasons.push(`fatigue déclarée ${reviewFatigue}/5 au bilan`);
  } else if (
    (f.rpe != null && f.rpe > RPE_HIGH) ||
    (f.recoveryToday != null && f.recoveryToday < RECOVERY_WATCH) ||
    reviewFatigue === 3
  ) {
    decision = "lighten";
    if (f.rpe != null && f.rpe > RPE_HIGH)
      reasons.push(`RPE moyen ${f.rpe}/10 au-dessus de ${RPE_HIGH}`);
    if (f.recoveryToday != null && f.recoveryToday < RECOVERY_WATCH)
      reasons.push(`récupération du jour ${f.recoveryToday}/100`);
    if (reviewFatigue === 3) reasons.push(`fatigue déclarée 3/5 au bilan`);
  } else if (f.gapDays != null && f.gapDays >= GAP_REPRISE) {
    decision = "reprise";
    reasons.push(`${f.gapDays} jours sans séance terminée`);
  } else if (
    f.rpe != null &&
    f.rpe <= RPE_LOW &&
    f.plannedWeek > 0 &&
    f.completedWeek === f.plannedWeek &&
    f.setsCount > 0 &&
    f.incompleteSets === 0
  ) {
    decision = "progress";
    reasons.push(
      `RPE moyen ${f.rpe}/10 ≤ ${RPE_LOW}`,
      `${f.completedWeek}/${f.plannedWeek} séances terminées, séries complètes`,
    );
  } else if (!f.hasAnyData) decision = "nodata";

  if (f.missedStreak >= 3 && !["protect", "deload"].includes(decision))
    reasons.push(`${f.missedStreak} séances non réalisées d'affilée`);
  if (f.rir != null && f.rir <= 0.5)
    reasons.push(`RIR moyen ${f.rir} : séries très proches de l'échec`);

  const meta = COACH_DECISIONS[decision];
  return {
    decision,
    label: meta.label,
    severity: meta.severity,
    volumeFactor: meta.volumeFactor,
    reasons,
    detail: decisionDetail(decision, f, reviewFatigue, reviewPain),
    factors: f,
  };
}

function decisionDetail(decision, f, reviewFatigue, reviewPain) {
  switch (decision) {
    case "protect":
      return "Une douleur a été signalée : la prochaine séance est réduite et les mouvements douloureux doivent être retirés, pas forcés. Une douleur vive ou persistante justifie un avis professionnel.";
    case "deload":
      return `Vos indicateurs sont bas (${[
        f.recovery3 != null ? `récupération ${f.recovery3}/100` : null,
        reviewFatigue >= 4 ? `fatigue ${reviewFatigue}/5` : null,
      ]
        .filter(Boolean)
        .join(", ")}). Je réduis le volume d'environ 40 % sur la prochaine séance pour repartir sans casser la progression.`;
    case "lighten":
      return `Effort perçu ou fatigue au-dessus du confortable (${[
        f.rpe != null && f.rpe > RPE_HIGH ? `RPE moyen ${f.rpe}/10` : null,
        f.recoveryToday != null && f.recoveryToday < RECOVERY_WATCH
          ? `récupération ${f.recoveryToday}/100`
          : null,
        reviewFatigue === 3 ? "fatigue 3/5 au bilan" : null,
      ]
        .filter(Boolean)
        .join(", ")}). Une séance allégée d'environ 20 % vaut mieux qu'une séance forcée.`;
    case "reprise":
      return `Après ${f.gapDays} jours sans séance, reprendre aux charges d'avant expose à la blessure : la première séance est réduite d'environ 20 %, puis retour au programme.`;
    case "progress":
      return `Toutes les séances de la semaine sont terminées avec un RPE moyen de ${f.rpe}/10 : c'est le signal d'une progression. À la prochaine séance, les charges principales seront proposées à +${numberLabel(2.5)} kg (votre incrément), en gardant 1 à 2 répétitions en réserve.`;
    case "nodata":
      return "Renseignez votre bilan du jour (sommeil, fatigue, motivation) et vos séries : mes décisions s'appuient sur ces retours, jamais sur des suppositions.";
    default:
      return f.rpe != null
        ? `RPE moyen ${f.rpe}/10, ${f.completedWeek}/${f.plannedWeek} séances réalisées : le programme se poursuit tel quel.`
        : "Le programme se poursuit tel quel. Vos prochains retours affineront mes décisions.";
  }
}

// Applique la décision à une séance (brouillon modifiable) : le volume est
// réduit selon le facteur, les séries déjà réalisées sont toujours gardées.
export function applyCoachStateToSession(session, state) {
  if (!session || state.volumeFactor >= 1) return false;
  let changed = false;
  for (const e of session.exercises || []) {
    const done = e.sets?.filter((s) => s.completed).length || 0;
    const target = Math.max(
      done,
      Math.max(1, Math.round(e.targetSets * state.volumeFactor)),
    );
    if (target !== e.targetSets) ((e.targetSets = target), (changed = true));
  }
  if (changed) {
    session.coachAdapted = today();
    session.coachState = state.decision;
    session.userAdapted = true;
    session.estimatedMinutes = estimateMinutes(session);
  }
  return changed;
}

// Bilan → action (proposition B) : un bilan enregistré avec fatigue ≥ 4 ou
// douleur ≥ 3 drape automatiquement la prochaine séance. Une seule fois par
// jour et par séance ; toujours visible dans « Mes adaptations ».
export function applyReviewAdaptation(p, review) {
  const fatigue = num(review?.fatigue),
    pain = num(review?.pain);
  if (!((fatigue != null && fatigue >= 4) || (pain != null && pain >= 3)))
    return { changed: false, detail: "" };
  const s = p.workout || nextSession(p);
  if (!s || s.coachAdapted === today())
    return { changed: false, detail: "" };
  const factor = fatigue >= 4 ? 0.6 : 0.8;
  for (const e of s.exercises || []) {
    const done = e.sets?.filter((x) => x.completed).length || 0;
    e.targetSets = Math.max(
      done,
      Math.max(1, Math.round(e.targetSets * factor)),
    );
  }
  s.coachAdapted = today();
  s.coachState = pain >= 3 ? "protect" : "deload";
  s.userAdapted = true;
  s.reviewAdapted = { date: review.date || today(), fatigue, pain };
  s.estimatedMinutes = estimateMinutes(s);
  const detail =
    pain >= 3
      ? `Douleur déclarée ${pain}/5 au bilan : prochaine séance réduite d'environ ${Math.round((1 - factor) * 100)} % — retirez les mouvements douloureux, ne les forcez pas.`
      : `Fatigue déclarée ${fatigue}/5 au bilan : prochaine séance réduite d'environ ${Math.round((1 - factor) * 100)} %.`;
  return { changed: true, detail };
}
