// Extends step 1; never rebuild the complete app from the historical source tree.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from '../../JARVIS-Fitness-Source/node_modules/esbuild/lib/main.js';
import { parse } from '../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs';
import { integrate as reminders, prepare as prepareReminders, replaceOnce } from '../reminders/build.mjs';
import { config, sha256 } from '../../complete-hotfix/patch-web.mjs';
const root = fileURLToPath(new URL('../..', import.meta.url));
const ast = text => parse(text, { ecmaVersion: 'latest', sourceType: 'module' });
function change(source, name, transform) {
  const n = ast(source).body.find(n => n.type === 'FunctionDeclaration' && n.id.name === name);
  if (!n) throw new Error(`Missing host function ${name}`);
  return source.slice(0, n.start) + transform(source.slice(n.start, n.end)) + source.slice(n.end);
}
function walk(node, predicate) {
  if (!node || typeof node !== 'object') return [];
  const result = predicate(node) ? [node] : [];
  for (const v of Object.values(node)) {
    if (Array.isArray(v)) for (const n of v) result.push(...walk(n, predicate));
    else if (v && typeof v === 'object') result.push(...walk(v, predicate));
  }
  return result;
}
export async function integrate(original) {
  let source = await reminders(original);
  source = change(source, 'Ut', () => 'function Ut(i,o=!0){return JarvisVoice.speak(i,{enabled:o});}');
  source = change(source, 'T5', f => {
    f = replaceOnce(f, 'className:"chat-panel"', 'className:"chat-panel jv-chat"');
    if (f.split('onClick:()=>o(R)').length !== 3) throw new Error('Quick prompts integration changed');
    f = f.replaceAll('onClick:()=>o(R)', 'onClick:()=>{JarvisVoice.cancel("CANCELLED",true);o(R)}');
    const forms = walk(ast(f), n => n.type === 'CallExpression' && n.arguments[0]?.value === 'form' &&
      n.arguments[1]?.properties?.some(p => p.key.name === 'className' && p.value.value === 'chat-composer'));
    if (forms.length !== 1) throw new Error('Composer integration point changed');
    const form = forms[0];
    f = f.slice(0, form.start) + 's.jsx(JarvisVoice.Composer,{value:h,onChange:m,onSubmit:j})' + f.slice(form.end);
    const oldListen = ast(f).body[0].body.body.find(n => n.type === 'FunctionDeclaration' && n.id.name === 'k');
    if (!oldListen?.async || !f.slice(oldListen.start, oldListen.end).includes('oh.listen')) throw new Error('Legacy microphone handler changed');
    return f.slice(0, oldListen.start) + f.slice(oldListen.end);
  });
  source = change(source, 'I3', f => replaceOnce(f, 's.jsx(b5,{})', 's.jsx(JarvisVoice.Observer,{}),s.jsx(b5,{})'));
  // Existing timer/session rules and deduplication stay untouched; only their audio sink changes.
  for (const name of ['b5', '_5']) source = change(source, name, f => {
    if (!f.includes('Ut(')) throw new Error('Missing audio cue in ' + name);
    return f.replaceAll('Ut(', 'JarvisVoice.cue(');
  });
  const extension = await build({ entryPoints: [path.join(root, 'evolution/voice/Voice.jsx')], bundle: true,
    format: 'iife', globalName: 'JarvisVoiceModule', minify: true, write: false,
    jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
    loader: { '.css': 'text' }, target: ['chrome100'], logLevel: 'silent' });
  const injection = `\n${extension.outputFiles[0].text}\nconst JarvisVoice=JarvisVoiceModule.createVoice({React:Wn,useApp:fe,native:oh,isAndroid:Vs,Icon:z});\n`;
  source = replaceOnce(source, 'O8.createRoot(document.getElementById("root"))', injection + 'O8.createRoot(document.getElementById("root"))');
  ast(source);
  return source;
}
export async function prepare(base, destination) {
  // This extracts the pinned complete inventory and the reminders. Only extend its JS below.
  await prepareReminders(base, destination);
  const relative = config.bundle.path.replace('assets/public/', '');
  const original = execFileSync('python3', ['-c', 'import zipfile,sys; sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))', base, config.bundle.path], { maxBuffer: 8 * 1024 * 1024 }).toString('utf8');
  // The copy above is independently pinned by the reminder integrator as well.
  const updated = await integrate(original);
  fs.writeFileSync(path.join(destination, relative), updated);
  fs.writeFileSync(path.join(destination, '..', 'voice-build-report.json'), JSON.stringify({ stage: 2,
    baseApk: config.base, bundle: sha256(updated), changedWebFiles: [relative],
    nativeStatus: 'source prepared; NOT packaged into the complete APK', protocolVersionRequired: 2,
    signedApkProduced: false }, null, 2) + '\n');
  console.log('Stage 2 web preview:', destination, '\nBundle SHA-256:', sha256(updated));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepare(path.resolve(process.argv[2] || path.join(root, '.cache/reference/base.apk')), path.resolve(process.argv[3] || path.join(root, '.cache/voice-web')));
}
