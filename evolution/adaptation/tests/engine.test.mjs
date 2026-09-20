import test from "node:test";
import assert from "node:assert/strict";
import { analyzeExercise, exerciseOptions, readiness } from "../engine.mjs";
import { profile, session, day } from "./fixture.mjs";
const analyze = (p) => analyzeExercise(p, "squat", { day });
function each(p, fn) {
  for (const s of p.sessions) for (const e of s.exercises) fn(e, s);
}
function freeze(x) {
  if (x && typeof x === "object") {
    Object.freeze(x);
    for (const v of Object.values(x)) freeze(v);
  }
  return x;
}
test("two comparable sessions: configured increment, exact unit and auditable dates", () => {
  const r = analyze(profile());
  assert.equal(r.status, "increase");
  assert.equal(r.proposal.to, 52.5);
  assert.equal(r.proposal.unit, "kg total");
  assert.deepEqual(
    r.evidence.map((e) => e.date),
    ["2026-09-17", "2026-09-10"],
  );
  assert.equal(r.comparison.deltaReps, 0);
});
test("pure deterministic analysis never writes plan, decisions or sessions", () => {
  const p = freeze(profile()),
    before = JSON.stringify(p);
  assert.deepEqual(analyze(p), analyze(p));
  assert.equal(JSON.stringify(p), before);
});
test("planned, active workout and cardio never replace actual sessions", () => {
  for (const mode of ["none", "one", "planned", "active", "cardio"]) {
    const p = profile();
    p.sessions = mode === "one" ? [p.sessions[0]] : [];
    if (mode === "planned") {
      p.sessions = [session("p", day)];
      p.sessions[0].status = "planned";
    }
    if (mode === "active") p.workout = session("a", day);
    if (mode === "cardio")
      p.activities = [{ id: "a", date: day, type: "cardio", durationSec: 600 }];
    assert.equal(analyze(p).status, "insufficient", mode);
  }
});
test("future, same-day or older-than-42-day observations cannot confirm progression", () => {
  for (const date of ["2026-09-21", "2026-09-17", "2026-08-08"]) {
    const p = profile();
    p.sessions[0].date = date;
    assert.equal(analyze(p).status, "insufficient", date);
  }
  const p = profile();
  p.sessions.push(session("future", "2026-09-21", { reps: 2 }));
  assert.equal(analyze(p).status, "increase");
});
test("missing dates and duplicate IDs cannot hide behind successes", () => {
  const p = profile();
  p.sessions.push(session("undated", ""));
  assert.equal(analyze(p).status, "insufficient");
  p.sessions.pop();
  p.sessions[0].id = "new";
  assert.equal(analyze(p).status, "insufficient");
});
test("latest partial or mismatching exposure is never replaced by older favorable sessions", () => {
  for (const change of [
    (s) => (s.status = "partial"),
    (s) => (s.exercises[0].rest = 60),
    (s) => (s.exercises[0].tempo = "2010"),
    (s) => (s.phase = "other"),
    (s) => (s.exercises[0].unit = "kg/main"),
    (s) => (s.exercises[0].targetSets = 2),
    (s) => (s.exercises[0].repsHigh = 15),
  ]) {
    const p = profile();
    p.sessions.unshift(session("older", "2026-09-05"));
    change(p.sessions.at(-1));
    assert.equal(analyze(p).status, "insufficient");
  }
});
test("exercise order and block changes are not equivalent prescriptions", () => {
  for (const mode of ["order", "block"]) {
    const p = profile();
    for (const s of p.sessions)
      s.exercises.push({
        ...structuredClone(s.exercises[0]),
        exerciseId: "bench",
      });
    if (mode === "order") p.sessions[1].exercises.reverse();
    else p.sessions[1].exercises[0].blockIndex = 2;
    assert.equal(analyze(p).status, "insufficient");
  }
});
test("unknown units, added bodyweight, seconds, variable schemes and deloads are not converted", () => {
  for (const edit of [
    (e) => (e.unit = "source à vérifier"),
    (e) => (e.unit = "kg ajouté"),
    (e) => (e.unit = "secondes"),
    (e) => (e.repTargets = [12, 10, 8]),
    (e) => (e.deload = true),
    (e, s) => (s.sourceDeloadSuggested = true),
  ]) {
    const p = profile();
    each(p, edit);
    assert.equal(analyze(p).status, "insufficient");
  }
});
test("kg/main remains per hand, never silently doubled", () => {
  const p = profile();
  each(p, (e) => {
    e.unit = "kg/main";
    e.sets.forEach((s) => (s.unit = "kg/main"));
  });
  assert.equal(analyze(p).proposal.unit, "kg/main");
  assert.equal(analyze(p).proposal.to, 52.5);
});
test("aggregated, duplicate, missing, uncompleted and mixed-unit sets are rejected", () => {
  for (const edit of [
    (e) => (e.sets[0].legacyAggregate = true),
    (e) => (e.sets[0].count = 3),
    (e) => (e.sets[0].needsReps = true),
    (e) => (e.sets[0].weight = null),
    (e) => (e.sets[0].completed = false),
    (e) => (e.sets[0].unit = "kg/main"),
    (e) => (e.sets[0].id = e.sets[1].id),
    (e) => e.sets.pop(),
  ]) {
    const p = profile();
    edit(p.sessions[1].exercises[0]);
    assert.equal(analyze(p).status, "insufficient");
  }
});
test("load changes within or between sessions do not imply progress from repetitions", () => {
  for (const edit of [
    (p) => (p.sessions[1].exercises[0].sets[0].weight = 55),
    (p) => p.sessions[1].exercises[0].sets.forEach((s) => (s.weight = 55)),
  ]) {
    const p = profile();
    edit(p);
    const r = analyze(p);
    assert.equal(r.status, "insufficient");
    assert.equal(r.comparison, undefined);
  }
});
test("missing, malformed and contradictory effort never invents reserve", () => {
  for (const edit of [
    (s) => {
      s.rpe = null;
      s.rir = null;
    },
    (s) => {
      s.rpe = 9;
      s.rir = 3;
    },
    (s) => {
      s.rpe = 6;
      s.rir = 0;
    },
    (s) => (s.rpe = 11),
  ]) {
    const p = profile();
    edit(p.sessions[1].exercises[0].sets[0]);
    assert.equal(analyze(p).status, "insufficient");
  }
});
test("RIR or RPE alone is enough when each series records consistent margin", () => {
  for (const key of ["rpe", "rir"]) {
    const p = profile();
    each(p, (e) => e.sets.forEach((s) => (s[key] = null)));
    assert.equal(analyze(p).status, "increase");
  }
});
test("ordinary unfinished rep target means maintain, not plateau diagnosis", () => {
  const p = profile();
  each(p, (e) => e.sets.forEach((s) => (s.reps = 10)));
  const r = analyze(p);
  assert.equal(r.status, "maintain");
  assert.equal(r.proposal, null);
  assert.match(r.reasons.join(" "), /ni un diagnostic/);
});
test("two repeated low-rep high-effort sessions may suggest bounded deload", () => {
  const p = profile();
  each(p, (e) =>
    e.sets.forEach((s) => {
      s.reps = 7;
      s.rpe = 9;
      s.rir = 1;
    }),
  );
  const r = analyze(p);
  assert.equal(r.status, "deload");
  assert.equal(r.proposal.to, 47.5);
  assert.equal(p.sessions[0].exercises[0].sets[0].weight, 50);
});
test("one hard session cannot establish deload and one good one cannot establish increase", () => {
  const p = profile();
  p.sessions[1] = session("new", "2026-09-17", { reps: 7, rpe: 9, rir: 1 });
  assert.equal(analyze(p).status, "maintain");
});
test("increments are not invented or rounded into unsafe leaps", () => {
  for (const increment of [null, "", true, 0, 20, 2.6]) {
    const p = profile();
    p.user.increment = increment;
    assert.equal(analyze(p).status, "maintain", String(increment));
  }
  const p = profile();
  each(p, (e) => e.sets.forEach((s) => (s.weight = 1000)));
  assert.equal(analyze(p).status, "maintain");
});
test("deload stays qualitative when no bounded decrement exists", () => {
  const p = profile();
  p.user.increment = 20;
  each(p, (e) =>
    e.sets.forEach((s) => {
      s.reps = 6;
      s.rpe = 9;
      s.rir = 1;
    }),
  );
  const r = analyze(p);
  assert.equal(r.status, "deload");
  assert.equal(r.proposal, null);
  assert.ok(r.limitation);
});
test("current/source pain overrides favorable performance and negative feedback never clears warning", () => {
  for (const date of [day, "2026-09-17"]) {
    const p = profile();
    p.checkIns[date].painReported = true;
    p.appointments.records.pre = {
      kind: "pre",
      date: day,
      answers: { pain: "no", energy: 5 },
    };
    assert.equal(analyze(p).status, "safety");
  }
  const p = profile();
  p.appointments.records.post = {
    kind: "post",
    date: "2026-09-17",
    ref: "session:new",
    answers: { pain: "yes" },
  };
  assert.equal(analyze(p).status, "safety");
});
test("absence of pain is not inferred from missing data or draft", () => {
  const p = profile();
  delete p.checkIns[day];
  p.appointments.drafts = {
    pre: { kind: "pre", date: day, answers: { pain: "no" } },
  };
  assert.equal(analyze(p).status, "insufficient");
  p.appointments.records.pre = {
    kind: "pre",
    date: day,
    answers: { pain: "no", energy: 4 },
  };
  assert.equal(analyze(p).status, "increase");
  delete p.checkIns["2026-09-17"];
  assert.equal(analyze(p).status, "insufficient");
});
test("fatigue, low energy and short sleep suppress increases", () => {
  for (const data of [{ fatigue: 4 }, { energy: 2 }, { sleep: 5 }]) {
    const p = profile();
    Object.assign(p.checkIns[day], data);
    assert.equal(analyze(p).status, "maintain");
  }
});
test("weekly warnings use actual last 7 days, never future/undated reports", () => {
  for (const date of ["2026-09-14", "2026-09-13", "", "2026-09-21"]) {
    const p = profile();
    p.teamReviews = [{ date, pain: 4 }];
    assert.equal(
      analyze(p).status,
      date === "2026-09-14" ? "safety" : "increase",
      date,
    );
  }
});
test("post-session hard effort and comments pause progression without diagnoses", () => {
  for (const answers of [{ effort: 9 }, { problems: "Épaule gênante" }]) {
    const p = profile();
    p.appointments.records.post = {
      kind: "post",
      ref: "session:new",
      date: "2026-09-17",
      answers,
    };
    assert.equal(analyze(p).status, "maintain");
  }
});
test("profiles isolated, options real, JSON deterministic and invalid date rejected", () => {
  const a = profile(),
    b = profile();
  b.id = "emilie";
  b.sessions = [];
  assert.deepEqual(exerciseOptions(a, day), ["squat"]);
  assert.deepEqual(exerciseOptions(b, day), []);
  assert.equal(analyze(b).status, "insufficient");
  assert.equal(analyze(JSON.parse(JSON.stringify(a))).status, "increase");
  assert.throws(
    () => analyzeExercise(a, "squat", { day: "2026-02-31" }),
    /invalide/,
  );
  assert.equal(readiness(a, day).pain, false);
});
test("difficulty and high effort must affect the same series before suggesting deload", () => {
  const p = profile();
  each(p, (e) => {
    e.sets[0].reps = 7;
    e.sets[1].rpe = 9;
    e.sets[1].rir = 1;
  });
  assert.equal(analyze(p).status, "maintain");
});
test("fractional configured plate increments are preserved, never rounded to another physical step", () => {
  const p = profile();
  p.user.increment = 0.125;
  assert.equal(analyze(p).proposal.to, 50.125);
});
test("explicit RAS text does not masquerade as a reported problem or as a pain answer", () => {
  const p = profile();
  p.appointments.records.post = {
    kind: "post",
    ref: "session:new",
    date: "2026-09-17",
    answers: { problems: "RAS" },
  };
  assert.equal(analyze(p).status, "increase");
  delete p.checkIns["2026-09-17"];
  assert.equal(analyze(p).status, "insufficient");
});
test("textual pyramids, AMRAP and drop sets cannot hide behind numeric min/max defaults", () => {
  for (const edit of [
    (e) => (e.repScheme = "12/10/8"),
    (e) => (e.repScheme = "max"),
    (e) => (e.repScheme = "8+"),
    (e) => (e.setScheme = "2+1"),
  ]) {
    const p = profile();
    each(p, edit);
    assert.equal(analyze(p).status, "insufficient");
  }
});
