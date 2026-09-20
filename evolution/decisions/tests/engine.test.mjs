import test from "node:test";
import assert from "node:assert/strict";
import { profile, day, session } from "../../adaptation/tests/fixture.mjs";
import { analyzeExercise } from "../../adaptation/engine.mjs";
import {
  ticket,
  targets,
  prepare,
  apply,
  records,
  latest,
  followUp,
  approvedRecommendation,
  recommendation,
  canonical,
} from "../engine.mjs";
const makeWorkout = (p, s) => structuredClone(s),
  opts = { day, makeWorkout };
function fixture() {
  const p = profile();
  p.equipment = ["barbell"];
  p.preferences = { refused: [] };
  const s = session("target", "2026-09-21");
  s.type = "strength";
  s.status = "planned";
  s.exercises.forEach((e) => {
    e.sets = [];
    e.targetLoad = null;
  });
  p.plan.sessions = [s];
  return p;
}
const analysis = (p) => analyzeExercise(p, "squat", { day });
function pending(p, choice = "accepted", more = {}) {
  const a = analysis(p),
    t = ticket(p, a, day),
    target = targets(p, a, opts)[0];
  return prepare(
    p,
    t,
    {
      choice,
      confirm: true,
      targetId: target?.id,
      targetGuard: target?.guard,
      note: "Mon choix",
      until: "2026-09-25",
      ...more,
    },
    { ...opts, id: "d1" },
  );
}
function accepted() {
  const p = fixture(),
    d = pending(p);
  assert.equal(apply(p, d, opts).ok, true);
  return p;
}
test("opening, targets and preparing cannot change any profile data", () => {
  const p = fixture(),
    before = canonical(p);
  pending(p);
  assert.equal(canonical(p), before);
});
test("explicit acceptance changes only the chosen planned load and logs its true previous target", () => {
  const p = fixture(),
    before = structuredClone(p),
    d = pending(p);
  assert.equal(apply(p, d, opts).ok, true);
  assert.equal(p.plan.sessions[0].exercises[0].targetLoad, 52.5);
  assert.equal(records(p)[0].target.beforeLoad, null);
  assert.equal(records(p)[0].applied, true);
  for (const k of [
    "sessions",
    "checkIns",
    "appointments",
    "forceTests",
    "activities",
    "measurements",
  ])
    assert.deepEqual(p[k], before[k]);
  const expected = before.plan;
  expected.sessions[0].exercises[0].targetLoad = 52.5;
  expected.sessions[0].exercises[0].evolutionDecisionId = "d1";
  assert.deepEqual(p.plan, expected);
});
test("repeated clicks and strict-mode replays cannot apply twice", () => {
  const p = fixture(),
    d = pending(p);
  apply(p, d, opts);
  assert.equal(apply(p, d, opts).duplicate, true);
  assert.equal(records(p).length, 1);
  assert.throws(() => pending(p), /déjà été acceptée/);
});
test("refusal and postponement only append decisions, never change a programme", () => {
  for (const choice of ["refused", "postponed"]) {
    const p = fixture(),
      before = structuredClone(p.plan);
    assert.equal(apply(p, pending(p, choice), opts).ok, true);
    assert.deepEqual(p.plan, before);
    assert.equal(records(p)[0].applied, false);
    assert.equal(followUp(p, records(p)[0], day).status, "unchanged");
  }
});
test("reconsidering a refusal or report is explicit and preserves both choices", () => {
  const p = fixture();
  apply(p, pending(p, "postponed"), opts);
  assert.throws(() => pending(p, "refused"), /réexaminer/);
  const a = analysis(p),
    d = prepare(
      p,
      ticket(p, a, day),
      { choice: "refused", reconsider: true },
      { ...opts, id: "d2" },
    );
  assert.equal(apply(p, d, opts).ok, true);
  assert.equal(records(p).length, 2);
  assert.equal(records(p)[1].supersedes, "d1");
  assert.equal(latest(p, a).choice, "refused");
});
test("reports must be strictly future and within 30 days", () => {
  for (const until of ["", day, "2026-02-31", "2026-10-21"])
    assert.throws(() => pending(fixture(), "postponed", { until }), /30 jours/);
});
test("quantified acceptance requires a checkbox and a concrete compatible target", () => {
  assert.throws(
    () => pending(fixture(), "accepted", { confirm: false }),
    /explicitement/,
  );
  assert.throws(
    () => pending(fixture(), "accepted", { targetId: "" }),
    /compatible/,
  );
});
test("sources edited/deleted, new pain, another decision or midnight reject stale confirmations atomically", () => {
  for (const edit of [
    (p) => p.sessions.pop(),
    (p) => (p.sessions[0].exercises[0].sets[0].rir = 2),
    (p) => (p.checkIns[day].painReported = true),
    (p) => (p.evolutionDecisions = { records: [{ other: "concurrent" }] }),
  ]) {
    const p = fixture(),
      d = pending(p);
    edit(p);
    const before = canonical(p);
    assert.equal(apply(p, d, opts).ok, false);
    assert.equal(canonical(p), before);
  }
  const p = fixture(),
    d = pending(p);
  assert.equal(apply(p, d, { ...opts, day: "2026-09-21" }).ok, false);
});
test("profile mismatch cannot receive a decision even with a shared source ID", () => {
  const a = fixture(),
    d = pending(a),
    b = fixture();
  b.id = "emilie";
  const before = canonical(b);
  assert.equal(apply(b, d, opts).ok, false);
  assert.equal(canonical(b), before);
});
test("changed, removed or replaced plan/target/equipment invalidate a selected target", () => {
  for (const edit of [
    (p) => (p.plan.id = "replacement"),
    (p) => (p.plan.sessions = []),
    (p) => (p.plan.sessions[0].exercises[0].targetLoad = 60),
    (p) => (p.plan.sessions[0].date = "2026-09-22"),
    (p) => (p.equipment = []),
  ]) {
    const p = fixture(),
      d = pending(p);
    edit(p);
    const before = canonical(p);
    assert.equal(apply(p, d, opts).ok, false);
    assert.equal(canonical(p), before);
  }
});
test("in-progress workouts, historical or distant targets, deloads, duplicates and altered prescriptions are ineligible", () => {
  for (const edit of [
    (p) => (p.workout = { id: "w" }),
    (p) => (p.plan.sessions[0].date = "2026-09-19"),
    (p) => (p.plan.sessions[0].date = "2026-11-01"),
    (p) => (p.plan.sessions[0].status = "completed"),
    (p) => (p.plan.sessions[0].deload = true),
    (p) => p.plan.sessions.push(structuredClone(p.plan.sessions[0])),
    (p) => (p.plan.sessions[0].exercises[0].unit = "kg/main"),
    (p) => (p.plan.sessions[0].exercises[0].sets = [{}]),
  ]) {
    const p = fixture();
    edit(p);
    assert.equal(targets(p, analysis(p), opts).length, 0);
  }
});
test("starter simulation must preserve exercise order, prescription, equipment and accepted load", () => {
  const p = fixture();
  for (const makeWorkout of [
    (p, s) => ({ ...s, exercises: [] }),
    (p, s) => {
      s.exercises[0].unavailable = true;
      return s;
    },
  ])
    assert.equal(targets(p, analysis(p), { day, makeWorkout }).length, 0);
  const d = pending(p);
  const bad = (p, s) => {
    if (s.exercises[0].evolutionDecisionId) s.exercises[0].targetLoad = 1;
    return s;
  };
  assert.equal(apply(p, d, { day, makeWorkout: bad }).ok, false);
  assert.equal(p.plan.sessions[0].exercises[0].targetLoad, null);
});
test("unquantified maintenance accepts the principle without pretending to apply a charge", () => {
  const p = fixture();
  p.sessions.forEach((s) => s.exercises[0].sets.forEach((x) => (x.reps = 10)));
  const d = pending(p);
  assert.equal(apply(p, d, opts).ok, true);
  assert.equal(records(p)[0].applied, false);
  assert.equal(p.plan.sessions[0].exercises[0].targetLoad, null);
});
test("unsafe or insufficient analyses never become adaptation decisions", () => {
  const p = fixture();
  p.checkIns[day].painReported = true;
  assert.throws(() => ticket(p, analysis(p), day), /ne permet/);
});
test("confirmed load is visible through native recommendation contract but manual edits revoke its label", () => {
  const p = accepted(),
    e = p.plan.sessions[0].exercises[0];
  assert.equal(approvedRecommendation(p, e).weight, 52.5);
  assert.equal(approvedRecommendation(p, { ...e, targetLoad: 50 }), null);
  assert.equal(approvedRecommendation({ ...p, id: "emilie" }, e), null);
});
test("follow-up never treats planned, active, expired or removed target as performed", () => {
  const p = accepted(),
    r = records(p)[0];
  assert.equal(followUp(p, r, day).status, "pending");
  p.workout = { planId: "target" };
  assert.equal(followUp(p, r, day).status, "active");
  p.workout = null;
  assert.equal(followUp(p, r, "2026-09-22").status, "unverified");
  p.plan.sessions[0].exercises[0].targetLoad = 60;
  assert.equal(followUp(p, r, day).status, "changed");
  p.plan.sessions = [];
  assert.equal(followUp(p, r, day).status, "missing");
});
test("actual follow-up uses planId and real sets, not planned targetLoad or matching exercise name", () => {
  const p = accepted(),
    r = records(p)[0],
    s = session("done", "2026-09-21", { weight: 52.5, reps: 10 });
  p.sessions.push(s);
  assert.equal(followUp(p, r, "2026-09-21").status, "pending");
  s.planId = "target";
  let f = followUp(p, r, "2026-09-21");
  assert.equal(f.status, "observed");
  assert.match(f.text, /3 série/);
  s.status = "partial";
  s.exercises[0].sets[0].weight = 50;
  f = followUp(p, r, "2026-09-21");
  assert.match(f.text, /partielle/);
  assert.match(f.text, /2 série/);
  s.exercises[0].sets.forEach((x) => (x.completed = false));
  assert.match(followUp(p, r, "2026-09-21").text, /0 série/);
});
test("ambiguous execution and changed prescriptions do not infer causal success", () => {
  const p = accepted(),
    r = records(p)[0],
    s = session("done", "2026-09-21");
  s.planId = "target";
  s.exercises[0].rest = 60;
  p.sessions.push(s);
  assert.equal(followUp(p, r, "2026-09-21").comparable, false);
  p.sessions.push({ ...s, id: "another" });
  assert.equal(followUp(p, r, "2026-09-21").status, "ambiguous");
});
test("full decision snapshots survive JSON round trip and preserve immutability of previous choices", () => {
  const p = accepted(),
    q = JSON.parse(JSON.stringify(p));
  assert.deepEqual(records(q), records(p));
  assert.equal(
    approvedRecommendation(q, q.plan.sessions[0].exercises[0]).weight,
    52.5,
  );
});
test("an old report may be explicitly revisited against NEW data without reusing its stale ticket", () => {
  const p = fixture();
  apply(p, pending(p, "postponed"), opts);
  p.sessions[1].exercises[0].sets.forEach((s) => (s.reps = 10));
  const a = analysis(p),
    d = prepare(
      p,
      ticket(p, a, day),
      { choice: "accepted", reconsider: true, revisitId: "d1" },
      { ...opts, id: "d2" },
    );
  assert.equal(apply(p, d, opts).ok, true);
  assert.equal(records(p)[1].supersedes, "d1");
  assert.notEqual(records(p)[0].key, records(p)[1].key);
  assert.equal(p.plan.sessions[0].exercises[0].targetLoad, null);
  assert.throws(
    () =>
      prepare(
        p,
        ticket(p, analysis(p), day),
        { choice: "refused", revisitId: "d1", reconsider: true },
        { ...opts, id: "d3" },
      ),
    /réexaminée/,
  );
});
test("a removed or rescheduled plan cannot retain an approved recommendation label", () => {
  const p = accepted(),
    e = p.plan.sessions[0].exercises[0];
  p.plan.sessions[0].date = "2026-09-22";
  assert.equal(approvedRecommendation(p, e), null);
  p.plan = null;
  assert.equal(approvedRecommendation(p, e), null);
});
test("follow-up never counts duplicated series as two realized efforts", () => {
  const p = accepted(),
    r = records(p)[0],
    s = session("done", "2026-09-21");
  s.planId = "target";
  s.exercises[0].sets[1].id = s.exercises[0].sets[0].id;
  p.sessions.push(s);
  assert.equal(followUp(p, r, "2026-09-21").status, "ambiguous");
});
test("recorded target snapshot does not share arrays with the editable programme", () => {
  const p = fixture();
  for (const s of [...p.sessions, ...p.plan.sessions])
    s.exercises[0].repTargets = [];
  const d = pending(p);
  assert.equal(apply(p, d, opts).ok, true);
  p.plan.sessions[0].exercises[0].repTargets.push(99);
  assert.deepEqual(records(p)[0].target.afterShape.repTargets, []);
  assert.equal(followUp(p, records(p)[0], day).status, "changed");
});
test("refusal and report prevent legacy calculation from silently reintroducing the same increment", () => {
  for (const choice of ["refused", "postponed"]) {
    const p = fixture();
    apply(p, pending(p, choice), opts);
    const e = p.plan.sessions[0].exercises[0];
    assert.equal(approvedRecommendation(p, e).weight, 50);
    assert.equal(e.targetLoad, null);
    assert.equal(
      approvedRecommendation(p, { ...e, targetLoad: 45 }).weight,
      45,
    );
    p.sessions[1].exercises[0].sets[0].reps = 9;
    assert.equal(approvedRecommendation(p, e), null);
  }
});
test("acceptance applies to one target only, not legacy automatic forecasts on other equivalent sessions", () => {
  const p = fixture();
  p.plan.sessions.push({
    ...structuredClone(p.plan.sessions[0]),
    id: "other-target",
  });
  apply(p, pending(p), opts);
  assert.equal(
    approvedRecommendation(p, p.plan.sessions[0].exercises[0]).weight,
    52.5,
  );
  assert.equal(
    approvedRecommendation(p, p.plan.sessions[1].exercises[0]).weight,
    50,
  );
  assert.equal(p.plan.sessions[1].exercises[0].targetLoad, null);
});

test("holding an increment never hides a lower historical recovery recommendation", () => {
  const p = fixture();
  apply(p, pending(p, "refused"), opts);
  const e = p.plan.sessions[0].exercises[0],
    original = {
      weight: 45,
      unit: e.unit,
      reps: 8,
      reason: "Allègement de récupération",
    };
  assert.equal(recommendation(p, e, original), original);
  assert.equal(recommendation(p, e, { ...original, weight: 52.5 }).weight, 50);
  assert.equal(recommendation(fixture(), e, original), original);
});
