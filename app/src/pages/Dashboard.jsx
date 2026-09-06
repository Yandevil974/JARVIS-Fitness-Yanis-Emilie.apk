import { sourceRecoveryScore } from "../engine/source-schedule.js";
import WeekSchedule from "../components/WeekSchedule.jsx";
import { nextTrainingEvent } from "../engine/schedule-events.js";
import React from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  Icon,
  Button,
  Badge,
  PageHeading,
  Panel,
  SectionHeading,
  Metric,
  Orb,
  Ring,
  ProgressBar,
} from "../components/ui.jsx";
import Anatomy from "../components/Anatomy.jsx";
import { LineChart } from "../components/Charts.jsx";
import { nextSession, suggestSession, DAYS } from "../engine/planner.js";
import {
  recoveryScore,
  stats,
  weeklyReport,
  chartSeries,
  level,
} from "../engine/fitness.js";
import {
  today,
  dateLabel,
  monday,
  addDays,
  assetSrc,
  numberLabel,
} from "../engine/utils.js";
import { GOALS, MUSCLES } from "../data/library.js";
import { reevaluationStatus } from "../engine/strength.js";
export default function Dashboard() {
  const { p, navigate, startWorkout, setModal, sendCoach } = useApp();
  const next =
    p.workout || nextTrainingEvent(p) || nextSession(p) || suggestSession(p);
  const rec = recoveryScore(p),
    week = stats(p),
    report = weeklyReport(p);
  const lvl = level(p);
  const lastWeight = [...p.measurements]
    .filter((m) => m.weight != null && m.date <= today())
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastCheckDate = Object.keys(p.checkIns)
    .filter((d) => d <= today())
    .sort()
    .at(-1);
  const lastRecovery = lastCheckDate
    ? sourceRecoveryScore(p.checkIns[lastCheckDate])
    : null;
  const totalCompleted = p.sessions.filter(
    (s) => s.status === "completed",
  ).length;
  const quarter = stats(p, "trimestre");
  const weekStart = monday(next.date);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const energy = p.checkIns[today()]?.energy;
  return (
    <>
      <PageHeading
        eyebrow="VOTRE CENTRE DE COMMANDE"
        title={p.user.name ? `Bonjour, ${p.user.name}.` : "Bonjour, Athlète."}
        description="Un objectif clair. Un entraînement qui s’adapte à vous."
      >
        <div className="date-pill">
          <Icon name="CalendarDays" size={16} />
          {dateLabel(today(), {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </PageHeading>
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="metrics-grid">
            <Metric
              icon="Scale"
              label="Dernière pesée"
              value={lastWeight ? numberLabel(lastWeight.weight) : "—"}
              unit={lastWeight ? "kg" : ""}
              detail={
                lastWeight
                  ? `${dateLabel(lastWeight.date)} · poids réellement saisi`
                  : "Aucune pesée enregistrée"
              }
              color="blue"
            />
            <Metric
              icon="HeartPulse"
              label={
                lastCheckDate === today()
                  ? "Récupération du jour"
                  : "Dernier bilan récupération"
              }
              value={lastRecovery ?? "—"}
              unit={lastRecovery != null ? "/100" : ""}
              detail={
                lastCheckDate
                  ? `${dateLabel(lastCheckDate)} · calcul du fichier source`
                  : "Votre bilan du jour vous attend"
              }
              color="pink"
            />
            <Metric
              icon="Dumbbell"
              label="Séances validées"
              value={totalCompleted}
              detail={`${p.sessions.length} journaux de musculation conservés`}
              color="amber"
            />
            <Metric
              icon="Crosshair"
              label="Objectif"
              value={
                {
                  recomposition: "Recomp.",
                  hypertrophy: "Muscle",
                  strength: "Force",
                  cut: "Sèche",
                  endurance: "Endurance",
                  wellbeing: "Bien-être",
                }[p.user.goal]
              }
              detail="Votre cap, votre progression"
              color="blue"
            />
          </div>
          <section
            className="training-hero"
            style={{
              backgroundImage: `linear-gradient(90deg,rgba(18,47,80,.98) 0%,rgba(18,47,80,.76) 43%,rgba(18,47,80,.06) 76%),url('${assetSrc("/training-hero.jpg")}')`,
            }}
          >
            <div className="hero-topline">
              <Badge color="mint" dot>
                {p.workout ? "SÉANCE EN COURS" : "PROCHAINE SÉANCE"}
              </Badge>
              <span>
                {p.plan?.source === "legacy"
                  ? `PROGRAMME SOURCE · ${p.user.name}`
                  : "PROGRAMME ADAPTATIF"}{" "}
                <Icon name="Sparkles" size={12} />
              </span>
            </div>
            <div className="hero-copy">
              <p>Construisez votre prochaine version.</p>
              <h2>
                {next.name.split(" & ")[0]}
                <br />
                {next.name.includes(" & ") ? (
                  <>
                    <em>&</em> {next.name.split(" & ").slice(1).join(" & ")}
                  </>
                ) : (
                  ""
                )}
              </h2>
              <div className="hero-facts">
                <span>
                  <Icon name="Clock3" size={15} />
                  {next.estimatedMinutes || 45} min <small>estimées</small>
                </span>
                <span>
                  <Icon name="Dumbbell" size={15} />
                  {next.type === "strength"
                    ? `${next.exercises.length} exercices`
                    : `${next.components?.length || 1} blocs · cardio / piscine`}
                </span>
                <span>
                  <Icon name="Layers3" size={15} />
                  {next.source === "legacy"
                    ? "Programme d’origine"
                    : next.deload
                      ? "Deload"
                      : "Hypertrophie & technique"}
                </span>
              </div>
              <div className="hero-cta">
                <Button
                  variant="primary"
                  icon="Play"
                  onClick={() =>
                    next.type === "strength"
                      ? startWorkout(next)
                      : setModal({ type: "source-extra", event: next })
                  }
                >
                  {p.workout ? "Reprendre ma séance" : "Lancer la séance"}
                </Button>
                <button
                  className="hero-detail"
                  onClick={() => navigate("program", "source")}
                >
                  Voir mon programme <Icon name="ArrowUpRight" size={16} />
                </button>
              </div>
            </div>
            <div className="hero-foot">
              <span>
                <i />{" "}
                {p.workout
                  ? "Chaque série est sauvegardée."
                  : "Vos charges seront adaptées à votre historique."}
              </span>
              <span className="hero-code">J / TRAINING SYSTEM</span>
            </div>
          </section>
          <WeekSchedule />
          <div className="dashboard-team-link">
            <Icon name="UsersRound" size={29} />
            <div>
              <h3>Votre équipe et ses retours</h3>
              <p>
                {(p.teamReviews || []).length
                  ? `${p.teamReviews.length} bilans enregistrés, avec vos ressentis et les conseils conservés.`
                  : "Coach, hypertrophie, nutrition, mental, santé, mobilité, cardio et analyse."}
              </p>
            </div>
            <Button
              variant="secondary small"
              onClick={() =>
                navigate(
                  "team",
                  (p.teamReviews || []).length ? "archive" : "advisors",
                )
              }
            >
              Voir mon équipe
            </Button>
          </div>

          <div className="dashboard-lower">
            <Panel className="progress-panel">
              <SectionHeading
                title="Chaque effort compte"
                subtitle="Tonnage calculable · trois derniers mois"
              >
                <button
                  className="text-link"
                  onClick={() => navigate("progress")}
                >
                  Analyser <Icon name="ArrowUpRight" size={14} />
                </button>
              </SectionHeading>
              <div className="progress-total">
                <strong>
                  {numberLabel(quarter.tonnage, 0)}
                  <small> kg</small>
                </strong>
                <span>
                  <i /> {week.sets} séries cette semaine
                </span>
              </div>
              <LineChart
                points={chartSeries(p, "tonnage", "trimestre")}
                unit="kg"
                height={174}
                emptyAction="Enregistrer ma première performance"
                onEmpty={() => setModal({ type: "log" })}
              />
            </Panel>
            <Panel className="consistency-panel">
              <div className="eyebrow">VOTRE RÉGULARITÉ</div>
              <div className="consistency-icon">
                <Icon name="Flame" size={26} />
              </div>
              <h3>
                {week.sessions}
                <span> / {week.planned}</span>
              </h3>
              <p>
                séances terminées
                <br />
                cette semaine
              </p>
              <ProgressBar
                value={week.planned ? (week.sessions / week.planned) * 100 : 0}
              />
              <span className="subtle-note">
                Le repos fait aussi partie du progrès.
              </span>
            </Panel>
          </div>
          <div className="quick-actions">
            {[
              ["Bot", "Parler à JARVIS", "jarvis"],
              ["Waves", "Piscine & cardio", "cardio"],
              ["Wind", "Récupération", "recovery"],
              ["Utensils", "Nutrition", "nutrition"],
            ].map(([icon, name, page]) => (
              <button key={page} onClick={() => navigate(page)}>
                <Icon name={icon} size={20} />
                <span>{name}</span>
                <Icon name="ArrowUpRight" size={15} />
              </button>
            ))}
          </div>
        </div>
        <aside className="dashboard-rail">
          <Panel className="readiness-panel">
            <div className="panel-kicker">
              <span>
                <i className="status-dot" /> ÉTAT DU JOUR
              </span>
              <Icon name="Info" size={15} />
            </div>
            <div className="readiness-ring">
              <Ring value={rec.score} size={146} stroke={8}>
                <strong>{rec.score ?? "—"}</strong>
                <span>
                  {rec.score == null ? "DONNÉE INSUFFISANTE" : "SUR 100"}
                </span>
              </Ring>
            </div>
            <h3>
              {rec.score == null
                ? "À l’écoute de votre corps."
                : rec.score >= 65
                  ? "Le bon moment pour progresser."
                  : "Place à la récupération."}
            </h3>
            <p>
              {rec.score == null
                ? "Sommeil, énergie, ressenti. 30 secondes pour mieux adapter votre séance."
                : `Score indicatif · ${rec.coverage} % des données renseignées.`}
            </p>
            <Button
              variant="secondary"
              icon="HeartPulse"
              onClick={() => setModal({ type: "checkin" })}
            >
              {rec.score == null ? "Faire mon bilan" : "Actualiser mon bilan"}
              <Icon name="ArrowRight" size={15} />
            </Button>
          </Panel>
          <ForceReminder />
          <Panel className="coach-card">
            <div className="coach-card-head">
              <Orb small />
              <div>
                <strong>
                  JARVIS <span>AI</span>
                </strong>
                <small>INTELLIGENCE ADAPTATIVE</small>
              </div>
              <i className="status-dot" />
            </div>
            <p>
              {rec.score != null && rec.score < 60
                ? "Votre récupération mérite la priorité. Je peux alléger le volume sans perdre l’essentiel."
                : p.sessions.length
                  ? "Votre historique nourrit chaque recommandation. Regardons ensemble comment faire évoluer votre prochaine séance."
                  : "Votre potentiel ne se devine pas. Il se construit. Enregistrez vos premières séries, je m’occupe de la suite."}
            </p>
            <button
              className="text-link"
              onClick={() => {
                navigate("jarvis");
              }}
            >
              Parlons de votre séance <Icon name="ArrowRight" size={16} />
            </button>
            <div className="local-model-label">
              <Icon name="ShieldCheck" size={11} /> Moteur local · vos données
              restent ici
            </div>
          </Panel>
          <Panel className="muscle-panel">
            <SectionHeading title="Votre focus musculaire">
              <Icon name="ScanLine" size={18} />
            </SectionHeading>
            <span className="small-subtitle">
              {next.focus
                ?.map((m) => MUSCLES[m])
                .slice(0, 3)
                .join(" · ")}
            </span>
            <Anatomy
              primary={next.focus || ["dos"]}
              secondary={["bic", "epP"]}
              compact
            />
            <button
              className="text-link full-link"
              onClick={() => navigate("progress", "balance")}
            >
              Explorer votre équilibre <Icon name="ArrowUpRight" size={15} />
            </button>
          </Panel>
          <div className="level-strip">
            <span className="level-emblem">
              <Icon name="Shield" size={18} />
            </span>
            <div>
              <strong>{lvl.name}</strong>
              <small>{lvl.count} séances validées</small>
            </div>
            <span>{lvl.next ? `${lvl.count}/${lvl.next}` : "ÉLITE"}</span>
          </div>
        </aside>
      </div>
      <div className="dashboard-footer">
        <span>
          <Icon name="LockKeyhole" size={12} /> CONFIDENTIALITÉ PAR CONCEPTION
        </span>
        <span>VOTRE DISCIPLINE. NOTRE INTELLIGENCE.</span>
        <span>JARVIS / 01</span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   RAPPEL DE RÉÉVALUATION 1RM
   Les charges proposées découlent du bilan de force. Cette carte
   rappelle quand le refaire, et n'apparaît que si c'est utile.
   ------------------------------------------------------------------ */
function ForceReminder() {
  const { p, navigate } = useApp();
  const status = reevaluationStatus(p);
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
      <Button icon="ArrowRight" onClick={() => navigate("force")}>
        {status.done ? "Refaire le bilan 1RM" : "Faire le bilan 1RM"}
      </Button>
    </Panel>
  );
}
