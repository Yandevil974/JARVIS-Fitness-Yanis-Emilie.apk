import test from "node:test";
import assert from "node:assert/strict";
import {
  restCountdownCue,
  timerStepAnnouncement,
  newTimerMemo,
} from "../src/engine/voice-coach.js";
// Comportement vocal des minuteurs (port 1.5.0 : jalons de repos + compte à
// rebours d'étape, avec anneaux anti-répétition).
test("jalons de repos : 5/3/2/1/10/15/30/60 exactement", () => {
  assert.deepEqual(restCountdownCue(5, 90), {
    key: "rest-5",
    text: "Cinq secondes. En place.",
    priority: 2,
  });
  assert.deepEqual(restCountdownCue(3, 90), {
    key: "rest-3",
    text: "3",
    priority: 2,
  });
  assert.deepEqual(restCountdownCue(10, 90), {
    key: "rest-10",
    text: "Dix secondes.",
    priority: 1,
  });
  assert.deepEqual(restCountdownCue(60, 180), {
    key: "rest-60",
    text: "60 secondes de récupération.",
    priority: 1,
  });
  assert.equal(restCountdownCue(61, 180), null);
  assert.equal(restCountdownCue(0, 90), null);
});
test("repos court : jalon ≥ 30 s supprimé s'il tombe au début de l'étape", () => {
  // Règle 1.5.0 : si l'étape dure moins de jalon+10 s, le jalon initial est tu.
  assert.equal(restCountdownCue(30, 35), null);
  assert.equal(restCountdownCue(30, 25), null);
  assert.equal(restCountdownCue(60, 45), null);
  // Repos de 60 s : le jalon de 30 s tombe à mi-parcours, il doit parler.
  assert.deepEqual(restCountdownCue(30, 60), {
    key: "rest-30",
    text: "30 secondes de récupération.",
    priority: 1,
  });
});
test("pause et prolongation du minuteur d'étape", () => {
  const t = { remaining: 5, steps: [{ name: "Squat" }], index: 0 };
  // Premier appel : on mémorise l'étape courante sans rien dire.
  const prime = timerStepAnnouncement(t, newTimerMemo());
  assert.equal(prime.text, null);
  const r1 = timerStepAnnouncement(t, prime.memo);
  assert.equal(r1.text, "5");
  // Même seconde : l'anneau empêche la répétition.
  assert.equal(timerStepAnnouncement(t, r1.memo).text, null);
  // En pause : plus rien, l'anneau est conservé.
  const rp = timerStepAnnouncement({ ...t, paused: true }, r1.memo);
  assert.equal(rp.text, null);
  // Prolongation : le minuteur repasse à 5, la nouvelle annonce prime.
  const next = {
    ...t,
    remaining: 5,
    index: 1,
    steps: [{ name: "Squat" }, { name: "Développé" }],
  };
  const r3 = timerStepAnnouncement(next, rp.memo);
  assert.equal(r3.text, "Au suivant : Développé.");
  const r4 = timerStepAnnouncement({ ...next, remaining: 5 }, r3.memo);
  assert.equal(r4.text, "5");
  assert.equal(timerStepAnnouncement({ ...next, remaining: 5 }, r4.memo).text, null);
});
test("étape de repos : annonce dédiée, pas de nom d'exercice", () => {
  const t = { remaining: 45, index: 0, steps: [{ name: "Squat" }] };
  const m1 = timerStepAnnouncement(t, newTimerMemo());
  const rest = { ...t, remaining: 30, index: 1, steps: [...t.steps, { kind: "rest" }] };
  assert.equal(timerStepAnnouncement(rest, m1.memo).text, "Récupération.");
});
test("double minuteur : les mémos restent indépendants", () => {
  const rest = { remaining: 2, meta: { type: "rest" }, index: 0 };
  const warm = { remaining: 5, meta: { type: "warmup" }, index: 0 };
  const ra = timerStepAnnouncement(rest, newTimerMemo());
  const rb = timerStepAnnouncement(warm, newTimerMemo());
  assert.equal(ra.text, null);
  assert.equal(rb.text, null);
  const a = timerStepAnnouncement(rest, ra.memo);
  const b = timerStepAnnouncement(warm, rb.memo);
  assert.equal(a.text, "2");
  assert.equal(b.text, "5");
  // Le mémo du repos n'interfère pas avec celui de l'échauffement.
  assert.equal(timerStepAnnouncement(warm, a.memo).text, "5");
});
test("fin de minuteur : une seule annonce, selon le type", () => {
  const t = { done: true, meta: { type: "rest" } };
  const r = timerStepAnnouncement(t, newTimerMemo());
  assert.equal(r.text, "Récupération terminée. On reprend.");
  assert.equal(timerStepAnnouncement(t, r.memo).text, null);
  assert.equal(
    timerStepAnnouncement({ done: true, meta: { name: "Tirements de fin" } }, newTimerMemo())
      .text,
    "Étirements terminés. Bonne récupération.",
  );
  assert.equal(
    timerStepAnnouncement({ done: true, meta: { type: "warmup" } }, newTimerMemo()).text,
    "Échauffement terminé. Vous pouvez commencer.",
  );
  assert.equal(
    timerStepAnnouncement({ done: true, meta: {} }, newTimerMemo()).text,
    "Séance terminée. Bravo.",
  );
});
