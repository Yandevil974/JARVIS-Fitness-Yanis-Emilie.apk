function programPos(dateStr){
  const start = parseDate(startDate());
  const d = parseDate(dateStr||todayKey());
  const diff = Math.max(0, Math.floor((d-start)/86400000));
  const weekGlobal = Math.min(51, Math.floor(diff/7));
  if(weekGlobal>=48){ return {idx:'F',mois:13,week:weekGlobal-47,weekGlobal,phase:PROGRAM.finale,deload:true,label:'Finale'}; }
  const idx = Math.min(12, Math.floor(weekGlobal/4)+1);
  const week = weekGlobal%4+1;
  return {idx,mois:idx,week,weekGlobal,phase:PROGRAM[idx],deload:week===4,label:'Mois '+idx};
}