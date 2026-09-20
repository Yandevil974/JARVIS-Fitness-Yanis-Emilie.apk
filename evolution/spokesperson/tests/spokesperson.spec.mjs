import { test, expect } from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import { initialState, validateState } from '../../../JARVIS-Fitness-Source/src/store/model.js';
import { createTimer } from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
import { settings, saveSettings } from '../engine.mjs';
const clock='2026-09-20T08:00:00+04:00';
const board=page=>page.locator('.js-team');
async function nav(page,label){const menu=page.getByRole('button',{name:'Ouvrir la navigation',exact:true});if(await menu.isVisible())await menu.click();await page.locator('.sidebar').getByRole('button',{name:label,exact:true}).click();}
async function saved(page){await page.waitForFunction(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')||'null')?.updatedAt===Number(document.querySelector('.save-status')?.dataset.revision));return page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')));}
function fixture(greeting=false){const state=initialState();for(const p of Object.values(state.profiles)){
  p.timer=null;p.preferences.voice=true;p.checkIns={};p.measurements=[{id:'cm',date:'2026-08-10',values:{taille:90}},{id:'weight',date:'2026-09-04',weight:80,values:{}}];p.teamReviews=[{id:'week',date:'2026-09-13',week:0}];p.forceTests=[{id:'force',date:'2026-08-10',exerciseId:'squat',unit:'kg total',baseKey:'squat',estimate:80}];
  if(greeting)saveSettings(p,{...settings(p),greetingEnabled:true});
}return validateState(state);}
async function open(page,state=fixture()){
  await page.clock.setFixedTime(new Date(clock));
  await page.addInitScript(state=>{
    if(!localStorage.getItem('jarvis_fitness_v3'))localStorage.setItem('jarvis_fitness_v3',JSON.stringify(state));
    window.__spoken=[];window.__recognizers=[];window.__cancelled=0;
    window.SpeechRecognition=class {constructor(){window.__recognizers.push(this);}start(){this.onstart?.();}abort(){this.aborted=true;this.onend?.();}};
    window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){window.__cancelled++;},getVoices:()=>[
      {voiceURI:'fr-local',name:'Français local',lang:'fr-FR',localService:true},{voiceURI:'fr-network',name:'Français réseau',lang:'fr-CA',localService:false},{voiceURI:'en',name:'English',lang:'en-US',localService:true}],speak(u){window.__spoken.push(u);}}});
  },state);
  await page.goto('/');await expect(board(page)).toBeVisible();
}
const count=page=>page.evaluate(()=>window.__spoken.length);
const finish=page=>page.evaluate(()=>window.__spoken.at(-1).onend());
async function profile(page,name){await page.getByRole('button',{name:'Changer de profil ou ouvrir mon profil',exact:true}).click();await page.getByRole('button',{name:new RegExp(name)}).click();}
async function options(page){await board(page).getByRole('button',{name:'Réglages vocaux',exact:true}).click();return page.getByRole('dialog',{name:'La voix de ton équipe',exact:true});}
test.beforeEach(async({page})=>{page.__errors=[];page.on('pageerror',e=>page.__errors.push(e.message));});
test.afterEach(async({page})=>{expect(page.__errors).toEqual([]);});

test('default greeting is silent, priorities explain real dates and open the original measurement form',async({page})=>{
  await open(page);expect(await count(page)).toBe(0);expect(await page.evaluate(()=>window.__recognizers.length)).toBe(0);
  const first=board(page).locator('.js-priority').first();await expect(first).toContainText('Mensurations');await expect(first.locator('.js-coach')).not.toBeEmpty();
  await first.getByText('Pourquoi ?', {exact:true}).click();await expect(first).toContainText('10 septembre 2026');await expect(first).toContainText('Une pesée seule');
  const before=await saved(page);await first.getByRole('button',{name:/Ouvrir/}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByLabel('Tour de taille (au nombril)',{exact:true})).toBeVisible();
  await page.getByRole('dialog').getByRole('button',{name:'Fermer',exact:true}).click();expect((await saved(page)).profiles.elite.plan).toEqual(before.profiles.elite.plan);
});
test('manual read then repeat uses two priorities, never records and leaves reminders and programme unchanged',async({page})=>{
  await open(page);const before=await saved(page);await board(page).getByRole('button',{name:'Écouter le point',exact:true}).click();
  await expect(board(page).locator('.js-audio-status')).toContainText('JARVIS parle');const text=await page.evaluate(()=>window.__spoken[0].text);
  expect(text).toContain('Bonjour Yanis');expect(text).toContain('équipe virtuelle');expect(text).toContain('programme reste inchangé');expect(text.length).toBeLessThan(550);
  await finish(page);await board(page).getByRole('button',{name:'Répéter le point',exact:true}).click();expect(await count(page)).toBe(2);await finish(page);
  const after=await saved(page);expect(after.profiles.elite.plan).toEqual(before.profiles.elite.plan);expect(after.profiles.elite.followUp).toEqual(before.profiles.elite.followUp);expect(after.profiles.elite.messages).toEqual(before.profiles.elite.messages);expect(await page.evaluate(()=>window.__recognizers.length)).toBe(0);
});
test('optional automatic greeting plays once per profile and local day, including after reload',async({page})=>{
  await open(page,fixture(true));await expect.poll(()=>count(page)).toBe(1);await finish(page);await saved(page);
  await page.reload();await expect(board(page)).toBeVisible();await expect(board(page).getByRole('button',{name:'Répéter le point',exact:true})).toBeEnabled();expect(await count(page)).toBe(0);
  await profile(page,'Émilie');await expect.poll(()=>count(page)).toBe(1);expect(await page.evaluate(()=>window.__spoken[0].text)).toContain('Bonjour Émilie');await finish(page);
  await page.clock.setFixedTime(new Date('2026-09-21T08:00:00+04:00'));await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await expect.poll(()=>count(page)).toBe(2);await finish(page);
});
test('Plus tard survives reload for one hour without completing or postponing the underlying tasks',async({page})=>{
  await open(page);const before=await saved(page);await board(page).getByRole('button',{name:'Plus tard · 1 h',exact:true}).click();
  await expect(board(page)).toContainText('en pause jusqu’à 09:00');await expect(page.locator('.jf-reminder[data-kind="measurements"]')).toHaveAttribute('data-status','due');await saved(page);
  await page.reload();await expect(board(page)).toContainText('en pause jusqu’à 09:00');
  const after=await saved(page);expect(after.profiles.elite.followUp).toEqual(before.profiles.elite.followUp);expect(after.profiles.elite.measurements).toEqual(before.profiles.elite.measurements);
  await page.clock.setFixedTime(new Date('2026-09-20T09:00:01+04:00'));await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await expect(board(page).getByRole('button',{name:'Écouter le point',exact:true})).toBeVisible();
});
test('French voices and rate are actually applied, saved per profile and separate from Android',async({page})=>{
  await open(page);let dialog=await options(page);await dialog.getByRole('button',{name:'Actualiser les voix disponibles',exact:true}).click();
  const choices=dialog.getByRole('combobox',{name:'Voix française · navigateur',exact:true});await expect(choices.locator('option')).toHaveCount(3);await choices.selectOption('fr-network');await dialog.getByRole('combobox',{name:'Débit de lecture',exact:true}).selectOption('1.1');
  await dialog.getByRole('button',{name:'Tester ces réglages',exact:true}).click();expect(await page.evaluate(()=>({rate:window.__spoken.at(-1).rate,id:window.__spoken.at(-1).voice.voiceURI}))).toEqual({rate:1.1,id:'fr-network'});await finish(page);
  await dialog.getByRole('button',{name:'Enregistrer la voix',exact:true}).click();const state=await saved(page);expect(state.profiles.elite.spokesperson.settings.voiceIds).toEqual({browser:'fr-network',android:''});
  await page.reload();dialog=await options(page);await expect(dialog.getByRole('combobox',{name:'Débit de lecture',exact:true})).toHaveValue('1.1');await dialog.getByRole('button',{name:'Annuler',exact:true}).click();
  await profile(page,'Émilie');dialog=await options(page);await expect(dialog.getByRole('combobox',{name:'Débit de lecture',exact:true})).toHaveValue('0.98');await expect(dialog.getByRole('combobox',{name:'Voix française · navigateur',exact:true})).toHaveValue('');
});
test('silent mode persists across pages and reload, suppresses tests but not explicit microphone capture',async({page})=>{
  await open(page);const dialog=await options(page);await dialog.getByLabel('Mode silencieux · couper toutes les lectures',{exact:true}).check();await dialog.getByRole('button',{name:'Enregistrer la voix',exact:true}).click();await saved(page);
  await page.reload();await expect(board(page).getByRole('button',{name:'Écouter le point',exact:true})).toBeDisabled();await nav(page,'JARVIS');await expect(page.locator('.js-silent')).toBeVisible();
  await page.getByText('Diagnostic voix et microphone',{exact:true}).click();await page.getByRole('button',{name:'Tester la voix',exact:true}).click();await expect(page.locator('.jv-alert')).toContainText('mode silencieux');expect(await count(page)).toBe(0);
  await page.getByRole('button',{name:'Dicter un message',exact:true}).click();await expect(page.locator('.jv-status strong')).toHaveText('Écoute');expect(await page.evaluate(()=>window.__recognizers.length)).toBe(1);
});
test('leaving the dashboard cancels its utterance; a late completion cannot mark it played',async({page})=>{
  await open(page);await board(page).getByRole('button',{name:'Écouter le point',exact:true}).click();const cancellations=await page.evaluate(()=>window.__cancelled);
  await nav(page,'Programme');expect(await page.evaluate(()=>window.__cancelled)).toBeGreaterThan(cancellations);await finish(page);await nav(page,'Accueil');
  await expect(board(page).getByRole('button',{name:'Écouter le point',exact:true})).toBeEnabled();expect((await saved(page)).profiles.elite.spokesperson.daily.played).toBeUndefined();
});
test('active timer and open modal prevent greeting; pausing and closing allow one greeting',async({page})=>{
  const state=fixture(true);state.profiles.elite.timer=createTimer([{name:'Repos',seconds:120}],{type:'rest'},new Date(clock).getTime());await open(page,state);
  await expect(board(page)).toContainText('Chrono actif');expect((await saved(page)).profiles.elite.spokesperson.daily).toBeUndefined();
  await page.locator('.floating-timer').click();await page.getByRole('button',{name:'Pause',exact:true}).click();expect(await count(page)).toBe(0);
  await page.getByRole('dialog').getByRole('button',{name:'Fermer',exact:true}).click();await expect.poll(()=>count(page)).toBe(1);await finish(page);
});
test('failed automatic greeting is explained and not retried on reload',async({page})=>{
  await open(page,fixture(true));await expect.poll(()=>count(page)).toBe(1);await page.evaluate(()=>window.__spoken[0].onerror());
  await expect(board(page).locator('.js-audio-status')).toContainText('synthèse vocale a échoué');await saved(page);await page.reload();
  await expect(board(page).getByRole('button',{name:'Écouter le point',exact:true})).toBeEnabled();expect(await count(page)).toBe(0);
});
test('mobile briefing and voice settings remain readable, keyboard-closeable and within the viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});await open(page);await board(page).scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:'.cache/spokesperson-mobile.png',fullPage:true});
  const dialog=await options(page);await dialog.getByRole('button',{name:'Actualiser les voix disponibles',exact:true}).click();await dialog.getByRole('button',{name:'Enregistrer la voix',exact:true}).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole('button',{name:'Enregistrer la voix',exact:true})).toBeInViewport();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:'.cache/spokesperson-settings-mobile.png'});await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
});
