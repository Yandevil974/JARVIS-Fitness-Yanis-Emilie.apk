// CANDIDATE WEB ONLY. Extends the exact signed 1.4.0; never writes an APK.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
export const root = fileURLToPath(new URL('../../../', import.meta.url));
export const baseline = JSON.parse(fs.readFileSync(new URL('../baseline.json', import.meta.url)));
export const sha = value => createHash('sha256').update(value).digest('hex');
export function once(text, before, after) {
  if (text.split(before).length !== 2) throw Error('Missing or ambiguous integration point: '+before.slice(0,90));
  return text.replace(before, () => after);
}
// Animations humaines aquatiques produites pour les guides mesures, verifiees
// une par une en pleine image avant livraison.
export const providedAnimations = fs.existsSync(new URL('./pool-animations-map.json', import.meta.url))
  ? JSON.parse(fs.readFileSync(new URL('./pool-animations-map.json', import.meta.url))).map : {};

export function readBaseline() {
  const apk = path.join(root, baseline.apk);
  if (sha(fs.readFileSync(apk)) !== baseline.apkSha256) throw Error('Wrong APK baseline');
  const source = execFileSync('python3', ['-c',
    'import sys,zipfile;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))',
    apk, baseline.bundle], {maxBuffer: 10*1024*1024}).toString();
  if (sha(source) !== baseline.bundleSha256) throw Error('Wrong bundle baseline');
  return source;
}
export function verifyPoolTexts(source) {
  // Evaluate the delivered JSON literals exactly as the app does: they embed
  // escaped SVG/CSS strings, so the raw template text is not plain JSON.
  const payloads = [...source.matchAll(/=JSON\.parse\((`[^`]*`)\)/g)]
    .map(match => new Function('return JSON.parse(' + match[1] + ')')());
  const entries = JSON.parse(fs.readFileSync(new URL('./pool-texts.json', import.meta.url))).entries;
  const deliveredGuides = payloads.flatMap(payload => payload.POOL_GUIDES || []);
  const audited = JSON.parse(fs.readFileSync(new URL('../review/inventory-1.4.0.json', import.meta.url))).poolGuides;
  const assets = JSON.parse(fs.readFileSync(new URL('../review/assets-1.4.0.json', import.meta.url))).assets;
  for (const entry of entries) {
    if (!/^(exact|representative)$/.test(entry.precision) || !entry.review) throw Error('Unreviewed pool text '+entry.text);
    const delivered = payloads.some(payload => JSON.stringify(payload).includes(JSON.stringify(entry.text)));
    if (!delivered) throw Error('Pool text absent from the delivered program: ' + entry.text);
    const title = deliveredGuides.find(candidate => candidate.t === entry.guide);
    if (!title) throw Error('Aquatic guide absent from the delivered payload: ' + entry.guide);
    const resolved = audited.find(candidate => candidate.t === entry.guide);
    if (!resolved?.img) throw Error('Unknown aquatic guide for reviewed pool text: ' + entry.guide);
    if (title.img != null && title.img !== resolved.img) throw Error('Reviewed guide image disagrees with the payload: ' + entry.guide);
    if (!assets.some(asset => asset.path === resolved.img)) throw Error('Reviewed pool guide has no decoded asset: ' + resolved.img);
  }
  const guides = new Set(entries.map(entry => entry.guide));
  for (const required of ['Marche aquatique','Nage douce'])
    if (!guides.has(required)) throw Error('Reviewed pool coverage missing: ' + required);
  return entries;
}
export function integrate(source) {
  if (sha(source) !== baseline.bundleSha256) throw Error('Requires unchanged 1.4.0; rejects unknown/already patched input');
  const start = source.indexOf('function v5('), end = source.indexOf('function w5(', start);
  if (start < 0 || end <= start) throw Error('Timer boundaries missing');
  const oldTimer = source.slice(start, end);
  let timer = once(oldTimer, 'f=p.steps[p.index],h=', 'f=p.steps[p.index],poolMedia=JarvisPoolMedia.resolve(f,p.meta),h=');
  // Regle demandee : en contexte TERRE, jamais de guide aquatique. Le chrono
  // guidé gardait un repli sur les guides aquatiques (consignes du mouvement)
  // et transmettait le nom de l'etape au visuel sans verifier le contexte :
  // 4 des 38 noms du Tabata au sol (gainage planche, battements de jambes,
  // montees de genoux, marche sur place) affichaient alors un guide aquatique
  // dans un enchainement au sol. Le contexte est celui deja resolu pour la
  // piscine (JarvisPoolMedia) : true = aquatique, false = terre. Aucun nom,
  // aucune duree, aucune consigne n'est modifie ; l'affichage aquatique reste
  // identique dans un protocole aquatique.
  timer = once(timer, 'x=bl.find(w=>w.k.some(b=>Ge(f.name).includes(Ge(b))))',
    'x=poolMedia?poolMedia.guide:null');
  timer = once(timer, 's.jsx(gi,{movementName:f.name,pattern:f.pattern||"breathe",small:!0,controls:!1})',
    's.jsx(gi,{movementName:poolMedia?f.name:void 0,pattern:f.pattern||"breathe",small:!0,controls:!1})');
  const first = '!p.done&&(f.img?', last = ')),s.jsx("p",{children:f.instruction';
  const a = timer.indexOf(first), b = timer.indexOf(last, a);
  if (a < 0 || b <= a) throw Error('Timer visual boundaries missing');
  const visual = timer.slice(a+'!p.done&&('.length, b+1);
  const imageEnd = visual.indexOf(':s.jsx(gi,');
  if (imageEnd < 0) throw Error('Timer image branch missing');
  const image = visual.slice('f.img?'.length, imageEnd).replaceAll('f.img', 'poolMedia.path');
  const gap = 's.jsx("p",{className:"media-audit-gap",role:"status",children:"Visuel aquatique correspondant à vérifier. Aucun autre exercice affiché."})';
  const replacement = `!p.done&&(poolMedia?(poolMedia.path?${image}:${gap}):(${visual}))`;
  timer = timer.slice(0,a) + replacement + timer.slice(b+2);
  source = source.slice(0,start) + timer + source.slice(end);
  const helper = fs.readFileSync(new URL('./pool-context.mjs', import.meta.url),'utf8')
    .replace('export function createPoolMedia', 'function createPoolMedia');
  const reviewedTexts = verifyPoolTexts(source);
  source = once(source, 'function bg(i,o){', `${helper}\nconst JarvisPoolMedia=createPoolMedia({normalize:Ge,poolGuides:bl,reviewedTexts:${JSON.stringify(reviewedTexts)},providedAnimations:${JSON.stringify(providedAnimations)}});\nfunction JarvisStepGuide(i,o){return o==="pool"?JarvisPoolMedia.guide(i):bg(i,o)}\nfunction bg(i,o){if(o==="pool")return JarvisPoolMedia.guide(i);`);
  // The pool block prescribed after the weights session is declared by its
  // block format, not by the step segment it kept from the HTML import.
  source = once(source, 'const E=bg(k.name,k.segment)',
    'const E=JarvisStepGuide(k.name,w.format==="pool"?"pool":k.segment)');
  // Explicit reviewed IDs only. Never infer a substitute by muscle or similar name.
  const overrides = JSON.parse(fs.readFileSync(new URL('./association-overrides.json',import.meta.url))).overrides;
  const inventory = JSON.parse(fs.readFileSync(new URL('../review/inventory-1.4.0.json',import.meta.url)));
  const assets = JSON.parse(fs.readFileSync(new URL('../review/assets-1.4.0.json',import.meta.url)));
  const ids = new Set();
  const cases = overrides.map(entry => {
    const exercise = inventory.exercises.find(e=>e.id===entry.id);
    const asset = assets.assets.find(a=>a.path===entry.path);
    if (ids.has(entry.id) || exercise?.name !== entry.name || exercise?.resolved?.path !== entry.baselinePath ||
        asset?.sha256 !== entry.assetSha256 || entry.level !== 'exact') throw Error('Unverified media override '+entry.id);
    ids.add(entry.id);
    return `if(i&&i.id===${JSON.stringify(entry.id)})return ${JSON.stringify({path:entry.path,name:entry.name,level:entry.level})};`;
  }).join('');
  source = once(source,'function Kh(i){return i!=null&&i.id&&eo.get(i.id)||null}',
    `function JarvisReviewedMedia(i){${cases}return null}
function JarvisReviewedView(i){const media=JarvisReviewedMedia(i);return media?{...i,gif:media.path}:i}
function Kh(i){return JarvisReviewedMedia(i)||i!=null&&i.id&&eo.get(i.id)||null}`);
  // View-only copies: keep all original catalog entries and saved workout data intact.
  source = once(source,'b.slice(0,y).map(k=>', 'b.slice(0,y).map(JarvisReviewedView).map(k=>');
  source = once(source,'img:y.gif||((b=Kh(y))==null?void 0:b.path)||y.img||null',
    'img:((b=JarvisReviewedMedia(y))==null?void 0:b.path)||y.gif||((b=Kh(y))==null?void 0:b.path)||y.img||null');
  const technique = JSON.parse(fs.readFileSync(new URL('./technique-overrides.json',import.meta.url))).overrides;
  const techniqueIds = new Set();
  const techniqueCases = technique.map(entry => {
    const exercise = inventory.exercises.find(e=>e.id===entry.id);
    if (techniqueIds.has(entry.id) || exercise?.name !== entry.name || !source.includes(JSON.stringify(entry.sourceNote)) ||
        entry.etapes?.length !== 3 || !entry.etapes.every(t=>typeof t==='string'&&t.length>20)) throw Error('Unverified technique '+entry.id);
    techniqueIds.add(entry.id);
    return `if(i&&i.id===${JSON.stringify(entry.id)})return {...base,etapes:${JSON.stringify(entry.etapes)}};`;
  }).join('');
  source = once(source,'function a5({id:i}){',
    `function JarvisTechnique(i){const base=Yu[i?.pattern]||Yu.static;${techniqueCases}return base}
function a5({id:i}){`);
  source = once(source,'f=Yu[p.pattern]||Yu.static,h=ft.filter(', 'f=JarvisTechnique(p),h=ft.filter(');
  source = once(source,'U=Yu[m.pattern]', 'U=JarvisTechnique(m)');
  // Same rule for the timer: a component declared as pool gives its steps the
  // aquatic segment instead of the "post" they inherited from the HTML import.
  source = once(source, 'l.push(...c.customSteps.map(u=>({...u,segment:c.key})))',
    'l.push(...c.customSteps.map(u=>({...u,segment:c.format===\"pool\"?"pool":c.key})))');
  // The preview list must select the same steps the builder just labelled.
  source = once(source, 'p.filter(k=>k.segment===(w.key==="post"?"post":w.key))',
    'p.filter(k=>k.segment===(w.format==="pool"?"pool":w.key==="post"?"post":w.key))');
  const warmupHelper = fs.readFileSync(new URL('./warmup-context.mjs',import.meta.url),'utf8')
    .replace('export function createWarmupMedia','function createWarmupMedia');
  source = once(source,'function Bg(i,o){',
    `${warmupHelper}
const JarvisWarmupMedia=createWarmupMedia({reviewedMedia:JarvisReviewedMedia});
function Bg(i,o){`);
  source = once(source,'pattern:p?"bridge":"row",img:Jn.mobilite',
    'pattern:p?"bridge":"row",img:p?JarvisReviewedMedia({id:"pont-fessier-au-sol-activation"}).path:Jn.mobilite');
  source = once(source,'img:Jn.approche,instruction:',
    'img:(JarvisReviewedMedia(l)||{}).path||Jn.approche,exerciseId:l?.id,mediaRole:"approach",instruction:');
  // Affichage herite : dans la modale de seance combinee, chaque ligne d'etape
  // affichait la duree brute en secondes (« 1500 s ») alors que le bloc annonce
  // « 25 min » et que le chrono de la meme etape affiche 25:00. Correction
  // d'affichage uniquement : aucune duree, aucun pas, aucune prescription changes.
  const durationHelper = String.raw`
function JarvisStepDuration(sec){const s=Math.max(0,Math.round(Number(sec)||0));if(s<60)return s+" s";const m=Math.floor(s/60),r=s%60;return r?m+" min "+r+" s":m+" min"}`;
  source = once(source, 'function G4(', durationHelper + '\nfunction G4(');
  source = once(source, 's.jsxs("span",{children:[k.seconds," s"]})',
    's.jsx("span",{children:JarvisStepDuration(k.seconds)})');

  // Une seance de musculation commencee et jamais cloturee bloquait tout :
  // elle etait reprise d'office des semaines plus tard (series deja validees
  // affichees), et toute minuterie guidee etait refusee au profit de la modale
  // « Cloturer votre seance ». Decision de l'utilisateur du 23 septembre 2026 :
  // la cloturer automatiquement en « partielle » au changement de jour.
  // Aucune serie, aucune charge, aucune prescription n'est modifiee : la seance
  // part simplement dans l'historique avec sa date et son statut reels.
  const staleHelpers = String.raw`
function JarvisStaleWorkout(p,today){return !!(p&&p.workout&&p.workout.date&&p.workout.date!==today)}
function JarvisStaleNotice(w){return "Séance du "+Re(w.date,{day:"numeric",month:"long"})+" ("+w.name+") clôturée automatiquement comme "+(w.status==="completed"?"terminée":"partielle")+". Vos séries validées restent dans l’historique."}
function JarvisCloseStaleWorkout(p,today){
 if(!JarvisStaleWorkout(p,today))return null;
 const w=p.workout,
  complete=!w.safetyStop&&(w.exercises||[]).every(e=>(e.sets||[]).filter(s=>s.completed).length>=e.targetSets),
  stamps=(w.exercises||[]).flatMap(e=>e.sets||[]).filter(s=>s.completed).map(s=>Number(s.createdAt)||0),
  started=Number(w.startedAt)||0,
  dayEnd=new Date(w.date+"T23:59:59").getTime(),
  last=stamps.length?Math.max(...stamps):0;
 w.status=complete?"completed":"partial";
 w.finishedAt=last||(started?Math.min(started+1e3,dayEnd):dayEnd);
 w.durationSec=Math.max(1,Math.round((w.finishedAt-(started||w.finishedAt))/1e3));
 p.sessions=(p.sessions||[]).concat([w]);
 if(w.planId)md(p,w.planId,w.status,w.date);
 if(p.timer&&p.timer.meta&&(p.timer.meta.workoutId===w.id||p.timer.meta.type==="rest"))p.timer=null;
 p.workout=null;
 return w
}
function JarvisCloseStaleWorkouts(s,today){const closed=[];for(const id of Object.keys(s.profiles||{})){const w=JarvisCloseStaleWorkout(s.profiles[id],today);w&&closed.push(w)}return closed}`;
  source = once(source, 'function md(i,o,n,l){', staleHelpers + '\nfunction md(i,o,n,l){');
  // Au chargement : l'application repart d'une journee propre, seance en cours
  // incluse, et l'utilisateur est prevenu une fois.
  source = once(source, 'n(Z),k(M)})},[])',
    'const stale=JarvisCloseStaleWorkouts(Z,P());n(Z),k(M);if(stale.length)q(stale.map(JarvisStaleNotice).join(" "))})},[])');
  // Au clic : le bouton ne propose plus une seance d'un autre jour.
  source = once(source, 'if(A.workout){h(null),ae("training","session"),q("Votre séance en cours a été reprise.");return}',
    'if(A.workout&&A.workout.date!==P()){H(_p=>{const w=JarvisCloseStaleWorkout(_p,P());w&&q(JarvisStaleNotice(w))})}else if(A.workout){h(null),ae("training","session"),q("Votre séance en cours a été reprise.");return}');
  // Et une minuterie guidee n'est plus refusee a cause d'une seance oubliee.
  source = once(source, 'if(A.workout&&!["rest","warmup"].includes(M==null?void 0:M.type)){q("Clôturez votre musculation avant de lancer un autre protocole. Les séries seront conservées.","info"),h({type:"finish-workout"});return}',
    'if(A.workout&&A.workout.date!==P()&&!["rest","warmup"].includes(M==null?void 0:M.type)){H(_p=>{const w=JarvisCloseStaleWorkout(_p,P());w&&q(JarvisStaleNotice(w))})}else if(A.workout&&!["rest","warmup"].includes(M==null?void 0:M.type)){q("Clôturez votre musculation avant de lancer un autre protocole. Les séries seront conservées.","info"),h({type:"finish-workout"});return}');
  // Le compteur de seance ne peut plus afficher « 40320:00 » (28 jours de minutes) :
  // au-dela d'une heure il passe en heures et minutes.
  source = once(source, 'function J5({start:i}){const o=El(1e3);return s.jsx(s.Fragment,{children:fi((o-i)/1e3)})}',
    'function J5({start:i}){const o=El(1e3),sec=Math.max(0,(o-i)/1e3);return s.jsx(s.Fragment,{children:sec>=3600?Math.floor(sec/3600)+" h "+String(Math.floor(sec%3600/60)).padStart(2,"0"):fi(sec)})}');

  // Deux visuels d'etirement ne montraient pas la posture decrite. Decision
  // utilisateur du 23 septembre 2026 : echanger l'image, jamais reecrire la
  // consigne. Les deux dessins corrects existent deja dans l'application
  // (verifies en pleine image : review/stretch-assets-review.json).
  //  - « Pigeon assis » : le pigeon AU SOL ne montrait pas la position assise
  //    cheville croisee ; le dessin « piriforme assis » montre exactement cette
  //    position.
  //  - « Main dans le dos » : le fichier etait un dos anatomique, pas une
  //    posture ; le dessin « coude au-dessus de la tete » montre la main
  //    derriere la tete, coude tire.
  source = once(source, '"Pigeon assis":"/media/stretch-pigeon.jpg"', '"Pigeon assis":"/media/stretch-piriforme.jpg"');
  source = once(source, '"Main dans le dos":"/media/stretch-triceps-dos.jpg"', '"Main dans le dos":"/media/stretch-triceps-coude.jpg"');

  // La liste des etapes d'un protocole piscine cherchait son guide dans toute la
  // bibliotheque : elle doit passer par le meme resolveur aquatique, sinon les
  // visuels terrestres des cinq guides mesures reapparaissent dans la
  // bibliotheque piscine. Les consignes aquatiques restent affichees.
  source = once(source, 'const C=bl.find(Q=>Q.k.some(O=>Ge(j).includes(Ge(O))))',
    'const C=JarvisPoolMedia.guide(j)');

  // Both start buttons must carry approach identity into newly created timers.

  source = once(source,'instruction:x.instruction,img:x.img,pattern:x.pattern}',
    'instruction:x.instruction,img:x.img,pattern:x.pattern,exerciseId:x.exerciseId,mediaRole:x.mediaRole}');
  source = once(source,'f=p.steps[p.index],poolMedia=',
    'f=JarvisWarmupMedia.view(p.steps[p.index],p.meta),poolMedia=');
  return source;
}
export function prepare() {
  const source = readBaseline(), candidate = integrate(source);
  const directory = path.join(root, '.cache/media-pool-candidate');
  fs.mkdirSync(directory, {recursive:true});
  execFileSync('python3', ['-c', `
import sys,zipfile,pathlib
root=pathlib.Path(sys.argv[2]).resolve()
with zipfile.ZipFile(sys.argv[1]) as z:
 for name in z.namelist():
  if not name.startswith('assets/public/') or name.endswith('/'):continue
  file=(root/name[len('assets/public/'):]).resolve()
  if not file.is_relative_to(root):raise ValueError('Unsafe ZIP entry')
  file.parent.mkdir(parents=True,exist_ok=True);file.write_bytes(z.read(name))
`, path.join(root,baseline.apk),directory]);
  const overrides = JSON.parse(fs.readFileSync(new URL('./association-overrides.json',import.meta.url))).overrides;
  for (const entry of overrides) {
    for (const [file,digest] of [[entry.path,entry.assetSha256],[entry.thumbnailPath,entry.thumbnailSha256]]) {
      if (!/^\/(media|thumbs)\/[a-f0-9]+\.(gif|webp)$/.test(file) ||
          sha(fs.readFileSync(path.join(directory,file))) !== digest) throw Error('Changed reviewed asset '+file);
    }
  }
  for (const [file, digest] of Object.entries(JSON.parse(fs.readFileSync(new URL('./pool-animations-map.json', import.meta.url))).files)) {
    const source = path.join(root, 'evolution/media/candidate/pool-animations', path.basename(file));
    const target = path.join(directory, file.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(target), {recursive:true});
    fs.copyFileSync(source, target);
    if (sha(fs.readFileSync(target)) !== digest) throw Error('Animation livree modifiee: ' + file);
    const land = JSON.parse(fs.readFileSync(new URL('./pool-animations-map.json', import.meta.url))).replacedLandVisuals[file];
    if (land) fs.rmSync(path.join(directory, land.replace(/^\//, '')), {force:true});
  }
  const bundlePath = baseline.bundle.replace('assets/public/', '');
  fs.writeFileSync(path.join(directory,bundlePath),candidate);
  const check = path.join(root,'.cache/media-pool-syntax.mjs');
  fs.writeFileSync(check,candidate);
  execFileSync(process.execPath,['--check',check]);
  const report={status:'candidate-only-not-release',baselineApkSha256:baseline.apkSha256,
    candidateBundleSha256:sha(candidate),allowedChangedEntries:[baseline.bundle],
    openFindingGroups:JSON.parse(fs.readFileSync(new URL('../review/findings.json',import.meta.url))).findings.filter(f=>f.status==='open').length,
    limits:['Full media audit remains open','Legacy pool associations still require visual validation',
      'Generic recovery without a precise aquatic guide remains an explicit gap',
      'Build alone provides no browser/device acceptance; see candidate/validation.json for scoped tests']};
  fs.writeFileSync(path.join(root,'.cache/media-pool-candidate.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({directory,...report},null,2));
  return {directory,report};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepare();
