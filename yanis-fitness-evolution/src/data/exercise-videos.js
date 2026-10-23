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
//   "coached"   — vidéo IA jouable comme support de trajectoire, avec un
//                 défaut connu : le descriptif audio et l'avertissement de
//                 `coaching` sont obligatoires et priment sur l'image.
//   "disabled"  — vidéo écartée (défaut constaté) : repli sur le GIF.
//
// RÈGLES :
// - Ne JAMAIS supprimer le GIF d'origine : il reste la solution de repli.
// - Ne JAMAIS marquer "validated" une vidéo dont la prise ou le geste est faux.
//   Une vidéo IA imparfaite reste "coached", avec consigne corrective explicite.
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
    // B2 (catalogue bic #02). Vidéo PixVerse fournie par Yanis le 23/10.
    // La rotation des poignets reste visible : la vidéo sert uniquement de
    // support de trajectoire. Le poster v9 et la consigne ci-dessous définissent
    // la prise à reproduire ; ne pas copier la supination de la vidéo IA.
    src: "/videos/curl-scott-barre-ez-pronation.mp4",
    poster: "/videos/posters/curl-scott-barre-ez-pronation.jpg",
    label: "Vidéo IA · Curl Scott EZ, consigne de prise prioritaire",
    status: "coached",
    coaching: {
      handCue:
        "Prise inversée : paumes vers le sol, dos des mains vers le haut, poignets verrouillés.",
      movementCue:
        "Haut des bras posé sur le pupitre. Montez et descendez la barre EZ en pliant puis en dépliant seulement les coudes, sans élan et sans rotation des mains.",
      notice:
        "La vidéo IA fait tourner les poignets : ne reproduisez pas cette rotation. Suivez le descriptif audio et gardez les paumes vers le sol du début à la fin.",
      spoken:
        "Curl Scott avec barre EZ en prise inversée. Prenez la barre par-dessus : paumes vers le sol, dos des mains vers le haut, poignets verrouillés. Ne les tournez jamais. Le haut des bras reste posé sur le pupitre. Montez en pliant seulement les coudes, puis descendez lentement. Ne reproduisez pas la rotation des mains visible dans la vidéo.",
    },
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
  "curl-haltere-supination-banc-scott-90": {
    // B9 (catalogue bic #09). Vidéo PixVerse fournie par Yanis le 23/10.
    // Comme pour #02, l'IA tourne les poignets pendant la répétition. Le statut
    // reste donc "coached", jamais "validated" : l'audio impose la prise fixe.
    src: "/videos/curl-haltere-supination-banc-scott-90.mp4",
    poster: "/videos/posters/curl-haltere-supination-banc-scott-90.jpg",
    label: "Vidéo IA · Curl Scott 90°, consigne de prise prioritaire",
    status: "coached",
    coaching: {
      handCue:
        "Deux haltères en prise inversée : paumes vers le sol, dos des mains vers le haut, poignets verrouillés.",
      movementCue:
        "Gardez les deux haltères horizontaux et le haut des bras sur le pupitre. Descendez puis remontez en pliant seulement les coudes, ensemble et sans rotation des mains.",
      notice:
        "La vidéo IA fait tourner les poignets : ne reproduisez pas cette rotation. Gardez les paumes vers le sol et les deux haltères horizontaux pendant toute la répétition.",
      spoken:
        "Curl au banc Scott avec deux haltères en prise inversée. Paumes vers le sol, dos des mains vers le haut, poignets verrouillés. Gardez les haltères horizontaux et le haut des bras posé sur le pupitre. Descendez puis remontez ensemble, en pliant seulement les coudes. Aucune rotation des mains : ne reproduisez pas celle visible dans la vidéo.",
    },
  },
  // ---- VAGUE 1 LOT 3 (#11/#13 fournis et validés pour intégration par Yanis le 23/10) ----
  "curl-zottman-assis": {
    // B11. Yanis a validé l'intégration du MP4 malgré sa séquence accélérée
    // et ses prises hautes imparfaites. Le statut reste donc "coached" :
    // le poster et le descriptif audio définissent le geste à reproduire.
    src: "/videos/curl-zottman-assis.mp4",
    poster: "/videos/posters/curl-zottman-assis.jpg",
    label: "Vidéo IA · Curl Zottman assis, consigne prioritaire",
    status: "coached",
    coaching: {
      handCue:
        "Départ haut avec deux haltères : paumes vers le sol, dos des mains vers le haut, doigts retombant autour des poignées.",
      movementCue:
        "Pliez et dépliez seulement les coudes. Descendez en pronation, tournez en supination à l’arrêt en bas, remontez en supination, puis revenez en pronation à l’arrêt en haut.",
      notice:
        "Vidéo IA accélérée : les rotations et la prise haute ne sont pas fidèles. Suivez le poster et le descriptif audio ; ne reproduisez ni la vitesse ni les doigts redressés visibles dans la vidéo.",
      spoken:
        "Curl Zottman assis. Commencez en haut avec deux haltères, paumes vers le sol, dos des mains vers le haut et doigts retombant autour des poignées. Pliez et dépliez seulement les coudes. Descendez en trois secondes en gardant la pronation. Haltères immobiles en bas, tournez les deux avant-bras en supination. Remontez en une seconde, paumes vers le haut. Haltères immobiles en haut, revenez en pronation. Ne reproduisez pas la vitesse ou les doigts redressés de la vidéo IA.",
    },
  },
  "curl-zottman-un-bras-banc-scott": {
    // B13. Intégration validée par Yanis malgré l'amplitude courte, la
    // vitesse et la prise haute de la vidéo IA. Consigne corrective obligatoire.
    src: "/videos/curl-zottman-un-bras-banc-scott.mp4",
    poster: "/videos/posters/curl-zottman-un-bras-banc-scott.jpg",
    label: "Vidéo IA · Zottman un bras au banc Scott, consigne prioritaire",
    status: "coached",
    coaching: {
      handCue:
        "Une seule haltère, départ haut : paume vers le sol, dos de la main vers le haut, doigts retombant autour de la poignée.",
      movementCue:
        "Haut du bras posé sur le pupitre. Pliez et dépliez seulement le coude : descente pronée, rotation à l’arrêt en bas, montée supinée, puis rotation à l’arrêt en haut.",
      notice:
        "Vidéo IA accélérée et amplitude incomplète : ne copiez ni la vitesse, ni la prise haute redressée, ni le mouvement de caméra. Gardez le haut du bras posé et suivez le descriptif audio.",
      spoken:
        "Curl Zottman un bras au banc Scott. Utilisez une seule haltère et gardez le haut du bras posé sur le pupitre. Commencez en haut, paume vers le sol, dos de la main vers le haut et doigts retombant autour de la poignée. Pliez et dépliez seulement le coude. Descendez en quatre secondes en pronation jusqu’à presque tendre le coude. Haltère immobile en bas, tournez l’avant-bras en supination. Remontez en une seconde, paume vers le haut. Haltère immobile en haut, revenez en pronation. Ne reproduisez pas la vitesse, l’amplitude courte ou les doigts redressés de la vidéo IA.",
    },
  },
};

const VIDEO_EXT = /\.(mp4|webm)(\?|#|$)/i;

/** Retourne la vidéo validée ou accompagnée d'une consigne corrective. */
export function videoFor(exercise) {
  const id = typeof exercise === "string" ? exercise : exercise?.id;
  if (!id) return null;
  const v = EXERCISE_VIDEOS[id];
  if (!v || !["validated", "coached"].includes(v.status) || !v.src) return null;
  // Une vidéo IA imparfaite sans consigne ne doit jamais devenir jouable.
  if (v.status === "coached" && !v.coaching?.spoken) return null;
  return v;
}

/** Descriptif texte/audio prioritaire associé à un exercice, s'il existe. */
export function coachingFor(exercise) {
  const id = typeof exercise === "string" ? exercise : exercise?.id;
  return id ? EXERCISE_VIDEOS[id]?.coaching || null : null;
}

/** Vrai si `src` est une ressource vidéo (pour la visionneuse). */
export function isVideoSrc(src) {
  return typeof src === "string" && VIDEO_EXT.test(src);
}

export const VIDEO_LABEL = "Vidéo anatomique 3D";
