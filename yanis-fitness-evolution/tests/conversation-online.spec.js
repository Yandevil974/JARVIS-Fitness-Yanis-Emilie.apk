import { test, expect } from '@playwright/test';
import { initialState } from '../src/store/model.js';
import { STORAGE_KEY } from '../src/app-identity.js';

async function openChat(page) {
 const state = initialState();
 state.profiles.elite.preferences.brain = { enabled: true, provider: 'groq', style: 'solo', key: 'TEST-FAKE-KEY-123456' };
 state.profiles.elite.messages = [];
 await page.addInitScript(({key,data}) => { if (!localStorage.getItem(key)) localStorage.setItem(key,JSON.stringify(data)); }, {key:STORAGE_KEY,data:state});
 await page.goto('/');
 await expect(page.locator('.save-status')).toContainText('Enregistré');
 await page.locator('.sidebar').getByRole('button',{name:'JARVIS',exact:true}).click();
}
async function ask(page, text) {
 await page.getByLabel('Votre message à JARVIS').fill(text);
 await page.getByRole('button',{name:'Envoyer à JARVIS',exact:true}).click();
}

test('une question ouverte est envoyée à l’IA sans déclencher une adaptation locale', async ({page}) => {
 const requests=[];
 await page.route('https://api.groq.com/**', async route => {
  if (route.request().method()==='OPTIONS') return route.fulfill({status:200,headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'*'}});
  requests.push(route.request().postDataJSON());
  return route.fulfill({status:200,headers:{'access-control-allow-origin':'*','content-type':'text/event-stream'},body:'data: {"choices":[{"delta":{"content":"Réponse IA de test."}}]}\n\ndata: [DONE]\n\n'});
 });
 await openChat(page);
 const before = await page.evaluate(k => JSON.parse(localStorage.getItem(k)).profiles.elite.checkIns, STORAGE_KEY);
 await ask(page,'Pourquoi les muscles sont-ils fatigués après une séance ?');
 await expect(page.getByText('Réponse IA de test.')).toBeVisible();
 expect(requests).toHaveLength(1);
 expect(requests[0].messages.at(-1).content).toBe('Pourquoi les muscles sont-ils fatigués après une séance ?');
 expect(JSON.stringify(requests[0].messages)).not.toContain('TEST-FAKE-KEY-123456');
 const after = await page.evaluate(k => JSON.parse(localStorage.getItem(k)).profiles.elite.checkIns, STORAGE_KEY);
 expect(after).toEqual(before);
});

test('une commande sportive reste locale même avec l’IA configurée', async ({page}) => {
 let calls=0;
 await page.route('https://api.groq.com/**',async route => { calls++; await route.abort(); });
 await openChat(page);
 await ask(page,'Prépare 4 séances par semaine pendant 12 semaines');
 await expect(page.getByRole('button',{name:'Appliquer l’adaptation'})).toBeVisible();
 expect(calls).toBe(0);
});

test('une panne réseau affiche le secours local', async ({page}) => {
 await page.route('https://api.groq.com/**',route => route.abort());
 await openChat(page);
 await ask(page,'Pourquoi le ciel est bleu ?');
 await expect(page.getByText('SECOURS LOCAL')).toBeVisible();
 await expect(page.getByText(/Je n’ai pas saisi votre demande/)).toBeVisible();
});
