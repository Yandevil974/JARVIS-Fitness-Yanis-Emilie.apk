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
    "lean-away-pull-ups",
    "1794018778897.mp4",
    "8791a1ea3cab9d7ea88d86d631bd2b7297358e13eb3b2f03a49a5e2cdc37377a",
    7,
    "3-5",
    "3010",
    120,
    /identique.*numéro 10/i,
    /ne montre pas clairement l'inclinaison/i,
    "tractions-pull-up",
  ],
  [
    "rowing-haltere-un-bras-prise-neutre",
    "1794018798425.mp4",
    "3a0a0ceefcb3e1c2296badfe2ff21be7fad66da68f29609a8a29c3dda61d813f",
    5,
    "5-7",
    "4010",
    120,
    /identique.*numéro 2 et numéro 12/i,
    /ne copiez pas ce défaut/i,
    "rowing-haltere-un-bras",
  ],
  [
    "pullover-cable-bras-tendus",
    "1794019288070.mp4",
    "4007b979a1452f009c8bd96322119a070f8792b921d93edabc20860f6bc23693",
    3,
    "12-15",
    "3010",
    60,
    /prise et l'attache.*peu visibles/i,
    /coudes souples/i,
    null,
  ],
  [
    "tirage-vertical-lean-away",
    "1794018866928.mp4",
    "0f3e7d8114d77ca73d15e75cdbdac9593fe462a25d942667dfc9b96e35a4410d",
    4,
    "8-10",
    "3012",
    90,
    /identique.*numéro 9/i,
    /quart supplémentaire ajoute du temps/i,
    "tirage-vertical-prise-pronation",
  ],
];

test("dos #19 à #21 et #23 : sources, doublons, copies, GIF, voix et programmation", () => {
  for (const [
    id,
    src,
    hash,
    sets,
    reps,
    tempo,
    rest,
    notice,
    cue,
    duplicate,
  ] of cases) {
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
      if (duplicate)
        assert.equal(sha(`${base}${videoFor(duplicate).src}`), hash);
    }
    assert.equal(sha(`public${video.poster}`), sha(`release${video.poster}`));
  }
  const exercise22 = EXERCISES.find(
    (e) => e.id === "rowing-assis-cable-unilateral",
  );
  assert.equal(videoFor(exercise22), null);
  for (const base of ["public", "release"])
    assert.ok(existsSync(file(`${base}${exercise22.gif}`)));
  assert.match(
    EXERCISES.find((e) => e.id === "tirage-vertical-lean-away").note,
    /1 1\/4 en bas/,
  );
});
