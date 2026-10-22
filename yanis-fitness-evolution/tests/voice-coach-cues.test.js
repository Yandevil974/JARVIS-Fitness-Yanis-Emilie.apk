import test from "node:test";
import assert from "node:assert/strict";
import { exerciseIntroCue, techniqueCue } from "../src/engine/voice-coach.js";
import { coachingFor } from "../src/data/exercise-videos.js";

const exercises = [
  {
    id: "curl-scott-barre-ez-pronation",
    name: "Curl Scott barre EZ pronation",
    defaultSets: 4,
    repScheme: "10",
    tempo: "3020",
  },
  {
    id: "curl-haltere-supination-banc-scott-90",
    name: "Curl deux haltères au banc Scott 90°",
    defaultSets: 4,
    repScheme: "10",
    tempo: "3020",
  },
];

test("les deux prises inversées sont annoncées automatiquement et répétables", () => {
  for (const exercise of exercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);

    const intro = exerciseIntroCue(exercise);
    assert.ok(
      intro.text.includes(coaching.spoken),
      `descriptif absent de l'annonce : ${exercise.id}`,
    );

    const technique = techniqueCue(exercise);
    assert.ok(technique.text.startsWith(coaching.spoken));
    assert.match(technique.text, /Contrôlez la descente/i);
  }
});

test("le descriptif impose une prise fixe et corrige explicitement la vidéo IA", () => {
  for (const exercise of exercises) {
    const { spoken, notice } = coachingFor(exercise);
    assert.match(spoken, /paumes vers le sol/i);
    assert.match(spoken, /dos des mains vers le haut/i);
    assert.match(spoken, /poignets verrouillés/i);
    assert.match(spoken, /seulement les coudes/i);
    assert.match(spoken, /Ne reproduisez pas/i);
    assert.match(notice, /vidéo IA fait tourner les poignets/i);
  }
});

test("les exercices sans correction spéciale gardent leur consigne tempo", () => {
  const exercise = {
    id: "back-squat",
    name: "Back squat",
    defaultSets: 4,
    repScheme: "5",
    tempo: "3111",
  };
  assert.equal(coachingFor(exercise), null);
  assert.doesNotMatch(exerciseIntroCue(exercise).text, /paumes vers le sol/i);
  assert.equal(
    techniqueCue(exercise).text,
    "Contrôlez la descente, ne lâchez pas la charge. Serrez fort en haut. Marquez la pause en bas, sans rebond.",
  );
});
