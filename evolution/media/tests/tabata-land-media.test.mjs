// Tabata au sol : chaque mouvement du generateur recoit son animation.
//
// Mesure du 23 septembre 2026 : 34 des 38 noms au sol ne resolvaient aucun
// media (photo generique de recuperation a l'ecran). Les animations produites
// sont resolues UNIQUEMENT dans un enchainement au sol : jamais en piscine, ni
// en etirement, ni au repos. Aucun nom, aucune duree, aucune consigne et aucun
// etat enregistre ne change.
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../../../', import.meta.url).pathname;
const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url)));
const map = read('../candidate/tabata-land-animations-map.json');
const bundle = fs.readFileSync(new URL('../../../.cache/media-pool-candidate/assets/index-CBCies4k.js', import.meta.url), 'utf8');
// Le module de contexte, evalue tel qu'il est livre dans le paquet.
const start = bundle.indexOf('function createTabataLandMedia(');
const end = bundle.indexOf('const JarvisTabataLandMedia=', start);
assert.ok(start > 0 && end > start, 'module de contexte terre absent du paquet livre');
const factory = vm.runInNewContext(bundle.slice(start, end) + ';createTabataLandMedia', {});
const media = factory({normalize: value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(), providedAnimations: map.map});
const resolverStart = bundle.indexOf('landMedia=poolMedia?null:JarvisTabataLandMedia.resolve(');
const modes = bundle.slice(bundle.indexOf('"TABATA_MODES"'), bundle.indexOf('"TABATA_MODES"') + 1400);
const names = [...new Set([...modes.matchAll(/exos":\[([^\]]+)\]/g)].flatMap(match => [...match[1].matchAll(/"([^"]+)"/g)].map(item => item[1])))];

test('les 38 mouvements du Tabata au sol sont connus du generateur livre', () => {
  assert.equal(names.length, 38, 'les 38 noms du generateur au sol');
  assert.equal(modes.includes('"low"'), true, 'le mode Low Impact doit rester dans le paquet');
});

test('chaque animation produite est resolue au sol et nulle part ailleurs', () => {
  assert.ok(Object.keys(map.map).length > 0, 'aucune animation produite');
  for (const [name, path] of Object.entries(map.map)) {
    assert.ok(names.includes(name), 'mouvement inconnu du generateur au sol : ' + name);
    const step = {name: name + ' · round 3/8', seconds: 20, pattern: 'work'};
    const land = media.resolve(step, {type: 'hiit', name: 'Tabata 20/10'});
    assert.ok(land, 'animation non resolue au sol : ' + name);
    assert.equal(land.path, path, 'mauvaise animation pour ' + name);
    // Jamais en piscine : le guide aquatique garde la main.
    assert.equal(media.resolve(step, {type: 'aqua', name: 'Aqua Tabata'}, {path: '/media/x.gif'}), null,
      'animation de terre resolue en aquatique : ' + name);
    assert.equal(media.resolve(step, {type: 'swim', name: 'Nage douce'}), null, 'animation resolue en piscine : ' + name);
    // Ni au repos, ni sur un nom d'etirement ou d'echauffement.
    assert.equal(media.resolve({name: 'Récupération', seconds: 10, pattern: 'breathe'}, {type: 'hiit'}), null);
    assert.equal(media.resolve({name}, {type: 'recovery'}), null, 'animation resolue hors Tabata : ' + name);
  }
});

test('aucun mouvement ne recoit un visuel generique par erreur, et rien n’est invente', () => {
  // Les noms non produits ne resolvent rien : la photo generique reste le
  // comportement livre, groupe tabata-missing-demonstrations toujours ouvert.
  for (const name of names) {
    if (map.map[name]) continue;
    const step = {name: name + ' · round 1/8', seconds: 20, pattern: 'work'};
    assert.equal(media.resolve(step, {type: 'hiit'}), null, 'visuel non prevu pour ' + name);
  }
  // Les quatre noms partages avec la piscine ne prennent jamais une animation
  // aquatique dans un enchainement au sol (correction de la 1.4.5 conservee).
  assert.ok(resolverStart > 0 && bundle.includes('poolMedia?f.name:void 0'), 'contexte aquatique conserve');
});

test('les fichiers livres sont de vraies animations, au format de la famille', () => {
  for (const [path, digest] of Object.entries(map.files)) {
    const file = new URL('../candidate/tabata-land-animations/' + path.split('/').pop().replace('tabata-land-', ''), import.meta.url);
    const bytes = fs.readFileSync(file);
    assert.ok(bytes.subarray(0, 6).toString('latin1').startsWith('GIF8'), 'pas un GIF : ' + path);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), digest, 'empreinte differente : ' + path);
    // 480 x 262 comme les GIF aquatiques deja livres, deux images, 500 ms.
    assert.equal(bytes.readUInt16LE(6), 480, 'largeur inattendue : ' + path);
    assert.equal(bytes.readUInt16LE(8), 262, 'hauteur inattendue : ' + path);
  }
});

test('le generateur au sol est intact : noms, durees et consignes de la 1.4.0', () => {
  const original = fs.readFileSync(new URL('../../../.cache/media-pool-syntax.mjs', import.meta.url), 'utf8');
  const baseline = fs.readFileSync(new URL('../baseline.json', import.meta.url));
  assert.ok(baseline.length > 0);
  const patterns = bundle.slice(bundle.indexOf('"PAT_DD"'), bundle.indexOf('"PAT_DD"') + 300);
  assert.ok(patterns.includes('"static":2.6'), 'les rythmes prescrits sont inchanges');
  assert.ok(original.includes('JarvisTabataLandMedia'), 'le paquet livre porte bien le contexte terre');
  // Aucun ajout de pas, aucune duree reecrite : les noms suffixes restent
  // construits par le generateur livre (round n/N).
  assert.ok(bundle.includes('`${O[q%O.length]} · round ${q+1}/${u}`'), 'generateur inchange');
});
