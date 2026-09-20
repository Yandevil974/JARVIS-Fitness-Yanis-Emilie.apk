import test from "node:test";
import assert from "node:assert/strict";
import { initialState, newProfile, validateState } from "../src/store/model.js";
import {
  moveSession,
  rescheduleMissed,
  sourceSession,
} from "../src/engine/planner.js";
import { removeScheduledFamily } from "../src/engine/schedule-group.js";
import { photoMetadata } from "../src/engine/photo-metadata.js";
import { makeTeamReview } from "../src/engine/team-review.js";
import { personalRecords } from "../src/engine/fitness.js";
import { today, addDays } from "../src/engine/utils.js";
import { IDBFactory } from "fake-indexeddb";
function linked() {
  const p = newProfile("emilie");
  const root = sourceSession(p, "1", "J3", { date: today() });
  root.id = "parent";
  root.time = "18:00";
  root.status = "planned";
  const child = {
    id: "pool",
    date: today(),
    time: "19:15",
    parentId: "parent",
    type: "swim",
    status: "planned",
    name: "Piscine après musculation",
    exercises: [],
    components: [{ key: "post", minutes: 20, seconds: 1200, format: "pool" }],
  };
  p.plan.sessions = [root, child];
  return p;
}
test("Moving a source strength session moves its pool block and preserves prescriptions", () => {
  const p = linked(),
    snapshot = structuredClone(p),
    date = addDays(today(), 2),
    plan = moveSession(p, "parent", date);
  assert.ok(plan.sessions.every((s) => s.date === date));
  assert.deepEqual(plan.sessions[0].exercises, p.plan.sessions[0].exercises);
  assert.deepEqual(plan.sessions[1].components, p.plan.sessions[1].components);
  assert.equal(plan.sessions[1].parentId, "parent");
  assert.ok(plan.sessions.every((s) => s.contentLocked));
  assert.deepEqual(p, snapshot);
});
test("Moving by the child selects the linked planned family, not an orphan block", () => {
  const p = linked();
  const plan = moveSession(p, "pool", addDays(today(), 1));
  assert.ok(plan.sessions.every((s) => s.date === addDays(today(), 1)));
});
test("Changing the root time preserves the relative offset of the pool session", () => {
  const p = linked(),
    plan = moveSession(p, "parent", today(), { time: "18:30" });
  assert.equal(plan.sessions[0].time, "18:30");
  assert.equal(plan.sessions[1].time, "19:45");
});
test("A midnight shift keeps the block linked on the next actual calendar date", () => {
  const p = linked(),
    date = addDays(today(), 2),
    plan = moveSession(p, "parent", date, { time: "23:30" });
  assert.equal(plan.sessions[1].date, addDays(date, 1));
  assert.equal(plan.sessions[1].time, "00:45");
});
test("Conflicts reject the whole linked movement without partial modification", () => {
  const p = linked(),
    date = addDays(today(), 1);
  p.plan.sessions.push({
    id: "other",
    date,
    time: "12:00",
    status: "planned",
    type: "cardio",
    name: "Cardio",
    exercises: [],
  });
  const copy = structuredClone(p);
  assert.throws(() => moveSession(p, "parent", date), /créneau libre/);
  assert.deepEqual(p, copy);
});
test("Active or historical linked blocks cannot be moved as planned data", () => {
  const p = linked();
  p.plan.sessions[1].status = "completed";
  assert.throws(
    () => moveSession(p, "parent", addDays(today(), 1)),
    /historique/,
  );
  p.plan.sessions[1].status = "planned";
  p.timer = { meta: { planId: "pool" } };
  assert.throws(
    () => moveSession(p, "parent", addDays(today(), 1)),
    /en cours/,
  );
});
test("A missed linked family is retained, while new related IDs form the rescheduled copy", () => {
  const p = linked(),
    r = rescheduleMissed(p, "parent"),
    old = r.plan.sessions.filter((s) => ["parent", "pool"].includes(s.id)),
    next = r.plan.sessions.filter((s) => !["parent", "pool"].includes(s.id));
  assert.equal(old.length, 2);
  assert.ok(old.every((s) => s.status === "missed"));
  assert.equal(next.length, 2);
  const parent = next.find((s) => s.rescheduledFrom === "parent"),
    child = next.find((s) => s.rescheduledFrom === "pool");
  assert.equal(child.parentId, parent.id);
  assert.equal(child.date, parent.date);
  assert.equal(child.contentLocked, true);
});
test("Deleting a planned linked family leaves actual history untouched", () => {
  const p = linked();
  p.sessions = [
    { id: "actual", date: today(), status: "completed", exercises: [] },
  ];
  const history = structuredClone(p.sessions);
  assert.equal(removeScheduledFamily(p, "parent").sessions.length, 0);
  assert.deepEqual(p.sessions, history);
});
test("Source simulation cannot be relabelled as a real result", () => {
  const photo = {
      id: "simulation",
      simulated: true,
      source: "legacy-simulation",
      data: "UNCHANGED",
    },
    result = photoMetadata(photo, { date: "", view: "face", simulated: false });
  assert.equal(result.simulated, true);
  assert.equal(result.needsDate, true);
  assert.equal(photo.data, "UNCHANGED");
});
test("Photo dates remain optional, valid and non-future", () => {
  assert.throws(() =>
    photoMetadata({}, { date: addDays(today(), 1), view: "face" }),
  );
  assert.throws(() => photoMetadata({}, { date: "2026-02-31", view: "face" }));
  assert.throws(() => photoMetadata({}, { date: today(), view: "invalid" }));
  const r = photoMetadata(
    {},
    {
      date: today(),
      view: "profil",
      label: " J0 ",
      note: "Prise de vue connue",
    },
  );
  assert.equal(r.label, "J0");
  assert.equal(r.needsDate, false);
});
test("A backdated team review belongs to its own source week", () => {
  const p = newProfile("elite");
  p.user.startDate = addDays(today(), -21);
  const review = makeTeamReview(p, {
    date: addDays(today(), -14),
    energy: 3,
    feelings: "Bilan de la deuxième semaine",
  });
  assert.equal(review.week, 1);
  assert.equal(review.cycleStart, p.user.startDate);
});
test("Editing a team review preserves the original version and is idempotent without changes", () => {
  const p = newProfile("elite");
  p.user.startDate = addDays(today(), -21);
  const form = { date: today(), energy: 3, feelings: "Première version" };
  const one = makeTeamReview(p, form);
  p.teamReviews = [one];
  const two = makeTeamReview(p, { ...form, feelings: "Correction" });
  assert.equal(two.id, one.id);
  assert.equal(two.previousVersions[0].feelings, "Première version");
  p.teamReviews = [two];
  assert.deepEqual(makeTeamReview(p, { ...form, feelings: "Correction" }), two);
});
test("Imported team advice is not overwritten by a new local review", () => {
  const p = newProfile("elite");
  p.user.startDate = addDays(today(), -21);
  const legacy = {
    id: "kept",
    week: 3,
    date: today(),
    source: "legacy",
    advice: [{ text: "Retour historique" }],
  };
  p.teamReviews = [legacy];
  const review = makeTeamReview(p, {
    date: today(),
    feelings: "Nouveau bilan",
  });
  assert.notEqual(review.id, legacy.id);
  assert.deepEqual(p.teamReviews, [legacy]);
});
test("Team reviews outside the programme period are rejected", () => {
  const p = newProfile("elite");
  p.user.startDate = addDays(today(), -10);
  assert.throws(() =>
    makeTeamReview(p, {
      date: addDays(today(), -11),
      feelings: "Avant programme",
    }),
  );
  p.user.startDate = addDays(today(), -400);
  assert.throws(() =>
    makeTeamReview(p, { date: today(), feelings: "Ancien cycle terminé" }),
  );
});
test("Unknown repetitions and aggregated sets cannot generate a fake zero or single-set volume record", () => {
  const p = newProfile("elite"),
    target = sourceSession(p, "1", "J1").exercises[1];
  target.sets = [
    {
      id: "record",
      weight: 20,
      reps: null,
      needsReps: true,
      unit: "source à vérifier",
      count: 4,
      legacyAggregate: true,
      completed: true,
    },
  ];
  p.sessions = [
    { id: "s", date: today(), status: "completed", exercises: [target] },
  ];
  const result = personalRecords(p)[0];
  assert.equal(result.reps, null);
  assert.equal(result.volume, null);
  assert.equal(result.best1RM, null);
  assert.equal(result.weight, 20);
});
let number = 0;
async function storage() {
  globalThis.indexedDB = new IDBFactory();
  const data = new Map();
  globalThis.localStorage = {
    getItem: (k) => data.get(k) || null,
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  };
  delete globalThis.__JARVIS_PRELOAD__;
  return {
    store: await import(`../src/store/storage.js?maintenance=${number++}`),
    data,
  };
}
test("An invalid new state cannot overwrite the previous valid save, including on page hide", async () => {
  const { store, data } = await storage(),
    loaded = await store.loadState();
  assert.equal((await store.saveState(loaded.data)).ok, true);
  const before = data.get("jarvis_fitness_v3"),
    invalid = structuredClone(loaded.data);
  invalid.updatedAt++;
  invalid.profiles.elite.user.age = -1;
  assert.equal((await store.saveState(invalid)).mode, "validation");
  store.saveOnExit(invalid);
  assert.equal(data.get("jarvis_fitness_v3"), before);
});
test("External corruption during a session is quarantined rather than erased on the next save", async () => {
  const { store, data } = await storage(),
    loaded = await store.loadState();
  await store.saveState(loaded.data);
  const broken = '{"KEEP-ORIGINAL":true,"schemaVersion":999}';
  data.set("jarvis_fitness_v3", broken);
  loaded.data.updatedAt++;
  const result = await store.saveState(loaded.data);
  assert.equal(result.blocked, true);
  assert.equal(data.get("jarvis_fitness_v3"), broken);
  assert.equal(store.isStorageProtected(), true);
});
test("Removing only a planned post-cardio block does not remove the strength session", () => {
  const p = linked(),
    plan = removeScheduledFamily(p, "pool");
  assert.deepEqual(
    plan.sessions.map((s) => s.id),
    ["parent"],
  );
});
