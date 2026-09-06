import React, { useState, useRef, useEffect } from "react";
import { assetSrc, norm } from "../engine/utils.js";
import { EXERCISES, POOL_GUIDES } from "../data/library.js";
import { demonstrationFor } from "../data/demonstrations.js";
import { Icon } from "./ui.jsx";
import Anatomy from "./Anatomy.jsx";
import { useApp } from "../store/AppContext.jsx";
function demonstration(exercise, movementName) {
  // Résolution centralisée : exacte, variante proche, ou mouvement de la
  // même famille. Voir src/data/demonstrations.js.
  const resolved = exercise ? demonstrationFor(exercise) : null;
  if (resolved)
    return {
      path: resolved.path,
      name: resolved.name,
      exact: resolved.level === "exact",
      level: resolved.level,
    };
  if (movementName) {
    const guide = POOL_GUIDES.find(
      (g) => g.img && g.k.some((k) => norm(movementName).includes(norm(k))),
    );
    if (guide)
      return { path: guide.img, name: guide.t, exact: false, level: "variante" };
  }
  return null;
}
const LEVEL_LABEL = {
  exact: "Illustration humaine · source",
  variante: "Variante très proche · suivez les consignes ci-dessous",
  famille: "Mouvement de la même famille · suivez les consignes ci-dessous",
};
export default function Movement({
  exercise,
  pattern,
  movementName,
  small = false,
  controls = true,
}) {
  const media = demonstration(exercise, movementName),
    image = useRef();
  // Le réglage « animations réduites » du profil fait autorité, complété
  // par la préférence système. Il est lu de façon réactive : basculer
  // l'interrupteur met les démonstrations en pause immédiatement, sans
  // avoir à rouvrir la fiche.
  const { p } = useApp();
  const forced =
    !!p?.preferences.reducedMotion ||
    (typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(forced),
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
    setPaused(forced);
  }, [exercise?.id, media?.path]);
  // Suivre le réglage en direct : on force la pause quand il s'active,
  // on rend la main à l'utilisateur quand il se désactive.
  useEffect(() => {
    setPaused(forced);
  }, [forced]);
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
              ? LEVEL_LABEL[media.level] || LEVEL_LABEL.variante
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
      {!media && exercise && !small && (
        <p className="movement-media-note">
          Pas de démonstration filmée disponible pour cette variante. Suivez ses
          étapes et ses consignes, sans déduire le mouvement de la seule vue
          anatomique.
        </p>
      )}
    </div>
  );
}
