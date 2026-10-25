import test from "node:test";
import assert from "node:assert/strict";
import {
  exerciseIntroCue,
  techniqueCue,
  previousPerformanceCue,
} from "../src/engine/voice-coach.js";
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

test("les Zottman dictent le départ proné et les rotations uniquement à l’arrêt", () => {
  const zottmanExercises = [
    {
      id: "curl-zottman-assis",
      name: "Curl Zottman assis",
      defaultSets: 3,
      repScheme: "8-10",
      tempo: "3010",
      descent: /trois secondes/i,
    },
    {
      id: "curl-zottman-un-bras-banc-scott",
      name: "Curl Zottman un bras, banc Scott",
      defaultSets: 4,
      repScheme: "6-8",
      tempo: "4010",
      descent: /quatre secondes/i,
    },
  ];
  for (const exercise of zottmanExercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, /paumes? vers le sol/i);
    assert.match(coaching.spoken, exercise.descent);
    assert.match(coaching.spoken, /immobiles? en bas/i);
    assert.match(coaching.spoken, /immobiles? en haut/i);
    assert.match(coaching.spoken, /supination/i);
    assert.match(coaching.spoken, /Ne reproduisez pas/i);
  }
});

test("les biceps #14 à #17 dictent leur exécution corrigée", () => {
  const coachedExercises = [
    {
      id: "curl-halteres-incline-supination",
      name: "Curl haltères incliné, supination",
      defaultSets: 5,
      repScheme: "8-10",
      tempo: "3010",
    },
    {
      id: "curl-marteau",
      name: "Curl marteau",
      defaultSets: 4,
      repScheme: "12,10,8,15",
      tempo: "3010",
    },
    {
      id: "curl-scott-90-haltere-supination",
      name: "Curl Scott 90° haltère supination",
      defaultSets: 4,
      repScheme: "12,10,8,15",
      tempo: "3010",
    },
    {
      id: "curl-zottman",
      name: "Curl Zottman",
      defaultSets: 3,
      repScheme: "10-12",
      tempo: "3010",
    },
  ];
  for (const exercise of coachedExercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, /Ne reproduisez pas/i, exercise.id);
    assert.ok(coaching.title, `titre de réserve absent : ${exercise.id}`);
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
