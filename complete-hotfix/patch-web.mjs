/** Minimal, checksum-pinned patch of the COMPLETE uploaded application's bundle.
 * Never rebuild from the older source archive: it lacks features in this APK.
 * Every replacement must match once; all other bytes remain untouched.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const config = JSON.parse(fs.readFileSync(new URL('./manifest.json', import.meta.url)));
export const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
export const patches = [
  {
    name: 'standalone-warmup-null-guard',
    before: '!w&&((k=b.workout)==null?void 0:k.id)===p.meta.workoutId&&(b.workout.warmupDone=!0)',
    after: '!w&&b.workout&&p.meta.workoutId&&b.workout.id===p.meta.workoutId&&(b.workout.warmupDone=!0)',
  },
  {
    name: 'clock-refresh-on-focus-and-visibility',
    before: 'function El(i=250){const[o,n]=T.useState(Date.now());return T.useEffect(()=>{const l=setInterval(()=>n(Date.now()),i);return()=>clearInterval(l)},[i]),o}',
    after: 'function El(i=250){const[o,n]=T.useState(Date.now());return T.useEffect(()=>{const tick=()=>n(Date.now()),visible=()=>{document.hidden||tick()},l=setInterval(tick,i);return document.addEventListener("visibilitychange",visible),window.addEventListener("focus",tick),()=>{clearInterval(l),document.removeEventListener("visibilitychange",visible),window.removeEventListener("focus",tick)}},[i]),o}',
  },
  {
    name: 'timer-transition-latch',
    before: 'if(!l||l.done||l.paused)return;const u=()=>{const h=Os(l);',
    after: 'if(!l||l.done||l.paused)return;let transitioned=false;const u=()=>{if(transitioned)return;const h=Os(l);',
  },
  {
    name: 'timer-single-notification',
    before: 'if(h.done||h.index!==l.index)if(o(m=>',
    after: 'if(h.done||h.index!==l.index)if(transitioned=true,o(m=>',
  },
  {
    name: 'timer-immediate-catch-up-and-focus',
    before: 'return document.addEventListener("visibilitychange",f),()=>{clearInterval(p),document.removeEventListener("visibilitychange",f)}',
    after: 'return u(),document.addEventListener("visibilitychange",f),window.addEventListener("focus",u),()=>{clearInterval(p),document.removeEventListener("visibilitychange",f),window.removeEventListener("focus",u)}',
  },
  {
    name: 'application-error-boundary',
    before: 'O8.createRoot(document.getElementById("root")).render(s.jsx(Mx,{children:s.jsx(I3,{})}));',
    after: 'O8.createRoot(document.getElementById("root")).render(s.jsx($3,{children:s.jsx(Mx,{children:s.jsx(I3,{})})}));',
  },
  { name: 'version-label', before: 'children:"V 1.0.4"', after: 'children:"V 1.0.6"' },
];

export function patchBundle(source) {
  if (sha256(source) !== config.bundle.sha256)
    throw new Error('Unexpected APK bundle. Refusing to patch another version or an already patched file.');
  for (const patch of patches) {
    const count = source.split(patch.before).length - 1;
    if (count !== 1) throw new Error(`${patch.name}: expected one match, got ${count}`);
    source = source.replace(patch.before, patch.after);
  }
  return source;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) throw new Error('Usage: node patch-web.mjs path/to/index-CBCies4k.js');
  const original = fs.readFileSync(file, 'utf8');
  const patched = patchBundle(original);
  fs.writeFileSync(file, patched);
  console.log(JSON.stringify({ baseBundle: sha256(original), patchedBundle: sha256(patched), patches: patches.map(p => p.name) }, null, 2));
}
