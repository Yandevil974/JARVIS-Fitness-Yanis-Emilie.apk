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
      title: "Après le quart en bas, redescendez avant la remontée complète.",
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

  // ---- VAGUE 2 TRICEPS (#02→#04), dépôts et accord de Yanis le 25/10 ----
  // Le dépôt des sources sur la branche par Yanis vaut accord d'exploitation.
  // Les défauts visibles restent documentés : ces vidéos sont "coached",
  // avec posters, notices et audio correctifs, et non techniquement "validated".
  "triceps-dips": {
    // T02. Réserves acceptées : buste incliné, texte IA parasite et filigrane.
    src: "/videos/triceps-dips.mp4",
    poster: "/videos/posters/triceps-dips.jpg",
    label: "Vidéo IA · Triceps dips, posture et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez le buste droit et descendez à 90°, sans copier l’inclinaison de la vidéo IA.",
      handCue:
        "Une main sur chaque barre parallèle, poignets alignés, épaules basses et pieds décollés.",
      movementCue:
        "Descendez en trois secondes jusqu’à environ 90° de flexion des coudes, buste droit, puis remontez en une seconde sans balancement.",
      notice:
        "La vidéo IA incline le buste et ajoute du texte parasite ainsi qu’un filigrane. Suivez le poster et le descriptif audio : buste droit, coudes près du corps, descente contrôlée et tempo 3010 du programme.",
      spoken:
        "Triceps dips sur barres parallèles. Prenez une barre dans chaque main, épaules basses, poignets alignés et pieds décollés. Gardez le buste droit et les coudes près du corps. Descendez en trois secondes jusqu’à environ quatre-vingt-dix degrés de flexion des coudes, sans aller plus bas, puis remontez en une seconde en poussant dans les paumes. Ne balancez pas les jambes et ne marquez aucune pause. Ne reproduisez pas l’inclinaison du buste ni le texte affiché par la vidéo IA. Le tempo 3010 du programme reste prioritaire.",
    },
  },
  "triceps-extensions-halteres-banc-plat": {
    // T03. Appui des coudes et prise neutre lisibles ; réserve : tempo/pause.
    src: "/videos/triceps-extensions-halteres-banc-plat.mp4",
    poster: "/videos/posters/triceps-extensions-halteres-banc-plat.jpg",
    label:
      "Vidéo IA · Extensions triceps banc plat, appui et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez les coudes appuyés et descendez en trois secondes, sans pause en bas.",
      handCue:
        "Deux haltères en prise neutre, paumes face à face et poignets droits ; la barre fixe du banc soutient les coudes, elle n’est pas tenue.",
      movementCue:
        "Allongé, coudes appuyés sur la barre fixe. Descendez les haltères à côté de la tête en trois secondes puis remontez en une seconde, sans bouger les hauts des bras.",
      notice:
        "La vidéo IA conserve l’appui des coudes et la famille du geste, mais elle descend trop vite et marque une pause en bas. Suivez le tempo 3010 : trois secondes de descente, une seconde de remontée, sans pause, avec un espace sûr autour de la tête.",
      spoken:
        "Extensions triceps allongées sur banc plat avec deux haltères. Prenez un haltère dans chaque main en prise neutre, paumes face à face et poignets droits. La barre fixe matelassée du banc reste derrière et légèrement sous les coudes ; elle n’est pas une charge et vous ne la tenez pas. Gardez les hauts des bras immobiles et les coudes légèrement appuyés contre cette barre. Descendez les deux haltères à côté de la tête en trois secondes en pliant seulement les coudes, sans toucher le visage, la casquette ou le banc. Remontez en une seconde en dépliant seulement les coudes, sans pause en bas. Ne reproduisez pas la descente rapide ni la pause de la vidéo IA. Le tempo 3010 du programme reste prioritaire.",
    },
  },
  "french-press-poulie-basse": {
    // T04. Réserves acceptées : un coude part vers l'avant, l'avant-bras passe
    // devant le visage et la corde est peu lisible en bas. L'audio prime.
    src: "/videos/french-press-poulie-basse.mp4",
    poster: "/videos/posters/french-press-poulie-basse.jpg",
    label: "Vidéo IA · French press poulie basse, coudes prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez les deux coudes hauts près de la tête, sans copier le coude qui part vers l’avant.",
      handCue:
        "Une corde reliée à la poulie basse, une extrémité dans chaque main, poignets neutres.",
      movementCue:
        "Dos à la poulie, descendez les mains derrière la tête en trois secondes puis remontez en une seconde en pliant et dépliant seulement les coudes.",
      notice:
        "La vidéo IA laisse un coude partir vers l’avant, place parfois l’avant-bras devant le visage et rend la corde peu lisible en bas. Suivez le poster et le descriptif audio : coudes hauts, mains derrière la tête et tempo 3010 du programme.",
      spoken:
        "French press debout à la poulie basse avec une corde. Placez-vous dos à la poulie, une extrémité de corde dans chaque main, poignets neutres. Gardez les deux coudes hauts, près des oreilles, et le buste gainé. Descendez les mains derrière la tête en trois secondes en pliant seulement les coudes, puis remontez en une seconde en dépliant les coudes. Ne laissez pas un coude partir vers l’avant ou sur les côtés. Ne reproduisez pas le coude qui part vers l’avant ni l’avant-bras devant le visage. La corde reste dans les deux mains et le tempo 3010 du programme reste prioritaire.",
    },
  },

  // ---- VAGUE 2 TRICEPS (#05→#09), dépôts et accord de Yanis le 25/10 ----
  // Dérogation explicite et limitée : #05/#06/#09 peuvent utiliser le MÊME MP4.
  // La source commune reste "coached" : barre près du cou, coudes ouverts et
  // cycles accélérés. Les trois notices imposent des trajectoires différentes ;
  // cette mutualisation ne s'étend à aucun autre exercice.
  "french-press-barre-ez": {
    // T05. La consigne « barre vers le front » prime sur la source commune.
    src: "/videos/extensions-triceps-ez-commune-05-06-09.mp4",
    poster: "/videos/posters/french-press-barre-ez.jpg",
    label:
      "Vidéo IA · French press barre EZ, trajectoire et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Amenez la barre vers le front, jamais vers le cou comme dans la vidéo IA.",
      handCue:
        "Une barre EZ en pronation rapprochée, mains sur les poignées intérieures et poignets alignés.",
      movementCue:
        "Allongé, hauts des bras fixes et coudes à largeur stable. Descendez en quatre secondes vers le front, puis remontez en une seconde en dépliant seulement les coudes.",
      notice:
        "La vidéo IA est partagée avec #06 et #09 à votre demande. Elle descend trop près du cou, ouvre les coudes et va trop vite : ne copiez ni cette trajectoire ni ce tempo. Pour #05, la barre vient vers le front.",
      spoken:
        "French press allongée avec une barre EZ. Prenez les poignées intérieures en pronation rapprochée, poignets alignés. Gardez les hauts des bras fixes et les coudes à largeur stable, sans les ouvrir. Descendez en quatre secondes en pliant seulement les coudes et amenez la barre vers le front, avec un espace sûr, jamais vers le cou ou la gorge. Remontez en une seconde en dépliant seulement les coudes. Ne reproduisez pas la descente près du cou, les coudes ouverts ou la vitesse de la vidéo IA. Le tempo 4010 du programme reste prioritaire.",
    },
  },
  "extensions-triceps-barre-ez": {
    // T06. Extension derrière la tête, sans transformer le geste en pullover.
    src: "/videos/extensions-triceps-ez-commune-05-06-09.mp4",
    poster: "/videos/posters/extensions-triceps-ez-commune-05-06-09.jpg",
    label: "Vidéo IA · Extensions triceps barre EZ, coudes prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez les hauts des bras fixes et la barre derrière la tête, avec un espace sûr.",
      handCue:
        "Une barre EZ en pronation rapprochée, mains sur les poignées intérieures et poignets alignés.",
      movementCue:
        "Allongé, coudes à largeur d’épaules. Descendez en quatre secondes derrière le sommet de la tête, puis remontez en une seconde sans pullover.",
      notice:
        "La vidéo IA est partagée avec #05 et #09 à votre demande : elle amène la barre près du cou, ouvre les coudes et accélère le cycle. Ne copiez pas ces défauts ; pour #06, la barre passe derrière la tête, sans mouvement de pullover.",
      spoken:
        "Extensions triceps allongées avec une barre EZ. Prenez les poignées intérieures en pronation rapprochée, poignets alignés. Gardez les hauts des bras fixes et les coudes à largeur d’épaules, sans les ouvrir. Descendez en quatre secondes en pliant seulement les coudes jusqu’à placer la barre derrière le sommet de la tête, avec un espace sûr, jamais sur le front, le cou ou la gorge. Remontez en une seconde en dépliant seulement les coudes, sans déplacer les épaules et sans pullover. Ne reproduisez pas la descente près du cou, les coudes ouverts ou la vitesse de la vidéo IA. Le tempo 4010 du programme reste prioritaire.",
    },
  },
  "barre-au-front-pushdown-triceps": {
    // T07. Matériel et trajectoire lisibles ; réserve principale : tempo 3010.
    src: "/videos/barre-au-front-pushdown-triceps.mp4",
    poster: "/videos/posters/barre-au-front-pushdown-triceps.jpg",
    label: "Vidéo IA · Pushdown barre droite, tempo prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez les coudes contre le buste et ralentissez la montée à trois secondes.",
      handCue:
        "Une barre droite à la poulie haute, prise en pronation, paumes vers le sol et poignets alignés.",
      movementCue:
        "Montez la barre vers le bas de la poitrine en trois secondes puis descendez près des cuisses en une seconde, sans bouger les épaules ni le buste.",
      notice:
        "La vidéo IA accélère le cycle et marque une pause. La barre, la poulie et les coudes restent lisibles, mais le tempo 3010 et le drop set 10/8/6 du programme priment ; ne copiez pas la vitesse.",
      spoken:
        "Pushdown triceps debout à la poulie haute avec une barre droite. Prenez la barre en pronation, paumes vers le sol, mains à largeur d’épaules et poignets alignés. Gardez les coudes contre les côtes et les épaules immobiles. Laissez la barre monter vers le bas de la poitrine en trois secondes en pliant seulement les coudes, puis poussez-la près des cuisses en une seconde en dépliant seulement les coudes, sans pause. Ne reproduisez pas la vitesse ou les pauses de la vidéo IA. Les nombres dix, huit et six et la réduction de charge du drop set appartiennent au programme, pas à la démonstration. Le tempo 3010 reste prioritaire.",
    },
  },
  "french-press-haltere-un-bras": {
    // T08. Un haltère et main libre au coude ; rotation et tempo corrigés par l'audio.
    src: "/videos/french-press-haltere-un-bras.mp4",
    poster: "/videos/posters/french-press-haltere-un-bras.jpg",
    label: "Vidéo IA · French press haltère un bras, prise prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez le poignet neutre et le haut du bras fixe, sans copier la rotation de l’haltère.",
      handCue:
        "Un seul haltère dans la main de travail, prise neutre et poignet droit ; l’autre main soutient légèrement le coude.",
      movementCue:
        "Allongé, descendez l’haltère à côté de la tête en trois secondes puis remontez en une seconde en pliant et dépliant seulement le coude.",
      notice:
        "La vidéo IA change l’orientation du poignet et de l’haltère, accélère le cycle et termine sa deuxième descente en bas sans remontée contrôlée. Ne copiez ni cette rotation, ni cette vitesse, ni ce raccord de boucle ; chaque répétition revient en haut avec le tempo 3010.",
      spoken:
        "French press allongée avec un seul haltère, un bras à la fois. Tenez l’haltère en prise neutre, poignet droit, et soutenez légèrement le coude avec la main libre. Gardez le haut du bras vertical et fixe. Descendez l’haltère à côté de la tête en trois secondes en pliant seulement le coude, sans contact avec le visage, puis remontez en une seconde en dépliant seulement le coude. Ne reproduisez pas la rotation du poignet, le changement d’orientation de l’haltère ou la vitesse de la vidéo IA. La vidéo s’arrête en bas après sa deuxième descente : remontez toujours en haut avec contrôle pour terminer chaque répétition, sans copier le raccord de boucle. Terminez la série du même côté avant de changer de bras. Le tempo 3010 reste prioritaire.",
    },
  },
  "extensions-triceps-pullover-barre-ez": {
    // T09. La combinaison pullover + extension est dictée, pas la descente au cou.
    src: "/videos/extensions-triceps-ez-commune-05-06-09.mp4",
    poster: "/videos/posters/extensions-triceps-ez-commune-05-06-09.jpg",
    label: "Vidéo IA · Extensions triceps et pullover, arc prioritaire",
    status: "coached",
    coaching: {
      title:
        "Combinez pullover et extension dans un arc derrière la tête, jamais vers le cou.",
      handCue:
        "Une barre EZ en pronation rapprochée, mains sur les poignées intérieures et poignets alignés.",
      movementCue:
        "Allongé, descendez en trois secondes dans un arc derrière la tête en associant épaules et coudes, puis remontez en une seconde au-dessus de la poitrine.",
      notice:
        "La vidéo IA est partagée avec #05 et #06 à votre demande : la descente est trop proche du cou, les coudes s’ouvrent et le cycle est accéléré. Suivez l’audio : arc derrière la tête et mouvement volontaire des épaules.",
      spoken:
        "Extensions triceps combinées à un pullover, allongé avec une barre EZ. Prenez les poignées intérieures en pronation rapprochée, poignets alignés. Descendez en trois secondes dans un arc derrière la tête en pliant les coudes et en laissant les hauts des bras reculer pour le pullover, avec un espace sûr, jamais vers le cou ou la gorge. Remontez en une seconde au-dessus de la poitrine en dépliant les coudes et en ramenant les bras. Gardez la barre horizontale, les côtes contrôlées et les hanches appuyées. Ne reproduisez pas la descente près du cou, les coudes ouverts ou la vitesse de la vidéo IA. Le tempo 3010 du programme reste prioritaire.",
    },
  },

  // ---- VAGUE 2 TRICEPS (#10/#12/#13), dépôts de Yanis le 25/10 ----
  // Le dépôt des trois sources sur la branche vaut accord d'exploitation.
  // Elles restent "coached" : #10 a un tempo approximatif, #12 part en
  // trajectoire croisée et #13 zoome tout en passant près du cou. Les posters,
  // notices et descriptifs audio ci-dessous priment sur ces défauts.
  "developpe-couche-prise-serree": {
    // T10. Barre et prise lisibles ; arrêts et tempo corrigés par l'audio.
    src: "/videos/developpe-couche-prise-serree.mp4",
    poster: "/videos/posters/developpe-couche-prise-serree.jpg",
    label: "Vidéo IA · Développé couché prise serrée, tempo prioritaire",
    status: "coached",
    coaching: {
      title:
        "Descendez en trois secondes vers le bas de la poitrine, sans copier la vitesse de la vidéo IA.",
      handCue:
        "Une barre droite en prise pronée rapprochée, mains à largeur d’épaules ou légèrement moins et poignets empilés.",
      movementCue:
        "Allongé sur banc plat, coudes à 30-45° du buste. Poussez en une seconde puis descendez en trois secondes vers le bas de la poitrine, sans rebond.",
      notice:
        "La barre et la prise sont lisibles, mais la vidéo IA marque des arrêts et ne respecte pas strictement le tempo 3010. Suivez le poster et le descriptif audio : trois secondes de descente, une seconde de montée, sans pause, et jamais de barre vers le cou.",
      spoken:
        "Développé couché prise serrée avec une barre droite. Allongé sur banc plat, prenez la barre en pronation, mains à largeur d’épaules ou légèrement plus rapprochées, sans les coller, et poignets empilés. Gardez les coudes à environ trente à quarante-cinq degrés du buste, les pieds au sol et les hanches appuyées. Poussez la barre en une seconde jusqu’au-dessus de la poitrine, puis descendez en trois secondes vers le bas du sternum, sans rebond ni pause. Ne dirigez jamais la barre vers le cou, le menton ou le front. Ne reproduisez pas la vitesse ou les arrêts de la vidéo IA. Le tempo 3010 du programme reste prioritaire.",
    },
  },
  "pushdown-triceps-cable": {
    // T12. Matériel unilatéral lisible ; trajectoire croisée interdite.
    src: "/videos/pushdown-triceps-cable.mp4",
    poster: "/videos/posters/pushdown-triceps-cable.jpg",
    label: "Vidéo IA · Pushdown unilatéral, coude fixe prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez le coude contre les côtes et ne traversez pas le buste avec la main.",
      handCue:
        "Une seule poignée D dans la main droite à la poulie haute, prise pronée et poignet aligné ; la main gauche reste libre.",
      movementCue:
        "Coude droit fixe contre les côtes. Laissez l’avant-bras monter à 90° en trois secondes puis poussez près de la cuisse en une seconde, sans bouger l’épaule ni le buste.",
      notice:
        "La vidéo IA fait monter la main vers l’épaule opposée et traverse le buste en déplaçant le coude et l’épaule. Ne reproduisez pas cette trajectoire croisée : le poster et le descriptif audio imposent un coude fixe, le mouvement de l’avant-bras seul et le tempo 3010.",
      spoken:
        "Pushdown triceps unilatéral à la poulie haute avec une seule poignée D. Tenez-la dans la main droite, en pronation, poignet aligné, et gardez la main gauche libre sur la hanche. Le coude droit reste fixe contre les côtes et l’épaule immobile. Laissez la poignée remonter lentement en trois secondes en pliant seulement le coude jusqu’à environ quatre-vingt-dix degrés, avant-bras proche de l’horizontale, puis poussez-la près de la cuisse droite en une seconde en dépliant seulement le coude. Ne traversez pas le buste avec la main et ne montez pas vers l’épaule opposée. Ne reproduisez pas la trajectoire croisée, le déplacement de l’épaule ou la vitesse de la vidéo IA. Terminez la série du même côté avant de changer de bras. Le tempo 3010 et les cent vingt secondes de repos du programme restent prioritaires.",
    },
  },
  "california-press-barre-au-cou": {
    // T13. Trajectoire au cou et espace visibles ; zoom et tempo en réserve.
    src: "/videos/california-press-barre-au-cou.mp4",
    poster: "/videos/posters/california-press-barre-au-cou.jpg",
    label: "Vidéo IA · California press au cou, sécurité prioritaire",
    status: "coached",
    coaching: {
      title:
        "Utilisez une charge légère et conservez un espace réel entre la barre et le cou.",
      handCue:
        "Une barre droite légère en prise pronée rapprochée, pouces enroulés et poignets alignés.",
      movementCue:
        "Allongé sur banc plat, poussez en une seconde puis descendez en trois secondes vers la base du cou, coudes proches, sans contact et sans aller au front ou à la poitrine.",
      notice:
        "La trajectoire au cou est visible et un espace subsiste aux instants contrôlés, mais la caméra zoome, le cycle est approximatif et la barre reste très proche du visage. Suivez le poster et le descriptif audio : charge légère, espace constant, aucun contact et tempo 3010.",
      spoken:
        "California press allongé avec une barre droite légère, variante du programme avec descente vers le cou. Prenez la barre en pronation rapprochée, pouces enroulés et poignets alignés. Sur banc plat, gardez la tête et les hanches appuyées, les coudes proches et la charge légère. Poussez la barre en une seconde au-dessus de la ligne haute de la poitrine et du cou, puis redescendez en trois secondes vers la base du cou en pliant les coudes avec un léger ajustement contrôlé des bras. Conservez toujours un espace visible entre la barre, le cou, le menton et le visage. Ne descendez pas vers le front ou le bas de la poitrine et ne cherchez pas une amplitude douloureuse. Ne reproduisez pas le zoom de caméra, la vitesse de la vidéo IA ni tout rapprochement qui supprimerait l’espace de sécurité. Ne pas trop charger. Le tempo 3010 du programme reste prioritaire.",
    },
  },

  // ---- VAGUE 3 PECTORAUX (#01→#08), dépôts de Yanis les 25 et 27/10 ----
  // #01 utilise uniquement la NOUVELLE source remise par Yanis ; l'ancienne
  // reste une preuve de comparaison. Toutes les vidéos de cette vague restent
  // "coached" : les notices et descriptifs audio priment sur les défauts IA.
  // #07 réutilise exactement la source #03, mais avec le tempo 4010 du catalogue.
  "pompes-inclinees-mains-surelevees": {
    // P01. Support et alignement lisibles ; pause haute corrigée par l'audio.
    src: "/videos/pompes-inclinees-mains-surelevees.mp4",
    poster: "/videos/posters/pompes-inclinees-mains-surelevees.jpg",
    label: "Vidéo IA · Pompes inclinées sur barre, tempo prioritaire",
    status: "coached",
    coaching: {
      title:
        "Enchaînez une seconde de montée et deux secondes de descente, sans la pause haute de la vidéo IA.",
      handCue:
        "Mains sur une barre fixe surélevée, légèrement plus larges que les épaules et poignets alignés.",
      movementCue:
        "Corps gainé en ligne tête–hanches–talons et coudes à 45°. Poussez en une seconde puis descendez en deux secondes vers la barre.",
      notice:
        "La nouvelle source remise conserve mieux l’appui et le retour que l’ancienne, mais elle marque une pause en haut. Suivez le poster et le descriptif audio : une seconde de montée, deux secondes de descente, sans pause et toujours avec les mains surélevées.",
      spoken:
        "Pompes inclinées avec les mains surélevées sur une barre fixe stable. Placez les mains légèrement plus larges que les épaules, poignets alignés, puis reculez les pieds pour former une ligne droite de la tête aux talons. Gardez les abdominaux et les fessiers gainés et les coudes à environ quarante-cinq degrés du buste. Depuis la position basse, poitrine proche de la barre sans contact forcé, poussez en une seconde en dépliant les coudes, puis descendez en deux secondes vers la barre sans casser les hanches. Ne reproduisez pas la pause en haut de la vidéo IA et ne remplacez pas le support par des pompes au sol. Le tempo 2010 du programme reste prioritaire.",
    },
  },
  "developpe-couche-halteres": {
    // P02. Deux haltères et banc plat confirmés ; synchronisation en réserve.
    src: "/videos/developpe-couche-halteres.mp4",
    poster: "/videos/posters/developpe-couche-halteres.jpg",
    label: "Vidéo IA · Développé couché haltères, synchronisation prioritaire",
    status: "coached",
    coaching: {
      title:
        "Poussez les deux haltères ensemble et gardez-les synchronisés jusqu’au retour en bas.",
      handCue:
        "Deux haltères indépendants en prise pronée, paumes vers les pieds et poignets empilés au-dessus des avant-bras.",
      movementCue:
        "Sur banc plat, poussez en une seconde, contractez une seconde en haut puis descendez les deux haltères ensemble en deux secondes.",
      notice:
        "Le banc plat et les deux haltères sont lisibles, mais la vidéo IA désynchronise les bras vers la fin. Suivez le poster et le descriptif audio : les deux charges descendent et remontent ensemble, coudes à environ 45°, avec une contraction d’une seconde en haut et le tempo 2011.",
      spoken:
        "Développé couché avec deux haltères sur banc plat. Gardez la tête, les omoplates et les hanches appuyées et les pieds au sol. Tenez un haltère dans chaque main en prise pronée, paumes vers les pieds et poignets empilés. Depuis la position basse, haltères à côté de la poitrine et coudes à environ quarante-cinq degrés du buste, poussez les deux charges ensemble en une seconde sans les entrechoquer. Contractez les pectoraux une seconde en haut, puis descendez les deux haltères ensemble en deux secondes jusqu’à côté de la poitrine, sans pause en bas. Ne reproduisez pas la désynchronisation des bras de la vidéo IA et ne rapprochez pas les haltères du visage. Le tempo 2011 du programme reste prioritaire.",
    },
  },
  "developpe-incline-halteres": {
    // P03. Cycle et banc incliné lisibles ; tête et proximité en réserve.
    src: "/videos/developpe-incline-halteres.mp4",
    poster: "/videos/posters/developpe-incline-halteres.jpg",
    label: "Vidéo IA · Développé incliné haltères, tête appuyée prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez la tête appuyée et descendez les deux haltères à côté du haut de la poitrine.",
      handCue:
        "Deux haltères indépendants en prise pronée, paumes vers les pieds et poignets alignés.",
      movementCue:
        "Sur le banc incliné à 30°, contractez une seconde en haut, descendez en deux secondes puis poussez en une seconde.",
      notice:
        "La vidéo IA redresse légèrement la tête et rapproche les haltères du visage en bas. Suivez le poster et le descriptif audio : tête posée sur le dossier, haltères à côté du haut de la poitrine et tempo 2011, sans devenir un développé épaules.",
      spoken:
        "Développé incliné avec deux haltères. Sur le banc incliné à trente degrés de la référence, gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Tenez un haltère dans chaque main en prise pronée, paumes vers les pieds et poignets alignés. Depuis la position haute, bras presque tendus au-dessus de la poitrine, contractez les pectoraux une seconde, puis descendez les deux haltères ensemble en deux secondes jusqu’à côté du haut de la poitrine. Poussez en une seconde pour revenir en haut, sans pause en bas. Ne reproduisez pas le soulèvement de la tête ni le rapprochement des haltères vers le visage de la vidéo IA. Ne redressez pas le buste pour faire un développé épaules. Le tempo 2011 du programme reste prioritaire.",
    },
  },
  "developpe-incline-barre": {
    // P04. Banc incliné et barre droite confirmés ; trajectoire vers le visage en réserve.
    src: "/videos/developpe-incline-barre.mp4",
    poster: "/videos/posters/developpe-incline-barre.jpg",
    label:
      "Vidéo IA · Développé incliné barre, trajectoire sternum prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez la barre sur la ligne du sternum, jamais devant le visage ni au cou.",
      handCue:
        "Une barre droite en prise pronée, mains légèrement plus larges que les épaules, pouces enroulés et poignets empilés.",
      movementCue:
        "Sur banc incliné, descendez la barre en trois secondes vers le haut ou le milieu du sternum, puis poussez en une seconde.",
      notice:
        "La vidéo IA rapproche la barre du visage et du cou. Suivez le poster et le descriptif audio : barre au-dessus puis vers le sternum, tête appuyée et tempo 3010.",
      spoken:
        "Développé incliné avec une barre droite. Gardez la tête, les omoplates, le dos et les hanches appuyés sur le banc incliné et les pieds au sol. Prenez la barre en pronation, mains légèrement plus larges que les épaules, pouces enroulés et poignets empilés. Depuis la position haute, bras presque tendus et barre au-dessus du sternum, descendez en trois secondes vers le haut ou le milieu du sternum, avec les avant-bras presque verticaux et les coudes modérément rapprochés du buste. Sans pause, poussez en une seconde pour revenir en haut. Ne reproduisez pas la trajectoire de la vidéo IA vers le visage ou le cou : la barre reste sur la ligne de la poitrine. Le tempo 3010 du programme reste prioritaire.",
    },
  },
  "developpe-halteres-plat-prise-neutre": {
    // P05. Banc plat et prise neutre confirmés ; appuis et synchronisation en réserve.
    src: "/videos/developpe-halteres-plat-prise-neutre.mp4",
    poster: "/videos/posters/developpe-halteres-plat-prise-neutre.jpg",
    label:
      "Vidéo IA · Développé plat neutre, appuis et synchronisation prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez la tête et les hanches appuyées, et poussez les deux haltères ensemble.",
      handCue:
        "Deux haltères en prise neutre, paumes face à face et poignets alignés, sans rotation des avant-bras.",
      movementCue:
        "Sur banc plat, descendez les deux haltères ensemble en trois secondes à côté du milieu de la poitrine, puis poussez en une seconde.",
      notice:
        "La vidéo IA redresse le buste, soulève les appuis et désynchronise les bras. Ne copiez pas ce redressement : suivez le poster et le descriptif audio, avec les paumes face à face et le tempo 3010.",
      spoken:
        "Développé avec deux haltères sur banc plat, en prise neutre. Gardez la tête, les omoplates et les hanches appuyées et les pieds au sol. Tenez un haltère dans chaque main, paumes face à face et poignets alignés, sans tourner les avant-bras. Depuis la position haute, descendez les deux haltères ensemble en trois secondes jusqu’à côté du milieu de la poitrine, coudes modérément rapprochés du buste. Sans pause, poussez les deux charges ensemble en une seconde au-dessus de la poitrine, sans les entrechoquer. Ne reproduisez pas le redressement du buste, le soulèvement des hanches ou la désynchronisation des bras de la vidéo IA. Le tempo 3010 du programme reste prioritaire.",
    },
  },
  "ecartes-halteres-decline": {
    // P06. Décliné et grand arc confirmés ; coudes, paumes et synchronisation en réserve.
    src: "/videos/ecartes-halteres-decline.mp4",
    poster: "/videos/posters/ecartes-halteres-decline.jpg",
    label:
      "Vidéo IA · Écartés déclinés, paumes au plafond et grand arc prioritaires",
    status: "coached",
    coaching: {
      title:
        "Ouvrez et refermez les deux bras ensemble, coudes fixes et paumes vers le plafond.",
      handCue:
        "Deux haltères légers, paumes vers le plafond, dos des mains vers le sol et poignets alignés.",
      movementCue:
        "Sur banc décliné, refermez le grand arc en une seconde puis ouvrez en trois secondes, sans changer le léger angle des coudes.",
      notice:
        "La vidéo IA désynchronise les bras et plie les coudes comme dans une presse. Suivez le poster et le descriptif audio : paumes vers le plafond, grand arc simultané, coudes fixes et tempo 3010.",
      spoken:
        "Écartés avec deux haltères légers sur banc décliné. Gardez la tête plus basse que les hanches, le dos appuyé et les jambes fixées. Les paumes restent tournées vers le plafond, le dos des mains vers le sol, et les coudes conservent le même léger angle pendant tout le mouvement. Depuis la position basse étirée, bras ouverts en grand arc au niveau de la poitrine, refermez les deux bras ensemble en une seconde vers le haut, sans entrechoquer les haltères. Ouvrez ensuite les deux bras ensemble en trois secondes pour revenir à l’étirement confortable du départ. Ne reproduisez pas la désynchronisation ou la flexion des coudes de la vidéo IA : ce sont des écartés, pas un développé. Le tempo 3010 du programme reste prioritaire.",
    },
  },
  "developpe-halteres-incline-30": {
    // P07. Source strictement identique à P03 ; le tempo 4010 prime sur sa vitesse.
    src: "/videos/developpe-halteres-incline-30.mp4",
    poster: "/videos/posters/developpe-halteres-incline-30.jpg",
    label: "Vidéo IA · Développé incliné 30°, tempo 4010 prioritaire",
    status: "coached",
    coaching: {
      title:
        "Allongez la descente à quatre secondes et gardez la tête appuyée.",
      handCue:
        "Deux haltères en prise pronée, paumes vers les pieds et poignets alignés.",
      movementCue:
        "Sur banc à 30°, descendez les deux haltères ensemble en quatre secondes à côté du haut de la poitrine, puis poussez en une seconde.",
      notice:
        "La source est identique à celle du développé incliné #03 et trop rapide pour le tempo 4010 ; elle rapproche aussi les haltères du visage. Suivez le poster et le descriptif audio : quatre secondes de descente, une seconde de poussée et tête appuyée.",
      spoken:
        "Développé avec deux haltères sur un banc réglé à trente degrés. Gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Tenez un haltère dans chaque main en prise pronée, paumes vers les pieds et poignets alignés. Depuis la position haute, bras presque tendus au-dessus du haut de la poitrine, descendez les deux haltères ensemble en quatre secondes jusqu’à côté du haut de la poitrine, sans les rapprocher du visage. Sans pause, poussez en une seconde pour revenir en haut. Ne reproduisez pas la vitesse, le soulèvement de la tête ou la proximité des haltères avec le visage de la vidéo IA. Le tempo 4010 du programme reste prioritaire.",
    },
  },
  "developpe-halteres-decline-prise-neutre": {
    // P08. Décliné, prise neutre et cycle confirmés ; vitesse en réserve.
    src: "/videos/developpe-halteres-decline-prise-neutre.mp4",
    poster: "/videos/posters/developpe-halteres-decline-prise-neutre.jpg",
    label: "Vidéo IA · Développé décliné neutre, tempo 4010 prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez la prise neutre et allongez la descente à quatre secondes.",
      handCue:
        "Deux haltères en prise neutre, paumes face à face et poignets alignés, sans rotation des avant-bras.",
      movementCue:
        "Sur banc décliné, descendez les deux haltères ensemble en quatre secondes à côté du bas de la poitrine, puis poussez en une seconde.",
      notice:
        "Le décliné et la prise neutre sont lisibles, mais la vidéo IA est trop rapide pour le tempo 4010. Suivez le poster et le descriptif audio : quatre secondes de descente, une seconde de poussée et deux haltères synchronisés.",
      spoken:
        "Développé avec deux haltères sur banc décliné, en prise neutre. Gardez la tête plus basse que les hanches, le dos appuyé et les jambes fixées. Tenez un haltère dans chaque main, paumes face à face et poignets alignés, sans tourner les avant-bras. Depuis la position haute, bras presque tendus au-dessus du bas de la poitrine, descendez les deux haltères ensemble en quatre secondes jusqu’à côté du bas de la poitrine. Sans pause, poussez les deux charges ensemble en une seconde pour revenir en haut, sans les entrechoquer. Ne reproduisez pas la vitesse de la vidéo IA et conservez la prise neutre du début à la fin. Le tempo 4010 du programme reste prioritaire.",
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
