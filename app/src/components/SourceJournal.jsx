import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  Panel,
  SectionHeading,
  Button,
  Field,
  Select,
  Badge,
  Icon,
} from "./ui.jsx";
import { dateLabel, numberLabel } from "../engine/utils.js";
export default function SourceJournal() {
  const { p, setModal } = useApp(),
    raw = p.legacyArchive || {},
    dates = Object.keys(raw.journal || {})
      .sort()
      .reverse(),
    [date, setDate] = useState(dates[0] || "");
  const journal = raw.journal?.[date],
    actual = p.sessions.find((s) => s.date === date);
  return (
    <Panel className="source-journal">
      <SectionHeading
        title="Votre journal sauvegardé, ligne par ligne"
        subtitle="Copie d’origine du JSON. Les champs vides sont restés vides, les jours non effectués sont conservés."
      />
      <Field label="Date du journal d’origine">
        <Select value={date} onChange={(e) => setDate(e.target.value)}>
          {dates.map((d) => (
            <option key={d} value={d}>
              {dateLabel(d)}
            </option>
          ))}
        </Select>
      </Field>
      {journal && (
        <>
          <div className="source-journal-status">
            <Badge
              color={
                journal.statut === "ok"
                  ? "blue"
                  : journal.statut === "non"
                    ? "pink"
                    : "amber"
              }
            >
              {journal.statut === "ok"
                ? "Déclarée réalisée"
                : journal.statut === "non"
                  ? "Non effectuée"
                  : "Partielle"}
            </Badge>
            <span>
              {journal.prep?.ech
                ? "Échauffement validé"
                : "Échauffement non renseigné"}{" "}
              ·{" "}
              {journal.prep?.etir
                ? "Étirements validés"
                : "Étirements non renseignés"}
            </span>
          </div>
          {journal.exos?.length ? (
            <div className="source-journal-rows">
              {journal.exos.map((e, i) => (
                <div key={i}>
                  <strong>{e.n}</strong>
                  <div>
                    {[
                      ["Charge", e.ch, "kg (source)"],
                      ["Répétitions", e.reps, ""],
                      ["Séries", e.se, ""],
                      ["RIR", e.rir, ""],
                      ["RPE", e.rpe, "/10"],
                    ].map(([label, value, unit]) => (
                      <span key={label}>
                        <small>{label}</small>
                        <b>
                          {value === "" || value == null
                            ? "Non renseigné"
                            : numberLabel(value)}{" "}
                          {value === "" || value == null ? "" : unit}
                        </b>
                      </span>
                    ))}
                  </div>
                  {e.com && <p>{e.com}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="source-completion-note">
              Journée complémentaire cochée, sans détail de durée ou d’exercices
              dans le fichier. Aucune séance de musculation fictive n’a été
              créée.
            </p>
          )}
          {actual && (
            <Button
              icon="Pencil"
              variant="secondary"
              onClick={() =>
                setModal({ type: "history-session", sessionId: actual.id })
              }
            >
              Ouvrir les données restaurées / corriger
            </Button>
          )}
        </>
      )}
    </Panel>
  );
}
