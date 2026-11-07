import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue, techniqueCue } from "../src/engine/voice-coach.js";
const path = name => fileURLToPath(new URL(`../${name}`, import.meta.url));
const hash = name => createHash("sha256").update(readFileSync(path(name))).digest("hex");

test("épaules #16 réutilise la vidéo #02, avec programme, GIF et voix propres", () => {
  const e = EXERCISES.find(x => x.id === "elevations-laterales");
  const old = EXERCISES.find(x => x.id === "elevations-laterales-halteres");
  assert.deepEqual([e.defaultSets, e.repScheme, e.tempo, e.rest, e.gif, e.equipment], [3, "8-10", "3010", 60, "/media/8f4f4491bc6c575d.gif", ["bodyweight"]]);
  const v = videoFor(e), original = videoFor(old);
  assert.equal(v.status, "coached");
  assert.equal(v.src, original.src);
  assert.equal(v.poster, original.poster);
  assert.match(v.coaching.notice, /mains et les charges sont peu lisibles/i);
  assert.match(v.coaching.spoken, /trois séries de huit à dix répétitions, soixante secondes de repos/i);
  assert.match(exerciseIntroCue(e, null).text, /tempo 3010/i);
  assert.match(techniqueCue(e, null).text, /trois secondes/i);
  assert.match(original.coaching.spoken, /quinze répétitions, quarante-cinq secondes de repos/i);
  const expected = "468b595c00e0f29072990ccc9a44daa538a7e235e56d86986e7359c6fc0d2f55";
  assert.equal(hash("../1794028540590.mp4"), expected);
  for (const base of ["public", "release"]) {
    assert.equal(hash(`${base}${v.src}`), expected);
    assert.ok(existsSync(path(`${base}${e.gif}`)));
    assert.ok(existsSync(path(`${base}${v.poster}`)));
  }
});
