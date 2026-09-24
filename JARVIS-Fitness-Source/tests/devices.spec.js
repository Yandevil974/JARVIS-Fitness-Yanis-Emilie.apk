import { test, expect } from "@playwright/test";
// Representative WebView widths; One UI zoom, navigation bars and font settings vary.
const configurations = [
  { name: "Galaxy S24", width: 360, height: 780, rail: false },
  { name: "Galaxy Z Fold5 fermé", width: 344, height: 882, rail: false },
  { name: "Galaxy Z Fold5 déplié", width: 690, height: 829, rail: true },
];
for (const cfg of configurations)
  test(`${cfg.name}: responsive layout and all main modules`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: cfg.width, height: cfg.height });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator(".page")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(cfg.width);
    if (cfg.rail) {
      await expect(page.locator(".mobile-nav")).toBeHidden();
      expect(
        (await page.locator(".sidebar").boundingBox()).x,
      ).toBeGreaterThanOrEqual(0);
    } else await expect(page.locator(".mobile-nav")).toBeVisible();
    await page
      .getByRole("button", { name: "Lancer la séance", exact: true })
      .click();
    await expect(page.locator(".immersive-layout")).toBeVisible();
    if (cfg.rail) {
      const center = await page.locator(".workout-stage").boundingBox(),
        side = await page.locator(".session-rail").boundingBox();
      expect(side.x).toBeGreaterThan(center.x + center.width - 1);
      expect(Math.abs(center.y - side.y)).toBeLessThan(3);
    }
    await page.screenshot({
      path: `tests/screenshots/device-${cfg.width}-workout.png`,
      fullPage: true,
    });
    for (const label of [
      "Entraînement",
      "Programme",
      "Progression",
      "Cardio & piscine",
      "Récupération",
      "Nutrition",
      "Mon profil",
    ]) {
      if (!cfg.rail)
        await page
          .getByRole("button", { name: "Autres modules", exact: true })
          .click();
      await page
        .locator(".sidebar")
        .getByRole("button", { name: label, exact: true })
        .click();
      for (let i = 0, n = await page.getByRole("tab").count(); i < n; i++) {
        await page.getByRole("tab").nth(i).click();
        await expect(page.locator(".module-error")).toHaveCount(0);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
          `${cfg.name} • ${label}, tab ${i}`,
        ).toBeLessThanOrEqual(cfg.width + 1);
      }
    }
    expect(errors).toEqual([]);
  });
test("Fold5: folding and unfolding retain the actual current workout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .getByRole("button", { name: "Lancer la séance", exact: true })
    .click();
  await page.getByLabel("Répétitions réalisées", { exact: true }).fill("8");
  await page.getByLabel("RPE de la série", { exact: true }).selectOption("8");
  await page.getByRole("button", { name: /Valider la série/ }).click();
  await page.waitForFunction(() => {
    const s = JSON.parse(localStorage.getItem("jarvis_fitness_v3") || "null");
    return s?.profiles.elite.workout?.exercises[0].sets.length === 1;
  });
  const id = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("jarvis_fitness_v3")).profiles.elite
        .workout.id,
  );
  for (const size of [
    { width: 690, height: 829 },
    { width: 829, height: 690 },
    { width: 344, height: 882 },
  ]) {
    await page.setViewportSize(size);
    await expect(page.locator(".session-topbar")).toContainText("1/36");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(size.width);
    const w = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("jarvis_fitness_v3")).profiles.elite
          .workout,
    );
    expect(w.id).toBe(id);
    expect(w.exercises[0].sets[0].reps).toBe(8);
  }
});
