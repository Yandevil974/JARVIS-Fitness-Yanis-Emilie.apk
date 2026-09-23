import fs from "node:fs";
import {
  test,
  expect,
} from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
import {
  initialState,
  validateState,
} from "../../../JARVIS-Fitness-Source/src/store/model.js";
const clock = "2026-09-20T08:00:00+04:00";
const board = (p) => p.locator(".ja-board");
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
async function nav(page, label) {
  const b = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  if (await b.isVisible()) await b.click();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function profile(page, name) {
  await page
    .getByRole("button", {
      name: "Changer de profil ou ouvrir mon profil",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}
async function open(page) {
  const s = initialState();
  for (const p of Object.values(s.profiles)) {
    p.user.startDate = "2026-09-01";
    p.timer = null;
    p.measurements = [];
    p.teamReviews = [];
    p.activities = [
      {
        id: "swim-1",
        date: "2026-09-19",
        type: "swim",
        durationSec: 600,
        note: "Piscine",
      },
    ];
  }
  await page.clock.setFixedTime(new Date(clock));
  await page.addInitScript((s) => {
    if (!localStorage.getItem("jarvis_fitness_v3"))
      localStorage.setItem("jarvis_fitness_v3", JSON.stringify(s));
  }, s);
  await page.goto("/");
  await expect(board(page)).toBeVisible();
  await expect(page).toHaveTitle("Yanis Fitness Evolution");
}
async function start(page, name) {
  await board(page).getByRole("button", { name, exact: true }).click();
  await expect(dialog(page)).toBeVisible();
}
async function next(page) {
  await dialog(page)
    .getByRole("button", { name: "Continuer", exact: true })
    .click();
}
async function confirm(page) {
  await dialog(page)
    .getByRole("button", { name: "Confirmer ce rendez-vous", exact: true })
    .click();
}
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", (e) => page.__errors.push(e.message));
});
test.afterEach(async ({ page }) => {
  expect(page.__errors).toEqual([]);
});
test("draft, cancel, reload and profile separation; no appointment or real measure before confirmation", async ({
  page,
}) => {
  await open(page);
  await start(page, "Mensurations guidées");
  await next(page);
  await dialog(page)
    .getByLabel("Tour de taille (cm)", { exact: true })
    .fill("89.5");
  await dialog(page)
    .getByRole("button", { name: "Garder pour plus tard" })
    .click();
  let s = await stored(page);
  expect(s.profiles.elite.measurements).toHaveLength(0);
  expect(s.profiles.elite.appointments.records).toBeUndefined();
  await page.reload();
  await start(page, "Mensurations guidées");
  await expect(
    dialog(page).getByLabel("Tour de taille (cm)", { exact: true }),
  ).toHaveValue("89.5");
  await dialog(page)
    .getByRole("button", { name: "Garder pour plus tard" })
    .click();
  await profile(page, "Émilie");
  await start(page, "Mensurations guidées");
  await next(page);
  await expect(
    dialog(page).getByLabel("Tour de taille (cm)", { exact: true }),
  ).toHaveValue("");
  await dialog(page)
    .getByRole("button", { name: "Garder pour plus tard" })
    .click();
  await profile(page, "Yanis");
  await start(page, "Mensurations guidées");
  await dialog(page)
    .getByRole("button", { name: "Effacer uniquement le brouillon" })
    .click();
  s = await stored(page);
  expect(Object.keys(s.profiles.elite.appointments.drafts)).toHaveLength(0);
});
test("weight alone refused; actual circumference saved once, reminder updated, optional photos open existing module", async ({
  page,
}) => {
  await open(page);
  const before = await stored(page);
  await start(page, "Mensurations guidées");
  await next(page);
  await dialog(page)
    .getByLabel("Poids facultatif (kg)", { exact: true })
    .fill("80");
  await next(page);
  await confirm(page);
  await expect(dialog(page).getByRole("alert")).toContainText(
    "au moins un tour",
  );
  expect((await stored(page)).profiles.elite.measurements).toHaveLength(0);
  await dialog(page)
    .getByRole("button", { name: "Retour", exact: true })
    .click();
  await dialog(page)
    .getByLabel("Tour de taille (cm)", { exact: true })
    .fill("89.5");
  await dialog(page)
    .getByLabel("Ouvrir les photos après l’enregistrement (facultatif)", {
      exact: true,
    })
    .check();
  await next(page);
  await expect(dialog(page)).toContainText("89.5 cm");
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  await expect(
    page.getByRole("tab", { name: "Photos", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const s = await stored(page);
  expect(s.profiles.elite.measurements).toHaveLength(1);
  expect(s.profiles.elite.photos).toHaveLength(0);
  expect(s.profiles.elite.plan).toEqual(before.profiles.elite.plan);
  expect(validateState(s).profiles.elite.measurements[0].values.taille).toBe(
    89.5,
  );
  await nav(page, "Accueil");
  await expect(
    page.locator('.jf-reminder[data-kind="measurements"]'),
  ).toHaveAttribute("data-status", "upcoming");
});
test("pre-session pain is explicit, confirmation-only, preserves plan and triggers existing safety guard", async ({
  page,
}) => {
  await open(page);
  const before = await stored(page);
  await start(page, "Avant ma séance");
  await next(page);
  await dialog(page)
    .getByLabel("Énergie avant séance (1 basse, 5 haute)", { exact: true })
    .selectOption("3");
  await dialog(page)
    .getByLabel("Temps disponible (minutes)", { exact: true })
    .fill("30");
  await dialog(page)
    .getByLabel("Douleur importante liée à l’effort", { exact: true })
    .selectOption("yes");
  await expect(dialog(page).getByRole("alert")).toContainText(
    "ne poursuis pas",
  );
  await next(page);
  expect(
    (await stored(page)).profiles.elite.checkIns["2026-09-20"],
  ).toBeUndefined();
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  const s = await stored(page);
  expect(s.profiles.elite.checkIns["2026-09-20"].painReported).toBe(true);
  expect(s.profiles.elite.plan).toEqual(before.profiles.elite.plan);
  expect(s.profiles.elite.workout).toBeNull();
  await nav(page, "Entraînement");
  await page
    .getByRole("button", { name: "Lancer cette séance", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await stored(page)).profiles.elite.workout).toBeNull();
});
test("post-session links to actual activity and preserves the source; edit does not duplicate", async ({
  page,
}) => {
  await open(page);
  const before = await stored(page);
  await start(page, "Après ma séance");
  await expect(dialog(page)).toContainText("2026-09-19");
  await next(page);
  await dialog(page)
    .getByLabel("Effort ressenti (1 facile, 10 maximal)", { exact: true })
    .selectOption("7");
  await dialog(page)
    .getByLabel("Douleur importante liée à l’effort", { exact: true })
    .selectOption("no");
  await dialog(page)
    .getByLabel("Problèmes rencontrés ou rien à signaler", { exact: true })
    .fill("RAS");
  await next(page);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  let s = await stored(page);
  expect(s.profiles.elite.activities).toEqual(before.profiles.elite.activities);
  expect(
    s.profiles.elite.appointments.records["post:activity:swim-1"].answers
      .effort,
  ).toBe(7);
  await start(page, "Après ma séance");
  await next(page);
  await expect(
    dialog(page).getByLabel("Effort ressenti (1 facile, 10 maximal)", {
      exact: true,
    }),
  ).toHaveValue("7");
  await next(page);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  s = await stored(page);
  expect(Object.keys(s.profiles.elite.appointments.records)).toHaveLength(1);
});
test("weekly guided confirmation reuses original team history and versions, not a duplicate", async ({
  page,
}) => {
  await open(page);
  await start(page, "Bilan hebdomadaire guidé");
  await next(page);
  await dialog(page)
    .getByLabel("Mes questions pour l’équipe", { exact: true })
    .fill("Comment mieux récupérer ?");
  await next(page);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  let s = await stored(page);
  expect(s.profiles.elite.teamReviews).toHaveLength(1);
  expect(s.profiles.elite.teamReviews[0].questions).toBe(
    "Comment mieux récupérer ?",
  );
  await start(page, "Bilan hebdomadaire guidé");
  await next(page);
  await dialog(page)
    .getByLabel("Énergie (1 basse, 5 haute)", { exact: true })
    .selectOption("4");
  await next(page);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  s = await stored(page);
  expect(s.profiles.elite.teamReviews).toHaveLength(1);
  expect(s.profiles.elite.teamReviews[0].previousVersions).toHaveLength(1);
  await nav(page, "Mon équipe");
  await page.getByRole("tab", { name: /Retours enregistrés/ }).click();
  await expect(page.locator("main")).toContainText("Comment mieux récupérer ?");
});
test("Enter cannot bypass review; future date and stale midnight preparation are rejected", async ({
  page,
}) => {
  await open(page);
  await start(page, "Avant ma séance");
  await next(page);
  await dialog(page)
    .getByLabel("Énergie avant séance (1 basse, 5 haute)", { exact: true })
    .selectOption("3");
  await dialog(page)
    .getByLabel("Douleur importante liée à l’effort", { exact: true })
    .selectOption("no");
  await dialog(page)
    .getByLabel("Temps disponible (minutes)", { exact: true })
    .fill("30");
  await dialog(page)
    .getByLabel("Temps disponible (minutes)", { exact: true })
    .press("Enter");
  await expect(dialog(page)).toContainText("Relire avant de confirmer");
  expect(
    (await stored(page)).profiles.elite.appointments.records,
  ).toBeUndefined();
  await page.clock.setFixedTime(new Date("2026-09-21T00:01:00+04:00"));
  await confirm(page);
  await expect(dialog(page).getByRole("alert")).toContainText("changé");
});
test("mobile layout stays within viewport and keyboard form remains usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await start(page, "Mensurations guidées");
  await next(page);
  await dialog(page)
    .getByLabel("Mollet gauche (cm)", { exact: true })
    .fill("35");
  await next(page);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  await stored(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("yesterday’s monthly draft can be resumed explicitly; answers remain readable in history", async ({
  page,
}) => {
  await open(page);
  await start(page, "Mensurations guidées");
  await next(page);
  await dialog(page)
    .getByLabel("Tour de taille (cm)", { exact: true })
    .fill("91");
  await dialog(page)
    .getByRole("button", { name: "Garder pour plus tard" })
    .click();
  await stored(page);
  await page.clock.setFixedTime(new Date("2026-09-21T08:00:00+04:00"));
  await page.reload();
  await board(page)
    .getByText("Brouillons à reprendre (1)", { exact: true })
    .click();
  await board(page)
    .getByRole("button", { name: "Reprendre ce brouillon", exact: true })
    .click();
  await expect(
    dialog(page).getByLabel("Tour de taille (cm)", { exact: true }),
  ).toHaveValue("91");
  await next(page);
  await expect(dialog(page)).toContainText("2026-09-20");
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  await board(page)
    .getByText("Mes derniers rendez-vous enregistrés (1)", { exact: true })
    .click();
  await board(page).locator(".ja-history details summary").click();
  await expect(board(page)).toContainText("Tour de taille : 91 cm");
  expect((await stored(page)).profiles.elite.measurements[0].date).toBe(
    "2026-09-20",
  );
});
test("empty weekly review and future monthly date never close or mark completion", async ({
  page,
}) => {
  await open(page);
  await start(page, "Bilan hebdomadaire guidé");
  await next(page);
  await next(page);
  await confirm(page);
  await expect(dialog(page).getByRole("alert")).toContainText("au moins");
  expect((await stored(page)).profiles.elite.teamReviews).toHaveLength(0);
  await dialog(page)
    .getByRole("button", { name: "Garder pour plus tard" })
    .click();
  await start(page, "Mensurations guidées");
  await dialog(page)
    .getByLabel("Date du rendez-vous", { exact: true })
    .fill("2026-09-21");
  await next(page);
  await dialog(page)
    .getByLabel("Tour de taille (cm)", { exact: true })
    .fill("90");
  await next(page);
  await confirm(page);
  await expect(dialog(page).getByRole("alert")).toContainText("date future");
  expect((await stored(page)).profiles.elite.measurements).toHaveLength(0);
});

test("appointment records and drafts survive the actual export/import UI for both profiles", async ({
  page,
}) => {
  await open(page);
  await start(page, "Mensurations guidées");
  await next(page);
  await dialog(page)
    .getByLabel("Tour de taille (cm)", { exact: true })
    .fill("90");
  await next(page);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  await profile(page, "Émilie");
  await start(page, "Bilan hebdomadaire guidé");
  await next(page);
  await dialog(page)
    .getByLabel("Mes questions pour l’équipe", { exact: true })
    .fill("Question conservée dans mon brouillon.");
  await dialog(page)
    .getByRole("button", { name: "Garder pour plus tard" })
    .click();
  const before = await stored(page);
  await nav(page, "Mon profil");
  await page
    .getByRole("tab", { name: "Données & sauvegardes", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter la sauvegarde JSON", exact: true })
    .click();
  const exported = JSON.parse(
    fs.readFileSync(await (await downloadPromise).path()),
  );
  for (const id of ["elite", "emilie"])
    expect(exported.profiles[id].appointments).toEqual(
      before.profiles[id].appointments,
    );
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "appointments.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(exported)),
    });
  await page
    .getByRole("button", { name: "Sauvegarder puis importer", exact: true })
    .click();
  await nav(page, "Accueil");
  const after = await stored(page);
  for (const id of ["elite", "emilie"])
    for (const key of [
      "appointments",
      "measurements",
      "teamReviews",
      "sessions",
      "activities",
      "plan",
    ])
      expect(after.profiles[id][key], id + "/" + key).toEqual(
        before.profiles[id][key],
      );
});
test("new forms remain legible in dark theme on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await page
    .getByRole("button", { name: "Passer en sombre", exact: true })
    .click();
  await start(page, "Avant ma séance");
  await next(page);
  await dialog(page)
    .getByLabel("Énergie avant séance (1 basse, 5 haute)", { exact: true })
    .selectOption("3");
  await dialog(page)
    .getByLabel("Temps disponible (minutes)", { exact: true })
    .fill("30");
  await dialog(page)
    .getByLabel("Douleur importante liée à l’effort", { exact: true })
    .selectOption("no");
  await next(page);
  await page.screenshot({ path: ".cache/appointments-dark-mobile.png" });
  const contrasts = await page.evaluate(() => {
    const luminance = (color) => {
      const [r, g, b] = color
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((n) => n / 255)
        .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return [
      ".ja-progress",
      ".ja-confirm p",
      ".ja-confirm h3",
      ".ja-actions button",
    ].map((selector) => {
      const el = document.querySelector(selector),
        bg = selector.startsWith(".ja-confirm ")
          ? el.closest(".ja-confirm")
          : el;
      const a = luminance(getComputedStyle(el).color),
        b = luminance(getComputedStyle(bg).backgroundColor);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
  });
  for (const ratio of contrasts) expect(ratio).toBeGreaterThanOrEqual(4.5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await confirm(page);
  await expect(dialog(page)).toHaveCount(0);
  await stored(page);
});
