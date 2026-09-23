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
export function readBaseline() {
  const apk = path.join(root, baseline.apk);
  if (sha(fs.readFileSync(apk)) !== baseline.apkSha256) throw Error('Wrong APK baseline');
  const source = execFileSync('python3', ['-c',
    'import sys,zipfile;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))',
    apk, baseline.bundle], {maxBuffer: 10*1024*1024}).toString();
  if (sha(source) !== baseline.bundleSha256) throw Error('Wrong bundle baseline');
  return source;
}
export function integrate(source) {
  if (sha(source) !== baseline.bundleSha256) throw Error('Requires unchanged 1.4.0; rejects unknown/already patched input');
  const start = source.indexOf('function v5('), end = source.indexOf('function w5(', start);
  if (start < 0 || end <= start) throw Error('Timer boundaries missing');
  const oldTimer = source.slice(start, end);
  let timer = once(oldTimer, 'f=p.steps[p.index],h=', 'f=p.steps[p.index],poolMedia=JarvisPoolMedia.resolve(f,p.meta),h=');
  timer = once(timer, 'x=bl.find(', 'x=poolMedia?poolMedia.guide:bl.find(');
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
  source = once(source, 'function bg(i,o){', `${helper}\nconst JarvisPoolMedia=createPoolMedia({normalize:Ge,poolGuides:bl});\nfunction bg(i,o){if(o==="pool")return JarvisPoolMedia.guide(i);`);
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
  const bundlePath = baseline.bundle.replace('assets/public/', '');
  fs.writeFileSync(path.join(directory,bundlePath),candidate);
  const check = path.join(root,'.cache/media-pool-syntax.mjs');
  fs.writeFileSync(check,candidate);
  execFileSync(process.execPath,['--check',check]);
  const report={status:'candidate-only-not-release',baselineApkSha256:baseline.apkSha256,
    candidateBundleSha256:sha(candidate),allowedChangedEntries:[baseline.bundle],
    limits:['26 findings remain open','Legacy pool associations still require visual validation',
      'Generic recovery without a precise aquatic guide remains an explicit gap',
      'Build alone provides no browser/device acceptance; see candidate/validation.json for scoped tests']};
  fs.writeFileSync(path.join(root,'.cache/media-pool-candidate.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({directory,...report},null,2));
  return {directory,report};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepare();
