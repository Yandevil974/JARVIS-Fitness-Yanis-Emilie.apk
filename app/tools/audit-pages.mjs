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
function hsl2rgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}

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
/* Le mode sombre a désormais ses propres teintes, volontairement : on
   vérifie qu'elles existent, qu'elles sont lisibles sur le fond noir et
   qu'aucune n'est réutilisée. Auparavant ce contrôle exigeait leur
   absence, ce qui n'a plus lieu d'être. */
const FOND_NUIT = hex("#111113");
const TEXTE_NUIT = hex("#f6f6f7");
const DISCRET_NUIT = hex("#bfc1c4");
const nuit = new Map();
for (const p of PAGES) {
  const m = new RegExp(`\\[data-theme=dark\\] \\.page-${p}\\{([^}]*)\\}`).exec(css);
  const t = m && /--page-teinte:\s*hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/i.exec(m[1]);
  if (!t) { console.log(`  ${p} : aucune teinte sombre`); defauts++; continue; }
  const rgb = hsl2rgb(+t[1], +t[2], +t[3]);
  const rd = ratio(rgb, DISCRET_NUIT);
  const rf = ratio(rgb, FOND_NUIT);
  if (rd < 4.5) { console.log(`  ${p} : texte discret à ${rd.toFixed(1)}:1`); defauts++; }
  if (rf < 1.5) { console.log(`  ${p} : teinte trop proche du fond (${rf.toFixed(2)})`); defauts++; }
  const cle = `${t[1]}`;
  if (nuit.has(cle)) { console.log(`  ${p} partage sa teinte avec ${nuit.get(cle)}`); defauts++; }
  else nuit.set(cle, p);
}
// Deux pages ne doivent pas se confondre : au moins 15 degrés d'écart.
const tons = [...nuit.keys()].map(Number).sort((a, b) => a - b);
for (let i = 0; i < tons.length; i++)
  for (let j = i + 1; j < tons.length; j++) {
    const d = Math.min(Math.abs(tons[i] - tons[j]), 360 - Math.abs(tons[i] - tons[j]));
    if (d < 15) { console.log(`  teintes trop voisines : ${tons[i]}° et ${tons[j]}°`); defauts++; }
  }
console.log(`Identité des pages : ${defauts} défaut(s), ${teintes.size} teintes claires et ${nuit.size} teintes sombres sur ${PAGES.length} pages`);
