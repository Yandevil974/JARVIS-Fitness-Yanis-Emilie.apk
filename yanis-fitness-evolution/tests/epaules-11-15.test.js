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
  ["developpe-halteres-assis-neutre-pronation", "1794110300165.mp4", "dac942d4d884f143392b64eb034ccd0d3cf4710129ea1302f55640cde097c6f5", 4, "8-10", "3010", 90, "/media/6f21183bb94b2b48.gif", /rotation vers la prise neutre/i],
  ["elevations-laterales-incline-45", "1794110368867.mp4", "220989b6ee7cd54059026dcc61156df5ecae11bf387643b632dc7b0d423178a8", 3, "8-10", "3010", 60, "/media/e169d622c8002b38.gif", /interprétation de la fiche/i],
];

test("épaules 11 et 15 : sources déposées, programme, GIF et corrections conservés", () => {
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
    assert.equal(sha(`public${v.poster}`), sha(`release${v.poster}`));
    const next = nextRestExercise({ currentIndex: 0, exercises: [{ exerciseId: id, targetSets: sets, sets: [] }] });
    assert.equal(next.video.src, v.src);
    assert.equal(nextRestModal(next).notice, v.coaching.notice);
    assert.equal(nextRestModal(next).spoken, v.coaching.spoken);
  }
});
