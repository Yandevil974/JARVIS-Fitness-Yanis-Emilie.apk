import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue } from "../src/engine/voice-coach.js";

const file = (name) => fileURLToPath(new URL(`../${name}`, import.meta.url));
const sha = (name) =>
  createHash("sha256")
    .update(readFileSync(file(name)))
    .digest("hex");
const cases = [
  [
    "rowing-assis-cable-unilateral",
    "1794021140299.mp4",
    "2652d14747509f569770b21fbc03f0fc83ca02669aac91b685f7635641be54be",
    4,
    "7-9",
    "3011",
    90,
    /pause prolongée/i,
    /une seule main/i,
  ],
  [
    "rowing-a-l-elastique",
    "1794021625378.mp4",
    "4e26e5c0d706641c6645e80b5b18486720bb35bc8b4ee507cf7edbca8821bdf7",
    3,
    "10-15",
    "3010",
    90,
    /main est masquée/i,
    /fixez-le solidement à un ancrage stable/i,
  ],
];

test("dos #22 et #25 : sources, copies, GIF, voix et programmation ; #24 préservé", () => {
  assert.notEqual(cases[0][2], cases[1][2]);
  for (const [id, src, hash, sets, reps, tempo, rest, notice, cue] of cases) {
    const exercise = EXERCISES.find((e) => e.id === id && e.muscle === "dos");
    assert.ok(exercise, id);
    assert.deepEqual(
      [exercise.defaultSets, exercise.repScheme, exercise.tempo, exercise.rest],
      [sets, reps, tempo, rest],
    );
    const video = videoFor(exercise);
    assert.equal(video.status, "coached");
    assert.match(video.coaching.notice, notice);
    assert.match(video.coaching.spoken, cue);
    assert.match(exerciseIntroCue(exercise, null).text, cue);
    assert.equal(sha(`../${src}`), hash);
    for (const base of ["public", "release"]) {
      assert.equal(sha(`${base}${video.src}`), hash);
      assert.ok(existsSync(file(`${base}${video.poster}`)));
      assert.ok(existsSync(file(`${base}${exercise.gif}`)));
    }
    assert.equal(sha(`public${video.poster}`), sha(`release${video.poster}`));
  }
  const e24 = EXERCISES.find((e) => e.id === "pullover-haltere-plat");
  assert.equal(videoFor(e24), null);
  for (const base of ["public", "release"])
    assert.ok(existsSync(file(`${base}${e24.gif}`)));
  assert.match(
    EXERCISES.find((e) => e.id === "rowing-a-l-elastique").note,
    /fixer solidement/i,
  );
});
