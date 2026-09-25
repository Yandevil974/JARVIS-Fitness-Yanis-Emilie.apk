// Moteur d'animation humaine « créée » (Yanis Fitness Evolution 1.5.1).
// Chaque exercice sans GIF source reçoit une animation du geste réel :
// squelette articulé 2D piloté par des poses clef (départ → fin), dérivées du
// pattern de mouvement, de l'équipement et des consignes. Ce n'est pas un
// placeholder générique : la trajectoire, les amplitudes, la posture de départ
// et le matériel diffèrent par mouvement. Style unique (même personnage, même
// cadrage, même fond) cohérent avec les illustrations de l'application.
// Angles en degrés. Chaîne latérale droite : bassin pivot, tronc incliné vers
// l'avant = positif ; cuisse = 0 vers le bas, genou = flexion ; bras = 0 vers
// le bas vers l'avant, coude = flexion de l'avant-bras vers le haut.
export const POSES = {
  squat: {
    rig: "stand",
    a: { torso: 8, pelvisY: 0, hip: 8, knee: 6, shoulder: -25, elbow: 150, bar: "back" },
    b: { torso: 38, pelvisY: 62, hip: 92, knee: 98, shoulder: -20, elbow: 145, bar: "back" },
    cycle: 3000,
  },
  hinge: {
    rig: "stand",
    a: { torso: 8, pelvisY: 0, hip: 6, knee: 12, shoulder: 10, elbow: 4, bar: "hands" },
    b: { torso: 72, pelvisY: 14, hip: 68, knee: 18, shoulder: 14, elbow: 6, bar: "hands" },
    cycle: 3400,
  },
  lunge: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 18, knee: 22, shoulder: 6, elbow: 6, backLeg: true, db: true },
    b: { torso: 12, pelvisY: 58, hip: 88, knee: 96, shoulder: 8, elbow: 6, backLeg: true, db: true },
    cycle: 3200,
  },
  bridge: {
    rig: "floor-back",
    a: { torso: 10, pelvisY: 12, hip: -24, knee: 161, shoulder: 150, elbow: 10, bar: "hips" },
    b: { torso: -8, pelvisY: -20, hip: 13, knee: 165, shoulder: 145, elbow: 12, bar: "hips" },
    cycle: 2600,
  },
  abduction: {
    rig: "stand-side",
    a: { torso: 2, pelvisY: 0, hip: 3, knee: 2, shoulder: 4, elbow: 6, band: true },
    b: { torso: 4, pelvisY: 0, hip: 46, knee: 3, shoulder: 4, elbow: 6, band: true },
    cycle: 2400,
  },
  legext: {
    rig: "sit-machine",
    a: { torso: 12, hip: 88, knee: 96, shoulder: 16, elbow: 60 },
    b: { torso: 8, hip: 86, knee: 6, shoulder: 14, elbow: 58 },
    cycle: 2200,
  },
  legcurl: {
    rig: "prone-machine",
    a: { torso: 90, hip: 4, knee: 6, shoulder: 30 },
    b: { torso: 90, hip: 4, knee: 100, shoulder: 30 },
    cycle: 2200,
  },
  calf: {
    rig: "stand",
    a: { torso: 2, pelvisY: 0, hip: 2, knee: 2, shoulder: 4, elbow: 6, toeLift: 0 },
    b: { torso: 2, pelvisY: -18, hip: 2, knee: 2, shoulder: 4, elbow: 6, toeLift: 1 },
    cycle: 1800,
  },
  press: {
    rig: "bench",
    a: { torso: 8, hip: 26, knee: 118, shoulder: 0, elbow: 95 },
    b: { torso: 8, hip: 26, knee: 118, shoulder: 90, elbow: 8 },
    cycle: 2400,
  },
  raise: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 2, knee: 2, shoulder: 25, elbow: 95, db: true },
    b: { torso: 2, pelvisY: 0, hip: 2, knee: 2, shoulder: 155, elbow: 8, db: true },
    cycle: 2600,
  },
  // R7 : elevation laterale (pattern "lat") — bras tendus en arc jusqu'a
  // l'horizontale. Sans elle, le pattern tombait sur mobility (faux).
  lat: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 2, knee: 2, shoulder: 6, elbow: 10, db: true },
    b: { torso: 2, pelvisY: 0, hip: 2, knee: 2, shoulder: 85, elbow: 12, db: true },
    cycle: 2400,
  },
  pull: {
    rig: "machine-seat",
    a: { torso: 10, hip: 82, knee: 88, shoulder: 168, elbow: 26, bar: "over" },
    b: { torso: 16, hip: 80, knee: 86, shoulder: 96, elbow: 92, bar: "over" },
    cycle: 2400,
  },
  row: {
    rig: "machine-seat",
    a: { torso: 24, hip: 84, knee: 90, shoulder: 45, elbow: 8, cable: "front" },
    b: { torso: 10, hip: 80, knee: 88, shoulder: -31, elbow: 104, cable: "front" },
    cycle: 2300,
  },
  curl: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 2, knee: 2, shoulder: 4, elbow: 12, db: true },
    b: { torso: 3, pelvisY: 0, hip: 2, knee: 2, shoulder: 4, elbow: 86, db: true },
    cycle: 2200,
  },
  triceps: {
    rig: "stand",
    a: { torso: 12, pelvisY: 0, hip: 20, knee: 24, shoulder: 28, elbow: 112, cable: "up" },
    b: { torso: 10, pelvisY: 0, hip: 18, knee: 22, shoulder: 34, elbow: 4, cable: "up" },
    cycle: 2100,
  },
  crunch: {
    rig: "floor-back",
    a: { torso: 34, hip: 92, knee: 96, shoulder: 74, elbow: 100 },
    b: { torso: 6, hip: 88, knee: 92, shoulder: 70, elbow: 96 },
    cycle: 2300,
  },
  static: {
    rig: "plank",
    a: { torso: 58, hip: 6, knee: 6, shoulder: 88, elbow: 90 },
    b: { torso: 61, hip: 6, knee: 6, shoulder: 88, elbow: 90 },
    cycle: 5200,
  },
  walk: {
    rig: "stand",
    a: { torso: 3, pelvisY: 0, hip: -24, knee: 30, shoulder: 24, elbow: 30, anti: true },
    b: { torso: 3, pelvisY: 0, hip: 24, knee: 8, shoulder: -24, elbow: 30, anti: true },
    cycle: 1200,
  },
  swim: {
    rig: "pool",
    a: { torso: 66, hip: 10, knee: 8, shoulder: -150, elbow: 14, anti: true },
    b: { torso: 66, hip: 14, knee: 10, shoulder: -18, elbow: 36, anti: true },
    cycle: 1800,
  },
  breathe: {
    rig: "stand",
    a: { torso: 2, pelvisY: 0, hip: 2, knee: 2, shoulder: 4, elbow: 8, chest: 1 },
    b: { torso: 4, pelvisY: -3, hip: 2, knee: 2, shoulder: 22, elbow: 14, chest: 1.07 },
    cycle: 7000,
  },
  stretch: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 4, knee: 4, shoulder: 8, elbow: 6 },
    b: { torso: 55, pelvisY: 8, hip: 8, knee: 6, shoulder: 55, elbow: 6 },
    cycle: 6000,
    pulse: true,
  },
  mobility: {
    rig: "stand",
    a: { torso: 2, pelvisY: 0, hip: 2, knee: 2, shoulder: -160, elbow: 24 },
    b: { torso: 2, pelvisY: 0, hip: 2, knee: 2, shoulder: -60, elbow: 60 },
    cycle: 4200,
    fullCircle: true,
  },
};
// --- Étirements : une pose par NOM de consigne (refonte visuels 2026-09-25) ---
// Chaque étirement a sa consigne (debout / assis / allongé, support, côté) :
// la pose est choisie sur le nom normalisé, avec repli par muscle puis
// générique. Toutes les poses ci-dessous ont été vérifiées visuellement
// (scripts/visuels/preview-motions.mjs) contre leur consigne.
function stretchKey(name) {
  return String(name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const STRETCH = {
  epa: { rig: "stand", a: { torso: 2, shoulder: -25, elbow: 5, chest: 1 }, b: { torso: 0, shoulder: -40, elbow: 5, chest: 1.03 } },
  epl: { rig: "stand", a: { torso: 3, shoulder: 85, elbow: 6 }, b: { torso: 3, shoulder: 75, elbow: 10 } },
  epp: { rig: "stand", a: { torso: 3, shoulder: 88, elbow: 4 }, b: { torso: 3, shoulder: 82, elbow: 6 } },
  bic: { rig: "stand", a: { torso: 4, shoulder: -8, elbow: 4 }, b: { torso: 0, shoulder: -45, elbow: 6 } },
  triHaut: { rig: "stand", a: { torso: 6, shoulder: -150, elbow: 110 }, b: { torso: 4, shoulder: -140, elbow: 115 } },
  triBas: { rig: "stand", a: { torso: 4, shoulder: -29, elbow: 195 }, b: { torso: 4, shoulder: -20, elbow: 195 } },
  suspension: { rig: "hang", a: { torso: 2, shoulder: 8, elbow: 6, hip: 4, knee: 8 }, b: { torso: 5, shoulder: 3, elbow: 4, hip: 6, knee: 12 } },
  torsion: { rig: "floor-back", a: { torso: 8, hip: -9, knee: 165, shoulder: -23, elbow: 0 }, b: { torso: 8, hip: 24, knee: 112, shoulder: -23, elbow: 0 } },
  enfant: { rig: "child", a: { torso: 60 }, b: { torso: 78 } },
  pecPorte: { rig: "doorway", a: { torso: 4, pelvisY: 0, hip: 4, knee: 4, shoulder: 46, elbow: 90, backLeg: true }, b: { torso: 12, pelvisY: 6, hip: 20, knee: 25, shoulder: 50, elbow: 88, backLeg: true } },
  pecMur: { rig: "doorway", a: { torso: 4, hip: 4, knee: 4, shoulder: 60, elbow: 40 }, b: { torso: -6, hip: 4, knee: 4, shoulder: 65, elbow: 38 } },
  molMur: { rig: "wall", a: { torso: 25, pelvisY: 14, hip: 30, knee: 40, shoulder: 70, elbow: 5, lungeBack: true }, b: { torso: 32, pelvisY: 18, hip: 35, knee: 45, shoulder: 77, elbow: 0, lungeBack: true } },
  molEscalier: { rig: "stand", a: { torso: 2, pelvisY: -28, hip: 2, knee: 2, shoulder: 4, elbow: 6, heelDrop: 0, step: true, lift2: true }, b: { torso: 4, pelvisY: -20, hip: 3, knee: 4, shoulder: 4, elbow: 6, heelDrop: 1, step: true, lift2: true } },
  quaDebout: { rig: "stand", a: { torso: 4, hip: -25, knee: 145, shoulder: -24, elbow: 2, stance: true, grab: true, support: "left" }, b: { torso: 0, hip: -30, knee: 156, shoulder: -26, elbow: 0, stance: true, grab: true, support: "left" } },
  quaCote: { rig: "floor-back", a: { torso: 8, hip: 10, knee: -20, shoulder: 115, elbow: 0, legUp: 18, legStraight2: true }, b: { torso: 8, hip: 0, knee: -89, shoulder: 155, elbow: 0, legUp: 18, legStraight2: true } },
  isc2: { rig: "sit-floor", a: { torso: 20, hip: 95, knee: 2, shoulder: 45, elbow: 8 }, b: { torso: 78, hip: 95, knee: 4, shoulder: 85, elbow: 6 } },
  isc1: { rig: "sit-floor", a: { torso: 20, hip: 95, knee: 2, shoulder: 45, elbow: 8, bent2: true }, b: { torso: 70, hip: 95, knee: 4, shoulder: 80, elbow: 6, bent2: true } },
  grenouille: { rig: "front", a: { crouch: 70, legL: 70, legR: 70, legTibL: -69, legTibR: -69, armL: 31, armR: 31 }, b: { crouch: 72, legL: 74, legR: 74, legTibL: -72, legTibR: -72, armL: 33, armR: 33 } },
  pigeon: { rig: "sit-floor", a: { torso: 25, hip: 90, knee: 170, shoulder: 50, elbow: 10, cross2: true }, b: { torso: 40, hip: 90, knee: 170, shoulder: 60, elbow: 8, cross2: true } },
  chevalier: { rig: "stand", a: { torso: 6, pelvisY: 40, hip: 71, knee: 67, shoulder: 6, elbow: 8, kneel: true }, b: { torso: 2, pelvisY: 46, hip: 75, knee: 70, shoulder: 6, elbow: 8, kneel: true } },
  adduction: { rig: "front", a: { lean: 6, legL: -30, legR: 5, legTibL: -2, legTibR: 2, armL: 15, armR: 8, legGhost: 0.5 }, b: { lean: 22, legL: -38, legR: 5, legTibL: -2, legTibR: 2, armL: 18, armR: 8, legGhost: 0.5 } },
  cobra: { rig: "cobra", a: { torso: 38 }, b: { torso: 50 } },
  cobraDoux: { rig: "cobra", a: { torso: 25 }, b: { torso: 32 } },
  traResp: { rig: "floor-back", a: { torso: 8, hip: -9, knee: 165, shoulder: 66, elbow: 147, chest: 1 }, b: { torso: 6, hip: -9, knee: 165, shoulder: 64, elbow: 147, chest: 1.06 }, cycle: 7000, pulse: false },
  avb: { rig: "stand", a: { torso: 10, shoulder: 96, elbow: 130, hip: 4, knee: 2 }, b: { torso: 4, shoulder: 100, elbow: 40, hip: 4, knee: 2 } },
};
export const STRETCH_BY_NAME = {
  "mains croisees derriere le dos": STRETCH.epa,
  "bras tendu contre la poitrine": STRETCH.epl,
  "bras tendu devant, main tiree": STRETCH.epp,
  "bras tendu derriere": STRETCH.bic,
  "coude au dessus de la tete": STRETCH.triHaut,
  "main dans le dos": STRETCH.triBas,
  "suspension a la barre": STRETCH.suspension,
  "torsion allongee": STRETCH.torsion,
  "torsion allongee genoux": STRETCH.torsion,
  "position de l enfant (balasana)": STRETCH.enfant,
  "position de l enfant": STRETCH.enfant,
  "etirement dans l encadrement de porte": STRETCH.pecPorte,
  "bras tendu contre le mur": STRETCH.pecMur,
  "etirement contre le mur": STRETCH.molMur,
  "mollet en escalier": STRETCH.molEscalier,
  "talon vers la fesse (debout)": STRETCH.quaDebout,
  "allonge sur le cote": STRETCH.quaCote,
  "flexion avant jambes tendues": STRETCH.isc2,
  "une jambe tendue, une pliee": STRETCH.isc1,
  "grenouille (plantes jointes)": STRETCH.grenouille,
  "pigeon assis": STRETCH.pigeon,
  "etirement du piriforme assis": STRETCH.pigeon,
  "adduction de la hanche debout": STRETCH.adduction,
  "etirement du flechisseur de hanche (chevalier)": STRETCH.chevalier,
  "etirement du cobra": STRETCH.cobra,
  "cobra doux": STRETCH.cobraDoux,
  "respiration diaphragmatique allongee": STRETCH.traResp,
  "etirement des flechisseurs": STRETCH.avb,
  "etirement des extenseurs": STRETCH.avb,
};
// Repli par muscle (étirement futur sans pose nommée) : premier étirement du
// muscle dans la bibliothèque.
export const STRETCH_TARGETS = {
  pec: STRETCH.pecPorte, dos: STRETCH.enfant, epA: STRETCH.epa, epL: STRETCH.epl,
  epP: STRETCH.epp, bic: STRETCH.bic, tri: STRETCH.triHaut, avb: STRETCH.avb,
  abs: STRETCH.cobra, lom: STRETCH.enfant, fes: STRETCH.pigeon, qua: STRETCH.quaDebout,
  isc: STRETCH.isc2, add: STRETCH.grenouille, mol: STRETCH.molMur, tra: STRETCH.cobraDoux,
  moy: STRETCH.chevalier,
};
export { stretchKey };
// Associations explicites créées lors de l'audit — le GIF source serait hors
// sujet pour ces mouvements ; l'animation est propre au geste décrit.
export const EXERCISE_MOTIONS = {
  "respiration-diaphragmatique": POSES.breathe,
  "mobilite-des-epaules": POSES.mobility,
  "wood-chop-poulie-haute": { rig: "stand", a: { torso: 6, hip: 8, knee: 10, shoulder: 100, elbow: 40, cable: "up", backLeg: true }, b: { torso: 22, hip: 12, knee: 14, shoulder: 0, elbow: 6, cable: "up", backLeg: true }, cycle: 2600 },
  "extensions-triceps-pullover-barre-ez": { rig: "bench", a: { torso: 8, hip: 26, knee: 118, shoulder: 90, elbow: 0 }, b: { torso: 8, hip: 26, knee: 118, shoulder: 110, elbow: 51 }, cycle: 3200 },
  "extensions-triceps-barre-ez-pullover": { rig: "bench", a: { torso: 8, hip: 26, knee: 118, shoulder: 90, elbow: 0 }, b: { torso: 8, hip: 26, knee: 118, shoulder: 110, elbow: 51 }, cycle: 3200 },
  "ab-wheel-roulette": { rig: "kneel-rollout", a: { torso: 30, hip: 70, knee: 96, shoulder: 12, elbow: 4 }, b: { torso: 68, hip: 20, knee: 92, shoulder: -8, elbow: 4 }, cycle: 4200 },
  // Leg extension : l'association automatique « famille » pointait vers la
  // presse (faux geste : poly-articulaire vs isolation). La motion legext,
  // vérifiée visuellement, est prioritaire (demo-match la respecte).
  "leg-extension": POSES.legext,
};
// Retirées (audit visuels 2026-09-25) car un GIF exact vérifié existe :
// - "fire-hydrant-a-l-elastique" → d06257e45606b033.gif (abduction de hanche,
//   geste et muscle corrects ; position allongée vs à 4 pattes : approximation
//   du source 1.5.0, conservée comme exact) ;
// - "gainage-planche" → 1317e405efd6ef2b.gif (planche, correct).
export function motionFor(exercise) {
  if (!exercise) return null;
  const id = exercise.id;
  if (EXERCISE_MOTIONS[id]) return { ...EXERCISE_MOTIONS[id], source: "creée-exercice" };
  const pattern = exercise.pattern;
  if (pattern === "stretch") {
    const named = STRETCH_BY_NAME[stretchKey(exercise.name)];
    const t = named || STRETCH_TARGETS[exercise.muscle] || POSES.stretch;
    return { ...t, cycle: t.cycle || 6000, pulse: t.pulse ?? true, source: named ? "creée-étirement-nommé" : "creée-étirement" };
  }
  if (POSES[pattern]) return { ...POSES[pattern], source: "creée-pattern" };
  if (["breathe", "respiration"].includes(pattern)) return { ...POSES.breathe, source: "creée-respiration" };
  if (["swim", "walk"].includes(exercise.pattern)) return { ...POSES[exercise.pattern], source: "creée-pattern" };
  return { ...POSES.mobility, source: "creée-pattern" };
}
export const motionNames = Object.keys(POSES);
