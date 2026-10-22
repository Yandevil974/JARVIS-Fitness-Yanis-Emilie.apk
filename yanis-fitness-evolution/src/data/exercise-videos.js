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
    // VALIDÉE le 21/10/2026 : montée/descente (4 s, PixVerse), barre posée
    // sur les trapèzes du début à la fin, quads rouges + fessiers orange,
    // anatomie OK. Réserve : filigrane PixVerse.ai bref (comme E1).
    src: "/videos/back-squat.mp4",
    poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo 3D · Back squat",
    status: "validated",
  },
  // ---- VAGUE 1 LOT 1 (biceps, validé le 22/10/2026) ----
  "curl-barre-debout": {
    // B1 (catalogue bic #08). VALIDÉE : montée/descente complète (10 s,
    // FLUX, sans filigrane), prise supination, coudes au corps.
    // NOTE : la vidéo montre une barre EZ alors que le catalogue dit
    // juste « barre » — à régénérer avec une barre droite si Yanis veut
    // l'exactitude stricte.
    src: "/videos/curl-barre-debout.mp4",
    poster: "/videos/posters/curl-barre-debout.jpg",
    label: "Vidéo 3D · Curl barre debout",
    status: "validated",
  },
  "curl-scott-barre-ez-pronation": {
    // B2 (catalogue bic #02). V2 VALIDÉE le 22/10 (vidéo Yanis
    // 1792688200714.mp4) : curl inversé bas→haut→bas (4 s, PixVerse),
    // prise OVERHAND vérifiée par comparatif (doigts par-dessus, comme
    // la ref overhand), barre EZ jusqu'au menton, coudes fixes sur le
    // plan. V1 rejetée (supination au lieu de pronation). Réserve :
    // filigrane bref.
    src: "/videos/curl-scott-barre-ez-pronation.mp4",
    poster: "/videos/posters/curl-scott-barre-ez-pronation.jpg",
    label: "Vidéo 3D · Curl Scott EZ pronation",
    status: "validated",
  },
  "curl-marteau-assis": {
    // B3 (catalogue bic #03). VALIDÉE : marteau assis ALTERNE (4 s,
    // PixVerse), prise neutre, coudes fixes. Réserve : filigrane bref.
    src: "/videos/curl-marteau-assis.mp4",
    poster: "/videos/posters/curl-marteau-assis.jpg",
    label: "Vidéo 3D · Curl marteau assis",
    status: "validated",
  },
  "curl-halteres-incline": {
    // B4 (catalogue bic #04). VALIDÉE : montée/descente complète sur
    // banc incliné (4 s, PixVerse), dos sur le dossier. Réserve :
    // filigrane bref.
    src: "/videos/curl-halteres-incline.mp4",
    poster: "/videos/posters/curl-halteres-incline.jpg",
    label: "Vidéo 3D · Curl haltères incliné",
    status: "validated",
  },
  // ---- VAGUE 1 LOT 2 (validé le 22/10/2026, #09 en attente) ----
  "curl-scott-barre-ez-supination": {
    // B5 (catalogue bic #05). VALIDÉE : curl au pupitre bas→haut (4 s,
    // PixVerse), prise supination (paumes haut, vérifiée en zoom), bras
    // sur le plan. Réserves : filigrane bref + angle dérivant (côté→face).
    src: "/videos/curl-scott-barre-ez-supination.mp4",
    poster: "/videos/posters/curl-scott-barre-ez-supination.jpg",
    label: "Vidéo 3D · Curl Scott EZ supination",
    status: "validated",
  },
  "curl-scott-haltere-prise-neutre": {
    // B6 (catalogue bic #06). VALIDÉE : curl marteau au pupitre bas→haut
    // (4 s, PixVerse), prise neutre paumes face à face (vérifiée en zoom),
    // bras sur le plan. Réserves : filigrane bref + angle dérivant.
    src: "/videos/curl-scott-haltere-prise-neutre.mp4",
    poster: "/videos/posters/curl-scott-haltere-prise-neutre.jpg",
    label: "Vidéo 3D · Curl Scott haltère neutre",
    status: "validated",
  },
  "curl-poulie-basse-supination": {
    // B7 (catalogue bic #07). VALIDÉE : montée/descente complète face à
    // la poulie basse (4 s, PixVerse), barre droite, supination (vérifiée
    // en zoom), câble tendu. Réserve : filigrane bref.
    src: "/videos/curl-poulie-basse-supination.mp4",
    poster: "/videos/posters/curl-poulie-basse-supination.jpg",
    label: "Vidéo 3D · Curl poulie basse supination",
    status: "validated",
  },
  // ---- VAGUE 1 (biceps #09, vidéo reçue le 22/10, décision Yanis) ----
  "curl-haltere-supination-banc-scott-90": {
    // B9 (catalogue bic #09). VALIDÉE le 22/10 (vidéo Yanis
    // 1792688446226.mp4, GARDÉE sur son ordre) : haltères au Scott
    // haut→bas→mi-haut (4 s, PixVerse), supination en haut (paumes vers
    // le visage, vérifiée en zoom), rotation visible. Note : la photo
    // validée montre une pronation (choix assumé) — la vidéo standard
    // fait foi (retour Yanis : les IA ne font pas certaines
    // spécificités). Réserve : filigrane bref.
    src: "/videos/curl-haltere-supination-banc-scott-90.mp4",
    poster: "/videos/posters/curl-haltere-supination-banc-scott-90.jpg",
    label: "Vidéo 3D · Supination au Scott",
    status: "validated",
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
