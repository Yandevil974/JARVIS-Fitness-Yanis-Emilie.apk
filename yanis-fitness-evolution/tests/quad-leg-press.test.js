import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {EXERCISES} from "../src/data/library.js";
import {videoFor} from "../src/data/exercise-videos.js";
const sha=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
test("leg press bilatéral : clip provisoire, correction et GIF conservé",()=>{
 const ex=EXERCISES.find(e=>e.id==="leg-press"),v=videoFor(ex);
 assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[5,"10-12","3010",60,"/media/d7bd0092279c8789.gif"]);
 assert.equal(v.status,"coached");assert.match(v.coaching.notice,/partiellement coupée/);assert.match(v.coaching.notice,/doit être refaite/);
 assert.match(v.coaching.spoken,/quatre-vingt-dix degrés/);
 assert.equal(v.src,"/videos/leg-press.mp4");
 const expected="df46c05019813a0c841335aafd9f75e34dbd18c1e1e87a1bdd72834d4e9f3839";
 assert.equal(sha("../1794474946777.mp4"),expected);assert.equal(sha("public"+v.src),expected);assert.equal(sha("release"+v.src),expected);
 assert.equal(sha("public"+v.poster),sha("release"+v.poster));assert.equal(sha("public"+ex.gif),sha("release"+ex.gif));
 assert.equal(videoFor("leg-press-unilateral"),null);assert.equal(videoFor("presse-a-cuisses-pieds-hauts"),null);
});
