import test from 'node:test';
import assert from 'node:assert/strict';
import { stepGuide } from '../src/data/visuals.js';

test('une étape piscine ne retombe jamais sur un guide elliptique', () => {
  const pool = [{ k: ['récupération'], t: 'Récupération piscine', img: '/media/pool-recup-complete.jpg' }];
  const result = stepGuide('Récupération', 'pool', pool);
  assert.equal(result.t, 'Récupération piscine');
  assert.match(result.img, /pool/);
});

test('une étape piscine sans association reste non associée', () => {
  const noPoolGuide = [];
  assert.equal(stepGuide('Récupération inconnue', 'pool', noPoolGuide), null);
});
