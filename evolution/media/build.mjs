// Media stage: correct exercise demonstrations on the EXACT released 1.4.0 bundle.
// No rebuild from the older source archive, no APK signing here, no new identity.
// Every replacement must match exactly once; all other bytes stay untouched.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parse } from "../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs";
import { sha256 } from "../../complete-hotfix/patch-web.mjs";
import { replaceOnce } from "../reminders/build.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
export const baseline = JSON.parse(fs.readFileSync(path.join(here, "baseline.json")));
export const mapping = JSON.parse(fs.readFileSync(path.join(here, "mapping.json")));
const inventory = JSON.parse(fs.readFileSync(path.join(here, "review/inventory-1.4.0.json")));

// Same normaliser as the bundle's Ge().
export const ge = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const LEGACY_SHOWS = JSON.parse(
  fs.readFileSync(path.join(root, "JARVIS-Fitness-Source/src/data/legacy.json")),
);
function showsFor(media) {
  // Human label of what the illustration shows, from the original guide keys.
  if (!media) return null;
  for (const source of ["elite", "emilie"])
    for (const [key, guide] of Object.entries(LEGACY_SHOWS[source].MUSCU_GUIDES))
      if (guide && guide.img === media) return key.charAt(0).toUpperCase() + key.slice(1);
  return null;
}
const EXTRA_SHOWS = {
  "/media/dips-triceps-corrige.gif": "Triceps dips",
  "/media/warmup-mobilite.jpg": "Cercles d'épaules",
  "/media/stretch-respiration.jpg": "Respiration allongée",
  "/media/warmup-cardio.jpg": "Vélo / marche facile",
};

// Compact runtime map injected in the bundle (only what the app needs).
export function runtimeMap() {
  const dips = mapping.dips;
  const dipsMedia = dips.variant === "redraw" ? dips.redraw : dips.original;
  const entry = (e, name) => {
    let media = e.media;
    if (media === dips.redraw || media === dips.original) media = dipsMedia;
    return {
      media: media || null,
      level: e.level,
      note: e.note || null,
      shows: media ? EXTRA_SHOWS[media] || showsFor(media) || name || null : null,
    };
  };
  const exercises = {};
  for (const [id, e] of Object.entries(mapping.exercises)) exercises[id] = entry(e, e.name);
  const land = {};
  for (const [name, e] of Object.entries(mapping.movements.land)) land[ge(name)] = entry(e, name);
  const stretchOverrides = {};
  for (const [id, e] of Object.entries(mapping.stretches)) stretchOverrides[id] = entry(e, null);
  const stretches = {};
  for (const s of inventory.stretches) {
    const o = mapping.stretches[s.id];
    stretches[ge(s.name)] = o ? entry(o, s.name) : { media: s.img, level: "exact", note: null, shows: s.name };
  }
  const warmup = {};
  for (const [name, e] of Object.entries(mapping.warmup))
    if (e.level !== "exercise") warmup[ge(name)] = entry(e, name);
  const poolGuides = {};
  for (const [title, e] of Object.entries(mapping.poolGuides)) poolGuides[title] = entry(e, title);
  return { exercises, land, stretches, stretchOverrides, warmup, poolGuides };
}

const CSS = `.movement-missing{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;height:100%;padding:14px 18px;text-align:center;color:var(--muted)}.movement-missing>svg{opacity:.7}.movement-missing>p{font-size:11px;font-weight:600;margin:0;color:var(--text)}.movement-missing>small{font-size:9px;line-height:1.6}.human-movement.small .movement-missing>small{display:none}.pool-guide-note,.timer-guide-note{font-size:10px;color:var(--muted);line-height:1.7;margin:4px 0 8px}`;

export function helper() {
  return `
const JarvisMediaMap=${JSON.stringify(runtimeMap())};
const JarvisMedia={
key(n){return Ge(String(n??"").split(" · ")[0].split(" — ")[0])},
isAqua(c){return c==="aqua"||c==="swim"},
exercise(i){return i&&i.id&&JarvisMediaMap.exercises[i.id]||null},
fromEntry(m,n){if(!m)return null;if(m.level==="rest")return{rest:!0};if(!m.media)return{missing:!0,note:m.note||null,name:String(n||"")};return{path:m.media,name:m.shows||String(n||"").split(" · ")[0],exact:m.level==="exact",level:m.level,note:m.note||null}},
pool(n){const k=Ge(n),g=bl.find(c=>c.img&&c.k.some(u=>k.includes(Ge(u))));return g?{path:g.img,name:g.t,exact:g.mediaLevel!=="variante",level:g.mediaLevel||"exact",note:g.mediaNote||null}:null},
movement(n,c){if(!n)return null;const k=JarvisMedia.key(n),r=JarvisMediaMap.land[k];if(JarvisMedia.isAqua(c))return JarvisMedia.pool(n)||(r&&r.level==="rest"?{rest:!0}:{missing:!0,note:null,name:String(n)});return JarvisMedia.fromEntry(r||JarvisMediaMap.stretches[k]||JarvisMediaMap.warmup[k]||null,n)},
stretch(id,fallback){const o=JarvisMediaMap.stretchOverrides[id];return o?o.media:fallback},
stepImage(f,c){const r=JarvisMedia.movement(f.name,c);if(r&&r.path)return r.path;if(r&&(r.missing||r.rest))return null;return f.img||null}
};
if(typeof document<"u"){const jm=document.createElement("style");jm.textContent=${JSON.stringify(CSS)};document.head.appendChild(jm)}
`;
}

export function integrate(source) {
  if (sha256(source) !== baseline.bundleSha256)
    throw Error("Requires the exact released 1.4.0 bundle; refuses unknown/already patched input");

  // 0. Runtime map + helper, defined right after Ge() so module-level data can use them.
  source = replaceOnce(source, "function to(i=new Date){", helper() + "function to(i=new Date){");

  // 1. Root cause: guide keys contain hyphens/apostrophes/dashes that Ge() turns into spaces,
  //    so 20 exercises never found their own image. Normalise the keys; drop the wrong
  //    French-press override (standing cable extension shown for a lying EZ-bar extension).
  source = replaceOnce(
    source,
    'const dl={...lt.elite.MUSCU_GUIDES,...lt.emilie.MUSCU_GUIDES},gg={"french press barre ez":"/media/4c2b19fa924f90a8.gif"};for(const[i,o]of Object.entries(gg))dl[i]&&(dl[i]={...dl[i],img:o});',
    "const dl=Object.fromEntries(Object.entries({...lt.elite.MUSCU_GUIDES,...lt.emilie.MUSCU_GUIDES}).map(([i,o])=>[Ge(i),o&&o.ref?{...o,ref:Ge(o.ref)}:o]));",
  );

  // 2. Stretch images: reviewed overrides (pigeon assis -> posture assise; unmatched -> none).
  source = replaceOnce(
    source,
    "img:xg[n[1]]||null}",
    "img:JarvisMedia.stretch(`stretch-${i}-${l}`,xg[n[1]]||null)}",
  );

  // 3. Pool guides: aquatic illustrations (elite source) replace land GIFs.
  source = replaceOnce(
    source,
    "bl=lt.emilie.POOL_GUIDES.map(i=>({...i,img:i.img||yg[i.t]||null,h:i.h.map(Zu)}))",
    'bl=lt.emilie.POOL_GUIDES.map(i=>{const o=JarvisMediaMap.poolGuides[i.t];return{...i,img:o?o.media:i.img||yg[i.t]||null,mediaLevel:o?o.level:"exact",mediaNote:o?o.note:null,h:i.h.map(Zu)}})',
  );

  // 4. Warm-up steps: lower-body sessions get their own visuals; approach sets show the
  //    first exercise's validated demonstration instead of a bench press for everything.
  source = replaceOnce(
    source,
    'pattern:p?"lunge":"lat",img:Jn.mobilite,',
    'pattern:p?"lunge":"lat",img:p?null:Jn.mobilite,',
  );
  source = replaceOnce(
    source,
    'pattern:p?"bridge":"row",img:Jn.mobilite,',
    'pattern:p?"bridge":"row",img:p?"/media/8eecb0152081ff26.gif":null,',
  );
  source = replaceOnce(
    source,
    'pattern:(l==null?void 0:l.pattern)||"squat",img:Jn.approche,',
    'pattern:(l==null?void 0:l.pattern)||"squat",img:(l&&Kh(l)||{}).path||null,',
  );

  // 5. Replace the alias table + similarity scoring by the reviewed per-exercise table.
  const start = source.indexOf("const Z4={");
  const end = source.indexOf("function Kh(i){");
  if (start < 0 || end < 0 || end < start) throw Error("Alias/scoring block not found");
  const block = source.slice(start, end);
  if (!block.includes("const eo=new Map;for(const i of ft)") || !block.includes('level:"famille"'))
    throw Error("Unexpected alias/scoring block");
  source =
    source.slice(0, start) +
    'const eo=new Map;for(const i of ft){const o=JarvisMedia.exercise(i);if(o){o.media&&eo.set(i.id,{path:o.media,name:o.shows||i.name,level:o.level,note:o.note});continue}i.gif&&eo.set(i.id,{path:i.gif,name:i.name,level:"exact",note:null})}' +
    source.slice(end);

  // 6. Context-aware resolver: exercises, stretches, then timer movements by context.
  source = replaceOnce(
    source,
    'function s5(i,o){const n=i?Kh(i):null;if(n)return{path:n.path,name:n.name,exact:n.level==="exact",level:n.level};if(o){const l=bl.find(c=>c.img&&c.k.some(u=>Ge(o).includes(Ge(u))));if(l)return{path:l.img,name:l.t,exact:!1,level:"variante"}}return null}const Wf={exact:"Illustration humaine · source",variante:"Variante très proche · suivez les consignes ci-dessous",famille:"Mouvement de la même famille · suivez les consignes ci-dessous"};',
    'function s5(i,o,ctx){const n=i?Kh(i):null;if(n)return{path:n.path,name:n.name,exact:n.level==="exact",level:n.level,note:n.note||null};if(i&&i.img)return{path:i.img,name:i.name,exact:!0,level:"exact",note:null};if(o)return JarvisMedia.movement(o,ctx);return null}const Wf={exact:"Illustration humaine · source",variante:"Même mouvement, détail différent · voir la note",famille:"Même mouvement, détail différent · voir la note"};',
  );

  // 7. Demonstration component: explicit "no demonstration" card, honest notes.
  source = replaceOnce(
    source,
    "function gi({exercise:i,pattern:o,movementName:n,small:l=!1,controls:c=!0}){var E;const u=s5(i,n),",
    "function gi({exercise:i,pattern:o,movementName:n,small:l=!1,controls:c=!0,context:d}){var E;const r5=s5(i,n,d),u=r5&&r5.path?r5:null,miss=r5&&r5.missing?r5:null,",
  );
  // A movement explicitly reviewed as "no demonstration" must not fall back to the breathing guide.
  source = replaceOnce(
    source,
    'j=["breathe","respiration"].includes(o||(i==null?void 0:i.pattern))',
    'j=!miss&&["breathe","respiration"].includes(o||(i==null?void 0:i.pattern))',
  );
  source = replaceOnce(
    source,
    ':i&&!j?s.jsx("div",{className:"movement-atlas",children:s.jsx(dr,{primary:[i.muscle],secondary:i.secondary||[],compact:!0})}):s.jsxs("div",{className:"human-recovery-visual",children:[',
    ':i&&!j?s.jsx("div",{className:"movement-atlas",children:s.jsx(dr,{primary:[i.muscle],secondary:i.secondary||[],compact:!0})}):!j?s.jsxs("div",{className:"movement-missing",children:[s.jsx(z,{name:"Info",size:22}),s.jsx("p",{children:"Pas de démonstration pour ce mouvement"}),s.jsx("small",{children:miss&&miss.note||"Suivez la consigne écrite ; aucune autre illustration n’est substituée."})]}):s.jsxs("div",{className:"human-recovery-visual",children:[',
  );
  source = replaceOnce(
    source,
    's.jsx("span",{children:u?Wf[u.level]||Wf.variante:j?"Guide respiratoire":"Anatomie humaine · vue détaillée"})]}),u&&!u.exact&&i&&!l&&s.jsxs("p",{className:"movement-media-note",children:["Démonstration de ",s.jsx("strong",{children:u.name}),", mouvement"," ",u.level==="famille"?"de la même famille":"très proche",". Le geste de référence est le bon ; suivez les étapes et les consignes de ",s.jsx("strong",{children:i.name})," pour la position exacte, la prise et l’amplitude."]}),!u&&i&&!l&&s.jsx("p",{className:"movement-media-note",children:"Pas de démonstration filmée disponible pour cette variante. Suivez ses étapes et ses consignes, sans déduire le mouvement de la seule vue anatomique."})]})}',
    's.jsx("span",{children:u?Wf[u.level]||Wf.variante:j?"Guide respiratoire":i?"Anatomie humaine · vue détaillée":"Pas de démonstration"})]}),u&&!u.exact&&i&&!l&&s.jsxs("p",{className:"movement-media-note",children:["Démonstration : ",s.jsx("strong",{children:u.name}),". ",u.note||"Même mouvement, un détail diffère."," Suivez les étapes et les consignes de ",s.jsx("strong",{children:i.name})," pour la position exacte, la prise et l’amplitude."]}),!u&&i&&!l&&s.jsxs("p",{className:"movement-media-note",children:["Pas de démonstration correspondante pour cette variante",(JarvisMedia.exercise(i)||{}).note?" : "+JarvisMedia.exercise(i).note:".", " Suivez ses étapes et ses consignes, sans déduire le mouvement de la seule vue anatomique. Aucun autre mouvement n’est affiché à la place."]})]})}',
  );

  // 8. Timer: resolve by step name AND context (land HIIT vs pool), never a pool guide for a
  //    land round; pool "consignes" only in aquatic protocols; explicit absence otherwise.
  source = replaceOnce(
    source,
    "x=bl.find(w=>w.k.some(b=>Ge(f.name).includes(Ge(b))));",
    "x=JarvisMedia.isAqua(p.meta.type)?bl.find(w=>w.k.some(b=>Ge(f.name).includes(Ge(b)))):null,fImg=JarvisMedia.stepImage(f,p.meta.type);",
  );
  source = replaceOnce(
    source,
    '!p.done&&(f.img?s.jsxs("button",{type:"button",className:"timer-step-visual",title:"Agrandir",onClick:()=>l({type:"image",src:f.img,title:f.name}),children:[s.jsx("img",{src:bt(f.img),alt:f.name}),s.jsx(z,{name:"Maximize2",size:15})]}):s.jsx(gi,{movementName:f.name,pattern:f.pattern||"breathe",small:!0,controls:!1}))',
    '!p.done&&(fImg?s.jsxs("button",{type:"button",className:"timer-step-visual",title:"Agrandir",onClick:()=>l({type:"image",src:fImg,title:f.name}),children:[s.jsx("img",{src:bt(fImg),alt:f.name}),s.jsx(z,{name:"Maximize2",size:15})]}):s.jsx(gi,{movementName:f.name,pattern:f.pattern||"breathe",small:!0,controls:!1,context:p.meta.type}))',
  );
  source = replaceOnce(
    source,
    'x.img&&s.jsx("img",{src:bt(x.img),alt:x.t}),s.jsx("ul",{children:x.h.map((w,b)=>s.jsx("li",{children:w},b))})]})',
    'x.img&&s.jsx("img",{src:bt(x.img),alt:x.t}),x.mediaNote&&s.jsx("p",{className:"timer-guide-note",children:x.mediaNote}),s.jsx("ul",{children:x.h.map((w,b)=>s.jsx("li",{children:w},b))})]})',
  );

  // 9. Pool protocol detail: show the reviewed note under a guide illustration.
  source = replaceOnce(
    source,
    'C.img&&s.jsx("img",{loading:"lazy",src:bt(C.img),alt:C.t}),s.jsx("ul",{children:C.h.map((Q,O)=>s.jsx("li",{children:Q},O))})',
    'C.img&&s.jsx("img",{loading:"lazy",src:bt(C.img),alt:C.t}),C.mediaNote&&s.jsx("p",{className:"pool-guide-note",children:C.mediaNote}),s.jsx("ul",{children:C.h.map((Q,O)=>s.jsx("li",{children:Q},O))})',
  );

  // 10. Warm-up modal side visual: the actual mobility step, not a generic recovery photo.
  source = replaceOnce(
    source,
    "s.jsx(gi,{pattern:h[1].pattern,small:!0})",
    's.jsx(gi,{movementName:h[1].name,context:"warmup",pattern:h[1].pattern,small:!0})',
  );

  parse(source, { ecmaVersion: "latest", sourceType: "module" });
  return source;
}

export function newAssets() {
  return fs
    .readdirSync(path.join(here, "assets"))
    .filter((f) => /\.(gif|jpg|png)$/.test(f))
    .map((f) => ({ name: f, path: path.join(here, "assets", f), web: "/media/" + f }));
}

export function prepare(
  base = path.join(root, baseline.apk),
  destination = path.join(root, ".cache/media-web"),
) {
  if (sha256(fs.readFileSync(base)) !== baseline.apkSha256) throw Error("Wrong APK baseline");
  const dest = path.resolve(destination);
  if (!dest.startsWith(path.join(root, ".cache") + path.sep))
    throw Error("Candidate assets must stay under .cache");
  fs.rmSync(dest, { recursive: true, force: true });
  execFileSync("python3", [
    "-c",
    `import zipfile,pathlib,sys
z=zipfile.ZipFile(sys.argv[1]); root=pathlib.Path(sys.argv[2]);root.mkdir(parents=True,exist_ok=True)
for name in z.namelist():
 if not name.startswith('assets/public/') or name.endswith('/'):continue
 relative=pathlib.PurePosixPath(name).relative_to('assets/public')
 if '..' in relative.parts:raise ValueError('Unsafe ZIP path')
 p=root.joinpath(*relative.parts);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(name))`,
    base,
    dest,
  ]);
  const bundle = baseline.bundle.replace("assets/public/", "");
  const candidate = integrate(fs.readFileSync(path.join(dest, bundle), "utf8"));
  fs.writeFileSync(path.join(dest, bundle), candidate);
  const added = [];
  for (const asset of newAssets()) {
    const target = path.join(dest, "media", asset.name);
    if (fs.existsSync(target)) throw Error("New asset would overwrite a packaged file: " + asset.name);
    fs.copyFileSync(asset.path, target);
    added.push({ web: asset.web, sha256: sha256(fs.readFileSync(asset.path)) });
  }
  // Every mapped media path must exist in the candidate web root.
  const map = runtimeMap();
  const all = [
    ...Object.values(map.exercises),
    ...Object.values(map.land),
    ...Object.values(map.stretches),
    ...Object.values(map.warmup),
    ...Object.values(map.poolGuides),
  ];
  for (const e of all)
    if (e.media && !fs.existsSync(path.join(dest, e.media))) throw Error("Missing media " + e.media);
  const report = {
    baseline,
    candidateBundleSha256: sha256(candidate),
    changedWebFiles: [bundle],
    newFiles: added,
    mappingVersion: mapping.version,
    dipsVariant: mapping.dips.variant,
    signedApkProduced: false,
    scope:
      "Exercise demonstrations only (musculation, échauffement, piscine, Tabata, étirements); all seven stages and the approved home retained; no Android release configuration changed",
  };
  fs.writeFileSync(
    path.join(dest, "..", "media-build-report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  prepare(process.argv[2], process.argv[3]);
