import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const cases = [
  {
    input: "../1795251606287.mp4",
    hash: "5e0ea73840eb2bc4d17f8d3d8f2108f31b013e8520614b3b536038d0a905e0de",
    id: "ab-wheel-roulette",
    src: "/videos/ab-wheel-roulette.mp4",
    poster: "/videos/posters/ab-wheel-roulette.jpg",
    gif: "/media/95021dba5e760d1a.gif",
    notice: /bassin paraît haut/,
    prescription: [4, "10-12", 75],
  },
  {
    input: "../1795251666008.mp4",
    hash: "8f2541d5ee0fdec93e0ee0f6af7f402b8f462d8a332e9b89c13f44785cb69ce8",
    id: "reverse-crunch",
    src: "/videos/reverse-crunch.mp4",
    poster: "/videos/posters/reverse-crunch.jpg",
    gif: "/media/74feda7869f70e9d.gif",
    notice: /bassin décolle nettement/,
    prescription: [3, "12", 45],
  },
];
test("abdos : roue et reverse crunch intacts, accompagnés, GIF et prescriptions conservés", () => {
  for (const c of cases) {
    assert.equal(sha(c.input), c.hash, c.input);
    assert.equal(sha("public" + c.src), c.hash, c.src);
    assert.equal(sha("release" + c.src), c.hash, c.src);
    assert.equal(sha("public" + c.poster), sha("release" + c.poster));
    const ex = EXERCISES.find((e) => e.id === c.id);
    assert.ok(ex, c.id);
    const v = videoFor(ex);
    assert.equal(v.src, c.src, c.id);
    assert.equal(v.status, "coached", c.id);
    assert.equal(v.avoidSilentPreview, true, c.id);
    assert.match(v.coaching.notice, c.notice, c.id);
    assert.ok(v.coaching.spoken, c.id);
    assert.deepEqual([ex.defaultSets, ex.repScheme, ex.rest], c.prescription, c.id);
    assert.equal(ex.gif, c.gif, c.id);
    assert.equal(sha("public" + ex.gif), sha("release" + ex.gif), c.id);
  }
  // Pas de partage abusif : les autres abdos sans clip restent sur leur GIF.
  for (const id of ["gainage-planche", "releves-de-jambes-allonge", "jackknife-sur-swiss-ball", "wood-chop-poulie-haute"]) {
    assert.equal(videoFor(id), null, id);
  }
});
