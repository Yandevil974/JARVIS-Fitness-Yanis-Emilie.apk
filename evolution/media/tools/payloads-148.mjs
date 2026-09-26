#!/usr/bin/env node
// Extrait les 2 payloads `=JSON.parse(`...`)` du bundle ORIGINAL 1.4.8 -> .cache/payloads-148.json
// (le parse Python echoue sur les sequences \escape des template literals : on laisse node evaluer).
//
//   node evolution/media/tools/payloads-148.mjs
//
// Prerequis : le bundle original extrait de downloads/Yanis-Fitness-Evolution-1.4.8.apk
// (assets/public/assets/index-CBCies4k.js). Si .cache/web-148 n'existe pas encore, le
// script lit directement dans l'APK (zip) via python3 pour ne dependre de rien d'autre.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const APK = path.join(ROOT, 'downloads/Yanis-Fitness-Evolution-1.4.8.apk');
const BUNDLE_IN_APK = 'assets/public/assets/index-CBCies4k.js';
const OUT = path.join(ROOT, '.cache/payloads-148.json');

let js;
const local = path.join(ROOT, '.cache/web-148/assets/index-CBCies4k.js');
if (existsSync(local)) {
  js = readFileSync(local, 'utf8');
} else {
  js = execFileSync('python3', ['-c',
    `import zipfile,sys;sys.stdout.buffer.write(zipfile.ZipFile(${JSON.stringify(APK)}).read(${JSON.stringify(BUNDLE_IN_APK)}))`],
    { maxBuffer: 256 * 1024 * 1024 }).toString('utf8');
}
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
