function genererPlanJour(mois, jourIdx){
  const m = macroJour(mois); if(!m) return null;
  const T = {cal:m.cal, p:m.prot, g:m.glu, l:m.lip};
  const ck = cat => cat==='prot' ? 'p' : (cat==='lip' ? 'l' : 'g');
  const plan=[];
  REPAS_CREUX.forEach((mt, i)=>{
    const cible = {cal:T.cal*mt.pP, p:T.p*mt.pP, g:T.g*mt.pG, l:T.l*mt.pL};
    const options = REPAS_JOURS[mt.nom]||[[]];
    const template = options[(jourIdx||0) % options.length]||[];
    let rows=[];
    let total={cal:0,p:0,g:0,l:0};
    for(const [nom,cat] of template){
      const A = ALIMENTS[nom]; if(!A) continue;
      const key = ck(cat);
      let reste = Math.max(0, cible[key] - total[key]);
      let portion=0;
      if(cat==='leg') portion = reste>0?100:60;
      else if(cat==='fruit') portion = reste>0? Math.min(150, reste/A.g*100) : 0;
      else if(cat==='prot') portion = Math.max(0, Math.round((reste/(A.p/100))/5)*5);
      else if(cat==='glu') portion = Math.max(0, Math.round((reste/(A.g/100))/5)*5);
      else if(cat==='lip') portion = Math.max(0, Math.round((reste/(A.f/100))/5)*5);
      if(portion>0){
        rows.push({nom, qte:portion, unit:'g', cal:A.cal*portion/100, p:A.p*portion/100, g:A.g*portion/100, l:A.l*portion/100});
        total.cal+=A.cal*portion/100; total.p+=A.p*portion/100; total.g+=A.g*portion/100; total.l+=A.l*portion/100;
      }
    }
    plan.push({nom:mt.nom, rows, total:{cal:Math.round(total.cal),p:round1(total.p),g:Math.round(total.g),l:round1(total.l)}});
  });
  const totP = plan.reduce((a,b)=>a+b.total.p,0);
  const facteur = T.p/totP || 1;
  if(facteur>0.75 && facteur<1.35){
    for(const meal of plan){
      meal.rows = meal.rows.map(r=>({...r, qte:Math.round(r.qte*facteur/5)*5}));
      meal.total = {cal:Math.round(meal.total.cal*facteur), p:round1(meal.total.p*facteur), g:Math.round(meal.total.g*facteur), l:round1(meal.total.l*facteur)};
    }
  }
  const final = {cal:Math.round(plan.reduce((a,b)=>a+b.total.cal,0)), p:round1(plan.reduce((a,b)=>a+b.total.p,0)), g:Math.round(plan.reduce((a,b)=>a+b.total.g,0)), l:round1(plan.reduce((a,b)=>a+b.total.l,0))};
  return {plan, final, cible:T};
}