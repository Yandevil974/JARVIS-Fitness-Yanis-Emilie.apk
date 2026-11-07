import { test, expect } from "@playwright/test";

test("dos #22, #24 et #25 : vidéos accompagnées", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Entraînement", exact: true })
    .click();
  await page.getByRole("tab", { name: /Bibliothèque/ }).click();
  await page.evaluate(() => {
    window.__spoken = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.getVoices = () => [];
    window.speechSynthesis.speak = (utterance) =>
      window.__spoken.push(utterance.text);
  });
  const cases = [
    [
      "Pullover haltère plat",
      "pullover-haltere-plat",
      /ne descend pas nettement derrière la tête/i,
      /ne cherchez pas à toucher le sol|sans chercher à toucher le sol/i,
    ],
    [
      "Rowing assis câble unilatéral",
      "rowing-assis-cable-unilateral",
      /pause prolongée/i,
      /une seule main/i,
    ],
    [
      "Rowing à l’élastique",
      "rowing-a-l-elastique",
      /main est masquée/i,
      /fixez-le solidement à un ancrage stable/i,
    ],
  ];
  for (const [name, id, notice, cue] of cases) {
    await page.getByLabel("Rechercher un exercice").fill(name);
    await page
      .getByRole("button", { name: `Démonstration ${name}`, exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name, exact: true });
    await expect(dialog.locator(".movement-video")).toHaveAttribute(
      "src",
      `/videos/${id}.mp4`,
    );
    await expect(dialog.locator(".movement-video")).toHaveAttribute(
      "poster",
      `/videos/posters/${id}.jpg`,
    );
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      notice,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    expect(await page.evaluate(() => window.__spoken.at(-1))).toMatch(cue);
    expect((await page.request.get(`/videos/${id}.mp4`)).status()).toBe(200);
    await dialog
      .getByRole("button", { name: "Fermer", exact: true })
      .last()
      .click();
  }
  expect(errors).toEqual([]);
});
