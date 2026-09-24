// Variantes fideles : dix exercices du catalogue affichaient le dessin d'une
// AUTRE variante (outil ou position differents) et l'application l'annoncait
// elle-meme « Variante tres proche ». Chaque animation produite est resolue
// EXACTEMENT pour son identifiant d'exercice, dans la famille des GIF livres
// (480 x 262, 2 images, 500 ms). Aucun nom, aucune consigne, aucune donnee
// enregistree ne change ; les medias livres restent tous presents.
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url)));
const map = read('../candidate/alias-visuals-map.json');
const inventory = read('../review/inventory-1.4.0.json');
const assets = read('../review/assets-1.4.0.json');
const gaps = read('../review/GAPS-SANS-DESSIN.json');
const baseline = read('../candidate/association-overrides.json');
const bundle = fs.readFileSync(new URL('../../../.cache/media-pool-candidate/assets/index-CBCies4k.js', import.meta.url), 'utf8');
const media = new URL('../../../.cache/media-pool-candidate/media/', import.meta.url).pathname;
const start = bundle.indexOf('function JarvisReviewedMedia(');
const end = bundle.indexOf('const yt=', start);
assert.ok(start > 0 && end > start, 'bloc des medias revus absent du paquet livre');
const context = vm.createContext({eo: new Map()});
vm.runInContext(bundle.slice(start, end) + ';globalThis.reviewed=JarvisReviewedMedia;globalThis.Kh=Kh;', context);
const resolve = id => vm.runInContext(`Kh({id:${JSON.stringify(id)}})`, context);
const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

// Parcours reel des blocs GIF : un simple balayage d'octets compterait les 0x2C
// du flux compresse. Renvoie le nombre d'images et la duree du premier delai.
function gifBlocks(bytes) {
  let i = 6;
  const globalTable = bytes[10] & 0x80;
  i += 7 + (globalTable ? 3 * (1 << ((bytes[10] & 7) + 1)) : 0);
  let frames = 0, delay = null;
  const skip = () => { while (bytes[i]) i += bytes[i] + 1; i++; };
  while (i < bytes.length) {
    const block = bytes[i];
    if (block === 0x3b) break;
    if (block === 0x21) {
      if (bytes[i + 1] === 0xf9 && delay === null) delay = bytes.readUInt16LE(i + 4);
      i += 2; skip();
    } else if (block === 0x2c) {
      frames++;
      const local = bytes[i + 9] & 0x80;
      i += 10 + (local ? 3 * (1 << ((bytes[i + 9] & 7) + 1)) : 0) + 1;
      skip();
    } else break;
  }
  return {frames, delay};
}

// Les dix identifiants mesures sans dessin fidele de leur variante : chaque
// attribut de la variante prescrite vaut 0 (ou aucun attribut n'est mesure).
const sansDessinFidele = gaps.alias.lignes
  .filter(ligne => String(ligne.conclusion).toLowerCase().startsWith('aucun dessin'))
  .map(ligne => ligne.id);

test('les dix ecarts d’alias sont nommes, et seule une variante produite en sort', () => {
  assert.equal(gaps.alias.sansDessinFideleDeLaVariante, 10, 'mesure de depart : dix variantes sans dessin fidele');
  assert.equal(sansDessinFidele.length, 10, 'les dix identifiants mesures doivent etre retrouves');
  assert.ok(map.variantes.length > 0, 'aucune variante produite');
  for (const entry of map.variantes) {
    assert.ok(sansDessinFidele.includes(entry.id), 'variante produite hors des ecarts mesures : ' + entry.id);
    assert.ok(entry.constat && entry.consigne, 'constat manquant pour ' + entry.id);
  }
  // Le reste a produire est exactement ce que la carte annonce, jamais moins.
  const reste = sansDessinFidele.filter(id => !map.variantes.some(entry => entry.id === id));
  assert.deepEqual(reste.sort(), [...map.reste].sort(), 'le reste a produire doit etre exactement celui annonce');
});

test('chaque variante produite est resolue exactement pour son identifiant, jamais par muscle', () => {
  const overrides = new Set(baseline.overrides.map(entry => entry.id));
  const ids = new Set();
  for (const entry of map.variantes) {
    assert.ok(!ids.has(entry.id), 'identifiant en double : ' + entry.id);
    assert.ok(!overrides.has(entry.id), 'identifiant deja revu : ' + entry.id);
    ids.add(entry.id);
    const exercise = inventory.exercises.find(e => e.id === entry.id);
    assert.ok(exercise, 'exercice absent de l’inventaire : ' + entry.id);
    assert.equal(exercise.name, entry.nom, 'nom different de l’inventaire : ' + entry.id);
    const result = resolve(entry.id);
    assert.ok(result, 'variante non resolue : ' + entry.id);
    assert.equal(result.path, entry.path, 'animation servie differente pour ' + entry.id);
    assert.equal(result.name, entry.nom, 'nom servi different pour ' + entry.id);
    assert.equal(result.level, 'exact', 'une variante doit etre servie comme exacte : ' + entry.id);
    // Un exercice NOM reste sur sa resolution livree : aucune substitution.
    assert.equal(resolve('glute-bridge-pieds-sur-banc'), null, 'aucune substitution par muscle');
  }
});

test('les animations livrees sont de vraies animations, au format de la famille, et AJOUTEES', () => {
  const livres = new Set(assets.assets.map(asset => asset.path));
  for (const [file, digest] of Object.entries(map.files)) {
    assert.ok(!livres.has(file), 'une variante remplacerait un media livre : ' + file);
    const bytes = fs.readFileSync(media + file.replace('/media/', ''));
    assert.ok(bytes.subarray(0, 6).toString('latin1').startsWith('GIF8'), 'pas un GIF : ' + file);
    assert.equal(sha256(bytes), digest, 'empreinte differente : ' + file);
    assert.equal(bytes.readUInt16LE(6), 480, 'largeur inattendue : ' + file);
    assert.equal(bytes.readUInt16LE(8), 262, 'hauteur inattendue : ' + file);
    // Deux images, 500 ms : la famille des GIF aquatiques deja livres.
    const {frames, delay} = gifBlocks(bytes);
    assert.equal(frames, 2, 'nombre d’images inattendu : ' + file);
    assert.equal(delay, 50, 'duree d’image inattendue : ' + file);
  }
  assert.deepEqual(Object.keys(map.files).sort(),
    map.variantes.map(entry => entry.path).sort(), 'carte incomplete : fichiers et variantes doivent coincider');
});
