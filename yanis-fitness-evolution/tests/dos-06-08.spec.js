import { test, expect } from "@playwright/test";

test("dos #06 à #08 : vidéos accompagnées et #05 est accompagné", async ({
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
  for (const [name, id, notice, cue] of [
    [
      "Rowing barre buste penché — test (3-5 reps)",
      "rowing-barre-buste-penche-test-3-5-reps",
      /buste se redresse/i,
      /redressement/i,
    ],
    [
      "Rowing barre buste penché, pronation",
      "rowing-barre-buste-penche-pronation",
      /buste se redresse/i,
      /redressement/i,
    ],
    [
      "Rowing assis, prise neutre",
      "rowing-assis-prise-neutre",
      /pause en contraction/i,
      /paumes face à face/i,
    ],
  ]) {
    await page.getByLabel("Rechercher un exercice").fill(name);
    await page
      .getByRole("button", { name: `Démonstration ${name}`, exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name, exact: true });
    const video = dialog.locator(".movement-video");
    await expect(video).toHaveAttribute("src", `/videos/${id}.mp4`);
    await expect(video).toHaveAttribute("poster", `/videos/posters/${id}.jpg`);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      notice,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    expect(await page.evaluate(() => window.__spoken.at(-1))).toMatch(cue);
    const response = await page.request.get(`/videos/${id}.mp4`);
    expect(response.status()).toBe(200);
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
  await expect(dialog.locator(".movement-video")).toHaveAttribute(
    "src",
    "/videos/rowing-barre-buste-penche.mp4",
  );
  await expect(dialog.locator(".movement-coaching-note")).toContainText(
    /buste se redresse/i,
  );
  expect(errors).toEqual([]);
});
