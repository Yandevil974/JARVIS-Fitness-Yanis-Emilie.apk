// A narrow context boundary, not a semantic validation of the legacy media.
// No profile, timer or guide is mutated. Unknown aquatic steps remain audit gaps.
export function createPoolMedia({normalize, poolGuides}) {
  function guide(name) {
    const text = normalize(name || '');
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
    // A mixed session's current segment overrides its overall activity type.
    if (step.segment != null) return step.segment === 'pool';
    return meta?.type === 'swim' || meta?.type === 'aqua';
  }
  function resolve(step, meta) {
    if (!isPool(step, meta)) return null;
    const match = guide(step.name);
    // Never trust a persisted step.img over the current aquatic association.
    // Deliberately no fallback to cardio or the generic recovery photograph.
    return {guide: match, path: match?.img || null,
      status: match?.img ? 'legacy-association-not-yet-validated' : 'unresolved'};
  }
  return {guide, isPool, resolve};
}
