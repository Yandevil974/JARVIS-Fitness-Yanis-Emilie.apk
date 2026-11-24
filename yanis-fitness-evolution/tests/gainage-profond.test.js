import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

const clips = [
  { input: "../1795531219861.mp4", hash: "991bb935a8867d1fd1ac66e0ef25117b6413dae1963751ed43ec4f56acf14cd1", src: "/videos/dead-bug.mp4" },
  { input: "../1795531238183.mp4", hash: "fd90ec80afb18c5b9577cbe0936e0b5c51974930d7d6733ca4f6e6d576588967", src: "/videos/gainage-lateral.mp4" },
  { input: "../1795531628525.mp4", hash: "f60b5ababcf01a6d3568e1ca3458f90ea65b7077d666044280fc535d1c84162d", src: "/videos/bird-dog.mp4" },
  { input: "../1795532157396.mp4", hash: "f97446716c2015ef53001b15f4c56d4f18cdfd1b261043b50a32bb77b9ee5f7e", src: "/videos/mountain-climbers.mp4" },
];

// Migration demandée : le pallof n'a pas été reçu en clip propre, il réutilise
// le clip poulie déjà accepté, avec une réserve écrite explicite.
const mapping = {
  "dead-bug": { src: "/videos/dead-bug.mp4", notice: /bas du dos doit rester collé/ },
  "dead-bug-avec-rotation": { src: "/videos/dead-bug.mp4", notice: /ne montre pas la rotation/ },
  "gainage-lateral": { src: "/videos/gainage-lateral.mp4", notice: /appui sur la main, bras tendu/ },
  "gainage-lateral-dynamique": { src: "/videos/gainage-lateral.mp4", notice: /maintien statique, pas la version dynamique/ },
  "bird-dog": { src: "/videos/bird-dog.mp4", notice: /dos se creuse/ },
  "mountain-climbers": { src: "/videos/mountain-climbers.mp4", notice: /hanches montent/ },
  "pallof-press-a-la-poulie": { src: "/videos/wood-chop-poulie-haute.mp4", notice: /tirage en arc de cercle/ },
  "pallof-press-a-l-elastique": { src: "/videos/wood-chop-poulie-haute.mp4", notice: /montre une poulie, pas un élastique/ },
};

test("gainage profond : 8 fiches couvertes, clips intacts, réserves écrites pour les variantes et le pallof", () => {
  for (const c of clips) {
    assert.equal(sha(c.input), c.hash, c.input);
    assert.equal(sha("public" + c.src), c.hash, c.src);
    assert.equal(sha("release" + c.src), c.hash, c.src);
  }
  for (const [id, expected] of Object.entries(mapping)) {
    const ex = EXERCISES.find((e) => e.id === id);
    assert.ok(ex, id);
    const v = videoFor(ex);
    assert.ok(v, id);
    assert.equal(v.src, expected.src, id);
    assert.equal(v.status, "coached", id);
    assert.equal(v.avoidSilentPreview, true, id);
    assert.match(v.coaching.notice, expected.notice, id);
    assert.ok(v.coaching.spoken, id);
    assert.ok(ex.gif, id);
  }
  // Une variante ne doit jamais être présentée sans réserve.
  for (const id of ["dead-bug-avec-rotation", "gainage-lateral-dynamique", "pallof-press-a-l-elastique"]) {
    assert.match(videoFor(id).coaching.notice, /vidéo/i, id);
  }
});
