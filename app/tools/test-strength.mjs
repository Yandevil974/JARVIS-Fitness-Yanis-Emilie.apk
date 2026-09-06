import { newProfile } from "../src/store/model.js";
import { EXERCISES, exerciseById } from "../src/data/library.js";
import * as S from "../src/engine/strength.js";
import { recommendLoad } from "../src/engine/fitness.js";
import { today, uid } from "../src/engine/utils.js";

const p = newProfile("elite");
p.forceTests = [
  { id: uid(), baseKey: "squat", estimate: 120, date: "2026-08-01", unit: "kg total", declared: true },
  { id: uid(), baseKey: "bench", estimate: 90, date: "2026-08-01", unit: "kg total", declared: true },
  { id: uid(), baseKey: "rdl", estimate: 110, date: "2026-08-01", unit: "kg total", declared: true },
  { id: uid(), baseKey: "row", estimate: 70, date: "2026-08-01", unit: "kg total", declared: true },
  { id: uid(), baseKey: "ohp", estimate: 55, date: "2026-08-01", unit: "kg total", declared: true },
];
console.log("bilan fait:", S.forceTestDone(p));
console.log("réévaluation:", S.reevaluationStatus(p));
const tests = ["Back squat","Front squat","Développé couché barre plat","Développé haltères incliné","Leg press","Curl barre debout","Élévations latérales","Rowing haltère un bras","Leg curl allongé","Mollets debout","Gainage planche","Pompes"];
for (const name of tests) {
  const ex = EXERCISES.find(e => e.name === name);
  if (!ex) { console.log("MANQUANT", name); continue; }
  const s = S.suggestedLoad(p, ex, ex.repScheme);
  console.log(`${name.padEnd(34)} ${s ? String(s.load).padStart(6)+" kg  ("+s.percent+"% de "+s.effective+" via "+s.base+" ×"+s.ratio+")" : "— pas de charge"}`);
}
console.log("\n--- recommendLoad (séance) ---");
const ex = EXERCISES.find(e => e.name === "Back squat");
console.log(recommendLoad(p, { exerciseId: ex.id, repsLow: 6, repsHigh: 8, repScheme: "6-8", unit: ex.unit }));
console.log("\n--- overview ---");
console.table(S.forceOverview(p).filter(r=>r.effective!=null).map(r=>({mouvement:r.name, declare:r.declared, auto:r.automatic, effectif:r.effective, seance75:r.working})));
