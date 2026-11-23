import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const cases = [
  { input: "../1795361931971.mp4", hash: "752d1307cc2a7c1006259ef5a95c984a26df67a42765fee148603d0f610ce54f", id: "releves-de-jambes-incline", src: "/videos/releves-jambes-incline.mp4", gif: "/media/04baa4392f5b1f22.gif", notice: /se confondent presque/, prescription: [4, "10-12", 90] },
  { input: "../1795361951144.mp4", hash: "8dcdbbee822feaf1292eed68223395fef7f3bd5957b3b42aba5dc257e8885804", id: "crunch-sur-swiss-ball", src: "/videos/crunch-sur-swiss-ball.mp4", gif: "/media/74feda7869f70e9d.gif", notice: /position conforme/, prescription: [3, "15-20", null] },
  { input: "../1795362341834.mp4", hash: "c1177701c78e9af177fd50952f7137eb7efdcd01b4995361e1983428d015df17", id: "jackknife-sur-swiss-ball", src: "/videos/jackknife-sur-swiss-ball.mp4", gif: "/media/74feda7869f70e9d.gif", notice: /très haut/, prescription: [3, "10-12", null] },
  { input: "../1795429485813.mp4", hash: "f3c0232b8b8406e4b02c9c7ec5bf3b36bd8655dd44a5a9718ff4e442efc0d1de", id: "wood-chop-poulie-haute", src: "/videos/wood-chop-poulie-haute.mp4", gif: "/media/9b353c570b841963.gif", notice: /hauteur de poitrine/, prescription: [3, "10-12", null] },
];
test("abdos : banc incliné, swiss ball, jackknife et wood chop intacts, accompagnés, GIF conservés", () => {
  for (const c of cases) {
    assert.equal(sha(c.input), c.hash, c.input);
    assert.equal(sha("public" + c.src), c.hash, c.src);
    assert.equal(sha("release" + c.src), c.hash, c.src);
    assert.equal(sha("public" + c.src.replace(".mp4", "").replace("/videos/", "/videos/posters/") + ".jpg"), sha("release" + c.src.replace(".mp4", "").replace("/videos/", "/videos/posters/") + ".jpg"));
    const ex = EXERCISES.find((e) => e.id === c.id);
    assert.ok(ex, c.id);
    const v = videoFor(ex);
    assert.equal(v.src, c.src, c.id);
    assert.equal(v.status, "coached", c.id);
    assert.equal(v.avoidSilentPreview, true, c.id);
    assert.match(v.coaching.notice, c.notice, c.id);
    assert.ok(v.coaching.spoken && v.coaching.handCue && v.coaching.movementCue, c.id);
    assert.equal(ex.defaultSets, c.prescription[0], c.id);
    assert.equal(ex.repScheme, c.prescription[1], c.id);
    if (c.prescription[2] !== null) assert.equal(ex.rest, c.prescription[2], c.id);
    assert.equal(ex.gif, c.gif, c.id);
    assert.equal(sha("public" + ex.gif), sha("release" + ex.gif), c.id);
  }
  // Le wood chop de la vidéo n'est pas une poulie haute classique : ne pas partager
  // son clip avec d'autres tirages, et laisser les autres abdos sur leur GIF.
  for (const id of ["gainage-planche", "releves-de-jambes-allonge", "circuit-gainage-planche-lateral-bird-dog"]) {
    assert.equal(videoFor(id), null, id);
  }
});
