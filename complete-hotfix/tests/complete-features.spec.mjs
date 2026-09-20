import { test, expect } from '../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const backup = JSON.parse(fs.readFileSync(new URL('../../DOC-20260919-WA0000..json', import.meta.url)));
const baselineURL = process.env.COMPLETE_REFERENCE_URL || 'http://127.0.0.1:5176';
const screens = ['Accueil', 'JARVIS', 'Bilan 1RM', 'Entraînement', 'Programme', 'Progression', 'Cardio & piscine', 'Récupération', 'Mon équipe', 'Nutrition', 'Mon profil'];

async function nav(page, label) {
  const opener = page.getByRole('button', { name: 'Ouvrir la navigation', exact: true });
  if (await opener.isVisible()) await opener.click();
  await page.locator('.sidebar').getByRole('button', { name: label, exact: true }).click();
  await expect(page.locator('.module-error')).toHaveCount(0);
}
async function stored(page) {
  await page.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem('jarvis_fitness_v3') || 'null');
    return state?.updatedAt === Number(document.querySelector('.save-status')?.dataset.revision);
  });
  return page.evaluate(() => JSON.parse(localStorage.getItem('jarvis_fitness_v3')));
}
function normalize(text) {
  return text.replace(/V 1\.0\.[46]/g, 'V <version>').replace(/\s+/g, ' ').trim();
}

for (const profileId of ['elite', 'emilie']) for (const width of [390, 1440]) {
  test(`All screens/tabs match supplied APK exactly: ${profileId}, ${width}px`, async ({ page, browser }) => {
    await page.setViewportSize({ width, height: 1000 });
    const reference = await browser.newPage({ viewport: { width, height: 1000 } });
    const data = structuredClone(backup);
    data.activeProfile = profileId;
    data.profiles[profileId].timer = null; // detached fixture, do not alter the actual backup
    const errors = [];
    for (const p of [page, reference]) {
      p.on('pageerror', e => errors.push(e.message));
      await p.clock.setFixedTime(new Date('2026-09-20T08:00:00+04:00'));
      await p.addInitScript(s => localStorage.setItem('jarvis_fitness_v3', JSON.stringify(s)), data);
    }
    await page.goto('/');
    await reference.goto(baselineURL);
    await expect(page.locator('.app-shell')).toBeVisible();
    await expect(reference.locator('.app-shell')).toBeVisible();
    let tabs = 0;
    for (const screen of screens) {
      await nav(page, screen);
      await nav(reference, screen);
      const labels = await reference.getByRole('tab').allTextContents();
      expect(await page.getByRole('tab').allTextContents(), screen).toEqual(labels);
      expect(normalize(await page.locator('main').innerText()), screen).toBe(normalize(await reference.locator('main').innerText()));
      for (let i = 0; i < labels.length; i++) {
        await page.getByRole('tab').nth(i).click();
        await reference.getByRole('tab').nth(i).click();
        await expect(page.locator('.module-error')).toHaveCount(0);
        expect(normalize(await page.locator('main').innerText()), `${screen}/${labels[i]}`).toBe(normalize(await reference.locator('main').innerText()));
        tabs++;
      }
    }
    console.log(`${profileId} ${width}px: ${screens.length} screens and ${tabs} tabs identical.`);
    expect(errors).toEqual([]);
    await reference.close();
  });
}

test('1RM assessment saves, recalculates loads and survives reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await nav(page, 'Bilan 1RM');
  // Cover the five base movement families so the next sessions have calculated loads.
  for (let i = 0; i < 5; i++) await page.locator('main input[type=number]').nth(i).fill('50');
  await page.getByRole('button', { name: 'Enregistrer mon bilan 1RM (5)', exact: true }).click();
  const data = await stored(page);
  expect(data.profiles.elite.forceTests).toHaveLength(5);
  expect(data.profiles.elite.forceTests[0].estimate).toBe(50);
  await expect(page.getByText('Vos charges sont personnalisées', { exact: true })).toBeVisible();
  await expect(page.locator('.force-preview-card').first()).toBeVisible();
  await page.reload();
  await nav(page, 'Bilan 1RM');
  await expect(page.locator('main input[type=number]').first()).toHaveValue('50');
  expect(errors).toEqual([]);
});

test('Theme and voice guidance controls are retained and saved', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Passer en sombre', exact: true }).click();
  expect((await stored(page)).profiles.elite.preferences.theme).toBe('dark');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Passer en clair', exact: true })).toBeVisible();
  await nav(page, 'Mon profil');
  await page.getByRole('tab', { name: 'Matériel & préférences', exact: true }).click();
  const toggle = page.getByRole('checkbox', { name: /Guidage vocal pendant la séance/ });
  const label = page.locator('label.switch-row').filter({ hasText: 'Guidage vocal pendant la séance' });
  await expect(label).toBeVisible();
  const checked = await toggle.isChecked();
  await label.click();
  expect((await stored(page)).profiles.elite.preferences.sessionVoice).toBe(!checked);
  await expect(page.locator('.wearable-panel')).toContainText('Montre & ceinture cardio');
});

test('Real provided backup imports with all both-profile data; orphan warmup closes and stays closed', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await nav(page, 'Mon profil');
  await page.getByRole('tab', { name: 'Données & sauvegardes', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles(new URL('../../DOC-20260919-WA0000..json', import.meta.url).pathname);
  await page.getByRole('button', { name: 'Sauvegarder puis importer', exact: true }).click();
  await page.locator('.floating-timer').click();
  await page.getByRole('button', { name: 'Valider l’échauffement', exact: true }).click();
  const data = await stored(page);
  expect(data.profiles.elite.timer).toBeNull();
  for (const id of ['elite', 'emilie']) for (const key of ['sessions', 'activities', 'measurements', 'photos', 'forceTests', 'plan'])
    expect(data.profiles[id][key], `${id}/${key}`).toEqual(backup.profiles[id][key]);
  await page.reload();
  await expect(page.locator('.app-shell')).toBeVisible();
  await expect(page.locator('.floating-timer')).toHaveCount(0);
  expect(errors).toEqual([]);
});
