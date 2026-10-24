import { test } from "node:test";
import assert from "node:assert/strict";
import { newProfile } from "../src/store/model.js";
import {
  interpretCommand,
  applyCoachAction,
} from "../src/engine/coach.js";
import { nextSession } from "../src/engine/planner.js";
import { addDays, monday, today } from "../src/engine/utils.js";

function planned(id, date, status = "planned") {
  return {
    id,
    date,
    time: "18:00",
    type: "strength",
    name: id,
    status,
    exercises: [
      {
        exerciseId: "back-squat",
        targetSets: 4,
        repsLow: 8,
        repsHigh: 10,
        rest: 180,
        sets: [],
      },
    ],
  };
}

function weekProfile() {
  const p = newProfile("elite");
  const start = monday(today());
  p.plan = {
    ...p.plan,
    startDate: start,
    weeks: 2,
    sessions: [
      planned("deja-terminee", start, "completed"),
      planned("semaine-a", addDays(start, 1)),
      planned("semaine-b", addDays(start, 3)),
      planned("semaine-suivante", addDays(start, 7)),
    ],
  };
  return { p, start };
}

test("« modifier mon programme » ne déclenche plus une création de cycle", () => {
  const answer = interpretCommand(
    newProfile("elite"),
    "Je veux modifier mon programme",
  );
  assert.notEqual(answer.action?.type, "plan");
  assert.equal(answer.navigate, "program");
  assert.match(answer.text, /Que souhaitez-vous modifier exactement/);
  assert.doesNotMatch(answer.text, /Je propose \d+ séances par semaine/);
});

test("une modification de programme avec remplacement garde l'intention exercice", () => {
  const answer = interpretCommand(
    newProfile("elite"),
    "Modifie mon programme : remplace le Back squat",
  );
  assert.equal(answer.action?.type, "replace");
  assert.equal(answer.action?.exerciseId, "back-squat");
  assert.notEqual(answer.action?.type, "plan");
});

test("une modification de programme avec déplacement garde l'intention calendrier", () => {
  const answer = interpretCommand(
    newProfile("elite"),
    "Modifie mon programme : décale ma séance à jeudi",
  );
  assert.equal(answer.action?.type, "move");
  assert.match(answer.action?.date || "", /^\d{4}-\d{2}-\d{2}$/);
});

test("« décale ma séance à la semaine prochaine » ajoute sept jours à cette séance", () => {
  const p = newProfile("elite");
  const upcoming = nextSession(p);
  const answer = interpretCommand(
    p,
    "Décale ma séance à la semaine prochaine",
  );
  assert.deepEqual(answer.action, {
    type: "move",
    sessionId: upcoming.id,
    date: addDays(upcoming.date, 7),
  });
});

test("la semaine non réalisée est proposée au report simple, même sans le mot « décale »", () => {
  const { p } = weekProfile();
  const answer = interpretCommand(
    p,
    "Cette semaine, je n’ai pas pu faire mes séances",
  );
  assert.equal(answer.action?.type, "shift-week");
  assert.equal(answer.action?.days, 7);
  assert.match(answer.text, /simple décalage des dates/);
  assert.doesNotMatch(answer.text, /Je propose \d+ séances par semaine/);
});

test("le report de la semaine décale la suite sans changer les séances ni l'historique", () => {
  const { p, start } = weekProfile();
  const original = structuredClone(p);
  const answer = interpretCommand(
    p,
    "Je n’ai pas pu faire mes séances cette semaine : décale-les à la semaine prochaine",
  );
  assert.equal(answer.action?.type, "shift-week");
  assert.match(answer.text, /2 séances encore planifiées cette semaine/);
  assert.match(answer.text, /1 séance des semaines suivantes/);

  const { profile, detail } = applyCoachAction(p, answer.action);
  assert.match(detail, /Contenu et historique inchangés/);
  const byId = Object.fromEntries(
    profile.plan.sessions.map((session) => [session.id, session]),
  );
  assert.equal(byId["deja-terminee"].date, start);
  assert.equal(byId["deja-terminee"].status, "completed");
  assert.equal(byId["deja-terminee"].scheduleModified, undefined);
  for (const id of ["semaine-a", "semaine-b", "semaine-suivante"]) {
    const before = original.plan.sessions.find((session) => session.id === id);
    const after = byId[id];
    assert.equal(after.date, addDays(before.date, 7));
    assert.equal(after.time, before.time);
    assert.deepEqual(after.exercises, before.exercises);
    assert.equal(after.contentLocked, true);
    assert.equal(after.scheduleModified, true);
    assert.equal(after.scheduleHistory.at(-1).from, before.date);
    assert.equal(after.scheduleHistory.at(-1).to, after.date);
    assert.equal(after.scheduleHistory.at(-1).reason, "week-shift");
  }
  assert.deepEqual(p, original, "la proposition/application ne mute pas le profil source");
});

test("le report est refusé si une séance concernée est en cours", () => {
  const { p } = weekProfile();
  p.workout = { planId: "semaine-a" };
  assert.throws(
    () => applyCoachAction(p, { type: "shift-week", weekStart: monday(today()), days: 7 }),
    /Terminez la séance ou le protocole en cours/,
  );
});

test("sans séance planifiée cette semaine, JARVIS ne régénère rien", () => {
  const { p, start } = weekProfile();
  p.plan.sessions = p.plan.sessions.filter(
    (session) => session.date < start || session.date > addDays(start, 6),
  );
  const answer = interpretCommand(
    p,
    "Décale mes séances de cette semaine à la semaine prochaine",
  );
  assert.equal(answer.action, undefined);
  assert.equal(answer.navigate, "program");
  assert.match(answer.text, /Aucun programme n’a été régénéré/);
});

test("la création explicite d'un programme reste disponible", () => {
  const answer = interpretCommand(
    newProfile("elite"),
    "Prépare 4 séances par semaine pendant 12 semaines",
  );
  assert.deepEqual(answer.action, { type: "plan", frequency: 4, weeks: 12 });
});
