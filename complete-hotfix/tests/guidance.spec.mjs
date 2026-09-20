import { test, expect } from '../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import { initialState } from '../../JARVIS-Fitness-Source/src/store/model.js';
import { createTimer, advanceTimer } from '../../JARVIS-Fitness-Source/src/engine/timer.js';
import { prepareWorkout } from '../../JARVIS-Fitness-Source/src/engine/planner.js';

async function seed(page, data) {
  await page.addInitScript(s => localStorage.setItem('jarvis_fitness_v3', JSON.stringify(s)), data);
  await page.goto('/');
  await expect(page.locator('.app-shell')).toBeVisible();
}

test('Spoken session countdown remains active, with one announcement per milestone', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    window.__spoken = [];
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [], cancel: () => {}, speak: utterance => window.__spoken.push(utterance.text),
    }});
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  });
  const data = initialState();
  data.profiles.elite.preferences.voice = true;
  data.profiles.elite.preferences.sessionVoice = true;
  data.profiles.elite.timer = createTimer([{ name: 'Repos', seconds: 30 }], { type: 'rest' });
  await seed(page, data);
  await page.clock.runFor(31000);
  const spoken = await page.evaluate(() => window.__spoken);
  for (const word of ['5', '3', '2', '1', 'Récupération terminée. On reprend.', 'Série suivante prête.'])
    expect(spoken.filter(s => s === word), word).toHaveLength(1);
});

test('Guided warmup retains the supplied photo and full-screen image control', async ({ page }) => {
  const data = initialState();
  data.profiles.elite.timer = createTimer([
    { name: 'Mise en route', seconds: 120, img: '/media/warmup-cardio.jpg', instruction: 'Marche facile.' },
  ], { type: 'warmup', name: 'Échauffement spécifique' });
  await seed(page, data);
  await page.locator('.floating-timer').click();
  const photo = page.locator('.timer-step-visual img');
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await page.locator('.timer-step-visual').click();
  await expect(page.getByRole('dialog').getByRole('img')).toBeVisible();
});

test('Finishing guided stretches does not mark an active workout as warmed up', async ({ page }) => {
  const data = initialState();
  const p = data.profiles.elite;
  p.workout = prepareWorkout(p, p.plan.sessions.find(s => s.type === 'strength'));
  p.workout.warmupDone = false;
  p.timer = advanceTimer(createTimer([{ name: 'Étirement', seconds: 30 }], {
    type: 'warmup', name: 'Étirements guidés', workoutId: p.workout.id,
  }, 1000), 31000);
  await seed(page, data);
  await page.locator('.floating-timer').click();
  await page.getByRole('button', { name: 'Valider l’échauffement', exact: true }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.elite.timer === null);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.elite.workout.warmupDone)).toBe(false);
});
