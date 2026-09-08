/* ==========================================================================
   IDENTITÉ COLORÉE DES PAGES
   Vérifie que chaque page porte bien sa teinte de signature en mode
   clair, que cette teinte ne fuit pas en mode sombre, et que le texte
   reste lisible dessus. Sans ce contrôle, une règle ajoutée plus tard
   pourrait repeindre une page en gris sans que personne le voie.
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
const dir = "release/assets";
const file = fs.readdirSync(dir).filter((f) => f.endsWith(".css"))
  .map((f) => [f, fs.statSync(path.join(dir, f)).size])
  .sort((a, b) => b[1] - a[1])[0][0];
const css = fs.readFileSync(path.join(dir, file), "utf8");

const PAGES = ["jarvis","force","training","program","progress","cardio","recovery","nutrition","team"];
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const TITRE = hex("#231f1c");
const TEXTE = hex("#56514c");
let defauts = 0;
const teintes = new Map();
for (const p of PAGES) {
  const m = new RegExp(`\\.page-${p}\\{([^}]*)\\}`).exec(css);
  const t = m && /--page-teinte:\s*(#[0-9a-f]{6})/i.exec(m[1]);
  if (!t) { console.log(`  ${p} : AUCUNE teinte`); defauts++; continue; }
  const rgb = hex(t[1]);
  const rt = ratio(rgb, TITRE), rx = ratio(rgb, TEXTE);
  if (rx < 4.5) { console.log(`  ${p} : texte à ${rx.toFixed(1)}:1 sur ${t[1]}`); defauts++; }
  if (teintes.has(t[1])) console.log(`  note : ${p} partage sa teinte avec ${teintes.get(t[1])}`);
  else teintes.set(t[1], p);
}
// Aucune teinte ne doit s'appliquer en mode sombre.
let fuite = 0;
const re = /([^{}]+)\{([^{}]*)\}/g;
let m;
while ((m = re.exec(css))) {
  if (!/--page-teinte/.test(m[2])) continue;
  for (const sel of m[1].split(",").map((x) => x.trim()))
    if (/\[data-theme=dark\]/.test(sel) && !/:not\(\[data-theme=dark\]\)/.test(sel)) fuite++;
}
if (fuite) { console.log(`  ${fuite} règle(s) de teinte actives en mode sombre`); defauts += fuite; }
console.log(`Identité des pages : ${defauts} défaut(s), ${teintes.size} teintes distinctes sur ${PAGES.length} pages`);
