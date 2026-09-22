// Captures côte à côte : ancienne application (assets extraits de l'APK 1.5.0,
// servis en lecture seule) et Yanis Fitness Evolution (build de production).
//
// Prérequis locaux : npm i -D puppeteer-core ; Chrome/Chromium ($CHROME_BIN ou
// celui installé par Playwright) ; python3 -m http.server pour l'originale.
//   npx vite preview --port 4173                    # dossier du projet
//   python3 -m http.server 4174 --directory <orig>  # assets/public de l'APK
//   node verification/capture.mjs
// Les navigateurs sont identiques (même binaire) et chaque session démarre
// sur un profil vierge ; l'import du DOC réel passe par l'UI des deux apps.
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const CHROME = process.env.CHROME_BIN || "/usr/bin/chromium";
const DOC = process.env.DOC_FILE || "../../DOC-20260919-WA0000..json";
const OUT = process.env.SHOTS_DIR || "verification/shots";
const BASES = { orig: "http://127.0.0.1:4174", new: "http://127.0.0.1:4173" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errs = [];
const click = (page, t) =>
  page.evaluate((txt) => {
    const el = [...document.querySelectorAll("button,a,[role=button]")].find(
      (e) => e.textContent.includes(txt) && e.offsetParent !== null,
    );
    if (el) { el.click(); return true; }
    return false;
  }, t).then(async (ok) => { await sleep(750); return ok; });
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] });
for (const [tag, base] of Object.entries(BASES)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  page.on("pageerror", (e) => errs.push(`${tag}: ${e}`));
  await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1300);
  // import réel via l'UI (identique dans les deux applications)
  await click(page, "Mon profil");
  await click(page, "Données & sauvegardes");
  const inputs = await page.$$("input[type=file]");
  if (inputs.length && fs.existsSync(DOC)) {
    await inputs[0].uploadFile(DOC);
    await sleep(1000);
    await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Sauvegarder puis importer"))?.click());
    await sleep(1800);
  }
  const steps = [["accueil", null], ["force", "Bilan 1RM"], ["training", "Entraînement"], ["progression", "Progression"], ["nutrition", "Nutrition"], ["recuperation", "Récupération"], ["equipe", "Mon équipe"], ["cardio", "Cardio & piscine"], ["materiel", "Mon profil"]];
  for (const [name, nav] of steps) {
    await page.goto(base + "/", { waitUntil: "networkidle2" });
    await sleep(900);
    if (nav) await click(page, nav);
    await sleep(700);
    await page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
  }
  await page.close();
}
console.log(errs.length ? "ERREURS:\n" + errs.join("\n") : "OK — aucune erreur de page");
await browser.close();
