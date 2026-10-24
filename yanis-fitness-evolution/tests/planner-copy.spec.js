import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { initialState } from "../src/store/model.js";
import { sourceSession } from "../src/engine/planner.js";
import { today, addDays } from "../src/engine/utils.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

async function ready(page, state) {
  await page.addInitScript((value) => {
    globalThis.__JARVIS_PRELOAD__ = value;
  }, state);
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
}

async function saved(page) {
  await page.waitForFunction(() => {
    const state = JSON.parse(
      localStorage.getItem(window.__YFE_KEY__) || "null",
    );
    return (
      state?.updatedAt ===
      Number(document.querySelector(".save-status")?.dataset.revision)
    );
  });
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem(window.__YFE_KEY__)),
  );
}

test("A session can be copied from the full-week view without altering the original", async ({
  page,
}) => {
  const state = initialState(),
    profile = state.profiles.elite,
    original = sourceSession(profile, "1", "J1", { date: today() });
  original.id = "copy-source";
  original.time = "18:00";
  profile.plan.sessions = [original];
  await ready(page, state);
  await page.locator(".full-week-strip .discipline-strength").click();
  await page.locator(".day-event-card").click();
  await page
    .getByRole("button", { name: "Copier vers un autre jour", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveAttribute(
    "aria-label",
    "Copier vers un autre jour",
  );
  const target = addDays(today(), 7);
  await page.getByLabel("Date de la copie", { exact: true }).fill(target);
  await page
    .getByRole("button", { name: "Confirmer la copie", exact: true })
    .click();
  const after = await saved(page),
    sessions = after.profiles.elite.plan.sessions,
    source = sessions.find((s) => s.id === "copy-source"),
    copy = sessions.find((s) => s.copiedFrom === "copy-source");
  expect(source.date).toBe(today());
  expect(copy.date).toBe(target);
  expect(copy.id).not.toBe(source.id);
  expect(copy.exercises).toEqual(original.exercises);
  expect(copy.contentLocked).toBe(true);
});

test("Clearing JARVIS history keeps the program and asks for confirmation", async ({
  page,
}) => {
  const state = initialState(),
    profile = state.profiles.elite;
  profile.messages = [
    { id: "message-to-clear", role: "user", text: "Message de test" },
  ];
  const planBefore = structuredClone(profile.plan);
  await ready(page, state);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "JARVIS", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Effacer l’historique de JARVIS",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Effacer l’historique de JARVIS ?" }),
  ).toBeVisible();
  let current = await saved(page);
  expect(current.profiles.elite.messages).toHaveLength(1);
  await page
    .getByRole("button", { name: "Effacer la conversation", exact: true })
    .click();
  current = await saved(page);
  expect(current.profiles.elite.messages).toEqual([]);
  expect(current.profiles.elite.plan).toEqual(planBefore);
  expect(current.profiles.emilie.messages).toEqual([]);
});

test("Speech rate is editable and persisted from profile preferences", async ({
  page,
}) => {
  await ready(page, initialState());
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Mon profil", exact: true })
    .click();
  await page
    .getByRole("tab", { name: "Matériel & préférences", exact: true })
    .click();
  const slider = page.getByLabel("Vitesse d’élocution", { exact: true });
  await expect(slider).toHaveValue("1");
  await slider.focus();
  for (let i = 0; i < 10; i++) await slider.press("ArrowRight");
  const after = await saved(page);
  expect(after.profiles.elite.preferences.speechRate).toBe(1.5);
  await expect(slider).toHaveValue("1.5");
});
