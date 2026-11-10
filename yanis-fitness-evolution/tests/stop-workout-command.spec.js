import { test, expect } from '@playwright/test';
import { initialState } from '../src/store/model.js';
import { STORAGE_KEY } from '../src/app-identity.js';

async function openJarvis(page, withSet) {
  const state = initialState();
  const workout = structuredClone(state.profiles.elite.plan.sessions.find(s => s.exercises.length));
  workout.id = 'workout-stop-test';
  workout.status = 'in-progress'; workout.startedAt = Date.now() - 50000;
  workout.currentIndex = 0;
  workout.exercises.forEach(e => { e.sets = []; });
  if (withSet) workout.exercises[0].sets = [{ id: 'set-stop-test', completed: true, weight: 10, reps: 8, unit: 'kg total', rpe: 7, createdAt: Date.now() - 10000 }];
  state.profiles.elite.workout = workout;
  state.profiles.elite.messages = [];
  await page.addInitScript(({ key, data }) => localStorage.getItem(key) || localStorage.setItem(key, JSON.stringify(data)), { key: STORAGE_KEY, data: state });
  await page.goto('/');
  await expect(page.locator('.save-status')).toContainText('Enregistré');
  await page.locator('.sidebar').getByRole('button', { name: 'JARVIS', exact: true }).click();
  await page.getByLabel('Votre message à JARVIS').fill('Stoppe ma séance');
  await page.getByRole('button', { name: 'Envoyer à JARVIS', exact: true }).click();
}

test('JARVIS clôture la séance et conserve les séries saisies après rechargement', async ({ page }) => {
  await openJarvis(page, true);
  await expect.poll(async () => page.evaluate(key => { const p = JSON.parse(localStorage.getItem(key)).profiles.elite; return p.sessions.find(s => s.id === 'workout-stop-test')?.exercises[0].sets[0]?.id; }, STORAGE_KEY)).toBe('set-stop-test');
  await expect(page.locator('.save-status')).toContainText('Enregistré');
  await page.reload();
  const profile = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).profiles.elite, STORAGE_KEY);
  expect(profile.workout).toBeNull();
  expect(profile.sessions.filter(s => s.id === 'workout-stop-test')).toHaveLength(1);
  expect(profile.sessions.find(s => s.id === 'workout-stop-test').exercises[0].sets[0].reps).toBe(8);
});

test('sans série, JARVIS demande un choix et ne supprime pas la séance', async ({ page }) => {
  await openJarvis(page, false);
  await expect(page.getByText('Clôturer votre séance')).toBeVisible();
  const profile = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).profiles.elite, STORAGE_KEY);
  expect(profile.workout.id).toBe('workout-stop-test');
});
