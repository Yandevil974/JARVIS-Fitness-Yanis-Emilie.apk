/* Recense les couleurs écrites en dur qui ne suivent pas le thème, puis
   calcule leur contraste sur le fond sombre réel. Sert à trouver les
   zones illisibles sans avoir à les repérer à l'œil sur l'appareil. */
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
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  m = /^hsl\(\s*([\d.]+)\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/i.exec(v);
  if (m) return hsl2rgb(+m[1], +m[2], +m[3]);
  m = /^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/i.exec(v);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// Fond sombre réel : --bg = hsl(220 6% 7%), --panel = 12 %, --panel-2 = 16 %.
const MODE = process.env.MODE || "dark";
// Fonds réels de chaque thème, pastels de repérage compris : un texte
// doit rester lisible quelle que soit la case sur laquelle il tombe.
const FONDS =
  MODE === "dark"
    ? { panel: hsl2rgb(220, 6, 12) }
    : {
        page: [250, 247, 242],
        ambre: [255, 240, 206],
        lavande: [236, 229, 246],
        corail: [252, 226, 212],
        menthe: [223, 242, 236],
      };

// Sélecteurs couverts par une règle [data-theme=dark] ... !important.
const surcharges = new Set();
{
  const r2 = /([^{}]+)\{([^{}]*)\}/g;
  let x;
  while ((x = r2.exec(css))) {
    if (!/color\s*:\s*var\(--(text|muted|dim)\)\s*!important/.test(x[2])) continue;
    for (const s of x[1].split(",")) {
      const t = s.trim();
      if (t.startsWith("[data-theme=dark]"))
        surcharges.add(t.replace("[data-theme=dark]", "").trim());
    }
  }
}
const problemes = [];
const re = /([^{}]+)\{([^{}]*)\}/g;
let m;
while ((m = re.exec(css))) {
  const sels = m[1].split(",").map((x) => x.trim());
  const body = m[2];
  // On ignore ce qui est explicitement prévu pour le mode sombre.
  if (MODE === "dark") {
    if (sels.every((s) => /\[data-theme=dark\]/.test(s))) continue;
    if (sels.every((s) => /:not\(\[data-theme=dark\]\)/.test(s))) continue;
  } else if (sels.some((s) => /\[data-theme=dark\]/.test(s))) continue;
  const cm = /(?:^|;)\s*color\s*:\s*([^;!]+)/.exec(body);
  if (!cm) continue;
  // Un élément qui pose lui-même un fond opaque ne se lit pas sur celui
  // de la page : le comparer aux fonds du thème donnait de faux
  // signalements (pastilles, badges, aplats d'accent).
  if (/(?:^|;)\s*background(?:-color)?\s*:\s*(?!none|transparent)/.test(body))
    continue;
  // Une déclaration battue par une surcharge sombre !important n'est
  // pas un défaut : on vérifie qu'aucune ne la couvre.
  if (sels.some((s) => surcharges.has(s))) continue;
  const val = cm[1].trim();
  if (/var\(|inherit|currentcolor|transparent/i.test(val)) continue;
  const rgb = parse(val);
  if (!rgb) continue;
  let pire = 99, ou = "";
  for (const [nom, f] of Object.entries(FONDS)) {
    const x = ratio(rgb, f);
    if (x < pire) { pire = x; ou = nom; }
  }
  if (pire < 4.5) problemes.push({ sel: sels[0], val, r: pire.toFixed(2), ou });
}
problemes.sort((a, b) => a.r - b.r);
console.log(`[${MODE}] textes en dur sous 4,5:1 : ${problemes.length}`);
for (const p of problemes.slice(0, 22))
  console.log(`  ${p.r.padStart(5)}:1 ${(p.ou||"").padEnd(8)} ${p.val.padEnd(22)} ${p.sel.slice(0, 44)}`);
