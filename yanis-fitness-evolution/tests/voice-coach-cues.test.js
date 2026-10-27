import test from "node:test";
import assert from "node:assert/strict";
import {
  exerciseIntroCue,
  techniqueCue,
  previousPerformanceCue,
} from "../src/engine/voice-coach.js";
import { coachingFor } from "../src/data/exercise-videos.js";
import { EXERCISE_MAP } from "../src/data/library.js";

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

test("les biceps #18 à #20 dictent leur exécution corrigée", () => {
  const coachedExercises = [
    {
      id: "curl-concentration",
      name: "Curl concentration",
      defaultSets: 3,
      repScheme: "10-12",
      tempo: "3010",
      spoken: /Montez en une seconde/i,
    },
    {
      id: "curl-halteres-incline-prise-neutre",
      name: "Curl haltères incliné, prise neutre",
      defaultSets: 4,
      repScheme: "8-10",
      tempo: "3210",
      spoken: /haut, bas, quart, bas, haut/i,
    },
    {
      id: "curl-barre",
      name: "Curl barre",
      defaultSets: 3,
      repScheme: "10-12",
      tempo: "3010",
      spoken: /Restez debout, gainé et sur place/i,
    },
  ];
  for (const exercise of coachedExercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, exercise.spoken, exercise.id);
    assert.match(coaching.spoken, /Ne reproduisez pas/i, exercise.id);
    assert.ok(coaching.title, `titre de réserve absent : ${exercise.id}`);
  }
});

test("les triceps #02 et #04 dictent leur exécution corrigée", () => {
  const coachedExercises = [
    {
      id: "triceps-dips",
      name: "Triceps dips",
      defaultSets: 4,
      repScheme: "8-10",
      tempo: "3010",
      spoken: /Gardez le buste droit/i,
    },
    {
      id: "french-press-poulie-basse",
      name: "French press poulie basse",
      defaultSets: 4,
      repScheme: "12-15",
      tempo: "3010",
      spoken: /Gardez les deux coudes hauts/i,
    },
  ];
  for (const exercise of coachedExercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, exercise.spoken, exercise.id);
    assert.match(
      coaching.spoken,
      /Descendez .*en trois secondes/i,
      exercise.id,
    );
    assert.match(coaching.spoken, /Ne reproduisez pas/i, exercise.id);
    assert.ok(coaching.title, `titre de réserve absent : ${exercise.id}`);
  }
});

test("les triceps #03 et #05 à #09 dictent leurs trajectoires et tempos corrigés", () => {
  const coachedExercises = [
    {
      id: "triceps-extensions-halteres-banc-plat",
      name: "Triceps extensions haltères, banc plat",
      defaultSets: 4,
      repScheme: "10-12",
      tempo: "3010",
      spoken: /paumes face à face/i,
      timing:
        /Descendez les deux haltères à côté de la tête en trois secondes/i,
    },
    {
      id: "french-press-barre-ez",
      name: "French press barre EZ",
      defaultSets: 4,
      repScheme: "8-10",
      tempo: "4010",
      spoken: /vers le front/i,
      timing: /Descendez en quatre secondes/i,
    },
    {
      id: "extensions-triceps-barre-ez",
      name: "Extensions triceps barre EZ",
      defaultSets: 4,
      repScheme: "8-10",
      tempo: "4010",
      spoken: /derrière le sommet de la tête/i,
      timing: /Descendez en quatre secondes/i,
    },
    {
      id: "barre-au-front-pushdown-triceps",
      name: "Barre au front (pushdown triceps)",
      defaultSets: 3,
      repScheme: "10/8/6",
      tempo: "3010",
      spoken: /paumes vers le sol/i,
      timing: /monter vers le bas de la poitrine en trois secondes/i,
    },
    {
      id: "french-press-haltere-un-bras",
      name: "French press haltère un bras",
      defaultSets: 3,
      repScheme: "8-10",
      tempo: "3010",
      spoken: /prise neutre/i,
      timing: /Descendez l’haltère à côté de la tête en trois secondes/i,
    },
    {
      id: "extensions-triceps-pullover-barre-ez",
      name: "Extensions triceps + pullover barre EZ",
      defaultSets: 3,
      repScheme: "8-10",
      tempo: "3010",
      spoken: /mouvement des épaules|pour le pullover/i,
      timing: /Descendez en trois secondes/i,
    },
  ];
  for (const exercise of coachedExercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, exercise.spoken, exercise.id);
    assert.match(coaching.spoken, exercise.timing, exercise.id);
    assert.match(coaching.spoken, /Ne reproduisez pas/i, exercise.id);
    assert.ok(coaching.title, `titre de réserve absent : ${exercise.id}`);
  }
});

test("les triceps #10, #12 et #13 dictent le tempo et leurs corrections propres", () => {
  const coachedExercises = [
    {
      id: "developpe-couche-prise-serree",
      name: "Développé couché prise serrée",
      defaultSets: 3,
      repScheme: "8-10",
      tempo: "3010",
      spoken: /bas du sternum/i,
      timing: /Poussez la barre en une seconde/i,
    },
    {
      id: "pushdown-triceps-cable",
      name: "Pushdown triceps câble",
      defaultSets: 3,
      repScheme: "8-10",
      tempo: "3010",
      spoken: /trajectoire croisée/i,
      timing: /remonter lentement en trois secondes/i,
    },
    {
      id: "california-press-barre-au-cou",
      name: "California press (barre au cou)",
      defaultSets: 4,
      repScheme: "12-15",
      tempo: "3010",
      spoken: /espace visible/i,
      timing: /redescendez en trois secondes/i,
    },
  ];
  for (const exercise of coachedExercises) {
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, exercise.spoken, exercise.id);
    assert.match(coaching.spoken, exercise.timing, exercise.id);
    assert.match(coaching.spoken, /Ne reproduisez pas/i, exercise.id);
    assert.ok(coaching.title, `titre de réserve absent : ${exercise.id}`);
  }
});

test("les pectoraux #01 à #08 dictent leurs tempos et leurs corrections propres", () => {
  const coachedExercises = [
    {
      id: "pompes-inclinees-mains-surelevees",
      name: "Pompes inclinées (mains surélevées)",
      defaultSets: 3,
      repScheme: "8-12",
      tempo: "2010",
      rest: 60,
      spoken: /pompes au sol/i,
      timing: /poussez en une seconde/i,
    },
    {
      id: "developpe-couche-halteres",
      name: "Développé couché haltères",
      defaultSets: 3,
      repScheme: "10-12",
      tempo: "2011",
      rest: 75,
      spoken: /désynchronisation des bras/i,
      timing: /Contractez les pectoraux une seconde en haut/i,
    },
    {
      id: "developpe-incline-halteres",
      name: "Développé incliné haltères",
      defaultSets: 3,
      repScheme: "10-12",
      tempo: "2011",
      rest: 75,
      spoken: /soulèvement de la tête/i,
      timing: /descendez les deux haltères ensemble en deux secondes/i,
    },
    {
      id: "developpe-incline-barre",
      name: "Développé incliné barre",
      defaultSets: 5,
      repScheme: "8-10",
      tempo: "3010",
      rest: 60,
      spoken: /visage ou le cou/i,
      timing: /descendez en trois secondes/i,
    },
    {
      id: "developpe-halteres-plat-prise-neutre",
      name: "Développé haltères plat, prise neutre",
      defaultSets: 5,
      repScheme: "10-12",
      tempo: "3010",
      rest: 60,
      spoken: /redressement du buste/i,
      timing: /descendez les deux haltères ensemble en trois secondes/i,
    },
    {
      id: "ecartes-halteres-decline",
      name: "Écartés haltères décliné",
      defaultSets: 5,
      repScheme: "12-15",
      tempo: "3010",
      rest: 120,
      spoken: /désynchronisation ou la flexion des coudes/i,
      timing: /Ouvrez ensuite les deux bras ensemble en trois secondes/i,
    },
    {
      id: "developpe-halteres-incline-30",
      name: "Développé haltères incliné 30°",
      defaultSets: 4,
      repScheme: "8-10",
      tempo: "4010",
      rest: 90,
      spoken: /vitesse/i,
      timing: /descendez les deux haltères ensemble en quatre secondes/i,
    },
    {
      id: "developpe-halteres-decline-prise-neutre",
      name: "Développé haltères décliné, prise neutre",
      defaultSets: 4,
      repScheme: "8-10",
      tempo: "4010",
      rest: 90,
      spoken: /vitesse/i,
      timing: /descendez les deux haltères ensemble en quatre secondes/i,
    },
  ];
  for (const exercise of coachedExercises) {
    const catalog = EXERCISE_MAP[exercise.id];
    assert.ok(catalog, `exercice catalogue absent : ${exercise.id}`);
    assert.equal(catalog.name, exercise.name, exercise.id);
    assert.equal(catalog.defaultSets, exercise.defaultSets, exercise.id);
    assert.equal(catalog.repScheme, exercise.repScheme, exercise.id);
    assert.equal(catalog.tempo, exercise.tempo, exercise.id);
    assert.equal(catalog.rest, exercise.rest, exercise.id);
    const coaching = coachingFor(exercise);
    assert.ok(coaching, `descriptif absent : ${exercise.id}`);
    assert.ok(exerciseIntroCue(exercise).text.includes(coaching.spoken));
    assert.ok(techniqueCue(exercise).text.startsWith(coaching.spoken));
    assert.match(coaching.spoken, exercise.spoken, exercise.id);
    assert.match(coaching.spoken, exercise.timing, exercise.id);
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
