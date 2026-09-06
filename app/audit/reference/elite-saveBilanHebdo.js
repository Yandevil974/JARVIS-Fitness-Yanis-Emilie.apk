function saveBilanHebdo(){
  const etat=bilanHebdoEtat(); if(!etat) return;
  const val=n=>parseInt($('#bh-'+n).value||'3');
  const entry={
    wk:etat.wk,
    date:todayKey(),
    energie:val('en'), fatigue:val('fa'), douleurs:val('do'), motivation:val('mo'),
    ressentis:($('#bh-res').value||'').trim(),
    difficultes:($('#bh-diff').value||'').trim(),
    questions:($('#bh-q').value||'').trim(),
    conseils:genererConseilsHebdo({energie:val('en'),fatigue:val('fa'),douleurs:val('do'),motivation:val('mo'),ressentis:($('#bh-res').value||'').trim(),difficultes:($('#bh-diff').value||'').trim()}, etat.wk)
  };
  if(!state.hebdo) state.hebdo={};
  state.hebdo[etat.wk]=entry;
  save(); closeModal(); renderCurrent();
  toast('✅ Bilan transmis à l\'équipe — ajustements prêts !');
  // réaffiche le dashboard pour montrer les conseils
  go('v-dashboard');
}