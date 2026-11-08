// Vérifie les ressources réellement chargées par l'APK, pas les anciens bundles conservés.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
if (!process.argv[2]) throw new Error('Chemin APK requis');
const apk = resolve(process.argv[2]);
const unzip = (entry) => execFileSync('unzip', ['-p', apk, entry], { maxBuffer: 32 * 1024 * 1024 });
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const html = unzip('assets/public/index.html').toString();
const script = html.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
const stylesheet = html.match(/<link[^>]+href="\.\/([^\"]+\.css)"/);
if (!script || !stylesheet) throw new Error('Bundle JS ou CSS actif introuvable');
const readActive = (path) => {
  const bytes = unzip(`assets/public/${path}`);
  if (hash(bytes) !== hash(readFileSync(join(root, 'release', path)))) throw new Error(`Bundle APK différent : ${path}`);
  return bytes.toString();
};
const js = readActive(script[1]);
const css = readActive(stylesheet[1]);
for (const marker of ['Adapter la séance avec JARVIS', 'jarvis-command-core', 'ADAPTER LA SÉANCE', 'exercise-stage']) {
  if (!js.includes(marker)) throw new Error(`Commande ou écran absent : ${marker}`);
}
if (!/\.training-command \.exercise-stage\{[^}]*grid-column:1\s*\/\s*-1/.test(css))
  throw new Error('Règle pleine largeur absente du CSS actif');
if (!/\.training-command \.session-topbar\{[^}]*grid-template-columns:minmax\(0,\s*1fr\)\s+auto/.test(css))
  throw new Error('Disposition de la barre supérieure absente du CSS actif');
console.log('Bundles JS/CSS actifs identiques au build, commande JARVIS et règles de disposition présentes.');
