import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {EXERCISES,alternatives} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');

test('mollets : clips intacts, réutilisations strictes, réserves et GIF conservés',()=>{
  const groups=[
    ['1795689210250','38fe322941d315f129dfe64a3a2a4d74dc079da5ef05d5f36914cc5542acee7a',['mollets-debout']],
    ['1795689231810','d6be5926644fb4d7484631d659eeecc1674ca9adea4af7023aca7473311659e5',['mollets-assis']],
    ['1795690750978','bfc9c40dec2adf876bf7ab9b85c455d85d7eb18d463eeaabea7f251a971f8df6',['mollets-unilateraux','mollets-debout-unilateraux','mollets-a-la-presse']],
  ];
  for(const [source,hash,ids] of groups){
    assert.equal(sha(`../${source}.mp4`),hash);
    for(const id of ids){
      const ex=EXERCISES.find(e=>e.id===id),video=videoFor(ex);
      assert.ok(ex,id);
      assert.equal(video.status,'coached');
      assert.ok(video.coaching.spoken && video.coaching.notice);
      for(const root of ['public','release']){
        assert.equal(sha(root+video.src),hash);
        assert.ok(readFileSync(root+video.poster).length);
        assert.ok(readFileSync(root+ex.gif).length);
      }
      assert.equal(sha('public'+ex.gif),sha('release'+ex.gif));
    }
  }
});

test('mollets : matériel des fiches conforme aux vidéos, sans presse pour personne',()=>{
  const yanis=['bodyweight','dumbbell','barbell','bench','cable','machine','band','pullup','pool','elliptical'];
  const emilie=['bodyweight','band','dumbbell','barbell','bench','pool','elliptical'];
  const attendu={
    'mollets-debout':['machine'],
    'mollets-assis':['bench','dumbbell'],
    'mollets-unilateraux':['dumbbell'],
    'mollets-debout-unilateraux':['dumbbell'],
    'mollets-a-la-presse':['dumbbell'],
  };
  for(const [id,equipment] of Object.entries(attendu)){
    const ex=EXERCISES.find(e=>e.id===id);
    assert.deepEqual(ex.equipment,equipment,id);
    assert.equal(ex.bodyweight,false,id);
    assert.ok(ex.equipment.every(q=>yanis.includes(q)),id);
    // Aucune fiche mollet ne doit exiger de presse à cuisses.
    assert.ok(!ex.equipment.includes('barbell')||ex.equipment.length>1,id);
  }
  // Le mollet debout sur machine reste remplaçable sans machine : Émilie a bien
  // une variante haltère disponible, et le mollet assis se fait sur un banc.
  const perso={equipment:emilie,preferences:{refused:[],favorites:[]},level:'Intermédiaire'};
  const debout=EXERCISES.find(e=>e.id==='mollets-debout');
  const replis=alternatives(debout,perso).map(a=>a.id);
  assert.ok(replis.length>0);
  assert.ok(replis.every(id=>id!=='mollets-debout'));
  assert.ok(EXERCISES.find(e=>e.id==='mollets-assis').equipment.every(q=>emilie.includes(q)));
  assert.ok(videoFor(debout).coaching.notice.length>40);
});

test('mollets : réserves écrites conformes aux défauts constatés',()=>{
  assert.match(videoFor('mollets-debout').coaching.notice,/flotte/);
  assert.match(videoFor('mollets-assis').coaching.notice,/ne poussez pas avec les bras/);
  assert.match(videoFor('mollets-unilateraux').coaching.notice,/descente/);
  assert.match(videoFor('mollets-a-la-presse').coaching.spoken,/Vous n'avez pas de presse/);
});
