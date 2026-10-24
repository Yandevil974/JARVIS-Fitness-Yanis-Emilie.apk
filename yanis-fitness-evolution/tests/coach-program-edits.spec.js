import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { initialState } from "../src/store/model.js";
import { addDays, monday, today } from "../src/engine/utils.js";

function stateWithCurrentWeek() {
  const state = initialState();
  const p = state.profiles.elite;
  const start = monday(today());
  const sessions = p.plan.sessions
    .filter((session) => session.type === "strength")
    .slice(0, 3)
    .map((session, index) => ({
      ...session,
      date: addDays(start, index === 2 ? 7 : index * 2),
      status: "planned",
    }));
  p.plan = { ...p.plan, startDate: start, weeks: 2, sessions };
  p.workout = null;
  p.timer = null;
  p.messages = [];
  state.updatedAt = Date.now();
  return { state, start, ids: sessions.map((session) => session.id) };
}

async function openJarvis(page, preload) {
  await page.addInitScript(
    ({ key, state }) => {
      window.__YFE_KEY__ = key;
      window.__JARVIS_PRELOAD__ = state;
    },
    { key: STORAGE_KEY, state: preload },
  );
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "JARVIS", exact: true })
    .click();
}

async function ask(page, text) {
  await page.getByLabel("Votre message à JARVIS").fill(text);
  await page.getByRole("button", { name: "Envoyer à JARVIS" }).click();
}

async function savedState(page) {
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

test("JARVIS propose et applique le simple report de la semaine dans l'interface", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const { state, start, ids } = stateWithCurrentWeek();
  await openJarvis(page, state);
  await ask(
    page,
    "Je n’ai pas pu faire mes séances cette semaine, décale-les à la semaine prochaine",
  );
  await expect(
    page.getByText(/Ce sera un simple décalage des dates/),
  ).toBeVisible();
  await expect(
    page.getByText(/Je propose \d+ séances par semaine/),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Décaler de 7 jours", exact: true })
    .click();
  await expect(page.locator(".applied-state")).toContainText(
    /Semaine décalée de 7 jours/,
  );
  await expect(page.locator(".applied-state")).toContainText(
    /Contenu et historique inchangés/,
  );

  const saved = await savedState(page);
  const sessions = saved.profiles.elite.plan.sessions;
  expect(sessions.map((session) => session.id)).toEqual(ids);
  expect(sessions.map((session) => session.date)).toEqual([
    addDays(start, 7),
    addDays(start, 9),
    addDays(start, 14),
  ]);
  expect(
    sessions.every(
      (session) =>
        session.contentLocked &&
        session.scheduleModified &&
        session.scheduleHistory.at(-1).reason === "week-shift",
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("« modifier mon programme » demande la modification au lieu de réciter le programme", async ({
  page,
}) => {
  const { state } = stateWithCurrentWeek();
  await openJarvis(page, state);
  await ask(page, "Je veux modifier mon programme");
  await expect(
    page.getByText(/Que souhaitez-vous modifier exactement/),
  ).toBeVisible();
  await expect(
    page.getByText(/Je propose \d+ séances par semaine/),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Appliquer l’adaptation", exact: true }),
  ).toHaveCount(0);
});
