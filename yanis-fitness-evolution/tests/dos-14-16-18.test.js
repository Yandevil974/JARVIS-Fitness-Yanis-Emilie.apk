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
const sources = [
  [
    "tractions-supination-chin-up",
    "1793978523009.mp4",
    "f025311d69ba5e3a197e2f0274811f816dd5c654d986f81cf1a5f674753ac38b",
    5,
    "6,6,6,8,8",
    "4010",
    90,
    /deux bras de façon symétrique/i,
    /supination n'est pas nettement vérifiable/i,
  ],
  [
    "rowing-assis-etirement",
    "1793976101827.mp4",
    "61df379deb9fb79ff2a27fca2baf47a10e130a20762ece905ca419d2aa98b1a1",
    4,
    "10/8/6",
    "3010",
    75,
    /étirement confortable/i,
    /étirement complet/i,
  ],
  [
    "rowing-haltere-buste-penche",
    "1793977380187.mp4",
    "0be6f1e548be10012650822c2f5897797126e62d6f0d6a15af0cb172a737aee9",
    5,
    "8-10",
    "3010",
    120,
    /coudes dirigés vers l'arrière et les hanches/i,
    /écarte les coudes/i,
  ],
  [
    "tractions-prise-large",
    "1793975208310.mp4",
    "7a5b49a949ec06ffe8d25d0086ec777aa35e50e163c8ed5b5c4c3c8f30de00f5",
    6,
    "8,8,6,6,4,4",
    "4010",
    120,
    /sans tirer derrière la nuque/i,
    /menton/i,
  ],
  [
    "rowing-assis-au-cou",
    "1793975505590.mp4",
    "08dc196321ba74b51aa65f573a1902b05bb77e8463f5b25e36a4f0604f7b6383",
    5,
    "6-8",
    "3011",
    60,
    /arrêtez et choisissez un tirage devant/i,
    /arrêtez en cas de douleur/i,
  ],
];

test("dos #14 à #18 : sources distinctes, copies, GIF, consignes et programmation", () => {
  assert.equal(new Set(sources.map((s) => s[2])).size, 5);
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
  ] of sources) {
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
});
