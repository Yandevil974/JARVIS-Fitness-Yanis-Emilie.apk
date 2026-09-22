// Stage 1 integration on the complete APK. Does not rebuild the old source archive.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build } from '../../JARVIS-Fitness-Source/node_modules/esbuild/lib/main.js';
import { parse } from '../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { config, sha256, patchBundle } from '../../complete-hotfix/patch-web.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
export function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw new Error(`Expected one integration point: ${before.slice(0, 100)}`);
  return source.replace(before, after);
}
function changeFunction(source, name, transform) {
  const node = parse(source, { ecmaVersion: 'latest', sourceType: 'module' }).body.find(n => n.type === 'FunctionDeclaration' && n.id.name === name);
  if (!node) throw new Error(`Missing host function: ${name}`);
  return source.slice(0, node.start) + transform(source.slice(node.start, node.end)) + source.slice(node.end);
}
export async function integrate(original) {
  let source = patchBundle(original); // checks the pinned complete bundle hash, keeps all timer fixes
  source = changeFunction(source, 't2', f => {
    f = replaceOnce(f, 's.jsxs("div",{className:"dashboard-layout"', 's.jsx(JarvisFollowUp.Board,{}),s.jsxs("div",{className:"dashboard-layout"');
    return replaceOnce(f, 's.jsx(z5,{})', 'null'); // replaced by the unified, snoozable force card
  });
  source = changeFunction(source, 'N5', f => replaceOnce(f,
    'c=A5(i).filter(m=>!(i.dismissedFindings||[]).includes(m.key))',
    'c=A5(i).filter(m=>!/^watch-(force|photos|mesures)/.test(m.key)&&!(i.dismissedFindings||[]).includes(m.key))'));
  source = changeFunction(source, 'G3', f => {
    const start = f.indexOf('const p=hi(i);if(p.due)');
    const end = f.indexOf('};l();', start);
    if (start < 0 || end < 0 || !f.slice(start, end).includes('force-reval-')) throw new Error('Force observer integration changed');
    // Only force notifications move to the new observer. Session reminders and weekly reports stay intact.
    return f.slice(0, start) + f.slice(end);
  });
  source = changeFunction(source, 'I3', f => replaceOnce(f, 's.jsx(G3,{})', 's.jsx(G3,{}),s.jsx(JarvisFollowUp.Observer,{})'));
  source = changeFunction(source, 'Q5', f => replaceOnce(f, 'children:[s.jsx("div",{className:"notification-list"', 'children:[s.jsx(JarvisFollowUp.NotificationLink,{}),s.jsx("div",{className:"notification-list"'));
  const extension = await build({
    entryPoints: [path.join(root, 'evolution/reminders/Board.jsx')],
    bundle: true, format: 'iife', globalName: 'JarvisFollowUpModule', minify: true,
    write: false, jsx: 'transform', jsxFactory: 'React.createElement',
    loader: { '.css': 'text' }, target: ['chrome100'], logLevel: 'silent',
  });
  const injected = `\n${extension.outputFiles[0].text}\nconst JarvisFollowUp=JarvisFollowUpModule.createFollowUp({React:Wn,useApp:fe,Modal:We,Button:Y});\n`;
  source = replaceOnce(source, 'O8.createRoot(document.getElementById("root"))', injected + 'O8.createRoot(document.getElementById("root"))');
  parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
  return source;
}
export async function prepare(base, destination) {
  if (sha256(fs.readFileSync(base)) !== config.base.sha256) throw new Error('Wrong APK: the complete pinned upload is required.');
  fs.mkdirSync(destination, { recursive: true });
  execFileSync('python3', ['-c', `import zipfile,pathlib,sys
with zipfile.ZipFile(sys.argv[1]) as z:
 for name in z.namelist():
  if name.startswith('assets/public/') and not name.endswith('/'):
   relative=pathlib.PurePosixPath(name).relative_to('assets/public')
   if '..' in relative.parts: raise ValueError('Unsafe ZIP entry')
   target=pathlib.Path(sys.argv[2]).joinpath(*relative.parts)
   target.parent.mkdir(parents=True,exist_ok=True)
   target.write_bytes(z.read(name))`, base, destination]);
  const relative = config.bundle.path.replace('assets/public/', '');
  const file = path.join(destination, relative);
  const original = fs.readFileSync(file, 'utf8');
  const updated = await integrate(original);
  fs.writeFileSync(file, updated);
  const report = { stage: 1, label: 'Rappels et échéances', baseApk: config.base, baseBundle: sha256(original), updatedBundle: sha256(updated),
    nativeChanges: false, changedWebFiles: [relative], addedWebFiles: [], removedWebFiles: [] };
  fs.writeFileSync(path.join(destination, '..', 'reminders-build-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log('Stage 1 ready:', destination, '\nBundle SHA-256:', report.updatedBundle);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepare(path.resolve(process.argv[2] || path.join(root, '.cache/reference/base.apk')), path.resolve(process.argv[3] || path.join(root, '.cache/reminders-web')));
}
