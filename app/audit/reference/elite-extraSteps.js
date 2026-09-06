function extraSteps(run){
  if(!run||run.fn==='repos') return [];
  if(run.fn==='combo') return comboSteps(run);
  if(run.fn==='pool'){ const pr=POOL_PROTOS.find(p=>p.id===run.id); const nv=pr&&pr.niveaux[run.lvl||0]; return nv?nv.steps:[]; }
  if(run.fn==='tabata'){ const m=TABATA_MODES.find(x=>x.id===run.id)||TABATA_MODES[0]; return _tabataSteps(m, run.cycles||3); }
  if(run.fn==='cardio'){ const tp=CARDIO_TYPES.find(x=>x.id===run.id)||CARDIO_TYPES[0]; return _cardioSteps(tp, run.min||20); }
  return [];
}