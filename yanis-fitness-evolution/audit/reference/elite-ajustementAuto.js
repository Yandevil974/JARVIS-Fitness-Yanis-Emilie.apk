function ajustementAuto(){
  const poids = Object.entries(state.poids).sort();
  if(poids.length<3) return {msg:'Ajoutez au moins 3 pesées pour activer les ajustements.', delta:0};
  const recent = poids.slice(-4).map(x=>+x[1]);
  const moy = recent.reduce((a,b)=>a+b,0)/recent.length;
  const debut = +poids[0][1];
  const duree = Math.max(1, Math.floor((parseDate(poids[poids.length-1][0])-parseDate(poids[0][0]))/86400000/7));
  const taux = (moy - debut)/duree; // kg/semaine
  const phase = state.nutri.phase||'maintien';
  let attendu=0;
  if(phase==='surplus') attendu = state.objectifs.principal==='force'?0.15:0.25;
  if(phase==='deficit') attendu = -0.5;
  if(phase==='recomp'||phase==='maintien') attendu = 0.02;
  const ecart = taux - attendu;
  let delta=0, msg='';
  if(Math.abs(ecart)>0.25){
    delta = ecart>0 ? -100 : 100;
    msg = ecart>0
      ? '⚠️ Votre poids augmente plus vite que prévu ('+round1(taux)+' kg/sem.) : '+Math.abs(delta)+' kcal/jour suggérées en moins.'
      : '⚠️ Votre poids n\'augmente pas assez ('+round1(taux)+' kg/sem.) : +'+Math.abs(delta)+' kcal/jour suggérées.';
  } else if(duree>=1){
    msg = '✅ Tendance de poids conforme aux objectifs ('+round1(taux)+' kg/sem.). Aucun ajustement nécessaire.';
  } else msg='';
  return {msg, delta};
}