import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/store/model.js';
import { checkFullBackup } from '../src/store/check-backup.js';

test('le contrôle local valide ou explique sans modifier les données ni appeler le stockage',()=>{
 const state=initialState(), original=JSON.stringify(state);
 globalThis.localStorage = { getItem(){throw Error('ne doit pas lire');}, setItem(){throw Error('ne doit pas écrire');} };
 const valid=checkFullBackup(original);assert.equal(valid.ok,true);assert.match(valid.message,/ne confirme pas.*écriture/i);
 assert.equal(JSON.stringify(state),original);
 state.profiles.elite.user.age=-1;
 const invalid=checkFullBackup(JSON.stringify(state));assert.equal(invalid.ok,false);assert.match(invalid.message,/age/i);assert.match(invalid.message,/Aucun import/);
 assert.equal(state.profiles.elite.user.age,-1);
 assert.equal(checkFullBackup('{malformé').ok,false);
});
