// Contrats d'action fermés du Fitness Brain.
//
// Le Brain ne peut rendre que les formes énumérées ici. Tout le reste est
// refusé à la construction : une réponse du Brain qui porterait une action
// sportive connue de `applyCoachAction` lève une erreur, ce qui rend la règle
// « une proposition mémoire ne déclenche jamais d'action sportive » vérifiable
// par les tests plutôt que dépendante de la discipline de l’appelant.

// Résultats possibles d'un tour de Brain.
export const BRAIN_RESULTS = Object.freeze({
  DELEGATED: "delegated", // la main revient au coach déterministe
  MEMORY_PROPOSAL: "memory_proposal", // proposition explicite en attente
  MEMORY_HYPOTHESIS: "memory_hypothesis", // demande ambiguë : hypothèse
  MEMORY_RECALL: "memory_recall", // rappel en lecture seule
  MEMORY_STATUS: "memory_status", // état de la mémoire contrôlée
  MEMORY_GUARD: "memory_confirmation_guard", // refus de confirmer depuis le chat
  MEMORY_REFUSAL: "memory_request_refused", // demande de mémorisation inexploitable
});

export const BRAIN_RESULT_KINDS = Object.freeze(Object.values(BRAIN_RESULTS));

// Types d'action réservés au coach déterministe (switch d'`applyCoachAction`).
// Le Brain ne doit jamais en produire ni en porter : il propose, l'utilisateur
// confirme, et seul le coach agit.
export const COACH_ACTION_TYPES = Object.freeze([
  "plan",
  "replan",
  "shorten",
  "fatigue",
  "move",
  "missed",
  "coach-state",
  "replace",
  "focus",
  "log",
  "pain",
]);

export function isCoachAction(action) {
  return !!action && COACH_ACTION_TYPES.includes(action.type);
}

// Construit un résultat de Brain en refusant tout ce qui sort du contrat fermé.
export function brainResult(kind, payload = {}) {
  if (!BRAIN_RESULT_KINDS.includes(kind))
    throw new Error(`Contrat Brain inconnu : ${String(kind)}.`);
  if (isCoachAction(payload.action))
    throw new Error(
      "Une réponse du Brain ne peut pas porter une action sportive : elle doit rester une proposition.",
    );
  if (payload.automatic)
    throw new Error(
      "Le Brain n’applique rien automatiquement : toute action sportive passe par le coach et sa confirmation.",
    );
  return { kind, ...payload };
}

// Garde-fou réutilisable (routeur, conversation, interface, tests).
export function assertBrainSafe(result) {
  if (!result || typeof result !== "object")
    throw new Error("Résultat de Brain absent.");
  if (result.handled && !BRAIN_RESULT_KINDS.includes(result.kind))
    throw new Error(`Résultat de Brain hors contrat : ${String(result.kind)}.`);
  if (isCoachAction(result.action) || isCoachAction(result.action?.action))
    throw new Error("Action sportive interdite dans une réponse du Brain.");
  return true;
}

// Rappel explicite des interdits, utilisé par la documentation et l'interface.
export const BRAIN_RULES = Object.freeze([
  "Aucun apprentissage automatique : seule une commande explicite de mémorisation crée une proposition.",
  "Une demande ambiguë reste une hypothèse ; elle ne devient un fait qu'après confirmation manuelle.",
  "Les propositions en attente, les hypothèses et les mémoires expirées restent exclues du rappel et du contexte.",
  "Une proposition mémoire ne déclenche jamais d'action sportive et ne modifie ni programme ni performance.",
  "Un « oui » dans le chat ne confirme jamais une mémoire : la confirmation se fait dans l'interface.",
  "Aucun fournisseur, SDK, appel distant ni envoi de données Fitness.",
]);
