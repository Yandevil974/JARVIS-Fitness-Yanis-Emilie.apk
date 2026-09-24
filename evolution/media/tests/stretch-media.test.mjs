// Verification des deux echanges de visuel d'etirement approuves le 23 septembre 2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
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
  // Aucun autre visuel d'etirement n'a bouge, aucun nom n'a ete renomme :
  // les seuls changements sont les deux echanges du 23 septembre et les quatre
  // dessins fideles du 24 septembre, tous enumeres nommement.
  const swap=JSON.parse(fs.readFileSync(new URL('../candidate/stretch-visuals-map.json',import.meta.url)));
  const attendus=['Main dans le dos','Pigeon assis',...swap.swaps.map(entry=>entry.name)];
  const changed=Object.keys(after).filter(k=>after[k]!==before[k]);
  assert.deepEqual(changed.sort(),attendus.sort());
  assert.deepEqual(Object.keys(after).sort(),Object.keys(before).sort());
});

test('les quatre etirements sans dessin fidele affichent la posture decrite dans la consigne',()=>{
  const swap=JSON.parse(fs.readFileSync(new URL('../candidate/stretch-visuals-map.json',import.meta.url)));
  const media=new URL('../../../.cache/media-pool-candidate/media/',import.meta.url).pathname;
  const vus=[];
  for(const entry of swap.swaps){
    // Ce que la 1.4.0 montrait : le dessin d'un AUTRE mouvement.
    assert.equal(before[entry.name],entry.before,'visuel de depart inattendu pour '+entry.name);
    assert.equal(after[entry.name],entry.after,'le paquet livre ne sert pas le nouveau dessin : '+entry.name);
    assert.notEqual(entry.before,entry.after,'aucun changement pour '+entry.name);
    // Le nouveau dessin est bien DANS le paquet construit, octet pour octet.
    const file=entry.after.replace('/media/','');
    const digest=swap.files[entry.after];
    assert.ok(digest,'empreinte manquante pour '+entry.after);
    assert.equal(sha256(fs.readFileSync(media+file)),digest,'dessin modifie : '+file);
    // 1376 x 768 comme les etirements deja livres, une seule posture fixe.
    const jpeg=fs.readFileSync(media+file);
    assert.deepEqual(jpegSize(jpeg),[1376,768],'cadre inattendu : '+file);
    // Le nom et la consigne restent ceux du paquet d'origine.
    assert.equal(Object.keys(after).includes(entry.name),true);
    vus.push(entry.name);
  }
  assert.deepEqual(vus.sort(),['Adduction de la hanche debout','Mains croisées derrière le dos','Mollet en escalier','Étirement des fléchisseurs']);
  // Les anciens dessins restent dans le paquet : ils servent a d'autres consignes.
  for(const path of ['/media/stretch-mollet-marche.jpg','/media/stretch-adduction-debout.jpg','/media/stretch-ep-arriere.jpg','/media/stretch-avb-flechisseurs.jpg'])
    assert.ok(assets.has(path),'dessin d origine disparu du paquet : '+path);
  // Aucun nom n'a ete renomme ni ajoute par ces echanges.
  assert.deepEqual(Object.keys(after).sort(),Object.keys(before).sort());
});

function sha256(buffer){return crypto.createHash('sha256').update(buffer).digest('hex');}
// Taille reelle du JPEG, lue dans son en-tete : un dessin d'etirement est une
// image fixe au meme cadre que celles deja livrees.
function jpegSize(buffer){
  let i=2;
  while(i<buffer.length){
    assert.equal(buffer[i],0xff,'en-tete JPEG invalide');
    const marker=buffer[i+1];
    const length=buffer.readUInt16BE(i+2);
    if(marker>=0xc0&&marker<=0xcf&&marker!==0xc4&&marker!==0xc8&&marker!==0xcc)
      return [buffer.readUInt16BE(i+7),buffer.readUInt16BE(i+5)];
    i+=2+length;
  }
  throw new Error('taille JPEG introuvable');
}
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
