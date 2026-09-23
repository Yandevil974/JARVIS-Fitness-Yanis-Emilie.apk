import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  validateState,
} from "../../../JARVIS-Fitness-Source/src/store/model.js";
import { makeTeamReview } from "../../../JARVIS-Fitness-Source/src/engine/team-review.js";
import { reminders } from "../../reminders/engine.mjs";
import {
  context,
  defaults,
  prepare,
  apply,
  answers,
  record,
  saveDraft,
  clearDraft,
  sessions,
  weekFacts,
} from "../engine.mjs";
const day = "2026-09-20";
function profile() {
  const p = initialState().profiles.elite;
  p.user.startDate = "2026-09-01";
  return p;
}
function form(p, kind, changes = {}, ref = "") {
  const c = context(p, kind, ref, day);
  return [c, { ...defaults(c), ...changes }];
}
function ready(p, c, a) {
  return prepare(p, c, a, { day, makeReview: makeTeamReview, id: "test-id" });
}
function save(p, c, a) {
  assert.equal(apply(p, ready(p, c, a), day), true);
}
test("opening and closing without confirmation cannot complete a reminder", () => {
  const p = profile(),
    before = structuredClone(p),
    [c, a] = form(p, "monthly");
  answers(p, c);
  assert.deepEqual(p, before);
  saveDraft(p, c, { ...a, weight: "80" }, 1);
  assert.equal(record(p, c), null);
  assert.deepEqual(reminders(p, day), reminders(before, day));
  clearDraft(p, c);
  assert.equal(p.measurements.length, before.measurements.length);
});
test("drafts survive JSON round trip and remain profile-local", () => {
  const s = initialState(),
    [c, a] = form(s.profiles.elite, "pre", { energy: "3" });
  saveDraft(s.profiles.elite, c, a, 1);
  const restored = validateState(JSON.parse(JSON.stringify(s)));
  assert.equal(answers(restored.profiles.elite, c).energy, "3");
  assert.equal(restored.profiles.emilie.appointments, undefined);
});
test("pre-session requires explicit pain, energy and time; never generates a workout", () => {
  const p = profile(),
    before = structuredClone(p),
    [c, a] = form(p, "pre");
  assert.throws(() => ready(p, c, a), /douleur/);
  assert.throws(() => ready(p, c, { ...a, pain: "no" }), /Énergie/);
  save(p, c, { ...a, pain: "no", energy: "3", minutes: "45" });
  for (const k of ["workout", "plan", "sessions", "activities"])
    assert.deepEqual(p[k], before[k]);
});
test("important pain joins existing check-in without clearing or authorizing deload", () => {
  const p = profile();
  p.checkIns[day] = { energy: 4, painReported: true };
  const [c, a] = form(p, "pre", { pain: "no", energy: "3", minutes: "30" });
  save(p, c, a);
  assert.equal(p.checkIns[day].painReported, true);
  assert.equal(p.checkIns[day].energy, 4);
  save(p, c, { ...a, pain: "yes" });
  assert.equal(p.checkIns[day].allowDeload, undefined);
});
test("preparation of an active workout is linked, stale date/workout cannot save", () => {
  const p = profile();
  p.workout = { id: "w1" };
  const [c, a] = form(p, "pre", { pain: "no", energy: "3", minutes: "30" }),
    prepared = ready(p, c, a);
  assert.equal(prepared.context.workoutId, "w1");
  p.workout = { id: "w2" };
  assert.equal(apply(p, prepared, day), false);
  assert.throws(() => ready(p, c, a), /changé/);
  p.workout = { id: "w1" };
  assert.throws(() => prepare(p, c, a, { day: "2026-09-21" }), /changé/);
});
test("only actual dated sessions and training activities can be targeted", () => {
  const p = profile();
  p.sessions = [
    { id: "a", date: day, status: "completed" },
    { id: "b", date: day, status: "partial" },
    { id: "c", date: day, status: "planned" },
    { id: "d", date: "2026-09-21", status: "completed" },
  ];
  p.activities = [
    { id: "a", date: day, type: "cardio", durationSec: 60 },
    { id: "b", date: day, type: "rest", durationSec: 60 },
    { id: "c", date: "", type: "swim", durationSec: 60 },
  ];
  assert.deepEqual(
    sessions(p, day).map((x) => x.ref),
    ["session:a", "session:b", "activity:a"],
  );
  assert.equal(weekFacts(p, day).count, 3);
  assert.equal(weekFacts(p, day).partial, 1);
  assert.throws(() => context(p, "post", "session:c", day), /réellement/);
});
test("post-session retains exact source and does not rewrite its sets, RPE or duration", () => {
  const p = profile();
  p.sessions = [
    {
      id: "s",
      date: day,
      status: "partial",
      rpe: 4,
      durationSec: 120,
      exercises: [],
    },
  ];
  const before = structuredClone(p.sessions),
    [c, a] = form(
      p,
      "post",
      { effort: "8", pain: "no", problems: "Repos trop court" },
      "session:s",
    );
  save(p, c, a);
  assert.deepEqual(p.sessions, before);
  assert.equal(record(p, c).ref, "session:s");
  assert.equal(record(p, c).answers.effort, 8);
  assert.throws(
    () => ready(p, c, { ...a, date: "2026-09-19" }),
    /date de la séance/,
  );
});
test("deleted source rejects stale save and never fabricates a session", () => {
  const p = profile();
  p.activities = [{ id: "a", date: day, type: "swim", durationSec: 120 }];
  const [c, a] = form(p, "post", { effort: "7", pain: "yes" }, "activity:a"),
    prepared = ready(p, c, a);
  p.activities = [];
  assert.equal(apply(p, prepared, day), false);
  assert.equal(p.appointments, undefined);
});
test("weight or photo intent alone never satisfies mensurations", () => {
  const p = profile(),
    [c, a] = form(p, "monthly", { weight: "80", photos: true });
  assert.throws(() => ready(p, c, a), /au moins un tour/);
  assert.throws(
    () => ready(p, c, { ...a, values: { unknown: 80 } }),
    /au moins un tour/,
  );
  assert.equal(p.photos.length, 0);
});
test("actual cm complete the original reminder only after explicit application", () => {
  const p = profile(),
    [c, a] = form(p, "monthly", { values: { taille: "90.5" } }),
    before = reminders(p, day),
    prepared = ready(p, c, a);
  assert.deepEqual(reminders(p, day), before);
  apply(p, prepared, day);
  const r = reminders(p, day).find((r) => r.kind === "measurements");
  assert.equal(r.last, day);
  assert.equal(r.due, "2026-10-20");
  assert.equal(p.measurements.at(-1).values.taille, 90.5);
  assert.equal(p.photos.length, 0);
});
test("editing the same measurement upserts and retains unrelated bodyFat", () => {
  const p = profile(),
    [c, a] = form(p, "monthly", { values: { taille: "90" } });
  save(p, c, a);
  p.measurements.at(-1).bodyFat = 20;
  save(p, c, { ...a, values: { taille: "89" } });
  assert.equal(p.measurements.length, 1);
  assert.equal(p.measurements[0].bodyFat, 20);
  assert.equal(p.measurements[0].values.taille, 89);
});
test("invalid date, future date, values, fractional readiness and malformed imports are rejected", () => {
  const p = profile(),
    [c, a] = form(p, "monthly", { values: { taille: 90 } });
  for (const date of ["2026-02-31", "2026-09-21"])
    assert.throws(() => ready(p, c, { ...a, date }), /date/);
  for (const value of ["abc", 0, 301, true, Infinity])
    assert.throws(() => ready(p, c, { ...a, values: { taille: value } }));
  const [pre, f] = form(p, "pre", { energy: 2.5, pain: "no", minutes: 30 });
  assert.throws(() => ready(p, pre, f), /entières/);
  p.appointments = {
    drafts: {
      [c.key]: {
        answers: {
          values: { taille: {} },
          date: {},
          feelings: "x".repeat(5000),
        },
      },
    },
  };
  assert.equal(answers(p, c).date, day);
  assert.equal(answers(p, c).feelings.length, 2000);
  assert.equal(answers(p, c).values.taille, undefined);
});
test("weekly uses existing team engine, retains versions and rejects empty or out-of-cycle reviews", () => {
  const p = profile(),
    [c, a] = form(p, "weekly", {
      energy: "3",
      questions: "Comment récupérer ?",
    });
  save(p, c, a);
  assert.equal(p.teamReviews.length, 1);
  const id = p.teamReviews[0].id;
  save(p, c, { ...a, energy: "4" });
  assert.equal(p.teamReviews.length, 1);
  assert.equal(p.teamReviews[0].id, id);
  assert.equal(p.teamReviews[0].previousVersions.length, 1);
  assert.equal(reminders(p, day).find((r) => r.kind === "weekly").last, day);
  assert.throws(() => ready(p, c, defaults(c)), /au moins/);
  assert.throws(() => ready(p, c, { ...a, date: "2025-01-01" }), /52 semaines/);
});
test("all confirmed kinds survive the complete existing JSON validator without altering the other profile", () => {
  const s = initialState(),
    p = s.profiles.elite,
    other = structuredClone(s.profiles.emilie);
  p.user.startDate = "2026-09-01";
  for (const [kind, values] of [
    ["pre", { energy: "3", minutes: "30", pain: "yes" }],
    ["weekly", { energy: "3" }],
    ["monthly", { values: { taille: "90" }, weight: "80" }],
  ]) {
    const [c, a] = form(p, kind, values);
    save(p, c, a);
  }
  const result = validateState(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(result.profiles.emilie, other);
  assert.equal(
    Object.keys(result.profiles.elite.appointments.records).length,
    3,
  );
});
test("weekly and monthly drafts retain their context across midnight, pre-session does not", () => {
  const p = profile();
  for (const kind of ["weekly", "monthly"]) {
    const [c, a] = form(
      p,
      kind,
      kind === "weekly" ? { energy: "3" } : { values: { taille: "90" } },
    );
    saveDraft(p, c, a, 1);
    const prepared = prepare(p, c, a, {
      day: "2026-09-21",
      makeReview: makeTeamReview,
    });
    assert.equal(apply(p, prepared, "2026-09-21"), true);
    assert.equal(record(p, c).date, day);
  }
});
test("no synthetic activity without actual duration; invalid appointment types are rejected", () => {
  const p = profile();
  p.activities = [
    { id: "bad", type: "swim", date: day },
    { id: "bad2", type: "cardio", date: day, durationSec: 0 },
  ];
  assert.equal(sessions(p, day).length, 0);
  assert.throws(() => context(p, "__proto__", "", day), /invalide/);
});
