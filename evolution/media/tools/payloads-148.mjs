#!/usr/bin/env node
// Extrait les 2 payloads `=JSON.parse(`...`)` du bundle ORIGINAL 1.4.8 -> .cache/payloads-148.json
// (le parse Python echoue sur les sequences \escape des template literals : on laisse node evaluer).
//
//   node evolution/media/tools/payloads-148.mjs
//
// Lit toujours le bundle ORIGINAL dans l’APK, jamais le cache web déjà modifié.
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const APK = path.join(ROOT, 'downloads/Yanis-Fitness-Evolution-1.4.8.apk');
const BUNDLE_IN_APK = 'assets/public/assets/index-CBCies4k.js';
const OUT = path.join(ROOT, '.cache/payloads-148.json');

// Le cache web peut déjà contenir l'overlay d'un lot précédent.
// L'utiliser ici rendrait la chaîne dépendante de l'ordre des exécutions.
const js = execFileSync('python3', ['-c',
  `import zipfile,sys;sys.stdout.buffer.write(zipfile.ZipFile(${JSON.stringify(APK)}).read(${JSON.stringify(BUNDLE_IN_APK)}))`],
  { maxBuffer: 256 * 1024 * 1024 }).toString('utf8');
const re = /=JSON\.parse\((`[^`]*`)\)/g;
const payloads = [];
let m;
while ((m = re.exec(js)) !== null) {
  // eslint-disable-next-line no-new-func
  payloads.push(new Function('return JSON.parse(' + m[1] + ')')());
}
if (payloads.length !== 2) {
  console.error('attendu 2 payloads, trouve', payloads.length);
  process.exit(1);
}
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(payloads));
console.log('ecrit', OUT, payloads.length, 'payloads ;', payloads.map(p => Object.keys(p).length + ' cles').join(', '));
