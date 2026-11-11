// Vérifie le bundle réellement actif, les correspondances et les vidéos du dernier lot.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {EXERCISES} from '../src/data/library.js';
import {videoFor} from '../src/data/exercise-videos.js';
if (!process.argv[2]) throw new Error('Chemin APK requis');
const apk=resolve(process.argv[2]);
const unzip=entry=>execFileSync('unzip',['-p',apk,entry],{maxBuffer:32*1024*1024});
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const html=unzip('assets/public/index.html').toString();
const script=html.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
if (!script) throw new Error('Bundle actif absent');
const bundle=unzip(`assets/public/${script[1]}`).toString();
const cases=[
 ['hip-thrust-barre','hip-thrust-barre','9d8fa4feaa79e3fcf8b4f8dd087bfcd8361e7d4187ec1635f35dafd6abeeafa1'],
 ['fentes-bulgares-pied-arriere-sureleve','fentes-bulgares-poids-du-corps','433084125f58390f91112567563aba135c0652589a9a4dfa6802884e91d0c2b5'],
 ['fentes-marchees','fentes-avant-alternees','69f54c3187b03d0ef12be6a21d7cf1afe58bd0984509f5268b78c2bc25ea2e43'],
 ['goblet-squat','goblet-squat','ac3eab3406bdbb265efa60fcbef6ea6afb0087267f001a61fa19d9e47fa27a37'],
 ['step-up-haut','step-up-banc-poids-du-corps','037bc9e8f5021a5f1d9fd8da5458a34bc180b84be6390619bece9ecee079b693'],
 ['squat-cycliste','squat-cycliste-poids-du-corps','9fbe6167687736295f3f2df4aa6e74e0d575c347edf1595eab0ec3a44e8c96b9'],
 ['leg-extension','leg-extension','a72f04c17863417b6f4ed2271acbbf4402bbcac59453cff034036a0f0f2834bd'],
 ['bulgarian-split-squat-halteres','bulgarian-split-squat-halteres','21b7c46fb69f7e1ed7945176a59f1a69fbc18ffddc793ee17280c125d4dab7bc'],
 ['squat-au-poids-du-corps','squat-au-poids-du-corps','0c87c52b132dc4be91590d3383cc4028321bf5de6568a9e0e7f01cfd97953b44'],
];
for(const [id,name,expected] of cases){
 const ex=EXERCISES.find(e=>e.id===id), video=videoFor(ex);
 if(!ex || video?.src!==`/videos/${name}.mp4` || video.status!=='coached' || !video.coaching?.spoken || !video.coaching?.notice) throw new Error(`Association, statut ou coaching incorrects : ${id}`);
 for(const marker of [id,video.src,ex.gif]) if(!bundle.includes(marker)) throw new Error(`Donnée absente du bundle actif : ${marker}`);
 if(hash(unzip(`assets/public${video.src}`))!==expected || hash(readFileSync(`public${video.src}`))!==expected) throw new Error(`Vidéo différente de la source : ${id}`);
 for(const path of [video.poster,ex.gif]) if(hash(unzip(`assets/public${path}`))!==hash(readFileSync(`public${path}`))) throw new Error(`Poster ou GIF différent : ${id}`);
}
if(videoFor('fentes-barre')) throw new Error('Photo non générée comme vidéo ne doit pas être raccordée.');
console.log(`${cases.length} fiches récentes, vidéos identiques, posters, GIF et coaching vérifiés dans l’APK.`);
