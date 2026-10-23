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

test("chaque vidéo d'exercice activée et chaque poster sont présents", () => {
  const entries = Object.entries(EXERCISE_VIDEOS);
  assert.ok(entries.length >= 10);
  for (const [id, video] of entries) {
    assert.ok(publicAssetExists(video.poster), `poster absent : ${id}`);
    if (["validated", "coached"].includes(video.status)) {
      assert.ok(publicAssetExists(video.src), `vidéo absente : ${id}`);
      assert.equal(videoFor(id), video);
    } else {
      assert.equal(videoFor(id), null);
    }
  }
});

test("biceps #02 et #09 sont jouables avec correction audio, sans être validés", () => {
  for (const id of [
    "curl-scott-barre-ez-pronation",
    "curl-haltere-supination-banc-scott-90",
  ]) {
    const video = EXERCISE_VIDEOS[id];
    assert.equal(video.status, "coached");
    assert.equal(videoFor(id), video);
    assert.match(video.coaching.spoken, /paumes vers le sol/i);
    assert.match(video.coaching.spoken, /dos des mains vers le haut/i);
    assert.match(video.coaching.spoken, /poignets verrouillés/i);
    assert.match(video.coaching.spoken, /seulement les coudes/i);
    assert.match(video.coaching.notice, /ne reproduisez pas cette rotation/i);
  }
  assert.match(
    EXERCISE_VIDEOS["curl-scott-barre-ez-pronation"].coaching.spoken,
    /barre EZ/i,
  );
  assert.match(
    EXERCISE_VIDEOS["curl-haltere-supination-banc-scott-90"].coaching.spoken,
    /deux haltères/i,
  );
  assert.match(
    EXERCISE_VIDEOS["curl-haltere-supination-banc-scott-90"].coaching.spoken,
    /haltères horizontaux/i,
  );
});

test("biceps #10 et #12 sont intégrés comme vidéos validées", () => {
  for (const id of ["curl-scott-haltere-neutre", "curl-poulie-basse"]) {
    const video = EXERCISE_VIDEOS[id];
    assert.equal(video.status, "validated");
    assert.equal(videoFor(id), video);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${id}`);
  }
  assert.match(
    EXERCISE_VIDEOS["curl-scott-haltere-neutre"].label,
    /haltère neutre/i,
  );
  assert.match(EXERCISE_VIDEOS["curl-poulie-basse"].label, /poulie basse/i);
});

test("Zottman #11 et #13 sont jouables avec leur consigne corrective", () => {
  const cases = [
    {
      id: "curl-zottman-assis",
      equipment: /deux haltères/i,
      tempo: /trois secondes/i,
    },
    {
      id: "curl-zottman-un-bras-banc-scott",
      equipment: /une seule haltère/i,
      tempo: /quatre secondes/i,
    },
  ];
  for (const { id, equipment, tempo } of cases) {
    const video = EXERCISE_VIDEOS[id];
    assert.equal(video.status, "coached");
    assert.equal(videoFor(id), video);
    assert.match(video.coaching.spoken, equipment);
    assert.match(video.coaching.spoken, tempo);
    assert.match(video.coaching.spoken, /paumes? vers le sol/i);
    assert.match(video.coaching.spoken, /immobiles? en (bas|haut)/i);
    assert.match(video.coaching.spoken, /seulement (les coudes|le coude)/i);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i);
    assert.match(video.coaching.notice, /Vidéo IA accélérée/i);
  }
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
