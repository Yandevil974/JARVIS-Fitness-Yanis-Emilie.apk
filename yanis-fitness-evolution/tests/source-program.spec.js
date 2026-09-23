import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
test.beforeEach(async ({ page }) => {
  await page.addInitScript((k) => {
    window.__YFE_KEY__ = k;
  }, STORAGE_KEY);
});
import { legacy } from "../src/data/library.js";
import { startSourceWorkout } from "./helpers.js";
async function synced(page) {
  await page.waitForFunction(() => {
    const current = Number(
      document.querySelector(".save-status")?.dataset.revision,
    );
    const raw = localStorage.getItem(window.__YFE_KEY__);
    return raw && JSON.parse(raw).updatedAt === current;
  });
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem(window.__YFE_KEY__)),
  );
}
for (const id of ["elite", "emilie"])
  test(`Original ${id} programme is the main view, and its exact exercises can be launched`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");
    await expect(page.locator(".page")).toBeVisible();
    await page
      .locator(".mobile-nav")
      .getByRole("button", { name: "Programme", exact: true })
      .click();
    await expect(
      page.getByRole("tab", { name: "Mon programme", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    if (id === "emilie")
      await page
        .getByLabel("Programme du profil", { exact: true })
        .selectOption("emilie");
    await expect(
      page.getByRole("heading", {
        name: `Le programme de ${id === "elite" ? "Yanis" : "Émilie"}.`,
      }),
    ).toBeVisible();
    await page
      .getByLabel("Mois du programme", { exact: true })
      .selectOption("2");
    const row = page.locator('[data-phase="2"] [data-source-session="J1"]');
    const expected = legacy[id].PROGRAM[2].sessions.J1;
    expect(
      await row
        .locator("[data-source-exercise]")
        .evaluateAll((es) => es.map((e) => e.dataset.sourceExercise)),
    ).toEqual(expected.exos.map((e) => e[0]));
    await page.screenshot({
      path: `tests/screenshots/blue-program-${id}.png`,
      fullPage: true,
    });
    await row.getByRole("button", { name: "Démarrer J1", exact: true }).click();
    await expect(page.locator(".session-topbar")).toContainText(expected.nom);
    const root = await synced(page),
      w = root.profiles[id].workout;
    expect(w.preservePrescription).toBe(true);
    expect(w.exercises.map((e) => e.sourceName)).toEqual(
      expected.exos.map((e) => e[0]),
    );
    expect(w.exercises.map((e) => e.targetSets)).toEqual(
      expected.exos.map((e) => parseInt(e[2])),
    );
    expect(w.exercises.map((e) => e.rest)).toEqual(
      expected.exos.map((e) => Number(e[5])),
    );
    expect(
      root.profiles[id === "elite" ? "emilie" : "elite"].workout,
    ).toBeNull();
  });
test("Recording a poor check-in does not alter the programme without the explicit checkbox", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  // Le 1er jour du plan peut être une journée METCON (sans exercices) selon
  // la date : on référence la 1re séance d'exercices du plan.
  const firstStrength = (plan) =>
    plan.sessions.find((s) => (s.exercises || []).length > 0);
  const original = firstStrength(
    (await synced(page)).profiles.elite.plan,
  ).exercises.map((e) => ({
    id: e.exerciseId,
    sets: e.targetSets,
  }));
  await page
    .getByRole("button", { name: "Faire mon bilan", exact: true })
    .click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Sommeil (heures)", { exact: true }).fill("2");
  await expect(
    d.getByRole("checkbox", { name: /J’autorise un allégement/ }),
  ).not.toBeChecked();
  await d
    .getByRole("button", { name: "Enregistrer mon bilan", exact: true })
    .click();
  const after = (await synced(page)).profiles.elite;
  expect(
    firstStrength(after.plan).exercises.map((e) => ({
      id: e.exerciseId,
      sets: e.targetSets,
    })),
  ).toEqual(original);
  expect(after.checkIns).not.toEqual({});
  // Séance lancée : la J1 de la phase 1 du programme source (déterministe).
  // Un bilan pauvre SANS la case d’allégement ne doit pas la modifier.
  await startSourceWorkout(page);
  const workout = (await synced(page)).profiles.elite.workout;
  const j1 = legacy.elite.PROGRAM[1].sessions.J1;
  expect(
    workout.exercises.map((e) => e.sourceName || e.name),
  ).toEqual(j1.exos.map((e) => e[0]));
  expect(workout.exercises.map((e) => e.targetSets)).toEqual(
    j1.exos.map((e) => parseInt(e[2])),
  );
});
