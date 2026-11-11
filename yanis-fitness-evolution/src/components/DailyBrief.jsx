import React, { useEffect, useState } from "react";
import { useApp, speak } from "../store/AppContext.jsx";
import { addDays, dateLabel, today } from "../engine/utils.js";
import {
  dailyBrief,
  reminderDate,
  REMINDER_LABELS,
} from "../engine/daily-brief.js";
import { Button } from "./ui.jsx";

export default function DailyBrief() {
  const { p, updateProfile, setModal, navigate, closeModal } = useApp();
  const now = today();
  const brief = dailyBrief(p, now);
  const [configure, setConfigure] = useState(false);
  // One announcement per opening, never again merely because data changed.
  useEffect(() => {
    speak(brief.text, p.preferences.voice);
  }, []);
  function updateReminder(key, patch) {
    updateProfile((q) => {
      q.preferences.dailyReminders ||= {};
      q.preferences.dailyReminders[key] = {
        ...(q.preferences.dailyReminders[key] || {}),
        ...patch,
      };
    });
  }
  function open(key) {
    if (key === "checkin") setModal({ type: "checkin" });
    else if (key === "measurement") setModal({ type: "measurement" });
    else {
      closeModal();
      navigate("progress", key === "photo" ? "photos" : "reports");
    }
  }
  return (
    <section className="daily-brief" aria-label="Synthèse du jour">
      <h3>JARVIS · votre journée</h3>
      <p>{brief.text}</p>
      <p className="small-subtitle">
        La voix dépend des réglages et du téléphone. Les rappels s’affichent
        dans l’application ouverte, sans notification garantie lorsqu’elle est
        fermée.
      </p>
      {brief.reminders.map((r) => (
        <div className="daily-brief-reminder" key={r.key}>
          <div>
            <strong>{r.label}</strong>
            <small>
              Échéance :{" "}
              {dateLabel(r.due, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </small>
          </div>
          <div className="daily-brief-actions">
            <Button variant="secondary small" onClick={() => open(r.key)}>
              Faire maintenant
            </Button>
            <Button
              variant="secondary small"
              onClick={() =>
                updateReminder(r.key, {
                  snoozeFor: r.due,
                  snoozeUntil: addDays(now, 1),
                })
              }
            >
              Plus tard
            </Button>
            {r.key === "review" && (
              <Button
                variant="secondary small"
                onClick={() => updateReminder(r.key, { completedOn: now })}
              >
                Bilan effectué
              </Button>
            )}
          </div>
        </div>
      ))}
      <div className="daily-brief-actions">
        <Button
          variant="secondary small"
          onClick={() => speak(brief.text, true, p.preferences.speechRate)}
        >
          Réécouter
        </Button>
        <Button
          variant="secondary small"
          onClick={() => setConfigure(!configure)}
        >
          {configure ? "Fermer les réglages" : "Régler les échéances"}
        </Button>
      </div>
      {configure && (
        <div className="daily-brief-settings">
          <p>
            Une date par rappel, à renouveler quand vous le souhaitez. Vider une
            date désactive le rappel. Les anciennes données sans date ne
            prouvent pas qu’un rappel est effectué.
          </p>
          {Object.entries(REMINDER_LABELS).map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input
                type="date"
                className="input"
                value={reminderDate(p, key)}
                onChange={(e) =>
                  updateReminder(key, {
                    date: e.target.value,
                    snoozeFor: "",
                    snoozeUntil: "",
                    completedOn: "",
                  })
                }
              />
            </label>
          ))}
          <p>
            Pour Yanis, si le programme source dure 52 semaines, la date
            initiale du bilan est proposée 40 semaines après son début ; elle
            suit un décalage de ce début tant que vous ne la modifiez pas. Aucun
            changement automatique des calories ou de l’objectif.
          </p>
        </div>
      )}
    </section>
  );
}
