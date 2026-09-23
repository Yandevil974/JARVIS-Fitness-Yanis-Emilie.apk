import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  Panel,
  SectionHeading,
  Button,
  Icon,
  IconButton,
  Badge,
  Tabs,
  Field,
  Input,
  Select,
  Empty,
  Metric,
} from "../components/ui.jsx";
import { POOL_PROTOCOLS, legacy } from "../data/library.js";
import { intervalSteps } from "../engine/timer.js";
import { recoveryScore, stats } from "../engine/fitness.js";
import { heartZones } from "../engine/nutrition.js";
import { today, addDays, dateLabel, numberLabel } from "../engine/utils.js";
const MODALITIES = [
  ["running", "Footprints", "Course"],
  ["bike", "Bike", "Vélo"],
  ["elliptical", "Activity", "Elliptique"],
  ["walking", "Footprints", "Marche"],
  ["rowing", "Sailboat", "Rameur"],
  ["free", "HeartPulse", "Cardio libre"],
];
export default function Cardio() {
  const { p, tab, setTab, setModal } = useApp();
  const value =
    tab === "hiit"
      ? "hiit"
      : tab === "swim"
        ? "swim"
        : tab === "history"
          ? "history"
          : "cardio";
  const s = stats(p, "semaine");
  return (
    <>
      <PageHeading
        eyebrow="PLUSIEURS DISCIPLINES. UNE SEULE PROGRESSION."
        title="Le souffle d’un athlète."
        description="Cardio, piscine et intervalles, intégrés à votre charge globale."
      >
        <Button
          variant="secondary"
          icon="Plus"
          onClick={() =>
            setModal({
              type: "log-activity",
              data: { type: value === "swim" ? "swim" : "cardio" },
            })
          }
        >
          Saisir une activité
        </Button>
      </PageHeading>
      <div className="cardio-summary">
        <span>
          <Icon name="Clock3" size={19} />
          <strong>
            {s.cardioMinutes} <small>min</small>
          </strong>
          cette semaine
        </span>
        <span>
          <Icon name="Waves" size={20} />
          <strong>
            {numberLabel(s.swimDistance)} <small>m</small>
          </strong>
          de natation
        </span>
        <span>
          <Icon name="Activity" size={19} />
          <strong>
            {p.activities.filter((a) => a.date >= s.start).length}
          </strong>
          activités enregistrées
        </span>
      </div>
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["cardio", "Cardio"],
          ["swim", "Piscine"],
          ["hiit", "HIIT & Tabata"],
          ["history", "Historique"],
        ]}
      />
      {value === "swim" ? (
        <Swim />
      ) : value === "hiit" ? (
        <Hiit />
      ) : value === "history" ? (
        <ActivityHistory />
      ) : (
        <CardioGenerator />
      )}
    </>
  );
}
function CardioGenerator() {
  const { p, setTimer, setModal, notify } = useApp();
  const [modality, setModality] = useState("elliptical"),
    [mode, setMode] = useState("endurance"),
    [duration, setDuration] = useState(30);
  const name = MODALITIES.find((m) => m[0] === modality)[2];
  const score = recoveryScore(p).score;
  const zones = heartZones(p);
  const legsTomorrow = p.plan?.sessions.some(
    (s) =>
      s.date === addDays(today(), 1) &&
      s.status === "planned" &&
      s.focus?.some((m) => ["qua", "isc", "fes"].includes(m)),
  );
  const warning =
    (score != null && score < 55) ||
    (legsTomorrow && ["intervals", "hiit"].includes(mode));
  function start() {
    const d = Number(duration);
    if (d < 5 || d > 180) {
      notify("Choisissez une durée de 5 à 180 minutes.", "error");
      return;
    }
    let effective = warning ? "recovery" : mode;
    if (warning)
      notify(
        "Intensité allégée : mode récupération, pour préserver votre prochaine séance.",
        "info",
      );
    let steps;
    const total = d * 60,
      warm = Math.min(180, total * 0.2),
      cool = Math.min(120, total * 0.15),
      middle = total - warm - cool;
    if (["intervals", "hiit"].includes(effective)) {
      const work = effective === "hiit" ? 30 : 60,
        rest = work;
      const rounds = Math.floor(middle / (work + rest));
      steps = intervalSteps({
        work,
        rest,
        rounds,
        warmup: warm,
        cooldown: cool,
        movements: [`${name} · effort maîtrisé`],
      });
      const missing = total - steps.reduce((n, s) => n + s.seconds, 0);
      if (missing > 0)
        steps.splice(-1, 0, {
          name: `${name} · allure facile`,
          seconds: missing,
          pattern: "walk",
        });
    } else
      steps = [
        { name: "Échauffement progressif", seconds: warm, pattern: "walk" },
        {
          name: `${name} · ${effective === "recovery" ? "allure très facile" : effective === "moderate" ? "allure modérée" : "endurance douce"}`,
          seconds: middle,
          pattern: "walk",
        },
        { name: "Retour au calme", seconds: cool, pattern: "breathe" },
      ];
    setTimer(steps, { type: "cardio", name, modality, mode: effective });
  }
  return (
    <div className="cardio-generator-layout">
      <div>
        <div className="cardio-feature">
          <div>
            <Badge color="blue" dot>
              CONSTRUIRE VOTRE ENDURANCE
            </Badge>
            <h2>
              Le bon rythme.
              <br />
              La juste intensité.
            </h2>
            <p>
              Un effort qui respecte votre récupération.
              <br />
              Pas une course à l’épuisement.
            </p>
          </div>
          <div className="pulse-art" aria-hidden="true">
            <svg viewBox="0 0 320 160">
              <path d="M0 90H75L96 67 116 107 143 27 172 137 200 70 219 90H320" />
            </svg>
            <i />
            <b />
          </div>
        </div>
        <Panel>
          <SectionHeading title="Choisissez votre discipline" />
          <div className="modality-grid">
            {MODALITIES.map(([id, icon, name]) => (
              <button
                key={id}
                className={id === modality ? "active" : ""}
                onClick={() => setModality(id)}
              >
                <Icon name={icon} size={26} />
                <span>{name}</span>
                {id === modality && <Icon name="CircleCheck" size={13} />}
              </button>
            ))}
          </div>
          <div className="form-grid">
            <Field label="Intention de la séance">
              <Select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="endurance">Endurance douce</option>
                <option value="moderate">Modéré</option>
                <option value="intervals">Intervalles 60/60</option>
                <option value="hiit">HIIT 30/30</option>
                <option value="recovery">Récupération active</option>
              </Select>
            </Field>
            <Field label="Durée prévue (minutes)">
              <Input
                type="number"
                min="5"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Field>
          </div>
          <div className="duration-presets">
            {[10, 20, 30, 45, 60].map((d) => (
              <button
                className={Number(duration) === d ? "active" : ""}
                key={d}
                onClick={() => setDuration(d)}
              >
                {d} min
              </button>
            ))}
          </div>
          {warning && (
            <div className="warning-box">
              <Icon name="ShieldCheck" size={19} />
              <p>
                {legsTomorrow
                  ? "Une séance jambes est prévue demain."
                  : "Votre récupération est faible."}{" "}
                Le lancement guidé utilisera une intensité de récupération, sans
                intervalles durs.
              </p>
            </div>
          )}
          <div className="generator-actions">
            <Button variant="primary" icon="Play" onClick={start}>
              Lancer le cardio guidé
            </Button>
            <Button
              variant="secondary"
              icon="ClipboardPen"
              onClick={() =>
                setModal({
                  type: "log-activity",
                  data: { type: "cardio", name, mode },
                })
              }
            >
              Déjà effectué ? Saisir
            </Button>
          </div>
        </Panel>
      </div>
      <aside>
        <Panel>
          <SectionHeading
            title="Vos zones cardiaques"
            subtitle="Repères estimés, pas des données de capteur."
          />
          {zones ? (
            <>
              <div className="heart-max">
                <Icon name="HeartPulse" />
                <strong>
                  {zones.max}
                  <small>bpm</small>
                </strong>
                <span>FC maximale estimée</span>
              </div>
              <div className="heart-zones">
                {zones.zones.map((z) => (
                  <div key={z.zone}>
                    <span>Z{z.zone}</span>
                    <div>
                      <strong>{z.name}</strong>
                      <small>
                        {z.min}–{z.max} bpm
                      </small>
                    </div>
                    <i className={`z${z.zone}`} />
                  </div>
                ))}
              </div>
              <p className="small-subtitle">
                Tanaka : 208 − 0,7 × âge. Variabilité individuelle importante.
                Privilégiez aussi le ressenti et le test de la parole.
              </p>
            </>
          ) : (
            <Empty
              compact
              icon="HeartPulse"
              title="Donnée insuffisante"
              text="Renseignez votre âge dans Profil pour obtenir des zones estimées."
            />
          )}
        </Panel>
        <div className="safety-note">
          <Icon name="Info" />
          <span>
            Une activité n’est ajoutée à l’historique qu’après confirmation de
            sa réalisation. Le temps prévu n’est pas un record.
          </span>
        </div>
      </aside>
    </div>
  );
}
function Swim() {
  const { p, setTimer, setModal, notify, updateProfile } = useApp();
  const [rounds, setRounds] = useState(10),
    [distance, setDistance] = useState(25),
    [rest, setRest] = useState(30),
    [pace, setPace] = useState(35),
    [style, setStyle] = useState("Crawl"),
    [level, setLevel] = useState(0);
  function start() {
    if (
      !rounds ||
      rounds < 1 ||
      rounds > 60 ||
      distance < 5 ||
      distance > 400 ||
      pace < 5 ||
      rest < 0
    ) {
      notify(
        "Vérifiez le nombre de séries, la distance et les durées.",
        "error",
      );
      return;
    }
    const steps = intervalSteps({
      rounds: Number(rounds),
      work: Number(pace),
      rest: Number(rest),
      warmup: 180,
      cooldown: 120,
      movements: [`${style} · ${distance} m prévus`],
      aqua: true,
    });
    setTimer(steps, {
      type: "swim",
      name: `${rounds} × ${distance} m · ${style}`,
      style,
      rounds: Number(rounds),
      rest: Number(rest),
      distancePlanned: Number(rounds) * Number(distance),
    });
  }
  return (
    <>
      <div className="swim-feature">
        <div>
          <Badge color="blue" dot>
            POOL LAB
          </Badge>
          <h2>
            Changez d’élément.
            <br />
            Gardez votre cap.
          </h2>
          <p>
            Natation, récupération active et Aqua HIIT.
            <br />
            En longueurs ou dans votre petit bassin.
          </p>
          <div className="swim-tags">
            <span>ENDURANCE</span>
            <i />
            <span>TECHNIQUE</span>
            <i />
            <span>RÉCUPÉRATION</span>
          </div>
        </div>
        <div className="water-art" aria-hidden="true">
          <svg viewBox="0 0 400 270">
            <path d="M15 140Q65 105 115 140T215 140T315 140T415 140M-15 177Q35 142 85 177T185 177T285 177T385 177M15 214Q65 179 115 214T215 214T315 214T415 214" />
            <circle cx="232" cy="73" r="19" />
            <path d="M167 123L214 100 276 119M165 123L123 80 176 48" />
          </svg>
        </div>
      </div>
      <div className="two-columns">
        <Panel className="swim-builder">
          <SectionHeading
            title="Nage en longueurs"
            subtitle="Distance prévue et temps cible sont distincts de vos résultats."
          />
          <div className="form-grid three">
            <Field label="Séries">
              <Input
                type="number"
                min="1"
                max="60"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
              />
            </Field>
            <Field label="Distance / série (m)">
              <Select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              >
                {[25, 50, 100, 200, 400].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
            </Field>
            <Field label="Récupération (s)">
              <Input
                type="number"
                min="0"
                max="300"
                value={rest}
                onChange={(e) => setRest(e.target.value)}
              />
            </Field>
            <Field label="Style">
              <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                {["Crawl", "Brasse", "Dos", "Papillon", "Libre"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </Field>
            <Field label="Temps cible / série (s)">
              <Input
                type="number"
                min="5"
                max="600"
                value={pace}
                onChange={(e) => setPace(e.target.value)}
              />
            </Field>
            <div className="planned-distance">
              <strong>
                {Number(rounds) * Number(distance)}
                <small>m</small>
              </strong>
              <span>distance prévue</span>
            </div>
          </div>
          <Button variant="primary" icon="Play" onClick={start}>
            Lancer le fractionné
          </Button>
        </Panel>
        <Panel className="pool-preferences">
          <SectionHeading
            title="La piscine dans votre semaine"
            subtitle="Préférences pour les activités complémentaires."
          />
          <div className="day-picker">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <button
                className={p.preferences.poolDays.includes(i) ? "active" : ""}
                key={i}
                aria-label={`Piscine le ${["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"][i]}`}
                onClick={() =>
                  updateProfile((q) => {
                    q.preferences.poolDays = q.preferences.poolDays.includes(i)
                      ? q.preferences.poolDays.filter((v) => v !== i)
                      : [...q.preferences.poolDays, i];
                  })
                }
              >
                {d}
              </button>
            ))}
          </div>
          <p>
            Ces jours sont mémorisés comme préférences. Ajoutez les séances au
            calendrier pour fixer un horaire ; la charge est comptabilisée après
            réalisation.
          </p>
          <Button
            variant="secondary"
            icon="CalendarPlus"
            onClick={() =>
              setModal({
                type: "schedule",
                date: today(),
                activityType: "swim",
              })
            }
          >
            Planifier une séance piscine
          </Button>
          <div className="safety-note">
            <Icon name="LifeBuoy" size={19} />
            <span>
              Pas d’apnée ni d’hyperventilation. Nagez dans des conditions
              surveillées et adaptées à votre niveau.
            </span>
          </div>
        </Panel>
      </div>
      <SectionHeading
        title="Petit bassin. Grandes possibilités."
        subtitle="Les 6 protocoles source conservés · base temps pour bassin 8,5 × 4 m."
      >
        <Select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          aria-label="Niveau des protocoles piscine"
        >
          <option value="0">Niveau 1 · progressif</option>
          <option value="1">Niveau 2 · intermédiaire</option>
          <option value="2">Niveau 3 · avancé</option>
        </Select>
      </SectionHeading>
      <div className="pool-protocols">
        {POOL_PROTOCOLS.map((pr, i) => {
          const lvl = pr.niveaux[level];
          const minutes = Math.round(
            lvl.steps.reduce((s, x) => s + x[1], 0) / 60,
          );
          return (
            <Panel className="protocol-card" key={pr.id}>
              <div className="protocol-card-top">
                <span className={`protocol-icon pool-${i}`}>
                  <Icon
                    name={
                      ["Waves", "Activity", "Zap", "Flame", "Leaf", "Timer"][i]
                    }
                    size={25}
                  />
                </span>
                <Badge color={i === 4 ? "mint" : "blue"}>{minutes} MIN</Badge>
              </div>
              <h3>{pr.nom}</h3>
              <p>{pr.desc}</p>
              <span className="small-subtitle">
                {lvl.n} · {lvl.steps.length} étapes
              </span>
              <div>
                <Button
                  variant="secondary small"
                  icon="List"
                  onClick={() =>
                    setModal({ type: "protocol", protocolId: pr.id, level })
                  }
                >
                  Voir le protocole
                </Button>
                <IconButton
                  icon="Play"
                  label={`Lancer ${pr.nom}`}
                  onClick={() =>
                    setModal({ type: "protocol", protocolId: pr.id, level })
                  }
                />
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
function Hiit() {
  const { p, setTimer, notify } = useApp();
  const [format, setFormat] = useState("20/10"),
    [rounds, setRounds] = useState(8),
    [cycles, setCycles] = useState(1),
    [aqua, setAqua] = useState(true),
    [family, setFamily] = useState("low");
  const [work, rest] = format.split("/").map(Number);
  const modes = legacy.elite.TABATA_MODES;
  const selected = modes.find((m) => m.id === family);
  const minutes =
    (240 +
      Number(rounds) * Number(cycles) * (work + rest) +
      Math.max(0, Number(cycles) - 1) * 120) /
    60;
  function start() {
    if (rounds < 1 || rounds > 32 || cycles < 1 || cycles > 5) {
      notify("Choisissez 1 à 32 rounds et 1 à 5 cycles.", "error");
      return;
    }
    const score = recoveryScore(p).score;
    if (score != null && score < 45) {
      notify(
        "Récupération faible : préférez aujourd’hui le module récupération. Le HIIT reste disponible après réévaluation de votre état.",
        "info",
      );
      return;
    }
    const movements = aqua
      ? [
          "Aqua-jogging",
          "Montées de genoux",
          "Ciseaux au bord",
          "Déplacements latéraux",
          "Gainage vertical",
          "Battements de jambes",
        ]
      : selected.exos;
    const steps = [
      {
        name: aqua ? "Marche aquatique douce" : "Échauffement progressif",
        seconds: 120,
        pattern: aqua ? "swim" : "walk",
      },
    ];
    for (let c = 0; c < cycles; c++) {
      for (let r = 0; r < rounds; r++) {
        steps.push({
          name: `${movements[r % movements.length]} · round ${r + 1}/${rounds}`,
          seconds: work,
          pattern: aqua
            ? "swim"
            : /squat/i.test(movements[r % movements.length])
              ? "squat"
              : /gainage|planche/i.test(movements[r % movements.length])
                ? "static"
                : "walk",
          kind: "work",
        });
        steps.push({
          name: "Récupération",
          seconds: rest,
          pattern: "breathe",
          kind: "rest",
        });
      }
      if (c < cycles - 1)
        steps.push({
          name: "Récupération entre cycles",
          seconds: 120,
          pattern: "breathe",
        });
    }
    steps.push({ name: "Retour au calme", seconds: 120, pattern: "breathe" });
    setTimer(steps, {
      type: aqua ? "aqua" : "hiit",
      name: `${aqua ? "Aqua " : ""}${format === "20/10" ? "Tabata" : "HIIT"} ${format}`,
      rounds: Number(rounds),
      cycles: Number(cycles),
      work,
      rest,
    });
  }
  return (
    <div className="hiit-layout">
      <Panel className="hiit-builder">
        <div className="eyebrow">INTERVAL LAB</div>
        <h2>L’intensité, avec précision.</h2>
        <p>Chaque effort a son temps. Chaque récupération aussi.</p>
        <div className="environment-toggle">
          <button
            className={aqua ? "active" : ""}
            onClick={() => setAqua(true)}
          >
            <Icon name="Waves" />
            Aqua
          </button>
          <button
            className={!aqua ? "active" : ""}
            onClick={() => setAqua(false)}
          >
            <Icon name="Dumbbell" />
            Au sol
          </button>
        </div>
        <Field label="Format effort / repos">
          <div className="interval-formats">
            {["20/10", "30/15", "40/20", "45/15"].map((f) => (
              <button
                className={format === f ? "active" : ""}
                key={f}
                onClick={() => setFormat(f)}
              >
                {f}
                <small>secondes</small>
              </button>
            ))}
          </div>
        </Field>
        <div className="form-grid">
          <Field label="Rounds par cycle">
            <Input
              type="number"
              value={rounds}
              min="1"
              max="32"
              onChange={(e) => setRounds(e.target.value)}
            />
          </Field>
          <Field label="Nombre de cycles">
            <Input
              type="number"
              value={cycles}
              min="1"
              max="5"
              onChange={(e) => setCycles(e.target.value)}
            />
          </Field>
        </div>
        {!aqua && (
          <Field label="Famille de mouvements">
            <Select value={family} onChange={(e) => setFamily(e.target.value)}>
              {modes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <div className="info-line">
          <Icon name="Info" size={16} />
          <span>
            2 min d’échauffement + 2 min de retour au calme. 2 min entre les
            cycles. Le format 20/10 n’impose pas un effort maximal.
          </span>
        </div>
        <Button variant="primary" icon="Play" onClick={start}>
          Générer et lancer la séance
        </Button>
      </Panel>
      <div>
        <Panel className="hiit-visual">
          <Badge color="amber" dot>
            {aqua ? "AQUA" : "SOL"} / {format === "20/10" ? "TABATA" : "HIIT"}
          </Badge>
          <div className="interval-ring">
            <svg viewBox="0 0 240 240">
              <circle
                cx="120"
                cy="120"
                r="97"
                fill="none"
                stroke="#2b2c2d"
                strokeWidth="13"
              />
              <circle
                cx="120"
                cy="120"
                r="97"
                fill="none"
                stroke="var(--mint)"
                strokeWidth="13"
                strokeDasharray={`${(609 * work) / (work + rest)} 609`}
                transform="rotate(-90 120 120)"
              />
              <circle
                cx="120"
                cy="120"
                r="82"
                fill="none"
                stroke="#38383b"
                strokeDasharray="1 9"
              />
            </svg>
            <div>
              <strong>
                {work}
                <span> / {rest}</span>
              </strong>
              <small>EFFORT / REPOS</small>
            </div>
          </div>
          <div className="interval-summary">
            <span>
              <strong>{Number(rounds) * Number(cycles)}</strong>rounds
            </span>
            <span>
              <strong>{numberLabel(minutes)}</strong>min prévues
            </span>
            <span>
              <strong>{cycles}</strong>cycle{cycles > 1 ? "s" : ""}
            </span>
          </div>
        </Panel>
        <Panel className="hiit-advice">
          <Icon name="ShieldCheck" size={25} />
          <h3>L’exigence n’est pas l’épuisement.</h3>
          <p>
            Gardez une exécution propre. Réduisez l’intensité si la récupération
            n’est pas suffisante. Évitez les intervalles durs avant une séance
            musculaire importante.
          </p>
        </Panel>
      </div>
    </div>
  );
}
function ActivityHistory() {
  const { p, setModal } = useApp();
  const list = [...p.activities].sort((a, b) => b.date.localeCompare(a.date));
  return !list.length ? (
    <Panel>
      <Empty
        icon="Activity"
        title="Chaque discipline contribue au même parcours."
        text="Vos activités terminées et confirmées apparaîtront ici."
      >
        <Button
          variant="primary"
          onClick={() => setModal({ type: "log-activity" })}
        >
          Saisir une activité
        </Button>
      </Empty>
    </Panel>
  ) : (
    <div className="activity-history">
      {list.map((a) => (
        <Panel key={a.id}>
          <span className={`activity-square ${a.type}`}>
            <Icon
              name={
                ["swim", "aqua"].includes(a.type)
                  ? "Waves"
                  : a.type === "recovery"
                    ? "Wind"
                    : a.type === "hiit"
                      ? "Zap"
                      : "HeartPulse"
              }
            />
          </span>
          <div>
            <h3>{a.name}</h3>
            <p>
              {dateLabel(a.date, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {a.mode || a.style || a.type}
            </p>
            {a.note && <small>{a.note}</small>}
          </div>
          <div className="activity-data">
            <strong>
              {numberLabel(a.durationSec / 60)}
              <small>min</small>
            </strong>
            <strong>
              {a.distance != null ? numberLabel(a.distance) : "—"}
              <small>m</small>
            </strong>
            <strong>
              {a.rpe ?? "—"}
              <small>RPE</small>
            </strong>
          </div>
          <IconButton
            icon="Trash2"
            label="Supprimer l’activité"
            onClick={() => setModal({ type: "delete-activity", id: a.id })}
          />
        </Panel>
      ))}
    </div>
  );
}
