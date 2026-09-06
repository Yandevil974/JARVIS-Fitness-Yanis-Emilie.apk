/* ============================================================
   BILAN DE FORCE MAXIMALE (1RM)
   Onglet dédié, repris de la section « v-force » des fichiers HTML.
   C'est le point de départ du programme : une fois le bilan saisi,
   toutes les charges de musculation, et par ricochet le volume et la
   nutrition, sont calculées automatiquement.
   ============================================================ */
import React, { useState, useMemo } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  Icon,
  Button,
  Badge,
  PageHeading,
  Panel,
  SectionHeading,
  Input,
  Select,
  Empty,
} from "../components/ui.jsx";
import Movement from "../components/Movement.jsx";
import {
  baseMovementsFor,
  forceOverview,
  forceTestDone,
  reevaluationStatus,
  roundCharge,
  suggestedLoad,
  FORCE_REVAL_WEEKS,
} from "../engine/strength.js";
import { estimate1RM } from "../engine/fitness.js";
import { EXERCISES, exerciseById } from "../data/library.js";
import { today, uid, num, numberLabel, dateLabel } from "../engine/utils.js";

const REPS_OPTIONS = [1, 2, 3, 5, 8];

export default function Force() {
  const { p, updateProfile, notify, navigate, openExercise } = useApp();
  const movements = baseMovementsFor(p.id);
  const overview = forceOverview(p);
  const status = reevaluationStatus(p);
  const done = forceTestDone(p);
  const revalWeeks = num(p.preferences?.forceRevalWeeks) || FORCE_REVAL_WEEKS;

  // Formulaire local : charge + répétitions maximales par mouvement.
  const [draft, setDraft] = useState(() =>
    Object.fromEntries(
      movements.map((m) => {
        const row = overview.find((o) => o.key === m.key);
        return [m.key, { weight: row?.declared ?? "", reps: 1 }];
      }),
    ),
  );
  const [error, setError] = useState("");

  const estimates = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(draft).map(([key, v]) => {
          const w = num(v.weight);
          const r = num(v.reps) || 1;
          return [key, w != null && w > 0 ? estimate1RM(w, r) : null];
        }),
      ),
    [draft],
  );

  const filled = Object.values(estimates).filter((v) => v != null).length;

  function save() {
    const entries = Object.entries(estimates).filter(([, v]) => v != null);
    if (!entries.length) {
      setError(
        "Renseignez au moins un mouvement. Sans valeur, aucune charge ne peut être calculée.",
      );
      return;
    }
    const invalid = entries.find(([, v]) => v <= 0 || v > 500);
    if (invalid) {
      setError("Une valeur semble hors limites (0 à 500 kg). Vérifiez la saisie.");
      return;
    }
    const date = today();
    updateProfile((q) => {
      // Les références précédentes du même mouvement sont conservées
      // dans l'historique : on n'écrase jamais une mesure passée.
      for (const [key, value] of entries) {
        const movement = movements.find((m) => m.key === key);
        const target = EXERCISES.find((e) => e.name === movement.exerciseName);
        q.forceTests.push({
          id: uid(),
          baseKey: key,
          exerciseId: target?.id || null,
          estimate: value,
          weight: num(draft[key].weight),
          reps: num(draft[key].reps) || 1,
          declared: (num(draft[key].reps) || 1) === 1,
          unit: movement.perHand ? "kg/main" : "kg total",
          additional: !!movement.additional,
          date,
        });
      }
      q.preferences.forceRevalWeeks = revalWeeks;
      q.notifications.unshift({
        id: uid(),
        key: `force-${date}`,
        date,
        type: "coach",
        read: false,
        text: `Bilan 1RM enregistré (${entries.length} mouvements). Vos charges de séance sont désormais calculées automatiquement.`,
      });
    });
    setError("");
    notify(
      `Bilan 1RM enregistré · ${entries.length} mouvements. Vos charges sont personnalisées.`,
      "success",
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="LE POINT DE DÉPART DU PROGRAMME"
        title="Bilan de force maximale (1RM)"
        description="Une fois ce bilan réalisé, JARVIS calcule seul la charge de chaque exercice, séance après séance."
      >
        <Badge color={done ? (status.due ? "amber" : "mint") : "amber"} dot>
          {done
            ? status.due
              ? "RÉÉVALUATION RECOMMANDÉE"
              : "BILAN À JOUR"
            : "BILAN NON RÉALISÉ"}
        </Badge>
      </PageHeading>

      {/* ---------- État du bilan ---------- */}
      <Panel className="force-hero">
        {done ? (
          <>
            <div className="force-hero-top">
              <div>
                <h2>Vos charges sont personnalisées</h2>
                <p>
                  Dernier bilan du {dateLabel(status.last)} ·{" "}
                  {overview.filter((o) => o.declared != null).length} mouvements
                  déclarés ·{" "}
                  {status.due
                    ? "réévaluation recommandée"
                    : `prochaine réévaluation le ${dateLabel(status.next)}`}
                  .
                </p>
              </div>
              <Button
                variant="primary"
                icon="Play"
                onClick={() => navigate("program")}
              >
                Ouvrir mon programme
              </Button>
            </div>
            <div className="force-table-wrap">
              <table className="force-table">
                <thead>
                  <tr>
                    <th>Mouvement</th>
                    <th>1RM déclaré</th>
                    <th>1RM auto (vos séances)</th>
                    <th>1RM retenu</th>
                    <th>Séance type (75 %)</th>
                  </tr>
                </thead>
                <tbody>
                  {overview
                    .filter((o) => o.effective != null)
                    .map((o) => (
                      <tr key={o.key}>
                        <td>
                          <button
                            className="force-exercise"
                            disabled={!o.exerciseId}
                            onClick={() =>
                              o.exerciseId && openExercise(o.exerciseId)
                            }
                          >
                            <span aria-hidden="true">{o.icon}</span>
                            {o.name}
                          </button>
                        </td>
                        <td>{o.declared != null ? `${o.declared} kg` : "—"}</td>
                        <td className={o.improved ? "force-up" : ""}>
                          {o.automatic != null ? `${o.automatic} kg` : "—"}
                        </td>
                        <td>
                          <strong>{o.effective} kg</strong>
                        </td>
                        <td>{o.working != null ? `${o.working} kg` : "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="info-line">
              <Icon name="Sparkles" size={16} />
              <p>
                <strong>1RM automatique :</strong> vos charges enregistrées en
                séance recalculent votre 1RM (formule d’Epley, meilleure
                performance réelle). <strong>Vos séances priment sur le test
                déclaré</strong> : si les charges du test étaient optimistes,
                elles s’ajustent à votre niveau réel — et remontent dès que vous
                progressez. Les valeurs en vert ont dépassé votre déclaration.
              </p>
            </div>
          </>
        ) : (
          <Empty
            icon="Gauge"
            title="Bilan non réalisé"
            text="Cinq à huit minutes suffisent. Ce bilan pré-remplit la charge de chaque exercice du programme. Même sans test, vos séances enregistrées calculent déjà automatiquement vos charges — le bilan les rend simplement justes dès la première séance."
          />
        )}
      </Panel>

      {/* ---------- Protocole ---------- */}
      <SectionHeading
        title="Protocole du test"
        subtitle="Un 1RM valide se juge à la technique, pas au chiffre."
      />
      <div className="force-protocol">
        {[
          [
            "Flame",
            "Échauffement",
            "5 à 10 minutes : séries progressives à environ 50 %, 70 % puis 85 % sur chaque mouvement avant les essais maximaux.",
          ],
          [
            "Target",
            "Essais",
            "3 à 5 essais espacés de 3 à 4 minutes. Un 1RM valide, c’est une technique parfaite, sans élan ni compensation.",
          ],
          [
            "ShieldCheck",
            "Prudence",
            "Ne testez jamais seul·e à l’échec total : demandez une parade. En cas de doute, un 3RM ou 5RM estimé suffit largement.",
          ],
        ].map(([icon, title, text]) => (
          <Panel key={title}>
            <Icon name={icon} size={22} />
            <strong>{title}</strong>
            <p>{text}</p>
          </Panel>
        ))}
      </div>
      <div className="safety-note">
        <Icon name="TriangleAlert" size={20} />
        <span>
          Le test de force maximale s’adresse aux personnes en bonne santé et
          entraînées. En cas de douleur, de blessure ou de problème médical,
          consultez un professionnel de santé avant de tester. Les valeurs
          saisies restent sous votre responsabilité.
        </span>
      </div>

      {/* ---------- Formulaire ---------- */}
      <SectionHeading
        title={done ? "Refaire ou compléter le bilan" : "Saisir mon bilan"}
        subtitle="Saisissez votre charge maximale. Si vous préférez un 3RM ou 5RM, indiquez la charge et le nombre de répétitions : le 1RM est estimé (formule d’Epley)."
      />
      <Panel className="force-form">
        {movements.map((m) => {
          const row = overview.find((o) => o.key === m.key);
          const exercise = EXERCISES.find((e) => e.name === m.exerciseName);
          return (
            <div className="force-form-row" key={m.key}>
              <div className="force-form-name">
                <span aria-hidden="true">{m.icon}</span>
                <div>
                  <strong>{m.name}</strong>
                  <small>
                    {row?.essentialHere ? "Essentiel" : "Complémentaire"}
                    {m.additional && " · charge additionnelle uniquement"}
                    {m.perHand && " · par bras"}
                  </small>
                </div>
              </div>
              {exercise && (
                <div className="force-form-demo">
                  <Movement exercise={exercise} small controls={false} />
                </div>
              )}
              <label className="force-form-input">
                <span>Charge (kg)</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min="0"
                  max="500"
                  value={draft[m.key]?.weight ?? ""}
                  placeholder={m.additional ? "0 si aucune" : "kg"}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      [m.key]: { ...d[m.key], weight: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="force-form-input">
                <span>Répétitions max</span>
                <Select
                  value={draft[m.key]?.reps ?? 1}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      [m.key]: { ...d[m.key], reps: Number(e.target.value) },
                    }))
                  }
                >
                  {REPS_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="force-form-result">
                <span>1RM estimé</span>
                <strong>
                  {estimates[m.key] != null ? `${estimates[m.key]} kg` : "—"}
                </strong>
              </div>
            </div>
          );
        })}
        {error && <p className="red-text">{error}</p>}
        <div className="force-form-actions">
          <Button variant="primary" icon="Save" onClick={save}>
            Enregistrer mon bilan 1RM ({filled})
          </Button>
          <p className="small-subtitle">
            Les mouvements essentiels suffisent : ce sont eux qui pilotent le
            calcul de toutes les autres charges. Tractions et dips : saisissez
            la <strong>charge additionnelle</strong> (0 si vous n’en ajoutez pas
            encore).
          </p>
        </div>
      </Panel>

      {/* ---------- Réévaluation ---------- */}
      <SectionHeading
        title="Réévaluation programmée par le coach"
        subtitle={`Le coach fixe la réévaluation toutes les ${revalWeeks} semaines, à la fin de chaque phase d’intensification — le moment où votre force atteint son pic.`}
      />
      <Panel className="force-reeval">
        <div>
          <Badge color={status.due ? "amber" : "mint"} dot>
            {status.label}
          </Badge>
          <p>{status.detail}</p>
        </div>
        <label className="force-form-input">
          <span>Intervalle (semaines)</span>
          <Select
            value={revalWeeks}
            onChange={(e) =>
              updateProfile((q) => {
                q.preferences.forceRevalWeeks = Number(e.target.value);
              })
            }
          >
            {[4, 6, 8, 10, 12].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </Select>
        </label>
      </Panel>

      {/* ---------- Effet concret sur les séances ---------- */}
      {done && <LoadPreview />}
    </>
  );
}

/** Aperçu : ce que le bilan change concrètement sur les prochains exercices. */
function LoadPreview() {
  const { p, openExercise } = useApp();
  const upcoming = useMemo(() => {
    const planned = (p.plan?.sessions || [])
      .filter((s) => s.status === "planned")
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .slice(0, 3);
    const ids = [];
    for (const s of planned)
      for (const e of s.exercises || [])
        if (e.exerciseId && !ids.includes(e.exerciseId)) ids.push(e.exerciseId);
    return ids.slice(0, 12).map((id) => {
      const ex = exerciseById(id);
      return { ex, suggestion: suggestedLoad(p, ex, ex.repScheme) };
    });
  }, [p]);
  const withLoad = upcoming.filter((u) => u.suggestion?.load != null);
  if (!withLoad.length) return null;
  return (
    <>
      <SectionHeading
        title="Vos charges calculées pour les prochaines séances"
        subtitle="Plus de calcul manuel : ces charges sont déjà pré-remplies dans le mode séance."
      />
      <div className="force-preview-grid">
        {withLoad.map(({ ex, suggestion }) => (
          <Panel key={ex.id} className="force-preview-card">
            <button onClick={() => openExercise(ex.id)}>
              <strong>{ex.name}</strong>
            </button>
            <div className="force-preview-load">
              {numberLabel(suggestion.load)}
              <small>{suggestion.perHand ? "kg / main" : "kg"}</small>
            </div>
            <p>
              {suggestion.percent} % de {suggestion.effective} kg ·{" "}
              {ex.repScheme} reps
            </p>
            <Badge color={suggestion.fromJournal ? "mint" : "amber"}>
              {suggestion.fromJournal ? "Vos séances" : "Bilan déclaré"}
            </Badge>
          </Panel>
        ))}
      </div>
    </>
  );
}
