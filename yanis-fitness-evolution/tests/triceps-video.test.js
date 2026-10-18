import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { demonstrationFor } from "../src/engine/demo-match.js";

test("l'extension triceps à la poulie utilise sa vidéo verticale dédiée", () => {
  const exercise = EXERCISES.find(
    (entry) => entry.name === "Extension triceps à la poulie",
  );
  assert.ok(exercise, "l'exercice doit exister dans la bibliothèque");
  assert.equal(exercise.video, "/media/triceps-pushdown-reel.mp4");
  assert.equal(exercise.videoPoster, "/media/triceps-pushdown-cover.jpg");

  const demo = demonstrationFor(exercise);
  assert.equal(demo?.type, "video");
  assert.equal(demo?.level, "exact");
  assert.equal(demo?.path, exercise.video);
  assert.equal(demo?.poster, exercise.videoPoster);

  assert.ok(
    existsSync(new URL("../public/media/triceps-pushdown-reel.mp4", import.meta.url)),
    "le MP4 doit être inclus dans les médias de l'application",
  );
});
