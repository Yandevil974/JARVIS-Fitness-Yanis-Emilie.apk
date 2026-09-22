function recupScore(entry){
  if(!entry) return null;
  const h=clamp(+entry.h||0,0,14);
  const sleep = h>=8.5?10: h>=7.5?8.6: h>=6.5?7:h>=5.5?5:h>=4?3:1;
  const q = +entry.qual||3, fa=+entry.fa||3, st=+entry.str||3, co=+entry.cour||3, mo=+entry.mot||3, en=+entry.en||3;
  const val = sleep*.25 + q*2*.15 + en*2*.20 + (6-fa)*2*.15 + (6-st)*2*.10 + (6-co)*2*.10 + mo*2*.05;
  return clamp(Math.round(val*10),0,100);
}