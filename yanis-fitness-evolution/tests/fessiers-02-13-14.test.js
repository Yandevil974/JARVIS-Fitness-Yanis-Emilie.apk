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
 ['hip-thrust-barre',3,'12-15','3112',90,'/media/4e7b70938b8a2e57.gif','../1794374634457.mp4','9d8fa4feaa79e3fcf8b4f8dd087bfcd8361e7d4187ec1635f35dafd6abeeafa1',/chaussures.*coupé/i],
 ['hip-thrust-barre-test-de-charge-max-3-5-reps',5,'3-5','3012',180,'/media/4e7b70938b8a2e57.gif','../1794374634457.mp4','9d8fa4feaa79e3fcf8b4f8dd087bfcd8361e7d4187ec1635f35dafd6abeeafa1',/jamais seule/i],
 ['fentes-bulgares-pied-arriere-sureleve',4,'8-10/jambe','3010',90,'/media/7709724c07a6ef07.gif','../1794374471498.mp4','433084125f58390f91112567563aba135c0652589a9a4dfa6802884e91d0c2b5',/pied arrière/i],
 ['bulgarian-split-squat',3,'10/jambe','3010',75,'/media/f183700b3362f93b.gif','../1794374471498.mp4','433084125f58390f91112567563aba135c0652589a9a4dfa6802884e91d0c2b5',/pied arrière/i],
];
test('fessiers 02/14 et 13 : vidéos originales, réutilisation, consignes, GIF et vignette',()=>{
 for(const [id,sets,reps,tempo,rest,gif,source,expected,notice] of cases){
  const ex=EXERCISES.find(e=>e.id===id),v=videoFor(ex);
  assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[sets,reps,tempo,rest,gif]);
  assert.equal(v.status,'coached'); assert.match(v.coaching.notice,notice); assert.equal(hash(source),expected);
  assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
  const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:sets,sets:[]}]});
  assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
  for(const base of ['public','release']){assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${gif}`),hash(`public${gif}`));}
 }
 assert.equal(videoFor(cases[0][0]).src,videoFor(cases[1][0]).src);
 assert.equal(videoFor(cases[2][0]).src,videoFor(cases[3][0]).src);
 assert.notEqual(videoFor(cases[0][0]).coaching.spoken,videoFor(cases[1][0]).coaching.spoken);
 assert.notEqual(videoFor(cases[2][0]).coaching.spoken,videoFor(cases[3][0]).coaching.spoken);
 assert.equal(videoFor('hip-thrust-unilateral-leste'),null);
 assert.equal(videoFor('fentes-bulgares-halteres-pied-avant-sureleve'),null);
});
