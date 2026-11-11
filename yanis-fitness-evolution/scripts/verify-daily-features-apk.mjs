// Inspect the APK's active bundle rather than a stale generated asset.
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
if (!process.argv[2]) throw new Error('Chemin APK requis');
const apk = resolve(process.argv[2]);
const unzip = path => execFileSync('unzip', ['-p', apk, path], { maxBuffer: 32 * 1024 * 1024 });
const html = unzip('assets/public/index.html').toString();
const match = html.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
if (!match) throw new Error('Bundle actif introuvable');
const bundle = unzip('assets/public/' + match[1]).toString();
for (const marker of ['Programme du jour & rappels', 'Synthèse du jour', 'Régler les échéances', 'Menus proposés', 'menu alimentaire', 'photo-pair', 'Photo de départ', 'Curseur de comparaison avant-après', 'library-video-preview']) {
  if (!bundle.includes(marker)) throw new Error(`Fonction absente du bundle actif : ${marker}`);
}
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const name of ['08e001311b255115.webp', '6baa655d39de069e.webp']) {
  if (hash(unzip('assets/public/thumbs/' + name)) !== hash(readFileSync('public/thumbs/' + name))) throw new Error('Miniature absente ou différente : ' + name);
}
console.log('Synthèse du jour, menus, comparateur local et bibliothèque vidéo présents dans le bundle actif ; miniatures vérifiées.');
