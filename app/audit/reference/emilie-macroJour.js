function macroJour(mois, jourType){
  const c = caloriesCibles(); if(!c) return null;
  const plan=strategieAnnuelle(); const st=plan[clamp(mois,1,13)-1]||plan[0];
  let prot=c.prot, lip=c.lip;
  if(st.phase==='deficit'||st.phase==='recomp'){ prot = round1(1.9*(+state.profil.poidsDepart)); }
  let cal;
  if(st.phase==='surplus') cal = c.tdee*(mois>=6&&mois<=8?1.07:1.05);
  else if(st.phase==='deficit') cal = c.tdee*(mois===11?0.87:0.90);
  else cal = c.tdee*((state.nutri.ajustement||0)>0?1.01:0.99);
  cal += (state.nutri.ajustement||0);
  /* Application du facteur du type de journée */
  const f = FACTEURS_JOUR[jourType||'repos'];
  if(f){
    cal = cal*f.cal;
    prot = prot*f.prot;
    lip = lip*f.lip;
  }
  const glu = Math.max(80, Math.round((cal - prot*4 - lip*9)/4));
  return {cal:Math.round(cal), prot:round1(prot), glu, lip:round1(lip), phase:st.phase, nom:st.nom,
          jourType:jourType||'repos', jourInfo:f};
}