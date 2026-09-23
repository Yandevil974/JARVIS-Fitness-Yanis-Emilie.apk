import React, { useState } from "react";
import { useApp } from "../../store/AppContext.jsx";
import { Modal, Field, Input, Button, Badge } from "../ui.jsx";
import { scheduledFamily } from "../../engine/schedule-group.js";
import { moveSession } from "../../engine/planner.js";
import { today, dateLabel } from "../../engine/utils.js";
export default function MoveScheduleModal({ sessionId }) {
  const { p, updateProfile, closeModal, notify } = useApp();
  let family;
  try {
    family = scheduledFamily(p.plan, sessionId);
  } catch (e) {}
  const [date, setDate] = useState(family?.root.date || today()),
    [time, setTime] = useState(family?.root.time || "18:00");
  if (!family)
    return (
      <Modal title="Séance introuvable" onClose={closeModal}>
        <p>Le planning a changé. Rouvrez la journée concernée.</p>
      </Modal>
    );
  function submit(e) {
    e.preventDefault();
    try {
      const plan = moveSession(p, sessionId, date, { time });
      updateProfile((q) => {
        q.plan = plan;
      });
      notify(
        `${family.items.length} bloc(s) déplacé(s), contenu et résultats conservés.`,
      );
      closeModal();
    } catch (error) {
      notify(error.message, "error");
    }
  }
  return (
    <Modal
      title="Déplacer dans le calendrier"
      subtitle="Les blocs liés suivent la séance. Les historiques ne sont pas déplacés."
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <h3>{family.root.name}</h3>
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
          <Field label="Nouvelle date">
            <Input
              type="date"
              required
              min={today()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Nouvel horaire">
            <Input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
        </div>
        <p className="small-subtitle">
          Les exercices, les durées prévues et l’ordre des blocs restent
          identiques. Si un bloc lié possède déjà un résultat, ce déplacement
          sera refusé pour préserver l’historique.
        </p>
        <Button type="submit" variant="primary" icon="CalendarClock">
          Confirmer le déplacement lié
        </Button>
      </form>
    </Modal>
  );
}
