import test from 'node:test';
import assert from 'node:assert/strict';
import { createVoiceController, errorCode } from '../controller.mjs';
const tick = () => new Promise(r => setImmediate(r));
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
function browser(options = {}) {
  const instances = [], utterances = [], timers = new Map(), listeners = {};
  let count = 0, stops = 0;
  class Recognition {
    constructor() { instances.push(this); }
    start() { this.onstart?.(); }
    stop() { this.stopped = true; }
    abort() { this.aborted = true; this.onerror?.({ error: 'aborted' }); this.onend?.(); }
    result(text) { this.onresult?.({ results: [[{ transcript: text }]] }); this.onend?.(); }
  }
  const env = { SpeechRecognition: Recognition, SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    speechSynthesis: { cancel() { stops++; }, getVoices: () => [{ lang: 'fr-FR' }], speak(u) { utterances.push(u); } },
    document: { hidden: false, addEventListener: (e,f) => listeners[e]=f, removeEventListener: e=>delete listeners[e] },
    addEventListener: (e,f) => listeners[e]=f, removeEventListener: e=>delete listeners[e], ...options.env };
  const c = createVoiceController({ ...options, env, setTimer: (fn,ms) => { const id=++count; timers.set(id,{fn,ms}); return id; }, clearTimer: id=>timers.delete(id) });
  return { c, env, instances, utterances, timers, listeners, stops: () => stops };
}
function android(overrides = {}) {
  const request = deferred(); let eventHandler; let cancelled = 0;
  const native = { diagnostics: async () => ({ protocolVersion: 2, platform: 'android', recognitionAvailable: true, ttsReady: true, frenchAvailable: true, microphone: 'granted' }),
    listen: () => request.promise, cancelListen: async () => { cancelled++; }, stopSpeech: async () => {}, speak: async () => {},
    addListener: async (_, handler) => { eventHandler = handler; return { remove() {} }; }, ...overrides };
  const mock = browser({ native, isAndroid: () => true });
  return { ...mock, native, request, cancelled: () => cancelled, event: value => eventHandler?.(value) };
}
test('browser dictation transitions, stops at speech end and returns text without sending', async () => {
  const { c, instances, timers } = browser(); const phases=[]; const off=c.subscribe(s=>phases.push(s.phase));
  const result=c.listen(); assert.equal(c.getSnapshot().phase,'listening');
  instances[0].onspeechend(); assert.equal(c.getSnapshot().phase,'processing'); assert.equal(instances[0].stopped,true);
  instances[0].result('  Bonjour JARVIS  ');
  assert.equal(await result,'Bonjour JARVIS'); assert.equal(c.getSnapshot().phase,'idle');
  assert.match(c.getSnapshot().detail,/Rien n’a été envoyé/); assert.equal(timers.size,0);
  off(); c.dispose();
});
test('second press cancels; late results never change the state or populate a later session', async () => {
  const { c, instances }=browser(); const first=c.listen(); const old=instances[0];
  assert.equal(await c.listen(),null); assert.equal(await first,null); assert.equal(old.aborted,true);
  const second=c.listen(); old.result('stale transcript'); assert.equal(c.getSnapshot().phase,'listening');
  instances[1].result('nouvelle demande'); assert.equal(await second,'nouvelle demande'); c.dispose();
});
test('permission, silence, network, audio and service errors are explicit and recoverable', async () => {
  for(const [error,code] of [['not-allowed','PERMISSION_DENIED'],['no-speech','NO_SPEECH'],['network','NETWORK'],['audio-capture','AUDIO'],['aborted','CANCELLED']]) {
    const { c, instances }=browser(); const result=c.listen(); instances[0].onerror({error});
    assert.equal(await result,null); assert.equal(c.getSnapshot().code,code); assert.ok(c.getSnapshot().error);
    const next=c.listen(); instances[1].result('ok'); assert.equal(await next,'ok'); c.dispose();
  }
});
test('no results, empty results and unsupported browser do not leave an indefinite listening state', async () => {
  const a=browser(); const p=a.c.listen(); a.instances[0].onend(); assert.equal(await p,null); assert.equal(a.c.getSnapshot().code,'NO_SPEECH'); a.c.dispose();
  const b=browser(); const q=b.c.listen(); b.instances[0].result(''); assert.equal(await q,null); assert.equal(b.c.getSnapshot().code,'NO_MATCH'); b.c.dispose();
  const d=browser({env:{SpeechRecognition:undefined}}); assert.equal(await d.c.listen(),null); assert.equal(d.c.getSnapshot().code,'UNSUPPORTED'); d.c.dispose();
});
test('watchdog releases microphone and suppresses late callbacks', async () => {
  const { c, instances, timers }=browser(); const result=c.listen(); [...timers.values()][0].fn();
  assert.equal(await result,null); assert.equal(c.getSnapshot().code,'TIMEOUT'); assert.equal(instances[0].aborted,true);
  instances[0].result('late'); assert.equal(c.getSnapshot().code,'TIMEOUT'); c.dispose();
});
test('dictation cancels TTS, ordinary speech cannot overlap listening, cue takes priority', async () => {
  const { c, instances, utterances }=browser(); const speech=c.speak('Réponse'); assert.equal(c.getSnapshot().phase,'speaking');
  const listen=c.listen(); assert.equal(await speech,null); assert.equal(await c.speak('Ne pas parler'),false); assert.equal(utterances.length,1);
  const cue=c.cue('3'); assert.equal(await listen,null); assert.equal(instances[0].aborted,true); assert.equal(utterances.length,2);
  assert.equal(await c.speak('Ne pas couvrir le chrono'),false); utterances[1].onend(); assert.equal(await cue,true); c.dispose();
});
test('active timer blocks dictation and test voice, but permits cues; pause unlocks microphone', async () => {
  const { c, instances, utterances }=browser(); c.setContext({profile:'elite',enabled:true,timerActive:true});
  assert.equal(await c.listen(),null); assert.equal(c.getSnapshot().code,'TIMER_ACTIVE'); assert.equal(instances.length,0);
  assert.equal(await c.speak('test',{test:true}),false);
  const cue=c.cue('Repos terminé'); utterances[0].onend(); assert.equal(await cue,true);
  c.setContext({profile:'elite',timerActive:false}); const result=c.listen(); instances[0].result('ok'); assert.equal(await result,'ok'); c.dispose();
});
test('profile change and background cancel capture; no cross-profile transcript or hidden speech', async () => {
  const { c, env, instances, listeners, utterances }=browser(); c.setContext({profile:'elite'});
  const first=c.listen(); c.setContext({profile:'emilie'}); assert.equal(await first,null); instances[0].result('Yanis'); assert.equal(c.getSnapshot().phase,'idle');
  const second=c.listen(); env.document.hidden=true; listeners.visibilitychange(); assert.equal(await second,null); assert.match(c.getSnapshot().detail,/arrière-plan/);
  assert.equal(await c.cue('1'),false); assert.equal(utterances.length,0); c.dispose(); assert.equal(Object.keys(listeners).length,0);
});
test('speech completes only on end; mute, errors and absent French voices are handled', async () => {
  const { c, utterances }=browser(); c.setContext({profile:'elite',enabled:true});
  assert.equal(await c.speak('silent',{enabled:false}),false);
  const first=c.speak('Bonjour'); assert.equal(c.getSnapshot().phase,'speaking'); utterances[0].onend(); assert.equal(await first,true);
  const second=c.speak('Stop'); c.setContext({profile:'elite',enabled:false}); assert.equal(await second,null);
  const third=c.speak('Error'); utterances[2].onerror(); assert.equal(await third,false); assert.equal(c.getSnapshot().code,'TTS_ERROR'); c.dispose();
  const b=browser({env:{speechSynthesis:{cancel(){},getVoices:()=>[{lang:'en-US'}]}}});
  assert.equal(await b.c.speak('Bonjour'),false); assert.equal(b.c.getSnapshot().code,'LANGUAGE_UNAVAILABLE'); b.c.dispose();
});
test('Android diagnostic never requests permission or assumes guaranteed offline', async () => {
  let listens=0; const { c }=android({listen:()=>{listens++;}}); const info=await c.diagnose();
  assert.equal(info.platform,'android'); assert.equal(listens,0); assert.equal(c.getSnapshot().phase,'idle'); c.dispose();
});
test('legacy Android plugin is rejected explicitly instead of pretending to provide new controls', async () => {
  for(const diagnostics of [async()=>({protocolVersion:1}),async()=>{throw {code:'UNIMPLEMENTED'};}]) {
    let listens=0; const { c }=android({diagnostics,listen:()=>{listens++;}});
    assert.equal(await c.listen(),null); assert.equal(c.getSnapshot().code,'UPDATE_REQUIRED'); assert.equal(listens,0); c.dispose();
  }
});
test('Android request IDs isolate native listening/processing callbacks', async () => {
  let args; const mock=android(); mock.native.listen=input=>{args=input;return mock.request.promise;};
  const result=mock.c.listen(); await tick();
  mock.event({requestId:'old',state:'listening'}); assert.equal(mock.c.getSnapshot().phase,'starting');
  mock.event({requestId:args.requestId,state:'listening'}); assert.equal(mock.c.getSnapshot().phase,'listening');
  mock.event({requestId:args.requestId,state:'processing'}); assert.equal(mock.c.getSnapshot().phase,'processing');
  mock.request.resolve({text:'Demande Android'}); assert.equal(await result,'Demande Android'); mock.c.dispose();
});
test('Android cancel while permission pending cannot accept late permission/results', async () => {
  const mock=android(); const result=mock.c.listen(); await tick(); mock.c.cancel();
  assert.equal(await result,null); mock.request.resolve({text:'late permission result'}); await tick();
  assert.equal(mock.c.getSnapshot().phase,'idle'); assert.ok(mock.cancelled()>0); mock.c.dispose();
});
test('Android permission denial, missing recognition and missing TTS language map to clear messages', async () => {
  const a=android({listen:async()=>{throw {code:'PERMISSION_DENIED'};}});
  assert.equal(await a.c.listen(),null); assert.equal(a.c.getSnapshot().code,'PERMISSION_DENIED'); a.c.dispose();
  const b=android({diagnostics:async()=>({protocolVersion:2,recognitionAvailable:false})});
  assert.equal(await b.c.listen(),null); assert.equal(b.c.getSnapshot().code,'SERVICE_UNAVAILABLE'); b.c.dispose();
  const d=android({diagnostics:async()=>({protocolVersion:2,ttsReady:true,frenchAvailable:false})});
  assert.equal(await d.c.speak('Bonjour'),false); assert.equal(d.c.getSnapshot().code,'LANGUAGE_UNAVAILABLE'); d.c.dispose();
});
test('late diagnostic cannot overwrite state of a newer listen or disposed controller', async () => {
  const pending=deferred(); const mock=android({diagnostics:()=>pending.promise}); const result=mock.c.diagnose(); mock.c.cancel();
  pending.resolve({protocolVersion:2}); assert.equal(await result,null); assert.equal(mock.c.getSnapshot().diagnostics,null);
  mock.c.dispose(); assert.equal(await mock.c.listen(),null);
});
test('error mapping distinguishes plugin compatibility and native timeouts', () => {
  assert.equal(errorCode({code:'UNIMPLEMENTED'}),'UPDATE_REQUIRED'); assert.equal(errorCode({code:'TIMEOUT'}),'TIMEOUT');
  assert.equal(errorCode({error:'not-allowed'}),'PERMISSION_DENIED');
});
