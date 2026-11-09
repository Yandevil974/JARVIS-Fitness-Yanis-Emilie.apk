import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { EXERCISES } from '../src/data/library.js';
import { videoFor } from '../src/data/exercise-videos.js';
import { exerciseIntroCue, techniqueCue } from '../src/engine/voice-coach.js';
import { nextRestExercise, nextRestModal } from '../src/engine/rest-next.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const hash=path=>createHash('sha256').update(readFileSync(`${root}/${path}`)).digest('hex');
const cases=[
 ['kickback-a-l-elastique',3,'15/côté','2011',45,'/media/9ea5b7136f88d7ef.gif','../1794241423034.mp4','e6b0631eb9a3bcc9a0c8f1e2f8554ef129c7d4e91ad2909ff4ef24378ab21d38',/attaches.*petites/i],
 ['fentes-avant-alternees',3,'10/jambe','3010',75,'/media/f1330639adb8d27f.gif','../1794241708962.mp4','69f54c3187b03d0ef12be6a21d7cf1afe58bd0984509f5268b78c2bc25ea2e43',/progresse.*avant/i],
 ['glute-bridge-en-1-5-reps',3,'10-12','2112',75,'/media/666443484c7f0861.gif','../1794242235179.mp4','1c3482b945fc4353b3bde7cc7512a24377c605fe95ee827689b3acd13c152d9f',/ne démontre pas clairement la demi-répétition/i],
];
test('fessiers 07, 09 et 10 : MP4 originaux, prescriptions, GIF, voix et vignette',()=>{
 for(const [id,sets,reps,tempo,rest,gif,source,expected,notice] of cases){
  const ex=EXERCISES.find(e=>e.id===id),v=videoFor(ex);
  assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[sets,reps,tempo,rest,gif]);
  assert.equal(v.status,'coached');assert.match(v.coaching.notice,notice);assert.equal(hash(source),expected);
  assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
  const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:sets,sets:[]}]});
  assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
  for(const base of ['public','release']){assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${gif}`),hash(`public${gif}`));}
 }
 const ex=EXERCISES.find(e=>e.id==='glute-bridge-en-1-5-reps');
 assert.match(ex.note,/mi-course/i);assert.match(ex.tip,/mi-course/i);assert.doesNotMatch(ex.tip,/chaque jambe/i);
 assert.notEqual(videoFor('fentes-avant-alternees').src,videoFor('fentes-arriere-alternees').src);
 assert.notEqual(videoFor('kickback-a-l-elastique').src,videoFor('kickback-a-la-poulie').src);
});
