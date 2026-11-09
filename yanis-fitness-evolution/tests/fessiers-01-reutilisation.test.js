import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { EXERCISES } from '../src/data/library.js';
import { videoFor } from '../src/data/exercise-videos.js';
import { stepVideoFor } from '../src/data/step-videos.js';
import { exerciseIntroCue, techniqueCue } from '../src/engine/voice-coach.js';
import { nextRestExercise, nextRestModal } from '../src/engine/rest-next.js';
const root = fileURLToPath(new URL('..', import.meta.url));
const hash = path => createHash('sha256').update(readFileSync(`${root}/${path}`)).digest('hex');
const cases = [
  ['pont-fessier-au-sol-activation', 'Activation fessiers', 2, '15', '2012', 45, '/media/666443484c7f0861.gif'],
  ['mobilite-des-epaules', 'Mobilité des épaules', 2, '30 s', 'lent', 15, '/media/496f6cb98871e619.gif'],
];
test('réutilisation exacte des vidéos échauffement avec fiches, voix et GIF conservés', () => {
  for (const [id, step, sets, reps, tempo, rest, gif] of cases) {
    const ex = EXERCISES.find(e => e.id === id), video = videoFor(ex), warmup = stepVideoFor(step);
    assert.deepEqual([ex.defaultSets, ex.repScheme, ex.tempo, ex.rest, ex.gif], [sets, reps, tempo, rest, gif]);
    assert.equal(video.status, 'coached'); assert.equal(video.src, warmup.src); assert.equal(video.poster, warmup.poster);
    assert.ok(exerciseIntroCue(ex, null).text.includes(video.coaching.spoken));
    assert.ok(techniqueCue(ex, null).text.includes(video.coaching.spoken));
    const next = nextRestExercise({ currentIndex: 0, exercises: [{ exerciseId: id, targetSets: sets, sets: [] }] });
    assert.equal(next.video.src, video.src); assert.equal(nextRestModal(next).notice, video.coaching.notice);
    for (const url of [video.src, video.poster, ex.gif]) assert.equal(hash(`public${url}`), hash(`release${url}`));
  }
});
