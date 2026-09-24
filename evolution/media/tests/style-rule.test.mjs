// La regle de style n'est pas inventee : elle est mesuree dans le pack livre.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../review/'+p,import.meta.url)));
const metrics=read('STYLE-METRICS.json');
test('les trois familles de visuels du pack sont mesurees, pas supposees',()=>{
 const A=Object.values(metrics).filter(m=>m.size[0]===300&&m.size[1]===300);
 const B=Object.values(metrics).filter(m=>!(m.size[0]===300&&m.size[1]===300));
 assert.equal(A.length,36);
 assert.equal(B.length,40);
 // Famille A : fond blanc, trait noir, animation complete en 12 images.
 assert.ok(A.every(m=>m.bg==='#ffffff'));
 assert.ok(A.every(m=>m.frames>=8));
 // Cadrage : la mediane des marges est large meme si une image est plus serree.
 const med=a=>{const v=[...a].sort((x,y)=>x-y);return v[Math.floor(v.length/2)]};
 assert.ok(med(A.map(m=>m.marges[0]))>=20);
 assert.ok(med(A.map(m=>m.marges[2]))>=15);
 // Famille B : plein cadre, deux postures, palette riche.
 // Plein cadre : mediane des marges sous 10 px, meme si une image paysage est letterboxee.
 const medB=a=>{const v=[...a].sort((x,y)=>x-y);return v[Math.floor(v.length/2)]};
 assert.ok(medB(B.map(m=>m.marges[0]))<=6);
 const framesB=B.map(m=>m.frames);
 assert.ok(framesB.filter(f=>f===2).length>=B.length*0.7);
 assert.ok(B.filter(m=>m.colors>=60).length>=B.length*0.7);
});
test('la regle ecrite correspond aux mesures et reste a valider',()=>{
 const doc=fs.readFileSync(new URL('../review/REGLE-STYLE-MESUREE.md',import.meta.url),'utf8');
 for(const needle of ['300 × 300','12 images','3 px','43 / 30 / 25 / 15','#0a0e1a','144','viewBox 0 0 120 100'])
  assert.ok(doc.includes(needle),'mesure absente du document : '+needle);
 const findings=read('findings.json').findings;
 const g=findings.find(f=>f.id==='style-family-rule');
 assert.ok(g,'le groupe de decision de style doit exister');
 assert.equal(g.status,'open'); // rien n'est cree sans cette validation
 const gaps=read('GAPS-SANS-DESSIN.json');
 assert.equal(gaps.alias.total,27);
 assert.ok(gaps.tabataAuSol.sansDemonstrationDediee>=34);
 assert.equal(gaps.alias.sansDessinFideleDeLaVariante>0,true);
 assert.match(gaps.conclusion,/exigent une création/);
});
