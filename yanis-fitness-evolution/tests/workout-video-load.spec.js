import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test.use({ viewport: { width: 390, height: 844 } });

test("un seul formulaire sous la vidéo valide la charge et tous les détails de la série", async ({ page }) => {
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
    target.recommendation = { label: "Réduire légèrement", reason: "Fatigue : −5 % proposés.", weight: 50, color: "orange" };
    target.sets = [];
    state.updatedAt = Date.now() + 5000;
    localStorage.setItem(window.__YFE_KEY__, JSON.stringify(state));
  });
  await page.reload();
  await page.locator(".mobile-nav").getByRole("button", { name: "Entraînement", exact: true }).click();
  const section = page.getByRole("region", { name: "Saisie de la série" });
  const charge = page.getByLabel("Charge réalisée", { exact: true });
  await expect(charge).toHaveCount(1);
  await expect(charge).toHaveValue("52.5");
  await expect(section).toContainText("Hausse automatique : 50 → 52,5 kg");
  await expect(section.getByRole("button", { name: /Valider la série/ })).toBeVisible();
  await expect(page.locator(".session-recommendation")).toContainText("Recommandation enregistrée : 50 kg");
  await expect(page.locator(".session-recommendation")).toContainText("Elle diffère de la charge saisie");
  await expect(page.getByRole("button", { name: "Appliquer cette charge" })).toHaveCount(0);
  const video = await page.locator(".exercise-stage .movement-visual").boundingBox();
  const sectionBox = await section.boundingBox();
  const inputBox = await charge.boundingBox();
  expect(sectionBox.y).toBeGreaterThanOrEqual(video.y + video.height - 1);
  expect(inputBox.x + inputBox.width).toBeGreaterThan(video.x + video.width / 2);
  await charge.fill("51.25");
  await expect(section).toContainText("valeur modifiée");
  await section.getByLabel("Répétitions réalisées", { exact: true }).fill("8");
  await section.getByLabel("RPE de la série").selectOption("8");
  await section.getByText("RIR et note de série").click();
  await section.getByLabel("Répétitions en réserve").fill("2");
  await section.getByLabel("Note", { exact: true }).fill("Bonne technique");
  await section.getByRole("button", { name: /Valider la série/ }).click();
  await page.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    const set = state.profiles.elite.workout.exercises[0].sets[0];
    return set?.weight === 51.25 && set.reps === 8 && set.rpe === 8 && set.rir === 2 && set.note === "Bonne technique";
  });
});

test("exercice suspendu : aucune validation n’est proposée et les séries restent visibles", async ({ page }) => {
  await page.addInitScript((key) => { window.__YFE_KEY__ = key; }, STORAGE_KEY);
  await page.goto("/");
  await startSourceWorkout(page);
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    const workout = state.profiles.elite.workout;
    workout.currentIndex = 0;
    workout.safetyStop = true;
    workout.exercises[0].sets = [{ id: "previous", weight: 40, reps: 8, rpe: 7, unit: workout.exercises[0].unit, completed: true }];
    state.updatedAt = Date.now() + 5000;
    localStorage.setItem(window.__YFE_KEY__, JSON.stringify(state));
  });
  await page.reload();
  await page.locator(".mobile-nav").getByRole("button", { name: "Entraînement", exact: true }).click();
  const section = page.getByRole("region", { name: "Saisie de la série" });
  await expect(section).toContainText("Exercice suspendu");
  await expect(section.getByRole("button", { name: /Valider la série/ })).toHaveCount(0);
  await expect(section.locator(".logged-sets")).toContainText("40 kg");
  await expect(section.getByRole("button", { name: "Corriger la série 1" })).toBeVisible();
});

test("exercice chronométré : saisie en secondes puis état terminé", async ({ page }) => {
  await page.addInitScript((key) => { window.__YFE_KEY__ = key; }, STORAGE_KEY);
  await page.goto("/");
  await startSourceWorkout(page);
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    const workout = state.profiles.elite.workout;
    workout.currentIndex = 0;
    workout.exercises[0] = { ...workout.exercises[0], exerciseId: "gainage-planche", sourceName: "Gainage planche", unit: "secondes", seconds: 30, targetSets: 1, sets: [] };
    state.updatedAt = Date.now() + 5000;
    localStorage.setItem(window.__YFE_KEY__, JSON.stringify(state));
  });
  await page.reload();
  await page.locator(".mobile-nav").getByRole("button", { name: "Entraînement", exact: true }).click();
  const section = page.getByRole("region", { name: "Saisie de la série" });
  await expect(section).toContainText("AU TEMPS");
  await expect(section.getByLabel("Charge réalisée", { exact: true })).toHaveCount(0);
  await section.getByLabel("Secondes réalisées").fill("35");
  await section.getByRole("button", { name: /Valider la série/ }).click();
  await page.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    const set = state.profiles.elite.workout.exercises[0].sets[0];
    return set?.reps === 35 && set.weight === null;
  });
  await page.locator(".sequence-item").first().click();
  await expect(section).toContainText("Toutes les séries prévues sont sauvegardées");
  await expect(section.getByRole("button", { name: /Valider la série/ })).toHaveCount(0);
});
