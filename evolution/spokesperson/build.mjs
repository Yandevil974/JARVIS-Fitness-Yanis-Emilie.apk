// Stage 3 extends the COMPLETE app, including reminders and the voice coordinator.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build } from '../../JARVIS-Fitness-Source/node_modules/esbuild/lib/main.js';
import { parse } from '../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { integrate as voice, prepare as prepareVoice } from '../voice/build.mjs';
import { replaceOnce } from '../reminders/build.mjs';
import { config, sha256 } from '../../complete-hotfix/patch-web.mjs';
const root = fileURLToPath(new URL('../..', import.meta.url));
const ast = text => parse(text, { ecmaVersion: 'latest', sourceType: 'module' });
function change(source, name, transform) {
  const node = ast(source).body.find(n => n.type === 'FunctionDeclaration' && n.id.name === name);
  if (!node) throw new Error('Missing host: ' + name);
  return source.slice(0, node.start) + transform(source.slice(node.start, node.end)) + source.slice(node.end);
}
export async function integrate(original) {
  let source = await voice(original);
  source = change(source, 't2', f => replaceOnce(f, 's.jsx(JarvisFollowUp.Board,{})', 's.jsx(JarvisSpokesperson.Board,{}),s.jsx(JarvisFollowUp.Board,{})'));
  source = change(source, 'I3', f => replaceOnce(f, 's.jsx(JarvisVoice.Observer,{})', 's.jsx(JarvisSpokesperson.Observer,{}),s.jsx(JarvisVoice.Observer,{})'));
  const extension = await build({ entryPoints: [path.join(root, 'evolution/spokesperson/Board.jsx')], bundle: true,
    format: 'iife', globalName: 'JarvisSpokespersonModule', minify: true, write: false,
    jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
    loader: { '.css': 'text' }, target: ['chrome100'], logLevel: 'silent' });
  const injection = `\n${extension.outputFiles[0].text}\nconst JarvisSpokesperson=JarvisSpokespersonModule.createSpokesperson({React:Wn,useApp:fe,Modal:We,Icon:z,Orb:oo,voice:JarvisVoice,getCoaches:p=>Qg[p.id]||[],isAndroid:Vs});\n`;
  source = replaceOnce(source, 'O8.createRoot(document.getElementById("root"))', injection + 'O8.createRoot(document.getElementById("root"))');
  ast(source);
  return source;
}
export async function prepare(base, destination) {
  await prepareVoice(base, destination);
  const original = execFileSync('python3', ['-c', 'import zipfile,sys;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))', base, config.bundle.path], { maxBuffer: 8 * 1024 * 1024 }).toString('utf8');
  const updated = await integrate(original), relative = config.bundle.path.replace('assets/public/', '');
  fs.writeFileSync(path.join(destination, relative), updated);
  fs.writeFileSync(path.join(destination, '..', 'spokesperson-build-report.json'), JSON.stringify({ stage: 3, baseApk: config.base,
    bundle: sha256(updated), changedWebFiles: [relative], signedApkProduced: false,
    nativeStatus: 'Voice options source compiled/tested separately; not packaged in an APK',
    requiredVoiceOptionsVersion: 1 }, null, 2) + '\n');
  console.log('Stage 3 preview:', destination, '\nBundle SHA-256:', sha256(updated));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepare(path.resolve(process.argv[2] || path.join(root, '.cache/reference/base.apk')), path.resolve(process.argv[3] || path.join(root, '.cache/spokesperson-web')));
}
