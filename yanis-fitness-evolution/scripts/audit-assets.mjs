import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const publicDir = path.join(root, 'public');
const text = fs.readdirSync(path.join(root, 'src'), {recursive:true}).filter(f=>/\.(js|jsx|json)$/.test(f)).map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const refs = [...text.matchAll(/\/media\/[^"'` )}]+/g)].map(m=>m[0]).filter(p=>p !== '/media/');
const unique=[...new Set(refs)]; const missing=unique.filter(p=>!fs.existsSync(path.join(publicDir,p)));
console.log(`Assets référencés: ${unique.length}`); console.log(`Assets manquants: ${missing.length}`); missing.forEach(x=>console.log(`MISSING ${x}`));
if(missing.length) process.exitCode=1;
