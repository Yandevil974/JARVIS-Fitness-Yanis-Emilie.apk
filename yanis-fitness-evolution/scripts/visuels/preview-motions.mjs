// Génère des planches PNG de TOUTES les animations « créées » (moteur
// human-motion) pour vérification visuelle de l'exactitude des mouvements.
// Chaque planche : pose A (pastille verte) | pose MID (pastille bleue) |
// pose B (pastille rouge). Usage : node scripts/visuels/preview-motions.mjs
// Sortie : scripts/visuels/out/*.png (+ contact-B.png : toutes les poses B).
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Canvas } from "./raster.mjs";
import { drawFigure } from "./figure.mjs";
import {
  POSES,
  STRETCH_TARGETS,
  STRETCH_BY_NAME,
  EXERCISE_MOTIONS,
  motionFor,
  motionNames,
} from "../../src/engine/human-motion.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "out");
mkdirSync(ROOT, { recursive: true });

const VW = 420, VH = 300; // viewBox HumanAnim
const S = 2; // sur-échantillonnage

// Backend de dessin : coords viewBox + décalage + échelle.
function backend(canvas, ox, oy, scale = S) {
  const X = (x) => ox + x * scale, Y = (y) => oy + y * scale;
  return {
    line: (x0, y0, x1, y1, w, c, a = 1) =>
      canvas.line(X(x0), Y(y0), X(x1), Y(y1), Math.max(1, w * scale), c, a),
    polyline: (pts, w, c, a = 1) =>
      canvas.polyline(pts.map(([x, y]) => [X(x), Y(y)]), Math.max(1, w * scale), c, a),
    disc: (cx, cy, r, c, a = 1) => canvas.disc(X(cx), Y(cy), r * scale, c, a),
    ring: (cx, cy, r, w, c, a = 1) =>
      canvas.ring(X(cx), Y(cy), r * scale, Math.max(1, w * scale), c, a),
    rect: (x, y, w, h, c, a = 1, rx = 0) =>
      canvas.rect(X(x), Y(y), w * scale, h * scale, c, a, rx * scale),
    quad: (x0, y0, cx, cy, x1, y1, w, c, a = 1) =>
      canvas.quad(X(x0), Y(y0), X(cx), Y(cy), X(x1), Y(y1), Math.max(1, w * scale), c, a),
  };
}

function vignette(canvas, ox, spec, t, dot) {
  drawFigure(backend(canvas, ox, 0), spec, t);
  canvas.disc(ox + 22, 22, 12, dot); // pastille A/MID/B
  canvas.line(ox, 0, ox, VH * S, 2, "#b9a487"); // séparateur
}

function planche(name, spec) {
  const canvas = new Canvas(VW * 3 * S, VH * S);
  vignette(canvas, 0, spec, 0, "#2e9e5b"); // A vert
  vignette(canvas, VW * S, spec, 0.5, "#2b6cb0"); // MID bleu
  vignette(canvas, VW * 2 * S, spec, 1, "#c0392b"); // B rouge
  const { writeFileSync } = awaitImportFs();
  writeFileSync(join(ROOT, name), canvas.toPNG());
  console.log(" ", name);
}
import { writeFileSync as _w } from "node:fs";
function awaitImportFs() {
  return { writeFileSync: _w };
}

console.log("poses :");
const poseSpecs = {};
for (const n of motionNames) {
  poseSpecs[n] = { ...POSES[n] };
  planche(`pose-${n}.png`, poseSpecs[n]);
}

console.log("étirements (via motionFor, comme le runtime) :");
const stretchSpecs = {};
for (const m of Object.keys(STRETCH_TARGETS)) {
  const spec = motionFor({ id: `stretch-${m}-0`, pattern: "stretch", muscle: m });
  stretchSpecs[m] = spec;
  planche(`stretch-${m}.png`, spec);
}

console.log("étirements nommés (nom -> pose, comme le runtime) :");
const namedSpecs = {};
let _ni = 0;
for (const nm of Object.keys(STRETCH_BY_NAME)) {
  const spec = motionFor({ id: `stretch-n-${_ni}`, name: nm, pattern: "stretch", muscle: "abs" });
  if (spec.source !== "creée-étirement-nommé") console.log("  !! non nommé :", nm, "->", spec.source);
  namedSpecs[nm] = spec;
  planche(`stretch-n-${String(_ni).padStart(2, "0")}.png`, spec);
  _ni++;
}

console.log("exercices (via motionFor) :");
for (const id of Object.keys(EXERCISE_MOTIONS)) {
  const spec = motionFor({ id, pattern: "static", muscle: "abs" });
  planche(`exo-${id}.png`, spec);
}

// Planche contact : toutes les poses B (position « fin » / tenue).
function contact(name, entries) {
  const cols = 6, cw = VW, ch = VH;
  const rows = Math.ceil(entries.length / cols);
  const canvas = new Canvas(cols * cw, rows * ch, "#e9e2d4");
  entries.forEach(([label, spec], i) => {
    const ox = (i % cols) * cw, oy = Math.floor(i / cols) * ch;
    // fond vignette
    canvas.rect(ox + 2, oy + 2, cw - 4, ch - 4, "#f4f1ea", 1, 8);
    drawFigure(backend(canvas, ox, oy, 1), spec, 1);
    canvas.rect(ox + 2, oy + 2, cw - 4, ch - 4, "#b9a487", 0.0, 8);
  });
  _w(join(ROOT, name), canvas.toPNG());
  console.log(" ", name, `(${entries.length} vignettes, ordre: ${entries.map(([l]) => l).join(", ")})`);
}
contact("contact-poses-B.png", Object.entries(poseSpecs));
contact("contact-stretch-B.png", Object.entries(stretchSpecs));
contact("contact-stretch-named-B.png", Object.entries(namedSpecs));
console.log("OK ->", ROOT);
