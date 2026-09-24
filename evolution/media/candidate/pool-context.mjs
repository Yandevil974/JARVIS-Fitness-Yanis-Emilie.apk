// Narrow aquatic context. Reviewed prescriptions come first; the legacy
// keyword map is kept but stays explicitly unvalidated; everything else is an
// honest gap. No profile, timer or guide is mutated.
export function createPoolMedia({normalize, poolGuides, reviewedTexts = [], providedAnimations = {}, providedRecoveries = {}}) {
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
  // Etapes de recuperation et de mise en place : mesurees sans aucun media
  // aquatique (117 « Repos » + 18 « … — en place » sur les 420 etapes). Elles
  // recoivent une animation produite, UNIQUEMENT lorsqu'un contexte piscine est
  // deja etabli : hors piscine, rien ne change. Aucun velo, aucun elliptique,
  // aucune photo generique.
  const recoveryNames = new Map(Object.entries(providedRecoveries.map || {})
    .map(([name, path]) => [normalize(name), {name, path}]));
  const recoverySuffixes = Object.entries(providedRecoveries.suffixes || {})
    .map(([suffix, path]) => [normalize(suffix).trim(), path]);
  function recovery(raw) {
    const text = String(raw || '');
    const exact = recoveryNames.get(normalize(text));
    if (exact) return exact;
    const normalized = normalize(text);
    for (const [suffix, path] of recoverySuffixes)
      if (suffix && normalized.endsWith(suffix)) return {name: text.trim(), path};
    return null;
  }
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
    // Une prescription piscine relue reste prioritaire ; une etape de
    // recuperation ou de mise en place recoit l'animation produite AVANT toute
    // correspondance par mot-cle. Jamais un media de terre, jamais la photo
    // generique, jamais l'image persistee de l'etape.
    const recovered = entry ? null : recovery(step.name);
    return {guide: match, path: recovered ? recovered.path : match?.img || null,
      status: entry ? 'reviewed-pool-prescription'
        : recovered ? 'provided-aquatic-recovery'
        : match?.img ? 'legacy-association-not-yet-validated'
        : match ? 'reviewed-land-visual-gap' : 'unresolved'};
  }
  return {guide, isPool, resolve, reviewedTexts: reviewed};
}
