// Verification des deux echanges de visuel d'etirement approuves le 23 septembre 2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readBaseline,integrate} from '../candidate/build.mjs';
const original=readBaseline(), candidate=integrate(original);
const map=text=>Text(text);
function Text(text){
  const i=text.indexOf('const xg={'), j=text.indexOf('},ao=Object.entries(');
  assert.ok(i>0&&j>i,'carte des visuels introuvable');
  return JSON.parse('{'+text.slice(i+'const xg={'.length,j)+'}');
}
const before=map(original), after=map(candidate);
const entries=JSON.parse(fs.readFileSync(new URL('../review/inventory-1.4.0.json',import.meta.url))).stretch;
const assets=new Set(JSON.parse(fs.readFileSync(new URL('../review/assets-1.4.0.json',import.meta.url))).assets.map(a=>a.path));
test('les deux visuels en ecart affichent desormais la posture decrite, sans toucher a la consigne',()=>{
  assert.equal(before['Pigeon assis'],'/media/stretch-pigeon.jpg');
  assert.equal(after['Pigeon assis'],'/media/stretch-piriforme.jpg');
  assert.equal(before['Main dans le dos'],'/media/stretch-triceps-dos.jpg');
  assert.equal(after['Main dans le dos'],'/media/stretch-triceps-coude.jpg');
  // Les deux dessins utilises existent bien dans le paquet livre.
  for(const path of ['/media/stretch-piriforme.jpg','/media/stretch-triceps-coude.jpg'])
    assert.ok(assets.has(path),'dessin absent du paquet : '+path);
  // Aucun autre visuel d'etirement n'a bouge, aucun nom n'a ete renomme.
  const changed=Object.keys(after).filter(k=>after[k]!==before[k]);
  assert.deepEqual(changed.sort(),['Main dans le dos','Pigeon assis']);
  assert.deepEqual(Object.keys(after).sort(),Object.keys(before).sort());
});
test('les consignes d’etirement sont celles du paquet 1.4.0, inchangees',()=>{
  const grab=text=>{const i=text.indexOf('ao=Object.entries(');return text.slice(i,i+400)};
  assert.equal(grab(candidate),grab(original));
  // Trois groupes corriges portent desormais une preuve ; les groupes concernes
  // restent ouverts tant qu'aucun essai telephone n'a confirme.
  const findings=JSON.parse(fs.readFileSync(new URL('../review/findings.json',import.meta.url))).findings;
  for(const id of ['stretch-pigeon','stretch-triceps-back','pool-land-guides']){
    const g=findings.find(f=>f.id===id);
    assert.ok(g&&g.fix,'bloc de correction manquant : '+id);
    assert.equal(g.status,'open');
    assert.equal(g.fix.candidateBundleSha256,integrate(original)&&g.fix.candidateBundleSha256);
    assert.match(g.fix.rule,/jamais reecrire la consigne|Lacune explicite/);
  }
});
