// Narrow aquatic context. Reviewed prescriptions come first; the legacy
// keyword map is kept but stays explicitly unvalidated; everything else is an
// honest gap. No profile, timer or guide is mutated.
export function createPoolMedia({normalize, poolGuides, reviewedTexts = []}) {
  const reviewed = new Map(reviewedTexts.map(entry => [entry.text, entry]));
  function guide(name) {
    const text = normalize(name || '');
    if (reviewed.has(name)) return poolGuides.find(candidate => candidate.t === reviewed.get(name).guide) || null;
    let found = null, length = 0;
    for (const candidate of poolGuides) for (const keyword of candidate.k) {
      const key = normalize(keyword);
      if (key && text.includes(key) && key.length > length) {
        found = candidate;
        length = key.length;
      }
    }
    return found;
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
        : match?.img ? 'legacy-association-not-yet-validated' : 'unresolved'};
  }
  return {guide, isPool, resolve, reviewedTexts: reviewed};
}
