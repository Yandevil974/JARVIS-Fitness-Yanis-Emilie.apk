function _cardioSteps(tp, min){
  const tot=min*60;
  const w=Math.max(120,Math.round(tot*0.15/30)*30), c=Math.max(60,Math.round(tot*0.1/30)*30);
  const main=Math.max(60,tot-w-c);
  const steps=[['Échauffement',w]];
  if(tp.id==='endu'||tp.id==='recup'){
    steps.push([(tp.id==='endu'?'Bloc principal — allure facile (parler possible)':'Bloc principal — très facile'),main]);
  } else if(tp.id==='inter'){
    let t=0,i=1;
    while(t<main){ const w1=Math.min(60,main-t); steps.push(['Fractionné '+i+' — soutenu',w1]); t+=w1; if(t<main){ const r1=Math.min(60,main-t); steps.push(['Récup active',r1]); t+=r1; } i++; }
  } else {
    let t=0,i=1;
    while(t<main){ const w1=Math.min(30,main-t); steps.push(['Sprint '+i+' — fort',w1]); t+=w1; if(t<main){ const r1=Math.min(30,main-t); steps.push(['Récup',r1]); t+=r1; } i++; }
  }
  steps.push(['Retour au calme',c]);
  return steps;
}