import React from "react";
import { useApp, speak } from "../../store/AppContext.jsx";
import {
  Modal,
  Button,
  Icon,
  IconButton,
  Badge,
  SectionHeading,
  ProgressBar,
} from "../ui.jsx";
import Movement from "../Movement.jsx";
import {
  POOL_PROTOCOLS,
  POOL_GUIDES,
  RECOVERY_EXERCISES,
  exerciseById,
} from "../../data/library.js";
import { warmup, recoveryScore } from "../../engine/fitness.js";
import { advanceTimer, pauseTimer, skipTimer } from "../../engine/timer.js";
import { useNow } from "../RestTimer.jsx";
import { durationLabel, today, norm, assetSrc } from "../../engine/utils.js";
export function TimerModal() {
  const { p, updateProfile, closeModal, setModal, notify } = useApp();
  const now = useNow();
  if (!p.timer) return null;
  const t = advanceTimer(p.timer, now),
    step = t.steps[t.index],
    total = t.steps.reduce((n, s) => n + s.seconds, 0);
  const progress = t.done
    ? 100
    : ((t.steps.slice(0, t.index).reduce((n, s) => n + s.seconds, 0) +
        step.seconds -
        t.remaining) /
        total) *
      100;
  const guide = POOL_GUIDES.find((g) =>
    g.k.some((k) => norm(step.name).includes(norm(k))),
  );
  function complete() {
    if (t.meta.type === "rest") {
      updateProfile((q) => {
        q.timer = null;
      });
      closeModal();
      return;
    }
    if (t.meta.type === "warmup") {
      updateProfile((q) => {
        if (q.workout?.id === t.meta.workoutId) q.workout.warmupDone = true;
        q.timer = null;
      });
      notify("Échauffement validé. Commencez avec une charge maîtrisée.");
      closeModal();
      return;
    }
    setModal({
      type:
        t.meta.type === "source-combo"
          ? "source-extra-results"
          : "log-activity",
      data: t.meta,
      timerResult: t,
    });
  }
  return (
    <Modal
      title={t.meta.name || "Votre séance guidée"}
      subtitle={`${t.meta.type === "rest" ? "Repos entre séries" : "Protocole guidé"} · ${t.index + 1} / ${t.steps.length} étapes`}
      onClose={closeModal}
      className="timer-modal"
    >
      <div className={`timer-stage ${step.kind || ""}`}>
        <Badge
          color={t.done ? "mint" : step.kind === "work" ? "amber" : "blue"}
          dot
        >
          {t.done
            ? "PROTOCOLE TERMINÉ"
            : t.paused
              ? "EN PAUSE"
              : step.kind === "work"
                ? "EFFORT"
                : "À VOTRE RYTHME"}
        </Badge>
        <h2>{t.done ? "Prenez une dernière respiration." : step.name}</h2>
        <div className="timer-display">
          {durationLabel(t.done ? 0 : t.remaining)}
        </div>
        {!t.done && (
          <Movement
            movementName={step.name}
            pattern={step.pattern || "breathe"}
            small
            controls={false}
          />
        )}
        <p>
          {step.instruction ||
            (t.done
              ? "Le chrono est terminé. Aucun résultat n’est encore ajouté à votre historique."
              : "Adaptez l’intensité à votre ressenti. La technique prime sur le chrono.")}
        </p>
        <ProgressBar value={progress} />
        <div className="timer-progress-meta">
          <span>{Math.round(t.elapsed)} s chronométrées</span>
          <span>{Math.round(total / 60)} min prévues</span>
        </div>
        {t.done ? (
          <Button variant="primary" icon="Check" onClick={complete}>
            {t.meta.type === "rest"
              ? "Série suivante prête"
              : t.meta.type === "warmup"
                ? "Valider l’échauffement"
                : "Confirmer mes résultats"}
          </Button>
        ) : (
          <div className="main-timer-actions">
            <IconButton
              icon="Square"
              label="Arrêter le protocole"
              onClick={() => setModal({ type: "stop-timer" })}
            />
            <Button
              variant="primary"
              icon={t.paused ? "Play" : "Pause"}
              onClick={() => {
                if (t.paused && t.safetyStopped) {
                  notify(
                    "Ce protocole a été suspendu après un signalement de douleur. Arrêtez-le plutôt que reprendre l’effort.",
                    "error",
                  );
                  return;
                }
                updateProfile((q) => {
                  q.timer = pauseTimer(q.timer);
                });
              }}
            >
              {t.paused ? "Reprendre" : "Pause"}
            </Button>
            <IconButton
              icon="SkipForward"
              label="Passer cette étape"
              onClick={() =>
                updateProfile((q) => {
                  q.timer = skipTimer(q.timer);
                })
              }
            />
          </div>
        )}
        {guide && !t.done && (
          <details className="timer-guide">
            <summary>
              <Icon name="Info" size={15} /> Consignes du mouvement
            </summary>
            {guide.img && <img src={assetSrc(guide.img)} alt={guide.t} />}
            <ul>
              {guide.h.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </details>
        )}
        <button className="text-link" onClick={closeModal}>
          Réduire le minuteur, il reste actif{" "}
          <Icon name="Minimize2" size={14} />
        </button>
      </div>
    </Modal>
  );
}
export function ProtocolModal({ protocolId, level = 0 }) {
  const { p, setTimer, setModal, closeModal, notify, updateProfile } = useApp();
  const pr = POOL_PROTOCOLS.find((p) => p.id === protocolId);
  const lv = pr?.niveaux[level];
  if (!lv) return null;
  const key = `${today()}-${protocolId}-${level}`,
    checked = p.protocolChecks?.[key] || [];
  const minutes = Math.round(lv.steps.reduce((s, r) => s + r[1], 0) / 60);
  function launch() {
    const score = recoveryScore(p).score;
    if (
      score != null &&
      score < 45 &&
      !["recovery", "endurance"].includes(pr.id)
    ) {
      notify(
        "Récupération faible : choisissez Aqua Recovery ou une nage très facile aujourd’hui.",
        "info",
      );
      return;
    }
    setTimer(
      lv.steps.map(([name, seconds]) => ({
        name,
        seconds,
        pattern: /repos|respiration|recup/i.test(name) ? "breathe" : "swim",
        kind: /repos|recup/i.test(name) ? "rest" : "work",
      })),
      {
        type: pr.id === "aquahiit" || pr.id === "aquatabata" ? "aqua" : "swim",
        name: pr.nom,
        protocolId: pr.id,
        level,
      },
    );
  }
  return (
    <Modal
      title={pr.nom}
      subtitle={`${lv.n} · ${minutes} minutes prévues · petit bassin, base temps`}
      onClose={closeModal}
      wide
    >
      <div className="protocol-detail">
        <div className="info-line">
          <Icon name="Info" />
          <p>
            {lv.conseil.replace(/zéro risque/gi, "faible impact")} Les cases
            mémorisent vos étapes cochées, mais ne créent pas une performance.
          </p>
        </div>
        <div className="protocol-steps">
          {lv.steps.map(([name, sec], i) => {
            const guide = POOL_GUIDES.find((g) =>
              g.k.some((k) => norm(name).includes(norm(k))),
            );
            return (
              <div key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked.includes(i)}
                    onChange={(e) =>
                      updateProfile((q) => {
                        q.protocolChecks = q.protocolChecks || {};
                        const a = q.protocolChecks[key] || [];
                        q.protocolChecks[key] = e.target.checked
                          ? [...a, i]
                          : a.filter((v) => v !== i);
                      })
                    }
                  />
                  <span className="protocol-step-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <strong>{name}</strong>
                </label>
                <span>{durationLabel(sec)}</span>
                {guide && (
                  <details open={!!guide.img}>
                    <summary>
                      Technique <Icon name="ChevronDown" size={12} />
                    </summary>
                    {/* L'illustration était repliée avec les consignes :
                        on ne voyait que du texte. Quand une planche
                        existe, le bloc s'ouvre par défaut. */}
                    <div className="pool-guide-content">
                      {guide.img && (
                        <img
                          loading="lazy"
                          src={assetSrc(guide.img)}
                          alt={guide.t}
                        />
                      )}
                      <ul>
                        {guide.h.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <Button
            variant="secondary"
            icon="NotebookPen"
            onClick={() =>
              setModal({
                type: "log-activity",
                data: { type: "swim", name: pr.nom },
              })
            }
          >
            Saisir sans chrono
          </Button>
          <Button variant="primary" icon="Play" onClick={launch}>
            Lancer le protocole
          </Button>
        </div>
        <p className="small-subtitle">
          Pas de distance déduite d’une nage statique. Pas d’apnée. Conditions
          de baignade adaptées et surveillées.
        </p>
      </div>
    </Modal>
  );
}
export function WarmupModal({ session }) {
  const { p, setTimer, updateProfile, notify, closeModal } = useApp();
  const s = session || p.workout;
  const steps = warmup(p, s);
  return (
    <Modal
      title="Bien commencer, c’est déjà progresser."
      subtitle="Échauffement spécifique · environ 8 minutes, à prolonger selon votre besoin."
      onClose={closeModal}
      wide
    >
      <div className="warmup-detail">
        {steps.map((st, i) => (
          <div key={i}>
            <span className="warmup-step-number">0{i + 1}</span>
            {/* Illustration de l'étape : les consignes seules
                laissaient deviner le geste. */}
            {st.img && (
              <img
                className="warmup-step-img"
                loading="lazy"
                src={assetSrc(st.img)}
                alt={st.name}
              />
            )}
            <div>
              <h3>{st.name}</h3>
              <p>{st.instruction}</p>
            </div>
            <Badge>{durationLabel(st.seconds)}</Badge>
          </div>
        ))}
      </div>
      <div className="warmup-visual">
        <Movement pattern={steps[1].pattern} small />
        <div>
          <h3>Préparez, sans vous épuiser.</h3>
          <p>
            Conservez une marge confortable. Les charges d’approche sont
            arrondies selon votre incrément et peuvent être ajustées au
            matériel.
          </p>
          <p>
            En cas de douleur, ne cherchez pas à la faire disparaître en
            chargeant davantage.
          </p>
        </div>
      </div>
      <div className="modal-actions">
        <Button
          variant="secondary"
          icon="Check"
          onClick={() => {
            if (p.workout)
              updateProfile((q) => {
                q.workout.warmupDone = true;
                if (
                  q.timer?.meta.type === "warmup" &&
                  q.timer.meta.workoutId === q.workout.id
                )
                  q.timer = null;
              });
            notify("Échauffement déclaré effectué.");
            closeModal();
          }}
        >
          Déjà effectué
        </Button>
        <Button
          variant="primary"
          icon="Play"
          onClick={() =>
            setTimer(steps, {
              type: "warmup",
              name: "Échauffement spécifique",
              workoutId: p.workout?.id,
            })
          }
        >
          Démarrer le guide
        </Button>
      </div>
    </Modal>
  );
}
export function StretchModal({ exercise }) {
  const { closeModal, setTimer } = useApp();
  return (
    <Modal
      title={exercise.name}
      subtitle={`${exercise.duration} · étirement doux, jamais douloureux`}
      onClose={closeModal}
    >
      <Movement exercise={exercise} />
      <p className="stretch-instruction">{exercise.instruction}</p>
      <div className="info-line">
        <Icon name="Wind" />
        <span>
          Respirez lentement, sans rebond et sans bloquer l’air. L’illustration
          montre un mouvement type : suivez en priorité les consignes de
          position.
        </span>
      </div>
      <div className="modal-actions">
        <Button
          variant="primary"
          icon="Play"
          onClick={() =>
            setTimer(
              [
                {
                  name: exercise.name,
                  seconds: 30,
                  pattern: "stretch",
                  instruction: exercise.instruction,
                },
              ],
              { type: "recovery", name: exercise.name },
            )
          }
        >
          Lancer 30 secondes
        </Button>
      </div>
    </Modal>
  );
}

/* ==========================================================================
   RETOUR AU CALME
   Le parcours de séance affichait l'échauffement et les exercices, mais
   le retour au calme se contentait de renvoyer vers la bibliothèque : les
   étirements n'étaient jamais proposés à la fin d'une séance.

   On sélectionne ici les étirements qui correspondent aux muscles
   réellement travaillés, plutôt que d'afficher les vingt-neuf.
   ========================================================================== */
export function CooldownModal({ session }) {
  const { p, closeModal, setModal } = useApp();
  const s = session || p.workout;
  // Muscles sollicités par la séance, principaux et secondaires.
  const muscles = new Set();
  for (const t of s?.exercises || []) {
    const ex = exerciseById(t.exerciseId);
    if (!ex) continue;
    muscles.add(ex.muscle);
    for (const m of ex.secondary || []) muscles.add(m);
  }
  const tous = RECOVERY_EXERCISES.filter((e) => e.pattern === "stretch");
  const cibles = tous.filter((e) => muscles.has(e.muscle));
  // Une séance sans correspondance ne doit pas donner un écran vide.
  const liste = (cibles.length ? cibles : tous).slice(0, 8);
  const total = liste.reduce((n, e) => n + (e.seconds || 30), 0);
  return (
    <Modal
      title="Terminer en douceur."
      subtitle={`Retour au calme · ${liste.length} étirements ciblés sur les muscles travaillés, environ ${Math.round(total / 60)} minutes.`}
      onClose={closeModal}
      wide
    >
      <div className="warmup-detail">
        {liste.map((e, i) => (
          <div key={e.id}>
            <span className="warmup-step-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            {e.img && (
              <img
                className="warmup-step-img"
                loading="lazy"
                src={assetSrc(e.img)}
                alt={e.name}
              />
            )}
            <div>
              <h3>{e.name}</h3>
              <p>{e.instruction}</p>
            </div>
            <Badge>{durationLabel(e.seconds || 30)}</Badge>
          </div>
        ))}
      </div>
      <div className="modal-actions">
        <Button
          variant="secondary"
          icon="BookOpen"
          onClick={() => setModal({ type: "stretch", exercise: liste[0] })}
        >
          Voir en détail
        </Button>
        <Button icon="Check" onClick={closeModal}>
          Terminé
        </Button>
      </div>
    </Modal>
  );
}
