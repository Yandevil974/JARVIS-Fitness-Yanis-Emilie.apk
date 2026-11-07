import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

async function state(page) {
  await page.waitForFunction(() => {
    const revision = Number(
      document.querySelector(".save-status")?.dataset.revision,
    );
    const raw = localStorage.getItem(window.__YFE_KEY__);
    return raw && JSON.parse(raw).updatedAt === revision;
  });
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem(window.__YFE_KEY__)),
  );
}

async function openPool(page) {
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Cardio & piscine", exact: true })
    .click();
  await page.getByRole("tab", { name: "Piscine", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Nouvelles séances optionnelles" }),
  ).toBeVisible();
}

async function switchProfile(page, name) {
  await page
    .getByRole("button", { name: "Changer de profil", exact: true })
    .click();
  await page
    .locator(".profile-options")
    .getByRole("button", { name, exact: true })
    .click();
}

test("les deux séances restent manuelles et se lancent sur les deux profils", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();

  for (const [profileId, profileName] of [
    ["elite", "Yanis"],
    ["emilie", "Émilie"],
  ]) {
    if (profileId === "emilie") await switchProfile(page, profileName);
    await openPool(page);
    const before = await state(page);
    const originalPlan = before.profiles[profileId].plan;
    const originalChoices =
      before.profiles[profileId].preferences.cardioChoices;

    for (const [protocolId, title] of [
      ["pyramide-piscine", "Pyramide piscine"],
      ["circuit-aqua-variable", "Circuit aqua à intervalles variables"],
    ]) {
      const card = page
        .locator(".optional-pool-protocols .protocol-card")
        .filter({ hasText: title });
      await expect(
        card.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await card
        .getByRole("button", { name: "Voir le protocole", exact: true })
        .click();
      const protocolDialog = page.getByRole("dialog");
      await expect(
        protocolDialog.getByRole("heading", { name: title }),
      ).toBeVisible();
      await expect(
        protocolDialog.getByRole("button", {
          name: "Lancer le protocole",
          exact: true,
        }),
      ).toBeVisible();
      await protocolDialog
        .getByRole("button", { name: "Lancer le protocole", exact: true })
        .click();

      const timerDialog = page.getByRole("dialog");
      await expect(
        timerDialog.getByRole("heading", { name: title }),
      ).toBeVisible();
      const started = await state(page);
      const timer = started.profiles[profileId].timer;
      expect(timer.meta.protocolId).toBe(protocolId);
      expect(timer.meta.type).toBe(
        protocolId === "circuit-aqua-variable" ? "aqua" : "swim",
      );
      expect(timer.steps[0].img).toMatch(/^\/media\/[^/]+\.gif$/);
      expect(started.profiles[profileId].plan).toEqual(originalPlan);
      expect(started.profiles[profileId].preferences.cardioChoices).toEqual(
        originalChoices,
      );

      await timerDialog
        .getByRole("button", { name: "Arrêter le protocole" })
        .click();
      await page
        .getByRole("button", { name: "Arrêter sans enregistrer", exact: true })
        .click();
      const stopped = await state(page);
      expect(stopped.profiles[profileId].timer).toBeNull();
      expect(stopped.profiles[profileId].plan).toEqual(originalPlan);
      expect(stopped.profiles[profileId].preferences.cardioChoices).toEqual(
        originalChoices,
      );
    }
  }

  expect(pageErrors).toEqual([]);
});
