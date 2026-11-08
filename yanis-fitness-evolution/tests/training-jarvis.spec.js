import { test, expect } from "@playwright/test";
import { startSourceWorkout } from "./helpers.js";

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 720 }]) {
  test(`centre JARVIS : commandes et largeur à ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await startSourceWorkout(page);
    const command = page.locator(".training-command");
    const assistant = command.getByRole("button", { name: "Adapter la séance avec JARVIS" });
    const layout = command.locator(".immersive-layout");
    const exercise = command.locator(".exercise-stage");
    await expect(command).toBeVisible();
    await expect(exercise.locator(".movement-visual")).toBeVisible();
    await expect(command.locator(".technique-strip")).toContainText("COACHING JARVIS");
    await expect(assistant).toBeVisible();
    await expect(command.getByRole("button", { name: "Adapter", exact: true })).toHaveCount(0);
    await expect(command.locator(".rest-widget .ring")).toBeVisible();
    await expect(command.getByLabel("Charge réalisée", { exact: true })).toBeVisible();
    await expect(command.getByRole("button", { name: /Valider la série/ })).toBeVisible();
    const [layoutBox, exerciseBox, topbarBox, assistantBox, setBox, railBox] = await Promise.all(
      [layout, exercise, command.locator(".session-topbar"), assistant, command.locator(".set-entry"), command.locator(".session-rail")].map(el => el.boundingBox()),
    );
    expect(Math.abs(exerciseBox.x - layoutBox.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(exerciseBox.width - layoutBox.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(assistantBox.x + assistantBox.width - topbarBox.x - topbarBox.width)).toBeLessThanOrEqual(1);
    expect(assistantBox.y - topbarBox.y).toBeLessThanOrEqual(1);
    const visualBox = await exercise.locator(".movement-visual").boundingBox();
    expect(setBox.y).toBeGreaterThanOrEqual(visualBox.y + visualBox.height - 1);
    expect(setBox.y + setBox.height).toBeLessThanOrEqual(exerciseBox.y + exerciseBox.height + 1);
    expect(railBox.y).toBeGreaterThanOrEqual(exerciseBox.y + exerciseBox.height - 1);
    expect(await command.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await assistant.click();
    await expect(page.getByLabel("Votre message à JARVIS")).toBeVisible();
    if (viewport.width < 600) {
      await page.locator(".mobile-nav").getByRole("button", { name: "Entraînement", exact: true }).click();
    } else {
      await page.locator(".sidebar").getByRole("button", { name: "Entraînement", exact: true }).click();
    }
    await expect(page.locator(".exercise-stage")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("le noyau du bouton respecte la réduction de mouvement du système", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await startSourceWorkout(page);
  const ring = page.locator(".session-command-orb i").first();
  await expect(ring).toHaveCSS("animation-name", "none");
});
