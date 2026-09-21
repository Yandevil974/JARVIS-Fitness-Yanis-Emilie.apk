import {
  test,
  expect,
} from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
import { initialState } from "../../../JARVIS-Fitness-Source/src/store/model.js";
import { createTimer } from "../../../JARVIS-Fitness-Source/src/engine/timer.js";
const refURL = process.env.HOME_REFERENCE_URL || "http://127.0.0.1:5184";
async function nav(page, name) {
  const toggle = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  if (await toggle.isVisible()) await toggle.click();
  await page
    .locator(".sidebar")
    .getByRole("button", { name, exact: true })
    .click();
}
function state(profile = "elite", theme = "light") {
  const s = initialState();
  s.activeProfile = profile;
  for (const p of Object.values(s.profiles)) {
    p.timer = null;
    p.preferences.theme = theme;
    p.preferences.voice = false;
    p.preferences.reducedMotion = false;
    p.measurements = [];
  }
  return s;
}
async function open(page, s = state(), url = "/") {
  await page.clock.setFixedTime(new Date("2026-09-21T08:00:00+04:00"));
  await page.addInitScript((s) => {
    if (!localStorage.getItem("jarvis_fitness_v3"))
      localStorage.setItem("jarvis_fitness_v3", JSON.stringify(s));
  }, s);
  await page.goto(url);
  await expect(page.locator(".training-hero")).toBeVisible();
}
test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
});
test.afterEach(async ({ page }) => expect(page.errors).toEqual([]));
for (const profile of ["elite", "emilie"])
  for (const theme of ["light", "dark"])
    test(`home hierarchy, colors, real original card, responsive geometry: ${profile}/${theme}`, async ({
      page,
    }) => {
      await open(page, state(profile, theme));
      const blue = await page
        .locator(".jh-core")
        .evaluate((e) => getComputedStyle(e).backgroundImage);
      expect(blue).toContain("35, 158, 229");
      for (const width of [320, 360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const layout = await page.evaluate(() => {
          const box = (s) => document.querySelector(s).getBoundingClientRect();
          return {
            overflow: document.documentElement.scrollWidth - innerWidth,
            order: [
              box(".training-hero").top,
              box(".js-team").top,
              box(".jf-reminders").top,
            ],
            hero: getComputedStyle(document.querySelector(".training-hero"))
              .backgroundImage,
            emptyPhoto: document
              .querySelector(".jh-first")
              .querySelectorAll(".training-hero").length,
          };
        });
        expect(layout.overflow).toBeLessThanOrEqual(1);
        expect(layout.order[0]).toBeLessThan(layout.order[1]);
        expect(layout.order[1]).toBeLessThanOrEqual(layout.order[2]);
        expect(layout.hero).toContain("training-hero.jpg");
        expect(layout.emptyPhoto).toBe(1);
      }
      await page.setViewportSize({ width: 390, height: 1000 });
      await page.waitForFunction(
        () =>
          document.querySelector(".sidebar").getBoundingClientRect().right <= 1,
      );
      await page.screenshot({
        path: `.cache/home-review/${profile}-${theme}.png`,
      });
      const panels = await page.evaluate(() =>
        [".js-team", ".jf-reminder"].map(
          (s) => getComputedStyle(document.querySelector(s)).backgroundColor,
        ),
      );
      expect(panels[0]).not.toBe(panels[1]);
      expect(panels).not.toContain("rgb(0, 0, 0)");
    });
test("blue rotation, pause, profile switch, persisted themes, and system/app reduced motion", async ({
  page,
}) => {
  await open(page);
  const ring = page.locator(".jh-ring.middle");
  const transform = () => ring.evaluate((e) => getComputedStyle(e).transform);
  const before = await transform();
  await page.waitForTimeout(150);
  expect(await transform()).not.toBe(before);
  await page
    .getByRole("button", { name: "Mettre l’orbe JARVIS en pause", exact: true })
    .click();
  expect(
    await ring.evaluate((e) => getComputedStyle(e).animationPlayState),
  ).toBe("paused");
  const baseline = await page
    .locator(".jh-core")
    .evaluate((e) => getComputedStyle(e).backgroundImage);
  await page.getByRole("radio", { name: "Émilie", exact: true }).check();
  await expect(
    page.getByRole("radio", { name: "Émilie", exact: true }),
  ).toBeChecked();
  expect(
    await page
      .locator(".jh-core")
      .evaluate((e) => getComputedStyle(e).backgroundImage),
  ).toBe(baseline);
  await page
    .getByRole("button", { name: "Passer en sombre", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator(".jh-home")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("radio", { name: "Yanis", exact: true }).check();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await ring.evaluate((e) => getComputedStyle(e).animationName)).toBe(
    "none",
  );
  await expect(page.locator(".jh-orb-toggle")).toBeDisabled();
});
test("active timer stays above decoration and opens original modal, pauses decorative movement", async ({
  page,
}) => {
  const s = state();
  s.profiles.elite.timer = createTimer(
    [{ name: "Repos", seconds: 120 }],
    { type: "rest" },
    new Date("2026-09-21T08:00:00+04:00").getTime(),
  );
  await open(page, s);
  await expect(page.locator(".jh-active")).toBeVisible();
  await expect(page.locator(".jh-orb-toggle")).toBeDisabled();
  await page
    .locator(".jh-active")
    .getByRole("button", { name: "Voir le chrono", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pause", exact: true }),
  ).toBeVisible();
});
for (const profile of ["elite", "emilie"])
  test(`all eleven modules/tabs and original home components conserved: ${profile}`, async ({
    page,
    browser,
  }) => {
    const reference = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      timezoneId: "Indian/Reunion",
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    try {
      await open(page, state(profile));
      await open(reference, state(profile), refURL);
      for (const selector of [
        ".training-hero",
        ".js-team",
        ".jf-reminders",
        ".ja-board",
        ".je-adaptation",
        ".jn-owned",
        ".metrics-grid",
        ".dashboard-rail",
        ".dashboard-lower",
        ".quick-actions",
      ])
        await expect
          .poll(async () => await page.locator(selector).innerText())
          .toBe(await reference.locator(selector).innerText());
      for (const name of [
        "Accueil",
        "JARVIS",
        "Bilan 1RM",
        "Entraînement",
        "Programme",
        "Progression",
        "Cardio & piscine",
        "Récupération",
        "Mon équipe",
        "Nutrition",
        "Mon profil",
      ]) {
        await nav(page, name);
        await nav(reference, name);
        const tabs = await reference.getByRole("tab").allTextContents();
        expect(await page.getByRole("tab").allTextContents()).toEqual(tabs);
        if (name === "Accueil") continue;
        const text = (p) => p.locator("main").innerText();
        await expect.poll(() => text(page)).toBe(await text(reference));
        for (let i = 0; i < tabs.length; i++) {
          await page.getByRole("tab").nth(i).click();
          await reference.getByRole("tab").nth(i).click();
          await expect.poll(() => text(page)).toBe(await text(reference));
        }
      }
    } finally {
      await reference.close();
    }
  });
