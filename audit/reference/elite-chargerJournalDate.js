function chargerJournalDate(d){
  const j=state.journal[d]||{exos:[]};
  return j.exos.filter(e=>e.ch!==''&&e.ch!=null);
}