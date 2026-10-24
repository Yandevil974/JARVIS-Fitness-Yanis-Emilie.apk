import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

test("la vidéo de séance affiche les séries, l'objectif, le repos et la progression", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await startSourceWorkout(page);

  const live = page.locator(".exercise-stage .movement-live");
  await expect(live).toBeVisible();
  await expect(live).toContainText("SÉRIE");
  await expect(live).toContainText("OBJECTIF");
  await expect(live).toContainText("Progression de la séance");
  await expect(live.locator(".movement-live-metric").first()).toContainText(
    "1 /",
  );

  // J1 est organisée en blocs liés : le dernier mouvement du bloc possède
  // le repos de groupe. On le choisit pour vérifier aussi ce compte à rebours.
  await page.locator(".sequence-item").nth(2).click();
  await page.getByLabel("Charge réalisée", { exact: true }).fill("20");
  await page.getByLabel("Répétitions réalisées", { exact: true }).fill("8");
  await page.getByLabel("RPE de la série", { exact: true }).selectOption("8");
  await page.getByRole("button", { name: /Valider la série/ }).click();

  await expect(live.locator(".movement-live-rest")).toBeVisible();
  // Le flux revient au premier mouvement du bloc après la série. On rouvre
  // le mouvement saisi pour vérifier son compteur sans changer le programme.
  await page.locator(".sequence-item").nth(2).click();
  await expect(live.locator(".movement-live-metric").first()).toContainText(
    "2 /",
  );
  await expect(live.locator(".movement-live-progress-label")).toContainText(
    /[1-9]\d* %/,
  );
  expect(errors).toEqual([]);
});
