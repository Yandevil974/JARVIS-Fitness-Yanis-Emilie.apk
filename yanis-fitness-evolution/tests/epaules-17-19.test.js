import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue, techniqueCue } from "../src/engine/voice-coach.js";
import { nextRestExercise, nextRestModal } from "../src/engine/rest-next.js";

const path = (name) => fileURLToPath(new URL(`../${name}`, import.meta.url));
const sha = (name) => createHash("sha256").update(readFileSync(path(name))).digest("hex");
const cases = [
  ["developpe-derriere-la-nuque", "1794109062700.mp4", "3573763045470d1a04766461e05cc4e3df88d2551c107cfa5f24ce65f88dd77f", 5, "6-8", "4010", 60, "/media/110f2ff472634503.gif", /ne copiez pas cette profondeur/i],
  ["developpe-haltere-un-bras-debout", "1794109224423.mp4", "2c2ca1e3827ca8f7407a215020091a287fd7d86f301d28383de6801897559aae", 4, "7-9", "4010", 90, "/media/75b355758a02d50d.gif", /un seul côté/i],
];

test("épaules 17 et 19 : copies exactes, programme, GIF et corrections conservés", () => {
  for (const [id, source, hash, sets, reps, tempo, rest, gif, notice] of cases) {
    const ex = EXERCISES.find((e) => e.id === id);
    assert.deepEqual([ex.defaultSets, ex.repScheme, ex.tempo, ex.rest, ex.gif], [sets, reps, tempo, rest, gif]);
    const v = videoFor(ex);
    assert.equal(v.status, "coached");
    assert.match(v.coaching.notice, notice);
    assert.ok(exerciseIntroCue(ex, null).text.includes(v.coaching.spoken));
    assert.ok(techniqueCue(ex, null).text.includes(v.coaching.spoken));
    assert.equal(sha(`../${source}`), hash);
    for (const base of ["public", "release"]) {
      assert.equal(sha(`${base}${v.src}`), hash);
      assert.ok(existsSync(path(`${base}${v.poster}`)));
      assert.ok(existsSync(path(`${base}${gif}`)));
    }
    const next = nextRestExercise({ currentIndex: 0, exercises: [{ exerciseId: id, targetSets: sets, sets: [] }] });
    assert.equal(next.video.src, v.src);
    assert.equal(nextRestModal(next).notice, v.coaching.notice);
  }
});
