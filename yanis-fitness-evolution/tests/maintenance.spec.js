import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { initialState, migrateLegacy } from "../src/store/model.js";
import { restoreProfile } from "../src/store/restoration.js";
import { sourceSession } from "../src/engine/planner.js";
import { today, addDays } from "../src/engine/utils.js";
import { contentFingerprint } from "../src/engine/content-fingerprint.js";
const file =
  process.env.JARVIS_TEST_BACKUP ||
  "/home/user/uploads/transformation_12_mois_sauvegarde.json";
const hasSource = fs.existsSync(file);
const imported = hasSource
  ? migrateLegacy(JSON.parse(fs.readFileSync(file, "utf8")), "elite")
  : null;
const restored = hasSource
  ? restoreProfile(initialState(), {
      format: "jarvis-profile",
      schemaVersion: 3,
      profileId: "elite",
      profile: imported,
      sourceFingerprint: imported.sourceDataFingerprint,
    }).state
  : initialState();
async function ready(page, state = restored) {
  await page.addInitScript((s) => (globalThis.__JARVIS_PRELOAD__ = s), state);
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
}
async function saved(page) {
  await page.waitForFunction(() => {
    const s = JSON.parse(localStorage.getItem("jarvis_fitness_v3") || "null");
    return (
      s?.updatedAt ===
      Number(document.querySelector(".save-status")?.dataset.revision)
    );
  });
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("jarvis_fitness_v3")),
  );
}
async function nav(page, label) {
  if (page.viewportSize().width < 600)
    await page
      .getByRole("button", { name: "Autres modules", exact: true })
      .click();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: label, exact: true })
    .click();
}
test("A moved METCON keeps both blocks even when placed on a source rest day", async ({
  page,
}) => {
  test.skip(!hasSource);
  await ready(page);
  const before = await saved(page);
  const original = before.profiles.elite.plan.sessions.find(
    (s) => s.type === "metcon" && s.date >= today() && s.status === "planned",
  );
  let target = addDays(original.date, 1);
  while (
    before.profiles.elite.plan.sessions.some(
      (s) => s.date === target && s.status === "planned",
    )
  )
    target = addDays(target, 1);
  await page
    .getByRole("button", { name: "Semaine suivante", exact: true })
    .click();
  await page.locator(".full-week-strip .discipline-metcon").first().click();
  await page.locator(".day-event-card").click();
  await page
    .getByRole("button", {
      name: "Déplacer la séance et ses blocs",
      exact: true,
    })
    .click();
  await page.getByLabel("Nouvelle date", { exact: true }).fill(target);
  await page.getByLabel("Nouvel horaire", { exact: true }).fill("18:30");
  await page
    .getByRole("button", { name: "Confirmer le déplacement lié", exact: true })
    .click();
  const after = await saved(page),
    moved = after.profiles.elite.plan.sessions.find(
      (s) => s.id === original.id,
    );
  expect(moved.date).toBe(target);
  expect(moved.contentLocked).toBe(true);
  expect(moved.components).toEqual(original.components);
  await page.locator(".full-week-strip .discipline-metcon").last().click();
  await page.locator(".day-event-card").click();
  await expect(page.getByRole("dialog")).toContainText(
    "Le contenu planifié a été conservé",
  );
  await expect(page.locator(".source-combo-block")).toHaveCount(2);
});
test("Moving Emilie’s pool block moves its parent and maintains the time offset", async ({
  page,
}) => {
  const state = initialState();
  state.activeProfile = "emilie";
  const p = state.profiles.emilie,
    parent = sourceSession(p, "1", "J3", { date: today() });
  parent.id = "paired-strength";
  parent.time = "18:00";
  parent.standalone = false;
  p.plan.sessions = [
    parent,
    {
      id: "paired-pool",
      date: today(),
      time: "19:15",
      type: "swim",
      source: "legacy",
      sourceKind: "post-cardio",
      parentId: parent.id,
      status: "planned",
      name: "Piscine après musculation",
      exercises: [],
      components: [
        {
          key: "post",
          type: "swim",
          name: "Nage douce",
          format: "pool",
          minutes: 20,
          seconds: 1200,
          customSteps: [
            {
              name: "Nage douce",
              seconds: 1200,
              kind: "work",
              pattern: "swim",
            },
          ],
        },
      ],
    },
  ];
  await ready(page, state);
  await page.locator(".full-week-strip .discipline-strength").click();
  await page.locator(".day-event-card").nth(1).click();
  await page
    .getByRole("button", {
      name: "Déplacer la séance et ses blocs",
      exact: true,
    })
    .click();
  await page
    .getByLabel("Nouvelle date", { exact: true })
    .fill(addDays(today(), 1));
  await page.getByLabel("Nouvel horaire", { exact: true }).fill("18:30");
  await page
    .getByRole("button", { name: "Confirmer le déplacement lié", exact: true })
    .click();
  const after = await saved(page);
  expect(
    after.profiles.emilie.plan.sessions.every(
      (s) => s.date === addDays(today(), 1),
    ),
  ).toBe(true);
  expect(
    after.profiles.emilie.plan.sessions.find((s) => s.id === "paired-pool")
      .time,
  ).toBe("19:45");
  expect(after.profiles.elite).toEqual(state.profiles.elite);
});
test("Imported photo metadata can be corrected without altering the image or simulation status", async ({
  page,
}) => {
  test.skip(!hasSource);
  await page.setViewportSize({ width: 344, height: 882 });
  await ready(page);
  await nav(page, "Progression");
  await page.getByRole("tab", { name: "Photos", exact: true }).click();
  const initial = await saved(page),
    photo = initial.profiles.elite.photos[0];
  const checksum = contentFingerprint(photo.data);
  await page
    .getByRole("button", {
      name: "Modifier les informations de la photo",
      exact: true,
    })
    .first()
    .click();
  await page
    .getByLabel("Date de la photo (facultative)", { exact: true })
    .fill(today());
  await page
    .getByLabel("Repère / titre", { exact: true })
    .fill("J0 · date confirmée");
  await page
    .getByRole("button", { name: "Enregistrer les informations", exact: true })
    .click();
  const savedPhoto = (await saved(page)).profiles.elite.photos.find(
    (x) => x.id === photo.id,
  );
  expect(contentFingerprint(savedPhoto.data)).toBe(checksum);
  expect(savedPhoto.date).toBe(today());
  expect(savedPhoto.label).toBe("J0 · date confirmée");
  await expect(page.locator(".photo-gallery")).toContainText(
    "J0 · date confirmée",
  );
  const index = initial.profiles.elite.photos.findIndex((x) => x.simulated);
  await page
    .getByRole("button", {
      name: "Modifier les informations de la photo",
      exact: true,
    })
    .nth(index)
    .click();
  const checkbox = page.getByRole("checkbox", {
    name: /Illustration ou simulation/,
  });
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toBeDisabled();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(344);
});
test("A backdated team review is assigned to its true week and corrections preserve prior versions", async ({
  page,
}) => {
  test.skip(!hasSource);
  await ready(page);
  await nav(page, "Mon équipe");
  await page.getByRole("tab", { name: "Mon bilan", exact: true }).click();
  await page.getByLabel("Date du bilan", { exact: true }).fill("2026-08-16");
  await expect(page.locator(".team-review-form")).toContainText(
    "Bilan de la semaine 1",
  );
  await page
    .getByLabel("Mes ressentis", { exact: true })
    .fill("Bilan daté de la première semaine");
  await page
    .getByRole("button", {
      name: "Enregistrer mon bilan et les retours",
      exact: true,
    })
    .click();
  let state = await saved(page),
    review = state.profiles.elite.teamReviews.find(
      (r) => r.source === "jarvis" && r.week === 0,
    );
  expect(review.date).toBe("2026-08-16");
  expect(
    state.profiles.elite.teamReviews.filter((r) => r.source === "legacy"),
  ).toHaveLength(3);
  await page
    .getByLabel("Mes ressentis", { exact: true })
    .fill("Correction conservée");
  await page
    .getByRole("button", {
      name: "Enregistrer mon bilan et les retours",
      exact: true,
    })
    .click();
  state = await saved(page);
  review = state.profiles.elite.teamReviews.find(
    (r) => r.source === "jarvis" && r.week === 0,
  );
  expect(review.previousVersions).toHaveLength(1);
  expect(review.previousVersions[0].feelings).toBe(
    "Bilan daté de la première semaine",
  );
  await page.getByRole("tab", { name: /Retours enregistrés/ }).click();
  await expect(
    page.getByText("1 version(s) précédente(s) conservée(s)"),
  ).toBeVisible();
});
