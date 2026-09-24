// Characterization/provenance tests of the audit, NOT tests of a corrected app.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const read = name => JSON.parse(fs.readFileSync(new URL('../'+name, import.meta.url)));
const inventory=read('review/inventory-1.4.0.json'), assets=read('review/assets-1.4.0.json');
const findings=read('review/findings.json'), baseline=read('baseline.json');
const assetMap=new Map(assets.assets.map(a=>[a.path,a]));
test('audit is pinned to the actually delivered APK, and is not a new release',()=>{
 const apk=fs.readFileSync(new URL('../../../'+baseline.apk,import.meta.url));
 assert.equal(createHash('sha256').update(apk).digest('hex'),baseline.apkSha256);
 assert.equal(inventory.baseline.apkSha256,baseline.apkSha256);
 assert.equal(assets.baselineSha256,baseline.apkSha256);
 assert.equal(findings.releaseReady,false);
 assert.equal(findings.status,'open');
});
test('complete runtime catalog is captured without private profile state',()=>{
 assert.equal(inventory.exercises.length,209);
 assert.equal(new Set(inventory.exercises.map(e=>e.id)).size,209);
 assert.equal(inventory.stretches.length,29);
 assert.equal(inventory.poolGuides.length,19);
 assert.equal(inventory.cardioGuides.length,5);
 assert.equal(inventory.poolProtocols.length,6);
 assert.equal(inventory.poolProtocols.flatMap(p=>p.levels).length,18);
 assert.equal(inventory.poolProtocols.flatMap(p=>p.levels.flatMap(l=>l.steps)).length,420);
 assert.equal(inventory.tabataModes.length,6);
 assert.equal(inventory.tabataLand.length,38);
 assert.equal(inventory.tabataAqua.length,6);
 assert.equal(Object.hasOwn(inventory,'legacy'),false);
 assert.equal(Object.hasOwn(inventory,'profiles'),false);
 assert.deepEqual(new Set(inventory.exercises.flatMap(e=>e.sources)),new Set(['elite','emilie','jarvis']));
});
test('every resolved image points to an asset that was decoded, not merely an existing filename',()=>{
 for (const e of inventory.exercises) if(e.resolved) assert.ok(assetMap.has(e.resolved.path),e.id);
 for (const key of ['stretches','poolGuides','cardioGuides']) for (const e of inventory[key]) if(e.img) assert.ok(assetMap.has(e.img),e.name||e.t);
 for (const p of Object.values(inventory.warmupImages)) assert.ok(assetMap.has(p));
 assert.equal(assets.inspectedAssetCount,137);
 assert.equal(assets.assets.filter(a=>a.frames>1).length,94);
 assert.equal(assets.assets.reduce((n,a)=>n+a.frames,0),727);
 for (const a of assets.assets) assert.equal(a.durationsMs.length,a.frames,a.path);
});
test('media preservation is recorded separately from semantic correctness',()=>{
 assert.equal(assets.packagedImageCount,262);
 assert.equal(assets.byteIdenticalToOriginal,262);
 assert.equal(assets.comparisonOriginalSha256,baseline.originalApkSha256);
 const counts={};for(const e of inventory.exercises)counts[e.resolved?.level||'none']=(counts[e.resolved?.level||'none']||0)+1;
 assert.deepEqual(counts,{variante:104,exact:95,famille:10});
 // "exact" was not a validation: this known mismatch must not be forgotten.
 const bad=inventory.exercises.find(e=>e.id==='hip-thrust-unilateral');
 assert.equal(bad.resolved.exact,true);
 assert.equal(bad.resolved.path,'/media/cf312b839f6da027.gif');
});
test('Tabata land/water collision and missing demonstrations are reproducible',()=>{
 const matched=inventory.tabataLand.filter(e=>e.resolved);
 assert.equal(inventory.tabataLand.filter(e=>!e.resolved).length,34);
 assert.deepEqual(matched.map(e=>e.name),['Gainage planche','Battements de jambes','Montées de genoux','Marche sur place']);
 assert.equal(matched[0].resolved.name,'Gainage au bord (vertical)');
 assert.equal(matched[3].resolved.name,'Marche aquatique');
});
test('findings reference real catalog entries and cover every requested category',()=>{
 const ids=new Set([...inventory.exercises,...inventory.stretches].map(e=>e.id));
 const guides=new Set(inventory.poolGuides.map(g=>g.t));
 // 'affichage' covers presentation defects observed with the same evidence rule
 // (e.g. raw seconds printed in the combined-session step rows).
 // 'style' porte la decision de famille visuelle, 'transverse' les constats qui
 // couvrent plusieurs categories (mesure des lacunes sans dessin fidele).
 assert.deepEqual(new Set(findings.findings.map(f=>f.scope)),new Set(['musculation','echauffement','piscine','tabata','etirements','affichage','style','transverse']));
 assert.equal(new Set(findings.findings.map(f=>f.id)).size,findings.findings.length);
 for (const f of findings.findings) {
  for (const id of f.exercises||[])assert.ok(ids.has(id),`${f.id}: ${id}`);
  for (const name of f.guides||[])assert.ok(guides.has(name),`${f.id}: ${name}`);
  if(f.path) assert.ok(assetMap.has(f.path),f.id);
  assert.equal(f.status,'open');
 }
});
