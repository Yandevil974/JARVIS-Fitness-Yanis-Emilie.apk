import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';
import {createTimer} from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
const date=new Date('2026-09-23T10:00:00+04:00');
function state(profile,id){
 const s=initialState();s.activeProfile=profile;
 for(const p of Object.values(s.profiles)){p.timer=null;p.preferences.theme=profile==='elite'?'light':'dark';p.preferences.voice=false;}
 if(id)s.profiles[profile].workout={id:'warmup-audit-fixture',name:'Contrôle échauffement fictif',date:'2026-09-23',status:'inProgress',durationSec:0,startedAt:date.getTime(),currentIndex:0,warmupDone:false,cooldownDone:false,preservePrescription:true,
  exercises:[{exerciseId:id,unit:id==='french-press-barre-ez'?'kg total':'kg ajouté',targetSets:2,targetLoad:id==='french-press-barre-ez'?20:0,repsLow:8,repsHigh:10,rest:75,tempo:'3010',sets:[]}]};
 return s;
}
async function open(page,s){
 validateState(structuredClone(s));await page.clock.setFixedTime(date);
 await page.addInitScript(s=>{if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s))},s);
 await page.goto('/');await expect(page.locator('.training-hero')).toBeVisible();
}
async function training(page){await page.getByRole('button',{name:'Ouvrir la navigation',exact:true}).click();await page.locator('.sidebar').getByRole('button',{name:'Entraînement',exact:true}).click()}
const saved=(page,profile)=>page.evaluate(profile=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles[profile],profile);
async function reopenTimer(page){await page.locator('.jh-active').getByRole('button',{name:/^(Voir|Reprendre) le chrono$/}).click();await expect(page.locator('.timer-stage')).toBeVisible()}
const closeImage=page=>page.getByRole('dialog').locator('.modal-actions').getByRole('button',{name:'Fermer',exact:true}).click();
test.beforeEach(async({page})=>{page.errors=[];page.on('pageerror',e=>page.errors.push(e.message))});
test.afterEach(async({page})=>expect(page.errors).toEqual([]));
for(const profile of ['elite','emilie'])for(const [id,path,startButton] of [
 ['pont-fessier-au-sol-activation','8eecb0152081ff26','Lancer l’échauffement guidé'],
 ['french-press-barre-ez','ea226c444f72de0f','Démarrer le guide']
])test(`warmup sheet, start, approach identity, zoom/reload and completion: ${profile}/${id}`,async({page})=>{
 await open(page,state(profile,id));const before=await saved(page,profile);await training(page);
 const warmup=page.locator('.sequence-warmup').filter({hasText:'Échauffement'});
 await warmup.click();const rows=page.locator('.warmup-detail > div');
 await expect(rows).toHaveCount(6);
 const re=new RegExp(path+'\\.gif$');
 if(id==='pont-fessier-au-sol-activation'){
  await expect(rows.nth(2)).toContainText('Ponts fessiers au sol, 10 répétitions contrôlées.');
  await expect(rows.nth(2).locator('img')).toHaveAttribute('src',/8eecb0152081ff26.gif$/);
 }else await expect(rows.nth(2)).toContainText('Activation scapulaire');
 for(let i=3;i<6;i++)await expect(rows.nth(i).locator('img')).toHaveAttribute('src',re);
 await rows.nth(3).locator('.warmup-step-thumb').click();
 await expect(page.locator('.image-viewer img')).toHaveAttribute('src',re);await closeImage(page);
 await warmup.click();await page.getByRole('button',{name:startButton,exact:true}).click();
 await expect(page.locator('.timer-stage')).toBeVisible();
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 await expect.poll(async()=>(await saved(page,profile)).timer?.paused).toBe(true);
 for(let i=0;i<2;i++)await page.getByRole('button',{name:'Passer cette étape',exact:true}).click();
 if(id==='pont-fessier-au-sol-activation')await expect(page.locator('.timer-step-visual img')).toHaveAttribute('src',re);
 await page.getByRole('button',{name:'Passer cette étape',exact:true}).click();
 await expect(page.locator('.timer-step-visual img')).toHaveAttribute('src',re);
 await expect.poll(async()=>(await saved(page,profile)).timer.index).toBe(3);
 const active=await saved(page,profile);
 expect(active.workout).toEqual(before.workout);
 expect(active.timer.steps.map(s=>s.seconds)).toEqual([180,60,60,60,60,60]);
 for(const step of active.timer.steps.slice(3)){expect(step.exerciseId).toBe(id);expect(step.mediaRole).toBe('approach');expect(step.img).toBe('/media/'+path+'.gif')}
 if(id==='french-press-barre-ez'){
  expect(active.timer.steps.slice(3).map(s=>s.name)).toEqual(['Approche 1 · 10 kg','Approche 2 · 12.5 kg','Approche 3 · 15 kg']);
 }
 await page.locator('.timer-step-visual').click();await expect(page.locator('.image-viewer img')).toHaveAttribute('src',re);
 await expect.poll(()=>page.locator('.image-viewer img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
 await closeImage(page);await page.reload();await reopenTimer(page);
 await expect(page.locator('.timer-step-visual img')).toHaveAttribute('src',re);
 const after=await saved(page,profile);
 expect(after.timer).toEqual(active.timer);
 for(const field of ['workout','sessions','activities','measurements','forceTests','plan','equipment','user'])expect(after[field]).toEqual(before[field]);
 await page.screenshot({path:`.cache/media-warmup-${profile}-${id}.png`});
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Passer cette étape',exact:true}).click();
 await page.getByRole('button',{name:'Valider l’échauffement',exact:true}).click();
 await expect.poll(async()=>(await saved(page,profile)).workout.warmupDone).toBe(true);
 const done=await saved(page,profile);expect(done.timer).toBeNull();expect({...done.workout,warmupDone:false}).toEqual(before.workout);
});
for(const profile of ['elite','emilie'])test(`old saved activation shows floor bridge while stored image/instruction stay untouched: ${profile}`,async({page})=>{
 const s=state(profile);const timer=createTimer([
  {name:'Activation fessiers',seconds:60,pattern:'bridge',img:'/media/warmup-mobilite.jpg',instruction:'Ponts fessiers au sol, 10 répétitions contrôlées.'},
  {name:'Approche 1 · charge légère à choisir',seconds:60,pattern:'squat',img:'/media/warmup-series-approche.jpg',instruction:'10 répétitions faciles. Donnée insuffisante pour une charge chiffrée. Repos selon le besoin.'}
 ],{type:'warmup',name:'Échauffement guidé',workoutId:'old-unavailable-workout'},date.getTime());
 timer.paused=true;timer.remaining=27;s.profiles[profile].timer=timer;
 await open(page,s);const before=await saved(page,profile);await reopenTimer(page);
 await expect(page.locator('.timer-step-visual img')).toHaveAttribute('src',/8eecb0152081ff26.gif$/);
 await expect(page.locator('.timer-stage')).toContainText('Ponts fessiers au sol, 10 répétitions contrôlées.');
 await page.locator('.timer-step-visual').click();await expect(page.locator('.image-viewer img')).toHaveAttribute('src',/8eecb0152081ff26.gif$/);
 await closeImage(page);await page.reload();await reopenTimer(page);
 await expect(page.locator('.timer-step-visual img')).toHaveAttribute('src',/8eecb0152081ff26.gif$/);
 expect((await saved(page,profile)).timer).toEqual(before.timer);
 await page.getByRole('button',{name:'Reprendre',exact:true}).click();await page.getByRole('button',{name:'Pause',exact:true}).click();
 expect((await saved(page,profile)).timer.steps).toEqual(before.timer.steps);
});
