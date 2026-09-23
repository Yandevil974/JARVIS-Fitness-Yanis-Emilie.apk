// Display-only resolution. Do not infer an old approach from today's workout.
export function createWarmupMedia({reviewedMedia}) {
  function resolve(step, meta) {
    if (!step || meta?.type !== 'warmup' ||
        !['Échauffement guidé', 'Échauffement spécifique'].includes(meta.name) ||
        (step.segment != null && step.segment !== 'warmup')) return null;
    // Exact legacy generator prescription: this is an unweighted floor bridge,
    // not any exercise containing 'fessiers' or any bridge-family variant.
    if ((step.exerciseId == null || step.exerciseId === 'pont-fessier-au-sol-activation') &&
        step.name === 'Activation fessiers' && step.pattern === 'bridge' &&
        step.seconds === 60 &&
        step.instruction === 'Ponts fessiers au sol, 10 répétitions contrôlées.') {
      return reviewedMedia({id:'pont-fessier-au-sol-activation'});
    }
    // New approaches carry their own identity. No reliance on current workout,
    // image path, approximate name matching, muscle or movement family.
    if (step.mediaRole === 'approach' && /^Approche [123] · /.test(step.name || '') &&
        typeof step.exerciseId === 'string') return reviewedMedia({id:step.exerciseId});
    return null;
  }
  function view(step, meta) {
    const media = resolve(step, meta);
    return media ? {...step, img:media.path} : step;
  }
  return {resolve, view};
}
