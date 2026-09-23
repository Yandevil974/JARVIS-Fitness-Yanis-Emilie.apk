import {createHash} from 'node:crypto';
import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';
import {createTimer} from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
const date=new Date('2026-09-23T10:00:00+04:00');
function state(profile,theme,name='Récup active — marche aquatique'){
 const s=initialState();s.activeProfile=profile;
 for(const p of Object.values(s.profiles)){p.timer=null;p.preferences.theme=theme;p.preferences.voice=false;}
 s.profiles[profile].activities=[{id:'audit-fixture-activity',date:'2026-09-22',type:'swim',name:'Séance fictive de contrôle',durationSec:600,rpe:4}];
 s.profiles[profile].measurements=[{id:'audit-fixture-weight',date:'2026-09-22',weight:70,values:{}}];
 const timer=createTimer([
  {name,seconds:45,kind:'rest',pattern:'swim',segment:'pool',img:'/media/cardio-recup-active.jpg',instruction:'Marchez doucement dans le bassin.'},
  {name:'Récupération active',seconds:60,kind:'rest',pattern:'walk',segment:'cardio',img:'/media/cardio-recup-active.jpg'}
 ],{type:'source-combo',name:'Contrôle mixte piscine/cardio'},date.getTime());
 timer.paused=true;s.profiles[profile].timer=timer;return s;
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
for(const profile of ['elite','emilie'])for(const theme of ['light','dark']){
 test(`persisted pool recovery, zoom, pause/resume and real cardio preserved: ${profile}/${theme}`,async({page})=>{
  const s=state(profile,theme);await open(page,s);const before=await saved(page,profile);
  await timer(page);
  const visual=page.locator('.timer-step-visual img');
  await expect(visual).toHaveAttribute('src',/pool-marche-aquatique.jpg$/);
  await expect(page.locator('.timer-guide img')).toHaveAttribute('src',/pool-marche-aquatique.jpg$/);
  await expect(page.locator('.timer-stage img[src*="cardio-"]')).toHaveCount(0);
  expect(await visual.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.locator('.timer-step-visual').click();
  await expect(page.locator('.image-viewer img')).toHaveAttribute('src',/pool-marche-aquatique.jpg$/);
  await page.getByRole('dialog').locator('.modal-actions').getByRole('button',{name:'Fermer',exact:true}).click();
  await page.reload();await timer(page);
  await expect(visual).toHaveAttribute('src',/pool-marche-aquatique.jpg$/);
  const after=await saved(page,profile);
  expect(after.timer.steps).toEqual(before.timer.steps); // no destructive migration
  expect(after.timer.remaining).toBe(before.timer.remaining);
  for(const field of ['activities','measurements','sessions','forceTests','workout','plan','nutrition','equipment','user'])expect(after[field]).toEqual(before[field]);
  await page.getByRole('button',{name:'Reprendre',exact:true}).click();
  await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  await expect(page.getByRole('button',{name:'Reprendre',exact:true})).toBeVisible();
  await page.screenshot({path:`.cache/media-pool-${profile}-${theme}.png`});
  await page.getByRole('button',{name:'Passer cette étape',exact:true}).click();
  await expect(visual).toHaveAttribute('src',/cardio-recup-active.jpg$/);
  await expect.poll(async()=>(await saved(page,profile)).timer.index).toBe(1);
  await page.reload();await timer(page);
  await expect(visual).toHaveAttribute('src',/cardio-recup-active.jpg$/);
 });
}
test('ambiguous aquatic recovery never displays a saved elliptical or generic photo; explicit gap remains',async({page})=>{
 const s=state('elite','light','Récupération active');
 s.profiles.elite.timer.steps[0].instruction='Récupérez pendant le temps indiqué.';
 await open(page,s);await timer(page);
 await expect(page.locator('.media-audit-gap')).toBeVisible();
 await expect(page.locator('.timer-stage img')).toHaveCount(0);
 await expect(page.locator('.timer-stage')).toContainText('Récupérez pendant le temps indiqué.');
 expect((await saved(page,'elite')).timer.steps[0].img).toBe('/media/cardio-recup-active.jpg');
});
test('profile switch retains the independent other profile and active timer',async({page})=>{
 const s=state('elite','dark');await open(page,s);
 const otherBefore=await saved(page,'emilie');
 await page.getByRole('radio',{name:'Émilie',exact:true}).check();
 await expect(page.locator('.jh-active')).toHaveCount(0);
 const otherAfter=await saved(page,'emilie');
 expect(otherAfter.timer).toBeNull();
 for(const field of ['activities','measurements','sessions','forceTests','workout','plan','nutrition','equipment','user'])expect(otherAfter[field]).toEqual(otherBefore[field]);
 await page.getByRole('radio',{name:'Yanis',exact:true}).check();await timer(page);
 await expect(page.locator('.timer-step-visual img')).toHaveAttribute('src',/pool-marche-aquatique.jpg$/);
});
for(const profile of ['elite','emilie'])test(`reviewed floor bridge animates in details, pauses, and does not replace the bench exercise: ${profile}`,async({page})=>{
 const s=state(profile,'light');s.profiles[profile].timer=null;
 for(const p of Object.values(s.profiles))p.preferences.reducedMotion=false;
 await open(page,s);
 await page.getByRole('button',{name:'Ouvrir la navigation',exact:true}).click();
 await page.locator('.sidebar').getByRole('button',{name:'Entraînement',exact:true}).click();
 await page.getByRole('tab',{name:/^Bibliothèque/}).click();
 await page.getByRole('textbox',{name:'Rechercher un exercice'}).fill('Pont fessier au sol');
 const card=page.getByRole('button',{name:'Démonstration Pont fessier au sol — activation',exact:true});
 await expect(card.locator('img')).toHaveAttribute('src',/thumbs\/8eecb0152081ff26.webp$/);
 await expect.poll(()=>card.locator('img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
 await card.click();
 const image=page.getByRole('dialog').locator('.movement-media');
 await expect(image).toHaveAttribute('src',/8eecb0152081ff26.gif$/);
 const phases=page.getByRole('dialog').locator('.exercise-phases');
 await expect(phases).toContainText('épaules au sol');
 await expect(phases).toContainText('Maintenez 2 secondes en haut');
 await expect(phases).not.toContainText('sur le banc');
 await expect(phases).not.toContainText('charge protégée');
 await expect(page.getByRole('dialog').locator('.source-technique')).toContainText('Activation obligatoire : 2 s de contraction en haut');
 await image.scrollIntoViewIfNeeded();
 await expect.poll(()=>image.evaluate(e=>e.complete&&e.naturalWidth===300)).toBe(true);
 // Capture the rendered GIF: drawImage(animatedImage) can expose its default frame, not the displayed animation.
 const frame=async()=>createHash('sha256').update(await image.screenshot({animations:'allow'})).digest('hex');
 const first=await frame();await expect.poll(frame).not.toBe(first);
 await page.getByRole('button',{name:'Mettre l’animation en pause',exact:true}).click();
 await expect(image).toHaveAttribute('src',/^data:image\/png/);
 await expect(image).toHaveClass(/paused/);
 await page.screenshot({path:`.cache/media-floor-bridge-${profile}.png`});
 await page.getByRole('button',{name:'Lire l’animation',exact:true}).click();
 await expect(image).toHaveAttribute('src',/8eecb0152081ff26.gif$/);
 await page.getByRole('dialog').locator('button[aria-label="Fermer"]').click();
 await page.getByRole('textbox',{name:'Rechercher un exercice'}).fill('Glute bridge pieds sur banc');
 await page.getByRole('button',{name:'Démonstration Glute bridge pieds sur banc',exact:true}).click();
 await expect(page.getByRole('dialog').locator('.movement-media')).toHaveAttribute('src',/0766d3a06bf79dc8.gif$/);
 await expect(page.getByRole('dialog').locator('.exercise-phases')).toContainText('sur le banc');
});

async function training(page){
 await page.getByRole('button',{name:'Ouvrir la navigation',exact:true}).click();
 await page.locator('.sidebar').getByRole('button',{name:'Entraînement',exact:true}).click();
}
for(const profile of ['elite','emilie'])test(`French press EZ card and animated detail agree; cable and dumbbell variants are not reassigned: ${profile}`,async({page})=>{
 const s=state(profile,profile==='elite'?'light':'dark');s.profiles[profile].timer=null;
 for(const p of Object.values(s.profiles))p.preferences.reducedMotion=false;
 await open(page,s);const before=await saved(page,profile);await training(page);
 await page.getByRole('tab',{name:/^Bibliothèque/}).click();
 const search=page.getByRole('textbox',{name:'Rechercher un exercice'});
 await search.fill('French press barre EZ');
 const card=page.getByRole('button',{name:'Démonstration French press barre EZ',exact:true});
 await expect(card.locator('img')).toHaveAttribute('src',/thumbs\/ea226c444f72de0f.webp$/);
 await expect.poll(()=>card.locator('img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
 await page.getByRole('button',{name:'Favori : French press barre EZ',exact:true}).click();
 await expect.poll(async()=>(await saved(page,profile)).preferences.favorites.includes('french-press-barre-ez')).toBe(true);
 await card.click();const image=page.getByRole('dialog').locator('.movement-media');
 await expect(image).toHaveAttribute('src',/ea226c444f72de0f.gif$/);
 await expect.poll(()=>image.evaluate(e=>e.complete&&e.naturalWidth===440)).toBe(true);
 await image.scrollIntoViewIfNeeded();
 const frame=async()=>createHash('sha256').update(await image.screenshot({animations:'allow'})).digest('hex');
 const first=await frame();await expect.poll(frame).not.toBe(first);
 await page.getByRole('button',{name:'Mettre l’animation en pause',exact:true}).click();
 await expect(image).toHaveAttribute('src',/^data:image\/png/);
 await page.screenshot({path:`.cache/media-french-press-${profile}.png`});
 await page.getByRole('button',{name:'Lire l’animation',exact:true}).click();
 await expect(image).toHaveAttribute('src',/ea226c444f72de0f.gif$/);
 await page.getByRole('dialog').locator('button[aria-label="Fermer"]').click();
 for(const name of ['French press poulie basse','Triceps extensions haltères, banc plat']){
  await search.fill(name);await page.getByRole('button',{name:'Démonstration '+name,exact:true}).click();
  await expect(image).toHaveAttribute('src',/4c2b19fa924f90a8.gif$/); // Known dumbbell mismatch remains open; not silently switched to EZ.
  await page.getByRole('dialog').locator('button[aria-label="Fermer"]').click();
 }
 const after=await saved(page,profile);
 for(const field of ['activities','measurements','sessions','forceTests','workout','plan','nutrition','equipment','user','timer'])expect(after[field]).toEqual(before[field]);
});
for(const profile of ['elite','emilie'])for(const [id,path,unit,load] of [
 ['french-press-barre-ez','ea226c444f72de0f','kg total',12],
 ['pont-fessier-au-sol-activation','8eecb0152081ff26','kg ajouté',0]
])test(`saved workout, rest next-exercise and zoom preserve data: ${profile}/${id}`,async({page})=>{
 const s=state(profile,profile==='elite'?'dark':'light');s.profiles[profile].timer=null;
 for(const p of Object.values(s.profiles))p.preferences.reducedMotion=false;
 s.profiles[profile].workout={id:'audit-fixture-workout',name:'Contrôle visuel fictif',date:'2026-09-23',status:'inProgress',durationSec:0,startedAt:date.getTime(),currentIndex:0,warmupDone:true,cooldownDone:false,preservePrescription:true,
  exercises:[{exerciseId:id,unit,targetSets:2,targetLoad:load,repsLow:8,repsHigh:10,rest:75,tempo:'3010',sets:[]}]};
 const rest=createTimer([{name:'Repos',seconds:75,kind:'rest'}],{type:'rest'},date.getTime());rest.paused=true;s.profiles[profile].timer=rest;
 await open(page,s);const before=await saved(page,profile);
 for(let attempt=0;attempt<2;attempt++){
  if(attempt)await page.reload();
  await training(page);
  const re=new RegExp(path+'\\.gif$');
  await expect(page.locator('.exercise-stage .movement-media')).toHaveAttribute('src',re);
  if(id==='pont-fessier-au-sol-activation')await expect(page.locator('.technique-strip')).toContainText('épaules au sol');
  const thumb=page.locator('.rest-next-thumb');await expect(thumb.locator('img')).toHaveAttribute('src',re);
  await thumb.click();await expect(page.locator('.image-viewer img')).toHaveAttribute('src',re);
  await expect.poll(()=>page.locator('.image-viewer img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.getByRole('dialog').locator('.modal-actions').getByRole('button',{name:'Fermer',exact:true}).click();
  const after=await saved(page,profile);
  for(const field of ['activities','measurements','sessions','forceTests','workout','plan','nutrition','equipment','user','timer'])expect(after[field]).toEqual(before[field]);
 }
});
