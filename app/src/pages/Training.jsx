import SourceJournal from "../components/SourceJournal.jsx";
import React, { useState, useEffect } from "react";
import { useApp, speak } from "../store/AppContext.jsx";
import VoiceCoach from "../components/VoiceCoach.jsx";
import { suggestedLoad, loadReason } from "../engine/strength.js";
import {
  Icon,
  IconButton,
  Button,
  Badge,
  PageHeading,
  Panel,
  SectionHeading,
  Tabs,
  Field,
  Input,
  Select,
  Empty,
  ProgressBar,
} from "../components/ui.jsx";
import Movement from "../components/Movement.jsx";
import Anatomy from "../components/Anatomy.jsx";
import RestTimer, { useNow } from "../components/RestTimer.jsx";
import {
  EXERCISES,
  exerciseById,
  GROUPS,
  EQUIPMENT,
  MUSCLES,
  searchExercises,
  PATTERN_INFO,
} from "../data/library.js";
import {
  nextSession,
  suggestSession,
  estimateMinutes,
} from "../engine/planner.js";
import {
  recommendLoad,
  forceSummary,
  warmup,
  allSets,
} from "../engine/fitness.js";
import {
  assetSrc,
  numberLabel,
  dateLabel,
  durationLabel,
} from "../engine/utils.js";
export default function Training() {
  const { p, tab, setTab, startWorkout, setModal, openExercise } = useApp();
  const value = tab === "session" ? "overview" : tab || "overview";
  return (
    <>
      <PageHeading
        eyebrow="LE MOUVEMENT, AVEC UNE INTENTION"
        title="Votre entraînement."
        description="Comprenez. Exécutez. Progressez."
      >
        <Button
          variant="secondary"
          icon="Plus"
          onClick={() => setModal({ type: "log" })}
        >
          Saisie rapide
        </Button>
      </PageHeading>
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["overview", "Ma séance"],
          ["library", "Bibliothèque", EXERCISES.length],
          ["history", "Historique", p.sessions.length],
          ...(p.legacyArchive?.journal
            ? [["source-journal", "Journal du fichier"]]
            : []),
        ]}
      />
      {value === "source-journal" ? (
        <SourceJournal />
      ) : value === "library" ? (
        <Library />
      ) : value === "history" ? (
        <History />
      ) : p.workout ? (
        <Workout />
      ) : (
        <Preview />
      )}
    </>
  );
}
function Preview() {
  const { p, startWorkout, openExercise, setModal, navigate } = useApp();
  const next = nextSession(p) || suggestSession(p);
  return (
    <div className="training-layout">
      <div>
        <Panel className="workout-preview-head">
          <Badge color="mint" dot>
            {next.deload ? "SEMAINE ALLÉGÉE" : "VOTRE PROCHAINE SÉANCE"}
          </Badge>
          <h2>{next.name}</h2>
          <p>
            {dateLabel(next.date, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            · {next.estimatedMinutes} minutes estimées · {next.exercises.length}{" "}
            mouvements
          </p>
          <div className="preview-focus">
            {next.focus.map((m) => (
              <Badge key={m}>{MUSCLES[m]}</Badge>
            ))}
          </div>
          <Button
            variant="primary"
            icon="Play"
            onClick={() => startWorkout(next)}
          >
            Lancer cette séance
          </Button>
        </Panel>
        <SectionHeading
          title="Le programme de la séance"
          subtitle="Les charges affichées sont des propositions, pas des performances."
        />
        <div className="exercise-list">
          {next.exercises.map((target, i) => {
            const ex = exerciseById(target.exerciseId);
            const rec = recommendLoad(p, target);
            return (
              <Panel className="exercise-row" key={target.exerciseId + i}>
                <span className="exercise-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  className="exercise-row-title"
                  onClick={() => openExercise(ex.id)}
                >
                  <h3>{ex.name}</h3>
                  <p>
                    {MUSCLES[ex.muscle]} ·{" "}
                    {ex.equipment.map((e) => EQUIPMENT[e]).join(" + ")}
                  </p>
                  <span>
                    {target.targetSets} séries ·{" "}
                    {ex.timed
                      ? `${target.seconds || 30} s`
                      : target.repScheme + " reps"}{" "}
                    · {target.rest}s repos
                  </span>
                </button>
                <div className="exercise-row-load">
                  <strong>
                    {rec.weight != null
                      ? `${numberLabel(rec.weight)} kg`
                      : ex.timed
                        ? "Chronométré"
                        : ex.bodyweight
                          ? "Poids du corps"
                          : "À calibrer"}
                  </strong>
                  <Badge color={rec.color}>{rec.label}</Badge>
                </div>
                <IconButton
                  icon="ArrowUpRight"
                  label={`Voir ${ex.name}`}
                  onClick={() => openExercise(ex.id)}
                />
              </Panel>
            );
          })}
        </div>
        <Panel className="warmup-preview">
          <div>
            <span className="metric-icon amber">
              <Icon name="Flame" />
            </span>
            <h3>Préparer le corps, pas le fatiguer.</h3>
            <p>
              Mobilité spécifique, activation et séries d’approche. Les charges
              d’échauffement sont calculées seulement si votre charge de travail
              est connue.
            </p>
          </div>
          <Button
            variant="secondary"
            icon="Play"
            onClick={() => setModal({ type: "warmup", session: next })}
          >
            Voir l’échauffement
          </Button>
        </Panel>
      </div>
      <aside>
        <Panel className="workout-guide">
          <SectionHeading title="Muscles sollicités">
            <Icon name="ScanLine" size={18} />
          </SectionHeading>
          <Anatomy primary={next.focus} secondary={["abs", "tra"]} />
          <p className="small-subtitle">
            Touchez un muscle pour l’identifier. Les sollicitations secondaires
            ne sont pas comptées comme des séries directes.
          </p>
        </Panel>
        <Panel className="coach-compact">
          <Icon name="Sparkles" size={23} />
          <h3>Votre séance peut s’adapter.</h3>
          <p>
            Une machine occupée ? Moins de temps ? Dites-le à JARVIS avant de
            commencer.
          </p>
          <Button variant="secondary" onClick={() => navigate("jarvis")}>
            Adapter avec JARVIS
          </Button>
        </Panel>
      </aside>
    </div>
  );
}
function Workout() {
  const { p, updateProfile, logSet, openExercise, setModal, navigate } =
    useApp();
  const w = p.workout,
    index = w.currentIndex || 0,
    target = w.exercises[index],
    ex = exerciseById(target.exerciseId),
    done = target.sets.filter((s) => s.completed).length;
  const allDone = w.exercises.reduce(
      (s, e) => s + e.sets.filter((s) => s.completed).length,
      0,
    ),
    total = w.exercises.reduce((s, e) => s + e.targetSets, 0);
  const [weight, setWeight] = useState(""),
    [reps, setReps] = useState(""),
    [rpe, setRpe] = useState(""),
    [rir, setRir] = useState(""),
    [note, setNote] = useState("");
  const force = forceSummary(p, ex.id, target.unit);
  // Charge calculée à partir du bilan 1RM : pourcentage du maximum
  // rapporté au nombre de répétitions visé. C'est cette valeur qui
  // pré-remplit la saisie, pour éviter d'avoir à la choisir à la main.
  const nextReps =
    target.repTargets?.[done % target.repTargets.length] || target.repsLow;
  const suggestion = suggestedLoad(p, ex, nextReps, {
    deload: !!w.deload,
    unit: target.unit,
  });
  const priorSource = allSets(p, {
    exerciseId: ex.id,
    unit: "source à vérifier",
  })
    .filter((s) => s.weight != null)
    .at(-1);
  function verifySourceLoad() {
    if (!priorSource) return;
    const unit = ex.bodyweight && !ex.timed ? "kg ajouté" : target.unit;
    setWeight(priorSource.weight);
    updateProfile((q) => {
      q.preferences.sourceUnits = {
        ...q.preferences.sourceUnits,
        [ex.id]: unit,
      };
      for (const session of q.sessions)
        for (const e of session.exercises) {
          if (e.exerciseId !== ex.id) continue;
          if (e.unit === "source à vérifier") e.unit = unit;
          for (const set of e.sets)
            if (set.unit === "source à vérifier") {
              set.originalUnit = set.unit;
              set.unit = unit;
              set.sourceUnitVerified = true;
            }
        }
      if (q.workout?.exercises[index]) q.workout.exercises[index].unit = unit;
    });
  }

  useEffect(() => {
    // Priorité : charge déjà prescrite par la séance, sinon charge
    // calculée depuis le référentiel de force, sinon vide.
    setWeight(target.targetLoad ?? suggestion?.load ?? "");
    setReps(
      ex.timed
        ? target.seconds || 30
        : target.repTargets?.[done % target.repTargets.length] ||
            target.repsLow,
    );
    setRpe("");
    setRir("");
    setNote("");
  }, [ex.id, index]);
  useEffect(() => {
    if (target.repTargets?.length)
      setReps(target.repTargets[done % target.repTargets.length]);
  }, [done, ex.id]);
  const submit = (e) => {
    e.preventDefault();
    if (
      logSet({
        exerciseIndex: index,
        weight,
        reps,
        rpe,
        rir,
        note,
        unit: ex.bodyweight && !ex.timed ? "kg ajouté" : target.unit,
      })
    ) {
      setRpe("");
      setRir("");
      setNote("");
    }
  };
  const select = (i) =>
    updateProfile((q) => {
      q.workout.currentIndex = i;
    });
  return (
    <>
      <div className="session-topbar">
        <div>
          <Badge color="mint" dot>
            MODE SÉANCE
          </Badge>
          <h2>{w.name}</h2>
          <span>
            {allDone}/{total} séries réalisées · <Elapsed start={w.startedAt} />
          </span>
        </div>
        <div className="session-top-actions">
          <IconButton
            icon={p.preferences.voice ? "Volume2" : "VolumeX"}
            label="Activer ou désactiver le coach vocal"
            onClick={() =>
              updateProfile((q) => {
                q.preferences.voice = !q.preferences.voice;
              })
            }
          />
          <Button
            variant="secondary"
            icon="Sparkles"
            onClick={() => navigate("jarvis")}
          >
            Adapter
          </Button>
          <Button
            variant="primary"
            icon="Flag"
            onClick={() => setModal({ type: "finish-workout" })}
          >
            Terminer
          </Button>
        </div>
      </div>
      <ProgressBar
        value={(allDone / total) * 100}
        className="session-progress"
      />
      {w.preservePrescription && (
        <div className="original-session-label">
          <Icon name="ShieldCheck" size={16} />
          <span>
            {w.userAdapted || w.recoveryAdapted || w.timeBudget
              ? "Séance adaptée avec votre accord. Votre programme HTML d’origine reste conservé."
              : "Programme d’origine · vos exercices et leur ordre sont conservés."}
          </span>
        </div>
      )}
      {w.sourcePeriodNote && (
        <div className="week-deload-note">
          <Icon name="Info" size={16} />
          <span>
            {w.sourcePeriodNote} C’est une règle du HTML, pas une modification
            de JARVIS. Les séries réellement saisies restent intactes.
          </span>
        </div>
      )}
      {w.recoveryAdvice && (
        <div className="original-session-advice">{w.recoveryAdvice}</div>
      )}
      {w.equipmentChanges?.length > 0 && (
        <details className="equipment-adjustments">
          <summary>
            <Icon name="Info" size={16} /> {w.equipmentChanges.length} point(s)
            de matériel à vérifier · voir les détails
          </summary>
          {w.equipmentChanges.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </details>
      )}
      {w.safetyStop && (
        <div className="warning-box danger">
          <Icon name="OctagonAlert" />
          <div>
            <strong>Exercice suspendu par sécurité.</strong>
            <p>
              Ne poursuivez pas le mouvement douloureux. Vos séries déjà
              réalisées sont conservées. Terminez partiellement et demandez
              conseil si la douleur est importante ou persistante.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={() => setModal({ type: "finish-workout" })}
          >
            Clôturer la séance
          </Button>
        </div>
      )}
      <div className="immersive-layout">
        <aside className="workout-sequence">
          <div className="eyebrow">VOTRE PARCOURS</div>
          <button
            className={`sequence-warmup ${w.warmupDone ? "done" : ""}`}
            onClick={() => setModal({ type: "warmup", session: w })}
          >
            <Icon name={w.warmupDone ? "CircleCheck" : "Flame"} size={18} />
            <span>
              Échauffement
              <small>{w.warmupDone ? "Validé" : "Avant de commencer"}</small>
            </span>
            <Icon name="ChevronRight" size={14} />
          </button>
          {w.exercises.map((t, i) => {
            const count = t.sets.filter((s) => s.completed).length;
            return (
              <button
                key={t.exerciseId + i}
                className={`sequence-item ${i === index ? "active" : ""} ${count >= t.targetSets ? "done" : ""}`}
                onClick={() => select(i)}
              >
                <span>
                  {count >= t.targetSets ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <div>
                  {exerciseById(t.exerciseId).name}
                  <small>
                    {count} / {t.targetSets} séries
                  </small>
                </div>
              </button>
            );
          })}
          <button
            className="sequence-warmup"
            onClick={() => navigate("recovery", "library")}
          >
            <Icon name="Wind" size={18} />
            <span>
              Retour au calme<small>Relâcher & récupérer</small>
            </span>
          </button>
        </aside>
        <div className="workout-stage">
          <Panel className="exercise-stage">
            <div className="exercise-stage-head">
              <div>
                <span className="eyebrow">
                  EXERCICE {String(index + 1).padStart(2, "0")} /{" "}
                  {String(w.exercises.length).padStart(2, "0")}
                </span>
                <h2>{target.sourceName || ex.name}</h2>
                <p>
                  {MUSCLES[ex.muscle]} · {target.unit} · tempo {target.tempo}
                </p>
              </div>
              <IconButton
                icon="Info"
                label="Technique et muscles"
                onClick={() => openExercise(ex.id)}
              />
            </div>
            <Movement exercise={ex} />
            <div className="technique-strip">
              <Icon name="Focus" size={18} />
              <p>
                {target.sourceNote ||
                  ex.tip ||
                  PATTERN_INFO[ex.pattern]?.etapes?.[0] ||
                  "Gardez une exécution contrôlée, dans une amplitude sans douleur."}
              </p>
            </div>
          </Panel>
          <Panel className="set-entry">
            <SectionHeading
              title={
                done >= target.targetSets
                  ? "Exercice terminé. Bien joué."
                  : `Série ${done + 1} sur ${target.targetSets}`
              }
              subtitle="Confirmez ce que vous avez réellement réalisé."
            />
            {priorSource && (
              <div className="source-load-hint">
                <strong>
                  Dernière charge du fichier : {numberLabel(priorSource.weight)}{" "}
                  kg
                </strong>
                <p>
                  {dateLabel(priorSource.date)} · vérifiez que la convention est
                  bien{" "}
                  {ex.bodyweight
                    ? "la charge ajoutée au poids du corps"
                    : target.unit}{" "}
                  avant de la reprendre. Vos anciennes valeurs ne seront pas
                  changées.
                </p>
                <Button variant="secondary small" onClick={verifySourceLoad}>
                  Confirmer cette convention et reprendre la charge
                </Button>
              </div>
            )}
            {done < target.targetSets && !w.safetyStop ? (
              <form onSubmit={submit}>
                <div className="set-inputs">
                  <Field
                    label={
                      ex.timed
                        ? "Durée réalisée"
                        : ex.bodyweight
                          ? "Charge ajoutée (facultative)"
                          : "Charge réalisée"
                    }
                  >
                    {ex.timed ? (
                      <div className="static-value">AU TEMPS</div>
                    ) : (
                      <div className="big-input">
                        <input
                          aria-label="Charge réalisée"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          max="1000"
                          step="0.5"
                          placeholder={ex.bodyweight ? "PDC / 0" : "—"}
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                        <span>
                          {ex.bodyweight
                            ? "kg ajoutés"
                            : target.unit === "kg/main"
                              ? "kg/main"
                              : "kg"}
                        </span>
                      </div>
                    )}
                  </Field>
                  <Field
                    label={
                      ex.timed ? "Secondes réalisées" : "Répétitions réalisées"
                    }
                  >
                    <div className="big-input">
                      <input
                        aria-label={
                          ex.timed
                            ? "Secondes réalisées"
                            : "Répétitions réalisées"
                        }
                        type="number"
                        min="1"
                        max={ex.timed ? 3600 : 100}
                        required
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                      />
                      <span>{ex.timed ? "sec" : "reps"}</span>
                    </div>
                  </Field>
                  <Field label="RPE · effort /10">
                    <Select
                      aria-label="RPE de la série"
                      value={rpe}
                      onChange={(e) => setRpe(e.target.value)}
                    >
                      <option value="">À renseigner</option>
                      {[5, 6, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <details className="set-details">
                  <summary>
                    RIR et note de série <Icon name="ChevronDown" size={13} />
                  </summary>
                  <div className="form-grid">
                    <Field label="Répétitions en réserve">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        placeholder="Optionnel"
                        value={rir}
                        onChange={(e) => setRir(e.target.value)}
                      />
                    </Field>
                    <Field label="Note">
                      <Input
                        value={note}
                        maxLength={300}
                        placeholder="Technique, sensation…"
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </Field>
                  </div>
                </details>
                <button className="validate-set" type="submit">
                  <Icon name="Check" size={21} />
                  Valider la série
                  <span>
                    {target.rest > 0
                      ? "Le repos démarre automatiquement"
                      : "Enchaînement source · sans repos ici"}
                  </span>
                  <Icon name="ArrowRight" size={19} />
                </button>
              </form>
            ) : (
              <div className="exercise-finished">
                <Icon name="CircleCheck" size={32} />
                <p>
                  {w.safetyStop
                    ? "Exercice suspendu."
                    : "Toutes les séries prévues sont sauvegardées."}
                </p>
                {index < w.exercises.length - 1 && !w.safetyStop && (
                  <Button
                    variant="primary"
                    icon="ArrowRight"
                    onClick={() => select(index + 1)}
                  >
                    Exercice suivant
                  </Button>
                )}
              </div>
            )}
            {target.sets.length > 0 && (
              <div className="logged-sets">
                <div className="table-head">
                  <span>SÉRIE</span>
                  <span>CHARGE</span>
                  <span>{ex.timed ? "SECONDES" : "REPS"}</span>
                  <span>RPE</span>
                  <span />
                </div>
                {target.sets.map((s, i) => (
                  <div key={s.id}>
                    <span>
                      <Icon name="Check" size={13} />
                      {i + 1}
                    </span>
                    <strong>{s.weight != null ? `${s.weight} kg` : "—"}</strong>
                    <strong>{s.reps}</strong>
                    <span>{s.rpe ?? "—"}</span>
                    <IconButton
                      icon="Pencil"
                      label={`Corriger la série ${i + 1}`}
                      onClick={() =>
                        setModal({
                          type: "edit-set",
                          exerciseIndex: index,
                          setId: s.id,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
        <aside className="session-rail">
          <Panel className="voice-coach-panel">
            <VoiceCoach />
          </Panel>
          <Panel>
            <RestTimer />
          </Panel>
          <Panel className="session-recommendation">
            <span className="eyebrow">
              <Icon name="Sparkles" size={13} /> DÉCISION JARVIS
            </span>
            <Badge color={target.recommendation?.color}>
              {target.recommendation?.label || "À calibrer"}
            </Badge>
            <p>
              {target.recommendation?.reason ||
                "Renseignez votre première série pour commencer à construire votre historique."}
            </p>
            {suggestion?.load != null && (
              <div className="load-suggestion">
                <div className="load-suggestion-value">
                  <strong>{suggestion.load}</strong>
                  <span>
                    {target.unit === "kg/main" ? "kg par haltère" : "kg"} ·{" "}
                    {nextReps} rép.
                  </span>
                </div>
                <p>{loadReason(suggestion)}</p>
                {suggestion.effective != null && (
                  <small>
                    Base : {suggestion.baseName} {suggestion.effective} kg à 1RM
                    {suggestion.percent
                      ? ` · ${Math.round(suggestion.percent * 100)} % du maximum`
                      : ""}
                    {suggestion.fromJournal
                      ? " · estimé depuis vos séries"
                      : suggestion.declared
                        ? " · issu de votre bilan 1RM"
                        : ""}
                  </small>
                )}
                {Number(weight) !== suggestion.load && (
                  <button
                    className="text-link"
                    onClick={() => setWeight(suggestion.load)}
                  >
                    Appliquer cette charge
                  </button>
                )}
              </div>
            )}
            <small>Vous pouvez toujours modifier la charge saisie.</small>
          </Panel>
          <Panel className="session-muscles">
            <h3>Muscles en action</h3>
            <Anatomy primary={[ex.muscle]} secondary={ex.secondary} compact />
            <div className="mini-stat">
              <span>Meilleur 1RM estimé</span>
              <strong>
                {numberLabel(force.best)} {force.best ? "kg" : ""}
              </strong>
            </div>
          </Panel>
          <button
            className="text-link"
            onClick={() => {
              speak(
                "Encore deux répétitions, si votre technique et votre confort le permettent.",
                p.preferences.voice,
              );
            }}
          >
            {" "}
            <Icon name="Volume2" size={14} /> Encouragement vocal
          </button>
        </aside>
      </div>
    </>
  );
}
function Elapsed({ start }) {
  const now = useNow(1000);
  return <>{durationLabel((now - start) / 1000)}</>;
}
function Library() {
  const { p, updateProfile, openExercise } = useApp();
  const [query, setQuery] = useState(""),
    [group, setGroup] = useState("all"),
    [equipment, setEquipment] = useState("all"),
    [favorites, setFavorites] = useState(false),
    [limit, setLimit] = useState(24);
  const list = searchExercises(query, group, equipment).filter(
    (e) => !favorites || p.preferences.favorites.includes(e.id),
  );
  return (
    <>
      <div className="library-tools">
        <div className="search-input">
          <Icon name="Search" size={18} />
          <input
            value={query}
            aria-label="Rechercher un exercice"
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(24);
            }}
            placeholder="Ex. haut des pectoraux, dos maison, sans machine…"
          />
          <kbd>⌕</kbd>
        </div>
        <Select
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          aria-label="Filtrer par matériel"
        >
          <option value="all">Tout le matériel</option>
          {Object.entries(EQUIPMENT)
            .filter(
              ([k]) => !["pool", "bike", "rower", "elliptical"].includes(k),
            )
            .map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
        </Select>
        <Button
          icon="Heart"
          variant={favorites ? "primary" : "secondary"}
          onClick={() => setFavorites((v) => !v)}
        >
          Favoris
        </Button>
      </div>
      <div className="filter-chips">
        {Object.entries(GROUPS).map(([k, v]) => (
          <button
            key={k}
            className={group === k ? "active" : ""}
            onClick={() => {
              setGroup(k);
              setLimit(24);
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="list-summary">
        <span>
          {list.length} exercices · guides issus de vos deux programmes et
          compléments JARVIS
        </span>
        <span>Technique avant intensité</span>
      </div>
      {!list.length ? (
        <Empty
          icon="SearchX"
          title="Aucun exercice avec ces critères"
          text="Essayez un muscle ou un équipement plus général."
        />
      ) : (
        <div className="exercise-library">
          {list.slice(0, limit).map((ex) => (
            <Panel className="exercise-card" key={ex.id}>
              <button
                className="exercise-card-visual"
                onClick={() => openExercise(ex.id)}
                aria-label={`Démonstration ${ex.name}`}
              >
                {ex.gif ? (
                  <img
                    loading="lazy"
                    src={assetSrc(
                      ex.gif
                        .replace("/media/", "/thumbs/")
                        .replace(/\.gif$/, ".webp"),
                    )}
                    alt=""
                  />
                ) : (
                  <img
                    className="library-anatomy-preview"
                    loading="lazy"
                    src={assetSrc(
                      `/human/${["dos", "fes", "isc", "moy", "tri", "lom", "epP"].includes(ex.muscle) ? "back" : "front"}-card.webp`,
                    )}
                    alt="Anatomie humaine réaliste"
                  />
                )}
                <span className="play-circle">
                  <Icon name="Play" size={16} />
                </span>
                <span className="visual-label">
                  {ex.gif ? "GUIDE HUMAIN" : "ANATOMIE RÉALISTE"}
                </span>
              </button>
              <button
                className={`favorite-button ${p.preferences.favorites.includes(ex.id) ? "active" : ""}`}
                aria-label={`Favori : ${ex.name}`}
                onClick={() =>
                  updateProfile((q) => {
                    q.preferences.favorites = q.preferences.favorites.includes(
                      ex.id,
                    )
                      ? q.preferences.favorites.filter((v) => v !== ex.id)
                      : [...q.preferences.favorites, ex.id];
                  })
                }
              >
                <Icon name="Heart" size={17} />
              </button>
              <button
                className="exercise-card-content"
                onClick={() => openExercise(ex.id)}
              >
                <span>{MUSCLES[ex.muscle]}</span>
                <h3>{ex.name}</h3>
                <div>
                  <small>
                    {ex.equipment.map((e) => EQUIPMENT[e]).join(" · ")}
                  </small>
                  <Badge>{ex.level}</Badge>
                </div>
              </button>
            </Panel>
          ))}
        </div>
      )}
      {list.length > limit && (
        <div className="load-more">
          <Button variant="secondary" onClick={() => setLimit((l) => l + 24)}>
            Afficher 24 exercices supplémentaires
          </Button>
        </div>
      )}
    </>
  );
}
function History() {
  const { p, setModal, openExercise } = useApp();
  const [filter, setFilter] = useState("all");
  const sessions = [...p.sessions]
    .filter((s) => filter === "all" || s.status === filter)
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <SectionHeading
        title="Votre mémoire d’entraînement"
        subtitle="Les séries réelles, les séances partielles et les notes sont conservées."
      >
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="completed">Terminées</option>
          <option value="partial">Partielles</option>
          <option value="missed">Manquées</option>
        </Select>
      </SectionHeading>
      {!sessions.length ? (
        <Panel>
          <Empty
            icon="History"
            title="Votre prochaine séance ouvre l’histoire."
            text="Aucune performance fictive : votre historique se construira au fil des séances enregistrées."
          >
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => setModal({ type: "log" })}
            >
              Ajouter une performance
            </Button>
          </Empty>
        </Panel>
      ) : (
        <div className="history-list">
          {sessions.map((s) => (
            <Panel key={s.id}>
              <div className="history-heading">
                <div className="activity-square">
                  <Icon name="Dumbbell" />
                </div>
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    {dateLabel(s.date, {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    ·{" "}
                    {s.durationSec
                      ? Math.round(s.durationSec / 60) + " min"
                      : "durée non renseignée"}
                  </p>
                </div>
                <Badge
                  color={
                    s.status === "completed"
                      ? "mint"
                      : s.status === "partial"
                        ? "amber"
                        : "red"
                  }
                >
                  {
                    {
                      completed: "Terminée",
                      partial: "Partielle",
                      missed: "Manquée",
                    }[s.status]
                  }
                </Badge>
              </div>
              <details>
                <summary>
                  Consulter les séries <Icon name="ChevronDown" size={14} />
                </summary>
                <div className="history-exercises">
                  {s.exercises.map((e, i) => (
                    <div key={i}>
                      <button
                        className="text-link"
                        onClick={() => openExercise(e.exerciseId)}
                      >
                        {exerciseById(e.exerciseId).name}
                      </button>
                      {e.sets.map((set, j) => (
                        <span className="history-set-line" key={set.id}>
                          {set.legacyAggregate
                            ? `${set.count} séries agrégées · `
                            : `S${j + 1} · `}
                          {set.weight != null ? set.weight + " kg × " : ""}
                          {set.reps} {set.unit === "secondes" ? "s" : "reps"} ·
                          RPE {set.rpe ?? "—"} · {set.unit}
                          {set.note ? " · " + set.note : ""}
                          <IconButton
                            icon="Pencil"
                            label={`Corriger la série ${j + 1} de ${exerciseById(e.exerciseId).name}`}
                            onClick={() =>
                              setModal({
                                type: "edit-set",
                                sessionId: s.id,
                                exerciseIndex: i,
                                setId: set.id,
                              })
                            }
                          />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                {s.note && <p className="small-subtitle">Note : {s.note}</p>}
                <Button
                  variant="danger small"
                  icon="Trash2"
                  onClick={() => setModal({ type: "delete-session", id: s.id })}
                >
                  Supprimer cette séance
                </Button>
              </details>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
