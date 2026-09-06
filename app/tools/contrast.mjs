/* Vérifie qu'aucune règle ne pose un texte trop clair sur fond clair.
   Résout les hsl() littéraux et les tokens dérivés des variables de
   thème, pour les deux profils. */
import fs from "node:fs";

const THEMES = {
  yanis: { hs: 34, ss: 62, ha: 32, sa: 82 },
  emilie: { hs: 328, ss: 58, ha: 332, sa: 74 },
};

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const t = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60) % 6];
  return t.map((v) => (v + m) * 255);
}
const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// Résout un hsl() éventuellement exprimé en tokens de thème.
function resolve(str, t) {
  const tok = str.match(
    /hsl\(calc\(var\(--h-(surface|accent)\)\s*([-+])\s*([\d.]+)deg\),\s*calc\(var\(--s-\1\)\s*\*\s*([\d.]+)\),\s*([\d.]+)%/,
  );
  if (tok) {
    const isS = tok[1] === "surface";
    const h = (isS ? t.hs : t.ha) + (tok[2] === "-" ? -1 : 1) * +tok[3];
    return hslToRgb(h, (isS ? t.ss : t.sa) * +tok[4], +tok[5]);
  }
  const plain = str.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (plain) return hslToRgb(+plain[1], +plain[2], +plain[3]);
  const spaced = str.match(
    /hsl\(var\(--h-(surface|accent)\)\s+calc\(var\(--s-\1\)\s*\*\s*([\d.]+)\)\s+([\d.]+)%/,
  );
  if (spaced) {
    const isS = spaced[1] === "surface";
    return hslToRgb(
      isS ? t.hs : t.ha,
      (isS ? t.ss : t.sa) * +spaced[2],
      +spaced[3],
    );
  }
  return null;
}

const css = fs.readFileSync("src/styles.css", "utf8");
// Les fonds réels de l'application, du plus clair au plus contrasté.
for (const [name, t] of Object.entries(THEMES)) {
  const bgs = {
    panel: hslToRgb(t.hs, t.ss * 0.30, 99.6),
    bg: hslToRgb(t.hs, t.ss * 0.62, 95.4),
    panel3: hslToRgb(t.hs, t.ss * 0.62, 94.4),
  };
  const bad = [];
  const re = /(^|\n)\s*(color|background|background-color)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css))) {
    if (m[2] !== "color") continue;
    const rgb = resolve(m[3], t);
    if (!rgb) continue;
    const worst = Math.min(...Object.values(bgs).map((b) => ratio(rgb, b)));
    if (worst < 3.2) {
      const line = css.slice(0, m.index).split("\n").length;
      bad.push({ line, decl: m[3].trim().slice(0, 78), ratio: worst.toFixed(2) });
    }
  }
  console.log(`\n=== ${name} : ${bad.length} couleurs de texte sous 3.2:1 ===`);
  for (const b of bad.slice(0, 40))
    console.log(`  L${b.line}  ${b.ratio}:1  ${b.decl}`);
}
