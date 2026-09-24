import {
  analyzeExercise,
  exerciseOptions,
  readiness,
  LABELS,
} from "./engine.mjs";
import { context } from "../appointments/engine.mjs";
import { today } from "../reminders/engine.mjs";
import css from "./adaptation.css";
export function createAdaptation({
  React,
  useApp,
  getExercise,
  voice,
  DecisionControls = null,
}) {
  const { useState, useEffect } = React;
  function Board() {
    const { p } = useApp();
    return <Panel key={p.id} />;
  }
  function Panel() {
    const { p, setModal, notify } = useApp(),
      [selected, setSelected] = useState(""),
      [day, setDay] = useState(today());
    useEffect(() => {
      const refresh = () => setDay(today());
      const timer = setInterval(refresh, 60000);
      window.addEventListener("focus", refresh);
      document.addEventListener("visibilitychange", refresh);
      return () => {
        clearInterval(timer);
        window.removeEventListener("focus", refresh);
        document.removeEventListener("visibilitychange", refresh);
      };
    }, []);
    const ids = exerciseOptions(p, day),
      id = ids.includes(selected) ? selected : ids[0] || "",
      analysis = id ? analyzeExercise(p, id, { day }) : null,
      ready = readiness(p, day);
    const name = (id) => getExercise(id)?.name || id;
    function open(kind, ref = "") {
      try {
        voice.cancel("CANCELLED", true);
        setModal({ type: "appointment", context: context(p, kind, ref, day) });
      } catch (e) {
        notify(e.message, "error");
      }
    }
    return (
      <section className="je-adaptation" aria-label="Propositions d’adaptation">
        <style>{css}</style>
        <header>
          <span className="je-kicker">DONNÉES RÉELLES · RÈGLES LOCALES</span>
          <h2>Faire évoluer mon entraînement</h2>
          <p>
            {DecisionControls
              ? "Comparer avant de décider. Toute modification exige votre confirmation."
              : "Comparer avant de proposer. Le programme reste inchangé."}
          </p>
        </header>
        <p className="je-note">
          Réévaluation ≠ test maximal : utilise tes séances habituelles. Ni
          photo, ni poids corporel, ni séance prévue ne prouvent une progression
          de charge.
        </p>
        {!id && (
          <p className="je-empty">
            Aucun exercice réalisé à analyser. Deux séances terminées
            comparables, à des dates distinctes, seront nécessaires. Les
            activités cardio ne sont pas comparées à la musculation.
          </p>
        )}
        {!id && ready.pain && (
          <p className="je-safety" role="alert">
            {ready.reasons[0]}
          </p>
        )}
        {id && (
          <>
            <label className="je-select">
              Exercice à réévaluer
              <select
                aria-label="Exercice à réévaluer"
                value={id}
                onChange={(e) => setSelected(e.target.value)}
              >
                {ids.map((x) => (
                  <option key={x} value={x}>
                    {name(x)}
                  </option>
                ))}
              </select>
            </label>
            <article data-status={analysis.status} className="je-result">
              <h3>{LABELS[analysis.status]}</h3>
              {analysis.proposal && (
                <p className="je-target">
                  <strong>
                    {analysis.proposal.from} → {analysis.proposal.to}{" "}
                    {analysis.proposal.unit}
                  </strong>
                  <br />
                  Uniquement pour une prochaine séance de même prescription,
                  après vérification et accord.
                </p>
              )}
              <ul>
                {analysis.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
              {analysis.limitation && <p>{analysis.limitation}</p>}
              <details className="je-evidence">
                <summary>
                  Pourquoi cette proposition ? Voir les données et limites
                </summary>
                <p>
                  Analyse du {day} · profil {p.user.name} · règle locale v
                  {analysis.ruleVersion}. Comparabilité sur les champs
                  enregistrés, pas une vérification de ta technique ou du
                  matériel réel.
                </p>
                {analysis.evidence.length > 0 && (
                  <div className="je-table">
                    <table>
                      <caption>
                        Séances retenues pour examen — la conclusion ci-dessus
                        indique si elles sont comparables
                      </caption>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Charge réelle</th>
                          <th>Répétitions par série</th>
                          <th>Plage prescrite</th>
                          <th>RPE / RIR par série</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.evidence.map((s) => (
                          <tr key={s.id}>
                            <td>{s.date}</td>
                            <td>
                              {s.weight} {s.unit}
                            </td>
                            <td>{s.reps.join(" · ")}</td>
                            <td>
                              {s.low}–{s.high}
                            </td>
                            <td>
                              {s.effort
                                .map((e) => `${e.rpe ?? "—"} / ${e.rir ?? "—"}`)
                                .join(" · ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {analysis.comparison && (
                  <p>
                    À charge et prescription identiques :{" "}
                    {analysis.comparison.deltaReps > 0 ? "+" : ""}
                    {analysis.comparison.deltaReps} répétition(s) au total, soit{" "}
                    {analysis.comparison.percent > 0 ? "+" : ""}
                    {analysis.comparison.percent} %. Ce chiffre seul ne suffit
                    pas pour décider.
                  </p>
                )}
                <p>
                  Les deux dernières réalisations de cet exercice sont
                  examinées, sans sélectionner seulement les réussites. Fenêtre
                  de 42 jours, ordre des exercices, séries prévues/réalisées,
                  répétitions, unités, phase, repos et tempo prescrits
                  identiques. Le repos réel et la technique ne sont pas mesurés.
                </p>
                <p>
                  Hausse : objectif haut et marge sur chaque série, deux fois ;
                  un palier matériel configuré au maximum de 5 %. Allègement :
                  difficulté répétée sous la plage avec effort élevé ; baisse
                  d’un palier au maximum de 10 % si chiffrable. Ce sont des
                  règles prudentes explicites, pas une certitude scientifique ni
                  un diagnostic.
                </p>
                <p>
                  Secondes, poids du corps, kg ajoutés, charges variables et
                  séries agrégées restent à examiner manuellement. Ni conversion
                  des kg/main en kg total, ni estimation de 1RM.
                </p>
                <div className="je-actions">
                  <button type="button" onClick={() => open("pre")}>
                    Faire mon point avant séance
                  </button>
                  {analysis.sourceIds?.map((sid) => {
                    const s = p.sessions.find((s) => s.id === sid);
                    return s ? (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => open("post", "session:" + sid)}
                      >
                        Compléter le retour du {s.date}
                      </button>
                    ) : null;
                  })}
                </div>
              </details>
            </article>
          </>
        )}
        {DecisionControls && <DecisionControls analysis={analysis} />}
        {!DecisionControls && (
          <small>
            Lecture seule à cette étape : aucune charge, série, séance ou
            décision enregistrée par cette analyse. Les choix
            accepté/refusé/reporté seront ajoutés à l’étape suivante.
          </small>
        )}
      </section>
    );
  }
  return { Board };
}
