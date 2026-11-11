import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { EXERCISES, exerciseById } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";
import { nextRestExercise, nextRestModal } from "../src/engine/rest-next.js";

function target(exerciseId, extra = {}) {
  return {
    exerciseId,
    targetSets: 3,
    repsLow: 8,
    repsHigh: 12,
    repScheme: "8–12",
    unit: "kg total",
    targetLoad: null,
    sets: [],
    ...extra,
  };
}
const preview = (exerciseId) =>
  nextRestExercise({ currentIndex: 0, exercises: [target(exerciseId)] });

test("toutes les fiches avec vidéo utilisent la même source dans « Ensuite » et la visionneuse", () => {
  let checked = 0;
  for (const ex of EXERCISES) {
    const video = videoFor(ex);
    const next = preview(ex.id);
    if (!video) continue;
    checked++;
    assert.equal(next.video.src, video.src, ex.id);
    assert.equal(next.img, null, ex.id);
    const modal = nextRestModal(next);
    assert.equal(modal.src, video.src, ex.id);
    assert.equal(modal.poster, video.poster || null, ex.id);
    if (video.status === "coached") {
      assert.equal(modal.notice, video.coaching.notice, ex.id);
      assert.equal(modal.spoken, video.coaching.spoken, ex.id);
      assert.ok(modal.notice && modal.spoken, ex.id);
    }
  }
  assert.ok(checked > 0, "le catalogue doit contenir des vidéos raccordées");
});

test("la traction supination de la photo et l'épaule partagée utilisent leur MP4 exact", () => {
  const chinup = preview("tractions-supination-chin-up");
  assert.equal(chinup.video.src, "/videos/tractions-supination-chin-up.mp4");
  assert.equal(nextRestModal(chinup).src, chinup.video.src);
  assert.match(nextRestModal(chinup).notice, /asymétrique/);
  assert.equal(
    preview("elevations-laterales").video.src,
    videoFor("elevations-laterales-halteres").src,
  );
});

test("sans vidéo raccordée le GIF d'origine reste le repli, sans le modifier", () => {
  const ex = exerciseById("hip-thrust-unilateral-1-jambe");
  assert.equal(videoFor(ex), null);
  const original = ex.gif;
  assert.ok(original);
  const next = preview(ex.id);
  assert.equal(next.video, null);
  assert.equal(next.img, original);
  assert.equal(nextRestModal(next).src, original);
  assert.equal(ex.gif, original);
});

test("la vignette suit l'exercice actif du circuit et les séries restantes", () => {
  const workout = {
    currentIndex: 1,
    exercises: [
      target("curl-halteres"),
      target("tractions-supination-chin-up", {
        targetLoad: 12,
        unit: "kg ajouté",
        sets: [{ completed: true }],
      }),
    ],
  };
  const next = nextRestExercise(workout);
  assert.equal(next.video.src, "/videos/tractions-supination-chin-up.mp4");
  assert.equal(next.serie, 2);
  assert.equal(next.charge, 12);
  assert.equal(next.unite, "kg ajouté");
  workout.exercises[1].sets = Array.from({ length: 3 }, () => ({
    completed: true,
  }));
  assert.equal(
    nextRestExercise(workout).video.src,
    videoFor("curl-halteres").src,
  );
  workout.exercises[0].sets = Array.from({ length: 3 }, () => ({
    completed: true,
  }));
  assert.equal(nextRestExercise(workout), null);
  assert.equal(nextRestExercise(null), null);
});

let server, RestNext;
before(async () => {
  server = await createServer({
    configFile: false,
    root: process.cwd(),
    plugins: [react()],
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });
  ({ default: RestNext } = await server.ssrLoadModule(
    "/src/components/RestNext.jsx",
  ));
});
after(async () => {
  await server?.close();
});
const htmlFor = (next, reducedMotion = false) =>
  renderToStaticMarkup(
    React.createElement(RestNext, { next, setModal: () => {}, reducedMotion }),
  );

test("la vignette affiche le MP4 en boucle avec indication de consigne", () => {
  const next = preview("tractions-supination-chin-up");
  const html = htmlFor(next);
  assert.match(html, /<video/);
  assert.ok(html.includes(next.video.src));
  assert.match(html, /autoPlay=""/);
  assert.match(html, /muted=""/);
  assert.match(html, /loop=""/);
  assert.match(html, /Vidéo IA · suivez la consigne de la fiche/);
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(htmlFor(next, true), /autoPlay=""/);
});

test("la vignette sans vidéo continue à afficher le GIF", () => {
  const next = preview("hip-thrust-unilateral-1-jambe");
  const html = htmlFor(next);
  assert.match(html, /<img/);
  assert.ok(html.includes(next.img));
  assert.doesNotMatch(html, /<video/);
});
