function caloriesCibles(){
  const t = tdee(state.profil);
  if(!t) return null;
  const p = state.nutri.phase||'maintien';
  const obj = state.objectifs.principal;
  let cal = t;
  if(p==='surplus') cal = obj==='force'? t*1.08 : t*1.12;
  else if(p==='deficit') cal = t*0.82;
  else if(p==='recomp') cal = t*1.00;
  else cal = t*1.02;
  cal += (state.nutri.ajustement||0);
  const prot = (obj==='seche'||p==='recomp') ? 2.2 : 2.0;
  const lip = 1.0;
  const pG = round1(prot*(+state.profil.poidsDepart));
  const lG = round1(lip*(+state.profil.poidsDepart));
  const cG = Math.max(60, Math.round((cal - pG*4 - lG*9)/4));
  return {cal:Math.round(cal), prot:pG, glu:cG, lip:lG, tdee:t};
}