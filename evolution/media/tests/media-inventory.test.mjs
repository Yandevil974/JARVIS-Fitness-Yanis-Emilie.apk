// Le bundle livre doit etre servi par l'APK qui le contient.
//
// Defaut mesure le 24 septembre 2026 : la 1.4.7 livree portait bien le nouveau
// script (cf99b6e4...) mais pas les cinq animations qu'il reference. Le
// telechargement passait les tests parce que ceux-ci servaient le dossier
// candidate, ou les fichiers existaient : l'APK, lui, ne les contenait pas.
// Ce test mesure l'APK final, pas le dossier de travail.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../../../', import.meta.url).pathname;
const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url)));
const map = read('../candidate/pool-animations-map.json');
const landMap = read('../candidate/tabata-land-animations-map.json');
const aliasMap = read('../candidate/alias-visuals-map.json');
const stretchMap = read('../candidate/stretch-visuals-map.json');

// Inventaire lu dans l'APK : hachages des fichiers web et medias references.
function inventory(apk) {
  const code = `import sys,zipfile,json,hashlib,re
z=zipfile.ZipFile(sys.argv[1])
names=[n for n in z.namelist() if not n.endswith('/')]
web=[n for n in names if n.startswith('assets/public/') and n.endswith(('.js','.html'))]
paths=set()
for n in web: paths|=set(m.decode() for m in re.findall(rb'"(/(?:media|thumbs|team)/[^"]+)"',z.read(n)))
media={n:hashlib.sha256(z.read(n)).hexdigest() for n in names if n.startswith('assets/public/media/')}
present=set('assets/public'+p for p in paths if 'assets/public'+p in names)
missing=sorted(p for p in paths if 'assets/public'+p not in names)
dex={n:hashlib.sha256(z.read(n)).hexdigest() for n in names if n.endswith('.dex')}
print(json.dumps({'count':len(names),'referenced':sorted(paths),'media':media,'missing':missing,'dex':dex}))`;
  return JSON.parse(execFileSync('python3', ['-c', code, root + apk], {maxBuffer: 1 << 28}).toString());
}

const released = inventory('downloads/Yanis-Fitness-Evolution-1.4.8.apk');
const pristine = inventory('downloads/Yanis-Fitness-Evolution-1.4.0.apk');
const previous = inventory('downloads/Yanis-Fitness-Evolution-1.4.7.apk');

test('l’APK livre contient tous les medias que son bundle reference', () => {
  assert.deepEqual(released.missing, [], 'medias references mais absents de l’APK livre');
  assert.ok(released.referenced.length > 150, 'un inventaire vide ne prouve rien');
});

test('le defaut de la 1.4.7 est reproduit, puis corrige', () => {
  // Mesure du defaut livre : les cinq animations sont referencees et absentes.
  const manquants = previous.missing;
  assert.deepEqual(manquants.slice().sort(), Object.keys(map.files).sort(),
    'la 1.4.7 devait referencer cinq animations sans les contenir');
  // Le correctif : chaque animation annoncee est presente, intacte et animee.
  // Les animations du Tabata au sol sont verifiees de la meme facon.
  for (const [path, digest] of Object.entries({...map.files, ...landMap.files, ...aliasMap.files})) {
    const entry = 'assets/public' + path;
    assert.ok(released.media[entry], 'animation absente de l’APK livre : ' + entry);
    assert.equal(released.media[entry], digest, 'animation alteree : ' + path);
    const nom = path.split('/').pop();
    const dossier = nom.startsWith('tabata-land-') ? 'tabata-land-animations/'
      : nom.startsWith('alias-') ? 'alias-animations/'
      : nom.startsWith('stretch-nouveau-') ? 'stretch-visuals/' : 'pool-animations/';
    const source = dossier === 'stretch-visuals/' ? nom.replace('stretch-nouveau-', 'stretch-')
      : nom.replace('tabata-land-', '');
    const bytes = fs.readFileSync(new URL('../candidate/' + dossier + source, import.meta.url));
    assert.ok(bytes.subarray(0, 6).toString('latin1').startsWith('GIF8'), 'ce n’est pas un GIF : ' + path);
  }
  // Les visuels d'etirement produits sont des images FIXES : presentes,
  // intactes, au meme cadre que les etirements deja livres (1376 x 768).
  for (const [path, digest] of Object.entries(stretchMap.files)) {
    const entry = 'assets/public' + path;
    assert.ok(released.media[entry], 'visuel d’etirement absent de l’APK livre : ' + entry);
    assert.equal(released.media[entry], digest, 'visuel d’etirement altere : ' + path);
    const bytes = fs.readFileSync(new URL('../candidate/stretch-visuals/' + path.split('/').pop().replace('stretch-nouveau-', 'stretch-'), import.meta.url));
    assert.equal(bytes.subarray(0, 2).toString('latin1'), '\xff\xd8', 'ce n’est pas une image fixe : ' + path);
  }
  // La correction ne touche que les medias ajoutes et le script : aucun DEX.
  assert.deepEqual(Object.keys(released.dex).sort(), Object.keys(pristine.dex).sort());
  for (const name of Object.keys(pristine.dex))
    assert.equal(released.dex[name], pristine.dex[name], 'implementation native modifiee : ' + name);
  assert.ok(released.count > pristine.count, 'des medias doivent s’ajouter a l’inventaire');
});

test('la 1.4.7 reste documentee comme defectueuse, jamais recommandee', () => {
  const status = fs.readFileSync(new URL('../../android/DELIVERY-STATUS.md', import.meta.url), 'utf8');
  assert.match(status, /1\.4\.7/, 'la 1.4.7 doit rester au dossier');
  assert.match(status, /NE PAS INSTALLER|ne pas installer/, 'la 1.4.7 doit etre explicitement ecartee');
  const findings = read('../review/findings.json').findings;
  const group = findings.find(f => f.id === 'apk-missing-referenced-media');
  assert.ok(group, 'le defaut doit etre un constat suivi');
  assert.equal(group.fix.apk, 'downloads/Yanis-Fitness-Evolution-1.4.8.apk');
});
