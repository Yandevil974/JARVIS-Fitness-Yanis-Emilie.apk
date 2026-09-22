import {
  actualActivity,
  actualMeasurement,
  actualDate,
  checkInEntry,
  numeric,
} from "../../engine/validation.js";
import { completePlanned } from "../../engine/plan-memory.js";
import { advanceTimer, pauseTimer } from "../../engine/timer.js";
import React, { useState, useRef } from "react";
import { useApp } from "../../store/AppContext.jsx";
import { Modal, Field, Input, Select, Button, Icon, Badge } from "../ui.jsx";
import { today, num, uid, numberLabel } from "../../engine/utils.js";
import { recoveryScore } from "../../engine/fitness.js";
import { adaptRecovery } from "../../engine/planner.js";
import { MEASURES, FOOD } from "../../data/library.js";
import { foodTotal } from "../../engine/nutrition.js";
export function CheckinModal({ date: initial }) {
  const { p, updateProfile, notify, closeModal } = useApp();
  const [date, setDate] = useState(initial || today()),
    [form, setForm] = useState(p.checkIns[initial || today()] || {}),
    [allowAdaptation, setAllowAdaptation] = useState(false);
  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const preview = recoveryScore(
    { ...p, checkIns: { ...p.checkIns, [date]: form } },
    date,
  );
  const submit = (e) => {
    e.preventDefault();
    if (
      !Object.values(form).some((v) => v !== "" && v != null && v !== false)
    ) {
      notify("Renseignez au moins un ressenti.", "error");
      return;
    }
    if (date > today()) {
      notify(
        "Un bilan doit correspondre à une date passée ou actuelle.",
        "error",
      );
      return;
    }
    let entry;
    try {
      actualDate(date);
      entry = checkInEntry(form);
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    let updated;
    updateProfile((q) => {
      q.checkIns[date] = entry;
      if (date === today() && entry.painReported) {
        if (q.workout) q.workout.safetyStop = true;
        if (q.timer && !q.timer.done) {
          const t = advanceTimer(q.timer);
          q.timer = { ...(t.paused ? t : pauseTimer(t)), safetyStopped: true };
        }
      }
      updated =
        date === today() && allowAdaptation && !entry.painReported
          ? adaptRecovery(q).profile
          : q;
      return updated;
    });
    notify(
      date === today() && entry.painReported
        ? "Bilan enregistré. Effort suspendu après votre signalement de douleur."
        : date === today() && preview.score != null && preview.score < 60
          ? allowAdaptation
            ? "Bilan enregistré. Adaptation appliquée avec votre accord."
            : "Bilan enregistré. Votre programme reste inchangé ; JARVIS peut vous proposer un allégement."
          : "Bilan de récupération enregistré.",
    );
    closeModal();
  };
  return (
    <Modal
      title="À l’écoute de votre corps"
      subtitle="Les réponses inconnues peuvent rester vides. Score indicatif, non médical."
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <div className="form-grid">
          <Field label="Date">
            <Input
              type="date"
              max={today()}
              required
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setForm(p.checkIns[e.target.value] || {});
              }}
            />
          </Field>
          <Field label="Sommeil (heures)">
            <Input
              type="number"
              min="0"
              max="14"
              step=".25"
              value={form.sleep ?? ""}
              onChange={(e) => change("sleep", e.target.value)}
              placeholder="Ex. 7,5"
            />
          </Field>
        </div>
        <div className="form-grid">
          {[
            ["quality", "Qualité du sommeil", "Très mauvaise", "Excellente"],
            ["energy", "Énergie", "Très basse", "Très élevée"],
            ["fatigue", "Fatigue", "Absente", "Très forte"],
            ["stress", "Stress", "Très bas", "Très élevé"],
            ["soreness", "Courbatures", "Absentes", "Très fortes"],
            ["motivation", "Motivation", "Très basse", "Très élevée"],
          ].map(([k, n, lo, hi]) => (
            <Field label={n} key={k}>
              <Select
                value={form[k] ?? ""}
                onChange={(e) => change(k, e.target.value)}
              >
                <option value="">Non renseigné</option>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option value={v} key={v}>
                    {v} / 5{v === 1 ? " · " + lo : v === 5 ? " · " + hi : ""}
                  </option>
                ))}
              </Select>
            </Field>
          ))}
        </div>
        <Field label="Note (facultative)">
          <Input
            maxLength={500}
            value={form.note || ""}
            onChange={(e) => change("note", e.target.value)}
            placeholder="Ressenti, journée chargée…"
          />
        </Field>
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={!!form.painReported}
            onChange={(e) => change("painReported", e.target.checked)}
          />
          Je signale une douleur importante à l’effort.
        </label>
        {form.painReported && (
          <div className="warning-box danger">
            <Icon name="ShieldPlus" />
            <p>
              Arrêtez l’exercice concerné. Une douleur importante ou persistante
              nécessite un avis professionnel. Malaise ou douleur thoracique :
              demandez une aide médicale urgente.
            </p>
          </div>
        )}
        <div className="calculation-preview">
          <Icon name="HeartPulse" />
          <span>
            Récupération estimée
            <strong>
              {preview.score == null
                ? "Donnée insuffisante"
                : preview.score + " / 100"}
            </strong>
          </span>
          <small>{preview.coverage} % des composantes renseignées</small>
        </div>
        <label className="checkin-adaptation-option">
          <input
            type="checkbox"
            checked={allowAdaptation}
            disabled={date !== today() || !!form.painReported}
            onChange={(e) => setAllowAdaptation(e.target.checked)}
          />
          <span>
            J’autorise un allégement de ma séance selon ce bilan{" "}
            <small>
              Optionnel. Sinon, mes exercices et mes séries restent inchangés.
            </small>
          </span>
        </label>
        <div className="modal-actions">
          <Button variant="primary" type="submit" icon="Check">
            {allowAdaptation && !form.painReported
              ? "Enregistrer et appliquer mon choix"
              : "Enregistrer mon bilan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function MeasurementModal({ measurementId }) {
  const { p, updateProfile, notify, closeModal } = useApp();
  const existing = p.measurements.find((m) => m.id === measurementId);
  const [date, setDate] = useState(existing?.date || today()),
    [weight, setWeight] = useState(existing?.weight ?? ""),
    [fat, setFat] = useState(existing?.bodyFat ?? ""),
    [values, setValues] = useState(existing?.values || {});
  function submit(e) {
    e.preventDefault();
    if (date > today()) {
      notify("Choisissez la date réelle du relevé.", "error");
      return;
    }
    const normalized = Object.fromEntries(
      Object.entries(values)
        .map(([k, v]) => [k, num(v)])
        .filter(([, v]) => v != null),
    );
    if (
      num(weight) == null &&
      num(fat) == null &&
      !Object.keys(normalized).length
    ) {
      notify("Ajoutez au moins une mesure.", "error");
      return;
    }
    let m;
    try {
      m = actualMeasurement({
        id: measurementId || uid(),
        date,
        weight,
        bodyFat: fat,
        values: normalized,
        source: "user",
      });
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    updateProfile((q) => {
      if (measurementId)
        q.measurements = q.measurements.map((x) =>
          x.id === measurementId ? m : x,
        );
      else q.measurements.push(m);
    });
    notify("Relevé enregistré. Les courbes sont actualisées.");
    closeModal();
  }
  return (
    <Modal
      title={existing ? "Modifier votre relevé" : "Un nouveau repère corporel"}
      subtitle="Mesures facultatives. Utilisez des conditions comparables d’un relevé à l’autre."
      onClose={closeModal}
      wide
    >
      <form onSubmit={submit}>
        <div className="form-grid three">
          <Field label="Date">
            <Input
              type="date"
              required
              max={today()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Poids (kg)">
            <Input
              type="number"
              min="25"
              max="350"
              step=".1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Non renseigné"
            />
          </Field>
          <Field label="Masse grasse mesurée (%)">
            <Input
              type="number"
              min="1"
              max="70"
              step=".1"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="Facultatif · appareil ou mesure"
            />
          </Field>
        </div>
        <h3 className="form-section-title">Mensurations · centimètres</h3>
        <div className="form-grid three">
          {MEASURES.map(([key, name]) => (
            <Field label={name} key={key}>
              <Input
                type="number"
                min="1"
                max="300"
                step=".1"
                value={values[key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [key]: e.target.value }))
                }
                placeholder="cm"
              />
            </Field>
          ))}
        </div>
        <div className="modal-actions">
          {existing && (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                updateProfile((q) => {
                  q.measurements = q.measurements.filter(
                    (m) => m.id !== measurementId,
                  );
                });
                notify("Relevé supprimé.");
                closeModal();
              }}
            >
              Supprimer ce relevé
            </Button>
          )}
          <Button type="submit" variant="primary" icon="Check">
            Enregistrer le relevé
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function ActivityModal({ data = {}, timerResult, activityId }) {
  const { p, updateProfile, notify, closeModal } = useApp();
  const existing = p.activities.find((a) => a.id === activityId);
  data = existing || data;
  const [type, setType] = useState(data.type || "cardio"),
    [name, setName] = useState(data.name || ""),
    [date, setDate] = useState(data.date || today()),
    [duration, setDuration] = useState(
      existing
        ? Math.round((existing.durationSec / 60) * 100) / 100
        : timerResult
          ? Math.round((timerResult.elapsed / 60) * 100) / 100
          : "",
    ),
    [distance, setDistance] = useState(existing?.distance ?? ""),
    [rpe, setRpe] = useState(existing?.rpe ?? ""),
    [calories, setCalories] = useState(existing?.calories ?? ""),
    [style, setStyle] = useState(existing?.style ?? ""),
    [rounds, setRounds] = useState(existing?.rounds ?? ""),
    [rest, setRest] = useState(existing?.rest ?? ""),
    [note, setNote] = useState(existing?.note ?? "");
  const submitted = useRef(false);
  const submit = (e) => {
    e.preventDefault();
    if (submitted.current) return;
    const minutes = num(duration);
    if (
      minutes == null ||
      minutes <= 0 ||
      minutes > 1440 ||
      !date ||
      date > today()
    ) {
      notify(
        "Renseignez une date réelle et une durée entre 0 et 1 440 minutes.",
        "error",
      );
      return;
    }
    if (num(distance) != null && num(distance) < 0) {
      notify("Distance invalide.", "error");
      return;
    }
    if (timerResult && p.activities.some((a) => a.timerId === timerResult.id)) {
      notify("Ce protocole a déjà été enregistré.", "info");
      closeModal();
      return;
    }
    const a = {
      ...existing,
      id: existing?.id || uid(),
      date,
      type,
      name:
        name ||
        {
          cardio: "Cardio",
          swim: "Natation",
          aqua: "Aqua HIIT",
          hiit: "HIIT",
          recovery: "Récupération",
          rest: "Repos",
        }[type],
      durationSec: Math.round(minutes * 60),
      distance: num(distance),
      rpe: num(rpe),
      calories: num(calories),
      style: ["swim", "aqua"].includes(type) ? style : null,
      rounds: num(rounds),
      rest: num(rest),
      note,
      mode: data.mode || null,
      source: existing?.source || (timerResult ? "timer-confirmed" : "manual"),
      plannedDistance: data.distancePlanned ?? null,
      plannedRounds: data.rounds ?? null,
      plannedStyle: data.style ?? null,
      timerId: timerResult?.id || existing?.timerId || null,
      measuredDurationSec: timerResult ? Math.round(timerResult.elapsed) : null,
      planId: data.planId || null,
      skippedSteps: timerResult?.skipped || 0,
    };
    try {
      Object.assign(a, actualActivity(a));
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    submitted.current = true;
    const previous = p.activities.filter(
      (v) => v.type === type && v.distance != null,
    );
    const record =
      !existing &&
      a.distance > 0 &&
      previous.length > 0 &&
      a.distance > Math.max(...previous.map((a) => a.distance));
    updateProfile((q) => {
      if (existing)
        q.activities = q.activities.map((v) => (v.id === existing.id ? a : v));
      else q.activities.push(a);
      if (timerResult && q.timer?.id === timerResult.id) q.timer = null;
      if (data.planId) completePlanned(q, data.planId, "completed", date);
      if (record)
        q.notifications.unshift({
          id: uid(),
          date: today(),
          type: "record",
          text: `Nouvelle distance maximale : ${a.distance} m (${a.name}).`,
          read: false,
        });
    });
    notify(
      record
        ? "Nouvelle distance record enregistrée."
        : "Activité confirmée et intégrée à votre charge globale.",
      record ? "record" : "success",
    );
    closeModal();
  };
  return (
    <Modal
      title={
        timerResult ? "Confirmer votre activité" : "Enregistrer une activité"
      }
      subtitle={
        timerResult
          ? "Le temps est chronométré. Confirmez les résultats réellement réalisés."
          : "Les données prévues ne remplacent pas les données réellement effectuées."
      }
      onClose={closeModal}
    >
      <form onSubmit={submit}>
        <div className="form-grid">
          <Field label="Discipline">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {Object.entries({
                cardio: "Cardio",
                swim: "Natation",
                hiit: "HIIT / Tabata",
                aqua: "Aqua HIIT / Tabata",
                recovery: "Récupération",
                rest: "Repos actif",
              }).map(([k, n]) => (
                <option key={k} value={k}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={date}
              max={today()}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Nom / discipline précise">
          <Input
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Course, Elliptique, 10 × 25 m…"
          />
        </Field>
        <div className="form-grid">
          <Field
            label={
              timerResult
                ? "Durée chronométrée à confirmer (min)"
                : "Durée réalisée (min)"
            }
          >
            <Input
              type="number"
              min=".01"
              max="1440"
              step=".01"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Field>
          <Field label="RPE de séance (facultatif)">
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
          <Field
            label="Distance réalisée (m)"
            hint={
              data.distancePlanned
                ? `${data.distancePlanned} m prévus, pas automatiquement comptabilisés.`
                : "Ne pas renseigner si la distance est inconnue."
            }
          >
            <Input
              type="number"
              min="0"
              max="1000000"
              step=".5"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </Field>
          <Field label="Calories mesurées (facultatif)">
            <Input
              type="number"
              min="0"
              max="10000"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Aucune estimation imposée"
            />
          </Field>
          {["swim", "aqua", "hiit"].includes(type) && (
            <>
              <Field
                label="Séries / rounds réalisés"
                hint={
                  data.rounds
                    ? `${data.rounds} prévus. Renseignez uniquement le nombre réellement effectué.`
                    : null
                }
              >
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value)}
                />
              </Field>
              <Field label="Récupération entre efforts (s)">
                <Input
                  type="number"
                  min="0"
                  max="3600"
                  value={rest}
                  onChange={(e) => setRest(e.target.value)}
                />
              </Field>
            </>
          )}
          {["swim", "aqua"].includes(type) && (
            <Field label="Style de nage / activité">
              <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="">Non renseigné</option>
                {[
                  "Crawl",
                  "Brasse",
                  "Dos",
                  "Papillon",
                  "Libre",
                  "Aquagym",
                  "Sans nage",
                ].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </Field>
          )}
        </div>
        <Field label="Note">
          <Input
            value={note}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Allure, technique, ressenti…"
          />
        </Field>
        {timerResult?.skipped > 0 && (
          <div className="warning-box">
            <Icon name="Info" />
            <p>
              {timerResult.skipped} étape(s) passée(s). Seul le temps
              effectivement écoulé est proposé.
            </p>
          </div>
        )}
        <div className="modal-actions">
          <Button variant="primary" type="submit" icon="Check">
            Confirmer et enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function FoodModal({ date: initialDate }) {
  const { p, updateProfile, notify, closeModal } = useApp();
  const [date, setDate] = useState(initialDate || today()),
    [food, setFood] = useState(""),
    [grams, setGrams] = useState(""),
    [meal, setMeal] = useState("Déjeuner");
  const total = foodTotal(food ? [{ food, grams: Number(grams) || 0 }] : []);
  return (
    <Modal
      title="Ajouter au journal alimentaire"
      subtitle="Notez les quantités réellement consommées. Valeurs nutritionnelles estimées."
      onClose={closeModal}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            !FOOD[food] ||
            num(grams) == null ||
            Number(grams) <= 0 ||
            Number(grams) > 3000 ||
            !Number.isInteger(Number(grams)) ||
            !date ||
            date > today()
          ) {
            notify("Vérifiez l’aliment, la quantité et la date.", "error");
            return;
          }
          updateProfile((q) => {
            q.nutrition.logs.push({
              id: uid(),
              date,
              food,
              grams: Number(grams),
              meal,
              source: "manual",
            });
          });
          notify("Aliment ajouté au journal.");
          closeModal();
        }}
      >
        <div className="form-grid">
          <Field label="Date">
            <Input
              type="date"
              max={today()}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Repas">
            <Select value={meal} onChange={(e) => setMeal(e.target.value)}>
              {[
                "Petit-déjeuner",
                "Collation",
                "Déjeuner",
                "Pré-entraînement",
                "Dîner",
                "Autre",
              ].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Aliment">
          <Select
            value={food}
            required
            onChange={(e) => setFood(e.target.value)}
          >
            <option value="">Choisir dans la base source</option>
            {Object.keys(FOOD).map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Select>
        </Field>
        <Field label="Quantité (grammes)">
          <Input
            type="number"
            min="1"
            max="3000"
            step="1"
            required
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </Field>
        <div className="calculation-preview">
          <Icon name="Utensils" />
          <span>
            Estimation<strong>{numberLabel(total.cal, 0)} kcal</strong>
          </span>
          <small>
            P {numberLabel(total.p)} · G {numberLabel(total.g)} · L{" "}
            {numberLabel(total.f)} g
          </small>
        </div>
        <div className="modal-actions">
          <Button variant="primary" type="submit" icon="Check">
            Ajouter au journal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
