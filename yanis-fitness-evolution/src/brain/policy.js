// Politique locale du Fitness Brain.
//
// Le Brain est un module STRICTEMENT local et additif : il n'ajoute que la
// mémoire contrôlée (propositions → confirmation manuelle) et le rappel en
// lecture seule. Il ne remplace jamais le coach déterministe de
// `src/engine/coach.js`, qui reste le seul auteur des actions sportives —
// programme, séances, charges, performances, arrêt douleur.
//
// Aucun fournisseur, SDK, appel distant, serveur ni clé ne participe à ce
// module : tout est calculé et stocké sur l'appareil, avec l'état local déjà
// sauvegardé par l'application.
export const BRAIN_VERSION = 1;

// Bornes de sûreté : la mémoire contrôlée reste petite, lisible et révisable.
export const BRAIN_MEMORY_LIMIT = 120;
export const BRAIN_TEXT_MAX = 240;
export const BRAIN_RECALL_LIMIT = 12;

// Le Brain est actif par défaut : c'est un module local gratuit, sans données
// sortantes. Le désactiver ne retire rien au coach déterministe ; il coupe
// seulement les propositions de mémoire, le rappel et le contexte Brain.
export function defaultBrainState() {
  return { version: BRAIN_VERSION, enabled: true, memories: [] };
}

export function brainState(p) {
  const raw = p && typeof p === "object" ? p.brain : null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return defaultBrainState();
  return {
    version: BRAIN_VERSION,
    enabled: raw.enabled !== false,
    memories: Array.isArray(raw.memories) ? raw.memories : [],
  };
}

export function brainEnabled(p) {
  return brainState(p).enabled;
}

export function setBrainEnabled(p, enabled) {
  const next = { ...brainState(p), enabled: !!enabled };
  p.brain = next;
  return next;
}

// Texte honnête quand une commande de mémorisation arrive alors que le module
// est coupé : on n'invente rien, on n'enregistre rien et on explique.
export function brainDisabledAnswer() {
  return {
    text:
      "Le Fitness Brain local est désactivé dans Profil → Mémoire JARVIS : je n’enregistre donc aucune mémoire et je ne peux rien rappeler.\n\n" +
      "Le coach déterministe reste entièrement disponible (programme, séances, charges, récupération). Pour activer la mémoire contrôlée, ouvrez Profil → Mémoire JARVIS.",
    navigate: "profile",
    tab: "brain",
    brain: { source: "brain-disabled", kind: "brain_disabled" },
  };
}
