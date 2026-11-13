import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { stepVideoFor } from "../src/data/step-videos.js";
import { RECOVERY_EXERCISES, stretchImage } from "../src/data/library.js";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const cases = [
  { name: "Bras tendu contre la poitrine", source: "../1794556282614.mp4", src: "/videos/stretch-epaule-bras-croise.mp4", hash: "23870af7db027520385bd4200c284b0eef8b95cf91177d397f46856cc2e9bff9", gif: "/media/5b3aed6740b23734.gif" },
  { name: "Coude au-dessus de la tête", source: "../1794556473678.mp4", src: "/videos/stretch-triceps-coude.mp4", hash: "165cf3f104d444195caa49d110e6584dd5c2a2d30d648fd1871a75eb81afa769", gif: "/media/10da6a636b6c241f.gif" },
];
test("les deux étirements sont raccordés, accompagnés et les sources et GIF conservés", () => {
 for (const c of cases) {
  const v = stepVideoFor(c.name), ex = RECOVERY_EXERCISES.find(e => e.name === c.name);
  assert.ok(ex, c.name); assert.ok(v, c.name); assert.equal(v.status, "coached"); assert.equal(v.src, c.src);
  assert.match(v.coaching.notice, /deux côtés/); assert.match(v.coaching.spoken, /deux côtés/);
  for (const profile of ["elite", "emilie"]) assert.equal(stretchImage(ex, profile), c.gif);
  for (const file of [c.source, "public" + c.src, "release" + c.src]) assert.equal(sha(file), c.hash);
  assert.equal(sha("public" + v.poster), sha("release" + v.poster)); assert.equal(sha("public" + c.gif), sha("release" + c.gif));
 }
 assert.notEqual(stepVideoFor(cases[0].name).src, stepVideoFor(cases[1].name).src);
 assert.equal(stepVideoFor("Bras tendu devant, main tirée"), null);
 assert.equal(stepVideoFor("Main dans le dos"), null);
});
