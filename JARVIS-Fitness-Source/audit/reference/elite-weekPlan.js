function weekPlan(dateStr){
  const pos = programPos(dateStr);
  const phase = pos.phase;
  const keys = Object.keys(phase.sessions||{});
  const n = keys.length;
  const a = clamp(parseInt(state.profil.seancesSemaine||4)||4, 3, 5);
  const eff = Math.min(a, n);
  const start = parseDate(startDate());
  const d = parseDate(dateStr);
  const weekGlobal = Math.max(0, Math.floor((d-start)/86400000/7));
  const monday = addDays(start, weekGlobal*7);
  const off = weekGlobal % n;
  let plan=[];
  for(let i=0;i<7;i++){
    const day = addDays(monday,i);
    const wk = day.getDay(); // 0 dim..6 sam
    let key=null, type=null;
    const slot = (wk===1)?0:(wk===2)?1:(wk===3)?2:(wk===4)?3:(wk===5)?4:(wk===6)?5:6;
    const trainDays = a===3?[1,3,5]:a===4?[1,2,4,5]:[1,2,4,5,6];
    if(trainDays.includes(wk)){
      const idx = trainDays.indexOf(wk);
      if(idx < eff){
        key = 'J'+((idx+off)%n+1);
        type='seance';
      }
    }
    // METCON sur les jours restants (jamais le même jour qu'une séance)
    if(!key && !pos.deload && phase.type!=='finale'){
      const metDays = a===3?[2,6]:a===4?[3,6]:[3,0];
      if(metDays.includes(wk)){ key='METCON'; type='metcon'; }
    }
    if(!key && !pos.deload && phase.type!=='finale'){ try{ if(poolDays().indexOf(wk)>=0){ key='PISCINE'; type='piscine'; } }catch(_){} }
    plan.push({date:dateKey(day),wk,key,type,
      label: key? (type==='metcon'?'⚡ METCON imposé (coach) : elliptique + piscine':type==='piscine'?'🏊 Piscine imposée (coach) : elliptique + piscine':(phase.sessions[key]||{}).nom) : 'Repos',
      session: key&&type==='seance' ? phase.sessions[key] : null});
  }
  return plan;
}