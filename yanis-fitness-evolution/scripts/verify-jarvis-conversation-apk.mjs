import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
if (!process.argv[2]) throw new Error('Chemin APK requis');
const apk=resolve(process.argv[2]);
const unzip=(...args)=>execFileSync('unzip',args,{maxBuffer:32*1024*1024}).toString();
const entries=unzip('-Z1',apk).split('\n');
if (entries.some(s=>s.includes('restoration/yanis-profile.json'))) throw new Error('JSON personnel présent dans l’APK public');
const html=unzip('-p',apk,'assets/public/index.html');
const script=html.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
if (!script) throw new Error('Bundle actif absent');
const js=unzip('-p',apk,`assets/public/${script[1]}`);
for (const marker of ["Comprends le français naturel", "Tu ne peux ni enregistrer, ni arrêter", "Vérifiez l’indicateur de sauvegarde", "Les clés de service IA ne sont pas incluses", "Enregistrez d’abord une sauvegarde séparée", "api.groq.com", "openrouter.ai"]) {
 if (!js.includes(marker)) throw new Error(`Fonction manquante du bundle : ${marker}`);
}
console.log('Conversation, arrêt, consignes d’import et export sans clés présents ; aucun profil personnel embarqué.');
