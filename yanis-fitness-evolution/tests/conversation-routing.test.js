import test from 'node:test';
import assert from 'node:assert/strict';
import { useConversationalModel } from '../src/engine/conversation-routing.js';

test('les questions générales vont à la conversation même si un mot a provoqué une proposition locale', () => {
  const local = { action: { type: 'fatigue' }, brain: { source: 'coach' } };
  for (const s of ['Pourquoi les muscles sont-ils fatigués après une séance ?', 'Comment améliorer la récupération ?', 'Explique le rôle du sommeil']) assert.equal(useConversationalModel(s, local), true, s);
});
test('les actions, mémoires, informations personnelles et alertes de sécurité restent locales', () => {
  const cases = [
    ['Allège ma séance', { action: { type: 'fatigue' } }],
    ['Quelle était ma dernière séance ?', { navigate: 'training' }],
    ['Arrête ma séance, je ressens une douleur', { action: { type: 'pain' }, automatic: true }],
    ['Pourquoi ma séance a disparu ?', { navigate: 'training' }],
    ['Retiens que je préfère le matin', { turn: { handled: true } }],
    ['oui', { action: { type: 'plan' } }],
    ['Non', {}],
  ];
  for (const [s, a] of cases) assert.equal(useConversationalModel(s, a), false, s);
});
test('une discussion ouverte ne dépend pas des menus locaux', () => {
  assert.equal(useConversationalModel('Parle-moi des étoiles', { navigate: 'training' }), true);
  assert.equal(useConversationalModel('Bonjour', {}), true);
});
