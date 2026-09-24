// Captures the "piscine après musculation" preview modal and timer on two builds
// so the aquatic recovery of a swim block can be compared visually:
//   node evolution/media/candidate/capture-pool-review.mjs
// default: candidate http://127.0.0.1:5186 vs published 1.4.0 http://127.0.0.1:5187
// env: CANDIDATE_URL, REFERENCE_URL, POOL_CAPTURE_DIR
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState} from '../../../JARVIS-Fitness-Source/src/store/model.js';

const candidate = process.env.CANDIDATE_URL || 'http://127.0.0.1:5186';
const reference = process.env.REFERENCE_URL || 'http://127.0.0.1:5187';
const outDir = process.env.POOL_CAPTURE_DIR || 'evolution/media/review';

// Exactly the delivered legacy prescriptions, copied from the signed program
// payload (see candidate/pool-texts.json for the reviewed resolution).
const cases = [
  {label: 'marche-aquatique', minutes: 30,
   detail: "30 min de piscine à allure libre : nage, aquagym ou marche dans l'eau. Récupération active idéale."},
  {label: 'nage-douce', minutes: 25,
   detail: "25 min de piscine : nage souple ou aquagym. Récupération active sans impact après une séance jambes chargée."},
  {label: 'fractionne-nager', minutes: 25,
   detail: "25 min de piscine à allure soutenue : le cardio sans impact par excellence en phase de composition."}
];

function plannedState(detail, label, minutes) {
  const s = initialState();
  s.activeProfile = 'emilie';
  for (const p of Object.values(s.profiles)) { p.timer = null; p.preferences.theme = 'light'; p.preferences.voice = false; }
  s.profiles.emilie.plan = {id: 'audit-plan-emilie', source: 'legacy', plan: true, weeks: 52, sessions: [{
    id: 'audit-post-pool-' + label, date: '2026-09-23', time: '19:15', type: 'swim', name: 'Piscine après musculation',
    status: 'planned', source: 'legacy', sourceKind: 'post-cardio', exercises: [], focus: [], instructions: detail,
    estimatedMinutes: minutes,
    components: [{key: 'post', type: 'swim', format: 'pool', name: 'piscine', minutes, seconds: minutes * 60,
      customSteps: [{name: detail, seconds: minutes * 60, kind: 'work', pattern: 'swim'}]}]
  }]};
  return s;
}

const browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/tmp/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage']});
const written = [];
for (const [build, url] of [['candidate', candidate], ['reference-1.4.0', reference]]) {
  for (const {label, detail, minutes} of cases) {
    const context = await browser.newContext({viewport: {width: 390, height: 900}, timezoneId: 'Indian/Reunion'});
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-09-23T10:00:00+04:00'));
    const state = plannedState(detail, label, minutes);
    await page.addInitScript(s => { if (!localStorage.getItem('jarvis_fitness_v3')) localStorage.setItem('jarvis_fitness_v3', JSON.stringify(s)); }, state);
    await page.goto(url);
    await page.locator('.training-hero').waitFor();
    await page.locator('.training-hero').getByRole('button', {name: 'Lancer la séance', exact: true}).click();
    const modal = page.getByRole('dialog');
    await modal.waitFor();
    const file = path.join(outDir, `pool-${build}-${label}.png`);
    await modal.screenshot({path: file});
    const shot = path.join(outDir, `pool-${build}-${label}-timer.png`);
    await modal.getByRole('button', {name: 'Lancer la séance combinée', exact: true}).click();
    await page.locator('.timer-stage').first().waitFor({state: 'attached', timeout: 15000});
    await page.waitForTimeout(700);
    await page.screenshot({path: shot});
    written.push(file, shot);
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir, 'pool-captures.json'), JSON.stringify({candidate, reference, files: written}, null, 1));
for (const f of written) console.log(fs.existsSync(f) ? 'ok ' + f : 'MISSING ' + f);
