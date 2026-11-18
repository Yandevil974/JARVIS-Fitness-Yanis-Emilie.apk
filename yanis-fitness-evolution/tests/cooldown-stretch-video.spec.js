import { test, expect } from "@playwright/test";
import { initialState } from "../src/store/model.js";
import { STORAGE_KEY } from "../src/app-identity.js";
import { stepVideoFor } from "../src/data/step-videos.js";
import { startSourceWorkout } from "./helpers.js";

test.use({ viewport: { width: 390, height: 844 } });

// La page « Terminer en douceur » liste les étirements de la séance. Elle doit
// afficher la vidéo 3D des étirements qui en ont une (comme la fiche détaillée
// et le chrono), et conserver le GIF d'origine pour les autres.
for (const profile of ["elite", "emilie"]) {
  test(`retour au calme : vidéos 3D et GIF conservés (${profile})`, async ({ page }) => {
    const state = initialState();
    state.activeProfile = profile;
    await page.addInitScript(
      ({ key, data }) => localStorage.setItem(key, JSON.stringify(data)),
      { key: STORAGE_KEY, data: state },
    );
    await page.goto("/");
    await startSourceWorkout(page);
    // Sur téléphone, le rappel « Étirements de fin de séance » est le bouton
    // visible ; sur grand écran, c'est l'entrée de la colonne de séance.
    const opener = page.locator(".cooldown-reminder");
    if (await opener.isVisible()) await opener.click();
    else await page.locator(".sequence-cooldown").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Terminer en douceur");

    const rows = dialog.locator(".warmup-detail > div");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    let videos = 0;
    for (let i = 0; i < count; i += 1) {
      const row = rows.nth(i);
      const name = (await row.locator("h3").innerText()).trim();
      const video = stepVideoFor(name);
      if (video) {
        await expect(row.locator("video")).toHaveAttribute("src", new RegExp(video.src.replace(/\./g, "\\.")));
        videos += 1;
      } else {
        await expect(row.locator("video")).toHaveCount(0);
        await expect(row.locator("img.warmup-step-img")).toHaveCount(1);
      }
    }
    // La séance source contient au moins un étirement déjà filmé.
    expect(videos).toBeGreaterThan(0);

    // Agrandir la vidéo ouvre la visionneuse avec les consignes de prudence.
    const filmed = await rows.evaluateAll((els) =>
      els.findIndex((el) => el.querySelector("video")),
    );
    await rows.nth(filmed).locator(".warmup-step-thumb.has-video").click();
    const viewer = page.getByRole("dialog");
    await expect(viewer.locator("video")).toHaveCount(1);
  });
}
