function nutriPhaseInfo(){
  const map = {
    maintien:{n:'Maintien',ic:'⚖️',desc:'Calories ~ dépense : stabilisation du poids, base de la recomposition.',coul:'chip-blue'},
    surplus:{n:'Surplus contrôlé',ic:'📈',desc:'+10 à 12 % : prise de masse musculaire progressive en limitant le gras.',coul:'chip-green'},
    deficit:{n:'Déficit',ic:'📉',desc:'-15 à 18 % : perte de graisse en préservant le muscle grâce aux protéines élevées.',coul:'chip-orange'},
    recomp:{n:'Recomposition',ic:'♻️',desc:'Maintien calorique + protéines 2,2 g/kg : perte de gras et gain de muscle simultanés.',coul:'chip-gold'}
  };
  return map[state.nutri.phase]||map.maintien;
}