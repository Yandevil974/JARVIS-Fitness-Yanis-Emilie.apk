// Narrow aquatic context. Reviewed prescriptions come first; the legacy
// keyword map is kept but stays explicitly unvalidated; everything else is an
// honest gap. No profile, timer or guide is mutated.
export function createPoolMedia({normalize, poolGuides, reviewedTexts = [], providedAnimations = {}}) {
  const reviewed = new Map(reviewedTexts.map(entry => [entry.text, entry]));
  // Cinq guides portent un nom aquatique mais un dessin TERRESTRE (planche sur
  // banc, elastique a sec, poulie, releves de jambes au banc, montee de genou au
  // mur). Decision utilisateur du 23 septembre 2026 : lacune explicite plutot
  // qu'un dessin terrestre a la place d'un exercice aquatique. Les consignes
  // aquatiques du guide restent affichees, seul le dessin est retire.
  const landVisualGuides = new Set(['Gainage au bord (vertical)','Mobilité épaules aquatique',
    'Mobilité hanches / chevilles','Ciseaux au bord','Talons-fesses']);
  // Animations humaines produites pour ces guides (meme famille que les GIF
  // aquatiques existants : vectoriel net, humain realiste, muscles surlignes,
  // bassin au bon niveau, 480 x 262, 2 images 500 ms). Elles sont livrees dans le
  // paquet, donc la lacune explicite ne doit plus s'afficher pour elles.
  const providedGuides = new Map(Object.entries(providedAnimations));
  function reviewedGuide(candidate) {
    if (!candidate) return candidate;
    const provided = providedGuides.get(candidate.t);
    if (provided) return {...candidate, img: provided, providedAnimation: true};
    if (!landVisualGuides.has(candidate.t)) return candidate;
    return {...candidate, img: null, reviewedGap: 'land-visual-not-validated'};
  }
  function guide(name) {
    const text = normalize(name || '');
    if (reviewed.has(name)) return reviewedGuide(poolGuides.find(candidate => candidate.t === reviewed.get(name).guide) || null);
    let found = null, length = 0;
    for (const candidate of poolGuides) for (const keyword of candidate.k) {
      const key = normalize(keyword);
      if (key && text.includes(key) && key.length > length) {
        found = candidate;
        length = key.length;
      }
    }
    return reviewedGuide(found);
  }
  function isPool(step, meta) {
    // A mixed session's current segment overrides its overall activity type,
    // but the block format wins: the pool block prescribed after the weights
    // keeps segment "post" while its component is declared pool.
    if (step.segment != null)
      return step.segment === 'pool' ||
        (meta?.components || []).some(component => component.key === step.segment && component.format === 'pool');
    return meta?.type === 'swim' || meta?.type === 'aqua';
  }
  function resolve(step, meta) {
    if (!isPool(step, meta)) return null;
    const entry = reviewed.get(step.name);
    const match = guide(step.name);
    // Never trust a persisted step.img over the current aquatic association.
    // Deliberately no fallback to cardio or the generic recovery photograph.
    return {guide: match, path: match?.img || null,
      status: entry ? 'reviewed-pool-prescription'
        : match?.img ? 'legacy-association-not-yet-validated'
        : match ? 'reviewed-land-visual-gap' : 'unresolved'};
  }
  return {guide, isPool, resolve, reviewedTexts: reviewed};
}
