import { test, expect } from "@playwright/test";

test("pectoraux #19 à #23 : cinq vidéos corrigées", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
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
    {
      name: "Câbles croisés + rotation externe",
      id: "cables-croises-rotation-externe",
      cue: /rotation externe/i,
      notice: /pas clairement démontrée/i,
    },
    {
      name: "Développé couché plat, inertie depuis les pins",
      id: "developpe-couche-plat-inertie-depuis-les-pins",
      cue: /pause complète/i,
      notice: /support de la barre par les deux pins/i,
    },
    {
      name: "Développé couché barre",
      id: "developpe-couche-barre",
      cue: /prise standard/i,
      notice: /identique.*#11.*#10/i,
    },
    {
      name: "Développé couché — test 1RM",
      id: "developpe-couche-test-1rm",
      cue: /pareur compétent/i,
      notice: /réglage sûr/i,
    },
    {
      name: "Pompes",
      id: "pompes",
      cue: /trois secondes/i,
      notice: /arrêt en bas/i,
    },
  ];
  for (const item of cases) {
    await page.getByLabel("Rechercher un exercice").fill(item.name);
    await page
      .getByRole("button", { name: `Démonstration ${item.name}`, exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: item.name, exact: true });
    const video = dialog.locator(".movement-video");
    await expect(video).toHaveAttribute("src", `/videos/${item.id}.mp4`);
    await expect(video).toHaveAttribute(
      "poster",
      `/videos/posters/${item.id}.jpg`,
    );
    expect(
      await video.evaluate(
        (element) => element.muted && element.loop && element.playsInline,
      ),
    ).toBe(true);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    expect(await page.evaluate(() => window.__spoken.at(-1))).toMatch(item.cue);
    await dialog
      .getByRole("button", { name: "Fermer", exact: true })
      .last()
      .click();
  }
  expect(errors).toEqual([]);
});
