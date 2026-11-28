import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {EXERCISES} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');

test('abdos : planche et relevés de jambes raccordés, réserves écrites, GIF conservés',()=>{
  const groupes=[
    ['1795856844662','a8b0024c1769acd67e2ffd1d76dc15aa1bec6c74baa462aa1ce312859f9377f7',
      ['gainage-planche','circuit-gainage-planche-lateral-bird-dog','circuit-abdominaux-crunch-releves-gainage']],
    ['1795856818170','16132041ceb70676d06c89eeb245ed0b508f4723136bcc233af56a8f16b43493',
      ['releves-de-jambes-allongee','releves-de-jambes','releves-de-jambes-allonge']],
  ];
  for(const [source,hash,ids] of groupes){
    assert.equal(sha(`../${source}.mp4`),hash);
    for(const id of ids){
      const ex=EXERCISES.find(e=>e.id===id),video=videoFor(ex);
      assert.ok(ex,id);
      assert.equal(video.status,'coached',id);
      assert.ok(video.coaching.spoken && video.coaching.notice,id);
      for(const root of ['public','release']){
        assert.equal(sha(root+video.src),hash);
        assert.ok(readFileSync(root+video.poster).length);
        assert.ok(readFileSync(root + ex.gif).length, `${root}${ex.gif}`);
      }
    }
  }
  // Chaque réserve doit dire ce que la vidéo ne montre pas correctement.
  for(const id of ['gainage-planche','circuit-gainage-planche-lateral-bird-dog','circuit-abdominaux-crunch-releves-gainage'])
    assert.match(videoFor(id).coaching.notice,/mains/i,id);
  for(const id of ['releves-de-jambes-allongee','releves-de-jambes','releves-de-jambes-allonge'])
    assert.match(videoFor(id).coaching.notice,/parallèles/,id);
  assert.equal(EXERCISES.filter(e=>e.muscle==='abs'&&!videoFor(e)).length,0);
});
