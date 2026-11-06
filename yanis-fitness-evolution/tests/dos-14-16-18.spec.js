import { test, expect } from "@playwright/test";

test("dos #14 à #18 lisent les vidéos accompagnées", async ({ page }) => {
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
      "Tractions supination (chin-up)",
      "tractions-supination-chin-up",
      /supination n'est pas nettement vérifiable/i,
      /deux bras de façon symétrique/i,
    ],
    [
      "Rowing assis + étirement",
      "rowing-assis-etirement",
      /étirement complet/i,
      /étirement confortable/i,
    ],
    [
      "Rowing haltère buste penché",
      "rowing-haltere-buste-penche",
      /écarte les coudes/i,
      /coudes dirigés vers l'arrière et les hanches/i,
    ],
    [
      "Tractions prise large",
      "tractions-prise-large",
      /menton/i,
      /sans tirer derrière la nuque/i,
    ],
    [
      "Rowing assis au cou",
      "rowing-assis-au-cou",
      /arrêtez en cas de douleur/i,
      /arrêtez et choisissez un tirage devant/i,
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
