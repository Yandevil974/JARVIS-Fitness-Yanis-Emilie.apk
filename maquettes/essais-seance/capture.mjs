import { chromium } from '../../yanis-fitness-evolution/node_modules/playwright/index.mjs';
import { resolve } from 'node:path';

const browser = await chromium.launch({ headless:true, executablePath:process.env.CHROME_BIN });
try {
  const page = await browser.newPage({ viewport:{width:390,height:900}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  await page.goto('http://127.0.0.1:4175/', {waitUntil:'networkidle'});
  await page.locator('video').evaluate(async (video) => {
    await new Promise((resolve, reject) => {
      if (video.readyState >= 2) return resolve();
      video.addEventListener('loadeddata', resolve, {once:true});
      video.addEventListener('error', reject, {once:true});
    });
    video.currentTime = 1.5;
    await new Promise(resolve => video.addEventListener('seeked',resolve,{once:true}));
    video.pause();
  });
  for (const [mode, file] of [['full','essai-2-rectangulaire.png']]) {
    await page.locator(`[data-mode="${mode}"]`).click();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error('Débordement horizontal sur téléphone : '+ mode);
    await page.screenshot({path:resolve('maquettes/essais-seance',file),fullPage:true, animations:'disabled'});
    console.log('Capture prête : ' + file);
  }
} finally { await browser.close(); }
