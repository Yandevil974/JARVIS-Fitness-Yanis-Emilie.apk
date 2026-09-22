// Tests of the media correction build on the exact 1.4.0 bundle (no browser needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { integrate, runtimeMap, helper, mapping, baseline, ge } from '../build.mjs';
import { sha256 } from '../../../complete-hotfix/patch-web.mjs';

const root = fileURLToPath(new URL('../../..', import.meta.url));
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p)));
const inventory = read('evolution/media/review/inventory-1.4.0.json');
const legacy = read('JARVIS-Fitness-Source/src/data/legacy.json');
const webRoot = path.join(root, '.cache/media-audit/web-1.4.0');
const packaged = new Set(
  fs.existsSync(path.join(webRoot, 'media')) ? fs.readdirSync(path.join(webRoot, 'media')).map((f) => '/media/' + f) : [],
);
const newAssets = new Set(fs.readdirSync(new URL('../assets', import.meta.url)).map((f) => '/media/' + f));
const exists = (p) => packaged.has(p) || newAssets.has(p);
const original = () => fs.readFileSync(path.join(webRoot, 'assets/index-CBCies4k.js'), 'utf8');

test('mapping covers every packaged exercise with an explicit review state', () => {
  const ids = inventory.exercises.map((e) => e.id);
  assert.equal(ids.length, 209);
  assert.deepEqual(Object.keys(mapping.exercises).sort(), [...ids].sort());
  for (const [id, e] of Object.entries(mapping.exercises)) {
    assert.ok(['exact', 'variante', 'none'].includes(e.level), id);
    if (e.level === 'none') assert.equal(e.media, null, id), assert.ok(e.note, id);
    else assert.ok(e.media, id);
    if (e.level === 'variante') assert.ok(e.note && e.note.length > 20, id + ' needs an explicit difference note');
    if (e.media && packaged.size) assert.ok(exists(e.media), id + ' ' + e.media);
  }
  // Confirmed 1.4.0 mismatches are gone.
  const m = mapping.exercises;
  assert.notEqual(m['hip-thrust-unilateral'].media, '/media/cf312b839f6da027.gif');
  assert.equal(m['step-up-haut'].media, '/media/37f614cd3432709b.gif');
  assert.equal(m['step-up-sur-banc-hauteur-du-genou'].media, '/media/6809d9052927484a.gif');
  assert.equal(m['tractions-pull-up'].media, '/media/a8fb4616e53e9cb9.gif');
  assert.equal(m['tractions-supination-chin-up'].media, '/media/ebc7379850a4ee2f.gif');
  assert.equal(m['french-press-barre-ez'].media, '/media/ea226c444f72de0f.gif');
  assert.equal(m['leg-extension'].level, 'none');
  assert.equal(m['good-morning-debout'].level, 'none');
  assert.equal(m['face-pull-a-la-poulie'].level, 'none');
  assert.equal(m['respiration-diaphragmatique'].media, '/media/stretch-respiration.jpg');
  assert.equal(m['bird-dog'].media, '/media/aab0de0aad0c275a.gif');
  assert.equal(m['pont-fessier-au-sol-activation'].media, '/media/8eecb0152081ff26.gif');
});

test('normalised guide keys restore the 20 lost legacy images', () => {
  const guides = {};
  for (const source of ['elite', 'emilie'])
    for (const [k, v] of Object.entries(legacy[source].MUSCU_GUIDES)) guides[ge(k)] = v && v.ref ? { ...v, ref: ge(v.ref) } : v;
  const lookup = (name) => {
    let g = guides[ge(name)];
    if (g && g.ref) g = guides[g.ref];
    return g && g.img;
  };
  const restored = inventory.exercises.filter((e) => !e.gif && lookup(e.name));
  assert.equal(restored.length, 20);
  for (const id of ['tractions-pull-up', 'step-up-haut', 'kickback-a-la-poulie-drop-set-final', 'pallof-press-a-l-elastique'])
    assert.ok(restored.some((e) => e.id === id), id);
  assert.equal(inventory.exercises.filter((e) => lookup(e.name)).length, 115);
});

test('runtime map: land Tabata names, aqua guides, stretches and warm-up are explicit', () => {
  const map = runtimeMap();
  for (const { name } of inventory.tabataLand) assert.ok(map.land[ge(name)], 'land: ' + name);
  for (const key of ['jumping jacks', 'burpees', 'dips au bord']) assert.equal(map.land[key].media, null);
  assert.equal(map.land['gainage planche'].media, '/media/1317e405efd6ef2b.gif');
  assert.equal(map.land['battements de jambes'].media, null); // never the pool GIF on land
  assert.equal(map.land['montees de genoux'].media, null);
  assert.equal(map.land['marche sur place'].media, null);
  assert.equal(map.land['repos actif'].level, 'rest');
  assert.equal(Object.keys(map.stretches).length, 29);
  assert.equal(map.stretches['pigeon assis'].media, '/media/stretch-piriforme.jpg');
  assert.equal(map.stretches['mollet en escalier'].media, null);
  assert.equal(map.stretches['adduction de la hanche debout'].media, null);
  assert.equal(map.stretches['talon vers la fesse (debout)'].media, '/media/stretch-quad-debout.jpg');
  assert.equal(map.warmup['activation fessiers'].media, '/media/8eecb0152081ff26.gif');
  assert.equal(map.warmup['mobilite hanches & chevilles'].media, null);
  assert.equal(map.poolGuides['Ciseaux au bord'].media, '/media/64f9a3c89ee9369b.jpg');
  assert.equal(map.poolGuides['Talons-fesses'].media, '/media/c99b47eef506fe79.jpg');
  for (const group of [map.exercises, map.land, map.stretches, map.warmup, map.poolGuides])
    for (const e of Object.values(group)) if (e.media && packaged.size) assert.ok(exists(e.media), e.media);
});

test('JarvisMedia resolves by context: same name, land vs water', () => {
  const yg = { 'Étirements au bord': '/media/pool-etirements-bord.jpg', "Nage statique (à l'élastique)": '/media/pool-nage-statique.jpg', 'Nage douce': '/media/pool-nage-douce.jpg', 'Marche aquatique': '/media/pool-marche-aquatique.jpg', 'Fractionné — nager': '/media/pool-fractionne.jpg', 'Sprint — nager à fond': '/media/pool-sprint.jpg', 'Récup complète — souffler': '/media/pool-recup-complete.jpg', 'Récup entre tabatas': '/media/pool-recup-tabata.jpg', 'Retour au calme': '/media/pool-retour-calme.jpg', 'Déplacements latéraux (4 m)': '/media/pool-deplacements-lateraux.jpg' };
  const guides = legacy.emilie.POOL_GUIDES.map((g) => {
    const o = mapping.poolGuides[g.t];
    return { ...g, img: o ? o.media : g.img || yg[g.t] || null, mediaLevel: o ? o.level : 'exact', mediaNote: o ? o.note : null };
  });
  const context = { Ge: ge, bl: guides, document: undefined };
  vm.createContext(context);
  vm.runInContext(helper() + ';this.JarvisMedia=JarvisMedia;', context);
  const J = context.JarvisMedia;
  assert.equal(J.movement('Gainage planche · round 1/8', 'hiit').path, '/media/1317e405efd6ef2b.gif');
  assert.equal(J.movement('Gainage vertical · round 1/8', 'aqua').path, '/media/3d29edbd3afb4da6.jpg');
  assert.equal(J.movement('Battements de jambes · round 2/8', 'hiit').missing, true);
  assert.equal(J.movement('Battements de jambes · round 2/8', 'aqua').path, '/media/fd7c5fb1226873f6.gif');
  assert.equal(J.movement('Montées de genoux · round 3/8', 'hiit').missing, true);
  assert.equal(J.movement('Montées de genoux — EFFORT', 'swim').path, '/media/fe34482aa6faf932.gif');
  assert.equal(J.movement('Marche sur place · round 1/8', 'hiit').missing, true);
  assert.equal(J.movement('Ciseaux au bord — EFFORT', 'aqua').path, '/media/64f9a3c89ee9369b.jpg');
  assert.equal(J.movement('Talons-fesses — EFFORT', 'aqua').path, '/media/c99b47eef506fe79.jpg');
  assert.equal(J.movement('Mobilité épaules aquatique', 'swim').path, '/media/c9c8fd84181374ab.jpg');
  assert.equal(J.movement('Récupération', 'hiit').rest, true);
  assert.equal(J.movement('Oiseau-chien · round 4/8', 'hiit').exact, true);
  assert.equal(J.movement('Pigeon assis', 'recovery').path, '/media/stretch-piriforme.jpg');
  assert.equal(J.movement('Mollet en escalier', 'warmup').missing, true);
  assert.equal(J.movement('Activation fessiers', 'warmup').path, '/media/8eecb0152081ff26.gif');
  assert.equal(J.movement('Nom inconnu', 'hiit'), null);
  assert.equal(J.movement('Nom inconnu — EFFORT', 'aqua').missing, true); // never a land GIF in the water
  assert.equal(J.movement('Récupération', 'aqua').rest, true);
  assert.equal(J.movement('Retour au calme', 'aqua').path, '/media/pool-retour-calme.jpg');
  assert.equal(J.movement('Marche aquatique douce', 'aqua').path, '/media/pool-marche-aquatique.jpg');
  assert.equal(J.stepImage({ name: 'Activation fessiers', img: '/media/warmup-mobilite.jpg' }, 'warmup'), '/media/8eecb0152081ff26.gif');
  assert.equal(J.stepImage({ name: 'Mollet en escalier', img: '/media/stretch-mollet-marche.jpg' }, 'warmup'), null);
  assert.equal(J.stepImage({ name: 'Approche 1 · 40 kg', img: '/media/530326beb7c7a652.gif' }, 'warmup'), '/media/530326beb7c7a652.gif');
});

test('integration is pinned to the released 1.4.0 bundle and keeps every other fix', { skip: !fs.existsSync(webRoot) && 'extract the 1.4.0 web root first' }, () => {
  const source = original();
  assert.equal(sha256(source), baseline.bundleSha256);
  const out = integrate(source);
  assert.throws(() => integrate(out), /exact released 1.4.0/);
  assert.equal(out.includes('level:"famille"'), false);
  assert.equal(out.includes('gg={"french press barre ez"'), false);
  assert.equal(out.includes('const Z4={'), false);
  assert.equal(out.split('JarvisMediaMap').length > 3, true);
  for (const keep of ['let transitioned=false', 'if(transitioned)return', 'window.addEventListener("focus",u)', 's.jsx($3,{children:s.jsx(Mx,{children:s.jsx(I3,{})})})', 'JarvisHome.Layout', 'JarvisSpokesperson.Observer', 'JarvisVoice.Observer', 'JarvisNotifications.Observer'])
    assert.ok(out.includes(keep), keep);
  assert.equal(out.split('V 1.4.0').length, 2);
  assert.ok(out.includes('className:"movement-missing"'));
  assert.ok(out.includes('context:p.meta.type'));
  assert.ok(out.includes('JarvisMedia.isAqua(p.meta.type)?bl.find'));
  assert.ok(out.includes('j=!miss&&["breathe","respiration"]'));
});
