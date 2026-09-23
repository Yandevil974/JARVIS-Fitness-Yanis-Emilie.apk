import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { patchBundle, patches, config, sha256 } from '../patch-web.mjs';

const root = process.env.COMPLETE_BASE_WEB || '.cache/apk-analysis/new/assets/public';
const source = fs.readFileSync(path.join(root, config.bundle.path.replace('assets/public/', '')), 'utf8');
const patched = patchBundle(source);

test('The exact uploaded APK bundle is required; no guessed or partial patch', () => {
  assert.equal(sha256(source), config.bundle.sha256);
  assert.throws(() => patchBundle(source + '\n'), /Unexpected APK/);
  assert.throws(() => patchBundle(patched), /Unexpected APK/);
});

test('Every patch can be reversed to recover the COMPLETE original byte for byte', () => {
  let reverted = patched;
  for (const p of [...patches].reverse()) {
    assert.equal(reverted.split(p.after).length - 1, 1, p.name);
    reverted = reverted.replace(p.after, p.before);
  }
  assert.equal(reverted, source);
});

test('Only the clock, observer, timer modal, version label and root boundary change', () => {
  const options = { ecmaVersion: 'latest', sourceType: 'module' };
  const before = parse(source, options).body;
  const after = parse(patched, options).body;
  assert.equal(after.length, before.length);
  const changed = [];
  for (let i = 0; i < before.length; i++) {
    if (source.slice(before[i].start, before[i].end) !== patched.slice(after[i].start, after[i].end))
      changed.push(before[i].id?.name || before[i].type);
  }
  assert.deepEqual(changed, ['El', 'b5', 'v5', '_3', 'ExpressionStatement']);
  console.log(`${before.length - changed.length}/${before.length} top-level declarations unchanged; no feature module replaced.`);
});

test('All user-facing strings and feature labels are preserved except the version', () => {
  function strings(text) {
    const result = new Set();
    function visit(node) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'Literal' && typeof node.value === 'string') result.add(node.value);
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === 'object') visit(value);
      }
    }
    visit(parse(text, { ecmaVersion: 'latest', sourceType: 'module' }));
    return result;
  }
  const a = strings(source), b = strings(patched);
  assert.deepEqual([...a].filter(s => !b.has(s)), ['V 1.0.4']);
  for (const feature of ['Bilan 1RM', 'Guidage vocal pendant la séance', 'Passer en clair', 'Passer en sombre', 'Connecter un capteur', 'RIR · reps en réserve', 'Effacer la conversation', 'Lancer les étirements guidés'])
    assert.ok(b.has(feature), feature);
});

test('Every CSS, image, font, web plugin and entry HTML is identical to the supplied APK', () => {
  const target = process.env.COMPLETE_PATCHED_WEB || '.cache/complete-web';
  function files(dir, prefix = '') {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(f =>
      f.isDirectory() ? files(path.join(dir, f.name), prefix + f.name + '/') : [prefix + f.name]);
  }
  const all = files(root).sort();
  assert.deepEqual(files(target).sort(), all);
  let preserved = 0;
  for (const file of all) {
    if (file === config.bundle.path.replace('assets/public/', '')) continue;
    assert.equal(sha256(fs.readFileSync(path.join(root, file))), sha256(fs.readFileSync(path.join(target, file))), file);
    preserved++;
  }
  console.log(`${preserved} unchanged web files, one minimally patched bundle, zero missing files.`);
});
