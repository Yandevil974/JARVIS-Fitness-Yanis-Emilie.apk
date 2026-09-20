import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { patchBundle, patches, config, sha256 } from '../../../complete-hotfix/patch-web.mjs';
import { integrate } from '../build.mjs';
const base = path.resolve(process.env.COMPLETE_BASE_WEB || '.cache/reference/assets/public');
const web = path.resolve(process.env.REMINDERS_WEB || '.cache/reminders-web');
const bundle = config.bundle.path.replace('assets/public/', '');
const source = fs.readFileSync(path.join(base, bundle), 'utf8');
const updated = fs.readFileSync(path.join(web, bundle), 'utf8');
const list = dir => fs.readdirSync(dir, { recursive: true }).filter(f => fs.statSync(path.join(dir, f)).isFile()).sort();

test('complete web inventory conserved; exactly one web file changes', () => {
  const files = list(base);
  assert.deepEqual(list(web), files);
  const changed = files.filter(f => sha256(fs.readFileSync(path.join(base, f))) !== sha256(fs.readFileSync(path.join(web, f))));
  assert.deepEqual(changed, [bundle]);
  console.log(`${files.length - 1} original web files unchanged; one extended bundle.`);
});
test('build is deterministic, pinned and rejects a wrong or already extended bundle', async () => {
  assert.equal(await integrate(source), updated);
  await assert.rejects(() => integrate(updated), /Unexpected APK bundle/);
  await assert.rejects(() => integrate(source + ' '), /Unexpected APK bundle/);
});
test('all seven timer/error-boundary/version fixes remain intact', () => {
  for (const patch of patches) assert.ok(updated.includes(patch.after), patch.name);
});
test('only five audited host functions change relative to complete 1.0.6; all others are byte-identical', () => {
  const before = patchBundle(source);
  const parsedBefore = parse(before, { ecmaVersion: 'latest', sourceType: 'module' });
  const parsedAfter = parse(updated, { ecmaVersion: 'latest', sourceType: 'module' });
  const signature = n => n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration' ? `${n.type}:${n.id.name}` : n.type === 'VariableDeclaration' ? `${n.type}:${n.declarations.map(d => d.id.name).join(',')}` : null;
  const afterNodes = new Map(parsedAfter.body.map(n => [signature(n), updated.slice(n.start, n.end)]).filter(([key]) => key));
  const changed = [];
  let kept = 0;
  for (const node of parsedBefore.body) {
    const key = signature(node);
    if (!key) continue;
    assert.ok(afterNodes.has(key), `Removed declaration: ${key}`);
    if (afterNodes.get(key) !== before.slice(node.start, node.end)) changed.push(key);
    else kept++;
  }
  assert.deepEqual(changed.sort(), ['G3', 'I3', 'N5', 'Q5', 't2'].map(n => `FunctionDeclaration:${n}`).sort());
  console.log(`${kept} complete 1.0.6 declarations unchanged; five integration points.`);
});
test('original session reminders and weekly report observer remain; old force emitter is replaced', () => {
  const ast = parse(updated, { ecmaVersion: 'latest', sourceType: 'module' });
  const n = ast.body.find(n => n.id?.name === 'G3');
  const body = updated.slice(n.start, n.end);
  assert.ok(body.includes('reminder-${h.id}'));
  assert.ok(body.includes('auto-${c}'));
  assert.ok(body.includes('f.reports.unshift'));
  assert.ok(!body.includes('force-reval-'));
  assert.ok(body.includes('setInterval(l,6e4)'));
  assert.ok(updated.includes('s.jsx(JarvisFollowUp.Observer,{})'));
  assert.ok(updated.includes('s.jsx(JarvisFollowUp.NotificationLink,{})'));
});
