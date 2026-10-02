// Chantier 1 (propositions A–E validées le 02/10/2026) : l'état unique du
// coach réagit aux retours réels — douleur, récupération, fatigue du bilan,
// RPE, séances manquées, reprise après coupure — sans jamais inventer de
// donnée, et le bilan qui vient d'être saisi entre immédiatement dans la
// décision.
import { test } from "node:test";
import assert from "node:assert/strict";
import { newProfile } from "../src/store/model.js";
import {
  weeklyCoachState,
  applyReviewAdaptation,
  RPE_HIGH,
  RPE_LOW,
} from "../src/engine/coach-state.js";
import { coachFindings, applyCoachAction } from "../src/engine/coach.js";
import { teamAdvice, teamInsights } from "../src/engine/team.js";
import { makeTeamReview } from "../src/engine/team-review.js";
import { today, addDays } from "../src/engine/utils.js";

// Une séance de musculation planifiée cette semaine (le plan d'un profil neuf
// démarre lundi prochain) + optionnellement des séries réalisées avec RPE.
function seeded({ sets = [], planned = true, status = "planned" } = {}) {
  const p = newProfile("elite");
  const s = p.plan.sessions.find((x) => x.type === "strength");
  s.date = today();
  s.status = status;
  if (!planned) p.plan.sessions = p.plan.sessions.filter((x) => x.id !== s.id);
  if (sets.length)
    p.sessions.push({
      id: "reel-1",
      date: today(),
      status: "completed",
      durationSec: 2700,
      exercises: [
        {
          exerciseId: "back-squat",
          sets: sets.map((x, i) => ({
            completed: true,
            reps: x.reps ?? 10,
            weight: x.weight ?? 80,
            rpe: x.rpe,
            rir: x.rir,
            createdAt: i,
          })),
        },
      ],
    });
  return p;
}

test("profil neuf sans aucune donnée : décision honnête « en attente »", () => {
  const p = newProfile("elite");
  p.plan.sessions = [];
  const st = weeklyCoachState(p);
  assert.equal(st.decision, "nodata");
});

test("douleur signalée au bilan du jour : protéger (haute priorité)", () => {
  const p = seeded();
  p.checkIns[today()] = { painReported: true, sleep: 8 };
  const st = weeklyCoachState(p);
  assert.equal(st.decision, "protect");
  assert.equal(st.severity, "high");
  assert.ok(st.reasons.some((r) => /douleur/.test(r)));
});

test("récupération basse sur 3 jours : décharge forte", () => {
  const p = seeded();
  for (let i = 0; i < 3; i++)
    p.checkIns[addDays(today(), -i)] = { sleep: 4, quality: 1, energy: 1, fatigue: 5 };
  const st = weeklyCoachState(p);
  assert.equal(st.decision, "deload");
  assert.ok(st.volumeFactor <= 0.6);
});

test("RPE moyen au-dessus du plafond : alléger (proposition C)", () => {
  const p = seeded({
    sets: [
      { rpe: 9.2 },
      { rpe: 9 },
      { rpe: 9.4 },
    ],
  });
  const st = weeklyCoachState(p);
  assert.equal(st.decision, "lighten");
  assert.ok(st.reasons.some((r) => r.includes(String(RPE_HIGH))));
});

test("tout terminé avec RPE bas : prêt à progresser (proposition C)", () => {
  const p = seeded({
    sets: [{ rpe: 6 }, { rpe: 6.5 }, { rpe: 6 }],
    status: "completed",
  });
  const st = weeklyCoachState(p);
  assert.equal(st.decision, "progress");
  assert.ok(st.detail.includes("2,5"));
});

test("RPE bas mais séries incomplètes : pas de progression inventée", () => {
  const p = seeded({ sets: [{ rpe: 6, reps: null }] });
  const st = weeklyCoachState(p);
  assert.notEqual(st.decision, "progress");
});

test("coupure de 10 jours : reprise progressive", () => {
  const p = seeded();
  p.sessions.push({
    id: "ancienne",
    date: addDays(today(), -10),
    status: "completed",
    exercises: [],
  });
  const st = weeklyCoachState(p);
  assert.equal(st.decision, "reprise");
  assert.ok(st.reasons.some((r) => /10 jours/.test(r)));
});

test("bilan frais fatigue 4/5 entre dans la décision, bilan ancien non", () => {
  const p = seeded();
  const st1 = weeklyCoachState(p, today(), { date: today(), fatigue: 4 });
  assert.equal(st1.decision, "deload");
  // Un bilan vieux de 3 semaines ne doit plus peser.
  p.teamReviews.push({ id: "vieux", date: addDays(today(), -21), fatigue: 5, pain: 1 });
  const st2 = weeklyCoachState(p);
  assert.notEqual(st2.decision, "deload");
});

test("bilan → action : fatigue 4/5 réduit la prochaine séance, une seule fois par jour", () => {
  const p = seeded();
  const review = makeTeamReview(p, { date: today(), fatigue: 4 });
  const r1 = applyReviewAdaptation(p, review);
  assert.equal(r1.changed, true);
  const next = p.plan.sessions.find((s) => s.type === "strength");
  assert.equal(next.coachAdapted, today());
  assert.ok(next.exercises.every((e) => e.targetSets <= 3));
  const r2 = applyReviewAdaptation(p, review);
  assert.equal(r2.changed, false);
});

test("bilan sans alerte : la programmation n'est pas modifiée", () => {
  const p = seeded();
  const review = makeTeamReview(p, { date: today(), fatigue: 2, feelings: "Ça va." });
  const r = applyReviewAdaptation(p, review);
  assert.equal(r.changed, false);
});

test("carte « Le coach a noté » : la décision fait finding, l'action l'applique", () => {
  const p = seeded();
  p.checkIns[today()] = { painReported: true, sleep: 7 };
  const findings = coachFindings(p);
  const state = findings.find((f) => f.key.startsWith("coach-state-"));
  assert.ok(state);
  assert.equal(state.severity, "high");
  assert.deepEqual(state.action, { type: "coach-state" });
  const { profile, detail } = applyCoachAction(p, state.action);
  assert.ok(/Décision appliquée|Décision du coach/.test(detail));
  const adapted = profile.plan.sessions.find((s) => s.coachAdapted === today());
  assert.ok(adapted);
  // Deuxième application le même jour : refusée, pas de double allégement.
  assert.throws(() => applyCoachAction(profile, state.action), /déjà été adaptée/);
});

test("séances manquées : le finding propose de réduire la fréquence", () => {
  const p = seeded();
  for (let i = 1; i <= 3; i++)
    p.plan.sessions.push({
      id: `ratee-${i}`,
      date: addDays(today(), -i),
      status: "missed",
      type: "strength",
      exercises: [],
    });
  const findings = coachFindings(p);
  const missed = findings.find((f) => f.key.startsWith("watch-missed-"));
  assert.ok(missed);
  assert.deepEqual(missed.action, { type: "replan" });
});

test("réponses du bilan : la décision du coach ouvre le fil (une seule voix)", () => {
  const p = seeded();
  const review = { date: today(), week: 0, fatigue: 4, feelings: "" };
  const messages = teamAdvice(p, review);
  assert.equal(messages[0].tag, "Coach");
  assert.ok(messages[0].text.startsWith("Décision de la semaine :"));
});

test("équipe : le coach principal porte la décision, santé et mobilité lisent vos données", () => {
  const p = seeded();
  p.checkIns[today()] = { painReported: true, energy: 1 };
  const insights = teamInsights(p);
  assert.ok(insights[0].text.includes("Décision du coach :"));
  assert.ok(/douleur signalée/i.test(insights[4].text));
  assert.ok(/énergie basse/i.test(insights[4].text));
  assert.ok(/échauffement/i.test(insights[5].text));
});
