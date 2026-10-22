import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { warmup } from "../src/engine/fitness.js";
import { sourcePostStrengthPoolSteps } from "../src/engine/source-schedule.js";
import { generatePlan } from "../src/engine/planner.js";
import { newProfile } from "../src/store/model.js";
import { stepGif } from "../src/data/visuals-gifs.js";
import { stepVideoFor } from "../src/data/step-videos.js";

const upperExercise = EXERCISES.find((exercise) => exercise.muscle === "pec");
const lowerExercise = EXERCISES.find((exercise) => exercise.muscle === "qua");

test("les GIFs approuvés de mise en route résolvent pour les deux profils", () => {
  for (const [key, path] of [
    ["warmup-elliptique", "/media/4f40d9e04f696aa5.gif"],
    ["warmup-scapulaire", "/media/599d7808b062f0a3.gif"],
  ]) {
    assert.equal(stepGif(key, "elite"), path);
    assert.equal(stepGif(key, "emilie"), path);
    assert.ok(
      existsSync(fileURLToPath(new URL(`../public${path}`, import.meta.url))),
    );
  }
});

for (const [label, exercise, activation] of [
  ["haut du corps", upperExercise, /élastique/i],
  ["bas du corps", lowerExercise, /ponts fessiers/i],
]) {
  test(`échauffement ${label}: protocole test7 de 8 minutes, vidéos et approches liées`, () => {
    const steps = warmup(
      { id: "elite", user: { increment: 2.5 }, sessions: [] },
      { exercises: [{ exerciseId: exercise.id, targetLoad: 80 }] },
    );
    assert.equal(steps.length, 6);
    assert.equal(
      steps.reduce((sum, step) => sum + step.seconds, 0),
      480,
    );
    assert.equal(steps[0].name, "Mise en route");
    assert.equal(steps[0].seconds, 180);
    assert.equal(steps[0].pattern, "walk");
    assert.match(steps[1].name, /mobilité/i);
    assert.match(steps[2].name, /activation/i);
    assert.match(steps[2].instruction, activation);
    for (const step of steps.slice(0, 3)) {
      assert.ok(stepVideoFor(step.name), `vidéo manquante : ${step.name}`);
    }
    assert.notEqual(
      stepVideoFor(steps[1].name).src,
      stepVideoFor(steps[2].name).src,
    );
    const approaches = steps.slice(3);
    assert.deepEqual(
      approaches.map((step) => step.exerciseId),
      [exercise.id, exercise.id, exercise.id],
    );
    approaches.forEach((step, index) => {
      assert.match(step.name, new RegExp(`Approche ${index + 1}`));
      assert.ok(step.instruction.includes(exercise.name));
      assert.match(step.instruction, new RegExp(`${[50, 70, 85][index]} %`));
    });
  });
}

test("échauffement haut du corps: mobilité et activation scapulaire distinctes", () => {
  const steps = warmup(
    { id: "elite", user: {}, sessions: [] },
    { exercises: [{ exerciseId: upperExercise.id }] },
  );
  assert.match(steps[1].instruction, /cercles|mobilité/i);
  assert.match(steps[2].instruction, /omoplates/);
  assert.notEqual(steps[1].instruction, steps[2].instruction);
  assert.notEqual(
    stepVideoFor(steps[1].name).src,
    stepVideoFor(steps[2].name).src,
  );
});

for (const duration of [20, 25, 30]) {
  for (const week of [0, 1]) {
    test(`piscine après musculation: ${duration} min, format ${week ? "pyramide" : "intervalles"} complet`, () => {
      const steps = sourcePostStrengthPoolSteps(duration, week);
      assert.equal(
        steps.reduce((sum, step) => sum + step.seconds, 0),
        duration * 60,
      );
      assert.match(steps[0].name, /échauffement/i);
      assert.match(steps.at(-1).name, /retour au calme/i);
      assert.ok(steps.some((step) => /Fractionné/i.test(step.name)));
      assert.ok(steps.some((step) => step.kind === "rest"));
      assert.ok(
        steps
          .filter((step) => step.kind === "work")
          .every((step) => /7\/10/.test(step.instruction)),
      );
      assert.ok(steps.every((step) => step.pattern === "swim"));
    });
  }
}

test("le planning relie la séance piscine post-musculation aux étapes du minuteur", () => {
  const profile = newProfile("emilie");
  profile.user.startDate = "2026-08-10";
  const plan = generatePlan(profile, {
    source: "legacy",
    startDate: profile.user.startDate,
    weeks: 1,
  });
  const pool = plan.sessions.find(
    (session) =>
      session.sourceKind === "post-cardio" && session.type === "swim",
  );
  assert.ok(pool, "la séance piscine post-musculation est planifiée");
  const steps = pool.components[0].customSteps;
  assert.equal(
    steps.reduce((sum, step) => sum + step.seconds, 0),
    pool.estimatedMinutes * 60,
  );
  assert.match(pool.instructions, /effort 7\/10/);
  assert.ok(steps.some((step) => /Fractionné/.test(step.name)));
});
