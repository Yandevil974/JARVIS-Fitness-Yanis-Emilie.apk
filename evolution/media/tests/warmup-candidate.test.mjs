import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from '../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import {readBaseline,integrate} from '../candidate/build.mjs';
import {createWarmupMedia} from '../candidate/warmup-context.mjs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../'+n,import.meta.url)));
const inventory=read('review/inventory-1.4.0.json');
const overrides=read('candidate/association-overrides.json').overrides;
const technique=read('candidate/technique-overrides.json').overrides;
const original=readBaseline(),candidate=integrate(original);
const tree=s=>parse(s,{ecmaVersion:'latest',sourceType:'module'});
const ast=tree(original),patched=tree(candidate);
const fn=(s,a,name)=>{const n=a.body.find(n=>n.id?.name===name);assert.ok(n);return s.slice(n.start,n.end)};
const json=o=>JSON.parse(JSON.stringify(o));
const freeze=o=>{if(o&&typeof o==='object'){Object.freeze(o);for(const v of Object.values(o))freeze(v);}return o;};
// Les identifiants revus : les deux du paquet plus les variantes produites
// (alias-visuals-map.json), relues telles qu'elles sont livrees.
const variantes=read('candidate/alias-visuals-map.json').variantes;
const reviewedMedia=e=>overrides.find(o=>o.id===e?.id)||variantes.find(v=>v.id===e?.id)||null;
const media=createWarmupMedia({reviewedMedia});
const activation=()=>({name:'Activation fessiers',seconds:60,pattern:'bridge',img:'/media/warmup-mobilite.jpg',instruction:'Ponts fessiers au sol, 10 répétitions contrôlées.'});
const meta={type:'warmup',name:'Échauffement guidé'};

test('exact legacy activation is fixed without rewriting its persisted instruction, duration or timer fields',()=>{
 for(const name of ['Échauffement guidé','Échauffement spécifique']){
  const timer=freeze({steps:[activation()],meta:{...meta,name},index:0,remaining:27,elapsed:19,paused:true});
  const before=JSON.stringify(timer),view=media.view(timer.steps[0],timer.meta);
  assert.equal(view.img,'/media/8eecb0152081ff26.gif');assert.notEqual(view,timer.steps[0]);
  assert.deepEqual({...view,img:timer.steps[0].img},timer.steps[0]);assert.equal(JSON.stringify(timer),before);
 }
});
test('warmup repair rejects vague labels, different prescriptions, pool/Tabata/stretch/rest and conflicting segments',()=>{
 const step=freeze(activation());
 for(const type of ['swim','aqua','source-combo','hiit','rest',undefined])assert.equal(media.view(step,{...meta,type}),step);
 for(const name of ['Étirements guidés','Échauffement personnalisé',''])assert.equal(media.view(step,{...meta,name}),step);
 for(const change of [{name:'Activation fessier'},{instruction:'Hip thrust sur banc, 10 répétitions.'},{pattern:'squat'},{seconds:45},{segment:'pool'},{segment:'cardio'},{exerciseId:'glute-bridge-pieds-sur-banc'}]){
  const different=freeze({...step,...change});assert.equal(media.view(different,meta),different);
 }
 assert.equal(media.view(null,meta),null);
});
test('approach resolution requires its own reviewed ID and role, never a current workout or generic image guess',()=>{
 for(const o of [...overrides,...variantes]){
  const step=freeze({name:'Approche 1 · 20 kg',seconds:60,instruction:'10 répétitions faciles à environ 50 % de la charge de travail connue. Repos selon le besoin.',exerciseId:o.id,mediaRole:'approach',img:'/media/warmup-series-approche.jpg'});
  assert.equal(media.view(step,meta).img,o.path);
  for(const change of [{exerciseId:'front-squat'},{exerciseId:undefined},{mediaRole:undefined},{name:'Repos'}]){
   const other={...step,...change};assert.equal(media.view(other,meta),other);
  }
 }
 const legacy={name:'Approche 1 · 20 kg',img:'/media/warmup-series-approche.jpg'};
 assert.equal(media.view(legacy,{...meta,workoutId:'a-current-workout'}),legacy);
});
test('all 209 warmups retain exact instructions, durations, approach percentages and rounding; only reviewed images/identity differ',()=>{
 const context=vm.createContext({
  ze:id=>inventory.exercises.find(e=>e.id===id),ho:()=>({weight:40}),
  cl:(v,inc)=>Math.floor(v/inc)*inc,
  Jn:{route:'/media/warmup-route.jpg',mobilite:'/media/warmup-mobilite.jpg',approche:'/media/warmup-series-approche.jpg'}
 });
 vm.runInContext(fn(candidate,patched,'JarvisReviewedMedia')+fn(original,ast,'Bg').replace('function Bg(','function oldBg(')+fn(candidate,patched,'Bg'),context);
 let checked=0;
 for(const exercise of inventory.exercises)for(const load of [0,37,null])for(const increment of [0.5,2.5]){
  context.profile=freeze({user:{increment}});context.session=freeze({exercises:[{exerciseId:exercise.id,targetLoad:load}]});
  const before=JSON.stringify([context.profile,context.session]);
  const [old,newer]=json(vm.runInContext('[oldBg(profile,session),Bg(profile,session)]',context));
  assert.equal(newer.length,6);assert.equal(newer.reduce((n,s)=>n+s.seconds,0),480);
  for(let n=0;n<6;n++){
   const {img,exerciseId,mediaRole,...rest}=newer[n],{img:oldImg,...oldRest}=old[n];
   assert.deepEqual(rest,oldRest);
   if(n===2&&['qua','isc','fes','moy'].includes(exercise.muscle))assert.equal(img,overrides[0].path);
   else if(n>=3&&reviewedMedia(exercise))assert.equal(img,reviewedMedia(exercise).path);
   else assert.equal(img,oldImg);
   if(n>=3){assert.equal(exerciseId,exercise.id);assert.equal(mediaRole,'approach');}
  }
  assert.equal(JSON.stringify([context.profile,context.session]),before);checked++;
 }
 assert.equal(checked,1254);
});
test('only floor-bridge technique changes; generic bridge, all other IDs and all non-step fields stay intact',()=>{
 const declaration=ast.body.flatMap(n=>n.declarations||[]).find(d=>d.id.name==='Yu');assert.ok(declaration);
 const program=ast.body.flatMap(n=>n.declarations||[]).find(d=>d.id.name==='cg');assert.ok(program);
 const context=vm.createContext({});vm.runInContext('const lt={elite:'+original.slice(program.init.start,program.init.end)+'};const Yu='+original.slice(declaration.init.start,declaration.init.end)+';'+fn(candidate,patched,'JarvisTechnique'),context);
 let changed=0;
 for(const exercise of inventory.exercises){
  context.exercise=freeze(exercise);
  const [old,newer]=vm.runInContext('[Yu[exercise.pattern]||Yu.static,JarvisTechnique(exercise)]',context);
  if(exercise.id==='pont-fessier-au-sol-activation'){
   changed++;assert.deepEqual(json(newer.etapes),technique[0].etapes);
   assert.deepEqual(json({...newer,etapes:old.etapes}),json(old));assert.match(newer.etapes[2],/2 secondes/);
   assert.doesNotMatch(newer.etapes.join(' '),/banc|charge protégée/);
  }else assert.equal(newer,old);
 }
 assert.equal(changed,1);assert.ok(original.includes(JSON.stringify(technique[0].sourceNote)));
 assert.match(vm.runInContext('Yu.bridge.etapes[0]',context),/banc/);
});
test('technique integration keeps source-note priority and both warmup buttons carry approach identity',()=>{
 assert.equal(fn(candidate,patched,'a5').replace('f=JarvisTechnique(p),h=ft.filter(','f=Yu[p.pattern]||Yu.static,h=ft.filter('),fn(original,ast,'a5'));
 assert.equal(fn(candidate,patched,'$5').replace('U=JarvisTechnique(m)','U=Yu[m.pattern]'),fn(original,ast,'$5'));
 assert.equal(fn(candidate,patched,'j5').replace('instruction:x.instruction,img:x.img,pattern:x.pattern,exerciseId:x.exerciseId,mediaRole:x.mediaRole}','instruction:x.instruction,img:x.img,pattern:x.pattern}'),fn(original,ast,'j5'));
});
