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
const POSES = {
  squat: {
    rig: "stand",
    a: { torso: 8, pelvisY: 0, hip: 8, knee: 6, ankle: 0, shoulder: 88, elbow: 60, bar: "back" },
    b: { torso: 38, pelvisY: 62, hip: 92, knee: 98, ankle: 34, shoulder: 100, elbow: 46, bar: "back" },
    cycle: 3000,
  },
  hinge: {
    rig: "stand",
    a: { torso: 8, pelvisY: 0, hip: 6, knee: 12, ankle: 0, shoulder: 10, elbow: 4, bar: "hands" },
    b: { torso: 72, pelvisY: 14, hip: 68, knee: 18, ankle: 2, shoulder: 14, elbow: 6, bar: "hands" },
    cycle: 3400,
  },
  lunge: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 18, knee: 22, ankle: 0, shoulder: 6, elbow: 6, backLeg: true, db: true },
    b: { torso: 12, pelvisY: 58, hip: 88, knee: 96, ankle: 30, shoulder: 8, elbow: 6, backLeg: true, db: true },
    cycle: 3200,
  },
  bridge: {
    rig: "floor-back",
    a: { torso: 8, hip: 96, knee: 92, shoulder: 40, elbow: 10, bar: "hips" },
    b: { torso: -6, hip: 30, knee: 78, shoulder: 34, elbow: 10, bar: "hips" },
    cycle: 2600,
  },
  abduction: {
    rig: "stand-side",
    a: { torso: 2, pelvisY: 0, hip: 3, knee: 2, ankle: 0, shoulder: 4, elbow: 6, band: true },
    b: { torso: 4, pelvisY: 0, hip: 46, knee: 3, ankle: 0, shoulder: 4, elbow: 6, band: true },
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
    a: { torso: 2, pelvisY: 0, hip: 2, knee: 2, ankle: 22, shoulder: 4, elbow: 6, heelsDown: true },
    b: { torso: 2, pelvisY: -18, hip: 2, knee: 2, ankle: -18, shoulder: 4, elbow: 6 },
    cycle: 1800,
  },
  press: {
    rig: "bench",
    a: { torso: 86, hip: 26, knee: 88, shoulder: 96, elbow: 118, bar: "hands", bench: true },
    b: { torso: 86, hip: 24, knee: 86, shoulder: 168, elbow: 8, bar: "hands", bench: true },
    cycle: 2400,
  },
  raise: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: 6, elbow: 14, db: true },
    b: { torso: 2, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: 96, elbow: 22, db: true },
    cycle: 2600,
  },
  pull: {
    rig: "machine-seat",
    a: { torso: 10, hip: 82, knee: 88, shoulder: 168, elbow: 26, bar: "over" },
    b: { torso: 16, hip: 80, knee: 86, shoulder: 96, elbow: 92, bar: "over" },
    cycle: 2400,
  },
  row: {
    rig: "machine-seat",
    a: { torso: 24, hip: 84, knee: 90, shoulder: -22, elbow: 140, cable: "front" },
    b: { torso: 14, hip: 80, knee: 88, shoulder: 30, elbow: 26, cable: "front" },
    cycle: 2300,
  },
  curl: {
    rig: "stand",
    a: { torso: 4, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: 4, elbow: 12, db: true },
    b: { torso: 3, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: 4, elbow: 86, db: true },
    cycle: 2200,
  },
  triceps: {
    rig: "cable-high",
    a: { torso: 12, pelvisY: 0, hip: 20, knee: 24, ankle: 0, shoulder: 28, elbow: 112, cable: "up" },
    b: { torso: 10, pelvisY: 0, hip: 18, knee: 22, ankle: 0, shoulder: 34, elbow: 4, cable: "up" },
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
    a: { torso: 3, pelvisY: 0, hip: -24, knee: 30, ankle: 6, shoulder: 24, elbow: 30, anti: true },
    b: { torso: 3, pelvisY: 0, hip: 24, knee: 8, ankle: -6, shoulder: -24, elbow: 30, anti: true },
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
    a: { torso: 2, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: 4, elbow: 8, chest: 1 },
    b: { torso: 4, pelvisY: -3, hip: 2, knee: 2, ankle: 0, shoulder: 22, elbow: 14, chest: 1.07 },
    cycle: 7000,
  },
  stretch: {
    rig: "stand",
    a: { torso: 8, pelvisY: 0, hip: 10, knee: 8, ankle: 0, shoulder: 30, elbow: 10 },
    b: { torso: 52, pelvisY: 26, hip: 74, knee: 10, ankle: 2, shoulder: 96, elbow: 6 },
    cycle: 6000,
    pulse: true,
  },
  mobility: {
    rig: "stand",
    a: { torso: 2, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: -160, elbow: 24 },
    b: { torso: 2, pelvisY: 0, hip: 2, knee: 2, ankle: 0, shoulder: -60, elbow: 60 },
    cycle: 4200,
    fullCircle: true,
  },
};
// Cibles « stretch » par muscle : position de fin conforme à la consigne.
const STRETCH_TARGETS = {
  pec: { rig: "doorway", a: { torso: 4, shoulder: 96, elbow: 90, hip: 4, knee: 2 }, b: { torso: -10, shoulder: 150, elbow: 90, hip: 4, knee: 2 } },
  dos: { rig: "hang", a: { torso: 4, shoulder: -168, elbow: 4, hip: 2, knee: 2 }, b: { torso: 14, shoulder: -150, elbow: 4, hip: 6, knee: 10 } },
  epA: POSES.mobility,
  epL: POSES.mobility,
  epP: POSES.mobility,
  bic: { rig: "stand", a: { torso: 6, shoulder: 90, elbow: 96, hip: 4, knee: 2 }, b: { torso: 0, shoulder: 140, elbow: 60, hip: 2, knee: 2 } },
  tri: { rig: "stand", a: { torso: 6, shoulder: -150, elbow: 110, hip: 4, knee: 2 }, b: { torso: 4, shoulder: -160, elbow: 8, hip: 4, knee: 2 } },
  avb: { rig: "stand", a: { torso: 10, shoulder: 96, elbow: 130, hip: 4, knee: 2 }, b: { torso: 4, shoulder: 100, elbow: 40, hip: 4, knee: 2 } },
  abs: { rig: "floor-back", a: { torso: 6, hip: 10, knee: 96, shoulder: 12, elbow: 8 }, b: { torso: -16, hip: 6, knee: 90, shoulder: 6, elbow: 6 } },
  lom: { rig: "child", a: { torso: 60, hip: 100, knee: 90, shoulder: -40, elbow: 4 }, b: { torso: 78, hip: 112, knee: 96, shoulder: -60, elbow: 4 } },
  fes: { rig: "figure4", a: { torso: 14, hip: 84, knee: 40, shoulder: 12, elbow: 4 }, b: { torso: 44, hip: 118, knee: 96, shoulder: 18, elbow: 4 } },
  qua: { rig: "stand", a: { torso: 6, pelvisY: 0, hip: 2, knee: 2, shoulder: 24, elbow: 40, grab: true }, b: { torso: -6, pelvisY: 40, hip: 46, knee: 138, shoulder: 12, elbow: 20, grab: true } },
  isc: { rig: "stand", a: { torso: 6, hip: 4, knee: 2, shoulder: 8, elbow: 4 }, b: { torso: 66, pelvisY: 34, hip: 84, knee: 4, shoulder: 40, elbow: 4 } },
  add: { rig: "wide", a: { torso: 4, hip: 34, knee: 6, shoulder: 6, elbow: 6 }, b: { torso: 16, hip: 12, knee: 60, shoulder: 6, elbow: 6, side: true } },
  mol: { rig: "wall", a: { torso: 14, hip: 4, knee: 2, ankle: 0, shoulder: 30, elbow: 14, handsWall: true }, b: { torso: 30, hip: 6, knee: 26, ankle: 30, shoulder: 34, elbow: 12, handsWall: true } },
  tra: POSES.breathe,
};
// Associations explicites créées lors de l'audit — le GIF source serait hors
// sujet pour ces mouvements ; l'animation est propre au geste décrit.
const EXERCISE_MOTIONS = {
  "respiration-diaphragmatique": POSES.breathe,
  "mobilite-des-epaules": POSES.mobility,
  "wood-chop-poulie-haute": { ...POSES.crunch, rig: "cable-high", cycle: 2600, chop: true },
  "ab-wheel-roulette": { rig: "kneel-rollout", a: { torso: 30, hip: 70, knee: 96, shoulder: 12, elbow: 4, wheel: true }, b: { torso: 68, hip: 20, knee: 92, shoulder: -8, elbow: 4, wheel: true }, cycle: 4200 },
  "fire-hydrant-a-l-elastique": { rig: "quadruped", a: { torso: 2, hip: 8, knee: 92, shoulder: 6, elbow: 4 }, b: { torso: 0, hip: -46, knee: 78, shoulder: 6, elbow: 4, side: true }, cycle: 2400 },
  "gainage-planche": POSES.static,
};
export function motionFor(exercise) {
  if (!exercise) return null;
  const id = exercise.id;
  if (EXERCISE_MOTIONS[id]) return { ...EXERCISE_MOTIONS[id], source: "creée-exercice" };
  const pattern = exercise.pattern;
  if (pattern === "stretch") {
    const t = STRETCH_TARGETS[exercise.muscle] || POSES.stretch;
    return { ...POSES.stretch, ...t, cycle: t.cycle || 6000, pulse: true, source: "creée-étirement" };
  }
  if (POSES[pattern]) return { ...POSES[pattern], source: "creée-pattern" };
  if (["breathe", "respiration"].includes(pattern)) return { ...POSES.breathe, source: "creée-respiration" };
  if (["swim", "walk"].includes(exercise.pattern)) return { ...POSES[exercise.pattern], source: "creée-pattern" };
  return { ...POSES.mobility, source: "creée-pattern" };
}
export const motionNames = Object.keys(POSES);
