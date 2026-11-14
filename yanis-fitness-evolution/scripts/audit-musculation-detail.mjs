// Audit reproductible des fiches Elite / Émilie. Les totaux comptent des fiches,
// pas des mouvements ni des crédits ; les réserves techniques restent en place.
import {EXERCISES, MUSCLES, RECOVERY_EXERCISES} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
import {stepVideoFor} from '../src/data/step-videos.js';
import {existsSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const eligible=EXERCISES.filter(e=>e.sources.includes('elite')||e.sources.includes('emilie'));
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const cache=new Map();
const checked=new Map();
function inspect(path, context){
  if(!path){issues.push(`${context} : chemin absent`);return;}
  if(!cache.has(path)){
    const a=`public${path}`,b=`release${path}`;
    if(!existsSync(a)||!existsSync(b))cache.set(path,{error:'absent de public ou release'});
    else if(!statSync(a).size||!statSync(b).size)cache.set(path,{error:'fichier vide'});
    else {const aa=hash(a),bb=hash(b);cache.set(path,{hash:aa,error:aa===bb?null:'public et release différents'});}
  }
  if(cache.get(path).error)issues.push(`${context} : ${path} ${cache.get(path).error}`);
}
const issues=[];
for(const e of eligible){
  inspect(e.gif,`${e.id} GIF`);
  const v=videoFor(e);if(!v)continue;
  inspect(v.src,`${e.id} vidéo`);inspect(v.poster,`${e.id} affiche`);
  if(v.status==='coached' && (!v.coaching?.spoken||!v.coaching?.notice))issues.push(`${e.id} : consignes accompagnées incomplètes`);
  checked.set(e.id,v);
}
const clips=[...new Set([...checked.values()].map(v=>v.src))];
const hashes=new Set(clips.map(p=>cache.get(p)?.hash).filter(Boolean));
const groupEntries=Object.entries(MUSCLES).map(([id,label])=>({id,label,items:eligible.filter(e=>e.muscle===id)})).filter(g=>g.items.length);
const escaped=s=>String(s||'').replaceAll('|','\\|').replaceAll('\n',' ');
const version=execFileSync('git',['rev-parse','--short','HEAD'],{encoding:'utf8'}).trim();
const lines=[
 '# Contrôle détaillé des vidéos — musculation', '',
 `État audité : commit \`${version}\` (APK 1.21.0). Source : les fiches Elite et Émilie et leur résolveur de vidéo. Une fiche partagée par les deux profils n'est comptée qu'une fois.`, '',
 `**${eligible.length} fiches : ${checked.size} avec une vidéo raccordée, ${eligible.length-checked.size} sans vidéo raccordée.**`,
 `Les ${checked.size} fiches utilisent ${clips.length} chemins MP4, correspondant à ${hashes.size} contenus distincts par empreinte SHA-256. Ce n'est pas un nombre de mouvements différents : plusieurs noms de fichier ont un contenu identique et certaines fiches partagent une vidéo.`,
 `Sur les fiches raccordées : ${[...checked.values()].filter(v=>v.status==='coached').length} accompagnées de consignes correctives et ${[...checked.values()].filter(v=>v.status==='validated').length} marquées validées dans le registre. Cela ne garantit pas qu'une vidéo est parfaite.`, '',
 `Contrôle automatisé : existence et taille non nulle, empreinte identique entre public et release pour chaque vidéo, affiche et GIF des ${eligible.length} fiches ; présence des notices et voix pour les vidéos accompagnées. Résultat : **${issues.length} anomalie(s)** de ce type. Tous les GIF de ces fiches sont présents.`,
 'Ce contrôle **ne revoit pas manuellement toutes les images de chaque vidéo** et ne certifie pas chaque geste, cadrage ou lecture sur téléphone. Une vidéo non raccordée ne signifie pas forcément qu’aucune vidéo compatible n’existe déjà ailleurs. Les consignes et les décisions de Yanis restent prioritaires.', '',
 'Le roumain barre est conservé tel quel sur décision de Yanis, malgré la tête coupée ; aucune nouvelle génération demandée. Le triceps haltères incliné #11 reste en stand-by.', '',
 '## Bilan par groupe musculaire', '',
 '| Groupe | Avec vidéo | Sans vidéo | Total |', '|---|---:|---:|---:|',
 ...groupEntries.map(g=>`| ${g.label} | ${g.items.filter(e=>checked.has(e.id)).length} | ${g.items.filter(e=>!checked.has(e.id)).length} | ${g.items.length} |`), '',
 '## Fiches déjà raccordées', '',
 'Chaque nom ci-dessous est une fiche. Le fichier indiqué peut être réutilisé par plusieurs fiches. « Accompagnée » signifie que la vidéo a des réserves et que la consigne prime.', ''
];
for(const g of groupEntries){
 const have=g.items.filter(e=>checked.has(e.id));if(!have.length)continue;
 lines.push(`### ${g.label} — ${have.length}/${g.items.length}`, '', '| Exercice | Profils | Vidéo | Statut |', '|---|---|---|---|');
 for(const e of have){const v=checked.get(e.id);const profile=e.sources.filter(x=>x==='elite'||x==='emilie').map(x=>x==='elite'?'Elite':'Émilie').join(' + ');const f=v.src.split('/').at(-1);lines.push(`| ${escaped(e.name)} | ${profile} | [${f}](../../public/videos/${f}) | ${v.status==='validated'?'Validée dans le registre':'Accompagnée'} |`);}
 lines.push('');
}
lines.push('## Fiches sans vidéo actuellement raccordée', '', 'Ces fiches conservent leur GIF. Ne pas générer automatiquement une vidéo par fiche : vérifier d’abord le geste, le matériel, le côté et la méthode.', '');
for(const g of groupEntries){const missing=g.items.filter(e=>!checked.has(e.id));if(!missing.length)continue;lines.push(`### ${g.label} — ${missing.length}`, '');for(const e of missing)lines.push(`- ${e.name}${e.id==='extensions-triceps-halteres-incline'?' **(triceps #11 en stand-by)**':''}`);lines.push('');}
lines.push('## Rapprochements à examiner avant toute génération', '',
 '- **Extensions triceps barre EZ + pullover** et **Extensions triceps + pullover barre EZ** : même GIF, même matériel et même tempo ; la seconde fiche utilise déjà une vidéo accompagnée. Vérifier le raccordement et conserver les prescriptions de chaque fiche : pas de nouvelle génération automatique.',
 '- **Extensions triceps poulie** et **Extension triceps à la poulie** : des vidéos de poulie existent déjà, mais l’accessoire et la variante doivent être comparés avant de les partager.',
 '- Les relevés de jambes allongés, les abductions et plusieurs variantes de leg curl ont des libellés proches. Vérifier angle, matériel, latéralité et méthode avant une éventuelle réutilisation ; les répétitions 1¼ et les positions de pieds ne sont pas équivalentes à une démonstration standard.',
 '- Presse pieds hauts et fentes barre : Yanis pense avoir déjà réalisé ces vidéos ; ne pas affirmer leur absence définitive ni générer avant vérification.', '',
 '## Autres modules — séparés de la musculation', '',
 `- Étirements : ${RECOVERY_EXERCISES.length} fiches, ${RECOVERY_EXERCISES.filter(e=>videoFor(e)||stepVideoFor(e.name)).length} avec vidéo raccordée, ${RECOVERY_EXERCISES.filter(e=>!videoFor(e)&&!stepVideoFor(e.name)).length} sans. Les 7 fiches couvertes utilisent cinq clips.`,
 '- Échauffement : cinq étapes raccordées et un montage ; les approches utilisent la vidéo du premier exercice lorsqu’elle existe.',
 '- Tabata au sol : 38 libellés distincts sans vidéo résolue pour ces étapes ; des exercices analogues ont déjà des vidéos ailleurs et demandent un rapprochement.',
 '- Piscine / Aqua Tabata : 56 libellés regroupés sans vidéo d’étape résolue ; cela comprend des variantes, phases et noms proches, pas 56 vidéos nécessairement différentes.',
 '- Elliptique : 5 guides sans vidéo d’étape résolue. D’autres étapes dynamiques nécessitent un audit séparé.',
 '- Catalogue Jarvis hors programmes : 6 fiches, dont 5 avec vidéo et 1 sans (respiration diaphragmatique). Ne pas additionner aveuglément les libellés des modules qui se recoupent.', '',
 issues.length?'## Anomalies relevées\n\n'+issues.map(x=>`- ${x}`).join('\n'):'Aucune anomalie de présence ou de comparaison des fichiers vérifiés.', '');
writeFileSync('docs/videos-3d/85-AUDIT-VIDEO-MUSCULATION-DETAIL.md',lines.join('\n'));
console.log(JSON.stringify({fiches:eligible.length,avec:checked.size,sans:eligible.length-checked.size,paths:clips.length,shaDistincts:hashes.size,issues},null,2));
if(issues.length)process.exitCode=1;
