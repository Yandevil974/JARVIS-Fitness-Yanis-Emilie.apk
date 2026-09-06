function genererConseilsHebdo(b, wk){
  const conseils=[];
  // 1) Signaux d'entraînement dérivés du journal (séances, volume, RIR/RPE, records)
  const sg = (wk!=null)? signauxEntrainement(wk) : null;
  if(sg){
    if(sg.prevues>0 && sg.faites===0 && sg.manquees>0){
      conseils.push({ic:'📉',tag:'Coach',txt:'Aucune séance validée cette semaine ('+sg.manquees+'/'+sg.prevues+' non effectuées). Le coach repart plus léger : 3 séances simples cette semaine pour relancer la dynamique.'});
    } else if(sg.prevues>0 && sg.faites===0 && sg.partiellement>0){
      conseils.push({ic:'📋',tag:'Coach',txt:'Séances partiellement renseignées ('+sg.partiellement+'/'+sg.prevues+'). Validez chaque séance pour affiner le suivi et les ajustements.'});
    } else if(sg.prevues>0 && (sg.faites+sg.partiellement) < sg.prevues){
      const reste=sg.prevues-(sg.faites+sg.partiellement);
      conseils.push({ic:'📋',tag:'Coach',txt:'Adhérence : '+(sg.faites+sg.partiellement)+'/'+sg.prevues+' séances. '+(reste>0?'Il reste '+reste+' séance(s) à renseigner (calendrier) pour un suivi précis.':'')});
    }
    if(sg.volTrend!=null && sg.volTrend<-25){
      conseils.push({ic:'📊',tag:'Analyste',txt:'Volume d\'entraînement en baisse ('+Math.round(sg.volTrend)+' % vs semaine précédente) : si c\'est volontaire (deload/récupération), parfait ; sinon, un créneau saute — verrouillez vos horaires.'});
    }
    if(sg.volTrend!=null && sg.volTrend>25 && sg.manquees===0){
      conseils.push({ic:'📈',tag:'Analyste',txt:'Volume en hausse ('+Math.round(sg.volTrend)+' % vs semaine précédente) : bonne progression, surveillez simplement la récupération.'});
    }
    if(sg.rpeMoy!=null && sg.rpeMoy>=9 && sg.faites>0){
      conseils.push({ic:'🛌',tag:'Coach',txt:'Intensité perçue élevée (RPE moyen '+sg.rpeMoy+'/10) : les charges sont à la limite. Prévoyez une semaine plus légère (charges ~85 %) ou un deload anticipé.'});
    }
    if(sg.rirMoy!=null && sg.rirMoy<=0.5 && sg.faites>0){
      conseils.push({ic:'🎯',tag:'Coach',txt:'Séries souvent à l\'échec (RIR moyen '+sg.rirMoy+') : gardez 1-2 répétitions en réserve. Les séries à RIR 1-2 progressent mieux sur 12 mois.'});
    }
    if(sg.rpeMoy!=null && sg.rpeMoy<=6 && sg.faites>=sg.prevues-1 && sg.prevues>0){
      conseils.push({ic:'💪',tag:'Coach',txt:'Intensité perçue faible (RPE moyen '+sg.rpeMoy+'/10) sur toutes les séances : vous pouvez augmenter les charges de +2,5 % la semaine prochaine.'});
    }
    if(sg.prMax!=null){
      conseils.push({ic:'🏆',tag:'Analyste',txt:'Record estimé cette semaine : '+sg.prNom+' '+Math.round(sg.prMax)+' kg (1RM estimé). Bilan 1RM à mettre à jour si supérieur à votre valeur déclarée.'});
    }
  }
  // 2) Signaux déclarés (ressentis hebdomadaires)
  if(b.fatigue>=4) conseils.push({ic:'🛌',tag:'Coach',txt:'Fatigue élevée signalée ('+b.fatigue+'/5) : semaine prochaine, volume réduit d\'environ 20 % et charges à ~80 %. Priorité au sommeil (7 h 30-9 h).'});
  if(b.douleurs>=3) conseils.push({ic:'🩺',tag:'Référent santé',txt:'Douleurs signalées ('+b.douleurs+'/5) : ne forcez pas sur les mouvements douloureux — remplacez-les par des variantes plus sûres. Douleur vive ou persistante → consultez un professionnel de santé.'});
  if(b.energie<=2) conseils.push({ic:'🥗',tag:'Nutritionniste',txt:'Énergie faible ('+b.energie+'/5) : ajoutez 30-50 g de glucides autour des entraînements et hydratez-vous (35 ml/kg/jour).'});
  if(b.motivation<=2) conseils.push({ic:'🧠',tag:'Préparateur mental',txt:'Motivation basse ('+b.motivation+'/5) : réduisez l\'objectif à 3 séances simples cette semaine. Rappelez-vous votre photo Jour 0 — c\'est pour ça que vous avez commencé.'});
  const texte=(b.difficultes||'')+' '+(b.ressentis||'');
  if(/(sommeil|nuit|dors|insomnie)/i.test(texte)) conseils.push({ic:'🌙',tag:'Préparateur mental',txt:'Sommeil perturbé détecté : coucher fixe, pas d\'écran 1 h avant, caféine arrêtée après 14 h.'});
  if(/(stress|boulot|travail|charge|deborde|fatigue mentale)/i.test(texte)) conseils.push({ic:'🧘',tag:'Expert mobilité',txt:'Semaine chargée/stressante : déplacez une séance sur le week-end si nécessaire et ajoutez 10 min de respiration ou de marche le soir.'});
  const rm=moyenneRecup();
  if(rm!=null && rm<60) conseils.push({ic:'📊',tag:'Analyste',txt:'Récupération moyenne de la semaine : '+rm+'/100. Envisagez 1 séance en moins ou remplacez un METCON par une marche active.'});
  if(!conseils.length) conseils.push({ic:'👍',tag:'Coach',txt:'Semaine conforme au plan : on maintient le cap. Poursuivez la montée de charge (+2,5 %) sur les exercices principaux.'});
  return conseils;
}