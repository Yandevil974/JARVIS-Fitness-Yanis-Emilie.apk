function extraSeq(date){
  try{
    if(typeof startDate!=='function') throw 0;
    const ck=(startDate()||'')+'|'+((state.profil&&state.profil.seancesSemaine)||'')+'|'+poolDays().slice().sort().join(',');
    if(_SEQ_CACHE.key!==ck) _SEQ_CACHE={key:ck,map:{}};
    if(_SEQ_CACHE.map[date]!=null) return _SEQ_CACHE.map[date];
    let n=0;
    const d0=parseDate(startDate()), d1=parseDate(date);
    for(let d=new Date(d0.getTime()); d<=d1; d=addDays(d,1)){
      const k=dateKey(d);
      if(_SEQ_CACHE.map[k]!=null){ n=_SEQ_CACHE.map[k]; continue; }
      const pl=weekPlan(k).find(p=>p.date===k);
      if(pl&&(pl.type==='metcon'||pl.type==='piscine')) n++;
      _SEQ_CACHE.map[k]=n;
    }
    return n;
  }catch(_){
    try{ return Math.floor(parseDate(date).getTime()/86400000); }catch(_2){ return 0; }
  }
}