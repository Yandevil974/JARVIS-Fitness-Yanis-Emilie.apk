import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { initialState } from "../src/store/model.js";
import { STORAGE_KEY, LEGACY_STORAGE_KEYS } from "../src/app-identity.js";
let count = 0;
async function setup(raw, key = STORAGE_KEY) {
  const map = new Map(raw ? [[key, raw]] : []);
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
  assert.equal(map.get(STORAGE_KEY), original);
});
test("Incompatible nested data cannot be overwritten by fresh defaults", async () => {
  const bad = initialState();
  bad.profiles.elite.plan.sessions[0].exercises[0].targetSets = -5;
  const original = JSON.stringify(bad);
  const { store, map } = await setup(original);
  const result = await store.loadState();
  assert.equal(result.blocked, true);
  await store.saveState(result.data);
  assert.equal(map.get(STORAGE_KEY), original);
});
test("A newer unrelated writer is detected instead of silently overwritten", async () => {
  const { store, map } = await setup();
  const { data } = await store.loadState();
  await store.saveState(data);
  const other = structuredClone(data);
  other.updatedAt += 50;
  map.set(STORAGE_KEY, JSON.stringify(other));
  const mine = structuredClone(data);
  mine.updatedAt += 100;
  const status = await store.saveState(mine);
  assert.equal(status.mode, "conflit");
  assert.equal(
    JSON.parse(map.get(STORAGE_KEY)).updatedAt,
    other.updatedAt,
  );
});

// —— Cohabitation avec l’application d’origine (règle absolue) ———
// L’ancienne clé « jarvis_fitness_v3 » appartient à JARVIS Fitness : cette
// application peut la LIRE pour reprendre les données si elle n’a rien à elle,
// mais ne doit JAMAIS y écrire, ni se laisser bloquer par un contenu illisible.
test("Legacy JARVIS data is adopted read-only on a fresh install", async () => {
  const seed = initialState();
  seed.profiles.elite.user.name = "Adopté";
  const raw = JSON.stringify(seed);
  const map = new Map([["jarvis_fitness_v3", raw]]);
  globalThis.indexedDB = new IDBFactory();
  globalThis.localStorage = {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
  delete globalThis.__JARVIS_PRELOAD__;
  const store = await import("../src/store/storage.js?legacy=1");
  const { data, blocked } = await store.loadState();
  assert.equal(blocked, false);
  assert.equal(data.profiles.elite.user.name, "Adopté");
  data.profiles.elite.user.name = "Écrit ailleurs";
  assert.equal((await store.saveState(data)).ok, true);
  // La clé héritée reste intégralement celle de l’application d’origine :
  assert.equal(map.get("jarvis_fitness_v3"), raw);
  assert.notEqual(map.get(STORAGE_KEY), undefined);
  assert.notEqual(map.get(STORAGE_KEY), raw);
});
test("A corrupt legacy key never blocks nor deletes; the new app starts clean", async () => {
  const broken = "{legacy BROKEN: KEEP}";
  const { store, map } = await setup(broken, "jarvis_fitness_v3");
  const { data, blocked } = await store.loadState();
  assert.equal(blocked, false);
  assert.equal(data.profiles.elite.user.name, "Yanis");
  assert.equal((await store.saveState(data)).ok, true);
  assert.equal(map.get("jarvis_fitness_v3"), broken);
});
test("When both keys hold data, the app key wins and legacy is untouched", async () => {
  const mine = initialState();
  mine.profiles.elite.user.name = "Natif";
  const legacy = initialState();
  legacy.profiles.elite.user.name = "Ancien";
  const map = new Map([
    [STORAGE_KEY, JSON.stringify(mine)],
    ["jarvis_fitness_v3", JSON.stringify(legacy)],
  ]);
  globalThis.indexedDB = new IDBFactory();
  globalThis.localStorage = {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
  delete globalThis.__JARVIS_PRELOAD__;
  const store = await import("../src/store/storage.js?legacy=3");
  const { data } = await store.loadState();
  assert.equal(data.profiles.elite.user.name, "Natif");
});
