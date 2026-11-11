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
const rows=[
 ['step-up-sur-banc-hauteur-du-genou',3,'10/jambe','2011',60,'/media/0e32e3e5fab9f6f6.gif','../1794380521826.mp4','step-up-banc-poids-du-corps','037bc9e8f5021a5f1d9fd8da5458a34bc180b84be6390619bece9ecee079b693'],
 ['step-up-haut',4,'8-10','4010',60,'/media/55312a3f227db7a4.gif','../1794380521826.mp4','step-up-banc-poids-du-corps','037bc9e8f5021a5f1d9fd8da5458a34bc180b84be6390619bece9ecee079b693'],
 ['squat-cycliste-squat-complet',5,'8-10','3010',60,'/media/fdcc2d01cb5a53d1.gif','../1794380511781.mp4','squat-cycliste-poids-du-corps','9fbe6167687736295f3f2df4aa6e74e0d575c347edf1595eab0ec3a44e8c96b9'],
 ['squat-cycliste',5,'7-9','4010',120,'/media/fdcc2d01cb5a53d1.gif','../1794380511781.mp4','squat-cycliste-poids-du-corps','9fbe6167687736295f3f2df4aa6e74e0d575c347edf1595eab0ec3a44e8c96b9'],
];
test('vidéos reçues, fiches, prescriptions, consignes, GIF et Ensuite',()=>{
 for(const [id,sets,reps,tempo,rest,gif,source,name,expected] of rows){
  const ex=EXERCISES.find(e=>e.id===id),v=videoFor(ex);
  assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[sets,reps,tempo,rest,gif]);
  assert.equal(v.src,`/videos/${name}.mp4`);assert.equal(v.status,'coached');assert.match(v.coaching.notice,/tempo/i);
  assert.equal(hash(source),expected);assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
  const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:sets,sets:[]}]});assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
  for(const base of ['public','release']){assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${gif}`),hash(`public${gif}`));}
 }
 assert.equal(videoFor(rows[0][0]).src,videoFor(rows[1][0]).src);assert.equal(videoFor(rows[2][0]).src,videoFor(rows[3][0]).src);
 assert.notEqual(videoFor(rows[0][0]).coaching.spoken,videoFor(rows[1][0]).coaching.spoken);assert.notEqual(videoFor(rows[2][0]).coaching.spoken,videoFor(rows[3][0]).coaching.spoken);
});
