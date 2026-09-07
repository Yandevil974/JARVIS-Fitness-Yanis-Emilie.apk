/* Recense les fonds CLAIRS écrits en dur qui ne sont pas neutralisés en
   mode sombre. Symptôme : une case reste pâle sur le fond noir, et son
   texte — passé en blanc par la surcharge — devient illisible. */
import fs from "node:fs";
import path from "node:path";
const dir = "release/assets";
const file = fs.readdirSync(dir).filter((f) => f.endsWith(".css"))
  .map((f) => [f, fs.statSync(path.join(dir, f)).size])
  .sort((a, b) => b[1] - a[1])[0][0];
const css = fs.readFileSync(path.join(dir, file), "utf8");

function hsl2rgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}
function parse(v) {
  v = v.trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(v);
  if (m) { let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join(""); return [0,2,4].map((i)=>parseInt(h.slice(i,i+2),16)); }
  m = /^hsl\(\s*([\d.]+)\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/i.exec(v);
  if (m) return hsl2rgb(+m[1], +m[2], +m[3]);
  m = /^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/i.exec(v);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}
const lin = (c) => { c /= 255; return c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const lum = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);

// Sélecteurs déjà repeints en sombre.
const couverts = new Set();
{
  const r = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = r.exec(css))) {
    if (!/background[^;]*:\s*var\(--(panel|bg|sidebar|panel-2|panel-3)/.test(m[2])) continue;
    for (const s of m[1].split(",")) {
      const t = s.trim();
      if (t.startsWith("[data-theme=dark]")) couverts.add(t.replace("[data-theme=dark]","").trim());
    }
  }
}
const fautifs = [];
const re = /([^{}]+)\{([^{}]*)\}/g; let m;
while ((m = re.exec(css))) {
  const sels = m[1].split(",").map((x) => x.trim());
  if (sels.some((s) => /\[data-theme=dark\]/.test(s))) continue;
  const bm = /(?:^|;)\s*background(?:-color)?\s*:\s*([^;!]+)/.exec(m[2]);
  if (!bm) continue;
  const first = /#[0-9a-f]{3,8}|hsl\([^)]*\)|rgba?\([^)]*\)/i.exec(bm[1]);
  if (!first) continue;
  const rgb = parse(first[0]);
  if (!rgb) continue;
  if (lum(rgb) < 0.5) continue;                    // déjà sombre
  if (sels.every((s) => couverts.has(s.replace(/^html:not\(\[data-theme=dark\]\)\s*/,"")))) continue;
  if (sels.every((s) => /:not\(\[data-theme=dark\]\)/.test(s))) continue;
  fautifs.push({ sel: sels[0], val: first[0], l: (lum(rgb)*100).toFixed(0) });
}
console.log(`Fonds clairs non neutralisés en mode sombre : ${fautifs.length}`);
for (const f of fautifs.slice(0, 30)) console.log(`  L=${f.l.padStart(3)}%  ${f.val.padEnd(22)} ${f.sel.slice(0,52)}`);
