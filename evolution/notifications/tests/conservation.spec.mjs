import {
  test,
  expect,
} from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
import fs from "node:fs";
const backup = JSON.parse(
  fs.readFileSync(
    new URL("../../../DOC-20260919-WA0000..json", import.meta.url),
  ),
);
const screens = [
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
];
async function nav(page, label) {
  const menu = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function content(page) {
  return page.locator("main").evaluate((main) => {
    const nodes = [...main.querySelectorAll(".jn-owned")],
      before = nodes.map((n) => n.style.display);
    nodes.forEach((n) => (n.style.display = "none"));
    const text = main.innerText
      .replace(
        "Rappels actualisés dans l’application. Les alertes application fermée se règlent séparément dans « Rappels Android ».",
        "Rappels actualisés dans l’application. Les alertes Android lorsque l’application est fermée ne sont pas encore activées.",
      )
      .replace(/V \d+\.\d+\.\d+/g, "V RELEASE")
      .replace(/\s+/g, " ")
      .trim();
    nodes.forEach((n, i) => (n.style.display = before[i]));
    return text;
  });
}
for (const id of ["elite", "emilie"])
  for (const width of [390, 1440])
    test(`Step 7 retains complete screens and stages 1–6: ${id}, ${width}px`, async ({
      page,
      browser,
    }) => {
      const reference = await browser.newPage({
        viewport: { width, height: 1000 },
        timezoneId: "Indian/Reunion",
      });
      await page.setViewportSize({ width, height: 1000 });
      const errors = [];
      const state = structuredClone(backup);
      state.activeProfile = id;
      for (const p of Object.values(state.profiles)) p.timer = null;
      for (const p of [page, reference]) {
        p.on("pageerror", (e) => errors.push(e.message));
        await p.clock.setFixedTime(new Date("2026-09-20T08:00:00+04:00"));
        await p.addInitScript(
          (s) => localStorage.setItem("jarvis_fitness_v3", JSON.stringify(s)),
          state,
        );
      }
      await page.goto("/");
      await reference.goto(process.env.STEP6_URL || "http://127.0.0.1:5179");
      await expect(page.locator(".jf-reminders")).toBeVisible();
      await expect(reference.locator(".jf-reminders")).toBeVisible();
      for (const screen of screens) {
        await nav(page, screen);
        await nav(reference, screen);
        const tabs = await reference.getByRole("tab").allTextContents();
        expect(await page.getByRole("tab").allTextContents(), screen).toEqual(
          tabs,
        );
        await expect
          .poll(
            async () => (await content(page)) === (await content(reference)),
            { timeout: 15000, message: screen },
          )
          .toBe(true);
        for (let i = 0; i < tabs.length; i++) {
          for (const p of [page, reference]) {
            const tab = p.getByRole("tab").nth(i);
            await tab.evaluate((n) =>
              n.scrollIntoView({ block: "center", inline: "center" }),
            );
            await tab.click();
          }
          await expect
            .poll(
              async () => (await content(page)) === (await content(reference)),
              { timeout: 15000, message: `${screen}/${tabs[i]}` },
            )
            .toBe(true);
        }
      }
      expect(errors).toEqual([]);
      await reference.close();
    });
