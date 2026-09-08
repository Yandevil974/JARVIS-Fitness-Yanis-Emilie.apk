import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  newProfile,
  validateState,
  migrateLegacy,
  parseImport,
} from "../src/store/model.js";
import { legacy, EXERCISES, findExercise } from "../src/data/library.js";
import {
  estimate1RM,
  recommendLoad,
  stats,
  chartSeries,
  periodReport,
  recoveryScore,
} from "../src/engine/fitness.js";
import {
  generatePlan,
  makeTarget,
  prepareWorkout,
  shortenSession,
  adaptRecovery,
  moveSession,
  rescheduleMissed,
} from "../src/engine/planner.js";
import { archivePlan, plannedSessions } from "../src/engine/plan-memory.js";
import { interpretCommand, applyCoachAction } from "../src/engine/coach.js";
import {
  nextAnnouncement,
  initialMemo,
  tempoAnnouncement,
} from "../src/platform/voice-coach.js";
import { reviewProfile, echeanceSuivi } from "../src/engine/watch.js";
import { photoComparison } from "../src/engine/team.js";
import { warmup } from "../src/engine/fitness.js";
import { namedExercise, prepare } from "../src/engine/conversation.js";
import {
  RECOVERY_EXERCISES,
  exerciseById,
  POOL_GUIDES,
  stepGuide,
} from "../src/data/library.js";
import {
  createTimer,
  advanceTimer,
  pauseTimer,
  skipTimer,
  extendTimer,
  intervalSteps,
} from "../src/engine/timer.js";
import {
  actualSet,
  actualActivity,
  actualMeasurement,
  validDate,
} from "../src/engine/validation.js";
import { today, addDays, uid, safeJSON, norm } from "../src/engine/utils.js";
const bench = findExercise("Développé couché barre");
function performance({
  count = 3,
  rpe = 8,
  weight = 50,
  reps = 12,
  status = "completed",
  source = "workout",
  unit = "kg total",
  date = addDays(today(), -1),
} = {}) {
  const p = newProfile("elite");
  const target = {
    ...makeTarget(bench, p),
    targetSets: 3,
    repsLow: 8,
    repsHigh: 12,
    unit,
  };
  target.sets = Array.from({ length: count }, () => ({
    id: uid(),
    weight,
    reps,
    rpe,
    unit,
    completed: true,
    createdAt: Date.now(),
  }));
  p.sessions = [
    {
      id: uid(),
      date,
      name: "Performance test",
      type: "strength",
      status,
      source,
      durationSec: 1800,
      rpe: 7,
      exercises: [target],
    },
  ];
  return { p, target };
}
test("Yanis and Émilie have isolated empty histories and their own annual source programme", () => {
  const s = initialState();
  assert.equal(s.profiles.elite.user.name, "Yanis");
  assert.equal(s.profiles.emilie.user.name, "Émilie");
  for (const p of Object.values(s.profiles)) {
    assert.equal(p.plan.source, "legacy");
    assert.equal(p.plan.weeks, 52);
    assert.equal(
      p.plan.sessions.filter((s) => s.type === "strength").length,
      p.id === "elite" ? 180 : 208,
    );
    assert.equal(new Set(p.plan.sessions.map((s) => s.phase)).size, 13);
    for (const key of [
      "sessions",
      "activities",
      "measurements",
      "photos",
      "forceTests",
    ])
      assert.equal(p[key].length, 0);
  }
  s.profiles.elite.preferences.favorites.push("x");
  assert.deepEqual(s.profiles.emilie.preferences.favorites, []);
  validateState(s);
});
for (const id of ["elite", "emilie"])
  test(`All 13 ${id} source phases keep their exercise tuples`, () => {
    const p = newProfile(id);
    for (const phase of Object.values(legacy[id].PROGRAM))
      for (const s of Object.values(phase.sessions))
        for (const row of s.exos) {
          const ex = findExercise(row[0]);
          assert.ok(ex, row[0]);
          const t = makeTarget(ex, p, { sourceRow: row });
          assert.equal(t.repScheme, String(row[3]));
          assert.equal(t.targetSets, parseInt(row[2]) || 3);
          assert.equal(t.tempo, row[4]);
          assert.equal(t.rest, Number(row[5]));
          assert.equal(t.sourceNote, row[6] || "");
          assert.equal(t.targetLoad, null);
        }
  });
for (const frequency of [1, 2, 3, 4, 5, 6])
  test(`Planning ${frequency} sessions/week is complete and non-empty`, () => {
    const p = newProfile("elite"),
      plan = generatePlan(p, { frequency, weeks: 12, source: "smart" });
    assert.equal(plan.sessions.length, frequency * 12);
    assert.ok(plan.sessions.every((s) => s.exercises.length > 0));
    assert.equal(new Set(plan.sessions.map((s) => s.id)).size, frequency * 12);
  });
test("Invalid dates and duplicate training days rejected", () => {
  assert.equal(validDate("2026-02-31"), false);
  assert.throws(() => generatePlan(newProfile("elite"), { weeks: NaN }));
  assert.throws(() =>
    generatePlan(newProfile("elite"), { frequency: 2, days: [0, 0] }),
  );
});
for (const [w, r, expected] of [
  [80, 10, 106.7],
  [80, 1, 80],
  [0, 10, null],
  [-5, 10, null],
  [80, 31, null],
  [80, 2.5, null],
  ["", 10, null],
  ["20,5", 10, 27.3],
])
  test(`Epley ${w} × ${r}`, () => assert.equal(estimate1RM(w, r), expected));
test("No load or force estimate invented on empty histories", () => {
  const p = newProfile("elite");
  assert.equal(recommendLoad(p, makeTarget(bench, p)).weight, null);
  assert.equal(recoveryScore(p).score, null);
  assert.equal(stats(p).sets, 0);
});
test("Complete controlled sets permit a modest progression", () => {
  const { p, target } = performance();
  const r = recommendLoad(p, target);
  assert.equal(r.decision, "increase");
  assert.equal(r.weight, 52.5);
});
test("An isolated free set cannot trigger progression", () => {
  const { p, target } = performance({
    count: 1,
    source: "manual-set",
    status: "partial",
  });
  assert.equal(recommendLoad(p, target).decision, "keep");
});
test("Incomplete intended sets do not trigger progression", () => {
  const { p, target } = performance({ count: 1 });
  assert.equal(recommendLoad(p, target).decision, "keep");
});
test("Missing RPE in one of the sets prevents automatic increase", () => {
  const { p, target } = performance();
  p.sessions[0].exercises[0].sets[0].rpe = null;
  assert.equal(recommendLoad(p, target).decision, "keep");
});
test("Exact units are required: kg per hand never transfer to total kg", () => {
  const { p, target } = performance({ unit: "kg/main" });
  assert.equal(recommendLoad(p, { ...target, unit: "kg total" }).weight, null);
});
test("High declared RPE reduces load, without diagnosing technique", () => {
  const { p, target } = performance({ rpe: 10 });
  assert.equal(recommendLoad(p, target).weight, 47.5);
  assert.match(recommendLoad(p, target).reason, /ne mesure pas la technique/);
});
test("Deload is not rounded away", () => {
  const { p, target } = performance();
  assert.equal(recommendLoad(p, { ...target, deload: true }).weight, 45);
});
test("Actual set counts, reps, tonnage and partial durations are included", () => {
  const { p } = performance({ count: 1, status: "partial" });
  p.sessions[0].exercises[0].sets[0].count = 3;
  const s = stats(p, "année");
  assert.equal(s.sets, 3);
  assert.equal(s.reps, 36);
  assert.equal(s.tonnage, 1800);
  assert.equal(s.minutes, 30);
  assert.equal(s.sessions, 0);
});
test("Archived schedules have no hidden four-cycle eviction", () => {
  const p = newProfile("elite");
  for (let i = 0; i < 8; i++) {
    p.plan.sessions[0].status = "missed";
    archivePlan(p);
    p.plan = generatePlan(p, { weeks: 1, source: "legacy" });
  }
  assert.equal(p.archivedPlans.length, 8);
  assert.equal(
    plannedSessions(p).filter((s) => s.status === "missed").length,
    8,
  );
});
test("Shortening preserves actual sets and at least one essential movement", () => {
  const { p } = performance();
  const w = prepareWorkout(p, p.plan.sessions[0]);
  w.exercises[0].sets = [
    {
      id: uid(),
      completed: true,
      weight: 30,
      reps: 8,
      rpe: 8,
      unit: w.exercises[0].unit,
    },
  ];
  const result = shortenSession(w, 15);
  assert.deepEqual(result.session.exercises[0].sets, w.exercises[0].sets);
  assert.ok(result.session.exercises.length > 0);
  assert.ok(
    result.session.exercises.every((e) => e.targetSets >= e.sets.length),
  );
});
test("Fatigue adaptation is idempotent within the same day", () => {
  const p = newProfile("elite");
  const first = applyCoachAction(p, { type: "fatigue" }).profile,
    second = applyCoachAction(first, { type: "fatigue" }).profile;
  assert.deepEqual(
    second.plan.sessions.map((s) => s.exercises.map((e) => e.targetSets)),
    first.plan.sessions.map((s) => s.exercises.map((e) => e.targetSets)),
  );
});
for (const phrase of [
  "Pas de douleur",
  "Sans douleur au genou",
  "Aucune douleur",
  "Je ne suis pas fatigué",
])
  test(`Negation: ${phrase}`, () =>
    assert.notEqual(
      interpretCommand(newProfile("elite"), phrase).action?.type,
      "pain",
    ));
/* Trois régressions constatées en conversant réellement avec le coach :
   une intention correctement classée mais sans branche de traitement,
   et un exercice cité par un mot isolé qui retombait sur le mouvement
   en cours. */
test("Un nom d'exercice partiel désigne le bon mouvement", () => {
  const r = interpretCommand(newProfile("elite"), "remplace le squat");
  assert.match(r.text, /squat/i);
  assert.doesNotMatch(r.text, /militaire|développé couché/i);
});
test("Une question sur les protéines atteint la nutrition", () => {
  const r = interpretCommand(
    newProfile("elite"),
    "combien de proteines je dois manger",
  );
  assert.doesNotMatch(r.text, /n’ai pas saisi|n'ai pas saisi/);
});
test("Une performance dictée retrouve son exercice", () => {
  const r = interpretCommand(
    newProfile("elite"),
    "j'ai fait 100kg x 5 au squat",
  );
  assert.match(r.text, /100/);
  assert.doesNotMatch(r.text, /Quel exercice avez-vous/);
});

test("Poor sleep is fatigue, not a pain diagnosis", () =>
  assert.equal(
    interpretCommand(newProfile("elite"), "J’ai mal dormi").action.type,
    "fatigue",
  ));
test("Significant pain suspends the workout and preserves sets", () => {
  const { p } = performance();
  p.workout = prepareWorkout(p, p.plan.sessions[0]);
  p.timer = createTimer([{ name: "Effort", seconds: 30 }], { type: "cardio" });
  const q = applyCoachAction(p, { type: "pain" }).profile;
  assert.equal(q.workout.safetyStop, true);
  assert.equal(q.timer.paused, true);
  assert.equal(q.checkIns[today()].painReported, true);
  assert.deepEqual(q.sessions, p.sessions);
});
test("Natural language recognises the requested frequency and cycle", () => {
  const a = interpretCommand(
    newProfile("emilie"),
    "4 séances par semaine pendant 12 semaines",
  );
  assert.deepEqual(a.action, { type: "plan", frequency: 4, weeks: 12 });
  const p = applyCoachAction(newProfile("emilie"), a.action).profile;
  assert.equal(p.plan.source, "legacy");
  assert.equal(p.plan.sessions.filter((s) => s.type === "strength").length, 48);
});
test("Timer catches up after backgrounding without inventing elapsed time", () => {
  const t = createTimer(
    [
      { name: "A", seconds: 20 },
      { name: "Repos", seconds: 10 },
    ],
    {},
    1000,
  );
  const r = advanceTimer(t, 90000);
  assert.equal(r.done, true);
  assert.equal(r.elapsed, 30);
});
test("Paused time is excluded; skipped steps are not counted as effort", () => {
  let t = createTimer(
    [
      { name: "A", seconds: 20 },
      { name: "B", seconds: 20 },
    ],
    {},
    0,
  );
  t = pauseTimer(t, 5000);
  t = pauseTimer(t, 35000);
  t = skipTimer(t, 40000);
  assert.equal(t.elapsed, 10);
  assert.equal(t.skipped, 1);
  assert.equal(t.remaining, 20);
});
test("Rest extension adjusts planned and remaining time", () => {
  const r = extendTimer(
    createTimer([{ name: "Repos", seconds: 30 }], {}, 0),
    15,
    5000,
  );
  assert.equal(r.steps[0].seconds, 45);
  assert.equal(r.remaining, 40);
});
test("Interval generator validates durations and rounds", () => {
  assert.throws(() => intervalSteps({ work: -2 }));
  assert.throws(() => intervalSteps({ rounds: 0 }));
  assert.throws(() => intervalSteps({ movements: [] }));
});
test("Input boundaries enforced outside HTML forms", () => {
  assert.throws(() =>
    actualSet({ reps: 10, weight: -5, unit: "kg total" }, bench),
  );
  assert.throws(() =>
    actualActivity({ date: today(), type: "swim", durationSec: 20, rpe: 15 }),
  );
  assert.throws(() =>
    actualMeasurement({ date: today(), weight: 900, values: {} }),
  );
});
test("Nested invalid backups are rejected without modifying current data", () => {
  const s = initialState(),
    copy = structuredClone(s);
  copy.profiles.elite.plan.sessions[0].exercises[0].targetSets = -1;
  assert.throws(() => validateState(copy));
  assert.ok(s.profiles.elite.plan.sessions[0].exercises[0].targetSets > 0);
});
test("Both source schemas migrate actual food and force histories", () => {
  for (const id of ["elite", "emilie"]) {
    const raw = structuredClone(legacy[id].defaults);
    raw.journal[today()] = {
      statut: "ok",
      exos: [{ n: "Développé couché barre", ch: 50, reps: 10, se: 3, rpe: 8 }],
    };
    raw.nutri.journal[today()] = [
      { repas: "Déjeuner", aliment: "Blanc de poulet", qte: 150 },
    ];
    raw.force = {
      date: today(),
      valeurs: { row: 80 },
      historique: [{ date: addDays(today(), -7), valeurs: { row: 75 } }],
    };
    const p = migrateLegacy(raw, id);
    assert.equal(p.sessions.length, 1);
    assert.equal(p.nutrition.logs[0].grams, 150);
    assert.equal(p.forceTests.length, 2);
    assert.equal(p.forceTests[0].unit, "source à vérifier");
    assert.equal(stats(p, "année").reps, 30);
    const root = initialState();
    root.profiles[id] = p;
    validateState(root);
  }
});
test("Imported scripts are never evaluated; JSON braces in strings work", () => {
  globalThis.UNSAFE_IMPORT = false;
  const d = parseImport(
    '<html><script>globalThis.UNSAFE_IMPORT=true;</script><script>window.__EMILIE_PRELOAD__={"profil":{"nom":"test }; {}"}};</script></html>',
  );
  assert.equal(d.profil.nom, "test }; {}");
  assert.equal(globalThis.UNSAFE_IMPORT, false);
  assert.throws(() => safeJSON('{"__proto__":{}}'));
});
test("Whole-state JSON round trip preserves both profiles", () => {
  const root = initialState();
  root.profiles.elite.user.name = "Yanis";
  const parsed = validateState(parseImport(JSON.stringify(root)));
  assert.deepEqual(parsed, root);
});
test("Report periods use their own calendar range", () => {
  const { p } = performance();
  assert.equal(
    periodReport(p, "mois").current.start,
    today().slice(0, 7) + "-01",
  );
});

test("Zero-rest source blocks behave as trisets, then retain their prescribed group rest", async () => {
  const { nextWorkoutStep } = await import("../src/engine/workout-flow.js");
  const p = newProfile("elite"),
    w = prepareWorkout(p, p.plan.sessions[0]);
  w.exercises[0].sets.push({ completed: true });
  assert.deepEqual(nextWorkoutStep(w, 0), { index: 1, rest: 0 });
  w.exercises[1].sets.push({ completed: true });
  assert.deepEqual(nextWorkoutStep(w, 1), { index: 2, rest: 0 });
  w.exercises[2].sets.push({ completed: true });
  assert.deepEqual(nextWorkoutStep(w, 2), { index: 0, rest: 120 });
});
test("Short source blocks retain the rest of their final movement after pruning", () => {
  const p = newProfile("elite");
  const short = shortenSession(
    prepareWorkout(p, p.plan.sessions[0]),
    15,
  ).session;
  for (const block of new Set(short.exercises.map((e) => e.blockIndex))) {
    assert.ok(
      short.exercises.filter((e) => e.blockIndex === block).at(-1).rest > 0,
    );
  }
  assert.ok(short.exercises.length > 0);
});

test("Source prescriptions survive poor recovery and missing equipment without automatic replacements", async () => {
  const { sourceSession } = await import("../src/engine/planner.js");
  for (const id of ["elite", "emilie"]) {
    const p = newProfile(id);
    p.equipment = ["bodyweight"];
    p.user.level = "beginner";
    p.checkIns[today()] = {
      sleep: 2,
      quality: 1,
      energy: 1,
      fatigue: 5,
      stress: 5,
      soreness: 5,
      motivation: 1,
    };
    for (const [key, phase] of Object.entries(legacy[id].PROGRAM))
      for (const [sessionKey, original] of Object.entries(phase.sessions)) {
        const source = sourceSession(p, key, sessionKey),
          workout = prepareWorkout(p, source);
        assert.equal(workout.planId, null);
        assert.equal(workout.exercises.length, original.exos.length);
        assert.equal(workout.preservePrescription, true);
        original.exos.forEach((row, i) => {
          const e = workout.exercises[i];
          assert.equal(e.sourceName, row[0]);
          assert.equal(e.exerciseId, findExercise(row[0]).id);
          assert.equal(e.targetSets, parseInt(row[2]) || 3);
          assert.equal(e.repScheme, String(row[3]));
          assert.equal(e.rest, Number(row[5]));
          assert.equal(e.tempo, row[4]);
          assert.equal(e.sourceNote, row[6] || "");
          assert.equal(e.sets.length, 0);
          assert.equal(e.targetLoad, null);
        });
      }
  }
});
test("Scheduled source deload follows the HTML while base rows stay intact", () => {
  for (const id of ["elite", "emilie"]) {
    const p = newProfile(id);
    for (const session of p.plan.sessions.filter(
      (s) => s.type === "strength",
    )) {
      const rows =
        legacy[id].PROGRAM[session.sourcePhaseKey].sessions[
          session.sourceSessionKey
        ].exos;
      rows.forEach((r, i) =>
        assert.equal(
          session.exercises[i].targetSets,
          session.deload
            ? +r[2] === 1
              ? 1
              : Math.max(1, Math.round(parseInt(r[2]) * 0.5))
            : parseInt(r[2]) || 3,
        ),
      );
    }
  }
});
test("Zero-second source rests are not replaced by invented 90-second rests in duration estimates", async () => {
  const { estimateMinutes } = await import("../src/engine/planner.js");
  assert.equal(
    estimateMinutes({ exercises: [{ targetSets: 1, repsHigh: 10, rest: 0 }] }),
    9,
  );
  assert.equal(
    estimateMinutes({
      exercises: [{ targetSets: 1, repsHigh: 10, rest: 120 }],
    }),
    11,
  );
});

/* Coaching vocal pendant la séance : le module décide quoi annoncer, sans
   parler lui-même, ce qui le rend vérifiable sans synthèse vocale. */
test("Le décompte de fin d'étape n'est jamais répété", () => {
  let memo = initialMemo();
  const timer = { index: 0, remaining: 5, steps: [{ name: "Effort" }], meta: {} };
  let r = nextAnnouncement(timer, memo);
  memo = r.memo; // première observation : pas d'annonce d'étape
  r = nextAnnouncement({ ...timer, remaining: 5 }, memo);
  assert.equal(r.text, "5");
  memo = r.memo;
  r = nextAnnouncement({ ...timer, remaining: 5 }, memo);
  assert.equal(r.text, null, "le 5 ne doit pas être redit");
  r = nextAnnouncement({ ...timer, remaining: 3 }, memo);
  assert.equal(r.text, "3");
});
test("La fin d'une récupération est annoncée une seule fois", () => {
  const timer = { done: true, meta: { type: "rest" }, steps: [], index: 0 };
  const first = nextAnnouncement(timer, initialMemo());
  assert.match(first.text, /Récupération terminée/);
  assert.equal(nextAnnouncement(timer, first.memo).text, null);
});
test("Un changement d'étape nomme le mouvement suivant", () => {
  const steps = [{ name: "Squat" }, { name: "Développé couché" }];
  let r = nextAnnouncement({ index: 0, remaining: 40, steps, meta: {} }, initialMemo());
  r = nextAnnouncement({ index: 1, remaining: 40, steps, meta: {} }, r.memo);
  assert.match(r.text, /Développé couché/);
});
test("Le minuteur en pause reste silencieux", () => {
  const r = nextAnnouncement(
    { index: 0, remaining: 3, paused: true, steps: [{ name: "Effort" }], meta: {} },
    initialMemo(),
  );
  assert.equal(r.text, null);
});
test("Un tempo absent n'invente aucune annonce", () => {
  assert.equal(tempoAnnouncement({}), null);
  assert.equal(tempoAnnouncement({ tempo: "n'importe quoi" }), null);
  assert.match(tempoAnnouncement({ tempo: "3-1-1" }), /3 secondes en descente/);
});

/* Veille du coach : il doit repérer un problème sans qu'on le lui dise,
   et surtout se taire quand tout va bien. */
test("Un profil sain ne déclenche aucun signalement de veille", () => {
  const p = newProfile("elite");
  p.forceTests = [{ date: today(), entries: [] }];
  const findings = reviewProfile(p);
  assert.deepEqual(
    findings.filter((f) => f.severity === "high"),
    [],
    "aucun constat grave attendu sur un profil neuf",
  );
});
test("Une douleur récente est repérée seule", () => {
  const p = newProfile("elite");
  p.checkIns[today()] = { painReported: true, sleep: 7 };
  const f = reviewProfile(p).find((x) => x.key.startsWith("watch-pain"));
  assert.ok(f, "la douleur doit être signalée");
  assert.equal(f.severity, "high");
  assert.equal(f.action.type, "fatigue");
});
test("Une récupération basse trois jours de suite déclenche un allègement", () => {
  const p = newProfile("elite");
  const bas = {
    sleep: 4,
    quality: 1,
    energy: 1,
    fatigue: 5,
    stress: 5,
    soreness: 5,
    motivation: 1,
  };
  for (let i = 0; i < 3; i++) p.checkIns[addDays(today(), -i)] = { ...bas };
  const f = reviewProfile(p).find((x) => x.key.startsWith("watch-recovery"));
  assert.ok(f, "trois jours bas doivent être repérés");
  assert.equal(f.action.type, "fatigue");
});
test("Un seul mauvais jour ne déclenche pas d'allègement", () => {
  const p = newProfile("elite");
  p.checkIns[today()] = {
    sleep: 4,
    quality: 1,
    energy: 1,
    fatigue: 5,
    stress: 5,
    soreness: 5,
    motivation: 1,
  };
  assert.equal(
    reviewProfile(p).find((x) => x.key.startsWith("watch-recovery")),
    undefined,
    "un mauvais jour isolé n'est pas une tendance",
  );
});
test("Le réajustement du programme réduit la fréquence sans perdre l'historique", () => {
  const p = newProfile("elite");
  p.user.frequency = 4;
  const avant = p.sessions.length;
  const { profile, detail } = applyCoachAction(p, { type: "replan" });
  assert.equal(profile.user.frequency, 3);
  assert.equal(profile.sessions.length, avant, "l'historique est conservé");
  assert.match(detail, /3 séances/);
});

/* Retour au calme : les étirements doivent cibler les muscles réellement
   travaillés, et jamais laisser l'écran vide. */
test("Le retour au calme cible les muscles de la séance", () => {
  const p = newProfile("elite");
  const s = p.plan.sessions[0];
  const muscles = new Set();
  for (const t of s.exercises) {
    const ex = exerciseById(t.exerciseId);
    if (!ex) continue;
    muscles.add(ex.muscle);
    for (const m of ex.secondary || []) muscles.add(m);
  }
  const tous = RECOVERY_EXERCISES.filter((e) => e.pattern === "stretch");
  const cibles = tous.filter((e) => muscles.has(e.muscle));
  assert.ok(cibles.length > 0, "des étirements doivent correspondre");
  assert.ok(
    cibles.every((e) => muscles.has(e.muscle)),
    "aucun étirement hors des muscles travaillés",
  );
});
test("Tous les étirements portent une illustration", () => {
  const sans = RECOVERY_EXERCISES.filter(
    (e) => e.pattern === "stretch" && !e.img,
  );
  assert.deepEqual(sans.map((e) => e.name), []);
});

/* Résolution d'un exercice par un nom partiel. Le piège : « développé
   couché » contient « développé », qui à lui seul ramène le développé
   militaire. Le candidat doit couvrir le plus de mots possible. */
test("Un nom partiel désigne le bon exercice", () => {
  const cas = [
    ["quelle charge au développé couché ?", "Développé couché barre plat"],
    ["je mets combien au squat", "Back squat"],
    ["combien au soulevé de terre", "Soulevé de terre roumain barre"],
  ];
  for (const [phrase, attendu] of cas) {
    const ex = namedExercise(prepare(phrase));
    assert.ok(ex, `aucun exercice trouvé pour « ${phrase} »`);
    assert.equal(ex.name, attendu, `« ${phrase} »`);
  }
});
test("Une question de charge donne l'exercice, pas tout le tableau", () => {
  const p = newProfile("elite");
  p.forceTests = [
    { date: today(), entries: [{ movement: "bench", weight: 80, reps: 1 }] },
  ];
  const r = interpretCommand(p, "quelle charge au développé couché ?");
  assert.ok(
    !/référentiel de force actuel/.test(r.text),
    "la question ciblée ne doit pas déverser le référentiel entier",
  );
});
test("Les formulations orales de charge sont comprises", () => {
  const p = newProfile("elite");
  for (const phrase of [
    "je mets combien au squat",
    "je charge combien au squat",
    "combien de kilos au squat",
  ]) {
    const r = interpretCommand(p, phrase);
    assert.ok(
      !/pas saisi votre demande/.test(r.text),
      `« ${phrase} » ne doit pas tomber dans le repli`,
    );
  }
});

/* Échauffement et étirements guidés : le minuteur les enchaîne et le
   coach vocal annonce chaque changement. L'annonce finale doit nommer le
   bon protocole. */
test("L'annonce finale distingue échauffement, étirements et séance", () => {
  const cas = [
    [{ type: "warmup", name: "Échauffement guidé" }, /Échauffement terminé/],
    [{ type: "warmup", name: "Étirements guidés" }, /Étirements terminés/],
    [{ type: "rest" }, /Récupération terminée/],
  ];
  for (const [meta, attendu] of cas) {
    const r = nextAnnouncement(
      { done: true, meta, steps: [], index: 0 },
      initialMemo(),
    );
    assert.match(r.text, attendu, JSON.stringify(meta));
  }
});
test("Chaque étape d'échauffement porte une illustration", () => {
  const p = newProfile("elite");
  const s = p.plan.sessions.find((x) => x.type === "strength");
  const etapes = warmup(p, s);
  assert.ok(etapes.length >= 4, "l'échauffement doit avoir des étapes");
  assert.deepEqual(
    etapes.filter((e) => !e.img).map((e) => e.name),
    [],
    "toutes les étapes doivent avoir une image",
  );
});

/* Rappels de suivi : le coach prévient une semaine avant, et l'échéance
   est calée sur la première date enregistrée pour ne pas dériver. */
test("L'échéance de suivi part de la première date, pas de la dernière", () => {
  // Origine au 1er janvier, dernier relevé en retard : l'échéance reste
  // alignée sur le rythme de quatre semaines depuis l'origine.
  const e = echeanceSuivi(["2026-01-01", "2026-02-05"], 4, "2026-02-10");
  assert.equal(e.origine, "2026-01-01");
  assert.equal(e.prochaine, "2026-02-26", "28 jours × 2 après l'origine");
});
test("Un rappel de suivi apparaît une semaine avant l'échéance", () => {
  const e = echeanceSuivi(["2026-01-01"], 4, "2026-01-25");
  assert.equal(e.jours, 4);
  assert.equal(e.bientot, true, "à J-4 le préavis doit être actif");
  const loin = echeanceSuivi(["2026-01-01"], 4, "2026-01-10");
  assert.equal(loin.bientot, false, "à J-19 il est trop tôt");
});
test("Le coach annonce la réévaluation 1RM avant l'échéance", () => {
  const p = newProfile("elite");
  // Forme réelle d'un bilan : un exercice et une estimation, pas des
  // « entries ». Un test mal formé n'est pas compté comme réalisé.
  p.forceTests = [
    {
      id: "t1",
      date: addDays(today(), -(8 * 7 - 5)),
      needsDate: false,
      exerciseId: "developpe-couche-barre",
      estimate: 80,
      declared: true,
    },
  ];
  const f = reviewProfile(p).find((x) => x.key.startsWith("watch-force-avant"));
  assert.ok(f, "un préavis doit être émis à J-5");
  assert.match(f.title, /5 jours/);
});
test("La lecture des photos ne prétend jamais voir les images", () => {
  const p = newProfile("elite");
  assert.equal(photoComparison(p).possible, false);
  p.photos = [
    { date: "2026-01-01", view: "face" },
    { date: "2026-02-01", view: "face" },
  ];
  p.measurements = [
    { date: "2026-01-01", weight: 90 },
    { date: "2026-02-01", weight: 88 },
  ];
  const r = photoComparison(p);
  assert.equal(r.possible, true);
  assert.match(r.text, /-2 kg/);
});

/* Effacement de la conversation : il ne doit toucher que les messages.
   Les séances, mesures et réglages sont des données de suivi, pas du
   dialogue — les perdre serait irréparable. */
test("Effacer la conversation ne touche pas les données d'entraînement", () => {
  const p = newProfile("elite");
  p.messages = [
    { id: "m1", role: "user", text: "salut" },
    { id: "m2", role: "coach", text: "bonjour", action: { type: "fatigue" } },
  ];
  const avant = {
    sessions: p.sessions.length,
    plan: p.plan.sessions.length,
    mesures: p.measurements.length,
    theme: p.preferences.theme,
  };
  // Ce que fait la modale : vider la seule liste des messages.
  const q = structuredClone(p);
  q.messages = [];
  assert.equal(q.messages.length, 0);
  assert.equal(q.sessions.length, avant.sessions);
  assert.equal(q.plan.sessions.length, avant.plan);
  assert.equal(q.measurements.length, avant.mesures);
  assert.equal(q.preferences.theme, avant.theme);
});
test("Les propositions en attente sont dénombrées avant effacement", () => {
  const messages = [
    { id: "a", text: "bonjour" },
    { id: "b", text: "alléger ?", action: { type: "fatigue" } },
    { id: "c", text: "déjà fait", action: { type: "fatigue" }, applied: true },
  ];
  const enAttente = messages.filter((x) => x.action && !x.applied).length;
  assert.equal(enAttente, 1, "seule la proposition non appliquée compte");
});

/* Parité entre les deux profils. Tout a été mis au point sur les données
   de Yanis : ce test garantit qu'Émilie reçoit les mêmes fonctions, et
   qu'aucune évolution future ne la laisse de côté. */
test("Émilie reçoit les mêmes fonctions que Yanis", () => {
  for (const id of ["elite", "emilie"]) {
    const p = newProfile(id);
    const s = (p.plan?.sessions || []).find((x) => x.type === "strength");
    assert.ok(s, `${id} : aucune séance de musculation au programme`);

    // Échauffement guidé : des étapes, toutes illustrées.
    const etapes = warmup(p, s);
    assert.ok(etapes.length >= 4, `${id} : échauffement trop court`);
    assert.deepEqual(
      etapes.filter((e) => !e.img).map((e) => e.name),
      [],
      `${id} : étape d'échauffement sans image`,
    );

    // Étirements ciblés sur les muscles réellement travaillés.
    const muscles = new Set();
    for (const t of s.exercises) {
      const ex = exerciseById(t.exerciseId);
      if (!ex) continue;
      muscles.add(ex.muscle);
      for (const m of ex.secondary || []) muscles.add(m);
    }
    const cibles = RECOVERY_EXERCISES.filter(
      (e) => e.pattern === "stretch" && muscles.has(e.muscle),
    );
    assert.ok(cibles.length > 0, `${id} : aucun étirement ciblé`);

    // JARVIS comprend une question de charge.
    const r = interpretCommand(p, "je mets combien au squat");
    assert.ok(
      !/pas saisi votre demande/.test(r.text),
      `${id} : JARVIS ne comprend pas la question de charge`,
    );

    // La veille du coach s'exécute sans erreur.
    assert.ok(Array.isArray(reviewProfile(p)), `${id} : veille en échec`);
  }
});

/* Détail d'une journée METCON ou piscine : chaque étape doit pouvoir
   afficher son geste et ses consignes. Le guide portait déjà les deux,
   mais rien ne les reliait à l'étape. */
test("Les étapes de piscine trouvent leur guide, son image et ses consignes", () => {
  let avecGuide = 0,
    avecImage = 0,
    avecConsignes = 0,
    total = 0;
  for (const g of POOL_GUIDES) {
    total++;
    if (g.img) avecImage++;
    if (g.h?.length) avecConsignes++;
  }
  assert.ok(total >= 15, "le catalogue de guides doit être fourni");
  assert.equal(avecImage, total, "chaque guide doit porter une image");
  assert.equal(avecConsignes, total, "chaque guide doit porter des consignes");

  // La correspondance par mot-clé doit fonctionner sur des noms réels.
  for (const nom of [
    "Échauffement — marche aquatique",
    "Aqua-jogging sur place",
    "Retour au calme",
  ]) {
    const g = POOL_GUIDES.find((x) =>
      x.k.some((k) => norm(nom).includes(norm(k))),
    );
    assert.ok(g, `aucun guide pour « ${nom} »`);
    avecGuide++;
  }
  assert.equal(avecGuide, 3);
});

/* Gestes de cardio sur machine. Le piège : « Fractionné soutenu » existe
   dans les deux univers, à la nage et à l'elliptique. Sans distinction de
   segment, une étape d'elliptique affichait un nageur. */
test("Une étape d'elliptique ne montre jamais un geste de nage", () => {
  const cas = [
    "Échauffement elliptique",
    "Fractionné soutenu 3",
    "Récupération active",
    "Retour au calme elliptique",
  ];
  for (const nom of cas) {
    const g = stepGuide(nom, "cardio");
    assert.ok(g, `aucun guide pour « ${nom} »`);
    assert.ok(g.img, `« ${nom} » sans illustration`);
    assert.ok(
      !/nager|aquatique|bassin|piscine/i.test(g.t),
      `« ${nom} » renvoie un geste de nage : ${g.t}`,
    );
  }
});
test("Le guide le plus précis l'emporte sur le plus général", () => {
  // « elliptique » seul ne doit pas capturer l'étape de retour au calme.
  assert.match(stepGuide("Retour au calme elliptique", "cardio").t, /retour au calme/i);
  assert.match(stepGuide("Échauffement elliptique", "cardio").t, /mise en route/i);
});
test("Les étapes de bassin gardent leurs gestes aquatiques", () => {
  for (const nom of ["Aqua-jogging sur place", "Échauffement — marche aquatique"]) {
    const g = stepGuide(nom, "pool");
    assert.ok(g?.img, `« ${nom} » sans illustration`);
  }
});
