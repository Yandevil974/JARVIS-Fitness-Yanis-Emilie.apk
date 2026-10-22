import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISE_VIDEOS, videoFor } from "../src/data/exercise-videos.js";
import {
  STEP_VIDEOS,
  WARMUP_OVERVIEW,
  stepVideoFor,
} from "../src/data/step-videos.js";

function publicAssetExists(src) {
  return existsSync(fileURLToPath(new URL(`../public${src}`, import.meta.url)));
}

test("chaque vidéo d'exercice validée et chaque poster sont présents", () => {
  const entries = Object.entries(EXERCISE_VIDEOS);
  assert.ok(entries.length >= 10);
  for (const [id, video] of entries) {
    assert.ok(publicAssetExists(video.poster), `poster absent : ${id}`);
    if (video.status === "validated") {
      assert.ok(publicAssetExists(video.src), `vidéo absente : ${id}`);
      assert.equal(videoFor(id), video);
    } else {
      assert.equal(videoFor(id), null);
    }
  }
});

test("biceps #02 et #09 restent verrouillés avant validation de Yanis", () => {
  assert.equal(
    EXERCISE_VIDEOS["curl-scott-barre-ez-pronation"].status,
    "disabled",
  );
  assert.equal(
    EXERCISE_VIDEOS["curl-haltere-supination-banc-scott-90"].status,
    "pending",
  );
  assert.equal(videoFor("curl-scott-barre-ez-pronation"), null);
  assert.equal(videoFor("curl-haltere-supination-banc-scott-90"), null);
});

test("les cinq vidéos de l'échauffement test7 et l'aperçu sont intégrés", () => {
  for (const name of [
    "Mise en route",
    "Mobilité des épaules",
    "Mobilité hanches & chevilles",
    "Activation fessiers",
    "Activation scapulaire",
  ]) {
    const video = stepVideoFor(name);
    assert.ok(video, `association absente : ${name}`);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${name}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${name}`);
  }
  assert.equal(Object.keys(STEP_VIDEOS).length, 5);
  assert.ok(publicAssetExists(WARMUP_OVERVIEW.src));
  assert.ok(publicAssetExists(WARMUP_OVERVIEW.poster));
});
