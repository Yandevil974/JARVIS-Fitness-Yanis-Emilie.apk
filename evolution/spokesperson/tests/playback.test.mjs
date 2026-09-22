import test from 'node:test';
import assert from 'node:assert/strict';
import { createVoiceController } from '../../voice/controller.mjs';
import { browserVoices } from '../../voice/playback.mjs';
function mock(extra={}) {
  const spoken=[],recognizers=[];
  const voices=[{voiceURI:'fr-local',name:'Locale française',lang:'fr-FR',localService:true},{voiceURI:'fr-network',name:'Français distant',lang:'fr-CA',localService:false},{voiceURI:'en',name:'English',lang:'en-US'}];
  const env={ speechSynthesis:{cancel(){},getVoices:()=>voices,speak:u=>spoken.push(u)},SpeechSynthesisUtterance:class{constructor(t){this.text=t;}},
    SpeechRecognition:class{constructor(){recognizers.push(this);}start(){this.onstart();}abort(){this.onend();}},document:{hidden:false,addEventListener(){},removeEventListener(){}} };
  const c=createVoiceController({env,...extra});c.setContext({profile:'elite',enabled:true});
  return {c,spoken,voices,recognizers,env};
}
test('French voice list has stable platform IDs and flags remote voices without promising offline',()=>{
  const {c,env}=mock();const options=browserVoices(env.speechSynthesis);assert.equal(options.length,2);assert.equal(options[1].networkRequired,true);c.dispose();
});
test('chosen browser voice and rate are applied; countdown keeps normal rate',async()=>{
  const {c,spoken}=mock();c.setPlaybackPreferences({rate:1.2,voiceIds:{browser:'fr-network'}},'elite');
  const first=c.speak('Bonjour');assert.equal(spoken[0].rate,1.2);assert.equal(spoken[0].voice.voiceURI,'fr-network');spoken[0].onend();assert.equal(await first,true);
  const cue=c.cue('3');assert.equal(spoken[1].rate,0.98);spoken[1].onend();await cue;c.dispose();
});
test('silent mode prevents replies, timer cues and diagnostic speech but still allows explicit dictation',async()=>{
  const {c,spoken,recognizers}=mock();c.setPlaybackPreferences({silent:true},'elite');
  assert.equal(await c.speak('Réponse'),false);assert.equal(await c.cue('3'),false);assert.equal(await c.speak('Test',{test:true}),false);
  assert.equal(c.getSnapshot().code,'SILENT');assert.equal(spoken.length,0);
  const mic=c.listen();assert.equal(recognizers.length,1);c.cancel();await mic;c.dispose();
});
test('profile-bound settings cannot leak voices or speech between profiles',async()=>{
  const {c,spoken}=mock();c.setPlaybackPreferences({rate:1.2,voiceIds:{browser:'fr-network'}},'elite');
  c.setContext({profile:'emilie'});assert.equal(await c.speak('Pas avec les réglages de Yanis'),false);
  c.setPlaybackPreferences({},'emilie');const next=c.speak('Bonjour Émilie');assert.equal(spoken[0].rate,0.98);assert.equal(spoken[0].voice.voiceURI,'fr-local');spoken[0].onend();await next;c.dispose();
});
test('voice removed from the device fails visibly, without silently selecting another voice',async()=>{
  const {c,spoken}=mock();c.setPlaybackPreferences({voiceIds:{browser:'deleted'}},'elite');
  assert.equal(await c.speak('Bonjour'),false);assert.equal(c.getSnapshot().code,'VOICE_UNAVAILABLE');assert.equal(spoken.length,0);c.dispose();
});
test('automatic greeting cannot interrupt speech; cancelling its owner cannot stop a priority cue',async()=>{
  const {c,spoken}=mock();const first=c.speak('Réponse');assert.equal(await c.speak('Accueil',{onlyIfIdle:true,owner:'greeting'}),false);
  spoken[0].onend();await first;const greeting=c.speak('Accueil',{owner:'greeting'});const cue=c.cue('1');assert.equal(await greeting,null);
  c.cancelOwner('greeting');assert.equal(c.getSnapshot().phase,'speaking');spoken.at(-1).onend();await cue;c.dispose();
});
test('changing playback preferences stops a current utterance',async()=>{
  const {c}=mock();const speech=c.speak('Bonjour');c.setPlaybackPreferences({silent:true},'elite');assert.equal(await speech,null);assert.equal(c.getSnapshot().phase,'idle');c.dispose();
});
test('native voice/rate options require advertised support; compatible bridge receives selected values',async()=>{
  for(const version of [undefined,1]){
    let request;
    const native={ diagnostics:async()=>({protocolVersion:2,ttsReady:true,frenchAvailable:true,voiceOptionsVersion:version,voices:[{id:'fr-native',lang:'fr-FR'}]}),
      cancelListen:async()=>{},stopSpeech:async()=>{},addListener:async()=>({remove(){}}),speak:async options=>{request=options;} };
    const {c}=mock({native,isAndroid:()=>true});c.setPlaybackPreferences({rate:1.1,voiceIds:{android:'fr-native',browser:'ignore-this'}},'elite');
    const success=await c.speak('Bonjour');if(version){assert.equal(success,true);assert.equal(request.voiceId,'fr-native');assert.equal(request.rate,1.1);}else{assert.equal(success,false);assert.equal(c.getSnapshot().code,'UPDATE_REQUIRED');assert.equal(request,undefined);}c.dispose();
  }
});
