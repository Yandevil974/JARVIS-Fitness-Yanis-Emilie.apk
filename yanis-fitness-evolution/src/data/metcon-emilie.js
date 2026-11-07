// Protocoles METCON d'Émilie, construits uniquement avec les mouvements et
// consignes déjà présents dans ses protocoles piscine/aqua.
const POOL_ROUNDS = [
  {
    n: "NIVEAU 1 · 4 TOURS",
    tours: 4,
    work: [55, 30, 25, 30, 25],
    warmup: [
      ["Échauffement — marche aquatique", 120],
      ["Échauffement — battements au bord", 60],
    ],
    cooldown: [
      ["Retour au calme — nage douce", 120],
      ["Étirements au bord", 120],
    ],
    conseil: "Allure soutenue mais propre, récup complète en marchant.",
  },
  {
    n: "NIVEAU 2 · 5 TOURS",
    tours: 5,
    work: [60, 35, 30, 25, 15],
    warmup: [
      ["Échauffement — marche aquatique", 120],
      ["Échauffement — battements au bord", 60],
    ],
    cooldown: [
      ["Retour au calme — nage douce", 150],
      ["Étirements au bord", 165],
    ],
    conseil:
      "Qualité > quantité. La dernière doit être aussi propre que la première.",
  },
  {
    n: "NIVEAU 3 · 6 TOURS",
    tours: 6,
    work: [70, 45, 35, 25, 15],
    warmup: [
      ["Échauffement — marche aquatique", 120],
      ["Échauffement — battements + mobilité", 120],
    ],
    cooldown: [
      ["Retour au calme — nage douce", 150],
      ["Étirements au bord", 90],
    ],
    conseil: "Séance exigeante : pas de muscu dure le même jour.",
  },
];

function poolRoundSteps({ tours, work }) {
  const steps = [];
  for (let i = 1; i <= tours; i++) {
    steps.push(
      [`Nager — fractionné ${i}/${tours}`, work[0]],
      ["Pompes au bord — EFFORT", work[1]],
      [`Nager sprint ${i}/${tours}`, work[2]],
      ["Gainage vertical — EFFORT", work[3]],
      ["Récup courte — marche", work[4]],
    );
  }
  return steps;
}

export const METCON_PISCINE = {
  id: "metcon-piscine",
  ic: "🌊",
  nom: "METCON Piscine",
  desc: "Nage fractionnée, sprint et renforcement au bord, avec récupérations courtes.",
  niveaux: POOL_ROUNDS.map((level) => ({
    n: level.n,
    conseil: level.conseil,
    steps: [...level.warmup, ...poolRoundSteps(level), ...level.cooldown],
  })),
};

const AQUA_MOVEMENTS = [
  "Aqua-jogging",
  "Montées de genoux",
  "Ciseaux au bord",
  "Battements de jambes",
  "Déplacements latéraux (4 m)",
  "Pompes au bord",
  "Gainage vertical",
  "Talons-fesses",
];
const CYCLE_ROTATIONS = [0, 3, 6, 1, 4];
const AQUA_CYCLES = [
  {
    n: "NIVEAU 1 · 3 CYCLES",
    cycles: 3,
    between: 60,
    warmup: [["Échauffement — marche aquatique", 180]],
    cooldown: [["Retour au calme — nage douce", 150]],
    conseil: "Mouvements amples, restez gainé.",
  },
  {
    n: "NIVEAU 2 · 4 CYCLES",
    cycles: 4,
    between: 45,
    warmup: [["Échauffement — marche aquatique", 180]],
    cooldown: [["Retour au calme — nage douce", 180]],
    conseil: "Le standard : 4 min d'effort dense par cycle.",
  },
  {
    n: "NIVEAU 3 · 5 CYCLES",
    cycles: 5,
    between: 30,
    warmup: [
      ["Échauffement — marche aquatique", 120],
      ["Échauffement — battements au bord", 120],
    ],
    cooldown: [["Retour au calme — nage douce", 210]],
    conseil: "Séance complète, jours 🟢 uniquement.",
  },
];

function rotatedAquaMovements(cycleIndex) {
  const offset = CYCLE_ROTATIONS[cycleIndex];
  return [...AQUA_MOVEMENTS.slice(offset), ...AQUA_MOVEMENTS.slice(0, offset)];
}

function aquaCycleSteps({ cycles, between }) {
  const steps = [];
  for (let cycle = 0; cycle < cycles; cycle++) {
    steps.push([`Tabata ${cycle + 1}/${cycles} — en place`, 5]);
    for (const movement of rotatedAquaMovements(cycle)) {
      steps.push([`${movement} — EFFORT`, 20], ["Repos", 10]);
    }
    if (cycle < cycles - 1) steps.push(["Récup entre tabatas", between]);
  }
  return steps;
}

export const METCON_AQUATABATA = {
  id: "metcon-aquatabata",
  ic: "🔥",
  nom: "METCON Aqua Tabata",
  desc: "Tabata aquatique 20/10 : huit mouvements différents, dans un ordre qui tourne à chaque cycle.",
  niveaux: AQUA_CYCLES.map((level) => ({
    n: level.n,
    conseil: level.conseil,
    steps: [...level.warmup, ...aquaCycleSteps(level), ...level.cooldown],
  })),
};

export const METCON_PROTOCOLS = [METCON_PISCINE, METCON_AQUATABATA];
export { AQUA_MOVEMENTS, CYCLE_ROTATIONS };
