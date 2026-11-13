// Inventaire des points d'affichage sans vidéo 3D, pas des fichiers à produire.
// Les répétitions numérotées d'un même libellé piscine sont regroupées ; les
// libellés différents ne sont pas fusionnés selon une similarité supposée.
import assert from 'node:assert/strict';
import legacy from '../src/data/legacy.json' with { type: 'json' };
import { EXERCISES, RECOVERY_EXERCISES, ALL_POOL_PROTOCOLS } from '../src/data/library.js';
import { videoFor } from '../src/data/exercise-videos.js';
import { STEP_VIDEOS, WARMUP_OVERVIEW, stepVideoFor } from '../src/data/step-videos.js';
import { CARDIO_STEPS } from '../src/data/visuals.js';

const eligible = EXERCISES.filter(e => e.sources.includes('elite') || e.sources.includes('emilie'));
const jarvis = EXERCISES.filter(e => !e.sources.includes('elite') && !e.sources.includes('emilie'));
const hiitNames = [...new Set(legacy.elite.TABATA_MODES.flatMap(m => m.exos))].sort();
const poolOccurrences = ALL_POOL_PROTOCOLS.flatMap(p => p.niveaux.flatMap(n => n.steps.map(([name]) => ({protocol:p.id, level:n.n, name}))));
const poolLabel = s => s.replace(/\b\d+\s*\/\s*\d+\b/g, '').replace(/(effort variable) \d+\b/i, '$1').replace(/\s+/g, ' ').trim();
const poolLabels = [...new Set(poolOccurrences.map(o => poolLabel(o.name)))].sort();
const missingPoolLabels = [...new Set(poolOccurrences.filter(o => !stepVideoFor(o.name)).map(o => poolLabel(o.name)))].sort();
const hiitUnassigned = hiitNames.filter(n => !stepVideoFor(`${n} · round 1/8`));
const cardioUnassigned = CARDIO_STEPS.filter(s => !stepVideoFor(s.t)).map(s => s.t);
const stretchUnassigned = RECOVERY_EXERCISES.filter(e => !videoFor(e) && !stepVideoFor(e.name));
const cover = items => ({total:items.length, withVideo:items.filter(e => !!videoFor(e)).length, missing:items.filter(e => !videoFor(e)).length});
assert.equal(JSON.stringify(legacy.elite.POOL_PROTOS),JSON.stringify(legacy.emilie.POOL_PROTOS), 'Les protocoles piscine Elite et Émilie diffèrent : auditer les deux séparément.');
const report = {
  generatedFrom: 'src/data/library.js, exercise-videos.js, step-videos.js, legacy.json, visuals.js, metcon-emilie.js, pool-diversity.js, Cardio.jsx, Recovery.jsx',
  warning: 'Compteurs de fiches et libellés dans des modules différents, non dédoublonnés entre modules : ce ne sont pas des nombres de nouveaux fichiers vidéo.',
  catalogue: {program:cover(eligible), jarvisOnly:cover(jarvis), all:cover(EXERCISES), coachedProgram:eligible.filter(e => videoFor(e)?.status==='coached').length, validatedProgram:eligible.filter(e => videoFor(e)?.status==='validated').length, missingJarvis:jarvis.filter(e=>!videoFor(e)).map(e=>e.name)},
  warmup: {registeredSteps:['mise en route','mobilite des epaules','mobilite hanches chevilles','activation fessiers','activation scapulaire'].filter(k => STEP_VIDEOS[k]).length, overview:!!WARMUP_OVERVIEW.src, note:'Approches : vidéo du premier exercice si disponible.'},
  stretch:{total:RECOVERY_EXERCISES.length, unassigned:stretchUnassigned.length,names:stretchUnassigned.map(e=>e.name)},
  hiitLand:{modes:legacy.elite.TABATA_MODES.length, slots:legacy.elite.TABATA_MODES.flatMap(m=>m.exos).length, uniqueLabels:hiitNames.length, unassigned:hiitUnassigned.length,names:hiitUnassigned},
  pool:{protocols:ALL_POOL_PROTOCOLS.map(p=>p.id), occurrenceCount:poolOccurrences.length, exactLabels:new Set(poolOccurrences.map(o=>o.name)).size, labelsWithoutRoundNumbers:poolLabels.length, unassignedLabelsWithoutRoundNumbers:missingPoolLabels.length, names:missingPoolLabels},
  cardioGuides:{total:CARDIO_STEPS.length, unassigned:cardioUnassigned.length,names:cardioUnassigned},
  extraNotAddedToSum:['Cardio libre : course, vélo, elliptique, marche, rameur, cardio libre ; allures et fractions générées.', 'Piscine personnalisée : crawl, brasse, dos, papillon, libre, durées et distances variables.', 'Aqua Tabata / HIIT personnalisé : six mouvements ; METCON Aqua et circuits facultatifs dans les protocoles piscine.', 'Routines récupération : respiration, mobilité, étirements ; phases de repos, transitions et retours au calme.', 'Les circuits musculation combinés et les approches peuvent nécessiter plusieurs vidéos exactes ou un montage adapté.'],
};
if (process.argv.includes('--json')) console.log(JSON.stringify(report,null,2));
else {
  for(const [k,v] of Object.entries(report)) console.log(`${k}: ${typeof v === 'string' ? v : JSON.stringify(v,null,2)}`);
}
