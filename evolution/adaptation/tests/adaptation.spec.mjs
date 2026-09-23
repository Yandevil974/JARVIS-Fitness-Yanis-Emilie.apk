import {
  test,
  expect,
} from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
import {
  initialState,
  validateState,
} from "../../../JARVIS-Fitness-Source/src/store/model.js";
import { profile, day } from "./fixture.mjs";
const board = (page) => page.locator(".je-adaptation");
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
  const state = initialState(),
    fake = profile();
  Object.assign(state.profiles.elite, {
    sessions: fake.sessions,
    checkIns: fake.checkIns,
    appointments: fake.appointments,
  });
  state.profiles.elite.user.increment = 2.5;
  for (const p of Object.values(state.profiles)) p.timer = null;
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
async function details(page) {
  await board(page)
    .getByText("Pourquoi cette proposition ? Voir les données et limites", {
      exact: true,
    })
    .click();
}
async function profileSwitch(page, name) {
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
test("explained bounded increase shows original evidence, never changes the plan or creates a decision", async ({
  page,
}) => {
  await open(page);
  const before = await stored(page);
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "increase",
  );
  await expect(board(page)).toContainText("50 → 52.5 kg total");
  await details(page);
  await expect(board(page).getByRole("table")).toContainText("2026-09-17");
  await expect(board(page).getByRole("table")).toContainText("12 · 12 · 12");
  await expect(board(page)).toContainText("Ni conversion");
  await expect(board(page)).toContainText("5 %");
  await expect(board(page)).toContainText("Lecture seule");
  await expect(
    board(page).getByRole("button", { name: /Appliquer|Accepter/ }),
  ).toHaveCount(0);
  await page.reload();
  const after = await stored(page);
  for (const key of [
    "plan",
    "workout",
    "sessions",
    "appointments",
    "checkIns",
    "forceTests",
  ])
    expect(after.profiles.elite[key], key).toEqual(before.profiles.elite[key]);
  expect(after.profiles.elite.decisions).toBeUndefined();
});
test("both profiles and training screen keep their own evidence and existing appointments", async ({
  page,
}) => {
  await open(page);
  await profileSwitch(page, "Émilie");
  await expect(board(page)).toContainText("Aucun exercice réalisé");
  await expect(board(page)).not.toContainText("52.5");
  await profileSwitch(page, "Yanis");
  await nav(page, "Entraînement");
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "increase",
  );
  await expect(page.locator(".ja-board")).toBeVisible();
  await expect(page.getByRole("tab", { name: /Ma séance/ })).toBeVisible();
});
test("latest partial session blocks comparison rather than cherry-picking an older success", async ({
  page,
}) => {
  await open(page, (s) => (s.profiles.elite.sessions[1].status = "partial"));
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "insufficient",
  );
  await expect(board(page)).toContainText("partielle");
  await expect(board(page).locator(".je-target")).toHaveCount(0);
  await expect(board(page)).toContainText("Réévaluation ≠ test maximal");
});
test("guided pre-session fills missing readiness only after confirmation, then analysis refreshes", async ({
  page,
}) => {
  await open(page, (s) => delete s.profiles.elite.checkIns[day]);
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "insufficient",
  );
  await details(page);
  await board(page)
    .getByRole("button", { name: "Faire mon point avant séance", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await expect(modal).toHaveAccessibleName("Avant ma séance");
  await modal.getByRole("button", { name: "Continuer", exact: true }).click();
  await modal
    .getByLabel("Énergie avant séance (1 basse, 5 haute)", { exact: true })
    .selectOption("4");
  await modal
    .getByLabel("Temps disponible (minutes)", { exact: true })
    .fill("45");
  await modal
    .getByLabel("Douleur importante liée à l’effort", { exact: true })
    .selectOption("no");
  await modal.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "insufficient",
  );
  await modal
    .getByRole("button", { name: "Confirmer ce rendez-vous", exact: true })
    .click();
  await expect(modal).toHaveCount(0);
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "increase",
  );
  await stored(page);
});
test("post-session link uses exact real source; pain suppresses increase after confirmation", async ({
  page,
}) => {
  await open(page);
  await details(page);
  await board(page)
    .getByRole("button", {
      name: "Compléter le retour du 2026-09-17",
      exact: true,
    })
    .click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("2026-09-17");
  await modal.getByRole("button", { name: "Continuer", exact: true }).click();
  await modal
    .getByLabel("Effort ressenti (1 facile, 10 maximal)", { exact: true })
    .selectOption("8");
  await modal
    .getByLabel("Douleur importante liée à l’effort", { exact: true })
    .selectOption("yes");
  await modal.getByRole("button", { name: "Continuer", exact: true }).click();
  await modal
    .getByRole("button", { name: "Confirmer ce rendez-vous", exact: true })
    .click();
  await expect(modal).toHaveCount(0);
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "safety",
  );
  await expect(board(page).locator(".je-target")).toHaveCount(0);
  expect(
    (await stored(page)).profiles.elite.appointments.records["post:session:new"]
      .ref,
  ).toBe("session:new");
});
test("repeated hard efforts suggest deload, poor readiness only pauses, no maximum test is generated", async ({
  page,
}) => {
  await open(page, (s) => {
    for (const a of s.profiles.elite.sessions)
      for (const e of a.exercises)
        for (const set of e.sets) {
          set.reps = 7;
          set.rpe = 9;
          set.rir = 1;
        }
  });
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "deload",
  );
  await expect(board(page)).toContainText("50 → 47.5 kg total");
  expect((await stored(page)).profiles.elite.forceTests).toHaveLength(0);
});
test("readiness expires at midnight; focus recalculates without carrying yesterday’s consent", async ({
  page,
}) => {
  await open(page);
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "increase",
  );
  await page.clock.setFixedTime(new Date("2026-09-21T00:01:00+04:00"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(board(page).locator(".je-result")).toHaveAttribute(
    "data-status",
    "insufficient",
  );
  await expect(board(page)).toContainText("douleur du jour");
});
test("mobile evidence table scrolls inside the panel in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await details(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Passer en sombre", exact: true })
    .click();
  await board(page).scrollIntoViewIfNeeded();
  await page.screenshot({ path: ".cache/adaptation-dark-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(board(page).getByRole("table")).toBeVisible();
});
