import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  SectionHeading,
  Panel,
  Tabs,
  Button,
  Icon,
  Badge,
  Ring,
  Select,
  Empty,
} from "../components/ui.jsx";
import Movement from "../components/Movement.jsx";
import { recoveryScore } from "../engine/fitness.js";
import { RECOVERY_EXERCISES, MUSCLES } from "../data/library.js";
import { assetSrc } from "../engine/utils.js";
import { today, dateLabel, addDays } from "../engine/utils.js";
export default function Recovery() {
  const { p, tab, setTab, setModal, setTimer } = useApp();
  const value = tab || "today";
  const rec = recoveryScore(p),
    entry = p.checkIns[today()];
  const routine = (name, steps) => setTimer(steps, { type: "recovery", name });
  return (
    <>
      <PageHeading
        eyebrow="LA PROGRESSION CONTINUE AU REPOS"
        title="Récupérer, c’est aussi avancer."
        description="Moins de tension. Plus de mobilité. Une énergie retrouvée."
      >
        <Button
          variant="primary"
          icon="HeartPulse"
          onClick={() => setModal({ type: "checkin" })}
        >
          Mon bilan du jour
        </Button>
      </PageHeading>
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["today", "Mon état du jour"],
          ["library", "Mobilité & stretching"],
          ["history", "Suivi de récupération"],
        ]}
      />
      {value === "library" ? (
        <RecoveryLibrary />
      ) : value === "history" ? (
        <RecoveryHistory />
      ) : (
        <>
          <div className="recovery-overview">
            <Panel className="recovery-score-card">
              <div>
                <Badge color="mint" dot>
                  RÉCUPÉRATION ESTIMÉE
                </Badge>
                <h2>
                  {rec.score == null
                    ? "Prenez le temps de vous écouter."
                    : rec.score >= 65
                      ? "Votre corps semble disponible."
                      : "Allégez. Votre corps vous le rendra."}
                </h2>
                <p>
                  {rec.score == null
                    ? "Quelques repères suffisent pour adapter votre entraînement avec davantage de justesse."
                    : rec.reasons.join(" ")}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setModal({ type: "checkin" })}
                >
                  {rec.score == null
                    ? "Compléter mon bilan"
                    : "Mettre à jour mon bilan"}
                </Button>
              </div>
              <Ring value={rec.score} size={188} stroke={8}>
                <strong>{rec.score ?? "—"}</strong>
                <span>
                  {rec.score != null ? "/ 100" : "DONNÉE INSUFFISANTE"}
                </span>
              </Ring>
            </Panel>
            <Panel className="recovery-input-summary">
              <SectionHeading title="Vos signaux du jour" />
              <div>
                {[
                  ["Moon", "Sommeil", entry?.sleep, "h"],
                  ["Zap", "Énergie", entry?.energy, "/5"],
                  ["BatteryMedium", "Fatigue", entry?.fatigue, "/5"],
                  ["Brain", "Stress", entry?.stress, "/5"],
                  ["Activity", "Courbatures", entry?.soreness, "/5"],
                ].map(([icon, label, v, unit]) => (
                  <p key={label}>
                    <Icon name={icon} size={17} />
                    <span>{label}</span>
                    <strong>
                      {v ?? "—"} <small>{v != null ? unit : ""}</small>
                    </strong>
                  </p>
                ))}
              </div>
              <small>
                {rec.coverage
                  ? `${rec.coverage} % des composantes renseignées`
                  : "Aucune composante inventée en votre absence."}
              </small>
            </Panel>
          </div>
          <SectionHeading
            title="Votre espace de récupération"
            subtitle="Des routines courtes, à adapter à votre confort."
          />
          <div className="recovery-routines">
            <Panel className="routine-card breathe-card">
              <div className="routine-art">
                <Movement pattern="breathe" controls={false} />
              </div>
              <Badge color="mint">2 MIN · RELAXATION</Badge>
              <h3>Revenir à l’essentiel.</h3>
              <p>
                Respiration lente : inspirez 4 secondes, expirez 6 secondes.
                Sans apnée, sans forcer.
              </p>
              <Button
                variant="secondary"
                icon="Play"
                onClick={() =>
                  routine(
                    "Respiration lente · 2 min",
                    Array.from({ length: 12 }, () => [
                      {
                        name: "Inspirez doucement",
                        seconds: 4,
                        pattern: "breathe",
                      },
                      {
                        name: "Expirez et relâchez",
                        seconds: 6,
                        pattern: "breathe",
                      },
                    ]).flat(),
                  )
                }
              >
                Respirer avec JARVIS
              </Button>
            </Panel>
            <Panel className="routine-card">
              <div className="routine-symbol mint">
                <Icon name="Accessibility" size={65} />
                <i />
                <i />
              </div>
              <Badge color="mint">6 MIN · MOBILITÉ</Badge>
              <h3>Des épaules plus libres.</h3>
              <p>
                Cercles lents, contrôle scapulaire et mouvements doux, dans une
                amplitude indolore.
              </p>
              <Button
                variant="secondary"
                icon="Play"
                onClick={() =>
                  routine("Mobilité du haut du corps", [
                    {
                      name: "Cercles d’épaules lents",
                      seconds: 60,
                      pattern: "lat",
                    },
                    {
                      name: "Rétraction scapulaire douce",
                      seconds: 60,
                      pattern: "row",
                    },
                    {
                      name: "Mobilité thoracique côté gauche",
                      seconds: 60,
                      pattern: "stretch",
                    },
                    {
                      name: "Mobilité thoracique côté droit",
                      seconds: 60,
                      pattern: "stretch",
                    },
                    {
                      name: "Mobilité poignets et coudes",
                      seconds: 60,
                      pattern: "curl",
                    },
                    {
                      name: "Respiration détendue",
                      seconds: 60,
                      pattern: "breathe",
                    },
                  ])
                }
              >
                Libérer le haut du corps
              </Button>
            </Panel>
            <Panel className="routine-card">
              <div className="routine-symbol blue">
                <Icon name="Footprints" size={65} />
                <i />
                <i />
              </div>
              <Badge color="blue">8 MIN · RETOUR AU CALME</Badge>
              <h3>Relâcher les jambes.</h3>
              <p>
                Fessiers, hanches, quadriceps, ischios et mollets. Une tension
                douce, jamais une douleur.
              </p>
              <Button
                variant="secondary"
                icon="Play"
                onClick={() =>
                  routine(
                    "Retour au calme · jambes",
                    RECOVERY_EXERCISES.filter((e) =>
                      ["fes", "qua", "isc", "mol"].includes(e.muscle),
                    )
                      .slice(0, 8)
                      .map((e) => ({
                        name: e.name,
                        seconds: 60,
                        pattern: "stretch",
                        instruction: e.instruction,
                      })),
                  )
                }
              >
                Récupérer en douceur
              </Button>
            </Panel>
          </div>
          <div className="info-line recovery-method">
            <Icon name="Info" size={18} />
            <p>
              Score indicatif : sommeil 25 %, qualité 15 %, énergie 20 %,
              fatigue 15 %, stress 10 %, courbatures 10 %, motivation 5 %. Les
              composantes manquantes sont exclues et les poids renormalisés. La
              charge sRPE récente peut réduire le score de 8 ou 15 points. Ce
              n’est pas une mesure médicale.
            </p>
          </div>
        </>
      )}
    </>
  );
}
function RecoveryLibrary() {
  const { setModal, setTimer } = useApp();
  const [filter, setFilter] = useState("all");
  const exercises = RECOVERY_EXERCISES.filter(
    (e) => filter === "all" || e.muscle === filter,
  );
  return (
    <>
      <SectionHeading
        title="Votre bibliothèque de récupération"
        subtitle={`${RECOVERY_EXERCISES.length} mouvements issus de vos programmes · consignes et illustrations animées.`}
      >
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Muscle à étirer"
        >
          <option value="all">Tout le corps</option>
          {Object.entries(MUSCLES).map(([k, n]) => (
            <option key={k} value={k}>
              {n}
            </option>
          ))}
        </Select>
      </SectionHeading>
      <div className="stretch-grid">
        {exercises.map((ex) => (
          <Panel key={ex.id}>
            {/* Planche d'étirement quand elle existe, icône générique
                sinon : mieux vaut un pictogramme franc qu'une image
                approximative présentée comme la posture à tenir. */}
            <div className={ex.img ? "stretch-visual" : "stretch-icon"}>
              {ex.img ? (
                <img loading="lazy" src={assetSrc(ex.img)} alt={ex.name} />
              ) : (
                <Icon name="PersonStanding" size={28} />
              )}
              <Badge>{ex.duration}</Badge>
            </div>
            <small>{MUSCLES[ex.muscle]}</small>
            <h3>{ex.name}</h3>
            <p>{ex.instruction}</p>
            <div>
              <Button
                variant="secondary small"
                icon="ScanLine"
                onClick={() => setModal({ type: "stretch", exercise: ex })}
              >
                Guide animé
              </Button>
              <IconButtonLocal
                onClick={() =>
                  setTimer(
                    [
                      {
                        name: ex.name,
                        seconds: 30,
                        pattern: "stretch",
                        instruction: ex.instruction,
                      },
                    ],
                    { type: "recovery", name: ex.name },
                  )
                }
              />
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
function IconButtonLocal({ onClick }) {
  return (
    <button
      className="icon-button"
      aria-label="Lancer 30 secondes"
      onClick={onClick}
    >
      <Icon name="Play" size={17} />
    </button>
  );
}
function RecoveryHistory() {
  const { p, setModal } = useApp();
  const dates = Object.keys(p.checkIns).sort().reverse();
  return (
    <Panel>
      <SectionHeading title="Mieux comprendre votre rythme" />
      {dates.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sommeil</th>
                <th>Énergie</th>
                <th>Fatigue</th>
                <th>Récupération</th>
                <th>Complétude</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dates.map((d) => {
                const c = p.checkIns[d],
                  r = recoveryScore(p, d);
                return (
                  <tr key={d}>
                    <td>{dateLabel(d, { day: "numeric", month: "long" })}</td>
                    <td>{c.sleep ?? "—"} h</td>
                    <td>{c.energy ?? "—"} /5</td>
                    <td>{c.fatigue ?? "—"} /5</td>
                    <td>
                      <Badge
                        color={
                          r.score == null ? "" : r.score < 55 ? "amber" : "mint"
                        }
                      >
                        {r.score ?? "—"} /100
                      </Badge>
                    </td>
                    <td>{r.coverage} %</td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label="Modifier le bilan"
                        onClick={() => setModal({ type: "checkin", date: d })}
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          icon="Moon"
          title="Apprenez à connaître votre rythme."
          text="Un bilan rapide chaque jour vous aidera à relier sommeil, effort et récupération."
        />
      )}
    </Panel>
  );
}
