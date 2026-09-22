import React, { useEffect, useRef, useState } from "react";
import { useApp, speak } from "../store/AppContext.jsx";
import { advanceTimer } from "../engine/timer.js";
import {
  createAnnouncer,
  exerciseIntroCue,
  setCompleteCue,
  restCountdownCue,
  restOverCue,
  tempoReminderCue,
  tempoCueSentence,
} from "../engine/voice-coach.js";
import { useNow } from "./RestTimer.jsx";
import { Icon } from "./ui.jsx";
import { exerciseById as exerciseLookup } from "../data/library.js";
// Bandeau de guidage vocal de la séance (port de la 1.5.0). Annonces déduites
// de l’état réel : exercice suivant, séries validées, compte à rebours de
// repos, fin de repos, tempo prescrit. Jamais de phrase pendant la pause.
export default function VoiceCoach() {
  const { p, updateProfile, notify } = useApp();
  const workout = p?.workout;
  const enabled = !!(p?.preferences.voice && p?.preferences.sessionVoice);
  const now = useNow(400);
  const queue = useRef(null);
  const [last, setLast] = useState("");
  if (!queue.current)
    queue.current = createAnnouncer((text) => {
      speak(text, true);
      setLast(text);
    });
  const index = workout?.currentIndex || 0,
    row = workout?.exercises?.[index],
    exercise = row ? exerciseLookup(row.exerciseId) : null,
    completedSets = row?.sets.filter((s) => s.completed).length ?? 0;
  useEffect(() => {
    queue.current.reset();
  }, [workout?.id]);
  useEffect(() => {
    if (!enabled || !exercise || !row) return;
    queue.current.say(exerciseIntroCue(exercise, row, { first: index === 0 }), {
      enabled,
    });
  }, [enabled, exercise?.id, index, workout?.id]);
  useEffect(() => {
    if (!enabled || !exercise || !row || completedSets === 0 || completedSets >= row.targetSets)
      return;
    queue.current.say(
      setCompleteCue(
        completedSets + 1,
        row.targetSets,
        exercise,
        row.recommendation?.weight ?? null,
      ),
      { enabled },
    );
  }, [enabled, completedSets, exercise?.id]);
  const restTimer =
    workout && p?.timer?.meta.type === "rest" ? p.timer : null;
  useEffect(() => {
    if (!enabled || !restTimer) return;
    const t = advanceTimer(restTimer, now);
    if (t.paused) return;
    if (t.done) {
      queue.current.say(restOverCue(exercise?.name), { enabled });
      return;
    }
    const stepSeconds = restTimer.steps[restTimer.index]?.seconds || 0,
      cue = restCountdownCue(t.remaining, stepSeconds);
    if (cue)
      queue.current.say(
        { ...cue, key: `${restTimer.id}-${cue.key}` },
        { enabled },
      );
  }, [enabled, now, restTimer?.id, restTimer?.paused]);
  useEffect(() => {
    if (restTimer?.id) queue.current.reset("rest-over");
  }, [restTimer?.id]);
  if (!workout) return null;
  const tempoSentence = tempoCueSentence(row?.tempo || exercise?.tempo);
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
          queue.current.reset();
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
              ? last ||
                "Séries, tempo, récupération et changements annoncés."
              : "Activez pour être guidé sans regarder l’écran."}
          </small>
        </span>
      </button>
      {enabled && tempoSentence && (
        <p className="voice-coach-tempo">
          <Icon name="Timer" size={13} /> Tempo prescrit : {tempoSentence}
        </p>
      )}
      {enabled && (
        <div className="voice-coach-actions">
          <button
            onClick={() => {
              const cue = tempoReminderCue(exercise, row?.tempo);
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
                row
                  ? `${exercise.name}. Série ${completedSets + 1} sur ${row.targetSets}.${row.recommendation?.weight != null ? ` ${row.recommendation.weight} kilos.` : ""}`
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
