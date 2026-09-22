import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { integrate as step1 } from '../../reminders/build.mjs';
import { integrate } from '../build.mjs';
import { config, patches, sha256 } from '../../../complete-hotfix/patch-web.mjs';
const reference=path.resolve('.cache/reference/assets/public');
const target=path.resolve(process.env.VOICE_WEB||'.cache/voice-web');
const file=config.bundle.path.replace('assets/public/','');
const original=fs.readFileSync(path.join(reference,file),'utf8');
const built=fs.readFileSync(path.join(target,file),'utf8');
const parseCode=s=>parse(s,{ecmaVersion:'latest',sourceType:'module'});
const tree=dir=>fs.readdirSync(dir,{recursive:true}).filter(f=>fs.statSync(path.join(dir,f)).isFile()).sort();

test('complete web inventory is identical; only the main bundle changes',()=>{
  const files=tree(reference);assert.deepEqual(tree(target),files);
  assert.deepEqual(files.filter(f=>sha256(fs.readFileSync(path.join(reference,f)))!==sha256(fs.readFileSync(path.join(target,f)))),[file]);
});
test('voice build is deterministic and rejects the wrong or already modified source',async()=>{
  assert.equal(await integrate(original),built);await assert.rejects(()=>integrate(built),/Unexpected APK/);await assert.rejects(()=>integrate(original+' '),/Unexpected APK/);
});
test('exactly five host functions change relative to the tested reminders build; every other original node is intact',async()=>{
  const before=await step1(original),a=parseCode(before).body,b=parseCode(built).body;
  // The only newly inserted nodes are the bundled extension and its instance.
  const filtered=b.filter(n=>!(n.type==='VariableDeclaration'&&n.declarations.some(d=>['JarvisVoiceModule','JarvisVoice'].includes(d.id.name))));
  assert.equal(a.length,filtered.length);const changes=[];
  for(let i=0;i<a.length;i++) if(before.slice(a[i].start,a[i].end)!==built.slice(filtered[i].start,filtered[i].end))changes.push(a[i].id?.name||a[i].type);
  assert.deepEqual(changes.sort(),['Ut','b5','T5','_5','I3'].sort());
});
test('timer fixes, native diagnostics gating and all reminder integration points remain',()=>{
  for(const patch of patches){
    // The timer observer audio sink is now priority-aware, not a change to its timer mechanics.
    assert.ok(built.includes(patch.after),patch.name);
  }
  for(const marker of ['JarvisFollowUp.Board','JarvisFollowUp.Observer','JarvisFollowUp.NotificationLink','JarvisVoice.Observer','JarvisVoice.Composer']) assert.ok(built.includes(marker),marker);
  const fn=name=>{const node=parseCode(built).body.find(n=>n.id?.name===name);return built.slice(node.start,node.end);};
  assert.ok(fn('b5').includes('JarvisVoice.cue('));assert.ok(!fn('b5').includes('Ut('));
  assert.ok(!fn('T5').includes('oh.listen'));assert.ok(!fn('Ut').includes('.catch(()=>{})'));
});
test('native permissions, registration and protocol methods are present without changing package identity',()=>{
  const root=new URL('../../../JARVIS-Fitness-Source/android/app/src/main/',import.meta.url);
  const manifest=fs.readFileSync(new URL('AndroidManifest.xml',root),'utf8');
  for(const marker of ['android.permission.RECORD_AUDIO','android.speech.RecognitionService','android.intent.action.TTS_SERVICE'])assert.ok(manifest.includes(marker));
  const java=fs.readFileSync(new URL('java/app/jarvis/fitness/JarvisSpeechPlugin.java',root),'utf8');
  for(const marker of ['diagnostics(PluginCall','cancelListen(PluginCall','stopSpeech(PluginCall','protocolVersion", 2','UtteranceProgressListener','SpeechRecognizer.createSpeechRecognizer','handleOnStop()','call != listening'])assert.ok(java.includes(marker),marker);
  assert.ok(!java.includes('startActivityForResult'));
  const main=fs.readFileSync(new URL('java/app/jarvis/fitness/MainActivity.java',root),'utf8');assert.ok(main.includes('registerPlugin(JarvisSpeechPlugin.class)'));
});
