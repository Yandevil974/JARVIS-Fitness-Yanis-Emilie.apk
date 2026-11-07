import test from "node:test";
import assert from "node:assert/strict";
import { assistantLabel } from "../src/pages/jarvis-label.js";

// Régression 1.8.6 : le Fitness Brain local range m.brain en objet
// ({ source: "brain-disabled", topics: [...] } etc.) sur ses réponses.
// L'ancien libellé appelait m.brain.toUpperCase() → TypeError → crash de
// toute la page JARVIS dès qu'un message local était affiché.
test("libellé inoffensif quand brain est un objet (Fitness Brain local)", () => {
  const msg = {
    id: "m1",
    role: "assistant",
    text: "Bonjour !",
    brain: { source: "brain-disabled", topics: ["general"] },
  };
  assert.equal(assistantLabel(msg), "ANALYSE LOCALE");
});

test("libellé inoffensif quand brain est un objet mémoire (kind + memoryId)", () => {
  const msg = {
    id: "m2",
    role: "assistant",
    text: "Je me souviens.",
    brain: { kind: "memory_confirmation_guard", memoryId: "mem-1", memoryState: "hypothesis" },
  };
  assert.equal(assistantLabel(msg), "ANALYSE LOCALE");
});

test("libellé ARENA//X quand brain est une chaîne (connecteur distant)", () => {
  assert.equal(assistantLabel({ brain: "groq//solo" }), "ARENA//X GROQ//SOLO");
  assert.equal(assistantLabel({ brain: "openrouter//collab" }), "ARENA//X OPENROUTER//COLLAB");
});

test("libellé SECOURS LOCAL sur repli local après erreur de plate-forme", () => {
  assert.equal(assistantLabel({ brain: null, fallback: true }), "SECOURS LOCAL");
});

test("libellé par défaut sans brain", () => {
  assert.equal(assistantLabel({}), "ANALYSE LOCALE");
});
