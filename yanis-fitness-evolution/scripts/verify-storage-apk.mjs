import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
if(!process.argv[2]) throw new Error('Chemin APK requis');
const apk=resolve(process.argv[2]);
const unzip=entry=>execFileSync('unzip',['-p',apk,entry],{maxBuffer:32*1024*1024}).toString();
const html=unzip('assets/public/index.html');
const script=html.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
if(!script) throw new Error('Bundle actif absent');
const js=unzip(`assets/public/${script[1]}`);
for(const marker of ['Contrôler une sauvegarde JSON sans l’importer','Choisir le JSON à contrôler','Sauvegarde non validée','Aucun import ni remplacement','Enregistrement refusé','Enregistrement local indisponible'])
 if(!js.includes(marker)) throw new Error(`Contrôle stockage absent : ${marker}`);
for(const marker of ['kickback-a-l-elastique','fentes-avant-alternees','glute-bridge-en-1-5-reps'])
 if(!js.includes(marker)) throw new Error(`Fiche vidéo absente : ${marker}`);
console.log('Diagnostic local, messages de sauvegarde et fiches fessiers présents dans le bundle actif.');
