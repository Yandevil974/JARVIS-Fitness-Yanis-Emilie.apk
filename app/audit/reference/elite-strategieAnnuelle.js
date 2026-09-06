function strategieAnnuelle(){
  const strats = [
    {mois:1, nom:'Surplus contrôlé (ou maintien si MG élevée)', detail:'Base : 2,0-2,2 g/kg de protéines. Calories = dépense +10 % si MG < 15-20 %, sinon maintien.', phase:'surplus'},
    {mois:2, nom:'Surplus contrôlé — ajustement', detail:'Maintenir le surplus. Si prise > 1 %/mois, réduire de 100 kcal.', phase:'surplus'},
    {mois:3, nom:'Surplus contrôlé — montée progressive', detail:'Volume élevé : glucides augmentés autour des entraînements.', phase:'surplus'},
    {mois:4, nom:'Maintien (fin de macrocycle)', detail:'Semaine 4 en deload : maintien strict pour stabiliser.', phase:'maintien'},
    {mois:5, nom:'Surplus modéré', detail:'+8-10 % : reprise de la construction.', phase:'surplus'},
    {mois:6, nom:'Surplus modéré', detail:'Glucides maintenus, protéines 2,0 g/kg.', phase:'surplus'},
    {mois:7, nom:'Maintien ou surplus léger', detail:'Selon l\'évolution du tour de taille.', phase:'maintien'},
    {mois:8, nom:'Maintien (fin de macrocycle)', detail:'Force au pic : maintien strict.', phase:'maintien'},
    {mois:9, nom:'Recomposition', detail:'Maintien, protéines 2,2 g/kg : redémarrage métabolique.', phase:'recomp'},
    {mois:10, nom:'Maintien strict', detail:'Charges lourdes : maintien strict pour la performance.', phase:'maintien'},
    {mois:11, nom:'Déficit léger (-10 %)', detail:'Début de l\'affûtage : protéines 2,2 g/kg.', phase:'deficit'},
    {mois:12, nom:'Déficit léger (-12 à 15 %)', detail:'Affûtage final pour révéler le muscle construit.', phase:'deficit'},
    {mois:13, nom:'Maintien — bilan final', detail:'Semaines 49-52 : retour progressif au maintien.', phase:'maintien'}
  ];
  return strats;
}