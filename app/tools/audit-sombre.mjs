/* Pour chaque classe simple de la feuille, détermine le fond qui gagne
   réellement en mode sombre et signale ceux restés clairs. Approche par
   vainqueur de cascade, plus fiable que l'inspection règle par règle. */
import fs from "node:fs";
import path from "node:path";
const dir = "release/assets";
const file = fs.readdirSync(dir).filter((f) => f.endsWith(".css"))
  .map((f) => [f, fs.statSync(path.join(dir, f)).size])
  .sort((a, b) => b[1] - a[1])[0][0];
const css = fs.readFileSync(path.join(dir, file), "utf8");

function hsl2rgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}
function parse(v) {
  v = (v || "").trim();
  // Le CSS minifié écrit « calc(var(--x) - 8),calc(...),88.8% » : les
  // parenthèses sont imbriquées et il n'y a pas d'espace après la
  // virgule. Une lecture naïve renvoyait null et le fond passait pour
  // sombre. On prend la dernière valeur en pourcentage, la clarté.
  let m = /^hsl\(.*,\s*([\d.]+)%\s*\)?\s*$/i.exec(v);
  if (m) return hsl2rgb(0, 0, +m[1]);
  m = /#([0-9a-f]{6})\b/i.exec(v);
  if (m) return [0,2,4].map((i) => parseInt(m[1].slice(i,i+2),16));
  m = /hsl\(\s*([\d.]+)\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/i.exec(v);
  if (m) return hsl2rgb(+m[1], +m[2], +m[3]);
  return null;
}
const lin = (c) => { c /= 255; return c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4; };
const lum = ([r,g,b]) => .2126*lin(r)+.7152*lin(g)+.0722*lin(b);

// Cibles à examiner : le dernier composant de chaque sélecteur, en
// gardant les classes composées (« .btn.secondary »). Ne prendre que les
// classes simples laissait passer les boutons secondaires, les pastilles
// et les champs, qui sont tous des sélecteurs composés.
const classes = new Set();
{
  const r = /([^{}]+)\{/g; let m;
  while ((m = r.exec(css))) {
    for (const sel of m[1].split(",")) {
      const t = sel.trim().split(/\s+/).pop();
      if (!t || !t.startsWith(".")) continue;
      const propre = t.replace(/:[^.]*$/, "");
      if (/^\.[\w.-]+$/.test(propre)) classes.add(propre);
    }
  }
}

const fautifs = [];
for (const cible of classes) {
  const r = /([^{}]+)\{([^{}]*)\}/g; let m, gagnant = null;
  while ((m = r.exec(css))) {
    const sels = m[1].split(",").map((x) => x.trim());
    // Règles applicables en mode sombre uniquement.
    if (sels.every((s) => /:not\(\[data-theme=dark\]\)/.test(s))) continue;
    if (!sels.some((s) => s === cible || s.endsWith(" " + cible))) continue;
    const bm = /(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/.exec(m[2]);
    if (bm) gagnant = bm[1];
  }
  if (!gagnant) continue;
  if (/var\(--(panel|bg|sidebar|rail-bg|accent|surface)/.test(gagnant)) continue;
  if (/none|transparent|inherit/.test(gagnant)) continue;
  const rgb = parse(gagnant);
  if (!rgb) continue;
  if (lum(rgb) < 0.45) continue;
  fautifs.push({ cible, bg: gagnant.trim().slice(0, 42), l: (lum(rgb)*100).toFixed(0) });
}
fautifs.sort((a, b) => b.l - a.l);
console.log(`Classes au fond clair en mode sombre : ${fautifs.length}`);
for (const f of fautifs.slice(0, 40))
  console.log(`  L=${String(f.l).padStart(3)}%  ${f.cible.padEnd(30)} ${f.bg}`);
fs.writeFileSync("/tmp/fautifs.json", JSON.stringify(fautifs.map((f) => f.cible)));
