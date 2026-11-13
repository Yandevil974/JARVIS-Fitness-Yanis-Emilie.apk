import { test, expect } from "@playwright/test";
import { initialState } from "../src/store/model.js";
import { STORAGE_KEY } from "../src/app-identity.js";

for (const profile of ["elite", "emilie"]) {
  test(`vidéo cobra et réserves dans le guide et le chrono (${profile})`, async ({ page }) => {
    const state = initialState();
    state.activeProfile = profile;
    await page.addInitScript(({ key, data }) => localStorage.setItem(key, JSON.stringify(data)), { key: STORAGE_KEY, data: state });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator(".page")).toBeVisible();
    await page.getByRole("button", { name: "Autres modules", exact: true }).click();
    await page.locator(".sidebar").getByRole("button", { name: "Récupération", exact: true }).click();
    await page.getByRole("tab", { name: "Mobilité & stretching" }).click();
    const card = page.locator(".stretch-grid .panel").filter({ has: page.getByRole("heading", { name: "Cobra doux", exact: true }) }).first();
    await card.getByRole("button", { name: "Guide animé" }).click();
    let dialog = page.getByRole("dialog");
    await expect(dialog.locator("video")).toHaveAttribute("src", /stretch-cobra\.mp4/);
    await expect(dialog).toContainText("bassin paraît décoller");
    await dialog.getByRole("button", { name: "Lancer 30 secondes" }).click();
    dialog = page.getByRole("dialog");
    await expect(dialog.locator("video")).toHaveAttribute("src", /stretch-cobra\.mp4/);
    await expect(dialog).toContainText("Ne reproduisez pas cette hauteur");
    await dialog.getByTitle("Agrandir la vidéo").click();
    await expect(page.getByRole("dialog")).toContainText("bassin paraît décoller");
  });
}
