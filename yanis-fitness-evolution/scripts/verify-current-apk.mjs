// Compare les médias de la branche au contenu réel de l'APK et contrôle le bundle actif.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXERCISES } from '../src/data/library.js';
import { videoFor } from '../src/data/exercise-videos.js';

const root = fileURLToPath(new URL('..', import.meta.url));
if (!process.argv[2]) throw new Error('Chemin APK requis');
const apk = resolve(process.argv[2]);
const unzip = (...args) => execFileSync('unzip', args, { maxBuffer: 32 * 1024 * 1024 });
const entries = new Set(unzip('-Z1', apk).toString().trim().split('\n'));
const sha = data => createHash('sha256').update(data).digest('hex');
function verify(url) {
  const entry = `assets/public${url}`;
  if (!entries.has(entry)) throw new Error(`Fichier absent : ${entry}`);
  if (sha(readFileSync(join(root, 'public', url.slice(1)))) !== sha(unzip('-p', apk, entry)))
    throw new Error(`Hash différent : ${entry}`);
}
function walk(dir) {
  return readdirSync(join(root, 'public', dir), { withFileTypes: true }).flatMap(item => {
    const name = `${dir}/${item.name}`;
    return item.isDirectory() ? walk(name) : [`/${name}`];
  });
}
const videos = walk('videos').filter(url => /\.mp4$/i.test(url) || /^\/videos\/posters\//.test(url));
for (const url of videos) verify(url);
const gifs = walk('media').filter(url => /\.gif$/i.test(url));
for (const url of gifs) verify(url);
const index = unzip('-p', apk, 'assets/public/index.html').toString();
const main = index.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
if (!main) throw new Error('Bundle principal absent de index.html');
const bundle = unzip('-p', apk, `assets/public/${main[1]}`).toString();
const required = [
  ['elevations-laterales-incline', '/videos/elevations-laterales-incline-au-poteau.mp4'],
  ['elevations-laterales-lean-away', '/videos/elevations-laterales-incline-au-poteau.mp4'],
  ['developpe-militaire-test-1rm', '/videos/developpe-militaire-debout.mp4'],
];
for (const [id, src] of required) {
  const ex = EXERCISES.find(exercise => exercise.id === id);
  const v = videoFor(ex);
  if (!ex || v?.src !== src || v.status !== 'coached' || !v.coaching?.spoken)
    throw new Error(`Association ou voix incorrecte : ${id}`);
  for (const marker of [id, src]) if (!bundle.includes(marker))
    throw new Error(`Donnée absente du bundle principal : ${id}`);
  for (const url of [v.src, v.poster, ex.gif]) verify(url);
}
for (const [id, gif] of [['developpe-halteres-assis-prise-neutre','/media/5d87213f7a64c97e.gif'], ['developpe-militaire-inertie-depuis-les-pins','/media/2e64bf2629810e52.gif']]) {
  const ex = EXERCISES.find(exercise => exercise.id === id);
  if (!ex || ex.gif !== gif || videoFor(ex)) throw new Error(`État non attendu : ${id}`);
  if (!bundle.includes(gif)) throw new Error(`GIF non référencé dans le bundle : ${id}`);
  verify(gif);
}
console.log(`${videos.length} MP4/posters et ${gifs.length} GIF vérifiés individuellement par SHA-256 ; épaules 18, 21, 23 et GIF 20, 22 contrôlés dans le bundle actif.`);
