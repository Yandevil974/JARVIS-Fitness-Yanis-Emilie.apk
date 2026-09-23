import WeekSchedule from "../components/WeekSchedule.jsx";
import { modalForEvent, eventTags } from "../engine/schedule-events.js";
import {
  sourcePosition,
  sourceDay,
  sourceExtra,
} from "../engine/source-schedule.js";
import { plannedSessions } from "../engine/plan-memory.js";
import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  Panel,
  SectionHeading,
  Icon,
  IconButton,
  Button,
  Badge,
  Tabs,
  ProgressBar,
} from "../components/ui.jsx";
import {
  DAYS,
  makeTarget,
  estimateMinutes,
  sourceSession,
  nextSession,
} from "../engine/planner.js";
import {
  today,
  parseDate,
  dateKey,
  dateLabel,
  addDays,
  monday,
  uid,
  dayDiff,
} from "../engine/utils.js";
import { legacy, findExercise, MUSCLES, GOALS } from "../data/library.js";
const TYPE_ICON = {
  strength: "Dumbbell",
  metcon: "Zap",
  cardio: "HeartPulse",
  swim: "Waves",
  hiit: "Zap",
  aqua: "Waves",
  recovery: "Wind",
  rest: "Leaf",
};
const TYPE_LABEL = {
  strength: "Musculation",
  metcon: "METCON + piscine",
  cardio: "Cardio",
  swim: "Piscine",
  hiit: "HIIT",
  aqua: "Aqua HIIT",
  recovery: "Récupération",
  rest: "Repos",
};
export default function Program() {
  const { p, tab, setTab, setModal } = useApp();
  const value = tab || "source";
  return (
    <>
      <PageHeading
        eyebrow="VOTRE PROGRAMME D’ORIGINE, AU PREMIER PLAN"
        title={`Le programme de ${p.user.name}.`}
        description="Vos séances et exercices du fichier HTML, avec leurs prescriptions d’origine."
      >
        <Button
          variant="secondary"
          icon="CalendarDays"
          onClick={() => setModal({ type: "generate-plan" })}
        >
          Régler mon calendrier
        </Button>
      </PageHeading>
      {value !== "source" && (
        <div className="plan-overview">
          <div>
            <Badge color="mint" dot>
              PROGRAMME ACTIF
            </Badge>
            <strong>
              {p.plan?.source === "legacy"
                ? "Cycle source préservé"
                : "Adaptatif JARVIS"}
            </strong>
            <span>
              {p.plan?.weeks || 0} semaines · {p.plan?.frequency || 0} séances /
              semaine · {GOALS[p.plan?.goal || p.user.goal]}
            </span>
          </div>
          <div>
            <span>Début du cycle</span>
            <strong>
              {dateLabel(p.plan?.startDate, { day: "numeric", month: "long" })}
            </strong>
          </div>
          <div className="plan-cycle-progress">
            <span>
              Semaine{" "}
              {Math.max(
                1,
                Math.min(
                  p.plan?.weeks || 1,
                  Math.floor(
                    dayDiff(today(), p.plan?.startDate || today()) / 7,
                  ) + 1,
                ),
              )}{" "}
              / {p.plan?.weeks}
            </span>
            <ProgressBar
              value={
                (Math.max(0, dayDiff(today(), p.plan?.startDate || today())) /
                  (p.plan?.weeks * 7)) *
                100
              }
            />
          </div>
          <Icon name="Route" size={32} />
        </div>
      )}
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["source", "Mon programme"],
          ["week", "Cette semaine"],
          ["calendar", "Calendrier"],
          ["cycle", "Vue du cycle"],
        ]}
      />
      {value === "week" ? (
        <WeekSchedule />
      ) : value === "source" ? (
        <SourcePrograms />
      ) : value === "cycle" ? (
        <Cycle />
      ) : (
        <Calendar />
      )}
    </>
  );
}
function Calendar() {
  const { p, setModal } = useApp();
  const [offset, setOffset] = useState(0),
    [view, setView] = useState(window.innerWidth <= 480 ? "list" : "month");
  const plans = plannedSessions(p);
  const actual = p.sessions
    .filter((s) => !s.planId || !plans.some((x) => x.id === s.planId))
    .map((s) => ({ ...s, actualId: s.id }));
  const calendar = [...plans, ...actual];
  const show = (s) => setModal(modalForEvent(s));
  const base = parseDate(today());
  base.setDate(1);
  base.setMonth(base.getMonth() + offset);
  const first = dateKey(base),
    start = monday(first),
    next = new Date(base.getFullYear(), base.getMonth() + 1, 0),
    last = dateKey(next);
  const count = Math.ceil((dayDiff(last, start) + 1) / 7) * 7;
  const dates = Array.from({ length: count }, (_, i) => addDays(start, i));
  const future =
    p.plan?.sessions
      .filter((s) => s.date >= today() && s.status === "planned")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5) || [];
  return (
    <div className="calendar-layout">
      <Panel className="calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-month">
            <IconButton
              icon="ChevronLeft"
              label="Mois précédent"
              onClick={() => setOffset((o) => o - 1)}
            />
            <h2>
              {base.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <IconButton
              icon="ChevronRight"
              label="Mois suivant"
              onClick={() => setOffset((o) => o + 1)}
            />
          </div>
          <Button variant="secondary small" onClick={() => setOffset(0)}>
            Aujourd’hui
          </Button>
          <div className="segmented">
            <button
              className={view === "month" ? "active" : ""}
              onClick={() => setView("month")}
            >
              Mois
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              Liste
            </button>
          </div>
        </div>
        {view === "month" ? (
          <>
            <div className="calendar-weekdays">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {dates.map((d) => {
                const sessions = calendar.filter((s) => s.date === d);
                const activities = p.activities.filter(
                  (a) => a.date === d && !a.planId,
                );
                return (
                  <div
                    className={`calendar-day ${d.slice(0, 7) !== first.slice(0, 7) ? "outside" : ""} ${d === today() ? "today" : ""}`}
                    key={d}
                  >
                    <button
                      className="day-number"
                      onClick={() => setModal({ type: "schedule", date: d })}
                      aria-label={`Planifier le ${dateLabel(d, { day: "numeric", month: "long" })}`}
                    >
                      {Number(d.slice(8))}
                      <Icon name="Plus" size={12} />
                    </button>
                    <div className="day-events">
                      {sessions.slice(0, 2).map((s) => (
                        <button
                          key={s.id}
                          className={`calendar-event ${s.type} ${s.status}`}
                          onClick={() => show(s)}
                        >
                          <span>
                            <i />
                            {s.time || "18:00"}
                          </span>
                          <strong>{s.name}</strong>
                          {s.type === "metcon" && (
                            <span className="calendar-combo-tags">
                              <b>METCON</b>
                              <b>Piscine</b>
                            </span>
                          )}
                          <small>
                            {s.status === "completed"
                              ? "Terminée"
                              : s.status === "missed"
                                ? "Manquée"
                                : s.status === "partial"
                                  ? "Partielle"
                                  : s.deload
                                    ? "Allégée"
                                    : s.estimatedMinutes
                                      ? `${s.estimatedMinutes} min`
                                      : "Durée inconnue"}
                          </small>
                        </button>
                      ))}
                      {activities.slice(0, 1).map((a) => (
                        <div
                          className={`calendar-event ${a.type} completed`}
                          key={a.id}
                        >
                          <strong>
                            <Icon name="Check" size={10} />
                            {a.name}
                          </strong>
                        </div>
                      ))}
                      {sessions.length > 2 && (
                        <button
                          className="calendar-more"
                          onClick={() => setView("list")}
                        >
                          +{sessions.length - 2} · voir la liste
                        </button>
                      )}
                      {!sessions.length &&
                        !activities.length &&
                        d.slice(0, 7) === first.slice(0, 7) && (
                          <span className="rest-day">Récupérer</span>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="calendar-list">
            {calendar
              .filter((s) => s.date >= first && s.date <= last)
              .map((s) => (
                <button key={s.id} onClick={() => show(s)}>
                  <span className={`activity-square ${s.type}`}>
                    <Icon name={TYPE_ICON[s.type]} />
                  </span>
                  <div>
                    <strong>{s.name}</strong>
                    {s.type === "metcon" && (
                      <span className="calendar-combo-tags">
                        <b>METCON</b>
                        <b>Piscine</b>
                      </span>
                    )}
                    <p>
                      {dateLabel(s.date, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}{" "}
                      · {s.time}
                    </p>
                  </div>
                  <Badge color={s.status === "completed" ? "mint" : ""}>
                    {s.status === "completed"
                      ? "Terminée"
                      : s.status === "partial"
                        ? "Partielle"
                        : s.status === "missed"
                          ? "Manquée"
                          : `${s.estimatedMinutes || "—"} min`}
                  </Badge>
                  <Icon name="ChevronRight" size={16} />
                </button>
              ))}
            {p.activities
              .filter((a) => a.date >= first && a.date <= last && !a.planId)
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    setModal({ type: "log-activity", activityId: a.id })
                  }
                >
                  <span className={`activity-square ${a.type}`}>
                    <Icon name={TYPE_ICON[a.type]} />
                  </span>
                  <div>
                    <strong>{a.name}</strong>
                    <p>
                      {dateLabel(a.date)} · {Math.round(a.durationSec / 60)}{" "}
                      minutes réalisées
                    </p>
                  </div>
                  <Badge color="mint">Réalisée</Badge>
                  <Icon name="ChevronRight" size={16} />
                </button>
              ))}
          </div>
        )}
        <div className="calendar-legend">
          {Object.entries(TYPE_LABEL)
            .filter(([k]) => k !== "aqua")
            .map(([k, v]) => (
              <span key={k}>
                <i className={k} />
                {v}
              </span>
            ))}
        </div>
      </Panel>
      <aside>
        <Panel>
          <SectionHeading title="À l’horizon">
            <Icon name="CalendarClock" size={18} />
          </SectionHeading>
          <div className="upcoming-list">
            {future.map((s) => (
              <button key={s.id} onClick={() => show(s)}>
                <div className="upcoming-date">
                  <strong>{Number(s.date.slice(8))}</strong>
                  <small>{dateLabel(s.date, { month: "short" })}</small>
                </div>
                <div>
                  <strong>{s.name}</strong>
                  <small>
                    {s.estimatedMinutes} min · {s.time}
                  </small>
                </div>
                <Icon name="ArrowUpRight" size={14} />
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="calendar-advice">
          <Icon name="GitBranch" size={24} />
          <h3>
            La vie change.
            <br />
            Votre plan aussi.
          </h3>
          <p>
            Déplacez une séance vers un jour libre. Pour une séance manquée, le
            report intelligent préserve un intervalle de récupération des
            muscles concernés.
          </p>
          <span className="small-subtitle">
            Les jours de repos ne sont pas des jours perdus.
          </span>
        </Panel>
      </aside>
    </div>
  );
}
function Cycle() {
  const { p, setModal } = useApp();
  return (
    <div className="cycle-blocks">
      {Array.from(
        { length: Math.ceil((p.plan?.weeks || 1) / 4) },
        (_, block) => {
          const ss =
            p.plan?.sessions.filter(
              (s) => s.week >= block * 4 && s.week < block * 4 + 4,
            ) || [];
          const done = ss.filter((s) => s.status === "completed").length;
          const sourcePhase =
            p.plan?.source === "legacy"
              ? legacy[p.id].PROGRAM[block + 1] || legacy[p.id].PROGRAM.finale
              : null;
          return (
            <Panel className="cycle-block" key={block}>
              <span className="block-number">
                {String(block + 1).padStart(2, "0")}
              </span>
              <div>
                <Badge color="mint">
                  SEMAINES {block * 4 + 1}–
                  {Math.min(p.plan?.weeks, block * 4 + 4)}
                </Badge>
                <h2>
                  {sourcePhase?.titre ||
                    (block === 0
                      ? "Construire les fondations"
                      : block === 1
                        ? "Consolider la progression"
                        : block === 2
                          ? "Développer votre potentiel"
                          : "Poursuivre avec maîtrise")}
                </h2>
                <p>
                  {sourcePhase
                    ? `${sourcePhase.methode} · ${sourcePhase.objectif}`
                    : "Progression par répétitions, puis par charge. Quatrième semaine allégée pour les cycles adaptatifs."}
                </p>
                <div className="cycle-weeks">
                  {[0, 1, 2, 3]
                    .filter((i) => block * 4 + i < p.plan.weeks)
                    .map((i) => (
                      <div className={i === 3 ? "deload" : ""} key={i}>
                        <strong>S{block * 4 + i + 1}</strong>
                        <span>
                          {sourcePhase
                            ? i === 3 && sourcePhase.deload
                              ? "Allégement source"
                              : "Prescription source"
                            : i === 3
                              ? "Assimilation / deload"
                              : i === 0
                                ? "Technique"
                                : i === 1
                                  ? "Consolidation"
                                  : "Progression selon RPE"}
                        </span>
                        <i />
                      </div>
                    ))}
                </div>
                <div className="cycle-footer">
                  <span>
                    {done} / {ss.length} séances réalisées
                  </span>
                  <ProgressBar
                    value={ss.length ? (done / ss.length) * 100 : 0}
                  />
                  <button
                    className="text-link"
                    onClick={() =>
                      ss[0] &&
                      setModal({ type: "planned", sessionId: ss[0].id })
                    }
                  >
                    Ouvrir le bloc <Icon name="ArrowUpRight" size={14} />
                  </button>
                </div>
              </div>
            </Panel>
          );
        },
      )}
    </div>
  );
}
function SourcePrograms() {
  const {
    p,
    startWorkout,
    openExercise,
    updateProfile,
    switchProfile,
    navigate,
    notify,
    setModal,
  } = useApp();
  const data = legacy[p.id];
  const active = nextSession(p);
  const initial = Object.hasOwn(data.PROGRAM, p.preferences.programPhase || "")
    ? p.preferences.programPhase
    : Object.entries(data.PROGRAM).find(
        ([, phase]) => phase.titre === active?.phase,
      )?.[0] || "1";
  const [open, setOpen] = useState(initial);
  const fileName =
    p.id === "elite"
      ? "Transformation_Elite_V2.html"
      : "Emilie_transformation_V7.html";
  function selectPhase(key) {
    setOpen(key);
    if (key)
      updateProfile((q) => {
        q.preferences.programPhase = key;
      });
    if (key)
      requestAnimationFrame(() =>
        document
          .querySelector(`.original-program-phases [data-phase="${key}"]`)
          ?.scrollIntoView({
            behavior: p.preferences.reducedMotion ? "instant" : "smooth",
            block: "start",
          }),
      );
  }
  function launch(key, sessionKey) {
    const session = sourceSession(p, key, sessionKey);
    const pos = sourcePosition(p, today());
    if (pos.phaseKey === String(key) && pos.deload) {
      session.deload = true;
      session.sourcePeriodNote =
        "Allégement prévu par le HTML : environ 50 % du volume.";
      session.exercises = session.exercises.map((e) => ({
        ...e,
        sourceTargetSets: e.targetSets,
        targetSets:
          e.targetSets === 1 ? 1 : Math.max(1, Math.round(e.targetSets * 0.5)),
        sourcePeriodDeload: true,
      }));
      session.estimatedMinutes = estimateMinutes(session);
    }
    if (
      p.workout &&
      (p.workout.name !== session.name ||
        p.workout.phase !== session.phase ||
        !p.workout.preservePrescription)
    ) {
      notify(
        "Une autre séance est en cours. Clôturez-la sans perdre vos séries, puis démarrez la séance d’origine choisie.",
        "info",
      );
      setModal({ type: "finish-workout" });
      return;
    }
    const linked = p.plan?.sessions.find(
      (s) =>
        s.status === "planned" &&
        s.date >= today() &&
        s.source === "legacy" &&
        s.phase === session.phase &&
        s.name === session.name,
    );
    if (linked) {
      session.id = linked.id;
      session.date = linked.date;
      session.standalone = false;
    }
    startWorkout(session);
  }
  return (
    <>
      <div className="source-banner original-program-banner">
        <Icon name="ShieldCheck" size={28} />
        <div>
          <h3>Votre programme HTML est conservé.</h3>
          <p>
            Vos exercices, leur ordre, les séries et les repos du fichier
            original. Aucune adaptation de cette base sans votre choix.
          </p>
          <small>{fileName}</small>
          <Button
            variant="primary small"
            icon="Dumbbell"
            className="show-source-exercises"
            onClick={() => selectPhase(open || initial)}
          >
            Afficher mes exercices
          </Button>
        </div>
        <Badge color="blue">ORIGINAL</Badge>
      </div>
      <div className="program-howto">
        <span>
          <b>1</b> Choisissez le mois
        </span>
        <span>
          <b>2</b> Retrouvez J1, J2, J3…
        </span>
        <span>
          <b>3</b> Ouvrez l’exercice ou démarrez la séance
        </span>
      </div>
      <div className="program-picker">
        <label>
          <span>Mon programme</span>
          <select
            className="input"
            aria-label="Programme du profil"
            value={p.id}
            onChange={(e) => {
              switchProfile(e.target.value);
              navigate("program", "source");
            }}
          >
            <option value="elite">Yanis · programme Élite</option>
            <option value="emilie">Émilie · son programme</option>
          </select>
        </label>
        <label>
          <span>Mois / phase à consulter</span>
          <select
            className="input"
            aria-label="Mois du programme"
            value={open || ""}
            onChange={(e) => selectPhase(e.target.value)}
          >
            <option value="" disabled>
              Choisir une phase
            </option>
            {Object.entries(data.PROGRAM).map(([key, phase]) => (
              <option key={key} value={key}>
                {key === "finale" ? "Finale" : `Mois ${key}`} · {phase.titre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="source-phases original-program-phases">
        {Object.entries(data.PROGRAM).map(([key, phase]) => (
          <Panel key={key} data-phase={key} data-method={phase.type}>
            <button
              className="source-phase-toggle"
              aria-expanded={open === key}
              onClick={() => selectPhase(open === key ? null : key)}
            >
              <span>
                {key === "finale" ? "F" : String(key).padStart(2, "0")}
              </span>
              <div>
                <h3>{phase.titre}</h3>
                <p>
                  {phase.mois} · {phase.methode}
                </p>
              </div>
              <Badge>{Object.keys(phase.sessions).length} séances</Badge>
              <Icon name={open === key ? "Minus" : "Plus"} size={19} />
            </button>
            {open === key && (
              <div className="source-phase-content">
                <p>{phase.objectif}</p>
                <div className="source-phase-prescriptions">
                  <Badge color="blue">Schéma : {phase.schema}</Badge>
                  <Badge color="amber">
                    Intensité source : {phase.intensite}
                  </Badge>
                  {phase.progression && <p>{phase.progression}</p>}
                </div>
                <div className="source-metcon-panel">
                  <Icon name="Zap" size={24} />
                  <div>
                    <h3>
                      {p.id === "elite"
                        ? "METCON + exercices de piscine"
                        : "Cardio et piscine du programme"}
                    </h3>
                    <p>{phase.metcon}</p>
                    <small>
                      {p.id === "elite"
                        ? "Le coach source combine elliptique puis piscine sur les jours METCON, hors semaine allégée. Les exercices de piscine détaillés sont accessibles depuis chaque journée."
                        : "Le cardio après les séances et les jours de piscine sont repris dans votre semaine."}
                    </small>
                  </div>
                  <Button
                    variant="secondary small"
                    onClick={() => navigate("program", "week")}
                  >
                    Voir dans ma semaine
                  </Button>
                </div>

                {phase.deload && (
                  <div className="source-deload-note">
                    <Icon name="Info" size={16} /> Cette phase source prévoit un
                    allégement. Les prescriptions sont affichées telles qu’elles
                    figurent dans le fichier ; leur adaptation reste à
                    confirmer.
                  </div>
                )}
                {Object.entries(phase.sessions).map(([id, session]) => (
                  <div
                    className="source-session"
                    key={id}
                    data-source-session={id}
                  >
                    <SectionHeading
                      title={`${id} · ${session.nom}`}
                      subtitle={`${session.exos.length} exercices · ordre du fichier d’origine`}
                    >
                      <Button
                        variant="primary small"
                        icon="Play"
                        onClick={() => launch(key, id)}
                      >
                        Démarrer {id}
                      </Button>
                    </SectionHeading>
                    <div className="source-exercises">
                      {session.exos.map((e, i) => (
                        <div key={i} data-source-exercise={e[0]}>
                          <button
                            className="text-link source-exercise-name"
                            onClick={() => openExercise(findExercise(e[0])?.id)}
                          >
                            <i>{String(i + 1).padStart(2, "0")}</i>
                            <strong>{e[0]}</strong>
                            <Icon name="ArrowUpRight" size={14} />
                          </button>
                          <span className="source-dose">
                            <b>
                              {e[2]} × {e[3]}
                            </b>
                            <small>Séries × répétitions / durée</small>
                          </span>
                          <span className="source-timing">
                            <b>{e[5]} s de repos</b>
                            <small>Tempo {e[4]}</small>
                          </span>
                          {e[6] && (
                            <small className="source-exercise-note">
                              {e[6]}
                            </small>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </div>
      <details className="source-year-overview">
        <summary>Voir la périodisation annuelle d’origine</summary>
        <div className="source-macros">
          {data.PERIODISATION.map((phase, i) => (
            <Panel key={i}>
              <span>0{i + 1}</span>
              <h3>{phase.nom.replace(/PHASE \d — |MACROCYCLE \w — /, "")}</h3>
              <p>{phase.desc}</p>
              <small>Mois {phase.mois.join(" à ")}</small>
            </Panel>
          ))}
        </div>
      </details>
      <p className="source-safety-note">
        Ces prescriptions sont un programme prévu, pas des performances déjà
        réalisées. Les techniques avancées demandent une pratique adaptée. En
        cas de douleur importante, interrompez l’exercice et demandez un avis
        compétent.
      </p>
    </>
  );
}
