// Garde-fous de la bibliothèque de démonstrations vidéo 3D.
// Ces tests vérifient l'association exercice ↔ vidéo sans dépendre d'un
// navigateur : manifeste, fichiers présents, identifiants réels du catalogue,
// taille raisonnable et repli garanti quand aucune vidéo n'est validée.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { EXERCISES, EXERCISE_MAP } from "../src/data/library.js";
import {
  VIDEO_MANIFEST,
  demoVideoFor,
  validatedVideoCount,
  VIDEO_BASE,
} from "../src/engine/demo-video.js";

const PUBLIC = path.resolve(import.meta.dirname, "..", "public");
const fileFor = (p) => path.join(PUBLIC, p.replace(/^\//, ""));

test("chaque vidéo validée correspond à un exercice réel du catalogue", () => {
  for (const video of VIDEO_MANIFEST.videos) {
    assert.ok(
      EXERCISE_MAP[video.exerciseId],
      `exercice inconnu : ${video.exerciseId}`,
    );
    assert.equal(
      EXERCISE_MAP[video.exerciseId].name,
      video.exerciseName,
      "le nom affiché doit être le nom exact du catalogue",
    );
    assert.equal(EXERCISE_MAP[video.exerciseId].muscle, video.muscle);
  }
});

test("les fichiers vidéo et affiches existent et restent légers", () => {
  for (const video of VIDEO_MANIFEST.videos) {
    const mp4 = fileFor(VIDEO_BASE + video.file);
    assert.ok(fs.existsSync(mp4), `fichier manquant : ${mp4}`);
    const size = fs.statSync(mp4).size;
    assert.ok(size > 50_000, "vidéo suspiciously small");
    assert.ok(size < 8 * 1024 * 1024, `vidéo trop lourde pour le dépôt : ${size}`);
    if (video.poster) {
      const jpg = fileFor(VIDEO_BASE + video.poster);
      assert.ok(fs.existsSync(jpg), `affiche manquante : ${jpg}`);
      assert.ok(fs.statSync(jpg).size < 600 * 1024);
    }
  }
});

test("seules les vidéos validées sont servies", () => {
  const validated = VIDEO_MANIFEST.videos.filter((v) => v.validated === true);
  assert.equal(validatedVideoCount(), validated.length);
  for (const video of VIDEO_MANIFEST.videos) {
    const ex = EXERCISE_MAP[video.exerciseId];
    const served = demoVideoFor(ex);
    if (video.validated === true) {
      assert.ok(served, `vidéo validée non servie : ${video.exerciseId}`);
      assert.equal(served.path, VIDEO_BASE + video.file);
      assert.equal(served.posterPath, VIDEO_BASE + video.poster);
    }
  }
});

test("aucune vidéo inventée : repli null pour les autres exercices", () => {
  const covered = new Set(
    VIDEO_MANIFEST.videos.filter((v) => v.validated).map((v) => v.exerciseId),
  );
  const others = EXERCISES.filter((e) => !covered.has(e.id));
  assert.ok(others.length > 0);
  for (const ex of others) assert.equal(demoVideoFor(ex), null);
  assert.equal(demoVideoFor(null), null);
  assert.equal(demoVideoFor({ id: "exercice-inexistant" }), null);
});

test("le manifeste décrit les contrôles visuels exigés", () => {
  const v = VIDEO_MANIFEST.videos.find(
    (x) => x.exerciseId === "extension-triceps-a-la-poulie",
  );
  assert.ok(v, "l'exercice pilote doit être présent");
  for (const key of [
    "exerciseMatch",
    "jointsConsistent",
    "equipmentPath",
    "noMajorDeformation",
    "musclesVisible",
    "continuousMotion",
  ])
    assert.equal(v.validation[key], true, `contrôle manquant : ${key}`);
  assert.ok(v.views.length >= 2, "au moins deux angles de vue");
});
