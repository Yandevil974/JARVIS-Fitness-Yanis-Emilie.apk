import {test,expect} from '@playwright/test';
import {initialState} from '../src/store/model.js';
import {STORAGE_KEY} from '../src/app-identity.js';

test('le contrôle local du JSON ne remplace ni les données ni le stockage', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('.save-status')).toContainText('Enregistré');
 await page.getByRole('button',{name:'Changer de profil ou ouvrir mon profil'}).click();
 await page.getByRole('button',{name:'Ouvrir mon profil'}).click();
 await page.getByRole('tab',{name:'Données & sauvegardes'}).click();
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
