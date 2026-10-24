import test from "node:test";
import assert from "node:assert/strict";
import { newProfile } from "../src/store/model.js";
import { findExercise } from "../src/data/library.js";
import { makeTarget, nextSession } from "../src/engine/planner.js";
import { adaptSessionLoads } from "../src/engine/fitness.js";
import { interpretCommand, applyCoachAction } from "../src/engine/coach.js";
import { addDays, today, uid } from "../src/engine/utils.js";

function profileWithBenchHistory() {
  const p = newProfile("elite");
  const exercise = findExercise("Développé couché barre");
  const target = {
    ...makeTarget(exercise, p),
    targetSets: 3,
    repsLow: 8,
    repsHigh: 12,
    unit: "kg total",
  };
  target.sets = Array.from({ length: 3 }, () => ({
    id: uid(),
    weight: 50,
    reps: 12,
    rpe: 8,
    unit: "kg total",
    completed: true,
    createdAt: Date.now(),
  }));
  p.sessions = [
    {
      id: uid(),
      date: addDays(today(), -1),
      name: "Séance précédente",
      type: "strength",
      status: "completed",
      source: "workout",
      exercises: [target],
    },
  ];
  const session = nextSession(p);
  session.name = "Séance existante";
  session.exercises = [
    {
      ...target,
      id: "target-a-conserver",
      targetLoad: 50,
      recommendation: null,
      sets: [],
    },
  ];
  p.plan.sessions = [session];
  return { p, session, exercise };
}

test("une demande de charge propose une adaptation de la séance existante", () => {
  const { p, session } = profileWithBenchHistory();
  const before = structuredClone(p);
  const answer = interpretCommand(p, "Modifie mes charges");
  assert.equal(answer.action?.type, "adapt-loads");
  assert.equal(answer.action.sessionId, session.id);
  assert.equal(answer.action.exerciseId, null);
  assert.notEqual(answer.action.type, "plan");
  assert.match(answer.text, /Séance existante/);
  assert.match(answer.text, /52,5 kg/);
  assert.match(answer.text, /mêmes exercices, même ordre, même planning/);
  assert.deepEqual(p, before, "l'aperçu ne modifie pas le profil");
});

test("l'application conserve le programme, les identifiants et l'historique", () => {
  const { p, session } = profileWithBenchHistory();
  const answer = interpretCommand(p, "Recalcule mes charges");
  const originalSessions = structuredClone(p.sessions);
  const originalPlanLength = p.plan.sessions.length;
  const { profile, detail } = applyCoachAction(p, answer.action);
  const adapted = profile.plan.sessions.find((s) => s.id === session.id);
  assert.equal(profile.plan.sessions.length, originalPlanLength);
  assert.equal(adapted.exercises.length, 1);
  assert.equal(
    adapted.exercises[0].exerciseId,
    session.exercises[0].exerciseId,
  );
  assert.equal(adapted.exercises[0].targetSets, 3);
  assert.equal(adapted.exercises[0].repScheme, session.exercises[0].repScheme);
  assert.equal(adapted.exercises[0].targetLoad, 52.5);
  assert.equal(adapted.userAdapted, true);
  assert.deepEqual(profile.sessions, originalSessions);
  assert.match(detail, /historique conservés/);
});

test("une demande globale ne prend pas « charge » pour un exercice", () => {
  const p = newProfile("elite");
  const answer = interpretCommand(
    p,
    "Je veux modifier mon programme avec une charge adaptative",
  );
  assert.equal(answer.action, undefined);
  assert.notEqual(answer.action?.type, "plan");
  assert.doesNotMatch(answer.text, /Back squat/);
  assert.match(answer.text, /Je n’ai rien régénéré/);
});

test("les séries déjà saisies ne sont jamais réécrites par l'adaptation", () => {
  const { p, session } = profileWithBenchHistory();
  const completed = structuredClone(session.exercises[0]);
  completed.sets = [
    {
      id: "set-deja-saisi",
      weight: 47.5,
      reps: 8,
      rpe: 9,
      unit: "kg total",
      completed: true,
    },
  ];
  session.exercises = [completed];
  const result = adaptSessionLoads(p, session);
  assert.equal(result.changes.length, 0);
  assert.equal(result.skippedCompleted, 1);
  assert.deepEqual(result.session.exercises[0].sets, completed.sets);
  assert.equal(result.session.exercises[0].targetLoad, 50);
});
