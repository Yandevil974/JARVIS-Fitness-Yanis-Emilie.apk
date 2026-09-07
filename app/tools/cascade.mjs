/* Résout la cascade CSS sur le bundle construit : pour un contexte donné
   (attributs de <html> + classes de l'élément), dit quelle déclaration
   l'emporte. Sert à vérifier le rendu sans navigateur. */
import fs from "node:fs";
import path from "node:path";
const dir = "release/assets";
// Le vrai bundle est le plus gros fichier, pas le dernier par ordre
// alphabétique : les petits chunks « web-*.js » faussaient la lecture.
const file = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => [f, fs.statSync(path.join(dir, f)).size])
  .sort((a, b) => b[1] - a[1])[0][0];
const css = fs.readFileSync(path.join(dir, file), "utf8");
// Largeur simulée : la capture fournie correspond à une tablette.
const VIEWPORT = Number(process.env.VW || 1000);

function specificity(sel) {
  let a = 0, b = 0, c = 0;
  let s = sel.replace(/::?[a-z-]+(\([^)]*\))?/g, (m) => {
    if (/^:not\(/.test(m)) { const inner = m.slice(5, -1); const sp = specificity(inner); a += sp[0]; b += sp[1]; c += sp[2]; return " "; }
    if (/^::/.test(m)) { c++; return " "; }
    b++; return " ";
  });
  a += (s.match(/#[\w-]+/g) || []).length;
  b += (s.match(/\.[\w-]+/g) || []).length;
  b += (s.match(/\[[^\]]+\]/g) || []).length;
  c += (s.replace(/[#.\[][^\s>+~]*/g, " ").match(/\b[a-z][a-z0-9]*\b/gi) || []).length;
  return [a, b, c];
}
function cmp(x, y) { for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; }

// Contexte : { html: {theme, rail}, classes: [...], tag: 'div' }
function matches(sel, ctx) {
  sel = sel.trim();
  if (/@|,/.test(sel)) return false;
  const parts = sel.split(/\s+/);
  const last = parts[parts.length - 1];
  const ancestors = parts.slice(0, -1).join(" ");
  // ancêtres : html[...] / html:not([...])
  for (const m of ancestors.matchAll(/\[data-(theme|rail)=(?:"|')?([\w-]+)/g)) {
    const neg = ancestors.includes(`:not([data-${m[1]}=${m[2]}`) || ancestors.includes(`:not([data-${m[1]}="${m[2]}"`);
    const val = ctx.html[m[1]];
    if (neg) { if (val === m[2]) return false; }
    else if (val !== m[2]) return false;
  }
  if (/:not\(\[data-theme/.test(ancestors) && ctx.html.theme === "dark") return false;
  if (/\bhtml\b/.test(ancestors) && false) return false;
  // dernier élément : tag + classes
  const cls = (last.match(/\.[\w-]+/g) || []).map((x) => x.slice(1));
  if (!cls.every((k) => ctx.classes.includes(k))) return false;
  const tag = last.replace(/[.\[:].*$/, "");
  if (tag && tag !== "*" && tag !== ctx.tag) return false;
  if (/\[data-(theme|rail)=/.test(last)) {
    for (const m of last.matchAll(/\[data-(theme|rail)=(?:"|')?([\w-]+)/g))
      if (ctx.html[m[1]] !== m[2]) return false;
  }
  return true;
}
export function resolve(prop, ctx) {
  const rules = [];
  let depth = 0, buf = "", inAt = null;
  // Les blocs @media print / @media (max-width) ne s'appliquent pas au
  // rendu courant : les ignorer, sinon ils faussent le verdict.
  const skip = [];
  const atRe = /@media([^{]*)\{/g;
  let am;
  while ((am = atRe.exec(css))) {
    const cond = am[1];
    // Évaluer la requête pour la largeur simulée (VIEWPORT).
    let ok = !/print/.test(cond);
    if (ok) {
      for (const c of cond.matchAll(/max-width:\s*(\d+)px/g))
        if (VIEWPORT > Number(c[1])) ok = false;
      for (const c of cond.matchAll(/min-width:\s*(\d+)px/g))
        if (VIEWPORT < Number(c[1])) ok = false;
    }
    if (ok) continue;
    // Trouver la fin du bloc @media par comptage d'accolades.
    let d = 1, i = atRe.lastIndex;
    while (i < css.length && d > 0) {
      if (css[i] === "{") d++;
      else if (css[i] === "}") d--;
      i++;
    }
    skip.push([am.index, i]);
  }
  const hidden = (pos) => skip.some(([a, b]) => pos >= a && pos < b);
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    if (hidden(m.index)) continue;
    const sels = m[1].split(",").map((x) => x.trim());
    const body = m[2];
    const dm = new RegExp(`(?:^|;)\\s*${prop}\\s*:([^;]+)`).exec(body);
    if (!dm) continue;
    for (const sel of sels) {
      if (!matches(sel, ctx)) continue;
      rules.push({ sel, val: dm[1].trim(), spec: specificity(sel), imp: /!important/.test(dm[1]), at: m.index });
    }
  }
  rules.sort((x, y) => (x.imp - y.imp) || cmp(x.spec, y.spec) || (x.at - y.at));
  return rules[rules.length - 1] || null;
}
const CTX = (theme, classes, tag = "div") => ({ html: { theme, rail: theme === "dark" ? undefined : "dark" }, classes, tag });
const cases = [
  ["CLAIR  case exo 1", "background", CTX(null, ["sequence-item"], "button")],
  ["CLAIR  echauffement", "background", CTX(null, ["sequence-warmup"], "button")],
  ["SOMBRE case exo", "background", CTX("dark", ["sequence-item"], "button")],
  ["SOMBRE body bg", "background", CTX("dark", [], "body")],
  ["CLAIR  rappel etir.", "display", CTX(null, ["cooldown-reminder"], "button")],
  ["SOMBRE .input bg", "background", CTX("dark", ["input"], "input")],
  ["SOMBRE .input color", "color", CTX("dark", ["input"], "input")],
  ["SOMBRE .toast", "background", CTX("dark", ["toast"])],
  ["SOMBRE .warning-box", "background", CTX("dark", ["warning-box"])],
  ["SOMBRE .sidebar-coach", "background", CTX("dark", ["sidebar-coach"])],
  ["CLAIR  .readiness-panel", "background", CTX(null, ["readiness-panel", "panel"])],
  ["CLAIR  .coach-card", "background", CTX(null, ["coach-card", "panel"])],
  ["CLAIR  jour metcon", "background", CTX(null, ["week-day", "discipline-metcon"])],
  ["SOMBRE body color", "color", CTX("dark", [], "body")],
  ["SOMBRE .panel color", "color", CTX("dark", ["panel"])],
  ["SOMBRE h2", "color", CTX("dark", [], "h2")],
  ["SOMBRE .eyebrow", "color", CTX("dark", ["eyebrow"], "span")],
  ["SOMBRE .metric-value", "color", CTX("dark", ["metric-value"])],
  ["CLAIR  body color", "color", CTX(null, [], "body")],
  ["CLAIR  .sidebar", "background", CTX(null, ["sidebar"], "aside")],
  ["SOMBRE .sidebar", "background", CTX("dark", ["sidebar"], "aside")],
  ["CLAIR  .metric.amber", "background", CTX(null, ["metric", "amber"])],
  ["CLAIR  .metric.violet", "background", CTX(null, ["metric", "violet"])],
  ["CLAIR  .panel", "background", CTX(null, ["panel"])],
  ["SOMBRE .panel", "background", CTX("dark", ["panel"])],
  ["SOMBRE .modal", "background", CTX("dark", ["modal"])],
  ["SOMBRE .week-day", "background", CTX("dark", ["week-day", "discipline-strength"])],
];
for (const [label, prop, ctx] of cases) {
  const r = resolve(prop, ctx);
  console.log(`${label.padEnd(22)} ${r ? r.val.slice(0, 58) : "(rien)"}`);
  if (r) console.log(`${" ".repeat(23)}via ${r.sel.slice(0, 60)}  spec=${r.spec}`);
}
