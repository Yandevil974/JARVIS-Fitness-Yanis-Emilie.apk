/* ============================================================
   AUDIT DES PAIRES FOND / TEXTE
   ------------------------------------------------------------
   tools/contrast.mjs vérifie les couleurs de texte contre les fonds
   du thème. Il lui échappe le cas où une même règle CSS fixe à la
   fois `background` et `color` : c'est ce couple-là qui produit les
   textes illisibles (blanc sur pâle, sombre sur sombre).

   Ce script lit styles.css, isole ces règles, résout les variables
   du thème pour chaque profil, et signale tout couple sous le seuil.

     node tools/contrast-pairs.mjs
   ============================================================ */
import fs from "node:fs";

/* Les commentaires sont retirés avant toute analyse : leur texte
   contient des virgules et des accolades (« 2,1:1 », « {…} ») qui
   faisaient éclater les sélecteurs et rendaient des règles
   invisibles à l'audit. */
const CSS = fs
  .readFileSync(new URL("../src/styles.css", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");
const SEUIL = 3.0;

/* --- Valeurs des variables, par profil ------------------------------ */
function varsOf(selector) {
  const bloc = CSS.slice(CSS.indexOf(selector));
  const corps = bloc.slice(bloc.indexOf("{") + 1, bloc.indexOf("}"));
  const out = {};
  for (const m of corps.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    out[m[1]] = m[2].trim();
  return out;
}
const COMMUN = { ...varsOf(":root") };
// Le bloc :root est scindé en plusieurs morceaux dans la feuille.
for (const m of CSS.matchAll(/^:root\s*\{([^}]*)\}/gms))
  for (const v of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    COMMUN[v[1]] = v[2].trim();

const PROFILS = {
  yanis: COMMUN,
  emilie: { ...COMMUN },
};
for (const m of CSS.matchAll(/\[data-profile="emilie"\]\s*\{([^}]*)\}/gms))
  for (const v of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    PROFILS.emilie[v[1]] = v[2].trim();

/* Thème sombre : mêmes profils, variables de surface remplacées.
   Il doit être audité comme le clair — c'est précisément en basculant
   un thème qu'on laisse derrière soi des textes de l'autre. */
const SOMBRE = {};
for (const m of CSS.matchAll(/\[data-theme="dark"\](?!\[)\s*\{([^}]*)\}/gms))
  for (const v of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    SOMBRE[v[1]] = v[2].trim();
const SOMBRE_EMILIE = {};
for (const m of CSS.matchAll(/\[data-theme="dark"\]\[data-profile="emilie"\]\s*\{([^}]*)\}/gms))
  for (const v of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    SOMBRE_EMILIE[v[1]] = v[2].trim();
PROFILS["yanis sombre"] = { ...COMMUN, ...SOMBRE };
PROFILS["emilie sombre"] = { ...PROFILS.emilie, ...SOMBRE, ...SOMBRE_EMILIE };

/* Barre latérale sombre sur contenu clair : ses couleurs viennent de
   variables locales (--rail-*), à auditer séparément puisqu'elles ne
   dérivent pas de --text. */
const RAIL = {};
for (const m of CSS.matchAll(/\[data-rail="dark"\] \.sidebar\s*\{([^}]*)\}/gms))
  for (const v of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    RAIL[v[1]] = v[2].trim();
for (const base of ["yanis", "emilie"]) {
  const vars = { ...PROFILS[base], ...RAIL };
  // Dans la barre, le fond de référence est --rail-bg, pas --panel.
  vars["--panel"] = RAIL["--rail-bg"];
  PROFILS[base + " colonne sombre"] = vars;
}

/* --- Résolution d'une couleur en RGB --------------------------------- */
function resolve(val, vars, prof = 0) {
  if (!val || prof > 8) return null;
  val = val.trim().replace(/\s*!important\s*/, "");
  const v = val.match(/^var\((--[\w-]+)(?:\s*,\s*(.+))?\)$/);
  if (v) return resolve(vars[v[1]] ?? v[2], vars, prof + 1);
  // Un dégradé : on prend sa première couleur, la plus représentative.
  const g = val.match(/gradient\([^,]*,\s*(.+)\)$/s);
  if (g) {
    const first = g[1].match(/(#[0-9a-f]{3,8}|hsl\([^)]*\)|rgba?\([^)]*\)|\b[a-z]+\b)/i);
    return first ? resolve(first[1], vars, prof + 1) : null;
  }
  if (val === "white") return [255, 255, 255];
  if (val === "black") return [0, 0, 0];
  if (val === "transparent" || val === "inherit" || val === "currentColor") return null;
  const hex = val.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    if (h.length === 8) h = h.slice(0, 6);
    if (h.length !== 6) return null;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const hsl = val.match(/^hsl\(\s*([^)]+)\)$/i);
  if (hsl) {
    const alphaTxt = hsl[1].split("/")[1];
    const parts = hsl[1].split("/")[0].trim().split(/[\s,]+/);
    if (parts.length < 3) return null;
    const num = (x) => {
      if (/^calc\(/.test(x)) {
        // calc() sur une variable de thème : non résoluble sans moteur CSS.
        const inner = x.match(/calc\(\s*var\((--[\w-]+)\)\s*\*\s*([\d.]+)\s*\)/);
        if (inner) {
          const base = parseFloat(String(vars[inner[1]] ?? "").replace("%", ""));
          if (!Number.isNaN(base)) return base * parseFloat(inner[2]);
        }
        const add = x.match(/calc\(\s*var\((--[\w-]+)\)\s*[-+]\s*([\d.]+)/);
        if (add) {
          const base = parseFloat(String(vars[add[1]] ?? "").replace(/[%a-z]/g, ""));
          if (!Number.isNaN(base)) return base;
        }
        return NaN;
      }
      if (/var\(/.test(x)) {
        const r = x.match(/var\((--[\w-]+)\)/);
        return parseFloat(String(vars[r[1]] ?? "").replace(/[%a-z]/g, ""));
      }
      return parseFloat(x);
    };
    const h = num(parts[0]), s = num(parts[1]) / 100, l = num(parts[2]) / 100;
    if ([h, s, l].some(Number.isNaN)) return null;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const t = h / 60;
    const [r, g2, b] =
      t < 1 ? [c, x, 0] : t < 2 ? [x, c, 0] : t < 3 ? [0, c, x] :
      t < 4 ? [0, x, c] : t < 5 ? [x, 0, c] : [c, 0, x];
    const rgbv = [r, g2, b].map((k) => Math.round((k + m) * 255));
    if (alphaTxt) {
      const a = parseFloat(alphaTxt) / (alphaTxt.includes("%") ? 100 : 1);
      if (!Number.isNaN(a)) rgbv.alpha = a;
    }
    return rgbv;
  }
  const rgb = val.match(/^rgba?\(\s*([^)]+)\)/i);
  if (rgb) {
    const p = rgb[1].split(/[\s,/]+/).map(parseFloat);
    if (p.length >= 3 && p.slice(0, 3).every((n) => !Number.isNaN(n)))
      return p.slice(0, 3);
  }
  return null;
}

const lum = ([r, g, b]) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/* --- Parcours des règles --------------------------------------------- */
/* Surcharges du thème sombre : `[data-theme="dark"] .x { color: … }`
   remplace la couleur de `.x`. Sans en tenir compte, l'audit signale
   des défauts déjà corrigés. On indexe donc ces surcharges par
   sélecteur de base avant de juger. */
const SURCHARGES = { fond: new Map(), texte: new Map() };
for (const m of CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const bruts = m[1].trim().split(",");
  const corps = m[2];
  const bg = corps.match(/(?:^|[\s;])background(?:-color)?\s*:\s*([^;]+)/);
  const fg = corps.match(/(?:^|[\s;])color\s*:\s*([^;]+)/);
  for (const brut of bruts) {
    const t = brut.trim();
    if (!t.startsWith('[data-theme="dark"]')) continue;
    const base = t.replace(/^\[data-theme="dark"\]\s*/, "").trim();
    if (!base) continue;
    if (bg) SURCHARGES.fond.set(base, bg[1]);
    if (fg) SURCHARGES.texte.set(base, fg[1]);
  }
}

let echecs = 0;
for (const [nom, vars] of Object.entries(PROFILS)) {
  const sombre = nom.includes("sombre");
  const mauvais = [];
  for (const m of CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim().split("\n").pop().trim();
    const corps = m[2];
    if (sel.startsWith("@") || sel.startsWith(":root") || !corps.includes("color")) continue;
    // Une règle propre au thème sombre ne concerne pas le mode clair.
    if (!sombre && sel.includes('[data-theme="dark"]')) continue;
    const bg = corps.match(/(?:^|[\s;])background(?:-color)?\s*:\s*([^;]+)/);
    const fg = corps.match(/(?:^|[\s;])color\s*:\s*([^;]+)/);
    const cle = sel.replace(/^\[data-theme="dark"\]\s*/, "").trim();
    // En sombre, fond et texte peuvent provenir de deux règles
    // distinctes : la règle de base pour l'un, la surcharge pour
    // l'autre. Les chercher séparément, sinon on juge une paire qui
    // n'existe pas réellement à l'écran.
    const bgTxt = sombre && SURCHARGES.fond.has(cle) ? SURCHARGES.fond.get(cle) : bg?.[1];
    const fgTxt = sombre && SURCHARGES.texte.has(cle) ? SURCHARGES.texte.get(cle) : fg?.[1];
    if (!bgTxt || !fgTxt) continue;
    let B = resolve(bgTxt, vars);
    const F = resolve(fgTxt, vars);
    if (!B || !F) continue;
    // Un fond translucide laisse voir le panneau : composer pour juger
    // la couleur réellement perçue, sinon on signale de faux problèmes.
    if (B.alpha !== undefined && B.alpha < 1) {
      const sous = resolve(vars["--panel"], vars) || [255, 255, 255];
      B = B.map((c, i) => Math.round(c * B.alpha + sous[i] * (1 - B.alpha)));
    }
    const r = ratio(B, F);
    if (r < SEUIL)
      mauvais.push({ sel, r: r.toFixed(2), bg: bgTxt.trim().slice(0, 44), fg: fgTxt.trim().slice(0, 24) });
  }
  console.log(`\n=== ${nom} : ${mauvais.length} couple(s) fond/texte sous ${SEUIL}:1 ===`);
  for (const x of mauvais)
    console.log(`  ${x.r}:1  ${x.sel}\n        fond ${x.bg}\n        texte ${x.fg}`);
  echecs += mauvais.length;
}
process.exit(echecs ? 1 : 0);
