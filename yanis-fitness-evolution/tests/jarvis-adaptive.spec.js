import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

test("JARVIS applique les charges à la séance existante après confirmation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  await page.evaluate(() => {
    const key = window.__YFE_KEY__;
    const state = JSON.parse(localStorage.getItem(key));
    const profile = state.profiles.elite;
    const session = profile.plan.sessions.find((item) =>
      item.exercises?.some(
        (exercise) => exercise.exerciseId === "french-press-poulie-basse",
      ),
    );
    const source = session.exercises.find(
      (exercise) => exercise.exerciseId === "french-press-poulie-basse",
    );
    const date = new Date();
    const iso = (offset) => {
      const value = new Date(date);
      value.setDate(value.getDate() + offset);
      return value.toISOString().slice(0, 10);
    };
    const target = {
      ...source,
      targetSets: 3,
      repsLow: 8,
      repsHigh: 12,
      unit: "kg total",
      targetLoad: 50,
      recommendation: null,
      sets: [],
    };
    const previous = {
      ...target,
      sets: [0, 1, 2].map((index) => ({
        id: `previous-set-${index}`,
        weight: 50,
        reps: 12,
        rpe: 8,
        unit: "kg total",
        completed: true,
        createdAt: Date.now() - 1000 + index,
      })),
    };
    profile.sessions = [
      {
        id: "previous-adaptive-session",
        date: iso(-1),
        name: "Séance précédente",
        type: "strength",
        status: "completed",
        source: "workout",
        exercises: [previous],
      },
    ];
    session.date = iso(1);
    session.name = "Séance à adapter";
    session.status = "planned";
    session.exercises = [target];
    profile.plan.sessions = [session];
    profile.workout = null;
    profile.messages = [];
    state.updatedAt = Date.now() + 1000;
    localStorage.setItem(key, JSON.stringify(state));
  });
  await page.reload();
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "JARVIS", exact: true })
    .click();
  await page
    .getByLabel("Votre message à JARVIS")
    .fill("Modifie mes charges");
  await page
    .getByRole("button", { name: "Envoyer à JARVIS", exact: true })
    .click();
  await expect(page.getByText(/Je peux adapter les charges/)).toBeVisible();
  await page
    .getByRole("button", { name: "Appliquer les charges", exact: true })
    .click();
  await expect(page.locator(".toast")).toContainText("Charges adaptées");
  await page.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    return (
      state.profiles.elite.plan.sessions[0].exercises[0].targetLoad === 52.5
    );
  });

  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem(window.__YFE_KEY__)),
  );
  const profile = state.profiles.elite;
  expect(profile.plan.sessions).toHaveLength(1);
  expect(profile.plan.sessions[0].name).toBe("Séance à adapter");
  expect(profile.plan.sessions[0].exercises[0].targetLoad).toBe(52.5);
  expect(profile.sessions).toHaveLength(1);
  expect(profile.sessions[0].id).toBe("previous-adaptive-session");
});
