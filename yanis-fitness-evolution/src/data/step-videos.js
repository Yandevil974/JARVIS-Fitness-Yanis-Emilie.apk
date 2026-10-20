// Correspondance « étape de protocole → vidéo 3D validée ».
// ---------------------------------------------------------------------------
// Les étapes d'échauffement, cardio, piscine et étirements ne sont pas des
// exercices du catalogue : elles sont identifiées par leur NOM (normalisé).
// Clé = norm(nom exact de l'étape) — voir warmup() dans fitness.js,
// CARDIO_STEPS / POOL_GUIDES dans les données.
//
// RÈGLES (idem exercise-videos.js) :
// - N'ajouter ici qu'une vidéo VALIDÉE (grille docs/videos-3d/03-PROCEDURE.md).
// - Sans entrée, l'affichage actuel (image / guide / respiration) s'applique.
// - Formats : /videos/<fichier>.mp4 + poster /videos/posters/<fichier>.jpg.
import { norm } from "../engine/utils.js";

export const STEP_VIDEOS = {
  // Échauffement — E1 « Mise en route » (warmup() dans fitness.js).
  // Validée le 20/10/2026 : marche tapis, personnage + casquette conformes,
  // filigrane bref en début (PixVerse) — remplaçable sans toucher au code.
  "mise en route": {
    src: "/videos/warmup-mise-en-route.mp4",
    poster: "/videos/posters/warmup-mise-en-route.jpg",
    label: "Vidéo 3D · Mise en route",
  },
  // Échauffement — E2 « Mobilité des épaules » (séances haut du corps).
  // Validée le 20/10/2026 : cercles de bras, mouvement confirmé,
  // filigrane PixVerse — remplaçable sans toucher au code.
  "mobilite des epaules": {
    src: "/videos/warmup-mobilite-epaules.mp4",
    poster: "/videos/posters/warmup-mobilite-epaules.jpg",
    label: "Vidéo 3D · Mobilité des épaules",
  },
  // Échauffement — E3 « Mobilité hanches & chevilles » (séances jambes).
  // Validée le 20/10/2026 : squat profond tenu + remontée, mouvement confirmé,
  // filigrane PixVerse — remplaçable sans toucher au code.
  "mobilite hanches chevilles": {
    src: "/videos/warmup-mobilite-hanches.mp4",
    poster: "/videos/posters/warmup-mobilite-hanches.jpg",
    label: "Vidéo 3D · Mobilité hanches & chevilles",
  },
  // Échauffement — E4 « Activation fessiers » (pont fessier, séances jambes).
  // Validée le 20/10/2026 avec réserve : montée/descente du bassin correcte
  // mais style du personnage dérivant légèrement (chromé → réaliste) et glow
  // des fessiers perdu en cours de vidéo. Régénérable sans toucher au code.
  "activation fessiers": {
    src: "/videos/warmup-pont-fessier.mp4",
    poster: "/videos/posters/warmup-pont-fessier.jpg",
    label: "Vidéo 3D · Activation fessiers",
  },
};

/** Retourne la vidéo validée d'une étape nommée, ou null (→ affichage actuel). */
export function stepVideoFor(stepName) {
  return STEP_VIDEOS[norm(stepName || "")] || null;
}
