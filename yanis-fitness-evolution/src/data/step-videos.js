// Correspondance « étape de protocole → vidéo 3D validée ».
// ---------------------------------------------------------------------------
// Les étapes d'échauffement, cardio, piscine et étirements ne sont pas des
// exercices du catalogue : elles sont identifiées par leur NOM (normalisé).
// Clé = norm(nom exact de l'étape) — voir warmup() dans fitness.js,
// CARDIO_STEPS / POOL_GUIDES dans les données.
//
// RÈGLES (idem exercise-videos.js) :
// - Les vidéos validées ou reçues avec réserves explicites sont indiquées ici.
// - Sans entrée, l'affichage actuel (image / guide / respiration) s'applique.
// - Formats : /videos/<fichier>.mp4 + poster /videos/posters/<fichier>.jpg.
import { norm } from "../engine/utils.js";

// Clips reçus, avec réserves et consignes visibles dans le guide et le chrono.
const STRETCH_COBRA = {
  src: "/videos/stretch-cobra.mp4",
  poster: "/videos/posters/stretch-cobra.jpg",
  label: "Vidéo IA · Cobra",
  status: "coached",
  coaching: {
    title: "Un cobra doux, sans forcer les lombaires.",
    notice: "La vidéo monte haut avec les bras presque tendus et le bassin paraît décoller. Ne reproduisez pas cette hauteur : gardez le bassin au tapis, les coudes souples et ne soulevez la poitrine que confortablement.",
    spoken: "Cobra doux. Sur le ventre, gardez le bassin au tapis et les mains près des épaules. Soulevez légèrement la poitrine, coudes souples, sans forcer les lombaires. La vidéo monte haut et le bassin paraît décoller : ne reproduisez pas cette hauteur. Respirez et arrêtez en cas de douleur.",
  },
};
const STRETCH_ENFANT = {
  src: "/videos/stretch-enfant.mp4",
  poster: "/videos/posters/stretch-enfant.jpg",
  label: "Vidéo IA · Position de l'enfant",
  status: "coached",
  coaching: {
    title: "Ramenez les hanches vers les talons sans forcer.",
    notice: "Les pieds et les mains se superposent et se déforment légèrement dans la vidéo. Gardez une position confortable, sans forcer la tête ou les hanches vers le sol.",
    spoken: "Position de l'enfant. À genoux, amenez doucement les hanches vers les talons et allongez les bras. Relâchez la tête, sans forcer le contact avec le sol. Respirez et arrêtez en cas de douleur.",
  },
};
const STRETCH_QUAD = {
  src: "/videos/stretch-quadriceps-debout.mp4",
  poster: "/videos/posters/stretch-quadriceps-debout.jpg",
  label: "Vidéo IA · Étirement quadriceps debout",
  status: "coached",
  coaching: {
    title: "Avec appui, étirez les deux côtés.",
    notice: "La vidéo montre un seul côté et certains appuis se superposent. Tenez un support stable, rapprochez doucement le talon et faites les deux côtés sans forcer.",
    spoken: "Étirement des quadriceps debout. Tenez un support stable, attrapez doucement votre cheville et rapprochez le talon de la fesse, genoux proches et buste droit. La vidéo montre un seul côté : faites les deux côtés. Respirez et arrêtez en cas de douleur.",
  },
};

export const STEP_VIDEOS = {
  "bras tendu contre la poitrine": {
    src: "/videos/stretch-epaule-bras-croise.mp4",
    poster: "/videos/posters/stretch-epaule-bras-croise.jpg",
    label: "Vidéo IA · Étirement de l’épaule",
    status: "coached",
    coaching: {
      title: "Épaule basse, sans tirer fort.",
      notice: "La vidéo maintient la position d’un seul côté ; les mains sont petites à l’écran. Soutenez doucement le bras près du coude et faites les deux côtés.",
      spoken: "Étirement de l’épaule. Tendez un bras devant la poitrine et rapprochez-le doucement avec l’autre main, sans tirer fort, épaule basse. La vidéo montre un seul côté : faites les deux côtés. Respirez et arrêtez en cas de douleur.",
    },
  },
  "coude au dessus de la tete": {
    src: "/videos/stretch-triceps-coude.mp4",
    poster: "/videos/posters/stretch-triceps-coude.jpg",
    label: "Vidéo IA · Étirement du triceps",
    status: "coached",
    coaching: {
      title: "Guidez le coude doucement, sans forcer.",
      notice: "La vidéo montre un seul côté ; la main derrière la tête est masquée et la prise sur le coude est peu lisible. Soutenez doucement le coude et faites les deux côtés.",
      spoken: "Étirement du triceps. Pliez un bras derrière la tête et posez l’autre main sur le coude pour le guider doucement, sans forcer. La main derrière la tête est masquée dans la vidéo. Faites les deux côtés, respirez et arrêtez en cas de douleur.",
    },
  },
  "cobra doux": STRETCH_COBRA,
  "etirement du cobra": STRETCH_COBRA,
  "position de l enfant": STRETCH_ENFANT,
  "position de l enfant (balasana)": STRETCH_ENFANT,
  "talon vers la fesse (debout)": STRETCH_QUAD,
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
  // Échauffement — E4 « Activation fessiers » (pont fessier, séances jambes).
  // Validée le 20/10/2026 avec réserve : montée/descente du bassin correcte
  // mais style du personnage dérivant légèrement (chromé → réaliste) et glow
  // des fessiers perdu en cours de vidéo. Régénérable sans toucher au code.
  "activation fessiers": {
    src: "/videos/warmup-pont-fessier.mp4",
    poster: "/videos/posters/warmup-pont-fessier.jpg",
    label: "Vidéo 3D · Activation fessiers",
  },
  // Échauffement — E5 « Activation scapulaire » (séances haut du corps).
  // Validée le 21/10/2026 : écarté avec élastique (pull-apart + retour),
  // 10 s, sans filigrane (MiniMax), haut du dos orange, anatomie OK.
  "activation scapulaire": {
    src: "/videos/warmup-activation-scapulaire.mp4",
    poster: "/videos/posters/warmup-activation-scapulaire.jpg",
    label: "Vidéo 3D · Activation scapulaire",
  },
};

// Aperçu complet de l'échauffement : montage des étapes validées + cartons
// (docs/videos-3d/montage-apercu.py — relancer le script quand E5 arrivera).
export const WARMUP_OVERVIEW = {
  src: "/videos/warmup-apercu-complet.mp4",
  poster: "/videos/posters/warmup-apercu-complet.jpg",
  label: "Vidéo 3D · Tout l'échauffement",
  duration: "30 s",
};

/** Retourne la vidéo validée d'une étape nommée, ou null (→ affichage actuel). */
export function stepVideoFor(stepName) {
  // La normalisation 1.8.8 conserve « & » alors que la table test7 l'omet.
  // Canonicaliser ce séparateur évite de perdre la vidéo hanches/chevilles
  // lors de la réunification des deux versions.
  const key = norm(stepName || "")
    .replace(/&/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return STEP_VIDEOS[key] || null;
}
