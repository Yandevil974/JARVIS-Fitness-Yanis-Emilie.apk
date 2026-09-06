/* Convertit les couleurs bleues codées en dur de styles.css en couleurs
   dérivées de variables de thème, afin que chaque profil (Yanis / Émilie)
   reçoive sa propre palette sans réécrire la feuille de style.

   Règles :
   - gris (S < 12) et couleurs sémantiques hors bleu : inchangés
   - surfaces sombres (L < 46) : teinte -> var(--h-surface) / var(--s-surface)
   - accents clairs (L >= 46) : teinte -> var(--h-accent) / var(--s-accent)
   Le décalage de teinte d'origine est conservé pour garder les nuances.
   Gère les hexadécimaux à 6 et 8 chiffres (alpha).
*/
import fs from "fs";
const FILE = new URL("../src/styles.css", import.meta.url);
const BLUE_LOW = 185, BLUE_HIGH = 250, PIVOT = 216;

function toHsl(hex) {
  let h = hex;
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255,
    g = parseInt(h.slice(2, 4), 16) / 255,
    b = parseInt(h.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let s = 0, hh = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hh *= 60;
  }
  return [hh, s * 100, l * 100];
}
const r1 = (v) => String(Math.round(v * 10) / 10);

function convert(body, alphaHex) {
  const [h, s, l] = toHsl(body);
  if (s < 12) return null;
  if (h < BLUE_LOW || h > BLUE_HIGH) return null;
  const delta = Math.round((h - PIVOT) * 10) / 10;
  const sign = delta >= 0 ? " + " : " - ";
  const off = r1(Math.abs(delta));
  const surface = l < 46;
  const hv = surface ? "--h-surface" : "--h-accent";
  const sv = surface ? "--s-surface" : "--s-accent";
  const mult = String(Math.round(s * (surface ? 0.92 : 1)) / 100);
  const alpha = alphaHex ? r1(Math.round((parseInt(alphaHex, 16) / 255) * 1000) / 10) + "%" : null;
  const base = `calc(var(${hv})${sign}${off}deg), calc(var(${sv}) * ${mult}), ${r1(l)}%`;
  return alpha ? `hsl(${base} / ${alpha})` : `hsl(${base})`;
}

let css = fs.readFileSync(FILE, "utf8");
let n6 = 0, n8 = 0;
css = css.replace(/#([0-9a-fA-F]{8})\b/g, (m, hex) => {
  const out = convert(hex.slice(0, 6), hex.slice(6, 8));
  if (!out) return m;
  n8++;
  return out;
});
css = css.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m, hex) => {
  const out = convert(hex.toLowerCase(), null);
  if (!out) return m;
  n6++;
  return out;
});
fs.writeFileSync(FILE, css);
console.log(`couleurs converties : ${n6} opaques, ${n8} avec alpha`);
