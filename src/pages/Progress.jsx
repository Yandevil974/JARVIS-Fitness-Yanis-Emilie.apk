import React, { useState, useRef } from "react";
import { useApp } from "../store/AppContext.jsx";
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
  Metric,
  ProgressBar,
  Ring,
} from "../components/ui.jsx";
import { LineChart, BarChart } from "../components/Charts.jsx";
import Anatomy from "../components/Anatomy.jsx";
import {
  stats,
  chartSeries,
  forceSummary,
  personalRecords,
  muscleBalance,
  weeklyReport,
  periodReport,
  level,
  allSets,
} from "../engine/fitness.js";
import {
  EXERCISES,
  exerciseById,
  MUSCLES,
  legacy,
  MEASURES,
} from "../data/library.js";
import {
  numberLabel,
  dateLabel,
  today,
  rangeStart,
  addDays,
  uid,
  download,
  assetSrc,
  pctChange,
} from "../engine/utils.js";
const RANGE = ["jour", "semaine", "mois", "trimestre", "année"];
export default function Progress() {
  const { tab, setTab, p, setModal } = useApp();
  const value = ["force", "records"].includes(tab)
    ? "records"
    : tab || "overview";
  return (
    <>
      <PageHeading
        eyebrow="DES DONNÉES RÉELLES. DES PROGRÈS VISIBLES."
        title="Mesurez le chemin parcouru."
        description="Votre progression ne tient pas à un seul chiffre."
      >
        <Button
          variant="secondary"
          icon="Download"
          onClick={() => exportCSV(p)}
        >
          Exporter les performances
        </Button>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setModal({ type: "log" })}
        >
          Ajouter une mesure
        </Button>
      </PageHeading>
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["overview", "Analyse"],
          ["records", "Force & records"],
          ["balance", "Équilibre musculaire"],
          ["body", "Corps"],
          ["photos", "Photos"],
          ["reports", "Rapports"],
        ]}
      />
      {value === "records" ? (
        <Records />
      ) : value === "balance" ? (
        <Balance />
      ) : value === "body" ? (
        <Body />
      ) : value === "photos" ? (
        <Photos />
      ) : value === "reports" ? (
        <Reports />
      ) : (
        <Analytics />
      )}
    </>
  );
}
function RangeFilter({ value, onChange }) {
  return (
    <div className="range-filter">
      {RANGE.map((r) => (
        <button
          key={r}
          className={value === r ? "active" : ""}
          onClick={() => onChange(r)}
        >
          {r === "semaine"
            ? "Sem."
            : r === "trimestre"
              ? "Trim."
              : r[0].toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
}
function Analytics() {
  const { p, setModal } = useApp();
  const [range, setRange] = useState("mois"),
    [metric, setMetric] = useState("tonnage"),
    [exId, setExId] = useState(
      allSets(p)[0]?.exerciseId ||
        EXERCISES.find((e) => e.name === "Développé couché barre").id,
    );
  const data = stats(p, range);
  const points = chartSeries(p, metric, range, exId, exerciseById(exId).unit);
  const metrics = {
    tonnage: ["Tonnage", "kg"],
    weight: ["Poids corporel", "kg"],
    "1rm": ["1RM estimé", "kg"],
    load: ["Charge maximale réalisée", "kg"],
    sets: ["Séries effectuées", "séries"],
    reps: ["Répétitions", "reps"],
    frequency: ["Fréquence des séances", "séances"],
    cardio: ["Durée cardio & piscine", "min"],
    swim: ["Distance natation", "m"],
  };
  return (
    <>
      <div className="analytics-toolbar">
        <div>
          <h2>Vue d’ensemble</h2>
          <p>
            {dateLabel(data.start)} — {dateLabel(today())}
          </p>
        </div>
        <RangeFilter value={range} onChange={setRange} />
      </div>
      <div className="metrics-grid analytics-metrics">
        <Metric
          icon="Dumbbell"
          label="Séances terminées"
          value={data.sessions}
          detail="Partielles exclues de ce compteur"
        />
        <Metric
          icon="Layers3"
          label="Tonnage"
          value={numberLabel(data.tonnage, 0)}
          unit="kg"
          detail={`${data.sets} séries · ${data.reps} répétitions`}
          color="blue"
        />
        <Metric
          icon="Clock3"
          label="Temps d’entraînement"
          value={data.minutes}
          unit="min"
          detail="Durées effectivement enregistrées"
          color="amber"
        />
        <Metric
          icon="HeartPulse"
          label="Récupération moyenne"
          value={data.recovery ?? "—"}
          unit={data.recovery != null ? "/100" : ""}
          detail={
            data.recovery == null
              ? "Donnée insuffisante"
              : "D’après vos bilans sur la période"
          }
          color="pink"
        />
      </div>
      <Panel className="analytics-chart">
        <SectionHeading
          title={metrics[metric][0]}
          subtitle="Observations enregistrées uniquement. Aucun point simulé."
        >
          <Select
            aria-label="Indicateur du graphique"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {Object.entries(metrics).map(([k, [n]]) => (
              <option value={k} key={k}>
                {n}
              </option>
            ))}
          </Select>
        </SectionHeading>
        {["1rm", "load"].includes(metric) && (
          <Select
            value={exId}
            onChange={(e) => setExId(e.target.value)}
            aria-label="Exercice du graphique"
          >
            {EXERCISES.filter((e) => !e.bodyweight && !e.timed).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
        )}
        <LineChart
          points={points}
          unit={metrics[metric][1]}
          height={265}
          emptyAction="Renseigner une performance"
          onEmpty={() =>
            setModal({ type: metric === "weight" ? "measurement" : "log" })
          }
        />
        <div className="chart-footnote">
          <span>
            <i /> {points.length} observations
          </span>
          <span>
            Les kg/main et kg totaux restent des conventions distinctes.
          </span>
        </div>
      </Panel>
      <div className="two-columns">
        <Panel>
          <SectionHeading
            title="Charge globale"
            subtitle="Musculation + cardio + piscine, sans double comptage."
          />
          <div className="big-inline-metric">
            {numberLabel(data.load, 0)}
            <span>unités sRPE connues</span>
          </div>
          <p className="small-subtitle">
            Durée en minutes × RPE de séance, uniquement lorsque les deux
            données sont connues. Cet indicateur heuristique aide à
            contextualiser la fatigue ; il ne constitue pas un score clinique.
          </p>
        </Panel>
        <Panel>
          <SectionHeading title="La tendance, pas la promesse" />
          <WeightTrend p={p} />
        </Panel>
      </div>
    </>
  );
}
function WeightTrend({ p }) {
  const ms = p.measurements
    .filter((m) => m.weight != null && m.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (ms.length < 3)
    return (
      <p className="small-subtitle">
        Au moins trois pesées datées sont nécessaires pour estimer une tendance.
        Le poids du profil n’est pas une observation récente.
      </p>
    );
  const n = ms.length,
    x = ms.map((m) => Date.parse(m.date) / 864e5),
    y = ms.map((m) => m.weight);
  const mx = x.reduce((a, b) => a + b) / n,
    my = y.reduce((a, b) => a + b) / n;
  const denominator = x.reduce((s, v) => s + (v - mx) ** 2, 0);
  if (!denominator)
    return (
      <p className="small-subtitle">
        Des pesées sur plusieurs dates sont nécessaires.
      </p>
    );
  const slope =
    x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / denominator;
  return (
    <>
      <div className="big-inline-metric">
        {slope > 0 ? "+" : ""}
        {numberLabel(slope * 7, 2)}
        <span>kg / semaine</span>
      </div>
      <p className="small-subtitle">
        Régression linéaire sur {n} pesées. Les fluctuations d’eau et la
        composition corporelle ne sont pas distinguées. Ce n’est ni une promesse
        de résultat ni une recommandation de régime.
      </p>
    </>
  );
}
function Records() {
  const { p, setModal } = useApp();
  const rs = personalRecords(p);
  const [selected, setSelected] = useState(
    rs.find((r) => r.best1RM)?.exerciseId ||
      EXERCISES.find((e) => e.name === "Développé couché barre").id,
  );
  const ex = exerciseById(selected);
  const [unit, setUnit] = useState(ex.unit);
  const f = forceSummary(p, selected, unit);
  const lvl = level(p);
  const achievements = [
    ["Flag", "Premier pas", "Une séance terminée", lvl.count >= 1],
    ["Flame", "La constance", "10 séances terminées", lvl.count >= 10],
    [
      "Waves",
      "Dans le grand bain",
      "Une séance piscine enregistrée",
      p.activities.some((a) => a.type === "swim"),
    ],
    [
      "HeartPulse",
      "À l’écoute",
      "7 bilans de récupération",
      Object.keys(p.checkIns).length >= 7,
    ],
    [
      "Trophy",
      "Plus fort qu’hier",
      "Un record dépassé",
      p.notifications.some((n) => n.type === "record"),
    ],
    [
      "Target",
      "Un cap atteint",
      "Un objectif validé",
      p.goals.some((g) => g.done),
    ],
  ];
  return (
    <>
      <div className="force-heading">
        <div>
          <h2>Vos repères de force</h2>
          <p>Un exercice. Une unité. Un historique comparable.</p>
        </div>
        <Button
          variant="primary"
          icon="Calculator"
          onClick={() => setModal({ type: "force-test" })}
        >
          Calculer mon 1RM
        </Button>
      </div>
      <Panel className="force-panel">
        <div className="force-select">
          <Select
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setUnit(exerciseById(e.target.value).unit);
            }}
            aria-label="Exercice du bilan de force"
          >
            {EXERCISES.filter((e) => !e.bodyweight && !e.timed).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
          <Select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            aria-label="Convention de charge"
          >
            <option value="kg total">kg total</option>
            <option value="kg/main">kg par haltère</option>
            <option value="source à vérifier">Unités source à vérifier</option>
          </Select>
        </div>
        <div className="force-values">
          {[
            ["ACTUEL", f.current],
            ["MEILLEUR", f.best],
            ["PRÉCÉDENT", f.previous],
            ["ÉVOLUTION", f.change],
          ].map(([k, v], i) => (
            <div key={k}>
              <span>{k}</span>
              <strong>
                {numberLabel(v)}
                <small>{v != null ? (i === 3 ? "%" : "kg") : ""}</small>
              </strong>
            </div>
          ))}
        </div>
        <LineChart points={f.points} unit="kg" height={195} />
        <div className="info-line">
          <Icon name="Info" size={15} />
          <span>
            Epley : charge × (1 + reps/30). À 1 rep : charge réalisée.
            Estimation moins fiable au-delà de 10 reps ; aucun transfert entre
            exercices.
          </span>
        </div>
        {f.lastDate && (
          <p className="small-subtitle">
            Dernière référence : {dateLabel(f.lastDate)} · réévaluation
            indicative après 8 semaines, sans obligation de test maximal.
          </p>
        )}
      </Panel>
      <div className="reference-history">
        {p.forceTests.length > 0 && (
          <SectionHeading
            title="Mes références enregistrées"
            subtitle="Corrigez l’exercice, la convention et la date des références importées avant leur réutilisation."
          />
        )}
        {p.forceTests
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((t) => (
            <Panel key={t.id}>
              <Icon name="Gauge" size={19} />
              <div>
                <strong>
                  {exerciseById(t.exerciseId).name} · {t.estimate} kg
                </strong>
                <p>
                  {t.date ? dateLabel(t.date) : "Date à préciser"} · {t.unit}
                  {t.declared ? " · référence déclarée" : " · estimation"}
                </p>
              </div>
              <Button
                variant="secondary small"
                icon="Pencil"
                onClick={() => setModal({ type: "force-test", testId: t.id })}
              >
                Vérifier / modifier
              </Button>
            </Panel>
          ))}
      </div>
      <SectionHeading
        title="Mes records"
        subtitle="Le premier résultat est une référence ; les améliorations sont détectées ensuite."
      />
      {rs.length ? (
        <div className="record-grid">
          {rs.map((r) => (
            <Panel className="record-card" key={r.exerciseId + r.unit}>
              <span className="record-icon">
                <Icon name="Trophy" size={22} />
              </span>
              <h3>{r.name}</h3>
              <p>{r.unit}</p>
              <div className="record-value">
                {numberLabel(r.best1RM ?? r.weight ?? r.reps)}
                <small>
                  {r.best1RM
                    ? "kg · 1RM estimé"
                    : r.weight
                      ? "kg · charge maximale"
                      : "reps / secondes"}
                </small>
              </div>
              <div className="record-meta">
                <span>
                  Charge max. <b>{numberLabel(r.weight)} kg</b>
                </span>
                <span>
                  Répétitions max. <b>{r.reps ?? "—"}</b>
                </span>
                <span>
                  Tonnage max. par série <b>{numberLabel(r.volume)} kg</b>
                </span>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel>
          <Empty
            compact
            icon="Trophy"
            title="Votre premier repère vous attend"
            text="Aucun record inventé. Ajoutez une performance réelle pour commencer."
          />
        </Panel>
      )}
      <ActivityRecords />
      {p.badges?.length > 0 && (
        <Panel className="imported-badges">
          <SectionHeading
            title="Vos badges du fichier d’origine"
            subtitle="Attributions historiques conservées, distinctes des nouveaux succès JARVIS. Elles ne prouvent pas un nouveau résultat."
          />
          <div>
            {p.badges.map((id) => {
              const badge = legacy[p.id].BADGES.find((b) => b.id === id);
              return (
                <span key={id}>
                  <b>
                    {badge?.ic || "🏅"} {badge?.n || id}
                  </b>
                  <small>{badge?.d || "Badge importé"}</small>
                </span>
              );
            })}
          </div>
        </Panel>
      )}

      <div className="level-card">
        <div className="level-seal">
          <Icon name="ShieldCheck" size={45} />
        </div>
        <div>
          <div className="eyebrow">VOTRE PARCOURS</div>
          <h2>{lvl.name}</h2>
          <p>
            {lvl.next
              ? `${lvl.next - lvl.count} séances pour le prochain niveau.`
              : "Un parcours d’élite, construit dans la durée."}{" "}
            La qualité et le repos restent prioritaires.
          </p>
          <ProgressBar value={lvl.progress} />
        </div>
        <div className="level-steps">
          {["Débutant", "Intermédiaire", "Avancé", "Expert", "Élite"].map(
            (s, i) => (
              <span key={s} className={i <= lvl.index ? "active" : ""}>
                <i />
                {s}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="achievement-grid">
        {achievements.map(([ic, n, d, done]) => (
          <Panel className={`achievement ${done ? "unlocked" : ""}`} key={n}>
            <Icon name={done ? ic : "LockKeyhole"} size={25} />
            <h3>{n}</h3>
            <p>{d}</p>
            <Badge color={done ? "mint" : ""}>
              {done ? "Débloqué" : "À construire"}
            </Badge>
          </Panel>
        ))}
      </div>
    </>
  );
}
function ActivityRecords() {
  const { p } = useApp();
  if (!p.activities.length) return null;
  const swim = p.activities.filter((a) => a.type === "swim" && a.distance > 0),
    cardio = p.activities.filter((a) => a.type === "cardio" && a.distance > 0);
  const groups = {};
  for (const a of [...swim, ...cardio]) {
    const k = a.name + "|" + a.distance;
    if (!groups[k] || groups[k].durationSec > a.durationSec) groups[k] = a;
  }
  return (
    <>
      <SectionHeading
        title="Records cardio & piscine"
        subtitle="Les temps sont comparés à distance et activité identiques."
      />
      <div className="record-grid">
        {Object.values(groups).map((a) => (
          <Panel key={a.id}>
            <Badge color="blue">
              {a.type === "swim" ? "PISCINE" : "CARDIO"}
            </Badge>
            <h3>{a.name}</h3>
            <div className="record-value">
              {numberLabel(a.distance)}
              <small>mètres · {numberLabel(a.durationSec / 60)} minutes</small>
            </div>
            <p className="small-subtitle">
              Meilleur temps enregistré sur cette distance exacte.
            </p>
          </Panel>
        ))}
      </div>
    </>
  );
}
function Balance() {
  const { p, updateProfile } = useApp();
  const [range, setRange] = useState("semaine"),
    [selected, setSelected] = useState("dos");
  const data = muscleBalance(p, rangeStart(range));
  const hasData = data.some((m) => m.sets > 0);
  const report = periodReport(p, range);
  return (
    <>
      <div className="analytics-toolbar">
        <div>
          <h2>Un corps fort. Un ensemble équilibré.</h2>
          <p>
            Séries directes réalisées, comparées à vos repères configurables.
          </p>
        </div>
        <RangeFilter value={range} onChange={setRange} />
      </div>
      <div className="balance-layout">
        <Panel className="balance-body">
          <Anatomy primary={[selected]} secondary={[]} onSelect={setSelected} />
          <h3>{MUSCLES[selected]}</h3>
          <p>
            {data.find((m) => m.muscle === selected)?.sets || 0} séries
            enregistrées sur la période
          </p>
        </Panel>
        <Panel>
          <SectionHeading
            title="Volume par groupe musculaire"
            subtitle="Repères hebdomadaires proratisés au nombre de jours de la période."
          />
          <div className="balance-bars">
            {data.map((m) => (
              <div
                className={selected === m.muscle ? "selected" : ""}
                key={m.muscle}
              >
                <button onClick={() => setSelected(m.muscle)}>
                  <span>{MUSCLES[m.muscle]}</span>
                  <strong>
                    {m.sets} <small>séries</small>
                  </strong>
                  <b>{hasData ? `${m.percent} %` : "—"}</b>
                </button>
                <ProgressBar
                  value={m.percent}
                  color={m.percent > 150 ? "amber" : ""}
                />
                <label>
                  Repère / semaine{" "}
                  <input
                    type="number"
                    aria-label={`Repère hebdomadaire ${MUSCLES[m.muscle]}`}
                    min="1"
                    max="30"
                    value={m.weeklyTarget}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (n >= 1 && n <= 30)
                        updateProfile((q) => {
                          q.preferences.muscleTargets[m.muscle] = n;
                        });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="insight-banner">
        <Icon name="Sparkles" size={23} />
        <div>
          <h3>Lecture JARVIS</h3>
          <p>
            {hasData
              ? report.recommendations.join(" ")
              : "Donnée insuffisante pour conclure à un déséquilibre. Enregistrez plusieurs séances complètes avant d’interpréter les écarts."}
          </p>
          <small>
            Ces pourcentages décrivent un volume relatif, pas la santé ou le
            développement d’un muscle.
          </small>
        </div>
      </div>
    </>
  );
}
function Body() {
  const { p, setModal } = useApp();
  const list = [...p.measurements].sort((a, b) => b.date.localeCompare(a.date));
  const current = list.find((m) => m.weight != null);
  const start = [...list].reverse().find((m) => m.weight != null);
  const change =
    current && start && current.id !== start.id
      ? current.weight - start.weight
      : null;
  return (
    <>
      <SectionHeading
        title="Votre évolution corporelle"
        subtitle="Poids, composition déclarée et mensurations, dans leur contexte."
      >
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setModal({ type: "measurement" })}
        >
          Ajouter un relevé
        </Button>
      </SectionHeading>
      <div className="body-metrics">
        <Metric
          icon="Scale"
          label="Dernière pesée"
          value={current ? numberLabel(current.weight) : "—"}
          unit={current ? "kg" : ""}
          detail={
            current
              ? dateLabel(current.date)
              : p.user.weight
                ? `Profil source : ${p.user.weight} kg, à actualiser`
                : "Aucune pesée enregistrée"
          }
        />
        <Metric
          icon="TrendingUp"
          label="Variation observée"
          value={
            change != null
              ? `${change > 0 ? "+" : ""}${numberLabel(change)}`
              : "—"
          }
          unit={change != null ? "kg" : ""}
          detail="Entre première et dernière pesée"
          color="blue"
        />
        <Metric
          icon="Target"
          label="Objectif du profil"
          value={p.user.targetWeight ?? "—"}
          unit={p.user.targetWeight ? "kg" : ""}
          detail="Modifiable dans votre profil"
          color="amber"
        />
      </div>
      {p.sourceProfileMetrics && (
        <Panel className="source-profile-metrics">
          <SectionHeading
            title="Repères du profil sauvegardé"
            subtitle="Valeurs présentes dans votre JSON, pas de nouvelles mesures corporelles."
          />
          <div>
            <span>
              Poids de départ <b>{numberLabel(p.user.weight)} kg</b>
            </span>
            <span>
              Masse grasse du profil{" "}
              <b>{numberLabel(p.sourceProfileMetrics.bodyFat)} %</b>
            </span>
            <span>
              Masse maigre du profil{" "}
              <b>{numberLabel(p.sourceProfileMetrics.leanMass)} kg</b>
            </span>
          </div>
        </Panel>
      )}
      <Panel>
        <SectionHeading title="Poids dans le temps" />
        <LineChart
          points={chartSeries(p, "weight", "all")}
          unit="kg"
          height={220}
          emptyAction="Enregistrer mon poids"
          onEmpty={() => setModal({ type: "measurement" })}
        />
      </Panel>
      <Panel className="measurements-table">
        <SectionHeading title="Tous les relevés" />
        {list.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Poids</th>
                  <th>Masse grasse</th>
                  <th>Taille</th>
                  <th>Hanches</th>
                  <th>Poitrine</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id}>
                    <td>{dateLabel(m.date)}</td>
                    <td>{m.weight != null ? `${m.weight} kg` : "—"}</td>
                    <td>{m.bodyFat != null ? `${m.bodyFat} %` : "—"}</td>
                    <td>{m.values?.taille ? m.values.taille + " cm" : "—"}</td>
                    <td>
                      {m.values?.hanches ? m.values.hanches + " cm" : "—"}
                    </td>
                    <td>
                      {m.values?.poitrine ? m.values.poitrine + " cm" : "—"}
                    </td>
                    <td>
                      <IconButton
                        icon="Pencil"
                        label="Modifier le relevé"
                        onClick={() =>
                          setModal({ type: "measurement", measurementId: m.id })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            compact
            icon="Ruler"
            title="Des repères qui vous ressemblent"
            text="Ajoutez un relevé de départ, puis mesurez dans des conditions comparables."
          />
        )}
      </Panel>
    </>
  );
}
function Photos() {
  const { p, updateProfile, notify, setModal } = useApp();
  const file = useRef();
  const [date, setDate] = useState(today()),
    [view, setView] = useState("face"),
    [left, setLeft] = useState(p.photos[0]?.id || ""),
    [right, setRight] = useState(
      p.photos.filter((x) => x.view === (p.photos[0]?.view || "face")).at(-1)
        ?.id || "",
    ),
    [slider, setSlider] = useState(50),
    [busy, setBusy] = useState(false);
  const a = p.photos.find((x) => x.id === left),
    b = p.photos.find((x) => x.id === right);
  async function upload(f) {
    if (!f) return;
    if (!date || date > today()) {
      notify("Choisissez une date réelle pour cette photo.", "error");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
      f.size > 15e6
    ) {
      notify(
        "Choisissez une image JPEG, PNG ou WebP de moins de 15 Mo.",
        "error",
      );
      return;
    }
    setBusy(true);
    try {
      const image = await createImageBitmap(f);
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();
      const photo = {
        id: uid(),
        date,
        view,
        data: canvas.toDataURL("image/jpeg", 0.78),
        source: "user",
        simulated: false,
      };
      updateProfile((q) => {
        q.photos.push(photo);
      });
      if (!left) setLeft(photo.id);
      setRight(photo.id);
      notify("Photo compressée et sauvegardée localement.");
    } catch (e) {
      notify("L’image n’a pas pu être chargée.", "error");
    } finally {
      setBusy(false);
      file.current.value = "";
    }
  }
  return (
    <>
      <div className="photo-intro">
        <div>
          <h2>Le progrès se voit aussi.</h2>
          <p>
            Des photos privées, dans des conditions comparables. Aucune photo
            envoyée sur un serveur.
          </p>
        </div>
        <div className="photo-controls">
          <Input
            type="date"
            aria-label="Date de la photo"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
          />
          <Select
            aria-label="Vue de la photo"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="face">Face</option>
            <option value="profil">Profil</option>
            <option value="dos">Dos</option>
            <option value="compl">Complément</option>
          </Select>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={file}
            hidden
            onChange={(e) => upload(e.target.files[0])}
          />
          <Button
            variant="primary"
            icon="Camera"
            disabled={busy}
            onClick={() => file.current.click()}
          >
            {busy ? "Compression…" : "Ajouter une photo"}
          </Button>
        </div>
      </div>
      <Panel className="photo-comparison">
        <SectionHeading
          title="Avant. Après. Votre parcours."
          subtitle="Privilégiez la même vue, la même distance et la même lumière."
        />
        {p.photos.length >= 2 ? (
          <>
            <div className="form-grid">
              <Field label="Photo de départ">
                <Select value={left} onChange={(e) => setLeft(e.target.value)}>
                  {p.photos.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.label ||
                        (ph.date
                          ? dateLabel(ph.date)
                          : (ph.slot || "Date à préciser").toUpperCase())}{" "}
                      · {ph.view}
                      {ph.simulated ? " · SIMULATION" : ""}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Photo de comparaison">
                <Select
                  value={right}
                  onChange={(e) => setRight(e.target.value)}
                >
                  {p.photos.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.label ||
                        (ph.date
                          ? dateLabel(ph.date)
                          : (ph.slot || "Date à préciser").toUpperCase())}{" "}
                      · {ph.view}
                      {ph.simulated ? " · SIMULATION" : ""}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="comparison-stage">
              {b && <img src={assetSrc(b.data)} alt="Photo de comparaison" />}
              {a && (
                <img
                  className="comparison-before"
                  style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}
                  src={assetSrc(a.data)}
                  alt="Photo de départ"
                />
              )}
              <span className="comparison-label before">
                {a?.simulated ? "SIMULATION" : "AVANT"}
              </span>
              <span className="comparison-label after">
                {b?.simulated ? "SIMULATION" : "APRÈS"}
              </span>
              <i
                className="comparison-divider"
                style={{ left: `${slider}%` }}
              />
              <input
                aria-label="Curseur de comparaison avant-après"
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(e) => setSlider(e.target.value)}
              />
            </div>
          </>
        ) : (
          <Empty
            icon="Images"
            title="Un point de départ, puis un nouveau regard."
            text="Ajoutez au moins deux photos pour activer le comparateur interactif."
          />
        )}
      </Panel>
      <div className="photo-gallery">
        {p.photos.map((ph) => (
          <Panel key={ph.id}>
            <img
              src={assetSrc(ph.data)}
              alt={`Photo ${ph.view} du ${ph.date}`}
              loading="lazy"
            />
            <div>
              <strong>
                {ph.label ||
                  (ph.date
                    ? dateLabel(ph.date)
                    : (ph.slot || "Date à préciser").toUpperCase())}
              </strong>
              <Badge>{ph.simulated ? "Simulation" : ph.view}</Badge>
              <IconButton
                icon="Pencil"
                label="Modifier les informations de la photo"
                onClick={() => setModal({ type: "edit-photo", photoId: ph.id })}
              />
              <IconButton
                icon="Trash2"
                label="Supprimer la photo"
                onClick={() => setModal({ type: "delete-photo", id: ph.id })}
              />
            </div>
          </Panel>
        ))}
      </div>
      {p.id === "elite" && (
        <details className="source-photo-archive">
          <summary>
            <Icon name="Archive" size={16} /> Images intégrées à la source de
            Yanis · archive distincte <Icon name="ChevronDown" size={15} />
          </summary>
          <p>
            Les images J0 intégrées au fichier fourni sont conservées comme
            archive non vérifiée. Les images M12 étaient des simulations : elles
            ne constituent pas des résultats réels et ne sont jamais ajoutées à
            vos statistiques.
          </p>
          <div className="source-photo-grid">
            {Object.entries(legacy.elite.EMBEDDED_PHOTOS).flatMap(
              ([slot, views]) =>
                Object.entries(views).map(([v, path]) => (
                  <figure key={slot + v}>
                    <img
                      src={assetSrc(path)}
                      alt={`Archive ${slot}, vue ${v}`}
                      loading="lazy"
                    />
                    <figcaption>
                      {slot === "m12"
                        ? "SIMULATION M12"
                        : "SOURCE J0 NON VÉRIFIÉE"}{" "}
                      · {v}
                    </figcaption>
                  </figure>
                )),
            )}
          </div>
        </details>
      )}
    </>
  );
}
function Reports() {
  const { p, updateProfile, notify } = useApp();
  const [period, setPeriod] = useState("semaine");
  const r = periodReport(p, period),
    s = r.current;
  const suggestions = r.recommendations;
  const archive = () => {
    const key = period + "-" + s.start;
    updateProfile((q) => {
      q.reports = q.reports.filter((r) => r.key !== key);
      q.reports.unshift({
        id: uid(),
        key,
        period,
        start: s.start,
        end: today(),
        stats: s,
        recommendations: suggestions,
        savedAt: Date.now(),
      });
    });
    notify("Bilan archivé. Les données sources restent modifiables.");
  };
  const text = `# Rapport JARVIS — ${p.user.name || "Profil Yanis"}\n\nPériode : ${s.start} au ${today()}\n\n- Séances terminées : ${s.sessions}\n- Séries : ${s.sets}\n- Tonnage enregistré : ${s.tonnage} kg\n- Durée : ${s.minutes} min\n- Récupération moyenne : ${s.recovery ?? "Donnée insuffisante"}\n\n## Analyse et recommandations\n\n${suggestions.map((s) => "- " + s).join("\n")}\n\nAnalyse heuristique locale, non médicale. Les valeurs inconnues ne sont pas remplacées par des chiffres.\n`;
  return (
    <>
      <div className="report-toolbar">
        <div className="segmented">
          <button
            className={period === "semaine" ? "active" : ""}
            onClick={() => setPeriod("semaine")}
          >
            Hebdomadaire
          </button>
          <button
            className={period === "mois" ? "active" : ""}
            onClick={() => setPeriod("mois")}
          >
            Mensuel
          </button>
        </div>
        <div>
          <Button
            variant="secondary"
            icon="Printer"
            onClick={() => window.print()}
          >
            Imprimer
          </Button>
          <Button
            variant="secondary"
            icon="Download"
            onClick={() =>
              download(`JARVIS-rapport-${today()}.md`, text, "text/markdown")
            }
          >
            Exporter
          </Button>
          <Button variant="primary" icon="Archive" onClick={archive}>
            Archiver le bilan
          </Button>
        </div>
      </div>
      <Panel className="report-card">
        <div className="report-head">
          <Icon name="Sparkles" size={30} />
          <div>
            <div className="eyebrow">
              RAPPORT {period === "semaine" ? "HEBDOMADAIRE" : "MENSUEL"} JARVIS
            </div>
            <h2>Faire le point. Préparer la suite.</h2>
            <p>
              {dateLabel(s.start)} — {dateLabel(today())} · calculé
              automatiquement à partir de votre historique
            </p>
          </div>
          <Badge color="mint">ANALYSE LOCALE</Badge>
        </div>
        <div className="report-metrics">
          {[
            ["FORCE", r.forceChange, "%"],
            ["VOLUME", r.volumeChange, "%"],
            ["RÉGULARITÉ", s.adherence, "%"],
            ["RÉCUPÉRATION", s.recovery, "/100"],
          ].map(([name, v, u]) => (
            <div key={name}>
              <span>{name}</span>
              <strong>
                {numberLabel(v)}
                <small>{v != null ? u : ""}</small>
              </strong>
              <p>
                {v == null
                  ? "Donnée insuffisante"
                  : name === "FORCE"
                    ? "Exercices comparables"
                    : name === "VOLUME"
                      ? "Par rapport à la période précédente"
                      : "Sur la période"}
              </p>
            </div>
          ))}
        </div>
        <div className="report-columns">
          <div>
            <h3>
              <Icon name="TrendingUp" size={19} /> Points forts
            </h3>
            <p>
              {s.sessions
                ? `${s.sessions} séances complètes documentées. ${s.sets} séries alimentent votre mémoire sportive.`
                : "Votre première séance documentée permettra d’identifier vos points forts."}
            </p>
            <h3>
              <Icon name="Focus" size={19} /> Points de vigilance
            </h3>
            <p>
              {r.undertrained.length
                ? `Faible volume direct sur cette période : ${r.undertrained.join(", ")}. À interpréter selon l’avancement de la semaine et votre objectif.`
                : "Pas assez de recul pour conclure à un déséquilibre ou à une stagnation."}
            </p>
          </div>
          <div>
            <h3>
              <Icon name="Dumbbell" size={19} /> Exercices en progression
            </h3>
            <p>
              {r.improving.length
                ? r.improving.join(" · ")
                : "Deux séances comparables sont nécessaires."}
            </p>
            <h3>
              <Icon name="Minus" size={19} /> Plateaux à surveiller
            </h3>
            <p>
              {r.stagnant.length
                ? r.stagnant.join(" · ")
                : "Aucun plateau établi avec les données disponibles."}
            </p>
          </div>
        </div>
        <div className="report-recommendations">
          <h3>
            <Icon name="Sparkles" size={19} /> Recommandations pour la suite
          </h3>
          {suggestions.map((txt, i) => (
            <div key={i}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{txt}</p>
            </div>
          ))}
        </div>
        <p className="report-note">
          La régularité compare les séances prévues à date et les séances
          marquées terminées. Le repos n’est pas un échec. Les estimations ne
          remplacent pas l’avis d’un professionnel.
        </p>
      </Panel>
      <SectionHeading title="Vos bilans archivés" />
      {p.reports.length ? (
        <div className="archived-reports">
          {p.reports.map((a) => (
            <details key={a.id}>
              <summary>
                <Icon name="FileChartColumn" size={20} />
                <strong>
                  Bilan {a.period === "semaine" ? "hebdomadaire" : "mensuel"}
                </strong>
                <span>
                  {dateLabel(a.start)} — {dateLabel(a.end)}
                </span>
                <Icon name="ChevronDown" size={16} />
              </summary>
              <p>
                {a.stats.sessions} séances · {a.stats.tonnage} kg de tonnage ·
                récupération {a.stats.recovery ?? "inconnue"}
              </p>
              {a.recommendations.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </details>
          ))}
        </div>
      ) : (
        <Panel>
          <Empty
            compact
            icon="Files"
            title="Les bilans méritent aussi une mémoire."
            text="Archivez un rapport pour retrouver la lecture du moment, même si vos données évoluent."
          />
        </Panel>
      )}
    </>
  );
}
function exportCSV(p) {
  const rows = [
    [
      "date",
      "exercice",
      "charge_kg",
      "repetitions_ou_secondes",
      "nombre_series",
      "unite",
      "RPE",
      "RIR",
    ],
    ...allSets(p).map((s) => [
      s.date,
      exerciseById(s.exerciseId).name,
      s.weight ?? "",
      s.reps,
      s.count || 1,
      s.unit,
      s.rpe ?? "",
      s.rir ?? "",
    ]),
  ];
  const csv = rows
    .map((r) =>
      r
        .map(
          (v) =>
            '"' +
            String(v)
              .replace(/^[=+@\-\t\r]/, (c) => "'" + c)
              .replace(/"/g, '""') +
            '"',
        )
        .join(";"),
    )
    .join("\n");
  download(
    `JARVIS-performances-${today()}.csv`,
    "\uFEFF" + csv,
    "text/csv;charset=utf-8",
  );
}
