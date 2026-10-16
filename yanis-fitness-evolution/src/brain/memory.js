// Mémoires typées du Fitness Brain — propositions, hypothèses, confirmation
// manuelle, expiration et rappel en lecture seule.
//
// Invariants (vérifiés par tests/brain.test.js) :
//   • une mémoire naît avec `confirmedAt: null` et rien d'autre ;
//   • une proposition en attente ne peut pas être lue par le rappel ;
//   • une hypothèse n'est pas un fait et reste hors du contexte ;
//   • une mémoire expirée est exclue du rappel et du contexte ;
//   • la confirmation n'existe que dans l'interface (jamais via le chat) ;
//   • ces fonctions ne touchent jamais au programme, aux séances ni aux
//     performances : elles ne modifient que `p.brain`.
import { addDays, norm, today, uid } from "../engine/utils.js";
import {
  BRAIN_MEMORY_LIMIT,
  BRAIN_RECALL_LIMIT,
  BRAIN_TEXT_MAX,
  defaultBrainState,
} from "./policy.js";

export const MEMORY_TYPES = Object.freeze({
  preference: "préférence",
  constraint: "contrainte",
  goal: "objectif",
  context: "contexte",
});
export const MEMORY_TYPE_IDS = Object.freeze(Object.keys(MEMORY_TYPES));

export const MEMORY_STATES = Object.freeze({
  pending: "en attente de confirmation",
  hypothesis: "hypothèse à confirmer",
  confirmed: "confirmée",
  rejected: "refusée",
  expired: "expirée",
});
export const MEMORY_STATE_IDS = Object.freeze(Object.keys(MEMORY_STATES));

// Origine unique : une commande explicite de mémorisation (`origin:
// "explicit"`). Aucun autre chemin ne crée de mémoire : pas d'apprentissage
// automatique.

// La validité par défaut reste permanente, sauf pour un contexte daté (voyage,
// indisponibilité, blessure passagère) qui se périme seul au bout de 90 jours.
export const DEFAULT_EXPIRY_DAYS = Object.freeze({ context: 90 });
export const VALIDITY_CHOICES = Object.freeze([
  { days: null, label: "Permanente" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
  { days: 365, label: "1 an" },
]);

function bucket(p, create = false) {
  if (!p || typeof p !== "object") return [];
  let raw = p.brain;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    if (!create) return [];
    raw = defaultBrainState();
    p.brain = raw;
  }
  if (!Array.isArray(raw.memories)) {
    if (!create) return [];
    raw.memories = [];
  }
  return raw.memories;
}

export function memoryTypeLabel(type) {
  return MEMORY_TYPES[type] || MEMORY_TYPES.context;
}

export function memoryStateLabel(state) {
  return MEMORY_STATES[state] || state || "";
}

export function isExpired(memory, on = today()) {
  return !!memory && !!memory.expiresAt && memory.expiresAt < on;
}

// État « réel » d'une mémoire : une confirmation périmée redevient expirée,
// sans réécrire la donnée d'origine (l'historique de confirmation est gardé).
export function effectiveState(memory, on = today()) {
  if (!memory) return null;
  if (isExpired(memory, on) && memory.state !== "rejected") return "expired";
  return memory.state;
}

function blank(text) {
  return !text || !String(text).trim();
}

// Fabrique un brouillon de mémoire (aucune écriture d'état ici). Le brouillon
// est volontairement sérialisable : il peut être affiché, testé, puis
// matérialisé par `materializeMemory`.
export function draftMemory(
  text,
  { type = "context", topics = [], state = "pending", expiresInDays } = {},
) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, BRAIN_TEXT_MAX);
  if (blank(clean)) return null;
  if (!MEMORY_STATE_IDS.includes(state)) state = "pending";
  const createdOn = today();
  const days =
    expiresInDays === undefined
      ? (DEFAULT_EXPIRY_DAYS[type] ?? null)
      : expiresInDays;
  return {
    id: uid(),
    type: MEMORY_TYPE_IDS.includes(type) ? type : "context",
    text: clean,
    topics: Array.isArray(topics) ? topics.slice(0, 6) : [],
    state,
    origin: "explicit",
    createdAt: createdOn,
    createdAtMs: Date.now(),
    confirmedAt: null, // exigence : une proposition naît non confirmée
    confirmedBy: null,
    rejectedAt: null,
    expiresAt: days ? addDays(createdOn, days) : null,
  };
}

// Écrit le brouillon dans `p.brain.memories` (à appeler sur un clone du profil,
// comme les autres mutations de l'application).
export function materializeMemory(p, draft) {
  if (!draft || blank(draft.text)) return null;
  const list = bucket(p, true);
  const memory = {
    ...draft,
    topics: Array.isArray(draft.topics) ? draft.topics.slice(0, 6) : [],
  };
  list.push(memory);
  trimMemories(p);
  p.brain.updatedAt = Date.now();
  return memory;
}

// Borne la mémoire : on retire d'abord les refusées, puis les expirées, et en
// dernier recours les plus anciennes — jamais une confirmation récente si une
// autre entrée peut partir.
export function trimMemories(p) {
  const list = bucket(p, true);
  if (list.length <= BRAIN_MEMORY_LIMIT) return list.length;
  const rank = (m) =>
    m.state === "rejected"
      ? 0
      : isExpired(m)
        ? 1
        : m.state === "confirmed"
          ? 3
          : 2;
  const sorted = [...list].sort(
    (a, b) => rank(a) - rank(b) || (a.createdAtMs || 0) - (b.createdAtMs || 0),
  );
  const remove = new Set(
    sorted.slice(0, list.length - BRAIN_MEMORY_LIMIT).map((m) => m.id),
  );
  p.brain.memories = list.filter((m) => !remove.has(m.id));
  return p.brain.memories.length;
}

export function findMemory(p, id) {
  return bucket(p).find((m) => m.id === id) || null;
}

// ————— Confirmation manuelle, uniquement depuis l'interface —————
// `via` est un garde-fou de domaine : le chat ne peut pas confirmer une
// mémoire, même avec un « oui », et l'appeler avec via: "chat" lève une erreur.
export const CONFIRMATION_CHANNELS = Object.freeze({
  interface: "interface",
  chat: "chat",
});

export function confirmMemory(
  p,
  id,
  { on = today(), via = "interface", at = Date.now() } = {},
) {
  if (via !== CONFIRMATION_CHANNELS.interface)
    throw new Error(
      "Une mémoire ne se confirme que dans l’interface de mémoire contrôlée, jamais depuis le chat.",
    );
  const memory = findMemory(p, id);
  if (!memory) throw new Error("Proposition mémoire introuvable.");
  if (memory.state === "rejected")
    throw new Error(
      "Cette proposition a été refusée : elle ne peut pas être confirmée.",
    );
  if (memory.state === "confirmed") return memory;
  if (isExpired(memory, on)) {
    memory.state = "expired";
    p.brain.updatedAt = Date.now();
    throw new Error(
      "Cette proposition a expiré : elle n’est plus confirmable.",
    );
  }
  memory.state = "confirmed";
  memory.confirmedAt = at;
  memory.confirmedBy = "interface";
  p.brain.updatedAt = Date.now();
  return memory;
}

export function rejectMemory(
  p,
  id,
  { via = "interface", at = Date.now() } = {},
) {
  if (via !== CONFIRMATION_CHANNELS.interface)
    throw new Error(
      "Un refus de mémoire passe par l’interface de mémoire contrôlée.",
    );
  const memory = findMemory(p, id);
  if (!memory) throw new Error("Proposition mémoire introuvable.");
  if (memory.state === "confirmed")
    throw new Error("Une mémoire confirmée se supprime avec « Oublier ».");
  memory.state = "rejected";
  memory.rejectedAt = at;
  p.brain.updatedAt = Date.now();
  return memory;
}

// Suppression définitive d'une mémoire (confirmée ou non).
export function forgetMemory(p, id) {
  const list = bucket(p, true);
  const index = list.findIndex((m) => m.id === id);
  if (index < 0) throw new Error("Mémoire introuvable.");
  const [removed] = list.splice(index, 1);
  p.brain.updatedAt = Date.now();
  return removed;
}

export function setMemoryValidity(p, id, days) {
  const memory = findMemory(p, id);
  if (!memory) throw new Error("Mémoire introuvable.");
  memory.expiresAt = days ? addDays(today(), days) : null;
  if (memory.state === "expired" && !isExpired(memory))
    memory.state = memory.confirmedAt ? "confirmed" : "pending";
  p.brain.updatedAt = Date.now();
  return memory;
}

// Marque les entrées périmées (en attente ou confirmées) comme expirées.
export function expireMemories(p, on = today()) {
  let count = 0;
  for (const memory of bucket(p)) {
    if (memory.state === "rejected" || memory.state === "expired") continue;
    if (isExpired(memory, on)) {
      memory.state = "expired";
      count += 1;
    }
  }
  if (count) p.brain.updatedAt = Date.now();
  return count;
}

// ————— Lectures —————
const byNewest = (a, b) =>
  (b.confirmedAtMs || b.createdAtMs || 0) -
  (a.confirmedAtMs || a.createdAtMs || 0);

export function pendingMemories(p, on = today()) {
  return bucket(p)
    .filter((m) => m.state === "pending" && !isExpired(m, on))
    .sort(byNewest);
}

export function hypothesisMemories(p, on = today()) {
  return bucket(p)
    .filter((m) => m.state === "hypothesis" && !isExpired(m, on))
    .sort(byNewest);
}

export function confirmedMemories(p, on = today()) {
  return bucket(p)
    .filter((m) => m.state === "confirmed" && !isExpired(m, on))
    .sort(byNewest);
}

export function expiredMemories(p, on = today()) {
  return bucket(p)
    .filter((m) => effectiveState(m, on) === "expired")
    .sort(byNewest);
}

export function memoryStats(p, on = today()) {
  const list = bucket(p);
  const stats = {
    total: list.length,
    confirmed: 0,
    pending: 0,
    hypotheses: 0,
    rejected: 0,
    expired: 0,
  };
  for (const memory of list) {
    const state = effectiveState(memory, on);
    if (state === "confirmed") stats.confirmed += 1;
    else if (state === "pending") stats.pending += 1;
    else if (state === "hypothesis") stats.hypotheses += 1;
    else if (state === "rejected") stats.rejected += 1;
    else stats.expired += 1;
  }
  return stats;
}

function words(text) {
  return norm(String(text || ""))
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
}

// Rappel en LECTURE SEULE : ne lit que les mémoires confirmées et non expirées.
// Les propositions en attente, les hypothèses et les expirées n'y entrent
// jamais, même si elles contiennent les mots cherchés.
export function recallMemories(p, query = "", on = today()) {
  const entries = confirmedMemories(p, on),
    needles = words(query);
  const matched = needles.length
    ? entries.filter((m) => {
        const haystack = [
          ...words(m.text),
          ...words(m.topics.join(" ")),
          norm(m.type),
        ];
        return needles.some((w) =>
          haystack.some((h) => h.includes(w) || w.includes(h)),
        );
      })
    : entries;
  return {
    entries: matched.slice(0, BRAIN_RECALL_LIMIT),
    confirmed: entries.length,
    query: String(query || ""),
  };
}

export function memoryLines(entries) {
  return entries.map(
    (m) =>
      `• ${m.text} (${memoryTypeLabel(m.type)}${m.expiresAt ? `, jusqu’au ${m.expiresAt}` : ""})`,
  );
}

// Formes normalisées utilisées par la validation d'import (schema.js).
export function normalizeMemory(memory) {
  const draft = {
    id: typeof memory?.id === "string" ? memory.id : uid(),
    type: MEMORY_TYPE_IDS.includes(memory?.type) ? memory.type : "context",
    text: String(memory?.text || "").slice(0, BRAIN_TEXT_MAX),
    topics: Array.isArray(memory?.topics) ? memory.topics.slice(0, 6) : [],
    state: MEMORY_STATE_IDS.includes(memory?.state) ? memory.state : "pending",
    origin: "explicit",
    createdAt: memory?.createdAt || today(),
    createdAtMs: Number.isFinite(memory?.createdAtMs)
      ? memory.createdAtMs
      : Date.now(),
    confirmedAt: memory?.confirmedAt ?? null,
    confirmedBy: memory?.confirmedBy ?? null,
    rejectedAt: memory?.rejectedAt ?? null,
    expiresAt: memory?.expiresAt ?? null,
  };
  return draft;
}

export function brainMemoryCount(p) {
  return brainState(p).memories.length;
}
