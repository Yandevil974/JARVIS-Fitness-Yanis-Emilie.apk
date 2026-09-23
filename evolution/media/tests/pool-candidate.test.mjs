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
const media=createPoolMedia({normalize,poolGuides:inventory.poolGuides});
const fn=(text,ast,name)=>{const n=ast.body.find(n=>n.id?.name===name);assert.ok(n);return text.slice(n.start,n.end)};
const freeze=o=>{Object.freeze(o);for(const v of Object.values(o))if(v&&typeof v==='object')freeze(v);return o};
test('requires exact complete 1.4.0 and refuses accidental double patching',()=>{
 assert.throws(()=>integrate(original+' '),/unchanged/);
 assert.throws(()=>integrate(candidate),/unchanged/);
 assert.equal(integrate(original),candidate);
});
test('every other top-level source statement is byte-identical, including home/catalog/7 stages/timer engine',()=>{
 function unchanged(text,ast){return ast.body.filter(n=>
  !['bg','v5','Kh','Z5','k5','JarvisReviewedMedia','JarvisReviewedView','createPoolMedia'].includes(n.id?.name)&&
  !n.declarations?.some(d=>d.id.name==='JarvisPoolMedia')).map(n=>text.slice(n.start,n.end));}
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
