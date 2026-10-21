// Bibliothèque des démonstrations vidéo 3D (projet « vidéos anatomiques »).
// ---------------------------------------------------------------------------
// ASSOCIATION : chaque entrée lie l'identifiant unique d'un exercice
// (voir EXERCISE_MAP dans library.js) à sa vidéo de démonstration validée.
//
// STATUTS :
//   "pending"   — vidéo prévue mais pas encore générée / validée.
//                 Le lecteur bascule automatiquement sur le GIF existant.
//   "validated" — vidéo vérifiée (anatomie, trajectoire, continuité) et
//                 intégrée. Le lecteur affiche la vidéo EN PREMIER.
//   "disabled"  — vidéo écartée (défaut constaté) : repli sur le GIF.
//
// RÈGLES :
// - Ne JAMAIS supprimer le GIF d'origine tant que la vidéo n'est pas
//   "validated" (solution de repli obligatoire).
// - Formats acceptés : .mp4 (H.264, recommandé Android) puis .webm.
// - Fichiers dans /public/videos/<id-exercice>.mp4 (+ poster .jpg).
// - Les vidéos lourdes (> 8 Mo) ne sont PAS commitées : voir
//   public/videos/README.md (stockage externe + URL).
export const EXERCISE_VIDEOS = {
  // ---- LOT PILOTE (3 exercices) ----
  "curl-halteres": {
    // Pilote 1 — haltères.
    // VALIDÉE le 21/10/2026 : curl alterné (4,7 s, FLUX, sans filigrane),
    // biceps rouges stables, coudes fixes, anatomie OK. Alterné plutôt que
    // simultané : variante d'exécution légitime du « Curl haltères ».
    src: "/videos/curl-halteres.mp4",
    poster: "/videos/posters/curl-halteres.jpg",
    label: "Vidéo 3D · Curl haltères",
    status: "validated",
  },
  "extension-triceps-a-la-poulie": {
    // Pilote 2 — poulie / triceps (demande prioritaire de Yanis).
    // VALIDÉE le 20/10/2026 : mannequin + casquette, pushdown 4 reps,
    // triceps orange, compteur de phase FR, sans filigrane (8,6 s).
    // Style v1 (mannequin gris, pas chromé) — remplaçable par une version
    // chromée sans toucher au lecteur.
    src: "/videos/extension-triceps-a-la-poulie.mp4",
    poster: "/videos/posters/extension-triceps-a-la-poulie.jpg",
    label: "Vidéo 3D · Extension triceps à la poulie",
    status: "validated",
  },
  "back-squat": {
    // Pilote 3 — jambes + barre.
    src: null, // "/videos/back-squat.mp4" une fois validée
    poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo 3D · Back squat",
    status: "pending",
  },
};

const VIDEO_EXT = /\.(mp4|webm)(\?|#|$)/i;

/** Retourne la vidéo validée d'un exercice, ou null (→ repli GIF). */
export function videoFor(exercise) {
  const id = typeof exercise === "string" ? exercise : exercise?.id;
  if (!id) return null;
  const v = EXERCISE_VIDEOS[id];
  if (!v || v.status !== "validated" || !v.src) return null;
  return v;
}

/** Vrai si `src` est une ressource vidéo (pour la visionneuse). */
export function isVideoSrc(src) {
  return typeof src === "string" && VIDEO_EXT.test(src);
}

export const VIDEO_LABEL = "Vidéo anatomique 3D";
