import { test, expect } from "@playwright/test";

for (const item of [
  { name: "Bras tendu contre la poitrine", file: "stretch-epaule-bras-croise.mp4", gif: "5b3aed6740b23734.gif" },
  { name: "Coude au-dessus de la tête", file: "stretch-triceps-coude.mp4", gif: "10da6a636b6c241f.gif" },
]) {
  test(`guide et chrono proposent ${item.name}, avec GIF en repli`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator(".page")).toBeVisible();
    await page.getByRole("button", { name: "Autres modules", exact: true }).click();
    await page.locator(".sidebar").getByRole("button", { name: "Récupération", exact: true }).click();
    await page.getByRole("tab", { name: "Mobilité & stretching" }).click();
    const card = page.locator(".stretch-grid .panel").filter({ has: page.getByRole("heading", { name: item.name, exact: true }) }).first();
    await card.getByRole("button", { name: "Guide animé" }).click();
    let dialog = page.getByRole("dialog");
    const video = dialog.locator("video");
    await expect(video).toHaveAttribute("src", new RegExp(item.file.replace(".", "\\.")));
    await expect(dialog).toContainText("deux côtés");
    await video.evaluate((el) => el.dispatchEvent(new Event("error")));
    await expect(dialog.locator("img")).toHaveAttribute("src", new RegExp(item.gif.replace(".", "\\.")));
    await dialog.getByRole("button", { name: "Lancer 30 secondes" }).click();
    dialog = page.getByRole("dialog");
    await expect(dialog.locator("video")).toHaveAttribute("src", new RegExp(item.file.replace(".", "\\.")));
    await expect(dialog).toContainText("deux côtés");
  });
}
