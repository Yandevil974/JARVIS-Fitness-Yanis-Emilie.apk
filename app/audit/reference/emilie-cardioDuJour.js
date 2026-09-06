function cardioDuJour(dateStr, wkDay){
  const pos = programPos(dateStr);
  const phase = pos.phase;
  const dispo = state.equip || {};
  const choix = state.cardioChoix && state.cardioChoix[dateStr];
  let format;
  if(choix && CARDIO_TYPES[choix]) format = choix;
  else if(pos.deload) format = dispo.piscine!==false ? 'piscine' : 'repos';
  else format = (wkDay===5 && dispo.piscine!==false) ? 'piscine' : (dispo.elliptique!==false ? 'elliptique' : 'repos');
  const base = CARDIO_TYPES[format];
  let duree, zone, detail;
  if(pos.deload){ duree = format==='piscine'?30:25; zone=0; detail='Semaine de deload : récupération active uniquement (zone 1, 50-60 % FCM). Aucune intensité.'; }
  else if(phase.type==='developpement'){ duree = format==='piscine'?25:20; zone=1; detail='Phase de développement fessier : cardio volontairement réduit et modéré pour préserver la récupération des fessiers.'; }
  else if(phase.type==='composition'){ duree = format==='piscine'?30:28; zone= wkDay===3?2:1; detail='Phase de composition : on augmente la dépense énergétique. Zone 2-3, jamais la veille d\'une séance fessiers.'; }
  else if(phase.type==='maintien'||phase.type==='finale'){ duree = format==='piscine'?30:25; zone=1; detail='Entretien de la condition physique à allure modérée.'; }
  else { duree = format==='piscine'?25:20; zone=1; detail='Cardio modéré : on parle par phrases courtes. Brûle des graisses sans retarder la récupération.'; }
  if(format==='repos'){ duree = 35; zone=0; detail='Marche active 35-45 min, mobilité et étirements. Idéal si la fatigue est élevée ou si les fessiers sont encore courbaturés.'; }
  const z = ZONES_CARDIO[zone];
  return {format, ic:base.ic, nom:base.n, duree, zone, zoneNom:z.n, zonePct:z.pct, detail,
          label: base.ic+' Cardio — '+base.n+' ('+duree+' min)'};
}