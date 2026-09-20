import React from "react";
import { useApp } from "../../store/AppContext.jsx";
import { Modal, Icon, Button, Badge, SectionHeading } from "../ui.jsx";
import Movement from "../Movement.jsx";
import Anatomy from "../Anatomy.jsx";
import {
  exerciseById,
  alternatives,
  PATTERN_INFO,
  MUSCLES,
  EQUIPMENT,
  EXERCISES,
} from "../../data/library.js";
import { nextSession } from "../../engine/planner.js";
import { applyCoachAction } from "../../engine/coach.js";
export default function ExerciseModal({ id }) {
  const { p, closeModal, updateProfile, notify, setModal } = useApp();
  const ex = exerciseById(id),
    info = PATTERN_INFO[ex.pattern] || PATTERN_INFO.static;
  const variants = EXERCISES.filter(
    (e) => e.id !== id && e.muscle === ex.muscle && e.pattern === ex.pattern,
  ).slice(0, 5);
  const alt = alternatives(ex, p);
  const session = p.workout || nextSession(p);
  const inSession = session?.exercises.some((e) => e.exerciseId === id);
  const replace = (to) => {
    try {
      const r = applyCoachAction(
        p,
        { type: "replace", exerciseId: id, sessionId: session?.id },
        { exerciseId: to },
      );
      updateProfile(() => r.profile);
      notify(r.detail);
      closeModal();
    } catch (e) {
      notify(e.message, "error");
    }
  };
  return (
    <Modal
      title={ex.name}
      subtitle={`${MUSCLES[ex.muscle]} · ${ex.level || "Tous niveaux"} · ${(ex.equipment || []).map((e) => EQUIPMENT[e]).join(" + ")}`}
      onClose={closeModal}
      wide
    >
      <div className="exercise-detail-layout">
        <div>
          <Movement exercise={ex} />
          <div className="exercise-detail-actions">
            <Button
              variant={
                p.preferences.favorites.includes(id)
                  ? "primary small"
                  : "secondary small"
              }
              icon="Heart"
              onClick={() =>
                updateProfile((q) => {
                  q.preferences.favorites = q.preferences.favorites.includes(id)
                    ? q.preferences.favorites.filter((v) => v !== id)
                    : [...q.preferences.favorites, id];
                })
              }
            >
              {p.preferences.favorites.includes(id)
                ? "Dans vos favoris"
                : "Ajouter aux favoris"}
            </Button>
            <Button
              variant="secondary small"
              icon="Ban"
              onClick={() => {
                updateProfile((q) => {
                  q.preferences.refused = q.preferences.refused.includes(id)
                    ? q.preferences.refused.filter((v) => v !== id)
                    : [...q.preferences.refused, id];
                });
                notify(
                  p.preferences.refused.includes(id)
                    ? "Exercice de nouveau autorisé."
                    : "Préférence mémorisée : exercice à éviter dans les nouveaux programmes.",
                );
              }}
            >
              {p.preferences.refused.includes(id)
                ? "Réautoriser"
                : "Ne plus proposer"}
            </Button>
          </div>
          <div className="exercise-phases">
            {["Position initiale", "Mouvement", "Position finale / retour"].map(
              (title, i) => (
                <div key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{info.etapes[i]}</p>
                  </div>
                </div>
              ),
            )}
          </div>
          {ex.note && (
            <div className="source-technique">
              <Icon name="NotebookPen" size={17} />
              <p>Précision de la variante source : {ex.note}</p>
            </div>
          )}
          <div className="detail-info-grid">
            <div>
              <Icon name="Wind" size={19} />
              <h3>Respiration</h3>
              <p>{info.resp}</p>
            </div>
            <div>
              <Icon name="MoveVertical" size={19} />
              <h3>Amplitude</h3>
              <p>{ex.amplitude || "Confortable, contrôlée et sans douleur."}</p>
            </div>
            <div>
              <Icon name="Timer" size={19} />
              <h3>Tempo</h3>
              <p>
                {ex.tempo || "Contrôlé"} · excentrique, pause basse,
                concentrique, pause haute.
              </p>
            </div>
            <div>
              <Icon name="TriangleAlert" size={19} />
              <h3>Erreurs fréquentes</h3>
              <ul>
                {info.erreurs.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="small-subtitle">
            Les illustrations humaines sont des repères pédagogiques ; certaines
            variantes n’ont pas de démonstration exacte. Un professionnel peut
            vérifier votre exécution. Arrêtez en cas de douleur importante.
          </p>
        </div>
        <aside>
          <div className="detail-anatomy">
            <h3>Comprendre la sollicitation</h3>
            <Anatomy primary={[ex.muscle]} secondary={ex.secondary || []} />
            <div className="muscle-detail-groups">
              <div>
                <span>PRINCIPAL</span>
                <strong>{MUSCLES[ex.muscle]}</strong>
              </div>
              <div>
                <span>SECONDAIRES</span>
                <p>
                  {(ex.secondary || []).map((m) => MUSCLES[m]).join(", ") ||
                    "Selon l’exécution"}
                </p>
              </div>
              <div>
                <span>STABILISATEURS</span>
                <p>
                  {(ex.stabilizers || []).map((m) => MUSCLES[m]).join(", ") ||
                    "Selon la variante"}
                </p>
              </div>
            </div>
          </div>
          <SectionHeading title="Alternatives compatibles" />
          {alt.length ? (
            alt.map((e) => (
              <div className="alternative-item" key={e.id}>
                <button
                  onClick={() =>
                    setModal({ type: "exercise", exerciseId: e.id })
                  }
                >
                  {e.name}
                  <small>
                    {e.pattern === ex.pattern
                      ? "Même mouvement principal"
                      : "Même groupe, mouvement différent"}
                  </small>
                </button>
                {inSession && (
                  <button
                    className="icon-button"
                    aria-label={`Remplacer par ${e.name}`}
                    onClick={() => replace(e.id)}
                  >
                    <Icon name="Repeat2" size={16} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="small-subtitle">
              Aucune alternative trouvée avec votre matériel déclaré.
            </p>
          )}
          <SectionHeading title="Variantes de la bibliothèque" />
          {variants.map((e) => (
            <button
              key={e.id}
              className="variant-link"
              onClick={() => setModal({ type: "exercise", exerciseId: e.id })}
            >
              {e.name}
              <Icon name="ArrowUpRight" size={12} />
            </button>
          ))}
        </aside>
      </div>
    </Modal>
  );
}
