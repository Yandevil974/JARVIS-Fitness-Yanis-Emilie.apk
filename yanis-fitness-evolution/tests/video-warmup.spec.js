import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

test("JARVIS Brain 1.8.8 reste présent avec le module vidéo", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "JARVIS", exact: true })
    .click();
  await expect(
    page.getByText("Mémoire contrôlée", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("PLATE-FORME IA PERSONNELLE", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("l'échauffement test7 affiche ses vidéos dans le récap et le minuteur", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await startSourceWorkout(page);
  await page.locator(".sequence-warmup").first().click();
  const dialog = page.getByRole("dialog", {
    name: "Bien commencer, c’est déjà progresser.",
  });
  await expect(dialog).toBeVisible();
  const sources = await dialog
    .locator(".warmup-step-thumb.has-video video")
    .evaluateAll((videos) => videos.map((video) => video.getAttribute("src")));
  expect(sources).toEqual(
    expect.arrayContaining([
      "/videos/warmup-mise-en-route.mp4",
      "/videos/warmup-mobilite-epaules.mp4",
      "/videos/warmup-activation-scapulaire.mp4",
    ]),
  );
  await expect(dialog.locator(".warmup-overview video")).toHaveAttribute(
    "src",
    "/videos/warmup-apercu-complet.mp4",
  );
  await dialog
    .getByRole("button", { name: "Lancer l’échauffement guidé", exact: true })
    .click();
  await expect(
    page.locator(".timer-step-visual.has-video video"),
  ).toHaveAttribute("src", "/videos/warmup-mise-en-route.mp4");
  expect(errors).toEqual([]);
});
