// Extrait la 1re frame des GIFs à vérifier et les assemble en planches
// contact (5 colonnes, ordre imprimé ci-dessous et dans gif-ordre.txt).
// Usage : node scripts/visuels/extract-gif.mjs [motif-optionnel]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GifReader } from "omggif";
import { Canvas } from "./raster.mjs";
import { EXERCISES } from "../../src/data/library.js";
import { demonstrationFor } from "../../src/engine/demo-match.js";
import { norm } from "../../src/engine/utils.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "out", "gif");
mkdirSync(OUT, { recursive: true });
const PUB = join(HERE, "..", "..", "public");
const motif = (process.argv[2] || "").toLowerCase();

// 1. Exercices dont le GIF exact est perdu (clé guide instable) + leurs GIFs.
import legacy from "../../src/data/legacy.json" with { type: "json" };
const guides = { ...legacy.elite.MUSCU_GUIDES, ...legacy.emilie.MUSCU_GUIDES };
const byNormKey = new Map();
for (const [k, v] of Object.entries(guides)) byNormKey.set(norm(k), { k, v });

// 2. Familles + cas sensibles.
const targets = new Map(); // path -> label
function add(path, label) {
  if (!path || !path.endsWith(".gif")) return;
  if (!targets.has(path)) targets.set(path, []);
  targets.get(path).push(label);
}
for (const e of EXERCISES) {
  const hit = byNormKey.get(norm(e.name));
  const direct = guides[norm(e.name)];
  if (hit && !direct && hit.v?.img) add(hit.v.img, `PERDU(${e.name})`);
  else if (hit && direct !== hit.v && hit.v?.img && e.gif !== hit.v.img)
    add(hit.v.img, `PERDU?(${e.name})`);
  const d = demonstrationFor(e);
  if (d && d.level !== "exact") add(d.path, `${d.level}<=${e.name}`);
}
// Cas sensibles affichés / futurs.
for (const n of ["Back extension horizontal", "Gainage planche", "Reverse crunch",
  "Mountain climbers", "Crunch à la poulie (ou au sol)", "Glute bridge pieds sur banc",
  "Leg curl allongé", "Tirage vertical prise large", "Élévations latérales assises (variante)"]) {
  const e = EXERCISES.find((x) => x.name === n);
  if (e?.gif) add(e.gif, `ref:${n}`);
  const dd = e ? demonstrationFor(e) : null;
  if (dd) add(dd.path, `demo:${n}`);
}

let entries = [...targets.entries()];
if (motif) entries = entries.filter(([p, l]) => (p + l.join(" ")).toLowerCase().includes(motif));
console.log(entries.length, "GIF à extraire");

const frames = [];
for (const [p, labels] of entries) {
  const f = join(PUB, p.replace(/^\//, ""));
  if (!existsSync(f)) {
    console.log("MANQUANT DISQUE:", p, labels.join(" | "));
    continue;
  }
  try {
    const r = new GifReader(readFileSync(f));
    const rgba = Buffer.alloc(r.width * r.height * 4);
    r.decodeAndBlitFrameRGBA(0, rgba);
    frames.push({ p, labels, w: r.width, h: r.height, rgba });
  } catch (err) {
    console.log("ILLISIBLE:", p, err.message);
  }
}
// Planches 5 colonnes, hauteur normalisée 200 (scale entier).
const COLS = 5, TH = 200;
const order = [];
let plate = 0, i = 0;
while (i < frames.length) {
  const batch = frames.slice(i, i + 15);
  const cells = batch.map((fr) => {
    const s = Math.max(1, Math.round(TH / fr.h));
    return { fr, s, w: fr.w * s, h: fr.h * s };
  });
  const W = COLS * 260, rows = Math.ceil(batch.length / COLS);
  const H = rows * (TH + 8);
  const cv = new Canvas(W, H, "#3a3d42");
  batch.forEach((fr, k) => {
    const c = cells[k];
    const ox = (k % COLS) * 260 + Math.max(0, (260 - c.w) >> 1);
    const oy = Math.floor(k / COLS) * (TH + 8) + Math.max(0, (TH - c.h) >> 1);
    cv.blit(fr.rgba, fr.w, fr.h, ox, oy, c.s);
    order.push(`planche${plate}[${k}] ${fr.p} :: ${fr.labels.join(" | ")}`);
  });
  const name = `gif-contact-${plate}.png`;
  writeFileSync(join(OUT, name), cv.toPNG());
  console.log(" ", name, `(${batch.length} frames)`);
  plate++;
  i += 15;
}
writeFileSync(join(OUT, "gif-ordre.txt"), order.join("\n") + "\n");
console.log("OK ->", OUT);
