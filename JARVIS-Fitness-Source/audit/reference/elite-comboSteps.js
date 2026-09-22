function comboSteps(run){
  const tp=CARDIO_TYPES.find(x=>x.id===run.cardio.id)||CARDIO_TYPES[0];
  const s1=_cardioSteps(tp,run.cardio.min).map(s=>['🚴 '+s[0],s[1]]);
  const s2=poolStepsOf(run.pool.id, run.pool.lvl||0).map(s=>['🏊 '+s[0],s[1]]);
  return s1.concat([['🔄 Transition — boire, rejoindre la piscine',300]],s2);
}