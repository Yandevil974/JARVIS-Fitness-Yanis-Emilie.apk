import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { EXERCISES } from '../src/data/library.js';
import { videoFor } from '../src/data/exercise-videos.js';

test('chaque fiche de la bibliothèque dispose du média de repli et des vidéos raccordées', () => {
 for (const ex of EXERCISES) {
  if (ex.gif) {
   assert.ok(existsSync(`public${ex.gif}`), `${ex.id}: GIF manquant`);
   const thumb=ex.gif.replace('/media/','/thumbs/').replace(/\.gif$/,'.webp');
   assert.ok(existsSync(`public${thumb}`), `${ex.id}: miniature de repli manquante`);
  }
  const video=videoFor(ex);
  if(video){
   assert.ok(existsSync(`public${video.src}`), `${ex.id}: vidéo manquante`);
   assert.ok(video.poster && existsSync(`public${video.poster}`), `${ex.id}: poster manquant`);
  }
 }
});
