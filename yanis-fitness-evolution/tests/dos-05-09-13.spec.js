import { test, expect } from "@playwright/test";

test("dos #05 et #09 à #13 : vidéos et consignes accompagnées", async ({
  page,
}) => {
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
      "Rowing barre buste penché",
      "rowing-barre-buste-penche",
      /buste se redresse/i,
      /redresse le buste/i,
    ],
    [
      "Tirage vertical prise pronation",
      "tirage-vertical-prise-pronation",
      /bras commencent fléchis/i,
      /bras tendus/i,
    ],
    [
      "Tractions (pull-up)",
      "tractions-pull-up",
      /sept secondes/i,
      /deux secondes en bas/i,
    ],
    [
      "Tractions prise neutre (chin-up)",
      "tractions-prise-neutre-chin-up",
      /prise.*ne démontre pas clairement/i,
      /paumes face à face/i,
    ],
    [
      "Rowing haltère un bras, coude ouvert",
      "rowing-haltere-un-bras-coude-ouvert",
      /identique.*numéro 2/i,
      /déforme le bras/i,
    ],
    [
      "Rowing barre EZ supination, buste penché",
      "rowing-barre-ez-supination-buste-penche",
      /buste se relève/i,
      /supination/i,
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
