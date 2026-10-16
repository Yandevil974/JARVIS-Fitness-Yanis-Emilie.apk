// Conversation du Fitness Brain : met en mots les décisions du routeur, puis
// matérialise la proposition mémoire. Le Brain ne produit ici que du texte et,
// au plus, une entrée `p.brain.memories` — jamais d'action sportive.
import { interpretCommand, normalizeUtterance } from "../engine/coach.js";
import { today } from "../engine/utils.js";
import { BRAIN_RESULTS, assertBrainSafe } from "./contracts.js";
import {
  memoryLines,
  materializeMemory,
  memoryStateLabel,
  memoryTypeLabel,
} from "./memory.js";
import {
  isChatConfirmationAttempt,
  isExplicitMemoryCommand,
  isRecallQuestion,
  routeMessage,
} from "./router.js";

const MEMORY_SPACE = "Profil → Mémoire JARVIS";

function proposalText(draft) {
  return (
    `Je garde votre demande comme une proposition de mémoire — pas encore un fait.\n\n` +
    `• « ${draft.text} » · ${memoryTypeLabel(draft.type)}\n\n` +
    `Pour la confirmer : ${MEMORY_SPACE} → « Confirmer ». Tant qu’elle n’est pas confirmée, ` +
    `elle reste hors de mes rappels et de mon contexte, et aucun programme, aucune séance ni aucune performance ne sont modifiés.\n` +
    `Un « oui » dans le chat ne suffit volontairement pas : la confirmation est manuelle.`
  );
}

function hypothesisText(draft) {
  return (
    `Votre phrase reste une hypothèse, pas un fait : je la note comme telle, sans l’utiliser.\n\n` +
    `• « ${draft.text} »\n\n` +
    `Une hypothèse est exclue de mon contexte et de mes rappels. Elle ne deviendra un fait ` +
    `qu’après votre confirmation manuelle dans ${MEMORY_SPACE}. Aucun « oui » ici ne la confirme, ` +
    `et rien n’est appliqué au programme.`
  );
}

function guardText(result) {
  const target = result.targets?.[0];
  const label = target ? `« ${target.text} »` : "la proposition en attente";
  if (result.attempt === "yes")
    return (
      `Je ne confirme pas une mémoire depuis le chat — c’est volontaire et c’est la règle.\n\n` +
      `En attente : ${label}\n\n` +
      `Ouvrez ${MEMORY_SPACE}, puis « Confirmer » (ou « Refuser »). Tant que ce n’est pas fait, ` +
      `la phrase reste inutilisable : ni rappel, ni contexte, aucune action sportive.`
    );
  return (
    `Très bien : je n’enregistre rien de plus.\n\n` +
    `${label} reste ${memoryStateLabel(target?.state === "hypothesis" ? "hypothesis" : "pending")} ` +
    `dans ${MEMORY_SPACE} ; vous pouvez la confirmer ou la refuser là-bas, à tout moment.`
  );
}

function recallText(result) {
  if (result.entries.length)
    return (
      `Rappel en lecture seule — uniquement vos mémoires confirmées et non expirées :\n` +
      memoryLines(result.entries).join("\n") +
      `\n\nRien n’a été modifié : ni programme, ni séance, ni performance.`
    );
  return (
    (result.confirmed
      ? `Aucune mémoire confirmée ne correspond à cette demande. `
      : `Aucune mémoire confirmée pour l’instant. `) +
    `Les propositions en attente, les hypothèses et les mémoires expirées ne sont jamais rappelées : ` +
    `confirmez-les dans ${MEMORY_SPACE}.\n\nRien n’a été modifié par ce rappel.`
  );
}

function statusText(result) {
  const s = result.stats;
  return (
    `Mémoire contrôlée JARVIS (locale) : ${s.confirmed} confirmée(s), ${s.pending} en attente de confirmation, ` +
    `${s.hypotheses} hypothèse(s), ${s.expired} expirée(s), ${s.rejected} refusée(s).\n\n` +
    `Seules les mémoires confirmées et non expirées sont rappelées. ` +
    `Pour confirmer ou refuser : ${MEMORY_SPACE}. Aucune donnée ne quitte votre appareil.`
  );
}

// Un tour de Brain : purement décisionnel, sans écriture d'état.
export function brainTurn(p, text, { on = today() } = {}) {
  const route = routeMessage(p, text, { on });
  const base = {
    handled: route.kind !== BRAIN_RESULTS.DELEGATED,
    source: route.kind === BRAIN_RESULTS.DELEGATED ? "coach" : "brain",
    kind: route.kind,
    topics: route.topics || [],
    context: route.context || null,
  };

  if (route.kind === BRAIN_RESULTS.DELEGATED) {
    const q = normalizeUtterance(text);
    const memoryRelated =
      route.memoryRelated === undefined
        ? isExplicitMemoryCommand(q) ||
          isRecallQuestion(q) ||
          isChatConfirmationAttempt(q)
        : !!route.memoryRelated;
    return {
      ...base,
      handled: false,
      memoryRelated: !!memoryRelated,
      disabledAnswer: route.disabledAnswer || null,
    };
  }

  const turn = { ...base, handled: true };
  if (route.kind === BRAIN_RESULTS.MEMORY_PROPOSAL) {
    turn.text = proposalText(route.draft);
    turn.memoryDraft = route.draft;
    turn.memoryId = route.draft.id;
    turn.memoryState = "pending";
    turn.navigate = "profile";
    turn.tab = "brain";
  } else if (route.kind === BRAIN_RESULTS.MEMORY_HYPOTHESIS) {
    turn.text = hypothesisText(route.draft);
    turn.memoryDraft = route.draft;
    turn.memoryId = route.draft.id;
    turn.memoryState = "hypothesis";
    turn.navigate = "profile";
    turn.tab = "brain";
  } else if (route.kind === BRAIN_RESULTS.MEMORY_GUARD) {
    turn.text = guardText(route);
    turn.memoryState = route.attempt === "yes" ? "pending" : null;
    turn.navigate = "profile";
    turn.tab = "brain";
  } else if (route.kind === BRAIN_RESULTS.MEMORY_RECALL) {
    turn.text = recallText(route);
    turn.recall = route.entries;
  } else if (route.kind === BRAIN_RESULTS.MEMORY_STATUS) {
    turn.text = statusText(route);
  } else if (route.kind === BRAIN_RESULTS.MEMORY_REFUSAL) {
    turn.text =
      route.text || "Je ne peux pas mémoriser cette phrase telle quelle.";
  }
  assertBrainSafe(turn);
  return turn;
}

// Réponse complète consommée par `AppContext.sendCoach` : soit le Brain a
// répondu, soit le coach déterministe répond exactement comme avant.
export function brainAnswer(p, text, { on = today() } = {}) {
  const turn = brainTurn(p, text, { on });
  if (!turn.handled) {
    if (turn.disabledAnswer && turn.memoryRelated)
      return {
        ...turn.disabledAnswer,
        brain: { source: "brain-disabled", topics: turn.topics },
      };
    const answer = interpretCommand(p, text);
    return {
      ...answer,
      brain: {
        source: "coach",
        topics: turn.topics,
        delegated: true,
      },
    };
  }
  return {
    text: turn.text,
    navigate: turn.navigate,
    tab: turn.tab,
    // Volontairement : aucun `action`, aucun `automatic`, aucun `choices`.
    brain: {
      source: "brain",
      kind: turn.kind,
      memoryId: turn.memoryId || null,
      memoryState: turn.memoryState || null,
      topics: turn.topics,
    },
    turn,
  };
}

// Écrit la proposition dans `p.brain.memories` (à appeler sur un clone).
export function applyBrainTurn(p, turn) {
  if (!turn?.handled || !turn.memoryDraft) return null;
  return materializeMemory(p, turn.memoryDraft);
}

// Rappel textuel direct, pour l'interface (lecture seule, jamais d'écriture).
export function recallPreview(p, query = "", on = today()) {
  const turn = brainTurn(
    p,
    query
      ? `Rappelle-moi ce que tu sais sur ${query}`
      : "Qu’est-ce que tu sais sur moi ?",
    { on },
  );
  return turn.handled && turn.recall ? turn.recall : [];
}
