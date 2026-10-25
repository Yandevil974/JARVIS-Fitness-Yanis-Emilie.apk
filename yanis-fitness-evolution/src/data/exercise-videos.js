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
  // ---- VAGUE 1 LOT 3 (#10/#12 validés par Yanis le 23/10) ----
  "curl-scott-haltere-neutre": {
    // B10. VALIDÉE par Yanis : une haltère au pupitre, prise neutre,
    // haut du bras supporté et cycle complet (4,04 s, PixVerse).
    // Réserve : filigrane PixVerse.ai, remplaçable sans toucher au lecteur.
    src: "/videos/curl-scott-haltere-neutre.mp4",
    poster: "/videos/posters/curl-scott-haltere-neutre.jpg",
    label: "Vidéo 3D · Curl Scott haltère neutre",
    status: "validated",
  },
  "curl-poulie-basse": {
    // B12. VALIDÉE par Yanis : barre droite reliée à la poulie basse,
    // prise pronation et cycle bas→haut→bas (4,04 s, PixVerse).
    // Réserve : filigrane PixVerse.ai, remplaçable sans toucher au lecteur.
    src: "/videos/curl-poulie-basse.mp4",
    poster: "/videos/posters/curl-poulie-basse.jpg",
    label: "Vidéo 3D · Curl poulie basse pronation",
    status: "validated",
  },
  // ---- #11/#13 fournis et validés pour intégration par Yanis le 23/10 ----
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
  // ---- #14→#17 intégration acceptée par Yanis le 25/10 ----
  // Yanis valide l'utilisation des meilleures sources disponibles, sans les
  // déclarer techniquement parfaites. Elles restent donc toutes "coached" :
  // posters, notices et descriptifs audio priment sur les défauts visuels.
  "curl-halteres-incline-supination": {
    // B14. Réserve acceptée : la source termine en bas, sans le retour haut.
    src: "/videos/curl-halteres-incline-supination.mp4",
    poster: "/videos/posters/curl-halteres-incline-supination.jpg",
    label: "Vidéo IA · Curl incliné supination, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Le retour en haut est obligatoire, même si la vidéo IA s’arrête en bas.",
      handCue:
        "Deux haltères sur banc incliné : départ haut en supination, paumes vers le haut, puis prise neutre en bas.",
      movementCue:
        "Descendez en trois secondes vers la prise neutre, puis remontez en une seconde en supinant progressivement. Gardez le haut des bras immobile et le dos appuyé.",
      notice:
        "La vidéo IA termine en bas et ne montre pas le retour complet. Suivez le poster et le descriptif audio : chaque répétition doit se terminer en haut, en supination.",
      spoken:
        "Curl haltères incliné avec supination. Sur un banc incliné, commencez en haut avec deux haltères, paumes vers le haut et les épaules. Descendez en trois secondes en tournant progressivement les avant-bras vers une prise neutre, paumes vers les cuisses. Sans verrouiller les coudes, remontez en une seconde en supinant progressivement jusqu’aux paumes vers le haut. Gardez le haut des bras immobile et le dos appuyé. Ne reproduisez pas la fin basse de la vidéo IA : remontez toujours jusqu’en haut pour terminer la répétition.",
    },
  },
  "curl-marteau": {
    // B15. Réserves acceptées : rendu instable, chiffres et prise parfois perdue.
    src: "/videos/curl-marteau.mp4",
    poster: "/videos/posters/curl-marteau.jpg",
    label: "Vidéo IA · Curl marteau, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez la prise marteau neutre, quels que soient les changements de la vidéo IA.",
      handCue:
        "Deux haltères verticaux : paumes face à face, pouces vers le haut et poignets droits.",
      movementCue:
        "Descendez en trois secondes puis remontez en une seconde avec les deux bras ensemble, sans rotation des avant-bras et sans élan.",
      notice:
        "La vidéo IA change d’athlète, de cadrage et parfois de prise, avec des chiffres incrustés. Suivez le poster : les haltères restent verticaux et les paumes neutres pendant toute la répétition.",
      spoken:
        "Curl marteau debout. Tenez deux haltères verticaux, paumes face à face, pouces vers le haut et poignets droits. Descendez en trois secondes le long des cuisses, sans verrouiller les coudes. Remontez en une seconde avec les deux bras ensemble, sans élan. Gardez la même prise neutre du début à la fin. Ne reproduisez pas les rotations de prise ou les changements de posture de la vidéo IA. Les chiffres affichés ne sont pas le tempo à suivre.",
    },
  },
  "curl-scott-90-haltere-supination": {
    // B16. Réserves acceptées : caméra instable et coloration sur la cuisse.
    src: "/videos/curl-scott-90-haltere-supination.mp4",
    poster: "/videos/posters/curl-scott-90-haltere-supination.jpg",
    label: "Vidéo IA · Curl Scott 90° supination, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Le geste cible le biceps du bras posé ; ignorez la coloration sur la cuisse.",
      handCue:
        "Un seul haltère au pupitre : paume vers le haut et l’épaule, poignet droit, supination fixe.",
      movementCue:
        "Haut du bras posé sur le coussin. Descendez en trois secondes puis remontez en une seconde en pliant et dépliant seulement le coude, sans rotation.",
      notice:
        "La caméra dérive et la coloration musculaire migre sur la cuisse : c’est un défaut de la vidéo IA. Le geste cible le biceps du bras posé ; gardez la supination fixe et suivez le poster.",
      spoken:
        "Curl Scott 90 degrés avec un haltère. Posez le haut du bras de travail sur le coussin et commencez en haut, paume vers le haut et l’épaule. Descendez en trois secondes sans verrouiller le coude, puis remontez en une seconde. Le haut du bras reste posé et seul le coude bouge. Ne reproduisez pas de rotation du poignet : la supination reste fixe. Ignorez la coloration sur la cuisse, qui est une erreur de la vidéo IA ; le repère musculaire est le biceps du bras posé.",
    },
  },
  "curl-zottman": {
    // B17. Réserves acceptées : remontée supplémentaire et cadrage instable.
    src: "/videos/curl-zottman.mp4",
    poster: "/videos/posters/curl-zottman.jpg",
    label: "Vidéo IA · Curl Zottman debout, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Terminez en bas après le retour en supination, sans la remontée supplémentaire.",
      handCue:
        "Deux haltères : départ bas supiné, montée supinée, descente pronée, puis retour en supination à l’arrêt en bas.",
      movementCue:
        "Montez en une seconde. Haltères immobiles en haut, tournez en pronation. Descendez en trois secondes. Haltères immobiles en bas, revenez en supination.",
      notice:
        "La vidéo IA ajoute une remontée et termine en haut, avec un cadrage instable. Arrêtez la répétition en bas après le retour en supination ; ne copiez pas cette dernière montée.",
      spoken:
        "Curl Zottman debout à deux haltères. Commencez en bas, paumes en supination. Montez en une seconde sans tourner les poignets. Haltères immobiles en haut, tournez les deux avant-bras en pronation, paumes vers le sol. Descendez en trois secondes en gardant la pronation. Haltères immobiles en bas, revenez en supination. C’est la fin de la répétition : ne reproduisez pas la remontée supplémentaire de la vidéo IA, qui termine dans la mauvaise position.",
    },
  },
  // ---- #18→#20 intégration acceptée par Yanis le 25/10 ----
  // L'accord porte sur l'utilisation des trois sources malgré leurs défauts
  // documentés. Elles restent toutes "coached" : posters, notices et audio
  // priment sur l'image ; aucune n'est déclarée techniquement "validated".
  "curl-concentration": {
    // B18. Réserves acceptées : pauses, descente rapide et rendu fluctuant.
    src: "/videos/curl-concentration.mp4",
    poster: "/videos/posters/curl-concentration.jpg",
    label: "Vidéo IA · Curl concentration, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez le bras contre la cuisse et respectez le tempo, sans copier les pauses de la vidéo IA.",
      handCue:
        "Un seul haltère en supination : paume vers le haut au départ, poignet droit, autre main sur la cuisse opposée.",
      movementCue:
        "Haut du bras contre l’intérieur de la cuisse. Montez en une seconde puis descendez en trois secondes, sans pause et en pliant seulement le coude.",
      notice:
        "La vidéo IA marque des pauses, descend trop vite et fait varier l’haltère et le halo. Suivez le poster et le descriptif audio : un seul haltère, supination fixe, montée en une seconde et descente en trois secondes.",
      spoken:
        "Curl concentration. Assis, jambes écartées, un seul haltère en supination, paume vers le haut au départ et poignet droit. Gardez le haut du bras appuyé contre l’intérieur de la cuisse et l’autre main sur la cuisse opposée. Montez en une seconde en pliant seulement le coude, puis descendez en trois secondes sans verrouiller ni marquer de pause. Ne reproduisez pas les pauses, la descente rapide ou les changements d’aspect de l’haltère de la vidéo IA.",
    },
  },
  "curl-halteres-incline-prise-neutre": {
    // B19. Réserve acceptée : le quart ne redescend pas et un cycle est ajouté.
    src: "/videos/curl-halteres-incline-prise-neutre.mp4",
    poster: "/videos/posters/curl-halteres-incline-prise-neutre.jpg",
    label: "Vidéo IA · Curl incliné neutre 1¼, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Après le quart en bas, redescendez avant la remontée complète.",
      handCue:
        "Deux haltères sur banc incliné : prise neutre fixe, paumes face à face, pouces vers le haut et poignets droits.",
      movementCue:
        "Descendez en trois secondes. En bas, montez d’un quart en une seconde, redescendez en une seconde, puis remontez complètement en une seconde. Une seule répétition.",
      notice:
        "La vidéo IA ne redescend pas après le quart et ajoute une répétition. Suivez le poster et le descriptif audio : bas, quart, bas, puis haut ; ne copiez pas l’enchaînement visible.",
      spoken:
        "Curl haltères incliné en prise neutre, méthode un et un quart en bas. Sur banc incliné, deux haltères, paumes face à face, pouces vers le haut et poignets droits. Descendez en trois secondes jusqu’à presque tendre les coudes. En bas, remontez seulement d’un quart de la course en une seconde, puis redescendez complètement en une seconde. Remontez ensuite sur toute l’amplitude en une seconde. C’est une seule répétition : haut, bas, quart, bas, haut. Gardez la prise neutre et le haut des bras immobile. Ne reproduisez pas la remontée directe après le quart ni la deuxième répétition de la vidéo IA.",
    },
  },
  "curl-barre": {
    // B20. Réserves acceptées : cycle rapide, déplacement et fin hors curl.
    src: "/videos/curl-barre.mp4",
    poster: "/videos/posters/curl-barre.jpg",
    label: "Vidéo IA · Curl barre droite, consigne prioritaire",
    status: "coached",
    coaching: {
      title:
        "Restez sur place et terminez en haut, sans suivre le déplacement de la vidéo IA.",
      handCue:
        "Une barre droite en supination : paumes sous la barre, mains à la largeur des épaules, poignets droits.",
      movementCue:
        "Debout et gainé, descendez en trois secondes puis remontez en une seconde en pliant seulement les coudes. Barre horizontale et buste fixe.",
      notice:
        "La vidéo IA est trop rapide puis part vers un banc et ne revient pas en haut. Ne reproduisez pas ce déplacement : restez sur place et suivez le poster et le descriptif audio.",
      spoken:
        "Curl barre debout avec une barre droite. Prenez la barre en supination, paumes sous la barre, mains à la largeur des épaules et poignets droits. Restez debout, gainé et sur place, avec les coudes près du corps. Descendez en trois secondes sans verrouiller, puis remontez en une seconde en pliant seulement les coudes, jusqu’en haut. Ne reproduisez pas la vitesse, la marche vers le banc ou la fin penchée de la vidéo IA. Chaque répétition se termine en haut, sans déplacement.",
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
