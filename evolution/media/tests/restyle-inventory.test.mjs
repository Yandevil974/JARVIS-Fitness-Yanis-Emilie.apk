// Chantier « refaire tous les GIF animes » (24 septembre 2026).
//
// 1. L'inventaire du chantier est MESURE sur l'APK livre et reste a jour : on ne
//    peut pas annoncer « tous les GIF » sans la liste exacte de ce que
//    l'application affiche, ni le modele feminin d'Émilie sans savoir ce
//    qu'elle voit.
// 2. Defaut mesure dans la 1.4.8 : les vignettes de la bibliotheque des dix
//    variantes produites sont absentes de l'APK. Il est reproduit ici tant
//    qu'aucune version complete ne l'a corrige (regle : pas de correctif separe).
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../../../', import.meta.url).pathname;
const read = file => JSON.parse(fs.readFileSync(root + file, 'utf8'));
const APK = 'downloads/Yanis-Fitness-Evolution-1.4.8.apk';
const zipNames = execFileSync('python3', ['-c',
  'import sys,zipfile;print("\\n".join(zipfile.ZipFile(sys.argv[1]).namelist()))', root + APK]).toString().trim().split('\n');
const bundleEntry = zipNames.find(n => /^assets\/public\/assets\/index-.*\.js$/.test(n));
const bundle = execFileSync('python3', ['-c',
  'import sys,zipfile;sys.stdout.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]).decode("utf-8"))',
  root + APK, bundleEntry], {maxBuffer: 1 << 28}).toString();

test('l’inventaire de la refonte des GIF est mesure sur l’APK livre et a jour', () => {
  // Regenere a l'identique depuis l'APK et les cartes commitees.
  execFileSync(process.execPath, [root + 'evolution/media/tools/restyle-inventory.mjs', '--check'], {stdio: 'pipe'});
  const inventory = read('evolution/media/review/RESTYLE-INVENTAIRE.json');
  const gifs = zipNames.filter(n => n.startsWith('assets/public/media/') && n.endsWith('.gif'));
  assert.equal(inventory.animations.length, gifs.length, 'chaque GIF de l’APK est inventorie');
  assert.equal(inventory.resume.gifLivres, 144);
  assert.equal(inventory.resume.gifAffiches, 139);
  assert.equal(inventory.resume.lot2NonCable, 10);
  assert.equal(inventory.resume.aProduire, 3);
  assert.equal(inventory.resume.mouvementsARefaire, 152);
  for (const animation of inventory.animations) {
    assert.ok(animation.sujet, 'sujet inconnu : ' + animation.fichier);
    if (animation.affichee) assert.ok(animation.profils.length, 'aucun profil : ' + animation.fichier);
  }
  // Les GIF non affiches sont EXACTEMENT les cinq anciens dessins terrestres
  // des guides aquatiques, remplaces a l'affichage en 1.4.7 : aucun autre GIF
  // ne peut sortir du chantier en silence.
  const replaced = Object.values(read('evolution/media/candidate/pool-animations-map.json').replacedLandVisuals).sort();
  assert.deepEqual(inventory.orphelines.slice().sort(), replaced);
  // Le modele feminin : chaque mouvement vu par Émilie est identifie.
  assert.ok(inventory.resume.mouvementsVusParEmilie > 0 && inventory.resume.mouvementsVusParEmilie <= 152);
  assert.match(inventory.statut, /photo de reference/);
});

test('defaut 1.4.8 reproduit : vignettes de bibliotheque absentes pour les dix variantes produites', () => {
  // La carte de bibliotheque calcule sa vignette a partir du GIF servi.
  assert.ok(bundle.includes('src:bt(k.gif.replace("/media/","/thumbs/").replace(/\\.gif$/,".webp"))'),
    'la bibliotheque derive toujours la vignette du GIF');
  assert.ok(bundle.includes('b.slice(0,y).map(JarvisReviewedView).map(k=>'), 'la vue revue sert le GIF produit');
  // bt() ne redirige un chemin que si une table globalThis.__JARVIS_ASSETS__
  // existe : ni la page d'accueil ni les scripts de l'APK n'en definissent.
  const pages = zipNames.filter(n => n.startsWith('assets/public/') && /\.(html|js)$/.test(n) && n !== bundleEntry);
  for (const page of pages) {
    const text = execFileSync('python3', ['-c',
      'import sys,zipfile;sys.stdout.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]).decode("utf-8","replace"))',
      root + APK, page], {maxBuffer: 1 << 26}).toString();
    assert.ok(!text.includes('__JARVIS_ASSETS__'), 'table d’actifs inattendue dans ' + page);
  }
  // Le script ne l'ecrit que dans le modele du fichier HTML « portable »
  // exporte par l'utilisateur, jamais dans l'application installee.
  const assignments = [...bundle.matchAll(/__JARVIS_ASSETS__\s*=/g)].map(m => bundle.slice(m.index - 60, m.index));
  assert.ok(assignments.every(before => before.endsWith('globalThis.__JARVIS_PORTABLE__=true;globalThis.')),
    'aucune table d’actifs ne redirige les vignettes dans l’APK');
  const alias = read('evolution/media/candidate/alias-visuals-map.json').variantes;
  const missing = alias.filter(entry =>
    !zipNames.includes('assets/public' + entry.path.replace('/media/', '/thumbs/').replace(/\.gif$/, '.webp')));
  assert.deepEqual(missing.map(entry => entry.id), alias.map(entry => entry.id),
    'les dix vignettes manquent dans la 1.4.8 (defaut mesure)');
  // Les reassociations revues pointent vers des GIF de la 1.4.0 : leur vignette existe.
  for (const entry of read('evolution/media/candidate/association-overrides.json').overrides)
    assert.ok(zipNames.includes('assets/public' + entry.thumbnailPath), entry.id);
  // Le constat est trace et reste ouvert jusqu'a la version complete corrigee.
  const group = read('evolution/media/review/findings.json').findings
    .find(finding => finding.id === 'library-thumbnails-missing-for-produced-variants');
  assert.ok(group, 'constat absent');
  assert.equal(group.status, 'open');
  // Constat de LIVRAISON (comme apk-missing-referenced-media) : il ne touche pas
  // la revue des dessins 1.4.0, les variantes sont donc listees a part.
  assert.deepEqual(group.exercises, []);
  assert.deepEqual(group.variantesConcernees.slice().sort(), alias.map(entry => entry.id).sort());
});
