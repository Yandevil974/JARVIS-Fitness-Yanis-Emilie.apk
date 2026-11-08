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
  ["elevations-laterales-incline", 4, "12-15", "3010", 60, "/media/e169d622c8002b38.gif", /prise de l'haltère est peu lisible/i],
  ["elevations-laterales-lean-away", 3, "12-15", "3011", 60, "/media/c2c18f416e8d2e2b.gif", /tempo 3011/i],
  ["developpe-militaire-test-1rm", 5, "1-5", "4010", 180, "/media/e264f1d521391d3c.gif", /ne démontre ni le test maximal/i],
];

test("épaules 18, 21 et 23 : prescriptions, repli et consignes spécifiques préservés", () => {
  for (const [id, sets, reps, tempo, rest, gif, notice] of cases) {
    const ex = EXERCISES.find((e) => e.id === id);
    assert.deepEqual([ex.defaultSets, ex.repScheme, ex.tempo, ex.rest, ex.gif], [sets, reps, tempo, rest, gif]);
    const v = videoFor(ex);
    assert.equal(v.status, "coached");
    assert.match(v.coaching.notice, notice);
    assert.ok(exerciseIntroCue(ex, null).text.includes(v.coaching.spoken));
    assert.ok(techniqueCue(ex, null).text.includes(v.coaching.spoken));
    for (const base of ["public", "release"]) {
      assert.ok(existsSync(path(`${base}${gif}`)));
      assert.ok(existsSync(path(`${base}${v.poster}`)));
      assert.ok(existsSync(path(`${base}${v.src}`)));
    }
    const next = nextRestExercise({ currentIndex: 0, exercises: [{ exerciseId: id, targetSets: sets, sets: [] }] });
    assert.equal(next.video.src, v.src);
    assert.equal(nextRestModal(next).notice, v.coaching.notice);
  }
});

test("le MP4 18 est intact ; 21 réutilise 18 et 23 réutilise 10", () => {
  const a = videoFor("elevations-laterales-incline");
  const b = videoFor("elevations-laterales-lean-away");
  const c = videoFor("developpe-militaire-test-1rm");
  assert.equal(a.src, b.src);
  assert.equal(a.poster, b.poster);
  assert.equal(c.src, videoFor("developpe-militaire-debout").src);
  const expected = "aaf13fa0cc5f1c6c8b96edd39c2dc0434af100f1e9d7959cf03df748846a3be7";
  assert.equal(sha("../1794144789937.mp4"), expected);
  for (const base of ["public", "release"]) assert.equal(sha(`${base}${a.src}`), expected);
  assert.match(b.coaching.spoken, /marquez une seconde en haut/i);
  assert.match(c.coaching.spoken, /trois minutes de repos/i);
});
