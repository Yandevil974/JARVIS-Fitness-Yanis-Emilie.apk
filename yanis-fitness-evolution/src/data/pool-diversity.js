import { AQUA_MOVEMENTS } from "./metcon-emilie.js";
import { stepGifByPattern, stepGifFromName } from "./visuals-gifs.js";

const PYRAMID_LEVELS = [
  {
    n: "NIVEAU 1 · 2 PYRAMIDES",
    wave1: [30, 45, 60, 45, 30],
    wave2: [35, 50, 65, 50, 35],
    rest: [30, 25],
    between: 45,
    warmup: 180,
    cooldown: 190,
    conseil:
      "Allure progressive, ressenti 5–6/10. Marchez pendant les récupérations et gardez une nage fluide.",
  },
  {
    n: "NIVEAU 2 · 2 PYRAMIDES",
    wave1: [30, 45, 60, 75, 60, 45, 30],
    wave2: [35, 50, 65, 80, 65, 50, 35],
    rest: [25, 20],
    between: 45,
    warmup: 180,
    cooldown: 220,
    conseil:
      "Ressenti 6–7/10, sans sprint maximal. Si la technique se dégrade, ralentissez ou prolongez la récupération.",
  },
  {
    n: "NIVEAU 3 · 2 PYRAMIDES",
    wave1: [30, 45, 60, 75, 90, 75, 60, 45, 30],
    wave2: [35, 50, 65, 80, 95, 80, 65, 50, 35],
    rest: [20, 15],
    between: 45,
    warmup: 180,
    cooldown: 230,
    conseil:
      "Ressenti 7/10 maximum : paliers longs mais contrôlés, jamais d’apnée ni de sprint maximal. Arrêtez en cas de gêne.",
  },
];

function pyramidWaveSteps(level, durations, waveIndex) {
  const steps = [];
  for (const [index, seconds] of durations.entries()) {
    steps.push([
      `Nage en pyramide ${waveIndex}/2 — palier ${index + 1}/${durations.length}`,
      seconds,
    ]);
    if (index < durations.length - 1) {
      const recovery = level.rest[waveIndex - 1];
      steps.push(["Récupération — marche aquatique", recovery]);
    }
  }
  return steps;
}

export const PYRAMID_POOL_PROTOCOL = {
  id: "pyramide-piscine",
  ic: "🌊",
  nom: "Pyramide piscine",
  desc: "Deux vagues de nage en montée puis en descente, avec des récupérations actives en marchant.",
  niveaux: PYRAMID_LEVELS.map((level) => ({
    n: level.n,
    conseil: level.conseil,
    steps: [
      ["Échauffement — marche aquatique", level.warmup],
      ...pyramidWaveSteps(level, level.wave1, 1),
      ["Marche aquatique — récupération entre les pyramides", level.between],
      ...pyramidWaveSteps(level, level.wave2, 2),
      ["Retour au calme — nage douce", level.cooldown],
    ],
  })),
};

const CIRCUIT_MOVEMENTS = AQUA_MOVEMENTS.filter(
  (movement) => movement !== "Pompes au bord",
);
const CIRCUIT_STARTS = [0, 2, 4, 6];
const CIRCUIT_LEVELS = [
  {
    n: "NIVEAU 1 · 3 TOURS",
    tours: 3,
    work: [25, 30, 35, 25, 30, 35],
    rest: [20, 20, 15, 20, 20],
    between: 45,
    warmup: 180,
    cooldown: 150,
    conseil:
      "Enchaînez à 5–6/10, sans vous précipiter. Les temps changent d’un mouvement à l’autre : gardez une exécution propre.",
  },
  {
    n: "NIVEAU 2 · 4 TOURS",
    tours: 4,
    work: [30, 35, 40, 30, 35, 40],
    rest: [15, 20, 15, 20, 15],
    between: 40,
    warmup: 180,
    cooldown: 120,
    conseil:
      "Ressenti 6–7/10. Les efforts s’allongent : gardez le buste stable et reprenez votre souffle à chaque récupération.",
  },
  {
    n: "NIVEAU 3 · 4 TOURS",
    tours: 4,
    work: [40, 45, 50, 40, 45, 50],
    rest: [15, 15, 15, 15, 15],
    between: 30,
    warmup: 180,
    cooldown: 180,
    conseil:
      "Ressenti 7/10 maximum. Efforts soutenus, jamais à fond ; ralentissez si la coordination ou la respiration se dégrade.",
  },
];

function rotatedCircuitMovements(tour) {
  const offset =
    CIRCUIT_STARTS[tour % CIRCUIT_STARTS.length] % CIRCUIT_MOVEMENTS.length;
  const rotated = [
    ...CIRCUIT_MOVEMENTS.slice(offset),
    ...CIRCUIT_MOVEMENTS.slice(0, offset),
  ];
  return rotated.slice(0, 6);
}

function circuitSteps(level) {
  const steps = [];
  for (let tour = 0; tour < level.tours; tour++) {
    steps.push([`Tour aqua ${tour + 1}/${level.tours} — départ`, 5]);
    const movements = rotatedCircuitMovements(tour);
    for (const [index, movement] of movements.entries()) {
      steps.push([
        `${movement} — effort variable ${index + 1}`,
        level.work[index],
      ]);
      if (index < movements.length - 1)
        steps.push([
          "Marche aquatique — récupération active",
          level.rest[index],
        ]);
    }
    if (tour < level.tours - 1)
      steps.push([
        "Marche aquatique — récupération entre les tours",
        level.between,
      ]);
  }
  return steps;
}

export const VARIABLE_AQUA_CIRCUIT_PROTOCOL = {
  id: "circuit-aqua-variable",
  ic: "⚡",
  nom: "Circuit aqua à intervalles variables",
  desc: "Six mouvements aquatiques par tour, avec des efforts de durées variables et un ordre qui tourne d’un tour à l’autre.",
  niveaux: CIRCUIT_LEVELS.map((level) => ({
    n: level.n,
    conseil: level.conseil,
    steps: [
      ["Échauffement — marche aquatique", level.warmup],
      ...circuitSteps(level),
      ["Retour au calme — nage douce", level.cooldown],
    ],
  })),
};

export const OPTIONAL_POOL_PROTOCOLS = [
  PYRAMID_POOL_PROTOCOL,
  VARIABLE_AQUA_CIRCUIT_PROTOCOL,
];

export function isOptionalPoolProtocol(protocolId) {
  return OPTIONAL_POOL_PROTOCOLS.some((protocol) => protocol.id === protocolId);
}

export function optionalPoolStepGif(name, profile, pattern) {
  return (
    stepGifFromName(name, profile) || stepGifByPattern(pattern, profile, true)
  );
}
