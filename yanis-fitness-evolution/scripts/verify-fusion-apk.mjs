// Contrôles des ressources actives : le formulaire fusionné ne doit pas être un ancien bundle.
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
if (!process.argv[2]) throw new Error('Chemin APK requis');
const apk = resolve(process.argv[2]);
const unzip = entry => execFileSync('unzip', ['-p', apk, entry], { maxBuffer: 32 * 1024 * 1024 }).toString();
const index = unzip('assets/public/index.html');
const script = index.match(/<script[^>]+src="\.\/([^\"]+\.js)"/);
const style = index.match(/<link[^>]+href="\.\/([^\"]+\.css)"/);
if (!script || !style) throw new Error('Bundle actif introuvable');
const js = unzip(`assets/public/${script[1]}`);
const css = unzip(`assets/public/${style[1]}`);
for (const marker of ['Saisie de la série', 'workout-set-entry', 'Charge réalisée', 'Répétitions réalisées', 'RIR et note de série', 'Valider la série', 'Recommandation enregistrée', 'Estimation indépendante', 'Hausse initiale auto']) {
  if (!js.includes(marker)) throw new Error(`Élément du formulaire ou décision absent : ${marker}`);
}
if (!css.includes('.training-command .workout-set-entry')) throw new Error('Style de la saisie fusionnée absent');
console.log('Formulaire fusionné et libellés de décision présents dans le bundle actif de l’APK.');
