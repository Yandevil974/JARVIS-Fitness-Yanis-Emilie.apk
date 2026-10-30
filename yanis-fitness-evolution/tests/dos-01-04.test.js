import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue } from "../src/engine/voice-coach.js";

const file = (name) => fileURLToPath(new URL(`../${name}`, import.meta.url));
const sha256 = (path) =>
  createHash("sha256")
    .update(readFileSync(file(path)))
    .digest("hex");
const sources = [
  [
    "tirage-vertical-prise-neutre",
    "1793362378254.mp4",
    "e8f3228d7c9d8215e4cf1bc4a83e5ab53e50ad2d013037a6dc60e3e0120711e3",
    /paumes face à face/i,
  ],
  [
    "rowing-haltere-un-bras",
    "1793362391793.mp4",
    "3a0a0ceefcb3e1c2296badfe2ff21be7fad66da68f29609a8a29c3dda61d813f",
    /bassin stable/i,
  ],
  [
    "tirage-horizontal-a-la-poulie",
    "1793362422076.mp4",
    "b86fd59cdc27a7b0e6dbae0bf6694d29251ee092eaf34e455427b855bab158fb",
    /nombril/i,
  ],
  [
    "tirage-vertical-prise-large",
    "1793362437804.mp4",
    "9fc805ab40b126826c71aca1ddde535cd819238b7ea24baf24b675b6465ab29f",
    /prise large/i,
  ],
];

test("dos #01 à #04 : sources, copies, GIF et consignes accompagnées", () => {
  assert.equal(new Set(sources.map((s) => s[2])).size, 4);
  for (const [id, source, expected, cue] of sources) {
    const exercise = EXERCISES.find((e) => e.id === id && e.muscle === "dos");
    const v = videoFor(exercise);
    assert.equal(v.status, "coached", id);
    assert.ok(v.coaching.notice && v.coaching.spoken);
    assert.match(v.coaching.spoken, cue);
    assert.match(exerciseIntroCue(exercise, null).text, cue);
    assert.equal(sha256(`../${source}`), expected);
    for (const base of ["public", "release"]) {
      assert.equal(sha256(`${base}${v.src}`), expected);
      assert.ok(existsSync(file(`${base}${v.poster}`)));
      assert.ok(existsSync(file(`${base}${exercise.gif}`)));
    }
    assert.equal(sha256(`public${v.poster}`), sha256(`release${v.poster}`));
  }
  assert.match(
    videoFor("rowing-haltere-un-bras").coaching.notice,
    /déforme le bras/i,
  );
  assert.match(
    videoFor("tirage-vertical-prise-large").coaching.spoken,
    /derrière la nuque/i,
  );
  assert.equal(videoFor("rowing-barre-buste-penche"), null);
});
