import { initialState, migrateLegacy } from "./model.js";
import { validateState } from "./schema.js";
import { archivePlan } from "../engine/plan-memory.js";
import { generatePlan } from "../engine/planner.js";
import { today, num } from "../engine/utils.js";
import {
  dataFingerprint,
  photoFingerprint,
} from "../engine/content-fingerprint.js";
export function personalDataPresent(p) {
  return !!(
    p.workout ||
    p.sessions.length ||
    p.activities.length ||
    p.photos.length ||
    p.measurements.length ||
    p.forceTests.length ||
    Object.keys(p.checkIns).length ||
    p.user.sourceConfirmed
  );
}
export function makeProfileBackup(data, target = "elite") {
  if (data?.format === "jarvis-profile") return data;
  return {
    format: "jarvis-profile",
    schemaVersion: 3,
    profileId: target,
    profile: migrateLegacy(data, target),
    sourceFingerprint: dataFingerprint(data),
    sourceFile: "Sauvegarde Transformation",
  };
}
export function restorationSummary(backup) {
  const p = backup.profile,
    sets = p.sessions.flatMap((s) => s.exercises).flatMap((e) => e.sets);
  return {
    name: p.user.name,
    start: p.user.startDate,
    sessions: p.sessions.length,
    completed: p.sessions.filter((s) => s.status === "completed").length,
    missed: p.sessions.filter((s) => s.status === "missed").length,
    enteredSets: sets.reduce((n, s) => n + (s.count || 1), 0),
    incompleteSets: sets
      .filter((s) => s.reps == null)
      .reduce((n, s) => n + (s.count || 1), 0),
    dayReports: (p.dayReports || []).length,
    checkIns: Object.keys(p.checkIns).length,
    weights: p.measurements.filter((m) => m.weight != null).length,
    photos: p.photos.filter((x) => !x.simulated).length,
    simulations: p.photos.filter((x) => x.simulated).length,
    force: p.forceTests.length,
    reviews: (p.teamReviews || []).length,
    advice: (p.teamReviews || []).reduce((n, r) => n + r.advice.length, 0),
    goals: p.goals.length,
  };
}
function uniqueMerge(current, incoming, key) {
  const result = structuredClone(current || []),
    seen = new Set(result.map(key));
  for (const item of incoming || []) {
    const k = key(item);
    if (!seen.has(k)) {
      result.push(structuredClone(item));
      seen.add(k);
    }
  }
  return result;
}
function mergeLegacySession(current, incoming) {
  const out = {
    ...incoming,
    ...current,
    sourcePlannedName: incoming.sourcePlannedName,
    sourceMismatch: incoming.sourceMismatch,
    sourcePhaseKey: incoming.sourcePhaseKey,
    sourceSessionKey: incoming.sourceSessionKey,
  };
  out.name = current.name === "Séance importée" ? incoming.name : current.name;
  out.exercises = incoming.exercises.map((next, i) => {
    const old =
      current.exercises.find((e) => e.exerciseId === next.exerciseId) ||
      current.exercises[i];
    if (!old || old.exerciseId !== next.exerciseId) return next;
    if (!old.sets?.length)
      return {
        ...next,
        ...old,
        sourceName: next.sourceName,
        sourceRow: next.sourceRow,
        sets: next.sets,
      };
    const sets = old.sets.map((s, j) => ({
      ...next.sets[j],
      ...s,
      needsReps: s.reps == null,
      sourceName: next.sourceName,
    }));
    return {
      ...next,
      ...old,
      sourceName: next.sourceName,
      sourceRow: next.sourceRow,
      sets,
    };
  });
  for (const old of current.exercises)
    if (!out.exercises.some((e) => e.exerciseId === old.exerciseId))
      out.exercises.push(old);
  return out;
}
/** Profile-only merge. Existing manual records win on overlapping dates; originals remain archived. */
export function restoreProfile(state, input) {
  const backup = makeProfileBackup(input, input.profileId || "elite");
  if (
    !["elite", "emilie"].includes(backup.profileId) ||
    backup.profile?.id !== backup.profileId
  )
    throw new Error("Profil de restauration incohérent.");
  const test = structuredClone(state);
  test.profiles[backup.profileId] = backup.profile;
  const validated = validateState(test).profiles[backup.profileId];
  const key =
    backup.sourceFingerprint ||
    validated.sourceDataFingerprint ||
    dataFingerprint(validated.legacyArchive || validated);
  const root = structuredClone(state),
    old = root.profiles[backup.profileId];
  if (old.restoreReceipts?.some((x) => x.fingerprint === key))
    return {
      state: root,
      alreadyApplied: true,
      summary: restorationSummary(backup),
      conflicts: [],
    };
  const merged = { ...validated, ...old },
    conflicts = [];
  merged.user = old.user.sourceConfirmed
    ? { ...validated.user, ...old.user }
    : { ...old.user, ...validated.user };
  merged.user.startDate = validated.user.startDate || old.user.startDate;
  merged.user.name = validated.user.name || old.user.name;
  merged.user.sourceConfirmed = true;
  merged.preferences = {
    ...validated.preferences,
    ...old.preferences,
    cardioChoices: {
      ...validated.preferences.cardioChoices,
      ...old.preferences.cardioChoices,
    },
    poolDays: old.user.sourceConfirmed
      ? old.preferences.poolDays
      : validated.preferences.poolDays,
  };
  merged.equipment = old.user.sourceConfirmed
    ? old.equipment
    : validated.equipment;
  merged.sessions = old.sessions
    .filter(
      (s) =>
        !(
          s.source === "legacy" &&
          !s.exercises.length &&
          validated.dayReports.some((d) => d.date === s.date)
        ),
    )
    .map((s) => structuredClone(s));
  for (const next of validated.sessions) {
    const i = merged.sessions.findIndex(
      (s) => s.source === "legacy" && s.date === next.date,
    );
    if (i >= 0)
      merged.sessions[i] = mergeLegacySession(merged.sessions[i], next);
    else if (merged.sessions.some((s) => s.date === next.date)) {
      conflicts.push(next.date);
    } else merged.sessions.push(next);
  }
  merged.sessions.sort((a, b) => a.date.localeCompare(b.date));
  merged.activities = uniqueMerge(old.activities, validated.activities, (a) =>
    [a.date, a.type, a.name, a.durationSec, a.distance].join("|"),
  );
  merged.dayReports = uniqueMerge(
    old.dayReports,
    validated.dayReports,
    (r) => r.date,
  );
  merged.checkIns = { ...validated.checkIns, ...old.checkIns };
  merged.measurements = uniqueMerge(
    old.measurements,
    validated.measurements,
    (m) =>
      [
        m.date,
        m.slot || "",
        m.weight,
        m.bodyFat,
        dataFingerprint(m.values),
      ].join("|"),
  );
  const photographs = new Map(
    (old.photos || []).map((p) => [
      photoFingerprint(p.data),
      structuredClone(p),
    ]),
  );
  for (const photo of validated.photos) {
    const k = photoFingerprint(photo.data),
      current = photographs.get(k);
    photographs.set(
      k,
      current
        ? {
            ...photo,
            ...current,
            simulated: photo.simulated || current.simulated,
            sourceReference: photo.sourceReference || current.sourceReference,
          }
        : photo,
    );
  }
  merged.photos = [...photographs.values()];
  merged.forceTests = uniqueMerge(old.forceTests, validated.forceTests, (f) =>
    [f.date, f.exerciseId, f.estimate].join("|"),
  );
  merged.goals = uniqueMerge(old.goals, validated.goals, (g) =>
    [g.month, g.title].join("|"),
  );
  merged.teamReviews = uniqueMerge(
    old.teamReviews,
    validated.teamReviews,
    (r) => r.week + "|" + r.source,
  );
  merged.nutrition = {
    ...validated.nutrition,
    ...old.nutrition,
    sourceConfig: validated.nutrition.sourceConfig,
    useSourceFormula: validated.nutrition.useSourceFormula,
    legacyPhase: validated.nutrition.legacyPhase,
    legacyAdjustment: validated.nutrition.legacyAdjustment,
    logs: uniqueMerge(old.nutrition.logs, validated.nutrition.logs, (l) =>
      [l.date, l.food, l.grams, l.meal].join("|"),
    ),
  };
  merged.badges = [
    ...new Set([...(old.badges || []), ...(validated.badges || [])]),
  ];
  for (const k of [
    "legacyArchive",
    "legacyReports",
    "legacyStats",
    "legacyUI",
    "legacyMilestones",
    "sourceProfileMetrics",
    "sourceDataFingerprint",
  ])
    merged[k] = validated[k];
  merged.importWarnings = [
    ...new Set([
      ...(old.importWarnings || []),
      ...(validated.importWarnings || []),
      ...(conflicts.length
        ? [
            "Des dates existent déjà dans les saisies JARVIS : les données locales sont conservées ; les lignes source restent dans le journal sauvegardé.",
          ]
        : []),
    ]),
  ];
  merged.protocolChecks = {
    ...validated.protocolChecks,
    ...old.protocolChecks,
  };
  if (old.plan && personalDataPresent(old)) archivePlan(merged);
  merged.plan = generatePlan(merged, {
    source: "legacy",
    weeks: 52,
    frequency: merged.user.frequency,
    startDate: merged.user.startDate || today(),
  });
  for (const planned of merged.plan.sessions) {
    if (planned.sourceKind === "post-cardio") continue;
    const actual = merged.sessions.find((s) => s.date === planned.date),
      day = merged.dayReports.find((s) => s.date === planned.date);
    if (planned.type === "strength" && actual) {
      planned.status = actual.status;
      actual.planId = planned.id;
    } else if (day) {
      planned.status = day.status;
      planned.completionReportedOnly = true;
    }
  }
  merged.restoreReceipts = [
    ...(old.restoreReceipts || []),
    {
      fingerprint: key,
      at: Date.now(),
      source: backup.sourceFile || "Sauvegarde source",
      conflicts,
    },
  ];
  root.profiles[backup.profileId] = merged;
  root.updatedAt = Math.max(Date.now(), state.updatedAt + 1);
  validateState(root);
  return {
    state: root,
    alreadyApplied: false,
    summary: restorationSummary(backup),
    conflicts,
  };
}
