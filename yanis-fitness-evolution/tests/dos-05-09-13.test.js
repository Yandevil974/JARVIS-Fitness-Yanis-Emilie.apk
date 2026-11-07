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
const cases = [
  [
    "rowing-barre-buste-penche",
    "1793766716767.mp4",
    "6569b54e0935d0320d6abc9904508c67237d621aac0bbae7e29c437359d74793",
    3,
    "10-12",
    "2011",
    90,
    /redresse le buste/i,
    /identique.*numéro 7/i,
  ],
  [
    "tirage-vertical-prise-pronation",
    "1793801260971.mp4",
    "0f3e7d8114d77ca73d15e75cdbdac9593fe462a25d942667dfc9b96e35a4410d",
    5,
    "12-15",
    "3010",
    120,
    /bras tendus/i,
    /bras commencent fléchis/i,
  ],
  [
    "tractions-pull-up",
    "1793767077350.mp4",
    "8791a1ea3cab9d7ea88d86d631bd2b7297358e13eb3b2f03a49a5e2cdc37377a",
    5,
    "5-7",
    "4210",
    90,
    /deux secondes en bas/i,
    /sept secondes/i,
  ],
  [
    "tractions-prise-neutre-chin-up",
    "1793800879136.mp4",
    "be0d4305552668e9314bc950c6730e5f1fa6ec0a4aa85ac55363491e5b55ddaf",
    5,
    "5-7",
    "4210",
    90,
    /paumes face à face/i,
    /prise.*ne démontre pas clairement/i,
  ],
  [
    "rowing-haltere-un-bras-coude-ouvert",
    "1793800965600.mp4",
    "3a0a0ceefcb3e1c2296badfe2ff21be7fad66da68f29609a8a29c3dda61d813f",
    4,
    "8-10",
    "4010",
    90,
    /déforme le bras/i,
    /identique.*numéro 2/i,
  ],
  [
    "rowing-barre-ez-supination-buste-penche",
    "1793801178290.mp4",
    "65578aca4e4de125c3d4f229f2f7e06abea93e533e24fe4caa36aa6b0204a331",
    4,
    "8-10",
    "3010",
    75,
    /supination/i,
    /buste se relève/i,
  ],
];

test("dos #05 et #09 à #13 : sources, consignes, programmation et GIF", () => {
  for (const [
    id,
    source,
    hash,
    sets,
    reps,
    tempo,
    rest,
    cue,
    notice,
  ] of cases) {
    const e = EXERCISES.find((x) => x.id === id && x.muscle === "dos");
    assert.ok(e, id);
    assert.deepEqual(
      [e.defaultSets, e.repScheme, e.tempo, e.rest],
      [sets, reps, tempo, rest],
    );
    const v = videoFor(e);
    assert.equal(v.status, "coached");
    assert.match(v.coaching.notice, notice);
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
  assert.equal(sha("../1793766716767.mp4"), sha("../1793528285602.mp4"));
  assert.equal(sha("../1793800965600.mp4"), sha("../1793362391793.mp4"));
});
