// Contexte minimal par sujets.
//
// Le Brain ne recalcule rien : chaque fait vient d'un moteur déterministe déjà
// présent dans l'application (planner, fitness, force, plan-memory…). Les
// valeurs absentes restent `null` : jamais de chiffre inventé, jamais de
// mémoire non confirmée.
import { normalizeUtterance } from "../engine/coach.js";
import { recoveryScore } from "../engine/fitness.js";
import { forceRevalState } from "../engine/force.js";
import { nutritionTargets } from "../engine/nutrition.js";
import { plannedSessions } from "../engine/plan-memory.js";
import { nextSession } from "../engine/planner.js";
import { today } from "../engine/utils.js";
import { memoryStats, recallMemories } from "./memory.js";

export const CONTEXT_TOPICS = Object.freeze({
  general: "general",
  seance: "seance",
  programme: "programme",
  force: "force",
  recuperation: "recuperation",
  cardio: "cardio",
  nutrition: "nutrition",
  materiel: "materiel",
  memoire: "memoire",
});
export const CONTEXT_TOPIC_IDS = Object.freeze(Object.keys(CONTEXT_TOPICS));

const TOPIC_CUES = [
  [
    "seance",
    [
      "seance",
      "entrainement",
      "musculation",
      "aujourd hui",
      "demain",
      "prochaine seance",
      "je fais quoi",
      "on fait quoi",
    ],
  ],
  [
    "programme",
    [
      "programme",
      "planning",
      "planifie",
      "cycle",
      "frequence",
      "par semaine",
      "phase",
      "programmation",
    ],
  ],
  [
    "force",
    ["1rm", "force", "charge", "record", "bilan de force", "reevaluation"],
  ],
  [
    "recuperation",
    [
      "recuperation",
      "sommeil",
      "dormi",
      "fatigue",
      "repos",
      "courbature",
      "energie",
      "douleur",
    ],
  ],
  [
    "cardio",
    [
      "cardio",
      "piscine",
      "aqua",
      "elliptique",
      "velo",
      "course",
      "natation",
      "swim",
      "metcon",
    ],
  ],
  [
    "nutrition",
    [
      "nutrition",
      "calorie",
      "macro",
      "repas",
      "proteine",
      "glucide",
      "lipide",
      "manger",
      "poids",
    ],
  ],
  [
    "materiel",
    [
      "materiel",
      "haltere",
      "barre",
      "machine",
      "salle",
      "elastique",
      "poids du corps",
    ],
  ],
  [
    "memoire",
    [
      "retiens",
      "souviens",
      "memoire",
      "memorise",
      "rappelle moi",
      "garde en memoire",
    ],
  ],
];

// Détection de sujet par mots-clés, sur le texte déjà normalisé par le coach
// (mêmes coquilles tolérées), sans jamais interpréter au-delà du texte.
export function topicsFor(text) {
  const q = normalizeUtterance(text);
  const topics = TOPIC_CUES.filter(([, cues]) =>
    cues.some((cue) =>
      cue.includes(" ") ? q.includes(cue) : new RegExp(`\\b${cue}\\b`).test(q),
    ),
  ).map(([id]) => id);
  return topics.length ? topics : [CONTEXT_TOPICS.general];
}

function sessionFacts(p) {
  const session = p.workout || nextSession(p);
  if (!session) return { seance: null };
  return {
    seance: {
      nom: session.name || null,
      date: session.date || null,
      statut: session.status || (p.workout ? "inProgress" : "planned"),
      exercices: Array.isArray(session.exercises)
        ? session.exercises.length
        : 0,
      minutes_estimees: Number.isFinite(session.estimatedMinutes)
        ? session.estimatedMinutes
        : null,
      adapted: session.coachAdapted || null,
    },
  };
}

function plannedCount(p) {
  try {
    return plannedSessions(p).length;
  } catch (e) {
    return (p.plan?.sessions || []).length;
  }
}

const FACT_PROVIDERS = {
  seance: sessionFacts,
  programme: (p) => ({
    programme: {
      frequence: p.user?.frequency ?? null,
      semaines: p.plan?.weeks ?? null,
      seances_planifiees: plannedCount(p),
      source: p.plan?.source || null,
    },
  }),
  force: (p) => {
    const state = forceRevalState(p);
    return {
      force: {
        bilan_fait: !!state.done,
        libelle: state.label || null,
        prochaine_reevaluation: state.next || null,
        jours_restants: state.days ?? null,
      },
    };
  },
  recuperation: (p, on) => {
    const score = recoveryScore(p, on);
    const entry = p.checkIns?.[on] || null;
    return {
      recuperation: {
        score: score.score ?? null,
        jours_mesures: score.coverage ?? null,
        sommeil_saisi: entry?.sleep ?? null,
        douleur_signalee: entry?.painReported ?? null,
      },
    };
  },
  cardio: (p) => {
    const activities = [...(p.activities || [])].sort((a, b) =>
      String(b.date).localeCompare(String(a.date)),
    );
    return {
      cardio: {
        activites: (p.activities || []).length,
        derniere_activite: activities[0]?.date || null,
        derniere_discipline: activities[0]?.type || null,
      },
    };
  },
  nutrition: (p) => {
    let cible = null;
    try {
      const targets = nutritionTargets(p);
      cible = targets?.calories ?? null;
    } catch (e) {
      cible = null;
    }
    return {
      nutrition: {
        cible_calories: cible,
        journaux: (p.nutrition?.logs || []).length,
        calories_manuelles: p.nutrition?.manualCalories ?? null,
      },
    };
  },
  materiel: (p) => ({
    materiel: {
      equipements: Array.isArray(p.equipment) ? p.equipment.slice() : [],
      refus: (p.preferences?.refused || []).length,
      priorites: (p.preferences?.priorities || []).slice(),
    },
  }),
  memoire: (p, on) => {
    const stats = memoryStats(p, on);
    return {
      memoire: {
        confirmees: stats.confirmed,
        en_attente: stats.pending,
        hypotheses: stats.hypotheses,
      },
    };
  },
  general: (p) => ({
    profil: {
      nom: p.user?.name || null,
      objectif: p.user?.goal || null,
      frequence: p.user?.frequency ?? null,
      seances_enregistrees: (p.sessions || []).length,
    },
  }),
};

export function buildTopicContext(p, topic, on = today()) {
  const id = CONTEXT_TOPIC_IDS.includes(topic) ? topic : CONTEXT_TOPICS.general;
  const provider = FACT_PROVIDERS[id] || FACT_PROVIDERS.general;
  return { topic: id, facts: provider(p, on) };
}

// Contexte assemblé : sujets demandés, faits déterministes, et uniquement les
// mémoires CONFIRMÉES et NON EXPIRÉES (lecture seule).
export function buildContext(
  p,
  topics = [CONTEXT_TOPICS.general],
  on = today(),
) {
  const ids = (topics?.length ? topics : [CONTEXT_TOPICS.general]).filter((t) =>
    CONTEXT_TOPIC_IDS.includes(t),
  );
  const facts = {};
  for (const topic of ids.length ? ids : [CONTEXT_TOPICS.general])
    Object.assign(facts, buildTopicContext(p, topic, on).facts);
  const recall = recallMemories(p, "", on);
  return {
    on,
    topics: ids.length ? ids : [CONTEXT_TOPICS.general],
    facts,
    memories: recall.entries.map((m) => ({
      id: m.id,
      type: m.type,
      text: m.text,
      expiresAt: m.expiresAt || null,
    })),
    memoryCount: recall.confirmed,
  };
}

// Contexte minimal pour un texte donné : c'est ce que le routeur transmet au
// coach déterministe (et ce que l'interface peut afficher, en lecture seule).
export function contextForText(p, text, on = today()) {
  return buildContext(p, topicsFor(text), on);
}
