// Reproduce the delivered resolver's defect, NOT acceptance tests of a fixed APK.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const read = path => JSON.parse(fs.readFileSync(root + path));
const baseline = read('evolution/media/baseline.json');
const inventory = read('evolution/media/review/inventory-1.4.0.json');
assert.equal(createHash('sha256').update(fs.readFileSync(root + baseline.apk)).digest('hex'), baseline.apkSha256);
const bundle = execFileSync('python3', ['-c',
 'import sys,zipfile; sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))',
 root + baseline.apk, baseline.bundle], {maxBuffer: 10 * 1024 * 1024}).toString();
assert.equal(createHash('sha256').update(bundle).digest('hex'), baseline.bundleSha256);
// Exact bounded snippets, not a rewritten approximation of the resolver.
const geStart = bundle.indexOf('const Ge=');
const geEnd = bundle.indexOf(',uh=', geStart);
const bgStart = bundle.indexOf('function bg(');
const bgEnd = bundle.indexOf('const kl=', bgStart);
assert.ok(geStart >= 0 && geEnd > geStart && bgStart >= 0 && bgEnd > bgStart);
const context = vm.createContext({bl: inventory.poolGuides, If: inventory.cardioGuides});
vm.runInContext(bundle.slice(geStart, geEnd) + ';' + bundle.slice(bgStart, bgEnd), context, {timeout: 1000});
const resolve = (name, segment) => {
 context.stepName = name; context.segment = segment;
 return vm.runInContext('bg(stepName, segment)', context, {timeout: 1000});
};
test('known defect: generic active recovery in pool falls through to elliptical', () => {
 for (const name of ['Récupération active', 'Récup active']) {
  const guide = resolve(name, 'pool');
  assert.equal(guide.img, '/media/cardio-recup-active.jpg');
  assert.equal(guide.t, 'Elliptique — récupération active');
 }
});
test('explicit walking recoveries in all three Swim Interval levels resolve to pool in this resolver', () => {
 const protocol = inventory.poolProtocols.find(p => p.id === 'interval');
 assert.ok(protocol);
 let count = 0;
 for (const level of protocol.levels) for (const step of level.steps) {
  if (!step.name.startsWith('Récup')) continue;
  assert.equal(resolve(step.name, 'pool').img, '/media/pool-marche-aquatique.jpg');
  count++;
 }
 assert.equal(count, 24);
 // This does NOT reproduce the user's screen or rule out persisted wrong step.img.
});
test('land cardio recovery remains distinct from aquatic recovery', () => {
 assert.equal(resolve('Récupération active', 'cardio').img, '/media/cardio-recup-active.jpg');
 assert.equal(resolve('Récup complète — souffler au bord', 'pool').img, '/media/pool-recup-complete.jpg');
});
