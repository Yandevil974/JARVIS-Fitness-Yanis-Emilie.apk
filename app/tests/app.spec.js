import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { initialState } from "../src/store/model.js";
async function ready(page) {
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await expect(page.locator(".save-status")).toContainText("Enregistré");
}
async function nav(page, label) {
  if (page.viewportSize().width < 600)
    await page
      .getByRole("button", { name: "Autres modules", exact: true })
      .click();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function state(page) {
  await page.waitForFunction(() => {
    const current = Number(
      document.querySelector(".save-status")?.dataset.revision,
    );
    const raw = localStorage.getItem("jarvis_fitness_v3");
    return raw && JSON.parse(raw).updatedAt === current;
  });
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("jarvis_fitness_v3")),
  );
}
async function profile(page, name) {
  if (page.viewportSize().width < 600)
    await page
      .getByRole("button", { name: "Autres modules", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Changer de profil", exact: true })
    .click();
  await page
    .locator(".profile-options")
    .getByRole("button", { name, exact: true })
    .click();
}
for (const width of [1440, 840, 344, 360])
  test(`All main screens, source names and realistic humans at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await ready(page);
    await expect(
      page.getByRole("heading", { name: "Bonjour, Yanis." }),
    ).toBeVisible();
    await expect(page.locator(".realistic-anatomy").first()).toBeVisible();
    const s = await state(page);
    expect(s.profiles.elite.plan.source).toBe("legacy");
    expect(s.profiles.emilie.plan.source).toBe("legacy");
    for (const label of [
      "JARVIS",
      "Entraînement",
      "Programme",
      "Progression",
      "Cardio & piscine",
      "Récupération",
      "Nutrition",
      "Mon profil",
    ]) {
      await nav(page, label);
      const count = await page.getByRole("tab").count();
      for (let i = 0; i < count; i++) {
        await page.getByRole("tab").nth(i).click();
        await expect(page.locator(".module-error")).toHaveCount(0);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + 1);
    }
    await profile(page, "Émilie");
    await expect(
      page.getByRole("heading", { name: "Bonjour, Émilie." }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
test("A real set survives shortening, partial completion, reload and profile switches", async ({
  page,
}) => {
  await ready(page);
  await page
    .getByRole("button", { name: "Lancer la séance", exact: true })
    .click();
  await page.getByLabel("Répétitions réalisées", { exact: true }).fill("8");
  await page.getByLabel("RPE de la série", { exact: true }).selectOption("8");
  await page.getByRole("button", { name: /Valider la série/ }).click();
  let s = await state(page);
  expect(s.profiles.elite.workout.exercises[0].sets).toHaveLength(1);
  const previousTimer = s.profiles.elite.timer?.id;
  const previousCount = s.profiles.elite.workout.exercises.reduce(
    (n, e) => n + e.targetSets,
    0,
  );
  await page.getByRole("button", { name: "Adapter", exact: true }).click();
  await page
    .getByLabel("Votre message à JARVIS")
    .fill("Je n’ai que 30 minutes");
  await page
    .getByRole("button", { name: "Envoyer à JARVIS", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Appliquer l’adaptation", exact: true })
    .click();
  s = await state(page);
  expect(s.profiles.elite.workout.exercises[0].sets).toHaveLength(1);
  expect(
    s.profiles.elite.workout.exercises.reduce((n, e) => n + e.targetSets, 0),
  ).toBeLessThan(previousCount);
  await nav(page, "Cardio & piscine");
  await page
    .getByRole("button", { name: "Lancer le cardio guidé", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Clôturer votre séance" }),
  ).toBeVisible();
  s = await state(page);
  expect(s.profiles.elite.timer?.id).toBe(previousTimer);
  await page
    .getByRole("button", { name: "Sauvegarder la séance", exact: true })
    .click();
  s = await state(page);
  expect(s.profiles.elite.sessions).toHaveLength(1);
  expect(s.profiles.elite.sessions[0].status).toBe("partial");
  expect(s.profiles.elite.workout).toBeNull();
  await profile(page, "Émilie");
  s = await state(page);
  expect(s.profiles.emilie.sessions).toHaveLength(0);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Bonjour, Émilie." }),
  ).toBeVisible();
  await profile(page, "Yanis");
  s = await state(page);
  expect(s.profiles.elite.sessions[0].exercises[0].sets[0].reps).toBe(8);
});
test("Performance logging, force estimate and non-destructive JSON/HTML backup round trips", async ({
  page,
}) => {
  await ready(page);
  await nav(page, "Entraînement");
  await page
    .getByRole("button", { name: "Saisie rapide", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Exercice", { exact: true })
    .selectOption("developpe-couche-barre");
  await dialog.getByLabel("Charge réalisée (kg)", { exact: true }).fill("80");
  await dialog.getByLabel("Répétitions réalisées", { exact: true }).fill("10");
  await dialog.getByLabel("RPE (facultatif)", { exact: true }).fill("8");
  await expect(dialog.locator(".calculation-preview")).toContainText("106,7");
  await dialog
    .getByRole("button", { name: "Enregistrer la série", exact: true })
    .click();
  let s = await state(page);
  expect(s.profiles.elite.sessions[0].exercises[0].sets[0].weight).toBe(80);
  expect(s.profiles.emilie.sessions).toHaveLength(0);
  await nav(page, "Mon profil");
  await page.getByRole("tab", { name: "Données & sauvegardes" }).click();
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter la sauvegarde JSON", exact: true })
    .click();
  const dl = await downloadEvent;
  const exported = JSON.parse(fs.readFileSync(await dl.path(), "utf8"));
  expect(exported.profiles.elite.sessions).toHaveLength(1);
  const htmlEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Sauvegarde HTML lisible", exact: true })
    .click();
  const html = await htmlEvent;
  await page.locator("input[type=file]").setInputFiles({
    name: "backup.html",
    mimeType: "text/html",
    buffer: fs.readFileSync(await html.path()),
  });
  await expect(page.locator(".import-preview")).toContainText(
    "remplacera les deux profils",
  );
  await page
    .locator(".import-preview")
    .getByRole("button", { name: "Sauvegarder puis importer" })
    .click();
  s = await state(page);
  expect(s.profiles.elite.sessions).toHaveLength(1);
  expect(s.profiles.emilie.sessions).toHaveLength(0);
});
test("Cardio timer requires explicit actual results and never assumes distance or rounds", async ({
  page,
}) => {
  await ready(page);
  await nav(page, "Cardio & piscine");
  await page.getByRole("tab", { name: "Piscine", exact: true }).click();
  await page
    .getByRole("button", { name: "Lancer le fractionné", exact: true })
    .click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  let s = await state(page);
  expect(s.profiles.elite.activities).toHaveLength(0);
  expect(s.profiles.elite.timer.paused).toBe(true);
  await page.reload();
  s = await state(page);
  expect(s.profiles.elite.timer.paused).toBe(true);
  await page.locator(".floating-timer").click();
  await page
    .getByRole("button", { name: "Arrêter le protocole", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Arrêter sans enregistrer", exact: true })
    .click();
  s = await state(page);
  expect(s.profiles.elite.activities).toHaveLength(0);
  await nav(page, "Cardio & piscine");
  await page.getByRole("button", { name: /Déjà effectué/ }).click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Discipline", { exact: true }).selectOption("swim");
  await expect(
    d.getByLabel("Distance réalisée (m)", { exact: true }),
  ).toHaveValue("");
  await expect(
    d.getByLabel("Séries / rounds réalisés", { exact: true }),
  ).toHaveValue("");
  await d.getByLabel("Durée réalisée (min)", { exact: true }).fill("20");
  await d.getByLabel("Distance réalisée (m)", { exact: true }).fill("500");
  await d.getByLabel("RPE de séance (facultatif)", { exact: true }).fill("6");
  await d
    .getByRole("button", { name: "Confirmer et enregistrer", exact: true })
    .click();
  s = await state(page);
  expect(s.profiles.elite.activities[0].durationSec).toBe(1200);
  expect(s.profiles.elite.activities[0].distance).toBe(500);
  expect(s.profiles.elite.activities[0].rounds).toBeNull();
});
test("A corrupted local save is quarantined, not overwritten by fresh defaults", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("corrupt-seeded")) {
      localStorage.setItem(
        "jarvis_fitness_v3",
        '{"schemaVersion":999,"data":"KEEP-ME"}',
      );
      sessionStorage.setItem("corrupt-seeded", "1");
    }
  });
  await page.goto("/");
  await expect(page.locator(".persistent-warning")).toContainText("bloqué");
  await page.waitForTimeout(450);
  expect(
    await page.evaluate(() => localStorage.getItem("jarvis_fitness_v3")),
  ).toContain("KEEP-ME");
});
