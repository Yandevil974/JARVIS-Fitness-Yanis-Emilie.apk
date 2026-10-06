// Routeur du Fitness Brain — pur, déterministe, sans effet de bord.
//
// Il ne fait que classer un message : mémoire contrôlée (commande explicite,
// question de rappel, tentative de confirmation dans le chat), ou délégation
// au coach déterministe historique, qui reste seul habilité à agir.
import {
  confirmationIntent,
  conversationState,
  normalizeUtterance,
} from "../engine/coach.js";
import { today } from "../engine/utils.js";
import { BRAIN_RESULTS, brainResult } from "./contracts.js";
import { buildContext, contextForText } from "./context.js";
import { brainEnabled, brainDisabledAnswer } from "./policy.js";
import {
  draftMemory,
  hypothesisMemories,
  memoryStats,
  pendingMemories,
  recallMemories,
} from "./memory.js";

// ————— Commandes explicites de mémorisation —————
const COMMAND_PREFIXES = [
  /^je veux que tu (retiennes|memorises|gardes)\b/,
  /^retiens bien\b/,
  /^retiens\b/,
  /^memorise\b/,
  /^souviens toi\b/,
  /^garde (bien )?en memoire\b/,
  /^ajoute (ca |cela )?a ta memoire\b/,
];

// ————— Questions de rappel (lecture seule) —————
const RECALL_PATTERNS = [
  /^qu est ce que tu (sais|retiens|as en memoire)\b/,
  /^que sais tu (de|sur) moi\b/,
  /^qu est ce que tu (sais|retiens) (de|sur) moi\b/,
  /^(montre|affiche|ouvre|voir) (moi )?(ma|la|ta) memoire\b/,
  /^rappelle moi (ce que|ce qu|tout ce que)\b/,
  /^tu te souviens (de ce que|que je t)\b/,
  /^tu as (quoi|qu est ce que tu as) en memoire\b/,
  /^(qu est ce|ce) que tu gardes (de|sur) moi\b/,
];

// ————— État de la mémoire contrôlée (compteurs, jamais de contenu non confirmé) —————
const STATUS_PATTERNS = [
  /^(ma|ta|la) memoire( jarvis)?( controlee)?$/,
  /^memoire jarvis$/,
  /^(etat|statut) (de |de la )?(ma|la) memoire\b/,
];

// ————— Confirmation depuis le chat : refusée par conception —————
const CHAT_CONFIRMATION_PATTERNS = [
  /^(confirme|valide|enregistre) (la |ma |cette )?(memoire|proposition memoire|proposition)\b/,
  /^(confirme|valide) (le|ce) (fait|souvenir)\b/,
];

const AMBIGUOUS_MARKERS = [
  "peut etre",
  "peut etre que",
  "je crois",
  "sans doute",
  "probablement",
  "il se peut",
  "pas sur",
  "je ne sais pas",
  "je sais pas",
  "des fois",
  "parfois",
  "un peu",
  "il parait",
  "je pense",
  "j imagine",
];

const SELF_REFERENCE = [
  "ce que je t ai dit",
  "ce que je viens de dire",
  "ce que je t ai raconte",
  "ma derniere phrase",
  "ce truc",
  "cela",
  "ca",
];

const TYPE_CUES = [
  [
    "constraint",
    [
      "je ne peux pas",
      "je peux pas",
      "je n ai pas acces",
      "je n ai pas de",
      "indisponible",
      "pas dispo",
      "bless",
      "douleur",
      "interdit",
      "contrainte",
      "oblige",
      "je travaille",
      "je suis occupe",
    ],
  ],
  [
    "preference",
    [
      "je prefere",
      "je prefere pas",
      "j aime",
      "je n aime pas",
      "j aime pas",
      "je deteste",
      "j adore",
      "je me sens mieux",
      "je suis plus a l aise",
      "c est mieux",
    ],
  ],
  [
    "goal",
    [
      "je veux",
      "je souhaite",
      "mon objectif",
      "objectif",
      "mon but",
      "je vise",
      "j aimerais",
      "atteindre",
      "perdre",
      "prendre du muscle",
      "progresser",
    ],
  ],
];

export function isExplicitMemoryCommand(q) {
  return COMMAND_PREFIXES.some((rx) => rx.test(q));
}

export function isRecallQuestion(q) {
  return RECALL_PATTERNS.some((rx) => rx.test(q));
}

export function isMemoryStatusQuestion(q) {
  return STATUS_PATTERNS.some((rx) => rx.test(q));
}

export function isChatConfirmationAttempt(q) {
  if (CHAT_CONFIRMATION_PATTERNS.some((rx) => rx.test(q))) return true;
  return ["yes", "no"].includes(confirmationIntent(q));
}

// Extrait la clause à mémoriser en retirant la commande et ses connecteurs.
export function memoryClause(q) {
  let clause = String(q || "");
  for (const rx of COMMAND_PREFIXES)
    if (rx.test(clause)) {
      clause = clause.replace(rx, " ");
      break;
    }
  return clause
    .replace(/^[\s,:;.!-]*(que|bien que|car)\s+/, " ")
    .replace(/[\s,:;.!-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Une demande ambiguë ne devient JAMAIS un fait : elle reste une hypothèse.
export function isAmbiguousClause(clause) {
  const text = String(clause || "").trim();
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 3) return true;
  if (text.length < 12) return true;
  if (AMBIGUOUS_MARKERS.some((m) => text.includes(m))) return true;
  if (SELF_REFERENCE.some((m) => text.includes(m))) return true;
  if (/[?]/.test(text)) return true;
  return false;
}

export function memoryTypeFor(q, clause = "") {
  const text = `${q} ${clause}`;
  for (const [type, cues] of TYPE_CUES)
    if (cues.some((cue) => text.includes(cue))) return type;
  return "context";
}

// ————— Entrée du routeur —————
// Ne modifie jamais le profil : renvoie la décision et, au plus, un brouillon
// de mémoire (matérialisé plus tard par `applyBrainTurn`).
export function routeMessage(p, text, { on = today() } = {}) {
  const raw = String(text ?? "");
  const q = normalizeUtterance(raw);
  const context = contextForText(p, raw, on);

  if (!q)
    return brainResult(BRAIN_RESULTS.MEMORY_REFUSAL, {
      topics: context.topics,
      context,
      text: "Je n’ai rien à mémoriser : écrivez la phrase que vous voulez me voir retenir.",
    });

  // Brain désactivé : le coach déterministe reprend la main, sans exception.
  // Une commande de mémoire reste sans effet, mais la réponse est honnête.
  if (!brainEnabled(p))
    return brainResult(BRAIN_RESULTS.DELEGATED, {
      reason: "brain_disabled",
      memoryRelated:
        isExplicitMemoryCommand(q) ||
        isRecallQuestion(q) ||
        isChatConfirmationAttempt(q),
      topics: context.topics,
      context,
      disabledAnswer: brainDisabledAnswer(),
    });

  const convo = conversationState(p);
  const pending = pendingMemories(p, on);
  const hypotheses = hypothesisMemories(p, on);

  // 1. Commande explicite de mémorisation (jamais déduite du texte).
  if (isExplicitMemoryCommand(q)) {
    const clause = memoryClause(q);
    const type = memoryTypeFor(q, clause);
    const ambiguous = isAmbiguousClause(clause);
    const draft = draftMemory(clause, {
      type,
      state: ambiguous ? "hypothesis" : "pending",
      topics: context.topics,
    });
    if (!draft)
      return brainResult(BRAIN_RESULTS.MEMORY_REFUSAL, {
        topics: context.topics,
        context,
        text: "Je n’ai pas de contenu clair à mémoriser. Reprenez la phrase après « Retiens que… ».",
      });
    return brainResult(
      ambiguous
        ? BRAIN_RESULTS.MEMORY_HYPOTHESIS
        : BRAIN_RESULTS.MEMORY_PROPOSAL,
      {
        draft,
        topics: context.topics,
        context,
      },
    );
  }

  // 2. État de la mémoire contrôlée : des compteurs, jamais un fait non confirmé.
  if (isMemoryStatusQuestion(q))
    return brainResult(BRAIN_RESULTS.MEMORY_STATUS, {
      stats: memoryStats(p, on),
      topics: context.topics,
      context: buildContext(p, context.topics, on),
    });

  // 3. Question de rappel : strictement en lecture seule.
  if (isRecallQuestion(q)) {
    const recall = recallMemories(p, q, on);
    return brainResult(BRAIN_RESULTS.MEMORY_RECALL, {
      entries: recall.entries.map((m) => ({
        id: m.id,
        type: m.type,
        text: m.text,
        expiresAt: m.expiresAt || null,
      })),
      confirmed: recall.confirmed,
      topics: context.topics,
      context: buildContext(p, context.topics, on),
    });
  }

  // 4. Tentative de confirmation/refus depuis le chat : refus explicite.
  //    Une proposition sportive en attente garde son cycle historique.
  if (
    isChatConfirmationAttempt(q) &&
    !convo.pending &&
    (pending.length || hypotheses.length)
  )
    return brainResult(BRAIN_RESULTS.MEMORY_GUARD, {
      attempt: confirmationIntent(q) === "yes" ? "yes" : "no",
      targets: [...pending, ...hypotheses].map((m) => ({
        id: m.id,
        text: m.text,
        state: m.state,
      })),
      stats: memoryStats(p, on),
      topics: context.topics,
      context,
    });

  // 5. Tout le reste revient au coach déterministe.
  return brainResult(BRAIN_RESULTS.DELEGATED, {
    topics: context.topics,
    context,
  });
}
