import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {EXERCISES} from "../src/data/library.js";
import {videoFor} from "../src/data/exercise-videos.js";
const sha=p=>createHash("sha256").update(readFileSync(p)).digest("hex");
test("presse unilatérale : clip intact, consignes propres et GIF conservé",()=>{
 const ex=EXERCISES.find(e=>e.id==="leg-press-unilateral"),v=videoFor(ex);
 assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[4,"10-12","3010",90,"/media/a4443a1008f6202b.gif"]);
 assert.equal(v.status,"coached");assert.match(v.coaching.notice,/jambe libre/);assert.match(v.coaching.spoken,/deux côtés/);
 assert.equal(v.src,"/videos/leg-press-unilateral.mp4");
 const expected="aea25d9b59dd7696bbc6f408b2306e58f58db0ddf6dc73fe8a7ca50666c627a3";
 assert.equal(sha("../1794475837084.mp4"),expected);assert.equal(sha("public"+v.src),expected);assert.equal(sha("release"+v.src),expected);
 assert.equal(sha("public"+v.poster),sha("release"+v.poster));assert.equal(sha("public"+ex.gif),sha("release"+ex.gif));
 assert.notEqual(videoFor("leg-press").src,v.src);assert.equal(videoFor("presse-a-cuisses-pieds-hauts"),null);
});
