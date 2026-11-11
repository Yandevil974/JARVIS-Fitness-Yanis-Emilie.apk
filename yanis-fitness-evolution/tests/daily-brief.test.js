import test from "node:test";
import assert from "node:assert/strict";
import { newProfile, initialState, validateState } from "../src/store/model.js";
import {
  dailyBrief,
  reminderDate,
  defaultReviewDate,
} from "../src/engine/daily-brief.js";
function profile() {
  const p = newProfile("elite");
  p.user.startDate = "2026-08-10";
  p.plan = null;
  return p;
}
test("bilan proposé lié au début et réglage indépendant par profil", () => {
  const p = profile();
  p.plan = { source: "legacy", weeks: 52, sessions: [] };
  assert.equal(defaultReviewDate(p), "2027-05-17");
  p.user.startDate = "2026-08-17";
  assert.equal(reminderDate(p, "review"), "2027-05-24");
  p.preferences.dailyReminders = { review: { date: "2027-04-15" } };
  p.user.startDate = "2026-08-24";
  assert.equal(reminderDate(p, "review"), "2027-04-15");
  assert.equal(defaultReviewDate(newProfile("emilie")), "");
  p.preferences.dailyReminders.review.date = "";
  assert.equal(reminderDate(p, "review"), "");
});
test("rappels uniquement aux dates réglées, sans compter les simulations ni dates incertaines", () => {
  const p = profile();
  p.preferences.dailyReminders = {
    checkin: { date: "2026-10-10" },
    measurement: { date: "2026-10-10" },
    photo: { date: "2026-10-10" },
    review: { date: "" },
  };
  p.photos = [
    { id: "1", date: "2026-10-12", simulated: true },
    { id: "2", date: "2026-10-12", needsDate: true },
  ];
  p.measurements = [{ date: "2026-10-12", needsDate: true }];
  assert.deepEqual(
    dailyBrief(p, "2026-10-13").reminders.map((x) => x.key),
    ["checkin", "measurement", "photo"],
  );
  assert.equal(dailyBrief(p, "2026-10-13").undated, true);
  p.measurements.push({ date: "2026-10-13", weight: 92, values: {} });
  assert.ok(
    dailyBrief(p, "2026-10-13").reminders.some((r) => r.key === "measurement"),
  );
  p.checkIns["2026-10-13"] = {};
  p.measurements.push({ date: "2026-10-13", values: { waist: 90 } });
  p.photos.push({ date: "2026-10-14" });
  assert.deepEqual(
    dailyBrief(p, "2026-10-13").reminders.map((x) => x.key),
    ["photo"],
  );
});
test("report et validation du bilan ne modifient ni calories ni objectif", () => {
  const p = profile();
  p.preferences.dailyReminders = {
    review: {
      date: "2026-10-10",
      snoozeFor: "2026-10-10",
      snoozeUntil: "2026-10-14",
    },
  };
  assert.equal(dailyBrief(p, "2026-10-13").reminders.length, 0);
  assert.equal(dailyBrief(p, "2026-10-14").reminders.length, 1);
  p.preferences.dailyReminders.review.completedOn = "2026-10-14";
  assert.equal(dailyBrief(p, "2026-10-14").reminders.length, 0);
  assert.equal(p.user.goal, "recomposition");
  assert.equal(p.nutrition.manualCalories, null);
});
test("rappels conservés lors de validation de sauvegarde", () => {
  const state = initialState();
  state.profiles.elite.preferences.dailyReminders = {
    review: {
      date: "2027-04-30",
      snoozeFor: "",
      snoozeUntil: "",
      completedOn: "",
    },
  };
  const checked = validateState(state);
  assert.equal(
    checked.profiles.elite.preferences.dailyReminders.review.date,
    "2027-04-30",
  );
  assert.equal(checked.profiles.emilie.preferences.dailyReminders, undefined);
});
test("statuts réels distingués du prévu et absence de calendrier non assimilée au repos", () => {
  const p = profile();
  assert.match(dailyBrief(p, "2026-10-13").schedule, /Aucun calendrier actif/);
  p.plan = {
    sessions: [
      {
        id: "1",
        date: "2026-10-13",
        name: "Dos",
        status: "completed",
        type: "strength",
      },
      {
        id: "2",
        date: "2026-10-13",
        name: "Piscine",
        status: "planned",
        type: "swim",
      },
    ],
  };
  const { schedule } = dailyBrief(p, "2026-10-13");
  assert.match(schedule, /Dos \(réalisé\)/);
  assert.match(schedule, /Piscine \(prévu\)/);
});
