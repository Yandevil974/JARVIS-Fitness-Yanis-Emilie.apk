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
  ["elevations-laterales-halteres-myo-reps", "1794043767983.mp4", "d9714df14b91e0364c8de2087573cd4ea0915e05e8483310f2043cef668237fc", 3, "12-15 + myo", "2011", 45, /buste penché/i, /Ne reproduisez pas cette inclinaison/i],
  ["developpe-militaire-halteres-assis-test-3-5-reps", "1794043874637.mp4", "36b8de7fcac4de278220161659ec9bcee2967cf23583f06362e49db528769ffe", 4, "3-5", "2011", 150, /partiellement du cadre/i, /Quatre séries de trois à cinq/i],
  ["elevations-laterales-assises", "1794044094242.mp4", "6e1263372b61e7904914003c33a2a4ec1676ab1adb4dfa6a98834288961feb01", 4, "8-10", "3010", 60, /fléchit fortement les coudes/i, /Quatre séries de huit à dix/i],
  ["elevations-laterales-assises-variante", "1794044161778.mp4", "88ba59dded34db30150d0b333fc96cd21c3b2c804e08fffaeee7bb0db9a0242d", 4, "10-12", "3010", 60, /pause en haut/i, /Quatre séries de dix à douze/i],
];

test("épaules #05 à #08 : sources exactes, programmation, GIF et voix correctives", () => {
  for (const [id, source, hash, sets, reps, tempo, rest, notice, spoken] of cases) {
    const ex = EXERCISES.find((e) => e.id === id);
    assert.ok(ex, id);
    assert.deepEqual([ex.defaultSets, ex.repScheme, ex.tempo, ex.rest], [sets, reps, tempo, rest]);
    const video = videoFor(ex);
    assert.equal(video.status, "coached");
    assert.match(video.coaching.notice, notice);
    assert.match(video.coaching.spoken, spoken);
    assert.match(exerciseIntroCue(ex, null).text, spoken);
    assert.match(techniqueCue(ex, null).text, spoken);
    assert.equal(sha(`../${source}`), hash);
    for (const base of ["public", "release"]) {
      assert.equal(sha(`${base}${video.src}`), hash);
      assert.ok(existsSync(path(`${base}${video.poster}`)));
      assert.ok(existsSync(path(`${base}${ex.gif}`)));
    }
    assert.equal(sha(`public${video.poster}`), sha(`release${video.poster}`));
  }
  // Sources #01 et #06 identiques (fichier redéposé), fiches distinctes.
  assert.equal(sha("../1794043874637.mp4"), sha("../1794029524905.mp4"));
  assert.equal(videoFor("elevations-laterales-halteres-myo-reps").avoidSilentPreview, true);
  assert.notEqual(cases[2][2], cases[3][2]);
});
