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
  ["developpe-militaire-halteres-assis", "1794029524905.mp4", "36b8de7fcac4de278220161659ec9bcee2967cf23583f06362e49db528769ffe", "10-12", 75, /hors cadre/i, /sortent partiellement du cadre/i],
  ["elevations-laterales-halteres", "1794028540590.mp4", "468b595c00e0f29072990ccc9a44daa538a7e235e56d86986e7359c6fc0d2f55", "15", 45, /au-dessus de l'horizontale/i, /maximum jusqu'à la hauteur des épaules/i],
  ["face-pull-a-l-elastique", "1794028776811.mp4", "a067343915505928313299c6085a58c3d484530d8f60cffb392b5de1e3cd7522", "15", 45, /ancrage/i, /jamais autour des poignets/i],
  ["face-pull-a-la-poulie", "1794042930308.mp4", "bbfd719a5c2097035949aff9f6509ff53c2a4e901fe6df07e975e02452bca997", "15", 45, /redescendent vers le buste au retour/i, /Ne laissez pas les mains descendre/i],
];

test("épaules #01 à #04 : dépôts intacts, GIF, notices et consignes vocales", () => {
  assert.equal(new Set(cases.map((c) => c[2])).size, 4);
  for (const [id, source, hash, reps, rest, notice, spoken] of cases) {
    const exercise = EXERCISES.find((e) => e.id === id);
    assert.ok(exercise, id);
    assert.deepEqual([exercise.defaultSets, exercise.repScheme, exercise.tempo, exercise.rest], [3, reps, "2011", rest]);
    const video = videoFor(exercise);
    assert.equal(video.status, "coached", id);
    assert.match(video.coaching.notice, notice);
    assert.match(video.coaching.spoken, spoken);
    assert.match(exerciseIntroCue(exercise, null).text, spoken);
    assert.match(techniqueCue(exercise, null).text, spoken);
    assert.equal(sha(`../${source}`), hash);
    for (const base of ["public", "release"]) {
      assert.equal(sha(`${base}${video.src}`), hash);
      assert.ok(existsSync(path(`${base}${video.poster}`)));
      assert.ok(existsSync(path(`${base}${exercise.gif}`)));
    }
    assert.equal(sha(`public${video.poster}`), sha(`release${video.poster}`));
  }
  assert.equal(videoFor("face-pull-a-la-poulie").avoidSilentPreview, true);
  assert.equal(sha("../1794028207138.mp4"), "37b72b6627dea4a3d11ae08248e09ce66e3d3e0ea62762ef3c15d311e2c2df82");
  // Pas d'association implicite pour la variante myo-reps suivante.
  assert.equal(videoFor("elevations-laterales-halteres-myo-reps"), null);
});
