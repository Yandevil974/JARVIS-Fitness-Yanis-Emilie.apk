import { test, expect } from "@playwright/test";

async function openLibrary(page) {
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page.locator(".sidebar").getByRole("button", { name: "Entraînement", exact: true }).click();
  await page.getByRole("tab", { name: /Bibliothèque/ }).click();
}
async function findCard(page, name) {
  await page.getByLabel("Rechercher un exercice").fill(name);
  const button = page.getByRole("button", { name: `Démonstration ${name}`, exact: true });
  await button.scrollIntoViewIfNeeded();
  return button;
}

test("les cartes montrent les vidéos disponibles sans recadrer, et ouvrent la fiche correspondante", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openLibrary(page);
  const name = "Squat au poids du corps";
  const button = await findCard(page, name);
  const video = button.locator("video");
  await expect(video).toHaveAttribute("src", "/videos/squat-au-poids-du-corps.mp4");
  await expect(video).toHaveAttribute("poster", "/videos/posters/squat-au-poids-du-corps.jpg");
  await expect(button.locator("img")).toHaveCount(0);
  await expect(button.locator(".visual-label")).toHaveText("VIDÉO IA · CONSIGNES");
  expect(await video.evaluate(v => v.muted && v.loop && v.playsInline)).toBe(true);
  await expect.poll(() => video.evaluate(v => v.currentTime), { timeout: 15000 }).toBeGreaterThan(0);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await button.scrollIntoViewIfNeeded();
    await expect(video).toHaveCSS("object-fit", "contain");
    await expect(video).toHaveAttribute("src", "/videos/squat-au-poids-du-corps.mp4");
    const box = await video.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(await page.locator(".exercise-library").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  }
  await button.click();
  const dialog = page.getByRole("dialog", { name, exact: true });
  await expect(dialog.locator(".movement-video")).toHaveAttribute("src", "/videos/squat-au-poids-du-corps.mp4");
  await expect(dialog.locator(".movement-coaching-note")).toContainText(/boucle/i);
  await dialog.getByRole("button", { name: "Fermer", exact: true }).last().click();

  const fallback = await findCard(page, "Front squat");
  await expect(fallback.locator("video")).toHaveCount(0);
  await expect(fallback.locator("img")).toHaveAttribute("src", "/thumbs/08e001311b255115.webp");
  await expect.poll(() => fallback.locator("img").evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await fallback.click();
  await expect(page.getByRole("dialog", { name: "Front squat", exact: true }).locator(".movement-media")).toHaveAttribute("src", "/media/08e001311b255115.gif");
  expect(errors).toEqual([]);
});

test("mouvement réduit : poster vidéo, pas de lecture automatique ; retour à la vidéo ensuite", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openLibrary(page);
  const button = await findCard(page, "Squat au poids du corps");
  const video = button.locator("video");
  await expect(video).toHaveAttribute("poster", "/videos/posters/squat-au-poids-du-corps.jpg");
  await expect(video).not.toHaveAttribute("src", /.+/);
  expect(await video.evaluate(v => v.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(video).toHaveAttribute("src", "/videos/squat-au-poids-du-corps.mp4");
});

test("les vidéos avec geste imparfait affichent leur réserve, et un échec vidéo conserve le guide", async ({ page }) => {
  await page.route("**/videos/squat-au-poids-du-corps.mp4", route => route.abort());
  await openLibrary(page);
  const corrected = await findCard(page, "Élévations latérales haltères — myo-reps");
  await expect(corrected.locator("video")).toHaveAttribute("src", "/videos/elevations-laterales-halteres-myo-reps.mp4");
  await expect(corrected.locator("..").locator(".library-video-warning")).toContainText(/buste penché/i);
  const failed = await findCard(page, "Squat au poids du corps");
  await expect(failed.locator("video")).toHaveCount(0);
  await expect(failed.locator("img")).toHaveAttribute("src", "/thumbs/3a18659a669ab642.webp");
  await expect(failed.locator(".visual-label")).toHaveText("GUIDE HUMAIN");
});


test("les vidéos hors écran libèrent leur source et reprennent quand on revient", async ({ page }) => {
  await openLibrary(page);
  const video = page.locator(".exercise-library video.library-video-preview").first();
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("src", /\/videos\/.+\.mp4/);
  await page.getByRole("button", { name: "Afficher 24 exercices supplémentaires" }).scrollIntoViewIfNeeded();
  await expect(video).not.toHaveAttribute("src", /.+/);
  expect(await video.evaluate(v => v.paused)).toBe(true);
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("src", /\/videos\/.+\.mp4/);
});
