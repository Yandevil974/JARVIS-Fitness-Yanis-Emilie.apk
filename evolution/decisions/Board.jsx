import {
  ticket,
  targets,
  prepare,
  apply,
  records,
  latest,
  followUp,
  recommendation,
} from "./engine.mjs";
import { LABELS, analyzeExercise } from "../adaptation/engine.mjs";
import { today, addDays } from "../reminders/engine.mjs";
import css from "./decisions.css";
const NAMES = {
  accepted: "Acceptée",
  refused: "Refusée",
  postponed: "Reportée",
};
export function createDecisions({
  React,
  useApp,
  Modal,
  makeWorkout,
  getExercise,
  voice,
}) {
  const { useState, useEffect, useRef } = React;
  function Controls({ analysis }) {
    const { p, setModal, notify } = useApp(),
      [limit, setLimit] = useState(20),
      all = records(p),
      last = analysis ? latest(p, analysis) : null,
      day = today();
    function open(revisit = null) {
      try {
        voice.cancel("CANCELLED", true);
        setModal({
          type: "decision",
          ticket: ticket(
            p,
            revisit
              ? analyzeExercise(p, revisit.analysis.exerciseId, { day })
              : analysis,
            day,
          ),
          reconsider: !!last || !!revisit,
          revisitId: revisit?.id,
        });
      } catch (e) {
        notify(e.message, "error");
      }
    }
    return (
      <div className="jd-owned">
        <style>{css}</style>
        <section
          className="jd-controls"
          aria-label="Décider de cette proposition"
        >
          <p>
            Lecture seule de l’analyse : seule une confirmation explicite peut
            modifier une séance future compatible.
          </p>
          {all
            .filter(
              (r) =>
                r.choice === "postponed" &&
                r.until <= day &&
                !all.some((x) => x.supersedes === r.id),
            )
            .map((r) => (
              <p className="jd-due" key={r.id}>
                À revoir depuis {r.until} :{" "}
                {getExercise(r.analysis.exerciseId)?.name ||
                  r.analysis.exerciseId}
                . Complète les ressentis du jour si l’analyse actuelle est
                insuffisante.
              </p>
            ))}
          {last && (
            <p className="jd-last">
              <strong>{NAMES[last.choice]}</strong> le {last.date}
              {last.choice === "postponed"
                ? ` · ${last.until <= day ? "À revoir depuis" : "À revoir le"} ${last.until}`
                : ""}
              .{" "}
              {last.applied
                ? "Une seule séance a reçu la charge confirmée."
                : "Aucune charge modifiée."}
            </p>
          )}
          {analysis &&
            ["increase", "maintain", "deload"].includes(analysis.status) &&
            last?.choice !== "accepted" && (
              <button type="button" onClick={() => open()}>
                {last ? "Réexaminer cette proposition" : "Choisir une décision"}
              </button>
            )}
          {last?.choice === "accepted" && (
            <p>
              Déjà acceptée : les mêmes données ne seront pas appliquées une
              seconde fois.
            </p>
          )}
        </section>
        <details className="jd-history">
          <summary>Mes décisions et leur suivi ({all.length})</summary>
          {!all.length && <p>Aucune décision enregistrée dans ce profil.</p>}
          {all
            .slice(-limit)
            .reverse()
            .map((r) => {
              const f = followUp(p, r, day);
              return (
                <article key={r.id} data-followup={f.status}>
                  <h3>
                    {NAMES[r.choice]} ·{" "}
                    {getExercise(r.analysis.exerciseId)?.name ||
                      r.analysis.exerciseId}
                  </h3>
                  <p>
                    {r.date} ·{" "}
                    {LABELS[r.analysis.status] || "Proposition enregistrée"}
                  </p>
                  {typeof r.note === "string" && r.note && <p>{r.note}</p>}
                  {r.choice === "postponed" && (
                    <p>
                      Réexamen prévu :{" "}
                      {typeof r.until === "string"
                        ? r.until
                        : "date à vérifier"}
                      .{" "}
                      {all.some((x) => x.supersedes === r.id)
                        ? "Décision réexaminée, entrée conservée."
                        : "Aucune application automatique à cette date."}
                    </p>
                  )}
                  <p>{f.text}</p>
                  {r.choice !== "accepted" &&
                    !all.some((x) => x.supersedes === r.id) && (
                      <button type="button" onClick={() => open(r)}>
                        Réexaminer cette décision
                      </button>
                    )}
                  {r.target && (
                    <p>
                      Ancienne cible :{" "}
                      {r.target.beforeLoad == null
                        ? "automatique / non fixée"
                        : String(r.target.beforeLoad)}{" "}
                      → {String(r.target.afterLoad)} {r.target.unit} · séance du{" "}
                      {r.target.date}
                    </p>
                  )}
                  {f.sets && (
                    <p>
                      Séries réellement saisies :{" "}
                      {f.sets
                        .map(
                          (s) =>
                            `${s.weight} ${r.target.unit} × ${s.reps} (RPE ${s.rpe ?? "—"}, RIR ${s.rir ?? "—"})`,
                        )
                        .join(" ; ")}
                    </p>
                  )}
                  <details>
                    <summary>Motifs conservés au moment du choix</summary>
                    {Array.isArray(r.analysis.reasons) &&
                      r.analysis.reasons
                        .filter((x) => typeof x === "string")
                        .map((x, i) => <p key={i}>{x}</p>)}
                  </details>
                </article>
              );
            })}
          {all.length > limit && (
            <button type="button" onClick={() => setLimit((n) => n + 20)}>
              Afficher les décisions précédentes
            </button>
          )}
          <small>
            Historique inclus dans l’export JSON du profil. Une cible planifiée
            n’est jamais comptée comme réalisée. Le report est visible ici, sans
            notification Android application fermée à cette étape.
          </small>
        </details>
      </div>
    );
  }
  function Dialog() {
    const { p, modal } = useApp();
    return (
      <Form
        key={p.id + ":" + modal.ticket.analysis.exerciseId}
        initial={modal}
      />
    );
  }
  function Form({ initial }) {
    const { p, updateProfile, closeModal, notify } = useApp(),
      t = initial.ticket,
      a = t.analysis;
    const [options] = useState(() =>
      targets(p, a, { makeWorkout, day: t.day }),
    );
    const [choice, setChoice] = useState(""),
      [selected, setSelected] = useState(""),
      [note, setNote] = useState(""),
      [until, setUntil] = useState(addDays(t.day, 7)),
      [confirm, setConfirm] = useState(false),
      [review, setReview] = useState(false),
      [error, setError] = useState(""),
      [pending, setPending] = useState(null);
    const result = useRef(null),
      target = options.find((s) => s.id === selected);
    const input = () => ({
      choice,
      note,
      until,
      targetId: selected,
      targetGuard: target?.guard,
      confirm,
      reconsider: initial.reconsider,
      revisitId: initial.revisitId,
    });
    useEffect(() => {
      if (!pending || p === pending.before) return;
      if (records(p).some((r) => r.id === pending.id)) {
        closeModal();
        notify(
          "Décision enregistrée" +
            (choice === "accepted" && a.proposal
              ? " : charge appliquée à la seule séance choisie."
              : ", sans modification de charge."),
        );
      } else {
        setError(
          result.current?.error ||
            "Le contexte a changé. Réexamine la proposition.",
        );
        setPending(null);
        setReview(false);
      }
    }, [p, pending]);
    function preview(e) {
      e.preventDefault();
      try {
        prepare(p, t, input(), { makeWorkout });
        setReview(true);
        setError("");
      } catch (e) {
        setError(e.message);
      }
    }
    function submit(e) {
      e.preventDefault();
      if (!review) {
        preview(e);
        return;
      }
      if (pending) return;
      try {
        const prepared = prepare(p, t, input(), { makeWorkout });
        setPending({ id: prepared.id, before: p });
        updateProfile((q) => {
          result.current = apply(q, prepared, { makeWorkout });
        });
      } catch (e) {
        setError(e.message);
        setReview(false);
      }
    }
    return (
      <Modal
        title="Votre décision"
        subtitle={`${p.user.name} · ${getExercise(a.exerciseId)?.name || a.exerciseId}`}
        onClose={closeModal}
      >
        <style>{css}</style>
        <form className="jd-form" onSubmit={submit}>
          <h3>{a.title}</h3>
          <p>
            Les sources et la cible seront revérifiées au moment de confirmer.
            Fermer cette fenêtre n’enregistre aucune décision.
          </p>
          {!review ? (
            <>
              <label>
                Mon choix
                <select
                  aria-label="Mon choix"
                  value={choice}
                  onChange={(e) => {
                    setChoice(e.target.value);
                    setConfirm(false);
                  }}
                >
                  <option value="">Choisir</option>
                  <option value="accepted">
                    Accepter
                    {a.proposal
                      ? " et choisir une séance"
                      : " le principe, sans changer de charge"}
                  </option>
                  <option value="refused">
                    Refuser, sans modifier le programme
                  </option>
                  <option value="postponed">Reporter le réexamen</option>
                </select>
              </label>
              {choice === "accepted" && a.proposal && (
                <>
                  {!options.length && (
                    <p role="alert">
                      Aucune cible compatible dans les 30 prochains jours, ou
                      une séance est en cours. Rien ne sera appliqué. Tu peux
                      refuser ou reporter.
                    </p>
                  )}
                  <label>
                    Séance à modifier
                    <select
                      aria-label="Séance à modifier"
                      value={selected}
                      onChange={(e) => {
                        setSelected(e.target.value);
                        setConfirm(false);
                      }}
                    >
                      <option value="">
                        Choisir explicitement une seule séance
                      </option>
                      {options.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.date} · {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {target && (
                    <aside className="jd-preview">
                      <strong>
                        {target.date} · {target.name}
                      </strong>
                      <p>
                        Cible actuelle :{" "}
                        {target.before == null
                          ? "automatique / non fixée"
                          : target.before + " " + a.proposal.unit}
                        . Nouvelle cible : {a.proposal.to} {a.proposal.unit}.
                      </p>
                      <p>
                        Repère des séances réalisées : {a.proposal.from}{" "}
                        {a.proposal.unit}. Ce repère n’est pas forcément la
                        cible actuelle.
                      </p>
                      <label className="jd-check">
                        <input
                          type="checkbox"
                          checked={confirm}
                          onChange={(e) => setConfirm(e.target.checked)}
                        />
                        Je confirme cette charge sur cette seule séance, sans
                        changer les séries, les autres séances ni les
                        performances passées.
                      </label>
                    </aside>
                  )}
                </>
              )}
              {choice === "postponed" && (
                <label>
                  Revoir le
                  <input
                    type="date"
                    aria-label="Revoir le"
                    min={addDays(t.day, 1)}
                    max={addDays(t.day, 30)}
                    value={until}
                    onChange={(e) => setUntil(e.target.value)}
                  />
                </label>
              )}
              <label>
                Ma note (facultatif)
                <textarea
                  aria-label="Ma note (facultatif)"
                  maxLength={1000}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <button key="review" type="button" onClick={preview}>
                Vérifier ma décision
              </button>
            </>
          ) : (
            <aside className="jd-preview">
              <h3>Relire avant d’enregistrer</h3>
              <p>
                {NAMES[choice]}
                {choice === "postponed" ? ` · à revoir le ${until}` : ""}
              </p>
              {target && choice === "accepted" && (
                <p>
                  Séance du {target.date} : cible{" "}
                  {target.before ?? "automatique / non fixée"} → {a.proposal.to}{" "}
                  {a.proposal.unit}. Une seule séance concernée.
                </p>
              )}
              {(!a.proposal || choice !== "accepted") && (
                <p>Aucune modification de charge.</p>
              )}
              {note && <p>{note}</p>}
              <div className="jd-actions">
                <button type="button" onClick={() => setReview(false)}>
                  Modifier mon choix
                </button>
                <button key="confirm" type="submit" disabled={!!pending}>
                  Confirmer ma décision
                </button>
              </div>
            </aside>
          )}
          {error && (
            <p className="jd-error" role="alert">
              {error}
            </p>
          )}
          <button type="button" onClick={closeModal}>
            Annuler sans enregistrer
          </button>
        </form>
      </Modal>
    );
  }
  return { Controls, Dialog, recommendation };
}
