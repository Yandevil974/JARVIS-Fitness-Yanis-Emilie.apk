import React from "react";
import { useApp } from "../store/AppContext.jsx";
import { coachFindings, applyCoachAction } from "../engine/coach.js";
import { forceRevalState } from "../engine/force.js";
import { Panel, Button, Icon } from "./ui.jsx";
// Carte « Le coach a noté » (portée de la 1.5.0) : le finding le plus urgent
// seulement, avec action réelle (adapter/réajuster) ou navigation. « Pas
// maintenant » masque ce finding précis jusqu'à ce que sa clé change.
export function CoachReview() {
  const { p, updateProfile, notify, navigate } = useApp();
  const findings = coachFindings(p).filter(
    (f) => !(p.dismissedFindings || []).includes(f.key),
  );
  if (!findings.length) return null;
  const top = findings[0];
  const dismiss = () =>
    updateProfile((q) => {
      q.dismissedFindings = [...(q.dismissedFindings || []), top.key].slice(-40);
    });
  const act = () => {
    if (top.action?.type === "navigate") {
      navigate(top.action.page);
      return;
    }
    try {
      const { profile, detail } = applyCoachAction(p, top.action);
      profile.dismissedFindings = [
        ...(profile.dismissedFindings || []),
        top.key,
      ].slice(-40);
      updateProfile(() => profile);
      notify(detail);
    } catch (e) {
      notify(e.message, "error");
    }
  };
  return (
    <Panel className={`coach-review severity-${top.severity}`}>
      <div className="coach-review-head">
        <Icon
          name={top.severity === "high" ? "TriangleAlert" : "Info"}
          size={20}
        />
        <div>
          <strong>{top.title}</strong>
          {findings.length > 1 && (
            <small>{findings.length - 1} autre(s) point(s) à revoir</small>
          )}
        </div>
      </div>
      <p>{top.detail}</p>
      <div className="coach-review-actions">
        <Button
          icon="Check"
          onClick={act}
        >
          {top.action?.type === "navigate" ? "Y aller" : "Adapter"}
        </Button>
        <button className="text-link" onClick={dismiss}>
          Pas maintenant
        </button>
      </div>
    </Panel>
  );
}
// Rappel du bilan 1RM : initial (jamais fait) ou périmé — jamais pendant la
// séance, seulement quand l'échéance est atteinte.
export function ForceReminder() {
  const { p, navigate } = useApp();
  const status = forceRevalState(p);
  if (!status.due) return null;
  return (
    <Panel className={`force-reminder ${status.done ? "" : "initial"}`}>
      <div className="force-reminder-head">
        <Icon name="Gauge" size={20} />
        <div>
          <strong>{status.label}</strong>
          <small>{status.detail}</small>
        </div>
      </div>
      <p>
        {status.done
          ? `Vos charges automatiques s’appuient sur le bilan du ${status.last}. Un référentiel ancien sous-estime votre force et fausse la progression.`
          : "Sans bilan, les charges sont déduites de votre journal uniquement. Un test rapide suffit pour un calcul automatique fiable sur tous les exercices."}
      </p>
      <Button
        icon="ArrowRight"
        onClick={() => navigate("force")}
      >
        {status.done ? "Refaire le bilan 1RM" : "Faire le bilan 1RM"}
      </Button>
    </Panel>
  );
}
