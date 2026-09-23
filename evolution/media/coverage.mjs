// Derived coverage index; never promotes file existence/decoding to semantic approval.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const read = name => JSON.parse(fs.readFileSync(new URL('./'+name,import.meta.url)));
export function coverage() {
 const inventory=read('review/inventory-1.4.0.json'),review=read('review/long-animations.json');
 const findings=read('review/findings.json').findings;
 const overrides=read('candidate/association-overrides.json').overrides;
 const reviewed=new Map(review.clips.flatMap(c=>c.associations.filter(a=>a.scope==='musculation').map(a=>[a.id,{...a,clip:c.number}])));
 const exercises=inventory.exercises.map(e=>{
  const checked=reviewed.get(e.id),groups=findings.filter(f=>f.exercises?.includes(e.id)).map(f=>f.id);
  const correction=overrides.find(o=>o.id===e.id);
  return {id:e.id,name:e.name,baselinePath:e.resolved?.path||null,
   baselineReviewStatus:checked?.status||(groups.length?'known-finding':'pending-association-review'),
   reviewClip:checked?.clip||null,findingGroups:groups,
   candidatePath:correction?.path||e.resolved?.path||null,
   candidateStatus:correction?'explicit-reviewed-reassociation-all-surfaces-pending':'no-targeted-correction',
   finalAccepted:false};
 });
 return {baselineApkSha256:inventory.baseline.apkSha256,releaseReady:false,
  meaning:'All 209 exercise IDs tracked. This is not a coverage-completion claim; basic correspondence is not final acceptance. Other categories remain in their inventory/findings and need their own per-surface ledger.',
  count:exercises.length,exercises};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=coverage();fs.writeFileSync(new URL('./review/exercise-coverage.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log(`Recorded ${result.count} exercise IDs, none automatically finally accepted.`);
}
