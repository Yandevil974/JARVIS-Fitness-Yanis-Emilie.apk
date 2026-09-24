import {test,expect} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import {initialState,validateState} from '../../../JARVIS-Fitness-Source/src/store/model.js';
// Deux visuels d'etirement en ecart, echanges le 23 septembre 2026 avec des
// dessins DEJA presents dans l'application. Aucune consigne n'est reecrite.
function state(){
 const s=initialState();s.activeProfile='elite';
 for(const p of Object.values(s.profiles)){p.timer=null;p.preferences.theme='dark';p.preferences.voice=false;}
 validateState(structuredClone(s));return s;
}
async function openStretch(page){
 await page.addInitScript(s=>{if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s))},state());
 await page.goto('/');await expect(page.locator('.training-hero')).toBeVisible();
 await page.getByRole('button',{name:'Récupération',exact:true}).first().dispatchEvent('click');
 const tab=page.locator('button, [role=tab]').filter({hasText:/^Mobilité & stretching$/}).first();
 await expect(tab).toBeVisible();
 await tab.dispatchEvent('click');
 await expect.poll(async()=>page.locator('img[src*="stretch-"]').count()).toBeGreaterThan(10);
}
test('les deux visuels echanges affichent la posture decrite, aucun autre dessin ne bouge',async({page})=>{
 await openStretch(page);
 const srcs=await page.locator('img[src*="stretch-"]').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
 // Le dos anatomique et le pigeon au sol ne sont plus affiches nulle part.
 expect(srcs).not.toContain('/media/stretch-triceps-dos.jpg');
 expect(srcs).not.toContain('/media/stretch-pigeon.jpg');
 // Les deux dessins corrects portent maintenant deux entrees chacun.
 expect(srcs.filter(s=>s==='/media/stretch-triceps-coude.jpg')).toHaveLength(2);
 expect(srcs.filter(s=>s==='/media/stretch-piriforme.jpg')).toHaveLength(2);
 // Aucun autre visuel d'etirement n'est touche : le reste de la liste est identique.
 const others=srcs.filter(s=>!/stretch-(triceps-(dos|coude)|pigeon|piriforme)\.jpg$/.test(s));
 expect(others).toHaveLength(25);
});
test('les durees et consignes affichees restent celles du paquet 1.4.0',async({page})=>{
 await openStretch(page);
 const list=await page.locator('body').innerText();
 // Durees source inchangees : le pigeon reste en 30-45 s/cote, le piriforme en 30 s/cote.
 expect(list).toContain('30-45 s/côté');
 expect(list).toContain('30 s/côté');
 expect(list).toContain('20-30 s/côté');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')));
 expect(saved.profiles.elite.sessions).toEqual([]);
 expect(saved.profiles.elite.measurements).toEqual([]);
});
