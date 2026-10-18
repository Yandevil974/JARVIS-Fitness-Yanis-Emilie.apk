import test from "node:test";
import assert from "node:assert/strict";
import { clampRate } from "../src/engine/voice-settings.js";

test("clampRate : bornes 0.7 → 1.6, arrondi 2 décimales", () => {
  assert.equal(clampRate(0.5), 0.7);
  assert.equal(clampRate(2), 1.6);
  assert.equal(clampRate(1.045), 1.05);
  assert.equal(clampRate(0.98), 0.98);
});
test("clampRate : valeurs invalides → 0.98", () => {
  assert.equal(clampRate("x"), 0.98);
  assert.equal(clampRate(null), 0.98);
  assert.equal(clampRate(NaN), 0.98);
});
