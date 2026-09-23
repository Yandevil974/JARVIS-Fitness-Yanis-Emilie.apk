// Candidate tests, kept separate from characterization of the untouched APK.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {parse} from '../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import {createPoolMedia} from '../candidate/pool-context.mjs';
import {readBaseline,integrate,prepare,root,baseline,sha} from '../candidate/build.mjs';
const inventory=JSON.parse(fs.readFileSync(new URL('../review/inventory-1.4.0.json',import.meta.url)));
const original=readBaseline(), candidate=integrate(original);
const opts={ecmaVersion:'latest',sourceType:'module'};
const tree=parse(original,opts), patched=parse(candidate,opts);
const ge=original.slice(original.indexOf('const Ge='),original.indexOf(',uh=',original.indexOf('const Ge=')))+';';
const normalize=vm.runInNewContext(ge+'Ge');
const reviewedTexts=JSON.parse(fs.readFileSync(new URL('../candidate/pool-texts.json',import.meta.url))).entries;
const media=createPoolMedia({normalize,poolGuides:inventory.poolGuides,reviewedTexts});
const fn=(text,ast,name)=>{const n=ast.body.find(n=>n.id?.name===name);assert.ok(n);return text.slice(n.start,n.end)};
const freeze=o=>{Object.freeze(o);for(const v of Object.values(o))if(v&&typeof v==='object')freeze(v);return o};
test('requires exact complete 1.4.0 and refuses accidental double patching',()=>{
 assert.throws(()=>integrate(original+' '),/unchanged/);
 assert.throws(()=>integrate(candidate),/unchanged/);
 assert.equal(integrate(original),candidate);
});
test('every other top-level source statement is byte-identical, including home/catalog/7 stages/timer engine',()=>{
 function unchanged(text,ast){return ast.body.filter(n=>
  !['bg','v5','Kh','Z5','k5','JarvisReviewedMedia','JarvisReviewedView','createPoolMedia','Bg','a5','$5','j5','JarvisTechnique','createWarmupMedia','G4','JarvisStepGuide','Mg'].includes(n.id?.name)&&
  !n.declarations?.some(d=>['JarvisPoolMedia','JarvisWarmupMedia'].includes(d.id.name))).map(n=>text.slice(n.start,n.end));}
 assert.deepEqual(unchanged(candidate,patched),unchanged(original,tree));
});
test('420 pool protocol steps cannot resolve to cardio and inputs never change',()=>{
 const input=freeze(structuredClone(inventory.poolProtocols));let count=0;
 for(const protocol of input)for(const level of protocol.levels)for(const step of level.steps){
  const result=media.resolve(step,{type:'swim'});assert.ok(result);
  assert.ok(!result.path?.includes('/cardio-'),step.name);
  if(result.path)assert.equal(result.status,'legacy-association-not-yet-validated');
  count++;
 }
 assert.equal(count,420);assert.deepEqual(input,inventory.poolProtocols);
});
test('generic aquatic recovery is an explicit gap, not a fabricated posture or cardio fallback',()=>{
 for(const name of ['Récupération active','Récup active','Récupération','Repos']){
  const result=media.resolve({name,img:'/media/cardio-recup-active.jpg'},{type:'swim'});
  assert.equal(result.path,null);assert.equal(result.status,'unresolved');
 }
});
test('step segment wins over overall type; unknown mixed context is not guessed',()=>{
 for(const segment of ['cardio','post','transition','unknown'])assert.equal(media.resolve({name:'Récup active',segment},{type:'swim'}),null);
 for(const type of ['hiit','warmup','rest','recovery','source-combo'])assert.equal(media.resolve({name:'Récup active'},{type}),null);
 assert.ok(media.resolve({name:'Récup active',segment:'pool'},{type:'source-combo'}));
 assert.ok(media.resolve({name:'Récup active'},{type:'aqua'}));
});
test('persisted wrong images are replaced for explicit aquatic instructions without mutating timer data',()=>{
 for(const profile of ['elite','emilie']){
  const timer=freeze({profile,steps:[{name:'Récup active — marche aquatique',seconds:45,img:'/media/cardio-recup-active.jpg',segment:'pool'}],meta:{type:'source-combo'},index:0,remaining:22,paused:true});
  const before=JSON.stringify(timer);const result=media.resolve(timer.steps[0],timer.meta);
  assert.equal(result.path,'/media/pool-marche-aquatique.jpg');assert.equal(JSON.stringify(timer),before);
 }
});
test('integrated bg removes pool→cardio fallthrough while preserving all non-pool legacy results',()=>{
 const code=fs.readFileSync(new URL('../candidate/pool-context.mjs',import.meta.url),'utf8').replace('export function','function');
 const ctx=vm.createContext({bl:inventory.poolGuides,If:inventory.cardioGuides});
 vm.runInContext(ge+code+';const JarvisPoolMedia=createPoolMedia({normalize:Ge,poolGuides:bl});'+fn(original,tree,'bg').replace('function bg(','function oldBg(')+fn(candidate,patched,'bg'),ctx);
 assert.equal(vm.runInContext('bg("Récup active","pool")',ctx),null);
 for(const segment of ['cardio','post','transition',undefined])for(const name of ['Récupération active','Fractionné soutenu','Échauffement elliptique','Transition','Retour au calme elliptique']){
  ctx.name=name;ctx.segment=segment;assert.equal(vm.runInContext('JSON.stringify(bg(name,segment))===JSON.stringify(oldBg(name,segment))',ctx),true);
 }
});
test('web candidate changes exactly one of 272 packaged files; delivered APK is untouched',()=>{
 const {directory}=prepare();
 const entries=JSON.parse(execFileSync('python3',['-c',
  'import sys,zipfile,json,hashlib;z=zipfile.ZipFile(sys.argv[1]);print(json.dumps({n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if n.startswith("assets/public/") and not n.endswith("/")}))',root+baseline.apk]).toString());
 assert.equal(Object.keys(entries).length,272);
 const changed=Object.entries(entries).filter(([name,digest])=>sha(fs.readFileSync(directory+'/'+name.replace('assets/public/','')))!==digest).map(([name])=>name);
 assert.deepEqual(changed,[baseline.bundle]);
 assert.equal(sha(fs.readFileSync(root+baseline.apk)),baseline.apkSha256);
});

test('only the two explicitly reviewed IDs change across all 209 exercise resolutions',()=>{
 const eo=new Map(inventory.exercises.filter(e=>e.resolved).map(e=>[e.id,{path:e.resolved.path,name:e.resolved.name,level:e.resolved.level}]));
 const context=vm.createContext({eo});
 vm.runInContext(fn(original,tree,'Kh').replace('function Kh(','function oldKh(')+fn(candidate,patched,'JarvisReviewedMedia')+fn(candidate,patched,'Kh'),context);
 const changed=[];
 for(const exercise of inventory.exercises){
  context.exercise=freeze(structuredClone(exercise));
  const result=vm.runInContext('[oldKh(exercise),Kh(exercise)]',context);
  if(JSON.stringify(result[0])!==JSON.stringify(result[1]))changed.push(exercise.id);
 }
 assert.deepEqual(changed.sort(),['french-press-barre-ez','pont-fessier-au-sol-activation']);
 context.exercise={id:'pont-fessier-au-sol-activation'};
 assert.equal(vm.runInContext('Kh(exercise).path',context),'/media/8eecb0152081ff26.gif');
 context.exercise={id:'glute-bridge-pieds-sur-banc'};
 assert.equal(vm.runInContext('Kh(exercise).path',context),'/media/0766d3a06bf79dc8.gif');
 context.exercise={id:'unknown',name:'Pont fessier au sol — activation'};
 assert.equal(vm.runInContext('Kh(exercise)',context),null);
 assert.equal(vm.runInContext('Kh(null)',context),null);
});


test('library view copies change only reviewed GIF fields and never mutate frozen catalog entries',()=>{
 const ctx=vm.createContext({});
 vm.runInContext(fn(candidate,patched,'JarvisReviewedMedia')+fn(candidate,patched,'JarvisReviewedView'),ctx);
 let changed=0;
 for(const exercise of inventory.exercises){
  ctx.exercise=freeze(structuredClone(exercise));const before=JSON.stringify(ctx.exercise);
  const view=vm.runInContext('JarvisReviewedView(exercise)',ctx);
  if(['french-press-barre-ez','pont-fessier-au-sol-activation'].includes(exercise.id)){
   changed++;assert.notEqual(view,ctx.exercise);
   assert.equal(view.gif,exercise.id==='french-press-barre-ez'?'/media/ea226c444f72de0f.gif':'/media/8eecb0152081ff26.gif');
   const {gif,...rest}=view,{gif:old,...originalRest}=ctx.exercise;assert.deepEqual(rest,originalRest);
  }else assert.equal(view,ctx.exercise);
  assert.equal(JSON.stringify(ctx.exercise),before);
 }
 assert.equal(changed,2);
 for(const input of [null,undefined,{id:'unknown',name:'French press barre EZ'}, {name:'Pont fessier au sol — activation'}]){
  ctx.exercise=input;assert.equal(vm.runInContext('JarvisReviewedView(exercise)',ctx),input);
 }
});
test('library and rest widget integrations are limited to reviewed display lookup, not data or controls',()=>{
 assert.equal(fn(candidate,patched,'Z5').replace('b.slice(0,y).map(JarvisReviewedView).map(k=>','b.slice(0,y).map(k=>'),fn(original,tree,'Z5'));
 assert.equal(fn(candidate,patched,'k5').replace('img:((b=JarvisReviewedMedia(y))==null?void 0:b.path)||y.gif||','img:y.gif||'),fn(original,tree,'k5'));
});
test('every reviewed pool prescription of the delivered program resolves aquatic, never dry', () => {
 // The two defects reproduced after a real phone test: these texts landed on the
 // dry elliptical because their block is declared pool but keeps segment 'post'.
 assert.ok(reviewedTexts.length>=12);
 for(const entry of reviewedTexts){
  // 'pool' is what the corrected preview now passes for a pool-format block,
  // including the after-weights block whose steps kept segment 'post'.
  const step={name:entry.text,seconds:1200,kind:'work',pattern:'swim',segment:'pool'};
  const meta={type:'source-combo',name:'Piscine après musculation',components:[{key:'post',format:'pool'}]};
  const result=media.resolve(step,meta);
  assert.ok(result,entry.text);
  assert.ok(result.path?.startsWith('/media/pool-'),entry.text+' -> '+result.path);
  assert.ok(!/cardio-(recup-active|elliptique|transition)/.test(result.path),entry.text);
  assert.ok(!result.path.includes('recovery-human'),entry.text);
  assert.equal(result.status,'reviewed-pool-prescription');
  assert.equal(media.guide(entry.text).t,entry.guide);
 }
 // The same texts keep the delivered dry resolution inside a real land block.
 for(const name of ['Récupération active','Fractionné soutenu','Retour au calme elliptique'])
  assert.equal(media.resolve({name,segment:'post'},{type:'source-combo',components:[{key:'post',format:'elliptical'}]}),null);
});
test('integrated preview routes a pool-format block through the aquatic context only', () => {
 const code=fs.readFileSync(new URL('../candidate/pool-context.mjs',import.meta.url),'utf8').replace('export function','function');
 const ctx=vm.createContext({bl:inventory.poolGuides,If:inventory.cardioGuides});
 vm.runInContext(ge+code+';const JarvisPoolMedia=createPoolMedia({normalize:Ge,poolGuides:bl,reviewedTexts:'+JSON.stringify(reviewedTexts)+'});'+
  fn(candidate,patched,'bg')+fn(candidate,patched,'JarvisStepGuide'),ctx);
 const detail="25 min de piscine : nage souple ou aquagym. Récupération active sans impact après une séance jambes chargée.";
 ctx.detail=detail;
 assert.equal(vm.runInContext('JarvisStepGuide(detail,"pool").img',ctx),'/media/pool-nage-douce.jpg');
 assert.equal(vm.runInContext('JarvisStepGuide(detail,"post")',ctx).img,'/media/cardio-recup-active.jpg');
 assert.match(fn(candidate,patched,'G4'),/JarvisStepGuide\(k\.name,w\.format==="pool"\?"pool":k\.segment\)/);
 assert.match(fn(candidate,patched,'v5'),/JarvisPoolMedia\.resolve\(f,p\.meta\)/);
});
test('shipped alias map is recorded and never silently changed by the candidate', () => {
 const extractText=text=>{const i=text.indexOf('const Z4={');return new Function(text.slice(i,text.indexOf(',Y4=',i))+'\nreturn Z4;')();};
 const extract=file=>extractText(fs.readFileSync(file,'utf8'));
 const registry=JSON.parse(fs.readFileSync(new URL('../review/alias-substitutions.json',import.meta.url)));
 const published=extractText(original);
 assert.equal(Object.keys(published).length,registry.aliasEntryCount);
 assert.equal(registry.exerciseWithoutOwnDrawing,registry.rows.length);
 assert.equal(registry.rows.filter(r=>r.triage==='name-unrelated').length,25);
 assert.deepEqual(extract(root+'/.cache/media-pool-candidate/assets/index-CBCies4k.js'),published);
});
test('every name-unrelated alias carries an individual decision and closes no group', () => {
 const registry=JSON.parse(fs.readFileSync(new URL('../review/alias-substitutions.json',import.meta.url)));
 const review=JSON.parse(fs.readFileSync(new URL('../review/alias-review.json',import.meta.url)));
 const frames=JSON.parse(fs.readFileSync(new URL('../review/alias-target-frames.json',import.meta.url)));
 const assets=new Set(JSON.parse(fs.readFileSync(new URL('../review/assets-1.4.0.json',import.meta.url))).assets.map(a=>a.path));
 const findingsGroups=JSON.parse(fs.readFileSync(new URL('../review/findings.json',import.meta.url))).findings.filter(f=>f.status==='open');
 const unrelated=registry.rows.filter(r=>r.triage==='name-unrelated').map(r=>r.id).sort();
 assert.deepEqual(Object.keys(review.decisions).sort(),unrelated);
 assert.equal(review.reviewedCount,25);
 assert.equal(review.groupsClosed,0);
 assert.equal(review.summary.targetDrawingsSharedWithARealExercise,16);
 for(const [id,decision] of Object.entries(review.decisions)){
  const exercise=inventory.exercises.find(e=>e.id===id);
  assert.equal(decision.name,exercise.name);
  assert.ok(assets.has(decision.targetDrawing),id);
  assert.ok(decision.reason.length>60,id);
  assert.ok(decision.evidence.length>10,id);
  assert.ok(decision.decision.endsWith('kept-open')||decision.decision==='resolved-by-reviewed-override',id);
  assert.equal(decision.groupClosed,false);
  assert.ok(new Set(findingsGroups.flatMap(f=>f.exercises||[])).has(id),'untracked after review: '+id);
 }
 assert.equal(frames.clipCount,5);
 assert.equal(frames.reviewedFrameCount,10);
 for(const clip of frames.clips){
  assert.equal(clip.frameCount,2);
  assert.deepEqual(clip.reviewedFrameIndices,[0,1]);
  assert.ok(clip.frames.every(f=>/^[a-f0-9]{64}$/.test(f.rgbaSha256)));
  assert.equal(clip.assetSha256,JSON.parse(fs.readFileSync(new URL('../review/assets-1.4.0.json',import.meta.url))).assets.find(a=>a.path===clip.path).sha256);
  assert.equal(clip.finalAccepted,false);
 }
});
test('the 94 packaged drawings are all reviewed at least once, and reviewing is not validating', () => {
 const assets=JSON.parse(fs.readFileSync(new URL('../review/assets-1.4.0.json',import.meta.url))).assets;
 const pass=JSON.parse(fs.readFileSync(new URL('../review/never-reviewed.json',import.meta.url)));
 const short=JSON.parse(fs.readFileSync(new URL('../review/short-focus.json',import.meta.url)));
 const long=JSON.parse(fs.readFileSync(new URL('../review/long-animations.json',import.meta.url)));
 const alias=JSON.parse(fs.readFileSync(new URL('../review/alias-target-frames.json',import.meta.url)));
 const findings=JSON.parse(fs.readFileSync(new URL('../review/findings.json',import.meta.url))).findings;
 const gifs=assets.filter(a=>a.path.endsWith('.gif')).map(a=>a.path);
 const covered=new Set([...short.clips,...long.clips,...alias.clips,...pass.clips].map(c=>c.path));
 assert.equal(gifs.length,94);
 assert.deepEqual(gifs.filter(p=>!covered.has(p)),[]);
 assert.equal(pass.clipCount,30);
 assert.equal(pass.reviewedFrameCount,60);
 assert.equal(pass.coverage.stillUnreviewed.length,0);
 for(const clip of pass.clips){
  assert.equal(clip.frameCount,2);
  assert.deepEqual(clip.reviewedFrameIndices,[0,1]);
  assert.ok(clip.frames.every(f=>/^[a-f0-9]{64}$/.test(f.rgbaSha256)));
  assert.equal(clip.assetSha256,assets.find(a=>a.path===clip.path).sha256);
  assert.ok(clip.observedMovement.length>40,clip.path);
  assert.ok(['consistent','variant-to-confirm','partial-mismatch','mismatch-kept-open'].includes(clip.verdict),clip.path);
  // Reviewed never means validated: nothing is finally accepted, and mismatches
  // must stay tracked by an open finding instead of being closed.
  assert.equal(clip.finalAccepted,false);
  if(clip.verdict!=='consistent')
   assert.ok(clip.usedFor.some(id=>findings.some(f=>f.status==='open'&&(f.exercises||[]).includes(id))),clip.path);
 }
});
