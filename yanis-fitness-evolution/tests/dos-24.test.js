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

test("dos #24 : source acceptée, copies, GIF, voix prudente et programmation", () => {
  const hash =
    "0466ffefd32052cec304f4b114150f1bca74ef032023f865772983d0da4905de";
  const e = EXERCISES.find(
    (x) => x.id === "pullover-haltere-plat" && x.muscle === "dos",
  );
  assert.ok(e);
  assert.deepEqual(
    [e.defaultSets, e.repScheme, e.tempo, e.rest],
    [3, "12-15", "3010", 60],
  );
  const v = videoFor(e);
  assert.equal(v.status, "coached");
  assert.match(v.coaching.notice, /ne descend pas nettement derrière la tête/i);
  assert.match(v.coaching.notice, /ne forcez jamais/i);
  assert.match(
    v.coaching.spoken,
    /sans chercher à toucher le sol ni forcer la mobilité/i,
  );
  assert.match(v.coaching.spoken, /arrêtez avant toute douleur/i);
  assert.match(
    exerciseIntroCue(e, null).text,
    /sans chercher à toucher le sol ni forcer la mobilité/i,
  );
  assert.equal(sha("../1794023643714.mp4"), hash);
  for (const base of ["public", "release"]) {
    assert.equal(sha(`${base}${v.src}`), hash);
    assert.ok(existsSync(file(`${base}${v.poster}`)));
    assert.ok(existsSync(file(`${base}${e.gif}`)));
  }
  assert.equal(sha(`public${v.poster}`), sha(`release${v.poster}`));
  const dos = EXERCISES.filter((x) => x.muscle === "dos");
  assert.equal(dos.length, 25);
  assert.deepEqual(
    dos.filter((x) => !videoFor(x)).map((x) => x.id),
    [],
  );
});
