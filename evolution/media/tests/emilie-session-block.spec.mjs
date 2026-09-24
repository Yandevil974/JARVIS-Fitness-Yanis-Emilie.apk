// Émilie — séance oubliée : le correctif décidé le 23 septembre 2026.
//
// Avant : une séance commencée et jamais clôturée était reprise d'office des
// semaines plus tard (ses séries validées réapparaissaient) et toute minuterie
// guidée était refusée. Reproduction historique : review/REVIEW-EMILIE-BLOCAGE.md
// et les captures review/emilie-block-w5-*.png / w9-accueil.png.
//
// Maintenant : au chargement d'un nouveau jour, la séance oubliée est clôturée
// en « partielle » avec sa date et ses séries réelles, l'utilisateur est prévenu,
// la journée repart propre et le chronomètre démarre. Ce spec vérifie tout cela
// sur le paquet web réellement livré, sans écrire le verdict à l'avance.
import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';

const T1=new Date('2026-09-24T10:00:00+04:00'); // semaine 1, jour de musculation
const T2=new Date('2026-10-22T10:00:00+04:00'); // 4 semaines plus tard
const T3=new Date('2026-11-19T10:00:00+04:00'); // 8 semaines plus tard

function state(){
  const s=initialState();
  s.activeProfile='emilie';
  for(const p of Object.values(s.profiles))p.preferences.voice=false;
  return s;
}
const saved=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.emilie);
const body=page=>page.locator('body').innerText();

test.beforeEach(async({page})=>{page.errors=[];page.on('pageerror',e=>page.errors.push(e.message))});
test.afterEach(async({page})=>expect(page.errors).toEqual([]));

test('séance oubliée : clôturée en partielle au nouveau jour, journée propre et chronomètre qui démarre',async({page})=>{
  const s=state();
  validateState(structuredClone(s));
  await page.clock.setFixedTime(T1);
  await page.addInitScript(s=>{if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s))},s);
  await page.goto('/');
  await expect(page.locator('.training-hero')).toBeVisible();

  // Semaine 1 : elle lance sa séance, valide deux séries, puis quitte l'application
  // sans clôturer (écran éteint, application balayée…).
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Lancer la séance/.test(x.textContent));b&&b.click()});
  await expect(page.getByText('MODE SÉANCE')).toBeVisible();
  const nom=await page.locator('.session-topbar h2').innerText();
  for(let i=0;i<2;i++){
    await page.getByLabel('Charge réalisée').fill(String(10+i));
    await page.getByLabel('Répétitions réalisées').fill('12');
    await page.locator('button.validate-set').click();
    await expect(page.locator('.logged-sets')).toBeVisible();
    if(i===0)await page.locator('.timer-actions').getByRole('button',{name:/Passer|Terminer|Arrêter/}).first().click().catch(()=>{});
  }
  const semaine1=await saved(page);
  const seriesSemaine1=semaine1.workout.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0);
  console.log('SEMAINE 1 · séance en cours :',semaine1.workout.name,'| date',semaine1.workout.date,
    '| séries validées',seriesSemaine1,'| séances terminées',semaine1.sessions.length);
  expect(semaine1.workout).toBeTruthy();
  expect(semaine1.sessions.length).toBe(0);

  // 4 semaines plus tard, elle rouvre l'application sans avoir clôturé.
  await page.clock.setFixedTime(T2);
  await page.reload();
  await expect(page.locator('.training-hero')).toBeVisible();
  const texteSemaine5=await body(page);
  const heroSemaine5=await page.locator('.hero-cta button').first().innerText();
  const semaine5=await saved(page);
  console.log('SEMAINE 5 · bouton principal :',JSON.stringify(heroSemaine5));
  console.log('SEMAINE 5 · avis :',JSON.stringify((texteSemaine5.match(/Séance du[^|]{0,160}/)||[''])[0].trim()));
  console.log('SEMAINE 5 · séance en cours ?',semaine5.workout?'oui':'non',
    '| séances dans l’historique',semaine5.sessions.length,
    '| statut',semaine5.sessions[0]&&semaine5.sessions[0].status,
    '| date',semaine5.sessions[0]&&semaine5.sessions[0].date,
    '| séries conservées',semaine5.sessions[0]&&semaine5.sessions[0].exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0),
    '| minuteur',semaine5.timer?'présent':'aucun');
  await page.screenshot({path:'.cache/emilie-fixed-w5-accueil.png'});

  // Le correctif attendu, relevé sur l'application :
  expect(semaine5.workout).toBeNull();
  expect(semaine5.timer).toBeNull();
  expect(heroSemaine5).toMatch(/Lancer la séance/);
  expect(texteSemaine5).toMatch(/clôturée automatiquement/);
  expect(semaine5.sessions.length).toBe(1);
  expect(semaine5.sessions[0].date).toBe(semaine1.workout.date); // sa date réelle, pas aujourd'hui
  expect(semaine5.sessions[0].status).toBe('partial');
  expect(semaine5.sessions[0].finishedAt).toBeLessThan(new Date(T2).getTime());
  expect(semaine5.sessions[0].exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0)).toBe(seriesSemaine1);
  // La séance planifiée de ce jour-là porte le résultat, pas une autre.
  const planifiee=semaine5.plan.sessions.find(x=>x.id===semaine5.sessions[0].planId);
  expect(planifiee.date).toBe(semaine1.workout.date);

  // Une minuterie guidée démarre maintenant normalement : elle était refusée
  // tant que la séance oubliée bloquait l'application.
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Récupération');b&&b.click()});
  await page.waitForTimeout(700);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Mobilité & stretching/.test(x.textContent));b&&b.click()});
  await page.waitForTimeout(700);
  await page.getByLabel('Lancer 30 secondes').first().click();
  await page.waitForTimeout(700);
  const minuteur=await saved(page);
  const modale=(await page.getByRole('dialog').innerText().catch(()=>''));
  console.log('SEMAINE 5 · minuteur après « Lancer 30 secondes » :',JSON.stringify(minuteur.timer&&minuteur.timer.meta));
  console.log('SEMAINE 5 · modale :',JSON.stringify(modale.replace(/\n/g,' | ').slice(0,140)));
  expect(minuteur.timer).toBeTruthy();
  expect(minuteur.timer.meta.type).toBe('recovery');
  expect(modale).not.toMatch(/Clôturer votre séance/);
  await page.screenshot({path:'.cache/emilie-fixed-w5-chrono.png'});
  // On arrête ce chrono pour rendre la journée à son état normal.
  await page.getByLabel('Arrêter le protocole').click();
  await page.getByRole('button',{name:/Arrêter sans enregistrer/}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // Puis elle revient à l'accueil et lance sa vraie séance du jour : le compteur part de zéro.
  await page.waitForTimeout(400);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Accueil');b&&b.click()});
  await expect(page.locator('.hero-cta button').first()).toHaveText(/Lancer la séance/);
  await page.evaluate(()=>{const b=document.querySelector('.hero-cta button');b&&b.click()});
  await expect(page.getByText('MODE SÉANCE')).toBeVisible();
  const compteur=await page.locator('.session-topbar').innerText();
  console.log('SEMAINE 5 · compteur de la nouvelle séance :',JSON.stringify(compteur.replace(/\n/g,' | ')));
  expect(compteur).not.toMatch(/\d{4,}:\d{2}/);
  expect(compteur).toMatch(/0\/\d+ séries réalisées/);
  await page.screenshot({path:'.cache/emilie-fixed-w5-seance.png'});
  // Elle quitte sans terminer : cette séance-là est du jour, elle est conservée.
  const finSemaine5=await saved(page);
  expect(finSemaine5.workout).toBeTruthy();

  // 8 semaines plus tard : plus rien à clôturer, aucune récidive.
  await page.clock.setFixedTime(T3);
  await page.reload();
  await expect(page.locator('.training-hero')).toBeVisible();
  const semaine9=await saved(page);
  const heroSemaine9=await page.locator('.hero-cta button').first().innerText();
  console.log('SEMAINE 9 · séance en cours ?',semaine9.workout?'oui':'non',
    '| séances dans l’historique',semaine9.sessions.length,'| minuteur',semaine9.timer?'présent':'aucun',
    '| bouton',JSON.stringify(heroSemaine9));
  // La séance du jour qu'elle avait laissée ouverte en semaine 5 est elle aussi
  // clôturée proprement, sur sa propre date, sans rien inventer.
  console.log('SEMAINE 9 · historique :',JSON.stringify(semaine9.sessions.map(s=>({date:s.date,status:s.status,series:s.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0)}))));
  expect(semaine9.sessions.length).toBe(2);
  expect(semaine9.workout).toBeNull();
  expect(semaine9.sessions.map(s=>s.status)).toEqual(['partial','partial']);
  expect(new Set(semaine9.sessions.map(s=>s.date)).size).toBe(2);
  await page.screenshot({path:'.cache/emilie-fixed-w9-accueil.png'});
});

test('une séance du jour même n’est jamais clôturée automatiquement',async({page})=>{
  const s=state();
  validateState(structuredClone(s));
  await page.clock.setFixedTime(T1);
  await page.addInitScript(s=>{if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s))},s);
  await page.goto('/');
  await expect(page.locator('.training-hero')).toBeVisible();
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Lancer la séance/.test(x.textContent));b&&b.click()});
  await expect(page.getByText('MODE SÉANCE')).toBeVisible();
  await page.getByLabel('Charge réalisée').fill('12');
  await page.getByLabel('Répétitions réalisées').fill('12');
  await page.locator('button.validate-set').click();
  await expect(page.locator('.logged-sets')).toBeVisible();

  // Rechargement le même jour : la séance doit être reprise, pas clôturée.
  await page.reload();
  await expect(page.locator('.training-hero')).toBeVisible();
  const memeJour=await saved(page);
  const bouton=await page.locator('.hero-cta button').first().innerText();
  console.log('MÊME JOUR · bouton',JSON.stringify(bouton),'| séance en cours',memeJour.workout?'conservée':'perdue',
    '| historique',memeJour.sessions.length,'| séries',memeJour.workout.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0));
  expect(memeJour.workout).toBeTruthy();
  expect(bouton).toMatch(/Reprendre ma séance/);
  expect(memeJour.sessions.length).toBe(0);
});
