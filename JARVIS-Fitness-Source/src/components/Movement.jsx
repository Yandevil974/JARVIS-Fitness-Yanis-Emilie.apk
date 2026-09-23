import React, { useState, useRef, useEffect } from "react";
import { assetSrc, norm } from "../engine/utils.js";
import { EXERCISES, POOL_GUIDES } from "../data/library.js";
import { Icon } from "./ui.jsx";
import Anatomy from "./Anatomy.jsx";
const simplified = (name) =>
  norm(name)
    .replace(/\([^)]*\)|,.*$/g, "")
    .replace(/\b(tempo|plat|moderee?|alternee?s?|variante)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
function demonstration(exercise, movementName) {
  if (exercise?.gif)
    return { path: exercise.gif, name: exercise.name, exact: true };
  if (exercise) {
    const key = simplified(exercise.name);
    const match = EXERCISES.find(
      (e) =>
        e.gif &&
        e.muscle === exercise.muscle &&
        e.pattern === exercise.pattern &&
        simplified(e.name) === key,
    );
    if (match) return { path: match.gif, name: match.name, exact: false };
  }
  if (movementName) {
    const guide = POOL_GUIDES.find(
      (g) => g.img && g.k.some((k) => norm(movementName).includes(norm(k))),
    );
    if (guide) return { path: guide.img, name: guide.t, exact: false };
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
  const media = demonstration(exercise, movementName),
    image = useRef();
  const reduced = () =>
    document.documentElement.classList.contains("reduce-motion") ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [paused, setPaused] = useState(reduced),
    [frozen, setFrozen] = useState(null);
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
  }, [exercise?.id, media?.path]);
  const toggle = () => {
    if (!paused) capture();
    setPaused((v) => !v);
  };
  const breathe = ["breathe", "respiration"].includes(
    pattern || exercise?.pattern,
  );
  return (
    <div
      className={`movement human-movement ${small ? "small" : ""} ${media ? "has-media" : ""} ${breathe ? "breathing-human" : ""}`}
    >
      <div className="movement-visual">
        {media ? (
          <img
            ref={image}
            src={paused && frozen ? frozen : assetSrc(media.path)}
            alt={`Illustration humaine source : ${media.name}`}
            loading="lazy"
            onLoad={() => {
              if (paused && !frozen) capture();
            }}
          />
        ) : exercise && !breathe ? (
          <div className="movement-atlas">
            <Anatomy
              primary={[exercise.muscle]}
              secondary={exercise.secondary || []}
              compact
            />
          </div>
        ) : (
          <div className="human-recovery-visual">
            <img
              src={assetSrc("/recovery-human.jpg")}
              alt="Sportive en posture de récupération et respiration calme"
              loading="lazy"
            />
            {breathe && (
              <div className={`breath-cadence ${paused ? "paused" : ""}`}>
                <span />
                <p>Inspirez doucement · Expirez lentement</p>
              </div>
            )}
          </div>
        )}
      </div>
      {controls && (
        <div className="movement-controls">
          {media || breathe ? (
            <button
              onClick={toggle}
              aria-label={
                paused ? "Lire l’animation" : "Mettre l’animation en pause"
              }
            >
              <Icon name={paused ? "Play" : "Pause"} size={14} />
              {paused ? "Lecture" : "Pause"}
            </button>
          ) : (
            <Icon name="ScanLine" size={15} />
          )}
          <span>
            {media
              ? media.exact
                ? "Illustration humaine · source"
                : "Variante proche · suivre les consignes"
              : breathe
                ? "Guide respiratoire"
                : "Anatomie humaine · vue détaillée"}
          </span>
        </div>
      )}
      {!media && exercise && !small && (
        <p className="movement-media-note">
          Pas de démonstration exacte disponible pour cette variante. Suivez ses
          étapes et ses consignes, sans déduire le mouvement de la seule vue
          anatomique.
        </p>
      )}
    </div>
  );
}
