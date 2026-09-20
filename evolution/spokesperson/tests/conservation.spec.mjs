import { test, expect } from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const backup=JSON.parse(fs.readFileSync(new URL('../../../DOC-20260919-WA0000..json',import.meta.url)));
const screens=['Accueil','JARVIS','Bilan 1RM','Entraînement','Programme','Progression','Cardio & piscine','Récupération','Mon équipe','Nutrition','Mon profil'];
async function nav(page,label){const menu=page.getByRole('button',{name:'Ouvrir la navigation',exact:true});if(await menu.isVisible())await menu.click();await page.locator('.sidebar').getByRole('button',{name:label,exact:true}).click();}
async function content(page){return page.locator('main').evaluate(main=>{
  const nodes=[...main.querySelectorAll('.js-team')],before=nodes.map(n=>n.style.display);
  nodes.forEach(n=>n.style.display='none');const text=main.innerText.replace(/\s+/g,' ').trim();nodes.forEach((n,i)=>n.style.display=before[i]);return text;
});}
for(const id of ['elite','emilie'])for(const width of [390,1440])test(`Step 3 retains complete screens, voice and reminder board: ${id}, ${width}px`,async({page,browser})=>{
  const reference=await browser.newPage({viewport:{width,height:1000},timezoneId:'Indian/Reunion'});
  await page.setViewportSize({width,height:1000});const errors=[];
  const state=structuredClone(backup);state.activeProfile=id;for(const p of Object.values(state.profiles))p.timer=null;
  for(const p of [page,reference]){p.on('pageerror',e=>errors.push(e.message));await p.clock.setFixedTime(new Date('2026-09-20T08:00:00+04:00'));await p.addInitScript(s=>localStorage.setItem('jarvis_fitness_v3',JSON.stringify(s)),state);}
  await page.goto('/');await reference.goto(process.env.STEP2_URL||'http://127.0.0.1:5176');
  await expect(page.locator('.jf-reminders')).toBeVisible();await expect(reference.locator('.jf-reminders')).toBeVisible();
  for(const screen of screens){
    await nav(page,screen);await nav(reference,screen);const tabs=await reference.getByRole('tab').allTextContents();
    expect(await page.getByRole('tab').allTextContents(),screen).toEqual(tabs);
    expect(await content(page),screen).toBe(await content(reference));
    for(let i=0;i<tabs.length;i++){await page.getByRole('tab').nth(i).click();await reference.getByRole('tab').nth(i).click();expect(await content(page),`${screen}/${tabs[i]}`).toBe(await content(reference));}
  }
  expect(errors).toEqual([]);await reference.close();
});
