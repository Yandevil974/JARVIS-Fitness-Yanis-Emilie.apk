/** Source blocks are delimited by their prescribed rest: 0 = chain the next movement. */
export function sourceBlocks(exercises) {
  let block = 0;
  return exercises.map((e) => {
    const out = { ...e, blockIndex: e.blockIndex ?? block };
    if (e.rest > 0) block++;
    return out;
  });
}
export function nextWorkoutStep(workout, currentIndex) {
  const exercises = workout.exercises;
  const current = exercises[currentIndex];
  if (!current) return { index: 0, rest: 0 };
  const done = (e) =>
    (e.sets || [])
      .filter((s) => s.completed)
      .reduce((n, s) => n + (s.count || 1), 0);
  const pending = (e) => done(e) < e.targetSets;
  const tagged = exercises.every((e) => e.blockIndex != null)
    ? exercises
    : sourceBlocks(exercises);
  const group = tagged[currentIndex].blockIndex;
  const indices = tagged
    .map((e, i) => (e.blockIndex === group ? i : -1))
    .filter((i) => i >= 0);
  const groupRest = exercises[indices.at(-1)]?.rest || 0;
  if (indices.length > 1) {
    const next = indices.find((i) => i > currentIndex && pending(exercises[i]));
    if (next != null) return { index: next, rest: 0 };
    const repeat = indices.find((i) => pending(exercises[i]));
    if (repeat != null) return { index: repeat, rest: groupRest };
  } else if (pending(current))
    return { index: currentIndex, rest: current.rest || 0 };
  const next = exercises.findIndex((e, i) => i > currentIndex && pending(e));
  const remaining = next >= 0 ? next : exercises.findIndex(pending);
  return {
    index: remaining >= 0 ? remaining : currentIndex,
    rest: indices.length > 1 ? groupRest : current.rest || 0,
  };
}
