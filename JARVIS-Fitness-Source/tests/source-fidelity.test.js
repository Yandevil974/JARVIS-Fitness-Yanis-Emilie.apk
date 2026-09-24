import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { legacy } from "../src/data/library.js";
import {
  sourceDay,
  sourcePosition,
  sourceExtra,
  sourceExtraSteps,
  sourcePool,
  sourceRecoveryScore,
} from "../src/engine/source-schedule.js";
import {
  newProfile,
  migrateLegacy,
  initialState,
  validateState,
} from "../src/store/model.js";
import { restoreProfile } from "../src/store/restoration.js";
import { generatePlan } from "../src/engine/planner.js";
import { stats, chartSeries } from "../src/engine/fitness.js";
import {
  createTimer,
  advanceTimer,
  pauseTimer,
  skipTimer,
} from "../src/engine/timer.js";
import { today, addDays } from "../src/engine/utils.js";
const sourceFile = "/home/user/uploads/transformation_12_mois_sauvegarde.json";
function reference(id, frequency, start = "2026-08-10") {
  const data = legacy[id];
  const context = {
    state: {
      profil: { date: start, seancesSemaine: frequency },
      natation: { jours: id === "emilie" ? [5] : [], planDim: false },
      equip: { piscine: true, elliptique: true },
      recup: {},
      cardioChoix: {},
    },
    PROGRAM: data.PROGRAM,
    CARDIO_TYPES: data.CARDIO_TYPES,
    ZONES_CARDIO: data.ZONES_CARDIO,
    SEQUENCE_SEANCES: data.SEQUENCE_SEANCES,
    JOURS_SEANCES: data.JOURS_SEANCES,
    JOURS_CARDIO: data.JOURS_CARDIO,
    POOL_PROTOS: data.POOL_PROTOS,
    parseDate: (s) => new Date(s + "T00:00:00"),
    dateKey: (d) =>
      [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-"),
    addDays: (d, n) => {
      const x = new Date(d);
      x.setDate(x.getDate() + n);
      return x;
    },
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    startDate: () => start,
    todayKey: () => today(),
    recupScore: () => null,
    _fmtDur: () => "",
    _protoDur: () => 0,
  };
  vm.createContext(context);
  for (const name of [
    "programPos",
    "poolDays",
    ...(id === "emilie" ? ["cardioDuJour", "poolProtocolFor"] : []),
    "weekPlan",
  ])
    vm.runInContext(
      fs.readFileSync(`audit/reference/${id}-${name}.js`, "utf8"),
      context,
    );
  return context;
}
for (const id of ["elite", "emilie"])
  for (const frequency of [3, 4, 5])
    test(`All 364 days match original HTML scheduling: ${id}, ${frequency} available days`, () => {
      const p = newProfile(id);
      p.user.startDate = "2026-08-10";
      p.user.frequency = frequency;
      const context = reference(id, frequency);
      for (let i = 0; i < 364; i++) {
        const date = addDays(p.user.startDate, i),
          original = context.weekPlan(date).find((s) => s.date === date),
          actual = sourceDay(p, date);
        assert.equal(actual.deload, context.programPos(date).deload, date);
        if (original.type === "seance") {
          assert.equal(actual.type, "strength", date);
          assert.equal(actual.sessionKey, original.key, date);
        } else if (id === "emilie" && original.type === "metcon") {
          assert.equal(
            actual.type,
            original.cardio.format === "piscine"
              ? "swim"
              : original.cardio.format === "repos"
                ? "recovery"
                : "cardio",
            date,
          );
        } else
          assert.equal(
            actual.type,
            original.type === "piscine" ? "swim" : original.type || "rest",
            date,
          );
      }
    });
test("Source week 1 has three strength days and two complete METCON/pool combinations", () => {
  const p = newProfile("elite");
  p.user.startDate = "2026-08-10";
  const plan = generatePlan(p, {
    source: "legacy",
    startDate: p.user.startDate,
    weeks: 4,
  });
  assert.equal(
    plan.sessions.filter((s) => s.week === 0 && s.type === "strength").length,
    3,
  );
  const extras = plan.sessions.filter(
    (s) => s.week === 0 && s.type === "metcon",
  );
  assert.equal(extras.length, 2);
  assert.ok(
    extras.every(
      (s) =>
        s.components.some((c) => c.key === "cardio") &&
        s.components.some((c) => c.key === "pool"),
    ),
  );
  assert.equal(
    plan.sessions.filter((s) => s.week === 3 && s.type === "metcon").length,
    0,
  );
});
test("Combined timer keeps actual time per block, excluding a skipped remainder", () => {
  let t = createTimer(
    [
      { name: "Cardio", seconds: 20, segment: "cardio" },
      { name: "Transition", seconds: 5, segment: "transition" },
      { name: "Pool", seconds: 30, segment: "pool" },
    ],
    {},
    0,
  );
  t = advanceTimer(t, 12000);
  t = skipTimer(t, 12000);
  t = advanceTimer(t, 23000);
  assert.equal(t.segmentElapsed.cardio, 12);
  assert.equal(t.segmentElapsed.transition, 5);
  assert.equal(t.segmentElapsed.pool, 6);
  assert.equal(t.elapsed, 23);
});
test("Reference recovery formula matches known complete fields and never invents missing ones", () => {
  assert.equal(
    sourceRecoveryScore({
      sleep: 8,
      quality: 4,
      energy: 3,
      fatigue: 2,
      stress: 2,
      soreness: 3,
      motivation: 3,
    }),
    75,
  );
  assert.equal(sourceRecoveryScore({ fatigue: 4 }), null);
});
test(
  "Actual attached backup is retained exactly, with honest status and missing-value handling",
  { skip: !fs.existsSync(sourceFile) },
  () => {
    const raw = JSON.parse(fs.readFileSync(sourceFile, "utf8")),
      p = migrateLegacy(raw, "elite");
    assert.equal(p.user.name, "Yanis");
    assert.equal(p.user.age, 47);
    assert.equal(p.user.level, "confirmed");
    assert.equal(p.user.trainingYears, 3);
    assert.equal(p.plan.startDate, "2026-08-10");
    assert.equal(p.sessions.length, 12);
    assert.equal(stats(p, "année").sessions, 11);
    assert.equal(p.dayReports.length, 4);
    assert.equal(
      p.dayReports.filter((r) => r.status === "completed").length,
      3,
    );
    assert.equal(p.dayReports.filter((r) => r.status === "missed").length, 1);
    assert.equal(p.photos.filter((x) => x.simulated).length, 4);
    assert.equal(p.photos.filter((x) => !x.simulated).length, 4);
    assert.equal(p.forceTests.length, 10);
    assert.equal(p.goals.length, 10);
    assert.equal(p.teamReviews.length, 3);
    assert.equal(p.teamReviews.flatMap((r) => r.advice).length, 10);
    let entered = 0;
    for (const [date, j] of Object.entries(raw.journal)) {
      if (!j.exos.length) continue;
      const s = p.sessions.find((s) => s.date === date);
      assert.ok(s);
      for (let i = 0; i < j.exos.length; i++) {
        const e = j.exos[i],
          target = s.exercises[i],
          set = target.sets[0];
        assert.equal(target.sourceName, e.n);
        assert.equal(set.weight, e.ch === "" ? null : e.ch);
        assert.equal(set.reps, e.reps === "" ? null : e.reps);
        assert.equal(set.count, e.se);
        assert.equal(set.rpe, e.rpe === "" ? null : e.rpe);
        assert.equal(set.rir, e.rir === "" ? null : e.rir);
        assert.equal(set.completed, j.statut !== "non");
        entered += set.count;
      }
    }
    assert.equal(entered, 387);
    assert.equal(stats(p, "année").sets, 350);
    assert.equal(
      p.sessions
        .flatMap((s) => s.exercises)
        .flatMap((e) => e.sets)
        .filter((s) => s.needsReps)
        .reduce((n, s) => n + s.count, 0),
      80,
    );
    assert.equal(
      p.sessions.find((s) => s.date === "2026-09-01").name,
      "Bras & épaules",
    );
    assert.ok(p.sessions.find((s) => s.date === "2026-09-01").sourceMismatch);
    for (const [wk, r] of Object.entries(raw.hebdo)) {
      assert.deepEqual(
        p.teamReviews.find((x) => x.week === +wk).advice.map((x) => x.text),
        r.conseils.map((c) => c.txt),
      );
    }
    const root = initialState();
    root.profiles.elite = p;
    validateState(root);
    assert.equal(
      chartSeries(p, "tonnage", "mois").find((x) => x.date === "2026-09-01")
        .value,
      null,
    );
  },
);
test(
  "Restoration is profile-only, idempotent and keeps a more recent manual session",
  { skip: !fs.existsSync(sourceFile) },
  () => {
    const raw = JSON.parse(fs.readFileSync(sourceFile, "utf8")),
      p = migrateLegacy(raw, "elite"),
      backup = {
        format: "jarvis-profile",
        profileId: "elite",
        schemaVersion: 3,
        profile: p,
        sourceFingerprint: p.sourceDataFingerprint,
      };
    const root = initialState();
    root.profiles.emilie.user.name = "Émilie conservée";
    root.profiles.elite.sessions.push({
      id: "manual-kept",
      date: today(),
      type: "strength",
      name: "Séance locale",
      status: "partial",
      exercises: [],
      durationSec: 60,
    });
    const other = structuredClone(root.profiles.emilie);
    const result = restoreProfile(root, backup);
    assert.deepEqual(result.state.profiles.emilie, other);
    assert.ok(
      result.state.profiles.elite.sessions.some((s) => s.id === "manual-kept"),
    );
    assert.equal(result.state.profiles.elite.sessions.length, 13);
    assert.equal(restoreProfile(result.state, backup).alreadyApplied, true);
    assert.equal(result.state.profiles.elite.teamReviews.length, 3);
  },
);
