import React, { useEffect, useRef, useState } from "react";
import { assetSrc } from "../engine/utils.js";
import { videoFor } from "../data/exercise-videos.js";
import { Icon } from "./ui.jsx";

// Une seule fiche conserve sa vidéo en mémoire tant qu'elle est à l'écran.
// Les autres conservent le poster ; le GIF et sa miniature ne sont jamais supprimés.
export default function LibraryExerciseVisual({ exercise, onOpen, reducedMotion }) {
  const video = videoFor(exercise);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasVideo = !!video && !failed;

  useEffect(() => {
    setFailed(false);
    setVisible(false);
  }, [exercise.id, video?.src]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasVideo) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [exercise.id, hasVideo]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasVideo) return;
    const updatePlayback = () => {
      if (visible && !reducedMotion && !document.hidden) {
        const promise = node.play();
        promise?.catch(() => {});
      } else {
        node.pause();
      }
    };
    updatePlayback();
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      document.removeEventListener("visibilitychange", updatePlayback);
      node.pause();
    };
  }, [hasVideo, visible, reducedMotion, video?.src]);

  const fallback = exercise.gif
    ? assetSrc(exercise.gif.replace("/media/", "/thumbs/").replace(/\.gif$/, ".webp"))
    : assetSrc(`/human/${["dos", "fes", "isc", "moy", "tri", "lom", "epP"].includes(exercise.muscle) ? "back" : "front"}-card.webp`);

  return (
    <button
      className="exercise-card-visual"
      onClick={() => onOpen(exercise.id)}
      aria-label={`Démonstration ${exercise.name}`}
    >
      {hasVideo ? (
        <video
          ref={ref}
          className="library-video-preview"
          src={visible && !reducedMotion ? assetSrc(video.src) : undefined}
          poster={video.poster ? assetSrc(video.poster) : undefined}
          preload="none"
          autoPlay={visible && !reducedMotion}
          muted
          loop
          playsInline
          aria-hidden="true"
          onError={() => {
            if (visible && !reducedMotion) setFailed(true);
          }}
        />
      ) : (
        <img
          className={exercise.gif ? undefined : "library-anatomy-preview"}
          loading="lazy"
          src={fallback}
          alt=""
          onError={(event) => {
            const image = event.currentTarget;
            if (!image.dataset.fallback && exercise.gif && !reducedMotion) {
              image.dataset.fallback = "gif";
              image.src = assetSrc(exercise.gif);
            } else if (image.dataset.fallback !== "anatomy") {
              image.dataset.fallback = "anatomy";
              image.src = assetSrc(`/human/${["dos", "fes", "isc", "moy", "tri", "lom", "epP"].includes(exercise.muscle) ? "back" : "front"}-card.webp`);
            }
          }}
        />
      )}
      <span className="play-circle"><Icon name="Play" size={16} /></span>
      <span className="visual-label">
        {hasVideo ? (video.status === "coached" ? "VIDÉO IA · CONSIGNES" : "VIDÉO 3D") : exercise.gif ? "GUIDE HUMAIN" : "ANATOMIE RÉALISTE"}
      </span>
    </button>
  );
}
