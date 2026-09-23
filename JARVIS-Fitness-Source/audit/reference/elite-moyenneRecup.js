function moyenneRecup(jours){
  let s=0,n=0;
  Object.entries(state.recup).forEach(([d,e])=>{ const sc=recupScore(e); if(sc!=null){s+=sc;n++;} });
  return n? Math.round(s/n):null;
}