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
test('squat sans charge : source intacte, GIF, prescription, coaching et vignette',()=>{
 const id='squat-au-poids-du-corps',ex=EXERCISES.find(e=>e.id===id),v=videoFor(ex);
 assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif,ex.bodyweight],[3,'10-15','3010',60,'/media/3a18659a669ab642.gif',true]);
 assert.equal(v.src,'/videos/squat-au-poids-du-corps.mp4');assert.equal(v.status,'coached');assert.match(v.coaching.notice,/boucle/);
 const expected='0c87c52b132dc4be91590d3383cc4028321bf5de6568a9e0e7f01cfd97953b44';assert.equal(hash('../1794388348249.mp4'),expected);
 assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
 const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:3,sets:[]}]});assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
 for(const base of ['public','release']){assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${ex.gif}`),hash(`public${ex.gif}`));}
 assert.notEqual(v.src,videoFor('squat-cycliste').src);
});
