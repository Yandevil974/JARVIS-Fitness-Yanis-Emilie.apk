import { makeTeamReview } from "../engine/team-review.js";
import { validDate } from "../engine/validation.js";
import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  Panel,
  Button,
  Icon,
  Badge,
  SectionHeading,
  Field,
  Input,
  Tabs,
  Empty,
} from "../components/ui.jsx";
import { teamInsights, teamWeek, teamAdvice } from "../engine/team.js";
import { sourcePosition } from "../engine/source-schedule.js";
import { today, dateLabel, assetSrc, uid, num } from "../engine/utils.js";
import { actualDate, numeric } from "../engine/validation.js";
export default function Team() {
  const { p, tab, setTab, updateProfile, notify } = useApp(),
    value = tab || "advisors",
    advisors = teamInsights(p),
    position = sourcePosition(p);
  const [selected, setSelected] = useState(null);
  const reviews = [...(p.teamReviews || [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return (
    <>
      <PageHeading
        eyebrow="L’ÉQUIPE DE VOTRE FICHIER, RETROUVÉE"
        title="Votre équipe autour de vous."
        description="Les mêmes rôles, vos bilans sauvegardés et leurs retours — réunis dans JARVIS."
      >
        <Button
          variant="primary"
          icon="ClipboardPen"
          onClick={() => setTab("review")}
        >
          Faire mon bilan hebdomadaire
        </Button>
      </PageHeading>
      <div className="team-transparency">
        <Icon name="Bot" size={18} />
        <span>
          <b>Équipe virtuelle · règles locales.</b> Il s’agit de retours
          automatiques, comme dans le HTML, pas de consultations ou d’échanges
          avec de vrais professionnels.
        </span>
      </div>
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["advisors", "Mon équipe", advisors.length],
          ["review", "Mon bilan"],
          ["archive", "Retours enregistrés", reviews.length],
        ]}
      />
      {value === "advisors" ? (
        <>
          <div className="team-grid">
            {advisors.map((a, i) => (
              <button
                key={a.id}
                className={`team-advisor advisor-${i} ${selected === i ? "active" : ""}`}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                <img
                  src={assetSrc(a.avatar)}
                  alt="Avatar illustratif d’un conseiller virtuel"
                />
                <span>
                  <strong>{a.name}</strong>
                  <small>{a.role}</small>
                </span>
                <Icon name="ArrowUpRight" size={16} />
              </button>
            ))}
          </div>
          <div className="team-voices">
            {advisors
              .filter((_, i) => selected == null || selected === i)
              .map((a) => (
                <Panel key={a.id} className={`team-voice advisor-${a.id}`}>
                  <div>
                    <img src={assetSrc(a.avatar)} alt="" />
                    <span>
                      <h3>{a.name}</h3>
                      <small>{a.role}</small>
                    </span>
                    <Badge color="blue">RETOUR LOCAL</Badge>
                  </div>
                  <p>{a.text}</p>
                  <details>
                    <summary>Rôle dans votre programme</summary>
                    <p>{a.description}</p>
                  </details>
                </Panel>
              ))}
          </div>
        </>
      ) : value === "review" ? (
        <TeamReviewForm key={p.id + "-" + position.weekGlobal} />
      ) : (
        <div className="team-review-archive">
          {reviews.length ? (
            reviews.map((r) => (
              <Panel key={r.id} className="saved-team-review">
                <div className="saved-review-head">
                  <div>
                    <span>Semaine {r.week + 1}</span>
                    <h2>{dateLabel(r.date)}</h2>
                  </div>
                  <Badge color={r.importedVerbatim ? "amber" : "blue"}>
                    {r.importedVerbatim
                      ? "RETOURS DU JSON CONSERVÉS"
                      : "BILAN JARVIS"}
                  </Badge>
                </div>
                <div className="review-feelings">
                  {[
                    ["Ressentis", r.feelings],
                    ["Difficultés", r.difficulties],
                    ["Question à l’équipe", r.questions],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, text]) => (
                      <div key={label}>
                        <small>{label}</small>
                        <p>{text}</p>
                      </div>
                    ))}
                </div>
                <div className="review-scores">
                  Énergie {r.energy ?? "—"}/5 · Fatigue {r.fatigue ?? "—"}/5 ·
                  Douleur {r.pain ?? "—"}/5 · Motivation {r.motivation ?? "—"}/5
                </div>
                <div className="saved-advices">
                  {r.advice.map((a, i) => (
                    <div key={i}>
                      <Badge
                        color={
                          /santé/i.test(a.tag)
                            ? "pink"
                            : /Coach/i.test(a.tag)
                              ? "amber"
                              : "blue"
                        }
                      >
                        {a.tag}
                      </Badge>
                      <p>{a.text}</p>
                    </div>
                  ))}
                </div>
                {!!r.previousVersions?.length && (
                  <details className="review-version-history">
                    <summary>
                      {r.previousVersions.length} version(s) précédente(s)
                      conservée(s)
                    </summary>
                    {r.previousVersions.map((v, i) => (
                      <div key={i}>
                        <strong>
                          {dateLabel(v.date)} · semaine {v.week + 1}
                        </strong>
                        <p>{v.feelings}</p>
                        {v.difficulties && <p>{v.difficulties}</p>}
                        {v.questions && <p>{v.questions}</p>}
                        {v.advice?.map((a, j) => (
                          <p key={j}>
                            <b>{a.tag} :</b> {a.text}
                          </p>
                        ))}
                      </div>
                    ))}
                  </details>
                )}
                {r.importedVerbatim && (
                  <p className="historical-advice-note">
                    Texte historique importé tel qu’enregistré. Il peut refléter
                    des données incomplètes ou les anciennes règles ; ce n’est
                    pas une nouvelle recommandation ni un avis médical validé.
                  </p>
                )}
              </Panel>
            ))
          ) : (
            <Empty
              icon="MessagesSquare"
              title="Vos retours seront conservés ici"
              text="Restaurez votre JSON ou remplissez un premier bilan."
            />
          )}
        </div>
      )}
    </>
  );
}
function TeamReviewForm() {
  const { p, updateProfile, notify } = useApp();
  const initialPosition = sourcePosition(p);
  const initialExisting = (p.teamReviews || []).find(
    (r) =>
      r.week === initialPosition.weekGlobal &&
      r.source === "jarvis" &&
      (!r.cycleStart || r.cycleStart === p.user.startDate),
  );
  const [form, setForm] = useState(
    initialExisting || {
      date: today(),
      energy: "",
      fatigue: "",
      pain: "",
      motivation: "",
      feelings: "",
      difficulties: "",
      questions: "",
    },
  );
  const position = sourcePosition(
      p,
      validDate(form.date) ? form.date : today(),
    ),
    week = teamWeek(p, position.weekGlobal);
  const existing = (p.teamReviews || []).find(
    (r) =>
      r.week === position.weekGlobal &&
      r.source === "jarvis" &&
      (!r.cycleStart || r.cycleStart === p.user.startDate),
  );
  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  function save(e) {
    e.preventDefault();
    try {
      const review = makeTeamReview(p, form);
      updateProfile((q) => {
        q.teamReviews = (q.teamReviews || []).filter((r) => r.id !== review.id);
        q.teamReviews.push(review);
      });
      notify(
        "Bilan et retours enregistrés. La programmation n’a pas été modifiée.",
      );
    } catch (e) {
      notify(e.message, "error");
    }
  }
  return (
    <Panel className="team-review-form">
      <SectionHeading
        title={`Bilan de la semaine ${position.weekGlobal + 1}`}
        subtitle={`${dateLabel(week.start)} — ${dateLabel(week.end)}`}
      />
      <div className="team-week-facts">
        <span>
          <b>
            {week.completed}/{week.planned}
          </b>{" "}
          séances validées
        </span>
        <span>
          <b>{week.sets}</b> séries déclarées
        </span>
        <span>
          <b>{week.rpe ?? "—"}</b> RPE moyen
        </span>
        <span>
          <b>{week.checkIns}</b> bilans récupération
        </span>
      </div>
      {existing && (
        <p className="source-completion-note">
          Un bilan existe pour cette semaine. Une correction conservera sa
          version précédente ; les retours importés du HTML restent inchangés.
        </p>
      )}
      <form onSubmit={save}>
        <Field label="Date du bilan">
          <Input
            type="date"
            min={p.user.startDate || undefined}
            max={today()}
            required
            value={form.date}
            onChange={(e) => change("date", e.target.value)}
          />
        </Field>
        <div className="form-grid">
          {[
            ["energy", "Énergie"],
            ["fatigue", "Fatigue"],
            ["pain", "Douleur / gêne"],
            ["motivation", "Motivation"],
          ].map(([key, label]) => (
            <Field key={key} label={`${label} / 5`}>
              <Input
                type="number"
                min="1"
                max="5"
                step="1"
                value={form[key] ?? ""}
                placeholder="Non renseigné"
                onChange={(e) => change(key, e.target.value)}
              />
            </Field>
          ))}
        </div>
        {[
          ["feelings", "Mes ressentis"],
          ["difficulties", "Mes difficultés"],
          ["questions", "Ma question ou ma demande à l’équipe"],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <textarea
              className="input"
              rows="3"
              value={form[key] || ""}
              maxLength="5000"
              onChange={(e) => change(key, e.target.value)}
            />
          </Field>
        ))}
        <p className="small-subtitle">
          Vos réponses génèrent des retours locaux et restent dans votre
          historique. Aucune modification de programme n’est imposée par ce
          formulaire. En cas de douleur importante, arrêtez le mouvement et
          demandez un avis compétent.
        </p>
        <Button variant="primary" type="submit" icon="Send">
          Enregistrer mon bilan et les retours
        </Button>
      </form>
    </Panel>
  );
}
