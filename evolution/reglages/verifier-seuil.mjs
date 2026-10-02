/** Contrôle après correction : le METCON de Yanis bascule-t-il comme la source ? */
import { sourceExtra, sourceDay } from "../../yanis-fitness-evolution/src/engine/source-schedule.js";

const base = (activities = [], checkIns = {}) => ({
  id: "elite",
  user: { frequency: 4, startDate: "2026-09-07" },
  equipment: ["pool", "elliptical"],
  preferences: { poolDays: [], cardioChoices: {} },
  activities,
  checkIns,
  sessions: [],
});

const metcon = (i) => [
  { date: `2026-10-0${1 + i}`, type: "cardio", protocolId: "hiit" },
  { date: `2026-10-0${1 + i}`, type: "swim", protocolId: "sprint" },
];

const CAS = [
  ["A. Rien de déclaré (récupération non renseignée)", []],
  ["B. 3 METCON elliptique HIIT + Swim Sprint sur 7 j", [0, 1, 2].flatMap(metcon)],
  ["C. 3 Aqua Recovery (séances douces)", [0, 1, 2].map((i) => ({ date: `2026-10-0${1 + i}`, type: "recovery", protocolId: "recovery" }))],
  ["D. 3 Tabata au sol", [0, 1, 2].map((i) => ({ date: `2026-10-0${1 + i}`, type: "hiit" }))],
  ["E. Récupération déclarée basse (45/100)", [], { "2026-10-05": { sleep: 5, quality: 2, energy: 2, fatigue: 5, stress: 4, soreness: 4, motivation: 2 } }],
];

for (const [titre, activites, checkIns = {}] of CAS) {
  const p = base(activites, checkIns);
  const jour = sourceDay(p, "2026-10-05");
  const e = sourceExtra(p, jour);
  console.log(titre);
  console.log(`   jour   : ${jour.type} — ${jour.name}`);
  console.log(`   proposé: ${e.name}`);
  console.log(`   détail : ${e.components.map((c) => `${c.name} (${c.minutes} min)`).join(" + ") || "(aucun bloc)"}`);
  console.log(`   motif  : ${e.reason}`);
  console.log();
}
