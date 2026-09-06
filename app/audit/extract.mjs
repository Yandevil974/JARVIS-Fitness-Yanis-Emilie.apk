import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import * as acorn from 'acorn';
fs.mkdirSync('public/media',{recursive:true});
fs.mkdirSync('src/data',{recursive:true});
const all={};
const manifest=[];
for(const file of fs.readdirSync('/home/user/uploads').filter(f=>f.endsWith('.html'))){
 const source=fs.readFileSync('/home/user/uploads/'+file,'utf8');
 const scripts=[...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 const code=scripts[0];
 const ast=acorn.parse(code,{ecmaVersion:'latest',locations:true});
 const id=file.startsWith('Emilie')?'emilie':'elite';
 const variables=ast.body.filter(n=>n.type==='VariableDeclaration'&&n.declarations.every(d=>/^[A-Z][A-Z_0-9]*$/.test(d.id.name)));
 const names=variables.flatMap(n=>n.declarations.map(d=>d.id.name));
 const funcs=ast.body.filter(n=>n.type==='FunctionDeclaration');
 // No source event handlers, init functions, page scripts, network calls or UI are executed.
 const ctx=vm.createContext({Date,console:{log(){}}});
 const selected=[...funcs,...variables].map(n=>code.slice(n.start,n.end)).join('\n');
 vm.runInContext(selected+'\n globalThis.result = {'+names.join(',')+',defaults:defaultState()};',ctx,{timeout:2000});
 const replacer=(key,value)=>{
  if(value instanceof RegExp)return {regex:value.source,flags:value.flags};
  if(typeof value==='string'){
   return value.replace(/data:([\w/+.-]+);base64,([A-Za-z0-9+/=]+)/g,(whole,mime,b64)=>{
    const buf=Buffer.from(b64,'base64');const hash=crypto.createHash('sha256').update(buf).digest('hex').slice(0,16);
    const ext=({ 'image/gif':'gif','image/jpeg':'jpg','image/png':'png' })[mime]||'bin';
    const path='media/'+hash+'.'+ext;
    if(!fs.existsSync('public/'+path))fs.writeFileSync('public/'+path,buf);
    manifest.push({source:id,key,path,bytes:buf.length});return '/'+path;
   });
  }
  return value;
 };
 const dat=JSON.parse(JSON.stringify(ctx.result,replacer));
 if(dat.EMBEDDED_PHOTOS){
  for(const [slot,views] of Object.entries(dat.EMBEDDED_PHOTOS)){
   for(const [view,b64] of Object.entries(views)){
    if(typeof b64==='string'&&b64.length>1000&&!b64.startsWith('/media/')){
     const buf=Buffer.from(b64,'base64');const path='media/'+id+'-'+slot+'-'+view+'.jpg';
     fs.writeFileSync('public/'+path,buf);views[view]='/'+path;
    }
   }
  }
 }
 all[id]=dat;
 fs.writeFileSync('audit/'+id+'-function-analysis.json',JSON.stringify(funcs.map(n=>{
  const text=code.slice(n.start,n.end);
  const mutations=[...new Set([...text.matchAll(/state\.([\w.]+)/g)].map(m=>m[1]))];
  const calls=[...new Set([...text.matchAll(/\b([a-zA-Z_$][\w$]*)\s*\(/g)].map(m=>m[1]))];
  return {name:n.id.name,start:n.loc.start.line,end:n.loc.end.line,bytes:text.length,stateAccess:mutations,calls};
 }),null,2));
 console.log(id,names.length,'data constants;',funcs.length,'functions;',Object.keys(dat.PROGRAM).length,'program phases;', Object.keys(dat.MUSCU_GUIDES||{}).length,'guides;',JSON.stringify(dat.defaults));
 const fnInventory=funcs.map(n=>`| \`${n.id.name}\` | ${n.loc.start.line}–${n.loc.end.line} | ${code.slice(n.start,n.end).match(/state\.[a-zA-Z.]+/g)?.filter((v,i,a)=>a.indexOf(v)===i).slice(0,8).join(', ')||'—'} |`).join('\n');
 fs.writeFileSync('audit/'+id+'-functions.md',`# Inventaire exhaustif — ${file}\n\nEmpreinte SHA-256 : ${crypto.createHash('sha256').update(source).digest('hex')}\n\n${source.length.toLocaleString('fr')} caractères lus. ${scripts.length} blocs script analysés. Les blocs Cloudflare ajoutés en fin de fichier ne sont pas transférés (aucune fonction sportive).\n\n| Fonction | Lignes du script principal | État consulté/modifié |\n|---|---|---|\n`+fnInventory);
}
fs.writeFileSync('src/data/legacy.json',JSON.stringify(all));
fs.writeFileSync('audit/media-manifest.json',JSON.stringify(manifest,null,2));
console.log('Extracted',manifest.length,'asset references,',fs.readdirSync('public/media').length,'unique media files.');
