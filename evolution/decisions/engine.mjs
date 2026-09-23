import {
  analyzeExercise,
  prescription,
  sample,
} from "../adaptation/engine.mjs";
import { today, validDate, addDays } from "../reminders/engine.mjs";
const obj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const rows = (v) => (Array.isArray(v) ? v.filter(obj) : []);
export function canonical(v) {
  if (Array.isArray(v))
    return "[" + v.map((x) => canonical(x ?? null)).join(",") + "]";
  if (obj(v))
    return (
      "{" +
      Object.keys(v)
        .filter((k) => v[k] !== undefined)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonical(v[k]))
        .join(",") +
      "}"
    );
  return JSON.stringify(v ?? null);
}
export function records(p) {
  return rows(p.evolutionDecisions?.records).filter(
    (r) =>
      r.profileId === p.id &&
      typeof r.id === "string" &&
      ["accepted", "refused", "postponed"].includes(r.choice) &&
      validDate(r.date) &&
      obj(r.analysis) &&
      typeof r.analysis.exerciseId === "string" &&
      typeof r.key === "string" &&
      (!r.applied ||
        (obj(r.target) &&
          obj(r.target.afterShape) &&
          typeof r.target.afterLoad === "number" &&
          typeof r.target.unit === "string" &&
          validDate(r.target.date))),
  );
}
export function proposalKey(a) {
  return canonical({
    profileId: a.profileId,
    exerciseId: a.exerciseId,
    ruleVersion: a.ruleVersion,
    status: a.status,
    sourceIds: a.sourceIds,
    evidence: a.evidence,
    proposal: a.proposal,
  });
}
export function latest(p, a) {
  const key = proposalKey(a);
  return (
    records(p)
      .filter((r) => r.key === key)
      .at(-1) || null
  );
}
function proof(p, a) {
  return canonical({
    analysis: a,
    sources: rows(p.sessions).filter((s) =>
      s.exercises?.some((e) => e.exerciseId === a.exerciseId),
    ),
    checkIns: p.checkIns,
    appointments: p.appointments?.records,
    teamReviews: p.teamReviews,
    increment: p.user?.increment,
    decisions: p.evolutionDecisions,
  });
}
function assertAnalysis(p, a, day) {
  const current = analyzeExercise(p, a.exerciseId, { day });
  if (a.profileId !== p.id || canonical(current) !== canonical(a))
    throw Error(
      "Les données ou la date ont changé. Ferme puis réexamine la proposition.",
    );
  if (!["increase", "maintain", "deload"].includes(current.status))
    throw Error("Cette analyse ne permet pas de décision d’adaptation.");
  return current;
}
export function ticket(p, a, day = today()) {
  assertAnalysis(p, a, day);
  return {
    profileId: p.id,
    day,
    analysis: structuredClone(a),
    proof: proof(p, a),
  };
}
function verify(p, t, day) {
  if (t.profileId !== p.id || t.day !== day)
    throw Error("Le profil ou la date a changé. Réexamine la proposition.");
  const a = assertAnalysis(p, t.analysis, day);
  if (t.proof !== proof(p, a))
    throw Error(
      "Les sources ou les décisions ont changé. Réexamine la proposition.",
    );
  return a;
}
function exerciseShape(e) {
  if (!e) return null;
  return {
    exerciseId: e.exerciseId,
    unit: e.unit,
    targetSets: e.targetSets,
    repsLow: e.repsLow,
    repsHigh: e.repsHigh,
    repScheme: e.repScheme ?? null,
    repTargets: structuredClone(e.repTargets ?? null),
    rest: e.rest,
    tempo: e.tempo,
    blockIndex: e.blockIndex ?? null,
    deload: !!e.deload,
    targetLoad: e.targetLoad ?? null,
  };
}
function targetGuard(p, s) {
  return canonical({
    planId: p.plan?.id,
    session: s,
    equipment: p.equipment,
    refused: p.preferences?.refused,
  });
}
function eligible(p, s, a, day, makeWorkout) {
  if (
    !a.proposal ||
    p.workout ||
    typeof makeWorkout !== "function" ||
    !p.plan?.id ||
    !s?.id ||
    s.status !== "planned" ||
    s.type !== "strength" ||
    s.standalone ||
    s.deload ||
    s.sourceDeloadSuggested ||
    !validDate(s.date) ||
    s.date < day ||
    s.date > addDays(day, 30)
  )
    return false;
  if (
    rows(p.plan.sessions).filter((x) => x.id === s.id).length !== 1 ||
    rows(p.sessions).some((x) => x.planId === s.id || x.id === s.id) ||
    rows(s.exercises).some(
      (e) =>
        !Array.isArray(e.sets) ||
        e.sets.length ||
        e.unavailable ||
        e.equipmentMismatch,
    )
  )
    return false;
  if (prescription(s) !== a.evidence[0]?.signature) return false;
  const e = s.exercises.find((e) => e.exerciseId === a.exerciseId);
  if (!e || e.unit !== a.proposal.unit || e.targetLoad === a.proposal.to)
    return false;
  try {
    const sim = makeWorkout(p, structuredClone(s));
    return (
      prescription(sim) === a.evidence[0].signature &&
      !rows(sim.exercises).some((e) => e.unavailable || e.equipmentMismatch)
    );
  } catch {
    return false;
  }
}
export function targets(p, a, { day = today(), makeWorkout } = {}) {
  return rows(p.plan?.sessions)
    .filter((s) => eligible(p, s, a, day, makeWorkout))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      id: s.id,
      date: s.date,
      name: s.name,
      guard: targetGuard(p, s),
      before:
        s.exercises.find((e) => e.exerciseId === a.exerciseId).targetLoad ??
        null,
    }));
}
export function prepare(
  p,
  t,
  input,
  { day = today(), makeWorkout, id = globalThis.crypto.randomUUID() } = {},
) {
  const a = verify(p, t, day),
    previous = input.revisitId
      ? records(p).find(
          (r) =>
            r.id === input.revisitId && r.analysis.exerciseId === a.exerciseId,
        )
      : latest(p, a);
  if (
    input.revisitId &&
    (!previous || records(p).some((r) => r.supersedes === previous.id))
  )
    throw Error(
      "Cette décision a déjà été réexaminée ou ne correspond pas à cet exercice.",
    );
  if (previous?.choice === "accepted" || latest(p, a)?.choice === "accepted")
    throw Error(
      "Cette proposition a déjà été acceptée. Aucune nouvelle application des mêmes données.",
    );
  if (!["accepted", "refused", "postponed"].includes(input.choice))
    throw Error("Choisis accepter, refuser ou reporter.");
  const note = typeof input.note === "string" ? input.note.trim() : "";
  if (note.length > 1000) throw Error("Note limitée à 1 000 caractères.");
  if (previous && !input.reconsider)
    throw Error(
      "Cette proposition a déjà une décision. Choisis explicitement de la réexaminer.",
    );
  let until = null,
    target = null;
  if (input.choice === "postponed") {
    if (
      !validDate(input.until) ||
      input.until <= day ||
      input.until > addDays(day, 30)
    )
      throw Error(
        "Choisis une date de réexamen entre demain et dans 30 jours.",
      );
    until = input.until;
  }
  if (input.choice === "accepted" && a.proposal) {
    if (input.confirm !== true)
      throw Error(
        "Confirme explicitement la modification de cette seule séance.",
      );
    target = targets(p, a, { day, makeWorkout }).find(
      (s) => s.id === input.targetId,
    );
    if (!target)
      throw Error(
        "Aucune séance cible compatible disponible, ou une séance est en cours. Le programme reste inchangé.",
      );
    if (input.targetGuard !== target.guard)
      throw Error(
        "La séance cible ou le matériel a changé. Réouvre la confirmation.",
      );
  }
  if (records(p).some((r) => r.id === id))
    throw Error("Identifiant de décision déjà utilisé.");
  return {
    id,
    profileId: p.id,
    date: day,
    createdAt: Date.now(),
    ticket: t,
    analysis: structuredClone(a),
    key: proposalKey(a),
    choice: input.choice,
    note,
    until,
    target,
    supersedes: previous?.id || null,
  };
}
// Revalidate inside the host transaction. No mutation occurs on failed/stale confirmation.
export function apply(p, prepared, { day = today(), makeWorkout } = {}) {
  if (prepared.profileId !== p.id)
    return { ok: false, error: "Le profil a changé." };
  const existing = records(p).find((r) => r.id === prepared.id);
  if (existing)
    return existing.key === prepared.key && existing.choice === prepared.choice
      ? { ok: true, id: prepared.id, duplicate: true }
      : { ok: false, error: "Identifiant déjà utilisé." };
  try {
    const again = prepare(
      p,
      prepared.ticket,
      {
        choice: prepared.choice,
        note: prepared.note,
        until: prepared.until,
        targetId: prepared.target?.id,
        targetGuard: prepared.target?.guard,
        confirm: true,
        reconsider: !!prepared.supersedes,
        revisitId: prepared.supersedes,
      },
      { day, makeWorkout, id: prepared.id },
    );
    if (
      canonical(again.analysis) !== canonical(prepared.analysis) ||
      again.key !== prepared.key
    )
      throw Error("La proposition a changé.");
    let patch = null;
    if (again.target) {
      const s = p.plan.sessions.find((s) => s.id === again.target.id),
        index = s.exercises.findIndex(
          (e) => e.exerciseId === again.analysis.exerciseId,
        ),
        before = structuredClone(s.exercises[index]);
      const after = {
        ...before,
        targetLoad: again.analysis.proposal.to,
        evolutionDecisionId: again.id,
      };
      const simulated = makeWorkout(p, {
        ...structuredClone(s),
        exercises: s.exercises.map((e, i) =>
          i === index ? structuredClone(after) : structuredClone(e),
        ),
      });
      if (
        prescription(simulated) !== again.analysis.evidence[0].signature ||
        simulated.exercises[index]?.targetLoad !== again.analysis.proposal.to ||
        simulated.exercises.some((e) => e.unavailable || e.equipmentMismatch)
      )
        throw Error(
          "Le démarrage réel ne conserverait pas cette prescription.",
        );
      patch = {
        session: s,
        index,
        after,
        target: {
          planId: p.plan.id,
          sessionId: s.id,
          date: s.date,
          name: s.name,
          beforeLoad: before.targetLoad ?? null,
          afterLoad: after.targetLoad,
          unit: after.unit,
          afterShape: exerciseShape(after),
          signature: prescription(s),
        },
      };
    }
    const record = {
      id: again.id,
      profileId: p.id,
      date: day,
      createdAt: prepared.createdAt,
      key: again.key,
      choice: again.choice,
      note: again.note,
      until: again.until,
      supersedes: again.supersedes,
      analysis: again.analysis,
      target: patch?.target || null,
      applied: !!patch,
    };
    const next = {
      ...(obj(p.evolutionDecisions) ? p.evolutionDecisions : {}),
      version: 1,
      records: [...rows(p.evolutionDecisions?.records), record],
    };
    if (patch) patch.session.exercises[patch.index] = patch.after;
    p.evolutionDecisions = next;
    return { ok: true, id: record.id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
// Explicitly approved loads must appear in the ORIGINAL preview and survive its starter.
function retainedRecommendation(p, e) {
  const history = records(p),
    superseded = new Set(history.map((r) => r.supersedes));
  const all = history.filter(
    (r) => r.analysis.exerciseId === e?.exerciseId && !superseded.has(r.id),
  );
  const r = all.at(-1);
  if (
    !r ||
    !Array.isArray(r.analysis.evidence) ||
    r.analysis.evidence.length !== 2
  )
    return null;
  const exposures = rows(p.sessions).filter(
    (s) =>
      ["completed", "partial"].includes(s.status) &&
      rows(s.exercises).some((x) => x.exerciseId === e.exerciseId),
  );
  if (exposures.some((s) => !validDate(s.date) || s.needsDate)) return null;
  const pair = exposures
    .filter((s) => s.date <= today())
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        Number(b.finishedAt || 0) - Number(a.finishedAt || 0),
    )
    .slice(0, 2);
  if (
    pair.length !== 2 ||
    canonical(pair.map((s) => sample(s, e.exerciseId))) !==
      canonical(r.analysis.evidence)
  )
    return null;
  const source = pair[0].exercises.find((x) => x.exerciseId === e.exerciseId);
  const shape = (x) => ({ ...exerciseShape(x), targetLoad: null });
  if (canonical(shape(e)) !== canonical(shape(source))) return null;
  const weight = e.targetLoad ?? r.analysis.evidence[0].weight;
  if (typeof weight !== "number" || !Number.isFinite(weight)) return null;
  return {
    decision: "keep",
    evolutionHold: true,
    label: "Pas de nouveau palier automatique",
    color: "blue",
    weight,
    reps: e.repsLow,
    unit: e.unit,
    reference: r.date,
    reason:
      "Décision mémorisée : le même palier ne sera pas réintroduit par le calcul automatique historique. Une charge explicite existante reste conservée ; sinon, repère des séries réalisées. Seule la cible explicitement acceptée reçoit une nouvelle charge.",
  };
}
export function approvedRecommendation(p, e) {
  const r = records(p).find(
    (r) =>
      r.id === e?.evolutionDecisionId &&
      r.choice === "accepted" &&
      r.applied &&
      obj(r.target),
  );
  if (!r) return retainedRecommendation(p, e);
  if (
    canonical(exerciseShape(e)) !== canonical(r.target.afterShape) ||
    e.targetLoad !== r.target.afterLoad
  )
    return null;
  const planned =
    p.plan?.id === r.target.planId &&
    rows(p.plan.sessions).some(
      (s) =>
        s.id === r.target.sessionId &&
        s.status === "planned" &&
        s.date === r.target.date &&
        prescription(s) === r.target.signature,
    );
  const active =
    p.workout?.planId === r.target.sessionId &&
    prescription(p.workout) === r.target.signature;
  if (!planned && !active) return null;
  return {
    decision: "keep",
    label: "Charge confirmée par vous",
    color: "blue",
    weight: e.targetLoad,
    reps: e.repsLow,
    unit: e.unit,
    reference: r.date,
    reason: `Décision confirmée le ${r.date}, pour la séance du ${r.target.date}. Il s’agit d’une cible, pas d’une performance réalisée.`,
  };
}
// Preserve historical recovery advice if it is already more conservative.
export function recommendation(p, e, original) {
  const decision = approvedRecommendation(p, e);
  if (!decision) return original;
  if (decision.evolutionHold) {
    if (original?.unit !== decision.unit) return original;
    if (
      typeof original.weight === "number" &&
      Number.isFinite(original.weight) &&
      original.weight < decision.weight
    )
      return original;
    return {
      ...original,
      ...decision,
      reps: original.reps,
      reason: decision.reason + " " + (original.reason || ""),
    };
  }
  return decision;
}
export function followUp(p, r, day = today()) {
  if (!r.applied || !r.target)
    return {
      status: "unchanged",
      text: "Décision mémorisée sans modification de programme.",
    };
  const t = r.target;
  if (p.workout?.planId === t.sessionId)
    return {
      status: "active",
      text: "Séance en cours : aucune réussite déduite avant son enregistrement.",
    };
  const actual = rows(p.sessions).filter(
    (s) =>
      s.planId === t.sessionId &&
      ["completed", "partial"].includes(s.status) &&
      validDate(s.date) &&
      s.date >= r.date &&
      s.date <= day,
  );
  if (actual.length > 1)
    return {
      status: "ambiguous",
      text: "Plusieurs réalisations liées : vérifier l’historique, aucun résultat choisi arbitrairement.",
    };
  if (actual.length === 1) {
    const s = actual[0],
      e = rows(s.exercises).filter(
        (e) => e.exerciseId === r.analysis.exerciseId,
      );
    if (e.length !== 1)
      return {
        status: "changed",
        text: "La séance enregistrée ne contient plus cet exercice de façon univoque.",
      };
    const rawSets = rows(e[0].sets);
    if (
      rawSets.some((x) => typeof x.id !== "string") ||
      new Set(rawSets.map((x) => x.id)).size !== rawSets.length
    )
      return {
        status: "ambiguous",
        text: "Identifiants de séries ambigus : aucune série dupliquée comptée dans le suivi.",
      };
    const sets = rawSets.filter(
      (x) =>
        x.completed === true &&
        !x.legacyAggregate &&
        !x.needsReps &&
        !x.needsLoad &&
        x.count !== 0 &&
        (x.count == null || Number(x.count) === 1) &&
        x.unit === t.unit &&
        typeof x.weight === "number" &&
        Number.isFinite(x.weight) &&
        x.weight >= 0 &&
        x.weight <= 1000 &&
        Number.isInteger(x.reps) &&
        x.reps >= 1 &&
        x.reps <= 100,
    );
    const matching = sets.filter(
      (x) => x.weight === t.afterLoad && x.reps >= t.afterShape.repsLow,
    ).length;
    const comparable = prescription(s) === t.signature;
    return {
      status: "observed",
      sessionId: s.id,
      date: s.date,
      sets: sets.map((x) => ({
        weight: x.weight,
        reps: x.reps,
        rpe: x.rpe ?? null,
        rir: x.rir ?? null,
      })),
      text: `Séance ${s.status === "partial" ? "partielle" : "terminée"} du ${s.date} : ${matching} série(s) documentée(s) à ${t.afterLoad} ${t.unit} et au moins ${t.afterShape.repsLow} répétitions, sur ${t.afterShape.targetSets} prévues. ${comparable ? "Prescription comparable." : "Prescription modifiée : comparaison limitée."} Ce constat ne prouve pas un effet causal ni une réussite globale.`,
      comparable,
    };
  }
  const s = rows(p.plan?.sessions).find((s) => s.id === t.sessionId),
    e = rows(s?.exercises).find((e) => e.exerciseId === r.analysis.exerciseId);
  if (!s)
    return {
      status: "missing",
      text: "Cible absente du programme actuel ; aucune réalisation liée trouvée. Historique de décision conservé.",
    };
  if (
    p.plan.id !== t.planId ||
    s.date !== t.date ||
    prescription(s) !== t.signature ||
    canonical(exerciseShape(e)) !== canonical(t.afterShape) ||
    e?.evolutionDecisionId !== r.id
  )
    return {
      status: "changed",
      text: "La cible a été modifiée depuis la décision. Aucun rétablissement automatique.",
    };
  if (s.status !== "planned" || s.date < day)
    return {
      status: "unverified",
      text: "Date passée ou statut modifié, sans réalisation liée. Ne compte pas comme séance faite.",
    };
  return {
    status: "pending",
    text: `Charge cible appliquée à la séance du ${s.date}. En attente de réalisation réelle.`,
  };
}
