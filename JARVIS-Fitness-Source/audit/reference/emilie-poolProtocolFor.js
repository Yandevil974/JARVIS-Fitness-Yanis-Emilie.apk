function poolProtocolFor(date){
  const pos = programPos(date);
  const rec = state.recup[date] ? recupScore(state.recup[date]) : null;
  if(pos.deload) return {id:'recovery', lvl:1, why:'Semaine de deload : récupération active uniquement, aucune intensité.'};
  if(rec!=null && rec<60) return {id:'recovery', lvl:0, why:'Récupération basse ('+rec+' %) : version douce pour ne pas surcharger.'};
  const m = (pos.idx==='F') ? 12 : (+pos.idx||1);
  const t = pos.phase.type;
  if(t==='adaptation'||t==='developpement') return {id:'endurance', lvl: m<=3?0:1, why:'Phase de développement : fond aquatique facile pour drainer les jambes et préserver la récupération des fessiers.'};
  if(t==='composition') return {id:'interval', lvl: m<=8?0:1, why:'Phase de composition : intervalles pour la dépense énergétique, zéro impact sur les articulations.'};
  return {id:'interval', lvl: m>=10?1:0, why:'Entretien : intervalles réguliers à allure maîtrisée.'};
}