import React, { useState, useRef, useEffect, useCallback } from "react";
import { assetSrc, norm } from "../engine/utils.js";
import { demonstrationFor, DEMO_LABELS } from "../engine/demo-match.js";
import { demoVideoFor } from "../engine/demo-video.js";
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
// 4. animation humaine créée (moteur human-motion, geste propre au pattern)
//    — cartes d'exercice uniquement : le VRAI comportement 1.5.0 ne montre
//    JAMAIS de figure « créée » pour les étapes nommées (protocoles piscine,
//    cardio elliptique, HIIT) ; elles reçoivent le visuel humain de
//    récupération (ou la cadence respiratoire), comme dans l'original ;
// 5. respiration guidée ; 6. vue anatomique (exercices non filmables).
// Avant tout : une démonstration vidéo 3D validée (manifeste
// src/engine/demo-video.js) prend la main. Si le fichier ne se charge pas, on
// retombe immédiatement sur la résolution d'origine : rien ne casse hors ligne.
function poolGuideFor(name) {
  const n = norm(name);
  return (
    POOL_GUIDES.find(
      (g) => g.img && g.k.some((k) => n.includes(norm(k))),
    ) || null
  );
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
    image = useRef(),
    videoRef = useRef();
  const { p, setModal } = useApp();
  const reduced =
    !!p?.preferences?.reducedMotion ||
    (typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(reduced);
  const [frozen, setFrozen] = useState(null);
  const [videoBroken, setVideoBroken] = useState(false);
  // Vidéo 3D validée : priorité absolue tant qu'elle se lit correctement.
  // Jamais dans les vignettes compactes (`small`) : une liste de séance ne doit
  // pas télécharger plusieurs vidéos — les GIF/animations d'origine y restent.
  const video =
    !videoBroken && !small && exercise ? demoVideoFor(exercise) : null;
  const breathe = ["breathe", "respiration"].includes(
    pattern || exercise?.pattern,
  );
  // Figure « créée » uniquement pour une carte d'exercice sans visuel humain :
  // les étapes nommées d'un protocole (piscine, elliptique, HIIT) suivent le
  // comportement 1.5.0 — visuel humain du guide ou de récupération, jamais de
  // personnage bâton.
  const motion = !media && exercise && !breathe ? motionFor(exercise) : null;
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
    setVideoBroken(false);
  }, [exercise?.id, media?.path, reduced]);
  // Un seul état de lecture pilote l'image animée ET la vidéo.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) el.pause();
    else {
      const p = el.play();
      if (p?.catch) p.catch(() => setPaused(true));
    }
  }, [paused, video?.path]);
  const toggle = () => {
    if (video) {
      setPaused((v) => !v);
      return;
    }
    if (!paused) capture();
    setPaused((v) => !v);
  };
  const zoomable = (video || media || motion) && !small;
  return (
    <div
      className={`movement human-movement ${small ? "small" : ""} ${media || motion ? "has-media" : ""} ${video ? "has-video" : ""} ${breathe ? "breathing-human" : ""}`}
    >
      <div className="movement-visual">
        {video ? (
          <video
            ref={videoRef}
            className="movement-media movement-video"
            src={assetSrc(video.path)}
            poster={video.posterPath ? assetSrc(video.posterPath) : undefined}
            muted
            loop
            playsInline
            autoPlay={!reduced}
            preload="metadata"
            disablePictureInPicture
            aria-label={`Démonstration 3D : ${exercise.name}`}
            onError={() => setVideoBroken(true)}
          />
        ) : media ? (
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
        ) : (
          <div className="human-recovery-visual">
            <img
              src={assetSrc("/recovery-human.jpg")}
              alt="Sportive en posture de récupération et respiration calme"
              loading="lazy"
            />
          </div>
        )}
        {zoomable && (
          <button
            type="button"
            className="movement-zoom"
            title="Agrandir"
            onClick={() =>
              setModal({
                type: "image",
                src: media?.path,
                video: video?.path || null,
                poster: video?.posterPath || null,
                title: video ? exercise?.name : media ? media.name : exercise?.name,
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
          {video || media || motion || breathe ? (
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
            {video
              ? "Démonstration 3D · mouvement contrôlé"
              : media
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
