#!/usr/bin/env node
// Inventaire MESURE du chantier « refaire tous les GIF animes » (demande du
// 24 septembre 2026 : « Refaire tous les gif animés en fonction de l'image que
// je te joins en photo […] un modèle féminin pour Emilie. Faire un visage »).
//
// Rien n'est suppose : la liste part de l'APK livre (1.4.8), les usages sont
// resolus avec les MEMES modules que le script embarque (piscine, Tabata au
// sol, variantes, reassociations revues), et les profils viennent des sources
// de chaque exercice du catalogue 1.4.0 (elite = Yanis, emilie = Émilie).
//
//   node evolution/media/tools/restyle-inventory.mjs            # ecrit le JSON
//   node evolution/media/tools/restyle-inventory.mjs --check    # verifie seulement
//
// Sortie : evolution/media/review/RESTYLE-INVENTAIRE.json
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createPoolMedia} from '../candidate/pool-context.mjs';
import {createTabataLandMedia} from '../candidate/tabata-land-context.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const APK = 'downloads/Yanis-Fitness-Evolution-1.4.8.apk';
const OUT = 'evolution/media/review/RESTYLE-INVENTAIRE.json';
const json = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const sha = buffer => createHash('sha256').update(buffer).digest('hex');

// --- lecture de l'APK livre (zip) via python, comme les tests existants -----
function zipRead(entry) {
  return execFileSync('python3', ['-c',
    'import sys,zipfile;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))',
    path.join(root, APK), entry], {maxBuffer: 1 << 28});
}
const names = execFileSync('python3', ['-c',
  'import sys,zipfile;print("\\n".join(zipfile.ZipFile(sys.argv[1]).namelist()))',
  path.join(root, APK)]).toString().trim().split('\n');
const bundleEntry = names.find(n => /^assets\/public\/assets\/index-.*\.js$/.test(n));
const bundle = zipRead(bundleEntry).toString('utf8');

// --- format d'un GIF : taille, nombre d'images, durees (lecture des blocs) ---
function gifFormat(buffer) {
  if (buffer.toString('latin1', 0, 6) !== 'GIF89a' && buffer.toString('latin1', 0, 6) !== 'GIF87a')
    throw Error('pas un GIF');
  const width = buffer.readUInt16LE(6), height = buffer.readUInt16LE(8);
  let offset = 13;
  const packed = buffer[10];
  if (packed & 0x80) offset += 3 * (1 << ((packed & 7) + 1));
  const durations = [];
  let pendingDelay = null;
  const skipSubBlocks = () => { while (buffer[offset] !== 0) offset += buffer[offset] + 1; offset += 1; };
  while (offset < buffer.length) {
    const block = buffer[offset++];
    if (block === 0x3b) break;
    if (block === 0x21) {
      const label = buffer[offset++];
      if (label === 0xf9) pendingDelay = buffer.readUInt16LE(offset + 2) * 10;
      skipSubBlocks();
    } else if (block === 0x2c) {
      const local = buffer[offset + 8];
      offset += 9;
      if (local & 0x80) offset += 3 * (1 << ((local & 7) + 1));
      offset += 1; // taille minimale LZW
      skipSubBlocks();
      durations.push(pendingDelay);
      pendingDelay = null;
    } else throw Error('bloc GIF inconnu 0x' + block.toString(16));
  }
  return {width, height, frames: durations.length, durationsMs: [...new Set(durations)]};
}

// --- donnees de reference -----------------------------------------------------
const inventory = json('evolution/media/review/inventory-1.4.0.json');
const styleMetrics = json('evolution/media/review/STYLE-METRICS.json');
const overrides = json('evolution/media/candidate/association-overrides.json').overrides;
const aliasMap = json('evolution/media/candidate/alias-visuals-map.json');
const landMap = json('evolution/media/candidate/tabata-land-animations-map.json');
const poolMap = json('evolution/media/candidate/pool-animations-map.json');
const recoveryMap = json('evolution/media/candidate/pool-recovery-map.json');

// Normalisation : la fonction Ge du script LIVRE, extraite par l'AST et
// evaluee telle quelle (jamais recopiee a la main).
const {parse} = await import(path.join(root, 'JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs'));
const normalize = (() => {
  const tree = parse(bundle, {ecmaVersion: 'latest', sourceType: 'module'});
  let found = null;
  (function walk(node) {
    if (found || !node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node.type === 'VariableDeclarator' && node.id?.name === 'Ge' && node.init) { found = bundle.slice(node.init.start, node.init.end); return; }
    for (const [key, value] of Object.entries(node)) if (!['start', 'end', 'loc', 'range'].includes(key)) walk(value);
  })(tree);
  if (!found) throw Error('normalisation Ge absente du script livre');
  return new Function('return ' + found)();
})();

// Noms de programme (MUSCU_GUIDES) : payload 0 = Émilie, payload 1 = Yanis.
const payloads = [...bundle.matchAll(/=JSON\.parse\((`[^`]*`)\)/g)]
  .map(match => new Function('return JSON.parse(' + match[1] + ')')());
const guideNames = new Map();
payloads.forEach((payload, index) => {
  const who = index === 0 ? 'emilie' : 'yanis';
  for (const [name, entry] of Object.entries(payload.MUSCU_GUIDES || {})) {
    if (!entry?.img || !entry.img.endsWith('.gif')) continue;
    if (!guideNames.has(entry.img)) guideNames.set(entry.img, []);
    guideNames.get(entry.img).push({nom: name, programme: who});
  }
});

// --- resolution 1.4.8 des 209 exercices (meme ordre que le script livre) ----
const reviewed = new Map(overrides.map(entry => [entry.id, entry.path]));
for (const entry of aliasMap.variantes) reviewed.set(entry.id, entry.path);
const profilesOf = sources => [...new Set((sources || []).flatMap(source =>
  source === 'elite' ? ['yanis'] : source === 'emilie' ? ['emilie'] : ['yanis', 'emilie']))].sort();

const usage = new Map();
const use = (file, kind, entry) => {
  if (!file || !file.endsWith('.gif')) return;
  if (!usage.has(file)) usage.set(file, {exercices: [], guidesPiscine: [], etapesPiscine: {}, tabataSol: [], tabataEau: [], programmes: []});
  const record = usage.get(file);
  if (kind === 'etapesPiscine') record.etapesPiscine[entry] = (record.etapesPiscine[entry] || 0) + 1;
  else record[kind].push(entry);
};
for (const exercise of inventory.exercises) {
  const file = reviewed.get(exercise.id) || exercise.gif || exercise.resolved?.path || null;
  use(file, 'exercices', {id: exercise.id, nom: exercise.name, profils: profilesOf(exercise.sources)});
}

// --- piscine : 19 guides + 420 etapes, par le module du script livre --------
const providedLand = {...landMap.map, ...Object.fromEntries(Object.entries(landMap.alias || {}).map(([n, e]) => [n, e.path]))};
const pool = createPoolMedia({normalize, poolGuides: inventory.poolGuides, reviewedTexts: json('evolution/media/candidate/pool-texts.json').entries,
  providedAnimations: poolMap.map, providedRecoveries: {map: recoveryMap.map, suffixes: recoveryMap.suffixes}});
for (const guide of inventory.poolGuides) {
  const resolved = pool.guide(guide.t);
  use(resolved?.img, 'guidesPiscine', guide.t);
}
let poolSteps = 0;
for (const protocol of inventory.poolProtocols) for (const level of protocol.levels) for (const step of level.steps) {
  const resolved = pool.resolve(step, {type: 'swim'});
  poolSteps += 1;
  use(resolved?.path, 'etapesPiscine', step.name.replace(/ \d+\/\d+/g, ' n/N'));
}

// --- Tabata au sol (38 noms) et aquatique (6 noms) ------------------------------
const land = createTabataLandMedia({normalize, providedAnimations: providedLand});
for (const name of Object.keys(providedLand)) {
  const resolved = land.resolve({name: name + ' · round 1/8'}, {type: 'tabata'}, null);
  use(resolved?.path, 'tabataSol', name);
}
for (const entry of inventory.tabataAqua) {
  const resolved = pool.resolve({name: entry.name}, {type: 'aqua'});
  use(resolved?.path || entry.resolved?.path, 'tabataEau', entry.name);
}
for (const [file, list] of guideNames) for (const item of list) use(file, 'programmes', item);

// --- liste des GIF de l'APK livre ----------------------------------------------
const gifEntries = names.filter(n => n.startsWith('assets/public/media/') && n.endsWith('.gif')).sort();
const lotOf = file => {
  if (Object.values(landMap.map).includes(file) || Object.keys(landMap.files || {}).includes(file)) return '1.4.8-tabata-sol';
  if (aliasMap.files?.[file]) return '1.4.8-variante';
  if (poolMap.files?.[file] || recoveryMap.files?.[file]) return '1.4.8-piscine';
  return '1.4.0';
};
const familyOf = format => format.frames >= 12 ? 'A-filaire-anatomique' : 'B-rendu-illustre';

const animations = gifEntries.map(entry => {
  const file = entry.slice('assets/public'.length);
  const buffer = zipRead(entry);
  const format = gifFormat(buffer);
  const record = usage.get(file) || {exercices: [], guidesPiscine: [], etapesPiscine: {}, tabataSol: [], tabataEau: [], programmes: []};
  const lot = lotOf(file);
  // Profils qui VOIENT l'animation : exercices selon leurs sources ; les outils
  // piscine et Tabata sont communs aux deux profils.
  const profils = new Set(record.exercices.flatMap(e => e.profils));
  record.programmes.forEach(p => profils.add(p.programme));
  if (record.guidesPiscine.length || Object.keys(record.etapesPiscine).length || record.tabataSol.length || record.tabataEau.length) {
    profils.add('yanis'); profils.add('emilie');
  }
  const sujet = styleMetrics[file]?.owner || record.exercices[0]?.nom || record.tabataSol[0] || record.guidesPiscine[0] ||
    record.programmes[0]?.nom || Object.keys(record.etapesPiscine)[0] || null;
  const contexte = (record.guidesPiscine.length || Object.keys(record.etapesPiscine).length || record.tabataEau.length) ? 'piscine'
    : record.tabataSol.length ? 'tabata-sol' : 'salle-ou-sol';
  return {
    fichier: file, sha256: sha(buffer), lot,
    famille: lot === '1.4.0' ? familyOf(format) : 'B-rendu-illustre (produit 1.4.8)',
    format: `${format.width}x${format.height}, ${format.frames} images, ${format.durationsMs.join('/')} ms`,
    sujet, contexte,
    profils: [...profils].sort(),
    utilisations: {
      exercices: record.exercices.map(e => `${e.id} [${e.profils.join('+')}]`),
      guidesPiscine: record.guidesPiscine,
      etapesPiscine: Object.values(record.etapesPiscine).reduce((a, b) => a + b, 0),
      tabataSol: record.tabataSol,
      tabataEau: record.tabataEau,
      nomsProgramme: [...new Set(record.programmes.map(p => p.nom))],
    },
  };
});

// --- animations du lot 2 (produites, non cablees) et restant a produire -------
// Identifiants servis : legendes de la planche de controle du lot 2
// (tools/alias-lot2-sheet.py) et relevé GAPS-SANS-DESSIN.json.
const LOT2_IDS = {
  'alias-face-pull-elastique.gif': ['face-pull-a-l-elastique'],
  'alias-kickback-elastique.gif': ['kickback-a-l-elastique'],
  'alias-leg-extension.gif': ['leg-extension'],
  'alias-curl-poulie-basse.gif': ['curl-poulie-basse', 'curl-poulie-basse-supination'],
  'alias-elevations-incline-30.gif': ['elevations-laterales-incline-30-face-au-banc'],
  'alias-elevations-incline-45.gif': ['elevations-laterales-incline-45'],
  'alias-tractions-prise-large.gif': ['tractions-prise-large'],
  'alias-split-squat-poulie.gif': ['split-squat-poulie-basse'],
  'alias-ecartes-cables-incline.gif': ['ecartes-cables-incline'],
  'alias-extensions-triceps-pullover.gif': ['extensions-triceps-pullover-barre-ez'],
};
const exerciseById = new Map(inventory.exercises.map(e => [e.id, e]));
const profilesOfIds = ids => [...new Set(ids.flatMap(id => {
  const exercise = exerciseById.get(id);
  if (!exercise) throw Error('identifiant inconnu du catalogue 1.4.0 : ' + id);
  return profilesOf(exercise.sources);
}))].sort();
const lot2Dir = 'evolution/media/candidate/alias-animations';
const wired = new Set(Object.keys(aliasMap.files || {}).map(f => path.basename(f)));
const lot2 = fs.readdirSync(path.join(root, lot2Dir)).filter(f => f.endsWith('.gif') && !wired.has(f)).sort().map(f => {
  const format = gifFormat(fs.readFileSync(path.join(root, lot2Dir, f)));
  const ids = LOT2_IDS[f];
  if (!ids) throw Error('animation du lot 2 sans identifiant connu : ' + f);
  return {fichier: `${lot2Dir}/${f}`, lot: 'lot-2-variante-non-cablee', identifiants: ids, profils: profilesOfIds(ids),
    format: `${format.width}x${format.height}, ${format.frames} images, ${format.durationsMs.join('/')} ms`,
    statut: /incline-30|ecartes-cables-incline/.test(f) ? 'a-refaire (pose non convaincante)' : 'produite, validee, non cablee'};
});
const aProduire = [
  {sujet: 'Rowing assis câble unilatéral (un seul bras)', identifiants: ['rowing-assis-cable-unilateral']},
  {sujet: 'Développé couché décliné prise serrée', identifiants: ['developpe-couche-decline-prise-serree']},
  {sujet: "Pallof press à l'élastique", identifiants: ['pallof-press-a-l-elastique']},
].map(entry => ({...entry, lot: 'a-produire', profils: profilesOfIds(entry.identifiants)}));

// Les cinq anciens dessins TERRESTRES des guides aquatiques restent dans l'APK
// (le programme les cite encore) mais ne s'affichent plus : le resolveur
// aquatique sert a leur place les animations produites en 1.4.7.
const replaced = new Map(Object.entries(poolMap.replacedLandVisuals || {}).map(([produced, old]) => [old, produced]));
for (const animation of animations) {
  const produced = replaced.get(animation.fichier);
  animation.affichee = animation.profils.length > 0;
  if (!animation.affichee && produced) {
    const guide = inventory.poolGuides.find(g => g.img === animation.fichier);
    animation.sujet = animation.sujet || (guide ? guide.t + ' (ancien dessin terrestre)' : null);
    animation.nonAffichee = `remplacee a l'affichage par ${produced.replace('/media/pool-', '/media/')} (guide aquatique produit en 1.4.7)`;
  }
}

const shown = animations.filter(a => a.affichee);
const emilie = shown.filter(a => a.profils.includes('emilie'));
const yanis = shown.filter(a => a.profils.includes('yanis'));
const orphelines = animations.filter(a => !a.affichee).map(a => a.fichier);
const unexplained = animations.filter(a => !a.affichee && !a.nonAffichee);
if (unexplained.length) throw Error('GIF sans consommateur ni explication : ' + unexplained.map(a => a.fichier).join(', '));
const movements = shown.length + lot2.length + aProduire.length;
const emilieMovements = emilie.length + lot2.filter(a => a.profils.includes('emilie')).length +
  aProduire.filter(a => a.profils.includes('emilie')).length;
const perLot = {};
for (const a of animations) perLot[a.lot + ' / ' + a.famille] = (perLot[a.lot + ' / ' + a.famille] || 0) + 1;

const result = {
  date: '2026-09-24',
  demande: "« Refaire tous les gif animés en fonction de l'image que je te joins en photo. ils doivent ressembler identiquement a la photo et doivent etre animé. Tiens en compte pour faire un modèle féminin pour Emilie. Faire un visage sur la photo »",
  statut: 'inventaire-mesure — production en attente de la photo de reference (non recue dans le message)',
  mesureSur: {apk: APK, apkSha256: sha(fs.readFileSync(path.join(root, APK))), paquetWeb: bundleEntry, etapesPiscine: poolSteps},
  resume: {
    gifLivres: animations.length,
    parLot: perLot,
    gifAffiches: shown.length,
    gifNonAffiches: orphelines.length,
    lot2NonCable: lot2.length,
    aProduire: aProduire.length,
    mouvementsARefaire: movements,
    vusParYanis: yanis.length,
    vusParEmilie: emilie.length,
    mouvementsVusParEmilie: emilieMovements,
    animationsAProduire: {
      modeleMasculinYanis: movements,
      modeleFemininEmilie_bibliothequeComplete: movements,
      modeleFemininEmilie_seulementCeQuElleVoit: emilieMovements,
    },
    toursMinimum_10imagesParTour: {
      yanisEtEmilieBibliothequeComplete: Math.ceil((movements * 2) / 10),
      yanisEtEmilieSeulementCeQuElleVoit: Math.ceil((movements + emilieMovements) / 10),
    },
  },
  regles: [
    'Une image generee = une planche de deux postures = un GIF de 2 images (outil panels-to-gif.py).',
    'Chaque GIF est verifie image par image : mouvement prescrit, bon outil, bon angle, bonne variante.',
    'Jamais d’image de la famille C ; piscine : jamais de velo, d’elliptique ni de photo generique.',
    'Aucune consigne n’est reecrite pour justifier une image ; pas de rotation ni de miroir global.',
    'Livraison : une seule version complete a la fin (regle 7).',
  ],
  orphelines,
  animations,
  lot2,
  aProduire,
};

const text = JSON.stringify(result, null, 1) + '\n';
if (process.argv.includes('--check')) {
  const current = fs.readFileSync(path.join(root, OUT), 'utf8');
  if (current !== text) { console.error('RESTYLE-INVENTAIRE.json n’est plus a jour'); process.exit(1); }
  console.log('inventaire a jour');
} else {
  fs.writeFileSync(path.join(root, OUT), text);
  console.log(JSON.stringify(result.resume, null, 1));
}
