import {test,expect} from '@playwright/test';
import {initialState} from '../src/store/model.js';
import {STORAGE_KEY} from '../src/app-identity.js';

test('le contrôle local du JSON ne remplace ni les données ni le stockage', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('.save-status')).toContainText('Enregistré');
 await page.locator('.sidebar').getByRole('button',{name:'Données & paramètres'}).click();
 await expect(page.getByRole('tab',{name:'Données & sauvegardes'})).toHaveAttribute('aria-selected','true');
 const input=page.locator('input[accept=".json,application/json"]');
 const before=await page.evaluate(k=>localStorage.getItem(k),STORAGE_KEY);
 const content=Buffer.from(JSON.stringify(initialState()));
 await input.setInputFiles({name:'sauvegarde.json',mimeType:'application/json',buffer:content});
 await expect(page.getByRole('status')).toContainText('Structure de la sauvegarde valide');
 expect(await page.evaluate(k=>localStorage.getItem(k),STORAGE_KEY)).toBe(before);
 const invalid=initialState();invalid.profiles.elite.user.age=-1;
 await input.setInputFiles({name:'invalide.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
 await expect(page.getByRole('status')).toContainText('Sauvegarde non validée');
 await expect(page.getByRole('status')).toContainText('Aucun import ni remplacement');
 expect(await page.evaluate(k=>localStorage.getItem(k),STORAGE_KEY)).toBe(before);
});

test('une durée anormale est préservée et ne bloque plus la sauvegarde au redémarrage',async({page})=>{
 const state=initialState();
 const session=structuredClone(state.profiles.elite.plan.sessions.find(s=>s.exercises.length));
 session.id='session-longue-test'; session.date=new Date().toISOString().slice(0,10); session.status='completed';session.durationSec=173025;
 state.profiles.elite.sessions.push(session);
 await page.addInitScript(({key,data})=>localStorage.setItem(key,JSON.stringify(data)),{key:STORAGE_KEY,data:state});
 await page.goto('/');
 await expect(page.locator('.save-status')).toContainText('Enregistré');
 const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),STORAGE_KEY);
 const recovered=saved.profiles.elite.sessions.find(s=>s.id==='session-longue-test');
 expect(recovered.durationSec).toBeNull();
 expect(recovered.durationReview.originalSeconds).toBe(173025);
 expect(recovered.exercises).toEqual(session.exercises);
});
