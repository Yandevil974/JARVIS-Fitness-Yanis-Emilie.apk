import {
  sourceDay,
  sourcePosition,
  SOURCE_SCHEDULE_REVISION,
} from "../engine/source-schedule.js";
import {
  dataFingerprint,
  photoFingerprint,
} from "../engine/content-fingerprint.js";
import photoSources from "../data/source-photo-fingerprints.json" with { type: "json" };
import {
  SCHEMA_VERSION,
  today,
  uid,
  num,
  addDays,
  safeJSON,
} from "../engine/utils.js";
import {
  legacy,
  findExercise,
  exerciseById,
  FOOD,
  MEASURES,
} from "../data/library.js";
import { generatePlan } from "../engine/planner.js";
import { validDate } from "../engine/validation.js";
export function newProfile(id) {
  const src = legacy[id]?.defaults;
  const em = id === "emilie";
  const p = {
    id,
    user: {
      name: em ? "Émilie" : "Yanis",
      age: em ? 41 : null,
      height: em ? 160 : null,
      weight: em ? 66 : null,
      targetWeight: em ? 63 : null,
      sex: em ? "female" : "",
      goal: "recomposition",
      level: "intermediate",
      frequency: 4,
      increment: 2.5,
      startDate: today(),
      sourceConfirmed: false,
    },
    equipment: em
      ? [
          "bodyweight",
          "band",
          "dumbbell",
          "barbell",
          "bench",
          "pool",
          "elliptical",
        ]
      : [
          "bodyweight",
          "dumbbell",
          "barbell",
          "bench",
          "cable",
          "machine",
          "band",
          "pullup",
          "pool",
          "elliptical",
        ],
    preferences: {
      favorites: [],
      refused: [],
      priorities: em ? ["fes", "moy", "tra"] : [],
      muscleTargets: {},
      poolDays: em ? [4] : [],
      voice: false,
      sessionVoice: true,
      notifications: false,
      reducedMotion: false,
      // "light" (page claire, colonne de navigation sombre) ou "dark".
      // Indépendant du profil : chacun garde sa palette, seuls les
      // plans de fond changent.
      theme: "light",
      // Réévaluation 1RM programmée par le coach, en semaines.
      forceRevalWeeks: 8,
      wearable: null,
    },
    plan: null,
    archivedPlans: [],
    sessions: [],
    workout: null,
    activities: [],
    dayReports: [],
    teamReviews: [],
    checkIns: {},
    measurements: [],
    photos: [],
    forceTests: [],
    nutrition: {
      activityFactor: 1.5,
      manualCalories: null,
      logs: [],
      variant: 0,
    },
    goals: [],
    messages: [],
    adaptations: [],
    // Constats de veille écartés par l'utilisateur : on ne repose pas la
    // même question chaque jour. Borné à 40 entrées côté écriture.
    dismissedFindings: [],
    reports: [],
    notifications: [],
    legacyArchive: null,
    badges: [],
    timer: null,
  };
  p.sourceProgramRevision = 2;
  p.plan = generatePlan(p, { source: "legacy", weeks: 52, startDate: today() });
  return p;
}
export function initialState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    activeProfile: "elite",
    profiles: { elite: newProfile("elite"), emilie: newProfile("emilie") },
    updatedAt: Date.now(),
  };
}
export { validateState } from "./schema.js";
export function migrateLegacy(raw, id = "elite") {
  if (
    !["elite", "emilie"].includes(id) ||
    !raw ||
    typeof raw !== "object" ||
    !raw.profil ||
    typeof raw.profil !== "object"
  )
    throw new Error(
      "Ce fichier ne contient pas un export Transformation reconnu.",
    );
  const p = newProfile(id),
    old = raw.profil,
    warnings = [];
  const number = (v, min, max) => {
    const n = num(v);
    return n != null && n >= min && n <= max ? n : null;
  };
  const dated = (d) => validDate(d) && d <= today();
  const sourceDate = dated(old.date) ? old.date : "";
  p.user = {
    ...p.user,
    name: String(old.nom || p.user.name).slice(0, 100),
    age: number(old.age, 10, 110),
    height: number(old.taille, 100, 250),
    weight: number(old.poidsDepart, 25, 350),
    targetWeight: number(old.objectifPoids, 25, 350),
    sex:
      old.sexe === "femme"
        ? "female"
        : old.sexe === "homme"
          ? "male"
          : p.user.sex,
    level:
      {
        debutant: "beginner",
        intermediaire: "intermediate",
        confirme: "confirmed",
        avance: "advanced",
        expert: "expert",
      }[old.niveau] || "intermediate",
    frequency: number(old.seancesSemaine, 1, 6) || 4,
    startDate: sourceDate,
    sourceConfirmed: false,
    goal:
      {
        masse: "hypertrophy",
        force: "strength",
        seche: "cut",
        recomposition: "recomposition",
        esthetique: "recomposition",
        endurance: "endurance",
      }[raw.objectifs?.principal] || "recomposition",
  };
  p.legacyArchive = structuredClone(raw);
  if (raw.equip) {
    const e = raw.equip;
    p.equipment = ["bodyweight"];
    if (e.salle) p.equipment.push("dumbbell", "bench", "band");
    for (const [k, v] of Object.entries({
      barre: "barbell",
      poulie: "cable",
      piscine: "pool",
      elliptique: "elliptical",
    }))
      if (e[k]) p.equipment.push(v);
    if (e.legcurl || e.machine_abd) p.equipment.push("machine");
  }
  p.user.sourceConfirmed = !!old.nom && !!old.date;
  p.user.trainingYears = number(old.annees, 0, 80);
  p.user.originalLevel = String(old.niveau || "");
  p.sourceProfileMetrics = {
    bodyFat: number(old.mg, 1, 70),
    leanMass: number(old.mm, 1, 300),
    sourceDate,
    source: "profil du fichier",
  };
  p.preferences.cardioChoices = structuredClone(raw.cardioChoix || {});
  p.sourceDataFingerprint = dataFingerprint(raw);
  p.dayReports = [];
  const imported = [];
  const dates = new Set([
    ...Object.keys(raw.journal || {}),
    ...Object.keys(raw.seances || {}),
  ]);
  for (const date of dates) {
    if (!dated(date)) {
      warnings.push(
        "Une séance sans date réelle valide reste dans l’archive source.",
      );
      continue;
    }
    const j = raw.journal?.[date] || {};
    const status =
      { ok: "completed", partiel: "partial", non: "missed" }[
        j.statut || raw.seances?.[date]
      ] || "partial";
    const done =
      ["completed", "partial"].includes(status) &&
      !!(j.statut || raw.seances?.[date]);
    const sourceDayInfo = sourceDay(p, date);
    const exercises = (Array.isArray(j.exos) ? j.exos : [])
      .filter((e) => e && e.n)
      .map((e) => {
        const known = findExercise(e.n);
        const ex = known || exerciseById("source:" + String(e.n).slice(0, 250));
        const reps = number(e.reps, 1, 3600),
          weight = number(e.ch, 0, 1000),
          count = number(e.se, 1, 100);
        const unit = ex.timed ? "secondes" : "source à vérifier";
        return {
          exerciseId: ex.id,
          sourceName: String(e.n),
          sourceRow: structuredClone(e),
          unit,
          targetSets: Math.round(count || 1),
          repsLow: ex.repsLow || 1,
          repsHigh: ex.repsHigh || 1,
          rest: ex.rest || 0,
          declaredSetCount: count,
          sets:
            reps || count || weight != null
              ? [
                  {
                    id: uid(),
                    weight: ex.timed ? null : weight,
                    reps: reps && Number.isInteger(reps) ? reps : null,
                    needsReps: !(reps && Number.isInteger(reps)),
                    rpe: number(e.rpe, 1, 10),
                    rir: number(e.rir, 0, 10),
                    completed: done,
                    count: Math.round(count || 1),
                    unit,
                    legacyAggregate: true,
                    note: String(e.com || e.note || ""),
                    createdAt: 0,
                  },
                ]
              : [],
        };
      });
    const loggedIds = exercises.map((e) => e.exerciseId);
    const sourceCandidates = Object.entries(sourceDayInfo.phase.sessions || {})
      .map(([key, x]) => ({
        key,
        name: x.nom,
        score: x.exos.filter((row) =>
          loggedIds.includes(findExercise(row[0])?.id),
        ).length,
      }))
      .sort((a, b) => b.score - a.score);
    const actualSource = sourceCandidates[0]?.score
      ? sourceCandidates[0]
      : null;
    if (!exercises.length && (raw.seances?.[date] || j.statut)) {
      p.dayReports.push({
        id: `legacy-${id}-day-${date}`,
        date,
        type: sourceDayInfo.type,
        name: sourceDayInfo.name,
        status,
        source: "legacy",
        durationSec: null,
        detail:
          "Journée cochée dans la sauvegarde, sans durée ni résultats détaillés. Aucune performance n’a été inventée.",
      });
      continue;
    }
    if (exercises.length)
      imported.push({
        id: `legacy-${id}-session-${date}`,
        date,
        name: String(
          j.nom ||
            actualSource?.name ||
            (sourceDayInfo.type === "strength"
              ? sourceDayInfo.name
              : "Séance importée"),
        ),
        sourcePlannedName: sourceDayInfo.name,
        sourceMismatch:
          !!actualSource && actualSource.key !== sourceDayInfo.sessionKey,
        type: "strength",
        status,
        exercises,
        durationSec: number(j.durationSec, 1, 86400),
        rpe: number(j.rpe, 1, 10),
        warmupDone: !!j.prep?.ech,
        cooldownDone: !!j.prep?.etir,
        sourcePhaseKey: sourceDayInfo.phaseKey,
        sourceSessionKey: actualSource?.key || sourceDayInfo.sessionKey,
        source: "legacy",
      });
  }
  p.sessions = imported;
  const activities = [];
  function activity(row, type, date) {
    if (!row || typeof row !== "object") return;
    const d = date || row.d || row.date;
    const seconds =
      number(row.secs, 1, 86400) ??
      (number(row.duree, 0, 1440) != null
        ? Math.round(Number(row.duree) * 60)
        : null);
    if (!dated(d) || seconds == null || seconds <= 0) {
      warnings.push(
        "Une activité sans durée ou date fiable reste dans l’archive source.",
      );
      return;
    }
    activities.push({
      id: uid(),
      date: d,
      type,
      name: String(row.proto || row.format || row.nom || type),
      durationSec: seconds,
      distance: number(row.distance, 0, 1000000),
      rpe: number(row.rpe, 1, 10),
      calories: null,
      style: row.nage || row.style || null,
      rounds: number(row.series || row.rounds, 1, 500),
      rest: number(row.repos, 0, 3600),
      note: String(row.note || ""),
      source: "legacy",
    });
  }
  for (const r of raw.natation?.seances || []) activity(r, "swim");
  for (const r of raw.tabata?.seances || []) activity(r, "hiit");
  for (const r of raw.cardio?.seances || []) {
    const d = r.d || r.date;
    if (
      /piscine|natation/i.test(r.proto || r.format || "") &&
      activities.some(
        (a) =>
          a.date === d &&
          a.type === "swim" &&
          a.durationSec === (number(r.secs, 1, 86400) ?? Number(r.duree) * 60),
      )
    )
      continue;
    activity(r, "cardio");
  }
  for (const [date, row] of Object.entries(raw.cardio || {})) {
    if (!validDate(date)) continue;
    if (
      row.format === "piscine" &&
      activities.some(
        (a) =>
          a.date === date &&
          a.type === "swim" &&
          Math.abs(a.durationSec - Number(row.duree) * 60) < 61,
      )
    )
      continue;
    activity(row, row.format === "piscine" ? "swim" : "cardio", date);
  }
  p.activities = activities;
  const measureDates = new Set([
    ...Object.keys(raw.poids || {}),
    ...Object.keys(raw.mg || {}),
  ]);
  for (const date of measureDates)
    if (dated(date))
      p.measurements.push({
        id: uid(),
        date,
        weight: number(raw.poids?.[date], 25, 350),
        bodyFat: number(raw.mg?.[date], 1, 70),
        values: {},
        source: "legacy",
      });
  const values = (input) =>
    Object.fromEntries(
      MEASURES.map(([k]) => [k, number(input?.[k], 1, 300)]).filter(
        ([, n]) => n != null,
      ),
    );
  if (Object.keys(values(raw.mensurations?.jour0)).length)
    p.measurements.push({
      id: uid(),
      date: sourceDate,
      needsDate: !sourceDate,
      weight: null,
      bodyFat: null,
      values: values(raw.mensurations.jour0),
      source: "legacy-j0",
    });
  for (const [month, m] of Object.entries(raw.mensurations?.mensuel || {})) {
    const date = dated(m.date) ? m.date : "";
    if (Object.keys(values(m)).length)
      p.measurements.push({
        id: uid(),
        date,
        needsDate: !date,
        slot: month,
        weight: null,
        bodyFat: null,
        values: values(m),
        source: "legacy-month",
      });
  }
  for (const [date, c] of Object.entries(raw.recup || {}))
    if (dated(date))
      p.checkIns[date] = {
        sleep: number(c.h, 0, 24),
        quality: number(c.qual, 1, 5),
        energy: number(c.en, 1, 5),
        fatigue: number(c.fa, 1, 5),
        stress: number(c.str, 1, 5),
        soreness: number(c.cour, 1, 5),
        motivation: number(c.mot, 1, 5),
        note: String(c.note || ""),
      };
  for (const [slot, views] of Object.entries(raw.photos || {}))
    for (const [view, data] of Object.entries(views || {}))
      if (data && typeof data === "string") {
        const src = /^data:image\/(?:jpeg|png|webp);base64,/.test(data)
          ? data
          : /^[A-Za-z0-9+/=]+$/.test(data)
            ? "data:image/jpeg;base64," + data
            : null;
        if (src)
          p.photos.push({
            id: uid(),
            date: "",
            needsDate: true,
            view,
            slot,
            data: src,
            simulated: !!photoSources[photoFingerprint(src)]?.simulated,
            sourceReference: photoSources[photoFingerprint(src)]?.path || null,
            source: photoSources[photoFingerprint(src)]
              ? "legacy-simulation"
              : "legacy-user",
            note: photoSources[photoFingerprint(src)]
              ? "Simulation M12 identique à la référence embarquée du HTML. Pas une photo de résultat réel."
              : "Photo de la sauvegarde ; date de prise de vue non fournie.",
            contentKey: photoFingerprint(src),
          });
      }
  const exact = {
    bench: "Développé couché barre",
    squat: id === "elite" ? "Back squat" : null,
    dead: "Soulevé de terre",
    ohp: id === "elite" ? "Développé militaire debout" : null,
    row: "Rowing barre buste penché",
    hipthrust: "Hip thrust barre",
    rdl: null,
    bulgarian: "Bulgarian split squat",
    curl: id === "elite" ? "Curl barre" : null,
  };
  const tests = [
    ...(raw.force?.historique || []),
    { date: raw.force?.date, valeurs: raw.force?.valeurs || {} },
  ];
  const seen = new Set();
  for (const t of tests)
    for (const [key, value] of Object.entries(t.valeurs || {})) {
      const label =
        legacy[id].TEST_1RM.exercices.find((e) => e.key === key)?.nom || key;
      const ex = exact[key] ? findExercise(exact[key]) : null;
      const exerciseId = ex?.id || "source:" + label;
      const estimate = number(value, 0.1, 2000);
      const date = dated(t.date) ? t.date : "";
      const marker = [date, exerciseId, estimate].join("|");
      if (!estimate || seen.has(marker)) continue;
      seen.add(marker);
      p.forceTests.push({
        id: uid(),
        date,
        needsDate: !date,
        exerciseId,
        unit: "source à vérifier",
        estimate,
        declared: true,
        source: "legacy",
        originalLabel: label,
      });
    }
  p.forceReassessmentWeeks = number(raw.force?.freqWeeks, 1, 52) || 8;
  const logs = [];
  for (const [date, rows] of Object.entries(raw.nutri?.journal || {})) {
    if (!dated(date) || !Array.isArray(rows)) continue;
    for (const r of rows) {
      const grams = number(r.qte, 0.1, 10000);
      if (!grams || !r.aliment) continue;
      const sourceMacros = !FOOD[r.aliment]
        ? {
            cal: number(r.cal, 0, 100000) / (grams / 100),
            p: number(r.p, 0, 100000) / (grams / 100),
            g: number(r.g, 0, 100000) / (grams / 100),
            f: number(r.f ?? r.l, 0, 100000) / (grams / 100),
          }
        : null;
      logs.push({
        id: uid(),
        date,
        food: String(r.aliment),
        grams,
        meal: String(r.repas || "Autre"),
        ...(sourceMacros ? { macros: sourceMacros } : {}),
        source: "legacy",
      });
    }
  }
  p.nutrition = {
    ...p.nutrition,
    manualCalories: number(
      raw.nutri?.manuel?.cal ?? raw.nutri?.manuel,
      1000,
      6000,
    ),
    logs,
    sourceConfig: structuredClone(raw.nutri || {}),
    useSourceFormula: id === "elite" && !old.sexe,
    legacyPlan: raw.nutri?.plan || null,
    legacyPhase: raw.nutri?.phase || null,
    legacyAdjustment: number(raw.nutri?.ajustement, -2000, 2000),
  };
  p.badges = Array.isArray(raw.badges) ? raw.badges : [];
  p.preferences.poolDays = (raw.natation?.jours || [])
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    .map((d) => (d + 6) % 7);
  for (const [month, items] of Object.entries(raw.objectifsMensuels || {}))
    for (const item of Array.isArray(items) ? items : [items])
      if (item && typeof item === "object")
        p.goals.push({
          id: uid(),
          title: String(item.n || item.nom || item.txt || "Objectif source"),
          done: !!item.fait,
          month,
          sourceProgress: String(item.prog || ""),
          source: "legacy",
        });
  const goalNames = {
    poids: "Poids corporel",
    mg: "Masse grasse",
    bras: "Tour de bras",
    poitrine: "Tour de poitrine",
    epaules: "Tour d’épaules",
    taille: "Tour de taille",
    fessiers: "Tour de fessiers",
    hanches: "Tour de hanches",
  };
  for (const [key, value] of Object.entries(raw.objectifs?.cibles || {})) {
    const n = number(value, 0.1, 2000);
    if (n != null)
      p.goals.push({
        id: uid(),
        title: `Cible source · ${goalNames[key] || legacy[id].TEST_1RM.exercices.find((e) => e.key === key)?.nom || key} : ${n}${key === "mg" ? " %" : ["poids", "bench", "squat", "dead", "ohp", "hipthrust", "rdl", "row"].includes(key) ? " kg" : " cm"}`,
        done: false,
        month: "",
        targetKey: key,
        targetValue: n,
        source: "legacy",
      });
  }
  p.legacyReports = raw.hebdo || {};
  p.teamReviews = Object.entries(raw.hebdo || {}).map(([week, b]) => ({
    id: `legacy-${id}-review-${week}`,
    week: Number(b.wk ?? week),
    date: dated(b.date) ? b.date : "",
    needsDate: !dated(b.date),
    energy: number(b.energie, 1, 5),
    fatigue: number(b.fatigue, 1, 5),
    pain: number(b.douleurs, 1, 5),
    motivation: number(b.motivation, 1, 5),
    feelings: String(b.ressentis || ""),
    difficulties: String(b.difficultes || ""),
    questions: String(b.questions || ""),
    advice: (b.conseils || []).map((c) => ({
      icon: c.ic || "",
      tag: String(c.tag || "Équipe"),
      text: String(c.txt || ""),
    })),
    source: "legacy",
    importedVerbatim: true,
  }));
  p.legacyMilestones = structuredClone(raw.bilanVu || {});
  p.legacyUI = structuredClone(raw.ui || {});
  p.legacyStats = structuredClone(raw.stats || {});
  p.legacyBadgesNew = structuredClone(raw.badgesNouveaux || []);
  p.protocolChecks = raw.stretchSuivi || {};
  p.sourceProgramRevision = 2;
  p.plan = generatePlan(p, {
    source: "legacy",
    weeks: 52,
    frequency: p.user.frequency,
    startDate: p.user.startDate || today(),
  });
  for (const scheduled of p.plan.sessions) {
    if (scheduled.sourceKind === "post-cardio") continue;
    const actual = p.sessions.find((x) => x.date === scheduled.date),
      marker = p.dayReports.find((x) => x.date === scheduled.date);
    if (scheduled.type === "strength" && actual) {
      scheduled.status = actual.status;
      actual.planId = scheduled.id;
    } else if (marker) {
      scheduled.status = marker.status;
      scheduled.completionReportedOnly = true;
    }
  }
  p.importWarnings = [...new Set(warnings)];
  if (
    p.measurements.some((m) => m.needsDate) ||
    p.photos.some((m) => m.needsDate) ||
    p.forceTests.some((m) => m.needsDate)
  )
    p.importWarnings.push(
      "Certains relevés, photos ou références n’avaient pas de date fiable : aucune date de performance n’a été inventée.",
    );
  p.adaptations = [
    {
      id: uid(),
      date: today(),
      label: "Import source sécurisé",
      detail: `${p.sessions.length} séances, ${p.activities.length} activités, ${p.nutrition.logs.length} aliments consommés. Les anciennes charges restent dans « source à vérifier » et ne sont pas réutilisées automatiquement.`,
    },
  ];
  return p;
}
function extractObject(text, start) {
  const opening = text.indexOf("{", start);
  if (opening < 0) throw new Error("Sauvegarde JSON introuvable.");
  let depth = 0,
    string = false,
    escaped = false;
  for (let i = opening; i < text.length; i++) {
    const c = text[i];
    if (string) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') string = false;
      continue;
    }
    if (c === '"') {
      string = true;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}" && --depth === 0) return safeJSON(text.slice(opening, i + 1));
  }
  throw new Error("Sauvegarde JSON incomplète.");
}
export function parseImport(text) {
  if (text.trim().startsWith("<")) {
    const json = text.match(
      /<script[^>]+id=["']jarvis-backup["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    if (json) return safeJSON(json[1]);
    for (const marker of ["__JARVIS_PRELOAD__", "__EMILIE_PRELOAD__"]) {
      const match = new RegExp(
        "(?:window\\.|globalThis\\.)?" + marker + "\\s*=\\s*\\{",
      ).exec(text);
      if (match) return extractObject(text, match.index);
    }
    throw new Error(
      "Ce HTML ne contient pas de sauvegarde reconnue. Exportez le JSON depuis l’ancienne application.",
    );
  }
  return safeJSON(text);
}
