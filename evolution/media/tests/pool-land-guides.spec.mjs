import fs from 'node:fs';
import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';
import {createTimer} from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
// Cinq guides aquatiques portent un dessin TERRESTRE. Decision utilisateur du
// 23 septembre 2026 : lacune explicite, jamais un dessin terrestre a la place
// d'un exercice aquatique. Les consignes aquatiques restent affichees.
const date=new Date('2026-09-23T10:00:00+04:00');
function state(profile,step){
 const s=initialState();s.activeProfile=profile;
 for(const p of Object.values(s.profiles)){p.timer=null;p.preferences.theme='dark';p.preferences.voice=false;}
 const timer=createTimer([step],{type:'swim',name:'Nage douce — contrôle'},date.getTime());
 timer.paused=true;s.profiles[profile].timer=timer;return s;
}
const cases=[['Gainage au bord (vertical)','/media/f1dde35bd517f24b.gif','margelle'],
             ['Mobilité épaules aquatique','/media/b2b32833d73d3ca4.gif',null],
             ['Ciseaux au bord','/media/48fe4a8cbb0d125c.gif',null],
             ['Talons-fesses','/media/7517a916496ec766.gif',null]];
test('aucun dessin terrestre dans une etape de piscine, lacune explicite a la place',async({page})=>{
 for(const [name,landImage,needle] of cases){
  const s=state('elite',{name,seconds:45,kind:'rest',pattern:'swim',segment:'pool',img:landImage,instruction:'Consignes aquatiques de reference.'});
  await page.clock.setFixedTime(date);
  await page.addInitScript(st=>localStorage.setItem('jarvis_fitness_v3',JSON.stringify(st)),s);
  await page.goto('/');await expect(page.locator('.training-hero')).toBeVisible();
  await page.locator('.jh-active').getByRole('button',{name:/^(Voir|Reprendre) le chrono$/}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  // Le dessin terrestre n'apparait ni comme visuel d'etape, ni dans les consignes.
  await expect(page.locator(`.timer-stage img[src="${landImage}"]`)).toHaveCount(0);
  await expect(page.locator('.timer-stage img[src*=".gif"]')).toHaveCount(0);
  await expect(page.locator('.media-audit-gap')).toBeVisible();
  // La consigne de l'etape reste affichee en entier : rien n'est reecrit.
  await expect(page.locator('.timer-stage')).toContainText('Consignes aquatiques de reference.');
  if(needle)await expect(page.locator('.timer-stage')).toContainText(needle);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')).profiles.elite.timer.steps);
  expect(saved[0].img).toBe(landImage); // l'etat enregistre n'est pas modifie
  await page.getByRole('button',{name:'Fermer',exact:true}).first().dispatchEvent('click').catch(()=>{});
 }
});
test('la bibliotheque piscine passe par le meme resolveur (aucun dessin terrestre dans la liste)',async()=>{
 const bundle=fs.readFileSync(new URL('../../../.cache/media-pool-candidate/assets/index-CBCies4k.js',import.meta.url),'utf8');
 expect(bundle).toContain('const C=JarvisPoolMedia.guide(j)');
 expect(bundle).not.toContain('const C=bl.find(Q=>Q.k.some(O=>Ge(j).includes(Ge(O))))');
 const source=fs.readFileSync(new URL('../candidate/pool-context.mjs',import.meta.url),'utf8');
 for(const name of cases.map(c=>c[0]))expect(source).toContain(`'${name}'`);
});
