import React, { useState, useEffect, useRef } from "react";
import { useApp, speak } from "../store/AppContext.jsx";
import {
  advanceTimer,
  pauseTimer,
  skipTimer,
  extendTimer,
} from "../engine/timer.js";
import { durationLabel } from "../engine/utils.js";
import { nextAnnouncement, initialMemo } from "../platform/voice-coach.js";
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
  // Souvenir des annonces déjà prononcées, pour ne jamais les répéter.
  // Un ref plutôt qu'un state : le faire vivre dans le rendu relancerait
  // l'effet à chaque seconde annoncée.
  const memo = useRef(initialMemo());
  useEffect(() => {
    if (!t) memo.current = initialMemo();
  }, [t?.id]);
  useEffect(() => {
    if (!t || t.done || t.paused) return;
    const tick = () => {
      const next = advanceTimer(t);
      // Coaching vocal : décompte de fin d'étape et changements, pour
      // suivre la séance sans regarder l'écran. Réglage « voix pendant la
      // séance », distinct de la voix du coach dans le dialogue.
      if (p.preferences.voice && p.preferences.sessionVoice !== false) {
        const said = nextAnnouncement(next, memo.current);
        memo.current = said.memo;
        if (said.text) speak(said.text, true);
      }
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
  }, [t, p?.preferences.voice, p?.preferences.sessionVoice]);
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
