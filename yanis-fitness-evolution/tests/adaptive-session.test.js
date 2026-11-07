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

test("Jarvis répond à la question sur la progression sans modifier le profil", async () => {
  const { brainAnswer } = await import("../src/brain/conversation.js");
  for (const question of [
    "Est-ce que tu tiens compte de mes performances pour faire évoluer mes prochaines charges de séances ?",
    "Tu prends en compte mes performances pour ajuster les charges de mes prochaines séances ?",
    "Est-ce que mes charges augmentent selon mes résultats ?",
    "Comment sont calculées mes charges ?",
    "Tu tiens compte de mes performances pour mes charges",
  ]) {
    for (const withHistory of [false, true]) {
      const p = withHistory ? profileWithBenchHistory().p : newProfile("elite");
      const before = structuredClone(p);
      const answer = brainAnswer(p, question);
      assert.equal(answer.brain.source, "coach", question);
      assert.equal(answer.action, undefined, question);
      assert.equal(answer.automatic, undefined, question);
      // AppContext ne remplace pas une réponse avec navigation par le cerveau distant.
      assert.equal(answer.navigate, "training", question);
      assert.match(answer.text, /même exercice et de la même unité/);
      assert.match(answer.text, /RPE ou RIR/);
      assert.match(answer.text, /augmenter automatiquement la charge initiale/);
      assert.match(answer.text, /hausse n’est pas systématique/);
      assert.match(answer.text, /charge déjà fixée reste protégée/);
      assert.match(answer.text, /confirmez pour la modifier/);
      assert.match(answer.text, withHistory ? /3 séries terminées/ : /pas encore de série terminée/);
      assert.deepEqual(p, before, question);
    }
  }
});

test("question sur les charges et douleur : la sécurité reste prioritaire", async () => {
  const { brainAnswer } = await import("../src/brain/conversation.js");
  const { p } = profileWithBenchHistory();
  for (const question of [
    "J’ai mal à l’épaule, tiens-tu compte de mes performances pour mes charges ?",
    "J'ai une douleur, comment calcules-tu mes charges à partir du bilan 1RM ?",
    "Oui, mais j’ai mal à l’épaule, tu tiens compte de mes charges ?",
  ]) {
    const answer = brainAnswer(p, question);
    assert.equal(answer.action?.type, "pain");
    assert.equal(answer.automatic, true);
    assert.match(answer.text, /Arrêtez/);
  }
});

test("demander le recalcul reste une proposition à confirmer, pas une explication", async () => {
  const { brainAnswer } = await import("../src/brain/conversation.js");
  const { p, session } = profileWithBenchHistory();
  const before = structuredClone(p);
  for (const question of [
    "Recalcule mes charges en fonction de mes performances",
    "Peux-tu recalculer mes charges en fonction de mes performances ?",
  ]) {
    const answer = brainAnswer(p, question);
    assert.equal(answer.action?.type, "adapt-loads");
    assert.equal(answer.action.sessionId, session.id);
    assert.notEqual(answer.automatic, true);
    assert.match(answer.text, /Confirmez pour appliquer/);
    assert.deepEqual(p, before);
  }
});

test("au démarrage la recommandation change, mais une cible fixée est conservée", async () => {
  const { prepareWorkout } = await import("../src/engine/planner.js");
  const { recommendLoad } = await import("../src/engine/fitness.js");
  const { p, session } = profileWithBenchHistory();
  const target = session.exercises[0];
  assert.equal(recommendLoad(p, target).weight, 52.5);
  const withTarget = prepareWorkout(p, session);
  assert.equal(withTarget.exercises[0].recommendation.weight, 52.5);
  assert.equal(withTarget.exercises[0].targetLoad, 50);
  const withoutTarget = structuredClone(session);
  withoutTarget.exercises[0].targetLoad = null;
  assert.equal(prepareWorkout(p, withoutTarget).exercises[0].targetLoad, 52.5);
  assert.equal(session.exercises[0].targetLoad, 50);
});

test("l'explication locale fonctionne aussi lorsque la mémoire Brain est désactivée", async () => {
  const { brainAnswer } = await import("../src/brain/conversation.js");
  const { setBrainEnabled } = await import("../src/brain/policy.js");
  const { p } = profileWithBenchHistory();
  setBrainEnabled(p, false);
  const before = structuredClone(p);
  const answer = brainAnswer(p, "Est-ce que tu tiens compte de mes performances pour mes charges ?");
  assert.match(answer.text, /3 séries terminées/);
  assert.equal(answer.navigate, "training");
  assert.equal(answer.action, undefined);
  assert.deepEqual(p, before);
});

test("la progression exige un effort renseigné et des données de même unité", async () => {
  const { recommendLoad } = await import("../src/engine/fitness.js");
  const { p, session } = profileWithBenchHistory();
  const target = session.exercises[0];
  assert.equal(recommendLoad(p, target).weight, 52.5);
  p.sessions[0].exercises[0].sets[0].rpe = null;
  assert.equal(recommendLoad(p, target).decision, "keep");
  p.sessions[0].exercises[0].sets.forEach((set) => { set.unit = "kg/main"; });
  const otherUnit = recommendLoad(p, target);
  assert.notEqual(otherUnit.decision, "increase");
  assert.notEqual(otherUnit.weight, 52.5);
});

test("la prochaine séance applique et indique une hausse sûre sans toucher au programme", async () => {
  const { prepareWorkout } = await import("../src/engine/planner.js");
  const { workoutLoad } = await import("../src/engine/fitness.js");
  const { brainAnswer } = await import("../src/brain/conversation.js");
  const { p, session } = profileWithBenchHistory();
  session.exercises[0].targetLoad = null;
  const before = structuredClone(p);
  const preview = workoutLoad(p, session.exercises[0]);
  assert.equal(preview.targetLoad, 52.5);
  assert.equal(preview.autoIncrease.from, 50);
  assert.equal(preview.autoIncrease.to, 52.5);
  const workout = prepareWorkout(p, session);
  assert.equal(workout.exercises[0].targetLoad, 52.5);
  assert.deepEqual(workout.exercises[0].autoIncrease, preview.autoIncrease);
  assert.match(workout.exercises[0].recommendation.reason, /De 50 à 52.5 kg/);
  assert.deepEqual(p, before, "aperçu et lancement préparé ne réécrivent ni plan ni historique");
  p.workout = workout;
  const answer = brainAnswer(p, "Est-ce que tu augmentes automatiquement mes charges ?");
  assert.match(answer.text, /j’ai appliqué au démarrage/);
  assert.match(answer.text, /50 kg → 52,5 kg/);
  assert.match(answer.text, /charges initiales, que vous pouvez modifier/);
});

test("les cibles fixées restent protégées et l'aperçu correspond au lancement", async () => {
  const { prepareWorkout } = await import("../src/engine/planner.js");
  const { workoutLoad } = await import("../src/engine/fitness.js");
  const { p, session } = profileWithBenchHistory();
  for (const fixed of [40, 50, 55]) {
    session.exercises[0].targetLoad = fixed;
    const preview = workoutLoad(p, session.exercises[0]);
    assert.equal(preview.targetLoad, fixed);
    assert.equal(preview.autoIncrease, null);
    assert.equal(preview.recommendation.label, "Charge fixée conservée");
    assert.equal(prepareWorkout(p, session).exercises[0].targetLoad, fixed);
  }
});

test("pas de hausse automatique sans historique complet, effort maîtrisé et unités compatibles", async () => {
  const { prepareWorkout } = await import("../src/engine/planner.js");
  const cases = [
    (p) => { p.sessions = []; },
    (p) => { p.sessions[0].exercises[0].sets.pop(); },
    (p) => { p.sessions[0].exercises[0].sets[0].rpe = null; },
    (p) => { p.sessions[0].exercises[0].sets.forEach((s) => { s.rpe = 9; }); },
    (p) => { p.sessions[0].exercises[0].sets.forEach((s) => { s.reps = 10; }); },
    (p) => { p.sessions[0].exercises[0].sets.forEach((s) => { s.unit = "kg/main"; }); },
    (p) => { p.sessions[0].source = "manual-set"; },
    (p) => { p.user.increment = 10; },
  ];
  for (const change of cases) {
    const { p, session } = profileWithBenchHistory();
    session.exercises[0].targetLoad = null;
    change(p);
    const target = prepareWorkout(p, session).exercises[0];
    assert.equal(target.autoIncrease, null);
    assert.ok(target.targetLoad == null || target.targetLoad <= 50);
  }
});

test("fatigue, douleur, arrêt de sécurité, prescription complexe ou matériel bloquent la hausse", async () => {
  const { prepareWorkout } = await import("../src/engine/planner.js");
  const { workoutLoad } = await import("../src/engine/fitness.js");
  const cases = [
    (p) => { p.checkIns[today()] = { painReported: true }; },
    (p) => { p.checkIns[today()] = { fatigue: 4, sleep: 10, energy: 5 }; },
    (p) => { p.sessions[0].safetyStop = true; },
    (p, target) => { target.repTargets = [12, 10, 8]; },
    (p, target) => { target.sourceNote = "drop set"; },
    (p, target) => { target.sets = [{ completed: true }]; },
    (p) => { p.equipment = []; },
  ];
  for (const change of cases) {
    const { p, session } = profileWithBenchHistory();
    const target = session.exercises[0];
    target.targetLoad = null;
    change(p, target);
    const load = workoutLoad(p, target);
    assert.equal(load.autoIncrease, null);
    assert.notEqual(load.targetLoad, 52.5);
    // A known target with already saved sets is not a valid fresh launch.
    if (!target.sets.length && p.equipment.length)
      assert.equal(prepareWorkout(p, session).exercises[0].autoIncrease, null);
  }
});

test("une unité source non vérifiée ne déclenche pas de hausse", async () => {
  const { workoutLoad } = await import("../src/engine/fitness.js");
  const { p, session } = profileWithBenchHistory();
  const target = session.exercises[0];
  target.targetLoad = null;
  target.unit = "source à vérifier";
  p.sessions[0].exercises[0].sets.forEach((s) => { s.unit = "source à vérifier"; });
  const load = workoutLoad(p, target);
  assert.equal(load.autoIncrease, null);
  assert.equal(load.autoIncreaseBlocked, true);
  assert.equal(load.targetLoad, null);
});

test("RIR renseigné permet aussi la hausse automatique, avec l'unité par main", async () => {
  const { workoutLoad } = await import("../src/engine/fitness.js");
  const { p, session } = profileWithBenchHistory();
  const target = session.exercises[0];
  target.targetLoad = null;
  target.unit = "kg/main";
  for (const set of p.sessions[0].exercises[0].sets) {
    set.unit = "kg/main";
    set.rpe = null;
    set.rir = 2;
  }
  const load = workoutLoad(p, target);
  assert.equal(load.autoIncrease.to, 52.5);
  assert.equal(load.autoIncrease.unit, "kg/main");
  assert.match(load.recommendation.reason, /par haltère/);
});
