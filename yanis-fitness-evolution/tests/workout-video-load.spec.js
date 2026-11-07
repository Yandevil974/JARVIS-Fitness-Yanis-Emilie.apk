import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test.use({ viewport: { width: 390, height: 844 } });

test("la charge sous la vidéo est synchronisée avec la saisie et la série validée", async ({ page }) => {
  await page.addInitScript((key) => { window.__YFE_KEY__ = key; }, STORAGE_KEY);
  await page.goto("/");
  await startSourceWorkout(page);
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    const workout = state.profiles.elite.workout;
    const target = workout.exercises[0];
    workout.currentIndex = 0;
    target.targetLoad = 52.5;
    target.unit = "kg total";
    target.autoIncrease = { from: 50, to: 52.5, unit: "kg total" };
    target.sets = [];
    state.updatedAt = Date.now() + 5000;
    localStorage.setItem(window.__YFE_KEY__, JSON.stringify(state));
  });
  await page.reload();
  await page.locator(".mobile-nav").getByRole("button", { name: "Entraînement", exact: true }).click();
  const card = page.locator(".video-workout-load");
  const underVideo = page.getByLabel("Charge sous la vidéo", { exact: true });
  const form = page.getByLabel("Charge réalisée", { exact: true });
  await expect(card).toBeVisible();
  await expect(card).toContainText("Hausse automatique : 50 → 52,5 kg");
  await expect(underVideo).toHaveValue("52.5");
  await expect(form).toHaveValue("52.5");
  // Le champ est dans le bloc de la vidéo et en dessous du média, à droite.
  const video = await page.locator(".exercise-stage .movement-visual").boundingBox();
  const entry = await underVideo.boundingBox();
  expect(entry.y).toBeGreaterThanOrEqual(video.y + video.height - 1);
  expect(entry.x + entry.width).toBeGreaterThan(video.x + video.width / 2);
  await underVideo.fill("51.25");
  await expect(form).toHaveValue("51.25");
  await expect(card).toContainText("valeur modifiée");
  await form.fill("50");
  await expect(underVideo).toHaveValue("50");
  await page.getByLabel("Répétitions réalisées", { exact: true }).fill("8");
  await page.getByRole("button", { name: /Valider la série/ }).click();
  await page.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    return state.profiles.elite.workout.exercises[0].sets[0]?.weight === 50;
  });
});
