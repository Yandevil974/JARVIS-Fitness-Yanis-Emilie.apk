function poolDays(){
  try{
    const n=state.natation||{};
    let j=Array.isArray(n.jours)?n.jours.slice():[];
    if(n.planDim&&j.indexOf(0)<0) j.push(0);
    return j;
  }catch(_){ return []; }
}