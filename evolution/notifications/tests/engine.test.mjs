import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { tasks, payload, timeMinute } from "../engine.mjs";
import { createController } from "../controller.mjs";
import { postpone, reminders } from "../../reminders/engine.mjs";
const day = "2026-09-20";
function fixture() {
  return {
    profiles: Object.fromEntries(
      ["elite", "emilie"].map((id) => [
        id,
        {
          id,
          user: { name: "PRIVATE" },
          measurements: [],
          sessions: [],
          plan: {
            sessions: [
              {
                id: "a",
                date: day,
                time: "18:00",
                status: "planned",
                name: "PRIVATE",
                exercises: [{ private: "SECRET" }],
              },
            ],
          },
          photos: [],
          teamReviews: [],
          forceTests: [],
        },
      ]),
    ),
  };
}
const sessions = (p) =>
  tasks(p, day).filter((t) => t.seed.includes("|session|"));
test("separate profiles and minimal projection, no state mutation", () => {
  const s = fixture(),
    before = structuredClone(s);
  const t = tasks(s, day);
  assert.equal(t.length, 8);
  assert.deepEqual(s, before);
  assert.ok(t.some((t) => t.profile === "elite"));
  assert.ok(t.some((t) => t.profile === "emilie"));
  assert.ok(!JSON.stringify(t).includes("PRIVATE"));
});
test("strict times and explicit invalid dates are not invented", () => {
  for (const v of ["25:00", "9:30", "18:99", "x", true])
    assert.equal(timeMinute(v), null);
  assert.equal(timeMinute(null), 1080);
  const s = fixture();
  s.profiles.elite.plan.sessions[0].time = "bad";
  assert.equal(sessions(s).length, 1);
  s.profiles.emilie.plan.sessions[0].date = "2026-02-30";
  assert.equal(sessions(s).length, 0);
});
test("session scheduled thirty minutes before with midnight rollover", () => {
  const s = fixture();
  s.profiles.elite.plan.sessions[0].time = "00:10";
  const t = sessions(s)[0];
  assert.equal(t.profile, "elite");
  assert.equal(t.date, "2026-09-19");
  assert.equal(t.minute, 1420);
  assert.equal(t.expiryMinute, 10);
});
test("actual planId completion, partial and in-progress session cancel planned reminder", () => {
  for (const status of ["completed", "partial"]) {
    const s = fixture();
    s.profiles.elite.sessions = [{ id: "actual", planId: "a", status }];
    assert.equal(sessions(s).length, 1);
  }
  const s = fixture();
  s.profiles.elite.workout = { id: "actual", planId: "a" };
  assert.equal(sessions(s).length, 1);
});
test("removed, skipped, duplicate or far future sessions are ignored", () => {
  for (const mutate of [
    (s) => (s.status = "skipped"),
    (s) => (s.date = "2027-01-01"),
    (s) => (s.date = "2026-09-19"),
    (s) => (s.id = ""),
  ]) {
    const s = fixture();
    mutate(s.profiles.elite.plan.sessions[0]);
    assert.equal(sessions(s).length, 1);
  }
  const s = fixture();
  s.profiles.elite.plan.sessions.push({ ...s.profiles.elite.plan.sessions[0] });
  assert.equal(sessions(s).length, 1);
});
test("snooze changes scheduling without completing a task", () => {
  const s = fixture(),
    p = s.profiles.elite,
    t = reminders(p, day).find((t) => t.kind === "measurements");
  postpone(p, t.key, "2026-09-25", day);
  const n = tasks(s, day).find((t) => t.seed.includes(t.key));
  assert.equal(n, undefined);
  assert.ok(
    tasks(s, day).some(
      (t) =>
        t.profile === "elite" &&
        t.date === "2026-09-25" &&
        t.seed.includes("|follow|"),
    ),
  );
  assert.equal(p.measurements.length, 0);
});
test("initial deadline identity stays stable over days", async () => {
  const s = fixture();
  const a = await payload(s, day, webcrypto),
    b = await payload(s, "2026-09-21", webcrypto);
  assert.equal(
    a.filter((t) => t.profile === "elite" && t.minute === 1080)[0].key,
    b.filter((t) => t.profile === "elite" && t.minute === 1080)[0].key,
  );
});
test("payload contains only allowed fields and deterministic hashes", async () => {
  const s = fixture(),
    a = await payload(s, day, webcrypto);
  assert.deepEqual(a, await payload(s, day, webcrypto));
  for (const t of a) {
    assert.deepEqual(Object.keys(t).sort(), [
      "date",
      "expiryDate",
      "expiryMinute",
      "key",
      "minute",
      "profile",
    ]);
    assert.match(t.key, /^[a-f0-9]{64}$/);
  }
  assert.ok(!JSON.stringify(a).includes("PRIVATE"));
});
test("bounded payload and corrupt foreign profiles cannot add jobs", () => {
  const s = fixture();
  s.profiles.foreign = s.profiles.elite;
  s.profiles.elite.plan.sessions = Array.from({ length: 300 }, (_, i) => ({
    id: String(i),
    date: day,
    status: "planned",
  }));
  assert.equal(tasks(s, day).length, 128);
  s.profiles.elite.id = "wrong";
  assert.ok(tasks(s, day).every((t) => t.profile === "emilie"));
});
test("reading in-app notifications cannot complete or cancel a deadline", () => {
  const s = fixture(),
    before = tasks(s, day);
  s.profiles.elite.notifications = [{ read: true }];
  assert.deepEqual(tasks(s, day), before);
});
function bridge() {
  const log = [];
  let fail = false;
  const status = { permission: true, enabled: { elite: false, emilie: false } };
  const native = {
    begin: async () => ({ token: "token", protocol: 1 }),
    status: async () => status,
    replace: async (a) => {
      log.push(["replace", a]);
      if (fail) throw Error("failure");
      return status;
    },
    setEnabled: async (a) => {
      log.push(["enable", a]);
      return status;
    },
    requestPermission: async () => {
      log.push(["permission"]);
      return status;
    },
    test: async () => {
      log.push(["test"]);
      return status;
    },
  };
  return {
    log,
    native,
    setFail(v) {
      fail = v;
    },
  };
}
test("browser never requests permission or calls bridge", async () => {
  const b = bridge(),
    c = createController({ ...b, isAndroid: () => false });
  await c.sync(fixture(), day);
  await c.enable("elite", true);
  await c.permission();
  assert.equal(b.log.length, 0);
});
test("sync never activates consent; explicit operations remain serial", async () => {
  const b = bridge(),
    c = createController({
      ...b,
      isAndroid: () => true,
      encodePlan: async (p) => p,
    });
  await Promise.all([
    c.sync(fixture(), day),
    c.enable("elite", true),
    c.enable("elite", false),
  ]);
  assert.deepEqual(
    b.log.map((x) => x[0]),
    ["replace", "enable", "enable"],
  );
  assert.deepEqual(
    b.log.map((x) => x[1].revision),
    [1, 2, 3],
  );
  assert.ok(b.log.every((x) => x[1].token === "token"));
});
test("snapshot captured synchronously, no cloning photo store", async () => {
  const b = bridge(),
    s = fixture(),
    c = createController({
      ...b,
      isAndroid: () => true,
      encodePlan: async (p) => p,
    });
  Object.defineProperty(s, "irrelevant", {
    get() {
      throw Error("Must not clone entire store");
    },
  });
  const pending = c.sync(s, day);
  s.profiles.elite.plan.sessions = [];
  await pending;
  assert.ok(
    b.log[0][1].jobs.some(
      (t) => t.profile === "elite" && t.seed.includes("|session|"),
    ),
  );
});
test("unchanged plans deduplicate writes; data changes reconcile", async () => {
  const b = bridge(),
    s = fixture(),
    c = createController({
      ...b,
      isAndroid: () => true,
      encodePlan: async (p) => p,
    });
  await c.sync(s, day);
  await c.sync(s, day);
  assert.equal(b.log.length, 1);
  s.profiles.elite.plan.sessions = [];
  await c.sync(s, day);
  assert.equal(b.log.length, 2);
});
test("failed replace can retry without pretending it succeeded", async () => {
  const b = bridge(),
    c = createController({
      ...b,
      isAndroid: () => true,
      encodePlan: async (p) => p,
    });
  b.setFail(true);
  await c.sync(fixture(), day);
  assert.match(c.getSnapshot().error, /failure/);
  b.setFail(false);
  await c.sync(fixture(), day);
  assert.equal(b.log.length, 2);
  assert.equal(c.getSnapshot().error, "");
});
test("encoding error cancels obsolete native jobs and surfaces error", async () => {
  const b = bridge(),
    c = createController({
      ...b,
      isAndroid: () => true,
      encodePlan: async () => {
        throw Error("encoding");
      },
    });
  await c.sync(fixture(), day);
  assert.deepEqual(b.log[0][1].jobs, []);
  assert.match(c.getSnapshot().error, /encoding/);
});
test("permission return does not enable either profile", async () => {
  const b = bridge(),
    c = createController({ ...b, isAndroid: () => true });
  await c.permission();
  assert.deepEqual(b.log, [["permission"]]);
  assert.deepEqual(c.getSnapshot().enabled, { elite: false, emilie: false });
});
test("invalid profile cannot create consent", async () => {
  const b = bridge(),
    c = createController({ ...b, isAndroid: () => true });
  await c.enable("other", true);
  await c.enable("elite", "true");
  assert.deepEqual(b.log, []);
});
test("invalid snapshot clears old jobs and next valid snapshot can restore them", async () => {
  const b = bridge(),
    c = createController({
      ...b,
      isAndroid: () => true,
      encodePlan: async (p) => p,
    });
  await c.sync(fixture(), day);
  await c.sync(fixture(), "invalid");
  await c.sync(fixture(), day);
  assert.equal(b.log.length, 3);
  assert.deepEqual(b.log[1][1].jobs, []);
  assert.ok(b.log[2][1].jobs.length > 0);
});
