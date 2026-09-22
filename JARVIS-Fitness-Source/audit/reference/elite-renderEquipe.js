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
    {ic:'🏋️',nom:'Coach principal',role:'Programmation musculaire',coul:'chip-gold',
      desc:'Responsable de la périodisation, des séances et de la progression des charges.',
      avis:p.date? 'Votre cycle actuel : <b>'+esc(phase.titre)+'</b>. Semaine '+(pos.weekGlobal+1)+'/52. '+(pos.deload?'C\'est une semaine de deload : volume -50 %, concentrez-vous sur la technique.':'Objectif de la semaine : compléter '+(p.seancesSemaine||4)+' séances avec un RIR ≤ 1 sur les séries clés.') : 'Complétez votre bilan pour activer le coaching.'},
    {ic:'💪',nom:'Expert hypertrophie',role:'Volume & progression musculaire',coul:'chip-green',
      desc:'Analyse le volume, la fréquence, les exercices et la croissance musculaire.',
      avis: 'Le volume hebdomadaire par groupe est affiché dans l\'onglet Progression (🟢/🟠/🔴). '+(MUSCLES? 'Les groupes prioritaires de ce mois : '+Object.keys(phase.sessions||{}).map(k=>phase.sessions[k].nom).join(' · '):'')+'. Rester dans les zones de volume recommandées maximise l\'hypertrophie sans excès de fatigue.'},
    {ic:'🥗',nom:'Nutritionniste',role:'Calories & macronutriments',coul:'chip-blue',
      desc:'Calcule vos besoins, ajuste les phases (surplus, maintien, déficit, recomposition).',
      avis:c? 'Aujourd\'hui : <b>'+c.cal+' kcal</b> · '+c.prot+' g protéines · '+c.glu+' g glucides · '+c.lip+' g lipides. Phase conseillée : <b>'+nutriPhaseInfo().n+'</b> — '+esc(strategieAnnuelle()[clamp(pos.idx==='F'?13:+pos.idx,1,13)-1].nom)+'. Repas type disponible dans l\'onglet Nutrition.' : 'Renseignez votre profil pour le calcul.'},
    {ic:'🧠',nom:'Préparateur mental',role:'Motivation & discipline',coul:'chip-violet',
      desc:'Habitudes, constance, gestion de la fatigue, sommeil, adhérence.',
      avis:'Adhérence aux séances : <b>'+(adh==null?'—':adh+' %')+'</b>. '+(adh>=85?'Votre constance est votre plus grand atout : continuez.':'Rappel : 3 séances par semaine pendant 12 mois = 150+ séances. La régularité bat l\'intensité isolée. Fixez-vous un rituel fixe (mêmes jours, mêmes horaires).')},
    {ic:'🩺',nom:'Référent santé',role:'Prévention & prudence',coul:'chip-red',
      desc:'Recommandations générales de prudence — aucun diagnostic médical.',
      avis:'Rappels : échauffez-vous 5-10 min, respectez les tempos, hydratez-vous. Douleur articulaire aiguë, blessure, fatigue anormale ou malaise → <b>arrêtez et consultez un professionnel de santé</b>. '+(rm!=null&&rm<50?'Votre score de récupération est faible ('+rm+'/100) : une semaine de deload est recommandée.':'')},
    {ic:'🧘',nom:'Expert mobilité',role:'Mobilité, amplitude & prévention',coul:'chip-green',
      desc:'Échauffement, amplitude, retour au calme, prévention des blessures.',
      avis:'Avant chaque séance : 5 min de cardio léger + mobilité hanches/épaules/chevilles (10 rotations × articulation) + séries d\'approche à 50 % puis 70-80 %. Après : 5-10 min d\'étirements statiques des groupes travaillés. Mobilité ciblée : <b>hanches</b> (squats) et <b>épaules</b> (développés) sont prioritaires cette phase.'},
    {ic:'🫀',nom:'Préparateur cardio',role:'Conditionnement métabolique',coul:'chip-orange',
      desc:'Programme le cardio pour compléter la musculation sans nuire à la récupération.',
      avis:'Cette phase : <b>'+esc(phase.metcon)+'</b>. Réalisez le METCON sur les jours de repos ou 4-6 h après la musculation — jamais immédiatement après, pour préserver les gains. '+(p.seancesSemaine>=5?'Avec 5 séances/semaine, limitez-vous à 1 METCON/semaine.':'2 METCON/semaine recommandés.')},
    {ic:'📊',nom:'Analyste de performance',role:'Données & recommandations',coul:'chip-blue',
      desc:'Analyse vos données (poids, mensurations, charges, récupération) et génère des recommandations.',
      avis: (forceTestDone()? 'Bilan 1RM : <b>'+fmtKg(state.force.valeurs.bench||'—')+' couché</b> · '+fmtKg(state.force.valeurs.squat||'—')+' squat · '+fmtKg(state.force.valeurs.dead||'—')+' SDT · '+(forceReevalDue()?'<b class="warn">réévaluation recommandée</b>':'prochaine rééval. '+fmtDateFr(nextReevalDate()))+'.<br>':'<b>Bilan 1RM non réalisé</b> : recommandé avant le bilan de départ pour personnaliser les charges.<br>') + (buildRecommendations().filter(r=>r.tag!=='Référent santé').slice(0,2).map(r=>'• '+esc(r.txt)).join('<br>')||'Enregistrez vos données régulièrement : pesées, relevés mensuels, charges du journal et check-ins de récupération. Plus vous renseignez, plus les recommandations sont précises.')}
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