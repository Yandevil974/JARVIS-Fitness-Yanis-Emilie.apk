// Émilie — reproduction du blocage décrit le 23 septembre 2026 :
// « les exercices terminés lors des premières semaines se mettent validés pour
// aujourd'hui et les semaines suivantes, alors qu'elle n'a pas fait son
// programme du jour ; du coup le chronomètre ni le programme ne démarre. »
//
// Hypothèse mesurée, pas supposée : une séance commencée en semaine 1 et jamais
// clôturée reste dans l'état (`workout`). Toute ouverture ultérieure la reprend
// d'office (`startWorkout`) — ses séries déjà validées sont donc affichées — et
// toute autre minuterie guidée est refusée (`setTimer`) au profit de la
// modale « Clôturer la séance ». Ce spec le démontre sans changer l'état à la main.
import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';

const T1=new Date('2026-09-24T10:00:00+04:00'); // semaine 1, jour de musculation : elle commence une séance
const T2=new Date('2026-10-22T10:00:00+04:00'); // 4 semaines plus tard
const T3=new Date('2026-11-19T10:00:00+04:00'); // 8 semaines plus tard

function state(){
  const s=initialState();
  s.activeProfile='emilie';
  for(const p of Object.values(s.profiles))p.preferences.voice=false;
  return s;
}
const saved=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.emilie);

test.beforeEach(async({page})=>{page.errors=[];page.on('pageerror',e=>page.errors.push(e.message))});
test.afterEach(async({page})=>expect(page.errors).toEqual([]));

test('séance de la semaine 1 jamais clôturée : état repris d’office et minuteries refusées',async({page})=>{
  const s=state();
  validateState(structuredClone(s));
  await page.clock.setFixedTime(T1);
  await page.addInitScript(s=>{if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s))},s);
  await page.goto('/');
  await expect(page.locator('.training-hero')).toBeVisible();

  // Semaine 1 : elle lance la séance et valide deux séries, puis quitte l'app
  // sans clôturer (écran éteint, application balayée...).
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Lancer la séance/.test(x.textContent));b&&b.click()});
  await page.waitForTimeout(1500);
  if(!(await page.getByText('MODE SÉANCE').count())){
    console.log('DEBUG après clic · url',page.url());
    console.log('DEBUG après clic · texte:',JSON.stringify((await page.locator('body').innerText()).replace(/\n/g,' | ').slice(0,700)));
    await page.screenshot({path:'.cache/emilie-block-debug.png',fullPage:true});
  }
  await expect(page.getByText('MODE SÉANCE')).toBeVisible();
  const nom=await page.locator('.session-topbar h2').innerText();
  for(let i=0;i<2;i++){
    await page.getByLabel('Charge réalisée').fill('10');
    await page.getByLabel('Répétitions réalisées').fill('12');
    await page.locator('button.validate-set').click();
    await expect(page.locator('.logged-sets')).toBeVisible();
    if(i===0)await page.locator('.timer-actions').getByRole('button',{name:/Passer|Terminer|Arrêter/}).first().click().catch(()=>{});
  }
  const semaine1=await saved(page);
  console.log('SEMAINE 1 · séance en cours :',semaine1.workout.name,'| date',semaine1.workout.date,
    '| séries validées',semaine1.workout.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0),
    '| séances terminées',semaine1.sessions.length);

  // 4 semaines plus tard : elle n'a pas pu faire ses séances des semaines 2 à 5.
  await page.clock.setFixedTime(T2);
  await page.reload();
  await expect(page.locator('.training-hero')).toBeVisible();
  const heroT2=await page.locator('.hero-cta button').first().innerText();
  console.log('SEMAINE 5 · bouton principal :',JSON.stringify(heroT2));
  await page.screenshot({path:'.cache/emilie-block-t2-accueil.png',fullPage:false});

  // Ce qu'elle voit si elle appuie : l'ancienne séance, avec ses séries validées.
  await page.getByRole('button',{name:/Reprendre ma séance|Lancer la séance/}).click();
  await expect(page.getByText('MODE SÉANCE')).toBeVisible();
  const reprise=await page.locator('.session-topbar').innerText();
  const items=await page.locator('.workout-sequence .sequence-item').allInnerTexts();
  const chaud=await page.locator('.sequence-warmup').first().innerText();
  console.log('SEMAINE 5 · écran de séance :',JSON.stringify(reprise.replace(/\n/g,' | ')));
  console.log('SEMAINE 5 · échauffement :',JSON.stringify(chaud.replace(/\n/g,' | ')));
  console.log('SEMAINE 5 · exercices :',JSON.stringify(items));
  await page.screenshot({path:'.cache/emilie-block-t2-seance.png',fullPage:true});
  const bloque=await saved(page);
  console.log('SEMAINE 5 · état conservé : séance datée',bloque.workout.date,'| séances terminées',bloque.sessions.length);

  // Ce que le programme affiche ce jour-là, 4 semaines plus tard
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Programme');b&&b.click()});
  await page.waitForTimeout(700);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Cette semaine/.test(x.textContent));b&&b.click()});
  await page.waitForTimeout(700);
  const prog=(await page.locator('main, body').first().innerText()).replace(/\n/g,' | ');
  console.log('SEMAINE 5 · vue « Cette semaine » :',JSON.stringify(prog.slice(prog.indexOf('Cette semaine'),prog.indexOf('Cette semaine')+450)));
  console.log('SEMAINE 5 · mots-clés validés/terminés :',JSON.stringify([...prog.matchAll(/(Validé[^|]{0,30}|Terminée[^|]{0,30}|déjà[^|]{0,40})/g)].map(m=>m[0]).slice(0,8)));
  await page.screenshot({path:'.cache/emilie-block-t2-programme.png',fullPage:true});

  // Le chronomètre guidé (récupération, type « recovery ») est refusé tant que
  // cette musculation n'est pas clôturée : la modale de clôture s'ouvre à la place.
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Récupération');b&&b.click()});
  await page.waitForTimeout(900);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Mobilité & stretching/.test(x.textContent));b&&b.click()});
  await page.waitForTimeout(900);
  await page.getByLabel('Lancer 30 secondes').first().click({timeout:8000});
  await page.waitForTimeout(600);
  const modale=await page.getByRole('dialog').innerText().catch(()=>'');
  const avis=await page.locator('body').innerText();
  console.log('SEMAINE 5 · modale après « Lancer 30 secondes » :',JSON.stringify(modale.replace(/\n/g,' | ').slice(0,180)));
  console.log('SEMAINE 5 · minuteur créé ?',JSON.stringify(await page.evaluate(()=>{const t=JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.emilie.timer;return t?t.meta:'aucun'})));
  await page.screenshot({path:'.cache/emilie-block-t2-chrono-refuse.png'});

  // 8 semaines plus tard, sans rien changer : même situation.
  await page.clock.setFixedTime(T3);
  await page.reload();
  await expect(page.locator('.training-hero')).toBeVisible();
  const heroT3=await page.locator('.hero-cta button').first().innerText();
  const semaine8=await saved(page);
  console.log('SEMAINE 9 · bouton principal :',JSON.stringify(heroT3),
    '| séance en cours datée',semaine8.workout&&semaine8.workout.date,
    '| séries déjà validées',semaine8.workout?semaine8.workout.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.completed).length,0):null,
    '| séances terminées',semaine8.sessions.length);
  await page.screenshot({path:'.cache/emilie-block-t3-accueil.png'});
});
