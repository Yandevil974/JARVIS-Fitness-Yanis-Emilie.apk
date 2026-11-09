import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { EXERCISES } from '../src/data/library.js';
import { videoFor } from '../src/data/exercise-videos.js';
import { exerciseIntroCue, techniqueCue } from '../src/engine/voice-coach.js';
import { nextRestExercise, nextRestModal } from '../src/engine/rest-next.js';
const root = fileURLToPath(new URL('..', import.meta.url));
const hash = path => createHash('sha256').update(readFileSync(`${root}/${path}`)).digest('hex');
const cases = [
 ['fentes-arriere-alternees', 3, '10/jambe', '3010', 75, '/media/f1330639adb8d27f.gif', '../1794239282541.mp4', '15100ad422fe6ea4658eaab718ae1cc7b114b20dd8d241f58cd4fb5232b4da4c', /alternance/i],
 ['fentes-arriere-au-poids-du-corps', 3, '8-12', '3010', 90, '/media/6c0dfcfe4f714ece.gif', '../1794239282541.mp4', '15100ad422fe6ea4658eaab718ae1cc7b114b20dd8d241f58cd4fb5232b4da4c', /alternance/i],
 ['glute-bridge-pieds-sur-banc', 3, '15', '2012', 60, '/media/666443484c7f0861.gif', '../1794239106607.mp4', 'dbd1c1e6382a6bf01e4d4c30d23cbb792220672bffc056c106ce394d2456e675', /pieds.*superposent/i],
];
test('fentes 05 et pont 06 : vidéos intactes, GIF, prescriptions, voix et vignette conservés', () => {
 for (const [id, sets, reps, tempo, rest, gif, original, expected, notice] of cases) {
  const ex=EXERCISES.find(e=>e.id===id), v=videoFor(ex);
  assert.deepEqual([ex.defaultSets,ex.repScheme,ex.tempo,ex.rest,ex.gif],[sets,reps,tempo,rest,gif]);
  assert.equal(v.status,'coached');assert.match(v.coaching.notice,notice);assert.equal(hash(original),expected);
  assert.ok(exerciseIntroCue(ex,null).text.includes(v.coaching.spoken));assert.ok(techniqueCue(ex,null).text.includes(v.coaching.spoken));
  const next=nextRestExercise({currentIndex:0,exercises:[{exerciseId:id,targetSets:sets,sets:[]}]});
  assert.equal(next.video.src,v.src);assert.equal(nextRestModal(next).notice,v.coaching.notice);
  for(const base of ['public','release']) {assert.equal(hash(`${base}${v.src}`),expected);assert.equal(hash(`${base}${v.poster}`),hash(`public${v.poster}`));assert.equal(hash(`${base}${gif}`),hash(`public${gif}`));}
 }
 assert.equal(videoFor(cases[0][0]).src,videoFor(cases[1][0]).src);
 assert.notEqual(videoFor(cases[0][0]).coaching.spoken,videoFor(cases[1][0]).coaching.spoken);
});
