import { test, expect } from "@playwright/test";
import { initialState } from "../src/store/model.js";
import { STORAGE_KEY } from "../src/app-identity.js";

async function open(page, profile) {
  const state = initialState();
  state.activeProfile = profile;
  state.profiles[profile].preferences.voice = true;
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(data));
      window.__spoken = [];
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          cancel() {},
          getVoices() {
            return [];
          },
          speak(u) {
            window.__spoken.push({ text: u.text, rate: u.rate });
          },
        },
      });
      window.SpeechSynthesisUtterance = class {
        constructor(text) {
          this.text = text;
        }
      };
    },
    { key: STORAGE_KEY, data: state },
  );
  await page.goto("/");
  await expect(page.locator(".save-status")).toContainText("Enregistré");
}
async function changeVisibility(page, hidden) {
  await page.evaluate((hidden) => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: hidden,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}
async function openVoiceSettings(page) {
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Mon profil", exact: true })
    .click();
  await page.getByRole("tab", { name: "Matériel & préférences" }).click();
}

test("accueil au démarrage et au retour, désactivable sans répétition au changement de réglage", async ({
  page,
}) => {
  await open(page, "elite");
  await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBe(1);
  expect(await page.evaluate(() => window.__spoken[0].text)).toContain(
    "Bonjour Yanis, JARVIS est prêt. Aujourd’hui",
  );
  await openVoiceSettings(page);
  const toggle = page.getByLabel("Accueil vocal à l’ouverture");
  await expect(toggle).toBeChecked();
  await changeVisibility(page, true);
  await changeVisibility(page, false);
  await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBe(2);
  await page
    .locator(".switch-row")
    .filter({ hasText: "Accueil vocal à l’ouverture" })
    .click();
  await expect(toggle).not.toBeChecked();
  await changeVisibility(page, true);
  await changeVisibility(page, false);
  expect(await page.evaluate(() => window.__spoken.length)).toBe(2);
  await expect
    .poll(async () =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)).profiles.elite.preferences
            .startupVoice,
        STORAGE_KEY,
      ),
    )
    .toBe(false);
});

test("le profil Émilie ne reçoit pas l’accueil vocal sans son choix", async ({
  page,
}) => {
  await open(page, "emilie");
  expect(await page.evaluate(() => window.__spoken.length)).toBe(0);
  await openVoiceSettings(page);
  const toggle = page.getByLabel("Accueil vocal à l’ouverture");
  await expect(toggle).not.toBeChecked();
  await page
    .locator(".switch-row")
    .filter({ hasText: "Accueil vocal à l’ouverture" })
    .click();
  await changeVisibility(page, true);
  await changeVisibility(page, false);
  await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBe(1);
  expect(await page.evaluate(() => window.__spoken[0].text)).toContain(
    "Bonjour Émilie",
  );
});
