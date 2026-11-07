import test from "node:test";
import assert from "node:assert/strict";
import {
  exerciseIntroCue,
  previousPerformanceCue,
} from "../src/engine/voice-coach.js";

const exercise = {
  id: "developpe-couche-barre",
  name: "Développé couché barre",
  defaultSets: 3,
  repScheme: "8–12",
  unit: "kg total",
};

test("le coach vocal cite une performance réelle avec son unité", () => {
  const previous = {
    sessionId: "session-precedente",
    sets: [{ completed: true, weight: 50, reps: 12 }],
  };
  const cue = previousPerformanceCue(previous, "kg total");
  assert.match(cue.text, /50 kilos pour 12 répétitions/);
  assert.match(cue.text, /exécution propre/);
  const intro = exerciseIntroCue(exercise, null, { previous });
  assert.match(intro.text, /Votre repère précédent/);
});

test("la voix ne transforme ni une charge absente ni un agrégat en record", () => {
  const noWeight = previousPerformanceCue(
    {
      sessionId: "poids-du-corps",
      sets: [{ completed: true, weight: null, reps: 10 }],
    },
    "kg total",
  );
  assert.match(noWeight.text, /10 répétitions/);
  assert.doesNotMatch(noWeight.text, /0 kilos/);
  assert.equal(
    previousPerformanceCue(
      {
        sessionId: "import-agrege",
        sets: [
          { completed: true, weight: 80, reps: 10, legacyAggregate: true },
        ],
      },
      "kg total",
    ),
    null,
  );
  assert.equal(previousPerformanceCue(null, "kg total"), null);
});

test("le repère vocal respecte l'unité par haltère", () => {
  const cue = previousPerformanceCue(
    {
      sessionId: "halteres",
      sets: [{ completed: true, weight: 20, reps: 8 }],
    },
    "kg/main",
  );
  assert.match(cue.text, /20 kilos par haltère pour 8 répétitions/);
});
