import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue } from "../src/engine/voice-coach.js";

const file = (name) => fileURLToPath(new URL(`../${name}`, import.meta.url));
const sha = (name) =>
  createHash("sha256")
    .update(readFileSync(file(name)))
    .digest("hex");
const sources = [
  [
    "rowing-barre-buste-penche-test-3-5-reps",
    "1793528067713.mp4",
    "6ceda9598ce31bdde1d6825e73c742ee88c535307bbc12f057773891f09d046d",
    5,
    "3-5",
    "3011",
    180,
    /redressement/i,
  ],
  [
    "rowing-barre-buste-penche-pronation",
    "1793528285602.mp4",
    "6569b54e0935d0320d6abc9904508c67237d621aac0bbae7e29c437359d74793",
    5,
    "8-10",
    "3010",
    60,
    /redressement/i,
  ],
  [
    "rowing-assis-prise-neutre",
    "1793528482361.mp4",
    "4fe9d5e2270ec6a337ebd40d37e317205aa2508a5d140feea5bfde8c9fc31901",
    5,
    "10-12",
    "3010",
    60,
    /paumes face à face/i,
  ],
];

test("dos #06 à #08 : sources distinctes, copies, GIF, programmation et consignes", () => {
  assert.equal(new Set(sources.map((x) => x[2])).size, 3);
  for (const [id, source, hash, sets, reps, tempo, rest, cue] of sources) {
    const e = EXERCISES.find((x) => x.id === id && x.muscle === "dos");
    assert.ok(e, id);
    assert.deepEqual(
      [e.defaultSets, e.repScheme, e.tempo, e.rest],
      [sets, reps, tempo, rest],
    );
    const v = videoFor(e);
    assert.equal(v.status, "coached");
    assert.ok(v.coaching.notice);
    assert.match(v.coaching.spoken, cue);
    assert.match(exerciseIntroCue(e, null).text, cue);
    assert.equal(sha(`../${source}`), hash);
    for (const base of ["public", "release"]) {
      assert.equal(sha(`${base}${v.src}`), hash);
      assert.ok(existsSync(file(`${base}${v.poster}`)));
      assert.ok(existsSync(file(`${base}${e.gif}`)));
    }
    assert.equal(sha(`public${v.poster}`), sha(`release${v.poster}`));
  }
  assert.equal(videoFor("rowing-barre-buste-penche").status, "coached");
});
