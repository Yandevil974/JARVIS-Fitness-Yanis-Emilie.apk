import { test, expect } from "@playwright/test";
import { initialState } from "../src/store/model.js";
import { STORAGE_KEY } from "../src/app-identity.js";
import { today, addDays } from "../src/engine/utils.js";

for (const width of [390, 320])
  test(`menu alimentaire et rappels au format ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const state = initialState(),
      p = state.profiles.elite,
      now = today();
    Object.assign(p.user, { age: 47, height: 185, weight: 92, sex: "male" });
    p.preferences.dailyReminders = {
      checkin: { date: now },
      review: { date: "" },
    };
    await page.addInitScript(
      ({ key, data }) => localStorage.setItem(key, JSON.stringify(data)),
      { key: STORAGE_KEY, data: state },
    );
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await page
      .getByRole("button", { name: "Programme du jour & rappels" })
      .click();
    const brief = page.getByRole("region", { name: "Synthèse du jour" });
    await expect(brief).toContainText("Bilan de récupération");
    await brief.getByRole("button", { name: "Régler les échéances" }).click();
    await expect(brief.getByLabel("Mensurations")).toBeVisible();
    await brief.getByRole("button", { name: "Plus tard" }).click();
    await expect(brief.locator(".daily-brief-reminder")).toHaveCount(0);
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Fermer", exact: true })
      .click();
    await page.getByRole("button", { name: "Menu de la semaine" }).click();
    await expect(page.locator(".nutrition-week-day")).toHaveCount(7);
    await expect(page.locator(".nutrition-week")).toContainText(
      "pas des repas enregistrés",
    );
    expect(
      await page
        .locator(".nutrition-week")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    await page
      .locator(".nutrition-week-day")
      .first()
      .getByRole("button", { name: "Voir ce jour" })
      .click();
    await expect(page.locator(".nutrition-week")).toHaveCount(0);
    const logs = await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)).profiles.elite.nutrition.logs,
      STORAGE_KEY,
    );
    expect(logs).toEqual([]);
    expect(errors).toEqual([]);
  });

test("comparaison locale de deux photos, sélection et curseur", async ({
  page,
}) => {
  const state = initialState(),
    p = state.profiles.elite;
  p.photos = [
    {
      id: "a",
      date: addDays(today(), -20),
      view: "face",
      data: "/media/6baa655d39de069e.gif",
    },
    {
      id: "b",
      date: today(),
      view: "face",
      data: "/media/6baa655d39de069e.gif",
    },
  ];
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(
    ({ key, data }) => localStorage.setItem(key, JSON.stringify(data)),
    { key: STORAGE_KEY, data: state },
  );
  await page.goto("/");
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Progression", exact: true })
    .click();
  await page.getByRole("tab", { name: "Photos" }).click();
  await expect(page.locator(".photo-pair img")).toHaveCount(2);
  await expect(
    page.getByLabel("Curseur de comparaison avant-après"),
  ).toBeVisible();
  await page.getByLabel("Photo de comparaison").selectOption("a");
  await expect(
    page.locator(".photo-comparison").getByRole("status"),
  ).toContainText("deux photos réelles");
  expect(errors).toEqual([]);
});
