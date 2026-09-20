import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from '../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { integrate, prepare } from '../build.mjs';
import { integrate as voice } from '../../voice/build.mjs';
import { config, sha256 } from '../../../complete-hotfix/patch-web.mjs';
const apk=path.resolve('.cache/reference/base.apk');
const original=execFileSync('python3',['-c','import zipfile,sys;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))',apk,config.bundle.path],{maxBuffer:8*1024*1024}).toString();
const before=await voice(original),after=await integrate(original);
function declarations(text){return new Map(parse(text,{ecmaVersion:'latest',sourceType:'module'}).body.flatMap(n=>{const names=n.type==='FunctionDeclaration'?[n.id.name]:n.type==='VariableDeclaration'?n.declarations.map(d=>d.id?.name).filter(Boolean):[];return names.map(name=>[name,text.slice(n.start,n.end)]);}));}
test('stage 3 conserves every previous declaration except the dashboard and observer insertion',()=>{
  const next=declarations(after),changed=[];for(const [name,text] of declarations(before)){assert.ok(next.has(name),name);if(next.get(name)!==text)changed.push(name);}
  assert.deepEqual(changed.sort(),['I3','t2']);assert.ok(next.has('JarvisSpokesperson'));assert.ok(next.has('JarvisVoice'));assert.ok(next.has('JarvisFollowUp'));
});
test('all complete screens, local team metadata, timers and store are byte-identical to stage 2',()=>{
  const a=declarations(before),b=declarations(after);
  for(const name of ['P4','Rg','Sg','Qg','N5','G3','Q5','b5','Ut','_5','T5','We','oo']){assert.ok(a.has(name),name);assert.equal(b.get(name),a.get(name),name);}
});
test('building is deterministic and rejects an unknown reference APK',async()=>{
  assert.equal(sha256(await integrate(original)),sha256(after));await assert.rejects(()=>integrate(original+'\n'),/Unexpected APK bundle/);
});
test('only one web bundle changes; no private fixture, model call or native packaging claim is introduced',async()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'jarvis-spokesperson-'));
  try{
    const web=path.join(folder,'web');await prepare(apk,web);
    const expected=config.bundle.path.replace('assets/public/','');
    assert.equal(sha256(fs.readFileSync(path.join(web,expected))),sha256(after));
    const changed=JSON.parse(execFileSync('python3',['-c',`import zipfile,sys,json,pathlib
z=zipfile.ZipFile(sys.argv[1]); w=pathlib.Path(sys.argv[2]); changed=[]; count=0
for n in z.namelist():
 if n.startswith('assets/public/') and not n.endswith('/'):
  count+=1
  p=w/n.removeprefix('assets/public/')
  if p.read_bytes()!=z.read(n): changed.append(str(p.relative_to(w)))
assert count==272
assert len([p for p in w.rglob('*') if p.is_file()])==272
print(json.dumps(changed))`,apk,web],{encoding:'utf8'}));
    assert.deepEqual(changed,[expected]);assert.equal(JSON.parse(fs.readFileSync(path.join(folder,'spokesperson-build-report.json'))).signedApkProduced,false);
    const ui=fs.readFileSync(new URL('../Board.jsx',import.meta.url),'utf8');assert.doesNotMatch(ui,/fetch\(|\.listen\(|DOC-20260919/);
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
});
