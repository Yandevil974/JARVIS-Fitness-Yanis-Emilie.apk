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
import { today, addDays, uid, safeJSON } from "../src/engine/utils.js";
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
