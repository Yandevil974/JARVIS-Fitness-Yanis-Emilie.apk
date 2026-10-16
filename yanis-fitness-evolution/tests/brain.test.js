// Fitness Brain — mémoire contrôlée locale (phases 1 à 3 validées).
//
// Ces tests verrouillent les règles produit, pas seulement le code :
//   • pas d'apprentissage automatique : seule une commande explicite propose ;
//   • une proposition naît avec `confirmedAt: null` et reste inutilisable ;
//   • un « oui » dans le chat ne confirme jamais une mémoire ;
//   • une demande ambiguë reste une hypothèse ;
//   • une mémoire expirée sort du rappel et du contexte ;
//   • un rappel est en lecture seule (aucune modification d'état sportif) ;
//   • une proposition mémoire ne déclenche jamais d'action sportive ;
//   • Brain désactivé ⇒ le coach déterministe reste utilisable ;
//   • une sauvegarde sans `brain` reste compatible.
import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, newProfile, validateState } from "../src/store/model.js";
import { applyCoachAction, interpretCommand } from "../src/engine/coach.js";
import { restoreProfile } from "../src/store/restoration.js";
import {
  BRAIN_RESULTS,
  COACH_ACTION_TYPES,
  assertBrainSafe,
  brainResult,
} from "../src/brain/contracts.js";
import {
  BRAIN_MEMORY_LIMIT,
  BRAIN_TEXT_MAX,
  brainEnabled,
  defaultBrainState,
  setBrainEnabled,
} from "../src/brain/policy.js";
import {
  confirmedMemories,
  confirmMemory,
  draftMemory,
  expireMemories,
  findMemory,
  forgetMemory,
  hypothesisMemories,
  materializeMemory,
  memoryStats,
  pendingMemories,
  recallMemories,
  rejectMemory,
  setMemoryValidity,
} from "../src/brain/memory.js";
import {
  buildContext,
  buildTopicContext,
  contextForText,
} from "../src/brain/context.js";
import { routeMessage } from "../src/brain/router.js";
import { applyBrainTurn, brainAnswer } from "../src/brain/conversation.js";
import { addDays, today } from "../src/engine/utils.js";

// Reproduit exactement ce que fait `AppContext.sendCoach` : réponse du Brain,
// puis matérialisation de l'éventuelle proposition.
function say(p, text, on = today()) {
  const answer = brainAnswer(p, text, { on });
  if (answer.turn) applyBrainTurn(p, answer.turn);
  return answer;
}

// Le Brain ne doit jamais toucher à autre chose que `p.brain`.
function withoutBrain(profile) {
  const copy = structuredClone(profile);
  delete copy.brain;
  return copy;
}

test("commande explicite : proposition en attente, confirmedAt null, rien d’appliqué", () => {
  const p = newProfile("elite");
  const before = withoutBrain(p);
  const answer = say(p, "Retiens que je préfère m’entraîner le matin");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_PROPOSAL);
  assert.equal(p.brain.memories.length, 1);
  const memory = p.brain.memories[0];
  assert.equal(memory.state, "pending");
  assert.equal(memory.confirmedAt, null);
  assert.equal(memory.confirmedBy, null);
  assert.equal(memory.origin, "explicit");
  assert.equal(memory.type, "preference");
  assert.match(memory.text, /prefere m entrainer le matin/);
  // La proposition est inutilisable avant confirmation.
  assert.equal(confirmedMemories(p).length, 0);
  assert.equal(recallMemories(p, "matin").entries.length, 0);
  assert.equal(buildContext(p, ["memoire"]).memories.length, 0);
  // Elle n'a modifié ni programme, ni séance, ni message.
  assert.deepEqual(withoutBrain(p), before);
  // Et elle explique comment la confirmer.
  assert.match(answer.text, /Profil → Mémoire JARVIS/);
  assert.match(answer.text, /Confirmer/);
});

test("aucun apprentissage automatique : une phrase ordinaire ne crée aucune mémoire", () => {
  const p = newProfile("elite");
  const answer = say(p, "Je préfère m’entraîner le matin");
  assert.equal(p.brain.memories.length, 0);
  assert.equal(answer.brain.source, "coach");
});

test("un « oui » dans le chat ne confirme pas une mémoire", () => {
  const p = newProfile("elite");
  say(p, "Retiens que je préfère le soir");
  const before = withoutBrain(p);
  const answer = say(p, "oui");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_GUARD);
  assert.equal(p.brain.memories[0].state, "pending");
  assert.equal(p.brain.memories[0].confirmedAt, null);
  assert.deepEqual(withoutBrain(p), before);
  assert.match(answer.text, /ne confirme pas une mémoire depuis le chat/i);
  // Garde-fou de domaine : la confirmation depuis le chat est impossible.
  assert.throws(
    () => confirmMemory(p, p.brain.memories[0].id, { via: "chat" }),
    /interface de mémoire contrôlée/,
  );
  assert.deepEqual(withoutBrain(p), before);
});

test("confirmation manuelle dans l’interface : la mémoire devient rappelable", () => {
  const p = newProfile("elite");
  say(p, "Retiens que je préfère la barre libre");
  const id = p.brain.memories[0].id;
  const memory = confirmMemory(p, id, { via: "interface" });
  assert.equal(memory.state, "confirmed");
  assert.ok(memory.confirmedAt > 0);
  assert.equal(memory.confirmedBy, "interface");
  assert.equal(confirmedMemories(p).length, 1);
  assert.equal(recallMemories(p, "barre").entries.length, 1);
  const context = buildContext(p, ["memoire"]);
  assert.equal(context.memories.length, 1);
  const answer = say(p, "Qu’est-ce que tu sais sur moi ?");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_RECALL);
  assert.match(answer.text, /barre libre/);
  assert.match(answer.text, /Rien n’a été modifié/);
});

test("demande ambiguë : hypothèse, jamais un fait avant confirmation manuelle", () => {
  const p = newProfile("elite");
  const answer = say(p, "Retiens peut-être que je préfère le mardi");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_HYPOTHESIS);
  const memory = p.brain.memories[0];
  assert.equal(memory.state, "hypothesis");
  assert.equal(memory.confirmedAt, null);
  assert.equal(pendingMemories(p).length, 0);
  assert.equal(hypothesisMemories(p).length, 1);
  // Hors rappel et hors contexte tant qu'elle n'est pas confirmée à la main.
  assert.equal(recallMemories(p).entries.length, 0);
  assert.equal(buildContext(p, ["seance"]).memories.length, 0);
  // Un « oui » ne suffit pas non plus pour une hypothèse.
  const guard = say(p, "oui");
  assert.equal(guard.brain.kind, BRAIN_RESULTS.MEMORY_GUARD);
  assert.equal(findMemory(p, memory.id).state, "hypothesis");
  // Confirmation manuelle explicite : elle devient alors un fait.
  confirmMemory(p, memory.id, { via: "interface" });
  assert.equal(recallMemories(p).entries.length, 1);
});

test("une clause trop courte reste une hypothèse", () => {
  const p = newProfile("elite");
  const answer = say(p, "Retiens ça");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_HYPOTHESIS);
  assert.equal(p.brain.memories[0].state, "hypothesis");
  assert.equal(p.brain.memories[0].confirmedAt, null);
});

test("expiration : une mémoire expirée sort du rappel et du contexte", () => {
  const p = newProfile("elite");
  const draft = draftMemory("je suis en déplacement jusqu’au 20", {
    type: "context",
    expiresInDays: 30,
  });
  materializeMemory(p, draft);
  confirmMemory(p, draft.id, { via: "interface" });
  assert.equal(recallMemories(p).entries.length, 1);
  findMemory(p, draft.id).expiresAt = addDays(today(), -1);
  assert.equal(confirmedMemories(p).length, 0);
  assert.equal(recallMemories(p).entries.length, 0);
  assert.equal(buildContext(p, ["memoire"]).memories.length, 0);
  assert.equal(memoryStats(p).expired, 1);
  assert.equal(expireMemories(p), 1);
  assert.equal(findMemory(p, draft.id).state, "expired");
  assert.throws(
    () => confirmMemory(p, draft.id, { via: "interface" }),
    /expiré/,
  );
});

test("rappel en lecture seule : aucun état sportif n’est modifié", () => {
  const p = newProfile("emilie");
  say(p, "Retiens que je n’aime pas le squat");
  confirmMemory(p, p.brain.memories[0].id, { via: "interface" });
  const before = withoutBrain(p);
  const answer = say(p, "Rappelle-moi ce que tu sais sur moi");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_RECALL);
  assert.deepEqual(withoutBrain(p), before);
  assert.equal(answer.turn.recall.length, 1);
});

test("refus d’action : une proposition mémoire ne déclenche jamais d’action sportive", () => {
  const p = newProfile("elite");
  const before = withoutBrain(p);
  const answer = say(p, "Retiens que je veux 5 séances par semaine");
  assert.equal(answer.brain.kind, BRAIN_RESULTS.MEMORY_PROPOSAL);
  assert.equal(answer.action, undefined);
  assert.equal(answer.automatic, undefined);
  assert.equal(answer.choices, undefined);
  assert.deepEqual(withoutBrain(p), before);
  assert.equal(assertBrainSafe(answer), true);
  assert.equal(COACH_ACTION_TYPES.includes("memory_proposal"), false);
  assert.throws(
    () => applyCoachAction(p, { type: "memory_proposal" }),
    /Action non prise en charge/,
  );
  // Le contrat fermé refuse aussi une réponse qui porterait une action connue.
  assert.throws(
    () =>
      brainResult(BRAIN_RESULTS.MEMORY_PROPOSAL, { action: { type: "plan" } }),
    /action sportive/,
  );
  assert.throws(() => brainResult("inventé"), /Contrat Brain inconnu/);
});

test("Brain désactivé : le coach déterministe reste utilisable, rien n’est mémorisé", () => {
  const p = newProfile("elite");
  setBrainEnabled(p, false);
  assert.equal(brainEnabled(p), false);
  const before = withoutBrain(p);
  const memoryAnswer = say(p, "Retiens que je préfère le matin");
  assert.equal(p.brain.memories.length, 0);
  assert.equal(memoryAnswer.brain.source, "brain-disabled");
  assert.match(memoryAnswer.text, /désactivé/);
  assert.equal(assertBrainSafe(memoryAnswer), true);
  // Le coach historique répond toujours, avec ses actions.
  const coach = brainAnswer(p, "Je suis fatigué, allège ma séance");
  assert.equal(coach.brain.source, "coach");
  assert.equal(coach.action?.type, "fatigue");
  assert.equal(
    interpretCommand(p, "Je n’ai que 30 minutes").action?.type,
    "shorten",
  );
  // Même appelé directement, le coach explique qu’il ne mémorise rien.
  assert.match(
    interpretCommand(p, "Retiens que je préfère le matin").text,
    /désactivé/,
  );
  assert.deepEqual(withoutBrain(p), before);
});

test("le routeur délègue au coach sans jamais modifier l’état", () => {
  const p = newProfile("elite");
  const before = structuredClone(p);
  const route = routeMessage(p, "Analyse ma semaine");
  assert.equal(route.kind, BRAIN_RESULTS.DELEGATED);
  assert.ok(route.topics.includes("force") || route.topics.length > 0);
  assert.deepEqual(p, before);
});

test("contexte par sujets : calculs déterministes, aucune mémoire non confirmée", () => {
  const p = newProfile("elite");
  const force = buildTopicContext(p, "force");
  assert.equal(force.topic, "force");
  assert.equal(typeof force.facts.force.bilan_fait, "boolean");
  const routed = contextForText(p, "Quelle charge pour le développé couché ?");
  assert.ok(routed.topics.includes("force"));
  assert.deepEqual(routed.memories, []);
  // Une proposition en attente n’entre pas dans le contexte…
  say(p, "Retiens que je préfère les élastiques");
  assert.equal(p.brain.memories.length, 1);
  assert.deepEqual(
    contextForText(p, "Retiens que je préfère les élastiques").memories,
    [],
  );
  // …une fois confirmée, elle y entre (lecture seule, sans action).
  confirmMemory(p, p.brain.memories[0].id, { via: "interface" });
  const confirmed = contextForText(p, "Retiens que je préfère les élastiques");
  assert.equal(confirmed.memories.length, 1);
  assert.equal(confirmed.memories[0].text, "je prefere les elastiques");
});

test("mémoire contrôlée : refus, validité et oubli", () => {
  const p = newProfile("elite");
  const draft = draftMemory("je préfère la piscine le vendredi", {
    type: "preference",
  });
  materializeMemory(p, draft);
  rejectMemory(p, draft.id, { via: "interface" });
  assert.equal(findMemory(p, draft.id).state, "rejected");
  assert.throws(
    () => confirmMemory(p, draft.id, { via: "interface" }),
    /refusée/,
  );
  const second = draftMemory("je préfère la piscine le jeudi");
  materializeMemory(p, second);
  confirmMemory(p, second.id, { via: "interface" });
  setMemoryValidity(p, second.id, 30);
  assert.equal(findMemory(p, second.id).expiresAt, addDays(today(), 30));
  setMemoryValidity(p, second.id, null);
  assert.equal(findMemory(p, second.id).expiresAt, null);
  forgetMemory(p, second.id);
  assert.equal(findMemory(p, second.id), null);
  assert.throws(
    () => confirmMemory(p, "inconnu", { via: "interface" }),
    /introuvable/,
  );
});

test("bornes : texte tronqué, mémoire plafonnée", () => {
  assert.equal(draftMemory("   "), null);
  const long = draftMemory("a".repeat(500));
  assert.equal(long.text.length, BRAIN_TEXT_MAX);
  assert.equal(long.state, "pending");
  const p = newProfile("elite");
  for (let i = 0; i < BRAIN_MEMORY_LIMIT + 15; i++)
    materializeMemory(
      p,
      draftMemory(`note numéro ${i} du carnet local`, { type: "context" }),
    );
  assert.equal(p.brain.memories.length, BRAIN_MEMORY_LIMIT);
});

test("restauration : une sauvegarde sans brain reste compatible et la mémoire locale est gardée", () => {
  const state = initialState();
  const local = state.profiles.elite;
  say(local, "Retiens que je préfère m’entraîner le matin");
  confirmMemory(local, local.brain.memories[0].id, { via: "interface" });

  // Sauvegarde antérieure au Brain : le profil n'a pas de clé `brain`.
  const legacyProfile = newProfile("elite");
  delete legacyProfile.brain;
  const backup = {
    format: "jarvis-profile",
    schemaVersion: 3,
    profileId: "elite",
    profile: legacyProfile,
    sourceFile: "Sauvegarde de test",
  };
  const test = structuredClone(state);
  test.profiles.elite = backup.profile;
  const validated = validateState(test);
  assert.deepEqual(validated.profiles.elite.brain, defaultBrainState());

  const result = restoreProfile(state, backup);
  assert.equal(result.state.profiles.elite.brain.memories.length, 1);
  assert.equal(
    result.state.profiles.elite.brain.memories[0].state,
    "confirmed",
  );
  assert.equal(
    result.state.profiles.elite.brain.memories[0].confirmedAt > 0,
    true,
  );
  assert.equal(brainEnabled(result.state.profiles.elite), true);
  // Un profil neuf porte une mémoire contrôlée vide et active.
  assert.deepEqual(newProfile("emilie").brain, defaultBrainState());
});
