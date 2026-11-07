import React from "react";
import { num, numberLabel } from "../engine/utils.js";

// La même valeur pilote le champ de saisie sous la vidéo et celui du formulaire.
// Elle reste une proposition modifiable jusqu'à la validation de la série.
export default function WorkoutLoadControl({ target, exercise, weight, onChange, disabled }) {
  const automatic = target.autoIncrease;
  const entered = num(weight);
  const isAutomatic = automatic && entered != null && entered === num(automatic.to);
  const unit = exercise.bodyweight
    ? "kg ajoutés"
    : target.unit === "kg/main"
      ? "kg/main"
      : target.unit === "source à vérifier"
        ? "unité à vérifier"
        : "kg";
  const changeUnit = automatic?.unit === "kg/main" ? "kg/main" : "kg";
  return (
    <div className="video-workout-load" aria-label="Charge et progression sous la vidéo">
      <div className="video-workout-load-copy">
        <strong>{exercise.timed ? "Exercice au temps" : "Charge pour cette série"}</strong>
        {automatic && !exercise.timed ? (
          <span className={isAutomatic ? "video-workout-load-auto" : "video-workout-load-adjusted"}>
            {isAutomatic ? "Hausse automatique" : "Hausse initiale auto · valeur modifiée"} : {numberLabel(automatic.from)} → {numberLabel(automatic.to)} {changeUnit}
          </span>
        ) : (
          <span>{exercise.timed ? "Aucune charge à saisir" : disabled ? "Exercice terminé ou suspendu" : entered == null ? "Aucune charge proposée · à renseigner" : "Proposition modifiable avant validation"}</span>
        )}
      </div>
      {exercise.timed ? (
        <strong className="video-workout-load-timed">AU TEMPS</strong>
      ) : (
        <label className="video-workout-load-input">
          <input
            aria-label="Charge sous la vidéo"
            type="number"
            inputMode="decimal"
            min="0"
            max="1000"
            step="any"
            placeholder={exercise.bodyweight ? "PDC / 0" : "—"}
            value={weight}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
          />
          <span>{unit}</span>
        </label>
      )}
    </div>
  );
}
