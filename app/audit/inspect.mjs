import fs from 'node:fs';
import * as acorn from 'acorn';
for(const file of fs.readdirSync('/home/user/uploads').filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync('/home/user/uploads/'+file,'utf8');
 const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1])[0];
 const tree=acorn.parse(script,{ecmaVersion:'latest',locations:true});
 const inventory=tree.body.map(n=>({type:n.type,line:n.loc.start.line,end:n.loc.end.line, name:n.type==='FunctionDeclaration'?n.id.name:n.type==='VariableDeclaration'?n.declarations.map(d=>d.id.name).join(','):'',summary:script.slice(n.start,n.end).replace(/data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+/g,'[ASSET]').slice(0,200).replace(/\s+/g,' ')}));
 fs.writeFileSync('audit/'+file+'.ast.json',JSON.stringify(inventory,null,2));
 console.log('\n'+file+' '+tree.body.length+' top-level nodes. COMPLETE PARSE: OK');
 console.log(inventory.map(n=>`${n.line}-${n.end} ${n.type} ${n.name} ${n.type==='ExpressionStatement'?n.summary:''}`).join('\n'));
}
