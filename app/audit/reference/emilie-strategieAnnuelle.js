function strategieAnnuelle(){
  return [
    {mois:1,  nom:'Recomposition douce', detail:'Calories ≈ dépense, protéines 1,9 g/kg. On apprend à manger pour construire, sans restriction.', phase:'recomp'},
    {mois:2,  nom:'Recomposition douce', detail:'Mêmes apports. Si le tour de taille baisse et que le tour de fessiers monte, tout va bien.', phase:'recomp'},
    {mois:3,  nom:'Recomposition — ajustement', detail:'On ajuste selon la tendance de poids : ±100 kcal si besoin. Priorité aux protéines autour de l\'entraînement.', phase:'recomp'},
    {mois:4,  nom:'Léger surplus ciblé fessiers', detail:'+5 à 7 % : la progression des charges démarre, on donne au muscle de quoi se construire.', phase:'surplus'},
    {mois:5,  nom:'Léger surplus (fin de cycle, deload)', detail:'Semaine 4 en deload : maintien strict pour stabiliser.', phase:'maintien'},
    {mois:6,  nom:'Surplus ciblé fessiers', detail:'+7 % : phase de développement prioritaire des fessiers. Glucides augmentés autour des séances.', phase:'surplus'},
    {mois:7,  nom:'Surplus ciblé fessiers', detail:'Volume fessier maximal : ne pas réduire les calories, même si le poids monte légèrement.', phase:'surplus'},
    {mois:8,  nom:'Surplus → maintien', detail:'Fin du cycle : on revient progressivement au maintien. Le galbe est construit.', phase:'maintien'},
    {mois:9,  nom:'Recomposition', detail:'Calories ≈ dépense, protéines 1,9 g/kg : on commence à révéler le muscle construit.', phase:'recomp'},
    {mois:10, nom:'Déficit modéré (−10 %)', detail:'Réduction progressive de la masse grasse. Le hip thrust lourd reste : c\'est lui qui protège le galbe.', phase:'deficit'},
    {mois:11, nom:'Déficit modéré (−13 %)', detail:'Finition : abdominaux visibles, taille affinée. Jamais en dessous de −13 %.', phase:'deficit'},
    {mois:12, nom:'Maintien — stabilisation', detail:'Retour au maintien pour ancrer la nouvelle composition corporelle.', phase:'maintien'},
    {mois:13, nom:'Maintien — bilan final', detail:'Semaines 49-52 : maintien et préparation du programme d\'entretien à long terme.', phase:'maintien'}
  ];
}