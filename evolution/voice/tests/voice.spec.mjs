import { test, expect } from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import { initialState } from '../../../JARVIS-Fitness-Source/src/store/model.js';
import { createTimer } from '../../../JARVIS-Fitness-Source/src/engine/timer.js';
async function nav(page, name) {
  const menu=page.getByRole('button',{name:'Ouvrir la navigation',exact:true});
  if(await menu.isVisible()) await menu.click();
  await page.locator('.sidebar').getByRole('button',{name,exact:true}).click();
}
async function open(page, state=initialState()) {
  await page.addInitScript(state=>{
    if(!localStorage.getItem('jarvis_fitness_v3')) localStorage.setItem('jarvis_fitness_v3',JSON.stringify(state));
    window.__recognizers=[]; window.__spoken=[]; window.__cancelled=0;
    class Recognition {
      constructor(){window.__recognizers.push(this);}
      start(){this.onstart?.();}
      stop(){this.stopped=true;}
      abort(){this.aborted=true;this.onerror?.({error:'aborted'});this.onend?.();}
      result(text){this.onresult?.({results:[[{transcript:text}]]});this.onend?.();}
    }
    window.SpeechRecognition=Recognition;
    window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'fr-FR'}],cancel(){window.__cancelled++;},speak(u){window.__spoken.push(u);}}});
  },state);
  await page.goto('/'); await expect(page.locator('.jf-reminders')).toBeVisible(); await nav(page,'JARVIS');
  await expect(page.locator('.jv-panel')).toBeVisible();
}
async function saved(page) {
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')||'null')?.updatedAt===Number(document.querySelector('.save-status')?.dataset.revision));
  return page.evaluate(()=>JSON.parse(localStorage.getItem('jarvis_fitness_v3')));
}
test.beforeEach(async({page})=>{page.__errors=[];page.on('pageerror',e=>page.__errors.push(e.message));});
test.afterEach(async({page})=>{expect(page.__errors).toEqual([]);});

test('dictation fills an editable draft and sends only after explicit confirmation',async({page})=>{
  await open(page); const before=await saved(page);
  await page.getByRole('button',{name:'Dicter un message',exact:true}).click();
  await expect(page.locator('.jv-status strong')).toHaveText('Écoute');
  await expect(page.getByRole('button',{name:'Envoyer à JARVIS',exact:true})).toBeDisabled();
  await page.evaluate(()=>window.__recognizers[0].onspeechend());
  await expect(page.locator('.jv-status strong')).toHaveText('Transcription');
  await page.evaluate(()=>window.__recognizers[0].result('Bonjour Jarvis'));
  await expect(page.getByLabel('Votre message à JARVIS',{exact:true})).toHaveValue('Bonjour Jarvis');
  expect((await saved(page)).profiles.elite.messages).toEqual(before.profiles.elite.messages);
  await page.getByLabel('Votre message à JARVIS',{exact:true}).fill('Bonjour, analyse ma semaine');
  await page.getByRole('button',{name:'Envoyer à JARVIS',exact:true}).click();
  const after=await saved(page);
  expect(after.profiles.elite.messages.filter(m=>m.role==='user').at(-1).text).toBe('Bonjour, analyse ma semaine');
  expect(after.profiles.elite.plan).toEqual(before.profiles.elite.plan);
});
test('second mic click cancels capture; stale recognition cannot overwrite the draft',async({page})=>{
  await open(page); await page.getByLabel('Votre message à JARVIS',{exact:true}).fill('Mon brouillon');
  await page.getByRole('button',{name:'Dicter un message',exact:true}).click();
  await page.getByRole('button',{name:'Arrêter l’écoute',exact:true}).click();
  await page.evaluate(()=>window.__recognizers[0].result('Ancienne reconnaissance'));
  await expect(page.getByLabel('Votre message à JARVIS',{exact:true})).toHaveValue('Mon brouillon');
  await expect(page.locator('.jv-status')).toContainText('Aucun message envoyé');
  expect(await page.evaluate(()=>window.__recognizers[0].aborted)).toBe(true);
});
test('diagnostics do not request microphone; explicit voice test has a visible lifecycle',async({page})=>{
  await open(page);
  await page.getByText('Diagnostic voix et microphone',{exact:true}).click();
  await page.getByRole('button',{name:'Vérifier les services vocaux',exact:true}).click();
  await expect(page.locator('.jv-diagnostics')).toContainText('Disponible selon le service');
  expect(await page.evaluate(()=>window.__recognizers.length)).toBe(0);
  await page.getByRole('button',{name:'Tester la voix',exact:true}).click();
  await expect(page.locator('.jv-status strong')).toHaveText('JARVIS parle');
  await page.evaluate(()=>window.__spoken.at(-1).onend());
  await expect(page.locator('.jv-status')).toContainText('Lecture terminée');
  await page.getByRole('button',{name:'Tester le microphone',exact:true}).click();
  await expect(page.locator('.jv-status strong')).toHaveText('Écoute');
  await page.getByRole('button',{name:'Arrêter la voix et l’écoute',exact:true}).click();
  await expect(page.locator('.jv-status strong')).toHaveText('Prêt');
});
test('permission refusal is visible, dismissible and keyboard remains usable on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844}); await open(page);
  await page.getByRole('button',{name:'Dicter un message',exact:true}).click();
  await page.evaluate(()=>window.__recognizers[0].onerror({error:'not-allowed'}));
  await expect(page.getByRole('alert')).toContainText('Microphone refusé');
  await page.getByRole('button',{name:'Fermer l’alerte vocale',exact:true}).click();
  await page.getByLabel('Votre message à JARVIS',{exact:true}).fill('Je préfère écrire');
  await expect(page.getByRole('button',{name:'Envoyer à JARVIS',exact:true})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('changing profile cancels capture and never transfers the recognized draft',async({page})=>{
  await open(page); await page.getByRole('button',{name:'Dicter un message',exact:true}).click();
  await page.getByRole('button',{name:'Changer de profil ou ouvrir mon profil',exact:true}).click();
  await page.getByRole('button',{name:/Émilie/}).click();
  await page.evaluate(()=>window.__recognizers[0].result('Brouillon de Yanis'));
  await nav(page,'JARVIS');
  await expect(page.getByLabel('Votre message à JARVIS',{exact:true})).toHaveValue('');
  expect((await saved(page)).profiles.emilie.messages).toHaveLength(0);
  expect(await page.evaluate(()=>window.__recognizers[0].aborted)).toBe(true);
});
test('active timer keeps microphone locked; paused timer permits dictation',async({page})=>{
  const state=initialState(); state.profiles.elite.timer=createTimer([{name:'Repos',seconds:120}],{type:'rest'});
  await open(page,state);
  await expect(page.getByRole('button',{name:'Dicter un message',exact:true})).toBeDisabled();
  await expect(page.locator('.jv-panel')).toContainText('Chrono actif');
  await page.locator('.floating-timer').click();
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Fermer',exact:true}).click();
  await expect(page.getByRole('button',{name:'Dicter un message',exact:true})).toBeEnabled();
  await page.getByRole('button',{name:'Dicter un message',exact:true}).click();
  await expect(page.locator('.jv-status strong')).toHaveText('Écoute');
});

test('expanded diagnostic is not clipped by the old chat height on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});await open(page);
  await page.getByText('Diagnostic voix et microphone',{exact:true}).click();
  await page.getByRole('button',{name:'Vérifier les services vocaux',exact:true}).click();
  await expect(page.locator('.jv-diagnostics')).toContainText('Plateforme');
  const panel=page.locator('.jv-chat');
  expect(await panel.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  await page.getByRole('button',{name:'Arrêter la voix et l’écoute',exact:true}).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button',{name:'Arrêter la voix et l’écoute',exact:true})).toBeInViewport();
});

test('choosing a quick prompt stops recording without sending a late transcript',async({page})=>{
  await open(page);await page.getByRole('button',{name:'Dicter un message',exact:true}).click();
  await page.getByRole('button',{name:'Je n’ai que 30 minutes',exact:true}).click();
  await page.evaluate(()=>window.__recognizers[0].result('Ne pas envoyer ce texte'));
  const state=await saved(page);
  expect(state.profiles.elite.messages.filter(m=>m.role==='user').at(-1).text).toBe('Je n’ai que 30 minutes');
  expect(await page.evaluate(()=>window.__recognizers[0].aborted)).toBe(true);
  await expect(page.getByLabel('Votre message à JARVIS',{exact:true})).toHaveValue('');
});
