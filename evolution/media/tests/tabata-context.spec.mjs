import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';
import {createTimer} from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
// Le Tabata au sol et l'Aqua Tabata partagent des noms d'exercices. Regle
// mesuree puis corrigee : en contexte TERRE, jamais de guide aquatique.
const date=new Date('2026-09-23T10:00:00+04:00');
function state(profile,theme,steps,meta){
 const s=initialState();s.activeProfile=profile;
 for(const p of Object.values(s.profiles)){p.timer=null;p.preferences.theme=theme;p.preferences.voice=false;}
 const timer=createTimer(steps,meta,date.getTime());timer.paused=true;
 s.profiles[profile].timer=timer;return s;
}
async function open(page,s){
 validateState(structuredClone(s));
 await page.clock.setFixedTime(date);
 await page.addInitScript(s=>{if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s))},s);
 await page.goto('/');await expect(page.locator('.training-hero')).toBeVisible();
}
async function timer(page){await page.locator('.jh-active').getByRole('button',{name:/^(Voir|Reprendre) le chrono$/}).click();await expect(page.getByRole('dialog')).toBeVisible()}
const saved=(page,profile)=>page.evaluate(profile=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles[profile],profile);
test.beforeEach(async({page})=>{page.errors=[];page.on('pageerror',e=>page.errors.push(e.message))});
test.afterEach(async({page})=>expect(page.errors).toEqual([]));
// Etat reel du generateur au sol : {type:"hiit"} et noms suffixés « · round n/N ».
const landSteps=[
 {name:'Gainage planche · round 1/8',seconds:20,pattern:'static',kind:'work'},
 {name:'Montées de genoux · round 2/8',seconds:20,pattern:'walk',kind:'work'},
 {name:'Récupération',seconds:10,pattern:'breathe',kind:'rest'}
];
const landMeta={type:'hiit',name:'Tabata 20/10',rounds:8,cycles:1,work:20,rest:10};
// Etat reel du generateur aquatique : {type:"aqua"} et noms du bassin.
const aquaSteps=[{name:'Montées de genoux · round 1/8',seconds:20,pattern:'swim',kind:'work'}];
const aquaMeta={type:'aqua',name:'Aqua Tabata 20/10',rounds:8,cycles:1,work:20,rest:10};
for(const profile of ['elite','emilie'])for(const theme of ['light','dark']){
 test(`Tabata au sol : aucun guide aquatique, valeurs prescrites intactes — ${profile}/${theme}`,async({page})=>{
  const s=state(profile,theme,landSteps,landMeta);await open(page,s);
  const before=await saved(page,profile);
  await timer(page);
  await expect(page.locator('.timer-stage')).toContainText('Gainage planche');
  await expect(page.locator('.timer-stage')).toContainText('20');
  // Correction mesuree : plus aucune image aquatique, ni visuel d'etape ni consignes.
  // Sur la 1.4.4, le GIF aquatique du guide s'affichait ici comme visuel du
  // mouvement ; le meme nom garde son guide dans un protocole aquatique.
  await expect(page.locator('.timer-stage img[src*="/media/pool-"]')).toHaveCount(0);
  await expect(page.locator('.timer-stage img[src*=".gif"]')).toHaveCount(0);
  await expect(page.locator('.movement-media')).toHaveCount(0);
  await expect(page.locator('.timer-step-visual')).toHaveCount(0);
  await expect(page.locator('.timer-guide')).toHaveCount(0);
  await expect(page.locator('.timer-stage')).not.toContainText('margelle');
  // L'etape sans demonstration dediee reste honnete : aucun autre exercice affiche.
  await expect(page.locator('.human-recovery-visual')).toBeVisible();
  const after=await saved(page,profile);
  expect(after.timer.steps).toEqual(before.timer.steps);
  expect(after.timer.meta).toEqual(before.timer.meta);
  for(const field of ['activities','measurements','sessions','workout','plan'])expect(after[field]).toEqual(before[field]);
  await page.getByRole('button',{name:'Passer cette étape',exact:true}).click();
  await expect(page.locator('.timer-stage')).toContainText('Montées de genoux');
  await expect(page.locator('.timer-stage img[src*="/media/pool-"]')).toHaveCount(0);
  await expect(page.locator('.timer-stage img[src*=".gif"]')).toHaveCount(0);
  await expect(page.locator('.movement-media')).toHaveCount(0);
  await expect(page.locator('.timer-guide')).toHaveCount(0);
  // Aucune consigne de bassin ne doit apparaitre dans un enchainement au sol.
  await expect(page.locator('.timer-stage')).not.toContainText('montez les genoux');
  await expect(page.locator('.timer-stage')).not.toContainText('margelle');
 });
}
test('Aqua Tabata : les mêmes noms gardent exactement leur guide aquatique',async({page})=>{
 const s=state('elite','light',aquaSteps,aquaMeta);await open(page,s);const before=await saved(page,'elite');
 await timer(page);
 // Le guide aquatique est resolu par le meme resolveur que la piscine : son
 // image (GIF ou photo du pack aquatique) et ses consignes d'origine.
 const visual=page.locator('.timer-step-visual img');
 await expect(visual).toHaveAttribute('src',/\/media\/(pool-[a-z-]+\.jpg|[a-f0-9]{16}\.gif)$/);
 await expect(page.locator('.timer-guide img')).toHaveAttribute('src',await visual.getAttribute('src'));
 await expect(page.locator('.timer-guide')).toContainText('montez les genoux');
 // Le visuel aquatique n'est pas un substitut : l'image affichee existe.
 expect(await visual.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
 const after=await saved(page,'elite');
 expect(after.timer.steps).toEqual(before.timer.steps);
 expect(after.timer.meta).toEqual(before.timer.meta);
});
