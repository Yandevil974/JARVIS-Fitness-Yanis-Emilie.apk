import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {EXERCISES} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
test('ischios : clips intacts, réutilisations strictes, réserves et GIF conservés',()=>{
 const groups=[
  ['1794722270047','679da3598e57c0542c49402a80c6ec60b3afa5c499e072f308d72e257ee2ec34',['souleve-de-terre-roumain-unilateral-haltere']],
  ['1794722705821','930e7163bff3850c25c7860613a51bc9dee389c83b3e3f8dd15120651ca2e642',['back-extension-horizontal']],
  ['1794640022808','89b42e02888cd55e56bba1442097f5d8590ae10e0ed1d7d4e994bf64f295d91a',['good-morning-debout']],
  ['1794629525692','5729a304d9d795eed439ffec5da88fd65df3cf34119c22fe0c189a1833b809e9',['souleve-de-terre-roumain-halteres']],
  ['1794629898835','4821aba4b0ff92958710424bbce57ca1de2a17a1171fae931b870c93ca9261af',['leg-curl-allonge','leg-curl-machine','leg-curl-machine-ou-swiss-ball-leg-curl']],
  ['1794630191344','43f98d0878d05b3ce54770759341da34ec14cac7fb8b24e3c41ec16cba02c48c',['souleve-de-terre-roumain-barre','souleve-de-terre-roumain-barre-test-3-5-reps']],
 ];
 for(const [source,hash,ids] of groups){
  assert.equal(sha(`../${source}.mp4`),hash);
  for(const id of ids){
   const ex=EXERCISES.find(e=>e.id===id),video=videoFor(ex);assert.ok(ex);assert.equal(video.status,'coached');
   assert.ok(video.coaching.spoken);assert.ok(video.coaching.notice);
   for(const root of ['public','release']){assert.equal(sha(root+video.src),hash); assert.ok(readFileSync(root+video.poster).length);assert.ok(readFileSync(root+ex.gif).length);}
   assert.equal(sha('public'+ex.gif),sha('release'+ex.gif));
  }
 }
 assert.match(videoFor('souleve-de-terre-roumain-barre').coaching.notice,/tête est coupée/);
 assert.doesNotMatch(videoFor('souleve-de-terre-roumain-barre').coaching.notice + videoFor('souleve-de-terre-roumain-barre').coaching.spoken, /à refaire|doit être refaite/);
 const good = EXERCISES.find(e=>e.id==='good-morning-debout');
 assert.deepEqual([good.defaultSets,good.repScheme,good.tempo,good.rest,good.gif],[5,'8-10','3010',60,'/media/f0a30121a67e2645.gif']);
 assert.match(videoFor(good).coaching.spoken,/trapèzes/);
 assert.match(videoFor('leg-curl-machine-ou-swiss-ball-leg-curl').coaching.notice,/swiss-ball/);
 const unilateral=EXERCISES.find(e=>e.id==='souleve-de-terre-roumain-unilateral-haltere');
 assert.deepEqual([unilateral.defaultSets,unilateral.repScheme,unilateral.tempo,unilateral.rest,unilateral.gif],[3,'10/côté','3011',60,'/media/e5532fe8fa9b40e9.gif']);
 assert.match(videoFor(unilateral).coaching.notice,/haltère.*plus clairement visible/);
 assert.equal(videoFor(unilateral).avoidSilentPreview,true);
 const back=EXERCISES.find(e=>e.id==='back-extension-horizontal');
 assert.deepEqual([back.defaultSets,back.repScheme,back.tempo,back.rest,back.gif],[5,'12-15','3010',120,'/media/6cfcff2b2b4dcee5.gif']);
 assert.match(videoFor(back).coaching.notice,/Ne copiez pas/);
 assert.equal(videoFor(back).avoidSilentPreview,true);
 for(const id of ['souleve-de-terre-roumain-unilateral','leg-curl-debout','leg-curl-allonge-pieds-pointes','leg-curl-allonge-pieds-flechis','leg-curl-allonge-1-1-4-en-haut']) assert.equal(videoFor(id),null,id);
});
