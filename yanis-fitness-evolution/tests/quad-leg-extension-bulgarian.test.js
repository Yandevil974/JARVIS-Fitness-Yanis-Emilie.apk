import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {EXERCISES} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
import {exerciseIntroCue,techniqueCue} from '../src/engine/voice-coach.js';
import {nextRestExercise,nextRestModal} from '../src/engine/rest-next.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const hash=p=>createHash('sha256').update(readFileSync(`${root}/${p}`)).digest('hex');
const cases=[
 ['leg-extension',5,'12-15','2011',120,'/media/4a75246261f34b24.gif','../1794381513673.mp4','leg-extension','a72f04c17863417b6f4ed2271acbbf4402bbcac59453cff034036a0f0f2834bd',/rouleau/],
 ['bulgarian-split-squat-halteres',4,'8-10/jambe','3010',90,'/media/493af81454d9f86c.gif','../1794381881250.mp4','bulgarian-split-squat-halteres','21b7c46fb69f7e1ed7945176a59f1a69fbc18ffddc793ee17280c125d4dab7bc',/seconde main/],
];
test('leg extension et fente avec haltères : sources intactes, GIF, prescription, coaching et vignette',()=>{
 for(const [id,sets,reps,tempo,rest,gif,source,name,expected,notice] of cases){
  const ex=EXERCISES.find(e=>e.id===id),v=videoFor(ex);
  assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[sets,reps,tempo,rest,gif]);
  assert.equal(v.src,`/videos/${name}.mp4`); assert.equal(v.status,'coached');assert.match(v.coaching.notice,notice);assert.equal(hash(source),expected);
  assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
  const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:sets,sets:[]}]});assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
  for(const base of ['public','release']){assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${gif}`),hash(`public${gif}`));}
 }
 assert.notEqual(videoFor('bulgarian-split-squat-halteres').src,videoFor('bulgarian-split-squat').src);
 assert.equal(videoFor('fentes-bulgares-halteres-pied-avant-sureleve'),null);
});
