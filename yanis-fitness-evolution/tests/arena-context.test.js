import test from "node:test";
import assert from "node:assert/strict";
import { arenaSportContext } from "../src/engine/arena-context.js";

const p = {
  plan: {
    name: "Programme adaptatif JARVIS",
    weeks: 12,
    frequency: 4,
    sessions: [
      { id: "s1", date: "2099-01-02", type: "strength", status: "completed", focus: [], exercises: [] },
      { id: "s2", date: "2099-01-05", type: "strength", status: "planned", focus: ["Dos", "Biceps"], exercises: [{ name: "Tractions" }, { name: "Rowing" }, { name: "Curl biceps" }] },
      { id: "s3", date: "2099-01-08", type: "strength", status: "planned", focus: [], exercises: [] },
    ],
  },
  sessions: [{ id: "w1", date: "2098-12-30", status: "completed" }],
};

test("récap complet : prochaine séance + plan + dernière séance", () => {
  const ctx = arenaSportContext(p);
  assert.match(ctx, /LECTURE SEULE/);
  assert.match(ctx, /Prochaine séance : .*Dos, Biceps/);
  assert.match(ctx, /Tractions, Rowing, Curl biceps/);
  assert.match(ctx, /4 séances\/semaine sur 12 semaines, 1\/3/);
  assert.match(ctx, /Dernière séance : .*terminée/);
});

test("plus de 4 exercices → tronqué avec …", () => {
  const q = structuredClone(p);
  q.plan.sessions[1].exercises = [
    { name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }, { name: "E" },
  ];
  const ctx = arenaSportContext(q);
  assert.match(ctx, /A, B, C, D…/);
  assert.doesNotMatch(ctx, /\bE\b/);
});

test("aucune donnée → null", () => {
  assert.equal(arenaSportContext({}), null);
  assert.equal(arenaSportContext(null), null);
});

test("pas de prochaine séance (tout terminé) → récap partiel", () => {
  const q = structuredClone(p);
  q.plan.sessions = q.plan.sessions.map((s) => ({ ...s, status: "completed" }));
  const ctx = arenaSportContext(q);
  assert.doesNotMatch(ctx, /Prochaine séance/);
  assert.match(ctx, /3\/3 déjà faites/);
});
