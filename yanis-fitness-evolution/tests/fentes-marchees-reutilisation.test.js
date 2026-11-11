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
test('fentes marchées : vidéo de la progression existante, GIF et consignes conservés',()=>{
 const ex=EXERCISES.find(e=>e.id==='fentes-marchees'),v=videoFor(ex),other=videoFor('fentes-avant-alternees');
 assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[5,'15-20','3010',60,'/media/11221d745c89b523.gif']);
 assert.equal(v.src,other.src);assert.equal(v.poster,other.poster);assert.equal(v.status,'coached');assert.match(v.coaching.notice,/s'arrête pendant la fente suivante/);assert.notEqual(v.coaching.spoken,other.coaching.spoken);
 const expected='69f54c3187b03d0ef12be6a21d7cf1afe58bd0984509f5268b78c2bc25ea2e43';assert.equal(hash('../1794241708962.mp4'),expected);
 assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
 const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:ex.id,targetSets:5,sets:[]}]});assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
 for(const base of ['public','release']){assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${ex.gif}`),hash(`public${ex.gif}`));}
});
