import React, { useMemo, useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  Panel,
  SectionHeading,
  Button,
  Badge,
  Icon,
  Input,
  Select,
  Empty,
} from "../components/ui.jsx";
import Movement from "../components/Movement.jsx";
import { EXERCISES, exerciseById } from "../data/library.js";
import {
  forceTestsFor,
  forceTestRows,
  forceRevalState,
  hasForceTests,
  estimate1RMFrom,
  loadForExercise,
  DEFAULT_FORCE_REVAL_WEEKS,
} from "../engine/force.js";
import { dateLabel, numberLabel, num, today, uid } from "../engine/utils.js";
const REP_OPTIONS = [1, 2, 3, 5, 8];
// Bilan de force maximale (1RM) — page portée de la 1.5.0 : protocole du
// test, saisie charge × reps (Epley), tableau déclaré vs automatique,
// réévaluation programmée et charges pré-calculées des prochaines séances.
export default function Force() {
  const { p, updateProfile, notify, navigate, openExercise } = useApp();
  const tests = forceTestsFor(p.id),
    rows = forceTestRows(p),
    status = forceRevalState(p),
    done = hasForceTests(p),
    weeks = num(p.preferences?.forceRevalWeeks) || DEFAULT_FORCE_REVAL_WEEKS;
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      tests.map((t) => {
        const prev = rows.find((r) => r.key === t.key);
        return [t.key, { weight: prev?.declared ?? "", reps: 1 }];
      }),
    ),
  );
  const [error, setError] = useState("");
  const estimates = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(form).map(([key, v]) => {
          const weight = num(v.weight),
            reps = num(v.reps) || 1;
          return [key, weight != null && weight > 0 ? estimate1RMFrom(weight, reps) : null];
        }),
      ),
    [form],
  );
  const filled = Object.values(estimates).filter((v) => v != null).length;
  function submit() {
    const entries = Object.entries(estimates).filter(([, v]) => v != null);
    if (!entries.length) {
      setError(
        "Renseignez au moins un mouvement. Sans valeur, aucune charge ne peut être calculée.",
      );
      return;
    }
    if (entries.find(([, v]) => v <= 0 || v > 500)) {
      setError("Une valeur semble hors limites (0 à 500 kg). Vérifiez la saisie.");
      return;
    }
    const date = today();
    updateProfile((q) => {
      for (const [key, value] of entries) {
        const test = tests.find((t) => t.key === key),
          ex = EXERCISES.find((x) => x.name === test.exerciseName);
        q.forceTests.push({
          id: uid(),
          baseKey: key,
          exerciseId: ex?.id || null,
          estimate: value,
          weight: num(form[key].weight),
          reps: num(form[key].reps) || 1,
          declared: (num(form[key].reps) || 1) === 1,
          unit: test.perHand ? "kg/main" : "kg total",
          additional: !!test.additional,
          date,
        });
      }
      q.preferences.forceRevalWeeks = weeks;
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
      <Panel className="force-hero">
        {done ? (
          <>
            <div className="force-hero-top">
              <div>
                <h2>Vos charges sont personnalisées</h2>
                <p>
                  Dernier bilan du {dateLabel(status.last)} ·{" "}
                  {rows.filter((r) => r.declared != null).length} mouvements
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
                  {rows
                    .filter((r) => r.effective != null)
                    .map((r) => (
                      <tr key={r.key}>
                        <td>
                          <button
                            className="force-exercise"
                            disabled={!r.exerciseId}
                            onClick={() => r.exerciseId && openExercise(r.exerciseId)}
                          >
                            <span aria-hidden="true">{r.icon}</span>
                            {r.name}
                          </button>
                        </td>
                        <td>{r.declared != null ? `${r.declared} kg` : "—"}</td>
                        <td className={r.improved ? "force-up" : ""}>
                          {r.automatic != null ? `${r.automatic} kg` : "—"}
                        </td>
                        <td>
                          <strong>{r.effective} kg</strong>
                        </td>
                        <td>{r.working != null ? `${r.working} kg` : "—"}</td>
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
                performance réelle).{" "}
                <strong>Vos séances priment sur le test déclaré</strong> : si
                les charges du test étaient optimistes, elles s’ajustent à votre
                niveau réel — et remontent dès que vous progressez. Les valeurs
                en vert ont dépassé votre déclaration.
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
      <SectionHeading
        title={done ? "Refaire ou compléter le bilan" : "Saisir mon bilan"}
        subtitle="Saisissez votre charge maximale. Si vous préférez un 3RM ou 5RM, indiquez la charge et le nombre de répétitions : le 1RM est estimé (formule d’Epley)."
      />
      <Panel className="force-form">
        {tests.map((t) => {
          const row = rows.find((r) => r.key === t.key),
            ex = EXERCISES.find((x) => x.name === t.exerciseName);
          return (
            <div key={t.key} className="force-form-row">
              <div className="force-form-name">
                <span aria-hidden="true">{t.icon}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>
                    {row?.essentialHere ? "Essentiel" : "Complémentaire"}
                    {t.additional && " · charge additionnelle uniquement"}
                    {t.perHand && " · par bras"}
                  </small>
                </div>
              </div>
              {ex && (
                <div className="force-form-demo">
                  <Movement exercise={ex} small controls={false} />
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
                  value={form[t.key]?.weight ?? ""}
                  placeholder={t.additional ? "0 si aucune" : "kg"}
                  onChange={(e) =>
                    setForm((v) => ({
                      ...v,
                      [t.key]: { ...v[t.key], weight: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="force-form-input">
                <span>Répétitions max</span>
                <Select
                  value={form[t.key]?.reps ?? 1}
                  onChange={(e) =>
                    setForm((v) => ({
                      ...v,
                      [t.key]: {
                        ...v[t.key],
                        reps: Number(e.target.value),
                      },
                    }))
                  }
                >
                  {REP_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="force-form-result">
                <span>1RM estimé</span>
                <strong>
                  {estimates[t.key] != null ? `${estimates[t.key]} kg` : "—"}
                </strong>
              </div>
            </div>
          );
        })}
        {error && <p className="red-text">{error}</p>}
        <div className="force-form-actions">
          <Button variant="primary" icon="Save" onClick={submit}>
            Enregistrer mon bilan 1RM ({filled})
          </Button>
          <p className="small-subtitle">
            Les mouvements essentiels suffisent : ce sont eux qui pilotent le
            calcul de toutes les autres charges. Tractions et dips : saisissez
            la <strong>charge additionnelle</strong> (0 si vous n’en ajoutez
            pas encore).
          </p>
        </div>
      </Panel>
      <SectionHeading
        title="Réévaluation programmée par le coach"
        subtitle={`Le coach fixe la réévaluation toutes les ${weeks} semaines, à la fin de chaque phase d’intensification — le moment où votre force atteint son pic.`}
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
            value={weeks}
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
      {done && <ForceNextLoads />}
    </>
  );
}
// Aperçu : charges que JARVIS a déjà calculées pour les trois prochaines
// séances planifiées (uniquement ce qui est réellement déductible).
function ForceNextLoads() {
  const { p, openExercise } = useApp();
  const list = useMemo(() => {
    const upcoming = (p.plan?.sessions || [])
      .filter((s) => s.status === "planned")
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .slice(0, 3),
      ids = [];
    for (const s of upcoming)
      for (const e of s.exercises || [])
        if (e.exerciseId && !ids.includes(e.exerciseId)) ids.push(e.exerciseId);
    return ids
      .slice(0, 12)
      .map((id) => {
        const ex = exerciseById(id);
        return { ex, suggestion: loadForExercise(p, ex, ex.repScheme) };
      })
      .filter((v) => v.suggestion?.load != null);
  }, [p]);
  if (!list.length) return null;
  return (
    <>
      <SectionHeading
        title="Vos charges calculées pour les prochaines séances"
        subtitle="Plus de calcul manuel : ces charges sont déjà pré-remplies dans le mode séance."
      />
      <div className="force-preview-grid">
        {list.map(({ ex, suggestion: s }) => (
          <Panel key={ex.id} className="force-preview-card">
            <button onClick={() => openExercise(ex.id)}>
              <strong>{ex.name}</strong>
            </button>
            <div className="force-preview-load">
              {numberLabel(s.load)}
              <small>{s.perHand ? "kg / main" : "kg"}</small>
            </div>
            <p>
              {s.percent} % de {s.effective} kg · {ex.repScheme} reps
            </p>
            <Badge color={s.fromJournal ? "mint" : "amber"}>
              {s.fromJournal ? "Vos séances" : "Bilan déclaré"}
            </Badge>
          </Panel>
        ))}
      </div>
    </>
  );
}
