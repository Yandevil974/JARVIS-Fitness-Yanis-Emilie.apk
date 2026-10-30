import { test, expect } from "@playwright/test";

test("dos #01 à #04 lisent leurs vidéos et leurs consignes, #05 reste sur son GIF", async ({
  page,
}) => {
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
      name: "Tirage vertical prise neutre",
      id: "tirage-vertical-prise-neutre",
      cue: /paumes face à face/i,
      notice: /prise.*câble/i,
    },
    {
      name: "Rowing haltère un bras",
      id: "rowing-haltere-un-bras",
      cue: /bassin stable/i,
      notice: /déforme le bras/i,
    },
    {
      name: "Tirage horizontal à la poulie",
      id: "tirage-horizontal-a-la-poulie",
      cue: /nombril/i,
      notice: /câble/i,
    },
    {
      name: "Tirage vertical prise large",
      id: "tirage-vertical-prise-large",
      cue: /prise large/i,
      notice: /barre descend bas/i,
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
  const name = "Rowing barre buste penché";
  await page.getByLabel("Rechercher un exercice").fill(name);
  await page
    .getByRole("button", { name: `Démonstration ${name}`, exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name, exact: true });
  await expect(dialog.locator(".movement-video")).toHaveCount(0);
  await expect(dialog.locator(".movement-media")).toHaveAttribute(
    "src",
    "/media/f00bd9ef43286ee0.gif",
  );
  expect(errors).toEqual([]);
});
