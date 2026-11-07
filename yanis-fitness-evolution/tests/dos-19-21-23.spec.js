import { test, expect } from "@playwright/test";

test("dos #19, #20, #21 et #23 : vidéos accompagnées ; #22 conserve son GIF", async ({
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
      "Lean away pull-ups",
      "lean-away-pull-ups",
      /identique.*numéro 10/i,
      /ne montre pas clairement l'inclinaison/i,
    ],
    [
      "Rowing haltère un bras, prise neutre",
      "rowing-haltere-un-bras-prise-neutre",
      /bras se déforme/i,
      /ne copiez pas ce défaut/i,
    ],
    [
      "Pullover câble bras tendus",
      "pullover-cable-bras-tendus",
      /prise et l'attache.*peu visibles/i,
      /coudes souples/i,
    ],
    [
      "Tirage vertical lean away",
      "tirage-vertical-lean-away",
      /quart de répétition/i,
      /quart supplémentaire ajoute du temps/i,
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
  const name = "Rowing assis câble unilatéral";
  await page.getByLabel("Rechercher un exercice").fill(name);
  await page
    .getByRole("button", { name: `Démonstration ${name}`, exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name, exact: true });
  await expect(dialog.locator(".movement-video")).toHaveCount(0);
  await expect(dialog.locator(".movement-media")).toHaveAttribute(
    "src",
    "/media/cfa999e3a88716f6.gif",
  );
  expect(errors).toEqual([]);
});
