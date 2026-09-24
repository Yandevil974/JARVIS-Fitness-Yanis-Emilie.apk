// Le SCRIPT LIVRE doit resoudre lui-meme, dans l'APK telechargeable.
//
// Les autres tests mesurent le module candidat (la source qui produit le
// paquet) ou l'inventaire de l'APK (les fichiers presents). Aucun ne faisait
// tourner le JavaScript REELLEMENT embarque dans l'APK. Ici, le script est
// extrait du fichier livre, evalue tel quel, et interroge :
//   - les 420 etapes des six protocoles piscine,
//   - les 38 noms du generateur de Tabata au sol (33 dessins + 5 equivalents),
//   - les 10 variantes d'alias et les 2 exercices revus,
//   - les 4 etirements dont le dessin montrait un autre mouvement.
// Aucune donnee n'est reconstituee a la main : tout vient de l'APK et des
// cartes commitees qui decrivent ce que l'utilisateur doit voir.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parse} from '../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';

const root = new URL('../../../', import.meta.url).pathname;
const APK = 'downloads/Yanis-Fitness-Evolution-1.4.8.apk';
const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url)));

const report = JSON.parse(fs.readFileSync(root + APK.replace('.apk', '.fidelity.json'), 'utf8'));
const apkSha = crypto.createHash('sha256').update(fs.readFileSync(root + APK)).digest('hex');

// Le paquet web, extrait de l'APK lui-meme.
const bundleEntry = execFileSync('python3', ['-c',
  `import sys,zipfile
z=zipfile.ZipFile(sys.argv[1])
n=[x for x in z.namelist() if x.startswith('assets/public/assets/index-') and x.endswith('.js')]
assert len(n)<=1,'plusieurs paquets web dans l APK: '+repr(n)
sys.stdout.write((n[0] if n else '')+'\\n'+__import__('hashlib').sha256(z.read(n[0])).hexdigest() if n else '')`, root + APK]).toString().trim().split('\n');
const bundlePath = bundleEntry[0];
const bundleSha = bundleEntry[1];
const text = execFileSync('python3', ['-c',
  'import sys,zipfile;sys.stdout.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]).decode("utf-8"))',
  root + APK, bundlePath], {maxBuffer: 1 << 28}).toString();

const inventory = read('../review/inventory-1.4.0.json');
const landMap = read('../candidate/tabata-land-animations-map.json');
const aliasMap = read('../candidate/alias-visuals-map.json');
const stretchMap = read('../candidate/stretch-visuals-map.json');
const recoveryMap = read('../candidate/pool-recovery-map.json');

// --- outillage de decoupe : le paquet est minifie, on prend les morceaux utiles
// par l'AST (jamais par comptage d'accolades : le script contient des accolades
// dans ses chaines de texte).
const tree = parse(text, {ecmaVersion: 'latest', sourceType: 'module'});
const nodes = [];
(function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (node.type) nodes.push(node);
  for (const [cle, valeur] of Object.entries(node)) {
    if (['start', 'end', 'loc', 'range'].includes(cle)) continue;
    walk(valeur);
  }
})(tree);
// Une seule declarations : celle qui porte le nom cherche, copiee avec son
// « const » et son point-virgule (le paquet minifie en regroupe plusieurs par
// instruction, qui referencent des identifiants inutiles ici).
const declarator = nom => {
  for (const node of nodes) {
    if (node.type !== 'VariableDeclaration') continue;
    for (const d of node.declarations ?? [])
      if (d.id?.name === nom) return 'const ' + text.slice(d.start, d.end) + ';';
  }
  assert.fail('declaration absente du script livre : ' + nom);
};
const fonction = nom => {
  const node = nodes.find(n => n.type === 'FunctionDeclaration' && n.id?.name === nom);
  assert.ok(node, 'fonction absente du script livre : ' + nom);
  return text.slice(node.start, node.end);
};
const ge = declarator('Ge');
const poolStatement = declarator('JarvisPoolMedia');
const landStatement = declarator('JarvisTabataLandMedia');

test('l’APK livre correspond exactement au rapport et au script annonces', () => {
  assert.equal(apkSha, report.apkSha256, 'empreinte de l’APK differente du rapport');
  assert.equal(fs.readFileSync(root + APK + '.sha256', 'utf8').trim().split(/\s+/)[0], apkSha);
  assert.ok(bundlePath, 'paquet web absent de l’APK livre');
  assert.equal(bundleSha, report.packagedWebSha256, 'paquet web de l’APK different du rapport');
  assert.equal(report.version, '1.4.8');
  assert.equal(report.versionCode, 19);
  assert.deepEqual(report.signatureVerified.slice().sort(), ['v2', 'v3']);
  assert.equal(report.byteIdenticalDexFiles, 9);
  assert.ok(!/famille-c|family-c/i.test(text), 'aucune image de la famille refusee ne doit etre servie');
});

test('le script livre resout les 420 etapes piscine sur un media aquatique', () => {
  const ctx = vm.createContext({bl: inventory.poolGuides, If: inventory.cardioGuides});
  vm.runInContext(ge, ctx);
  vm.runInContext(fonction('createPoolMedia'), ctx);
  vm.runInContext(poolStatement, ctx);
  ctx.steps = inventory.poolProtocols.flatMap(p => p.levels.flatMap(l => l.steps));
  const results = vm.runInContext('steps.map(s=>JarvisPoolMedia.resolve(s,{type:"swim"}))', ctx);
  assert.equal(results.length, 420);
  const sansVisuel = results.filter(r => !r || !r.path);
  assert.deepEqual(sansVisuel, [], 'etapes piscine sans visuel dans le script livre');
  const secs = results.filter(r => /cardio-|elliptique|recovery-human|photo/.test(r.path));
  assert.deepEqual(secs, [], 'media de terre servi dans un contexte piscine');
  const statuts = new Set(results.map(r => r.status));
  assert.deepEqual([...statuts].sort(), ['legacy-association-not-yet-validated', 'provided-aquatic-recovery']);
  const compte = path => results.filter(r => r.path === path).length;
  assert.equal(compte(recoveryMap.suffixes['— en place']), 18, 'mises en place « — en place »');
  assert.equal(compte(recoveryMap.map['Repos']), 117, 'etapes « Repos »');
  // Table exacte du script livre : ce qu'un pas de chaque nom affiche.
  const table = {
    '/media/pool-repos.gif': 117, '/media/pool-marche-aquatique.jpg': 45, '/media/pool-sprint.jpg': 30,
    '/media/pool-fractionne.jpg': 24, '/media/pool-recup-complete.jpg': 18, '/media/pool-en-place.gif': 18,
    '/media/pool-deplacements-lateraux.jpg': 18, '/media/pool-retour-calme.jpg': 15, '/media/pool-nage-douce.jpg': 13,
    '/media/fd7c5fb1226873f6.gif': 11, '/media/talons-fesses.gif': 9, '/media/pool-nage-statique.jpg': 6,
    '/media/pool-recup-tabata.jpg': 6, '/media/mobilite-epaules.gif': 3, '/media/mobilite-hanches-chevilles.gif': 3,
    '/media/pool-etirements-bord.jpg': 3, '/media/ciseaux-au-bord.gif': 18, '/media/gainage-vertical.gif': 18,
    '/media/e035a3d8e8c21744.gif': 18, '/media/fe34482aa6faf932.gif': 18, '/media/2e234599c9335530.gif': 9,
  };
  const obtenu = {};
  for (const r of results) obtenu[r.path] = (obtenu[r.path] || 0) + 1;
  assert.deepEqual(obtenu, table, 'table de resolution des 420 etapes piscine');
  const total = Object.values(obtenu).reduce((a, b) => a + b, 0);
  assert.equal(total, 420);
});

test('le script livre couvre les 38 noms du Tabata au sol, sans jamais servir un guide aquatique', () => {
  const ctx = vm.createContext({});
  vm.runInContext(ge, ctx);
  vm.runInContext(fonction('createTabataLandMedia'), ctx);
  vm.runInContext(landStatement, ctx);
  const attendus = {...landMap.map, ...Object.fromEntries(Object.entries(landMap.alias).map(([nom, v]) => [nom, v.path]))};
  assert.equal(Object.keys(attendus).length, 38, '38 noms du generateur au sol');
  ctx.noms = Object.keys(attendus);
  const land = vm.runInContext('noms.map(n=>JarvisTabataLandMedia.resolve({name:n+" · round 1/8"},{type:"tabata"},null))', ctx);
  land.forEach((resultat, i) => {
    const nom = ctx.noms[i];
    assert.ok(resultat, 'aucune animation au sol pour : ' + nom);
    assert.equal(resultat.path, attendus[nom], 'animation au sol inattendue : ' + nom);
    assert.equal(resultat.level, 'exact-land');
  });
  const pool = vm.runInContext('noms.map(n=>JarvisTabataLandMedia.resolve({name:n+" · round 1/8"},{type:"swim"},{path:"/media/gainage-vertical.gif"}))', ctx);
  assert.deepEqual(pool, new Array(38).fill(null), 'un pas aquatique ne doit jamais montrer une animation de terre');
  const hors = vm.runInContext('noms.map(n=>JarvisTabataLandMedia.resolve({name:n},{type:"warmup"},null))', ctx);
  assert.deepEqual(hors, new Array(38).fill(null), 'hors Tabata au sol, rien ne change');
});

test('le script livre resout les dix variantes sur leur propre animation', () => {
  const ctx = vm.createContext({});
  ctx.eo = new Map(inventory.exercises.filter(e => e.resolved).map(e => [e.id, {path: e.resolved.path, name: e.resolved.name, level: e.resolved.level}]));
  vm.runInContext(fonction('JarvisReviewedMedia'), ctx);
  vm.runInContext(fonction('Kh'), ctx);
  let count = 0;
  for (const entry of aliasMap.variantes) {
    ctx.id = entry.id;
    const resultat = vm.runInContext('Kh({id})', ctx);
    assert.ok(resultat, 'variante sans resolution dans le script livre : ' + entry.id);
    assert.equal(resultat.path, entry.path, 'animation de variante : ' + entry.id);
    assert.equal(resultat.level, 'exact', 'niveau de variante : ' + entry.id);
    count += 1;
  }
  assert.equal(count, 10);
  for (const [id, attendu] of [['pont-fessier-au-sol-activation', '/media/8eecb0152081ff26.gif'],
    ['french-press-barre-ez', '/media/ea226c444f72de0f.gif']]) {
    ctx.id = id;
    assert.equal(vm.runInContext('Kh({id}).path', ctx), attendu, 'exercice revu : ' + id);
  }
  ctx.id = 'inconnu';
  assert.equal(vm.runInContext('Kh({id})', ctx), null, 'un identifiant inconnu ne doit rien deviner');
});

test('le script livre sert les quatre etirements produits et jamais l’ancien dessin', () => {
  const ctx = vm.createContext({});
  vm.runInContext(declarator('xg'), ctx);
  const carte = vm.runInContext('xg', ctx);
  assert.equal(Object.keys(carte).length, 29, 'etirements du script livre');
  for (const swap of stretchMap.swaps) {
    assert.equal(carte[swap.name], swap.after, 'etirement servi par le script livre : ' + swap.name);
    assert.notEqual(carte[swap.name], swap.before, 'ancien dessin encore servi : ' + swap.name);
  }
  assert.equal(stretchMap.swaps.length, 4);
});
