import legacy from "./legacy.json" with { type: "json" };
import { norm, slug, textOnly } from "../engine/utils.js";
export { legacy };
export const MUSCLES = {
  pec: "Pectoraux",
  dos: "Dos",
  epA: "Épaules antérieures",
  epL: "Épaules latérales",
  epP: "Épaules postérieures",
  bic: "Biceps",
  tri: "Triceps",
  avb: "Avant-bras",
  abs: "Abdominaux",
  tra: "Gainage profond",
  lom: "Lombaires",
  fes: "Fessiers",
  moy: "Moyen fessier",
  qua: "Quadriceps",
  isc: "Ischio-jambiers",
  add: "Adducteurs",
  mol: "Mollets",
};
export const GROUPS = {
  all: "Tous les muscles",
  pec: "Pectoraux",
  dos: "Dos",
  shoulders: "Épaules",
  arms: "Bras",
  legs: "Jambes",
  glutes: "Fessiers",
  core: "Abdominaux",
};
export const GROUP_MEMBERS = {
  shoulders: ["epA", "epL", "epP"],
  arms: ["bic", "tri", "avb"],
  legs: ["qua", "isc", "add", "mol"],
  glutes: ["fes", "moy"],
  core: ["abs", "tra", "lom"],
};
export const EQUIPMENT = {
  barbell: "Barre",
  dumbbell: "Haltères",
  cable: "Poulie",
  machine: "Machines",
  band: "Élastique",
  bodyweight: "Poids du corps",
  bench: "Banc",
  pullup: "Barre de traction",
  pool: "Piscine",
  elliptical: "Elliptique",
  bike: "Vélo",
  rower: "Rameur",
};
export const SECONDARY = {
  pec: ["tri", "epA"],
  dos: ["bic", "epP"],
  epA: ["tri"],
  epL: ["epP"],
  epP: ["dos"],
  bic: ["avb"],
  tri: ["epA"],
  qua: ["fes", "add"],
  isc: ["fes", "lom"],
  fes: ["isc", "qua"],
  moy: ["fes"],
  abs: ["tra"],
  tra: ["abs"],
  lom: ["fes"],
  mol: [],
  avb: ["bic"],
  add: ["qua"],
};
function patternFor(name, m) {
  const n = norm(name);
  if (/hip thrust|glute bridge|pont fessier/.test(n)) return "bridge";
  if (/abduction|clamshell|fire hydrant/.test(n)) return "abduction";
  if (/leg curl/.test(n)) return "legcurl";
  if (/leg extension/.test(n)) return "legext";
  if (/gainage|planche|pallof|bird dog|dead bug/.test(n)) return "static";
  if (/fente|lunge|split squat|step up/.test(n)) return "lunge";
  if (/squat|leg press|presse a cuisses/.test(n)) return "squat";
  if (/souleve|roumain|good morning|back extension|glute ham/.test(n))
    return "hinge";
  if (/mollet/.test(n)) return "calf";
  if (/rowing|tirage horizontal|face pull/.test(n)) return "row";
  if (/traction|tirage vertical|pullover/.test(n)) return "pull";
  if (m === "bic") return "curl";
  if (m === "tri") return "triceps";
  if (/elevation|ecarte/.test(n)) return "lat";
  if (/militaire|nuque|halteres assis/.test(n)) return "raise";
  if (m === "pec") return "press";
  if (["abs", "tra"].includes(m)) return "crunch";
  return "static";
}
function equipmentFor(name) {
  const n = norm(name);
  if (/poulie|cable|pushdown|tirage|rowing assis/.test(n)) return ["cable"];
  if (/elastique/.test(n)) return ["band"];
  if (/machine|leg curl|leg extension|leg press|hack squat|presse a/.test(n))
    return ["machine"];
  if (/traction|pull up|chin up|suspendu/.test(n)) return ["pullup"];
  if (/haltere|goblet/.test(n))
    return /banc|incline|couche|assis/.test(n)
      ? ["dumbbell", "bench"]
      : ["dumbbell"];
  if (
    /barre|barbell|back squat|front squat|souleve de terre$|militaire debout|good morning/.test(
      n,
    )
  )
    return /couche|incline/.test(n) ? ["barbell", "bench"] : ["barbell"];
  return ["bodyweight"];
}
const rows = new Map();
for (const [source, data] of Object.entries(legacy))
  for (const phase of Object.values(data.PROGRAM))
    for (const s of Object.values(phase.sessions))
      for (const row of s.exos) {
        const key = slug(row[0]);
        if (!rows.has(key)) rows.set(key, { row, sources: [source] });
        else if (!rows.get(key).sources.includes(source))
          rows.get(key).sources.push(source);
      }
const extra = [
  [
    "Pompes",
    "pec",
    3,
    "8-15",
    "3010",
    90,
    "Mains sous les épaules, corps aligné.",
  ],
  [
    "Squat au poids du corps",
    "qua",
    3,
    "10-15",
    "3010",
    60,
    "Descendre selon une amplitude confortable.",
  ],
  [
    "Rowing à l’élastique",
    "dos",
    3,
    "10-15",
    "3010",
    90,
    "Fixer solidement l’élastique avant de tirer.",
  ],
  [
    "Fentes arrière au poids du corps",
    "qua",
    3,
    "8-12",
    "3010",
    90,
    "Se tenir à un support si nécessaire.",
  ],
  [
    "Mobilité des épaules",
    "epA",
    2,
    "30 s",
    "lent",
    15,
    "Cercles lents et indolores.",
  ],
  [
    "Respiration diaphragmatique",
    "tra",
    1,
    "60 s",
    "lent",
    0,
    "Inspirer 4 secondes et expirer 6 secondes, sans apnée.",
  ],
];
for (const row of extra) rows.set(slug(row[0]), { row, sources: ["jarvis"] });
const guides = { ...legacy.elite.MUSCU_GUIDES, ...legacy.emilie.MUSCU_GUIDES };
export const PATTERN_INFO = {
  ...legacy.elite.PATTERN_INFO,
  hinge: {
    resp: "Expirez à la remontée. Gardez une respiration adaptée à votre effort, sans apnée prolongée.",
    etapes: [
      "Debout, genoux légèrement fléchis, dos neutre.",
      "Reculez les hanches en gardant la charge proche du corps.",
      "Poussez le sol et redressez les hanches sans cambrer.",
    ],
    erreurs: [
      "Arrondir le dos sous charge.",
      "Descendre au-delà de sa mobilité.",
    ],
  },
  lunge: {
    resp: "Inspirez à la descente, expirez en remontant.",
    etapes: [
      "Pieds décalés, appuis stables.",
      "Fléchissez les deux jambes, genou avant dans l’axe du pied.",
      "Repoussez le sol pour revenir avec contrôle.",
    ],
    erreurs: ["Perdre l’équilibre.", "Forcer une amplitude douloureuse."],
  },
  bridge: {
    resp: "Expirez en montant le bassin, inspirez en descendant.",
    etapes: [
      "Haut du dos sur le banc ou au sol, pieds stables, charge protégée sur les hanches.",
      "Élevez le bassin en contractant les fessiers.",
      "Alignez épaules, bassin et genoux sans hyperextension lombaire.",
    ],
    erreurs: ["Cambrer le dos au sommet.", "Pousser sur la pointe des pieds."],
  },
  abduction: {
    resp: "Expirez à l’ouverture, inspirez au retour.",
    etapes: [
      "Bassin fixe, buste stable, résistance légère.",
      "Écartez la jambe ou les genoux sans tourner le bassin.",
      "Revenez lentement à la position de départ.",
    ],
    erreurs: [
      "Prendre de l’élan.",
      "Incliner le buste pour augmenter l’amplitude.",
    ],
  },
  triceps: {
    resp: "Expirez à l’extension, inspirez au retour.",
    etapes: [
      "Coudes stables, poignets neutres, épaules basses.",
      "Tendez le coude en contrôlant la résistance.",
      "Repliez lentement sans laisser les épaules compenser.",
    ],
    erreurs: [
      "Déplacer les coudes à chaque répétition.",
      "Verrouiller brutalement le coude.",
    ],
  },
};
export const EXERCISES = [...rows.entries()].map(([id, { row, sources }]) => {
  const [name, muscle, sets, reps, tempo, rest, note] = row;
  const n = norm(name);
  let guide = guides[n];
  if (guide?.ref) guide = guides[guide.ref];
  const pattern = patternFor(name, muscle);
  const equipment = equipmentFor(name);
  const numbers = String(reps).match(/\d+/g)?.map(Number) || [10];
  const timed =
    /\d+\s*(s\b|sec|min)/.test(norm(reps)) ||
    /gainage|planche|respiration|mobilite/.test(n);
  const perHand = /haltere/.test(n) && !/roumain|bulgarian|fente/.test(n);
  return {
    id,
    name,
    muscle,
    secondary: SECONDARY[muscle] || [],
    stabilizers: ["abs", "tra", "lom"].filter((m) => m !== muscle),
    equipment,
    pattern,
    sources,
    defaultSets: Math.max(1, parseInt(sets) || 3),
    repsLow: Math.min(...numbers),
    repsHigh: Math.max(...numbers),
    repScheme: String(reps),
    tempo,
    rest: Number(rest) || 60,
    note: textOnly(note),
    tip: textOnly(guide?.tip),
    gif: guide?.img || null,
    level: /test|inertie|snatch|drop|myo|1,5/.test(n)
      ? "Avancé"
      : equipment.includes("bodyweight")
        ? "Débutant"
        : "Intermédiaire",
    timed,
    bodyweight: equipment.every((x) =>
      ["bodyweight", "band", "pullup"].includes(x),
    ),
    unit: timed ? "secondes" : perHand ? "kg/main" : "kg total",
    amplitude:
      "Amplitude contrôlée et confortable, sans douleur. Ne forcez pas au-delà de votre mobilité.",
  };
});
export const EXERCISE_MAP = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
export function findExercise(name) {
  return (
    EXERCISE_MAP[name] ||
    EXERCISES.find((e) => norm(e.name) === norm(name)) ||
    EXERCISES.find((e) => norm(e.name).includes(norm(name)))
  );
}
export function exerciseById(id) {
  return (
    EXERCISE_MAP[id] || {
      id,
      name: String(id).replace(/^source:/, ""),
      muscle: "unknown",
      secondary: [],
      stabilizers: [],
      equipment: ["bodyweight"],
      pattern: "static",
      unit: "kg total",
      repsLow: 8,
      repsHigh: 12,
      rest: 90,
    }
  );
}
export function alternatives(exercise, profile, { exclude = [] } = {}) {
  return EXERCISES.filter(
    (e) =>
      e.id !== exercise.id &&
      e.muscle === exercise.muscle &&
      e.level !== "Avancé" &&
      !exclude.includes(e.id) &&
      !profile.preferences.refused.includes(e.id) &&
      e.equipment.every((eq) => profile.equipment.includes(eq)),
  )
    .sort(
      (a, b) =>
        Number(b.pattern === exercise.pattern) -
          Number(a.pattern === exercise.pattern) ||
        Number(profile.preferences.favorites.includes(b.id)) -
          Number(profile.preferences.favorites.includes(a.id)),
    )
    .slice(0, 5);
}
export function searchExercises(query = "", group = "all", equipment = "all") {
  const q = norm(query),
    wanted = [];
  for (const [word, m] of Object.entries({
    pectoraux: "pec",
    pec: "pec",
    dos: "dos",
    biceps: "bic",
    triceps: "tri",
    fessier: "fes",
    quadriceps: "qua",
    ischio: "isc",
    abdo: "abs",
  }))
    if (q.includes(word)) wanted.push(m);
  const home = /maison|sans machine|poids du corps/.test(q);
  const incline = /haut des pec|haut de pec|haut pector/.test(q);
  const words = q
    .replace(
      /exercices?|haut des?|maison|sans machine|poids du corps|remplacer|pour|les|des|avec|de |du /g,
      "",
    )
    .split(" ")
    .filter(Boolean);
  return EXERCISES.filter(
    (e) =>
      (group === "all" ||
        (GROUP_MEMBERS[group] || [group]).includes(e.muscle)) &&
      (equipment === "all" || e.equipment.includes(equipment)) &&
      (!home ||
        !e.equipment.some((eq) =>
          ["machine", "cable", "barbell"].includes(eq),
        )) &&
      (!incline || norm(e.name).includes("inclin")) &&
      (!q ||
        wanted.includes(e.muscle) ||
        words.every((w) =>
          norm(
            e.name +
              " " +
              MUSCLES[e.muscle] +
              " " +
              e.equipment.map((x) => EQUIPMENT[x]).join(" "),
          ).includes(w),
        )),
  ).sort((a, b) => Number(b.level !== "Avancé") - Number(a.level !== "Avancé"));
}
export const RECOVERY_EXERCISES = Object.entries({
  ...legacy.elite.ETIREMENTS_PAR_MUSCLE,
  ...legacy.emilie.ETIREMENTS_PAR_MUSCLE,
}).flatMap(([muscle, v]) =>
  v.exos.map((e, i) => ({
    id: `stretch-${muscle}-${i}`,
    name: e[1],
    muscle,
    secondary: [],
    stabilizers: [],
    pattern: "stretch",
    equipment: ["bodyweight"],
    timed: true,
    seconds: 30,
    unit: "secondes",
    instruction: e[3],
    duration: e[2],
    level: "Tous niveaux",
  })),
);
export const POOL_PROTOCOLS = legacy.emilie.POOL_PROTOS.map((p) => ({
  ...p,
  desc: p.desc
    .replace(/zéro risque articulaire/gi, "faible impact articulaire")
    .replace(/zéro impact/gi, "faible impact"),
}));
export const POOL_GUIDES = legacy.emilie.POOL_GUIDES.map((g) => ({
  ...g,
  h: g.h.map(textOnly),
}));
export const FOOD = legacy.elite.ALIMENTS;
export const MEASURES = [
  ...new Map(
    [...legacy.elite.MENS_FIELDS, ...legacy.emilie.MENS_FIELDS].map((v) => [
      v[0],
      v,
    ]),
  ).values(),
];
export const GOALS = {
  recomposition: "Recomposition",
  hypertrophy: "Hypertrophie",
  strength: "Force",
  cut: "Sèche modérée",
  endurance: "Endurance",
  wellbeing: "Forme & santé",
};
