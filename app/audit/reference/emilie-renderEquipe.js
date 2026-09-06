function renderEquipe(){
  renderTeamHebdo();
  const p=state.profil;
  const recs=buildRecommendations();
  const rm=moyenneRecup();
  const adh=scoreAdherenceGlobal();
  const pos=programPos(todayKey());
  const phase=pos.phase;
  const c=caloriesCibles();
  const equipe=[
    {ic:'🌸',nom:'Coach principale',role:'Programmation féminine & périodisation',coul:'chip-gold',
      desc:'Responsable des 5 cycles, des 4 séances hebdomadaires et de la progression des charges.',
      avis:p.date? 'Votre cycle actuel : <b>'+esc(phase.titre)+'</b> — '+esc(phase.macro||'')+'. Semaine '+(pos.weekGlobal+1)+'/52. '+(pos.deload?'C\'est une semaine de deload : volume -50 %, cardio léger ou piscine, concentrez-vous sur la technique et la contraction fessière.':'Objectif de la semaine : compléter '+(p.seancesSemaine||4)+' séances en gardant un RIR 2 sur les exercices fessiers — la qualité de contraction prime sur la charge.') : 'Complétez votre bilan pour activer le coaching.'},
    {ic:'🍑',nom:'Spécialiste fessiers',role:'Volume, fréquence & galbe',coul:'chip-gold',
      desc:'Priorité absolue du programme : analyse le volume fessier, la fréquence de stimulation et la qualité du recrutement.',
      avis: (function(){ const sf=signauxFessiers(pos.weekGlobal); const cible = phase.type==='developpement'?18:phase.type==='adaptation'?10:14;
        return 'Cette semaine : <b>'+(sf?sf.setsTotal:0)+' séries</b> de fessiers pour une cible de <b>'+cible+' à '+(cible+6)+'</b>. Grand fessier (hip thrust, soulevé de terre roumain, fentes bulgares) = volume et projection. Moyen fessier (abduction, clamshell) = arrondi latéral et comblement du creux de hanche. <b>'+(sf?sf.setsMoy:0)+' séries</b> de moyen fessier cette semaine (visez 8 à 12). Les quadriceps restent volontairement contenus pour préserver les proportions.'; })()},
    {ic:'🥗',nom:'Nutritionniste',role:'Calories & macronutriments',coul:'chip-blue',
      desc:'Calcule vos besoins, ajuste les phases (surplus, maintien, déficit, recomposition).',
      avis:c? (function(){ const jt=jourTypeDe(todayKey()); const f=FACTEURS_JOUR[jt]; const mJ=macroJour(pos.idx==='F'?13:+pos.idx, jt);
        return 'Aujourd\'hui ('+f.ic+' '+esc(f.n)+') : <b>'+(mJ?mJ.cal:c.cal)+' kcal</b> · '+(mJ?mJ.prot:c.prot)+' g protéines · '+(mJ?mJ.glu:c.glu)+' g glucides · '+(mJ?mJ.lip:c.lip)+' g lipides. Phase conseillée : <b>'+nutriPhaseInfo().n+'</b> — '+esc(strategieAnnuelle()[clamp(pos.idx==='F'?13:+pos.idx,1,13)-1].nom)+'. Dépense de base estimée : '+c.tdee+' kcal (Mifflin-St Jeor féminin, activité ×1,5). Repas détaillé dans l\'onglet 🥗 Repas.'; })() : 'Renseignez votre profil pour le calcul.'},
    {ic:'🧠',nom:'Préparateur mental',role:'Motivation & discipline',coul:'chip-violet',
      desc:'Habitudes, constance, gestion de la fatigue, sommeil, adhérence.',
      avis:'Adhérence aux séances : <b>'+(adh==null?'—':adh+' %')+'</b>. '+(adh>=85?'Votre constance est votre plus grand atout : continuez.':'Rappel : 3 séances par semaine pendant 12 mois = 150+ séances. La régularité bat l\'intensité isolée. Fixez-vous un rituel fixe (mêmes jours, mêmes horaires).')},
    {ic:'🩺',nom:'Référent santé',role:'Prévention & prudence',coul:'chip-red',
      desc:'Recommandations générales de prudence — aucun diagnostic médical.',
      avis:'Rappels : échauffez-vous 5-10 min, respectez les tempos, hydratez-vous. Douleur articulaire aiguë, blessure, fatigue anormale ou malaise → <b>arrêtez et consultez un professionnel de santé</b>. '+(rm!=null&&rm<50?'Votre score de récupération est faible ('+rm+'/100) : une semaine de deload est recommandée.':'')},
    {ic:'🧘',nom:'Expert mobilité',role:'Mobilité, amplitude & prévention',coul:'chip-green',
      desc:'Échauffement, amplitude, retour au calme, prévention des blessures.',
      avis:'Avant chaque séance : 5 min d\'elliptique très facile + mobilité complète (10 rotations par articulation, focus hanches) + <b>activation fessiers obligatoire</b> les jours J1, J3, J4 et J5 + séries d\'approche à 50 % puis 70-80 %. Après : 5-10 min d\'étirements statiques des groupes travaillés. Priorité absolue : <b>mobilité de hanche</b> (fléchisseurs et rotateurs externes) — c\'est elle qui conditionne l\'amplitude du hip thrust et donc le recrutement du grand fessier.'},
    {ic:'🫀',nom:'Préparatrice cardio',role:'Elliptique · piscine · repos actif',coul:'chip-orange',
      desc:'Programme le cardio pour augmenter la dépense énergétique sans nuire à la récupération des fessiers.',
      avis:(function(){ const ci=cardioSemaineInfos(pos.weekGlobal);
        return 'Cette phase : <b>'+esc(phase.metcon)+'</b>. '+ci.faites+' / '+ci.prevues+' séance(s) réalisée(s) cette semaine. <b>Règles :</b> jamais de fractionné la veille d\'une séance fessiers ; cardio modéré (60-70 % FCM = '+Math.round(fcm()*0.6)+'-'+Math.round(fcm()*0.7)+' bpm) en priorité ; <b>piscine</b> les jours de fatigue ou de courbatures ; <b>repos actif</b> (marche 35-45 min) en semaine de deload. Choisissez votre support dans l\'onglet 🚴 Cardio.'; })()},
    {ic:'📊',nom:'Analyste de performance',role:'Données & recommandations',coul:'chip-blue',
      desc:'Analyse vos données (poids, mensurations, charges, récupération) et génère des recommandations.',
      avis: (forceTestDone()? 'Bilan 1RM : <b>'+fmtKg(state.force.valeurs.hipthrust||'—')+' hip thrust</b> · '+fmtKg(state.force.valeurs.rdl||'—')+' SDT roumain</b> · '+fmtKg(state.force.valeurs.squat||'—')+' squat</b> · '+fmtKg(state.force.valeurs.bulgarian||'—')+' bulgarian</b> · '+fmtKg(state.force.valeurs.row||'—')+' rowing</b> · '+(forceReevalDue()?'<b class="warn">réévaluation recommandée</b>':'prochaine rééval. '+fmtDateFr(nextReevalDate()))+'.<br>':'<b>Bilan 1RM non réalisé</b> : recommandé avant le bilan de départ pour personnaliser les charges.<br>') + (buildRecommendations().filter(r=>r.tag!=='Référent santé').slice(0,2).map(r=>'• '+esc(r.txt)).join('<br>')||'Enregistrez vos données régulièrement : pesées, relevés mensuels, charges du journal et check-ins de récupération. Plus vous renseignez, plus les recommandations sont précises.')}
  ];
  $('#team-cards').innerHTML = equipe.map(e=>
    '<div class="team-card"><div class="team-avatar">'+e.ic+'</div><div><h3>'+esc(e.nom)+'</h3><div class="team-role">'+esc(e.role)+'</div></div><div class="team-desc">'+esc(e.desc)+'</div></div>'
  ).join('');
  $('#team-advices').innerHTML = equipe.map(e=>
    '<div class="team-voice"><div class="tv-ic">'+e.ic+'</div><div><b>'+esc(e.nom)+' <span class="chip '+e.coul+'" style="margin-left:6px">'+esc(e.role)+'</span></b><p class="team-advice" style="margin-top:6px">'+e.avis+'</p></div></div>'
  ).join('');
  // consulter un expert → modal
  equipe.forEach((e,i)=>{
    const cards=$$('#team-cards .team-card');
    if(cards[i]) cards[i].style.cursor='pointer', cards[i].onclick=()=>openModal('<h3>'+e.ic+' '+esc(e.nom)+'</h3><span class="chip '+e.coul+'">'+esc(e.role)+'</span><p class="small mut mt">'+esc(e.desc)+'</p><div class="team-advice mt">'+e.avis+'</div>');
  });
}