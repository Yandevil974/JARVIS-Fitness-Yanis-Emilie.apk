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
test('goblet squat : vidéo reçue intacte, consignes, prescription, GIF et vignette',()=>{
 const ex=EXERCISES.find(e=>e.id==='goblet-squat'), v=videoFor(ex);
 assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[3,'12','3011',90,'/media/33d8d73dda8abb5b.gif']);
 assert.equal(v.src,'/videos/goblet-squat.mp4'); assert.equal(v.status,'coached');
 assert.match(v.coaching.notice,/tête est coupée/); assert.match(v.coaching.notice,/tempo exact/);
 assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken)); assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
 const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:ex.id,targetSets:3,sets:[]}]});
 assert.equal(next.video.src,v.src); assert.equal(nextRestModal(next).notice,v.coaching.notice);
 const expected='ac3eab3406bdbb265efa60fcbef6ea6afb0087267f001a61fa19d9e47fa27a37';
 assert.equal(hash('../1794376345822.mp4'),expected);
 for(const base of ['public','release']) {assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${ex.gif}`),hash(`public${ex.gif}`));}
});
