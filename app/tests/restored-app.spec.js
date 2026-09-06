import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { migrateLegacy, initialState } from "../src/store/model.js";
import { restoreProfile } from "../src/store/restoration.js";
const sourceFile =
  process.env.JARVIS_TEST_BACKUP ||
  "/home/user/uploads/transformation_12_mois_sauvegarde.json";
const hasSource = fs.existsSync(sourceFile);
const raw = hasSource ? JSON.parse(fs.readFileSync(sourceFile, "utf8")) : null;
const profile = raw
  ? migrateLegacy(raw, "elite")
  : initialState().profiles.elite;
test.skip(
  !hasSource,
  "Le JSON personnel de Yanis n’est pas inclus dans le code source.",
);
const backup = {
  format: "jarvis-profile",
  schemaVersion: 3,
  profileId: "elite",
  profile,
  sourceFingerprint: profile.sourceDataFingerprint,
  sourceFile: "transformation_12_mois_sauvegarde.json",
};
const restored = restoreProfile(initialState(), backup).state;
async function ready(page, state = restored) {
  await page.addInitScript((s) => (globalThis.__JARVIS_PRELOAD__ = s), state);
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
}
async function saved(page) {
  await page.waitForFunction(() => {
    const r = JSON.parse(localStorage.getItem("jarvis_fitness_v3") || "null");
    return (
      r?.updatedAt ===
      Number(document.querySelector(".save-status")?.dataset.revision)
    );
  });
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("jarvis_fitness_v3")),
  );
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
test("Attached backup auto-restores only an empty Yanis profile and exposes all saved records", async ({
  page,
}) => {
  await page.addInitScript(
    (b) => (globalThis.__JARVIS_BUNDLED_BACKUP__ = b),
    backup,
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Bonjour, Yanis." }),
  ).toBeVisible();
  await expect(page.locator(".metrics-grid")).toContainText("91,3");
  const s = await saved(page);
  expect(s.profiles.elite.sessions).toHaveLength(12);
  expect(s.profiles.elite.dayReports).toHaveLength(4);
  expect(s.profiles.elite.photos).toHaveLength(8);
  expect(s.profiles.elite.teamReviews).toHaveLength(3);
  expect(s.profiles.emilie.sessions).toHaveLength(0);
  expect(s.profiles.elite.plan.startDate).toBe("2026-08-10");
  await page.reload();
  const r = await saved(page);
  expect(r.profiles.elite.sessions).toHaveLength(12);
  expect(r.profiles.elite.restoreReceipts).toHaveLength(1);
});
test("Existing user data is not silently overwritten; a restoration preview is offered", async ({
  page,
}) => {
  const existing = initialState();
  existing.profiles.elite.user.sourceConfirmed = true;
  existing.profiles.elite.user.age = 48;
  await page.addInitScript(
    (b) => (globalThis.__JARVIS_BUNDLED_BACKUP__ = b),
    backup,
  );
  await ready(page, existing);
  await expect(
    page.getByRole("button", { name: "Restaurer mes données", exact: true }),
  ).toBeVisible();
  expect((await saved(page)).profiles.elite.sessions).toHaveLength(0);
  await page
    .getByRole("button", { name: "Restaurer mes données", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("387");
  const event = page.waitForEvent("download");
  await page
    .getByRole("button", {
      name: "Sauvegarder puis restaurer Yanis",
      exact: true,
    })
    .click();
  await event;
  const s = await saved(page);
  expect(s.profiles.elite.user.age).toBe(48);
  expect(s.profiles.elite.sessions).toHaveLength(12);
  expect(s.profiles.elite.teamReviews[0].advice).toHaveLength(5);
  expect(s.profiles.emilie.sessions).toHaveLength(0);
});
for (const width of [344, 690, 1440])
  test(`METCON plus pool, all eight advisors and original feedback at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await ready(page);
    await expect(page.locator(".week-deload-note")).toContainText(
      "Pas de METCON intense",
    );
    await page
      .getByRole("button", { name: "Semaine suivante", exact: true })
      .click();
    await expect(page.locator(".day-discipline.metcon")).toHaveCount(2);
    await expect(page.locator(".day-discipline.swim")).toHaveCount(2);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.locator(".full-week-strip .discipline-metcon").first().click();
    await page.locator(".day-event-card").click();
    await expect(page.getByRole("dialog")).toContainText(
      "METCON elliptique + piscine",
    );
    await expect(page.locator(".source-combo-block.pool li")).not.toHaveCount(
      0,
    );
    await page.getByRole("button", { name: "Fermer", exact: true }).click();
    await nav(page, "Mon équipe");
    await expect(page.locator(".team-advisor")).toHaveCount(8);
    await page.getByRole("tab", { name: /Retours enregistrés/ }).click();
    await expect(page.locator(".saved-team-review")).toHaveCount(3);
    await expect(page.locator(".saved-team-review").first()).toContainText(
      "Ne rien.changer dans la programmation",
    );
    await expect(page.locator(".saved-advices")).toContainText([
      "Adhérence : 2/3 séances.",
      "Intensité perçue élevée",
      "Intensité perçue élevée",
    ]);
    expect(errors).toEqual([]);
  });
test("Original JSON imports through the normal file picker without altering Emilie", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await nav(page, "Mon profil");
  await page.getByRole("tab", { name: "Données & sauvegardes" }).click();
  await page
    .locator("input[type=file]")
    .setInputFiles("/home/user/uploads/transformation_12_mois_sauvegarde.json");
  await expect(page.locator(".import-preview")).toContainText(
    "L’autre profil restera intact",
  );
  const dl = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Sauvegarder puis importer", exact: true })
    .click();
  await dl;
  const s = await saved(page);
  expect(s.profiles.elite.sessions).toHaveLength(12);
  expect(s.profiles.elite.teamReviews).toHaveLength(3);
  expect(s.profiles.emilie.sessions).toHaveLength(0);
});
test("Combined timer does not auto-record results, and stopping can preserve only the actual first block", async ({
  page,
}) => {
  await ready(page);
  await page
    .getByRole("button", { name: "Semaine suivante", exact: true })
    .click();
  await page.locator(".full-week-strip .discipline-metcon").first().click();
  await page.locator(".day-event-card").click();
  await page
    .getByRole("button", { name: "Lancer la séance combinée", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "METCON elliptique + piscine",
  );
  expect((await saved(page)).profiles.elite.activities).toHaveLength(0);
  await page
    .getByRole("button", { name: "Arrêter le protocole", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Conserver mes résultats partiels",
      exact: true,
    })
    .click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Durée réelle cardio (min)", { exact: true }).fill("12");
  await expect(
    d.getByLabel("Durée réelle piscine (min)", { exact: true }),
  ).toHaveValue("");
  await expect(
    d.getByLabel("Distance réellement nagée (m)", { exact: true }),
  ).toHaveValue("");
  await d
    .getByRole("button", { name: "Confirmer mes résultats réels", exact: true })
    .click();
  const s = await saved(page);
  expect(s.profiles.elite.activities).toHaveLength(1);
  expect(s.profiles.elite.activities[0].durationSec).toBe(720);
  expect(s.profiles.elite.activities[0].type).toBe("cardio");
  expect(s.profiles.elite.activities[0].distance).toBeNull();
  expect(s.profiles.elite.timer).toBeNull();
});
test("Imported incomplete sets remain editable without inventing repetitions", async ({
  page,
}) => {
  await ready(page);
  await nav(page, "Entraînement");
  await page
    .getByRole("tab", { name: "Journal du fichier", exact: true })
    .click();
  await page
    .getByLabel("Date du journal d’origine", { exact: true })
    .selectOption("2026-09-03");
  await expect(page.locator(".source-journal-rows")).toContainText(
    "Non renseigné",
  );
  await page
    .getByRole("button", {
      name: "Ouvrir les données restaurées / corriger",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Corriger", exact: true })
    .first()
    .click();
  await page.getByLabel("Charge", { exact: true }).fill("16");
  await page
    .getByRole("button", { name: "Enregistrer la correction", exact: true })
    .click();
  const s = await saved(page);
  const set = s.profiles.elite.sessions.find((s) => s.date === "2026-09-03")
    .exercises[0].sets[0];
  expect(set.weight).toBe(16);
  expect(set.reps).toBeNull();
  expect(set.count).toBe(2);
});
