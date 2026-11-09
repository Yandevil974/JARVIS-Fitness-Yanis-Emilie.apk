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
  ['kickback-a-la-poulie', '15/côté', /quinze par côté/i],
  ['kickback-a-la-poulie-drop-set-final', '12-15/côté', /trente pour cent/i],
];
test('kickback 03 et 11 : même MP4 intact, fiches, GIF et voix propres', () => {
  const expected = '7d5128b8d5d150f7c476e0c674f51f7a24983586fb3c20790430de5de38b7d2d';
  assert.equal(hash('../1794208548995.mp4'), expected);
  for (const [id, reps, cue] of cases) {
    const ex = EXERCISES.find(e => e.id === id), v = videoFor(ex);
    assert.deepEqual([ex.defaultSets, ex.repScheme, ex.tempo, ex.rest, ex.gif], [3, reps, '2011', 45, '/media/32fa389d5f16c0d4.gif']);
    assert.equal(v.status, 'coached'); assert.equal(v.src, '/videos/kickback-a-la-poulie.mp4');
    assert.match(v.coaching.spoken, cue); assert.match(v.coaching.notice, /câble.*masqué/i);
    assert.ok(exerciseIntroCue(ex, null).text.includes(v.coaching.spoken));
    assert.ok(techniqueCue(ex, null).text.includes(v.coaching.spoken));
    const next = nextRestExercise({currentIndex: 0, exercises: [{exerciseId: id, targetSets: 3, sets: []}]});
    assert.equal(next.video.src, v.src); assert.equal(nextRestModal(next).notice, v.coaching.notice);
    for (const base of ['public','release']) { assert.equal(hash(`${base}${v.src}`), expected); assert.equal(hash(`${base}${v.poster}`), hash(`public${v.poster}`)); assert.equal(hash(`${base}${ex.gif}`), hash(`public${ex.gif}`)); }
  }
  assert.notEqual(videoFor(cases[0][0]).coaching.spoken, videoFor(cases[1][0]).coaching.spoken);
  assert.match(videoFor(cases[1][0]).coaching.notice, /pas la réduction de charge/i);
});
