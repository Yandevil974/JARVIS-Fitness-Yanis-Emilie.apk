import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { stepVideoFor } from "../src/data/step-videos.js";
import { RECOVERY_EXERCISES, stretchImage } from "../src/data/library.js";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const cases = [
  { names: ["Cobra doux", "Étirement du cobra"], input: "../1794538146321.mp4", src: "/videos/stretch-cobra.mp4", hash: "7093520edf1c8cce09196d955fbdffa82186a07e0fd20f3f643ffcd805da9b6e", gif: "/media/1651c3bb2dc4e3b0.gif", warning: /bassin.*décoller/i },
  { names: ["Position de l'enfant", "Position de l’enfant (Balasana)"], input: "../1794538173737.mp4", src: "/videos/stretch-enfant.mp4", hash: "22257607df88f4e52d3f96a7f8b91c8830d2caf440df94c4843b4539946b6bb1", gif: "/media/ca55d85fe63748ff.gif", warning: /sans forcer/i },
  { names: ["Talon vers la fesse (debout)"], input: "../1794538209702.mp4", src: "/videos/stretch-quadriceps-debout.mp4", hash: "8a68c9bb15d137602c3ad1812313421c777c8533e9205601777fe36c1f65bca0", gif: "/media/56815335e3345463.gif", warning: /deux côtés/i },
];
test("les trois vidéos d'étirements sont intactes, accompagnées et partagées seulement entre gestes identiques", () => {
  for (const c of cases) {
    const v = stepVideoFor(c.names[0]);
    assert.equal(v.status, "coached");
    assert.equal(v.src, c.src);
    assert.match(v.coaching.notice, c.warning);
    assert.ok(v.coaching.spoken);
    for (const name of c.names) {
      assert.equal(stepVideoFor(name), v);
      const ex = RECOVERY_EXERCISES.find(e => e.name.replaceAll('’', "'") === name.replaceAll('’', "'"));
      assert.ok(ex, name);
      for (const profile of ["elite", "emilie"]) assert.equal(stretchImage(ex, profile), c.gif);
    }
    for (const path of [c.input, "public" + c.src, "release" + c.src]) assert.equal(sha(path), c.hash, path);
    assert.equal(sha("public" + v.poster), sha("release" + v.poster));
    assert.equal(sha("public" + c.gif), sha("release" + c.gif));
  }
  assert.equal(stepVideoFor("Étirement contre le mur"), null);
  assert.equal(stepVideoFor("Respiration diaphragmatique allongée"), null);
  assert.notEqual(stepVideoFor("Cobra doux").src, stepVideoFor("Position de l'enfant").src);
});
