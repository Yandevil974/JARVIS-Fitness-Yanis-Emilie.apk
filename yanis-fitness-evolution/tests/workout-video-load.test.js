import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";

let server, WorkoutLoadControl;
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
  ({ default: WorkoutLoadControl } = await server.ssrLoadModule("/src/components/WorkoutLoadControl.jsx"));
});
after(async () => { await server?.close(); });

const automatic = { from: 50, to: 52.5, unit: "kg total" };
function render({ weight = 52.5, target = { unit: "kg total", autoIncrease: automatic }, exercise = {}, disabled = false } = {}) {
  return renderToStaticMarkup(React.createElement(WorkoutLoadControl, { target, exercise, weight, disabled, onChange: () => {} }));
}

test("la charge appliquée et sa hausse sont visibles dans le champ sous la vidéo", () => {
  const html = render();
  assert.match(html, /Charge pour cette série/);
  assert.match(html, /Hausse automatique : 50 → 52,5 kg/);
  assert.match(html, /aria-label="Charge sous la vidéo"/);
  assert.match(html, /value="52\.5"/);
  assert.match(html, /step="any"/);
});

test("la modification manuelle n'est jamais présentée comme la hausse appliquée", () => {
  const html = render({ weight: "45" });
  assert.match(html, /Hausse initiale auto · valeur modifiée/);
  assert.match(html, /value="45"/);
  assert.doesNotMatch(html, /Hausse automatique :/);
  assert.match(render({ weight: "" }), /value=""/);
});

test("la convention de charge et les exercices au temps sont respectés", () => {
  assert.match(render({ target: { unit: "kg/main", autoIncrease: { ...automatic, unit: "kg/main" } } }), /52,5 kg\/main/);
  assert.match(render({ target: { unit: "source à vérifier" }, weight: "" }), /unité à vérifier/);
  assert.match(render({ exercise: { bodyweight: true }, target: { unit: "kg ajouté" }, weight: "" }), /kg ajoutés/);
  const timed = render({ exercise: { timed: true }, target: { unit: "secondes" }, weight: "" });
  assert.match(timed, /AU TEMPS/);
  assert.doesNotMatch(timed, /<input/);
  assert.match(render({ disabled: true }), /disabled=""/);
});

test("la saisie sous la vidéo remonte exactement la valeur modifiée", () => {
  let changed;
  const tree = WorkoutLoadControl({ target: { unit: "kg total" }, exercise: {}, weight: 40, disabled: false, onChange: (value) => { changed = value; } });
  const input = tree.props.children[1].props.children[0];
  input.props.onChange({ target: { value: "41.25" } });
  assert.equal(changed, "41.25");
});
