import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {EXERCISES} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');

test('fessiers : clip unilatéral intact, trois fiches raccordées, réserves écrites',()=>{
  const hash='6727cbe16a52a06a3fb88fec50e7a64bc0f0b4d42d2a766f10001410373881fc';
  assert.equal(sha('../1795854583150.mp4'),hash);
  for(const id of ['hip-thrust-unilateral','hip-thrust-unilateral-1-jambe','hip-thrust-unilateral-leste']){
    const ex=EXERCISES.find(e=>e.id===id),video=videoFor(ex);
    assert.ok(ex,id);
    assert.equal(video.status,'coached',id);
    assert.ok(video.coaching.spoken && video.coaching.notice,id);
    for(const root of ['public','release']){
      assert.equal(sha(root+video.src),hash);
      assert.ok(readFileSync(root+video.poster).length);
      assert.ok(readFileSync(root+ex.gif).length);
    }
  }
  // Le défaut constaté doit rester écrit : la barre n'est pas dans le pli des hanches.
  assert.match(videoFor('hip-thrust-unilateral').coaching.notice,/pli des hanches/);
  assert.match(videoFor('hip-thrust-unilateral-1-jambe').coaching.notice,/pli des hanches/);
  assert.match(videoFor('hip-thrust-unilateral-leste').coaching.notice,/pli des hanches/);
  assert.match(videoFor('hip-thrust-unilateral').coaching.notice,/s'enroule/);
  assert.equal(EXERCISES.filter(e=>e.muscle==='fes'&&!videoFor(e)).length,0);
});
