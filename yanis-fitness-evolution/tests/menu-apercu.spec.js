import { test, expect } from "@playwright/test";

for (const width of [360, 1440]) {
  test(`le menu masque l'aperçu sans retirer l'entraînement (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".page")).toBeVisible();
    if (width < 600) {
      await page.getByRole("button", { name: "Autres modules", exact: true }).click();
    }
    const menu = page.locator(".sidebar");
    await expect(menu.getByRole("button", { name: "Aperçu visuels", exact: true })).toHaveCount(0);
    await menu.getByRole("button", { name: "Entraînement", exact: true }).click();
    await expect(page.locator(".page-training")).toBeVisible();
    await expect(page.locator(".module-error")).toHaveCount(0);
  });
}
