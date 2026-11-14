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
  // Ischios : les vidéos reçues sont des supports accompagnés, pas des modèles parfaits.
  "souleve-de-terre-roumain-halteres": {
    src: "/videos/souleve-terre-roumain-halteres.mp4", poster: "/videos/posters/souleve-terre-roumain-halteres.jpg", label: "Vidéo IA · Roumain avec haltères", status: "coached",
    coaching: {
      title: "Hanches en arrière, dos neutre et deux haltères.",
      handCue: "Tenez un haltère dans chaque main, bras tendus devant les cuisses.",
      movementCue: "Pieds à plat, genoux souples, reculez les hanches et inclinez le buste en gardant le dos neutre ; les haltères restent près des jambes, puis remontez par les hanches.",
      notice: "Une main et son haltère sont partiellement masqués, la coloration déborde sur le dos et les fessiers, et le tempo exact n'est pas démontré. Suivez la fiche.",
      spoken: "Soulevé de terre roumain avec haltères. Pieds à plat largeur de hanches, tenez un haltère dans chaque main, bras tendus. Genoux souples, reculez les hanches et inclinez le buste avec le dos neutre, les haltères près des jambes. Descendez en trois secondes dans une amplitude confortable, puis revenez debout en avançant les hanches. La deuxième main est partiellement masquée dans la vidéo : vérifiez votre prise. Suivez le tempo et les séries de votre fiche et arrêtez en cas de douleur.",
    },
  },
  // La vidéo montre le leg curl couché sur machine, et non la version suisse-ball.
  "leg-curl-allonge": {
    src: "/videos/leg-curl-allonge.mp4", poster: "/videos/posters/leg-curl-allonge.jpg", label: "Vidéo IA · Leg curl allongé", status: "coached",
    coaching: {
      title: "Bassin sur le banc, pliez les genoux.",
      handCue: "Réglez la machine, placez le rouleau derrière les chevilles et tenez les poignées.",
      movementCue: "Face contre le banc, bassin et cuisses en appui, fléchissez les deux genoux jusqu'à environ 90 degrés puis redescendez sous contrôle.",
      notice: "Les jambes et chaussures se superposent ; le rouleau semble se détacher du mécanisme pendant le mouvement. Le tempo et la position des pieds ne sont pas clairement démontrés. Suivez votre fiche.",
      spoken: "Leg curl allongé à la machine. Réglez la machine, allongez-vous face contre le banc et placez le rouleau derrière les chevilles. Bassin et cuisses restent en appui. Pliez les deux genoux jusqu'à environ quatre-vingt-dix degrés puis redescendez sous contrôle. Les jambes se superposent et le mécanisme du rouleau est peu clair dans la vidéo. Suivez le tempo, la position des pieds et les séries de votre fiche. Arrêtez en cas de douleur.",
    },
  },
  "leg-curl-machine": {
    src: "/videos/leg-curl-allonge.mp4", poster: "/videos/posters/leg-curl-allonge.jpg", label: "Vidéo IA · Leg curl machine allongé", status: "coached",
    coaching: {
      title: "Bassin sur le banc, pliez les genoux.",
      handCue: "Réglez la machine, placez le rouleau derrière les chevilles et tenez les poignées.",
      movementCue: "Face contre le banc, bassin et cuisses en appui, fléchissez les deux genoux jusqu'à environ 90 degrés puis redescendez sous contrôle.",
      notice: "Les jambes et chaussures se superposent ; le rouleau semble se détacher du mécanisme pendant le mouvement. Le tempo et la position des pieds ne sont pas clairement démontrés. Suivez votre fiche.",
      spoken: "Leg curl allongé à la machine. Réglez la machine, allongez-vous face contre le banc et placez le rouleau derrière les chevilles. Bassin et cuisses restent en appui. Pliez les deux genoux jusqu'à environ quatre-vingt-dix degrés puis redescendez sous contrôle. Les jambes se superposent et le mécanisme du rouleau est peu clair dans la vidéo. Suivez le tempo, la position des pieds et les séries de votre fiche. Arrêtez en cas de douleur.",
    },
  },
  "leg-curl-machine-ou-swiss-ball-leg-curl": {
    src: "/videos/leg-curl-allonge.mp4", poster: "/videos/posters/leg-curl-allonge.jpg", label: "Vidéo IA · Leg curl machine allongé", status: "coached",
    coaching: {
      title: "Bassin sur le banc, pliez les genoux.",
      handCue: "Réglez la machine, placez le rouleau derrière les chevilles et tenez les poignées.",
      movementCue: "Face contre le banc, bassin et cuisses en appui, fléchissez les deux genoux jusqu'à environ 90 degrés puis redescendez sous contrôle.",
      notice: "Les jambes et chaussures se superposent ; le rouleau semble se détacher du mécanisme pendant le mouvement. Le tempo et la position des pieds ne sont pas clairement démontrés. Pour la variante swiss-ball, cette vidéo de machine ne la démontre pas. Suivez votre fiche.",
      spoken: "Leg curl allongé à la machine. Réglez la machine, allongez-vous face contre le banc et placez le rouleau derrière les chevilles. Bassin et cuisses restent en appui. Pliez les deux genoux jusqu'à environ quatre-vingt-dix degrés puis redescendez sous contrôle. Les jambes se superposent et le mécanisme du rouleau est peu clair dans la vidéo. La variante sur ballon est différente et n'est pas montrée ici. Suivez le tempo, la position des pieds et les séries de votre fiche. Arrêtez en cas de douleur.",
    },
  },
  // Cadrage coupé : source provisoire à remplacer par une vidéo entière.
  "souleve-de-terre-roumain-barre": {
    src: "/videos/souleve-terre-roumain-barre-provisoire.mp4", poster: "/videos/posters/souleve-terre-roumain-barre-provisoire.jpg", label: "Vidéo IA · Roumain barre — cadrage à refaire", status: "coached",
    coaching: {
      title: "Barre proche des jambes, hanches en arrière.",
      handCue: "Saisissez la barre à deux mains à l'extérieur des jambes, bras tendus.",
      movementCue: "Pieds à plat et genoux souples, reculez les hanches, dos neutre ; gardez la barre près des jambes puis revenez debout sans cambrer.",
      notice: "La tête est coupée lorsque l'athlète se redresse : vidéo provisoire à refaire, non conforme au cadrage intégral. La coloration concerne l'avant des cuisses, le tempo exact n'est pas démontré et la boucle saute. Suivez la fiche.",
      spoken: "Soulevé de terre roumain à la barre. Pieds à plat largeur de hanches, saisissez la barre à deux mains, bras tendus. Reculez les hanches en gardant les genoux souples et le dos neutre ; la barre reste près des jambes. Descendez dans une amplitude confortable puis remontez en avançant les hanches sans vous cambrer. La tête est coupée dans la vidéo, qui doit être refaite. Suivez votre fiche et arrêtez en cas de douleur.",
    },
  },
  // Cadrage coupé : source provisoire à remplacer par une vidéo entière.
  "souleve-de-terre-roumain-barre-test-3-5-reps": {
    src: "/videos/souleve-terre-roumain-barre-provisoire.mp4", poster: "/videos/posters/souleve-terre-roumain-barre-provisoire.jpg", label: "Vidéo IA · Roumain barre — cadrage à refaire", status: "coached",
    coaching: {
      title: "Barre proche des jambes, hanches en arrière.",
      handCue: "Saisissez la barre à deux mains à l'extérieur des jambes, bras tendus.",
      movementCue: "Pieds à plat et genoux souples, reculez les hanches, dos neutre ; gardez la barre près des jambes puis revenez debout sans cambrer.",
      notice: "La tête est coupée lorsque l'athlète se redresse : vidéo provisoire à refaire, non conforme au cadrage intégral. La coloration concerne l'avant des cuisses, le tempo exact n'est pas démontré et la boucle saute. Suivez la fiche.",
      spoken: "Soulevé de terre roumain à la barre. Pieds à plat largeur de hanches, saisissez la barre à deux mains, bras tendus. Reculez les hanches en gardant les genoux souples et le dos neutre ; la barre reste près des jambes. Descendez dans une amplitude confortable puis remontez en avançant les hanches sans vous cambrer. La tête est coupée dans la vidéo, qui doit être refaite. Suivez votre fiche et arrêtez en cas de douleur.",
    },
  },
  // Quadriceps #23 : presse unilatérale, clip reçu.
  "leg-press-unilateral": {
    src: "/videos/leg-press-unilateral.mp4",
    poster: "/videos/posters/leg-press-unilateral.jpg",
    label: "Vidéo IA · Presse unilatérale",
    status: "coached",
    coaching: {
      title: "Une seule jambe pousse le plateau.",
      handCue: "Réglez la machine et tenez les poignées ; gardez le pied libre à l'écart du chariot et des rails.",
      movementCue: "Dos et bassin en appui, un seul pied à plat sur le plateau ; fléchissez puis tendez la jambe sans verrouiller le genou. Travaillez les deux côtés.",
      notice: "La seconde main est masquée, la coloration rouge s'étend aussi à la jambe libre et au bras et le tempo exact n'est pas démontré. La position du pied libre dépend de la machine ; gardez-le hors de toute pièce mobile.",
      spoken: "Presse à cuisses unilatérale. Réglez la machine et maintenez dos et bassin en appui. Placez un seul pied à plat sur le plateau, et gardez l'autre jambe à l'écart du chariot et des rails. Descendez en trois secondes dans une amplitude confortable, genou dans l'axe du pied, puis poussez en une seconde sans le verrouiller. Le pied libre ne pousse pas. Travaillez les deux côtés. La coloration rouge s'étend aussi ailleurs dans la vidéo ; suivez la consigne. Quatre séries de dix à douze, quatre-vingt-dix secondes de repos. Arrêtez en cas de douleur.",
    },
  },
  // Quadriceps #09 : vidéo reçue, provisoire car main au bord du cadre.
  "leg-press": {
    src: "/videos/leg-press.mp4",
    poster: "/videos/posters/leg-press.jpg",
    label: "Vidéo IA · Presse à cuisses, cadrage à vérifier",
    status: "coached",
    coaching: {
      title: "Dos en appui, pieds parallèles sur le plateau.",
      handCue: "Réglez la machine, gardez le dos et le bassin contre le dossier et tenez les poignées.",
      movementCue: "Pieds à plat à largeur de hanches, fléchissez les genoux jusqu'à une amplitude confortable proche de 90 degrés, puis poussez sans les verrouiller.",
      notice: "La main visible touche le bord inférieur et paraît partiellement coupée à la fin du clip ; l'autre est masquée. La vidéo est provisoire et doit être refaite avec l'athlète entier. La flexion semble plus profonde que la consigne de la fiche et le tempo exact n'est pas démontré.",
      spoken: "Presse à cuisses. Réglez le siège et les sécurités, gardez le dos et le bassin en appui, et tenez les poignées. Placez les deux pieds à plat et parallèles, largeur de hanches. Descendez le plateau en trois secondes jusqu'à une flexion confortable proche de quatre-vingt-dix degrés, puis poussez en une seconde sans verrouiller brutalement les genoux. La vidéo descend plus bas et une main paraît coupée en fin de clip : suivez votre fiche. Cinq séries de dix à douze, soixante secondes de repos. Arrêtez en cas de douleur.",
    },
  },
  // Quadriceps #19 : vidéo reçue, provisoire car chaussures coupées.
  "split-squat-poulie-basse": {
    src: "/videos/split-squat-poulie-basse.mp4",
    poster: "/videos/posters/split-squat-poulie-basse.jpg",
    label: "Vidéo IA · Split squat poulie basse, cadrage à refaire",
    status: "coached",
    coaching: {
      title: "Fente statique face à la poulie basse.",
      handCue: "Tenez une poignée de poulie basse dans une main, bras allongé près du corps, sans tirer avec le bras.",
      movementCue: "Pied avant à plat, pied arrière sur les orteils, gardez les deux pieds à leur place ; fléchissez les genoux puis remontez sous contrôle.",
      notice: "Les chaussures sont coupées en haut du mouvement dans la vidéo source : elle est provisoire et doit être refaite. Le câble se confond avec la jambe et le tempo exact n'est pas démontré. Suivez les consignes de la fiche.",
      spoken: "Split squat à la poulie basse. Face à la poulie, tenez une poignée dans une main, bras allongé près du corps. Pied avant à plat, pied arrière sur les orteils, gardez les pieds fixes. Descendez en quatre secondes, genou avant dans l'axe du pied et genou arrière vers le sol sans le heurter, puis remontez en une seconde. Travaillez les deux côtés. Les chaussures sont coupées pendant une partie de la vidéo et le câble est peu lisible : suivez la consigne. Quatre séries de six à huit répétitions, quatre-vingt-dix secondes de repos. Arrêtez en cas de douleur.",
    },
  },
  // Quadriceps #20 : fentes sautées contrôlées, vidéo déposée.
  "drop-lunges-fentes-sautees-controlees": {
    src: "/videos/drop-lunges-fentes-sautees.mp4",
    poster: "/videos/posters/drop-lunges-fentes-sautees.jpg",
    label: "Vidéo IA · Fentes sautées contrôlées",
    status: "coached",
    coaching: {
      title: "Petit saut et réception souple en fente.",
      handCue: "Mains aux hanches ou libres pour l'équilibre ; choisissez un espace stable et dégagé.",
      movementCue: "Décollez légèrement, placez un pied devant et l'autre derrière, puis amortissez la réception en fléchissant les deux genoux dans une amplitude confortable.",
      notice: "La vidéo montre un saut et une fente ; l'alternance des côtés et le tempo 2010 ne sont pas clairement démontrés. Suivez la prescription et contrôlez chaque réception.",
      spoken: "Fentes sautées contrôlées. Dans un espace dégagé, faites un petit saut, placez un pied devant et l'autre derrière, puis amortissez doucement la réception en fléchissant les deux genoux, buste stable et genou avant dans l'axe du pied. Remontez sous contrôle. La vidéo ne montre pas clairement l'alternance ni le tempo : travaillez les deux côtés et suivez votre séance. Cinq séries de cinq à sept répétitions, deux minutes de repos, tempo deux zéro un zéro. Arrêtez en cas de douleur.",
    },
  },
  // Quadriceps #15 : hack squat machine, vidéo reçue accompagnée.
  "hack-squat": {
    src: "/videos/hack-squat.mp4",
    poster: "/videos/posters/hack-squat.jpg",
    label: "Vidéo IA · Hack squat machine",
    status: "coached",
    coaching: {
      title: "Dos en appui, pieds à plat sur la plateforme.",
      handCue: "Réglez la machine à votre taille, gardez le dos contre le dossier et les épaules sous les coussins ; tenez les poignées.",
      movementCue: "Pieds stables sur la plateforme, descendez sous contrôle à une profondeur confortable, genoux dans l'axe des pieds, puis remontez sans verrouiller brutalement.",
      notice: "La vidéo descend plus bas que les 90° indiqués par la fiche ; adaptez la profondeur à votre mobilité et suivez votre prescription. Le tempo exact et le drop set ne sont pas démontrés ; la tête passe près du bord supérieur.",
      spoken: "Hack squat à la machine. Réglez le dossier et les sécurités à votre morphologie. Gardez le dos plaqué, les épaules sous les coussins et les deux pieds à plat sur la plateforme. Descendez en trois secondes, genoux dans l'axe des pieds, jusqu'à une profondeur confortable autour de quatre-vingt-dix degrés comme indiqué sur la fiche. Poussez sur les deux pieds pour remonter en une seconde sans verrouiller brutalement. La vidéo descend plus bas et ne montre pas le drop set ; suivez la prescription de votre séance. Arrêtez en cas de douleur.",
    },
  },
  // Quadriceps #24 : vidéo reçue, fente statique avec pied avant surélevé.
  "split-squat-barbell-pied-avant-sureleve": {
    src: "/videos/split-squat-barbell-pied-avant-sureleve.mp4",
    poster: "/videos/posters/split-squat-barbell-pied-avant-sureleve.jpg",
    label: "Vidéo IA · Split squat barre, pied avant surélevé",
    status: "coached",
    coaching: {
      title: "Pied avant surélevé, barre sur le haut du dos.",
      handCue: "Tenez la barre à deux mains sur les trapèzes, sous la base du cou ; gardez le cou dégagé.",
      movementCue: "Gardez le pied avant à plat sur la marche et le pied arrière sur ses orteils au sol ; fléchissez les genoux sans déplacer les pieds, puis remontez sous contrôle.",
      notice: "Le corps et les appuis sont visibles sur les images contrôlées. La vidéo ne démontre pas fidèlement le tempo 3210 ni une pause complète de deux secondes en bas ; sa boucle repart de la position basse. Suivez la fiche, pas le rythme ou le saut de la boucle.",
      spoken: "Split squat barre, pied avant surélevé. Posez le pied avant à plat sur une marche basse stable et le pied arrière sur ses orteils au sol, sans banc à l'arrière. Placez la barre sur les trapèzes, sous la base du cou, et tenez-la des deux mains. Buste haut, descendez en trois secondes, genou avant dans l'axe des orteils et genou arrière vers le sol sans le heurter. Marquez deux secondes en bas puis remontez en une seconde sans déplacer les pieds. Travaillez les deux côtés. La vidéo ne montre pas fidèlement ce tempo ni la pause de deux secondes, et la boucle saute : suivez la consigne. Quatre séries de sept à neuf répétitions, quatre-vingt-dix secondes de repos. Arrêtez en cas de douleur.",
    },
  },
  // Vidéo déposée pour la fiche Jarvis ; sans cale ni charge.
  "squat-au-poids-du-corps": {
    src: "/videos/squat-au-poids-du-corps.mp4",
    poster: "/videos/posters/squat-au-poids-du-corps.jpg",
    label: "Vidéo IA · Squat au poids du corps",
    status: "coached",
    coaching: {
      title: "Pieds à plat, descendez à une profondeur confortable.",
      handCue: "Gardez les bras devant vous pour l'équilibre, sans charge.",
      movementCue: "Reculez les hanches et pliez les genoux dans l'axe des pieds, puis poussez dans les deux pieds pour remonter.",
      notice: "La vidéo repart brusquement en position basse lorsqu'elle boucle et ne démontre pas précisément le tempo de la fiche. Réalisez chaque descente et remontée sous contrôle.",
      spoken: "Squat au poids du corps. Pieds à plat, écartés environ à la largeur des épaules, bras devant pour l'équilibre. Reculez les hanches et descendez en trois secondes à une profondeur confortable, genoux dans l'axe des pieds et dos neutre. Poussez dans les deux pieds pour remonter en une seconde sans verrouiller brutalement les genoux. La boucle vidéo repart brusquement : ne reproduisez pas ce saut, gardez le mouvement continu. Trois séries de dix à quinze, soixante secondes de repos, tempo trois zéro un zéro. Arrêtez en cas de douleur.",
    },
  },
  // Même fente marchée observée dans la vidéo existante : pas de nouvelle génération.
  "fentes-marchees": {
    src: "/videos/fentes-avant-alternees.mp4",
    poster: "/videos/posters/fentes-avant-alternees.jpg",
    label: "Vidéo IA · Fentes marchées au poids du corps",
    status: "coached",
    coaching: {
      title: "Avancez en alternant les jambes.",
      handCue: "Mains aux hanches ou libres pour l'équilibre ; gardez un espace dégagé devant vous.",
      movementCue: "Après chaque fente, poussez dans le pied avant puis passez l'autre jambe devant pour continuer à avancer.",
      notice: "La vidéo montre une fente suivie d'un pas vers l'avant, mais s'arrête pendant la fente suivante ; l'alternance complète et le tempo exact ne sont pas entièrement démontrés. Continuez à avancer et alternez les jambes selon la fiche.",
      spoken: "Fentes marchées au poids du corps. Dans un espace dégagé, avancez un pied, posez-le à plat et descendez en trois secondes, genou arrière vers le sol sans le heurter, buste stable. Poussez dans le pied avant pour remonter en une seconde, puis passez l'autre jambe devant pour continuer à avancer. Alternez les jambes. La vidéo s'arrête pendant la fente suivante : poursuivez le mouvement. Cinq séries de quinze à vingt, soixante secondes de repos, tempo trois zéro un zéro. Arrêtez en cas de douleur.",
    },
  },
  // Vidéos déposées : machine leg extension et fente bulgare avec haltères.
  "leg-extension": {
    src: "/videos/leg-extension.mp4",
    poster: "/videos/posters/leg-extension.jpg",
    label: "Vidéo IA · Leg extension avec consignes",
    status: "coached",
    coaching: {
      title: "Dos en appui, extension contrôlée des genoux.",
      handCue: "Réglez la machine à votre morphologie ; placez le rouleau sur l'avant des tibias au-dessus des chevilles et tenez les poignées.",
      movementCue: "Tendez les deux jambes sous contrôle, sans verrouiller brutalement, puis redescendez doucement.",
      notice: "Le contact du rouleau et la liaison du mécanisme sont partiellement masqués en haut, les muscles rouges disparaissent en fin de clip et le tempo exact n'est pas démontré. Réglez la machine et suivez la fiche.",
      spoken: "Leg extension. Réglez le pivot de la machine à hauteur de vos genoux et le rouleau sur l'avant des tibias, au-dessus des chevilles. Dos et cuisses en appui, tendez les jambes en une seconde sans verrouiller brutalement. Contractez une seconde en haut puis redescendez en deux secondes sans à-coup. Cinq séries de douze à quinze, deux minutes de repos, tempo deux zéro un un. Le contact du rouleau n'est pas toujours visible dans la vidéo. Utilisez une charge légère et arrêtez en cas de douleur.",
    },
  },
  "bulgarian-split-squat-halteres": {
    src: "/videos/bulgarian-split-squat-halteres.mp4",
    poster: "/videos/posters/bulgarian-split-squat-halteres.jpg",
    label: "Vidéo IA · Fente bulgare avec haltères",
    status: "coached",
    coaching: {
      title: "Pied arrière au banc, un haltère dans chaque main.",
      handCue: "Tenez un haltère dans chaque main, bras le long du corps, avec une charge maîtrisée.",
      movementCue: "Pied avant à plat au sol, pied arrière au banc ; descendez sous contrôle puis poussez sur le pied avant.",
      notice: "De profil, la seconde main et son haltère sont en grande partie masqués ; le pied arrière est petit et le tempo exact n'est pas démontré. Vérifiez la prise et les appuis et suivez la fiche.",
      spoken: "Fente bulgare avec haltères. Posez le dessus du pied arrière sur un banc stable et le pied avant à plat au sol. Tenez un haltère dans chaque main, bras le long du corps. Buste légèrement penché et dos neutre, descendez en trois secondes, genou avant dans l'axe, puis poussez sur le pied avant pour remonter en une seconde. La deuxième main et son haltère sont en grande partie masqués dans la vidéo : vérifiez bien votre prise et vos appuis. Quatre séries de huit à dix par jambe, quatre-vingt-dix secondes de repos, tempo trois zéro un zéro. Choisissez une charge maîtrisée et arrêtez en cas de douleur.",
    },
  },
  // Les clips déposés servent aux fiches de même mouvement ; chaque fiche garde ses consignes.
  "step-up-sur-banc-hauteur-du-genou": {
    src: "/videos/step-up-banc-poids-du-corps.mp4",
    poster: "/videos/posters/step-up-banc-poids-du-corps.jpg",
    label: "Vidéo IA · Step-up sur banc au poids du corps", status: "coached",
    coaching: {
      title: "Banc stable, appui sur la jambe haute.",
      handCue: "Choisissez un banc stable à hauteur adaptée et un support si nécessaire.",
      movementCue: "Pied entier sur le banc, poussez sur la jambe haute sans élan et redescendez sous contrôle.",
      notice: "Les pieds se superposent en haut de la vidéo et le tempo exact n'est pas démontré. Gardez un appui stable, suivez la fiche et adaptez la hauteur du banc à votre maîtrise.",
      spoken: "Step-up sur banc. Posez le pied entier sur un banc stable de hauteur adaptée. Montez sans élan en poussant sur la jambe haute, genou dans l'axe du pied, puis redescendez sous contrôle sans vous laisser tomber. Les pieds se superposent en haut de la vidéo : vérifiez vos appuis. Trois séries de dix par jambe, soixante secondes de repos, tempo deux zéro un un. Prenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  "step-up-haut": {
    src: "/videos/step-up-banc-poids-du-corps.mp4",
    poster: "/videos/posters/step-up-banc-poids-du-corps.jpg",
    label: "Vidéo IA · Step-up haut au poids du corps", status: "coached",
    coaching: {
      title: "Même step-up, contrôle de la jambe haute.",
      handCue: "Choisissez un banc stable à hauteur adaptée et un support si nécessaire.",
      movementCue: "Poussez sur la jambe haute sans élan et redescendez en contrôlant l'appui.",
      notice: "Les pieds se superposent en haut de la vidéo et le tempo exact n'est pas démontré. Gardez un appui stable, suivez la fiche et adaptez la hauteur du banc à votre maîtrise.",
      spoken: "Step-up haut. Posez le pied entier sur un banc stable de hauteur adaptée. Montez sans élan en poussant sur la jambe haute, genou dans l'axe du pied, puis redescendez en quatre secondes sans vous laisser tomber. Les pieds se superposent en haut de la vidéo : vérifiez vos appuis. Quatre séries de huit à dix, soixante secondes de repos, tempo quatre zéro un zéro. Prenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  "squat-cycliste-squat-complet": {
    src: "/videos/squat-cycliste-poids-du-corps.mp4",
    poster: "/videos/posters/squat-cycliste-poids-du-corps.jpg",
    label: "Vidéo IA · Squat cycliste complet au poids du corps", status: "coached",
    coaching: {
      title: "Squat cycliste : cale stable et amplitude maîtrisée.",
      handCue: "Posez les pieds sur une cale stable, talons surélevés ; tenez un support au besoin.",
      movementCue: "Pieds stables et genoux dans l'axe, descendez dans votre amplitude confortable puis remontez.",
      notice: "Le clip est accéléré par rapport au tempo de la fiche ; la profondeur dépend de votre mobilité. Ne forcez pas l'amplitude et gardez les pieds en appui.",
      spoken: "Squat cycliste au poids du corps. Placez les pieds rapprochés sur une cale stable, talons surélevés. Descendez en trois secondes, genoux dans l'axe des pieds et dos neutre, aussi bas que votre mobilité le permet sans douleur. Remontez en une seconde. Cinq séries de huit à dix, soixante secondes de repos, tempo trois zéro un zéro. Le rythme de la vidéo ne montre pas le tempo de la fiche. Tenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  "squat-cycliste": {
    src: "/videos/squat-cycliste-poids-du-corps.mp4",
    poster: "/videos/posters/squat-cycliste-poids-du-corps.jpg",
    label: "Vidéo IA · Squat cycliste au poids du corps", status: "coached",
    coaching: {
      title: "Même squat cycliste, descente contrôlée.",
      handCue: "Posez les pieds sur une cale stable, talons surélevés ; tenez un support au besoin.",
      movementCue: "Pieds stables et genoux dans l'axe, descendez dans votre amplitude confortable puis remontez.",
      notice: "Le clip est accéléré par rapport au tempo de la fiche ; la profondeur dépend de votre mobilité. Ne forcez pas l'amplitude et gardez les pieds en appui.",
      spoken: "Squat cycliste au poids du corps. Placez les pieds rapprochés sur une cale stable, talons surélevés. Descendez en quatre secondes, genoux dans l'axe des pieds et dos neutre, aussi bas que votre mobilité le permet sans douleur. Remontez en une seconde. Cinq séries de sept à neuf, deux minutes de repos, tempo quatre zéro un zéro. Le rythme de la vidéo ne montre pas le tempo de la fiche. Tenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  // Vidéo déposée par Yanis : goblet squat avec haltère tenu à la poitrine.
  "goblet-squat": {
    src: "/videos/goblet-squat.mp4",
    poster: "/videos/posters/goblet-squat.jpg",
    label: "Vidéo IA · Goblet squat, consignes prioritaires",
    status: "coached",
    coaching: {
      title: "Haltère à la poitrine, squat contrôlé.",
      handCue: "Tenez un haltère vertical près de la poitrine avec les deux mains.",
      movementCue: "Gardez les pieds stables, les genoux dans l'axe des orteils et le dos neutre ; descendez puis remontez sous contrôle.",
      notice: "La tête est coupée en position haute ; le tempo exact n'est pas démontré et les appuis bougent légèrement. Gardez les pieds stables et suivez la fiche.",
      spoken: "Goblet squat. Tenez un haltère vertical près de la poitrine avec les deux mains. Pieds stables et talons au sol, genoux dans l'axe des orteils. Descendez en trois secondes dans une amplitude confortable, dos neutre et poitrine haute, puis remontez en une seconde et marquez une seconde en haut. Trois séries de douze, quatre-vingt-dix secondes de repos, tempo trois zéro un un. La tête est coupée en haut de la vidéo et le tempo n'est pas démontré. Arrêtez en cas de douleur.",
    },
  },
  // #21 autorise explicitement la barre classique : même back squat, sans prétendre montrer une safety bar.
  "safety-bar-squat-ou-barre-classique": {
    src: "/videos/back-squat.mp4", poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo IA · Squat à la barre classique", status: "coached",
    coaching: {
      title: "Squat avec la barre classique autorisée par la fiche.",
      handCue: "Avec une barre classique, placez-la sur les trapèzes sous la base du cou, mains fermées et sécurités adaptées.",
      movementCue: "Pieds stables, descendez sous contrôle, genoux dans l'axe des orteils, puis remontez sans verrouiller brutalement.",
      notice: "La vidéo montre la variante à barre classique, pas une safety bar ; le contact central de la barre est masqué de face et le tempo ainsi que le back-off ne sont pas démontrés. Suivez la fiche.",
      spoken: "Squat à la barre classique, option indiquée dans votre fiche. Placez la barre sur les trapèzes sous la base du cou et utilisez des sécurités adaptées. Pieds stables, descendez en trois secondes dans une amplitude confortable puis remontez en une seconde. La vidéo ne montre pas une safety bar ni la série back-off. Suivez quatre séries de douze, dix, huit puis quinze répétitions, deux minutes de repos. Arrêtez en cas de douleur.",
    },
  },
  // Squats arrière : même mouvement, prescriptions et consignes distinctes.
  "back-squat-charge-moderee": {
    src: "/videos/back-squat.mp4", poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo 3D · Back squat, charge modérée", status: "coached",
    coaching: {
      title: "Squat arrière contrôlé, charge modérée.",
      handCue: "Barre stable sur les trapèzes, mains fermées ; utilisez une installation sécurisée.",
      movementCue: "Descendez sous contrôle, genoux dans l'axe des pieds et talons au sol, puis remontez.",
      notice: "Vidéo de back squat réutilisée : la charge modérée et le tempo exact ne sont pas démontrés ; le contact central de la barre est masqué de face. Suivez la fiche et votre amplitude confortable.",
      spoken: "Back squat à charge modérée. Placez la barre sur les trapèzes dans une installation sécurisée. Pieds stables, genoux alignés, descendez sous contrôle en trois secondes dans une amplitude confortable puis remontez sans arrondir le dos. Trois séries de dix à douze, deux minutes de repos, tempo trois zéro un un. La vidéo ne montre pas le tempo exact. Arrêtez en cas de douleur.",
    },
  },
  "back-squat-barre-haute": {
    src: "/videos/back-squat.mp4", poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo 3D · Back squat barre haute", status: "coached",
    coaching: {
      title: "Barre haute sur les trapèzes, descente contrôlée.",
      handCue: "Barre sur les trapèzes, mains fermées et installation sécurisée.",
      movementCue: "Descendez sous contrôle, genoux dans l'axe et pieds stables, puis remontez.",
      notice: "Vidéo de back squat réutilisée : le contact central de la barre est masqué de face et le tempo exact n'est pas démontré. Placez-la sur les trapèzes et suivez la fiche.",
      spoken: "Back squat barre haute. Placez la barre sur les trapèzes dans une installation sécurisée. Pieds stables, genoux dans l'axe, descendez en trois secondes dans une amplitude confortable, puis remontez sans arrondir le dos. Quatre séries de huit à dix, deux minutes de repos, tempo trois zéro un zéro. La vidéo ne montre pas le tempo exact. Arrêtez en cas de douleur.",
    },
  },
  "back-squat-test-1rm": {
    src: "/videos/back-squat.mp4", poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo 3D · Back squat, test avec précautions", status: "coached",
    coaching: {
      title: "Même mouvement : test de force en sécurité.",
      handCue: "Installez les barres de sécurité à la bonne hauteur ; demandez un pareur compétent pour une charge lourde.",
      movementCue: "Échauffez-vous progressivement, puis descendez sous contrôle avec la barre stable sur le haut du dos.",
      notice: "La vidéo montre le geste, pas un test maximal : elle ne démontre ni sécurités correctement réglées ni pareur, et son tempo n'est pas celui de la fiche. Ne testez pas une charge lourde sans installation et aide adaptées.",
      spoken: "Test de force au back squat. Échauffez-vous progressivement. Réglez des barres de sécurité à la bonne hauteur et demandez un pareur compétent pour une charge lourde. Barre sur les trapèzes, pieds stables, descendez en quatre secondes dans une amplitude maîtrisée, puis remontez sans arrondir le dos. La vidéo ne montre ni les sécurités correctement réglées ni un pareur. Cinq séries de une à cinq répétitions, trois minutes de repos, tempo quatre zéro un zéro. Ne forcez pas en cas de douleur ou de doute.",
    },
  },
  // Fessiers 02/14 et 13 : les fichiers déposés servent aux mouvements identiques.
  "hip-thrust-barre": {
    src: "/videos/hip-thrust-barre.mp4",
    poster: "/videos/posters/hip-thrust-barre.jpg",
    label: "Vidéo IA · Hip thrust barre, consignes prioritaires",
    status: "coached",
    coaching: {
      title: "Haut du dos au banc, barre stabilisée sur les hanches.",
      handCue: "Stabilisez la barre avec les deux mains et gardez le haut du dos en appui sur un banc stable.",
      movementCue: "Pieds à plat, descendez sous contrôle puis montez les hanches sans cambrer.",
      notice: "Le bas des chaussures est coupé au début et les mains sont partiellement masquées par le disque ; la stabilité de la barre et le tempo exact ne sont pas clairement démontrés. Suivez la fiche.",
      spoken: "Hip thrust barre. Appuyez le haut du dos sur un banc stable, pieds à plat au sol. Maintenez la barre sur le pli des hanches avec les deux mains. Descendez sous contrôle puis poussez dans les pieds pour remonter, menton rentré et côtes basses, sans cambrer. Les mains et les chaussures sont partiellement masquées dans la vidéo : vérifiez bien vos appuis et la barre. Trois séries de douze à quinze, quatre-vingt-dix secondes de repos, tempo trois un un deux. Arrêtez en cas de douleur.",
    },
  },
  "hip-thrust-barre-test-de-charge-max-3-5-reps": {
    src: "/videos/hip-thrust-barre.mp4",
    poster: "/videos/posters/hip-thrust-barre.jpg",
    label: "Vidéo IA · Hip thrust barre, test de charge encadré",
    status: "coached",
    coaching: {
      title: "Même geste : test de trois à cinq répétitions propres.",
      handCue: "Banc stable, deux pieds au sol, barre stabilisée avec les deux mains ; ne testez pas seule une charge lourde.",
      movementCue: "Descendez sans perdre l'appui du haut du dos et remontez les hanches sans cambrer.",
      notice: "Le bas des chaussures est coupé au début et les mains sont partiellement masquées par le disque ; la vidéo ne démontre ni le tempo exact ni les conditions d'un test lourd. Suivez la fiche, jamais à l'échec total et jamais seule si la charge est lourde.",
      spoken: "Test de charge au hip thrust barre. Appuyez le haut du dos sur un banc stable, posez les deux pieds au sol et stabilisez la barre sur vos hanches avec les deux mains. Descendez en trois secondes et remontez sans cambrer. Faites cinq séries de trois à cinq répétitions propres, trois minutes de repos, tempo trois zéro un deux. La vidéo ne démontre pas un test lourd. Ne cherchez jamais l'échec total et ne faites jamais seule une charge lourde. Arrêtez en cas de douleur.",
    },
  },
  "fentes-bulgares-pied-arriere-sureleve": {
    src: "/videos/fentes-bulgares-poids-du-corps.mp4",
    poster: "/videos/posters/fentes-bulgares-poids-du-corps.jpg",
    label: "Vidéo IA · Fente bulgare au poids du corps",
    status: "coached",
    coaching: {
      title: "Pied arrière au banc, pied avant ancré.",
      handCue: "Mains aux hanches ou sur un support stable si nécessaire ; pied arrière sur le banc.",
      movementCue: "Inclinez légèrement le buste, descendez sous contrôle puis poussez sur le pied avant.",
      notice: "Le pied arrière reste petit dans ce cadre large et le tempo exact n'est pas démontré. Gardez-le en appui sur le banc, le pied avant au sol, et suivez la fiche.",
      spoken: "Fentes bulgares au poids du corps. Posez le dessus du pied arrière sur un banc stable et gardez le pied avant à plat au sol. Grand pas, buste légèrement incliné, dos neutre. Descendez en trois secondes, genou avant aligné avec le pied, puis poussez pour remonter en une seconde sans verrouiller brutalement. Gardez le pied arrière sur le banc. Quatre séries de huit à dix par jambe, quatre-vingt-dix secondes de repos, tempo trois zéro un zéro. Tenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  "bulgarian-split-squat": {
    src: "/videos/fentes-bulgares-poids-du-corps.mp4",
    poster: "/videos/posters/fentes-bulgares-poids-du-corps.jpg",
    label: "Vidéo IA · Bulgarian split squat au poids du corps",
    status: "coached",
    coaching: {
      title: "Pied arrière sur le banc, talon avant ancré.",
      handCue: "Mains aux hanches ou sur un support stable ; appuyez le pied arrière sur le banc.",
      movementCue: "Buste légèrement incliné, descendez puis remontez en poussant sur le pied avant.",
      notice: "Le pied arrière reste petit dans ce cadre large et le tempo exact n'est pas démontré. Gardez-le en appui sur le banc et suivez la prescription propre à cette fiche.",
      spoken: "Bulgarian split squat au poids du corps. Placez le dessus du pied arrière sur un banc stable et ancrez le pied avant à plat. Inclinez légèrement le buste, dos neutre. Descendez en trois secondes sans heurter le sol, genou avant aligné avec le pied, puis remontez en une seconde. Gardez le pied arrière sur le banc. Trois séries de dix par jambe, soixante-quinze secondes de repos, tempo trois zéro un zéro. Tenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  // Fessiers #07, #09 et #10 : vidéos remises, avec réserves propres.
  "kickback-a-l-elastique": {
    src: "/videos/kickback-a-l-elastique.mp4",
    poster: "/videos/posters/kickback-a-l-elastique.jpg",
    label: "Vidéo IA · Kickback élastique à quatre pattes",
    status: "coached",
    coaching: {
      title: "Poussez le talon vers l'arrière, bassin stable.",
      handCue: "Mains au sol, genou d'appui stable ; vérifiez l'élastique autour des deux pieds.",
      movementCue: "Genou fléchi, poussez le talon vers l'arrière sans cambrer puis revenez lentement.",
      notice: "Le cadrage large rend les attaches de l'élastique petites et le tempo exact n'est pas garanti. Vérifiez le matériel et suivez les consignes de la fiche.",
      spoken: "Kickback à l'élastique. À quatre pattes, vérifiez que la boucle est bien fixée autour des deux pieds et qu'elle ne risque pas de glisser. Mains au sol, genou d'appui stable, dos neutre et bassin immobile. Genou de la jambe active fléchi, poussez le talon vers l'arrière sans cambrer, contractez une seconde puis revenez lentement en deux secondes. Trois séries de quinze par côté, quarante-cinq secondes de repos, tempo deux zéro un un. Arrêtez si l'élastique glisse ou si vous ressentez une douleur.",
    },
  },
  "fentes-avant-alternees": {
    src: "/videos/fentes-avant-alternees.mp4",
    poster: "/videos/posters/fentes-avant-alternees.jpg",
    label: "Vidéo IA · Fente avant, consignes d'alternance prioritaires",
    status: "coached",
    coaching: {
      title: "Avancez puis revenez au point de départ.",
      handCue: "Bras libres ou mains aux hanches ; utilisez un support stable si nécessaire.",
      movementCue: "Avancez une jambe, descendez sous contrôle puis repoussez le pied avant pour revenir et alterner.",
      notice: "La vidéo montre le pas vers l'avant mais progresse aussi vers l'avant ; le retour au point de départ et l'alternance ne sont pas clairement démontrés. Suivez la consigne de la fiche et son tempo.",
      spoken: "Fentes avant alternées. Avancez une jambe, posez le pied à plat et descendez en trois secondes, buste vertical, genou avant aligné avec le pied, genou arrière vers le sol sans le heurter. Repoussez le pied avant pour revenir à votre point de départ en une seconde, puis changez de jambe. La vidéo progresse vers l'avant : revenez au point de départ à chaque répétition. Trois séries de dix par jambe, soixante-quinze secondes de repos, tempo trois zéro un zéro. Tenez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  "glute-bridge-en-1-5-reps": {
    src: "/videos/glute-bridge-en-1-5-reps.mp4",
    poster: "/videos/posters/glute-bridge-en-1-5-reps.jpg",
    label: "Vidéo IA · Pont fessier, demi-répétition à suivre en consigne",
    status: "coached",
    coaching: {
      title: "Montée complète, demi-descente et remontée.",
      handCue: "Tête, épaules et bras au sol ; gardez les deux pieds à plat.",
      movementCue: "Montez les hanches, redescendez à mi-course puis remontez avant la descente complète.",
      notice: "La vidéo montre le pont au sol mais ne démontre pas clairement la demi-répétition ; la couleur disparaît et la tête se soulève. Suivez la consigne 1,5, deux pieds et tête au sol.",
      spoken: "Glute bridge en une répétition et demie. Tête et épaules au sol, pieds à plat, montez les hanches sans cambrer. Redescendez à mi-course puis remontez : cette demi-répétition fait partie du mouvement. Redescendez ensuite complètement avant de recommencer. Gardez les deux pieds au sol, sans lever une jambe. La vidéo ne montre pas clairement la demi-répétition : suivez la consigne. Trois séries de dix à douze, soixante-quinze secondes de repos, tempo deux un un deux. Arrêtez en cas de douleur.",
    },
  },
  // Fessiers #05 et #06, et fiche Jarvis du même mouvement que #05.
  "fentes-arriere-alternees": {
    src: "/videos/fentes-arriere-alternees.mp4",
    poster: "/videos/posters/fentes-arriere-alternees.jpg",
    label: "Vidéo IA · Fente arrière, consignes d'alternance prioritaires",
    status: "coached",
    coaching: {
      title: "Grand pas en arrière et buste légèrement incliné.",
      handCue: "Bras libres ou mains aux hanches ; utilisez un support si nécessaire pour garder l'équilibre.",
      movementCue: "Reculez une jambe, descendez sans heurter le sol puis poussez sur le pied avant et alternez.",
      notice: "La démonstration montre une fente arrière, mais l'alternance des jambes et le tempo exact ne sont pas clairement démontrés. Suivez la fiche et alternez à chaque répétition.",
      spoken: "Fentes arrière alternées. Debout, reculez une jambe d'un grand pas. Inclinez légèrement le buste en avant en gardant le dos neutre. Descendez en trois secondes, genou arrière vers le sol sans le heurter, genou avant aligné avec le pied. Poussez sur le pied avant pour remonter en une seconde, ramenez le pied arrière et changez de jambe. La vidéo ne montre pas clairement l'alternance ; alternez bien. Trois séries de dix par jambe, soixante-quinze secondes de repos, tempo trois zéro un zéro. Utilisez un support si nécessaire et arrêtez en cas de douleur.",
    },
  },
  "fentes-arriere-au-poids-du-corps": {
    src: "/videos/fentes-arriere-alternees.mp4",
    poster: "/videos/posters/fentes-arriere-alternees.jpg",
    label: "Vidéo IA · Fente arrière au poids du corps",
    status: "coached",
    coaching: {
      title: "Fente arrière sans charge, avec appui si nécessaire.",
      handCue: "Si l'équilibre est difficile, tenez un support stable.",
      movementCue: "Reculez une jambe, descendez de façon contrôlée puis repoussez le sol pour revenir debout.",
      notice: "Vidéo de fente arrière réutilisée : l'alternance et le tempo exact ne sont pas clairement démontrés. Tenez un support stable si nécessaire et suivez cette fiche.",
      spoken: "Fentes arrière au poids du corps. Tenez un support stable si nécessaire. Reculez une jambe, gardez le pied avant à plat et le genou aligné, puis descendez en trois secondes sans heurter le sol. Repoussez le pied avant pour revenir debout en une seconde et changez de côté. Trois séries de huit à douze répétitions, quatre-vingt-dix secondes de repos, tempo trois zéro un zéro. Choisissez une amplitude confortable et arrêtez en cas de douleur.",
    },
  },
  "glute-bridge-pieds-sur-banc": {
    src: "/videos/glute-bridge-pieds-sur-banc.mp4",
    poster: "/videos/posters/glute-bridge-pieds-sur-banc.jpg",
    label: "Vidéo IA · Pont fessier, pieds sur banc",
    status: "coached",
    coaching: {
      title: "Deux pieds stables sur le banc, deux secondes en haut.",
      handCue: "Bras au sol, tête et épaules posées, pieds ancrés sur le banc stable.",
      movementCue: "Poussez par les talons, montez sans cambrer, maintenez deux secondes puis redescendez lentement.",
      notice: "Les pieds se superposent en partie et bougent sur le banc ; la pause de deux secondes n'est pas clairement démontrée. Gardez les deux pieds stables et suivez le tempo de la fiche.",
      spoken: "Glute bridge pieds sur banc. Allongez-vous sur le dos, tête, épaules et bras au sol. Posez les deux pieds de façon stable sur un banc immobile. Poussez par les talons, montez les hanches sans cambrer, contractez les fessiers deux secondes puis redescendez en deux secondes. Gardez les deux pieds ancrés ; la pause et la stabilité des pieds ne sont pas clairement montrées dans la vidéo. Trois séries de quinze répétitions, soixante secondes de repos, tempo deux zéro un deux. Arrêtez si vous ressentez une douleur.",
    },
  },
  // Fessiers #03 et #11 : même geste, prescriptions distinctes.
  "kickback-a-la-poulie": {
    src: "/videos/kickback-a-la-poulie.mp4",
    poster: "/videos/posters/kickback-a-la-poulie.jpg",
    label: "Vidéo IA · Kickback poulie, consignes prioritaires",
    status: "coached",
    coaching: {
      title: "Extension de hanche contrôlée, bassin stable.",
      handCue: "Tenez le montant, pied d'appui stable et sangle bien fixée à l'autre cheville.",
      movementCue: "Ramenez la jambe sans élan, puis poussez vers l'arrière sans cambrer, genou légèrement fléchi.",
      notice: "Le câble est masqué par moments et le genou se fléchit au retour ; le tempo exact n'est pas démontré. Gardez le câble libre de la jambe d'appui et suivez les consignes de la fiche.",
      spoken: "Kickback à la poulie. Fixez la sangle à la cheville et vérifiez que le câble ne touche pas la jambe d'appui. Tenez le montant, pied d'appui stable, bassin immobile et dos neutre. Gardez le genou légèrement fléchi sans accentuer sa flexion. Poussez la jambe vers l'arrière sans cambrer ni vous balancer ; marquez une seconde, puis revenez lentement en deux secondes sans poser le pied. Trois séries de quinze par côté, quarante-cinq secondes de repos, tempo deux zéro un un. Arrêtez si vous ressentez une douleur.",
    },
  },
  "kickback-a-la-poulie-drop-set-final": {
    src: "/videos/kickback-a-la-poulie.mp4",
    poster: "/videos/posters/kickback-a-la-poulie.jpg",
    label: "Vidéo IA · Kickback poulie, drop set à appliquer séparément",
    status: "coached",
    coaching: {
      title: "Même kickback : réduction de charge sur la dernière série.",
      handCue: "Tenez le montant, pied d'appui stable et sangle bien fixée à l'autre cheville.",
      movementCue: "Poussez la jambe vers l'arrière sans cambrer ; revenez lentement, bassin stable.",
      notice: "La vidéo montre le geste mais pas la réduction de charge. Le câble est masqué par moments et le genou se fléchit au retour ; le tempo exact n'est pas démontré. Gardez le câble libre de la jambe d'appui et suivez la fiche.",
      spoken: "Kickback à la poulie avec drop set final. Vérifiez que la sangle est bien fixée et que le câble ne touche pas la jambe d'appui. Pied d'appui stable, bassin immobile, dos neutre, genou légèrement fléchi. Poussez vers l'arrière sans cambrer, marquez une seconde, puis revenez en deux secondes sans élan. Trois séries de douze à quinze par côté, quarante-cinq secondes de repos, tempo deux zéro un un. Sur la dernière série, réduisez la charge de trente pour cent et poursuivez jusqu'à ne plus pouvoir conserver une technique correcte. La vidéo ne montre pas cette réduction. Arrêtez en cas de douleur.",
    },
  },
  // Vidéos d'échauffement réutilisées sans nouvelle génération : mêmes gestes.
  "pont-fessier-au-sol-activation": {
    src: "/videos/warmup-pont-fessier.mp4",
    poster: "/videos/posters/warmup-pont-fessier.jpg",
    label: "Vidéo IA · Pont fessier, consignes d'activation prioritaires",
    status: "coached",
    coaching: {
      title: "Pont au sol : pieds ancrés et deux secondes de contraction en haut.",
      handCue: "Bras détendus au sol de chaque côté, pieds à plat à largeur de hanches.",
      movementCue: "Soulevez le bassin sans cambrer, maintenez deux secondes en haut puis redescendez lentement.",
      notice: "Vidéo d'échauffement réutilisée : la couleur du muscle disparaît et le rythme, dont la pause de deux secondes, n'est pas clairement démontré. Suivez les consignes de cette fiche et gardez tête et épaules au sol.",
      spoken: "Pont fessier au sol pour l'activation. Allongez-vous sur le dos, pieds à plat et genoux fléchis. Gardez la tête et les épaules au sol, les côtes basses et le bassin neutre. Poussez par les pieds pour monter les hanches sans cambrer ; contractez les fessiers deux secondes en haut, puis descendez en deux secondes. La pause n'est pas clairement montrée dans la vidéo : suivez la consigne. Deux séries de quinze répétitions, quarante-cinq secondes de repos, tempo 2012. Arrêtez si le mouvement provoque une douleur.",
    },
  },
  "mobilite-des-epaules": {
    src: "/videos/warmup-mobilite-epaules.mp4",
    poster: "/videos/posters/warmup-mobilite-epaules.jpg",
    label: "Vidéo IA · Cercles d'épaules, mouvements lents",
    status: "coached",
    coaching: {
      title: "Faites de petits cercles lents et indolores.",
      handCue: "Bras ouverts sur les côtés, coudes souples et mains détendues.",
      movementCue: "Dessinez de petits cercles sans hausser les épaules, en restant dans une amplitude confortable.",
      notice: "Vidéo courte d'échauffement réutilisée : elle ne mesure pas les trente secondes de cette fiche. Gardez une cadence lente et une amplitude sans douleur.",
      spoken: "Mobilité des épaules. Debout, pieds stables, ouvrez les bras sur les côtés et gardez les coudes souples. Dessinez de petits cercles lents, sans hausser les épaules ni forcer. Restez dans une amplitude confortable et indolore. La vidéo est une courte démonstration, pas un chronomètre. Cette fiche prévoit deux séries de trente secondes et quinze secondes de repos.",
    },
  },
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
    // Source remplacée : corps entier sur les images échantillonnées.
    src: "/videos/back-squat.mp4",
    poster: "/videos/posters/back-squat.jpg",
    label: "Vidéo IA · Back squat, consignes prioritaires",
    status: "coached",
    coaching: {
      title: "Squat arrière, barre sur le haut du dos.",
      handCue: "Placez la barre sur les trapèzes, sous la base du cou, avec les deux mains et des sécurités adaptées.",
      movementCue: "Pieds stables, descendez avec les genoux dans l'axe puis remontez sous contrôle.",
      notice: "Le contact central de la barre est masqué de face et le tempo exact n'est pas démontré. Suivez la prescription de votre séance.",
      spoken: "Back squat. Placez la barre sur les trapèzes, sous la base du cou. Pieds stables, descendez sous contrôle, genoux dans l'axe des pieds, puis remontez. La barre doit reposer sur le haut du dos ; suivez votre prescription. Utilisez une installation sécurisée et arrêtez en cas de douleur.",
    },
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

  // ---- VAGUE 3 PECTORAUX (#09→#13), dépôts de Yanis le 29/10 ----
  // Les cinq sources restent "coached" : les notices et l'audio corrigent les
  // prises, appuis, trajectoires et tempos sans déclarer les MP4 validés.
  // #09 est octet pour octet la source P05 ; #11 celle du triceps T10.
  // #13 est conservé tel quel à la demande expresse de Yanis, sans régénération.
  "developpe-halteres-plat": {
    // P09. Source identique à P05 : la pronation et les appuis priment sur l'image.
    src: "/videos/developpe-halteres-plat.mp4",
    poster: "/videos/posters/developpe-halteres-plat.jpg",
    label: "Vidéo IA · Développé haltères plat, pronation prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez la prise pronée et le buste allongé, sans copier la prise neutre ni le redressement de la vidéo IA.",
      handCue:
        "Deux haltères en prise pronée, paumes vers les pieds, dos des mains vers la tête et poignets alignés.",
      movementCue:
        "Sur banc plat, descendez les deux haltères ensemble en trois secondes à côté du milieu de la poitrine, puis poussez en une seconde.",
      notice:
        "La source est strictement identique à celle du #05 en prise neutre : elle redresse aussi le buste, soulève les appuis et désynchronise les bras. Suivez le poster et le descriptif audio : paumes vers les pieds, appuis stables et tempo 3010.",
      spoken:
        "Développé avec deux haltères sur banc plat, en prise pronée. Gardez la tête, les omoplates et les hanches appuyées et les pieds au sol. Tenez un haltère dans chaque main, paumes vers les pieds, dos des mains vers la tête et poignets alignés, sans passer en prise neutre. Depuis la position haute, descendez les deux haltères ensemble en trois secondes jusqu’à côté du milieu de la poitrine, coudes à environ quarante-cinq degrés du buste. Sans pause, poussez les deux charges ensemble en une seconde pour revenir en haut, sans les entrechoquer. Ne reproduisez pas la prise neutre, le redressement du buste, le soulèvement des hanches ou la désynchronisation des bras de la vidéo IA. Le tempo 3010 et les soixante-quinze secondes de repos du programme restent prioritaires.",
    },
  },
  "cables-croises": {
    // P10. Poulies hautes et grand arc visibles ; coudes et tempo corrigés par l'audio.
    src: "/videos/cables-croises.mp4",
    poster: "/videos/posters/cables-croises.jpg",
    label: "Vidéo IA · Câbles croisés, grand arc et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez les coudes souples fixes et ouvrez les bras en trois secondes, sans copier la vitesse de la vidéo IA.",
      handCue:
        "Une poignée D dans chaque main entre deux poulies hautes, paumes vers l’avant et poignets alignés.",
      movementCue:
        "Un pied légèrement devant l’autre, refermez le grand arc en une seconde devant le bas des pectoraux puis ouvrez en trois secondes, sans changer l’angle des coudes.",
      notice:
        "Les poulies hautes et le croisement sont lisibles, mais la vidéo IA fait varier l’angle des coudes et dure 5,042 secondes au lieu des quatre secondes du tempo. Suivez le poster et le descriptif audio : une seconde pour fermer, trois secondes pour ouvrir, sans presse.",
      spoken:
        "Câbles croisés debout entre deux poulies hautes, avec une poignée D dans chaque main. Placez un pied légèrement devant l’autre, gainez le buste et gardez les épaules basses. Paumes vers l’avant, poignets alignés et coudes légèrement fléchis avec un angle constant. Depuis la position ouverte, refermez les deux bras ensemble en une seconde dans un grand arc jusqu’à réunir les poignées devant le bas des pectoraux ou la taille. Sans pause, ouvrez les deux bras ensemble en trois secondes sur la même trajectoire jusqu’à l’étirement confortable. Ne pliez pas puis ne tendez pas les coudes comme dans une presse. Ne reproduisez pas la variation des coudes ou la vitesse de la vidéo IA. Le tempo 3010, le drop set dix, huit, six et les soixante-quinze secondes de repos du programme restent prioritaires.",
    },
  },
  "developpe-couche-barre-plat": {
    // P11. Source identique à T10 : prise standard et tempo 4010 obligatoires.
    src: "/videos/developpe-couche-barre-plat.mp4",
    poster: "/videos/posters/developpe-couche-barre-plat.jpg",
    label: "Vidéo IA · Développé couché barre plat, prise standard prioritaire",
    status: "coached",
    coaching: {
      title:
        "Écartez les mains pour la prise pectorale standard et descendez en quatre secondes.",
      handCue:
        "Une barre droite en prise pronée standard, mains légèrement plus larges que les épaules, pouces enroulés et poignets empilés.",
      movementCue:
        "Sur banc plat, descendez la barre en quatre secondes vers le milieu du sternum puis poussez en une seconde, sans rebond ni trajectoire vers le cou.",
      notice:
        "La source est strictement identique à celle du développé couché prise serrée triceps #10 : elle montre une prise rapprochée et un tempo 3010. Pour cet exercice pectoral, suivez le poster et le descriptif audio : prise standard, descente en quatre secondes et poussée en une seconde.",
      spoken:
        "Développé couché avec une barre droite sur banc plat. Gardez la tête, les omoplates et les hanches appuyées et les pieds au sol. Prenez la barre en pronation standard, mains légèrement plus larges que les épaules, pouces enroulés et poignets empilés. Depuis la position haute, barre au-dessus du milieu du sternum, descendez en quatre secondes vers le milieu du sternum avec les avant-bras presque verticaux et les coudes modérément rapprochés. Sans rebond ni pause, poussez en une seconde pour revenir en haut. Ne dirigez jamais la barre vers le cou ou le visage. Ne reproduisez pas la prise rapprochée de triceps ni la descente en trois secondes de la vidéo IA. Le tempo 4010 et les quatre-vingt-dix secondes de repos du programme restent prioritaires.",
    },
  },
  "developpe-halteres-incline-45-prise-neutre": {
    // P12. Inclinaison et deux haltères lisibles ; 45°, neutre et tempo imposés.
    src: "/videos/developpe-halteres-incline-45-prise-neutre.mp4",
    poster: "/videos/posters/developpe-halteres-incline-45-prise-neutre.jpg",
    label: "Vidéo IA · Développé incliné 45° neutre, tempo prioritaire",
    status: "coached",
    coaching: {
      title:
        "Réglez le banc à 45°, gardez la prise neutre et descendez en trois secondes.",
      handCue:
        "Deux haltères en prise neutre, paumes face à face et poignets alignés, sans rotation des avant-bras.",
      movementCue:
        "Sur banc à 45°, poussez les deux haltères ensemble en une seconde puis descendez en trois secondes à côté du haut de la poitrine, loin du visage.",
      notice:
        "Le banc incliné et les deux haltères sont lisibles, mais l’angle visuel ne permet pas de certifier 45°, les charges se rapprochent du visage et la durée de 5,042 secondes ne respecte pas le tempo. Suivez le poster et le descriptif audio : banc à 45°, prise neutre et tempo 3010.",
      spoken:
        "Développé avec deux haltères sur un banc réglé à quarante-cinq degrés, en prise neutre. Gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Tenez un haltère dans chaque main, paumes face à face et poignets alignés, sans tourner les avant-bras. Depuis la position basse, haltères séparés à côté du haut de la poitrine et loin du visage, poussez les deux charges ensemble en une seconde jusqu’au-dessus du haut de la poitrine. Sans pause, descendez les deux haltères ensemble en trois secondes pour revenir à côté du haut de la poitrine, sans les entrechoquer. Ne reproduisez pas la vitesse, le rapprochement des haltères vers le visage ou une inclinaison différente de la vidéo IA. Le tempo 3010 et les soixante secondes de repos du programme restent prioritaires.",
    },
  },
  "ecartes-halteres": {
    // P13. MP4 de Yanis conservé tel quel ; grand arc, symétrie et retour haut par l'audio.
    src: "/videos/ecartes-halteres.mp4",
    poster: "/videos/posters/ecartes-halteres.jpg",
    label: "Vidéo IA · Écartés haltères, grand arc symétrique prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez les deux bras symétriques, les coudes fixes et remontez toujours en haut.",
      handCue:
        "Deux haltères légers sur banc plat, paumes face à face, poignets alignés et coudes légèrement fléchis.",
      movementCue:
        "Depuis le haut, ouvrez les deux bras ensemble en trois secondes dans un grand arc puis refermez en une seconde, sans changer l’angle des coudes.",
      notice:
        "La vidéo fournie par Yanis est conservée telle quelle. Les bras se désynchronisent, les coudes changent d’angle et le cycle de 5,042 secondes finit en bas. Suivez le poster et le descriptif audio : grand arc symétrique, coudes souples fixes et retour complet en haut.",
      spoken:
        "Écartés avec deux haltères légers sur banc plat. Gardez la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Paumes face à face, poignets alignés et coudes légèrement fléchis avec exactement le même angle pendant toute la répétition. Depuis la position haute, haltères séparés au-dessus de la poitrine, ouvrez les deux bras ensemble en trois secondes dans un grand arc jusqu’à l’étirement confortable, sans descendre près de la tête ou des hanches. Sans pause, refermez les deux bras ensemble en une seconde sur le même arc pour revenir en haut, sans entrechoquer les haltères. Ne reproduisez pas la désynchronisation des bras, la flexion des coudes, la vitesse ou la fin basse de la vidéo IA : terminez toujours en haut. Le tempo 3010 et les cent vingt secondes de repos du programme restent prioritaires.",
    },
  },

  // ---- VAGUE 3 PECTORAUX (#14→#18), dépôts de Yanis le 29/10 ----
  // Dérogation explicite : #15 et #17 utilisent le MÊME MP4 canonique.
  // Leurs posters, angles de banc, notices et descriptifs audio restent distincts.
  // Toutes les entrées restent "coached" : les consignes prioritaires corrigent
  // les trajectoires, inclinaisons et tempos visibles sans déclarer les MP4 validés.
  dips: {
    // P14. Dips sur appuis confirmés ; inclinaison pectorale et tempo imposés.
    src: "/videos/dips.mp4",
    poster: "/videos/posters/dips.jpg",
    label: "Vidéo IA · Dips pectoraux, inclinaison et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez le buste penché vers l’avant et descendez en quatre secondes.",
      handCue:
        "Une main sur chaque appui parallèle, pouces enroulés, épaules basses et poignets alignés.",
      movementCue:
        "Corps suspendu, jambes fléchies vers l’arrière et buste penché : descendez en quatre secondes puis poussez en une seconde.",
      notice:
        "La vidéo montre bien des dips sur appuis, mais le buste se redresse et le cycle visible ne respecte pas exactement le tempo 4010. Suivez le poster et le descriptif audio : buste incliné vers l’avant pour les pectoraux, descente en quatre secondes et poussée en une seconde.",
      spoken:
        "Dips pour les pectoraux sur deux appuis parallèles. Placez une main sur chaque appui, pouces enroulés et poignets alignés. Gardez le corps suspendu, les épaules basses, les jambes fléchies vers l’arrière et le buste incliné vers l’avant pendant toute la répétition. Depuis la position haute, bras presque tendus sans verrouillage brutal, descendez en quatre secondes en fléchissant les coudes jusqu’à une amplitude confortable, sans douleur et sans relâcher les épaules. Sans pause, poussez en une seconde pour revenir en haut, sans balancer les jambes ni redresser le buste. Ce ne sont ni des pompes au sol ni des dips triceps au buste vertical. Ne reproduisez pas le redressement du buste, le balancement des jambes ou la vitesse de la vidéo IA. Le tempo 4010, les six séries huit, huit, six, six, quatre, quatre, la charge croissante et les cent vingt secondes de repos du programme restent prioritaires.",
    },
  },
  "developpe-halteres-incline-pronation": {
    // P15. Source commune avec P17 ; pour cette fiche, banc à environ 30°.
    src: "/videos/developpe-halteres-incline-commun-15-17.mp4",
    poster: "/videos/posters/developpe-halteres-incline-pronation.jpg",
    label: "Vidéo IA · Développé incliné 30° proné, tempo prioritaire",
    status: "coached",
    coaching: {
      title:
        "Pour #15, réglez le banc à environ 30° et gardez les paumes vers les pieds.",
      handCue:
        "Deux haltères en prise pronée, paumes vers les pieds, dos des mains vers la tête et poignets alignés.",
      movementCue:
        "Tête et dos appuyés sur un banc à environ 30°, descendez les deux haltères en quatre secondes à côté du haut des pectoraux puis poussez en une seconde.",
      notice:
        "Le banc incliné et le développé sont lisibles, mais le cycle visible ne respecte pas exactement le tempo 4010. Cette source est partagée avec #17 à votre demande ; pour #15, suivez le poster et l’audio : banc à environ 30°, prise pronée, descente en quatre secondes et poussée en une seconde.",
      spoken:
        "Développé avec deux haltères sur un banc réglé à environ trente degrés, en prise pronée. Cette vidéo est aussi utilisée pour le numéro dix-sept, mais ici l’inclinaison de référence est trente degrés, pas quarante-cinq. Gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Tenez un haltère dans chaque main, paumes vers les pieds, dos des mains vers la tête et poignets alignés. Depuis la position haute, bras presque tendus au-dessus du haut des pectoraux, descendez les deux haltères ensemble en quatre secondes jusqu’à côté du haut de la poitrine, coudes modérément rapprochés et charges éloignées du visage. Sans pause, poussez les deux charges ensemble en une seconde pour revenir en haut, sans les entrechoquer. Ne reproduisez pas la vitesse de la vidéo IA, ne redressez pas le buste, ne passez pas en prise neutre et ne réglez pas le banc à quarante-cinq degrés pour cette fiche. Le tempo 4010, les quatre séries de six à huit répétitions et les quatre-vingt-dix secondes de repos du programme restent prioritaires.",
    },
  },
  "ecartes-cables-incline": {
    // P16. Banc et poulies basses lisibles ; hauteur des poignées et coudes corrigés.
    src: "/videos/ecartes-cables-incline.mp4",
    poster: "/videos/posters/ecartes-cables-incline.jpg",
    label: "Vidéo IA · Écartés câbles incliné, hauteur et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Arrêtez les poignées au-dessus du haut des pectoraux, pas au-dessus de la tête.",
      handCue:
        "Une poignée par main entre deux poulies basses, poignets alignés et coudes souples avec un angle constant.",
      movementCue:
        "Allongé sur banc incliné, refermez le grand arc en une seconde jusqu’au-dessus du haut des pectoraux puis ouvrez en trois secondes.",
      notice:
        "Le banc et les deux poulies basses sont visibles, mais la vidéo IA amène les poignées au-dessus de la tête et plie davantage les coudes. Suivez le poster et le descriptif audio : grand arc jusqu’au-dessus du haut des pectoraux, coudes fixes, une seconde pour fermer et trois pour ouvrir.",
      spoken:
        "Écartés avec deux câbles sur banc incliné, entre deux poulies basses. Gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Tenez une poignée dans chaque main, câbles tendus, épaules basses, poignets alignés et coudes légèrement fléchis avec exactement le même angle pendant toute la répétition. Depuis la position ouverte, dans un étirement confortable et sans bras derrière le dos, refermez les deux bras ensemble en une seconde dans un grand arc vers le haut et l’intérieur, jusqu’au-dessus du haut des pectoraux, sans monter les poignées au-dessus de la tête et sans croiser les mains. Sans pause, ouvrez les deux bras ensemble en trois secondes sur la même trajectoire pour revenir à l’étirement du départ. Ne reproduisez pas la montée des poignées vers la tête, la flexion des coudes ou la vitesse de la vidéo IA : ce sont des écartés, pas un développé. Le tempo 3010, les cinq séries de huit à dix répétitions et les cent vingt secondes de repos du programme restent prioritaires.",
    },
  },
  "developpe-halteres-incline-45": {
    // P17. Même source que P15, mais banc à 45° et programmation propres.
    src: "/videos/developpe-halteres-incline-commun-15-17.mp4",
    poster: "/videos/posters/developpe-halteres-incline-45.jpg",
    label: "Vidéo IA · Développé incliné 45° proné, inclinaison prioritaire",
    status: "coached",
    coaching: {
      title:
        "Pour #17, réglez le banc à 45° : ne copiez pas l’inclinaison plus faible de la vidéo partagée.",
      handCue:
        "Deux haltères en prise pronée, paumes vers les pieds, dos des mains vers la tête et poignets alignés.",
      movementCue:
        "Sur banc à 45°, tête et dos appuyés, descendez les deux haltères en quatre secondes à côté du haut des pectoraux puis poussez en une seconde.",
      notice:
        "La source est strictement la même que pour #15 à votre demande et montre un banc moins incliné. Pour #17, le poster et le descriptif audio priment : réglez le banc à 45°, gardez la prise pronée et le tempo 4010 ; ne reproduisez pas l’angle visible de la source.",
      spoken:
        "Développé avec deux haltères sur un banc réglé à quarante-cinq degrés, en prise pronée. La vidéo est la même que pour le numéro quinze, mais elle montre une inclinaison plus faible : pour cette fiche, réglez votre banc à quarante-cinq degrés et ne copiez pas l’angle visible. Gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol, sans vous asseoir verticalement comme dans un développé épaules. Tenez un haltère dans chaque main, paumes vers les pieds, dos des mains vers la tête et poignets alignés. Depuis la position haute, bras presque tendus au-dessus du haut des pectoraux, descendez les deux haltères ensemble en quatre secondes jusqu’à côté du haut de la poitrine, coudes modérément rapprochés et charges éloignées du visage. Sans pause, poussez les deux charges ensemble en une seconde pour revenir en haut, sans les entrechoquer. Ne reproduisez pas l’inclinaison plus faible ni la vitesse de la vidéo IA, et ne passez pas en prise neutre. Le tempo 4010, les cinq séries de cinq à sept répétitions et les cent vingt secondes de repos du programme restent prioritaires.",
    },
  },
  "developpe-halteres-incline": {
    // P18. Départ bas et banc incliné lisibles ; tempo 3010 et back-off dictés.
    src: "/videos/developpe-halteres-incline.mp4",
    poster: "/videos/posters/developpe-halteres-incline.jpg",
    label: "Vidéo IA · Développé incliné, descente trois secondes prioritaire",
    status: "coached",
    coaching: {
      title:
        "Depuis le bas, poussez en une seconde puis descendez pendant trois secondes sans pause.",
      handCue:
        "Deux haltères en prise pronée, paumes vers les pieds, dos des mains vers la tête et poignets alignés.",
      movementCue:
        "Sur banc à environ 30°, poussez les deux haltères en une seconde puis descendez en trois secondes à côté du haut des pectoraux.",
      notice:
        "La position basse, le banc incliné et les deux haltères sont lisibles, mais la vidéo IA marque un temps haut et ne respecte pas la descente de trois secondes. Suivez le poster et l’audio : prise pronée, banc à environ 30°, une seconde de poussée et trois secondes de descente.",
      spoken:
        "Développé avec deux haltères sur un banc réglé à environ trente degrés, en prise pronée. Gardez l’arrière de la tête, les omoplates, le dos et les hanches appuyés et les pieds au sol. Tenez un haltère dans chaque main, paumes vers les pieds, dos des mains vers la tête et poignets alignés. Depuis la position basse, haltères séparés à côté du haut des pectoraux, coudes fléchis et avant-bras presque verticaux, poussez les deux charges ensemble en une seconde jusqu’au-dessus du haut de la poitrine, sans les entrechoquer. Sans pause, descendez les deux haltères ensemble en trois secondes pour revenir à côté du haut des pectoraux. Ne reproduisez pas le temps d’arrêt en haut ou la descente trop rapide de la vidéo IA, et ne passez pas en prise neutre. Le tempo 3010, la séquence douze, dix, huit puis le back-off de quinze répétitions et les quatre-vingt-dix secondes de repos du programme restent prioritaires. Le back-off concerne la programmation, pas une modification du geste.",
    },
  },

  // ---- Pectoraux #19 à #23 : sources déposées par Yanis ----
  // #21 : dépôt identique à P11 et T10 ; prise standard et tempo corrigés.
  "cables-croises-rotation-externe": {
    src: "/videos/cables-croises-rotation-externe.mp4",
    poster: "/videos/posters/cables-croises-rotation-externe.jpg",
    label: "Vidéo IA · Câbles croisés, rotation et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez les coudes souples fixes et vérifiez la rotation externe des épaules en ouverture.",
      handCue:
        "Une poignée dans chaque main, poignets alignés et deux câbles tendus.",
      movementCue:
        "Refermez les bras en une seconde, puis ouvrez en trois secondes avec une rotation externe douce des épaules.",
      notice:
        "La rotation externe des épaules n'est pas clairement démontrée et l'angle des coudes change pendant la fermeture. Ne copiez ni ces coudes ni la vitesse de la vidéo : suivez le poster et l'audio.",
      spoken:
        "Câbles croisés avec rotation externe. Debout entre deux poulies, tenez une poignée dans chaque main avec les câbles tendus, épaules basses et buste stable. Gardez les coudes souples avec un angle constant. Refermez en une seconde dans un grand arc devant les pectoraux, sans heurter les poignées. Ouvrez sur le même arc en trois secondes et terminez par une rotation externe douce des épaules, sans tordre les poignets ni lâcher les poignées. La rotation n'est pas clairement visible dans la vidéo et ses coudes se plient davantage : ne reproduisez pas ces défauts ni sa vitesse. Tempo 3010, trois séries de douze à quinze et soixante secondes de repos.",
    },
  },
  "developpe-couche-plat-inertie-depuis-les-pins": {
    src: "/videos/developpe-couche-plat-inertie-depuis-les-pins.mp4",
    poster: "/videos/posters/developpe-couche-plat-inertie-depuis-les-pins.jpg",
    label: "Vidéo IA · Développé depuis les pins, pause obligatoire",
    status: "coached",
    coaching: {
      title:
        "À chaque répétition, posez la barre sur les deux pins et marquez un arrêt complet sans rebond.",
      handCue:
        "Barre droite, prise pronée standard et pouces enroulés, poignets alignés.",
      movementCue:
        "Barre immobile supportée par les deux pins, poussez en une seconde puis descendez en quatre secondes jusqu'à l'arrêt complet.",
      notice:
        "Le contact et le support de la barre par les deux pins ne sont pas démontrés clairement dans la vidéo. Ne copiez pas sa vitesse : réglez des pins de travail solides, posez la barre sur les deux et arrêtez-la complètement à chaque répétition.",
      spoken:
        "Développé couché depuis les pins. Réglez deux pins de travail solides à la même hauteur dans un rack stable et vérifiez avant de charger que la barre peut s'y poser en sécurité. Tête, omoplates et hanches appuyées, pieds au sol, prenez la barre en pronation standard, pouces enroulés. Départ bas : barre immobile et réellement supportée par les deux pins, buste gainé. Poussez en une seconde, puis descendez en quatre secondes vers les deux pins et marquez une pause complète, sans rebond, avant chaque nouvelle poussée. La vidéo ne démontre pas clairement le contact avec les pins : ne prenez pas son réglage ou sa vitesse comme modèle. Tempo 4010 et pause complète sur les pins, cinq séries de six à huit et cent vingt secondes de repos.",
    },
  },
  "developpe-couche-barre": {
    src: "/videos/developpe-couche-barre.mp4",
    poster: "/videos/posters/developpe-couche-barre.jpg",
    label: "Vidéo IA · Développé couché, prise standard prioritaire",
    status: "coached",
    coaching: {
      title:
        "Prenez la barre en prise pectorale standard et descendez en trois secondes.",
      handCue:
        "Barre droite en pronation, mains légèrement plus larges que les épaules, pouces enroulés et poignets alignés.",
      movementCue:
        "Sur banc plat, descendez la barre en trois secondes vers le milieu des pectoraux puis poussez en une seconde sans rebond.",
      notice:
        "La source déposée est identique à celle du pectoral #11 et du triceps #10 : la prise visible est trop rapprochée pour cette fiche. Ne copiez pas cette prise ; suivez le poster et le descriptif audio en prise standard et tempo 3010.",
      spoken:
        "Développé couché à la barre sur banc plat. Gardez la tête, les omoplates et les hanches appuyées et les pieds au sol. Prenez la barre en pronation standard, mains légèrement plus larges que les épaules, pouces enroulés et poignets alignés. Depuis le haut au-dessus des pectoraux, descendez la barre en trois secondes vers le milieu de la poitrine, puis poussez en une seconde sans rebond. Ne dirigez pas la barre vers le cou ou le visage. La vidéo déposée est la même que pour le pectoral onze et le triceps dix et montre une prise rapprochée : ne copiez pas cette prise, utilisez la prise standard de cette fiche. Tempo 3010, trois séries de huit à dix, cent vingt secondes de repos ; volume réduit, entretien et technique parfaite.",
    },
  },
  "developpe-couche-test-1rm": {
    src: "/videos/developpe-couche-test-1rm.mp4",
    poster: "/videos/posters/developpe-couche-test-1rm.jpg",
    label: "Vidéo IA · Test 1RM, sécurités et pareur prioritaires",
    status: "coached",
    coaching: {
      title:
        "Pour un test maximal, vérifiez les sécurités avec un pareur compétent avant de charger.",
      handCue:
        "Prise pronée standard, pouces enroulés ; le pareur reste prêt sans toucher la barre si elle progresse.",
      movementCue:
        "Descendez en quatre secondes vers la poitrine puis poussez en une seconde, sans poser la barre sur les sécurités pendant une répétition réussie.",
      notice:
        "La vidéo montre un pareur et des supports mais ne permet pas de vérifier leur réglage sûr ni l'absence de contact en bas ; le tempo est trop rapide. Ne copiez pas le réglage illustré : faites vérifier les sécurités et le rôle du pareur avant tout test.",
      spoken:
        "Test de développé couché, à réaliser uniquement si vous maîtrisez le mouvement et avec un pareur compétent. Avant de charger, réglez et vérifiez les deux sécurités en conditions réelles pour qu'elles arrêtent la barre en cas d'échec sans gêner une répétition réussie ; convenez du signal d'aide avec le pareur. La vidéo ne permet pas de certifier ce réglage : ne le copiez pas. Gardez les appuis stables et la prise pronée standard, pouces enroulés. Descendez en quatre secondes vers la poitrine puis poussez en une seconde sans rebond. Les sécurités servent au secours et ne portent pas la barre pendant une répétition réussie ; le pareur reste prêt sans toucher tant que la barre progresse. En cas de doute ou sans dispositif sûr, ne faites pas de test maximal. Le tempo 4010, cinq séries de une à cinq et cent quatre-vingts secondes de repos restent prioritaires.",
    },
  },
  pompes: {
    src: "/videos/pompes.mp4",
    poster: "/videos/posters/pompes.jpg",
    label: "Vidéo IA · Pompes au sol, alignement et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Mains sous les épaules et corps aligné, descendez en trois secondes.",
      handCue:
        "Paumes au sol sous les épaules, doigts vers l'avant et appui sur les pointes des pieds.",
      movementCue:
        "Gardez une ligne tête, hanches et talons ; descendez en trois secondes et poussez en une seconde.",
      notice:
        "La pompe au sol est lisible, mais la vidéo marque un arrêt en bas et ne reproduit pas exactement le tempo 3010. Ne copiez pas la pause ni la vitesse.",
      spoken:
        "Pompes au sol. Placez les mains sous les épaules et les pointes des pieds au sol. Gainez abdominaux et fessiers, gardez la tête, le bassin et les talons alignés sans creuser le dos ni lever les hanches. Descendez en trois secondes en fléchissant les coudes modérément proches du buste, puis poussez en une seconde pour revenir en planche haute, sans poser les genoux ni marquer de pause. Ne copiez ni la pause basse ni la vitesse de la vidéo. Tempo 3010, trois séries de huit à quinze et quatre-vingt-dix secondes de repos.",
    },
  },

  // ---- Dos #01 à #04 : vidéos déposées par Yanis, avec consignes ----
  "tirage-vertical-prise-neutre": {
    src: "/videos/tirage-vertical-prise-neutre.mp4",
    poster: "/videos/posters/tirage-vertical-prise-neutre.jpg",
    label: "Vidéo IA · Tirage vertical neutre, prise et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez les paumes face à face, tirez vers le haut de la poitrine et revenez en deux secondes.",
      handCue:
        "Deux poignées parallèles, paumes face à face et poignets neutres ; câble relié à la poulie haute.",
      movementCue:
        "Tirez en une seconde, maintenez une seconde, puis remontez les bras en deux secondes sans balancer le buste.",
      notice:
        "La prise et le tirage sont visibles, mais la continuité exacte des mains et du câble est difficile à certifier et la vidéo marque un arrêt prolongé. Suivez la prise neutre et le tempo 2011, sans copier la pause.",
      spoken:
        "Tirage vertical en prise neutre. Asseyez-vous, les cuisses maintenues et les pieds au sol, poitrine ouverte. Tenez les deux poignées parallèles, paumes face à face et poignets neutres. Sans balancer le buste, tirez vers le haut de la poitrine en une seconde, coudes vers le bas et omoplates basses. Maintenez la contraction une seconde, puis laissez remonter les poignées en deux secondes jusqu'aux bras allongés sans pause supplémentaire. La vidéo marque un arrêt prolongé et sa prise n'est pas lisible en permanence : gardez la prise neutre et le tempo 2011. Trois séries de douze à quinze, soixante-quinze secondes de repos.",
    },
  },
  "rowing-haltere-un-bras": {
    src: "/videos/rowing-haltere-un-bras.mp4",
    poster: "/videos/posters/rowing-haltere-un-bras.jpg",
    label: "Vidéo IA · Rowing un bras, bassin et coude prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez le bassin immobile et le bras naturel, sans exagérer la hauteur du coude.",
      handCue:
        "Un seul haltère dans la main libre, poignet neutre ; l'autre main et le genou du même côté sont appuyés sur le banc.",
      movementCue:
        "Tirez l'haltère vers la taille en une seconde, maintenez une seconde puis redescendez en deux secondes, sans rotation du bassin.",
      notice:
        "La vidéo déforme le bras et monte le coude très haut ; l'haltère paraît passer près du banc et le tempo est approximatif. Ne reproduisez pas ces défauts : gardez un trajet naturel et une distance libre avec le banc.",
      spoken:
        "Rowing avec un haltère, un bras à la fois. Placez une main et le genou du même côté sur le banc, l'autre pied au sol. Tenez un seul haltère dans la main libre, bras naturel et poignet neutre, dos plat et bassin stable. Tirez vers la taille en une seconde avec le coude près du corps, sans forcer le coude au-delà d'une amplitude confortable. Maintenez une seconde puis descendez en deux secondes. Ne tournez pas le bassin, ne copiez pas la déformation du bras ou la hauteur excessive du coude de la vidéo, et gardez l'haltère dégagé du banc. Douze répétitions par côté, trois séries, tempo 2011 et soixante secondes de repos.",
    },
  },
  "tirage-horizontal-a-la-poulie": {
    src: "/videos/tirage-horizontal-a-la-poulie.mp4",
    poster: "/videos/posters/tirage-horizontal-a-la-poulie.jpg",
    label: "Vidéo IA · Tirage horizontal, buste fixe et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez le dos neutre et le buste fixe ; tirez la poignée vers le nombril.",
      handCue:
        "Deux mains sur la poignée neutre, paumes face à face ; câble relié à la poulie basse et dégagé des pieds.",
      movementCue:
        "Tirez vers le nombril en une seconde, maintenez une seconde puis tendez les bras en deux secondes sans arrondir le dos.",
      notice:
        "La trajectoire générale est lisible, mais la continuité du câble près des appuis et la durée de la pause ne sont pas parfaitement claires. Gardez le câble libre, le buste fixe et suivez le tempo 2011.",
      spoken:
        "Tirage horizontal à la poulie basse. Asseyez-vous, pieds sur les appuis et genoux souples. Gardez le dos neutre et le buste fixe, légèrement penché si confortable. Tenez les deux poignées en prise neutre, câble bien connecté et dégagé des pieds. Tirez vers le nombril en une seconde, coudes vers l'arrière ; maintenez une seconde, puis tendez les bras en deux secondes sans arrondir le dos ni balancer le buste. La vidéo ne garantit pas le passage du câble ou le tempo exact : suivez le descriptif. Trois séries de douze, tempo 2011 et soixante-quinze secondes de repos.",
    },
  },
  "tirage-vertical-prise-large": {
    src: "/videos/tirage-vertical-prise-large.mp4",
    poster: "/videos/posters/tirage-vertical-prise-large.jpg",
    label:
      "Vidéo IA · Tirage vertical large, trajectoire et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez la prise pronée large et tirez la barre devant vous vers le haut de la poitrine.",
      handCue:
        "Une barre longue en pronation, mains plus larges que les épaules et pouces enroulés.",
      movementCue:
        "Tirez devant la tête en une seconde, maintenez une seconde puis remontez en deux secondes sans balancer le buste.",
      notice:
        "La barre descend bas sur le buste et la pause visible est prolongée. Ne copiez ni cette amplitude ni la vitesse : arrêtez au haut de la poitrine et suivez le tempo 2011.",
      spoken:
        "Tirage vertical en prise large. Asseyez-vous, pieds au sol et cuisses maintenues, poitrine ouverte. Tenez la barre en pronation avec les mains plus larges que les épaules et les pouces enroulés. Gardez le buste stable. Tirez la barre devant la tête vers le haut de la poitrine en une seconde, coudes vers le bas et l'arrière. Maintenez une seconde, puis remontez la barre en deux secondes jusqu'aux bras allongés. Ne tirez pas derrière la nuque et ne copiez pas la descente trop basse ni la pause prolongée de la vidéo. Quatre séries de dix à douze, tempo 2011 et quatre-vingt-dix secondes de repos.",
    },
  },
  // Dos #06 à #08 : sources déposées et contrôlées, avec réserves.
  "rowing-barre-buste-penche-test-3-5-reps": {
    src: "/videos/rowing-barre-buste-penche-test-3-5-reps.mp4",
    poster: "/videos/posters/rowing-barre-buste-penche-test-3-5-reps.jpg",
    label: "Vidéo IA · Rowing test, buste fixe et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez le buste incliné et fixe, sans vous redresser pendant le tirage.",
      handCue:
        "Deux mains en pronation sur une barre, poignets neutres et bras naturels.",
      movementCue:
        "Tirez vers le nombril en une seconde, maintenez une seconde puis redescendez en trois secondes.",
      notice:
        "Le buste se redresse pendant le tirage et le tempo n'est pas fidèlement démontré. Ne copiez ni le redressement ni la vitesse : gardez le dos neutre et le buste incliné stable.",
      spoken:
        "Rowing barre buste penché, test de trois à cinq répétitions. Pieds ancrés, genoux souples, hanches en arrière et dos neutre, gardez le buste incliné stable pendant toute la répétition. Ne reproduisez pas le redressement visible dans la vidéo et n'utilisez pas d'élan. Les deux mains tiennent la barre en pronation. Tirez vers le nombril en une seconde, maintenez une seconde, puis redescendez en trois secondes sans pause en bas. Choisissez une charge maîtrisable, sans compromettre la posture. Cinq séries de trois à cinq, tempo 3011, cent quatre-vingts secondes de repos.",
    },
  },
  "rowing-barre-buste-penche-pronation": {
    src: "/videos/rowing-barre-buste-penche-pronation.mp4",
    poster: "/videos/posters/rowing-barre-buste-penche-pronation.jpg",
    label: "Vidéo IA · Rowing pronation, buste fixe et tempo prioritaires",
    status: "coached",
    coaching: {
      title: "Gardez le buste incliné et fixe, les mains en pronation.",
      handCue:
        "Deux mains en pronation sur une seule barre, poignets neutres et bras naturels.",
      movementCue:
        "Tirez vers le nombril en une seconde puis redescendez en trois secondes sans pause.",
      notice:
        "Le buste se redresse pendant le tirage et une pause apparaît en haut. Ne copiez ni le redressement ni la pause : gardez le buste incliné fixe et suivez le tempo 3010.",
      spoken:
        "Rowing barre buste penché en pronation. Pieds stables, genoux souples et hanches en arrière, maintenez le dos neutre et le buste incliné fixe, sans vous redresser ni balancer les reins. Ne copiez pas le redressement visible de la vidéo. Avec les deux mains en pronation, tirez vers le nombril en une seconde puis redescendez en trois secondes sans pause en haut ni en bas. Ne copiez pas la pause de la vidéo. Cinq séries de huit à dix, tempo 3010, soixante secondes de repos.",
    },
  },
  "rowing-assis-prise-neutre": {
    src: "/videos/rowing-assis-prise-neutre.mp4",
    poster: "/videos/posters/rowing-assis-prise-neutre.jpg",
    label: "Vidéo IA · Rowing assis neutre, prise et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Buste droit et fixe, tirez la poignée vers le ventre, paumes face à face.",
      handCue:
        "Poignée neutre tenue à deux mains, paumes face à face ; câble relié et dégagé des appuis.",
      movementCue:
        "Tirez en une seconde puis tendez les bras en trois secondes sans pause.",
      notice:
        "La vidéo marque une pause en contraction ; la forme de la poignée et la continuité des mains et du câble ne sont pas toujours faciles à vérifier. Gardez la prise neutre et suivez le tempo 3010 sans pause.",
      spoken:
        "Rowing assis en prise neutre. Pieds sur les appuis, genoux souples, dos neutre et buste droit stable. Tenez la poignée à deux mains, paumes face à face, câble relié et dégagé des pieds. Tirez vers le ventre en une seconde, coudes près du corps, puis tendez les bras en trois secondes sans pause en haut ni en bas. Ne copiez pas la pause de la vidéo. Cinq séries de dix à douze, tempo 3010, soixante secondes de repos.",
    },
  },
  // Dos #05 et #09 à #13 : six sources déposées, avec réserves.
  "rowing-barre-buste-penche": {
    src: "/videos/rowing-barre-buste-penche.mp4",
    poster: "/videos/posters/rowing-barre-buste-penche.jpg",
    label: "Vidéo IA · Rowing barre, buste fixe prioritaire",
    status: "coached",
    coaching: {
      title:
        "Gardez le buste incliné à 45 degrés et immobile sans vous redresser.",
      handCue:
        "Deux mains en pronation sur une barre, bras naturels et poignets neutres.",
      movementCue:
        "Tirez vers le nombril en une seconde, maintenez une seconde, puis descendez en deux secondes.",
      notice:
        "La vidéo déposée est identique au rowing pronation numéro 7 et le buste se redresse au tirage. Ce défaut signalé n'est pas corrigé : ne le reproduisez pas ; maintenez le dos neutre et le buste fixe à 45 degrés.",
      spoken:
        "Rowing barre buste penché. Pieds ancrés, genoux souples, hanches en arrière et dos neutre, maintenez le buste incliné à quarante-cinq degrés et immobile pendant toute la répétition. La vidéo redresse le buste : ne reproduisez pas ce défaut. Tenez la barre à deux mains, bras naturels et poignets neutres. Tirez vers le nombril en une seconde, maintenez une seconde, puis descendez en deux secondes, sans élan et sans pause en bas. Trois séries de dix à douze, tempo 2011, quatre-vingt-dix secondes de repos.",
    },
  },
  "tirage-vertical-prise-pronation": {
    src: "/videos/tirage-vertical-prise-pronation.mp4",
    poster: "/videos/posters/tirage-vertical-prise-pronation.jpg",
    label: "Vidéo IA · Tirage pronation, amplitude et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Partez bras tendus et tirez la barre devant la tête vers le haut de la poitrine.",
      handCue:
        "Une barre en pronation tenue à deux mains, câble relié et cuisses maintenues.",
      movementCue:
        "Tirez en une seconde puis remontez en trois secondes sans pause, buste droit.",
      notice:
        "Les bras commencent fléchis et la continuité du câble et de la barre est difficile à vérifier pendant le mouvement. Ne copiez pas ce départ : allongez les bras, gardez la barre devant la tête et suivez le tempo 3010.",
      spoken:
        "Tirage vertical en pronation. Asseyez-vous, pieds au sol, cuisses maintenues, poitrine ouverte et buste droit stable. Les deux mains tiennent la barre en pronation. Partez bras tendus, contrairement au départ fléchi de la vidéo. Tirez devant la tête vers le haut de la poitrine en une seconde, coudes vers le bas, puis remontez en trois secondes jusqu'aux bras allongés sans pause. Gardez la barre et le câble reliés et ne tirez jamais derrière la nuque. Cinq séries de douze à quinze, tempo 3010, cent vingt secondes de repos.",
    },
  },
  "tractions-pull-up": {
    src: "/videos/tractions-pull-up.mp4",
    poster: "/videos/posters/tractions-pull-up.jpg",
    label: "Vidéo IA · Tractions pronation, pause et tempo prioritaires",
    status: "coached",
    coaching: {
      title: "Suspendez-vous bras tendus et marquez deux secondes en bas.",
      handCue: "Deux mains en pronation sur une barre stable, pieds décollés.",
      movementCue:
        "Pause de deux secondes en bas, montez en une seconde puis descendez en quatre secondes.",
      notice:
        "La vidéo dure environ cinq secondes : elle ne peut pas démontrer fidèlement le cycle de sept secondes demandé. L'angle ne permet pas de confirmer le passage du menton au-dessus de la barre. Suivez le tempo et ne copiez pas la vitesse.",
      spoken:
        "Tractions en pronation. Saisissez une barre stable à deux mains et suspendez-vous, pieds décollés et bras tendus. Marquez une pause de deux secondes en bas, montez en une seconde jusqu'à amener le menton au-dessus de la barre si votre amplitude le permet, puis descendez en quatre secondes sans balancer. La vidéo est trop courte pour montrer fidèlement ce cycle et l'angle ne permet pas de vérifier la hauteur du menton. Tempo 4210, cinq séries de cinq à sept, quatre-vingt-dix secondes de repos. Le tirage vertical est l'alternative prévue.",
    },
  },
  "tractions-prise-neutre-chin-up": {
    src: "/videos/tractions-prise-neutre-chin-up.mp4",
    poster: "/videos/posters/tractions-prise-neutre-chin-up.jpg",
    label: "Vidéo IA · Tractions neutres, prise et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Utilisez deux poignées parallèles, paumes face à face, et une pause en bas.",
      handCue:
        "Une poignée parallèle dans chaque main, paumes face à face, prises fixes et stables.",
      movementCue:
        "Bras tendus en bas, pause deux secondes, montée une seconde, descente quatre secondes.",
      notice:
        "La prise montrée ne démontre pas clairement deux poignées parallèles paumes face à face ; la vidéo est trop courte pour le tempo 4210. Ne copiez ni la prise ambiguë ni la vitesse : utilisez une vraie prise neutre.",
      spoken:
        "Tractions prise neutre. Utilisez deux poignées parallèles stables, une dans chaque main, paumes face à face ; la prise de la vidéo n'est pas assez claire, ne la copiez pas. Suspendez-vous bras tendus et pieds décollés. Marquez deux secondes en bas, montez en une seconde en amenant le menton au-dessus des poignées si possible, puis descendez en quatre secondes sans élan. La vidéo est trop courte pour ce tempo 4210. Cinq séries de cinq à sept, quatre-vingt-dix secondes de repos ; le tirage vertical neutre est l'alternative prévue.",
    },
  },
  "rowing-haltere-un-bras-coude-ouvert": {
    src: "/videos/rowing-haltere-un-bras-coude-ouvert.mp4",
    poster: "/videos/posters/rowing-haltere-un-bras-coude-ouvert.jpg",
    label: "Vidéo IA · Rowing un bras, coude ouvert et posture prioritaires",
    status: "coached",
    coaching: {
      title:
        "Ouvrez le coude sur le côté sans le forcer trop haut, bassin immobile.",
      handCue:
        "Un haltère dans la main libre ; l'autre main et le genou du même côté reposent sur le banc.",
      movementCue:
        "Tirez en une seconde coude ouvert confortablement, puis redescendez en quatre secondes sans pause.",
      notice:
        "La vidéo est identique au rowing un bras numéro 2 : elle déforme le bras, monte le coude excessivement et ne démontre pas clairement cette variante coude ouvert. Ne copiez pas la déformation ; gardez l'haltère dégagé du banc et le bassin stable.",
      spoken:
        "Rowing haltère un bras, coude ouvert. Posez une main et le genou du même côté sur le banc, l'autre pied au sol. Dos neutre et bassin immobile, tenez un haltère de la main libre. Tirez en une seconde en ouvrant confortablement le coude sur le côté et en rapprochant l'omoplate, sans forcer le coude trop haut. Redescendez en quatre secondes, sans pause et sans rotation. La vidéo déforme le bras et ne montre pas clairement cette variante : ne copiez pas ces défauts, gardez l'haltère dégagé du banc. Quatre séries de huit à dix, tempo 4010, quatre-vingt-dix secondes de repos.",
    },
  },
  "rowing-barre-ez-supination-buste-penche": {
    src: "/videos/rowing-barre-ez-supination-buste-penche.mp4",
    poster: "/videos/posters/rowing-barre-ez-supination-buste-penche.jpg",
    label: "Vidéo IA · Rowing EZ, supination et buste fixe prioritaires",
    status: "coached",
    coaching: {
      title:
        "Gardez la prise en supination et le buste incliné sans vous redresser.",
      handCue:
        "Une barre EZ tenue à deux mains en supination, paumes vers l'avant au départ et pouces enroulés.",
      movementCue:
        "Tirez vers le nombril en une seconde puis descendez en trois secondes sans pause.",
      notice:
        "La supination des mains est peu lisible, le buste se relève au tirage et la vidéo marque une pause. Ne copiez pas ces défauts : prenez la barre EZ en supination, restez incliné et suivez le tempo 3010.",
      spoken:
        "Rowing barre EZ en supination, buste penché. Pieds stables, genoux souples, hanches en arrière, gardez le dos neutre et le buste incliné immobile. Tenez la barre EZ à deux mains en supination, paumes vers l'avant au départ ; la prise est peu lisible sur la vidéo. Ne copiez pas le redressement visible. Tirez vers le nombril en une seconde puis descendez en trois secondes sans pause. Quatre séries de huit à dix, tempo 3010, soixante-quinze secondes de repos.",
    },
  },
  // Dos #14 et #16 à #18 : vidéos déposées, avec les consignes utiles.
  "rowing-assis-etirement": {
    src: "/videos/rowing-assis-etirement.mp4",
    poster: "/videos/posters/rowing-assis-etirement.jpg",
    label: "Vidéo IA · Rowing assis avec étirement contrôlé",
    status: "coached",
    coaching: {
      title:
        "Tirez vers le ventre puis revenez bras étendus dans une amplitude confortable.",
      handCue:
        "Tenez la poignée neutre à deux mains, paumes face à face ; câble bien relié et dégagé.",
      movementCue:
        "Tirez en une seconde puis revenez en trois secondes, sans pause ni arrondir exagérément le dos.",
      notice:
        "La vidéo ne montre pas clairement l'étirement complet et sa boucle reprend un tirage avant la fin. Suivez le tempo et l'amplitude confortables plutôt que le rythme de l'image.",
      spoken:
        "Rowing assis avec étirement. Pieds sur les appuis, genoux souples, tenez la poignée à deux mains, paumes face à face. Tirez vers le ventre en une seconde, puis revenez en trois secondes jusqu'aux bras étendus. Laissez les épaules avancer naturellement pour un étirement confortable, avec un léger mouvement de hanches si nécessaire, sans arrondir excessivement le dos ni forcer. La vidéo ne montre pas clairement tout l'étirement et sa boucle reprend un tirage ; suivez votre amplitude et le tempo 3010. Quatre séries, répétitions dix, huit, six selon la fiche, avec drop set et soixante-quinze secondes de repos.",
    },
  },
  // Dos #15 : vidéo déposée par Yanis, conservée avec consignes correctives.
  "tractions-supination-chin-up": {
    src: "/videos/tractions-supination-chin-up.mp4",
    poster: "/videos/posters/tractions-supination-chin-up.jpg",
    label: "Vidéo IA · Tractions supination",
    status: "coached",
    coaching: {
      title:
        "Gardez les deux paumes vers vous et tirez avec les deux bras de façon symétrique.",
      handCue:
        "Saisissez la barre à largeur d'épaules, paumes vers le visage, pouces autour de la barre.",
      movementCue:
        "Tirez les deux coudes vers le bas près du buste, montez en une seconde et descendez en quatre secondes.",
      notice:
        "La prise en supination n'est pas nettement vérifiable sur les deux mains et le mouvement paraît asymétrique, avec un coude plus écarté. La descente est plus rapide que le tempo 4010. Suivez les consignes plutôt que de copier ces détails.",
      spoken:
        "Tractions en supination. Saisissez une barre stable à largeur d'épaules, avec les deux paumes vers le visage et les pouces autour de la barre. Suspendez-vous bras allongés, pieds décollés. Tirez avec les deux bras de façon symétrique, coudes vers le bas et près du buste, sans les écarter à quatre-vingt-dix degrés. Montez en une seconde, menton vers la barre devant vous, puis redescendez en quatre secondes, sans élan ni pause, dans une amplitude confortable. La prise n'est pas clairement visible sur les deux mains et la vidéo montre un mouvement asymétrique, avec un coude plus écarté. Sa descente est trop rapide : suivez ces consignes et le tempo 4010 plutôt que l'image. Cinq séries de six, six, six, huit, huit, avec quatre-vingt-dix secondes de repos.",
    },
  },
  "rowing-haltere-buste-penche": {
    src: "/videos/rowing-haltere-buste-penche.mp4",
    poster: "/videos/posters/rowing-haltere-buste-penche.jpg",
    label: "Vidéo IA · Rowing deux haltères, coudes vers les hanches",
    status: "coached",
    coaching: {
      title:
        "Tirez les coudes vers les hanches, près du buste, sans les écarter à 90 degrés.",
      handCue:
        "Un haltère dans chaque main, paumes vers les jambes, poignets neutres.",
      movementCue:
        "Tirez les deux haltères vers la taille en une seconde puis descendez en trois secondes, buste incliné fixe.",
      notice:
        "La vidéo écarte les coudes et ne montre pas un retour complet des deux haltères avant la boucle. Ne copiez pas cet écartement : gardez les coudes proches du buste et redescendez les deux bras.",
      spoken:
        "Rowing buste penché avec deux haltères. Pieds ancrés, genoux souples, hanches en arrière, dos neutre et buste incliné fixe. Un haltère dans chaque main, tirez les deux poids vers la taille en une seconde, avec les coudes dirigés vers l'arrière et les hanches, près du buste. Ne les écartez pas à quatre-vingt-dix degrés comme une élévation pour les épaules. Redescendez les deux bras en trois secondes, sans pause ni élan. La vidéo écarte les coudes et sa boucle ne montre pas le retour complet : ne copiez pas ces défauts. Cinq séries de huit à dix, tempo 3010, cent vingt secondes de repos.",
    },
  },
  "tractions-prise-large": {
    src: "/videos/tractions-prise-large.mp4",
    poster: "/videos/posters/tractions-prise-large.jpg",
    label: "Vidéo IA · Tractions larges, amplitude et tempo prioritaires",
    status: "coached",
    coaching: {
      title:
        "Prise large confortable, partez bras tendus et contrôlez la descente.",
      handCue:
        "Mains en pronation plus larges que les épaules, sans forcer l'écartement, sur une barre stable.",
      movementCue:
        "Montez en une seconde, menton vers la barre, puis descendez en quatre secondes sans pause.",
      notice:
        "En haut de la vidéo, la barre semble passer derrière la tête et le passage du menton devant la barre n'est pas clair ; la descente est plus rapide que le tempo prescrit. Tirez vers l'avant dans une amplitude confortable et descendez en quatre secondes.",
      spoken:
        "Tractions prise large. Saisissez une barre stable en pronation, mains plus larges que les épaules mais sans forcer l'écartement. Suspendez-vous bras tendus, pieds décollés. Montez en une seconde en amenant le menton vers la barre devant vous, sans tirer derrière la nuque ni balancer. Descendez en quatre secondes jusqu'aux bras tendus, sans pause. En haut la barre semble passer derrière la tête, le passage du menton devant la barre n'est pas clairement visible et la descente est trop rapide. Ne copiez pas ce passage derrière la tête : tirez vers l'avant et suivez le tempo 4010 et votre amplitude confortable. Six séries de huit, huit, six, six, quatre, quatre, cent vingt secondes de repos.",
    },
  },
  "rowing-assis-au-cou": {
    src: "/videos/rowing-assis-au-cou.mp4",
    poster: "/videos/posters/rowing-assis-au-cou.jpg",
    label: "Vidéo IA · Tirage vertical derrière la nuque, confort prioritaire",
    status: "coached",
    coaching: {
      title:
        "Derrière la nuque, gardez la tête neutre et ne forcez jamais l'amplitude.",
      handCue:
        "Une barre en pronation, prise confortable ; câble relié et cuisses maintenues.",
      movementCue:
        "Tirez en une seconde dans une amplitude confortable, maintenez une seconde puis remontez en trois secondes.",
      notice:
        "La vidéo commence bras fléchis, répète le mouvement et ne démontre pas fidèlement le tempo. Le tirage derrière la nuque peut être inconfortable : ne forcez pas, gardez la barre dégagée du cou et arrêtez en cas de douleur.",
      spoken:
        "Tirage vertical derrière la nuque, variante choisie pour cette fiche. Asseyez-vous, pieds au sol, cuisses maintenues et dos neutre. Tenez la barre en pronation avec une prise confortable. Partez bras allongés, sans hausser ni forcer les épaules, et gardez la tête neutre. Tirez derrière la tête en une seconde, uniquement dans une amplitude confortable, sans contact avec la nuque ; maintenez une seconde puis remontez en trois secondes. La vidéo commence bras fléchis et ne montre pas fidèlement le tempo. Si la position provoque une douleur ou si votre mobilité ne permet pas ce geste confortablement, arrêtez et choisissez un tirage devant vers le haut de poitrine. Cinq séries de six à huit, tempo 3011, soixante secondes de repos.",
    },
  }, // Dos #19 à #21 et #23 : dépôts conservés avec réserves et consignes.
  "lean-away-pull-ups": {
    src: "/videos/lean-away-pull-ups.mp4",
    poster: "/videos/posters/lean-away-pull-ups.jpg",
    label: "Vidéo IA · Lean away pull-ups",
    status: "coached",
    coaching: {
      title:
        "Montez en traction puis éloignez-vous légèrement et contrôlez la descente.",
      handCue:
        "Saisissez une barre stable en pronation, prise confortable et pouces autour de la barre.",
      movementCue:
        "Montez en une seconde, inclinez-vous légèrement en arrière puis descendez en trois secondes sans élan.",
      notice:
        "Cette vidéo est identique à celle du dos numéro 10 : elle montre une traction mais pas clairement l'inclinaison lean away. La descente ne démontre pas le tempo prescrit ; suivez les consignes plutôt que l'image.",
      spoken:
        "Lean away pull-ups. Saisissez une barre stable en pronation, avec une prise confortable et les pouces autour de la barre. Suspendez-vous bras allongés, pieds décollés. Montez en une seconde, menton vers la barre devant vous. Puis éloignez légèrement le corps de la barre en gardant le tronc gainé, et redescendez en trois secondes, sans balancement ni cambrure excessive. Cette vidéo est identique à la traction numéro dix et ne montre pas clairement l'inclinaison, ni le tempo demandé. Suivez les consignes plutôt que l'image, et restez dans une amplitude confortable. Sept séries de trois à cinq, tempo 3010, cent vingt secondes de repos.",
    },
  },
  "rowing-haltere-un-bras-prise-neutre": {
    src: "/videos/rowing-haltere-un-bras-prise-neutre.mp4",
    poster: "/videos/posters/rowing-haltere-un-bras-prise-neutre.jpg",
    label: "Vidéo IA · Rowing un bras, prise neutre",
    status: "coached",
    coaching: {
      title:
        "Un seul haltère, paume vers le corps, tirez le coude près de la hanche.",
      handCue:
        "Un haltère dans la main libre, paume face au buste ; main et genou opposés sur le banc.",
      movementCue:
        "Tirez en une seconde puis descendez en quatre secondes, buste fixe et dos neutre.",
      notice:
        "La vidéo est identique au dos numéro 2 et numéro 12 : le bras se déforme et le coude monte excessivement. La prise neutre et le tempo ne sont pas clairement démontrés. Ne copiez pas la déformation.",
      spoken:
        "Rowing haltère un bras, prise neutre. Posez une main et le genou du même côté sur le banc et stabilisez l'autre pied au sol. Dos neutre, buste incliné et bassin immobile, prenez un seul haltère dans la main libre, paume vers le corps. Tirez vers la hanche en une seconde, coude proche du buste, puis redescendez en quatre secondes. La vidéo est identique aux numéros deux et douze et déforme le bras ; ne copiez pas ce défaut ni le coude trop haut. La prise neutre et le tempo ne sont pas clairement démontrés. Gardez l'haltère dégagé du banc. Cinq séries de cinq à sept par côté, tempo 4010, cent vingt secondes de repos.",
    },
  },
  "pullover-cable-bras-tendus": {
    src: "/videos/pullover-cable-bras-tendus.mp4",
    poster: "/videos/posters/pullover-cable-bras-tendus.jpg",
    label: "Vidéo IA · Pullover câble bras tendus",
    status: "coached",
    coaching: {
      title:
        "Gardez les coudes souples presque tendus et balayez la barre vers les cuisses.",
      handCue:
        "Deux mains sur une barre, reliée à la poulie haute par un câble dégagé.",
      movementCue:
        "Descendez la barre en une seconde par les épaules et remontez en trois secondes sans pause.",
      notice:
        "La prise et l'attache de la barre deviennent peu visibles en bas ; la pause et le rythme de la vidéo ne correspondent pas clairement au tempo 3010. Suivez les consignes et gardez le câble dégagé.",
      spoken:
        "Pullover câble bras tendus. Face à la poulie haute, pieds ancrés, genoux souples et dos neutre, tenez une barre à deux mains. Bras presque tendus, coudes souples, abaissez la barre en arc vers les cuisses en une seconde, en bougeant aux épaules. Revenez en trois secondes, sans pause, dans une amplitude confortable. Évitez de plier et déplier les coudes comme au triceps, ou de balancer le buste. La prise et l'attache deviennent peu visibles en bas et le rythme de la vidéo ne démontre pas le tempo. Gardez le câble dégagé et suivez le tempo 3010. Trois séries de douze à quinze, soixante secondes de repos.",
    },
  },
  "tirage-vertical-lean-away": {
    src: "/videos/tirage-vertical-lean-away.mp4",
    poster: "/videos/posters/tirage-vertical-lean-away.jpg",
    label: "Vidéo IA · Tirage vertical lean away, 1 et 1/4 en bas",
    status: "coached",
    coaching: {
      title:
        "Tirez devant, ajoutez un quart de répétition en bas puis revenez lentement.",
      handCue:
        "Deux mains en pronation sur une barre, cuisses maintenues et pieds au sol.",
      movementCue:
        "Tirez en une seconde ; remontez d'un quart, tirez de nouveau, maintenez deux secondes, puis remontez en trois secondes.",
      notice:
        "Cette vidéo est identique au tirage numéro 9 : elle ne démontre pas le quart de répétition en bas, le départ bras allongés ni clairement le tempo 3012. Appliquez les consignes de la fiche plutôt que le rythme de l'image.",
      spoken:
        "Tirage vertical lean away, un et un quart en bas. Asseyez-vous, pieds au sol et cuisses maintenues ; prenez la barre en pronation. Tronc gainé, inclinez-vous légèrement en arrière sans basculer. Départ bras allongés, tirez devant vers le haut de poitrine en une seconde. Remontez d'environ un quart de l'amplitude, tirez de nouveau en bas et maintenez deux secondes, puis remontez en trois secondes jusqu'aux bras allongés. Le quart supplémentaire ajoute du temps. La vidéo est identique au tirage numéro neuf et ne montre pas le quart en bas ni clairement le tempo et le départ bras allongés. Suivez la fiche, sans élan ni douleur. Quatre séries de huit à dix, tempo 3012, quatre-vingt-dix secondes de repos.",
    },
  },
  // Dos #22 et #25 : vidéos reçues avec consignes de geste et de tempo.
  "rowing-assis-cable-unilateral": {
    src: "/videos/rowing-assis-cable-unilateral.mp4",
    poster: "/videos/posters/rowing-assis-cable-unilateral.jpg",
    label: "Vidéo IA · Rowing assis câble unilatéral",
    status: "coached",
    coaching: {
      title: "Tirez une poignée vers la taille, avec le buste stable.",
      handCue:
        "Une seule main tient la poignée reliée à la poulie basse ; l'autre main reste libre sur la cuisse.",
      movementCue:
        "Tirez en une seconde, maintenez une seconde puis revenez en trois secondes.",
      notice:
        "La vidéo marque une pause prolongée et revient plus vite que le tempo 3011 ; la main libre est partiellement masquée et le buste tourne légèrement. Gardez le tronc stable et suivez le tempo de la fiche.",
      spoken:
        "Rowing assis câble unilatéral. Pieds sur les appuis, genoux souples et dos neutre, tenez une poignée reliée à la poulie basse avec une seule main ; l'autre main reste libre sur la cuisse. Tirez la poignée vers la taille en une seconde, coude près du buste. Maintenez une seconde, puis revenez en trois secondes jusqu'au bras allongé. Gardez le tronc stable, sans rotation ni élan, et travaillez un côté à la fois. La vidéo marque une pause prolongée et revient trop vite ; la main libre est partiellement masquée et le buste tourne légèrement. Suivez le tempo 3011 plutôt que le rythme de l'image. Quatre séries de sept à neuf, quatre-vingt-dix secondes de repos.",
    },
  },
  "rowing-a-l-elastique": {
    src: "/videos/rowing-a-l-elastique.mp4",
    poster: "/videos/posters/rowing-a-l-elastique.jpg",
    label: "Vidéo IA · Rowing à l'élastique",
    status: "coached",
    coaching: {
      title:
        "Fixez solidement l'élastique et tirez les deux poignées sans basculer.",
      handCue:
        "Vérifiez l'état de l'élastique et son ancrage ; tenez une poignée dans chaque main.",
      movementCue:
        "Tirez vers les côtes en une seconde puis revenez en trois secondes, sans pause ni lâcher les poignées.",
      notice:
        "Une main est masquée en fin de tirage et la symétrie est peu lisible. La pause est prolongée et le retour est plus rapide que le tempo 3010. Suivez les consignes plutôt que le rythme de l'image.",
      spoken:
        "Rowing à l'élastique. Avant de commencer, vérifiez l'état de l'élastique et fixez-le solidement à un ancrage stable. Assis au sol, pieds en appui et genoux souples, tenez une poignée dans chaque main, dos neutre. Tirez les deux poignées vers les côtes en une seconde, coudes vers l'arrière près du corps. Revenez en trois secondes jusqu'aux bras allongés, sans pause et sans basculer. Ne lâchez pas les poignées sous tension et ne fixez pas l'élastique autour des poignets. Une main est masquée en fin de tirage ; la symétrie et le tempo ne sont pas clairement montrés, et la pause est trop longue. Suivez le tempo 3010 plutôt que l'image. Trois séries de dix à quinze, quatre-vingt-dix secondes de repos.",
    },
  },
  // Dos #24 : vidéo conservée telle que déposée, avec amplitude prudente.
  "pullover-haltere-plat": {
    src: "/videos/pullover-haltere-plat.mp4",
    poster: "/videos/posters/pullover-haltere-plat.jpg",
    label: "Vidéo IA · Pullover haltère plat",
    status: "coached",
    coaching: {
      title:
        "Abaissez l'haltère vers l'arrière uniquement dans une amplitude confortable.",
      handCue:
        "Tenez un seul haltère fermement à deux mains, avec une prise sûre adaptée à sa forme.",
      movementCue:
        "Abaissez vers l'arrière en trois secondes puis ramenez au-dessus de la poitrine en une seconde, coudes souples.",
      notice:
        "La vidéo ne descend pas nettement derrière la tête, les coudes changent d'angle et la prise des mains est peu lisible. Ne forcez jamais plus bas pour imiter une amplitude ; suivez les consignes et votre mobilité confortable.",
      spoken:
        "Pullover haltère plat. Allongez-vous dans le sens du banc, tête, dos et bassin soutenus, pieds au sol. Tenez un seul haltère fermement avec les deux mains, en choisissant une prise sûre adaptée au matériel. Si vous ne pouvez pas tenir la charge de façon sûre, ne commencez pas. Au départ, l'haltère est au-dessus de la poitrine, les coudes légèrement fléchis. Abaissez-le lentement vers l'arrière de la tête en trois secondes par les épaules, sans chercher à toucher le sol ni forcer la mobilité. Arrêtez avant toute douleur. Ramenez-le au-dessus de la poitrine en une seconde, sans pause, en gardant un angle de coude à peu près constant et le dos soutenu. La vidéo ne montre pas nettement la descente derrière la tête, les coudes changent d'angle et la prise est peu lisible ; respectez votre amplitude confortable et le tempo 3010 plutôt que d'imiter ces détails. Trois séries de douze à quinze, soixante secondes de repos.",
    },
  },
  // Épaules #01 à #04 : sources déposées, conservées et accompagnées.
  "developpe-militaire-halteres-assis": {
    src: "/videos/developpe-militaire-halteres-assis.mp4",
    poster: "/videos/posters/developpe-militaire-halteres-assis.jpg",
    label: "Vidéo IA · Développé militaire haltères assis",
    status: "coached",
    coaching: {
      title: "Gardez le dos soutenu et contrôlez la montée et la descente.",
      handCue: "Tenez un haltère dans chaque main avec une prise ferme et les poignets alignés.",
      movementCue: "Poussez en une seconde, maintenez une seconde en haut puis redescendez en deux secondes, sans forcer l'amplitude.",
      notice: "Les haltères sont partiellement hors cadre en haut de la vidéo ; la prise et la position haute ne sont donc pas entièrement visibles. Le rythme ne montre pas clairement le tempo 2011. Suivez les consignes et arrêtez avant toute douleur.",
      spoken: "Développé militaire haltères assis. Asseyez-vous, dos soutenu et pieds au sol. Tenez un haltère fermement dans chaque main, poignets alignés. Poussez les deux haltères vers le haut en une seconde sans cambrer. Maintenez une seconde en haut sans bloquer brutalement les coudes, puis redescendez en deux secondes à une hauteur confortable, sans pause en bas. Les haltères sortent partiellement du cadre en haut de la vidéo et son rythme ne montre pas clairement le tempo 2011. Suivez la consigne plutôt que l'image, sans forcer l'amplitude et arrêtez avant toute douleur. Trois séries de dix à douze répétitions, soixante-quinze secondes de repos.",
    },
  },
  "elevations-laterales-halteres": {
    src: "/videos/elevations-laterales-halteres.mp4",
    poster: "/videos/posters/elevations-laterales-halteres.jpg",
    label: "Vidéo IA · Élévations latérales haltères",
    status: "coached",
    coaching: {
      title: "Levez les bras sans élan, au maximum à hauteur des épaules.",
      handCue: "Tenez un haltère léger dans chaque main, poignets confortables sans rotation forcée.",
      movementCue: "Montez en une seconde, maintenez une seconde, puis redescendez en deux secondes.",
      notice: "Les mains et les charges sont peu lisibles pendant le mouvement ; les bras montent légèrement au-dessus de l'horizontale et le rythme de la vidéo ne montre pas clairement le tempo 2011. Limitez la hauteur à celle des épaules et suivez la consigne.",
      spoken: "Élévations latérales haltères. Debout, pieds stables et buste droit, prenez un haltère léger dans chaque main. Poignets confortables, coudes légèrement souples. Écartez les bras en une seconde sans élan, au maximum jusqu'à la hauteur des épaules. Maintenez une seconde, puis descendez en deux secondes, sans pause en bas. Ne forcez aucune rotation des poignets et arrêtez avant toute douleur. La vidéo monte légèrement au-dessus de l'horizontale et le rythme n'illustre pas clairement le tempo 2011 ; respectez la hauteur et le rythme de la consigne. Trois séries de quinze répétitions, quarante-cinq secondes de repos.",
    },
  },
  "face-pull-a-l-elastique": {
    src: "/videos/face-pull-a-l-elastique.mp4",
    poster: "/videos/posters/face-pull-a-l-elastique.jpg",
    label: "Vidéo IA · Face pull à l'élastique",
    status: "coached",
    coaching: {
      title: "Fixez solidement l'élastique et tirez vers le visage sans élan.",
      handCue: "Vérifiez l'état et l'ancrage de l'élastique ; tenez une poignée dans chaque main, jamais autour des poignets.",
      movementCue: "Tirez en une seconde vers le visage, maintenez une seconde et revenez en deux secondes, coudes confortablement hauts.",
      notice: "La prise, les attaches et la symétrie sont peu lisibles ; la vidéo ne montre pas clairement le tempo 2011. Vérifiez l'ancrage et suivez les consignes plutôt que le rythme de l'image.",
      spoken: "Face pull à l'élastique. Vérifiez l'état de l'élastique et fixez-le solidement devant vous à hauteur du visage. Tenez une poignée dans chaque main, jamais autour des poignets. Debout, pieds stables et buste droit, tirez vers le visage en une seconde, en écartant les mains et en gardant les coudes confortablement hauts. Maintenez une seconde, puis revenez en deux secondes sous contrôle. La prise, les attaches et la symétrie sont peu lisibles dans la vidéo ; suivez le tempo 2011 plutôt que son rythme. Ne forcez pas l'épaule et arrêtez avant toute douleur. Trois séries de quinze répétitions, quarante-cinq secondes de repos.",
    },
  },
  "face-pull-a-la-poulie": {
    src: "/videos/face-pull-a-la-poulie.mp4",
    poster: "/videos/posters/face-pull-a-la-poulie.jpg",
    label: "Vidéo IA · Face pull à la poulie",
    status: "coached",
    avoidSilentPreview: true, // Le retour imparfait nécessite la notice en vue complète.
    coaching: {
      title: "Tirez vers le visage et gardez le retour à hauteur confortable.",
      handCue: "À la poulie haute, tenez une extrémité de corde dans chaque main avec une prise ferme.",
      movementCue: "Tirez vers le visage, mains écartées et coudes confortablement hauts ; revenez vers la poulie sans abaisser les mains vers le ventre.",
      notice: "Cette nouvelle vidéo tire vers le visage, mais les mains redescendent vers le buste au retour et la corde se déforme. Ne copiez pas cette descente : gardez les mains à hauteur confortable et suivez le tempo 2011.",
      spoken: "Face pull à la poulie. Placez la poulie haute devant vous et tenez une extrémité de la corde dans chaque main. Pieds stables, buste droit, tirez en une seconde vers le visage en écartant les mains et en gardant les coudes confortablement hauts. Maintenez une seconde, puis revenez vers la poulie en deux secondes sous contrôle. La nouvelle vidéo tire vers le visage mais les mains redescendent vers le buste au retour et la corde se déforme. Ne laissez pas les mains descendre vers le ventre ; gardez-les à une hauteur confortable et suivez le tempo plutôt que le rythme de l'image. Ne basculez pas et arrêtez avant toute douleur. Trois séries de quinze répétitions, quarante-cinq secondes de repos.",
    },
  },
  // Épaules #05 à #08 : dépôts conservés avec consignes distinctes.
  "elevations-laterales-halteres-myo-reps": {
    src: "/videos/elevations-laterales-halteres-myo-reps.mp4",
    poster: "/videos/posters/elevations-laterales-halteres-myo-reps.jpg",
    label: "Vidéo IA · Élévations latérales myo-reps",
    status: "coached",
    avoidSilentPreview: true,
    coaching: {
      title: "Attention : la vidéo montre le buste penché, pas la position debout de la fiche.",
      handCue: "Debout, tenez un haltère léger dans chaque main, poignets confortables, sans rotation forcée.",
      movementCue: "Gardez le buste droit et levez les bras sur les côtés jusqu'à hauteur des épaules au maximum.",
      notice: "La vidéo montre des élévations buste penché au lieu du mouvement debout demandé. Ne copiez pas cette position : restez droit, suivez la fiche et son tempo 2011. La méthode myo-reps n'est pas démontrée par ce clip.",
      spoken: "Attention, la vidéo montre des élévations avec le buste penché, pas la position debout de cet exercice. Ne reproduisez pas cette inclinaison. Debout, pieds stables, gardez le buste droit et tenez un haltère léger dans chaque main. Levez les bras sur les côtés en une seconde, coudes souples, au maximum à hauteur des épaules. Maintenez une seconde puis redescendez en deux secondes, sans élan ni pause en bas. Gardez les poignets confortables sans rotation forcée, et arrêtez avant toute douleur. La vidéo ne démontre pas la méthode myo-reps : suivez votre fiche. Trois séries de douze à quinze plus myo-reps, quarante-cinq secondes de repos.",
    },
  },
  "developpe-militaire-halteres-assis-test-3-5-reps": {
    src: "/videos/developpe-militaire-halteres-assis-test-3-5-reps.mp4",
    poster: "/videos/posters/developpe-militaire-halteres-assis-test-3-5-reps.jpg",
    label: "Vidéo IA · Développé militaire assis — test 3 à 5",
    status: "coached",
    coaching: {
      title: "Dos soutenu, pieds au sol, mouvement contrôlé sans cambrer.",
      handCue: "Tenez un haltère dans chaque main avec une prise ferme et les poignets alignés.",
      movementCue: "Poussez en une seconde, maintenez une seconde en haut puis descendez en deux secondes sans forcer.",
      notice: "Cette vidéo est identique à celle de l'exercice épaules 01 : les haltères sortent partiellement du cadre en haut et le tempo 2011 n'est pas clairement montré. La programmation du test reste distincte.",
      spoken: "Développé militaire haltères assis, test de trois à cinq répétitions. Choisissez une charge adaptée et si nécessaire un pareur. Asseyez-vous, dos soutenu et pieds au sol, un haltère fermement dans chaque main. Poussez les deux haltères en une seconde sans cambrer. Maintenez une seconde en haut sans bloquer brutalement les coudes, puis descendez en deux secondes à une hauteur confortable, sans pause en bas. Les haltères sortent partiellement du cadre en haut et le rythme de la vidéo ne montre pas clairement le tempo 2011. Suivez les consignes et arrêtez avant toute douleur. Quatre séries de trois à cinq répétitions, cent cinquante secondes de repos.",
    },
  },
  "elevations-laterales-assises": {
    src: "/videos/elevations-laterales-assises.mp4",
    poster: "/videos/posters/elevations-laterales-assises.jpg",
    label: "Vidéo IA · Élévations latérales assises",
    status: "coached",
    coaching: {
      title: "Assis et stable, montez au maximum à hauteur des épaules.",
      handCue: "Tenez un haltère léger dans chaque main, sans forcer les poignets.",
      movementCue: "Levez les bras sur les côtés en une seconde, coudes légèrement souples, puis redescendez en trois secondes sans pause.",
      notice: "La vidéo fléchit fortement les coudes au sommet, monte les haltères au-dessus des épaules et ne montre pas clairement le tempo 3010. Gardez les coudes légèrement souples et limitez la hauteur.",
      spoken: "Élévations latérales assises. Asseyez-vous, pieds au sol et buste stable. Prenez un haltère léger dans chaque main, bras le long des cuisses. Levez les deux bras sur les côtés en une seconde, coudes légèrement souples, jusqu'à la hauteur des épaules au maximum. Redescendez en trois secondes sans pause et sans élan. La vidéo plie fortement les coudes et monte les haltères au-dessus des épaules ; ne copiez pas ces détails et suivez le tempo 3010. Arrêtez avant toute douleur. Quatre séries de huit à dix, soixante secondes de repos.",
    },
  },
  "elevations-laterales-assises-variante": {
    src: "/videos/elevations-laterales-assises-variante.mp4",
    poster: "/videos/posters/elevations-laterales-assises-variante.jpg",
    label: "Vidéo IA · Élévations latérales assises — variante",
    status: "coached",
    coaching: {
      title: "Restez assis sans balancer et contrôlez la descente.",
      handCue: "Tenez un haltère léger dans chaque main, poignets confortables.",
      movementCue: "Montez les bras latéralement en une seconde, jusqu'à hauteur des épaules au maximum, puis redescendez en trois secondes.",
      notice: "La vidéo monte légèrement au-dessus de l'horizontale, marque une pause en haut et descend plus vite que le tempo 3010. Limitez la hauteur et suivez le rythme de la fiche.",
      spoken: "Élévations latérales assises, variante. Asseyez-vous, pieds stables au sol et buste droit, un haltère léger dans chaque main. Levez les deux bras sur les côtés en une seconde, coudes légèrement souples, jusqu'à hauteur des épaules au maximum. Redescendez en trois secondes sans pause ni balancement. La vidéo monte légèrement trop haut, marque une pause et descend trop vite : suivez la hauteur et le tempo 3010 de la fiche plutôt que son rythme. Arrêtez avant toute douleur. Quatre séries de dix à douze, soixante secondes de repos.",
    },
  },
  // Épaules #09 et #12 : vidéos de Yanis conservées telles que déposées.
  "elevations-laterales-coude-a-90": {
    src: "/videos/elevations-laterales-coude-a-90.mp4",
    poster: "/videos/posters/elevations-laterales-coude-a-90.jpg",
    label: "Vidéo IA · Élévations latérales coudes à 90°",
    status: "coached",
    coaching: {
      title: "Gardez les coudes fléchis environ à 90° pendant l'élévation.",
      handCue: "Tenez un haltère léger dans chaque main, avec une prise sûre et des poignets confortables.",
      movementCue: "Montez les coudes latéralement en une seconde, sans dépasser la hauteur des épaules, puis redescendez en trois secondes.",
      notice: "L'angle des coudes change dans la vidéo : les bras s'allongent et le mouvement devient asymétrique. La hauteur et le rythme ne montrent pas clairement le geste et le tempo 3010 de la fiche. Suivez la consigne plutôt que ces détails.",
      spoken: "Élévations latérales, coudes à quatre-vingt-dix degrés. Debout, pieds stables et buste droit, tenez un haltère léger dans chaque main, avec une prise sûre. Au départ, gardez les coudes fléchis environ à quatre-vingt-dix degrés, près du buste et les avant-bras vers l'avant. Levez les coudes sur les côtés en une seconde jusqu'à une hauteur confortable, au maximum celle des épaules, en conservant approximativement la flexion des coudes. Redescendez en trois secondes sans pause ni élan. La vidéo allonge les bras et devient asymétrique ; respectez la flexion des coudes et le tempo 3010 plutôt que ces détails. Ne forcez pas les épaules et arrêtez avant toute douleur. Quatre séries de douze à quinze, cent vingt secondes de repos.",
    },
  },
  "elevations-laterales-incline-30-face-au-banc": {
    src: "/videos/elevations-laterales-incline-30-face-au-banc.mp4",
    poster: "/videos/posters/elevations-laterales-incline-30-face-au-banc.jpg",
    label: "Vidéo IA · Élévations latérales face au banc 30°",
    status: "coached",
    coaching: {
      title: "Gardez le torse soutenu sur le banc à environ 30°.",
      handCue: "Tenez un haltère léger dans chaque main avec une prise sûre, sans contact avec le banc.",
      movementCue: "Écartez les bras en une seconde dans une amplitude confortable puis redescendez en trois secondes, sans lever le buste.",
      notice: "L'angle exact du banc et la prise ne sont pas clairement vérifiables ; une main est masquée pendant le mouvement et la vidéo marque une pause en haut. Ne copiez pas sa pause : respectez le banc à 30°, le maintien du torse et le tempo 3010.",
      spoken: "Élévations latérales face au banc incliné. Réglez le dossier à environ trente degrés par rapport à l'horizontale. Placez le torse face au dossier et soutenu sur le banc, les pieds stables. Tenez un haltère léger dans chaque main avec une prise sûre, les bras pendants de chaque côté. Écartez les bras en une seconde, coudes souples, jusqu'à une hauteur confortable, sans relever le torse. Redescendez en trois secondes sans pause, sans élan ni contact des charges avec le banc. Dans la vidéo, l'angle exact du banc et la prise sont peu lisibles, une main est masquée et une pause apparaît en haut. Suivez le tempo 3010 plutôt que l'image et arrêtez avant toute douleur. Trois séries de dix, huit et six répétitions, en dégressif selon votre fiche, soixante-quinze secondes de repos.",
    },
  },
  // Épaules #17 et #19 : vidéos déposées par Yanis, avec leurs réserves.
  "developpe-derriere-la-nuque": {
    src: "/videos/developpe-derriere-la-nuque.mp4",
    poster: "/videos/posters/developpe-derriere-la-nuque.jpg",
    label: "Vidéo IA · Développé derrière la nuque",
    status: "coached",
    coaching: {
      title: "Ne forcez pas la descente derrière la tête.",
      handCue: "Tenez une barre avec une prise confortable et des poignets alignés.",
      movementCue: "Poussez en une seconde, puis redescendez en quatre secondes seulement dans une amplitude confortable, sans toucher la tête ni la nuque.",
      notice: "La barre semble descendre au niveau de la nuque sur la vidéo ; ne copiez pas cette profondeur. La prise est petite à l'écran et le rythme ne démontre pas clairement le tempo 4010. Limitez l'amplitude à votre mobilité et arrêtez avant toute douleur.",
      spoken: "Développé derrière la nuque. Asseyez-vous de façon stable, pieds au sol et buste gainé. Tenez une barre avec une prise confortable. Poussez en une seconde, puis redescendez derrière la tête en quatre secondes, seulement dans une amplitude confortable et sans toucher la tête ou la nuque. Dans la vidéo, la barre semble descendre au niveau de la nuque et le tempo n'est pas clairement démontré. Ne copiez pas cette profondeur et ne forcez jamais votre mobilité. Arrêtez avant toute douleur. Cinq séries de six à huit répétitions, soixante secondes de repos.",
    },
  },
  "developpe-haltere-un-bras-debout": {
    src: "/videos/developpe-haltere-un-bras-debout.mp4",
    poster: "/videos/posters/developpe-haltere-un-bras-debout.jpg",
    label: "Vidéo IA · Développé haltère un bras debout",
    status: "coached",
    coaching: {
      title: "Gardez le buste stable et contrôlez la descente.",
      handCue: "Tenez un seul haltère dans la main active, poignet aligné et main libre sans charge.",
      movementCue: "Poussez en une seconde puis redescendez en quatre secondes vers l'épaule, sans vous pencher.",
      notice: "La vidéo montre un seul côté ; la main est petite à l'écran et le rythme ne démontre pas clairement le tempo 4010. Gardez le buste stable, contrôlez la descente et travaillez les deux côtés selon la fiche.",
      spoken: "Développé haltère un bras debout. Pieds stables, buste droit et gainé. Prenez un haltère dans la main active, l'autre main reste libre. Poussez vers le haut en une seconde, puis redescendez en quatre secondes à hauteur d'épaule confortable, sans vous pencher ni cambrer. La vidéo ne montre qu'un côté et ne démontre pas clairement le tempo 4010 : respectez la fiche et travaillez les deux côtés. Arrêtez avant toute douleur. Quatre séries de sept à neuf répétitions, quatre-vingt-dix secondes de repos.",
    },
  },
  // Épaules #11 et #15 : vidéos déposées, avec les réserves de prise et d'angle.
  "developpe-halteres-assis-neutre-pronation": {
    src: "/videos/developpe-halteres-assis-neutre-pronation.mp4",
    poster: "/videos/posters/developpe-halteres-assis-neutre-pronation.jpg",
    label: "Vidéo IA · Développé haltères assis neutre vers pronation",
    status: "coached",
    coaching: {
      title: "En bas, paumes face à face ; en haut, paumes vers l'avant.",
      handCue: "Gardez les poignets alignés et utilisez une prise neutre, paumes face à face, au départ en bas.",
      movementCue: "Poussez en une seconde en tournant progressivement les paumes vers l'avant, puis descendez en trois secondes en revenant à la prise neutre.",
      notice: "La rotation vers la prise neutre n'est pas clairement visible et la vidéo semble garder les paumes vers l'avant en bas. Ne copiez pas la prise du bas : suivez la consigne et le tempo 3010, non démontré clairement.",
      spoken: "Développé haltères assis, neutre vers pronation. Dos soutenu, pieds stables, un haltère par main. En bas, paumes face à face et poignets alignés. Poussez en une seconde en tournant progressivement les paumes vers l'avant. Redescendez en trois secondes en revenant à la prise neutre. La rotation n'est pas clairement visible sur la vidéo, qui semble garder les paumes vers l'avant en bas. Suivez la consigne, pas la prise de l'image. Arrêtez avant toute douleur. Quatre séries de huit à dix répétitions, quatre-vingt-dix secondes de repos.",
    },
  },
  "elevations-laterales-incline-45": {
    src: "/videos/elevations-laterales-incline-45.mp4",
    poster: "/videos/posters/elevations-laterales-incline-45.jpg",
    label: "Vidéo IA · Élévations latérales incliné 45°",
    status: "coached",
    coaching: {
      title: "Torse soutenu, écartez les bras sans élan.",
      handCue: "Tenez un haltère léger dans chaque main, les bras libres de chaque côté du banc.",
      movementCue: "Écartez les bras en une seconde dans une amplitude confortable puis redescendez en trois secondes sans relever le torse.",
      notice: "La vidéo utilise un appui poitrine sur banc, interprétation de la fiche ; l'angle exact de 45 degrés et les mains sont peu lisibles, et le tempo n'est pas clairement démontré. Suivez la consigne sans élan.",
      spoken: "Élévations latérales incliné quarante-cinq degrés. Réglez le banc à environ quarante-cinq degrés, torse soutenu et pieds stables. Tenez un haltère léger dans chaque main, bras libres de chaque côté. Écartez les bras en une seconde, coudes souples et amplitude confortable, sans relever le buste. Redescendez en trois secondes sans pause ni élan. La vidéo montre un appui poitrine, interprétation de la fiche ; l'angle exact et les mains sont peu lisibles et le rythme ne démontre pas clairement le tempo 3010. Arrêtez avant toute douleur. Trois séries de huit à dix répétitions, soixante secondes de repos.",
    },
  },
  // Épaules #18 et #21 : même élévation unilatérale inclinée au poteau.
  "elevations-laterales-incline": {
    src: "/videos/elevations-laterales-incline-au-poteau.mp4",
    poster: "/videos/posters/elevations-laterales-incline-au-poteau.jpg",
    label: "Vidéo IA · Élévation latérale inclinée au poteau",
    status: "coached",
    coaching: {
      title: "Gardez les pieds stables et le corps incliné sans balancer.",
      handCue: "Tenez un poteau fixe d'une main et un haltère léger de l'autre, avec une prise sûre.",
      movementCue: "Élevez le bras libre sur le côté en une seconde, sans dépasser l'épaule, puis redescendez en trois secondes sans pause.",
      notice: "La vidéo montre un seul côté ; la prise de l'haltère est peu lisible et la charge arrive près du bord de l'image. Le rythme ne démontre pas clairement 3010. Gardez le poteau bien fixe et respectez la fiche.",
      spoken: "Élévations latérales inclinées au poteau. Placez les pieds ensemble près d'un poteau bien fixé et tenez-le d'une main avec une prise sûre. Inclinez le corps confortablement, sans vous balancer. Avec un haltère léger dans l'autre main, écartez le bras en une seconde jusqu'à hauteur d'épaule au maximum, puis redescendez en trois secondes sans pause. La vidéo ne montre qu'un côté ; la prise de l'haltère est peu lisible et le rythme ne démontre pas clairement le tempo. Travaillez les deux côtés et arrêtez avant toute douleur. Quatre séries de douze à quinze répétitions, soixante secondes de repos.",
    },
  },
  "elevations-laterales-lean-away": {
    src: "/videos/elevations-laterales-incline-au-poteau.mp4",
    poster: "/videos/posters/elevations-laterales-incline-au-poteau.jpg",
    label: "Vidéo IA · Élévation latérale lean away",
    status: "coached",
    coaching: {
      title: "Gardez le corps stable et marquez une seconde en haut.",
      handCue: "Tenez un poteau fixe d'une main et un haltère léger de l'autre, avec une prise sûre.",
      movementCue: "Élevez le bras libre sur le côté en une seconde, marquez une seconde en haut, puis redescendez en trois secondes.",
      notice: "Même mouvement incliné au poteau que l'épaule 18 : sa vidéo est réutilisée. Elle montre un seul côté, une prise peu lisible et ne démontre pas clairement la pause ni le tempo 3011 de cette fiche.",
      spoken: "Élévations latérales lean away. Pieds ensemble près d'un poteau bien fixé, tenez-le d'une main et inclinez le corps confortablement. Tenez un haltère léger de l'autre main. Écartez le bras en une seconde jusqu'à hauteur d'épaule au maximum, marquez une seconde en haut, puis redescendez en trois secondes sans élan. La vidéo est celle de l'exercice dix-huit : la prise est peu lisible et la pause en haut n'est pas clairement démontrée. Suivez le tempo 3011 de cette fiche, travaillez les deux côtés et arrêtez avant toute douleur. Trois séries de douze à quinze répétitions, soixante secondes de repos.",
    },
  },
  // Épaule #23 : même développé debout que #10, mais consignes et test propres.
  "developpe-militaire-test-1rm": {
    src: "/videos/developpe-militaire-debout.mp4",
    poster: "/videos/posters/developpe-militaire-debout.jpg",
    label: "Vidéo IA · Développé militaire debout, test de force",
    status: "coached",
    coaching: {
      title: "Test de force : échauffez-vous et sécurisez la barre.",
      handCue: "Tenez la barre en pronation, poignets alignés, avec une prise adaptée à votre mobilité.",
      movementCue: "Gardez les pieds stables et le buste gainé ; poussez sans élan puis descendez de façon contrôlée.",
      notice: "La vidéo de l'épaule 10 est réutilisée pour le même développé debout : elle ne démontre ni le test maximal ni le tempo 4010. Les mains sont peu lisibles. Suivez la fiche et ne déduisez pas la charge à utiliser de l'image.",
      spoken: "Développé militaire debout, test de force. Échauffez-vous progressivement, sécurisez la barre avec du matériel adapté et faites-vous assister si nécessaire. Pieds stables et buste gainé, tenez la barre en pronation, poignets alignés. Poussez sans élan ni cambrure, puis descendez de façon contrôlée en quatre secondes. La vidéo est celle de l'exercice dix : elle ne montre ni le test maximal ni le tempo de cette fiche, et les mains sont peu lisibles. Ne forcez pas en cas de douleur. Cinq séries de une à cinq répétitions, trois minutes de repos.",
    },
  },
  // Épaule #16 : même mouvement debout que #02. Yanis demande de réutiliser sa vidéo.
  "elevations-laterales": {
    src: "/videos/elevations-laterales-halteres.mp4",
    poster: "/videos/posters/elevations-laterales-halteres.jpg",
    label: "Vidéo IA · Élévations latérales debout",
    status: "coached",
    coaching: {
      title: "Montez au maximum à hauteur d'épaules, sans balancer.",
      handCue: "Tenez un haltère léger dans chaque main, avec des poignets confortables et sans rotation forcée.",
      movementCue: "Écartez les bras en une seconde, puis redescendez en trois secondes sans pause.",
      notice: "Cette vidéo est celle de l'épaule 02, réutilisée à la demande de Yanis. Les mains et les charges sont peu lisibles et les bras dépassent légèrement l'horizontale. Suivez la hauteur des épaules et le tempo 3010 de cette fiche, pas le rythme de la vidéo.",
      spoken: "Élévations latérales debout. Pieds stables, buste droit, prenez un haltère léger dans chaque main et gardez les poignets confortables. Écartez les bras sur les côtés en une seconde, coudes légèrement souples, au maximum jusqu'à la hauteur des épaules. Redescendez en trois secondes sans pause et sans balancer. La vidéo est celle de l'exercice deux : les mains sont peu lisibles et les bras montent légèrement trop haut. Respectez la hauteur des épaules et le tempo 3010 de cette fiche plutôt que le rythme de l'image. Arrêtez avant toute douleur. Trois séries de huit à dix répétitions, soixante secondes de repos.",
    },
  },
  // Épaules #10, #13 et #14 : MP4 déposés par Yanis, conservés en l'état.
  "developpe-militaire-debout": {
    src: "/videos/developpe-militaire-debout.mp4",
    poster: "/videos/posters/developpe-militaire-debout.jpg",
    label: "Vidéo IA · Développé militaire debout",
    status: "coached",
    coaching: {
      title: "Gainez le buste et marquez deux secondes au menton.",
      handCue: "Tenez la barre en pronation, légèrement plus large que les épaules, poignets alignés.",
      movementCue: "Depuis le haut, descendez devant le visage en quatre secondes, marquez deux secondes au menton puis poussez en une seconde.",
      notice: "La prise et la trajectoire de la barre sont petites à l'écran ; le rythme et la pause en bas ne montrent pas clairement le tempo 4210. Suivez la fiche et ne forcez pas l'amplitude.",
      spoken: "Développé militaire debout. Pieds stables, abdominaux gainés et buste droit. Tenez la barre avec les paumes vers l'avant, un peu plus large que les épaules. Depuis le haut, descendez la barre devant le visage en quatre secondes jusqu'à une hauteur confortable au menton. Marquez deux secondes de pause sans relâcher, puis poussez vers le haut en une seconde sans cambrer. La vidéo est éloignée et ne montre pas clairement le tempo ou la pause de deux secondes : suivez la consigne. Arrêtez avant toute douleur. Cinq séries de cinq à sept répétitions, quatre-vingt-dix secondes de repos.",
    },
  },
  "developpe-halteres-assis": {
    src: "/videos/developpe-halteres-assis.mp4",
    poster: "/videos/posters/developpe-halteres-assis.jpg",
    label: "Vidéo IA · Développé haltères assis",
    status: "coached",
    coaching: {
      title: "Dos soutenu, poussez sans cambrer puis contrôlez la descente.",
      handCue: "Tenez un haltère dans chaque main, paumes vers l'avant, poignets alignés.",
      movementCue: "Poussez en une seconde, puis redescendez en quatre secondes sans pause volontaire.",
      notice: "Les haltères restent dans le cadre, mais la prise est peu lisible à cette distance ; la vidéo marque une pause en haut et descend plus vite que le tempo 4010. Suivez la consigne plutôt que son rythme.",
      spoken: "Développé haltères assis. Asseyez-vous, dos soutenu et pieds au sol. Prenez un haltère dans chaque main, paumes vers l'avant et poignets alignés. Poussez les haltères vers le haut en une seconde sans cambrer, puis redescendez en quatre secondes à une hauteur confortable, sans pause volontaire. Les haltères restent dans le cadre, mais les mains sont petites à l'écran et la vidéo marque une pause en haut et descend plus vite que le tempo 4010. Suivez la consigne et arrêtez avant toute douleur. Quatre séries de six à huit répétitions, quatre-vingt-dix secondes de repos.",
    },
  },
  "elevations-laterales-incline-30": {
    src: "/videos/elevations-laterales-incline-30.mp4",
    poster: "/videos/posters/elevations-laterales-incline-30.jpg",
    label: "Vidéo IA · Élévations latérales incliné 30°",
    status: "coached",
    coaching: {
      title: "Gardez le torse soutenu sur le banc à environ 30°.",
      handCue: "Tenez un haltère léger dans chaque main avec une prise sûre, sans contact avec le banc.",
      movementCue: "Écartez les bras en une seconde dans une amplitude confortable puis redescendez en trois secondes, sans lever le buste.",
      notice: "La vidéo déposée est identique à celle de l'épaule 12. L'angle exact du banc et la prise sont peu lisibles ; une main est masquée et une pause apparaît en haut. Suivez le réglage à 30° et le tempo 3010 de cette fiche.",
      spoken: "Élévations latérales, banc incliné trente degrés. Réglez le dossier à environ trente degrés par rapport à l'horizontale. Placez le torse face au dossier et soutenu sur le banc, les pieds stables. Tenez un haltère léger dans chaque main, bras pendants de chaque côté. Écartez les bras en une seconde, coudes souples, jusqu'à une hauteur confortable, sans relever le torse. Redescendez en trois secondes sans pause ni élan. La vidéo est identique à celle de l'exercice douze : l'angle exact du banc et la prise sont peu lisibles, une main est masquée et une pause apparaît en haut. Suivez le tempo 3010 et arrêtez avant toute douleur. Trois séries de huit à dix répétitions, soixante secondes de repos.",
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
