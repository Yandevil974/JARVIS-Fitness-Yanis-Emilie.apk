/* ==========================================================================
   AUDIT DU MODE SOMBRE
   Pour chaque cible de la feuille, détermine le fond qui GAGNE réellement
   la cascade en mode sombre, puis mesure sa clarté. Signale tout ce qui
   reste clair : le texte y est blanc, donc illisible.

   Trois pièges appris à la dure, et couverts ici :
     - le CSS minifié écrit « calc(...),calc(...),88% » sans espace ;
     - les sélecteurs composés (« .btn.secondary ») comptent aussi ;
     - un fond peut être un dégradé, pas seulement une couleur unie.
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";

const dir = "release/assets";
const file = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => [f, fs.statSync(path.join(dir, f)).size])
  .sort((a, b) => b[1] - a[1])[0][0];
const css = fs.readFileSync(path.join(dir, file), "utf8");

const lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

/** Clarté moyenne d'une valeur de fond, unie ou dégradée, en pourcent. */
function clarte(v) {
  const vals = [];
  for (const m of v.matchAll(/hsl\([^()]*(?:\([^()]*\)[^()]*)*\)/gi)) {
    const p = /,\s*([\d.]+)%\s*(?:\/[^)]*)?\)?\s*$/.exec(m[0]);
    if (p) vals.push(+p[1]);
  }
  for (const m of v.matchAll(/#([0-9a-f]{6})\b/gi))
    vals.push(lum([0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16))) * 100);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** Toutes les cibles : dernier composant de chaque sélecteur. */
const cibles = new Set();
for (const m of css.matchAll(/([^{}]+)\{/g))
  for (const sel of m[1].split(",")) {
    const t = sel.trim().split(/\s+/).pop();
    if (t && t.startsWith(".")) cibles.add(t.replace(/:[^.]*$/, ""));
  }

const fautifs = [];
for (const cible of cibles) {
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m,
    gagnant = null;
  while ((m = re.exec(css))) {
    const sels = m[1].split(",").map((x) => x.trim());
    if (sels.every((s) => /:not\(\[data-theme=dark\]\)/.test(s))) continue;
    if (!sels.some((s) => s === cible || s.endsWith(" " + cible))) continue;
    const bm = /(?:^|;)\s*background(?:-color|-image)?\s*:\s*([^;]+)/.exec(m[2]);
    if (bm) gagnant = bm[1];
  }
  if (!gagnant) continue;
  if (/var\(--(panel|bg|sidebar|rail-bg|accent|surface)/.test(gagnant)) continue;
  if (/^\s*(none|transparent|inherit)/.test(gagnant)) continue;
  const l = clarte(gagnant);
  if (l == null || l < 55) continue;
  fautifs.push({ cible, l: l.toFixed(0), bg: gagnant.trim().slice(0, 38) });
}
fautifs.sort((a, b) => b.l - a.l);
console.log(`Fonds clairs en mode sombre : ${fautifs.length}`);
for (const f of fautifs.slice(0, 40))
  console.log(`  L~${String(f.l).padStart(3)}%  ${f.cible.padEnd(34)} ${f.bg}`);
fs.writeFileSync("/tmp/fautifs.json", JSON.stringify(fautifs.map((f) => f.cible)));

/* --- Icônes SVG : fill et stroke écrits en dur ----------------------- */
const PANEL2 = [38, 40, 43];
function coul(v) {
  v = v.trim().replace(/!important/, "");
  let m = /^#([0-9a-f]{6})\b/i.exec(v);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = /^#([0-9a-f]{3})\b/i.exec(v);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16));
  return null;
}
const ratio = (a, b) => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
let icones = 0;
{
  const re2 = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re2.exec(css))) {
    const sels = m[1].split(",").map((x) => x.trim());
    if (sels.some((s) => /\[data-theme=dark\]/.test(s))) continue;
    if (sels.every((s) => /:not\(\[data-theme=dark\]\)/.test(s))) continue;
    for (const f of m[2].matchAll(/\b(fill|stroke)\s*:\s*([^;]+)/g)) {
      if (/var\(|none|currentcolor/i.test(f[2])) continue;
      // Une surcharge sombre sur la même cible corrige déjà le cas.
      if (sels.some((s2) => css.includes(`[data-theme=dark] ${s2}{`))) continue;
      const c = coul(f[2]);
      if (c && ratio(c, PANEL2) < 3) {
        icones++;
        console.log(`  icône ${f[1]}:${f[2].trim()} sur ${sels[0].slice(0, 40)}`);
      }
    }
  }
}
console.log(`Icônes SVG trop sombres : ${icones}`);
