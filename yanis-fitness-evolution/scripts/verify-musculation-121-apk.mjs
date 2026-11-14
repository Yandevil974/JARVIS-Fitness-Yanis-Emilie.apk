// Vérifier le bundle actif et les vidéos reçues depuis l'APK 1.20, sans transcoder.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {videoFor} from '../src/data/exercise-videos.js';
if(!process.argv[2]) throw new Error('Chemin APK requis');
const apk=resolve(process.argv[2]);
const unzip=p=>execFileSync('unzip',['-p',apk,p],{maxBuffer:32*1024*1024});
const sha=b=>createHash('sha256').update(b).digest('hex');
const html=unzip('assets/public/index.html').toString();
const js=html.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
if(!js) throw new Error('Bundle actif introuvable');
const bundle=unzip('assets/public/'+js[1]).toString();
const videos=['back-squat','drop-lunges-fentes-sautees','hack-squat','leg-curl-allonge','leg-press-unilateral','leg-press','souleve-terre-roumain-barre-provisoire','souleve-terre-roumain-halteres','split-squat-barbell-pied-avant-sureleve','split-squat-poulie-basse','stretch-cobra','stretch-enfant','stretch-epaule-bras-croise','stretch-quadriceps-debout','stretch-triceps-coude','good-morning-debout'];
for (const name of videos) {
 const path=`/videos/${name}.mp4`,poster=`/videos/posters/${name}.jpg`;
 for(const p of [path,poster]) if(sha(unzip('assets/public'+p))!==sha(readFileSync('public'+p))) throw new Error(`Média absent ou différent : ${p}`);
 if(!bundle.includes(path)) throw new Error(`Vidéo absente du bundle actif : ${path}`);
}
for (const id of ['good-morning-debout','souleve-de-terre-roumain-halteres','souleve-de-terre-roumain-barre','souleve-de-terre-roumain-barre-test-3-5-reps','leg-curl-allonge','leg-curl-machine','leg-curl-machine-ou-swiss-ball-leg-curl']){
 const video=videoFor(id);if(!video || video.status!=='coached' || !bundle.includes(id) || !bundle.includes(video.src)) throw new Error('Correspondance absente : '+id);
}
for(const marker of ['JARVIS est prêt.', 'Accueil vocal à l’ouverture', '1.21.0']) if(!bundle.includes(marker)) throw new Error('Accueil vocal absent du bundle actif : '+marker);
console.log(`${videos.length} clips et posters identiques, associations musculation et accueil vocal vérifiés dans l'APK.`);
