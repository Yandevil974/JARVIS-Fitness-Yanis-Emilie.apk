import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";

const hash = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
test("la vidéo reçue couvre seulement le split squat barre pied avant surélevé", () => {
  const ex = EXERCISES.find((e) => e.id === "split-squat-barbell-pied-avant-sureleve");
  const v = videoFor(ex);
  assert.equal(ex.gif, "/media/e2092a9d98b64a54.gif");
  assert.equal(ex.tempo, "3210");
  assert.equal(ex.defaultSets, 4);
  assert.equal(ex.repScheme, "7-9");
  assert.equal(ex.rest, 90);
  assert.equal(v.status, "coached");
  assert.match(v.coaching.notice, /pause complète de deux secondes/);
  assert.match(v.coaching.spoken, /trapèzes/);
  assert.equal(v.src, "/videos/split-squat-barbell-pied-avant-sureleve.mp4");
  const expected = "39e3d51ac79cbd39d550ae3499ea68106cbbfc4e50e39c10cd9b5dfe472819e4";
  assert.equal(hash("../1794459738949.mp4"), expected);
  assert.equal(hash("public" + v.src), expected);
  assert.equal(hash("release" + v.src), expected);
  assert.equal(hash("public" + v.poster), hash("release" + v.poster));
  assert.equal(hash("public" + ex.gif), hash("release" + ex.gif));
  assert.equal(videoFor("fentes-barre"), null);
  assert.equal(videoFor("fentes-bulgares-halteres-pied-avant-sureleve"), null);
});
