import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue, techniqueCue } from "../src/engine/voice-coach.js";

const path = name => fileURLToPath(new URL(`../${name}`, import.meta.url));
const sha = name => createHash("sha256").update(readFileSync(path(name))).digest("hex");
const cases = [
  ["developpe-militaire-debout", "1794047497513.mp4", "e9c1a17104b0b811a8d388480121637653747a6751764121920a0be8a93ef913", 5, "5-7", "4210", 90, /pause en bas/i, /quatre secondes jusqu'à une hauteur confortable au menton/i, "/media/961917e9b811d034.gif"],
  ["developpe-halteres-assis", "1794047509779.mp4", "2c4bf39173027229bc62c3dc0dfeb8f4dd41ed1c97a052c0fb3bfa7725042963", 4, "6-8", "4010", 90, /pause en haut/i, /redescendez en quatre secondes/i, "/media/f6db6170a201743a.gif"],
  ["elevations-laterales-incline-30", "1794047517947.mp4", "a4e5c67765fd84fcb3241e1d72a65ca577a68d0591dbfd1a0e2deba682907710", 3, "8-10", "3010", 60, /identique à celle de l'épaule 12/i, /trois séries de huit à dix répétitions/i, "/media/e169d622c8002b38.gif"],
];

test("épaules #10, #13 et #14 : sources déposées, copies, GIF, programme et consignes", () => {
  for (const [id, source, hash, sets, reps, tempo, rest, notice, spoken, gif] of cases) {
    const e = EXERCISES.find(x => x.id === id);
    assert.ok(e, id);
    assert.deepEqual([e.defaultSets, e.repScheme, e.tempo, e.rest, e.gif], [sets, reps, tempo, rest, gif]);
    const v = videoFor(e);
    assert.equal(v.status, "coached");
    assert.match(v.coaching.notice, notice);
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
  assert.equal(sha("public/videos/elevations-laterales-incline-30.mp4"), sha("public/videos/elevations-laterales-incline-30-face-au-banc.mp4"));
});
