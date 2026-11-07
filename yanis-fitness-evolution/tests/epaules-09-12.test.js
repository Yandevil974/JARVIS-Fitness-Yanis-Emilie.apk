import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue, techniqueCue } from "../src/engine/voice-coach.js";

const path = (name) => fileURLToPath(new URL(`../${name}`, import.meta.url));
const sha = (name) => createHash("sha256").update(readFileSync(path(name))).digest("hex");
const cases = [
  ["elevations-laterales-coude-a-90", "1794045751228.mp4", "f80b1f8dc42b17be52463e60ba54751b13ec7dcb9ab872bed66f159cfd69c5cd", 4, "12-15", "3010", 120, /angle des coudes change/i, /conservant approximativement la flexion des coudes/i],
  ["elevations-laterales-incline-30-face-au-banc", "1794045567680.mp4", "a4e5c67765fd84fcb3241e1d72a65ca577a68d0591dbfd1a0e2deba682907710", 3, "10/8/6", "3010", 75, /angle exact du banc/i, /trente degrés par rapport à l'horizontale/i],
];

test("épaules #09 et #12 : sources reçues, copies, GIF, notices et voix", () => {
  for (const [id, source, hash, sets, reps, tempo, rest, notice, spoken] of cases) {
    const e = EXERCISES.find((x) => x.id === id);
    assert.ok(e, id);
    assert.deepEqual([e.defaultSets, e.repScheme, e.tempo, e.rest], [sets, reps, tempo, rest]);
    const v = videoFor(e);
    assert.equal(v.status, "coached");
    assert.match(v.coaching.notice, notice);
    assert.match(v.coaching.spoken, spoken);
    assert.match(exerciseIntroCue(e, null).text, spoken);
    assert.match(techniqueCue(e, null).text, spoken);
    assert.equal(sha(`../${source}`), hash);
    for (const base of ["public", "release"]) {
      assert.equal(sha(`${base}${v.src}`), hash);
      assert.ok(existsSync(path(`${base}${v.poster}`)));
      assert.ok(existsSync(path(`${base}${e.gif}`)));
    }
    assert.equal(sha(`public${v.poster}`), sha(`release${v.poster}`));
  }
  assert.equal(videoFor("developpe-halteres-assis-neutre-pronation"), null);
});
