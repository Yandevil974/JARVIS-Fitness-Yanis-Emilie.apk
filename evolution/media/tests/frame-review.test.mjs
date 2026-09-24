import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {coverage} from '../coverage.mjs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../'+n,import.meta.url)));
const r=read('review/long-animations.json'), a=read('review/assets-1.4.0.json'), i=read('review/inventory-1.4.0.json');
test('all long GIFs have explicit ordered all-frame review records pinned to the shipped media',()=>{
 const long=a.assets.filter(a=>a.frames>2);
 assert.equal(r.releaseReady,false);assert.equal(r.clipCount,46);assert.equal(r.reviewedFrameCount,588);
 assert.equal(r.baselineApkSha256,a.baselineSha256);
 assert.deepEqual(r.clips.map(c=>c.path),long.map(a=>a.path));
 assert.equal(r.clips.reduce((n,c)=>n+c.reviewedFrameIndices.length,0),588);
 for(const [n,c] of r.clips.entries()){
  const source=long[n];assert.equal(c.assetSha256,source.sha256);assert.equal(c.frameCount,source.frames);
  assert.deepEqual(c.reviewedFrameIndices,Array.from({length:source.frames},(_,i)=>i));
  assert.deepEqual(c.frames.map(f=>f.index),c.reviewedFrameIndices);
  assert.deepEqual(c.frames.map(f=>f.durationMs),source.durationsMs);
  assert.ok(c.frames.every(f=>/^[a-f0-9]{64}$/.test(f.rgbaSha256)));
  assert.ok(c.observedMovement.length>20);assert.ok(c.decisionNotes.length>20);
  assert.equal(c.playbackInAllAppSurfaces,'pending');assert.equal(c.clinicalTechniqueCertification,false);
 }
});
test('per-association decisions cover every long-GIF exercise and guide, with no invented IDs or silent approval',()=>{
 let count=0;
 for(const c of r.clips){
  assert.deepEqual(c.associations.filter(x=>x.scope==='musculation').map(x=>x.id),i.exercises.filter(e=>e.resolved?.path===c.path).map(e=>e.id));
  assert.deepEqual(c.associations.filter(x=>x.scope==='piscine').map(x=>x.name),i.poolGuides.filter(g=>g.img===c.path).map(g=>g.t));
  for(const x of c.associations)assert.ok(['mismatch','variant-review-required','basic-movement-corresponds'].includes(x.status));
  count+=c.associations.length;
 }
 assert.equal(count,102);
});
test('209-entry coverage cannot drop unresolved exercises or mark a reviewed basic movement as finally accepted',()=>{
 const stored=read('review/exercise-coverage.json');assert.deepEqual(stored,coverage());
 assert.equal(stored.count,209);assert.equal(new Set(stored.exercises.map(e=>e.id)).size,209);
 assert.deepEqual(stored.exercises.map(e=>e.id),i.exercises.map(e=>e.id));
 assert.ok(stored.exercises.every(e=>e.finalAccepted===false));
 assert.deepEqual(stored.exercises.filter(e=>e.candidateStatus!=='no-targeted-correction').map(e=>e.id).sort(),['french-press-barre-ez','pont-fessier-au-sol-activation']);
});
test('reuse requires a fully reviewed matching source, not the superficially related step-up or band candidates',()=>{
 const overrides=read('candidate/association-overrides.json').overrides;assert.equal(overrides.length,2);
 const [correction]=overrides,c=r.clips.find(c=>c.path===correction.path);
 assert.equal(c.number,25);assert.equal(c.enlargedReview,true);assert.equal(c.assetSha256,correction.assetSha256);
 assert.equal(c.frames.length,12);assert.notEqual(c.path,correction.baselinePath);
 assert.ok(r.clips.find(c=>c.number===21).decisionNotes.includes('non intégrée'));
 assert.ok(r.clips.find(c=>c.number===33).decisionNotes.includes('Non intégrée'));
});

test('focused short review traces all 26 frames and does not call unassigned media unused',()=>{
 const short=read('review/short-focus.json');assert.equal(short.releaseReady,false);
 assert.equal(short.clipCount,13);assert.equal(short.reviewedFrameCount,26);
 assert.equal(short.baselineApkSha256,a.baselineSha256);
 assert.equal(new Set(short.clips.map(c=>c.path)).size,13);
 for(const c of short.clips){
  const asset=a.assets.find(e=>e.path===c.path);
  assert.equal(c.assetSha256,asset.sha256);assert.equal(c.frameCount,2);
  assert.deepEqual(c.reviewedFrameIndices,[0,1]);assert.deepEqual(c.frames.map(f=>f.index),[0,1]);
  assert.deepEqual(c.frames.map(f=>f.durationMs),asset.durationsMs);
  assert.ok(c.frames.every(f=>/^[a-f0-9]{64}$/.test(f.rgbaSha256)));
  assert.deepEqual(c.baselineExerciseIds,i.exercises.filter(e=>e.resolved?.path===c.path).map(e=>e.id));
  assert.deepEqual(c.baselinePoolGuides,i.poolGuides.filter(e=>e.img===c.path).map(e=>e.t));
  assert.equal(c.finalAccepted,false);assert.ok(c.decisionNotes.length>30);
 }
});
test('French press reuse is pinned to both reviewed poses, thumbnail and exact original prescription hint',async()=>{
 const {readBaseline}=await import('../candidate/build.mjs');const short=read('review/short-focus.json');
 assert.ok(readBaseline().includes(short.frenchPressEvidence.existingSourceHint));
 const correction=read('candidate/association-overrides.json').overrides.find(e=>e.id==='french-press-barre-ez');
 const clip=short.clips.find(e=>e.path===correction.path);
 assert.equal(clip.number,10);assert.equal(clip.assetSha256,correction.assetSha256);
 assert.equal(clip.frames.length,2);assert.notEqual(clip.path,correction.baselinePath);
 for(const entry of read('candidate/association-overrides.json').overrides){
  const thumb=short.reviewedThumbnails.find(t=>t.path===entry.thumbnailPath);
  assert.equal(thumb.sha256,entry.thumbnailSha256);
  assert.equal(entry.thumbnailPath,entry.path.replace('/media/','/thumbs/').replace('.gif','.webp'));
 }
});
