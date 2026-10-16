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

const upperExercise = EXERCISES.find((exercise) => exercise.muscle === "pec");
const lowerExercise = EXERCISES.find((exercise) => exercise.muscle === "qua");

test("les GIFs approuvés de mise en route résolvent pour les deux profils", () => {
  for (const [key, path] of [
    ["warmup-elliptique", "/media/d53f6f22d159b4ee.gif"],
    ["warmup-scapulaire", "/media/279bb96defb9a0c8.gif"],
  ]) {
    assert.equal(stepGif(key, "elite"), path);
    assert.equal(stepGif(key, "emilie"), path);
    assert.ok(
      existsSync(fileURLToPath(new URL(`../public${path}`, import.meta.url))),
    );
  }
});

for (const [label, exercise, activation] of [
  ["haut du corps", upperExercise, /pompes scapulaires/i],
  ["bas du corps", lowerExercise, /ponts fessiers/i],
]) {
  test(`échauffement ${label}: 8 minutes, sans approche en charge`, () => {
    const steps = warmup(
      { id: "elite", user: { increment: 2.5 } },
      { exercises: [{ exerciseId: exercise.id, targetLoad: 80 }] },
    );
    assert.equal(steps.length, 4);
    assert.equal(
      steps.reduce((sum, step) => sum + step.seconds, 0),
      480,
    );
    assert.match(steps[0].name, /elliptique/i);
    assert.equal(steps[0].seconds, 240);
    assert.equal(steps[0].pattern, "elliptical");
    assert.match(steps[1].name, /mobilité/i);
    assert.match(steps[2].name, /activation/i);
    assert.match(steps[2].instruction, activation);
    assert.match(steps[3].name, /sans charge/i);
    assert.match(steps[3].instruction, /sans charge/i);
    assert.doesNotMatch(
      steps.map((step) => `${step.name} ${step.instruction}`).join(" "),
      /Approche [123]|50 %|70 %|85 %/i,
    );
    assert.notEqual(steps[1].img, steps[2].img);
  });
}

test("échauffement haut du corps: mobilité et activation scapulaire distinctes", () => {
  const steps = warmup(
    { id: "elite", user: {} },
    { exercises: [{ exerciseId: upperExercise.id }] },
  );
  assert.match(steps[1].instruction, /croisez les bras|mobilité/i);
  assert.match(steps[2].instruction, /omoplates/);
  assert.notEqual(steps[1].instruction, steps[2].instruction);
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
