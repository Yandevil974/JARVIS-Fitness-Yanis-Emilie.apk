import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/store/model.js';
import { withoutServiceKeys } from '../src/store/storage.js';
import { validateState } from '../src/store/schema.js';

test('la copie exportable exclut les clés des deux profils sans toucher aux autres données ni à l’original', () => {
 const original = initialState();
 original.profiles.elite.preferences.brain = { enabled: true, provider: 'groq', key: 'TEST-FAKE-SECRET-001' };
 original.profiles.emilie.preferences.brain = { enabled: true, provider: 'openrouter', key: 'TEST-FAKE-SECRET-002' };
 const copy = withoutServiceKeys(original);
 assert.equal(copy.profiles.elite.preferences.brain.key, undefined);
 assert.equal(copy.profiles.emilie.preferences.brain.key, undefined);
 assert.equal(original.profiles.elite.preferences.brain.key, 'TEST-FAKE-SECRET-001');
 const expected = structuredClone(original);
 delete expected.profiles.elite.preferences.brain.key;
 delete expected.profiles.emilie.preferences.brain.key;
 assert.deepEqual(copy, expected);
 assert.doesNotThrow(() => validateState(copy));
});
