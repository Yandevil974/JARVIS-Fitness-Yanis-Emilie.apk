function macroJour(mois){
  const c = caloriesCibles(); if(!c) return null;
  const plan=strategieAnnuelle(); const st=plan[clamp(mois,1,13)-1]||plan[0];
  let prot=c.prot, lip=c.lip;
  if(st.phase==='deficit'||st.phase==='recomp'){ prot = round1(2.2*(+state.profil.poidsDepart)); }
  const cal = Math.round(st.phase==='surplus'? c.tdee*(mois===1?1.10:mois===2?1.10:mois===3?1.12:1.08) : st.phase==='deficit'? c.tdee*(mois===11?0.90:0.88) : c.tdee*(mois===13?1.0:(state.nutri.ajustement||0)>0?1.01:0.99));
  const glu = Math.max(60, Math.round((cal - prot*4 - lip*9)/4));
  return {cal, prot, glu, lip, phase:st.phase, nom:st.nom};
}