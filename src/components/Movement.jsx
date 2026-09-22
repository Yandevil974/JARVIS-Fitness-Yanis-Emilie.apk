import React, { useState, useRef, useEffect } from "react";
import { assetSrc, norm } from "../engine/utils.js";
import { EXERCISES, POOL_GUIDES } from "../data/library.js";
import { Icon } from "./ui.jsx";
import HumanAnimation, { resolveAnimationType } from "./HumanAnimation.jsx";

const simplified = (name) =>
  norm(name)
    .replace(/\([^)]*\)|,.*$/g, "")
    .replace(/\b(tempo|plat|moderee?|alternee?s?|variante)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

function demonstration(exercise, movementName) {
  if (exercise?.gif)
    return { path: exercise.gif, name: exercise.name, exact: true, exercise };
  if (exercise) {
    const key = simplified(exercise.name);
    const match = EXERCISES.find(
      (e) =>
        e.gif &&
        e.muscle === exercise.muscle &&
        e.pattern === exercise.pattern &&
        simplified(e.name) === key,
    );
    if (match) return { path: match.gif, name: match.name, exact: false, exercise: match };
  }
  if (movementName) {
    const guide = POOL_GUIDES.find(
      (g) => g.img && g.k.some((k) => norm(movementName).includes(norm(k))),
    );
    if (guide) return { path: guide.img, name: guide.t, exact: false, guide };
  }
  return null;
}

export default function Movement({
  exercise,
  pattern,
  movementName,
  small = false,
  controls = true,
}) {
  const media = demonstration(exercise, movementName);
  const image = useRef();
  const reduced = () =>
    document.documentElement.classList.contains("reduce-motion") ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [paused, setPaused] = useState(reduced);
  const [frozen, setFrozen] = useState(null);
  const [showHumanFallback, setShowHumanFallback] = useState(false);

  const capture = () => {
    if (!image.current?.naturalWidth) return;
    try {
      const c = document.createElement("canvas");
      c.width = image.current.naturalWidth;
      c.height = image.current.naturalHeight;
      c.getContext("2d").drawImage(image.current, 0, 0);
      setFrozen(c.toDataURL());
    } catch (e) {}
  };

  useEffect(() => {
    setFrozen(null);
    setPaused(reduced());
    setShowHumanFallback(false);
  }, [exercise?.id, media?.path, movementName, pattern]);

  const toggle = () => {
    if (media && !paused) capture();
    setPaused((v) => !v);
  };

  const breathe = ["breathe", "respiration"].includes(
    pattern || exercise?.pattern,
  );

  // Always resolve animation type for human fallback
  const animationType = resolveAnimationType({
    exercise,
    movementName,
    pattern,
    muscle: exercise?.muscle,
  });

  // Determine if we should show human animation instead of gif for better coherence
  // For pool exercises without gif, always show human
  // For gym exercises without gif, show human
  const shouldShowHuman = !media || showHumanFallback;

  return (
    <div
      className={`movement human-movement ${small ? "small" : ""} ${media ? "has-media" : ""} ${breathe ? "breathing-human" : ""} anim-${animationType}`}
    >
      <div className="movement-visual">
        {media && !shouldShowHuman ? (
          <div className="movement-media-wrapper">
            <img
              ref={image}
              src={paused && frozen ? frozen : assetSrc(media.path)}
              alt={`Illustration humaine : ${media.name}`}
              loading="lazy"
              onLoad={() => {
                if (paused && !frozen) capture();
              }}
              onError={() => setShowHumanFallback(true)}
            />
            {/* Human animation overlay for coherence check - small indicator */}
            <div className="movement-gif-overlay">
              <HumanAnimation
                exercise={exercise}
                movementName={movementName}
                pattern={pattern}
                paused={paused}
                small={true}
                showLabel={false}
              />
            </div>
          </div>
        ) : (
          <HumanAnimation
            exercise={exercise}
            movementName={movementName}
            pattern={pattern}
            muscle={exercise?.muscle}
            paused={paused}
            small={small}
            showLabel={!small}
          />
        )}
      </div>
      {controls && (
        <div className="movement-controls">
          <button
            onClick={toggle}
            aria-label={
              paused ? "Lire l’animation" : "Mettre l’animation en pause"
            }
          >
            <Icon name={paused ? "Play" : "Pause"} size={14} />
            {paused ? "Lecture" : "Pause"}
          </button>
          <span>
            {media && !shouldShowHuman
              ? media.exact
                ? "Animation humaine · source"
                : "Animation humaine · variante proche"
              : `Animation humaine · ${animationType}`}
          </span>
          {media && !shouldShowHuman && (
            <button
              className="text-link small"
              onClick={() => setShowHumanFallback((v) => !v)}
              style={{ marginLeft: "8px", fontSize: "10px" }}
            >
              {showHumanFallback ? "Voir GIF" : "Voir animation vectorielle"}
            </button>
          )}
        </div>
      )}
      {!media && !small && exercise && (
        <p className="movement-media-note" style={{ display: "none" }}>
          Animation vectorielle humaine générée pour {exercise.name} — type {animationType}
        </p>
      )}
    </div>
  );
}
