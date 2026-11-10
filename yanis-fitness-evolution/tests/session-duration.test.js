import test from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {initialState,validateState} from '../src/store/model.js';
import {preserveUncertainSessionDuration} from '../src/store/session-duration.js';
import {checkFullBackup} from '../src/store/check-backup.js';
import {STORAGE_KEY} from '../src/app-identity.js';

function example() {
 const data=initialState(),session=structuredClone(data.profiles.elite.plan.sessions.find(s=>(s.exercises||[]).length));
 session.id='session-longue-exemple';session.date=new Date().toISOString().slice(0,10);session.status='completed';session.durationSec=173025;
 data.profiles.elite.sessions.push(session);return data;
}
test('une durée excessive reste récupérable sans inventer de durée active ni muter la source',()=>{
 const source=example(), raw=JSON.stringify(source),normalized=validateState(source), session=normalized.profiles.elite.sessions.at(-1);
 assert.equal(JSON.stringify(source),raw);
 assert.equal(session.durationSec,null);assert.equal(session.durationReview.originalSeconds,173025);
 assert.equal(session.durationReview.reason,'duration-over-24h');
 assert.deepEqual(validateState(normalized).profiles.elite.sessions.at(-1),session);
 assert.match(checkFullBackup(raw).message,/durée.*à vérifier/i);
 assert.equal(source.profiles.elite.sessions.at(-1).durationSec,173025);
 const short={durationSec:4000};assert.equal(preserveUncertainSessionDuration(short),false);assert.equal(short.durationSec,4000);
 const old={durationSec:90000,durationReview:{note:'à conserver'}};preserveUncertainSessionDuration(old);
 assert.deepEqual(old.durationReview.previous,{note:'à conserver'});
 assert.throws(()=>{const bad=example();bad.profiles.elite.sessions.at(-1).durationSec=-1;validateState(bad)});
});
test('la sauvegarde avec une séance restée ouverte devient enregistrable et relisible sans perdre ses séries',async()=>{
 const map=new Map();globalThis.indexedDB=new IDBFactory();globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
 const store=await import('../src/store/storage.js?session-duration-test');
 await store.loadState();const source=example(), sessions=source.profiles.elite.sessions.at(-1).exercises;
 assert.equal((await store.saveState(source)).ok,true);
 const saved=JSON.parse(map.get(STORAGE_KEY));assert.equal(saved.profiles.elite.sessions.at(-1).durationSec,null);
 assert.equal(saved.profiles.elite.sessions.at(-1).durationReview.originalSeconds,173025);
 assert.deepEqual(saved.profiles.elite.sessions.at(-1).exercises,sessions);
 const loaded=await store.loadState();assert.equal(loaded.data.profiles.elite.sessions.at(-1).durationReview.originalSeconds,173025);
});
