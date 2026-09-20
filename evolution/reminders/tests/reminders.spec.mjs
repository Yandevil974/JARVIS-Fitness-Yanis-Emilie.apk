import { test, expect } from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
import { initialState } from '../../../JARVIS-Fitness-Source/src/store/model.js';
const backup = JSON.parse(fs.readFileSync(new URL('../../../DOC-20260919-WA0000..json', import.meta.url)));
const clock = '2026-09-20T08:00:00+04:00';
const card = (page, kind) => page.locator(`.jf-reminder[data-kind="${kind}"]`);
async function nav(page, label) {
  const menu = page.getByRole('button', { name: 'Ouvrir la navigation', exact: true });
  if (await menu.isVisible()) await menu.click();
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
async function open(page, source = backup) {
  const data = structuredClone(source);
  for (const p of Object.values(data.profiles)) p.timer = null;
  await page.clock.setFixedTime(new Date(clock));
  await page.addInitScript(data => {
    if (!localStorage.getItem('jarvis_fitness_v3')) localStorage.setItem('jarvis_fitness_v3', JSON.stringify(data));
  }, data);
  await page.goto('/');
  await expect(page.locator('.jf-reminders')).toBeVisible();
}
async function report(page, kind, until) {
  await card(page, kind).getByRole('button', { name: 'Reporter', exact: true }).click();
  await page.getByLabel('Me rappeler le', { exact: true }).fill(until);
  await page.getByRole('button', { name: 'Confirmer le report', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await stored(page);
}
test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.__errors = errors;
});
test.afterEach(async ({ page }) => { expect(page.__errors).toEqual([]); });

test('real history: all reminders visible; Sep 10 circumferences remain due despite Sep 4 weight', async ({ page }) => {
  await open(page);
  await expect(page.locator('.jf-reminder')).toHaveCount(3);
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'due');
  await expect(card(page, 'measurements')).toContainText('10 septembre 2026');
  await expect(card(page, 'measurements')).toContainText('10 août 2026');
  await expect(card(page, 'force')).toContainText('5 octobre 2026');
  await expect(card(page, 'weekly')).toContainText('20 septembre 2026');
  await expect(page.locator('.jf-reminders-foot')).toContainText('4 septembre 2026');
  await card(page, 'measurements').getByText('Voir pourquoi', { exact: true }).click();
  await expect(card(page, 'measurements').locator('details')).toContainText('Une pesée seule ne décale jamais ce bilan');
  await expect(page.locator('.force-reminder')).toHaveCount(0);
  await stored(page);
  await page.clock.setFixedTime(new Date('2026-10-01T08:00:00+04:00'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(card(page, 'measurements')).toContainText('21 jour(s) de retard');
  await expect(card(page, 'measurements')).toContainText('10 septembre 2026');
});

test('reading alerts never completes tasks; notification action opens the reminder board', async ({ page }) => {
  await open(page); await stored(page);
  await nav(page, 'Entraînement');
  await page.getByRole('button', { name: 'Ouvrir les notifications', exact: true }).click();
  await page.getByRole('button', { name: 'Tout marquer comme lu', exact: true }).click();
  await page.getByRole('button', { name: 'Ouvrir mon suivi et ses rappels', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'due');
  const saved = await stored(page);
  expect(saved.profiles.elite.notifications.filter(n => n.followUpReminder).every(n => n.read)).toBe(true);
  await page.reload();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'due');
  expect((await stored(page)).profiles.elite.notifications.filter(n => n.followUpReminder).every(n => n.read)).toBe(true);
});

test('postponement survives reload, remains visible and reactivates once on the chosen day', async ({ page }) => {
  await open(page);
  await report(page, 'measurements', '2026-09-25');
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'postponed');
  await expect(card(page, 'measurements')).toContainText('Échéance initiale : 10 septembre 2026');
  await page.reload();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'postponed');
  await page.clock.setFixedTime(new Date('2026-09-25T00:01:00+04:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'due');
  const saved = await stored(page), alerts = saved.profiles.elite.notifications.filter(n => n.followUpReminder && n.key.includes(':measurements:'));
  expect(alerts).toHaveLength(1); expect(alerts[0].read).toBe(false);
  expect(alerts[0].followUpStatus).toBe('due');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  expect((await stored(page)).profiles.elite.notifications.filter(n => n.followUpReminder && n.key.includes(':measurements:'))).toHaveLength(1);
});

test('cadence, optional photos and postponed dates stay isolated between profiles', async ({ page }) => {
  await open(page);
  await report(page, 'measurements', '2026-09-25');
  await page.getByRole('button', { name: 'Régler mes rappels', exact: true }).click();
  await page.getByRole('combobox', { name: 'Bilan de force', exact: true }).selectOption('6');
  await page.getByLabel('Activer les rappels de photos (facultatif)', { exact: true }).check();
  await page.getByRole('button', { name: 'Enregistrer mes rappels', exact: true }).click();
  await expect(page.locator('.jf-reminder')).toHaveCount(4);
  await expect(card(page, 'force')).toContainText('21 septembre 2026');
  const before = await stored(page);
  await page.getByRole('button', { name: 'Changer de profil ou ouvrir mon profil', exact: true }).click();
  await page.getByRole('button', { name: /Émilie/ }).click();
  await expect(page.locator('.jf-eyebrow')).toContainText('Émilie');
  await expect(page.locator('.jf-reminder')).toHaveCount(3);
  await expect(card(page, 'measurements')).not.toHaveAttribute('data-status', 'postponed');
  const after = await stored(page);
  expect(after.profiles.elite.followUp).toEqual(before.profiles.elite.followUp);
  expect(after.profiles.elite.preferences.forceRevalWeeks).toBe(6);
  expect(after.profiles.emilie.followUp).toBeUndefined();
  expect(after.profiles.emilie.preferences).toEqual(backup.profiles.emilie.preferences);
  await page.getByRole('button', { name: 'Changer de profil ou ouvrir mon profil', exact: true }).click();
  await page.getByRole('button', { name: /Yanis/ }).click();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'postponed');
  await card(page, 'measurements').getByRole('button', { name: 'Annuler le report', exact: true }).click();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'due');
});

test('real forms: weight alone keeps reminder; dated circumference completes it; no other history changes', async ({ page }) => {
  await open(page);
  const before = await stored(page);
  await card(page, 'measurements').getByRole('button', { name: 'Faire maintenant', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Poids (kg)', { exact: true }).fill('90');
  await page.getByRole('dialog').getByRole('button', { name: /Enregistrer/ }).click();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'due');
  await card(page, 'measurements').getByRole('button', { name: 'Faire maintenant', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Tour de taille (au nombril)', { exact: true }).fill('88');
  await page.getByRole('dialog').getByRole('button', { name: /Enregistrer/ }).click();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'upcoming');
  await expect(card(page, 'measurements')).toContainText('20 octobre 2026');
  const after = await stored(page);
  expect(after.profiles.elite.measurements).toHaveLength(before.profiles.elite.measurements.length + 2);
  for (const key of ['sessions', 'activities', 'photos', 'forceTests', 'teamReviews', 'plan']) expect(after.profiles.elite[key]).toEqual(before.profiles.elite[key]);
  expect(after.profiles.emilie).toEqual(before.profiles.emilie);
  await page.reload();
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'upcoming');
});

test('actions open existing force/team/photo modules; weekly form advances only after save', async ({ page }) => {
  await open(page);
  await card(page, 'force').getByRole('button', { name: 'Voir mon bilan', exact: true }).click();
  await expect(page.locator('main')).toContainText('1RM');
  await nav(page, 'Accueil');
  await card(page, 'weekly').getByRole('button', { name: 'Faire maintenant', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Mon bilan', exact: true })).toHaveAttribute('aria-selected', 'true');
  await nav(page, 'Accueil');
  await expect(card(page, 'weekly')).toHaveAttribute('data-status', 'due');
  await card(page, 'weekly').getByRole('button', { name: 'Faire maintenant', exact: true }).click();
  await page.getByLabel('Mes ressentis', { exact: true }).fill('Bonne énergie cette semaine, séance terminée sans gêne.');
  await page.getByRole('button', { name: 'Enregistrer mon bilan et les retours', exact: true }).click();
  await stored(page);
  await nav(page, 'Accueil');
  await expect(card(page, 'weekly')).toHaveAttribute('data-status', 'upcoming');
  await expect(card(page, 'weekly')).toContainText('27 septembre 2026');
  await page.getByRole('button', { name: 'Régler mes rappels', exact: true }).click();
  await page.getByLabel('Activer les rappels de photos (facultatif)', { exact: true }).check();
  await page.getByRole('button', { name: 'Enregistrer mes rappels', exact: true }).click();
  await card(page, 'photos').getByRole('button', { name: 'Voir mes photos', exact: true }).click();
  await expect(page.getByRole('tab', { name: /Photos/ })).toHaveAttribute('aria-selected', 'true');
});

test('missing dates use the original edit form, not an invented baseline', async ({ page }) => {
  const state = initialState();
  state.profiles.elite.measurements = [{ id: 'undated', date: '', needsDate: true, values: { cou: 39 }, weight: null, bodyFat: null }];
  await open(page, state);
  await card(page, 'measurements').getByRole('button', { name: 'Vérifier la date', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Modifier votre relevé');
  await expect(page.getByRole('dialog').getByLabel('Tour de cou', { exact: true })).toHaveValue('39');
  await page.getByRole('dialog').getByLabel('Date', { exact: true }).fill('2026-08-10');
  await page.getByRole('dialog').getByRole('button', { name: /Enregistrer/ }).click();
  await expect(card(page, 'measurements')).toContainText('10 septembre 2026');
  const saved = await stored(page);
  expect(saved.profiles.elite.measurements).toHaveLength(1);
  expect(saved.profiles.elite.measurements[0].date).toBe('2026-08-10');
});

test('export and full re-import preserve new follow-up fields and all original modules', async ({ page }) => {
  await open(page);
  await report(page, 'measurements', '2026-09-25');
  const before = await stored(page);
  await nav(page, 'Mon profil');
  await page.getByRole('tab', { name: 'Données & sauvegardes', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter la sauvegarde JSON', exact: true }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(fs.readFileSync(await download.path()));
  expect(exported.profiles.elite.followUp).toEqual(before.profiles.elite.followUp);
  await page.locator('input[type=file]').setInputFiles({ name: 'follow-up-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
  await page.getByRole('button', { name: 'Sauvegarder puis importer', exact: true }).click();
  await nav(page, 'Accueil');
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'postponed');
  const after = await stored(page);
  for (const id of ['elite', 'emilie']) for (const key of ['sessions', 'activities', 'measurements', 'photos', 'forceTests', 'teamReviews', 'plan', 'followUp']) expect(after.profiles[id][key], `${id}/${key}`).toEqual(before.profiles[id][key]);
});

// Preserve complete-app screens, not the obsolete source archive's subset.
const screens = ['Accueil', 'JARVIS', 'Bilan 1RM', 'Entraînement', 'Programme', 'Progression', 'Cardio & piscine', 'Récupération', 'Mon équipe', 'Nutrition', 'Mon profil'];
function normalize(text) { return text.replace(/V 1\.0\.[46]/g, 'V <version>').replace(/\s+/g, ' ').trim(); }
async function conservedText(page, dashboard) {
  return normalize(await page.locator('main').evaluate((main, dashboard) => {
    // Temporarily hide only the intentionally replaced reminders; retain all other dashboard content.
    const nodes = dashboard ? [...main.querySelectorAll('.jf-reminders,.force-reminder,.coach-review')] : [];
    const styles = nodes.map(n => n.style.display); nodes.forEach(n => { n.style.display = 'none'; });
    const text = main.innerText; nodes.forEach((n, i) => { n.style.display = styles[i]; }); return text;
  }, dashboard));
}
for (const id of ['elite', 'emilie']) for (const width of [390, 1440]) {
  test(`Complete modules preserved with new dashboard: ${id} at ${width}px`, async ({ page, browser }) => {
    const reference = await browser.newPage({ viewport: { width, height: 1000 }, timezoneId: 'Indian/Reunion' });
    const data = structuredClone(backup); data.activeProfile = id;
    await page.setViewportSize({ width, height: 1000 });
    await open(page, data);
    for (const p of Object.values(data.profiles)) p.timer = null;
    await reference.clock.setFixedTime(new Date(clock));
    await reference.addInitScript(s => localStorage.setItem('jarvis_fitness_v3', JSON.stringify(s)), data);
    await reference.goto(process.env.COMPLETE_REFERENCE_URL || 'http://127.0.0.1:5176');
    await expect(reference.locator('.app-shell')).toBeVisible();
    for (const screen of screens) {
      await nav(page, screen); await nav(reference, screen);
      const tabs = await reference.getByRole('tab').allTextContents();
      expect(await page.getByRole('tab').allTextContents(), screen).toEqual(tabs);
      expect(await conservedText(page, screen === 'Accueil'), screen).toBe(await conservedText(reference, screen === 'Accueil'));
      for (let i = 0; i < tabs.length; i++) {
        await page.getByRole('tab').nth(i).click(); await reference.getByRole('tab').nth(i).click();
        expect(await conservedText(page, false), `${screen}/${tabs[i]}`).toBe(await conservedText(reference, false));
      }
    }
    await nav(page, 'Accueil');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await reference.close();
  });
}

test('other health/coaching priorities remain visible alongside all follow-up reminders', async ({ page }) => {
  const data = initialState();
  data.profiles.elite.checkIns['2026-09-20'] = { painReported: true };
  await open(page, data);
  await expect(page.locator('.coach-review')).toContainText('Une douleur a été signalée');
  await expect(page.locator('.jf-reminder')).toHaveCount(3);
  const before = await stored(page);
  await report(page, 'measurements', '2026-09-25');
  await expect(page.locator('.coach-review')).toContainText('Une douleur a été signalée');
  expect((await stored(page)).profiles.elite.plan).toEqual(before.profiles.elite.plan);
});

test('mobile settings and report dialogs work in both themes without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, initialState());
  await report(page, 'measurements', '2026-09-25');
  await page.getByRole('button', { name: 'Passer en sombre', exact: true }).click();
  await page.getByRole('button', { name: 'Régler mes rappels', exact: true }).click();
  await page.getByRole('combobox', { name: 'Mensurations', exact: true }).selectOption('four-weeks');
  await page.getByLabel('Activer les rappels de photos (facultatif)', { exact: true }).check();
  await page.getByRole('button', { name: 'Enregistrer mes rappels', exact: true }).click();
  await expect(page.locator('.jf-reminder')).toHaveCount(4);
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'postponed');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.reload();
  await expect(page.locator('.jf-reminder')).toHaveCount(4);
  await expect(card(page, 'measurements')).toHaveAttribute('data-status', 'postponed');
});
