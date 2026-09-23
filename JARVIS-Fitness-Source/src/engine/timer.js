import { uid, clamp } from "./utils.js";
import { numeric } from "./validation.js";
export function createTimer(steps, meta = {}, now = Date.now()) {
  if (!Array.isArray(steps) || steps.length > 5000)
    throw new Error("Étapes du minuteur invalides.");
  const clean = steps.map((s) => ({
    ...s,
    seconds: numeric(s.seconds, 1, 86400, "Durée d’étape", {
      optional: false,
      integer: true,
    }),
  }));
  if (!clean.length) throw new Error("Aucune étape valide.");
  return {
    id: uid(),
    steps: clean,
    meta,
    index: 0,
    deadline: now + clean[0].seconds * 1000,
    checkpoint: now,
    elapsed: 0,
    segmentElapsed: {},
    remaining: clean[0].seconds,
    paused: false,
    done: false,
    skipped: 0,
  };
}
export function advanceTimer(timer, now = Date.now()) {
  if (!timer || timer.paused || timer.done) return timer;
  const t = { ...timer };
  const elapsed = Math.max(0, (now - t.checkpoint) / 1000);
  const available =
    Math.max(0, (t.deadline - t.checkpoint) / 1000) +
    t.steps.slice(t.index + 1).reduce((s, a) => s + a.seconds, 0);
  let budget = Math.min(elapsed, available);
  const segments = { ...(t.segmentElapsed || {}) };
  for (let i = t.index; i < t.steps.length && budget > 0; i++) {
    const remaining =
      i === t.index
        ? Math.max(0, (t.deadline - t.checkpoint) / 1000)
        : t.steps[i].seconds;
    const spent = Math.min(budget, remaining),
      key = t.steps[i].segment;
    if (key) segments[key] = (segments[key] || 0) + spent;
    budget -= spent;
  }
  t.segmentElapsed = segments;
  t.elapsed += Math.min(elapsed, available);
  t.checkpoint = now;
  while (now >= t.deadline && !t.done) {
    t.index++;
    if (t.index >= t.steps.length) {
      t.done = true;
      t.remaining = 0;
      t.index = t.steps.length - 1;
      break;
    }
    t.deadline += t.steps[t.index].seconds * 1000;
  }
  if (!t.done) t.remaining = Math.max(0, (t.deadline - now) / 1000);
  return t;
}
export function pauseTimer(timer, now = Date.now()) {
  const t = advanceTimer(timer, now);
  if (t.done) return t;
  if (t.paused)
    return {
      ...t,
      paused: false,
      deadline: now + t.remaining * 1000,
      checkpoint: now,
    };
  return { ...t, paused: true, checkpoint: now };
}
export function skipTimer(timer, now = Date.now()) {
  const t = advanceTimer(timer, now);
  if (t.done) return t;
  const i = t.index + 1;
  if (i >= t.steps.length)
    return { ...t, done: true, remaining: 0, skipped: t.skipped + 1 };
  return {
    ...t,
    index: i,
    deadline: now + t.steps[i].seconds * 1000,
    remaining: t.steps[i].seconds,
    checkpoint: now,
    skipped: t.skipped + 1,
  };
}
export function intervalSteps({
  work = 20,
  rest = 10,
  rounds = 8,
  warmup = 120,
  cooldown = 120,
  movements = ["Marche rapide"],
  aqua = false,
} = {}) {
  rounds = numeric(rounds, 1, 64, "Rounds", { optional: false, integer: true });
  work = numeric(work, 1, 3600, "Effort", { optional: false, integer: true });
  rest = numeric(rest, 0, 3600, "Repos", { optional: false, integer: true });
  warmup = numeric(warmup, 0, 3600, "Échauffement", {
    optional: false,
    integer: true,
  });
  cooldown = numeric(cooldown, 0, 3600, "Retour au calme", {
    optional: false,
    integer: true,
  });
  if (!Array.isArray(movements) || !movements.length)
    throw new Error("Choisissez au moins un mouvement.");
  const steps = [];
  if (warmup)
    steps.push({
      name: aqua ? "Marche aquatique douce" : "Échauffement progressif",
      seconds: warmup,
      pattern: aqua ? "swim" : "walk",
      kind: "warmup",
    });
  for (let i = 0; i < rounds; i++) {
    steps.push({
      name: `${movements[i % movements.length]} · ${i + 1}/${rounds}`,
      seconds: work,
      pattern: aqua
        ? "swim"
        : /squat/i.test(movements[i % movements.length])
          ? "squat"
          : "walk",
      kind: "work",
    });
    if (rest > 0 && i < rounds - 1)
      steps.push({
        name: "Récupération",
        seconds: rest,
        pattern: "breathe",
        kind: "rest",
      });
  }
  if (cooldown)
    steps.push({
      name: "Retour au calme",
      seconds: cooldown,
      pattern: "breathe",
      kind: "cooldown",
    });
  return steps;
}

export function extendTimer(timer, seconds = 15, now = Date.now()) {
  const t = advanceTimer(timer, now);
  if (!t || t.done) return t;
  const extra = numeric(seconds, 1, 600, "Prolongation", {
    optional: false,
    integer: true,
  });
  return {
    ...t,
    steps: t.steps.map((s, i) =>
      i === t.index ? { ...s, seconds: s.seconds + extra } : s,
    ),
    remaining: t.remaining + extra,
    deadline: t.deadline + extra * 1000,
  };
}
