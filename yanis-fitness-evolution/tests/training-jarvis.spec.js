import { test, expect } from "@playwright/test";
import { startSourceWorkout } from "./helpers.js";

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`centre JARVIS : commandes et mise en page ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await startSourceWorkout(page);
    const command = page.locator(".training-command");
    await expect(command).toBeVisible();
    await expect(command.locator(".exercise-stage .movement-visual")).toBeVisible();
    await expect(command.locator(".technique-strip")).toContainText("COACHING JARVIS");
    await expect(command.locator(".jarvis-command-core")).toBeVisible();
    await expect(command.locator(".rest-widget .ring")).toBeVisible();
    await expect(command.getByLabel("Charge sous la vidéo", { exact: true })).toBeVisible();
    await expect(command.getByLabel("Charge réalisée", { exact: true })).toBeVisible();
    await expect(command.getByRole("button", { name: /Valider la série/ })).toBeVisible();
    expect(await command.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("le noyau décoratif respecte la réduction de mouvement du système", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await startSourceWorkout(page);
  const ring = page.locator(".session-command-orb i").first();
  await expect(ring).toHaveCSS("animation-name", "none");
});
