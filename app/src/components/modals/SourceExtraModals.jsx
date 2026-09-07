import React, { useState, useRef } from "react";
import { useApp } from "../../store/AppContext.jsx";
import {
  Modal,
  Button,
  Icon,
  Badge,
  Field,
  Input,
  SectionHeading,
} from "../ui.jsx";
import {
  today,
  dateLabel,
  uid,
  num,
  norm,
  assetSrc,
} from "../../engine/utils.js";
import { POOL_GUIDES } from "../../data/library.js";
import {
  sourceDay,
  sourceExtra,
  sourceExtraSteps,
  sourcePool,
} from "../../engine/source-schedule.js";
import {
  eventsForDay,
  modalForEvent,
  eventTags,
} from "../../engine/schedule-events.js";
import { actualActivity } from "../../engine/validation.js";
import { completePlanned } from "../../engine/plan-memory.js";
export function DayScheduleModal({ date }) {
  const { p, closeModal, setModal } = useApp(),
    events = eventsForDay(p, date),
    day = sourceDay(p, date);
  return (
    <Modal
      title={dateLabel(date, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}
      subtitle="Tout le contenu prévu, et les résultats réellement enregistrés."
      onClose={closeModal}
    >
      {day.deload && (
        <div className="week-deload-note">
          <Icon name="Info" size={18} />
          <p>
            Semaine allégée du programme HTML.{" "}
            {p.id === "elite"
              ? "Les journées METCON sont remplacées par du repos."
              : "La récupération reste prioritaire."}
          </p>
        </div>
      )}
      <div className="day-event-list">
        {events.map((s) => (
          <button
            className={`day-event-card discipline-${s.type}`}
            key={s.id}
            onClick={() => setModal(modalForEvent(s))}
          >
            <span className="event-chips">
              {eventTags(s).map((t) => (
                <Badge
                  key={t.type}
                  color={
                    t.type === "metcon"
                      ? "amber"
                      : t.type === "swim"
                        ? "blue"
                        : "mint"
                  }
                >
                  {t.label}
                </Badge>
              ))}
            </span>
            <strong>{s.name}</strong>
            <small>
              {s.time || ""} ·{" "}
              {s.status === "completed"
                ? s.completionReportedOnly
                  ? "Journée déclarée réalisée · durée non renseignée"
                  : "Réalisée"
                : s.status === "missed"
                  ? "Déclarée non effectuée"
                  : s.status === "partial"
                    ? "Partielle"
                    : "Prévue"}
              {s.estimatedMinutes
                ? " · " + s.estimatedMinutes + " min prévues"
                : ""}
            </small>
            <Icon name="ArrowUpRight" size={16} />
          </button>
        ))}
      </div>
      {!events.length && (
        <div className="rest-day-detail">
          <Icon name="Moon" size={32} />
          <h3>{day.name}</h3>
          <p>
            Pas de performance ajoutée pour ce jour. La récupération fait partie
            du programme.
          </p>
          <Button
            variant="secondary"
            onClick={() =>
              setModal({
                type: "source-extra",
                event: {
                  ...day,
                  source: "legacy",
                  components: [],
                  exercises: [],
                  sourceKind: "rest",
                  status: "planned",
                },
              })
            }
          >
            Voir l’option de récupération du HTML
          </Button>
        </div>
      )}
      <Button
        variant="secondary"
        icon="Plus"
        onClick={() => setModal({ type: "schedule", date })}
      >
        Ajouter ou planifier une activité
      </Button>
    </Modal>
  );
}
export function SourceExtraModal({ event }) {
  const { p, closeModal, setModal, setTimer } = useApp();
  const resolved =
    event.sourceKind === "post-cardio" || event.contentLocked
      ? event
      : { ...event, ...sourceExtra(p, sourceDay(p, event.date || today())) };
  const steps = sourceExtraSteps(p, resolved);
  const total = steps.reduce((n, s) => n + s.seconds, 0);
  function run() {
    const date = today(),
      planId =
        event.status === "planned" && event.date >= date ? event.id : null;
    setTimer(steps, {
      type: "source-combo",
      name: resolved.name,
      date,
      planId,
      eventDate: event.date,
      components: resolved.components,
      transitionSeconds: resolved.transitionSeconds || 0,
      sourcePrescription: resolved.sourcePrescription,
    });
  }
  return (
    <Modal
      title={resolved.name}
      subtitle={`${dateLabel(event.date || today())} · séance complémentaire du HTML`}
      onClose={closeModal}
      wide
    >
      {event.scheduleModified && (
        <p className="source-completion-note">
          Séance déplacée depuis le {dateLabel(event.originalDate)}. Le contenu
          planifié a été conservé ; ce changement de date ne remplace pas le
          METCON par un autre protocole.
        </p>
      )}
      {event.status === "planned" &&
        p.plan?.sessions.some((s) => s.id === event.id) && (
          <div className="source-schedule-actions">
            <Button
              variant="secondary small"
              icon="CalendarClock"
              onClick={() =>
                setModal({ type: "move-scheduled", sessionId: event.id })
              }
            >
              Déplacer la séance et ses blocs
            </Button>
            <Button
              variant="secondary small"
              icon="Trash2"
              onClick={() => setModal({ type: "delete-planned", id: event.id })}
            >
              {event.parentId
                ? "Retirer uniquement ce bloc"
                : "Retirer du calendrier"}
            </Button>
          </div>
        )}
      {event.completionReportedOnly && (
        <div className="source-completion-note">
          {event.status === "missed"
            ? "Cette journée a été marquée non effectuée dans votre sauvegarde. Aucune activité réalisée n’a été créée."
            : "Cette journée a été déclarée dans votre sauvegarde sans durée ni distance détaillée. Ces valeurs n’ont pas été inventées."}
        </div>
      )}
      {resolved.sourcePrescription && (
        <div className="source-prescription">
          <Badge color="amber">PRESCRIPTION DU MOIS</Badge>
          <p>{resolved.sourcePrescription}</p>
        </div>
      )}
      <p className="source-extra-reason">
        {resolved.reason || resolved.instructions}
      </p>
      <div className="source-combo-blocks">
        {resolved.components?.map((c, i) => (
          <section
            key={c.key}
            className={`source-combo-block ${c.format === "pool" ? "pool" : "metcon"}`}
          >
            <div>
              <span className="combo-number">{i + 1}</span>
              <Icon name={c.format === "pool" ? "Waves" : "Bike"} size={26} />
              <h3>{c.name}</h3>
              <Badge color={c.format === "pool" ? "blue" : "amber"}>
                {Math.round(c.seconds / 60)} min prévues
              </Badge>
            </div>
            {c.levelName && <small>{c.levelName}</small>}
            {c.advice && <p>{c.advice}</p>}
            <details open={c.format === "pool"}>
              <summary>
                {c.format === "pool"
                  ? "Exercices et étapes de piscine"
                  : "Voir les intervalles d’elliptique"}
              </summary>
              <ol>
                {steps
                  .filter(
                    (s) => s.segment === (c.key === "post" ? "post" : c.key),
                  )
                  .map((s, j) => {
                    // Les étapes de piscine décrivaient le geste sans le
                    // montrer, alors que les exercices de musculation ont
                    // leur animation. Le guide correspondant en porte une.
                    const guide = POOL_GUIDES.find((g) =>
                      g.k.some((k) => norm(s.name).includes(norm(k))),
                    );
                    return (
                      <li key={j}>
                        {guide?.img && (
                          <button
                            type="button"
                            className="pool-step-thumb"
                            title="Agrandir"
                            onClick={() =>
                              setModal({
                                type: "image",
                                src: guide.img,
                                title: guide.t,
                              })
                            }
                          >
                            <img
                              className="pool-step-img"
                              loading="lazy"
                              src={assetSrc(guide.img)}
                              alt={guide.t}
                            />
                            <Icon name="Maximize2" size={13} />
                          </button>
                        )}
                        <strong>{s.name}</strong>
                        <span>{s.seconds} s</span>
                      </li>
                    );
                  })}
              </ol>
            </details>
          </section>
        ))}
      </div>
      {resolved.components?.length > 1 && (
        <div className="transition-note">
          <Icon name="MoveRight" size={17} />
          {resolved.transitionSeconds / 60} min de transition prévues · boire et
          rejoindre la piscine.
        </div>
      )}
      <div className="source-extra-total">
        <b>{Math.round(total / 60)} min de protocole prévu</b>
        <span>
          Le chrono ne valide pas automatiquement des performances. Vous
          confirmerez ce qui a été réellement réalisé.
        </span>
      </div>
      <div className="modal-actions">
        <Button
          variant="secondary"
          icon="ClipboardCheck"
          onClick={() =>
            setModal({
              type: "source-extra-results",
              data: {
                ...resolved,
                planId: event.id,
                date: event.date <= today() ? event.date : today(),
              },
            })
          }
        >
          Déjà effectué · saisir mes résultats
        </Button>
        <Button
          variant="primary"
          icon="Play"
          disabled={!steps.length}
          onClick={run}
        >
          {event.date < today()
            ? "Relancer aujourd’hui"
            : "Lancer la séance combinée"}
        </Button>
      </div>
    </Modal>
  );
}
export function SourceExtraResultsModal({ data, timerResult }) {
  const { p, updateProfile, closeModal, notify } = useApp(),
    parts = data.components || [],
    [date, setDate] = useState(data.date || today()),
    [values, setValues] = useState(
      Object.fromEntries(
        parts.map((c) => [
          c.key,
          {
            minutes: timerResult?.segmentElapsed?.[c.key]
              ? Math.round(timerResult.segmentElapsed[c.key] / 6) / 10
              : "",
            distance: "",
            rpe: "",
            rounds: "",
          },
        ]),
      ),
    ),
    [note, setNote] = useState("");
  const locked = useRef(false);
  const change = (key, field, value) =>
    setValues((v) => ({ ...v, [key]: { ...v[key], [field]: value } }));
  function save(e) {
    e.preventDefault();
    if (locked.current) return;
    try {
      const id = timerResult?.id || uid();
      if (p.activities.some((a) => a.combinationId === id))
        throw new Error("Ces résultats sont déjà enregistrés.");
      const results = [];
      for (const c of parts) {
        const v = values[c.key],
          minutes = num(v.minutes);
        if (minutes == null || minutes === 0) continue;
        results.push(
          actualActivity({
            id: uid(),
            date,
            type: c.type === "metcon" ? "cardio" : c.type,
            name: c.name,
            durationSec: Math.round(minutes * 60),
            rpe: num(v.rpe),
            distance: num(v.distance),
            rounds: num(v.rounds),
            calories: null,
            rest: null,
            note,
            protocolId: c.protocolId || null,
            level: c.level ?? null,
            format: c.format,
            combinationId: id,
            timerId: timerResult?.id || null,
            planId: data.planId || null,
            source: "source-combo-confirmed",
          }),
        );
      }
      if (!results.length)
        throw new Error("Renseignez au moins une durée réellement effectuée.");
      locked.current = true;
      updateProfile((q) => {
        q.activities.push(...results);
        if (data.planId)
          completePlanned(
            q,
            data.planId,
            results.length === parts.length &&
              (!timerResult || timerResult.done)
              ? "completed"
              : "partial",
            date,
          );
        if (timerResult && q.timer?.id === timerResult.id) q.timer = null;
        const marker = q.dayReports?.find((d) => d.date === date);
        if (marker) {
          marker.originalStatus = marker.originalStatus || marker.status;
          marker.status =
            results.length === parts.length &&
            (!timerResult || timerResult.done)
              ? "completed"
              : "partial";
          marker.detailsConfirmed = true;
        }
        const planned = q.plan?.sessions.find((s) => s.id === data.planId);
        if (planned) {
          planned.completionReportedOnly = false;
          planned.actualActivityIds = results.map((a) => a.id);
        }
      });
      notify(
        "Résultats enregistrés séparément : cardio et piscine, sans double comptage.",
      );
      closeModal();
    } catch (error) {
      notify(error.message, "error");
    }
  }
  return (
    <Modal
      title="Mes résultats METCON / piscine"
      subtitle="Validez vos durées réelles. Une valeur vide ou zéro signifie que ce bloc n’est pas déclaré réalisé."
      onClose={closeModal}
      wide
    >
      <form onSubmit={save}>
        <Field label="Date réellement effectuée">
          <Input
            type="date"
            required
            max={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        {parts.map((c) => (
          <section
            className={`source-result-block ${c.format === "pool" ? "pool" : "metcon"}`}
            key={c.key}
          >
            <h3>{c.name}</h3>
            <p>
              {Math.round(c.seconds / 60)} min étaient prévues ·{" "}
              {timerResult?.segmentElapsed?.[c.key] != null
                ? `${Math.round(timerResult.segmentElapsed[c.key])} s chronométrées sur ce bloc`
                : "aucune durée mesurée disponible"}
            </p>
            <div className="form-grid">
              <Field
                label={`Durée réelle ${c.format === "pool" ? "piscine" : "cardio"} (min)`}
              >
                <Input
                  type="number"
                  min="0"
                  max="1440"
                  step="0.1"
                  value={values[c.key].minutes}
                  onChange={(e) => change(c.key, "minutes", e.target.value)}
                />
              </Field>
              <Field
                label={`RPE ${c.format === "pool" ? "piscine" : "cardio"}`}
              >
                <Input
                  type="number"
                  min="1"
                  max="10"
                  step=".5"
                  value={values[c.key].rpe}
                  onChange={(e) => change(c.key, "rpe", e.target.value)}
                />
              </Field>
              {c.format === "pool" && (
                <>
                  <Field label="Distance réellement nagée (m)">
                    <Input
                      type="number"
                      min="0"
                      value={values[c.key].distance}
                      onChange={(e) =>
                        change(c.key, "distance", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Rounds réellement effectués">
                    <Input
                      type="number"
                      min="1"
                      max="500"
                      value={values[c.key].rounds}
                      onChange={(e) => change(c.key, "rounds", e.target.value)}
                    />
                  </Field>
                </>
              )}
            </div>
          </section>
        ))}
        <Field label="Note">
          <textarea
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
        <Button variant="primary" type="submit" icon="Check">
          Confirmer mes résultats réels
        </Button>
      </form>
    </Modal>
  );
}
