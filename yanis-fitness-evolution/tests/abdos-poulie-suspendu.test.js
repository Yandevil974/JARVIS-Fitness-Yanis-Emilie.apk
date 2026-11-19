import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const cases = [
  {
    source: "1795093830394", input: "../1795093830394.mp4",
    hash: "f6821d2afe880816da71949ef2161999c16ef97d259e3bb23200b17ca48967af",
    src: "/videos/crunch-poulie-corde.mp4",
    poster: "/videos/posters/crunch-poulie-corde.jpg",
    ids: ["crunch-a-la-poulie", "crunch-a-la-poulie-ou-au-sol"],
    notice: /prise des mains est peu lisible|prise est peu lisible/,
  },
  {
    source: "1795094147317", input: "../1795094147317.mp4",
    hash: "f739ea0f5ee183e89f04372e4e7e56c42e40c1e4366873a00a359240653b8750",
    src: "/videos/releves-jambes-suspendu.mp4",
    poster: "/videos/posters/releves-jambes-suspendu.jpg",
    ids: ["releves-de-jambes-suspendu"],
    notice: /fixation complète n'est pas vérifiable/,
  },
];
test("abdos : clips de poulie et suspendu intacts, accompagnés, GIF conservés", () => {
  assert.equal(sha(cases[0].input), cases[0].hash);
  assert.equal(sha(cases[1].input), cases[1].hash);
  for (const c of cases) {
    assert.equal(sha("public" + c.src), c.hash, c.src);
    assert.equal(sha("release" + c.src), c.hash, c.src);
    assert.equal(sha("public" + c.poster), sha("release" + c.poster));
    for (const id of c.ids) {
      const ex = EXERCISES.find((e) => e.id === id);
      assert.ok(ex, id);
      const v = videoFor(ex);
      assert.equal(v.src, c.src, id);
      assert.equal(v.status, "coached", id);
      assert.equal(v.avoidSilentPreview, true, id);
      assert.match(v.coaching.notice, c.notice, id);
      assert.ok(v.coaching.spoken, id);
      // GIF d'origine conservé et identique dans les deux dossiers.
      assert.ok(ex.gif, id);
      assert.equal(sha("public" + ex.gif), sha("release" + ex.gif), id);
    }
  }
  assert.notEqual(videoFor("crunch-a-la-poulie").src, videoFor("releves-de-jambes-suspendu").src);
  // Prescriptions source intactes.
  const crunch = EXERCISES.find((e) => e.id === "crunch-a-la-poulie");
  assert.deepEqual([crunch.defaultSets, crunch.repScheme, crunch.rest, crunch.gif], [3, "15", 45, "/media/2c9a6633b3c5c687.gif"]);
  const susp = EXERCISES.find((e) => e.id === "releves-de-jambes-suspendu");
  assert.deepEqual([susp.defaultSets, susp.repScheme, susp.rest, susp.gif], [4, "8-10", 75, "/media/73207adea6ee540f.gif"]);
  assert.match(videoFor(susp).coaching.spoken, /genoux légèrement souples/);
  // La planche et les relevés allongés n'ont pas encore de clip : pas de partage abusif.
  for (const id of ["gainage-planche", "releves-de-jambes-allonge", "releves-de-jambes-allongee"]) {
    assert.equal(videoFor(id), null, id);
  }
});
