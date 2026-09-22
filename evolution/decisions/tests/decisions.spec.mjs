import {
  test,
  expect,
} from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
import fs from "node:fs";
import {
  initialState,
  validateState,
} from "../../../JARVIS-Fitness-Source/src/store/model.js";
import { profile, session, day } from "../../adaptation/tests/fixture.mjs";
const board = (p) => p.locator(".jd-owned");
const dialog = (p) => p.getByRole("dialog");
async function stored(page) {
  await page.waitForFunction(
    () =>
      JSON.parse(localStorage.getItem("jarvis_fitness_v3") || "null")
        ?.updatedAt ===
      Number(document.querySelector(".save-status")?.dataset.revision),
  );
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("jarvis_fitness_v3")),
  );
}
async function open(page, change = () => {}) {
  const state = initialState();
  for (const p of Object.values(state.profiles)) {
    const f = profile();
    Object.assign(p, {
      sessions: f.sessions,
      checkIns: f.checkIns,
      appointments: f.appointments,
    });
    p.user.increment = 2.5;
    p.timer = null;
    const s = session("target-" + p.id, day);
    s.status = "planned";
    s.type = "strength";
    s.focus = [];
    s.estimatedMinutes = 30;
    s.time = "18:00";
    s.exercises.forEach((e) => {
      e.sets = [];
      e.targetLoad = null;
    });
    p.plan.sessions = [s];
  }
  change(state);
  validateState(structuredClone(state));
  await page.clock.setFixedTime(new Date(day + "T08:00:00+04:00"));
  await page.addInitScript((s) => {
    if (!localStorage.getItem("jarvis_fitness_v3"))
      localStorage.setItem("jarvis_fitness_v3", JSON.stringify(s));
  }, state);
  await page.goto("/");
  await expect(board(page)).toBeVisible();
}
async function nav(page, label) {
  const m = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  if (await m.isVisible()) await m.click();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function choose(page, choice = "accepted") {
  await board(page)
    .getByRole("button", {
      name: /Choisir une décision|Réexaminer cette proposition/,
    })
    .click();
  await dialog(page)
    .getByLabel("Mon choix", { exact: true })
    .selectOption(choice);
  if (choice === "accepted") {
    await dialog(page)
      .getByLabel("Séance à modifier", { exact: true })
      .selectOption("target-elite");
    await dialog(page).getByRole("checkbox").check();
  }
}
async function review(page) {
  await dialog(page)
    .getByRole("button", { name: "Vérifier ma décision", exact: true })
    .click();
}
async function confirm(page) {
  await dialog(page)
    .getByRole("button", { name: "Confirmer ma décision", exact: true })
    .click();
  await expect(dialog(page)).toHaveCount(0);
}
async function history(page) {
  await board(page)
    .getByText(/Mes décisions et leur suivi/)
    .click();
}
async function switchProfile(page, name) {
  await page
    .getByRole("button", {
      name: "Changer de profil ou ouvrir mon profil",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", (e) => page.__errors.push(e.message));
});
test.afterEach(async ({ page }) => {
  expect(page.__errors).toEqual([]);
});
test("review and cancellation do not apply; explicit acceptance updates only one target and persists", async ({
  page,
}) => {
  await open(page);
  const before = await stored(page);
  await choose(page);
  await review(page);
  await expect(dialog(page)).toContainText("Relire avant d’enregistrer");
  let s = await stored(page);
  expect(s.profiles.elite.plan).toEqual(before.profiles.elite.plan);
  expect(s.profiles.elite.evolutionDecisions).toBeUndefined();
  await dialog(page)
    .getByRole("button", { name: "Annuler sans enregistrer" })
    .click();
  await choose(page);
  await review(page);
  await confirm(page);
  s = await stored(page);
  expect(s.profiles.elite.evolutionDecisions.records).toHaveLength(1);
  expect(s.profiles.elite.plan.sessions[0].exercises[0].targetLoad).toBe(52.5);
  expect(s.profiles.elite.sessions).toEqual(before.profiles.elite.sessions);
  expect(s.profiles.emilie.plan).toEqual(before.profiles.emilie.plan);
  await page.reload();
  await expect(board(page)).toContainText("Déjà acceptée");
  await expect(
    board(page).getByRole("button", {
      name: "Choisir une décision",
      exact: true,
    }),
  ).toHaveCount(0);
  expect(
    (await stored(page)).profiles.elite.evolutionDecisions.records,
  ).toHaveLength(1);
});
test("confirmed charge is actually displayed and carried into the original workout starter", async ({
  page,
}) => {
  await open(page);
  await choose(page);
  await review(page);
  await confirm(page);
  await stored(page);
  await nav(page, "Entraînement");
  await expect(page.locator(".exercise-row-load")).toContainText("52,5");
  await page
    .getByRole("button", { name: "Lancer cette séance", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await stored(page)).profiles.elite.workout?.exercises[0].targetLoad,
    )
    .toBe(52.5);
  const s = await stored(page);
  expect(s.profiles.elite.workout.planId).toBe("target-elite");
  expect(s.profiles.elite.workout.exercises[0].recommendation.weight).toBe(
    52.5,
  );
  await history(page);
  await expect(board(page)).toContainText("Séance en cours");
  expect(s.profiles.elite.sessions).toHaveLength(2);
});
test("refuse, reconsider and report preserve earlier decisions, with no automatic application on due date", async ({
  page,
}) => {
  await open(page);
  const before = await stored(page);
  await choose(page, "refused");
  await dialog(page)
    .getByLabel("Ma note (facultatif)", { exact: true })
    .fill("Je préfère attendre.");
  await review(page);
  await confirm(page);
  await choose(page, "postponed");
  await dialog(page)
    .getByLabel("Revoir le", { exact: true })
    .fill("2026-09-21");
  await review(page);
  await confirm(page);
  let s = await stored(page);
  expect(s.profiles.elite.plan).toEqual(before.profiles.elite.plan);
  expect(s.profiles.elite.evolutionDecisions.records).toHaveLength(2);
  expect(s.profiles.elite.evolutionDecisions.records[1].supersedes).toBe(
    s.profiles.elite.evolutionDecisions.records[0].id,
  );
  await page.clock.setFixedTime(new Date("2026-09-21T08:00:00+04:00"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(board(page)).toContainText("À revoir depuis");
  s = await stored(page);
  expect(s.profiles.elite.plan).toEqual(before.profiles.elite.plan);
  await history(page);
  await expect(board(page)).toContainText("Je préfère attendre.");
});
test("missing or incompatible target cannot be accepted, rejection remains available", async ({
  page,
}) => {
  await open(
    page,
    (s) => (s.profiles.elite.plan.sessions[0].exercises[0].rest = 60),
  );
  await board(page)
    .getByRole("button", { name: "Choisir une décision" })
    .click();
  await dialog(page)
    .getByLabel("Mon choix", { exact: true })
    .selectOption("accepted");
  await expect(dialog(page)).toContainText("Aucune cible compatible");
  await review(page);
  await expect(dialog(page).getByRole("alert").last()).toContainText(
    "Confirme explicitement",
  );
  expect(
    (await stored(page)).profiles.elite.evolutionDecisions,
  ).toBeUndefined();
  await dialog(page)
    .getByLabel("Mon choix", { exact: true })
    .selectOption("refused");
  await review(page);
  await confirm(page);
  expect(
    (await stored(page)).profiles.elite.plan.sessions[0].exercises[0]
      .targetLoad,
  ).toBeNull();
});
test("midnight invalidates a visible confirmation instead of applying stale readiness", async ({
  page,
}) => {
  await open(page);
  await choose(page);
  await review(page);
  await page.clock.setFixedTime(new Date("2026-09-21T00:01:00+04:00"));
  await dialog(page)
    .getByRole("button", { name: "Confirmer ma décision" })
    .click();
  await expect(dialog(page).getByRole("alert")).toContainText("date a changé");
  const s = await stored(page);
  expect(s.profiles.elite.evolutionDecisions).toBeUndefined();
  expect(s.profiles.elite.plan.sessions[0].exercises[0].targetLoad).toBeNull();
});
test("real export/import keeps decision history, exact target and separate profiles", async ({
  page,
}) => {
  await open(page);
  await choose(page);
  await review(page);
  await confirm(page);
  const before = await stored(page);
  await switchProfile(page, "Émilie");
  await expect(board(page)).toContainText("suivi (0)");
  await nav(page, "Mon profil");
  await page
    .getByRole("tab", { name: "Données & sauvegardes", exact: true })
    .click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter la sauvegarde JSON", exact: true })
    .click();
  const exported = JSON.parse(fs.readFileSync(await (await download).path()));
  expect(exported.profiles.elite.evolutionDecisions).toEqual(
    before.profiles.elite.evolutionDecisions,
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "decisions.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await page
    .getByRole("button", { name: "Sauvegarder puis importer", exact: true })
    .click();
  await nav(page, "Accueil");
  await switchProfile(page, "Yanis");
  await expect(board(page)).toContainText("Déjà acceptée");
  const after = await stored(page);
  expect(after.profiles.elite.evolutionDecisions).toEqual(
    before.profiles.elite.evolutionDecisions,
  );
  expect(after.profiles.elite.plan).toEqual(before.profiles.elite.plan);
  expect(after.profiles.emilie.evolutionDecisions).toBeUndefined();
});
test("mobile dark confirmation stays in viewport and Enter cannot skip review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await page
    .getByRole("button", { name: "Passer en sombre", exact: true })
    .click();
  await choose(page, "postponed");
  await dialog(page).getByLabel("Revoir le", { exact: true }).press("Enter");
  expect(
    (await stored(page)).profiles.elite.evolutionDecisions,
  ).toBeUndefined();
  await review(page);
  await expect(dialog(page)).toContainText("Relire avant d’enregistrer");
  expect(
    (await stored(page)).profiles.elite.evolutionDecisions,
  ).toBeUndefined();
  await page.screenshot({ path: ".cache/decisions-dark-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await confirm(page);
});
test("actual logged set and partial completion feed decision follow-up without inventing remaining sets", async ({
  page,
}) => {
  await open(page);
  await choose(page);
  await review(page);
  await confirm(page);
  await nav(page, "Entraînement");
  await page
    .getByRole("button", { name: "Lancer cette séance", exact: true })
    .click();
  await page.getByLabel("Répétitions réalisées", { exact: true }).fill("10");
  await page.getByLabel("RPE de la série", { exact: true }).selectOption("8");
  await page.getByRole("button", { name: /Valider la série/ }).click();
  await expect
    .poll(
      async () =>
        (await stored(page)).profiles.elite.workout?.exercises[0].sets.length,
    )
    .toBe(1);
  await page
    .locator(".session-top-actions")
    .getByRole("button", { name: "Terminer", exact: true })
    .click();
  await dialog(page)
    .getByRole("button", { name: "Sauvegarder la séance", exact: true })
    .click();
  await expect(dialog(page)).toHaveCount(0);
  await nav(page, "Accueil");
  await history(page);
  const followed = board(page).locator('[data-followup="observed"]');
  await expect(followed).toContainText("Séance partielle");
  await expect(followed).toContainText("1 série(s)");
  await expect(followed).toContainText("sur 3 prévues");
  await expect(followed).toContainText("ne prouve pas un effet causal");
  const s = await stored(page);
  expect(s.profiles.elite.sessions.at(-1).status).toBe("partial");
  expect(s.profiles.elite.sessions.at(-1).planId).toBe("target-elite");
});
test("refusing the increment keeps the real starter at the previous observed load rather than the legacy auto-increase", async ({
  page,
}) => {
  await open(page);
  await choose(page, "refused");
  await review(page);
  await confirm(page);
  await nav(page, "Entraînement");
  await expect(page.locator(".exercise-row-load")).toContainText("50");
  await page
    .getByRole("button", { name: "Lancer cette séance", exact: true })
    .click();
  const s = await stored(page);
  expect(s.profiles.elite.workout.exercises[0].targetLoad).toBe(50);
  expect(s.profiles.elite.plan.sessions[0].exercises[0].targetLoad).toBeNull();
  expect(s.profiles.elite.evolutionDecisions.records[0].applied).toBe(false);
});
