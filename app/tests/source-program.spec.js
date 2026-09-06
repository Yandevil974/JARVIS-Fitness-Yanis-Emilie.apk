import { test, expect } from "@playwright/test";
import { legacy } from "../src/data/library.js";
async function synced(page) {
  await page.waitForFunction(() => {
    const current = Number(
      document.querySelector(".save-status")?.dataset.revision,
    );
    const raw = localStorage.getItem("jarvis_fitness_v3");
    return raw && JSON.parse(raw).updatedAt === current;
  });
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("jarvis_fitness_v3")),
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
  const original = (
    await synced(page)
  ).profiles.elite.plan.sessions[0].exercises.map((e) => ({
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
    after.plan.sessions[0].exercises.map((e) => ({
      id: e.exerciseId,
      sets: e.targetSets,
    })),
  ).toEqual(original);
  expect(after.checkIns).not.toEqual({});
  await page
    .getByRole("button", { name: "Lancer la séance", exact: true })
    .click();
  const workout = (await synced(page)).profiles.elite.workout;
  expect(
    workout.exercises.map((e) => ({ id: e.exerciseId, sets: e.targetSets })),
  ).toEqual(original);
});
