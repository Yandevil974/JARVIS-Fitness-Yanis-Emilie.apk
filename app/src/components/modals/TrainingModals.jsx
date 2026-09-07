import { sourceTrainingDays } from "../../engine/source-schedule.js";
import {
  actualSet,
  actualDate,
  numeric,
  validDate,
} from "../../engine/validation.js";
import {
  archivePlan,
  findPlanned,
  completePlanned,
} from "../../engine/plan-memory.js";
import React, { useState, useRef } from "react";
import { useApp } from "../../store/AppContext.jsx";
import {
  Modal,
  Field,
  Input,
  Select,
  Button,
  Icon,
  Badge,
  SectionHeading,
} from "../ui.jsx";
import { EXERCISES, exerciseById, GOALS } from "../../data/library.js";
import {
  today,
  uid,
  num,
  numberLabel,
  dateLabel,
  addDays,
} from "../../engine/utils.js";
import { estimate1RM, allSets } from "../../engine/fitness.js";
import {
  generatePlan,
  suggestSession,
  SMART_TEMPLATES,
  DAYS,
  moveSession,
  rescheduleMissed,
  estimateMinutes,
} from "../../engine/planner.js";
export function LogModal({ data = {}, messageId }) {
  const { p, closeModal, updateProfile, notify, logSet } = useApp();
  const [exerciseId, setExerciseId] = useState(data.exerciseId || ""),
    [date, setDate] = useState(today()),
    [weight, setWeight] = useState(data.weight ?? ""),
    [reps, setReps] = useState(data.reps ?? ""),
    [rpe, setRpe] = useState(data.rpe ?? ""),
    [rir, setRir] = useState(""),
    [unit, setUnit] = useState(
      data.exerciseId ? exerciseById(data.exerciseId).unit : "kg total",
    ),
    [note, setNote] = useState("");
  const locked = useRef(false);
  const ex = exerciseId ? exerciseById(exerciseId) : null;
  const estimate =
    ex && !ex.bodyweight && !ex.timed ? estimate1RM(weight, reps) : null;
  const submit = (e) => {
    e.preventDefault();
    if (locked.current) return;
    if (!ex || date > today() || !validDate(date)) {
      notify("Choisissez un exercice et une date réelle.", "error");
      return;
    }
    const kg = num(weight),
      r = num(reps),
      effort = num(rpe),
      reserve = num(rir);
    if (
      r == null ||
      r < 1 ||
      r > (ex.timed ? 3600 : 100) ||
      !Number.isInteger(r) ||
      (!ex.bodyweight && !ex.timed && (kg == null || kg < 0 || kg > 1000))
    ) {
      notify(
        "Vérifiez la charge et les répétitions réellement réalisées.",
        "error",
      );
      return;
    }
    if (
      (effort != null && (effort < 1 || effort > 10)) ||
      (reserve != null && (reserve < 0 || reserve > 10))
    ) {
      notify("RPE entre 1 et 10, RIR entre 0 et 10.", "error");
      return;
    }
    try {
      actualSet({ weight: kg, reps: r, rpe: effort, rir: reserve, unit }, ex);
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    if (
      p.workout?.safetyStop ||
      (p.checkIns[today()]?.painReported && date === today())
    ) {
      notify(
        "Séance suspendue après un signalement de douleur. Pas de nouvelle série aujourd’hui.",
        "error",
      );
      return;
    }
    if (p.workout && date === today()) {
      const i = p.workout.exercises.findIndex(
        (e) => e.exerciseId === ex.id && e.sets.length < e.targetSets,
      );
      if (i >= 0) {
        if (
          logSet({
            exerciseIndex: i,
            weight: kg,
            reps: r,
            rpe: effort,
            rir: reserve,
            unit,
            note,
          })
        ) {
          locked.current = true;
          if (messageId)
            updateProfile((q) => {
              const m = q.messages.find((m) => m.id === messageId);
              if (m) m.applied = true;
            });
          closeModal();
        }
        return;
      }
    }
    locked.current = true;
    const prior = allSets(p, { exerciseId: ex.id, unit });
    const priorBest = Math.max(
      0,
      ...prior.map((s) => estimate1RM(s.weight, s.reps) || 0),
    );
    const record = estimate && priorBest > 0 && estimate > priorBest;
    const set = {
      id: uid(),
      weight: ex.timed ? null : kg,
      reps: r,
      rpe: effort,
      rir: reserve,
      unit,
      note,
      completed: true,
      createdAt: Date.now(),
    };
    updateProfile((q) => {
      q.sessions.push({
        id: uid(),
        date,
        name: "Performance libre",
        type: "strength",
        status: "partial",
        durationSec: null,
        rpe: null,
        source: "manual-set",
        exercises: [
          {
            exerciseId: ex.id,
            unit,
            targetSets: 1,
            repsLow: r,
            repsHigh: r,
            rest: ex.rest,
            sets: [set],
          },
        ],
      });
      if (messageId) {
        const m = q.messages.find((m) => m.id === messageId);
        if (m) m.applied = true;
      }
      if (record)
        q.notifications.unshift({
          id: uid(),
          date: today(),
          type: "record",
          text: `Nouveau 1RM estimé : ${ex.name}, ${estimate} kg.`,
          read: false,
        });
    });
    notify(
      record
        ? `Nouveau record estimé : ${estimate} kg.`
        : "Performance enregistrée. La prochaine recommandation tiendra compte de cette série.",
      record ? "record" : "success",
    );
    closeModal();
  };
  return (
    <Modal
      title="Enregistrer une performance"
      subtitle="Une série réelle. Un exercice précis. Pas de performance supposée."
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <Field label="Exercice">
          <Select
            required
            value={exerciseId}
            onChange={(e) => {
              setExerciseId(e.target.value);
              setUnit(exerciseById(e.target.value).unit);
            }}
          >
            <option value="">Choisir l’exercice réalisé</option>
            {EXERCISES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="form-grid">
          <Field label="Date">
            <Input
              type="date"
              required
              max={today()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Convention de charge">
            <Select
              value={unit}
              disabled={ex?.timed}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kg total">Charge totale · kg</option>
              <option value="kg/main">Par haltère / main · kg</option>
              <option value="kg ajouté">Charge additionnelle · kg</option>
              <option value="secondes">Exercice au temps</option>
            </Select>
          </Field>
          <Field
            label={
              ex?.bodyweight
                ? "Charge additionnelle (facultative)"
                : "Charge réalisée (kg)"
            }
          >
            <Input
              type="number"
              min="0"
              max="1000"
              step=".1"
              value={weight}
              disabled={ex?.timed}
              required={!!ex && !ex.bodyweight && !ex.timed}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Donnée réelle"
            />
          </Field>
          <Field
            label={ex?.timed ? "Secondes réalisées" : "Répétitions réalisées"}
          >
            <Input
              type="number"
              required
              min="1"
              max={ex?.timed ? 3600 : 100}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </Field>
          <Field label="RPE (facultatif)">
            <Input
              type="number"
              min="1"
              max="10"
              step=".5"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
              placeholder="1–10"
            />
          </Field>
          <Field label="RIR (facultatif)">
            <Input
              type="number"
              min="0"
              max="10"
              step="1"
              value={rir}
              onChange={(e) => setRir(e.target.value)}
              placeholder="Répétitions en réserve"
            />
          </Field>
        </div>
        <Field label="Note">
          <Input
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Technique, amplitude, ressenti…"
          />
        </Field>
        <div className="calculation-preview">
          <Icon name="Calculator" />
          <span>
            1RM estimé
            <strong>
              {estimate != null
                ? `${numberLabel(estimate)} kg`
                : "Donnée insuffisante / non applicable"}
            </strong>
          </span>
          {Number(reps) > 10 && (
            <small>Fiabilité réduite au-delà de 10 reps.</small>
          )}
        </div>
        <p className="small-subtitle">
          Cette saisie n’invente ni durée ni séance complète. Elle apparaît
          comme performance libre dans votre historique.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" type="button" onClick={closeModal}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" icon="Check">
            Enregistrer la série
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function ForceModal({ testId }) {
  const { p, closeModal, updateProfile, notify } = useApp();
  const existing = p.forceTests.find((t) => t.id === testId);
  const [exerciseId, setExerciseId] = useState(existing?.exerciseId || ""),
    [date, setDate] = useState(existing ? existing.date : today()),
    [weight, setWeight] = useState(existing?.weight ?? ""),
    [reps, setReps] = useState(existing?.reps ?? ""),
    [direct, setDirect] = useState(existing?.estimate ?? ""),
    [mode, setMode] = useState(existing ? "direct" : "estimate"),
    [unit, setUnit] = useState(existing?.unit || "kg total");
  const ex = exerciseId ? exerciseById(exerciseId) : null;
  const value = mode === "estimate" ? estimate1RM(weight, reps) : num(direct);
  function submit(e) {
    e.preventDefault();
    if (
      !ex ||
      value == null ||
      value <= 0 ||
      value > 2000 ||
      !validDate(date) ||
      date > today()
    ) {
      notify("Vérifiez l’exercice, la date et les valeurs.", "error");
      return;
    }
    updateProfile((q) => {
      const test = {
        id: existing?.id || uid(),
        exerciseId,
        date,
        unit,
        weight: mode === "estimate" ? num(weight) : null,
        reps: mode === "estimate" ? num(reps) : null,
        estimate: value,
        declared: mode === "direct",
      };
      if (existing)
        q.forceTests = q.forceTests.map((t) =>
          t.id === existing.id ? test : t,
        );
      else q.forceTests.push(test);
    });
    notify("Référence 1RM enregistrée pour cet exercice et cette unité.");
    closeModal();
  }
  return (
    <Modal
      title="Votre référence de force"
      subtitle="Estimez à partir d’une série déjà réalisée, sans test maximal imposé."
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <Field label="Exercice précis">
          <Select
            value={exerciseId}
            required
            onChange={(e) => {
              setExerciseId(e.target.value);
              setUnit(exerciseById(e.target.value).unit);
            }}
          >
            <option value="">Choisir un exercice</option>
            {existing &&
              !EXERCISES.some((e) => e.id === existing.exerciseId) && (
                <option value={existing.exerciseId}>
                  {existing.originalLabel || existing.exerciseId} · source à
                  préciser
                </option>
              )}
            {EXERCISES.filter((e) => !e.bodyweight && !e.timed).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Convention de charge de cette référence">
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg total">kg total</option>
            <option value="kg/main">kg par haltère / main</option>
            <option value="source à vérifier">
              Source à vérifier · pas de charge recommandée
            </option>
          </Select>
        </Field>
        <div className="segmented">
          <button
            type="button"
            className={mode === "estimate" ? "active" : ""}
            onClick={() => setMode("estimate")}
          >
            Estimation Epley
          </button>
          <button
            type="button"
            className={mode === "direct" ? "active" : ""}
            onClick={() => setMode("direct")}
          >
            1RM déjà connu
          </button>
        </div>
        <div className="form-grid">
          {mode === "estimate" ? (
            <>
              <Field label={`Charge (${unit || "kg"})`}>
                <Input
                  type="number"
                  min=".1"
                  max="1000"
                  step=".1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </Field>
              <Field label="Répétitions (1–30)">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </Field>
            </>
          ) : (
            <Field label={`1RM déclaré (${unit || "kg"})`}>
              <Input
                type="number"
                min="1"
                max="2000"
                step=".1"
                required
                value={direct}
                onChange={(e) => setDirect(e.target.value)}
              />
            </Field>
          )}
          <Field label="Date de référence">
            <Input
              type="date"
              max={today()}
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
        <div className="force-result">
          <span>
            {mode === "estimate" ? "ESTIMATION 1RM" : "RÉFÉRENCE DÉCLARÉE"}
          </span>
          <strong>
            {numberLabel(value)}
            <small>{value ? "kg" : ""}</small>
          </strong>
          <p>
            {unit || "Exercice à préciser"} · réévaluation indicative le{" "}
            {dateLabel(addDays(date || today(), 56))}
          </p>
        </div>
        <div className="info-line">
          <Icon name="ShieldPlus" />
          <span>
            Estimation moins fiable au-delà de 10 répétitions. Ce chiffre n’est
            pas une invitation à soulever votre maximum. La technique, votre
            état du jour et un encadrement approprié priment.
          </span>
        </div>
        <div className="modal-actions">
          {existing && (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                updateProfile((q) => {
                  q.forceTests = q.forceTests.filter(
                    (t) => t.id !== existing.id,
                  );
                });
                notify("Référence supprimée, statistiques recalculées.");
                closeModal();
              }}
            >
              Supprimer la référence
            </Button>
          )}
          <Button type="submit" variant="primary" icon="Check">
            Enregistrer la référence
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function FinishModal() {
  const { p, finishWorkout, closeModal } = useApp();
  const [rpe, setRpe] = useState(""),
    [note, setNote] = useState("");
  const count =
    p.workout?.exercises.reduce((n, e) => n + e.sets.length, 0) || 0;
  return (
    <Modal
      title="Clôturer votre séance"
      subtitle={`${count} séries réalisées et déjà sauvegardées.`}
      onClose={closeModal}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          finishWorkout(rpe, note);
        }}
      >
        <Field label="RPE global de séance (facultatif)">
          <Select value={rpe} onChange={(e) => setRpe(e.target.value)}>
            <option value="">Non renseigné</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="Votre note de séance">
          <textarea
            className="input"
            rows="3"
            value={note}
            maxLength={800}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Comment s’est passée cette séance ?"
          />
        </Field>
        <p className="small-subtitle">
          La séance sera marquée complète seulement si toutes les séries prévues
          sont réalisées. Sinon, elle reste partielle : aucune donnée n’est
          perdue.
        </p>
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Continuer
          </Button>
          {count > 0 ? (
            <Button type="submit" variant="primary" icon="Check">
              Sauvegarder la séance
            </Button>
          ) : (
            <Button
              type="button"
              variant="danger"
              onClick={() => finishWorkout(null, "", true)}
            >
              Quitter sans résultat
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
export function EditSetModal({ exerciseIndex, setId, sessionId }) {
  const { p, updateProfile, notify, closeModal } = useApp();
  const session = sessionId
    ? p.sessions.find((s) => s.id === sessionId)
    : p.workout;
  const set = session?.exercises[exerciseIndex]?.sets.find(
    (s) => s.id === setId,
  );
  const [form, setForm] = useState(set || {});
  if (!set) return null;
  return (
    <Modal
      title="Corriger cette série"
      subtitle="Les statistiques seront recalculées à partir des valeurs corrigées."
      onClose={closeModal}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let checked;
          try {
            if (set.legacyAggregate) {
              checked = {
                ...form,
                weight: numeric(form.weight, 0, 1000, "Charge"),
                reps: numeric(
                  form.reps,
                  1,
                  set.unit === "secondes" ? 3600 : 100,
                  "Répétitions",
                  { integer: true },
                ),
                needsReps: num(form.reps) == null,
                rpe: numeric(form.rpe, 1, 10, "RPE"),
                rir: numeric(form.rir, 0, 10, "RIR"),
                count: numeric(form.count, 1, 100, "Séries", {
                  optional: false,
                  integer: true,
                }),
                unit: set.unit,
              };
            } else {
              checked = actualSet(
                { ...form, unit: set.unit },
                exerciseById(session.exercises[exerciseIndex].exerciseId),
              );
              checked.needsReps = false;
              if (set.legacyAggregate)
                checked.count = numeric(form.count, 1, 100, "Séries", {
                  optional: false,
                  integer: true,
                });
            }
          } catch (error) {
            notify(error.message, "error");
            return;
          }
          updateProfile((q) => {
            const active = sessionId
              ? q.sessions.find((s) => s.id === sessionId)
              : q.workout;
            const s = active.exercises[exerciseIndex].sets.find(
              (s) => s.id === setId,
            );
            Object.assign(s, checked);
          });
          notify("Série corrigée.");
          closeModal();
        }}
      >
        <div className="form-grid">
          {[
            ["weight", "Charge", 0, 1000, 0.1],
            ["reps", "Reps / secondes", 1, 3600, 1],
            ["rpe", "RPE", 1, 10, 0.5],
            ["rir", "RIR", 0, 10, 1],
            ...(set.legacyAggregate
              ? [["count", "Nombre de séries du journal", 1, 100, 1]]
              : []),
          ].map(([k, n, min, max, step]) => (
            <Field label={n} key={k}>
              <Input
                type="number"
                min={min}
                max={max}
                step={step}
                required={k === "reps" && !set.legacyAggregate}
                value={form[k] ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [k]: e.target.value }))
                }
              />
            </Field>
          ))}
        </div>
        <Field label="Note">
          <Input
            value={form.note || ""}
            maxLength={300}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </Field>
        <div className="modal-actions">
          <Button variant="primary" type="submit">
            Enregistrer la correction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function GeneratePlanModal() {
  const { p, updateProfile, closeModal, notify } = useApp();
  const [weeks, setWeeks] = useState(52),
    [frequency, setFrequency] = useState(p.user.frequency),
    [date, setDate] = useState(today()),
    [source, setSource] = useState("legacy"),
    [goal, setGoal] = useState(p.user.goal);
  const defaults = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 3, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
  };
  const [days, setDays] = useState(sourceTrainingDays(p.id, p.user.frequency));
  const submit = (e) => {
    e.preventDefault();
    if (days.length !== Number(frequency)) {
      notify(`Sélectionnez exactement ${frequency} jours.`, "error");
      return;
    }
    if (date < today()) {
      notify(
        "Le nouveau programme doit commencer à partir d’aujourd’hui.",
        "error",
      );
      return;
    }
    updateProfile((q) => {
      archivePlan(q);
      q.user.frequency = Number(frequency);
      q.user.goal = goal;
      q.user.startDate = date;
      q.plan = generatePlan(q, {
        weeks: Number(weeks),
        frequency: Number(frequency),
        startDate: date,
        days,
        goal,
        source,
      });
      q.adaptations.unshift({
        id: uid(),
        date: today(),
        label: "Nouveau cycle",
        detail: `${weeks} semaines, ${frequency} séances/semaine. ${source === "legacy" ? "Programme source." : "Progression adaptative."}`,
      });
    });
    notify(
      "Votre programme est créé. Historique conservé, charges à calibrer sur vos performances.",
    );
    closeModal();
  };
  return (
    <Modal
      title="Planifier mon programme"
      subtitle="Choisissez les jours et la date de départ. La base de votre HTML reste disponible et intacte."
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <Field label="Programme à mettre au calendrier">
          <Select
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              if (e.target.value === "legacy") {
                setWeeks(52);
                setDays(sourceTrainingDays(p.id, frequency));
              }
            }}
          >
            <option value="legacy">
              Mon programme HTML · exercices et prescriptions d’origine
            </option>
            <option value="smart">
              Autre programme JARVIS · uniquement si je le choisis
            </option>
          </Select>
        </Field>
        <div className="form-grid">
          <Field label="Durée du cycle (semaines)">
            <Input
              type="number"
              min="1"
              max="52"
              required
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
            />
          </Field>
          <Field
            label={
              source === "legacy"
                ? "Disponibilité musculation / semaine"
                : "Séances par semaine"
            }
          >
            <Select
              value={frequency}
              onChange={(e) => {
                setFrequency(Number(e.target.value));
                setDays(
                  source === "legacy"
                    ? sourceTrainingDays(p.id, Number(e.target.value))
                    : defaults[e.target.value],
                );
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} séances
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date de départ">
            <Input
              type="date"
              min={today()}
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Objectif">
            <Select value={goal} onChange={(e) => setGoal(e.target.value)}>
              {Object.entries(GOALS).map(([k, n]) => (
                <option value={k} key={k}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label={`${days.length} jours sélectionnés sur ${frequency}`}>
          <div className="day-picker">
            {DAYS.map((d, i) => (
              <button
                type="button"
                className={days.includes(i) ? "active" : ""}
                key={i}
                onClick={() =>
                  setDays((a) =>
                    a.includes(i) ? a.filter((v) => v !== i) : [...a, i],
                  )
                }
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
        <div className="info-line">
          <Icon name="CalendarRange" />
          <span>
            Si la première semaine est incomplète, le cycle commence la semaine
            suivante pour conserver votre fréquence. Chaque quatrième semaine
            est allégée en mode adaptatif.
          </span>
        </div>
        <p className="small-subtitle">
          Les séances futures sont remplacées ; votre ancien programme est
          archivé et les performances restent intactes. Aucune charge inconnue
          n’est inventée.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" type="button" onClick={closeModal}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" icon="Sparkles">
            Générer et activer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function PlannedModal({ sessionId }) {
  const {
    p,
    updateProfile,
    closeModal,
    notify,
    startWorkout,
    setModal,
    navigate,
  } = useApp();
  const s = findPlanned(p, sessionId);
  const archived = !p.plan?.sessions.some((s) => s.id === sessionId);
  const [date, setDate] = useState(s?.date || today()),
    [time, setTime] = useState(s?.time || "18:00"),
    [name, setName] = useState(s?.name || ""),
    [editing, setEditing] = useState(false);
  if (!s)
    return (
      <Modal title="Séance introuvable" onClose={closeModal}>
        <p>Le programme a évolué. Ouvrez le calendrier actualisé.</p>
      </Modal>
    );
  const save = (e) => {
    e.preventDefault();
    try {
      const plan =
        date !== s.date || time !== s.time
          ? moveSession(p, s.id, date, { time })
          : structuredClone(p.plan);
      const target = plan.sessions.find((v) => v.id === s.id);
      target.time = time;
      target.name = name;
      updateProfile((q) => {
        q.plan = plan;
      });
      notify("Horaire et séance mis à jour.");
      setEditing(false);
    } catch (e) {
      notify(e.message, "error");
    }
  };
  function missed() {
    try {
      const result = rescheduleMissed(p, s.id);
      updateProfile((q) => {
        q.plan = result.plan;
        q.adaptations.unshift({
          id: uid(),
          date: today(),
          label: "Report intelligent",
          detail: `${s.name} reportée au ${result.date}, séance manquée conservée.`,
        });
      });
      notify(`Séance marquée manquée et reportée au ${result.date}.`);
      closeModal();
    } catch (e) {
      notify(e.message, "error");
    }
  }
  return (
    <Modal
      title={s.name}
      subtitle={`${dateLabel(s.date, { weekday: "long", day: "numeric", month: "long" })} · ${s.time} · ${s.estimatedMinutes} min estimées`}
      onClose={closeModal}
      wide
    >
      <div className="planned-detail">
        <div>
          <Badge color={s.status === "completed" ? "mint" : "blue"}>
            {
              {
                planned: "Planifiée",
                completed: "Terminée",
                partial: "Partielle",
                missed: "Manquée",
                superseded: "Ancien programme",
              }[s.status]
            }
            {archived ? " · ARCHIVE" : ""}
          </Badge>
          {s.deload && <Badge color="amber">DELOAD</Badge>}
          <p className="small-subtitle">
            {s.phase || "Programme adaptatif · charges calculées au lancement"}
          </p>
          {/* Le parcours complet, dans l'ordre réel de la séance :
              échauffement, exercices, étirements. Cette fenêtre ne
              montrait que les exercices, si bien que le retour au calme
              restait invisible depuis l'accueil. */}
          {s.type === "strength" && (
            <div className="planned-protocol">
              <button
                type="button"
                onClick={() => setModal({ type: "warmup", session: s })}
              >
                <Icon name="Flame" size={16} />
                <span>
                  Échauffement<small>Avant de commencer</small>
                </span>
                <Icon name="ChevronRight" size={14} />
              </button>
            </div>
          )}
          {s.type === "strength" && (
            <div className="planned-exercises">
              {s.exercises.map((e, i) => (
                <div key={i}>
                  <button
                    onClick={() =>
                      setModal({ type: "exercise", exerciseId: e.exerciseId })
                    }
                  >
                    {exerciseById(e.exerciseId).name}
                  </button>
                  <label>
                    Séries
                    <input
                      aria-label={`Séries ${exerciseById(e.exerciseId).name}`}
                      type="number"
                      min="1"
                      max="10"
                      disabled={s.status !== "planned" || archived}
                      value={e.targetSets}
                      onChange={(event) => {
                        const n = Number(event.target.value);
                        if (n >= 1 && n <= 10)
                          updateProfile((q) => {
                            const ss = q.plan.sessions.find(
                              (x) => x.id === s.id,
                            );
                            ss.userAdapted = true;
                            ss.exercises[i].targetSets = n;
                            ss.estimatedMinutes = estimateMinutes(ss);
                          });
                      }}
                    />
                  </label>
                  <span>
                    {e.repScheme || `${e.repsLow}–${e.repsHigh}`}{" "}
                    {exerciseById(e.exerciseId).timed ? "s" : "reps"}
                  </span>
                  <span>{e.rest}s repos</span>
                </div>
              ))}
            </div>
          )}
          {s.type === "strength" && (
            <div className="planned-protocol">
              <button
                type="button"
                onClick={() => setModal({ type: "cooldown", session: s })}
              >
                <Icon name="Wind" size={16} />
                <span>
                  Étirements<small>Retour au calme, muscles travaillés</small>
                </span>
                <Icon name="ChevronRight" size={14} />
              </button>
            </div>
          )}
          {s.status === "planned" && !archived && (
            <div className="modal-actions">
              <Button
                variant="secondary"
                icon="Pencil"
                onClick={() => setEditing((v) => !v)}
              >
                Modifier
              </Button>
              <Button
                variant="primary"
                icon="Play"
                onClick={() =>
                  s.type === "strength"
                    ? startWorkout(s)
                    : setModal({
                        type: "log-activity",
                        data: { type: s.type, name: s.name, planId: s.id },
                      })
                }
              >
                {s.type === "strength"
                  ? "Commencer"
                  : "Renseigner la réalisation"}
              </Button>
            </div>
          )}
        </div>
        {editing && (
          <form className="planned-edit-form" onSubmit={save}>
            <Field label="Nom">
              <Input
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <div className="form-grid">
              <Field label="Date">
                <Input
                  type="date"
                  min={today()}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field label="Horaire">
                <Input
                  type="time"
                  value={time}
                  required
                  onChange={(e) => setTime(e.target.value)}
                />
              </Field>
            </div>
            <p className="small-subtitle">
              La séance et ses blocs cardio/piscine planifiés sont déplacés
              ensemble. Les exercices et les protocoles restent identiques. Un
              bloc déjà réalisé ne sera pas déplacé.
            </p>
            <Button type="submit" variant="primary" icon="Check">
              Enregistrer le changement
            </Button>
          </form>
        )}
        {s.status === "planned" && !archived && (
          <div className="planned-bottom">
            <Button variant="secondary" icon="CalendarClock" onClick={missed}>
              Manquée · reporter intelligemment
            </Button>
            <Button
              variant="danger"
              icon="Trash2"
              onClick={() => setModal({ type: "delete-planned", id: s.id })}
            >
              Retirer du programme
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
export function ScheduleModal({ date: initialDate, activityType }) {
  const { p, updateProfile, closeModal, notify } = useApp();
  const [date, setDate] = useState(initialDate || today()),
    [type, setType] = useState(activityType || "strength"),
    [time, setTime] = useState("18:00"),
    [name, setName] = useState(""),
    [template, setTemplate] = useState(0),
    [duration, setDuration] = useState(30);
  function submit(e) {
    e.preventDefault();
    if (date < today()) {
      notify(
        "Pour une activité passée, utilisez la saisie manuelle d’historique.",
        "error",
      );
      return;
    }
    if (
      p.plan.sessions.some(
        (s) => s.date === date && s.time === time && s.status === "planned",
      )
    ) {
      notify("Une activité est déjà prévue à cet horaire.", "error");
      return;
    }
    const s =
      type === "strength"
        ? suggestSession(p, Number(template), date)
        : {
            id: uid(),
            date,
            type,
            focus: [],
            exercises: [],
            status: "planned",
            estimatedMinutes: Number(duration),
            source: "manual",
          };
    s.name =
      name ||
      s.name ||
      {
        cardio: "Cardio",
        swim: "Piscine",
        hiit: "HIIT",
        recovery: "Récupération",
        rest: "Repos",
      }[type];
    s.time = time;
    updateProfile((q) => {
      q.plan.sessions.push(s);
      q.plan.sessions.sort((a, b) => a.date.localeCompare(b.date));
    });
    notify("Activité ajoutée au calendrier.");
    closeModal();
  }
  return (
    <Modal
      title="Ajouter à votre planning"
      subtitle="Planifier n’enregistre pas une activité comme réalisée."
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <div className="form-grid">
          <Field label="Date">
            <Input
              type="date"
              min={today()}
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Horaire">
            <Input
              type="time"
              value={time}
              required
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Discipline">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries({
              strength: "Musculation",
              cardio: "Cardio",
              swim: "Piscine",
              hiit: "HIIT",
              recovery: "Récupération",
              rest: "Repos",
            }).map(([k, n]) => (
              <option value={k} key={k}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        {type === "strength" ? (
          <Field label="Séance de départ">
            <Select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {SMART_TEMPLATES.map((t, i) => (
                <option key={i} value={i}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field label="Durée prévue (min)">
            <Input
              type="number"
              min="5"
              max="240"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Field>
        )}
        <Field label="Titre personnalisé (facultatif)">
          <Input
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Nage douce après le travail"
          />
        </Field>
        <div className="modal-actions">
          <Button type="submit" variant="primary" icon="CalendarPlus">
            Ajouter au calendrier
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function HistorySessionModal({ sessionId }) {
  const { p, closeModal, setModal } = useApp();
  const s = p.sessions.find((s) => s.id === sessionId);
  if (!s) return null;
  return (
    <Modal
      title={s.name}
      subtitle={`${dateLabel(s.date)} · ${s.status === "completed" ? "Terminée" : s.status === "partial" ? "Partielle" : "Manquée"}`}
      onClose={closeModal}
      wide
    >
      {s.sourceMismatch && (
        <p className="source-completion-note">
          Le journal contient « {s.name} », alors que le calendrier source
          indiquait « {s.sourcePlannedName} ». Vos lignes ont été importées sans
          les réattribuer à d’autres exercices.
        </p>
      )}
      <div className="history-exercises">
        {s.exercises.map((e, i) => (
          <div key={i}>
            <h3>{exerciseById(e.exerciseId).name}</h3>
            {e.sets.map((set, j) => (
              <span className="history-set-line" key={set.id}>
                {set.count || 1} série(s) ·{" "}
                {set.weight == null
                  ? "Sans charge renseignée"
                  : `${set.weight} kg`}{" "}
                × {set.reps ?? "répétitions non renseignées"}{" "}
                {set.unit === "secondes" ? "s" : "reps"} · {set.unit} · RPE{" "}
                {set.rpe ?? "non renseigné"}
                <Button
                  variant="secondary small"
                  icon="Pencil"
                  onClick={() =>
                    setModal({
                      type: "edit-set",
                      sessionId: s.id,
                      exerciseIndex: i,
                      setId: set.id,
                    })
                  }
                >
                  Corriger
                </Button>
              </span>
            ))}
          </div>
        ))}
      </div>
      {s.note && <p className="small-subtitle">{s.note}</p>}
      <div className="modal-actions">
        <Button
          variant="danger"
          icon="Trash2"
          onClick={() => setModal({ type: "delete-session", id: s.id })}
        >
          Supprimer cette séance
        </Button>
      </div>
    </Modal>
  );
}
