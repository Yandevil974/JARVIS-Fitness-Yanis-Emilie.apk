/* ============================================================
   COACH VOCAL — composant de séance
   ------------------------------------------------------------
   Se branche sur la séance en cours et le minuteur, et prononce :
   • l'exercice à venir, ses séries, sa charge suggérée et son tempo ;
   • le numéro de série au moment de la validation ;
   • le décompte de récupération (60, 30, 15, 10, 5, 3, 2, 1) ;
   • la reprise après le repos ;
   • la fin de séance.

   Le composant n'affiche qu'une barre de contrôle discrète : tout le
   reste est sonore, pour ne pas avoir à regarder l'écran pendant
   l'effort. Il ne prononce rien si la voix est coupée.
   ============================================================ */
import React, { useEffect, useRef, useState } from "react";
import { useApp, speak } from "../store/AppContext.jsx";
import { advanceTimer } from "../engine/timer.js";
import { exerciseById } from "../data/library.js";
import { useNow } from "./RestTimer.jsx";
import { Icon } from "./ui.jsx";
import {
  createAnnouncer,
  exerciseAnnouncement,
  restAnnouncement,
  restOverAnnouncement,
  setAnnouncement,
  tempoSpoken,
  midSetCue,
} from "../engine/voice-coach.js";

export default function VoiceCoach() {
  const { p, updateProfile, notify } = useApp();
  const workout = p?.workout;
  const enabled = !!p?.preferences.voice && !!p?.preferences.sessionVoice;
  const now = useNow(400);
  const announcer = useRef(null);
  const [last, setLast] = useState("");

  if (!announcer.current)
    announcer.current = createAnnouncer((text) => {
      speak(text, true);
      setLast(text);
    });

  const index = workout?.currentIndex || 0;
  const target = workout?.exercises?.[index];
  const exercise = target ? exerciseById(target.exerciseId) : null;
  const doneSets = target?.sets.filter((s) => s.completed).length ?? 0;

  // Nouvelle séance : on repart d'une file d'annonces vierge.
  useEffect(() => {
    announcer.current.reset();
  }, [workout?.id]);

  // Annonce de l'exercice courant (et du suivant lors d'un changement).
  useEffect(() => {
    if (!enabled || !exercise || !target) return;
    announcer.current.say(
      exerciseAnnouncement(exercise, target, { first: index === 0 }),
      { enabled },
    );
  }, [enabled, exercise?.id, index, workout?.id]);

  // Annonce de la série à venir après chaque validation.
  useEffect(() => {
    if (!enabled || !exercise || !target || doneSets === 0) return;
    if (doneSets >= target.targetSets) return;
    announcer.current.say(
      setAnnouncement(
        doneSets + 1,
        target.targetSets,
        exercise,
        target.recommendation?.weight ?? null,
      ),
      { enabled },
    );
  }, [enabled, doneSets, exercise?.id]);

  // Décompte du repos et reprise.
  const timer = workout && p?.timer?.meta.type === "rest" ? p.timer : null;
  useEffect(() => {
    if (!enabled || !timer) return;
    const live = advanceTimer(timer, now);
    if (live.paused) return;
    if (live.done) {
      announcer.current.say(restOverAnnouncement(exercise?.name), { enabled });
      return;
    }
    const total = timer.steps[timer.index]?.seconds || 0;
    const announcement = restAnnouncement(live.remaining, total);
    if (announcement)
      announcer.current.say(
        { ...announcement, key: `${timer.id}-${announcement.key}` },
        { enabled },
      );
  }, [enabled, now, timer?.id, timer?.paused]);

  // Le repos repart : on autorise à nouveau le décompte.
  useEffect(() => {
    if (!timer?.id) return;
    announcer.current.reset("rest-over");
  }, [timer?.id]);

  if (!workout) return null;
  const tempo = tempoSpoken(target?.tempo || exercise?.tempo);

  return (
    <div className={`voice-coach ${enabled ? "on" : ""}`}>
      <button
        className="voice-coach-toggle"
        aria-pressed={enabled}
        onClick={() => {
          const next = !enabled;
          updateProfile((q) => {
            q.preferences.sessionVoice = next;
            if (next) q.preferences.voice = true;
          });
          announcer.current.reset();
          notify(
            next
              ? "Guidage vocal activé : séries, tempo, repos et changements d’exercice sont annoncés."
              : "Guidage vocal coupé.",
          );
          if (next)
            speak(
              "Guidage vocal activé. Je vous annonce les séries, le tempo et la récupération.",
              true,
            );
        }}
      >
        <Icon name={enabled ? "Volume2" : "VolumeX"} size={18} />
        <span>
          <strong>Guidage vocal {enabled ? "actif" : "coupé"}</strong>
          <small>
            {enabled
              ? last || "Séries, tempo, récupération et changements annoncés."
              : "Activez pour être guidé sans regarder l’écran."}
          </small>
        </span>
      </button>
      {enabled && tempo && (
        <p className="voice-coach-tempo">
          <Icon name="Timer" size={13} /> Tempo prescrit : {tempo}
        </p>
      )}
      {enabled && (
        <div className="voice-coach-actions">
          <button
            onClick={() => {
              const cue = midSetCue(exercise, target?.tempo);
              speak(
                cue?.text ||
                  "Gardez la technique. Une ou deux répétitions en réserve.",
                true,
              );
            }}
          >
            Consigne technique
          </button>
          <button
            onClick={() =>
              speak(
                target
                  ? `${exercise.name}. Série ${doneSets + 1} sur ${target.targetSets}.${
                      target.recommendation?.weight != null
                        ? ` ${target.recommendation.weight} kilos.`
                        : ""
                    }`
                  : "Aucune série en cours.",
                true,
              )
            }
          >
            Répéter la consigne
          </button>
        </div>
      )}
    </div>
  );
}
