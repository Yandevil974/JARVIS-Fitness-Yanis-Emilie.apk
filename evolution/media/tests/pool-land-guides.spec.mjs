import fs from 'node:fs';
import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';
import {createTimer} from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
// Cinq guides aquatiques affichaient un dessin TERRESTRE. Depuis le 24 septembre
// 2026, une animation humaine a ete produite pour chacun, dans la famille exacte
// des GIF aquatiques existants (480 x 262, 2 images, 500 ms, bassin au bon niveau).
// Le test exige donc l'animation fournie ET l'absence de l'ancien dessin terrestre.
const date=new Date('2026-09-24T10:00:00+04:00');
const cases=[['Gainage au bord (vertical)','/media/f1dde35bd517f24b.gif','/media/gainage-vertical.gif'],
             ['Mobilité épaules aquatique','/media/b2b32833d73d3ca4.gif','/media/mobilite-epaules.gif'],
             ['Mobilité hanches / chevilles','/media/faa82528766b9402.gif','/media/mobilite-hanches-chevilles.gif'],
             ['Ciseaux au bord','/media/48fe4a8cbb0d125c.gif','/media/ciseaux-au-bord.gif'],
             ['Talons-fesses','/media/7517a916496ec766.gif','/media/talons-fesses.gif']];
function state(step){
 const s=initialState();s.activeProfile='elite';
 for(const p of Object.values(s.profiles)){p.timer=null;p.preferences.theme='dark';p.preferences.voice=false;}
 const timer=createTimer([step],{type:'swim',name:'Nage douce — contrôle'},date.getTime());
 timer.paused=true;s.profiles.elite.timer=timer;return s;
}
test('les cinq guides aquatiques affichent leur animation humaine, plus aucun dessin terrestre',async({page})=>{
 for(const [name,landImage,animation] of cases){
  const s=state({name,seconds:45,kind:'rest',pattern:'swim',segment:'pool',img:landImage,instruction:'Consignes aquatiques de reference.'});
  await page.clock.setFixedTime(date);
  await page.addInitScript(st=>localStorage.setItem('jarvis_fitness_v3',JSON.stringify(st)),s);
  await page.goto('/');await expect(page.locator('.training-hero')).toBeVisible();
  await page.locator('.jh-active').getByRole('button',{name:/^(Voir|Reprendre) le chrono$/}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  // l'animation fournie est affichee, entiere et chargee
  const visual=page.locator('.timer-step-visual img');
  await expect(visual).toHaveAttribute('src',new RegExp(animation.replace(/[.]/g,'\\.')+'$'));
  expect(await visual.evaluate(e=>e.complete&&e.naturalWidth>0),name).toBe(true);
  // l'ancien dessin terrestre et la lacune ne sont plus la
  await expect(page.locator(`.timer-stage img[src="${landImage}"]`)).toHaveCount(0);
  await expect(page.locator('.media-audit-gap')).toHaveCount(0);
  // la consigne de l'etape reste affichee en entier : rien n'est reecrit
  await expect(page.locator('.timer-stage')).toContainText('Consignes aquatiques de reference.');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.elite.timer.steps);
  expect(saved[0].img,name).toBe(landImage); // l'etat enregistre n'est jamais reecrit
  await page.getByRole('button',{name:'Fermer',exact:true}).first().dispatchEvent('click').catch(()=>{});
 }
});
test('le paquet livre contient les cinq animations, au format des GIF aquatiques existants',async()=>{
 const map=JSON.parse(fs.readFileSync(new URL('../candidate/pool-animations-map.json',import.meta.url)));
 expect(Object.keys(map.map)).toHaveLength(5);
 const bundle=fs.readFileSync(new URL('../../../.cache/media-pool-candidate/assets/index-CBCies4k.js',import.meta.url),'utf8');
 for(const file of Object.values(map.map))expect(bundle).toContain(file);
 // chaque animation est presente dans le paquet, avec son empreinte exacte
 const crypto=await import('node:crypto');
 for(const [file,digest] of Object.entries(map.files)){
  const bytes=fs.readFileSync(new URL('../../../.cache/media-pool-candidate'+file,import.meta.url));
  expect(crypto.createHash('sha256').update(bytes).digest('hex')).toBe(digest);
  expect(bytes.slice(0,6).toString('ascii')).toMatch(/^GIF8[79]a$/);
  // en-tete du GIF : largeur et hauteur 480 x 262
  expect(bytes.readUInt16LE(6)).toBe(480);
  expect(bytes.readUInt16LE(8)).toBe(262);
 }
});
