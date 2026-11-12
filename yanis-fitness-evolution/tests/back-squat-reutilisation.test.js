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
 ['back-squat-charge-moderee',3,'10-12','3011',120,'/media/8dcad3315ed67aa3.gif'],
 ['back-squat-barre-haute',4,'8-10','3010',120,'/media/dcf2495f19b92d50.gif'],
 ['back-squat-test-1rm',5,'1-5','4010',180,'/media/f2d8f3f06dc0b439.gif'],
 ['safety-bar-squat-ou-barre-classique',4,'12,10,8,15','3010',120,'/media/ac4b515aecf50e23.gif'],
];
test('back squats partagés : prescriptions, GIF, voix, vignette et sécurité',()=>{
 const original=videoFor('back-squat'); const expected='d1ec0cf0c7e8e65656c9ef9571cf5d3e7335cc9e184a4d834acab0bb99ced3ed';
 assert.equal(hash(`public${original.src}`),expected);assert.equal(hash(`release${original.src}`),expected);
 for(const [id,sets,reps,tempo,rest,gif] of cases){const ex=EXERCISES.find(e=>e.id===id),v=videoFor(ex);assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[sets,reps,tempo,rest,gif]);assert.equal(v.src,original.src);assert.equal(v.poster,original.poster);assert.equal(v.status,'coached');assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:sets,sets:[]}]});assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);assert.equal(hash(`public${gif}`),hash(`release${gif}`));}
 for(const id of ['back-squat',...cases.map(c=>c[0])]) { assert.equal(videoFor(id).status,'coached'); assert.doesNotMatch(videoFor(id).coaching.notice,/tête est coupée/); }
 assert.match(videoFor('safety-bar-squat-ou-barre-classique').coaching.notice,/pas une safety bar/);
 assert.equal(hash('../1794471034884.mp4'),expected);
 assert.equal(hash(`public${original.poster}`),hash(`release${original.poster}`));
 assert.match(videoFor('back-squat-test-1rm').coaching.notice,/ni sécurités correctement réglées ni pareur/);
 assert.equal(videoFor('back-squat-inertie-pause-complete'),null);
});
