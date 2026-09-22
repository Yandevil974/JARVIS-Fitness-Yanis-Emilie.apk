function coachExtra(date){
  V2S();
  const wk=(weekPlan(date).find(p=>p.date===date))||{};
  const pos=programPos(date);
  const type=wk.type||'repos';
  const rec=state.recup[date]?recupScore(state.recup[date]):(function(){try{return moyenneRecup();}catch(_){return null;}})();
  const score=rec==null?65:rec;
  const base=parseDate(date);
  const ds=[]; for(let i=6;i>=0;i--) ds.push(dateKey(addDays(base,-i)));
  let durs=0;
  ['natation','cardio','tabata'].forEach(k=>{
    ((state[k]&&state[k].seances)||[]).forEach(s=>{
      if(ds.indexOf(s.d)<0) return;
      const hard=(k==='tabata')||(k==='cardio'&&/HIIT|Intervalles/.test(s.proto||''))||(k==='natation'&&!/Recovery|Endurance/.test(s.proto||''));
      if(hard) durs++;
    });
  });
  const lastPoolKey=(function(){ const s=(state.natation&&state.natation.seances)||[]; return s.length?_poolKey(s[s.length-1].proto):''; })();
  const lastCardio=(function(){ const s=(state.cardio&&state.cardio.seances)||[]; return s.length?(s[s.length-1].proto||''):''; })();
  const deload=!!pos.deload;
  const seq=extraSeq(date);
  const rot=list=>{ const k=((seq%list.length)+list.length)%list.length; return list.slice(k).concat(list.slice(0,k)); };
  const PP=(id,lvl,nom)=>({fn:'pool',id:id,lvl:lvl,nom:nom});
  const REPOS={fn:'repos',nom:'Repos total + mobilité douce'};
  const REC0=PP('recovery',0,'Aqua Recovery douce (12 min)'), REC1=PP('recovery',1,'Aqua Recovery complète (18 min)');
  const combo=(cid,cmin,pid,plvl,pnom)=>{
    const tp=CARDIO_TYPES.find(x=>x.id===cid)||CARDIO_TYPES[0];
    const pdur=_fmtDur(_protoDur(poolStepsOf(pid,plvl||0)));
    return {fn:'combo',cardio:{id:cid,min:cmin},pool:{id:pid,lvl:plvl||0,nom:pnom},
      nom:'METCON Elliptique '+tp.nom+' '+cmin+' min + '+pnom,
      cardioTxt:'🚴 METCON vélo elliptique — '+tp.nom+' '+cmin+' min',
      poolTxt:'🏊 '+pnom+(pdur?' · '+pdur:'')};
  };
  let main, why='';
  if(type==='repos'){
    if(score<50){ main=REPOS; why='Récupération à '+score+' % : le coach impose un vrai repos. Mobilité douce, étirements, hydratation — le repos fait progresser.'; }
    else { main=REC1; why='Jour de repos (récup '+score+' %) : le coach impose une récupération active en piscine — nage douce + mobilité, sans fatigue.'; }
  } else if(deload||score<50){
    main=REC0;
    why=deload?'Semaine deload : volume réduit, le coach impose uniquement Aqua Recovery douce.':'Récupération à '+score+' % : le coach impose une séance douce en piscine. Les jours durs reviendront avec la forme.';
  } else if(score<65||durs>=3){
    const pools=rot([PP('interval',0,'Swim Interval BEGINNER'),PP('aquahiit',0,'Aqua HIIT BEGINNER'),PP('aquatabata',0,'Aqua Tabata ×2'),PP('endurance',0,'Swim Endurance BEGINNER')]);
    const p=pools.find(o=>o.id!==lastPoolKey)||pools[0];
    const copts=rot([{id:'inter',re:/Intervalles/},{id:'endu',re:/Endurance/}]);
    const cid=(copts.find(o=>!o.re.test(lastCardio))||copts[0]).id;
    const cmin=score<60?15:20;
    main=combo(cid,cmin,p.id,p.lvl,p.nom);
    why='Charge '+(durs>=3?'élevée ('+durs+' séances dures / 7 j)':'modérée')+' (récup '+score+' %) : le coach impose METCON elliptique '+cmin+' min + '+p.nom+' en piscine'+(type==='metcon'?' — votre METCON du mois en version imposée':'')+'. Protocoles en rotation automatique : variés à chaque séance.';
  } else {
    const pools=rot([PP('interval',1,'Swim Interval INTERMEDIATE'),PP('aquatabata',1,'Aqua Tabata ×3'),PP('sprint',0,'Swim Sprint BEGINNER'),PP('aquahiit',1,'Aqua HIIT INTERMEDIATE')]);
    const p=pools.find(o=>o.id!==lastPoolKey)||pools[0];
    const copts=rot([{id:'hiit',re:/HIIT/},{id:'inter',re:/Intervalles/}]);
    const cid=(copts.find(o=>!o.re.test(lastCardio))||copts[0]).id;
    const cmin=20;
    main=combo(cid,cmin,p.id,p.lvl,p.nom);
    why='Bonne fraîcheur (récup '+score+' %, '+durs+' séance(s) dure(s) / 7 j) : le coach impose METCON elliptique '+cmin+' min + '+p.nom+' en piscine'+(type==='metcon'?' — votre METCON du mois en version imposée':'')+'. Protocoles en rotation automatique. On exécute. 💪';
  }
  return {type:type, main:main, why:why};
}