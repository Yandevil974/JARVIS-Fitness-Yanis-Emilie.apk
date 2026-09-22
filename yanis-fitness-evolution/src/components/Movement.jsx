import React, { useState, useRef, useEffect, useCallback } from "react";
import { assetSrc, norm } from "../engine/utils.js";
import { demonstrationFor, DEMO_LABELS } from "../engine/demo-match.js";
import { motionFor } from "../engine/human-motion.js";
import { POOL_GUIDES } from "../data/library.js";
import { useApp } from "../store/AppContext.jsx";
import { Icon } from "./ui.jsx";
import Anatomy from "./Anatomy.jsx";
import HumanAnim from "./HumanAnim.jsx";
// Démonstration d'un exercice ou d'une étape de séance.
// Ordre de résolution (aucun écran vide, aucun placeholder générique) :
// 1. GIF source exact de l'exercice ; 2. association explicite / famille
// (moteur demo-match) ; 3. visuel de guide piscine pour une étape nommée ;
// 4. animation humaine créée (moteur human-motion, geste propre au pattern) ;
// 5. respiration guidée ; 6. vue anatomique (exercices non filmables).
function poolGuideFor(name) {
  const n = norm(name);
  return (
    POOL_GUIDES.find(
      (g) => g.img && g.k.some((k) => n.includes(norm(k))),
    ) || null
  );
}
// Étape de séance sans fiche exercice : le pattern est déduit du nom pour que
// l'animation créée corresponde au domaine réel (nage ≠ elliptique ≠ repos).
function stepPattern(name, fallback) {
  const n = norm(name);
  if (/nage|swim|aqua|bassin|piscine|ciseaux|battement|tabata/.test(n)) return "swim";
  if (/etir|stretch/.test(n)) return "stretch";
  if (/elliptique|marche|jogging|course|velo|velo d|.apparat|cardio/.test(n)) return "walk";
  if (/repos|recup|souffler|calme|respir|detente/.test(n)) return "breathe";
  if (/gainage|planche/.test(n)) return "static";
  if (/sprint|fractionne|interval/.test(n)) return "swim";
  return fallback || "mobility";
}
export function demonstration(exercise, movementName) {
  if (exercise) {
    const d = demonstrationFor(exercise);
    if (d) return { ...d, exact: d.level === "exact" };
  }
  if (movementName) {
    const guide = poolGuideFor(movementName);
    if (guide)
      return { path: guide.img, name: guide.t, exact: false, level: "variante" };
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
  const { p, setModal } = useApp();
  const reduced =
    !!p?.preferences?.reducedMotion ||
    (typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(reduced);
  const [frozen, setFrozen] = useState(null);
  const breathe = ["breathe", "respiration"].includes(
    pattern || exercise?.pattern,
  );
  const virtualStep =
    !exercise && movementName
      ? {
          id: "step:" + norm(movementName),
          name: movementName,
          pattern: stepPattern(movementName, pattern),
          muscle: "abs",
        }
      : null;
  const motion =
    !media && (exercise || virtualStep) && !breathe
      ? motionFor(exercise || virtualStep)
      : null;
  const capture = useCallback(() => {
    if (!image.current?.naturalWidth) return;
    try {
      const c = document.createElement("canvas");
      c.width = image.current.naturalWidth;
      c.height = image.current.naturalHeight;
      c.getContext("2d").drawImage(image.current, 0, 0);
      setFrozen(c.toDataURL());
    } catch (e) {}
  }, []);
  useEffect(() => {
    setFrozen(null);
    setPaused(reduced);
  }, [exercise?.id, media?.path, reduced]);
  const toggle = () => {
    if (!paused) capture();
    setPaused((v) => !v);
  };
  const zoomable = (media || motion) && !small;
  return (
    <div
      className={`movement human-movement ${small ? "small" : ""} ${media || motion ? "has-media" : ""} ${breathe ? "breathing-human" : ""}`}
    >
      <div className="movement-visual">
        {media ? (
          <img
            ref={image}
            className={`movement-media ${paused ? "paused" : ""}`}
            src={paused && frozen ? frozen : assetSrc(media.path)}
            alt={
              media.exact
                ? `Démonstration humaine : ${media.name}`
                : `Démonstration humaine d’un mouvement proche : ${media.name}`
            }
            loading="lazy"
            onLoad={() => {
              if (paused && !frozen) capture();
            }}
          />
        ) : motion ? (
          <HumanAnim
            spec={motion}
            paused={paused}
            reduced={reduced}
            small={small}
          />
        ) : breathe ? (
          <div className="human-recovery-visual">
            <img
              src={assetSrc("/recovery-human.jpg")}
              alt="Sportive en posture de récupération et respiration calme"
              loading="lazy"
            />
            <div className={`breath-cadence ${paused ? "paused" : ""}`}>
              <span />
              <p>Inspirez doucement · Expirez lentement</p>
            </div>
          </div>
        ) : exercise ? (
          <div className="movement-atlas">
            <Anatomy
              primary={[exercise.muscle]}
              secondary={exercise.secondary || []}
              compact
            />
          </div>
        ) : null}
        {zoomable && (
          <button
            type="button"
            className="movement-zoom"
            title="Agrandir"
            onClick={() =>
              setModal({
                type: "image",
                src: media?.path,
                poster: null,
                title: media ? media.name : exercise?.name,
                motion: motion || null,
              })
            }
          >
            <Icon name="Maximize2" size={13} /> Agrandir
          </button>
        )}
      </div>
      {controls && (
        <div className="movement-controls">
          {media || motion || breathe ? (
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
              ? DEMO_LABELS[media.level] || DEMO_LABELS.variante
              : motion
                ? DEMO_LABELS.creee
                : breathe
                  ? "Guide respiratoire"
                  : "Anatomie humaine · vue détaillée"}
          </span>
        </div>
      )}
      {media && !media.exact && exercise && !small && (
        <p className="movement-media-note">
          Démonstration de <strong>{media.name}</strong>, mouvement{" "}
          {media.level === "famille" ? "de la même famille" : "très proche"}.
          Le geste de référence est le bon ; suivez les étapes et les consignes
          de <strong>{exercise.name}</strong> pour la position exacte, la prise
          et l’amplitude.
        </p>
      )}
    </div>
  );
}
