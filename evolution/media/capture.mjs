// Audit the COMPLETE signed APK, never the obsolete React reconstruction.
// The inspection hook exists only in the temporary server response, not in an APK.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
import { parse } from '../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
const root = fileURLToPath(new URL('../..', import.meta.url));
const baseline = JSON.parse(fs.readFileSync(new URL('./baseline.json', import.meta.url)));
const sha = b => createHash('sha256').update(b).digest('hex');
const apk = path.join(root, baseline.apk);
if (sha(fs.readFileSync(apk)) !== baseline.apkSha256) throw Error('Unknown APK baseline');
const directory = path.resolve(root, '.cache/media-audit/reproducible-web');
execFileSync('python3', ['-c', `
from zipfile import ZipFile
from pathlib import Path
import sys
root=Path(sys.argv[2]).resolve()
with ZipFile(sys.argv[1]) as z:
 for name in z.namelist():
  if name.startswith('assets/public/') and not name.endswith('/'):
   p=(root/name[len('assets/public/'):]).resolve()
   if not p.is_relative_to(root): raise ValueError('unsafe zip path')
   p.parent.mkdir(parents=True,exist_ok=True)
   p.write_bytes(z.read(name))
`, apk, directory]);
const bundlePath = baseline.bundle.replace('assets/public/', '');
const original = fs.readFileSync(path.join(directory, bundlePath), 'utf8');
if (sha(original) !== baseline.bundleSha256) throw Error('Unknown bundle baseline');
const tree = parse(original, { ecmaVersion: 'latest', sourceType: 'module' });
const functions = {};
for (const name of ['gi','Kh','s5','Bg','bg','v5','w5','g3','W4']) {
  const node = tree.body.find(n => n.type === 'FunctionDeclaration' && n.id.name === name);
  if (!node) throw Error(`Missing integration point ${name}`);
  functions[name] = sha(original.slice(node.start, node.end));
}
const hook = `window.__JARVIS_MEDIA_INSPECTION__ = {
 exercises:ft.map(e=>({id:e.id,name:e.name,muscle:e.muscle,pattern:e.pattern,equipment:e.equipment,sources:e.sources,gif:e.gif,resolved:s5(e)})),
 stretches:ao, poolGuides:bl, cardioGuides:If, warmupImages:Jn,
 poolProtocols:mh.map(p=>({id:p.id,name:p.nom,levels:p.niveaux.map(l=>({name:l.n,steps:l.steps.map(([name,seconds])=>({name,seconds,resolved:s5(null,name)}))}))})),
 tabataModes:lt.elite.TABATA_MODES,
 tabataLand:[...new Set(lt.elite.TABATA_MODES.flatMap(m=>m.exos))].map(name=>({name,resolved:s5(null,name+' · round 1/8')})),
 tabataAqua:['Aqua-jogging','Montées de genoux','Ciseaux au bord','Déplacements latéraux','Gainage vertical','Battements de jambes'].map(name=>({name,resolved:s5(null,name+' · round 1/8')}))
};`;
const anchor = 'O8.createRoot(document.getElementById("root"))';
if (original.split(anchor).length !== 2) throw Error('Ambiguous bootstrap');
const instrumented = original.replace(anchor, hook + anchor);
const types = {'.js':'text/javascript','.css':'text/css','.html':'text/html','.gif':'image/gif','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  const request = decodeURIComponent(new URL(req.url, 'http://inspection.invalid').pathname);
  const relative = request === '/' ? 'index.html' : request.slice(1);
  const file = path.resolve(directory, relative);
  if (!file.startsWith(directory + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.end(relative === bundlePath ? instrumented : fs.readFileSync(file));
});
let browser;
try {
  await new Promise(resolve => server.listen(0, '0.0.0.0', resolve));
  browser = await chromium.launch({ executablePath: process.env.JARVIS_CHROMIUM || '/tmp/chromium', args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.__JARVIS_MEDIA_INSPECTION__);
  const inventory = await page.evaluate(() => window.__JARVIS_MEDIA_INSPECTION__);
  inventory.baseline = { apkSha256: baseline.apkSha256, bundleSha256: baseline.bundleSha256, functions };
  const output = path.resolve(process.argv[2] || path.join(root, '.cache/media-audit/inventory.json'));
  fs.mkdirSync(path.dirname(output), {recursive:true});
  fs.writeFileSync(output, JSON.stringify(inventory, null, 2) + '\n');
  console.log(JSON.stringify({output,exercises:inventory.exercises.length,stretches:inventory.stretches.length,poolGuides:inventory.poolGuides.length,tabataLand:inventory.tabataLand.length,tabataAqua:inventory.tabataAqua.length}));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
