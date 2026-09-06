import {test,expect} from '@playwright/test';
test('Web preview serves the app but not private backups, signing keys or Android assets',async({page,request})=>{
 await page.goto('/');await expect(page.locator('.page')).toBeVisible();
 for(const path of ['/.private/yanis-restored-profile.json','/.private/signing/debug.keystore','/android/app/src/main/assets/restoration/yanis-profile.json','/@fs/home/user/uploads/transformation_12_mois_sauvegarde.json','/%2eprivate/yanis-restored-profile.json']){const result=await request.get(path);expect(result.status(),path).toBe(403);}
 const media=await request.get('/team/advisor-0.webp');expect(media.status()).toBe(200);
});
