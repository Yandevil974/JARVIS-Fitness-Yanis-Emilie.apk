import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test("le repos montre la même vidéo que la fiche et ouvre sa consigne", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
  await page.goto("/");
  await startSourceWorkout(page);
  await expect(page.locator(".save-status")).toContainText("Enregistré");
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem(window.__YFE_KEY__));
    const workout = state.profiles.elite.workout;
    workout.currentIndex = 0;
    workout.exercises[0] = {
      ...workout.exercises[0],
      exerciseId: "tractions-supination-chin-up",
      sourceName: "Tractions supination (chin-up)",
      unit: "kg ajouté",
      targetSets: 5,
      repsLow: 6,
      repsHigh: 8,
      repScheme: "6,6,6,8,8",
      sets: [],
    };
    state.updatedAt = Date.now() + 5000;
    localStorage.setItem(window.__YFE_KEY__, JSON.stringify(state));
  });
  await page.reload();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Entraînement", exact: true })
    .click();
  const largeVideo = page.locator(".exercise-stage video.movement-video");
  const nextVideo = page.locator(".rest-next-thumb video");
  await expect(largeVideo).toHaveAttribute(
    "src",
    /\/videos\/tractions-supination-chin-up\.mp4$/,
  );
  await expect(nextVideo).toHaveAttribute(
    "src",
    /\/videos\/tractions-supination-chin-up\.mp4$/,
  );
  await expect(page.locator(".rest-next-thumb img")).toHaveCount(0);
  // Tout le cadre du fichier est visible, même dans une vignette non carrée.
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(largeVideo).toHaveCSS("object-fit", "contain");
    await expect(nextVideo).toHaveCSS("object-fit", "contain");
    const visualBox = await page.locator(".exercise-stage .movement-visual").boundingBox();
    const toolbarBox = await page.locator(".exercise-stage .movement-toolbar").boundingBox();
    expect(toolbarBox.y + toolbarBox.height).toBeLessThanOrEqual(visualBox.y + 1);
    const thumb = await nextVideo.boundingBox();
    expect(thumb.width).toBeGreaterThan(thumb.height);
    expect(await page.locator(".training-command").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });

  await expect(page.locator(".rest-next-video-note")).toContainText(
    "suivez la consigne",
  );
  await page
    .getByRole("button", {
      name: "Agrandir la vidéo : Tractions supination (chin-up)",
    })
    .click();
  await expect(page.locator(".image-viewer video")).toHaveCSS("object-fit", "contain");
  await expect(page.locator(".image-viewer video")).toHaveAttribute(
    "src",
    /\/videos\/tractions-supination-chin-up\.mp4$/,
  );
  await expect(
    page.getByRole("dialog").getByText(/Le mouvement paraît asymétrique/i),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Écouter le descriptif" }),
  ).toBeVisible();
});
