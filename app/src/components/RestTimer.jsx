import React, { useState, useEffect } from "react";
import { useApp, speak } from "../store/AppContext.jsx";
import {
  advanceTimer,
  pauseTimer,
  skipTimer,
  extendTimer,
} from "../engine/timer.js";
import { durationLabel } from "../engine/utils.js";
import { Ring, Icon, Button } from "./ui.jsx";
export function useNow(interval = 250) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(i);
  }, [interval]);
  return now;
}
export function TimerObserver() {
  const { p, updateProfile, notify } = useApp();
  const t = p?.timer;
  useEffect(() => {
    if (!t || t.done || t.paused) return;
    const tick = () => {
      const next = advanceTimer(t);
      if (next.done || next.index !== t.index) {
        updateProfile((q) => {
          if (q.timer?.id === t.id) q.timer = next;
        });
        if (next.done) {
          const msg =
            t.meta.type === "rest"
              ? "Série suivante prête."
              : "Protocole terminé. Confirmez vos résultats pour les enregistrer.";
          notify(msg);
          speak(msg, p.preferences.voice);
        } else speak(next.steps[next.index].name, p.preferences.voice);
      }
    };
    const i = setInterval(tick, 250);
    const visible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearInterval(i);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [t, p?.preferences.voice]);
  return null;
}
export default function RestTimer() {
  const { p, updateProfile } = useApp();
  const now = useNow();
  const base = p.timer;
  const t = base && base.meta.type === "rest" ? advanceTimer(base, now) : null;
  const remaining = t?.remaining || 0;
  return (
    <div className="rest-widget">
      <div className="eyebrow">
        <Icon name="Timer" size={13} /> RÉCUPÉRATION
      </div>
      <Ring
        value={t ? (remaining / t.steps[0].seconds) * 100 : 0}
        size={174}
        color="var(--mint)"
        stroke={5}
      >
        <strong className="timer-numerals">{durationLabel(remaining)}</strong>
        <span>
          {t?.paused
            ? "EN PAUSE"
            : t?.done
              ? "PRÊT POUR LA SUITE"
              : t
                ? "RESPIRER. RÉCUPÉRER."
                : "APRÈS CHAQUE SÉRIE"}
        </span>
      </Ring>
      {t && !t.done ? (
        <div className="timer-actions">
          <button
            aria-label={
              t.paused ? "Reprendre le repos" : "Mettre le repos en pause"
            }
            onClick={() =>
              updateProfile((q) => {
                q.timer = pauseTimer(q.timer);
              })
            }
          >
            <Icon name={t.paused ? "Play" : "Pause"} size={18} />
          </button>
          <button
            onClick={() =>
              updateProfile((q) => {
                q.timer = extendTimer(q.timer, 15);
              })
            }
          >
            +15 s
          </button>
          <button
            aria-label="Terminer le repos"
            onClick={() => {
              updateProfile((q) => {
                q.timer = skipTimer(q.timer);
              });
              speak("Série suivante prête.", p.preferences.voice);
            }}
          >
            <Icon name="SkipForward" size={18} />
          </button>
        </div>
      ) : (
        <p>
          {t?.done
            ? "Série suivante prête. À votre rythme."
            : "Le timer se lance après une série validée."}
        </p>
      )}
    </div>
  );
}
