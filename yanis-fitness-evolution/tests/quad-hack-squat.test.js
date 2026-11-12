import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";

const hash = p => createHash("sha256").update(readFileSync(p)).digest("hex");
test("hack squat : clip déposé, consigne corrective et GIF conservé", () => {
  const ex = EXERCISES.find(e => e.id === "hack-squat");
  const video = videoFor(ex);
  assert.equal(ex.gif, "/media/d7f9e6b6ba8a231b.gif");
  assert.equal(ex.tempo, "3010");
  assert.equal(ex.defaultSets, 4);
  assert.equal(ex.repScheme, "10/8/6");
  assert.equal(ex.rest, 90);
  assert.equal(video.status, "coached");
  assert.match(video.coaching.notice, /plus bas/);
  assert.match(video.coaching.spoken, /quatre-vingt-dix degrés/);
  assert.equal(video.src, "/videos/hack-squat.mp4");
  const original = "ea8aeb97237914e974c2b9d8b95c46a905cba9b279b2a821629f17f7b92ff65e";
  assert.equal(hash("../1794464417181.mp4"), original);
  assert.equal(hash("public" + video.src), original);
  assert.equal(hash("release" + video.src), original);
  assert.equal(hash("public" + video.poster), hash("release" + video.poster));
  assert.equal(hash("public" + ex.gif), hash("release" + ex.gif));
});
