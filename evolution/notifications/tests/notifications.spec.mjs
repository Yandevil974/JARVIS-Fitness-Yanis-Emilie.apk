import {
  test,
  expect,
} from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
import { initialState } from "../../../JARVIS-Fitness-Source/src/store/model.js";
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", (e) => page.__errors.push(e.message));
});
test.afterEach(async ({ page }) => {
  expect(page.__errors).toEqual([]);
});
async function open(page, android = true, voice = false) {
  const state = initialState();
  for (const p of Object.values(state.profiles)) {
    p.preferences.voice = voice;
    p.timer = null;
  }
  await page.addInitScript(
    ({ state, android }) => {
      localStorage.setItem("jarvis_fitness_v3", JSON.stringify(state));
      window.__calls = [];
      window.__native = {
        permission: false,
        enabled: { elite: false, emilie: false },
        jobs: [],
      };
      if (!android) return;
      window.androidBridge = {};
      window.Capacitor = {
        PluginHeaders: [
          {
            name: "App",
            methods: [
              "addListener",
              "removeListener",
              "getState",
              "getInfo",
            ].map((name) => ({ name, rtype: "promise" })),
          },
          {
            name: "JarvisReminders",
            methods: [
              "begin",
              "status",
              "replace",
              "requestPermission",
              "setEnabled",
              "test",
              "openSettings",
            ].map((name) => ({ name, rtype: "promise" })),
          },
        ],
        nativePromise: async (plugin, method, args) => {
          window.__calls.push({ plugin, method, args });
          if (plugin === "App")
            return method === "addListener" ? "test-app-listener" : {};
          const n = window.__native;
          if (method === "begin") return { protocol: 1, token: "test-token" };
          if (method === "replace") {
            if (window.__failReplace)
              throw Error("Stockage de programmation indisponible");
            n.jobs = args.jobs;
          }
          if (method === "requestPermission") n.permission = true;
          if (method === "setEnabled") n.enabled[args.profile] = args.enabled;
          return {
            protocol: 1,
            permission: n.permission,
            enabled: { ...n.enabled },
            scheduled: n.jobs.filter((t) => n.enabled[t.profile]).length,
            next: 0,
          };
        },
      };
    },
    { state, android },
  );
  await page.goto("/");
  await expect(page.locator(".jn-owned")).toBeVisible();
  if (android)
    await expect
      .poll(() =>
        page.evaluate(() => window.__calls.some((c) => c.method === "replace")),
      )
      .toBe(true);
}
async function settings(page) {
  await page
    .locator(".jn-owned")
    .getByRole("button", { name: "Rappels Android", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
const button = (p, name) =>
  p.getByRole("dialog").getByRole("button", { name, exact: true });
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
test("browser says Android-only and never pretends to schedule", async ({
  page,
}) => {
  await open(page, false);
  await settings(page);
  await expect(page.getByRole("dialog")).toContainText(
    "Cet aperçu ne programme aucune alerte système",
  );
  expect(await page.evaluate(() => window.__calls)).toEqual([]);
  await expect(button(page, "Activer pour ce profil")).toHaveCount(0);
});
test("startup never asks permission or activates imported preferences", async ({
  page,
}) => {
  await open(page);
  const calls = await page.evaluate(() => window.__calls);
  expect(
    calls.some((c) =>
      ["setEnabled", "requestPermission", "test"].includes(c.method),
    ),
  ).toBe(false);
  expect(await page.evaluate(() => window.__native.enabled)).toEqual({
    elite: false,
    emilie: false,
  });
});
test("Android permission is separate from explicit profile consent", async ({
  page,
}) => {
  await open(page);
  await settings(page);
  await expect(button(page, "Activer pour ce profil")).toBeDisabled();
  await button(page, "Autoriser les notifications Android").click();
  await expect(button(page, "Activer pour ce profil")).toBeEnabled();
  expect(await page.evaluate(() => window.__native.enabled)).toEqual({
    elite: false,
    emilie: false,
  });
  await button(page, "Activer pour ce profil").click();
  await expect(button(page, "Désactiver pour ce profil")).toBeVisible();
  expect(await page.evaluate(() => window.__native.enabled)).toEqual({
    elite: true,
    emilie: false,
  });
});
test("disabling a profile is an explicit serialized native action", async ({
  page,
}) => {
  await open(page);
  await settings(page);
  await button(page, "Autoriser les notifications Android").click();
  await button(page, "Activer pour ce profil").click();
  await button(page, "Désactiver pour ce profil").click();
  await expect(button(page, "Activer pour ce profil")).toBeVisible();
  const changes = await page.evaluate(() =>
    window.__calls.filter((c) => c.method === "setEnabled"),
  );
  expect(changes.map((c) => c.args.enabled)).toEqual([true, false]);
  expect(changes[1].args.revision).toBeGreaterThan(changes[0].args.revision);
});
test("native payload has no personal text, photos, weights or exercise details", async ({
  page,
}) => {
  await open(page);
  const calls = await page.evaluate(() =>
    window.__calls.filter((c) => c.method === "replace"),
  );
  expect(calls.length).toBeGreaterThan(0);
  for (const call of calls)
    for (const job of call.args.jobs) {
      expect(Object.keys(job).sort()).toEqual([
        "date",
        "expiryDate",
        "expiryMinute",
        "key",
        "minute",
        "profile",
      ]);
      expect(job.key).toMatch(/^[a-f0-9]{64}$/);
    }
});
test("test notification does not complete any workout or follow-up", async ({
  page,
}) => {
  await open(page);
  await settings(page);
  await button(page, "Autoriser les notifications Android").click();
  const before = await stored(page);
  await button(page, "Envoyer une notification de test").click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__calls.some((c) => c.method === "test")),
    )
    .toBe(true);
  const after = await stored(page);
  for (const id of ["elite", "emilie"])
    for (const field of [
      "measurements",
      "sessions",
      "plan",
      "appointments",
      "forceTests",
    ])
      expect(after.profiles[id][field]).toEqual(before.profiles[id][field]);
  expect(await page.evaluate(() => window.__native.enabled)).toEqual({
    elite: false,
    emilie: false,
  });
});
test("profile switch never copies consent to the other person", async ({
  page,
}) => {
  await open(page);
  await settings(page);
  await button(page, "Autoriser les notifications Android").click();
  await button(page, "Activer pour ce profil").click();
  await button(page, "Fermer").last().click();
  await page
    .getByRole("button", {
      name: "Changer de profil ou ouvrir mon profil",
      exact: true,
    })
    .click();
  await page
    .locator(".top-profile-menu")
    .getByRole("button", { name: "Émilie", exact: true })
    .click();
  await settings(page);
  await expect(button(page, "Activer pour ce profil")).toBeVisible();
  expect(await page.evaluate(() => window.__native.enabled)).toEqual({
    elite: true,
    emilie: false,
  });
});
test("Android profile preferences route to native controls, not a dead browser permission switch", async ({
  page,
}) => {
  await open(page);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Mon profil", exact: true })
    .click();
  const tabs = page.getByRole("tab");
  const labels = await tabs.allTextContents();
  const index = labels.findIndex((s) =>
    /Préférences|Réglages|Paramètres/i.test(s),
  );
  expect(index).toBeGreaterThanOrEqual(0);
  await tabs.nth(index).click();
  await expect(page.locator(".jn-shortcut")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Régler les notifications Android",
      exact: true,
    })
    .click();
  await expect(page.locator(".jn-owned")).toBeVisible();
  expect(
    await page.evaluate(() =>
      window.__calls.some((c) => c.method === "requestPermission"),
    ),
  ).toBe(false);
});
test("opening reminder settings stops spokesperson audio and ignores a late completion", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    window.__cancelled = 0;
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => [
          { lang: "fr-FR", name: "Test", voiceURI: "test", localService: true },
        ],
        cancel() {
          window.__cancelled++;
        },
        speak(u) {
          window.__spoken.push(u);
        },
      },
    });
  });
  await open(page, false, true);
  await page
    .getByRole("button", { name: "Écouter le point", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => window.__spoken.length))
    .toBeGreaterThan(0);
  const before = await page.evaluate(() => window.__cancelled);
  await settings(page);
  await expect
    .poll(() => page.evaluate(() => window.__cancelled))
    .toBeGreaterThan(before);
  await page.evaluate(() => window.__spoken.at(-1).onend?.());
  const state = await stored(page);
  expect(state.profiles.elite.spokesperson?.daily?.played).not.toBe(true);
});
