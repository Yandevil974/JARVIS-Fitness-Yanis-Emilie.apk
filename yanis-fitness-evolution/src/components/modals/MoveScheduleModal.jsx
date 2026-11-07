import React, { useState } from "react";
import { useApp } from "../../store/AppContext.jsx";
import { Modal, Field, Input, Button, Badge } from "../ui.jsx";
import { scheduledFamily } from "../../engine/schedule-group.js";
import { copySession, moveSession } from "../../engine/planner.js";
import { today, dateLabel, addDays } from "../../engine/utils.js";

export default function MoveScheduleModal({ sessionId, mode = "move" }) {
  const { p, updateProfile, closeModal, notify } = useApp();
  const copying = mode === "copy";
  let family;
  try {
    family = scheduledFamily(p.plan, sessionId);
  } catch (e) {}
  const sourceDate = family?.root.date || today();
  const [date, setDate] = useState(
      copying
        ? addDays(sourceDate < today() ? today() : sourceDate, 1)
        : sourceDate,
    ),
    [time, setTime] = useState(family?.root.time || "18:00");
  if (!family)
    return (
      <Modal title="Séance introuvable" onClose={closeModal}>
        <p>Le planning a changé. Rouvrez la journée concernée.</p>
      </Modal>
    );
  const selected = family.items.find((s) => s.id === sessionId) || family.root;

  function submit(e) {
    e.preventDefault();
    try {
      const plan = copying
        ? copySession(p, sessionId, date, { time })
        : moveSession(p, sessionId, date, { time });
      updateProfile((q) => {
        q.plan = plan;
      });
      notify(
        copying
          ? `${family.items.length} bloc(s) copié(s) vers le ${dateLabel(date)}. L’original est conservé.`
          : `${family.items.length} bloc(s) déplacé(s), contenu et résultats conservés.`,
      );
      closeModal();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <Modal
      title={
        copying ? "Copier vers un autre jour" : "Déplacer dans le calendrier"
      }
      subtitle={
        copying
          ? "La séance choisie et ses blocs liés seront dupliqués. L’original reste inchangé."
          : "Les blocs liés suivent la séance. Les historiques ne sont pas déplacés."
      }
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <h3>{selected.name}</h3>
        {selected.id !== family.root.id && (
          <p className="small-subtitle">
            Bloc sélectionné dans la famille « {family.root.name} ». Les blocs
            liés restent ensemble pour préserver leur ordre.
          </p>
        )}
        <div className="move-family-summary">
          {family.items.map((s) => (
            <p key={s.id}>
              <Badge
                color={
                  s.type === "swim"
                    ? "blue"
                    : s.type === "metcon"
                      ? "amber"
                      : "mint"
                }
              >
                {s.type === "strength"
                  ? "Musculation"
                  : s.type === "metcon"
                    ? "METCON + piscine"
                    : s.type === "swim"
                      ? "Piscine"
                      : "Cardio"}
              </Badge>{" "}
              {s.name}
              <small>
                {dateLabel(s.date)} · {s.time || "18:00"}
              </small>
            </p>
          ))}
        </div>
        <div className="form-grid">
          <Field label={copying ? "Date de la copie" : "Nouvelle date"}>
            <Input
              type="date"
              required
              min={today()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label={copying ? "Horaire de la copie" : "Nouvel horaire"}>
            <Input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
        </div>
        <p className="small-subtitle">
          {copying
            ? "Les exercices, durées, prescriptions et l’ordre des blocs sont repris à l’identique. La copie reçoit de nouveaux identifiants ; aucun historique n’est transféré ni modifié."
            : "Les exercices, les durées prévues et l’ordre des blocs restent identiques, même si la semaine de destination possède un autre modèle. Si un bloc lié possède déjà un résultat, ce déplacement sera refusé pour préserver l’historique."}
        </p>
        <Button
          type="submit"
          variant="primary"
          icon={copying ? "Copy" : "CalendarClock"}
        >
          {copying ? "Confirmer la copie" : "Confirmer le déplacement lié"}
        </Button>
      </form>
    </Modal>
  );
}
