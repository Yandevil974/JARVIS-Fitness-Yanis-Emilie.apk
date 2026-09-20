import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { initialState } from "../src/store/model.js";
let count = 0;
async function setup(raw) {
  const map = new Map(raw ? [["jarvis_fitness_v3", raw]] : []);
  globalThis.indexedDB = new IDBFactory();
  globalThis.localStorage = {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
  delete globalThis.__JARVIS_PRELOAD__;
  const store = await import(`../src/store/storage.js?test=${count++}`);
  return { store, map };
}
test("Stored state reloads with the two source identities intact", async () => {
  const { store } = await setup();
  const { data } = await store.loadState();
  data.profiles.elite.user.name = "Yanis";
  assert.equal((await store.saveState(data)).ok, true);
  const restored = await store.loadState();
  assert.equal(restored.data.profiles.elite.user.name, "Yanis");
  assert.equal(restored.data.profiles.emilie.user.name, "Émilie");
  assert.equal(restored.blocked, false);
});
test("Bad JSON stays untouched while saving is protected", async () => {
  const original = "{broken JSON: KEEP}";
  const { store, map } = await setup(original);
  const { data, blocked } = await store.loadState();
  assert.equal(blocked, true);
  assert.equal((await store.saveState(data)).ok, false);
  store.saveOnExit(data);
  assert.equal(map.get("jarvis_fitness_v3"), original);
});
test("Incompatible nested data cannot be overwritten by fresh defaults", async () => {
  const bad = initialState();
  bad.profiles.elite.plan.sessions[0].exercises[0].targetSets = -5;
  const original = JSON.stringify(bad);
  const { store, map } = await setup(original);
  const result = await store.loadState();
  assert.equal(result.blocked, true);
  await store.saveState(result.data);
  assert.equal(map.get("jarvis_fitness_v3"), original);
});
test("A newer unrelated writer is detected instead of silently overwritten", async () => {
  const { store, map } = await setup();
  const { data } = await store.loadState();
  await store.saveState(data);
  const other = structuredClone(data);
  other.updatedAt += 50;
  map.set("jarvis_fitness_v3", JSON.stringify(other));
  const mine = structuredClone(data);
  mine.updatedAt += 100;
  const status = await store.saveState(mine);
  assert.equal(status.mode, "conflit");
  assert.equal(
    JSON.parse(map.get("jarvis_fitness_v3")).updatedAt,
    other.updatedAt,
  );
});
