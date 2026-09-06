function weekPlan(dateStr){
  const pos = programPos(dateStr);
  const phase = pos.phase;
  const a = clamp(parseInt(state.profil.seancesSemaine||4)||4, 3, 5);
  const seq = SEQUENCE_SEANCES[a];
  const start = parseDate(startDate());
  const d = parseDate(dateStr);
  const weekGlobal = Math.max(0, Math.floor((d-start)/86400000/7));
  const monday = addDays(start, weekGlobal*7);
  const trainDays = JOURS_SEANCES[a];
  const cardioDays = pos.deload ? JOURS_CARDIO[a].slice(0,1) : JOURS_CARDIO[a];
  let plan=[];
  for(let i=0;i<7;i++){
    const day = addDays(monday,i);
    const wk = day.getDay(); // 0 dim..6 sam
    const dk = dateKey(day);
    let key=null, type=null, cardio=null, label='Repos', session=null;
    if(trainDays.includes(wk)){
      const idx = trainDays.indexOf(wk);
      if(idx < seq.length){
        key = seq[idx];
        const s = phase.sessions && phase.sessions[key];
        if(s){ type='seance'; session=s; label=s.nom; }
      }
    }
    if(!key && cardioDays.includes(wk)){
      cardio = cardioDuJour(dk, wk);
      key='CARDIO'; type='metcon';
      label = pos.deload ? '🧘 Récupération active' : cardio.label;
      if(cardio.format==='piscine' && !pos.deload){
        try{
          const _sp2=poolProtocolFor(dk); const _pr2=POOL_PROTOS.find(p=>p.id===_sp2.id);
          if(_pr2) label='🏊 Piscine — '+_pr2.nom+' ('+_fmtDur(_protoDur((_pr2.niveaux[_sp2.lvl||0]||_pr2.niveaux[0]).steps))+')';
        }catch(_){}
      }
    }
    if(!key && !type && poolDays().indexOf(wk)>=0){
      type='piscine';
      try{
        const _sp=poolProtocolFor(dk); const _pr=POOL_PROTOS.find(p=>p.id===_sp.id);
        label=_pr ? '🏊 '+_pr.nom+' ('+_fmtDur(_protoDur((_pr.niveaux[_sp.lvl||0]||_pr.niveaux[0]).steps))+')' : '🏊 Piscine — Pool Lab';
      }catch(_){ label='🏊 Piscine — Pool Lab'; }
    }
    plan.push({date:dk, wk, key, type, label, session, cardio});
  }
  return plan;
}