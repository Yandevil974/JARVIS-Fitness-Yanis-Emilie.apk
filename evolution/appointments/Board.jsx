import {
  TITLES,
  MEASURES,
  sessions,
  context,
  answers,
  draft,
  record,
  saveDraft,
  clearDraft,
  prepare,
  apply,
  recentRecords,
  weekFacts,
  drafts,
} from "./engine.mjs";
import { today, validDate } from "../reminders/engine.mjs";
import css from "./appointments.css";
export function createAppointments({
  React,
  useApp,
  Modal,
  makeReview,
  voice,
}) {
  const { useState, useEffect } = React;
  function Board({ compact = false }) {
    const { p, setModal, notify, updateProfile } = useApp();
    const [ref, setRef] = useState("");
    const choices = sessions(p),
      selected = choices.some((s) => s.ref === ref)
        ? ref
        : choices[0]?.ref || "";
    function open(kind) {
      try {
        const c = context(p, kind, selected);
        voice.cancel("CANCELLED", true);
        setModal({ type: "appointment", context: c });
      } catch (e) {
        notify(e.message, "error");
      }
    }
    const history = recentRecords(p),
      waiting = drafts(p);
    function resume(d) {
      try {
        const c = d.context;
        if (c.kind === "pre" && c.day !== today())
          throw Error(
            "Cette préparation concerne un ancien jour. Recommence avec ton état du jour ; tu peux effacer cet ancien brouillon.",
          );
        const actual = context(
          p,
          c.kind,
          c.ref,
          c.kind === "pre" ? today() : c.day,
        );
        if (actual.key !== c.key)
          throw Error(
            "La séance a changé : efface ce brouillon et recommence.",
          );
        voice.cancel("CANCELLED", true);
        setModal({ type: "appointment", context: c });
      } catch (e) {
        notify(e.message, "error");
      }
    }

    return (
      <section
        className={`ja-board ${compact ? "ja-compact" : ""}`}
        aria-label="Rendez-vous avec mon équipe"
      >
        <style>{css}</style>
        <header>
          <div>
            <span className="ja-kicker">ÉTAPE PAR ÉTAPE · À TON RYTHME</span>
            <h2>Mes rendez-vous avec l’équipe</h2>
            <p>
              Des questions utiles, une confirmation avant d’enregistrer. Aucun
              changement de programme.
            </p>
          </div>
        </header>
        <div className="ja-grid">
          {Object.entries(TITLES).map(([kind, title]) => (
            <article key={kind}>
              <h3>{title}</h3>
              <p>
                {
                  {
                    pre: p.workout
                      ? "Préparer la séance en cours avant l’effort."
                      : "Préparer mon prochain effort aujourd’hui, sans lancer de séance.",
                    post: "Relier mon ressenti à une séance déjà enregistrée.",
                    weekly:
                      "Mes ressentis, mes difficultés et mes questions à l’équipe.",
                    monthly:
                      "De vrais tours corporels en cm ; poids et photos facultatifs.",
                  }[kind]
                }
              </p>
              {kind === "post" && (
                <label>
                  Séance à commenter
                  <select
                    aria-label="Séance à commenter"
                    value={selected}
                    onChange={(e) => setRef(e.target.value)}
                  >
                    <option value="">Aucune séance sélectionnée</option>
                    {choices.map((s) => (
                      <option key={s.ref} value={s.ref}>
                        {s.date} · {s.name || s.type || "Séance"}
                        {s.status === "partial" ? " · partielle" : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                type="button"
                disabled={kind === "post" && !selected}
                onClick={() => open(kind)}
              >
                {title}
              </button>
            </article>
          ))}
        </div>
        {!compact && waiting.length > 0 && (
          <details className="ja-history">
            <summary>Brouillons à reprendre ({waiting.length})</summary>
            {waiting.slice(0, 20).map(([key, d]) => (
              <div key={key}>
                <p>
                  {TITLES[d.kind]} · ouvert le {d.context.day}
                </p>
                <div className="ja-actions">
                  <button type="button" onClick={() => resume(d)}>
                    Reprendre ce brouillon
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateProfile((q) => {
                        if (q.id === p.id) clearDraft(q, d.context);
                      })
                    }
                  >
                    Effacer ce brouillon
                  </button>
                </div>
              </div>
            ))}
          </details>
        )}
        {!compact && history.length > 0 && (
          <details className="ja-history">
            <summary>
              Mes derniers rendez-vous enregistrés ({history.length})
            </summary>
            {history.map((r) => (
              <details key={r.key}>
                <summary>
                  <strong>{TITLES[r.kind]}</strong> · {r.date} · enregistré
                  {r.ref ? " · lié à une séance" : ""}
                </summary>
                <SavedDetails r={r} />
              </details>
            ))}
            <p>
              Les bilans d’équipe et les mesures restent aussi dans leurs
              historiques habituels.
            </p>
          </details>
        )}
        <small>
          Brouillons conservés dans ce profil. Aucune écoute automatique. Le
          bouton de dictée reste dans JARVIS.
        </small>
      </section>
    );
  }
  function SavedDetails({ r }) {
    const a = r.answers || {},
      scalar = (v) =>
        typeof v === "string" || typeof v === "number" ? String(v) : "";
    return (
      <div>
        {[
          ["energy", "Énergie"],
          ["minutes", "Minutes disponibles"],
          ["effort", "Effort ressenti"],
          ["fatigue", "Fatigue"],
          ["pain", "Douleur"],
          ["motivation", "Motivation"],
          ["location", "Circonstances"],
          ["problems", "Problèmes"],
          ["feelings", "Ressentis"],
          ["difficulties", "Difficultés"],
          ["questions", "Questions"],
          ["weight", "Poids (kg)"],
        ]
          .filter(([k]) => scalar(a[k]))
          .map(([k, l]) => (
            <p key={k}>
              {l} :{" "}
              {a[k] === "yes" ? "oui" : a[k] === "no" ? "non" : scalar(a[k])}
            </p>
          ))}
        {MEASURES.filter(([k]) => scalar(a.values?.[k])).map(([k, l]) => (
          <p key={k}>
            {l} : {scalar(a.values[k])} cm
          </p>
        ))}
      </div>
    );
  }
  function Dialog() {
    const { p, modal } = useApp();
    return (
      <Form key={p.id + ":" + modal.context.key} initial={modal.context} />
    );
  }
  function Form({ initial: c }) {
    const { p, updateProfile, closeModal, navigate, notify } = useApp();
    const [form, setForm] = useState(() => answers(p, c));
    const [step, setStep] = useState(() =>
      Math.min(2, Math.max(0, Number(draft(p, c)?.step) || 0)),
    );
    const [error, setError] = useState("");
    const [pending, setPending] = useState(null);
    useEffect(() => {
      if (!pending || p === pending.before) return;
      if (record(p, c)?.token === pending.token) {
        closeModal();
        notify("Rendez-vous enregistré. Le programme reste inchangé.");
        if (c.kind === "monthly" && pending.photos)
          navigate("progress", "photos");
      } else {
        setError(
          "Le contexte a changé : rouvre ce rendez-vous avant de confirmer.",
        );
        setPending(null);
      }
    }, [p, pending]);
    useEffect(() => {
      voice.cancel("CANCELLED", true);
    }, []);
    const change = (key, value) => {
      const next = { ...form, [key]: value };
      setForm(next);
      setError("");
      updateProfile((q) => {
        if (q.id === p.id) saveDraft(q, c, next, step);
      });
    };
    const move = (next) => {
      setStep(next);
      setError("");
      updateProfile((q) => {
        if (q.id === p.id) saveDraft(q, c, form, next);
      });
    };
    const field = (key, label, { min = 1, max = 5, optional = false } = {}) => (
      <label>
        {label}
        <select
          aria-label={label}
          value={form[key]}
          onChange={(e) => change(key, e.target.value)}
        >
          <option value="">{optional ? "Non renseigné" : "Choisir"}</option>
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
            <option key={n} value={n}>
              {n} / {max}
            </option>
          ))}
        </select>
      </label>
    );
    const text = (key, label) => (
      <label>
        {label}
        <textarea
          aria-label={label}
          maxLength={2000}
          value={form[key]}
          onChange={(e) => change(key, e.target.value)}
        />
      </label>
    );
    function submit(e) {
      e.preventDefault();
      if (step < 2) {
        move(step + 1);
        return;
      }
      if (pending) return;
      try {
        const prepared = prepare(p, c, form, { makeReview });
        setPending({ token: prepared.token, before: p, photos: form.photos });
        updateProfile((q) => {
          if (q.id === p.id) apply(q, prepared);
        });
      } catch (err) {
        setError(err.message);
      }
    }
    const facts = weekFacts(p, validDate(form.date) ? form.date : today());
    const pain = ["pre", "post"].includes(c.kind) && form.pain === "yes";
    return (
      <Modal
        title={TITLES[c.kind]}
        subtitle={`${p.user.name} · ${step + 1} / 3 · ${["Le contexte", "Mes réponses", "Vérifier et confirmer"][step]}`}
        onClose={closeModal}
      >
        <style>{css}</style>
        <form className="ja-form" onSubmit={submit}>
          <p className="ja-progress" role="status">
            {draft(p, c)
              ? "Brouillon conservé, pas encore validé."
              : record(p, c)
                ? "Un rendez-vous existe : seule une nouvelle confirmation le modifiera."
                : "Rien ne sera validé avant ta confirmation."}
          </p>
          {step === 0 && (
            <>
              <p>
                {
                  {
                    pre: "Comment te sens-tu avant l’effort ? Le temps disponible est un repère, pas une réduction automatique du programme.",
                    post: "Ce retour complète la séance, sans changer ses séries, sa durée ou son statut.",
                    weekly:
                      "Fais le point avec l’équipe virtuelle. Les retours utilisent les règles locales existantes, pas une consultation.",
                    monthly:
                      "Mesure dans des conditions similaires : même endroit, mètre souple, sans serrer. Ne recopie pas une ancienne mesure comme si elle était nouvelle.",
                  }[c.kind]
                }
              </p>
              {c.kind === "post" && (
                <p>
                  <strong>Séance :</strong>{" "}
                  {sessions(p).find((s) => s.ref === c.ref)?.name} ·{" "}
                  {c.sourceDate}
                </p>
              )}
              <label>
                Date du rendez-vous
                <input
                  aria-label="Date du rendez-vous"
                  type="date"
                  required
                  max={today()}
                  value={form.date}
                  disabled={["pre", "post"].includes(c.kind)}
                  onChange={(e) => change("date", e.target.value)}
                />
              </label>
              {c.kind === "weekly" && (
                <p>
                  Du {facts.start} au {facts.end} : {facts.count}{" "}
                  séance(s)/activité(s) enregistrée(s), dont {facts.partial}{" "}
                  séance(s) partielle(s). Ce comptage ne prouve ni progrès ni
                  stagnation.
                </p>
              )}
              {c.kind === "monthly" && (
                <p>
                  Au moins un tour corporel est nécessaire. Une pesée seule ne
                  clôture pas le rappel de mensurations. Les photos ne sont
                  jamais obligatoires.
                </p>
              )}
              {c.kind === "pre" && !c.workoutId && (
                <p>
                  Préparation du jour, non rattachée automatiquement à une
                  future séance. Si une séance est déjà lancée, son identifiant
                  sera conservé avec la préparation.
                </p>
              )}
            </>
          )}
          {step === 1 && (
            <>
              {c.kind === "pre" && (
                <>
                  {field("energy", "Énergie avant séance (1 basse, 5 haute)")}
                  <label>
                    Temps disponible (minutes)
                    <input
                      aria-label="Temps disponible (minutes)"
                      type="number"
                      min="5"
                      max="240"
                      step="1"
                      value={form.minutes}
                      onChange={(e) => change("minutes", e.target.value)}
                    />
                  </label>
                </>
              )}
              {c.kind === "post" && (
                <>
                  {field("effort", "Effort ressenti (1 facile, 10 maximal)", {
                    max: 10,
                  })}
                  {text("problems", "Problèmes rencontrés ou rien à signaler")}
                </>
              )}
              {["pre", "post"].includes(c.kind) && (
                <>
                  <label>
                    Douleur importante liée à l’effort
                    <select
                      aria-label="Douleur importante liée à l’effort"
                      value={form.pain}
                      onChange={(e) => change("pain", e.target.value)}
                    >
                      <option value="">Choisir</option>
                      <option value="no">Non</option>
                      <option value="yes">Oui</option>
                    </select>
                  </label>
                  {form.pain === "yes" &&
                    text(
                      "location",
                      "Où et dans quelles circonstances ? (facultatif)",
                    )}
                </>
              )}
              {c.kind === "weekly" && (
                <>
                  {field("energy", "Énergie (1 basse, 5 haute)", {
                    optional: true,
                  })}
                  {field("fatigue", "Fatigue (1 faible, 5 forte)", {
                    optional: true,
                  })}
                  {field("pain", "Douleur (1 faible, 5 forte)", {
                    optional: true,
                  })}
                  {field("motivation", "Motivation (1 basse, 5 haute)", {
                    optional: true,
                  })}
                  {text("feelings", "Mes ressentis de la semaine")}
                  {text("difficulties", "Mes difficultés")}
                  {text("questions", "Mes questions pour l’équipe")}
                </>
              )}
              {c.kind === "monthly" && (
                <>
                  <div className="ja-measures">
                    {MEASURES.map(([key, label]) => (
                      <label key={key}>
                        {label} (cm)
                        <input
                          aria-label={label + " (cm)"}
                          type="number"
                          min="1"
                          max="300"
                          step="0.1"
                          value={form.values[key] || ""}
                          onChange={(e) =>
                            change("values", {
                              ...form.values,
                              [key]: e.target.value,
                            })
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <label>
                    Poids facultatif (kg)
                    <input
                      aria-label="Poids facultatif (kg)"
                      type="number"
                      min="25"
                      max="350"
                      step="0.1"
                      value={form.weight ?? ""}
                      onChange={(e) => change("weight", e.target.value)}
                    />
                  </label>
                  <label className="ja-check">
                    <input
                      type="checkbox"
                      checked={form.photos}
                      onChange={(e) => change("photos", e.target.checked)}
                    />
                    Ouvrir les photos après l’enregistrement (facultatif)
                  </label>
                  <p>
                    Aucune photo n’est ajoutée ou analysée automatiquement. Tu
                    choisiras un fichier dans le module existant.
                  </p>
                </>
              )}
            </>
          )}
          {pain && (
            <aside className="ja-warning" role="alert">
              Douleur importante signalée : ne poursuis pas l’effort douloureux.
              Une douleur vive ou persistante nécessite un avis professionnel ;
              malaise ou douleur thoracique : demande une aide urgente. La
              confirmation ajoutera ce signal aux ressentis du jour concerné,
              sans effacer un signal antérieur. Aucun diagnostic.
            </aside>
          )}
          {step === 2 && (
            <div className="ja-confirm">
              <h3>Relire avant de confirmer</h3>
              <p>Date : {form.date}</p>
              {c.kind === "pre" && (
                <p>
                  Énergie : {form.energy || "non renseignée"}/5 · Temps :{" "}
                  {form.minutes || "non renseigné"} min · Douleur importante :{" "}
                  {form.pain === "yes"
                    ? "oui"
                    : form.pain === "no"
                      ? "non"
                      : "à renseigner"}
                </p>
              )}
              {c.kind === "post" && (
                <>
                  <p>
                    Séance du {c.sourceDate} · Effort :{" "}
                    {form.effort || "non renseigné"}/10 · Douleur :{" "}
                    {form.pain === "yes"
                      ? "oui"
                      : form.pain === "no"
                        ? "non"
                        : "à renseigner"}
                  </p>
                  <p>{form.problems || "Aucun problème décrit."}</p>
                </>
              )}
              {c.kind === "weekly" && (
                <>
                  {["energy", "fatigue", "pain", "motivation"].map((k) => (
                    <p key={k}>
                      {
                        {
                          energy: "Énergie",
                          fatigue: "Fatigue",
                          pain: "Douleur",
                          motivation: "Motivation",
                        }[k]
                      }{" "}
                      : {form[k] || "non renseigné"}
                    </p>
                  ))}
                  {["feelings", "difficulties", "questions"].map((k) => (
                    <p key={k}>{form[k]}</p>
                  ))}
                </>
              )}
              {c.kind === "monthly" && (
                <>
                  {MEASURES.filter(
                    ([k]) => form.values[k] !== "" && form.values[k] != null,
                  ).map(([k, l]) => (
                    <p key={k}>
                      {l} : {form.values[k]} cm
                    </p>
                  ))}
                  <p>
                    Poids : {form.weight || "non renseigné"}
                    {form.weight ? " kg" : ""} · Photos :{" "}
                    {form.photos ? "ouvrir ensuite" : "sans photo"}
                  </p>
                </>
              )}
              {form.location && <p>{form.location}</p>}
              <strong>
                Enregistrer ces réponses ne lance aucune séance et ne modifie
                pas ton programme.
              </strong>
            </div>
          )}
          {error && (
            <p className="ja-warning" role="alert">
              {error}
            </p>
          )}
          <div className="ja-actions">
            {step > 0 && (
              <button type="button" onClick={() => move(step - 1)}>
                Retour
              </button>
            )}
            {step < 2 ? (
              <button
                key="continue"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  move(step + 1);
                }}
              >
                Continuer
              </button>
            ) : (
              <button key="confirm" type="submit" disabled={!!pending}>
                Confirmer ce rendez-vous
              </button>
            )}
            <button type="button" onClick={closeModal}>
              Garder pour plus tard
            </button>
          </div>
          <button
            className="ja-delete"
            type="button"
            onClick={() => {
              updateProfile((q) => {
                if (q.id === p.id) clearDraft(q, c);
              });
              closeModal();
            }}
          >
            Effacer uniquement le brouillon
          </button>
        </form>
      </Modal>
    );
  }
  return { Board, Dialog };
}
