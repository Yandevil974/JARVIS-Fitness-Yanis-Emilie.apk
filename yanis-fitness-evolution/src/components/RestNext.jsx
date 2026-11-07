import React, { useState } from "react";
import { assetSrc } from "../engine/utils.js";
import { nextRestModal } from "../engine/rest-next.js";
import { Icon } from "./ui.jsx";

// La miniature et la visionneuse partagent la vidéo de la fiche. Les vidéos
// « coached » restent accompagnées de leur consigne et de l'audio correctif.
export default function RestNext({ next, setModal, reducedMotion = false }) {
  const [videoError, setVideoError] = useState(null);
  if (!next) return null;
  const unavailable = !!next.video && videoError === next.video.src;
  return (
    <div className="rest-next">
      <span className="eyebrow">ENSUITE</span>
      <div className="rest-next-body">
        {(next.video || next.img) && (
          <button
            type="button"
            className="rest-next-thumb"
            aria-label={`${next.video ? "Agrandir la vidéo" : "Agrandir l’image"} : ${next.nom}`}
            title={next.video ? "Agrandir la vidéo" : "Agrandir l’image"}
            onClick={() => setModal(nextRestModal(next))}
          >
            {next.video ? (
              <video
                key={next.video.src}
                src={assetSrc(next.video.src)}
                poster={
                  next.video.poster ? assetSrc(next.video.poster) : undefined
                }
                aria-label={`Vidéo de ${next.nom}`}
                autoPlay={!reducedMotion}
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setVideoError(next.video.src)}
                onLoadedData={() => setVideoError(null)}
              />
            ) : (
              <img loading="lazy" src={assetSrc(next.img)} alt={next.nom} />
            )}
            <Icon name="Maximize2" size={12} />
          </button>
        )}
        <div>
          <strong>{next.nom}</strong>
          <small>
            Série {next.serie} / {next.total} · {next.reps}{" "}
            {next.charge != null ? `· ${next.charge} ${next.unite}` : ""}
          </small>
          {unavailable ? (
            <small className="rest-next-video-note">
              Vidéo indisponible sur cet appareil.
            </small>
          ) : next.video?.status === "coached" ? (
            <small className="rest-next-video-note">
              Vidéo IA · suivez la consigne de la fiche
            </small>
          ) : null}
        </div>
      </div>
    </div>
  );
}
