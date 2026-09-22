function chargeSuggestion(nom, muscle, reps, pos){
  const r=exo1RMEffectif(nom,muscle);
  if(!r.eff) return null;
  let pct = pctPourReps(reps);
  if(pos && pos.deload) pct = Math.min(pct, 0.68);
  const cap = roundCharge(r.eff*pct); // plafond : 1RM effectif × %
  const last = derniereEntreeExercice(nom);
  let charge = null;
  if(last && last.ch>0){
    const top = hautDeFourchette(reps);
    if(top && last.reps>0){
      if(last.reps >= top) charge = roundCharge(last.ch*1.025);   // cible atteinte → +2,5 %
      else if(last.reps >= top*0.75) charge = roundCharge(last.ch); // proche → même charge
      else charge = roundCharge(last.ch*0.95);                      // loin → −5 %
    } else {
      charge = roundCharge(last.ch);
    }
    // Plafond 1RM : jamais au-delà du 1RM effectif × %, MAIS jamais non plus
    // en dessous de la dernière charge réussie (on ne recule jamais l'utilisateur).
    if(cap!=null){ const capMin=Math.max(cap, roundCharge(last.ch)); if(charge>capMin) charge=capMin; }
  } else {
    charge = cap;
  }
  return {
    charge,
    base: r.base, ratio: r.ratio, perHand: r.perHand,
    pct: Math.round(pct*100),
    exo1RM: r.eff!=null? round1(r.eff):null,
    auto1RM: !!r.usedJournal,
    decl1RM: r.declBase!=null? round1(r.declBase):null,
    fromLast: !!last, lastCharge: last? round1(last.ch):null, lastReps: last? last.reps:null
  };
}