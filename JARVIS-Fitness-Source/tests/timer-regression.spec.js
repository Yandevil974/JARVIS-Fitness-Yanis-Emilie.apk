import { test, expect } from "@playwright/test";
import { initialState } from "../src/store/model.js";
import { createTimer, advanceTimer } from "../src/engine/timer.js";
import { prepareWorkout } from "../src/engine/planner.js";

async function openSaved(page, state) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript((saved) => {
    // Seed only once: reload must use the application's saved state.
    if (!localStorage.getItem("jarvis_fitness_v3"))
      localStorage.setItem("jarvis_fitness_v3", JSON.stringify(saved));
  }, state);
  await page.goto("/");
  await expect(page.locator(".app-shell")).toBeVisible();
  return errors;
}
async function stored(page) {
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  return page.evaluate(() => JSON.parse(localStorage.getItem("jarvis_fitness_v3")));
}

for (const profileId of ["elite", "emilie"]) {
  for (const mode of ["standalone", "matching-workout", "other-workout", "deleted-workout"]) {
    test(`Completed warmup: ${profileId}, ${mode}, no blank screen or unrelated validation`, async ({ page }) => {
      const state = initialState();
      state.activeProfile = profileId;
      const p = state.profiles[profileId];
      if (mode.includes("workout") && mode !== "deleted-workout")
        p.workout = prepareWorkout(p, p.plan.sessions.find((s) => s.type === "strength"));
      const meta = { type: "warmup", name: "Échauffement spécifique" };
      if (mode === "matching-workout") meta.workoutId = p.workout.id;
      if (["other-workout", "deleted-workout"].includes(mode)) meta.workoutId = "old-workout";
      p.timer = advanceTimer(createTimer([{ name: "Mise en route", seconds: 60 }], meta, 1000), 61000);
      const errors = await openSaved(page, state);
      await page.locator(".floating-timer").click();
      await page.getByRole("button", { name: "Valider l’échauffement", exact: true }).click();
      await expect(page.locator(".app-shell")).toBeVisible();
      await expect(page.locator(".floating-timer")).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      const saved = (await stored(page)).profiles[profileId];
      expect(saved.timer).toBeNull();
      expect(saved.workout?.warmupDone === true).toBe(mode === "matching-workout");
      expect(saved.activities).toEqual(p.activities);
      expect(saved.sessions).toEqual(p.sessions);
      await page.reload();
      await expect(page.locator(".app-shell")).toBeVisible();
      await expect(page.locator(".floating-timer")).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
}

test("Countdown, pause/resume, background catch-up and result confirmation", async ({ page }) => {
  const state = initialState();
  state.profiles.elite.timer = createTimer([{ name: "Marche", seconds: 120 }], { type: "cardio", name: "Chrono test" });
  await page.clock.install();
  const errors = await openSaved(page, state);
  await page.locator(".floating-timer").click();
  const before = await page.locator(".timer-display").innerText();
  await page.clock.runFor(2000);
  expect(await page.locator(".timer-display").innerText()).not.toBe(before);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await page.locator(".timer-display").innerText();
  await page.clock.runFor(10000);
  await expect(page.locator(".timer-display")).toHaveText(paused);
  await page.getByRole("button", { name: "Reprendre", exact: true }).click();
  // Simulate timers suspended by Android, then returning to the app.
  await page.clock.fastForward(180000);
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expect(page.locator(".timer-display")).toHaveText("00:00");
  await page.getByRole("button", { name: "Confirmer mes résultats", exact: true }).click();
  await page.getByRole("button", { name: "Confirmer et enregistrer", exact: true }).click();
  await page.clock.runFor(500);
  const saved = (await stored(page)).profiles.elite;
  expect(saved.timer).toBeNull();
  expect(saved.activities).toHaveLength(1);
  expect(saved.activities[0].durationSec).toBe(120);
  await expect(page.locator(".floating-timer")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Completed combined protocol saves both blocks and clears timer", async ({ page }) => {
  const state = initialState();
  state.profiles.elite.timer = advanceTimer(createTimer([
    { name: "Cardio", seconds: 60, segment: "cardio" },
    { name: "Piscine", seconds: 120, segment: "pool" },
  ], { type: "source-combo", name: "METCON + piscine", components: [
    { key: "cardio", type: "metcon", name: "Cardio", seconds: 60 },
    { key: "pool", type: "swim", format: "pool", name: "Piscine", seconds: 120 },
  ] }, 1000), 181000);
  const errors = await openSaved(page, state);
  await page.locator(".floating-timer").click();
  await page.getByRole("button", { name: "Confirmer mes résultats", exact: true }).click();
  await page.getByRole("button", { name: "Confirmer mes résultats réels", exact: true }).click();
  const saved = (await stored(page)).profiles.elite;
  expect(saved.timer).toBeNull();
  expect(saved.activities.map((a) => a.durationSec)).toEqual([60, 120]);
  expect(errors).toEqual([]);
});

test("Completed rest can be dismissed without creating an activity", async ({ page }) => {
  const state = initialState();
  state.profiles.elite.timer = advanceTimer(createTimer([{ name: "Repos", seconds: 30 }], { type: "rest" }, 1000), 31000);
  const errors = await openSaved(page, state);
  await page.locator(".floating-timer").click();
  await page.getByRole("button", { name: "Série suivante prête", exact: true }).click();
  const saved = (await stored(page)).profiles.elite;
  expect(saved.timer).toBeNull();
  expect(saved.activities).toHaveLength(0);
  expect(errors).toEqual([]);
});
