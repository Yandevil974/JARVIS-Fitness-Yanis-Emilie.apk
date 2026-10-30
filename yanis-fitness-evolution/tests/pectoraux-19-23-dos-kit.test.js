import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { exerciseIntroCue } from "../src/engine/voice-coach.js";

const asset = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const hash = (path) =>
  createHash("sha256")
    .update(readFileSync(asset(path)))
    .digest("hex");
const chest = [
  [
    "cables-croises-rotation-externe",
    "1793342522096.mp4",
    "a2c1a2a6fd72d4b35839cde9962cbffb87080daa11bda6b881db848e6324c3b0",
    /rotation externe/i,
  ],
  [
    "developpe-couche-plat-inertie-depuis-les-pins",
    "1793342895653.mp4",
    "67f05fd70e0b69c1d449c56a1770c6bb342c46d5fd8297b2fe6ffd2481f4a35e",
    /deux pins/i,
  ],
  [
    "developpe-couche-barre",
    "1793343077279.mp4",
    "de0cd5fc9ac91d055c8215f0f99fe522e2165de4ff8d39224e798872b975bf28",
    /prise standard/i,
  ],
  [
    "developpe-couche-test-1rm",
    "1793343306601.mp4",
    "59412a10eaaec743a2976050d9d6d1cce8a6c38690e531861173e43f0bc8fc5e",
    /pareur/i,
  ],
  [
    "pompes",
    "1793343560636.mp4",
    "b75b555c60519a8fd874cdce4eaf69ed2b755da1bde99433abf29fdb00f9eca0",
    /alignés/i,
  ],
];

test("pectoraux déposés : cinq vidéos accompagnées distinctes dans le lot et GIF conservés", () => {
  for (const [id, source, sha, cue] of chest) {
    const e = EXERCISES.find((item) => item.id === id && item.muscle === "pec");
    assert.ok(e, id);
    const video = videoFor(e);
    assert.equal(video?.status, "coached", id);
    assert.match(video.coaching.spoken + video.coaching.movementCue, cue);
    assert.ok(video.coaching.notice && video.coaching.spoken, id);
    assert.match(exerciseIntroCue(e, null).text, cue);
    assert.equal(hash(`../${source}`), sha);
    for (const folder of ["public", "release"]) {
      assert.equal(hash(`${folder}${video.src}`), sha, `${folder}: ${id}`);
      assert.ok(existsSync(asset(`${folder}${video.poster}`)), id);
      assert.ok(existsSync(asset(`${folder}${e.gif}`)), id);
    }
    assert.equal(hash(`public${video.poster}`), hash(`release${video.poster}`));
  }
  assert.equal(new Set(chest.map((item) => item[2])).size, chest.length);
});

test("pectoraux #21 : doublon P11/T10 explicitement signalé et corrigé", () => {
  const e = EXERCISES.find(
    (item) => item.id === "developpe-couche-barre" && item.muscle === "pec",
  );
  assert.ok(e);
  const video = videoFor(e);
  assert.equal(video.status, "coached");
  assert.match(video.coaching.notice, /identique.*#11.*#10/i);
  assert.match(video.coaching.spoken, /prise rapprochée/i);
  assert.match(video.coaching.spoken, /prise standard/i);
  assert.equal(hash("../1793343077279.mp4"), hash("../1793268156130.mp4"));
  assert.equal(hash("../1793343077279.mp4"), hash("../1792939358423.mp4"));
  for (const folder of ["public", "release"])
    assert.ok(existsSync(asset(`${folder}${e.gif}`)));
});

test("pectoraux #19 à #23 : programmation du catalogue préservée", () => {
  const rows = EXERCISES.filter((e) => e.muscle === "pec").slice(18, 23);
  const expected = [
    [
      "cables-croises-rotation-externe",
      3,
      "12-15",
      "3010",
      60,
      "/media/09395898bff010e6.gif",
    ],
    [
      "developpe-couche-plat-inertie-depuis-les-pins",
      5,
      "6-8",
      "4010",
      120,
      "/media/a73949925ba1c2fd.gif",
    ],
    [
      "developpe-couche-barre",
      3,
      "8-10",
      "3010",
      120,
      "/media/acbab53a64c18aab.gif",
    ],
    [
      "developpe-couche-test-1rm",
      5,
      "1-5",
      "4010",
      180,
      "/media/bcaf491c4edff6de.gif",
    ],
    ["pompes", 3, "8-15", "3010", 90, "/media/8a1cd56aeaf90580.gif"],
  ];
  assert.equal(rows.length, expected.length);
  rows.forEach((e, i) =>
    assert.deepEqual(
      [e.id, e.defaultSets, e.repScheme, e.tempo, e.rest, e.gif],
      expected[i],
    ),
  );
});

test("consignes des pins de travail et de la sécurité 1RM distinctes", () => {
  const pins = videoFor(
    "developpe-couche-plat-inertie-depuis-les-pins",
  ).coaching;
  const max = videoFor("developpe-couche-test-1rm").coaching;
  assert.match(pins.spoken, /supportée par les deux pins/i);
  assert.match(pins.spoken, /pause complète/i);
  assert.match(max.spoken, /en cas d'échec/i);
  assert.match(
    max.spoken,
    /ne portent pas la barre pendant une répétition réussie/i,
  );
  assert.match(
    max.spoken,
    /sans dispositif sûr, ne faites pas de test maximal/i,
  );
});

test("dos #01 à #05 : programmation et GIF conservés, quatre vidéos accompagnées", () => {
  const rows = EXERCISES.filter((e) => e.muscle === "dos").slice(0, 5);
  const expected = [
    ["tirage-vertical-prise-neutre", 3, "12-15", 75],
    ["rowing-haltere-un-bras", 3, "12/côté", 60],
    ["tirage-horizontal-a-la-poulie", 3, "12", 75],
    ["tirage-vertical-prise-large", 4, "10-12", 90],
    ["rowing-barre-buste-penche", 3, "10-12", 90],
  ];
  assert.equal(rows.length, expected.length);
  rows.forEach((e, i) => {
    assert.deepEqual([e.id, e.defaultSets, e.repScheme, e.rest], expected[i]);
    assert.equal(e.tempo, "2011");
    if (i < 4) assert.equal(videoFor(e)?.status, "coached");
    else assert.equal(videoFor(e), null);
    for (const folder of ["public", "release"])
      assert.ok(existsSync(asset(`${folder}${e.gif}`)));
  });
});
